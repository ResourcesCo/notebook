import { describe, expect, it } from 'vitest'
import { validate } from './data'

describe('example', () => {
  it('passes', () => {
    const example = {
      "files": {
        "tasks.md": {
          "emoji": "✅",
          "title": "Tasks"
        },
        "scratch-pad.md": {
          "emoji": "📑",
          "title": "Scratch Pad"
        },
        "settings.md": {
          "emoji": "⚙️",
          "title": "Settings",
          "role": "Settings"
        },
        "this-week.md": {
          "emoji": "📆",
          "title": "This Week"
        },
        "design-notes.md": {
          "emoji": "📐",
          "title": "Design Notes"
        }
      }
    }
    expect(validate(example)).toBeTruthy()
  })
})
