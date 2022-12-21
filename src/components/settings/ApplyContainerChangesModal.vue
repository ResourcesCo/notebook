<script lang="ts" setup>
import {computed} from 'vue'
import {notebook} from '../../store/notebook'
import {action as settingsAction} from '../../store/settings'
import Modal from '../layout/Modal.vue'
import Button from '../form/Button.vue'

const action = computed(() => settingsAction.value?.action === 'applyContainerChanges' ? settingsAction.value : undefined)

function dismiss() {
  settingsAction.value = undefined
}

function click() {
  const data = action.value?.data
  if (data) {
    notebook.applyContainerChanges(data)
    notebook.resetSettings()
  }
  dismiss()
}
</script>

<template>
  <Modal v-if="action !== undefined" title="Apply Container Changes" @close="dismiss">
    <div class="flex flex-col text-sm">
      <div>
        Are you sure?
      </div>
    </div>
    <div class="pt-5 text-center">
      <Button @click="click">Apply</Button>
      <Button @click="dismiss" class="ml-2">Cancel</Button>
    </div>
  </Modal>
</template>