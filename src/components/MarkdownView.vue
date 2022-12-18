<script lang="ts" setup>
import { PropType, ref, toRef, watch } from "vue"
import MarkdownIt from "markdown-it"
import hljs from "highlight.js/lib/core"
import markdown from "highlight.js/lib/languages/markdown"
import xml from "highlight.js/lib/languages/xml"
import css from "highlight.js/lib/languages/css"
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import json from "highlight.js/lib/languages/json"
import ComponentManager from "./markdown/ComponentManager"
import LiveCheckboxes from "./markdown/LiveCheckboxes"
import LocalStorageTools from "./data/LocalStorageTools"
import NotebookContent, { NotebookContentInfo, validate as validateNotebookContent } from './data/NotebookContent'
import NotebookView, { NotebookViewType, validate as validateNotebookView } from './data/NotebookView'
import Sandbox from "./data/Sandbox"
import parseJson from '../utils/parseJson'
import SettingsClient from '../store/SettingsClient'
// @ts-ignore
import highlight from "markdown-it-highlightjs/core"
// @ts-ignore
import taskLists from 'markdown-it-task-list-plus'
import { useEventListener } from "@vueuse/core"
import * as Y from 'yjs'
import Request from './data/Request'
import Data from './data/Data'
import RequestClient from "./data/Request/RequestClient"
import { Containers, ContainerConfig } from "./data/Containers"
import { Environment, EnvironmentConfig } from "./data/Environment"

hljs.registerLanguage("xml", xml)
hljs.registerLanguage("css", css)
hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("json", json)
hljs.registerLanguage("markdown", markdown)

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  yDoc: {
    type: Object as PropType<Y.Doc>,
    required: true,
  },
  yText: {
    type: Object as PropType<Y.Text>,
    required: true,
  },
  settings: {
    type: Object as PropType<SettingsClient>,
  },
  client: {
    type: Object as PropType<RequestClient>,
    required: true,
  },
})

const components = {
  NotebookContent,
  NotebookView,
  Containers,
  Environment,
  LocalStorageTools,
  Sandbox,
  request: Request,
  data: Data
} as const

type Block =
  {html: string} |
  {tag: 'NotebookContent', data: NotebookContentInfo, settings: SettingsClient } |
  {tag: 'NotebookView', data: NotebookViewType, settings: SettingsClient } |
  {tag: 'Containers', data: ContainerConfig, settings: SettingsClient } |
  {tag: 'Environment', data: EnvironmentConfig, settings: SettingsClient } |
  {tag: 'LocalStorageTools', settings: SettingsClient} |
  {tag: 'Sandbox', data: string, info?: string} |
  {tag: 'request', data: string, client: RequestClient} |
  {tag: 'data', data: string, info?: string, name: string} |
  { error: string }

const value = toRef(props, 'value')
const blocks = ref<Block[]>([])

const pageData = ref<{[key: string]: {data: string, replace(s: string): void}}>({})

watch(value, () => {
  const source = value.value
  const componentManager = new ComponentManager({source})
  const liveCheckboxes = new LiveCheckboxes({source})
  const md = (
    MarkdownIt({html: true, linkify: true})
    .use(highlight, { hljs })
    .use(taskLists)
    .use(liveCheckboxes.plugin)
    .use(componentManager.plugin)
  )
  const html = md.render(source)
  blocks.value = html.split(/(\{\{[^}]+\}\})/).map(token => {
    if (token.startsWith('{{') && token.endsWith('}}')) {
      const inside = token.substring(2, token.length - 2).trim()
      const [tag, id] = inside.split('-')
      const component = componentManager.components.find(({id: _id}) => id === String(_id))
      const settings = props.settings
      if (component && Object.keys(components).includes(tag)) {
        if (settings && (tag === 'NotebookContent' || tag === 'NotebookView' || tag === 'Containers' || tag === 'Environment')) {
          const data = parseJson(component.data)
          if (tag === 'NotebookContent' && validateNotebookContent(data)) {
            return {tag, data, settings}
          } else if (tag === 'NotebookView' && validateNotebookView(data)) {
            return {tag, data, settings}
          } else if (tag === 'Containers') {
            return {tag, data, settings}
          } else if (tag === 'Environment') {
            return {tag, data, settings}
          }
          return { error: 'Schema mismatch' }
        } else if (settings && tag === 'LocalStorageTools') {
          return {tag, settings}
        } else if (!settings && tag === 'Sandbox') {
          return {tag, data: component.data, info: component.info}
        } else if (tag === 'request') {
          return {tag, data: component.data, client: props.client}
        } else if (tag === 'data' && component.name !== undefined) {
          pageData.value[component.name] = {
            data: component.data,
            replace: s => {
              const lines = source.split("\n")
              const start = (lines.slice(0, component.map[0] + 1).join("\n") + "\n").length
              const end = (lines.slice(0, component.map[1] - 1).join("\n")).length
              props.yDoc.transact(() => {
                props.yText.delete(start, end - start)
                props.yText.insert(start, s)
              }, 'view')
            },
          }
          return {tag, data: component.data, name: component.name, info: component.info}
        }
      }
      return { error: `Missing or invalid component: {tag: ${tag}, id: ${id}}` }
    }
    return {
      html: token
    }
  })
})

useEventListener('change', (e) => {
  const target = e.target
  if (e.target instanceof HTMLElement) {
    const attrValue = e.target.getAttribute('data-task-list-index')
    if (attrValue) {
      const index = Number(attrValue)
      const source = value.value
      const check = source.substring(index, index + 3)
      const newCheck = {'[ ]': '[x]', '[x]': '[ ]', '[X]': '[ ]'}[check]
      if (newCheck) {
        props.yDoc.transact(() => {
          props.yText.delete(index, 3)
          props.yText.insert(index, newCheck)
        }, 'view')
      }
    }
  }
})
</script>

<template>
  <div class="mb-2">
    <template v-for="block in blocks">
      <div class="prose px-2" v-if="'html' in block" v-html="block.html"></div>
      <template v-else-if="'tag' in block">
        <template v-if="block.tag === 'NotebookContent'">
          <NotebookContent :data="block.data" :settings="block.settings" />
        </template>
        <template v-else-if="block.tag === 'NotebookView'">
          <NotebookView :data="block.data" :settings="block.settings" />
        </template>
        <template v-else-if="block.tag === 'Containers'">
          <Containers :data="block.data" :settings="block.settings" />
        </template>
        <template v-else-if="block.tag === 'Environment'">
          <Environment :data="block.data" :settings="block.settings" />
        </template>
        <template v-else-if="block.tag === 'LocalStorageTools'">
          <LocalStorageTools :settings="block.settings" />
        </template>
        <template v-else-if="block.tag === 'Sandbox'">
          <Sandbox :data="block.data" :info="block.info" />
        </template>
        <template v-else-if="block.tag === 'request'">
          <Request :data="block.data" :client="block.client" :pageData="pageData" />
        </template>
        <template v-else-if="block.tag === 'data'">
          <Data :data="block.data" :name="block.name" :info="block.info" />
        </template>
      </template>
      <div class="prose my-2 text-red" v-else-if="'error' in block">{{block.error}}</div>
    </template>
  </div>
</template>

<style>
  p:has(a.macchiato-link) {
    display: none;
  }
</style>