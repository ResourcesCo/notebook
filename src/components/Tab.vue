<script setup lang="ts">
defineProps({
  selected: Boolean
})
</script>

<template>
  <div class="tab" :class="[selected ? 'selected' : '']">
    <slot></slot>
  </div>
</template>

<style scoped>
.tab {
  @apply rounded-md px-3 py-1 mr-1 cursor-pointer shadow-sm bg-zinc-300 text-zinc-900 hover:bg-zinc-400 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600;
}

.selected {
  @apply bg-teal-700 text-zinc-50 hover:bg-teal-800 dark:bg-teal-800 dark:text-zinc-50 dark:hover:bg-teal-700;
}
</style>