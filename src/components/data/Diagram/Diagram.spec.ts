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

  it('tries to render and fails on HappyDOM limitation with context provided', async () => {
    const spy = vi.spyOn(console, 'error')
    const diagram = mount(Diagram, {
      props: {
        data: example,
      },
      global: {
        provide: {
          // @ts-ignore
          [mermaidKey]: {
            initialized: false,
          }
        }
      }
    })
    const lastCall = spy.mock.lastCall
    expect(spy).toHaveBeenCalledOnce()
    expect(lastCall).not.toBeUndefined()
    if (lastCall !== undefined) {
      expect((lastCall[0] || '')).toMatch(/getBBox/)
    }
  })

  it('gets different error with invalid mermaid source', async () => {
    const spy = vi.spyOn(console, 'error')
    const diagram = mount(Diagram, {
      props: {
        data: "asdf",
      },
      global: {
        provide: {
          // @ts-ignore
          [mermaidKey]: {
            initialized: false,
          }
        }
      }
    })
    const lastCall = spy.mock.lastCall
    expect(spy).toHaveBeenCalledOnce()
    expect(lastCall).not.toBeUndefined()
    if (lastCall !== undefined) {
      expect((lastCall[0] || '')).not.toMatch(/getBBox/)
    }
  })
})
