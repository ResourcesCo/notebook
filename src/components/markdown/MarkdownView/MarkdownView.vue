<script lang="ts" setup>
import { PropType, provide, ref, toRef, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import { highlight, hljs } from './highlight'
import ComponentManager from '../ComponentManager'
import LiveCheckboxes from '../LiveCheckboxes'
import LocalStorageTools from '@/components/data/LocalStorageTools'
import NotebookContent, { NotebookContentInfo, validate as validateNotebookContent } from '@/components/data/NotebookContent'
import NotebookView, { NotebookViewType, validate as validateNotebookView } from '@/components/data/NotebookView'
import Sandbox from '@/components/data/Sandbox'
import parseJson from '@/utils/parseJson'
import SettingsClient from '@/store/SettingsClient'
// @ts-ignore
import taskLists from 'markdown-it-task-list-plus'
import { useEventListener } from '@vueuse/core'
import * as Y from 'yjs'
import Request from '@/components/data/Request'
import Data from '@/components/data/Data'
import Code from '@/components/data/Code'
import Download from '@/components/data/Download'
import RequestClient from '@/components/data/Request/RequestClient'
import Diagram, { mermaidKey } from '@/components/data/Diagram'
import { Containers, ContainerConfig } from '@/components/data/Containers'
import { Environment, EnvironmentConfig } from '@/components/data/Environment'

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

const settingsTags = ['NotebookContent', 'NotebookView', 'Containers', 'Environment'] as const

type SettingsTag = typeof settingsTags[number]

function isSettingsTag(tag: string): tag is SettingsTag {
  return (settingsTags as readonly string[]).includes(tag)
}

provide(mermaidKey, {initialized: false})

const components = {
  NotebookContent,
  NotebookView,
  Containers,
  Environment,
  LocalStorageTools,
  sandbox: Sandbox,
  request: Request,
  data: Data,
  code: Code,
  download: Download,
  diagram: Diagram,
} as const

type Block =
  {html: string} |
  {tag: 'NotebookContent', data: NotebookContentInfo, settings: SettingsClient } |
  {tag: 'NotebookView', data: NotebookViewType, settings: SettingsClient } |
  {tag: 'Containers', data: ContainerConfig, settings: SettingsClient } |
  {tag: 'Environment', data: EnvironmentConfig, settings: SettingsClient } |
  {tag: 'LocalStorageTools', settings: SettingsClient} |
  {tag: 'sandbox', data: string, info?: string} |
  {tag: 'request', data: string, client: RequestClient} |
  {tag: 'data', data: string, info?: string, name: string} |
  {tag: 'code', data: string, info?: string, name: string} |
  {tag: 'diagram', data: string, info?: string} |
  {tag: 'download'} |
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
  pageData.value = {}
  const html = md.render(source)
  blocks.value = html.split(/(\{\{[^}]+\}\})/).map(token => {
    if (token.startsWith('{{') && token.endsWith('}}')) {
      const inside = token.substring(2, token.length - 2).trim()
      const [tag, id] = inside.split('-')
      const component = componentManager.components.find(({id: _id}) => id === String(_id))
      const settings = props.settings
      if (component && Object.keys(components).includes(tag)) {
        if (settings && isSettingsTag(tag)) {
          const data = parseJson(component.data)
          if (
            (tag === 'NotebookContent' && !validateNotebookContent(data)) ||
            (tag === 'NotebookView' && !validateNotebookView(data))
          ) {
            return {error: 'Schema mismatch'}
          }
          return {tag: tag as typeof settingsTags[number], data, settings}
        } else if (settings && tag === 'LocalStorageTools') {
          return {tag, settings}
        } else if (!settings && tag === 'sandbox') {
          return {tag, data: component.data, info: component.info}
        } else if (tag === 'request') {
          return {tag, data: component.data, client: props.client}
        } else if ((tag === 'data' || tag === 'code') && component.name !== undefined) {
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
        } else if (tag === 'download') {
          return {tag}
        } else if (tag === 'diagram') {
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
        <template v-if="isSettingsTag(block.tag) && 'data' in block && 'settings' in block">
          <component :is="components[block.tag]" :data="block.data" :settings="block.settings" />
        </template>
        <template v-else-if="block.tag === 'LocalStorageTools'">
          <LocalStorageTools :settings="block.settings" />
        </template>
        <template v-else-if="block.tag === 'sandbox'">
          <Sandbox :data="block.data" :info="block.info" />
        </template>
        <template v-else-if="block.tag === 'request'">
          <Request :data="block.data" :client="block.client" :pageData="pageData" />
        </template>
        <template v-else-if="block.tag === 'data'">
          <Data :data="block.data" :name="block.name" :info="block.info" />
        </template>
        <template v-else-if="block.tag === 'code'">
          <Code :data="block.data" :name="block.name" :info="block.info" />
        </template>
        <template v-else-if="block.tag === 'download'">
          <Download :pageData="pageData" />
        </template>
        <template v-else-if="block.tag === 'diagram'">
          <Diagram :data="block.data" :info="block.info" />
        </template>
      </template>
      <div class="px-2 my-2 text-red" v-else-if="'error' in block">{{block.error}}</div>
    </template>
  </div>
</template>

<style>
  p:has(a.macchiato-link) {
    display: none;
  }
</style>