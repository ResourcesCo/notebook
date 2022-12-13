import { Container, sources } from './data'

// "cdn.jsdelivr.net": {
//   "script": true,
//   "style": true,
//   "media": true,
//   "font": true
// }

// default-src 'self'; image-src 'self' cdn.jsdelivr.net; style-src 'self' cdn.jsdelivr.net;



function generateSecurityPolicy(container: Container) {
  const policies: {[key: string]: string[]} = {
    'connect': [],
    'media': [],
    'script': [],
    'style': [],
    'font': [],
  }
  for (const [contentAreaKey, contentArea] of Object.entries(container.content)) {
    const host = contentArea.host ?? contentAreaKey
    for (const source of sources) {
      const sourceValue = contentArea[source]
      if (host.indexOf('___wildcard') !== -1) {
        throw new Error('Host cannot include string for saving wildcard')
      }
      if (sourceValue === true) {
        policies[source].push(new URL(`https://${host}`.replace('*', '___wildcard')).toString().replace('___wildcard', '*'))
      } else if (sourceValue !== undefined) {
        for (const path of sourceValue.paths) {
          policies[source].push(new URL(path, `https://${host}`).toString().replace('___wildcard', '*'))
        }
      }
    }
  }
  return [
    "default-src 'self';",
    ['script-src', ...policies.script, "'unsafe-eval'", "'unsafe-inline'"].join(' '),
    ['style-src', ...policies.script, "'unsafe-eval'", "'unsafe-inline'"].join(' '),
    ...(policies.connect.length > 0 ? [['connect-src', ...policies.connect].join(' ')] : []),
    ...(policies.media.length > 0 ? [['media-src', ...policies.media].join(' ')] : []),
    ...(policies.font.length > 0 ? [['font-src', ...policies.font].join(' ')] : []),
    "object-src 'none';",
  ].join(' ')
}