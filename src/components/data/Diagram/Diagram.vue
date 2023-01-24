<script lang="ts" setup>
import Mermaid from './Mermaid.vue'

const props = defineProps({
  data: {
    type: String,
    required: true,
  },
  info: {
    type: String,
  },
})
</script>

<template>
  <Mermaid :data="data" />
</template>
