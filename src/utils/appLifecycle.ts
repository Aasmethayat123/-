import { GameMode } from '../types';
import { ALL_36_GAMES } from '../data/gamesCatalog';

export const APP_VERSION = '2.5.0';
export const SW_UPDATE_EVENT = 'nesma:sw-update-available';
export const SW_AUTO_APPLYING_EVENT = 'nesma:sw-auto-applying';
export const SW_AUTO_PREF_CHANGED_EVENT = 'nesma:sw-auto-pref-changed';

const AUTO_UPDATE_STORAGE_KEY = 'nesma_auto_update_enabled_v1';
const LAST_AUTO_CHECK_STORAGE_KEY = 'nesma_last_update_check_ts_v1';

let registeredSWUpdater: ((reloadPage?: boolean) => Promise<void>) | null = null;
let pendingUpdateAvailable = false;

export function registerGlobalSWUpdater(updater: (reloadPage?: boolean) => Promise<void>): void {
  registeredSWUpdater = updater;
}

export function markPendingSWUpdate(available: boolean): void {
  pendingUpdateAvailable = available;
}

export function hasPendingSWUpdate(): boolean {
  return pendingUpdateAvailable;
}

/**
 * Auto-update is enabled by default (`true`) so users always receive new games & fixes seamlessly.
 */
export function isAutoUpdateEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(AUTO_UPDATE_STORAGE_KEY);
    if (raw === null) return true;
    return raw !== 'false';
  } catch {
    return true;
  }
}

export function setAutoUpdateEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTO_UPDATE_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // ignore storage quota errors
  }
  window.dispatchEvent(new CustomEvent(SW_AUTO_PREF_CHANGED_EVENT, { detail: { enabled } }));
}

export function recordAutoCheckTimestamp(ts: number = Date.now()): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LAST_AUTO_CHECK_STORAGE_KEY, String(ts));
  } catch {
    // ignore storage errors
  }
}

export function getLastAutoCheckTimestamp(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LAST_AUTO_CHECK_STORAGE_KEY);
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Checks whether the user is currently on a browse/navigation hub screen (not mid-session/mid-puzzle)
 * so silent automatic updates never interrupt active gameplay or psychological reflections.
 */
export function isSafeScreenForSilentAutoUpdate(): boolean {
  if (typeof window === 'undefined') return false;
  const rawHash = window.location.hash.replace(/^#/, '').trim();
  const safeHubs = new Set(['', 'map', 'library', 'discover', 'projects', 'profile']);
  return safeHubs.has(rawHash);
}

const MODE_LABELS_AR: Partial<Record<GameMode, string>> = {
  map: 'الرئيسية — نسمة حياة',
  'moving-island': 'جزيرة الأسرار المتحركة',
  'nesma-cipher': 'شفرة نسمة',
  library: 'مكتبة الألعاب النفسية',
  'weekly-session': 'الجلسة النفسية الأسبوعية',
  projects: 'المشروعات والتدخلات',
  discover: 'إضاءات ومقالات نفسية',
  'my-journey': 'دفتر رحلتي',
  workshop: 'دليل الورش التفاعلية',
  'zen-puzzle': 'أحجار التوازن',
  'emotion-sort-puzzle': 'فرز قوارير المشاعر',
  'mindful-organizer': 'ترتيب الفوضى والرفوف',
  'hands-control': 'في إيدي / برّا إيدي',
  'break-mountain': 'كسّري الجبل',
};

const MODE_LABELS_EN: Partial<Record<GameMode, string>> = {
  map: 'Home — Nesma Hayat',
  'moving-island': 'Moving Secrets Island',
  'nesma-cipher': 'Nesma Cipher',
  library: 'Games Library',
  'weekly-session': 'Weekly Session',
  projects: 'Projects Hub',
  discover: 'Insights & Readings',
  'my-journey': 'My Journey Notebook',
  workshop: 'Workshop Guide',
  'zen-puzzle': 'Zen Balance Stones',
  'emotion-sort-puzzle': 'Emotion Vials Sort',
  'mindful-organizer': 'Mindful Organizer',
  'hands-control': 'In My Hands / Out of My Hands',
  'break-mountain': 'Break the Mountain',
};

export function getModeDisplayTitle(mode: GameMode, isAr: boolean): string {
  if (isAr && MODE_LABELS_AR[mode]) return MODE_LABELS_AR[mode]!;
  if (!isAr && MODE_LABELS_EN[mode]) return MODE_LABELS_EN[mode]!;

  const catalogMatch = ALL_36_GAMES.find((g) => g.id === mode);
  if (catalogMatch) {
    return isAr ? catalogMatch.nameAr : catalogMatch.nameEn;
  }

  return isAr ? 'نسمة حياة — فكر فيها' : 'Nesma Hayat — Think About It';
}

/**
 * Resolves the clean public URL of the application.
 * Automatically converts private dev preview origins (`ais-dev-*`) into the public shared preview (`ais-pre-*`).
 */
export function resolvePublicAppBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  try {
    const url = new URL(window.location.href);
    if (url.hostname.startsWith('ais-dev-')) {
      url.hostname = url.hostname.replace(/^ais-dev-/, 'ais-pre-');
    }
    url.searchParams.delete('_updated');
    url.hash = '';
    const clean = url.toString();
    return clean.endsWith('/') ? clean.slice(0, -1) : clean;
  } catch {
    return window.location.origin + window.location.pathname;
  }
}

export function buildShareUrl(currentMode: GameMode, scope: 'app' | 'current'): string {
  const base = resolvePublicAppBaseUrl();
  if (!base) return '';
  if (scope === 'current' && currentMode && currentMode !== 'map') {
    return `${base}/#${currentMode}`;
  }
  return `${base}/`;
}

export function buildShareInvitation(
  currentMode: GameMode,
  scope: 'app' | 'current',
  isAr: boolean,
  includeInstallHint = true
): { title: string; text: string; url: string } {
  const url = buildShareUrl(currentMode, scope);
  const installNoteAr = includeInstallHint
    ? ' (يمكنك تثبيته مباشرة على شاشة موبايلك واللعب بدون إنترنت 📲)'
    : '';
  const installNoteEn = includeInstallHint
    ? ' (Installable on your phone home screen & works 100% offline 📲)'
    : '';

  if (scope === 'current' && currentMode !== 'map') {
    const modeTitle = getModeDisplayTitle(currentMode, isAr);
    return {
      title: isAr ? `${modeTitle} | نسمة حياة` : `${modeTitle} | Nesma Hayat`,
      text: isAr
        ? `جرّب تجربة «${modeTitle}» التفاعلية داخل تطبيق نسمة حياة — مساحة هادئة لفك تشابك الأفكار وتهدئة المشاعر${installNoteAr}:`
        : `Try "${modeTitle}" inside Nesma Hayat — an interactive space for clarity, calm, and emotional balance${installNoteEn}:`,
      url,
    };
  }

  return {
    title: isAr
      ? 'فكر فيها — ألعاب نسمة حياة التفاعلية'
      : 'Think About It — Nesma Hayat Interactive Games',
    text: isAr
      ? `جرّب تطبيق «نسمة حياة — فكر فيها»: 54 لعبة نفسية وتفاعلية ومغامرة جزيرة الأسرار المتحركة لفك تشابك الأفكار وتهدئة التوتر${installNoteAr}:`
      : `Explore "Nesma Hayat — Think About It": 54 interactive psychological games and the Moving Secrets Island adventure${installNoteEn}:`,
    url,
  };
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below when Clipboard API is restricted by iframe permissions
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export async function triggerNativeShare(payload: {
  title: string;
  text: string;
  url: string;
}): Promise<'shared' | 'aborted' | 'unsupported'> {
  if (!canUseNativeShare()) return 'unsupported';

  try {
    await navigator.share(payload);
    return 'shared';
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return 'aborted';
    }
    return 'unsupported';
  }
}

export type UpdateCheckResult =
  | { status: 'offline' }
  | { status: 'update-ready'; registration?: ServiceWorkerRegistration }
  | { status: 'up-to-date'; checkedAt: number };

/**
 * Checks for a newer Service Worker or server bundle without altering any localStorage user data.
 */
export async function checkForAppUpdate(): Promise<UpdateCheckResult> {
  if (typeof window === 'undefined') {
    return { status: 'up-to-date', checkedAt: Date.now() };
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { status: 'offline' };
  }

  const now = Date.now();
  recordAutoCheckTimestamp(now);

  if (pendingUpdateAvailable) {
    return { status: 'update-ready' };
  }

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        if (reg.waiting) {
          pendingUpdateAvailable = true;
          return { status: 'update-ready', registration: reg };
        }
        await reg.update();
        if (reg.waiting) {
          pendingUpdateAvailable = true;
          return { status: 'update-ready', registration: reg };
        }
        if (reg.installing) {
          const installedUpdate = await new Promise<boolean>((resolve) => {
            const worker = reg.installing;
            if (!worker) {
              resolve(false);
              return;
            }
            const timeout = window.setTimeout(() => resolve(Boolean(reg.waiting)), 3500);
            worker.addEventListener('statechange', () => {
              if (worker.state === 'installed') {
                window.clearTimeout(timeout);
                resolve(Boolean(navigator.serviceWorker.controller));
              } else if (worker.state === 'redundant') {
                window.clearTimeout(timeout);
                resolve(false);
              }
            });
          });

          if (installedUpdate) {
            pendingUpdateAvailable = true;
            return { status: 'update-ready', registration: reg };
          }
        }
      }
    }

    // Perform a lightweight cache-bypassing HEAD ping to verify live reachability
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 5000);
    await fetch(`${window.location.pathname}?_ping=${now}`, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    })
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));

    return { status: 'up-to-date', checkedAt: now };
  } catch {
    return { status: 'up-to-date', checkedAt: now };
  }
}

/**
 * Clears HTTP/Workbox static asset caches (while keeping localStorage 100% intact),
 * activates any waiting Service Worker, and reloads the app cleanly.
 */
export async function applyAppUpdateAndReload(unregisterServiceWorkers = false): Promise<void> {
  if (typeof window === 'undefined') return;
  pendingUpdateAvailable = false;

  if (!unregisterServiceWorkers && registeredSWUpdater) {
    try {
      await registeredSWUpdater(true);
    } catch {
      // fallback below
    }
  }

  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key).catch(() => false)));
    }
  } catch {
    // ignore cache deletion errors
  }

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        if (unregisterServiceWorkers) {
          await reg.unregister().catch(() => false);
        }
      }
    }
  } catch {
    // ignore SW errors
  }

  // Reload cleanly with a short cache-bust query parameter while preserving current hash route
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('_updated', String(Date.now()));
    window.location.replace(url.toString());
  } catch {
    window.location.reload();
  }
}
