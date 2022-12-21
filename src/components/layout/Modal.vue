<script setup lang="ts">

const {title} = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div
    @click="() => emit('close')"
    class="backdrop absolute top-0 left-0 bottom-0 right-0 dark:bg-zinc-900 bg-gray-50 dark:bg-opacity-70 bg-opacity-70 transition duration-500 flex justify-center justify-items-center justify-self-center items-center"
  >
    <div class="bg-gray-200 border-teal-700 dark:bg-zinc-800 dark:border-slate-300 border-2 rounded-3xl px-7 p-4 mb-20" @click="e => e.stopPropagation()">
      <h2 class="dark:text-slate-200 font-bold text-xl pb-4">{{title}}</h2>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
  html div.backdrop {
    background-color: rgba(245, 245, 244, 0.7);
  }
  html.dark div.backdrop {
    background-color: rgba(18, 18, 18, 0.7);
  }
</style>