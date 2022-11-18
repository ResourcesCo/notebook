import { reactive, Ref } from 'vue'
import { nanoid } from 'nanoid'
import { useStorage } from '@vueuse/core'

export interface Page {
  id: string
  key: string
  title: string
  emoji: string
  body: string
  isSettings?: true
}

export type PageCollection = { [key: string]: Page }

export interface TabState {
  tabs: string[]
  selected: string
  lastSelected: string | undefined
  mode: "edit" | "view"
  settingsOn: boolean
}

const ids = [nanoid(7), nanoid(7), nanoid(7), nanoid(7), nanoid(7)]

const pageBody1: Ref<string> = useStorage('doc-1', '')
const pageBody2: Ref<string> = useStorage('doc-2', '')
const pageBody3: Ref<string> = useStorage('doc-3', '')
const pageBody4: Ref<string> = useStorage('doc-4', '')
const pageBody5: Ref<string> = useStorage('doc-5', '')

const page1 = reactive({
  id: ids[0],
  key: "doc-1",
  title: "Untitled 1",
  emoji: "📝",
  body: pageBody1,
})
const page2 = reactive({
  id: ids[1],
  key: "doc-2",
  title: "Untitled 2",
  emoji: "📝",
  body: pageBody2,
})
const page3 = reactive({
  id: ids[2],
  key: "doc-3",
  title: "Untitled 3",
  emoji: "📝",
  body: pageBody3,
})
const page4 = reactive({
  id: ids[3],
  key: "doc-4",
  title: "Untitled 4",
  emoji: "📝",
  body: pageBody4,
})
const page5 = reactive({
  id: ids[4],
  key: "doc-5",
  title: "Settings",
  emoji: "⚙️",
  body: pageBody5,
  isSettings: true,
})

export const pages = reactive<PageCollection>({
  [ids[0]]: page1,
  [ids[1]]: page2,
  [ids[2]]: page3,
  [ids[3]]: page4,
  [ids[4]]: page5,
})

const tabs = [...Object.keys(pages).slice(0, 2), Object.keys(pages)[4]]
export const tabState = reactive<TabState>({
  tabs,
  selected: tabs[0],
  lastSelected: undefined,
  mode: 'edit',
  settingsOn: false,
})

const rightTabs = Object.keys(pages).slice(2, 4)
export const rightTabState = reactive<TabState>({
  tabs: rightTabs,
  selected: rightTabs[0],
  lastSelected: undefined,
  mode: 'view',
  settingsOn: false,
})