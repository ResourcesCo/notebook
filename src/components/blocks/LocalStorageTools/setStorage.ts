import { isString } from "lodash"
import type { StorageExport, StoragesExport } from "./getStorage"

function importStorage(data: StorageExport, storage: Storage) {
  const keysToDelete = new Set([...Array(storage.length).keys()].map(i => storage.key(i)).filter(isString))
  for (const [key, value] of Object.entries(data)) {
    storage.setItem(key, value)
    keysToDelete.delete(key)
  }
  for (const key of keysToDelete) {
    storage.removeItem(key)
  }
}

export default function setStorage(data: StoragesExport) {
  const storages = {local: localStorage, session: sessionStorage}
  for (const storage of ['local', 'session'] as const) {
    importStorage(data[storage], storages[storage])
  }
}
