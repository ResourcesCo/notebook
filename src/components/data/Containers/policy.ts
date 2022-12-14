import { ContainerContent, sources } from './data'

// "cdn.jsdelivr.net": {
//   "script": true,
//   "style": true,
//   "media": true,
//   "font": true
// }

// default-src 'self'; image-src 'self' cdn.jsdelivr.net; style-src 'self' cdn.jsdelivr.net;


const removeTrailingSlash = (s: string) => (s.endsWith('/') ? s.substring(0, s.length - 1) : s)


export function generateSecurityPolicy(containerContent: ContainerContent) {
  const policies: {[key: string]: string[]} = {
    'script': [],
    'style': [],
    'img': [],
    'media': [],
    'font': [],
    'connect': [],
  }
  for (const [contentAreaKey, contentArea] of Object.entries(containerContent)) {
    const host = contentArea.host ?? contentAreaKey
    for (const source of sources) {
      const sourceValue = contentArea[source]
      if (host.indexOf('___wildcard') !== -1) {
        throw new Error('Host cannot include string for saving wildcard')
      }
      if (sourceValue === true) {
        policies[source].push(removeTrailingSlash(
          new URL(`https://${host}`.replaceAll('*', '___wildcard')).toString().replaceAll('___wildcard', '*')
        ))
      } else if (sourceValue !== undefined) {
        for (const path of sourceValue.paths) {
          policies[source].push(new URL(path, `https://${host}`.replaceAll('*', '___wildcard')).toString().replaceAll('___wildcard', '*'))
        }
      }
    }
  }
  return [
    "default-src 'self';",
    ['script-src', "'self'", ...policies.script, "'unsafe-eval'", "'unsafe-inline'"].join(' ') + ';',
    ['style-src', "'self'", ...policies.style, "'unsafe-eval'", "'unsafe-inline'"].join(' ') + ';',
    ...(policies.media.length > 0 ? [['media-src', "'self'", ...policies.media].join(' ') + ';'] : []),
    ...(policies.img.length > 0 ? [['img-src', "'self'", ...policies.img].join(' ') + ';'] : []),
    ...(policies.font.length > 0 ? [['font-src', "'self'", ...policies.font].join(' ') + ';'] : []),
    ...(policies.connect.length > 0 ? [['connect-src', "'self'", ...policies.connect].join(' ') + ';'] : []),
    "object-src 'none';",
  ].join(' ')
}