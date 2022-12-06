<script lang="ts" setup>
import { computed, PropType } from 'vue'
import type { PermissionSpec } from './data'
import { validate } from './data'
import SettingsClient from '@/store/SettingsClient'
import Button from '@/components/form/Button.vue'

const props = defineProps({
  data: {
    required: true
  },
  settings: {
    type: Object as PropType<SettingsClient>,
    required: true
  },
})

const valid = computed(() => validate(props.data))
</script>

<template>
  {{valid}}
</template>

<style scoped>
</style>