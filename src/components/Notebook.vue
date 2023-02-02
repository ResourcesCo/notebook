<script lang="ts" setup>
import { Notebook } from '@/store/notebook'
import { PropType } from 'vue'
import SplitView from './layout/SplitView.vue'

const {notebook} = defineProps({
  notebook: {
    type: Object as PropType<Notebook>,
    required: true,
  },
})

</script>

<template>
  <SplitView :notebook="notebook" />
</template>
