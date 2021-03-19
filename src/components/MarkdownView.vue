<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

export default defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    }
  },
  setup(props, _ctx) {
    const root = ref()

    watch(() => props.value, async () => {
      root.value.innerHTML = md.render(props.value)
    })

    return { root }
  }
})
</script>

<template>
  <div ref="root" class="prose"></div>
</template>