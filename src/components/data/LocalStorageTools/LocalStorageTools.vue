<script lang="ts" setup>
import { PropType } from 'vue'
import SettingsClient from '~/store/SettingsClient'
import Button from '~/components/settings/Button.vue'

const {settings} = defineProps({
  settings: {
    type: Object as PropType<SettingsClient>,
    required: true
  }
})

</script>

<template>
  <div class="mx-5 my-7">
    <Button @click="() => settings.importLocalStorage()">Import</Button>
    <Button @click="() => settings.exportLocalStorage()">Export</Button>
    <Button @click="() => settings.clearLocalStorage()">Clear</Button>
  </div>
</template>

<style scoped>
</style>