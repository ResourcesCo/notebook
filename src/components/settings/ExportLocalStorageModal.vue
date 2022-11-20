<script lang="ts" setup>
import {ref, computed, watch} from 'vue'
import {saveAs} from 'file-saver'
import {action as settingsAction} from '../../store/settings'
import Modal from './Modal.vue'
import Button from './Button.vue'

const name = ref('')

const action = computed(() => settingsAction.value?.action === 'exportLocalStorage' ? settingsAction.value : undefined)

watch([action], () => {
  if (action.value) {
    name.value = action.value.name
  }
})

function dismiss() {
  settingsAction.value = undefined
}

function click() {
  if (action.value) {
    saveAs(action.value.data, name.value)
    dismiss()
  }
}
</script>

<template>
  <Modal v-if="action !== undefined" title="Download localStorage & sessionStorage" @close="dismiss">
    <div class="flex">
      <input type="text" v-model="name" class="flex-grow mr-2 bg-transparent dark:bg-transparent dark:text-slate-300 light:text-slate-700 border-0">
      <Button @click="click">Download</Button>
    </div>
  </Modal>
</template>