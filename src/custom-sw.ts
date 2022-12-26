/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

registerRoute('/test', async () => {
  return new Response('Test!')
})

registerRoute('/api/frame(.*)', new CacheFirst({
  cacheName: 'frame',
  plugins: [new ExpirationPlugin({maxEntries: 20})]
}))

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))
