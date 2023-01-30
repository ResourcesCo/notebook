<script lang="ts" setup>
import { reactive, ref } from 'vue'
import MarkdownEdit from '../../components/markdown/MarkdownEdit'
import { useEventListener } from '@vueuse/core'
import * as Y from 'yjs'

// This is used to check if it's received the doc from an `md-doc` message. If it hasn't
// received it, it will not apply `md-update` messages and will send `need-doc` messages
// until it receives the doc.
const haveDoc = ref(false)

const yDoc = new Y.Doc()
const yText = yDoc.getText('text')
const undoManager = new Y.UndoManager(yText)

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
    } else if (e.data[0] === 'md-update') {
      if (haveDoc.value === true) {
        Y.applyUpdate(yDoc, update, 'local')
      } else {
        parent.postMessage(['need-doc'], '*')
        console.warn("Received update but don't have doc")
      }
    }
  }
}

yDoc.on('update', (update: Uint8Array, origin) => {
  if (typeof origin !== 'string' || !origin.match(/^(local|client|view)\b/)) {
    parent.postMessage(['md-update', update], '*')
  }
})

const {firstMessageEvent} = window as any
if (firstMessageEvent?.event !== null) {
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
  <main class="p-1 flex flex-col flex-grow">
    <MarkdownEdit v-if="haveDoc" :yText="yText" :undoManager="undoManager" />
  </main>
</template>

<style scoped>
.nav {
  padding-right: 35px;
}
</style>