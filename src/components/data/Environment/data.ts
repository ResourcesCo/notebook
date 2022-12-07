import Ajv from 'ajv'
import schema from './schema.json'

export type EnvironmentSpec = {[key: string]: string | null}

export function validate(data: any): data is EnvironmentSpec {
  const ajv = new Ajv()
  return ajv.validate(schema, data)
}