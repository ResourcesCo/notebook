<script lang="ts">
import { defineComponent, PropType, ref, toRef, watch, onMounted, onBeforeUnmount } from 'vue'
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
    const frame = ref<HTMLIFrameElement | undefined>(undefined)
    const loaded = ref(false)
    const body = toRef(props.page, 'body')
    const onMessage = (e: MessageEvent) => {
      if (
        e.isTrusted &&
        e.source == frame.value?.contentWindow &&
        Array.isArray(e.data) &&
        e.data.length === 2 &&
        e.data[0] === "md"
      ) {
        body.value = e.data[1];
      }
    }
    onMounted(() => {
      window.addEventListener('message', onMessage)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('message', onMessage)
    })
    watch([frame, body, loaded], () => {
      const frameValue = frame.value
      if (loaded.value && frameValue) {
        const contentWindow = frameValue.contentWindow
        if (contentWindow) {
          contentWindow.postMessage(['md', body.value], '*')
        }
      }
    }, { immediate: true })
    watch(colorScheme, () => {
      const contentWindow = frame.value?.contentWindow
      if (contentWindow) {
        contentWindow?.postMessage!(
          ["color-scheme", colorScheme.value],
          "*"
        );
      }
    });

    const mode = props.mode === 'edit' ? 'edit' : 'view'
    const src = '/app/' + mode + '/?color-scheme=' + colorScheme.value
    const onLoad = () => { loaded.value = true }
    return { frame, src, onLoad }
  }
})
</script>

<template>
  <iframe ref="frame" class="h-full w-full" :src="src" sandbox="allow-scripts allow-popups allow-downloads"
    @load="onLoad"></iframe>
</template>