import type MarkdownIt from "markdown-it/lib"
import type StateCore from "markdown-it/lib/rules_core/state_core"

export default function componentPlugin(md: MarkdownIt): void {
  md.core.ruler.push("component", componentRule)
  const oldFence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const component = token.attrGet('component')
    if (component) {
      return component
    }
    if (oldFence) {
      return oldFence(tokens, idx, options, env, slf)
    } else {
      return ''
    }
  }
}

function componentRule(state: StateCore): boolean {
  let component: {name: string} | undefined
  for (const token of state.tokens) {
    console.log(token.type)
    if (token.type === "inline") {
      const { children } = token
      if (children && children.length > 0) {
        const firstChild = children[0]
        if (firstChild.type === 'link_open') {
          const url = firstChild.attrGet('href')
          if (typeof url === 'string') {
            if (url.startsWith('https://machiatto.dev/component/#')) {
              const name = url.split('#', 2)[1]
              if (name.length > 0) {
                firstChild.attrJoin('style', 'display: none;')
                console.log('setting component')
                component = {name}
              }
            }
          }
        }
      }
    } else if (token.type === 'fence' && component) {
      token.attrSet('component', component.name)
      component = undefined
    }
  }
  return true
}