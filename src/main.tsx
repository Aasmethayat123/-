import {createRoot} from 'react-dom/client';
import {Capacitor} from '@capacitor/core';
import App from './App.tsx';
import './index.css';

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
    // In Web production, register /sw.js with updateViaCache:'none' and auto-reload once
    // when a new Service Worker replaces an older cached controller on mobile browsers.
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
          registration.update().catch(() => {});
        })
        .catch(() => {});
    });
  }
}

createRoot(document.getElementById('root')!).render(<App />);
