/* eslint-disable import/no-duplicates */

declare interface Window {
  // extend the window
}

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}