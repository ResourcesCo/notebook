import { zipSync, strToU8 } from 'fflate'
import { isPlainObject } from 'lodash'

export function compress(data: any): Uint8Array {
  if (isPlainObject(data)) {
    if (!Object.values(data).every(v => typeof v === 'string')) {
      throw new Error('invalid data')
    }
    const content = data as {[key: string]: string}
    return zipSync(Object.fromEntries(Object.entries(content).map(([k, v]) => ([`data/${k}`, strToU8(v)]))))
  } else {
    throw new Error('invalid data')
  }
}