<script lang="ts" setup>
import {computed, PropType} from 'vue'
import Modal from '../layout/Modal.vue'
import Button from '../form/Button.vue'
import { uniq } from 'lodash'
import { Notebook } from '@/store/notebook'

const props = defineProps({
  notebook: {
    type: Object as PropType<Notebook>,
    required: true,
  },
})

const action = computed(() => {
  const settingsAction = props.notebook.settingsStore.action
  return settingsAction.value?.action === 'applyViewChanges' ? settingsAction.value : undefined
})

const status = computed<{messages: string[]}>(() => {
  if (action.value) {
    let messages: string[] = []
    for (const [side, tabState] of [['left', action.value.data.left], ['right', action.value.data.right]] as const) {
      if (tabState.tabs.length < 1) {
        messages.push(`There must be at least one tab on each side. The ${side} side has none.`)
      }
      for (const tab of tabState.tabs) {
        if (!props.notebook.content.files[tab]) {
          messages.push(`The file ${tab} in the ${side} side is not found.`)
        }
      }
      if (!(tabState.selected && tabState.tabs.includes(tabState.selected))) {
        messages.push(`The ${side}-side selected tab does not appear in the ${side}-side tabs.`)
      }
    }
    if (action.value.data.left.show === 'other' && action.value.data.right.show === 'other') {
      messages.push('The show field cannot be set to other on both sides.')
    }
    return {messages: uniq(messages)}
  }
  return {messages: []}
})

function dismiss() {
  const settingsAction = props.notebook.settingsStore.action
  settingsAction.value = undefined
}

function click() {
  const data = action.value?.data
  if (data) {
    props.notebook.applyViewChanges(data)
    props.notebook.resetSettings()
  }
  dismiss()
}
</script>

<template>
  <Modal v-if="action !== undefined" title="Apply View Changes" @close="dismiss">
    <div class="flex flex-col text-sm">
      <div v-for="message of status.messages">
        {{message}}
      </div>
      <div v-if="status.messages.length === 0">
        Are you sure?
      </div>
    </div>
    <div class="pt-5 text-center">
      <Button :disabled="status.messages.length !== 0" @click="click">Apply</Button>
      <Button @click="dismiss" class="ml-2">Cancel</Button>
    </div>
  </Modal>
</template>