<script lang="ts" setup>
import { watchEffect } from 'vue'

const props = defineProps({
  data: {
    type: String,
    required: true
  },
  info: {
    type: String
  }
})

watchEffect(() => {
  if (props.info === 'js') {
    const g = document.createElement('script')
    const s = document.getElementsByTagName('script')[0]
    g.text = props.data
    s.parentNode?.insertBefore(g, s)
  }
})
</script>

<template>
  <div></div>
</template>
