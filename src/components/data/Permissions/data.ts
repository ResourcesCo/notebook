import Ajv from 'ajv'
import schema from './schema.json'

const ajv = new Ajv()

export type Grantee = { file: string }

export type RequestPermission = {
  urlPatterns: string[]
  authorizationEnv: string | string[]
}

export type Permission = {
  grantee: Grantee
  requests: RequestPermission[]
}

export type PermissionSpec = {
  permissions: Permission[]
}

export function validate(data: any): data is PermissionSpec {
  return ajv.validate(schema, data)
}