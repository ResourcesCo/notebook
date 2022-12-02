<script lang="ts" setup>
import { PropType } from 'vue'
import RequestClient from './RequestClient'
import Button from '~/components/settings/Button.vue'

const {data, client} = defineProps({
  data: {
    type: String,
    required: true
  },
  client: {
    type: Object as PropType<RequestClient>,
    required: true
  },
})
</script>

<template>
  <Button>Send</Button>
</template>