<script lang="ts" setup>
import { PropType } from 'vue';
import Settings from '~/store/Settings';

const {settings} = defineProps({
  settings: {
    type: Object as PropType<Settings>,
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