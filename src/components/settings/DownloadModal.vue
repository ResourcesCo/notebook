<script lang="ts" setup>
import {ref, watch} from 'vue'
import {saveAs} from 'file-saver'
import {download} from '../../store'
import Modal from './Modal.vue'
import Button from './Button.vue'

const name = ref('')

watch([download], () => {
  if (download.value) {
    name.value = download.value.name
  }
})

function dismiss() {
  download.value = undefined
}

function click() {
  if (download.value) {
    saveAs(download.value.data, name.value)
  }
}
</script>

<template>
  <Modal v-if="download !== undefined" title="Download localStorage & sessionStorage" @close="dismiss">
    <div class="flex">
      <input type="text" v-model="name" class="flex-grow mr-2 bg-transparent dark:bg-transparent dark:text-slate-300 light:text-slate-700 border-0">
      <Button @click="click">Download</Button>
    </div>
  </Modal>
</template>