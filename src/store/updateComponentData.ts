import * as Y from 'yjs'

export default function updateComponentData(yText: Y.Text, name: string, data: any): void {
  const input = yText.toString()
  const fencedData = "```json\n" + JSON.stringify(data, null, 2) + "\n```\n\n"
  const url = `https://macchiato.dev/component/#${name}`
  const pastUrlIndex = input.indexOf(url) + url.length
  const pastUrl = input.substring(pastUrlIndex)
  const openFenceMatch = /^(`{3,}).*\n/m.exec(pastUrl)
  if (openFenceMatch) {
    const openFenceStart = pastUrlIndex + openFenceMatch.index
    const openFenceBlock = openFenceMatch[0]
    const fence = openFenceMatch[1]
    const openFenceEnd = openFenceStart + openFenceBlock.length
    const afterOpenFence = input.substring(openFenceEnd)
    const closeFenceRegexp = new RegExp(`^${fence}\\s*\\n`, 'm')
    const closeFenceMatch = closeFenceRegexp.exec(afterOpenFence)
    if (closeFenceMatch) {
      const closeFenceStart = openFenceEnd + closeFenceMatch.index
      const closeFenceEnd = closeFenceStart + closeFenceMatch[0].length
      yText.delete(openFenceStart, closeFenceEnd - openFenceStart)
      yText.insert(openFenceStart, fencedData)
      return
    }
  }
  yText.insert(input.length, `\n\n[${name}](https://macchiato.dev/component/#${name})\n\n${fencedData}\n\n`)
}