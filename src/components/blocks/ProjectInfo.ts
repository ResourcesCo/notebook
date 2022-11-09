import { isPlainObject, isString } from "lodash"

export type PageInfo = {emoji: String, title: String, role?: 'settings'}
export type ProjectInfo = {left: PageInfo[], right: PageInfo[]}

export function isProjectInfo(data: any): data is ProjectInfo {
  return (
    isPlainObject(data) && ['left', 'right'].map(key => data[key]).every(pages => (
      Array.isArray(pages) && pages.every(page => (
        isString(page.emoji) && isString(page.title) && (!('role' in page) || page.role === 'Settings')
      ))
    ))
  )
}