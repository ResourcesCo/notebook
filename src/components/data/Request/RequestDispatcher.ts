import { pathToRegexp } from 'path-to-regexp'
import { Notebook } from "@/store/notebook"
import { Container, RequestSource } from "../Containers/data"
import { RequestModel } from "./data"

export default class RequestDispatcher {
  notebook: Notebook
  container: Container
  port: MessagePort
  data: RequestModel
  requestSource: true | RequestSource | undefined

  constructor(
    {notebook, container, port, data}:
    {notebook: Notebook, container: Container, port: MessagePort, data: RequestModel}
  ) {
    this.notebook = notebook
    this.container = container
    this.port = port
    this.data = data
    this.initRequestSource()
  }

  initRequestSource(): void {
    const url = new URL(this.data.url)
    const host = url.host
    const contentEntry = Object.entries(this.container.content).find((entry => (
      ((entry[1].host !== undefined ? entry[1].host : entry[0]) === host) && entry[1].request !== undefined
    )))
    if (contentEntry) {
      this.requestSource = contentEntry[1].request
    }
  }

  get status(): 'allow' | 'deny' | 'confirm' {
    const url = new URL(this.data.url)
    const pathname = url.pathname
    const requestSource = this.requestSource
    if (requestSource === true) {
      return 'confirm'
    } else if (this.requestSource !== undefined) {
      const source = this.requestSource as RequestSource
      if (source.allow !== undefined) {
        let allow = false
        for (const allowPath of source.allow) {
          if (pathToRegexp(allowPath).test(pathname)) {
            allow = true
            break
          }
        }
        if (!allow) {
          return 'deny'
        }
      }
      if (source.deny !== undefined) {
        for (const denyPath of source.deny) {
          if (pathToRegexp(denyPath).test(pathname)) {
            return 'deny'
          }
        }
      }
      return source.confirm ? 'confirm' : 'allow'
    }
    return 'deny'
  }

  async send() {
    if (this.status === 'deny') {
      this.sendDenyMessage()
    } else {
      try {
        let contentBody: {} | {body: string} = {}
        let contentHeaders: {[key: string]: string} = {}
        if (this.data.input !== undefined) {
          contentBody = {body: JSON.stringify(this.data)}
          contentHeaders = {'content-type': 'application/json'}
        }
        const res = await fetch(this.data.url, {
          method: this.data.method,
          headers: {
            accept: 'application/json',
            ...this.data.headers,
          },
          ...contentBody,
        })
        const data = await res.json()
        this.port.postMessage({data})
      } catch (e) {
        this.port.postMessage({error: `${e}`})
      }
    }
  }

  sendDenyMessage() {
    this.port.postMessage({error: 'Access denied'})
  }

  sendCancelMessage() {
    this.port.postMessage({error: 'Cancelled'})
  }
}