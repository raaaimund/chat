'use strict'

// Workbox RuntimeCaching config: https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.RuntimeCachingEntry
module.exports = [
    {
        urlPattern: /[\/]?#([0-9a-zA-Z]*[-]?)*/g,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'start-url',
            expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
            },
            cacheableResponse: {
                statuses: [200, 302, 304]
            }
        }
    },
    {
        urlPattern: /\.favicon.ico$/i,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'app-cache',
            expiration: {
                maxEntries: 4,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
            }
        }
    },
    {
        urlPattern: /\.(?:woff2)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'static-font-assets',
            expiration: {
                maxEntries: 4,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
            }
        }
    },
    {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'static-image-assets',
            expiration: {
                maxEntries: 64,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
        }
    },
    {
        urlPattern: /\/_next\/image\?url=.+$/i,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'next-image',
            expiration: {
                maxEntries: 64,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
        }
    },
    {
        urlPattern: /\.(?:js)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'static-js-assets',
            expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
        }
    },
    {
        urlPattern: /\.(?:css|less)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'static-style-assets',
            expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
        }
    },
    {
        urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'next-data',
            expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
        }
    },
    {
        urlPattern: /\.(?:json|xml|csv)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'static-data-assets',
            expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
        }
    },
    {
        urlPattern: ({ url }) => {
            const isSameOrigin = self.origin === url.origin
            return !isSameOrigin
        },
        handler: 'NetworkFirst',
        options: {
            cacheName: 'cross-origin',
            expiration: {
                maxEntries: 32,
                maxAgeSeconds: 60 * 60 // 1 hour
            },
            networkTimeoutSeconds: 10
        }
    }
]
