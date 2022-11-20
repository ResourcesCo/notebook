import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Tab from './Tab.vue'

describe('mount component', () => {
  it('mounts', async () => {
    expect(Tab).toBeTruthy()

    const tab = mount(Tab, {
      slots: { default: 'chems' }
    })
    expect(tab.text()).toContain('chems')
  })
})
