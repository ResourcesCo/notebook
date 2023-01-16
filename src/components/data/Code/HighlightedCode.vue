<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import hljs from "highlight.js/lib/core"

const pre = ref()

const props = defineProps({
  data: {
    type: String,
    required: true
  },
})

onMounted(() => {
  hljs.highlightElement(pre.value)
})
</script>

<template>
  <pre ref="pre">{{data}}</pre>
</template>