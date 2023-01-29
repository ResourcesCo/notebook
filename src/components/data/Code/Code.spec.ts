import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Code from './Code.vue'

describe('Code', () => {
  it("renders code", async () => {
    const data = mount(Code, {
      props: {
        name: 'hello.js',
        data: 'console.log("Hello, World")',
        info: 'js',
      },
    })
    expect(data.html()).toContain('Hello')
  })
})
