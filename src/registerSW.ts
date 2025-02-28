import { registerSW as registerServiceWorker } from 'virtual:pwa-register';

export function registerSW() {
  if ('serviceWorker' in navigator) {
    const updateSW = registerServiceWorker({
      onNeedRefresh() {
        if (confirm('New content available. Reload?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
    });
  }
}