<script lang="ts" setup>
import { PropType } from 'vue'
import Button from '@/components/form/Button.vue'
import DownloadClient from './DownloadClient'

const props = defineProps({
  pageData: {
    type: Object as PropType<{[key: string]: {data: string, replace(s: string): void}}>,
    required: true,
  },
})

function download() {
  const client = new DownloadClient()
  const data = Object.fromEntries(Object.entries(props.pageData).map(([k, v]) => [k, v.data]))
  client.download(data)
}
</script>

<template>
  <div class="m-3">
    <Button @click="download">Download Attachments</Button>
  </div>
</template>