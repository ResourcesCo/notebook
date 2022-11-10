import { describe, expect, it } from 'vitest'
import readMarkdown from './readMarkdown'

describe('simple', () => {
  it('passes', () => {
    const bq = '```'
    const input = (
`${bq}json
["local","a"]
${bq}

${bq}md
text
${bq}
`
    )
    const expected = {local: {a: 'text'}, session: {}}
    expect(readMarkdown(input)).toEqual(expected)
  })
})

// describe('multiple', () => {
//   it('passes', () => {
//     const bq = '```'
//     const expected = (
// `${bq}json
// ["local","a"]
// ${bq}

// ${bq}md
// a
// b
// ${bq}

// ${bq}json
// ["session","b"]
// ${bq}

// ${bq}md
// x
// ${bq}

// ${bq}json
// ["session","v"]
// ${bq}

// ${bq}json
// {}
// ${bq}
// `
//     )
//     expect(writeMarkdown({local: {a: 'a\nb'}, session: {b: 'x', v: '{}'}}).trim()).toEqual(expected.trim())
//   })
// })

// describe('fenced', () => {
//   it('passes', () => {
//     const bq3 = '```'
//     const bq4 = '````'
//     const expected = (
// `${bq3}json
// ["local","a"]
// ${bq3}

// ${bq4}md
// ${bq3}
// text
// ${bq3}
// ${bq4}
// `
//     )
//     expect(writeMarkdown({local: {a: '```\ntext\n```'}, session: {}}).trim()).toEqual(expected.trim())
//   })
// })