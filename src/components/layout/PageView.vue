<script lang="ts">
import { useEventListener } from '@vueuse/core'
import { defineComponent, PropType, Ref, ref, computed, watch, onMounted, onBeforeUnmount, onBeforeMount, onUnmounted } from 'vue'
import * as Y from 'yjs'
import { Notebook } from '~/store/notebook'
import { colorScheme } from '../../store'
import { handleMessage as handleSettingsMessage } from '../../store/settings'
import Settings from '../settings/Settings.vue'

export default defineComponent({
  props: {
    notebook: {
      type: Object as PropType<Notebook>,
      required: true,
    },
    page: {
      type: Object as PropType<{body: Ref<string>, isSettings: boolean, yDoc: Y.Doc}>,
      required: true,
    },
    mode: {
      type: String,
      required: true
    },
  },
  components: {Settings},
  setup: ({notebook, page, mode: _mode}, _ctx) => {
    const frame = ref<HTMLIFrameElement | undefined>(undefined)
    const lastBodyUpdates = ref<[string, number][]>([])
    const loadedCount = ref(0)
    const prepareSettingsComplete = ref(false)
    const initialColorScheme = ref('dark')
    onBeforeMount(() => {
      initialColorScheme.value = colorScheme.value
    })
    useEventListener('message', (e: MessageEvent) => {
      if (
        e.isTrusted &&
        e.source == frame.value?.contentWindow &&
        Array.isArray(e.data) &&
        e.data.length >= 1
      ) {
        if (e.data[0] === "md-update" && e.data.length === 2) {
          Y.applyUpdate(page.yDoc, e.data[1])
          page.body.value = e.data[1].length >= 50000 ? e.data[1].substring(0, 50000) : e.data[1]
          lastBodyUpdates.value.unshift([e.data[1], Date.now()])
          lastBodyUpdates.value.splice(5)
        } else if (page.isSettings) {
          handleSettingsMessage(e.data, notebook)
        }
      }
    })
    const mode = computed(() => _mode === 'edit' ? 'edit' : 'view')
    const isSettingsView = computed(() => page.isSettings && mode.value === 'view')
    const src = computed(() => (
      '/app/' + mode.value + '/?color-scheme=' + initialColorScheme.value + (page.isSettings ? '&role=settings' : '')
    ))
    watch(colorScheme, () => {
      const contentWindow = frame.value?.contentWindow
      if (contentWindow) {
        contentWindow?.postMessage!(
          ["color-scheme", colorScheme.value],
          "*"
        )
      }
    })
    const onLoad = () => {
      const contentWindow = frame.value?.contentWindow
      if (contentWindow) {
        contentWindow.postMessage(['md-doc', Y.encodeStateAsUpdate(page.yDoc)], '*')
      }
      loadedCount.value += 1
    }
    const handleUpdate = (update: Uint8Array) => {
      const contentWindow = frame.value?.contentWindow
      if (contentWindow) {
        contentWindow.postMessage(['md-update', update], '*')
      }
    }
    onMounted(() => {
      page.yDoc.on('update', handleUpdate)
    })
    onUnmounted(() => {
      page.yDoc.off('update', handleUpdate)
    })
    return { frame, src, onLoad, loadedCount, isSettingsView }
  }
})

</script>

<template>
  <iframe ref="frame" class="h-full w-full" :src="src" :style="loadedCount === 0 ? 'visibility: hidden' : ''"
    sandbox="allow-scripts allow-popups" @load="onLoad"></iframe>
  <Settings v-if="isSettingsView"></Settings>
</template>