import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Diagram from './Diagram.vue'
import { mermaidKey } from './data'

const example = `stateDiagram-v2
[*] --> Still
Still --> [*]
Still --> Moving
Moving --> Still
Moving --> Crash`

describe('mount component', () => {
  it('cannot mount without state', async () => {
    expect(Diagram).toBeTruthy()
    expect(() => {
      mount(Diagram, {
        props: {
          data: example,
        },
      }).html()
    }).toThrowError(/provide/)
  })
})
