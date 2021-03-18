export default function join(path: string[]): string {
  return path.map(s => s.includes('/') ? JSON.stringify(s) : s).join('/')
}