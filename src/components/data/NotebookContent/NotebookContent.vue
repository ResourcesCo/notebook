<script lang="ts" setup>
import { PropType } from 'vue'
import type { NotebookContentInfo } from './data'
import SettingsClient from '~/store/SettingsClient'

const {data, settings} = defineProps({
  data: {
    type: Object as PropType<NotebookContentInfo>,
    required: true
  },
  settings: {
    type: Object as PropType<SettingsClient>,
    required: true
  },
})

</script>

<template>
  <div>
    <div v-for="[name, file] in Object.entries(data['files'])">
      <span class="emoji">{{ file.emoji }}</span>
      <span class="title">{{ file.title }}</span>
      <span class="name">{{ name }}</span>
      <span class="delete" v-if="file.delete">delete</span>
      <span class="rename" v-if="file.rename">→ {{file.rename}}</span>
    </div>
    <div class="pt-5">
      <button @click="() => settings.applyContentChanges(data)">Apply</button>
      <button @click="() => settings.resetContentChanges()">Reset</button>
    </div>
  </div>
</template>

<style>
  span {
    background-color: #555;
    padding: 3px;
    border-radius: 3px;
    @apply px-2 focus:outline-gray-800 mx-1 slate-800 bg-slate-200 dark:slate-50 dark:bg-slate-800;
  }

  span.name {
    @apply text-xs;
  }

  span.delete {
    @apply text-xs bg-red-400 dark:bg-red-600;
  }

  span.rename {
    @apply text-xs bg-orange-500 text-slate-900 dark:bg-orange-500 dark:text-slate-900;
  }
</style>