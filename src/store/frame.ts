import { onMounted, onUnmounted } from 'vue'

export class FrameStore {
  buffers: {[key: string]: ArrayBuffer} = {}

  async loadModules() {
    await Promise.allSettled([
      this.loadPage('/app/view/view'),
      this.loadPage('/app/view/edit'),
    ])
  }

  async loadPage(page: string) {
    const resp = await fetch(page)
    this.buffers[page] = await resp.arrayBuffer()
  }

  unloadModules() {
    this.buffers = {}
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