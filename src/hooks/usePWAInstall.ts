import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __deferredPWAInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

const PWA_STATE_SYNC_EVENT = 'nesma:pwa-install-sync';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.__deferredPWAInstallPrompt) {
      return window.__deferredPWAInstallPrompt;
    }
    return null;
  });
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStandalone = () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    const standalone = checkStandalone();
    setIsStandalone(standalone);
    setIsInstalled(standalone);

    const ua = window.navigator.userAgent.toLowerCase();
    const isIPadOS =
      window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
    const iosDetected = /iphone|ipad|ipod/.test(ua) || isIPadOS;
    const androidDetected = /android/.test(ua);

    setIsIOS(iosDetected);
    setIsAndroid(androidDetected);

    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    if (window.__deferredPWAInstallPrompt) {
      setDeferredPrompt(window.__deferredPWAInstallPrompt);
    }

    const syncFromGlobal = () => {
      setDeferredPrompt(window.__deferredPWAInstallPrompt || null);
      const nowStandalone = checkStandalone();
      if (nowStandalone) {
        setIsStandalone(true);
        setIsInstalled(true);
      }
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__deferredPWAInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleAppInstalled = () => {
      window.__deferredPWAInstallPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.dispatchEvent(new CustomEvent(PWA_STATE_SYNC_EVENT));
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (evt: MediaQueryListEvent) => {
      if (evt.matches) {
        setIsStandalone(true);
        setIsInstalled(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('nesma:pwa-prompt-captured', syncFromGlobal);
    window.addEventListener(PWA_STATE_SYNC_EVENT, syncFromGlobal);
    window.addEventListener('appinstalled', handleAppInstalled);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('nesma:pwa-prompt-captured', syncFromGlobal);
      window.removeEventListener(PWA_STATE_SYNC_EVENT, syncFromGlobal);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      }
    };
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    const activePrompt =
      deferredPrompt ||
      (typeof window !== 'undefined' ? window.__deferredPWAInstallPrompt : null);
    if (!activePrompt) return false;

    try {
      await activePrompt.prompt();
      const { outcome } = await activePrompt.userChoice;
      if (outcome === 'accepted') {
        if (typeof window !== 'undefined') {
          window.__deferredPWAInstallPrompt = null;
          window.dispatchEvent(new CustomEvent(PWA_STATE_SYNC_EVENT));
        }
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
    } catch {
      // Prompt can only be called once per browser event
      if (typeof window !== 'undefined') {
        window.__deferredPWAInstallPrompt = null;
      }
      setDeferredPrompt(null);
    }
    return false;
  }, [deferredPrompt]);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isStandalone,
    isIOS,
    isAndroid,
    isMobileDevice: isIOS || isAndroid,
    isInIframe,
    install,
  };
}
