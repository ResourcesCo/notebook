import writeMarkdown from '../components/data/LocalStorageTools/writeMarkdown'
import getLocalStorage from '../components/data/LocalStorageTools/getStorage'

import { ref } from 'vue'

export type Action =
  {action: 'exportLocalStorage', name: string, data: Blob} |
  {action: 'importLocalStorage'} |
  {action: 'clearLocalStorage'} |
  undefined

export const action = ref<Action>(undefined)

export function handleMessage(data: any[]) {
  if (data[0] === 'exportLocalStorage') {
    action.value = {
      action: 'exportLocalStorage',
      name: `local-storage.md`,
      data: new Blob([writeMarkdown(getLocalStorage())])
    }
  } else if (data[0] === 'importLocalStorage') {
    action.value = {
      action: 'importLocalStorage',
    }
  } else if (data[0] === 'clearLocalStorage') {
    action.value = {
      action: 'clearLocalStorage',
    }
  }
}