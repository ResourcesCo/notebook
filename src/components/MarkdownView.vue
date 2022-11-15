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
import Project from "./blocks/Project.vue"
import LocalStorageTools from "./blocks/LocalStorageTools"
import type { ProjectInfo } from './blocks/ProjectInfo'
import { isProjectInfo } from './blocks/ProjectInfo'
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
    required: true
  }
})

const components = {Project, LocalStorageTools} as const

type Block =
  {html: string} |
  {tag: 'Project', data: ProjectInfo } |
  {tag: 'LocalStorageTools'} |
  { error: string }

const value = toRef(props, 'value')
const blocks = ref<Block[]>([])

watch(value, () => {
  const source = value.value
  const componentManager = new ComponentManager({source})
  const md = MarkdownIt().use(highlight, { hljs }).use(componentManager.plugin)
  const html = md.render(source)
  blocks.value = html.split(/(\{\{[^}]+\}\})/).map(token => {
    if (token.startsWith('{{') && token.endsWith('}}')) {
      const inside = token.substring(2, token.length - 2).trim()
      const [tag, id] = inside.split('-')
      const component = componentManager.components.find(({id: _id}) => id === String(_id))
      if (component && Object.keys(components).includes(tag)) {
        if (tag === 'Project') {
          const data = parseJson(component.data)
          if (isProjectInfo(data)) {
            return {tag, data}
          }
          return { error: 'Schema mismatch' }
        } else if (tag === 'LocalStorageTools') {
          return {tag}
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
  <div ref="root" class="prose p-2" v-for="block in blocks">
    <div v-if="'html' in block" v-html="block.html"></div>
    <div v-else-if="'tag' in block && block.tag === 'Project'"><Project :data="block.data" /></div>
    <div v-else-if="'tag' in block && block.tag === 'LocalStorageTools'"><LocalStorageTools :settings="settings" /></div>
    <div v-else-if="'error' in block" style="color: red">{{block.error}}</div>
  </div>
</template>