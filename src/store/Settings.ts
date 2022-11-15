import writeMarkdown from '../components/blocks/LocalStorageTools/writeMarkdown'
import getLocalStorage from '../components/blocks/LocalStorageTools/getStorage'

import { ref } from 'vue'

export type Action = {action: 'exportLocalStorage', name: string, data: Blob} | {action: 'importLocalStorage'} | undefined

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
  }
}