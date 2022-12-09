<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { defineComponent, PropType, Ref, ref, computed, watch, onMounted, onBeforeUnmount, onBeforeMount, onUnmounted } from 'vue'
import * as Y from 'yjs'
import { FileData, Notebook } from '@/store/notebook'
import { colorScheme } from '../../store'
import { handleMessage as handleSettingsMessage } from '../../store/settings'
import { RequestModel } from '../data/Request'
import SendRequestModal from '../data/Request/SendRequestModal.vue'
import Settings from '../settings/Settings.vue'

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
  mode: {
    type: String,
    required: true
  },
})

const frame = ref<HTMLIFrameElement | undefined>(undefined)
const loadedCount = ref(0)
const initialColorScheme = ref('dark')
const requestModel = ref<RequestModel>()
onBeforeMount(() => {
  initialColorScheme.value = colorScheme.value
})
const mode = computed(() => props.mode === 'edit' ? 'edit' : 'view')
useEventListener('message', (e: MessageEvent) => {
  if (
    e.isTrusted &&
    // this only allows the source to be from the current frame
    // - so a child iframe wouldn't be permitted to send this message
    e.source == frame.value?.contentWindow &&
    Array.isArray(e.data) &&
    e.data.length >= 1
  ) {
    if (e.data[0] === "md-update" && e.data.length === 2) {
      const update = e.data[1] as Uint8Array
      Y.applyUpdate(props.file.ydoc, update, mode.value)
      const text = props.file.ydoc.getText('text').toString()
      props.file.body = text.length >= 50000 ? text.substring(0, 50000) : text
    } else if (e.data[0] === 'request' && e.data.length === 2) {
      requestModel.value = JSON.parse(e.data[1]) as RequestModel
    } else if (props.page.isSettings) {
      handleSettingsMessage(e.data, props.notebook)
    }
  }
})
const isSettingsView = computed(() => props.page.isSettings && mode.value === 'view')
const src = computed(() => (
  '/app/' + mode.value + '/?color-scheme=' + initialColorScheme.value + (props.page.isSettings ? '&role=settings' : '')
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
    contentWindow.postMessage(['md-doc', Y.encodeStateAsUpdate(props.file.ydoc)], '*')
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
  <iframe ref="frame" class="h-full w-full" :src="src" :style="loadedCount === 0 ? 'visibility: hidden' : ''"
    sandbox="allow-scripts allow-popups" @load="onLoad"></iframe>
  <Settings v-if="isSettingsView"></Settings>
  <SendRequestModal v-if="requestModel" @close="() => requestModel = undefined"></SendRequestModal>
</template>