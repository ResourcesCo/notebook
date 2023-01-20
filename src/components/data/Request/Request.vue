<script lang="ts" setup>
import { PropType, computed, ref } from 'vue'
import RequestClient from './RequestClient'
import Button from '@/components/form/Button.vue'
import { RequestModel } from './data'
import { isPlainObject } from 'lodash'

const props = defineProps({
  data: {
    type: String,
    required: true
  },
  client: {
    type: Object as PropType<RequestClient>,
    required: true
  },
  pageData: {
    type: Object as PropType<{[key: string]: {data: string, replace(s: string): void}}>,
    required: true,
  },
})

const error = ref<string | undefined>()
const message = ref<string | undefined>()

const data = computed(() => {
  try {
    return {value: JSON.stringify(JSON.parse(props.data), null, 2), err: false}
  } catch (err) {
    return {value: String(err), err: true}
  }
})

async function send() {
  error.value = undefined
  message.value = undefined
  const inputData = JSON.parse(props.data) as RequestModel
  const data: any = {...inputData}
  if (data.input !== undefined) {
    data.input = props.pageData[data.input['$ref']].data
  }
  if (data) {
    const result = await props.client.send(data)
    if (isPlainObject(result) && typeof result === 'object' && result !== null) {
      if ('error' in result && typeof result.error === 'string') {
        error.value = result.error
      } else if ('data' in result) {
        message.value = 'Sent!'
        if (data.output !== undefined) {
          props.pageData[data.output['$ref']].replace(JSON.stringify(result.data, null, 2))
        }
      }
    }
  }
}
</script>

<template>
  <div class="m-3">
    <div v-if="data.err" class="color-red-500">{{data.value}}</div>
    <template v-if="!data.err">
      <Button @click="send">Send</Button>
      <span v-if="error !== undefined" class="pl-2 text-red-500">{{error}}</span>
      <span v-if="message !== undefined" class="pl-2 text-slate-700 dark:text-slate-300">{{message}}</span>
    </template>
  </div>
</template>