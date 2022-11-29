import * as Y from 'yjs'
import { describe, expect, it } from 'vitest'
import updateComponentData from './updateComponentData'

describe('simple', () => {
  it('passes', () => {
    const bq = '```'
    const input = (
`# Testing

[![](https://img.shields.io/badge/%E2%98%95%EF%B8%8F-NotebookView-blue)](https://macchiato.dev/component/#NotebookContent)

${bq}json
{
  "hello": "world"
}
${bq}

Test
`
    )
    const expected = (
`# Testing

[![](https://img.shields.io/badge/%E2%98%95%EF%B8%8F-NotebookView-blue)](https://macchiato.dev/component/#NotebookContent)

${bq}json
{
  "test": "value"
}
${bq}

Test
`
    )
    const doc = new Y.Doc()
    const text = doc.getText('text')
    text.insert(0, input)
    updateComponentData(text, 'NotebookContent', {test: 'value'})
    expect(String(text)).toEqual(expected)
  })
})
