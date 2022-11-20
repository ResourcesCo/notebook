<script lang="ts" setup>
import {ref, computed} from 'vue'
import {action as settingsAction} from '../../store/settings'
import Modal from './Modal.vue'
import Button from './Button.vue'

const action = computed(() => settingsAction.value?.action === 'clearLocalStorage' ? settingsAction.value : undefined)

function dismiss() {
  settingsAction.value = undefined
}

function click() {
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