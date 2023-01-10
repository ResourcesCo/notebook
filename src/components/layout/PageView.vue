<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { PropType, ref, computed, watch, onMounted, onBeforeMount, onUnmounted } from 'vue'
import * as Y from 'yjs'
import { FileData, Notebook } from '@/store/notebook'
import { FrameStore } from '@/store/frame'
import { colorScheme } from '../../store'
import { handleMessage as handleSettingsMessage } from '../../store/settings'
import { RequestModel } from '../data/Request'
import SendRequestModal from '../data/Request/SendRequestModal.vue'
import Settings from '../settings/Settings.vue'
import { Container } from '../data/Containers/data'
import { generateSrcDoc } from './srcdoc'
import { generateSecurityPolicy } from "../data/Containers/policy"
import RequestDispatcher from '../data/Request/RequestDispatcher'

const props = defineProps({
  notebook: {
    type: Object as PropType<Notebook>,
    required: true,
  },
  frameStore: {
    type: Object as PropType<FrameStore>,
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
      if (contentWindow) {
        contentWindow.postMessage(['md-doc', Y.encodeStateAsUpdate(props.file.ydoc)], '*')
      }
    } else if (e.data[0] === "md-update" && e.data.length === 2) {
      const update = e.data[1] as Uint8Array
      Y.applyUpdate(props.file.ydoc, update, mode.value)
      const text = props.file.ydoc.getText('text').toString()
      props.file.body = text.length >= 50000 ? text.substring(0, 50000) : text
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
    } else if (props.page.isSettings) {
      handleSettingsMessage(e.data, props.notebook)
    }
  }
})
const isSettingsView = computed(() => props.page.isSettings && mode.value === 'view')
// const csp = computed(() => generateSecurityPolicy(props.container.content))
// const src = computed(() => {
//   const colorScheme = initialColorScheme.value
//   const role = props.page.isSettings ? 'settings' : ''
//   const scriptUrl = (
//     mode.value === 'edit' ?
//     new URL("/src/app/edit/main.ts", import.meta.url) :
//     new URL("/src/app/view/main.ts", import.meta.url)
//   )
//   if (role === 'settings') {
//     scriptUrl.searchParams.set('role', 'settings')
//   }
//   const html = generateSrcDoc({colorScheme, scriptUrl: scriptUrl.toString(), csp: csp.value})
//   const url = new URL('/api/frame', window.location.href)
//   if (role === 'settings') {
//     url.searchParams.set('role', 'settings')
//   }
//   url.searchParams.set('color-scheme', colorScheme)
//   if (import.meta.env.PROD) {
//     url.searchParams.set('mode', mode.value)
//   } else {
//     url.searchParams.set('html', btoa(html))
//   }
//   url.searchParams.set('csp', btoa(csp.value))
//   const appUrl = new URL(mode.value === 'edit' ? '/app/edit/' : '/app/view/', window.location.href)
//   return appUrl.href
// })
const frameUrl = computed(() => {
  if (srcdoc.value !== undefined) {
    const url = new URL('/app/frame/', window.location.href)
    const colorScheme = initialColorScheme.value
    url.searchParams.set('color-scheme', colorScheme)
    return url.href
  } else {
    return undefined
  }
})
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
  }
  loadedCount.value += 1
}
const handleUpdate = (update: Uint8Array, origin: string | null) => {
  const contentWindow = frame.value?.contentWindow
  if (contentWindow) {
    contentWindow.postMessage(['md-update', update], '*')
  }
}
onMounted(async () => {
  const data = await props.frameStore.buildPage(mode.value)
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
  <iframe v-if="frameUrl" ref="frame" class="h-full w-full" :src="frameUrl" :style="loadedCount === 0 ? 'visibility: hidden' : ''"
     @load="onLoad"></iframe>
  <Settings v-if="isSettingsView" :notebook="props.notebook"></Settings>
  <SendRequestModal
    v-if="requestDispatcher"
    @close="() => requestDispatcher = undefined"
    :dispatcher="requestDispatcher"
  />
</template>