import React, { useEffect, useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  WifiOff,
  X,
  DownloadCloud,
  RotateCw,
} from 'lucide-react';
import { Language } from '../types';
import {
  APP_VERSION,
  SW_UPDATE_EVENT,
  applyAppUpdateAndReload,
  checkForAppUpdate,
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

  const runUpdateCheck = async () => {
    setCheckState('checking');
    const result = await checkForAppUpdate();
    if (result.status === 'offline') {
      setCheckState('offline');
      return;
    }
    const timeStr = new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setLastCheckedTime(timeStr);
    if (result.status === 'update-ready') {
      setCheckState('update-ready');
    } else {
      setCheckState('up-to-date');
    }
  };

  useEffect(() => {
    if (isOpen) {
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
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white dark:bg-stone-900 border-t sm:border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-2xl space-y-4 text-start max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile grab handle */}
        <div className="w-10 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
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
                {isAr ? 'تحديث التطبيق' : 'Update Application'}
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

        {/* Status Card */}
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
                  ? 'جاري تحديث ملفات الواجهة وإعادة تشغيل التطبيق...'
                  : 'Refreshing application files and reloading...'}
              </span>
            </div>
          )}

          {checkState === 'up-to-date' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {isAr
                    ? 'التطبيق يعمل بأحدث إصدار متاح حالياً'
                    : 'Your app is running the latest version'}
                </span>
              </div>
              {lastCheckedTime && (
                <p className="text-[11px] text-stone-500 dark:text-stone-400 ps-6">
                  {isAr ? `آخر فحص: ${lastCheckedTime}` : `Last checked: ${lastCheckedTime}`}
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
                  {isAr
                    ? 'لا يوجد اتصال بالإنترنت حالياً'
                    : 'You are currently offline'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 ps-6 leading-relaxed">
                {isAr
                  ? 'يعمل التطبيق بكامل ألعابه دون اتصال، ويمكنك التحقق من التحديثات فور عودة الشبكة.'
                  : 'All games continue working offline. Reconnect to check for new updates.'}
              </p>
            </div>
          )}
        </div>

        {/* Data Safety Guarantee */}
        <div className="rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 p-3.5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed">
            {isAr
              ? 'أمان تقدمك مضمون: تحديث التطبيق يجدّد ملفات الواجهة فقط، ولا يمسح نقاطك أو تقدمك في «جزيرة الأسرار» أو ملاحظاتك في «دفتر رحلتي».'
              : 'Your progress is safe: updating refreshes static files only and never erases your XP, island progress, or journal notes.'}
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
              <span>{isAr ? 'إعادة فحص التحديثات' : 'Check Again'}</span>
            </button>
          )}

          {checkState !== 'offline' && (
            <button
              type="button"
              disabled={checkState === 'applying'}
              onClick={() => handleApplyReload(true)}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <RotateCw className="w-4 h-4 shrink-0" />
              <span>
                {isAr
                  ? 'مسح الكاش المؤقت وإعادة تحميل أحدث نسخة'
                  : 'Clear Static Cache & Reload Fresh'}
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
 * Listens for background Service Worker updates and displays a compact, non-intrusive toast
 * when a newer version is downloaded and waiting.
 */
export const AppUpdateAvailableToast: React.FC<AppUpdateAvailableToastProps> = ({ language }) => {
  const isAr = language === 'ar';
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const handleUpdateReady = () => setVisible(true);
    window.addEventListener(SW_UPDATE_EVENT, handleUpdateReady);
    return () => window.removeEventListener(SW_UPDATE_EVENT, handleUpdateReady);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:start-6 z-50 max-w-sm rounded-2xl bg-stone-900 dark:bg-stone-800 text-white p-3.5 shadow-xl border border-stone-700 flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-2.5 min-w-0">
        <DownloadCloud className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-xs font-bold truncate">
          {isAr ? 'يتوفر تحديث جديد للتطبيق' : 'A new app update is ready'}
        </span>
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
          onClick={() => setVisible(false)}
          aria-label={isAr ? 'تجاهل مؤقتاً' : 'Dismiss'}
          className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
