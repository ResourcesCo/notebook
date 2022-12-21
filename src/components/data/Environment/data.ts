import Ajv from 'ajv'
import schema from './schema.json'

export type EnvironmentConfig = {
  [key: string]: string | {secret: true}
}

export function validate(data: any): {data: EnvironmentConfig} | {errors: NonNullable<Ajv['errors']>} {
  const ajv = new Ajv()
  if (ajv.validate(schema, data)) {
    return {
      data: data as EnvironmentConfig
    }
  } else {
    if (ajv.errors) {
      return {errors: ajv.errors}
    } else {
      throw new Error('invalid validation result')
    }
  }
}