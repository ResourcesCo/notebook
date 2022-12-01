import { describe, expect, it } from 'vitest'
import * as Y from 'yjs'
import fixSpelling from './fixSpelling'

describe('simple', () => {
  it('passes', () => {
    const doc = new Y.Doc()
    const text = doc.getText('text')
    const input = `machiatto.dev
macchiato.dev
machiatto.dev`
    text.insert(0, input)
    fixSpelling(text)
    expect(String(text)).toEqual(input.replaceAll('machiatto.dev', 'macchiato.dev'))
  })
})