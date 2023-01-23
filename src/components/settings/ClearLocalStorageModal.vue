<script lang="ts" setup>
import {computed, PropType} from 'vue'
import Modal from '../layout/Modal.vue'
import Button from '../form/Button.vue'
import { Notebook } from '@/store/notebook'

const props = defineProps({
  notebook: {
    type: Object as PropType<Notebook>,
    required: true,
  },
})

const action = computed(() => {
  const settingsAction = props.notebook.settingsStore.action
  return settingsAction.value?.action === 'clearLocalStorage' ? settingsAction.value : undefined
})

function dismiss() {
  const settingsAction = props.notebook.settingsStore.action
  settingsAction.value = undefined
}

function click() {
  const settingsAction = props.notebook.settingsStore.action
  localStorage.clear()
  sessionStorage.clear()
  settingsAction.value = undefined
  window.location.href = window.location.href
}
</script>

<template>
  <Modal v-if="action !== undefined" title="Clear localStorage & sessionStorage" @close="dismiss">
    <div class="flex">
      <Button @click="click">Clear</Button>
    </div>
  </Modal>
</template>