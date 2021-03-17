<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { isDark, toggleDark } from '../logics'

const { t } = useI18n()
</script>

<template>
  <button
    class="bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 rounded-md px-2"
    :title="t('button.toggle_dark')"
    @click="toggleDark"
  >
    <span v-if="isDark">🌛</span>
    <span v-else>🌞</span>
  </button>
</template>
