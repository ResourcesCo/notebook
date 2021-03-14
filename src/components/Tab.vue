<script lang="ts">
  export default {
    props: ['selected']
  }
</script>

<template>
  <div 
    class="rounded-md px-3 py-1 mr-1 cursor-pointer shadow-sm"
    :class="[selected ? 'bg-teal-600 text-gray-100 hover:bg-teal-500' : 'bg-gray-200 text-gray-900 hover:bg-gray-300']"
  >
    <slot></slot>
  </div>
</template>

<style scoped>

</style>