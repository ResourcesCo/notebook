<script lang="ts" setup>
import { ref } from 'vue'
import MarkdownView from '../../components/MarkdownView.vue'
import Settings from '~/store/Settings';

const value = ref('')
const settings = new Settings()

window.addEventListener('message', e => {
  if (e.isTrusted && e.source === parent && Array.isArray(e.data) && e.data.length === 2 && e.data[0] === 'md') {
    value.value = e.data[1]
  }
})
</script>

<template>
  <div class="text-zinc-700 dark:text-zinc-200 flex flex-col h-full">
    <main class="m-1">
      <MarkdownView :value="value" :settings="settings" />
    </main>
  </div>
</template>

<style>
  button {
    @apply ml-1 whitespace-nowrap select-none rounded-md px-3 py-1 cursor-pointer shadow-sm bg-zinc-300 text-zinc-900 hover:bg-zinc-400 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600;
  }
</style>