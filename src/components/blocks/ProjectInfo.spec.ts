import { describe, expect, it } from 'vitest'
import { isProjectInfo } from './ProjectInfo'

describe('example', () => {
  it('passes', async () => {
    const example = {
      "left": [
        {
          "emoji": "✅",
          "title": "Tasks"
        },
        {
          "emoji": "📑",
          "title": "Scratch Pad"
        },
        {
          "emoji": "⚙️",
          "title": "Settings",
          "role": "Settings"
        }
      ],
      "right": [
        {
          "emoji": "📆",
          "title": "This Week"
        }, 
        {
          "emoji": "📐", 
          "title": "Design Notes" 
        }
      ]
    }
    expect(isProjectInfo(example)).toBeTruthy()
  })
})
