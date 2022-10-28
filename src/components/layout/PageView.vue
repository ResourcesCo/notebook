<script lang="ts">
import { defineComponent, PropType, ref, toRef, watchEffect } from 'vue'
import { colorScheme } from '../../modules/store'
import type { Page } from './SplitView.vue'

export default defineComponent({
  props: {
    page: {
      type: Object as PropType<Page>,
      required: true,
    },
    mode: String,
  },
  setup: (props, _ctx) => {
    const frame = toRef(props.page, 'frame')
    const loaded = ref(false)
    watchEffect(() => {
      const frameValue = frame.value
      if (loaded.value && frameValue) {
        const contentWindow = frameValue.contentWindow
        if (contentWindow) {
          contentWindow.postMessage(['md', props.page.body], '*')
        }
      }
    })
    const mode = props.mode === 'edit' ? 'edit' : 'view'
    const src = '/app/' + mode + '/?color-scheme=' + colorScheme.value
    const onLoad = () => { console.log('loaded'); loaded.value = true }
    return { frame, src, onLoad }
  }
})
</script>

<template>
  <iframe ref="frame" class="h-full w-full" :src="src" sandbox="allow-scripts allow-popups allow-downloads"
    @load="onLoad"></iframe>
</template>