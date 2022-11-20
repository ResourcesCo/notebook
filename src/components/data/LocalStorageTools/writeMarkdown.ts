import type { StoragesExport } from "./getStorage"

function mb(s: string) {
  return '`'.repeat(Math.max(3, ...(s.match(/`{3,}/g) || []).map(s => s.length + 1)))
}

function detectType(s: string) {
  try {
    JSON.parse(s)
    return 'json'
  } catch (err) {}
  return 'md'
}

export default function writeMarkdown(data: StoragesExport) {
  let result = ''
  for (const name of ['local', 'session'] as const) {
    for (const [key, value] of Object.entries(data[name])) {
      const [kq, vq] = [mb(key), mb(value)]
      result += (
`${kq}json
${JSON.stringify([name, key])}
${kq}

${vq}${detectType(value)}
${value}
${vq}

`
      )
    }
  }
  return result
}
