import * as Y from 'yjs'
import MarkdownIt from "markdown-it"
import ComponentManager from "../components/markdown/ComponentManager"

export default function updateComponentData(yText: Y.Text, name: string, data: any): void {
  const source = yText.toString()
  const componentManager = new ComponentManager({source})
  MarkdownIt({html: true, linkify: true}).use(componentManager.plugin).render(source)
  const component = componentManager.components.find(c => c.tag === name)
  if (component) {
    const lines = source.split("\n")
    const start = (lines.slice(0, component.map[0] + 1).join("\n") + "\n").length
    const end = (lines.slice(0, component.map[1] - 1).join("\n")).length
    yText.delete(start, end - start)
    yText.insert(start, JSON.stringify(data, null, 2))
  }
}