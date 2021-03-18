<script lang="ts">
import { defineComponent } from 'vue'
import testPathString from './utils/path-string'

export default defineComponent({
  setup(props, ctx) {
    const result = testPathString()
    return { result }
  }
})
</script>

<template>
  <div class="text-gray-700 dark:text-gray-200 flex flex-col h-full">
    <main class="m-1">
      <div class="p-4 bg-lime-700" v-if="result">Tests Passed</div>
      <div class="p-4 bg-red-700" v-else>Tests Failed</div>
    </main>
  </div>
</template>