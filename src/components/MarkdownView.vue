<script lang="ts">
import { defineComponent, ref, watch } from "vue"
import MarkdownIt from "markdown-it"
import hljs from "highlight.js/lib/core"
import markdown from "highlight.js/lib/languages/markdown"
import xml from "highlight.js/lib/languages/xml"
import css from "highlight.js/lib/languages/css"
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import json from "highlight.js/lib/languages/json"
// @ts-ignore
import highlight from "markdown-it-highlightjs/core"

hljs.registerLanguage("xml", xml)
hljs.registerLanguage("css", css)
hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("json", json)
hljs.registerLanguage("markdown", markdown)

const md = MarkdownIt().use(highlight, { hljs })

export default defineComponent({
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  setup(props, _ctx) {
    const root = ref()

    watch(
      () => props.value,
      async () => {
        root.value.innerHTML = md.render(props.value)
      }
    )

    return { root }
  },
})
</script>

<template>
  <div ref="root" class="prose p-2"></div>
</template>