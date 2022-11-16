<script lang="ts" setup>
import type { ProjectContentInfo } from './data'

import { PropType } from 'vue'

const {data} = defineProps({
  data: {
    type: Object as PropType<ProjectContentInfo>,
    required: true
  }
})
</script>

<template>
  <div v-for="[name, file] in Object.entries(data['files'])">
    {{ file.emoji }}
    {{ file.title }}
    <span>{{ name }}</span>
    <span v-if="file.role" class="tag">{{ file.role }}</span>
  </div>
</template>

<style>
  span {
    font-size: 70%;
    color: #f7f7f7;
    background-color: #555;
    padding: 3px;
    border-radius: 3px;
    @apply mx-1 bg-slate-200 dark:bg-slate-800;
  }

  span.tag {
    @apply bg-teal-700;
  }
</style>