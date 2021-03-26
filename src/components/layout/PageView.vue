<script lang="ts">
import { defineComponent, ref, onMounted, PropType, watch } from 'vue'
import { colorScheme } from '../../modules/store'
import type { FrameGroup, Page } from './SplitView.vue'

export default defineComponent({
  props: {
    frames: {
      type: Object as PropType<FrameGroup>,
      required: true,
    },
    page: {
      type: Object as PropType<Page>,
      required: true,
    },
    mode: String,
  },
  setup: (props, _ctx) => {
    const frame = ref()
    onMounted(() => {
      if (props.mode === 'edit') {
        props.frames.code = frame.value
      } else {
        props.frames.view = frame.value
      }
    })
    const handleLoaded = () => {
      if (props.mode === 'edit' && props.frames.code?.contentWindow) {
        props.frames.code.contentWindow.postMessage(['md', props.page.body], '*')
      } else if (props.mode === 'view' && props.frames.view?.contentWindow) {
        props.frames.view.contentWindow.postMessage(['md', props.page.body], '*')
      }
    }
    watch(props.page, () => {
      if (props.mode === 'view' && props.frames.view?.contentWindow) {
        props.frames.view.contentWindow.postMessage(['md', props.page.body], '*')
      }
    })
    const mode = props.mode === 'edit' ? 'edit' : 'view'
    const src = '/app/' + mode + '/?color-scheme=' + colorScheme.value

    return { frame, handleLoaded, src }
  }
})
</script>

<template>
  <iframe
    ref="frame"
    class="h-full w-full"
    :src="src"
    sandbox="allow-scripts allow-popups allow-downloads"
    @load="handleLoaded"
  ></iframe>
</template>