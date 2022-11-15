<script lang="ts" setup>
import { PropType } from 'vue';
import SettingsClient from '~/store/SettingsClient';

const {settings} = defineProps({
  settings: {
    type: Object as PropType<SettingsClient>,
    required: true
  }
})

</script>

<template>
  <div>
    <button @click="() => settings.importLocalStorage()">Import</button>
    <button @click="() => settings.exportLocalStorage()">Export</button>
  </div>
</template>

<style>
</style>