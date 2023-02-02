<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { hljs } from "@/components/markdown/MarkdownView/highlight"

const pre = ref()

const props = defineProps({
  data: {
    type: String,
    required: true
  },
  info: {
    type: String,
  },
})

const formatClass = computed(() => {
  if (props.info === 'typescript' || props.info === 'ts') {
    return 'lang-typescript'
  } else if (props.info === 'javascript' || props.info === 'js') {
    return 'lang-javascript'
  } else if (props.info === 'html') {
    return 'lang-html'
  } else if (props.info === 'css') {
    return 'lang-css'
  } else if (props.info === 'json') {
    return 'lang-json'
  } else {
    return ''
  }
})

onMounted(() => {
  hljs.highlightElement(pre.value)
})
</script>

<template>
  <pre ref="pre" :class="formatClass">{{data}}</pre>
</template>
