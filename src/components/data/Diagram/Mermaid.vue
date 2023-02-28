<script lang="ts" setup>
import mermaid from 'mermaid'
import { inject, onMounted, ref, watch, toRef } from 'vue'
import { mermaidKey } from './data'
import { nanoid } from 'nanoid'
import { isDark } from '@/store'

const props = defineProps({
  data: {
    type: String,
    required: true,
  },
})

const id = 'diagram-' + nanoid(8)
const div = ref<HTMLDivElement | null>(null)
const src = ref<string | undefined>()
const error = ref<boolean>(false)

async function render() {
  error.value = false
  try {
    src.value = (await mermaid.render(id, props.data)).svg
  } catch (e) {
    console.error(`Error rendering diagram: ${e}`)
    error.value = true
  }
}

watch([toRef(props, 'data')], render)

onMounted(() => {
  const mermaidState = inject(mermaidKey)
  if (mermaidState === undefined) {
    throw new Error('Mermaid state must be provided')
  }
  if (!mermaidState.initialized) {
    mermaid.initialize({startOnLoad: false, darkMode: isDark.value, theme: isDark.value ? 'dark' : undefined})
    mermaidState.initialized = true
  }
  render()
})
</script>

<template>
  <div ref="div" class="mermaid w-full" v-if="src !== undefined" v-html="src"></div>
  <div v-if="error" class="color-red px-2">Error rendering diagram.</div>
</template>
