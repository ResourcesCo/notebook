<script lang="ts">
import { useEventListener } from '@vueuse/core'
import { defineComponent, PropType, Ref, ref, computed, watch, onMounted, onBeforeUnmount, onBeforeMount } from 'vue'
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
      type: Object as PropType<{body: Ref<string>, isSettings: boolean}>,
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
    const lastBodyUpdate = ref<string | undefined>(undefined)
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
        if (e.data[0] === "md" && e.data.length === 2) {
          page.body.value = e.data[1]
          lastBodyUpdate.value = e.data[1]
        } else if (page.isSettings) {
          handleSettingsMessage(e.data, notebook)
        }
      }
    })
    const mode = computed(() => _mode === 'edit' ? 'edit' : 'view')
    const src = computed(() => '/app/' + mode.value + '/?color-scheme=' + initialColorScheme.value)
    const isSettingsView = computed(() => page.isSettings && mode.value === 'view')
    watch([page.body, frame, loadedCount, mode], () => {
      const frameValue = frame.value
      if (loadedCount.value > 0 && frameValue) {
        const contentWindow = frameValue.contentWindow
        if (contentWindow && (mode.value === 'view' || (lastBodyUpdate.value !== page.body.value))) {
          contentWindow.postMessage(['md', page.body.value], '*')
        }
        if (mode.value === 'edit' && !prepareSettingsComplete.value) {
          prepareSettingsComplete.value = true
          const self = this
          setTimeout(() => {
            notebook.resetSettings()
          }, 50)
        }
      }
    })
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
    return { frame, src, onLoad, loadedCount, isSettingsView }
  }
})

</script>

<template>
  <iframe ref="frame" class="h-full w-full" :src="src" :style="loadedCount === 0 ? 'visibility: hidden' : ''"
    sandbox="allow-scripts allow-popups allow-downloads" @load="onLoad"></iframe>
  <Settings v-if="isSettingsView"></Settings>
</template>