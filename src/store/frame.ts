import { onMounted, onUnmounted } from 'vue'

export class FrameStore {
  buffers: {[key: string]: ArrayBuffer} = {}
  bufferPromises: {[key: string]: Promise<ArrayBuffer>} = {}

  async loadModules() {
    for (const path of ['/app/view/', '/app/edit/']) {
      this.bufferPromises[path] = this.loadPage(path)
    }
    await Promise.allSettled(Object.values(this.bufferPromises))
  }

  async loadPage(page: string) {
    const resp = await fetch(page)
    const data = await resp.arrayBuffer()
    this.buffers[page] = data
    return data
  }

  unloadModules() {
    this.buffers = {}
  }

  async buildPage(mode: string): Promise<string> {
    const path = `/app/${mode}/`
    let data = this.buffers[path]
    if (data === undefined) {
      const promise = this.bufferPromises[path]
      if (promise !== undefined) {
        await promise
        data = this.buffers[path]
        if (data === undefined) {
          throw new Error(`Page missing: ${path}`)
        }
      } else {
        throw new Error(`Page missing: ${path}`)
      }
    }
    return new TextDecoder().decode(data)
  }
}

export function useFrameStore(): FrameStore {
  const frameStore = new FrameStore()
  onMounted(() => {
    frameStore.loadModules()
  })
  onUnmounted(() => {
    frameStore.unloadModules()
  })
  return frameStore
}