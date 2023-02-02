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
  return settingsAction.value?.action === 'applyContentChanges' ? settingsAction.value : undefined
})

const status = computed<{messages: string[], deletes: string[]}>(() => {
  if (action.value) {
    let messages: string[] = []
    const files = Object.entries(action.value.data.files).map(([k, v]) => ({...v, name: k}))
    for (const file of files) {
      if (file.rename && file.rename === file.name) {
        messages.push(`Cannot rename ${JSON.stringify(file.name)} to the same name.`)
      }
      if ((file.delete || file.rename) && !(file.name in props.notebook.content.files)) {
        messages.push(
          `The file ${JSON.stringify(file.name)} does not exist and can't be ${file.delete ? 'deleted' : 'renamed'}.`
        )
      }
    }
    const deletes = files.filter(f => f.delete).map(f => f.name)
    const remaining = files.filter(f => !f.delete)
    const requested = remaining.map(f => 'rename' in f ? f.rename : f.name)
    const multiple = []
    for (const name of requested) {
      if (requested.filter(v => v === name).length > 1) {
        messages.push(
          `There is a conflict for the filename ${JSON.stringify(name)}. ` +
          `Please check the current names and renames.`
        )
        multiple.push(name)
      }
    }
    for (const file of remaining) {
      if ('rename' in file && remaining.find(f => f.name === file.rename) && !multiple.includes(file.rename)) {
        messages.push(
          `${JSON.stringify(file.rename)} already exists. ` +
          `Please rename or delete it before renaming ${file.name} to ${file.rename}.`
        )
      }
    }
    for (const name of Object.keys(props.notebook.content.files)) {
      if (!(name in action.value.data.files)) {
        messages.push(
          `The file ${JSON.stringify(name)} is not included in the list of files. ` +
          `To delete it, add a "delete": true attribute to the data.`
        )
      }
    }
    return {messages: uniq(messages), deletes}
  }
  return {messages: [], deletes: []}
})

function close() {
  const settingsAction = props.notebook.settingsStore.action
  settingsAction.value = undefined
}

async function apply() {
  const notebook = props.notebook
  const data = action.value?.data
  if (data) {
    await notebook.applyContentChanges({data, deletes: status.value.deletes})
    notebook.resetSettings()
  }
  close()
}
</script>

<template>
  <Modal v-if="action !== undefined" title="Apply Content Changes" @close="close">
    <div class="flex flex-col text-sm">
      <div v-for="message of status.messages">
        {{message}}
      </div>
      <div v-if="status.messages.length === 0">
        <div class="flex flex-col" v-if="status.deletes.length > 0">
          <div>Delete these files?</div>
          <div v-for="del of status.deletes" class="pl-5">
            {{del}}
          </div>
        </div>
        <div v-else>
          Are you sure?
        </div>
      </div>
    </div>
    <div class="pt-5 text-center">
      <Button :disabled="status.messages.length !== 0" @click="apply">Apply</Button>
      <Button @click="close" class="ml-2">Cancel</Button>
    </div>
  </Modal>
</template>