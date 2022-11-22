<script lang="ts" setup>
import { PropType } from 'vue'
import type { NotebookView as NotebookViewType } from '../../../store/notebook'
import SettingsClient from '~/store/SettingsClient'
import Button from '~/components/settings/Button.vue'

const {data, settings} = defineProps({
  data: {
    type: Object as PropType<NotebookViewType>,
    required: true
  },
  settings: {
    type: Object as PropType<SettingsClient>,
    required: true
  },
})

const sides = ['left', 'right'] as const
</script>

<template>
  <div class="mx-5 my-7">
    <div v-for="side in sides">
      <div>
        <span class="name">{{side}}</span>
        <span class="tag">{{data[side].show}}</span>
      </div>
      <div class="pl-5 my-1" v-for="tab in data[side].tabs">
        <span class="name">{{tab}}</span>
        <span v-if="tab == data[side].selected" class="tag">selected</span>
        <span v-if="tab == data[side].lastSelected" class="tag">last selected</span>
      </div>
    </div>
    <div class="pt-3">
      <Button @click="() => settings.applyViewChanges(data)">Apply</Button>
      <Button @click="() => settings.resetViewChanges()">Reset</Button>
    </div>
  </div>
</template>

<style scoped>
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