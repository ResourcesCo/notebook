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
import LocalStorageTools from "./data/LocalStorageTools"
import NotebookContent, { NotebookContentInfo, validate as validateNotebookContent } from './data/NotebookContent'
import NotebookView, { NotebookViewType, validate as validateNotebookView } from './data/NotebookView'
import Sandbox from "./data/Sandbox"
import parseJson from '../utils/parseJson'
import SettingsClient from '../store/SettingsClient'
// @ts-ignore
import highlight from "markdown-it-highlightjs/core"

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
  settings: {
    type: Object as PropType<SettingsClient>,
  }
})

const components = {NotebookContent, NotebookView, LocalStorageTools, Sandbox} as const

type Block =
  {html: string} |
  {tag: 'NotebookContent', data: NotebookContentInfo, settings: SettingsClient } |
  {tag: 'NotebookView', data: NotebookViewType, settings: SettingsClient } |
  {tag: 'LocalStorageTools', settings: SettingsClient} |
  {tag: 'Sandbox', data: string, info?: string} |
  { error: string }

const value = toRef(props, 'value')
const blocks = ref<Block[]>([])

watch(value, () => {
  const source = value.value
  const componentManager = new ComponentManager({source})
  const md = MarkdownIt({html: true, linkify: true}).use(highlight, { hljs }).use(componentManager.plugin)
  const html = md.render(source)
  blocks.value = html.split(/(\{\{[^}]+\}\})/).map(token => {
    if (token.startsWith('{{') && token.endsWith('}}')) {
      const inside = token.substring(2, token.length - 2).trim()
      const [tag, id] = inside.split('-')
      const component = componentManager.components.find(({id: _id}) => id === String(_id))
      const settings = props.settings
      if (component && Object.keys(components).includes(tag)) {
        if (settings && (tag === 'NotebookContent' || tag === 'NotebookView')) {
          const data = parseJson(component.data)
          if (tag === 'NotebookContent' && validateNotebookContent(data)) {
            return {tag, data, settings}
          } else if (tag === 'NotebookView' && validateNotebookView(data)) {
            return {tag, data, settings}
          }
          return { error: 'Schema mismatch' }
        } else if (settings && tag === 'LocalStorageTools') {
          return {tag, settings}
        } else if (!settings && tag === 'Sandbox') {
          return {tag, data: component.data, info: component.info}
        }
      }
      return { error: `Missing or invalid component: {tag: ${tag}, id: ${id}}` }
    }
    return {
      html: token
    }
  })
})
</script>

<template>
  <div class="prze p-2" v-for="block in blocks">
    <div v-if="'html' in block" v-html="block.html"></div>
    <div v-else-if="'tag' in block && block.tag === 'NotebookContent'"><NotebookContent :data="block.data" :settings="block.settings" /></div>
    <div v-else-if="'tag' in block && block.tag === 'NotebookView'"><NotebookView :data="block.data" :settings="block.settings" /></div>
    <div v-else-if="'tag' in block && block.tag === 'LocalStorageTools'"><LocalStorageTools :settings="block.settings" /></div>
    <div v-else-if="'tag' in block && block.tag === 'Sandbox'"><Sandbox :data="block.data" :info="block.info" /></div>
    <div v-else-if="'error' in block" style="color: red">{{block.error}}</div>
  </div>
</template>