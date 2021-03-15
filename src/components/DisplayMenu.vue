<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { isDark, toggleDark } from '~/logics'

const { t } = useI18n()
</script>

<template>
  <a class="icon-btn mx-2" :title="t('button.toggle_dark')" @click="toggleDark">
    <carbon-moon v-if="isDark" />
    <carbon-sun v-else />
  </a>
</template>
