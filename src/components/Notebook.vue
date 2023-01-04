<script lang="ts" setup>
import { Notebook } from '@/store/notebook'
import { useFrameStore } from '@/store/frame'
import { PropType } from 'vue'
import SplitView from './layout/SplitView.vue'

const {notebook} = defineProps({
  notebook: {
    type: Object as PropType<Notebook>,
    required: true,
  },
})

const frameStore = useFrameStore()

</script>

<template>
  <SplitView :notebook="notebook" :frameStore="frameStore" />
</template>
