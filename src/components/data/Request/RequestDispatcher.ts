import { pathToRegexp } from 'path-to-regexp'
import { Notebook } from "@/store/notebook"
import { Container, RequestSource } from "../Containers/data"
import { RequestModel } from "./data"
import jsep, { Identifier, MemberExpression } from 'jsep'
import template, { TemplateElement, TemplateLiteral } from '@jsep-plugin/template'

jsep.plugins.register(template)

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
          contentBody = {body: typeof this.data.input === 'string' ? this.data.input : JSON.stringify(this.data.input)}
          contentHeaders = {'content-type': 'application/json'}
        }
        const headers: {[key: string]: string} = {}
        const includeHeader: {[key: string]: boolean} = {}
        for (const [_k, v] of Object.entries(this.data.headers || {})) {
          const k = _k.toLowerCase()
          if (typeof v === 'string') {
            headers[k] = v
          } else {
            includeHeader[k] = v
          }
        }
        const source = this.requestSource
        const env: {[key: string]: string} = {}
        let secrets: {[key: string]: string} = {}
        try {
          const key = `${this.notebook.prefix}/secrets.json`
          secrets = JSON.parse(localStorage.getItem(key) || '{}') as {[key: string]: string}
        } catch (err) {
          // ignore - empty secrets
        }
        for (const [k, v] of Object.entries(this.notebook.environment)) {
          if (typeof v === 'object' && v.secret === true && typeof secrets[k] === 'string') {
            env[k] = secrets[k]
          }
        }
        if (source !== true && source !== undefined && source.headers) {
          for (const [_k, v] of Object.entries(source.headers)) {
            const k = _k.toLowerCase()
            if (typeof v === 'string') {
              if (!(k in headers)) {
                headers[k] = v
              }
            } else {
              let headerSet = false
              if ('value' in v) {
                if ((v.sendByDefault && !(includeHeader[k] === false && v.allowOmit !== false)) || includeHeader[k] === true) {
                  if ((k in headers) ? (v.allowOverride !== false) : true) {
                    if (typeof v.value === 'object') {
                      if (v.value.$env in env) {
                        headers[k] = env[v.value.$env]
                        headerSet = true
                      } else {
                        throw new Error('Missing environment variable')
                      }
                    } else {
                      headers[k] = v.value
                    }
                  }
                }
              }
              const headerEnv = 'env' in v ? v.env : undefined
              const headerValue = headers[k]
              if (headerValue !== undefined && headerEnv !== undefined && !headerSet) {
                const allowedEnv = (
                  Array.isArray(headerEnv) ?
                  headerEnv :
                  (typeof headerEnv === 'string' ? [headerEnv] : [])
                )
                const ex = jsep('`' + headerValue + '`')
                if (ex.type === 'TemplateLiteral') {
                  const tl = ex as TemplateLiteral
                  let s = ''
                  for (let i=0; i < tl.quasis.length; i++) {
                    // @ts-ignore
                    s += tl.quasis[i].value.cooked
                    if (i < tl.expressions.length) {
                      const ex = tl.expressions[i]
                      if (ex.type === 'MemberExpression') {
                        const me = ex as MemberExpression
                        if (me.object.type === 'Identifier' && me.property.type === 'Identifier') {
                          const envEx = me.object as Identifier
                          const nameEx = me.property as Identifier
                          if (envEx.name === 'env' && allowedEnv.includes(nameEx.name)) {
                            s += env[nameEx.name] || ''
                          }
                        }
                      }
                    }
                  }
                  headers[k] = s
                }
              }
            }
          }
        }
        // for (const [k, v] of this.requestSource)
        console.log(contentBody)
        const res = await fetch(this.data.url, {
          method: this.data.method,
          headers: {
            accept: 'application/json',
            ...contentHeaders,
            ...headers,
          },
          ...contentBody,
        })
        const data = await res.json()
        this.port.postMessage({data})
      } catch (e) {
        console.warn(e)
        this.port.postMessage({error: 'Error sending request'})
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