export interface RequestModel {
  method: string
  url: string
  headers?: {[key: string]: string | boolean}
  input?: {$ref: string}
  output: {$ref: string}
}