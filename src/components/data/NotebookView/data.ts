import { isPlainObject, isString } from "lodash"
import type { NotebookView as NotebookViewType } from '../../../store/notebook'

function validateTabState(tabState: any): boolean {
  if (isPlainObject(tabState)) {
    return (
      isString(tabState.selected) &&
      (tabState.lastSelected === null || isString(tabState.lastSelected)) &&
      Array.isArray(tabState.tabs) &&
      tabState.tabs.every((t: any) => typeof t === 'string') &&
      typeof tabState.show === 'string' &&
      ['self', 'other'].includes(tabState.show)
    )
  }
  return false
}

export function validate(data: any): data is NotebookViewType {
  return (
    isPlainObject(data) &&
    validateTabState(data.left) &&
    validateTabState(data.right)
  )
}