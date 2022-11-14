<script lang="ts" setup>
import {ref, watch} from 'vue'
import {saveAs} from 'file-saver'
import {download} from '../../store'

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
  <div
    v-if="download !== undefined"
    @click="dismiss"
    class="fixed top-0 left-0 h-screen w-screen dark:bg-gray-700 bg-gray-100 dark:bg-opacity-70 bg-opacity-70 transition duration-500 flex justify-center justify-items-center justify-self-center items-center"
  >
    <div class="bg-gray-200 border-teal-700 dark:bg-gray-900 dark:border-slate-300 border-2 rounded-3xl px-7 p-4" @click="e => e.stopPropagation()">
      <h2 class="dark:text-slate-200 font-bold text-xl pb-4">Download localStorage & sessionStorage</h2>
      <div class="flex">
        <input type="text" v-model="name" class="flex-grow mr-2 bg-transparent dark:bg-transparent dark:text-slate-300 light:text-slate-700 border-0">
        <button @click="click" class="whitespace-nowrap select-none rounded-md px-3 py-1 cursor-pointer shadow-sm bg-teal-700 text-zinc-50 hover:bg-teal-800 dark:bg-teal-800 dark:text-zinc-50 dark:hover:bg-teal-700">Download</button>
      </div>
    </div>
  </div>
</template>