export default function parseJson(s: string): any {
  try {
    return JSON.parse(s)
  } catch {
    return undefined
  }
}