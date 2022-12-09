export default class Settings {
  exportLocalStorage() {
    parent.postMessage(['exportLocalStorage'], '*')
  }
  importLocalStorage() {
    parent.postMessage(['importLocalStorage'], '*')
  }
  clearLocalStorage() {
    parent.postMessage(['clearLocalStorage'], '*')
  }
  applyContentChanges(data: any) {
    parent.postMessage(['applyContentChanges', JSON.stringify(data)], '*')
  }
  resetContentChanges() {
    parent.postMessage(['resetContentChanges'], '*')
  }
  applyViewChanges(data: any) {
    parent.postMessage(['applyViewChanges', JSON.stringify(data)], '*')
  }
  resetViewChanges() {
    parent.postMessage(['resetViewChanges'], '*')
  }
  applyPermissionChanges(data: any) {
    parent.postMessage(['applyPermissionChanges', JSON.stringify(data)], '*')
  }
  resetPermissionChanges() {
    parent.postMessage(['resetPermissionChanges'], '*')
  }
}
