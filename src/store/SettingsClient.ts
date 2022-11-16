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
}
