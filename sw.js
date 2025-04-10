self.addEventListener('install', (event) => {
    console.log('Service Worker: Zainstalowany');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker: Aktywny');
  });
  
  self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Przechwycono żądanie do', event.request.url);
  });
  