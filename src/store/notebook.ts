import { reactive, Ref } from 'vue'
import { useStorage, toReactive } from '@vueuse/core'
import defaultNewTab from './content/_newtab.md?raw'
import defaultWelcome from './content/_welcome.md?raw'
import defaultSettings from './content/_settings.md?raw'

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
  fileData: {[key: string]: Ref<string>} = reactive({})
  content: NotebookContent
  view: NotebookView

  constructor(prefix: string | undefined = undefined) {
    const defaultContent: NotebookContent = {
      files: {
        "_newtab.md": {
          "emoji": "🗂",
          "title": "New Tab"
        },
        "_welcome.md": {
          "emoji": "👋",
          "title": "Welcome"
        },
        "_settings.md": {
          "emoji": "⚙️",
          "title": "Settings"
        }
      }
    }
    const defaultView: NotebookView = {
      "left": {
        "tabs": ["_newtab.md"],
        "selected": "_newtab.md",
        "lastSelected": null,
        "show": "self"
      },
      "right": {
        "tabs": ["_welcome.md"],
        "selected": "_welcome.md",
        "lastSelected": null,
        "show": "self"
      }
    }
    this.prefix = prefix || '/.notebook'
    if (prefix === undefined && localStorage.getItem(`.notebook`) === null) {
      const haveOldData = [1, 2, 3, 4, 5].some(i => localStorage.getItem(`doc-${i}`) !== null)
      if (haveOldData) {
        this.migrateOldData(defaultContent, defaultView)
      }
    }
    this.content = toReactive(useStorage(`${this.prefix}/_content.json`, defaultContent))
    this.view = toReactive(useStorage(`${this.prefix}/_view.json`, defaultView))
    for (const name of Object.keys(this.content.files)) {
      this.fileData[name] = useStorage(
        `${this.prefix}/${name}`,
        defaultFileData[name] ?? '',
        undefined,
        {writeDefaults: false}
      )
    }
  }

  migrateOldData(content: NotebookContent, view: NotebookView) {
    for (const i of [1, 2, 3, 4, 5]) {
      const oldKey = `doc-${i}`
      const newKey = `doc-${i}.md`
      const data = (
        (
          i === 5 ?
          'NOTE: This was previously called the Settings page.\n' +
          'It has been moved to Untitled 5 to make room for the new settings page.\n\n---\n' : ''
        ) + (localStorage.getItem(oldKey) || '')
      )
      this.fileData[newKey] = useStorage(
        `${this.prefix}/${newKey}`, data
      )
      localStorage.removeItem(oldKey)
      content.files[newKey] = {
        emoji: '📝',
        title: `Untitled ${i}`
      }
      view[i <= 2 ? 'left' : 'right'].tabs.push(newKey)
    }
  }
}

export const notebook = new Notebook()