<script setup lang="ts">
defineProps({
  selected: Boolean,
  utility: Boolean,
})
</script>

<template>
  <div class="tab" :class="[selected ? 'selected' : '', utility ? 'utility' : '']">
    <slot></slot>
  </div>
</template>

<style scoped>
.tab {
  @apply ml-1 whitespace-nowrap select-none rounded-md px-3 py-1 cursor-pointer shadow-sm bg-zinc-300 text-zinc-900 hover:bg-zinc-400 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600;
}

.tab.utility {
  @apply bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-600;
}

.tab.right {
  @apply ml-0 mr-1
}

.tab.selected, .tab.utility.selected {
  @apply bg-teal-700 text-zinc-50 hover:bg-teal-800 dark:bg-teal-800 dark:text-zinc-50 dark:hover:bg-teal-700;
}
</style>