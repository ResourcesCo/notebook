<script lang="ts" setup>
import { computed, PropType } from 'vue'
import Button from '@/components/form/Button.vue'

const props = defineProps({
  data: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  info: {
    type: String,
  },
})

const data = computed(() => {
  try {
    return {value: JSON.stringify(JSON.parse(props.data), null, 2), err: false}
  } catch (err) {
    return {value: String(err), err: true}
  }
})
</script>

<template>
  <div class="m-3 round bg-slate-200 dark:bg-slate-800 text:slate-700 dark:text-slate-300 text-xs rounded-md divide-y divide-slate-300 dark:divide-slate-900">
    <div class="p-1 font-bold text-cyan-600 dark:text-sky-600">{{name}}</div>
    <div
      class="overflow-x-auto p-1"
      scrollbar="~ track-slate-200 thumb-color-sky-300 dark:track-color-slate-900 dark:thumb-color-sky-900 rounded h-4px">
      <pre class="" v-if="!data.err">{{data.value}}</pre>
      <div v-if="data.err" class="color-red">{{data.value}}</div>
    </div>
  </div>
</template>