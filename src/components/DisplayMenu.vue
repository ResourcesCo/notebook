<script setup lang="ts">
import { isDark, toggleDark } from '../modules/store'
</script>

<template>
  <button class="bg-zinc-300 hover:bg-zinc-400 text-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-500 rounded-md px-2" title="Toogle Dark Mode"
    @click="() => toggleDark()">
    <span v-if="isDark">🌛</span>
    <span v-else>🌞</span>
  </button>
</template>
