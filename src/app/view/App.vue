<script lang="ts" setup>
import { PropType, ref } from 'vue'
import * as Y from 'yjs'
import MarkdownView from '@/components/markdown/MarkdownView'
import SettingsClient from '@/store/SettingsClient'
import RequestClient from '@/components/data/Request/RequestClient'
import postMessage from '@/store/postMessage'

const { params } = defineProps({ params: { type: Object as PropType<URLSearchParams>, required: true } })

// This is used to check if it's received the doc from an `md-doc` message. If it hasn't
// received it, it will not apply `md-update` messages and will send `need-doc` messages
// until it receives the doc.
const haveDoc = ref(false)

const yDoc = new Y.Doc()
const yText = yDoc.getText('text')

const role = params.get("role") || undefined

const value = ref('')
const settings = role === 'settings' ? new SettingsClient() : undefined
const client = new RequestClient()

postMessage({mode: 'view', haveDoc, yDoc, value})

</script>

<template>
  <div class="text-zinc-700 dark:text-zinc-200 flex flex-col h-full">
    <main>
      <MarkdownView :value="value" :yDoc="yDoc" :yText="yText" :settings="settings" :client="client" />
    </main>
  </div>
</template>
