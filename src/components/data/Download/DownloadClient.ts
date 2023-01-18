export default class DownloadClient {
  async download(data: any) {
    parent.postMessage(['download', JSON.stringify(data)], '*')
  }
}