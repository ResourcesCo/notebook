import { describe, expect, it } from 'vitest'
import { useNotebook } from './notebook'

describe('Notebook', () => {
  it('creates w/ useNotebook', async () => {
    const notebook = useNotebook()
    expect(notebook).toBeTruthy()
  })

  it('has default pages', async () => {
    const notebook = useNotebook()
    expect(Object.entries(notebook.content.files)).toHaveLength(6)
  })
})
