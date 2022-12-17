export interface RequestModel {
  method: string
  url: string
  headers?: {[key: string]: string}
  input?: {$ref: string}
  output: {$ref: string}
}