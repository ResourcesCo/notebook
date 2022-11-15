export default class Settings {
  downloadStorage() {
    parent.postMessage(['downloadStorage', undefined], '*')
  }
}
