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
    class="fixed top-0 left-0 h-screen w-screen dark:bg-gray-700 bg-gray-100 dark:bg-opacity-70 bg-opacity-70 transition duration-500 flex justify-center justify-items-center justify-self-center items-center"
  >
    <div class="bg-gray-200 border-teal-700 dark:bg-gray-900 dark:border-slate-300 border-2 rounded-3xl px-7 p-4" @click="e => e.stopPropagation()">
      <h2 class="dark:text-slate-200 font-bold text-xl pb-4">{{title}}</h2>
      <slot></slot>
    </div>
  </div>
</template>