import { ref, Ref, watch, computed } from 'vue'
import { createStore } from "vuex";
import { UserModule } from "~/types";
import { useStorage, StorageLike, usePreferredDark, useToggle } from '@vueuse/core'

let localStorageIfPresent: StorageLike | undefined = undefined

try {
  localStorageIfPresent = window.localStorage
} catch (err) {
}

const getUrlParamSchema = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("color-schema") || "auto"
}

export const colorSchema = localStorageIfPresent ? useStorage('color-schema', 'auto') : ref(getUrlParamSchema()) as Ref<'auto' | 'dark' | 'light'>

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

if (!localStorageIfPresent) {
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
