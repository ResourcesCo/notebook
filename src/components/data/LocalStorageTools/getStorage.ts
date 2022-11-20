import { isString } from "lodash"

export type StorageExport = {[key: string]: string}
export type StoragesExport = {local: StorageExport, session: StorageExport}

function exportStorage(storage: Storage): StorageExport {
  const keys = [...Array(storage.length).keys()].map(i => storage.key(i)).filter(isString)
  return Object.fromEntries(
    keys
    .sort()
    .map(key => [key, storage.getItem(key)])
    .filter(([key, value]) => value !== null)
  )
}

/**
 * Get entire localStorage and sessionStorage from browser
 */
export default function getLocalStorage(): StoragesExport {
  return {local: exportStorage(localStorage), session: exportStorage(sessionStorage)}
}