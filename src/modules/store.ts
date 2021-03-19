import { ref, Ref, watch, computed } from 'vue'
import { createStore } from "vuex";
import { UserModule } from "~/types";
import { usePreferredDark, useToggle } from '@vueuse/core'
import hasLocalStorage from '../store/hasLocalStorage'
import useStorage from '../store/useStorage'

const getUrlParamSchema = () => {
  const params = new URLSearchParams(window.location.search);
  const result = params.get("color-scheme") || 'auto'
  return result
}

export const colorScheme = useStorage(
  ['settings', 'color-scheme'], 
  ({hasLocalStorage}: {hasLocalStorage: boolean}) => hasLocalStorage ? 'auto' : getUrlParamSchema()
) as Ref<'auto' | 'dark' | 'light'>

const preferredDark = usePreferredDark()

export const isDark = computed({
  get() {
    return colorScheme.value === 'auto' ? preferredDark.value : colorScheme.value === 'dark'
  },
  set(v: boolean) {
    if (v === preferredDark.value)
      colorScheme.value = 'auto'
    else
      colorScheme.value = v ? 'dark' : 'light'
  },
})

export const toggleDark = useToggle(isDark)

watch(
  colorScheme,
  setting => {
    if (typeof document === 'undefined') {
      return
    }
    const prefersDark = preferredDark.value
    const dark = setting === 'auto' ? prefersDark : (setting === 'dark')
    document.documentElement.classList[dark ? 'add' : 'remove']("dark");
  },
  { immediate: true },
)

if (!hasLocalStorage) {
  window.addEventListener('message', e => {
    if (e.isTrusted && Array.isArray(e.data) && e.data.length === 2 && e.data[0] === 'color-scheme') {
      colorScheme.value = e.data[1]
    }
  })
}

export const install: UserModule = ({ app }) => {
  const store = createStore({});
  app.use(store);
};
