export default function updateComponentData(input: string, name: string, data: any): string {
  const fencedData = "```json\n" + JSON.stringify(data, null, 2) + "\n```\n\n"
  const url = `https://machiatto.dev/component/#${name}`
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
      const beforeFence = input.substring(0, openFenceStart)
      const afterFence = input.substring(closeFenceEnd)
      return beforeFence + fencedData + afterFence
    }
  }
  return input + `\n\n[![](https://img.shields.io/badge/%E2%98%95%EF%B8%8F-${name}-blue)](https://machiatto.dev/component/#${name})\n\n${fencedData}\n\n`
}