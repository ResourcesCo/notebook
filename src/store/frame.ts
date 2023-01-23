// Adapted from https://github.com/richardtallent/vite-plugin-singlefile/

// MIT License

// Copyright (c) 2021-present, Richard S. Tallent, II

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export function getScripts(html: string) {
  const reScript = /<script([^>]*?) src="([^"]+)"([^>]*)><\/script>/g
  return [...html.matchAll(reScript)].map(m => m[2])
}

export function replaceScript(html: string, scriptFilename: string, scriptCode: string, removeViteModuleLoader = false): string {
	const reScript = new RegExp(`<script([^>]*?) src="${scriptFilename}"([^>]*)></script>`, 'g')
	const preloadMarker = /"__VITE_PRELOAD__"/g
	const newCode = scriptCode.replaceAll(preloadMarker, "void 0")
	return html.replaceAll(reScript, (_, beforeSrc, afterSrc) => `<script${beforeSrc}${afterSrc}>\n${newCode}\n</script>`)
}

export function getStyles(html: string) {
  const reScript = /<link[^>]*? href="([^"]+)"[^>]*?>/g
  return [...html.matchAll(reScript)].map(m => m[1])
}

export function replaceCss(html: string, scriptFilename: string, scriptCode: string): string {
	const reCss = new RegExp(`<link[^>]*? href="${scriptFilename}"[^>]*?>`, 'g')
	const inlined = html.replaceAll(reCss, `<style>\n${scriptCode}\n</style>`)
	return inlined
}

export class FrameStore {
  buffers: {[key: string]: ArrayBuffer} = {}
  bufferPromises: {[key: string]: Promise<ArrayBuffer>} = {}

  async loadModules() {
    await Promise.allSettled([this.buildPage('edit'), this.buildPage('view')])
  }

  async loadFile(path: string): Promise<ArrayBuffer> {
    const resp = await fetch(path)
    const data = await resp.arrayBuffer()
    this.buffers[path] = data
    return data
  }

  getFile(path: string): Promise<ArrayBuffer> {
    if (path in this.bufferPromises) {
      return this.bufferPromises[path]
    } else {
      const promise = this.loadFile(path)
      this.bufferPromises[path] = promise
      return promise
    }
  }

  unloadModules() {
    this.buffers = {}
  }

  // from generateBundle() in vite-plugin-singlefile
  async replaceHtml(html: string, basePath: string): Promise<string> {
    let replacedHtml = html
    const jsAssets = getScripts(html)
    for (const jsPath of jsAssets) {
      const jsSource = await this.getFile(new URL(jsPath, basePath).pathname)
      replacedHtml = replaceScript(replacedHtml, jsPath, new TextDecoder().decode(jsSource))
    }
    const cssAssets = getStyles(html)
    for (const cssPath of cssAssets) {
      const cssSource = await this.getFile(new URL(cssPath, basePath).pathname)
      replacedHtml = replaceCss(replacedHtml, cssPath, new TextDecoder().decode(cssSource))
    }
    return replacedHtml
  }

  async buildPage(mode: string): Promise<string> {
    const path = `/app/${mode}/index.html`
    let html = new TextDecoder().decode(await this.getFile(path))
    // html = await this.replaceHtml(html, new URL(path, window.location.href).href)
    return html
  }
}
