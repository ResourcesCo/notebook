import { Ref, ref, watch, computed } from 'vue'
import { usePreferredDark, useToggle, useStorage as _useStorage } from '@vueuse/core'

const tryLocalStorage = () => {
  try {
    if (window.localStorage) {
      return true
    }
  } catch (err) {
    // do nothing
  }
  return false
}

const hasLocalStorage = tryLocalStorage()

let refs: Map<string, any>

function getKeyedRef(key: string, defaultValue: (ctx: {hasLocalStorage: boolean}) => void): Ref
function getKeyedRef(key: string, defaultValue: Exclude<any, Function>): Ref {
  if (!refs) {
    refs = new Map()
  }
  if (!refs.has(key)) {
    refs.set(key, ref(defaultValue))
  }
  return refs.get(key)
}

const useStorage = (key: string, defaultValue: unknown) => {
  const value = typeof defaultValue === 'function' ? defaultValue({hasLocalStorage}) : (defaultValue || null)
  return hasLocalStorage ? _useStorage(key, value) : getKeyedRef(key, value)
}

const getUrlParamSchema = () => {
  // @ts-ignore
  const wls: string = typeof window.parentLocationSearch === 'string' ? window.parentLocationSearch : window.location.search
  const params = new URLSearchParams(wls)
  const result = params.get("color-scheme") || 'auto'
  return result
}

export const colorScheme = useStorage(
  'rco/settings/color-scheme',
  ({ hasLocalStorage }: { hasLocalStorage: boolean }) => hasLocalStorage ? 'auto' : getUrlParamSchema()
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
    document.documentElement.classList[dark ? 'add' : 'remove']("dark")
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
