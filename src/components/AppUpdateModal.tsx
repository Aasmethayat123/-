import React, { useEffect, useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  WifiOff,
  X,
  DownloadCloud,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import {
  APP_VERSION,
  SW_AUTO_APPLYING_EVENT,
  SW_AUTO_PREF_CHANGED_EVENT,
  SW_UPDATE_EVENT,
  applyAppUpdateAndReload,
  checkForAppUpdate,
  getLastAutoCheckTimestamp,
  isAutoUpdateEnabled,
  setAutoUpdateEnabled,
} from '../utils/appLifecycle';
import { soundManager } from '../utils/audio';

interface AppUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

type CheckState = 'idle' | 'checking' | 'up-to-date' | 'update-ready' | 'offline' | 'applying';

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isAr = language === 'ar';
  const [checkState, setCheckState] = useState<CheckState>('idle');
  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(() => isAutoUpdateEnabled());

  const formatTimestamp = (ts: number) =>
    new Date(ts).toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const runUpdateCheck = async () => {
    setCheckState('checking');
    const result = await checkForAppUpdate();
    if (result.status === 'offline') {
      setCheckState('offline');
      return;
    }
    setLastCheckedTime(formatTimestamp(Date.now()));
    if (result.status === 'update-ready') {
      setCheckState('update-ready');
      if (isAutoUpdateEnabled()) {
        setCheckState('applying');
        window.setTimeout(() => {
          applyAppUpdateAndReload(false).catch(() => {});
        }, 900);
      }
    } else {
      setCheckState('up-to-date');
    }
  };

  useEffect(() => {
    const syncPref = () => setAutoUpdate(isAutoUpdateEnabled());
    window.addEventListener(SW_AUTO_PREF_CHANGED_EVENT, syncPref);
    return () => window.removeEventListener(SW_AUTO_PREF_CHANGED_EVENT, syncPref);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setAutoUpdate(isAutoUpdateEnabled());
      const prevTs = getLastAutoCheckTimestamp();
      if (prevTs) {
        setLastCheckedTime(formatTimestamp(prevTs));
      }
      runUpdateCheck();
    } else {
      setCheckState('idle');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && checkState !== 'applying') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, checkState, onClose]);

  if (!isOpen) return null;

  const handleToggleAutoUpdate = () => {
    soundManager.playSoftTap();
    const next = !autoUpdate;
    setAutoUpdate(next);
    setAutoUpdateEnabled(next);
    if (next && checkState === 'update-ready') {
      setCheckState('applying');
      applyAppUpdateAndReload(false).catch(() => {});
    }
  };

  const handleApplyReload = async (forceUnregister: boolean) => {
    soundManager.playSoftTap();
    setCheckState('applying');
    await applyAppUpdateAndReload(forceUnregister);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
      onClick={() => {
        if (checkState !== 'applying') onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-update-modal-title"
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white dark:bg-stone-900 border-t sm:border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-2xl space-y-4 text-start max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile grab handle */}
        <div className="w-10 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <RefreshCw
                className={`w-4 h-4 ${
                  checkState === 'checking' || checkState === 'applying' ? 'animate-spin' : ''
                }`}
              />
            </div>
            <div className="min-w-0">
              <h3
                id="app-update-modal-title"
                className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-serif truncate"
              >
                {isAr ? 'التحديث التلقائي للتطبيق' : 'Automatic App Updates'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                {isAr ? `الإصدار الحالي v${APP_VERSION}` : `Current Version v${APP_VERSION}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={checkState === 'applying'}
            onClick={onClose}
            aria-label={isAr ? 'إغلاق نافذة التحديث' : 'Close update dialog'}
            className="min-w-[44px] min-h-[44px] -me-2 flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full cursor-pointer transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auto-Update Toggle Card */}
        <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/35 border border-emerald-200/80 dark:border-emerald-800/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
                {isAr ? 'التحديث التلقائي الذكي في الخلفية' : 'Background Auto-Update'}
              </div>
              <div className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                {autoUpdate
                  ? isAr
                    ? 'مفعّل — يتم تنزيل وتفعيل أحدث نسخة تلقائياً دون مقاطعة لعبك'
                    : 'Active — downloads & applies updates automatically between games'
                  : isAr
                  ? 'يدوي — ينبهك التطبيق عند توفر تحديث لتختار وقت التثبيت'
                  : 'Manual — notifies you before applying new updates'}
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={autoUpdate}
              onClick={handleToggleAutoUpdate}
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                autoUpdate
                  ? 'bg-emerald-700 dark:bg-emerald-600'
                  : 'bg-stone-300 dark:bg-stone-700'
              }`}
              aria-label={isAr ? 'تبديل التحديث التلقائي' : 'Toggle automatic updates'}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                  autoUpdate
                    ? isAr
                      ? '-translate-x-6'
                      : 'translate-x-6'
                    : isAr
                    ? '-translate-x-1'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Live Check Status Card */}
        <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 p-4 space-y-2">
          {checkState === 'checking' && (
            <div className="flex items-center gap-2.5 text-xs font-bold text-stone-700 dark:text-stone-200">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
              <span>
                {isAr ? 'جاري التحقق من وجود تحديثات جديدة...' : 'Checking for new updates...'}
              </span>
            </div>
          )}

          {checkState === 'applying' && (
            <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
              <span>
                {isAr
                  ? 'جاري تفعيل التحديث الجديد وإعادة التشغيل بسلاسة...'
                  : 'Applying update and reloading smoothly...'}
              </span>
            </div>
          )}

          {checkState === 'up-to-date' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {isAr
                    ? 'التطبيق محدّث ويعمل بأحدث إصدار حالياً'
                    : 'Your app is running the latest version'}
                </span>
              </div>
              {lastCheckedTime && (
                <p className="text-[11px] text-stone-500 dark:text-stone-400 ps-6">
                  {isAr
                    ? `آخر فحص تلقائي: ${lastCheckedTime} · يفحص دورياً وعند عودة الإنترنت`
                    : `Last checked: ${lastCheckedTime} · Auto-checks periodically & on reconnect`}
                </p>
              )}
            </div>
          )}

          {checkState === 'update-ready' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 dark:text-amber-300">
                <DownloadCloud className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  {isAr
                    ? 'يتوفر تحديث جديد جاهز للتفعيل الآن!'
                    : 'A new update is ready to install!'}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 ps-6 leading-relaxed">
                {isAr
                  ? 'اضغط على «تثبيت التحديث الآن» لتحميل أحدث التحسينات فوراً.'
                  : 'Tap "Install Update Now" to load the latest improvements immediately.'}
              </p>
            </div>
          )}

          {checkState === 'offline' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-extrabold text-stone-700 dark:text-stone-200">
                <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {isAr ? 'لا يوجد اتصال بالإنترنت حالياً' : 'You are currently offline'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 ps-6 leading-relaxed">
                {isAr
                  ? 'جميع الألعاب تعمل بدون اتصال، وسيقوم التطبيق بفحص التحديثات تلقائياً فور عودة الشبكة.'
                  : 'All games continue working offline. Updates will be checked automatically once online.'}
              </p>
            </div>
          )}
        </div>

        {/* Data Safety Guarantee */}
        <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 p-3.5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
            {isAr
              ? 'أمان تقدمك مضمون 100%: التحديث التلقائي أو اليدوي يجدّد ملفات الواجهة فقط، ولا يمسح نقاطك أو أوسمتك أو تقدمك في الألعاب أو «دفتر رحلتي».'
              : 'Your progress is 100% safe: automatic and manual updates refresh interface files only and never erase XP, badges, or journal notes.'}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          {checkState === 'update-ready' ? (
            <button
              type="button"
              onClick={() => handleApplyReload(false)}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <DownloadCloud className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'تثبيت التحديث الآن' : 'Install Update Now'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={checkState === 'checking' || checkState === 'applying'}
              onClick={() => {
                soundManager.playSoftTap();
                runUpdateCheck();
              }}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw
                className={`w-4 h-4 shrink-0 ${checkState === 'checking' ? 'animate-spin' : ''}`}
              />
              <span>{isAr ? 'فحص التحديثات الآن' : 'Check for Updates Now'}</span>
            </button>
          )}

          {checkState !== 'offline' && (
            <button
              type="button"
              disabled={checkState === 'applying'}
              onClick={() => handleApplyReload(true)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <RotateCw className="w-4 h-4 shrink-0" />
              <span>
                {isAr
                  ? 'تحديث الكاش وإعادة تحميل أحدث نسخة'
                  : 'Refresh Static Cache & Reload'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface AppUpdateAvailableToastProps {
  language: Language;
}

/**
 * Listens for background Service Worker updates:
 * - Shows a smooth auto-updating banner when Auto-Update activates on a hub screen.
 * - Shows an action toast when an update is queued during gameplay or in manual mode.
 */
export const AppUpdateAvailableToast: React.FC<AppUpdateAvailableToastProps> = ({ language }) => {
  const isAr = language === 'ar';
  const [mode, setMode] = useState<'hidden' | 'ready' | 'auto-applying'>('hidden');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const handleUpdateReady = () => setMode('ready');
    const handleAutoApplying = () => {
      setUpdating(true);
      setMode('auto-applying');
    };
    window.addEventListener(SW_UPDATE_EVENT, handleUpdateReady);
    window.addEventListener(SW_AUTO_APPLYING_EVENT, handleAutoApplying);
    return () => {
      window.removeEventListener(SW_UPDATE_EVENT, handleUpdateReady);
      window.removeEventListener(SW_AUTO_APPLYING_EVENT, handleAutoApplying);
    };
  }, []);

  if (mode === 'hidden') return null;

  if (mode === 'auto-applying') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:start-6 z-50 max-w-sm rounded-2xl bg-emerald-900 text-white p-3.5 shadow-xl border border-emerald-700 flex items-center gap-2.5 animate-fade-in"
      >
        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
        <span className="text-xs font-bold">
          {isAr
            ? 'تم تنزيل نسخة أحدث — جاري التحديث التلقائي الآن...'
            : 'New version downloaded — auto-updating now...'}
        </span>
      </div>
    );
  }

  const autoOn = isAutoUpdateEnabled();

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:start-6 z-50 max-w-sm rounded-2xl bg-stone-900 dark:bg-stone-800 text-white p-3.5 shadow-xl border border-stone-700 flex items-center justify-between gap-3 animate-fade-in">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <DownloadCloud className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold truncate">
            {isAr ? 'تحديث جديد جاهز للتطبيق' : 'New app update ready'}
          </span>
        </div>
        {autoOn && (
          <p className="text-[10px] text-stone-300 ps-6 mt-0.5 truncate">
            {isAr
              ? 'سيتفعّل تلقائياً عند العودة للرئيسية دون فقدان تقدمك'
              : 'Will auto-apply when you return to Home'}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          disabled={updating}
          onClick={async () => {
            setUpdating(true);
            await applyAppUpdateAndReload(false);
          }}
          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors whitespace-nowrap"
        >
          {updating ? (isAr ? 'جاري التحديث...' : 'Updating...') : isAr ? 'حدّث الآن' : 'Update'}
        </button>
        <button
          type="button"
          onClick={() => setMode('hidden')}
          aria-label={isAr ? 'تجاهل مؤقتاً' : 'Dismiss'}
          className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
