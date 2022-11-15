<script lang="ts">
import { defineComponent, PropType, ref, toRef, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Page } from '../../store/pages'
import { colorScheme } from '../../store'
import { handleMessage as handleSettingsMessage } from '../../store/settings'

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
    const loadedCount = ref(0)
    const body = toRef(props.page, 'body')
    const id = toRef(props.page, 'id')
    const onMessage = (e: MessageEvent) => {
      if (
        e.isTrusted &&
        e.source == frame.value?.contentWindow &&
        Array.isArray(e.data) &&
        e.data.length === 2
      ) {
        if (e.data[0] === "md") {
          body.value = e.data[1]
        } else if (props.page.isSettings) {
          handleSettingsMessage(e.data)
        }
      }
    }
    onMounted(() => {
      window.addEventListener('message', onMessage)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('message', onMessage)
    })
    const mode = computed(() => props.mode === 'edit' ? 'edit' : 'view')
    const src = computed(() => '/app/' + mode.value + '/?color-scheme=' + colorScheme.value)
    watch([frame, body, loadedCount, mode], () => {
      const frameValue = frame.value
      if (loadedCount.value > 0 && frameValue) {
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
        )
      }
    })

    const onLoad = () => { loadedCount.value += 1 }
    return { frame, src, onLoad, id, loadedCount }
  }
})

</script>

<template>
  <iframe ref="frame" class="h-full w-full" :src="src" :style="loadedCount === 0 ? 'visibility: hidden' : ''"
    sandbox="allow-scripts allow-popups allow-downloads" @load="onLoad"></iframe>
</template>