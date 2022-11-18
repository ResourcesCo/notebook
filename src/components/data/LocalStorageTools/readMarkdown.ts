import MarkdownIt from "markdown-it"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import type { StoragesExport } from "./getStorage"

type Declaration = ['local' | 'session', string]

function isDeclaration(data: any): data is Declaration {
  return (
    Array.isArray(data) &&
    data.length === 2 &&
    ['local', 'session'].includes(data[0]) &&
    typeof data[1] === 'string'
  )
}

function readDeclaration(content: string): Declaration | undefined {
  if (content.trimStart().startsWith('[')) {
    try {
      const data = JSON.parse(content)
      if (isDeclaration(data)) {
        return data
      }
    } catch (e) {}
  }
  return undefined
}

export default function readMarkdown(s: string): StoragesExport {
  const result: StoragesExport = {local: {}, session: {}}
  const plugin = (md: MarkdownIt): void => {
    md.core.ruler.push('storage', (state: StateCore): boolean => {
      let declaration: Declaration | undefined
      for (const token of state.tokens) {
        if (token.type === 'fence') {
          if (declaration === undefined) {
            declaration = readDeclaration(token.content)
          } else {
            result[declaration[0]][declaration[1]] = token.content.slice(0, -1)
            declaration = undefined
          }
        }
      }
      return true
    })
  }
  MarkdownIt().use(plugin).render(s)
  return result
}
