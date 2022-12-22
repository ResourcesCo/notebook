<script lang="ts" setup>
import { PropType, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import * as Y from 'yjs'
import MarkdownView from '../../components/MarkdownView.vue'
import SettingsClient from '@/store/SettingsClient'
import RequestClient from '@/components/data/Request/RequestClient'

const { params } = defineProps({ params: { type: Object as PropType<URLSearchParams>, required: true } })

const haveDoc = ref(false)
const yDoc = new Y.Doc()
const yText = yDoc.getText('text')

const role = params.get("role") || undefined

const value = ref('')
const settings = role === 'settings' ? new SettingsClient() : undefined
const client = new RequestClient()

function handleMessage(e: MessageEvent) {
  if (
    e.isTrusted &&
    e.source === parent &&
    Array.isArray(e.data) &&
    e.data.length === 2 &&
    ['md-doc', 'md-update'].includes(e.data[0])
  ) {
    const update = e.data[1] as Uint8Array
    if (e.data[0] === 'md-doc') {
      haveDoc.value = true
      Y.applyUpdate(yDoc, update, 'local')      
      value.value = yDoc.getText('text').toString()
    } else if (e.data[0] === 'md-update') {
      if (haveDoc.value === true) {
        Y.applyUpdate(yDoc, update, 'local')
        value.value = yDoc.getText('text').toString()
      } else {
        parent.postMessage(['need-doc'], '*')
        console.warn("Received update but don't have doc")
      }
    }
  }
}

yDoc.on('update', (update, origin) => {
  if (origin === 'view') {
    parent.postMessage(['md-update', update], '*')
  } else {
    value.value = yDoc.getText('text').toString()
  }
})

const {firstMessageEvent} = window as any
if (firstMessageEvent.event !== null) {
  setTimeout(() => {
    handleMessage(firstMessageEvent.event)
    delete (window as any)['firstMessageEvent']
  }, 0)
}
useEventListener('message', handleMessage)

const checkDoc = setInterval(() => {
  if (haveDoc.value === true) {
    clearInterval(checkDoc)
  } else {
    parent.postMessage(['need-doc'], '*')    
  }
}, 200)
</script>

<template>
  <div class="text-zinc-700 dark:text-zinc-200 flex flex-col h-full">
    <main>
      <MarkdownView :value="value" :yDoc="yDoc" :yText="yText" :settings="settings" :client="client" />
    </main>
  </div>
</template>
