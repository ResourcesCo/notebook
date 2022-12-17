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
    type: Object as PropType<{[key: string]: string}>,
    required: true,
  },
})

const error = ref<string | undefined>()

const data = computed(() => {
  try {
    return {value: JSON.stringify(JSON.parse(props.data), null, 2), err: false}
  } catch (err) {
    return {value: String(err), err: true}
  }
})

async function send() {
  error.value = undefined
  const inputData = JSON.parse(props.data) as RequestModel
  const data: any = {...inputData}
  if (data.input !== undefined) {
    data.input = props.pageData[data.input['$ref']]
  }
  if (data) {
    const result = await props.client.send(data)
    if (isPlainObject(result) && typeof result === 'object' && result !== null) {
      if ('error' in result && typeof result.error === 'string') {
        error.value = result.error
      } else if ('data' in result) {
        console.log('received data', result.data)
      }
    }
  }
  // TODO: replace content in component from inputData.output['$ref']
}
</script>

<template>
  <div class="m-3">
    <div v-if="data.err" class="color-red-500">{{data.value}}</div>
    <template v-if="!data.err">
      <Button @click="send">Send</Button>
      <span v-if="error !== undefined" class="pl-2 color-red-500">{{error}}</span>
    </template>
  </div>
</template>