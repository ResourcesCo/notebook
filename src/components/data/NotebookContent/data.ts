import { isPlainObject, isString } from "lodash"

export type FileInfo = {emoji: String, title: String, role?: 'settings'}
export type NotebookContentInfo = {files: {[key: string]: FileInfo}}

function validateFile(file: any): boolean {
  if (isPlainObject(file)) {
    return isString(file.emoji) && isString(file.title) && (!('role' in file) || file.role === 'Settings')
  }
  return false
}

export function validate(data: any): data is NotebookContentInfo {
  return (
    isPlainObject(data) &&
    isPlainObject(data['files']) &&
    Object.values(data['files']).every(validateFile)
  )
}