<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { ContentArea } from './data'

const props = defineProps({
  contentAreaKey: {
    type: String,
    required: true
  },
  contentArea: {
    type: Object as PropType<ContentArea>,
    required: true
  },
})

const host = computed(() => props.contentArea.host ?? props.contentAreaKey)

const sourceEntries = computed(() => Object.entries(props.contentArea).filter(([key, _value]) => key !== 'host'))
const sources = computed(() => sourceEntries.value.map(([key, _value]) => key))

function toArray(input: string | string[] | undefined) {
  return Array.isArray(input) ? input : (input !== undefined ? [input] : [])
}
</script>

<template>
  <div class="my-1">
    <span>{{props.contentAreaKey}}</span> <span class="tag">content</span>
  </div>
  <div class="pl-2">
    <div class="my-1">
      <span>host</span>
      <span class="value">{{host}}</span>
      <span class="tag" v-for="source in sources">{{source}}</span>
    </div>
    <template v-for="[key, value] in sourceEntries">
      <div class="pl-2" v-if="value !== true">
        <div>
          <span>{{key}}</span>
        </div>
        <pre class="text-xs pl-4 my-2">{{JSON.stringify(value, null, 2)}}</pre>
      </div>
    </template>
  </div>
</template>

<style scoped>
  span {
    background-color: #555;
    padding: 3px;
    border-radius: 3px;
    @apply px-2 focus:outline-gray-800 mx-1 slate-800 bg-slate-200 dark:slate-50 dark:bg-slate-800;
  }

  span.value {
    @apply text-xs;
  }

  span.tag {
    @apply text-xs bg-teal-200 dark:bg-slate-600;
  }
</style>