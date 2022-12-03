import { RequestModel } from './data'

export default class RequestClient {
  send(data: RequestModel) {
    parent.postMessage(['request', JSON.stringify({data})], '*')
  }
}