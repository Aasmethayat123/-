import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import {
  SW_AUTO_APPLYING_EVENT,
  SW_UPDATE_EVENT,
  applyAppUpdateAndReload,
  isAutoUpdateEnabled,
  isSafeScreenForSilentAutoUpdate,
  markPendingSWUpdate,
  recordAutoCheckTimestamp,
  registerGlobalSWUpdater,
} from './utils/appLifecycle';
import './index.css';

// Clean temporary cache-busting query param (`?_updated=...`) after an automatic or manual refresh
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

const AUTO_UPDATE_INTERVAL_MS = 15 * 60 * 1000; // Check every 15 minutes in background

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const isNativeCapacitor = Capacitor.isNativePlatform();

  if (isNativeCapacitor) {
    // In Capacitor Android/iOS native APK/IPA WebView, unregister web SW so bundled local assets load directly
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      })
      .catch(() => {});
  } else {
    const triggerOrQueueUpdate = () => {
      markPendingSWUpdate(true);

      if (isAutoUpdateEnabled() && isSafeScreenForSilentAutoUpdate()) {
        // Notify UI briefly then automatically activate the new version without losing localStorage progress
        window.dispatchEvent(new CustomEvent(SW_AUTO_APPLYING_EVENT));
        window.setTimeout(() => {
          applyAppUpdateAndReload(false).catch(() => {});
        }, 1600);
      } else {
        // User is mid-game/session or chose manual mode: display non-intrusive toast & apply when back on Home
        window.dispatchEvent(new CustomEvent(SW_UPDATE_EVENT));
      }
    };

    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        triggerOrQueueUpdate();
      },
      onRegisteredSW(_swUrl, registration) {
        recordAutoCheckTimestamp();
        if (!registration) return;

        // Watch for newly installed waiting workers
        if (registration.waiting && navigator.serviceWorker.controller) {
          triggerOrQueueUpdate();
        }

        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              triggerOrQueueUpdate();
            }
          });
        });

        const safeCheck = () => {
          if (navigator.onLine === false) return;
          recordAutoCheckTimestamp();
          registration.update().catch(() => {});
        };

        // Periodic automatic background check every 15 minutes
        window.setInterval(safeCheck, AUTO_UPDATE_INTERVAL_MS);

        // Check whenever the user returns to the app or reconnects to the internet
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            safeCheck();
          }
        });
        window.addEventListener('online', safeCheck);
      },
    });

    registerGlobalSWUpdater(updateSW);

    // If an update was queued while the user was inside a game and Auto-Update is ON,
    // apply it automatically as soon as they return to a safe hub screen.
    window.addEventListener('hashchange', () => {
      if (isAutoUpdateEnabled() && isSafeScreenForSilentAutoUpdate()) {
        navigator.serviceWorker
          .getRegistrations()
          .then((regs) => {
            if (regs.some((r) => Boolean(r.waiting))) {
              window.dispatchEvent(new CustomEvent(SW_AUTO_APPLYING_EVENT));
              window.setTimeout(() => {
                applyAppUpdateAndReload(false).catch(() => {});
              }, 1200);
            }
          })
          .catch(() => {});
      }
    });
  }
}

createRoot(document.getElementById('root')!).render(<App />);
