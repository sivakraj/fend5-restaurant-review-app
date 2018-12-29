/**
 * Service Register code
 */

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then(function(reg) {
            // registration worked
            console.log('Service Worker Registration succeeded. Scope is ' + reg.scope);
        }).catch(function(error) {
        // registration failed
        console.log('Service Worker Registration failed with ' + error);
    });
}