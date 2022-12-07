import { reactive, toRef, Ref, watch } from 'vue'
import { useStorage, toReactive, watchDebounced } from '@vueuse/core'
import { sortBy, uniqBy } from 'lodash'
import { wait } from 'lib0/promise'
import * as Y from 'yjs'

import updateComponentData from './updateComponentData'
import fixSpelling from './fixSpelling'
import defaultNewTab from './content/_newtab.md?raw'
import defaultWelcome from './content/_welcome.md?raw'
import defaultSettings from './content/_settings.md?raw'
import sandboxExample from './content/sandbox-example.md?raw'
import notesExample from './content/notes-example.md?raw'
import requestExample from './content/request-example.md?raw'
import { NotebookContentInfo } from '@/components/data/NotebookContent'
import { PermissionSpec } from '@/components/data/Permissions'

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
  ydoc: Y.Doc
  ydocCreated?: number
  clients: {
    [key: string]: {
      ydocCreated?: number
    }
  }
}

export interface NotebookContent {
  files: {[key: string]: NotebookFileInfo}
}

export interface NotebookView {
  left: TabState,
  right: TabState
}

interface NotebookConfig {
  prefix: string
  docDiscoverWait: number
  docTransferWait: number
  docDeleteWait: number
}

const notebookDefaults: NotebookConfig = {
  prefix: '.notebook',
  docDiscoverWait: 50,
  docTransferWait: 500,
  docDeleteWait: 25
}

export class Notebook {
  prefix: string
  docDiscoverWait: number
  docTransferWait: number
  docDeleteWait: number

  fileData: {[key: string]: FileData} = {}
  content: NotebookContent
  savedView: Ref<NotebookView>
  view: NotebookView
  permissions: Ref<PermissionSpec>
  channel: BroadcastChannel
  clientId: string

  constructor(config: Partial<NotebookConfig> = {}) {
    this.clientId = randomClientId()
    const fullConfig = {...notebookDefaults, config}
    this.prefix = fullConfig.prefix
    this.docDiscoverWait = fullConfig.docDiscoverWait
    this.docTransferWait = fullConfig.docTransferWait
    this.docDeleteWait = fullConfig.docDeleteWait
    const defaultContent: NotebookContent = {
      files: {
        "_newtab.md": {
          "emoji": "🗂",
          "title": "New Tab",
        },
        "_welcome.md": {
          "emoji": "👋",
          "title": "Welcome",
        },
        "_settings.md": {
          "emoji": "⚙️",
          "title": "Settings",
        },
        "notes-example.md": {
          "emoji": "🗒",
          "title": "Notes Example",
          "primaryComponent": "edit",
        },
        "sandbox-example.md": {
          "emoji": "🏝",
          "title": "Sandbox Example",
          "primaryComponent": "edit",
        },
        "request-example.md": {
          "emoji": "🌐",
          "title": "Request Example",
          "primaryComponent": "edit",
        },
      }
    }
    const defaultView: NotebookView = {
      "left": {
        "tabs": ["notes-example.md", "sandbox-example.md", "request-example.md"],
        "selected": "notes-example.md",
        "lastSelected": null,
        "show": "self",
      },
      "right": {
        "tabs": ["_welcome.md"],
        "selected": "_welcome.md",
        "lastSelected": null,
        "show": "self",
      },
    }
    const defaultPermissions = {permissions: []}
    if (this.prefix === notebookDefaults.prefix && (localStorage.getItem(`.notebook/_content.json`) || '').trim() === '') {
      const haveOldData = [1, 2, 3, 4, 5].some(i => (localStorage.getItem(`doc-${i}`) || '').trim().length > 0)
      if (haveOldData) {
        this.migrateOldData(defaultContent, defaultView)
      }
    }
    this.content = toReactive(useStorage(`${this.prefix}/_content.json`, defaultContent))
    this.savedView = useStorage(`${this.prefix}/_view.json`, defaultView)
    this.view = toReactive(useStorage(`${this.prefix}/_view.json`, this.savedView.value, sessionStorage))
    this.permissions = useStorage(`${this.prefix}/_permissions.json`, defaultPermissions)
    watchDebounced(this.view, () => this.savedView.value = this.view, {debounce: 200, maxWait: 500})
    this.channel = new BroadcastChannel(this.prefix)
    this.channel.onmessage = this.handleMessage.bind(this)
  }

  handleMessage(e: MessageEvent) {
    const [messageType, message] = e.data
    if (messageType === 'opened-file') {
      const {name, clientId} = message
      if (clientId !== this.clientId) {
        const file = this.getFile(name)
        if (file.ydocCreated !== undefined) {
          const info = {name, created: file.ydocCreated, clientId: this.clientId}
          this.channel.postMessage(['have-ydoc', info])
          this.channel.postMessage(['ydoc', {...info, update: Y.encodeStateAsUpdate(file.ydoc)}])
        }
      }
    } else if (messageType === 'have-ydoc') {
      const {name, created, clientId} = message
      if (clientId !== this.clientId) {
        const file = this.getFile(name)
        file.clients[clientId] = {ydocCreated: created}
      }
    } else if (messageType === 'ydoc') {
      const {name, created, clientId, update} = message
      const file = this.getFile(name)
      if (file !== undefined && clientId !== this.clientId && (file.ydocCreated === undefined || created > file.ydocCreated)) {
        const ydoc = new Y.Doc()
        Y.applyUpdate(ydoc, update, `client:${clientId}`)
        file.ydoc.destroy()
        file.ydoc = ydoc
        file.ydocCreated = created
        file.clients[this.clientId].ydocCreated = created
        file.ydoc.on('update', (update: Uint8Array, origin: string | null) => {
          if (!origin?.startsWith('client:')) {
            this.channel.postMessage(['update', {name, update, clientId: this.clientId, created: file.ydocCreated}])
          }
        })
      }
    } else if (messageType === 'update') {
      const {name, created, clientId, update} = message
      const file = this.getFile(name)
      if (file !== undefined && clientId !== this.clientId && created === file.ydocCreated) {
        Y.applyUpdate(file.ydoc, update, `client:${clientId}`)
      }
    } else if (messageType === 'file-deleted') {
      const {name, clientId} = message
      if (clientId !== this.clientId) {
        this.closeFile(name)
      }
    } else if (messageType === 'file-renamed') {
      const {name, rename, clientId} = message
      if (clientId !== this.clientId) {
        this.renameFileInView(name, rename)
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
      const ydoc = new Y.Doc()
      const ytext = ydoc.getText('text')
      ytext.insert(0, body.value)
      this.fileData[name] = reactive({body, ydoc, clients: {[this.clientId]: {}}})
      this.loadYdoc(name)
    }
    return this.fileData[name]
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

  async loadYdoc(name: string) {
    const file = this.fileData[name]
    if (file !== undefined) {
      this.channel.postMessage(['opened-file', {name, clientId: this.clientId}])
      await wait(this.docDiscoverWait)
      const clients = sortBy(
        Object.entries(file.clients).filter(([clientId, client]) => clientId !== this.clientId && client.ydocCreated !== undefined),
        ([clientId, client]) => client.ydocCreated
      )
      if (clients.length > 1) {
        if (uniqBy(clients, ([clientId, client]) => client.ydocCreated).length > 1) {
          console.warn('Some clients are not on the same document version')
        }
        await wait(this.docDiscoverWait)
      }
    }
    if (file.ydocCreated === undefined) {
      file.ydocCreated = Date.now()
    }
  }

  deleteFile(name: string) {
    if (name in this.fileData) {
      const file = this.fileData[name]
      file.ydoc.destroy()
      delete this.fileData[name]
      localStorage.removeItem(`${this.prefix}/${name}`)
      this.channel.postMessage(['file-deleted', {clientId: this.clientId, name}])
    }
  }

  renameFile(name: string, rename: string) {
    this.channel.postMessage(['file-renamed', {clientId: this.clientId, name, rename}])
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
    {content, view, permissions}:
    {content?: true, view?: true, permissions?: true}
    = {content: true, view: true, permissions: true}
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
    if (permissions) {
      updateComponentData(settingsText, 'Permissions', this.permissions.value)
    }
    fixSpelling(settingsText)
  }

  async applyContentChanges({data, deletes}: {data: NotebookContentInfo, deletes: string[]}) {
    for (const del of deletes) {
      this.closeFile(del)
      delete this.content.files[del]
      this.deleteFile(del)
    }
    if (deletes.length > 0) {
      await wait(this.docDeleteWait)
    }
    for (const [name, file] of Object.entries(data.files)) {
      if (typeof file.rename === 'string') {
        const rename = file.rename
        if (rename === name) {
          console.error('ERROR: trying to rename to the same name; skipping')
          continue
        }
        const newFile = this.getFile(rename)
        const oldFile = this.getFile(name)
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

  migrateOldData(content: NotebookContent, view: NotebookView) {
    let number = 1;
    const newKeys: string[] = []
    for (const i of [1, 2, 3, 4, 5]) {
      const oldKey = `doc-${i}`
      const savedData = (localStorage.getItem(oldKey) || '').trim()
      if (savedData.length > 0) {
        const newKey = `untitled-${number}.md`
        const data = (
          (
            oldKey === 'doc-5' ?
            'NOTE: This was previously called the Settings page.\n' +
            'It has been moved to this page to make room for the new settings page.\n\n---\n' : ''
          ) + (localStorage.getItem(oldKey) || '')
        )
        this.getFile(
          `${this.prefix}/${newKey}`, data
        )
        localStorage.removeItem(oldKey)
        content.files[newKey] = {
          emoji: '📝',
          title: `Untitled ${number}`
        }
        newKeys.push(newKey)
        number++;
      }
    }
    const divide = Math.ceil(newKeys.length / 2)
    view.left.tabs = [...view.left.tabs, ...newKeys.slice(0, divide)]
    view.right.tabs = [...view.right.tabs, ...newKeys.slice(divide)]
  }
}

export const notebook = new Notebook()