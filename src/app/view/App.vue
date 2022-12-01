<script lang="ts" setup>
import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import * as Y from 'yjs'
import MarkdownView from '../../components/MarkdownView.vue'
import SettingsClient from '~/store/SettingsClient'

const yDoc = new Y.Doc()
const yText = yDoc.getText('text')

const params = new URLSearchParams(window.location.search)
const role = params.get("role") || undefined

const value = ref('')
const settings = role === 'settings' ? new SettingsClient() : undefined

function handleMessage(e: MessageEvent) {
  if (
    e.isTrusted &&
    e.source === parent &&
    Array.isArray(e.data) &&
    e.data.length === 2 &&
    ['md-doc', 'md-update'].includes(e.data[0])
  ) {
    const update = e.data[1] as Uint8Array
    Y.applyUpdate(yDoc, update)
    value.value = yDoc.getText('text').toString()
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
</script>

<template>
  <div class="text-zinc-700 dark:text-zinc-200 flex flex-col h-full">
    <main>
      <MarkdownView :value="value" :yDoc="yDoc" :yText="yText" :settings="settings" />
    </main>
  </div>
</template>
