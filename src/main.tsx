import {createRoot} from 'react-dom/client';
import {Capacitor} from '@capacitor/core';
import App from './App.tsx';
import {SW_UPDATE_EVENT} from './utils/appLifecycle';
import './index.css';

// Clean temporary cache-busting query param (`?_updated=...`) after a manual refresh
if (typeof window !== 'undefined' && window.location.search.includes('_updated=')) {
  try {
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('_updated');
    const nextPath =
      cleanUrl.pathname +
      (cleanUrl.search ? cleanUrl.search : '') +
      cleanUrl.hash;
    window.history.replaceState(window.history.state, '', nextPath);
  } catch {
    // ignore URL cleanup errors
  }
}

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const isNativeCapacitor = Capacitor.isNativePlatform();

  if (import.meta.env.DEV || isNativeCapacitor) {
    // In Capacitor Android/iOS WebView (https://localhost) or DEV server,
    // unregister any Service Worker so native local assets load directly without SW cache interception.
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      })
      .catch(() => {});

    if ('caches' in window) {
      caches
        .keys()
        .then((keys) => {
          for (const key of keys) {
            if (key.includes('workbox') || key.includes('precache')) {
              caches.delete(key).catch(() => {});
            }
          }
        })
        .catch(() => {});
    }
  } else if (import.meta.env.PROD) {
    // In Web production, register ./sw.js with updateViaCache:'none', emit update notifications,
    // and auto-reload once when a new Service Worker takes control.
    const hadPreviousController = Boolean(navigator.serviceWorker.controller);
    let refreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadPreviousController && !refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js', { scope: './', updateViaCache: 'none' })
        .then((registration) => {
          if (registration.waiting && navigator.serviceWorker.controller) {
            window.dispatchEvent(new CustomEvent(SW_UPDATE_EVENT));
          }

          registration.addEventListener('updatefound', () => {
            const installing = registration.installing;
            if (!installing) return;
            installing.addEventListener('statechange', () => {
              if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                window.dispatchEvent(new CustomEvent(SW_UPDATE_EVENT));
              }
            });
          });

          registration.update().catch(() => {});

          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              registration.update().catch(() => {});
            }
          });
        })
        .catch(() => {});
    });
  }
}

createRoot(document.getElementById('root')!).render(<App />);
