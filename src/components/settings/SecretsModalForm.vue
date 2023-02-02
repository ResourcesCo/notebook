<script lang="ts" setup>
import {computed, ref, onMounted, PropType} from 'vue'
import Button from '../form/Button.vue'
import { Notebook } from '@/store/notebook'
import { isPlainObject } from 'lodash'

const props = defineProps({
  notebook: {
    type: Object as PropType<Notebook>,
    required: true,
  },
})

function dismiss() {
  const settingsAction = props.notebook.settingsStore.action
  settingsAction.value = undefined
}

const secrets = ref<string | undefined>(undefined)

const key = computed(() => `${props.notebook.prefix}/secrets.json`)

onMounted(() => {
  const str = localStorage.getItem(key.value)
  if (str === '' || str === null) {
    secrets.value = '{}'
  } else {
    const data = JSON.parse(str)
    secrets.value = JSON.stringify(data, null, 2)
  }
})

const error = computed(() => {
  let data
  if (secrets.value === undefined) {
    return 'Invalid JSON'
  }
  try {
    data = JSON.parse(secrets.value)
  } catch (err) {
    return 'Invalid JSON'
  }
  if (!(isPlainObject(data) && Object.values(data).every(s => typeof s === 'string'))) {
    return 'Must be key/value pairs with strings as values'
  }
  return undefined
})

function click() {
  const s = secrets.value
  if (s !== undefined) {
    const str = JSON.stringify(JSON.parse(s))
    localStorage.setItem(key.value, str)
    secrets.value = '{}'
    dismiss()
  }
}
</script>

<template>
  <div class="flex flex-col text-sm">
    <div>
      <textarea v-if="secrets !== undefined" class="bg-slate-800 text-slate-100 text-xs p-1" rows="10" cols="80" v-model="secrets"></textarea>
    </div>
  </div>
  <div class="p-1 text-red-500" :class="error ? '' : 'invisible'">{{error || 'Valid'}}</div>
  <div class="pt-5 text-center">
    <Button @click="click">Save</Button>
    <Button @click="dismiss" class="ml-2">Cancel</Button>
  </div>
</template>