import type MarkdownIt from "markdown-it/lib"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import Token from "markdown-it/lib/token"

export default class LiveCheckboxes {
  source: string
  sourceLines: string[]

  constructor({source}: {source: string}) {
    this.source = source
    this.sourceLines = source.split("\n")
  }

  get liveCheckboxRule() {
    return (state: StateCore): boolean => {
      let listItem: Token | undefined = undefined
      for (const token of state.tokens) {
        if (token.type === 'list_item_open' && token.attrGet('class') === 'task-list-item') {
          listItem = token
        }
        if (listItem !== undefined && token.type === 'inline') {
          const checkboxItem = token.children && token.children[0]
          if (checkboxItem && listItem.map) {
            const lineNumber = listItem.map[0]
            const line = this.sourceLines[lineNumber]
            const checks = ['[ ]', '[x]', '[X]']
            const indexes = checks.map(check => line.indexOf(check)).filter(index => index !== -1)
            if (indexes.length > 0) {
              const minIndex = Math.min(...indexes)
              const checked = line.substring(minIndex, minIndex + 3) !== '[ ]'
              const index = this.sourceLines.slice(0, lineNumber).join("\n").length + 1 + minIndex
              checkboxItem.content = `<input type="checkbox"${checked ? ' checked' : ''} data-task-list-index="${index}">`
            }
          }
          listItem = undefined
        }
      }
      return true
    }
  }
  get plugin() {
    const self = this
    return (md: MarkdownIt): void => {
      let counter = 0
      md.core.ruler.push("LiveCheckboxes", self.liveCheckboxRule)
      const renderRule = md.renderer.rules.html_inline
      md.renderer.rules.html_inline = (tokens, idx, options, env, slf) => {
        if (renderRule) {
          return renderRule(tokens, idx, options, env, slf)
        } else {
          return ''
        }
      }
    }
  }
}