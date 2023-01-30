import * as Y from 'yjs'
import { useEventListener } from '@vueuse/core'
import { Ref } from 'vue'

export default function postMessage({mode, haveDoc, yDoc, value}: {mode: 'view' | 'edit', haveDoc: Ref<boolean>, yDoc: Y.Doc, value?: Ref<string>}) {
  function handleMessage(e: MessageEvent) {
    if (
      e.isTrusted &&
      e.source === parent &&
      Array.isArray(e.data) &&
      e.data.length === 2 &&
      ['md-doc', 'md-update'].includes(e.data[0])
    ) {
      const update = e.data[1] as Uint8Array
      if (e.data[0] === 'md-doc') {
        haveDoc.value = true
        Y.applyUpdate(yDoc, update, 'local')
        if (value) {
          value.value = yDoc.getText('text').toString()
        }
      } else if (e.data[0] === 'md-update') {
        if (haveDoc.value === true) {
          Y.applyUpdate(yDoc, update, 'local')
          if (value) {
            value.value = yDoc.getText('text').toString()
          }
        } else {
          parent.postMessage(['need-doc'], '*')
          console.warn("Received update but don't have doc")
        }
      }
    }
  }
  
  yDoc.on('update', (update, origin) => {
    if (mode === 'view') {
      if (origin === 'view') {
        parent.postMessage(['md-update', update], '*')
      } else if (value) {
        value.value = yDoc.getText('text').toString()
      }
    } else if (mode === 'edit') {
      if (typeof origin !== 'string' || !origin.match(/^(local|client|view)\b/)) {
        parent.postMessage(['md-update', update], '*')
      }
    }
  })
  
  const {firstMessageEvent} = window as any
  if (firstMessageEvent.event !== null) {
    setTimeout(() => {
      handleMessage(firstMessageEvent.event)
      delete (window as any)['firstMessageEvent']
    }, 0)
  }
  useEventListener('message', handleMessage)
  
  const checkDoc = setInterval(() => {
    if (haveDoc.value === true) {
      clearInterval(checkDoc)
    } else {
      parent.postMessage(['need-doc'], '*')    
    }
  }, 200)
}