import { RequestModel } from './data'

export default class RequestClient {
  async send(data: RequestModel) {
    const channel = new MessageChannel()
    const promise = new Promise((resolve, reject) => {
      try {
        channel.port1.onmessage = (e) => {
          resolve(e.data)
        }
        parent.postMessage(['request', JSON.stringify(data)], '*', [channel.port2])
      } catch (e) {
        reject(e)
      }
    })
    const result = await promise
    return result
  }
}