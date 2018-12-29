/*
Service worker code.
Attempts to cache user visited pages and serve offline
 */

//An empty array of files to be cached. Since we cache visited pages here, this is left empty.
// May not be needed but included for completion purpose and to be used in conjunction with install event
const filesToCache = [

];

//Name of the cache
const staticCacheName = 'rr-pages-cache-v1';


//May not be needed but included for completion purpose.
self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
});

/**
 * Fetch event handler and it's function. This function first checks if the requested page is available in cache and serves from cache
 * if it's available. Otherwise attempts a network request to load the same. Once successfully loaded from network, it gets cloned to cache.
 * Supports custom error handling
 */
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                //Clone as response is a stream and can be used only once
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    response => {
                        // Check if we received a valid response
                        if(response.status !== 200) {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(staticCacheName)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// To clear up old caches. May not be needed in our case but included for completion purpose
// Deletes any other cache other than staticCacheName
self.addEventListener('activate', event => {
    const currentCaches = [staticCacheName];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});