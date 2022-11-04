<script setup lang="ts">
import TabViewButton from './TabViewButton.vue'
import { isDark, toggleDark } from '../modules/store'
</script>

<template>
  <TabViewButton title="Toogle Dark Mode" @click="() => toggleDark()">
    <span v-if="isDark">🌛</span>
    <span v-else>🌞</span>
  </TabViewButton>
</template>
