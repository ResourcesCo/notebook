<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({ title: 'Notebook' })
</script>

<template>
  <iframe
    class="h-full w-full"
    src="/app/"
    sandbox="allow-same-origin allow-scripts allow-popups allow-downloads"
  ></iframe>
</template>
