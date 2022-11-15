<script lang="ts" setup>
import { PropType } from 'vue';
import SettingsClient from '~/store/SettingsClient';

const {settings} = defineProps({
  settings: {
    type: Object as PropType<SettingsClient>,
    required: true
  }
})

function downloadStorage() {
  settings.downloadStorage()
}
</script>

<template>
  <div>
    <button>Import</button>
    <button @click="downloadStorage">Export</button>
  </div>
</template>

<style>
</style>