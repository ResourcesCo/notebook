export default function split(path: string): string[] {
  const a = []
  let multi: string | undefined
  for (const s of path.split('/')) {
    if (multi) {
      multi += '/' + s
    } else if (s.startsWith('"')) {
      multi = s
    } else {
      a.push(s)
    }
    
    let parsed: unknown
    if (multi) {
      try {
        parsed = JSON.parse(multi)
      } catch (err) {
        // do nothing
      }
      if (typeof parsed === 'string') {
        a.push(parsed)
        multi = undefined
      }
    }
  }
  return a
}