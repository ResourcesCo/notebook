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
  return settingsAction.value?.action === 'applyContainerChanges' ? settingsAction.value : undefined
})

function dismiss() {
  const settingsAction = props.notebook.settingsStore.action
  settingsAction.value = undefined
}

function click() {
  const data = action.value?.data
  if (data) {
    props.notebook.applyContainerChanges(data)
    props.notebook.resetSettings()
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