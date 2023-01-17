import _hljs from "highlight.js/lib/core"
import markdown from "highlight.js/lib/languages/markdown"
import xml from "highlight.js/lib/languages/xml"
import css from "highlight.js/lib/languages/css"
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import json from "highlight.js/lib/languages/json"
// @ts-ignore
import _highlight from "markdown-it-highlightjs/core"

_hljs.registerLanguage("xml", xml)
_hljs.registerLanguage("css", css)
_hljs.registerLanguage("javascript", javascript)
_hljs.registerLanguage("typescript", typescript)
_hljs.registerLanguage("json", json)
_hljs.registerLanguage("markdown", markdown)

export const hljs = _hljs
export const highlight = _highlight