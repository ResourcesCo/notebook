import { reactive, toRef, Ref } from 'vue'
import { useStorage, toReactive, watchDebounced } from '@vueuse/core'
import updateComponentData from './updateComponentData'
import defaultNewTab from './content/_newtab.md?raw'
import defaultWelcome from './content/_welcome.md?raw'
import defaultSettings from './content/_settings.md?raw'
import { NotebookContentInfo } from '~/components/data/NotebookContent'
import { sortBy } from 'lodash'

const defaultFileData: {[key: string]: string} = {
  '_newtab.md': defaultNewTab,
  '_welcome.md': defaultWelcome,
  '_settings.md': defaultSettings,
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
}

export interface NotebookContent {
  files: {[key: string]: NotebookFileInfo}
}

export interface NotebookView {
  left: TabState,
  right: TabState
}

export class Notebook {
  prefix: string
  fileData: {[key: string]: Ref<string>} = {}
  content: NotebookContent
  savedView: Ref<NotebookView>
  view: NotebookView

  constructor(prefix: string | undefined = undefined) {
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
      }
    }
    const defaultView: NotebookView = {
      "left": {
        "tabs": ["_newtab.md"],
        "selected": "_newtab.md",
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
    this.prefix = prefix || '.notebook'
    if (prefix === undefined && (localStorage.getItem(`.notebook/_content.json`) || '').trim() === '') {
      const haveOldData = [1, 2, 3, 4, 5].some(i => (localStorage.getItem(`doc-${i}`) || '').trim().length > 0)
      if (haveOldData) {
        this.migrateOldData(defaultContent, defaultView)
      }
    }
    this.content = toReactive(useStorage(`${this.prefix}/_content.json`, defaultContent))
    this.savedView = useStorage(`${this.prefix}/_view.json`, defaultView)
    this.view = toReactive(useStorage(`${this.prefix}/_view.json`, this.savedView.value, sessionStorage))
    watchDebounced(this.view, () => this.savedView.value = this.view, {debounce: 200, maxWait: 500})
  }

  getFile(name: string) {
    if (!(name in this.fileData)) {
      this.fileData[name] = useStorage(
        `${this.prefix}/${name}`,
        defaultFileData[name] ?? '',
        undefined,
        {writeDefaults: false}
      )
    }
    return this.fileData[name]
  }

  resetSettings({content, view}: {content?: true, view?: true} = {content: true, view: true}) {
    const settingsRef = this.getFile('_settings.md')
    let data = settingsRef.value
    if (content) {
      const c = JSON.parse(JSON.stringify(this.content)) as NotebookContent
      const sortedFiles = sortBy(Object.entries(c.files), ([k, v]) => ([k.startsWith('_') ? 0 : 1, v.title]))
      data = updateComponentData(data, 'NotebookContent', {...c, files: Object.fromEntries(sortedFiles)})
    }
    if (view) {
      data = updateComponentData(data, 'NotebookView', this.view)
    }
    settingsRef.value = data
  }

  applyContentChanges({data, deletes}: {data: NotebookContentInfo, deletes: string[]}) {
    for (const del of deletes) {
      for (const tabState of [this.view.left, this.view.right]) {
        if (tabState.tabs.includes(del)) {
          const tabs = tabState.tabs.filter(s => s != del)
          if (tabs.length === 0) {
            tabs.push('_newtab.md')
          }
          if (tabState.selected === del) {
            tabState.selected = tabs[0]
          }
          if (tabState.lastSelected === del) {
            tabState.lastSelected = tabs[0]
          }
          tabState.tabs = tabs
        }
      }
      delete this.content.files[del]
      delete this.fileData[del]
      localStorage.removeItem(`${this.prefix}/${del}`)
    }
    for (const [name, file] of Object.entries(data.files)) {
      if (typeof file.rename === 'string') {
        const rename = file.rename
        const newFile = this.getFile(rename)
        const oldFile = this.getFile(name)
        newFile.value = oldFile.value
        this.content.files[file.rename] = {title: file.title, emoji: file.emoji}
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
        delete this.content.files[name]
        localStorage.removeItem(`${this.prefix}/${name}`)
      } else if (!file.delete && this.content.files[name]) {
        this.content.files[name].emoji = file.emoji
        this.content.files[name].title = file.title
      } else if (!file.delete) {
        this.content.files[name] = {
          emoji: file.emoji,
          title: file.title,
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
        this.fileData[newKey] = useStorage(
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