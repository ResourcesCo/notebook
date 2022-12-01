<script lang="ts">
import { useEventListener } from '@vueuse/core'
import { defineComponent, PropType, Ref, ref, computed, watch, onMounted, onBeforeUnmount, onBeforeMount, onUnmounted } from 'vue'
import * as Y from 'yjs'
import { FileData, Notebook } from '~/store/notebook'
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
      type: Object as PropType<{isSettings: boolean}>,
      required: true,
    },
    file: {
      type: Object as PropType<FileData>,
      required: true,
    },
    mode: {
      type: String,
      required: true
    },
  },
  components: {Settings},
  setup: ({notebook, page, file, mode: _mode}, _ctx) => {
    const frame = ref<HTMLIFrameElement | undefined>(undefined)
    const loadedCount = ref(0)
    const initialColorScheme = ref('dark')
    onBeforeMount(() => {
      initialColorScheme.value = colorScheme.value
    })
    const mode = computed(() => _mode === 'edit' ? 'edit' : 'view')
    useEventListener('message', (e: MessageEvent) => {
      if (
        e.isTrusted &&
        e.source == frame.value?.contentWindow &&
        Array.isArray(e.data) &&
        e.data.length >= 1
      ) {
        if (e.data[0] === "md-update" && e.data.length === 2) {
          const update = e.data[1] as Uint8Array
          Y.applyUpdate(file.ydoc, update, mode.value)
          const text = file.ydoc.getText('text').toString()
          file.body = text.length >= 50000 ? text.substring(0, 50000) : text
        } else if (page.isSettings) {
          handleSettingsMessage(e.data, notebook)
        }
      }
    })
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
        contentWindow.postMessage(['md-doc', Y.encodeStateAsUpdate(file.ydoc)], '*')
      }
      loadedCount.value += 1
    }
    const handleUpdate = (update: Uint8Array, origin: string | null) => {
      const contentWindow = frame.value?.contentWindow
      if (contentWindow) {
        contentWindow.postMessage(['md-update', update], '*')
      }
    }
    onMounted(() => {
      file.ydoc.on('update', handleUpdate)
      if (page.isSettings) {
        notebook.resetSettings()
      }
    })
    onUnmounted(() => {
      file.ydoc.off('update', handleUpdate)
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