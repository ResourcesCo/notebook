<script lang="ts" setup>
import { ref } from 'vue'
import MarkdownView from '../../components/MarkdownView.vue'
import SettingsClient from '~/store/SettingsClient';

const params = new URLSearchParams(window.location.search)
const role = params.get("role") || undefined

const value = ref('')
const settings = role === 'settings' ? new SettingsClient() : undefined

window.addEventListener('message', e => {
  if (e.isTrusted && e.source === parent && Array.isArray(e.data) && e.data.length === 2 && e.data[0] === 'md') {
    value.value = e.data[1]
  }
})
</script>

<template>
  <div class="text-zinc-700 dark:text-zinc-200 flex flex-col h-full">
    <main>
      <MarkdownView :value="value" :settings="settings" />
    </main>
  </div>
</template>
