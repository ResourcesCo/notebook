<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { PropType, ref, computed, watch, onMounted, onBeforeMount, onUnmounted } from 'vue'
import * as Y from 'yjs'
import {saveAs} from 'file-saver'
import { FileData, Notebook } from '@/store/notebook'
import { colorScheme } from '../../store'
import { RequestModel } from '../data/Request'
import SendRequestModal from '../data/Request/SendRequestModal.vue'
import Settings from '../settings/Settings.vue'
import { Container } from '../data/Containers/data'
import { generateSecurityPolicy } from '../data/Containers/policy'
import RequestDispatcher from '../data/Request/RequestDispatcher'
import { compress } from '../data/Download/zip'

const props = defineProps({
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
  filename: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  container: {
    type: Object as PropType<Container>,
    required: true,
  },
})

const srcdoc = ref<string | undefined>(undefined)
const frame = ref<HTMLIFrameElement | undefined>(undefined)
const loadedCount = ref(0)
const initialColorScheme = ref('dark')
const requestDispatcher = ref<RequestDispatcher>()
onBeforeMount(() => {
  initialColorScheme.value = colorScheme.value
})
const mode = computed(() => props.mode === 'edit' ? 'edit' : 'view')
useEventListener('message', (e: MessageEvent) => {
  const contentWindow = frame.value?.contentWindow
  if (
    e.isTrusted &&
    // this only allows the source to be from the current frame
    // - so a child iframe wouldn't be permitted to send this message
    e.source == contentWindow &&
    Array.isArray(e.data) &&
    e.data.length >= 1
  ) {
    if (e.data[0] === 'need-doc' || e.data[0] === 'srcdoc-loaded') {
      loadedCount.value += 1
      if (contentWindow) {
        contentWindow.postMessage(['md-doc', Y.encodeStateAsUpdate(props.file.ydoc)], '*')
      }
    } else if (e.data[0] === "md-update" && e.data.length === 2) {
      const update = e.data[1] as Uint8Array
      props.notebook.applyFileUpdate(props.filename, update, mode.value)
    } else if (e.data[0] === 'request' && e.data.length === 2) {
      const data = JSON.parse(e.data[1]) as RequestModel
      const port = e.ports[0]
      const dispatcher = new RequestDispatcher({notebook: props.notebook, data, container: props.container, port})
      if (dispatcher.status === 'allow') {
        dispatcher.send()
      } else if (dispatcher.status === 'confirm') {
        requestDispatcher.value = dispatcher
      } else if (dispatcher.status === 'deny') {
        dispatcher.sendDenyMessage()
      }
    } else if (e.data[0] === 'download') {
      const data = JSON.parse(e.data[1])
      const blob = new Blob([compress(data)], {type: "application/zip"})
      saveAs(blob, 'data.zip')
    } else if (e.data[0] === 'navigate') {
      const url = e.data[1]
      props.notebook.navigate(url)
    } else if (props.page.isSettings) {
      props.notebook.settingsStore.handleMessage(e.data)
    }
  }
})
const isSettingsView = computed(() => props.page.isSettings && mode.value === 'view')
const csp = computed(() => generateSecurityPolicy(props.container.content))
const frameUrl = ref<string | undefined>(undefined)
watch(colorScheme, () => {
  const contentWindow = frame.value?.contentWindow
  if (contentWindow) {
    contentWindow.postMessage(["color-scheme", colorScheme.value], "*")
  }
})
const onLoad = () => {
  const contentWindow = frame.value?.contentWindow
  if (contentWindow) {
    contentWindow.postMessage(['srcdoc', srcdoc.value])
    contentWindow.postMessage(['color-scheme', colorScheme.value])
  }
}
const handleUpdate = (update: Uint8Array, origin: string | null) => {
  const contentWindow = frame.value?.contentWindow
  if (contentWindow) {
    contentWindow.postMessage(['md-update', update], '*')
  }
}
onMounted(async () => {
  const data = await props.notebook.frameStore.buildPage(mode.value)
  const url = new URL('/api/frame', window.location.href)
  url.searchParams.set('csp', btoa(csp.value))
  url.searchParams.set('color-scheme', colorScheme.value)
  if (props.page.isSettings) {
    url.searchParams.set('role', 'settings')
  }
  frameUrl.value = url.href
  srcdoc.value = data
  props.file.ydoc.on('update', handleUpdate)
  if (props.page.isSettings) {
    props.notebook.resetSettings()
  }
})
onUnmounted(() => {
  props.file.ydoc.off('update', handleUpdate)
})

</script>

<template>
  <iframe
    v-if="srcdoc"
    ref="frame"
    class="h-full w-full"
    :src="frameUrl"
    :style="loadedCount === 0 ? 'visibility: hidden' : ''"
    @load="onLoad"
  ></iframe>
  <Settings v-if="isSettingsView" :notebook="props.notebook"></Settings>
  <SendRequestModal
    v-if="requestDispatcher"
    @close="() => requestDispatcher = undefined"
    :dispatcher="requestDispatcher"
  />
</template>