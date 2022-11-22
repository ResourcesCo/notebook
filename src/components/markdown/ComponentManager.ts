import type MarkdownIt from "markdown-it/lib"
import type StateCore from "markdown-it/lib/rules_core/state_core"

interface ComponentInfo {
  id: number
  tag: string
  data: string
  info?: string
}

export default class ComponentManager {
  source: string
  components: ComponentInfo[]

  constructor({source}: {source: string}) {
    this.source = source
    this.components = []
  }

  get componentRule() {
    const self = this
    let counter = 0
    return (state: StateCore): boolean => {
      let componentTag: {tag: string} | undefined
      for (const token of state.tokens) {
        if (token.type === "inline") {
          const { children } = token
          if (children && children.length > 0) {
            const firstChild = children[0]
            if (firstChild.type === 'link_open') {
              const url = firstChild.attrGet('href')
              if (typeof url === 'string') {
                if (url.startsWith('https://machiatto.dev/component/#')) {
                  const tag = url.split('#', 2)[1]
                  if (tag.length > 0) {
                    firstChild.attrJoin('style', 'display: none;')
                    componentTag = {tag}
                  }
                }
              }
            }
          }
        } else if (token.type === 'fence' && componentTag) {
          const component = {
            id: counter,
            tag: componentTag.tag,
            data: token.content,
            info: token.info,
          }
          self.components.push(component)
          token.attrSet('componentTag', `${component.id}`)
          componentTag = undefined
          counter += 1
        }
      }
      return true
    }
  }

  get plugin() {
    const self = this
    return (md: MarkdownIt): void => {
      let counter = 0
      md.core.ruler.push("component", self.componentRule)
      const oldFence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
        const token = tokens[idx]
        const componentTag = token.attrGet('componentTag')
        if (componentTag) {
          const component = self.components[counter]
          counter += 1
          return `{{${component.tag}-${component.id}}}`
        }
        if (oldFence) {
          return oldFence(tokens, idx, options, env, slf)
        } else {
          return ''
        }
      }
    }
  }
}
