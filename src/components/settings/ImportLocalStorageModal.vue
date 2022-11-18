<script lang="ts" setup>
import {ref, computed} from 'vue'
import {action as settingsAction} from '../../store/settings'
import readMarkdown from '../data/LocalStorageTools/readMarkdown'
import setStorage from '../data/LocalStorageTools/setStorage'
import Modal from './Modal.vue'
import Button from './Button.vue'
import { StoragesExport } from '../data/LocalStorageTools/getStorage'

const hasError = ref<Boolean>(false)
const data = ref<StoragesExport>()

const action = computed(() => settingsAction.value?.action === 'importLocalStorage' ? settingsAction.value : undefined)

function dismiss() {
  settingsAction.value = undefined
}

function click() {
  if (data.value !== undefined) {
    setStorage(data.value)
    data.value = undefined
    settingsAction.value = undefined
    window.location.href = window.location.href
  }
}

async function select(e: Event) {
  hasError.value = false
  data.value = undefined
  const files = (e.target as HTMLInputElement).files
  if (files && files.length === 1) {
    const file = files[0]
    const text = await file.text()
    const _data = readMarkdown(text)
    if (Object.keys(_data.local).length > 0 || Object.keys(_data.session).length > 0) {
      data.value = _data
    } else {
      hasError.value = true
    }
  }
}
</script>

<template>
  <Modal v-if="action !== undefined" title="Import localStorage & sessionStorage" @close="dismiss">
    <div class="flex">
      <input type="file" @change="e => select(e)" class="flex-grow mr-2 bg-transparent dark:bg-transparent dark:text-slate-300 light:text-slate-700 border-0">
      <Button :disabled="!data" @click="click">Import</Button>
    </div>
    <div v-if="hasError" class="py-3 text-red-500 dark:text-red-400">
      The selected file does not contain any storage data.
    </div>
  </Modal>
</template>