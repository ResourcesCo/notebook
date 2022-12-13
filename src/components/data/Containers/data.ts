import Ajv from 'ajv'
import schema from './schema.json'

type HeaderValue = string
type HeaderEnv = {
  [key: string]: string | {$env: string}
}
type HeaderWithValue = {
  value: string
  env?: HeaderEnv
  sendByDefault?: boolean   // defaults to true; if false, allow sending by passing true for the header
  allowOmit?: boolean  // if sendByDefault is true, allow passing false as the header and not sending
  allowOverride?: boolean  // allow passing an interpolable string as header and using that value instead
}
type HeaderWithoutValue = {
  env: HeaderEnv
}

export type RequestSource = {
  headers?: {
    [key: string]: HeaderValue | HeaderEnv | HeaderWithValue | HeaderWithoutValue
  }
  confirm?: true  // if true, show confirmation dialog
  allow?: []  // URL patterns (adds host if not present) to allow (if omitted, allow all; if empty, allow none)
  deny?: []  // URL patterns (adds host if not present) to deny (overrides those in allow)
  // TODO: add throttling/rate limiting
}

export type ContentSource = {
  paths: string[]
}

export const sources = [
  'connect',
  'media',
  'script',
  'style',
  'font',
] as const

export type ContentArea = {
  host?: string  // if omitted, use the key
  request?: RequestSource | true
  connect?: ContentSource | true
  media?: ContentSource | true
  script?: ContentSource | true
  style?: ContentSource | true
  font?: ContentSource | true
}

export type ContainerContent = {
  [key: string]: ContentArea
}

export type Container = {
  pages: string | string[]
  content: ContainerContent,
}

export type ContainerConfig = {
  containers: {
    [key: string]: Container
  }
}

export function validate(data: any): {data: ContainerConfig} | {errors: NonNullable<Ajv['errors']>} {
  const ajv = new Ajv()
  if (ajv.validate(schema, data)) {
    return {
      data: data as ContainerConfig
    }
  } else {
    if (ajv.errors) {
      return {errors: ajv.errors}
    } else {
      throw new Error('invalid validation result')
    }
  }
}