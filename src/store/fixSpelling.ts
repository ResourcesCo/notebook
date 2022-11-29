import * as Y from 'yjs'

export default function fixSpelling(text: Y.Text) {
  for (const match of String(text).matchAll(/machiatto\.dev/g)) {
    if (match.index !== undefined) {
      text.delete(match.index, 'macchiato.dev'.length)
      text.insert(match.index, 'macchiato.dev')
    }
  }
}{}