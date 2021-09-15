import { build, files, timestamp } from '$service-worker'

/**
 * Base cache name on the timestamp at build-time. 
 * Different name necesarry to invalidate old versions of the service worker.
 */
const CACHE_NAME = `cache_${timestamp}`

const URLs = [
  ...build,
  ...files
]

// 

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(URLs))
      .then(() => {
        self.skipWaiting()
      })
  )
})

//

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys()
      .then(async (keys) => {
        // delete old caches
        for (const key of keys) {
          if (key !== CACHE_NAME) await caches.delete(key)
        }

        self.clients.claim()
      })
  )
})

// Intercept network requests

self.addEventListener('fetch', (event: FetchEvent) => {

  // Skip if not a GET request 
  if (event.request.method != 'GET') {
    return undefined
  }

  // Skip if request url is not http(s), like if it's a chrome-extension://
  // https://github.com/iamshaunjp/pwa-tutorial/issues/1 // shoutout netninja lolol
  if (!(event.request.url.indexOf('http') == 0)) {
    return undefined
  } 

  // Deal with chrome dev tools issue
  // https://stackoverflow.com/questions/48463483/what-causes-a-failed-to-execute-fetch-on-serviceworkerglobalscope-only-if
  if (
    event.request.cache == 'only-if-cached' && 
    event.request.mode != 'same-origin'
  ) {
    return undefined
  }

  // Try the cache first, falling back to network if not cached yet.
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {

      const response = await cache.match(event.request)

      if (response) {
        // Serve from cache
        return response
      } 
      else {
        // Serve from network
        const response = await fetch(event.request)
        
        // Add fetched response to cache for subsequent requests
        cache.put(event.request, response.clone())

        return response
      }

    })
  )
})
