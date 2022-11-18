<script lang="ts" setup>
import type { NotebookContentInfo } from './data'

import { PropType } from 'vue'

const {data} = defineProps({
  data: {
    type: Object as PropType<NotebookContentInfo>,
    required: true
  }
})
</script>

<template>
  <div v-for="[name, file] in Object.entries(data['files'])">
    <span class="emoji" contenteditable>{{ file.emoji }}</span>
    <span class="title" contenteditable>{{ file.title }}</span>
    <span class="name" contenteditable>{{ name }}</span>
    <span v-if="file.role" class="tag">{{ file.role }}</span>
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

  span.tag {
    @apply text-xs bg-teal-200 dark:bg-slate-600;
  }
</style>