<script lang="ts" setup>
import { reactive, ref } from 'vue'
import MarkdownEdit from '../../components/markdown/MarkdownEdit'
import { useEventListener } from '@vueuse/core'
import * as Y from 'yjs'
import postMessage from '@/store/postMessage'

// This is used to check if it's received the doc from an `md-doc` message. If it hasn't
// received it, it will not apply `md-update` messages and will send `need-doc` messages
// until it receives the doc.
const haveDoc = ref(false)

const yDoc = new Y.Doc()
const yText = yDoc.getText('text')
const undoManager = new Y.UndoManager(yText)

postMessage({mode: 'edit', haveDoc, yDoc})
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