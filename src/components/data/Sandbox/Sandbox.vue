<script lang="ts" setup>
import { computed } from '@vue/reactivity'
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
    g.text = `(() => { ${props.data} })()`
    s.parentNode?.insertBefore(g, s)
  }
})

const html = computed<string | undefined>(() => {
  if (props.info === 'html') {
    return props.data
  } else if (props.info === 'css') {
    return `<style>${props.data.replace('</style>', '')}</style>`
  }
})
</script>

<template>
  <div v-if="html !== undefined" v-html="html"></div>
</template>
