import { describe, expect, it } from 'vitest'
import { generateSecurityPolicy } from './policy'

const local = 'null'

describe('default', () => {
  it('just has self', () => {
    const policy = generateSecurityPolicy({})
    expect(policy).toEqual(
      `default-src 'self' ${null};` +
      ` script-src 'self' ${null} 'unsafe-eval' 'unsafe-inline';` +
      ` style-src 'self' ${null} 'unsafe-eval' 'unsafe-inline';` +
      ` object-src 'none';`
    )
  })
})

describe('single media', () => {
  it('has media-src with self and media host', () => {
    const policy = generateSecurityPolicy({'placekitten.com': {media: true}})
    expect(policy).toEqual(
      `default-src 'self' ${null};` +
      ` script-src 'self' ${null} 'unsafe-eval' 'unsafe-inline';` +
      ` style-src 'self' ${null} 'unsafe-eval' 'unsafe-inline';` +
      ` media-src 'self' ${null} https://placekitten.com;` +
      ` object-src 'none';`
    )
  })
})

describe('single style source', () => {
  it('has jsdelivr.net in style', () => {
    const policy = generateSecurityPolicy({'jsdelivr.net': {style: true}})
    expect(policy).toEqual(
      `default-src 'self' ${null};` +
      ` script-src 'self' ${null} 'unsafe-eval' 'unsafe-inline';` +
      ` style-src 'self' ${null} https://jsdelivr.net 'unsafe-eval' 'unsafe-inline';` +
      ` object-src 'none';`
    )
  })
})

describe('script and style source', () => {
  it('has jsdelivr.net in script and style', () => {
    const policy = generateSecurityPolicy({'jsdelivr.net': {script: true, style: true}})
    expect(policy).toEqual(
      `default-src 'self' ${null};` +
      ` script-src 'self' ${null} https://jsdelivr.net 'unsafe-eval' 'unsafe-inline';` +
      ` style-src 'self' ${null} https://jsdelivr.net 'unsafe-eval' 'unsafe-inline';` +
      ` object-src 'none';`
    )
  })
})

describe('wildcard subdomain source', () => {
  it('has wildcard', () => {
    const policy = generateSecurityPolicy({'*.placekitten.com': {media: true}})
    expect(policy).toEqual(
      `default-src 'self' ${null};` +
      ` script-src 'self' ${null} 'unsafe-eval' 'unsafe-inline';` +
      ` style-src 'self' ${null} 'unsafe-eval' 'unsafe-inline';` +
      ` media-src 'self' ${null} https://*.placekitten.com;` +
      ` object-src 'none';`
    )
  })
})

describe('wildcard source', () => {
  it('has wildcard', () => {
    const policy = generateSecurityPolicy({'*': {media: true}})
    expect(policy).toEqual(
      `default-src 'self' ${null};` +
      ` script-src 'self' ${null} 'unsafe-eval' 'unsafe-inline';` +
      ` style-src 'self' ${null} 'unsafe-eval' 'unsafe-inline';` +
      ` media-src 'self' ${null} https://*;` +
      ` object-src 'none';`
    )
  })
})

describe('path source', () => {
  it('has wildcard', () => {
    const policy = generateSecurityPolicy({'jsdelivr.net': {script: {paths: ['/foo', '/baz']}}})
    expect(policy).toEqual(
      `default-src 'self' ${null};` +
      ` script-src 'self' ${null} https://jsdelivr.net/foo https://jsdelivr.net/baz 'unsafe-eval' 'unsafe-inline';` +
      ` style-src 'self' ${null} 'unsafe-eval' 'unsafe-inline';` +
      ` object-src 'none';`
    )
  })
})