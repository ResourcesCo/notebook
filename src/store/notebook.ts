import { reactive, Ref, onMounted, onUnmounted, watch, WatchStopHandle } from 'vue'
import { useStorage, toReactive, watchDebounced, useEventListener, useBroadcastChannel, UseBroadcastChannelReturn } from '@vueuse/core'
import { sortBy } from 'lodash'
import * as Y from 'yjs'
import { toBase64, fromBase64 } from 'lib0/buffer'

import updateComponentData from './updateComponentData'
import defaultNewTab from './content/_newtab.md?raw'
import defaultWelcome from './content/_welcome.md?raw'
import defaultSettings from './content/_settings.md?raw'
import sandboxExample from './content/sandbox-example.md?raw'
import notesExample from './content/notes-example.md?raw'
import requestExample from './content/request-example.md?raw'
import { NotebookContentInfo } from '@/components/data/NotebookContent'
import { ContainerConfig } from '@/components/data/Containers'
import { EnvironmentConfig } from '@/components/data/Environment'
import { SettingsStore } from './settings'
import { FrameStore } from './frame'
import { defaultContent, defaultView } from './content/data'

function randomClientId() {
  const array = new Uint32Array(2)
  crypto.getRandomValues(array)
  return [...array].map(i => i.toString(16)).join('')
}

const defaultFileData: {[key: string]: string} = {
  '_newtab.md': defaultNewTab,
  '_welcome.md': defaultWelcome,
  '_settings.md': defaultSettings,
  'sandbox-example.md': sandboxExample,
  'notes-example.md': notesExample,
  'request-example.md': requestExample,
}

export interface TabState {
  tabs: string[]
  selected: string | null
  lastSelected: string | null
  show: "self" | "other"
}

export interface NotebookFileInfo {
  title: string
  emoji: string
  primaryComponent?: "view" | "edit"
}

export interface FileData {
  body: string
  lastUpdated: number | undefined
  ydoc: Y.Doc
  ydocStore: string[]
}

export interface NotebookContent {
  files: {[key: string]: NotebookFileInfo}
}

export interface NotebookView {
  left: TabState,
  right: TabState
}

interface UpdateMessage {
  filename: string,
  update: Uint8Array,
  transactionOrigin: any,
}

interface NotebookConfig {
  prefix: string
}

const notebookDefaults: NotebookConfig = {
  prefix: '.notebook',
}

export class Notebook {
  prefix: string

  fileData: {[key: string]: FileData} = {}
  content: NotebookContent
  savedView: Ref<NotebookView>
  view: NotebookView
  containers: Ref<ContainerConfig>
  environment: Ref<EnvironmentConfig>
  clientId: string
  frameStore: FrameStore
  settingsStore: SettingsStore
  viewWatchStop?: WatchStopHandle
  broadcastChannel?: UseBroadcastChannelReturn<UpdateMessage, UpdateMessage>
  broadcastChannelWatchStop?: WatchStopHandle

  constructor(config: Partial<NotebookConfig> = {}) {
    this.clientId = randomClientId()
    const fullConfig = {...notebookDefaults, config}
    this.prefix = fullConfig.prefix
    const defaultContainerConfig = {containers: {}}
    const defaultEnvironmentConfig = {}
    this.content = toReactive(useStorage(`${this.prefix}/_content.json`, defaultContent))
    this.savedView = useStorage(`${this.prefix}/_view.json`, defaultView)
    this.view = toReactive(useStorage(`${this.prefix}/_view.json`, this.savedView.value, sessionStorage))
    this.containers = useStorage(`${this.prefix}/_containers.json`, defaultContainerConfig)
    this.environment = useStorage(`${this.prefix}/_environment.json`, defaultEnvironmentConfig)
    this.settingsStore = new SettingsStore(this)
    this.frameStore = new FrameStore()
    this.broadcastChannel = useBroadcastChannel<UpdateMessage, UpdateMessage>({name: this.prefix})
    this.broadcastChannelWatchStop = watch(this.broadcastChannel.data, (update) => {
      this.applyFileUpdate(update.filename, update.update, update.transactionOrigin, false)
    })
  }

  init() {
    this.frameStore.loadModules()
    this.viewWatchStop = watchDebounced(this.view, () => this.savedView.value = this.view, {debounce: 200, maxWait: 500})
  }

  cleanup() {
    this.frameStore.unloadModules()
    for (const watchStop of [this.viewWatchStop, this.broadcastChannelWatchStop]) {
      if (watchStop !== undefined) {
        watchStop()
      }  
    }
  }

  getFile(name: string, defaultContent?: string) {
    if (!(name in this.fileData)) {
      const body = useStorage(
        `${this.prefix}/${name}`,
        defaultContent ?? defaultFileData[name] ?? '',
        undefined,
        {writeDefaults: false}
      )
      const ydocStore = useStorage<string[]>(
        `${this.prefix}/.doc/${name}`,
        [],
        undefined,
        {writeDefaults: false}
      )
      const ydoc = new Y.Doc()
      ydoc.on('update', (update, origin) => {
        if (origin !== this) {
          ydocStore.value.push(toBase64(update))
        }
      })
      if (ydocStore.value.length > 0) {
        Y.transact(ydoc, () => {
          for (const update of ydocStore.value) {
            Y.applyUpdate(ydoc, fromBase64(update))
          }
        }, this, false)
      } else {
        const ytext = ydoc.getText('text')
        ytext.insert(0, body.value)
      }
      const fileData = reactive({body, ydoc, ydocStore, lastUpdated: undefined})
      this.fileData[name] = fileData
    }
    return this.fileData[name]
  }

  applyFileUpdate(filename: string, update: Uint8Array, transactionOrigin: any, broadcast = true) {
    const file = this.fileData[filename]
    if (file !== undefined) {
      Y.applyUpdate(file.ydoc, update, transactionOrigin)
      const text = file.ydoc.getText('text').toString()
      file.body = text.length >= 50_000 ? text.substring(0, 50_000) : text
      file.lastUpdated = Date.now()
      if (broadcast && this.broadcastChannel) {
        this.broadcastChannel.post({filename, update, transactionOrigin: `b-${this.clientId}`})
      }
    }
  }

  closeFile(name: string) {
    for (const tabState of [this.view.left, this.view.right]) {
      if (tabState.tabs.includes(name)) {
        const tabs = tabState.tabs.filter(s => s != name)
        if (tabs.length === 0) {
          tabs.push('_newtab.md')
        }
        if (tabState.selected === name) {
          tabState.selected = tabs[0]
        }
        if (tabState.lastSelected === name) {
          tabState.lastSelected = tabs[0]
        }
        tabState.tabs = tabs
      }
    }
  }

  deleteFile(name: string) {
    if (name in this.fileData) {
      const file = this.fileData[name]
      file.ydoc.destroy()
      delete this.fileData[name]
      localStorage.removeItem(`${this.prefix}/${name}`)
    }
  }

  renameFile(name: string, rename: string) {
    this.renameFileInView(name, rename)
  }

  renameFileInView(name: string, rename: string) {
    for (const tabState of [this.view.left, this.view.right]) {
      if (tabState.tabs.includes(name)) {
        tabState.tabs = tabState.tabs.map(v => v === name ? rename : v)
        if (tabState.selected === name) {
          tabState.selected = rename
        }
        if (tabState.lastSelected === name) {
          tabState.lastSelected = rename
        }
      }
    }
  }

  resetSettings(
    {content, view, containers, environment}:
    {content?: true, view?: true, containers?: true, environment?: true}
    = {content: true, view: true, containers: true, environment: true}
  ) {
    const settingsDoc = this.getFile('_settings.md').ydoc
    const settingsText = settingsDoc.getText('text')
    if (content) {
      const c = JSON.parse(JSON.stringify(this.content)) as NotebookContent
      const sortedFiles = sortBy(Object.entries(c.files), ([k, v]) => ([k.startsWith('_') ? 0 : 1, v.title]))
      const content = {...c, files: Object.fromEntries(sortedFiles)}
      updateComponentData(settingsText, 'NotebookContent', content)
    }
    if (view) {
      updateComponentData(settingsText, 'NotebookView', this.view)
    }
    if (containers) {
      updateComponentData(settingsText, 'Containers', this.containers.value)
    }
    if (environment) {
      updateComponentData(settingsText, 'Environment', this.environment.value)
    }
  }

  async applyContentChanges({data, deletes}: {data: NotebookContentInfo, deletes: string[]}) {
    for (const del of deletes) {
      this.closeFile(del)
      delete this.content.files[del]
      this.deleteFile(del)
    }
    for (const [name, file] of Object.entries(data.files)) {
      if (typeof file.rename === 'string') {
        const rename = file.rename
        if (rename === name) {
          console.error('ERROR: trying to rename to the same name; skipping')
          continue
        }
        const oldFile = this.getFile(name)
        const newFile = this.getFile(rename, oldFile.body)
        newFile.body = oldFile.body
        this.content.files[rename] = {title: file.title, emoji: file.emoji, primaryComponent: file.primaryComponent}
        this.renameFile(name, rename)
        delete this.content.files[name]
        this.deleteFile(name)
      } else if (!file.delete && this.content.files[name]) {
        this.content.files[name].emoji = file.emoji
        this.content.files[name].title = file.title
        this.content.files[name].primaryComponent = file.primaryComponent
      } else if (!file.delete) {
        this.content.files[name] = {
          emoji: file.emoji,
          title: file.title,
          primaryComponent: file.primaryComponent,
        }
      }
    }
  }

  applyViewChanges(view: NotebookView) {
    this.view.left.tabs = [...view.left.tabs]
    this.view.right.tabs = [...view.right.tabs]
    this.view.left.selected = view.left.selected
    this.view.right.selected = view.right.selected
    this.view.left.show = view.left.show
    this.view.right.show = view.right.show
    this.view.left.lastSelected = view.left.lastSelected
    this.view.right.lastSelected = view.right.lastSelected
  }

  applyContainerChanges(containers: ContainerConfig) {
    this.containers.value = containers
  }

  applyEnvironmentChanges(environment: EnvironmentConfig) {
    this.environment.value = environment
  }

  navigate(url: string) {
    const urlObj = new URL(url, 'http://example.com/')
    const {pathname, hash} = urlObj
    const path = pathname.substring(1)
    for (const side of [this.view.left, this.view.right]) {
      if (side.tabs.includes(path)) {
        side.selected = path
        side.show = 'self'
      }
    }
  }

  onWindowFocus() {
    for (const file of Object.values(this.fileData)) {
      // TODO: save the last saved time in memory and in localStorage, and if the one in
      // localStorage is newer, replace the one in memory with the one in localStorage
      // versioning is needed and so is saving Yjs updates
      // const ytext = ydoc.getText('text')
      // ytext.insert(0, body.value)
      // this.fileData[name] = reactive({body, ydoc})
    }
  }
}

export function useNotebook(): Notebook {
  const notebook = new Notebook()
  useEventListener(window, 'focus', () => notebook.onWindowFocus())
  onMounted(() => {
    notebook.init()
  })
  onUnmounted(() => {
    notebook.cleanup()
  })
  return notebook
}