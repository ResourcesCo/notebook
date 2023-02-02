import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Data from './Data.vue'

const example = `{}`

describe('Data', () => {
  it('shows error when invalid JSON', async () => {
    const data = mount(Data, {
      props: {
        name: 'invalid.json',
        data: '{',
      },
    })
    expect(data.html()).toContain('SyntaxError')
  })

  it("doesn't error when valid JSON", async () => {
    const data = mount(Data, {
      props: {
        name: 'valid.json',
        data: '{}',
      },
    })
    expect(data.html()).not.toContain('SyntaxError')
  })
})
