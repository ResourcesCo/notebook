<script lang="ts" setup>
import { PropType } from 'vue'
import { Notebook } from '../store/notebook'
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
