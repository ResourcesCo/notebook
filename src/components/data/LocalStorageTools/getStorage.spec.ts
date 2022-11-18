import { beforeEach, describe, expect, it } from 'vitest'
import getStorage from './getStorage'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('empty', () => {
  it('passes', () => {
    expect(getStorage()).toEqual({local: {}, session: {}})
  })
})

describe('some in local', () => {
  it('passes', () => {
    localStorage.setItem('x', 'y')
    localStorage.setItem('a', 'b')
    expect(getStorage()).toEqual({local: {x: 'y', a: 'b'}, session: {}})
  })
})

describe('item in session', () => {
  it('passes', () => {
    sessionStorage.setItem('x', 'y')
    expect(getStorage()).toEqual({local: {}, session: {x: 'y'}})
  })
})

describe('items in both', () => {
  it('passes', () => {
    sessionStorage.setItem('x', 'y')
    sessionStorage.setItem('z', 'z')
    localStorage.setItem('a1', 'q')
    localStorage.setItem('a2', 'v')
    localStorage.setItem('a3', 'r')
    expect(getStorage()).toEqual({session: {x: 'y', z: 'z'}, local: {a1: 'q', a2: 'v', a3: 'r'}})
  })
})

describe('sorting', () => {
  it('passes', () => {
    sessionStorage.setItem('z', 'z')
    sessionStorage.setItem('x', 'y')
    localStorage.setItem('a3', 'r')
    localStorage.setItem('a2', 'v')
    localStorage.setItem('a1', 'q')
    expect(getStorage()).toEqual({session: {x: 'y', z: 'z'}, local: {a1: 'q', a2: 'v', a3: 'r'}})
  })
})