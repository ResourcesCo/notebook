import { isPlainObject, isString } from "lodash"

export type FileInfo = {emoji: string, title: string, role?: 'settings', rename?: string, delete?: true}
export type NotebookContentInfo = {files: {[key: string]: FileInfo}}

const specialFiles = ["_newtab.md", "_welcome.md", "_settings.md"]

function validateFile(entry: [string, any]): boolean {
  const [name, file] = entry
  if (isPlainObject(file)) {
    return (
      name.endsWith('.md') &&
      isString(file.emoji) &&
      isString(file.title) &&
      (!('role' in file) || file.role === 'Settings') &&
      ('delete' in file ? (!specialFiles.includes(name) && file.delete === true && !('rename' in file)) : true) &&
      ('rename' in file ? (!specialFiles.includes(name) && typeof file.rename === 'string') : true)
    )
  }
  return false
}

export function validate(data: any): data is NotebookContentInfo {
  return (
    isPlainObject(data) &&
    isPlainObject(data['files']) &&
    Object.entries(data['files']).every(validateFile)
  )
}