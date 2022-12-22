<script lang="ts" setup>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import debounce from 'lodash/debounce'
import MarkdownEdit from '../../components/markdown/MarkdownEdit'
import { useEventListener } from '@vueuse/core'
import * as Y from 'yjs'

const ready = ref(false)
const haveDoc = ref(false)
const yDoc = new Y.Doc()
const yText = yDoc.getText('text')
const undoManager = new Y.UndoManager(yText)

const page = reactive({body: '', counter: 0})

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
      ready.value = true
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
    <MarkdownEdit v-if="ready" :page="page" :yText="yText" :undoManager="undoManager" />
  </main>
</template>

<style scoped>
.nav {
  padding-right: 35px;
}
</style>