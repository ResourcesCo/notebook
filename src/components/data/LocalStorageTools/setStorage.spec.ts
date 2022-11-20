import { beforeEach, describe, expect, it } from 'vitest'
import setStorage from './setStorage'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('empty', () => {
  it('passes', () => {
    localStorage.setItem('x', 'y')
    sessionStorage.setItem('y', 'z')
    expect(localStorage.length).toEqual(1)
    expect(sessionStorage.length).toEqual(1)
    setStorage({local: {}, session: {}})
    expect(localStorage.length).toEqual(0)
    expect(sessionStorage.length).toEqual(0)
  })
})

describe('some in local', () => {
  it('passes', () => {
    localStorage.setItem('x', 'y')
    sessionStorage.setItem('y', 'z')
    expect(localStorage.length).toEqual(1)
    expect(sessionStorage.length).toEqual(1)
    setStorage({local: {x: 'y', a: 'b'}, session: {}})
    expect(localStorage.length).toEqual(2)
    expect(sessionStorage.length).toEqual(0)
  })
})

describe('item in session', () => {
  it('passes', () => {
    localStorage.setItem('x', 'y')
    sessionStorage.setItem('y', 'z')
    expect(localStorage.length).toEqual(1)
    expect(sessionStorage.length).toEqual(1)
    setStorage({local: {}, session: {x: 'y'}})
    expect(localStorage.length).toEqual(0)
    expect(sessionStorage.length).toEqual(1)
  })
})

describe('items in both', () => {
  it('passes', () => {
    expect(localStorage.length).toEqual(0)
    expect(sessionStorage.length).toEqual(0)
    setStorage({session: {x: 'y', z: 'z'}, local: {a1: 'q', a2: 'v', a3: 'r'}})
    expect(localStorage.length).toEqual(3)
    expect(sessionStorage.length).toEqual(2)
    expect(localStorage.getItem('a1')).toEqual('q')
  })
})