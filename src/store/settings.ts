import writeMarkdown from '../components/data/LocalStorageTools/writeMarkdown'
import getLocalStorage from '../components/data/LocalStorageTools/getStorage'
import type { Notebook, NotebookView } from './notebook'

import { ref } from 'vue'
import { NotebookContentInfo } from '@/components/data/NotebookContent'
import { RequestModel } from '@/components/data/Request'
import { PermissionSpec } from '@/components/data/Containers'

export type Action =
  {action: 'exportLocalStorage', name: string, data: Blob} |
  {action: 'importLocalStorage'} |
  {action: 'clearLocalStorage'} |
  {action: 'applyContentChanges', data: NotebookContentInfo} |
  {action: 'applyViewChanges', data: NotebookView} |
  {action: 'applyPermissionChanges', data: PermissionSpec} |
  {action: 'sendRequest', data: RequestModel} |
  undefined

export const action = ref<Action>(undefined)

export function handleMessage(data: any[], notebook: Notebook) {
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
  } else if (data[0] === 'applyContentChanges') {
    action.value = {
      action: 'applyContentChanges',
      data: JSON.parse(data[1]) as NotebookContentInfo,
    }
  } else if (data[0] === 'resetContentChanges') {
    notebook.resetSettings({content: true})
  } else if (data[0] === 'applyViewChanges') {
    action.value = {
      action: 'applyViewChanges',
      data: JSON.parse(data[1]) as NotebookView,
    }
  } else if (data[0] === 'resetViewChanges') {
    notebook.resetSettings({view: true})
  } else if (data[0] === 'applyPermissionChanges') {
    action.value = {
      action: 'applyPermissionChanges',
      data: JSON.parse(data[1]) as PermissionSpec,
    }
  } else if (data[0] === 'resetPermissionChanges') {
    notebook.resetSettings({view: true})
  }
}