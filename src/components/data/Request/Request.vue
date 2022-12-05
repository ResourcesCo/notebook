<script lang="ts" setup>
import { PropType, computed } from 'vue'
import RequestClient from './RequestClient'
import Button from '@/components/form/Button.vue'
import { RequestModel } from './data'

const props = defineProps({
  data: {
    type: String,
    required: true
  },
  client: {
    type: Object as PropType<RequestClient>,
    required: true
  },
})

const data = computed(() => {
  try {
    return {value: JSON.stringify(JSON.parse(props.data), null, 2), err: false}
  } catch (err) {
    return {value: String(err), err: true}
  }
})

function send() {
  const data = JSON.parse(props.data) as RequestModel
  if (data) {
    props.client.send(data)
  }
}
</script>

<template>
  <div class="m-3">
    <div v-if="data.err" class="color-red">{{data.value}}</div>
    <template v-if="!data.err">
      <Button @click="send">Send</Button>
    </template>
  </div>
</template>