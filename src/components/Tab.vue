<script lang="ts">
  export default {
    props: {
      selected: Boolean
    }
  }
</script>

<template>
  <div 
    class="tab"
    :class="[selected ? 'selected' : '']"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
  .tab {
    @apply rounded-md px-3 py-1 mr-1 cursor-pointer shadow-sm
    bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300
    dark:hover:bg-gray-600;
  }
  .selected {
    @apply bg-teal-600 text-gray-50 hover:bg-teal-500 dark:bg-teal-800 dark:text-gray-50
    dark:hover:bg-teal-700;
  }
</style>