<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

let md

const getMarkdownIt = async () => {
  const { default: MarkdownIt } = await import('markdown-it')
  md = new MarkdownIt()
}

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
      if (!md) {
        await getMarkdownIt();
      }
      root.value.innerHTML = md.render(props.value)
    })

    return { root }
  }
})
</script>

<template>
  <div ref="root" class="prose"></div>
</template>