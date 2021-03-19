import { ref, Ref, watch, computed } from 'vue'
import { createStore } from "vuex";
import { UserModule } from "~/types";
import { usePreferredDark, useToggle } from '@vueuse/core'
import hasLocalStorage from '../store/hasLocalStorage'
import useStorage from '../store/useStorage'

const getUrlParamSchema = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("color-schema") || "auto"
}

export const colorSchema = useStorage(
  ['settings', 'color-scheme'], 
  ({hasLocalStorage}: {hasLocalStorage: boolean}) => hasLocalStorage ? getUrlParamSchema() : 'auto'
) as Ref<'auto' | 'dark' | 'light'>

export const subscribers = ref() as Ref<HTMLIFrameElement[] | undefined>

const preferredDark = usePreferredDark()

export const isDark = computed({
  get() {
    return colorSchema.value === 'auto' ? preferredDark.value : colorSchema.value === 'dark'
  },
  set(v: boolean) {
    if (v === preferredDark.value)
      colorSchema.value = 'auto'
    else
      colorSchema.value = v ? 'dark' : 'light'
    if (subscribers.value) {
      for (const iframe of subscribers.value) {
        iframe.contentWindow?.postMessage!(['color-schema', colorSchema.value], '*')
      }
    }
  },
})

export const toggleDark = useToggle(isDark)

watch(
  isDark,
  v => typeof document !== 'undefined' && document.documentElement.classList.toggle('dark', v),
  { immediate: true },
)

if (!hasLocalStorage) {
  window.addEventListener('message', e => {
    if (e.isTrusted && Array.isArray(e.data) && e.data.length === 2 && e.data[0] === 'color-schema') {
      colorSchema.value = e.data[1]
    }
  })
}

export const install: UserModule = ({ app }) => {
  const store = createStore({});
  app.use(store);
};
