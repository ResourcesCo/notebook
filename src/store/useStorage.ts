import { ref, Ref } from 'vue'
import { useStorage as _useStorage } from '@vueuse/core'
import { join } from '../utils/path-string'
import hasLocalStorage from './hasLocalStorage'

let refs: Map<string, any>

function getKeyedRef(key: string, defaultValue: (ctx: {hasLocalStorage: boolean}) => void): Ref;
function getKeyedRef(key: string, defaultValue: Exclude<any, Function>): Ref {
  if (!refs) {
    refs = new Map()
  }
  if (!refs.has(key)) {
    refs.set(key, ref(defaultValue))
  }
  return refs.get(key)
}

const useStorage = (path: string[], defaultValue: unknown) => {
  const key = join(['rco', ...path])
  const value = typeof defaultValue === 'function' ? defaultValue({hasLocalStorage}) : (defaultValue || null)
  return hasLocalStorage ? _useStorage(key, value) : getKeyedRef(key, value)
}

export default useStorage