import Ajv from 'ajv'
import schema from './schema.json'

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

export function validate(data: any): {data: PermissionSpec} | {errors: NonNullable<Ajv['errors']>} {
  const ajv = new Ajv()
  if (ajv.validate(schema, data)) {
    return {
      data: data as PermissionSpec
    }
  } else {
    if (ajv.errors) {
      return {errors: ajv.errors}
    } else {
      throw new Error('invalid validation result')
    }
  }
}