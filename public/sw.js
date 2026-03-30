// Service Worker for PWA offline support
const CACHE_NAME = 'skoservice-v1'
const RUNTIME_CACHE = 'skoservice-runtime-v1'

// Core files to cache on install
const PRECACHE_URLS = [
  '/',
  '/unit-converter',
  '/periodic-table',
  '/manifest.json'
]

// Install event - cache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching app shell')
        return cache.addAll(PRECACHE_URLS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name)
              return caches.delete(name)
            })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip chrome extensions and other protocols
  if (!event.request.url.startsWith('http')) return

  event.respondWith(
    caches.open(RUNTIME_CACHE)
      .then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              cache.put(event.request, response.clone())
            }
            return response
          })
          .catch(() => {
            // Network failed, try cache
            return caches.match(event.request)
              .then((cachedResponse) => {
                if (cachedResponse) {
                  return cachedResponse
                }
                
                // Return offline page for navigation requests
                if (event.request.mode === 'navigate') {
                  return caches.match('/')
                }
                
                return new Response('Offline', {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: new Headers({
                    'Content-Type': 'text/plain'
                  })
                })
              })
          })
      })
  )
})

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
