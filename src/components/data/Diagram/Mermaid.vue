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

function render() {
  try {
    mermaid.render(id, props.data, (svg => {
      src.value = svg
    }))
  } catch (e) {
    console.error(`Error rendering diagram: ${e}`)
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
</template>
