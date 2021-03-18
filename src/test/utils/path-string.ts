import { isEqual } from 'lodash'
import { split, join } from '../../utils/path-string'

function eq(a: unknown, b: unknown): void {
  if (!isEqual(a, b)) {
    console.error('Assertion failed: expected', a, 'to equal', b)
    throw new Error('Assertion failed')
  }
}

const testSimplePaths = () => {
  const examples: Array<[string, string[]]> = [
    ['a', ['a']],
    ['page/22', ['page', '22']],
    ['a/b/c', ['a', 'b', 'c']],
  ]
  for (const [s, a] of examples) {
    eq(split(s), a)
    eq(join(a), s)
  }
}

const testQuotedPaths = () => {
  const examples: Array<[string, string[]]> = [
    ['"has/a/slash"', ['has/a/slash']],
    ['has a space', ['has a space']],
    ['"has/a/slash"/33', ['has/a/slash', '33']],
    ['33/"has/a/slash"', ['33', 'has/a/slash']],
    ['33/"has   /a/   slash"', ['33', 'has   /a/   slash']],
  ]
  for (const [s, a] of examples) {
    eq(split(s), a)
    eq(join(a), s)
  }
}


export default () => {
  try {
    testSimplePaths()
    testQuotedPaths()
    return true
  } catch (err) {
    return false
  }
}