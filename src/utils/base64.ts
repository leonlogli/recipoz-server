import stringify from 'fast-json-stable-stringify'

import { isString } from './Util'

type Base64String = string

function toBase64(value: any): Base64String {
  const val = isString(value) ? value : stringify(value)

  return Buffer.from(val, 'utf8').toString('base64')
}

function fromBase64(value: Base64String): string {
  return Buffer.from(value, 'base64').toString('utf8')
}

export { toBase64, fromBase64 }
