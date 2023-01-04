import { onMounted, onUnmounted } from 'vue'

export class FrameStore {
  buffers: {[key: string]: ArrayBuffer} = {}

  async loadModules() {
    await Promise.allSettled([
      this.loadPage('/app/view/'),
      this.loadPage('/app/edit/'),
    ])
  }

  async loadPage(page: string) {
    const resp = await fetch(page)
    this.buffers[page] = await resp.arrayBuffer()
  }

  unloadModules() {
    this.buffers = {}
  }

  buildPage(mode: string): string {
    const data = this.buffers[`/app/${mode}/`]
    if (data === undefined) {
      throw new Error('Page missing')
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