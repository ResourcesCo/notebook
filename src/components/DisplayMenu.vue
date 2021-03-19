<script setup lang="ts">
import { isDark, toggleDark } from '../modules/store'
</script>

<template>
  <button
    class="bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 rounded-md px-2"
    title="Toogle Dark Mode"
    @click="toggleDark"
  >
    <span v-if="isDark">🌛</span>
    <span v-else>🌞</span>
  </button>
</template>
