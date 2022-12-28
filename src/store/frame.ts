export class Frame {
  async loadModules() {
    const manifest = await fetch('/manifest.json')
  }
}

export const frame = new Frame()
