<script lang="ts" setup>
import mermaid from 'mermaid'
import { inject, onMounted, watch, ref } from 'vue'
import { mermaidKey } from './data'
import { nanoid } from 'nanoid'

const props = defineProps({
  data: {
    type: String,
    required: true,
  },
})

const id = nanoid()
const div = ref<HTMLDivElement | null>(null)

onMounted(() => {
  const mermaidState = inject(mermaidKey)
  if (!mermaidState) {
    throw new Error('Mermaid state must be provided')
  }
  if (!mermaidState.initialized) {
    mermaid.initialize({startOnLoad: false})
    mermaidState.initialized = false
  }
  if (div.value) {
    mermaid.render(id, props.data, undefined, div.value)
  }
})
</script>

<template>
  <div ref="div">
  </div>
</template>
