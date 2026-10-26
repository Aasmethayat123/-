import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  Share,
  MoreVertical,
  PlusSquare,
  ExternalLink,
  Copy,
  Check,
  WifiOff,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Language } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { copyTextToClipboard, resolvePublicAppBaseUrl } from '../utils/appLifecycle';
import { soundManager } from '../utils/audio';

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AppInstallModal: React.FC<AppInstallModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isAr = language === 'ar';
  const {
    isInstallable,
    isInstalled,
    isStandalone,
    isIOS,
    isAndroid,
    isInIframe,
    install,
  } = usePWAInstall();

  const [guideTab, setGuideTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [installingNow, setInstallingNow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGuideTab(isIOS ? 'ios' : 'android');
      setCopiedUrl(false);
    }
  }, [isOpen, isIOS]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const publicUrl = `${resolvePublicAppBaseUrl()}/`;
  const alreadyInstalled = isStandalone || isInstalled;

  const handleDirectInstall = async () => {
    soundManager.playSoftTap();
    setInstallingNow(true);
    const accepted = await install();
    setInstallingNow(false);
    if (accepted) {
      onClose();
    }
  };

  const handleCopyInstallUrl = async () => {
    soundManager.playSoftTap();
    const ok = await copyTextToClipboard(publicUrl);
    if (ok) {
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2800);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-install-modal-title"
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3
                id="app-install-modal-title"
                className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-serif truncate"
              >
                {isAr ? 'تثبيت التطبيق على الموبايل' : 'Install App on Mobile'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                {isAr
                  ? 'أيقونة مستقلة على شاشتك الرئيسية ويعمل بدون إنترنت'
                  : 'Standalone home screen app with full offline play'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق نافذة التثبيت' : 'Close install dialog'}
            className="min-w-[44px] min-h-[44px] -me-2 flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Already Installed State */}
        {alreadyInstalled && (
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">
                {isAr ? 'التطبيق مثبّت بالفعل على جهازك ✓' : 'App is already installed ✓'}
              </div>
              <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
                {isAr
                  ? 'يمكنك فتح «نسمة حياة» مباشرة من الشاشة الرئيسية واستخدام جميع الـ 54 لعبة بدون إنترنت مع تحديث تلقائي مستمر.'
                  : 'You can launch Nesma Hayat directly from your home screen with 100% offline access and automatic updates.'}
              </p>
            </div>
          </div>
        )}

        {/* Direct One-Tap Native Browser Install (Chromium / Android / Edge / Samsung) */}
        {!alreadyInstalled && isInstallable && (
          <div className="rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 space-y-3">
            <div className="text-xs font-extrabold text-emerald-950 dark:text-emerald-100">
              {isAr
                ? 'جهازك جاهز للتثبيت المباشر بضغطة واحدة!'
                : 'Your device supports instant one-tap installation!'}
            </div>
            <button
              type="button"
              disabled={installingNow}
              onClick={handleDirectInstall}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>
                {installingNow
                  ? isAr
                    ? 'جاري فتح نافذة التثبيت...'
                    : 'Opening installer...'
                  : isAr
                  ? 'تثبيت التطبيق الآن على الجهاز'
                  : 'Install App Now'}
              </span>
            </button>
          </div>
        )}

        {/* Embedded Preview Frame Helper (when opened inside an iframe) */}
        {!alreadyInstalled && !isInstallable && isInIframe && (
          <div className="rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 p-3.5 space-y-2.5">
            <p className="text-xs font-bold text-amber-950 dark:text-amber-200 leading-relaxed">
              {isAr
                ? 'لتثبيت التطبيق على الموبايل، افتح الرابط المباشر في متصفح الهاتف (Chrome أو Safari) خارج نافذة المعاينة:'
                : 'To install on your phone, open the direct link in Chrome or Safari outside the preview frame:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playSoftTap()}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>{isAr ? 'فتح في متصفح مستقل' : 'Open Direct Link'}</span>
              </a>
              <button
                type="button"
                onClick={handleCopyInstallUrl}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 border border-amber-300/80 dark:border-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{isAr ? 'تم نسخ الرابط ✓' : 'Link Copied ✓'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                    <span>{isAr ? 'نسخ رابط التثبيت' : 'Copy Install URL'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step-by-Step Mobile OS Tabs (Android & iPhone/iPad) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
              {isAr ? 'خطوات التثبيت السريع على الهاتف:' : 'Quick Mobile Install Steps:'}
            </span>
            {(isAndroid || isIOS) && (
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {isIOS
                  ? isAr
                    ? 'تم التعرّف على جهاز آيفون/آيباد'
                    : 'iOS detected'
                  : isAr
                  ? 'تم التعرّف على جهاز أندرويد'
                  : 'Android detected'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800/80">
            <button
              type="button"
              onClick={() => setGuideTab('android')}
              className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                guideTab === 'android'
                  ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {isAr ? 'أندرويد (Android)' : 'Android'}
            </button>
            <button
              type="button"
              onClick={() => setGuideTab('ios')}
              className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                guideTab === 'ios'
                  ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {isAr ? 'آيفون وآيباد (iOS)' : 'iPhone / iPad'}
            </button>
          </div>

          {guideTab === 'android' ? (
            <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 p-3.5 space-y-2.5 text-xs text-stone-700 dark:text-stone-200">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  {isAr
                    ? 'افتح رابط التطبيق في متصفح Google Chrome أو Samsung Internet على هاتفك.'
                    : 'Open the app link in Google Chrome or Samsung Internet on your phone.'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span className="flex items-center gap-1 flex-wrap">
                  {isAr ? 'اضغط على قائمة المتصفح العلوية' : 'Tap the browser menu'}
                  <MoreVertical className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 inline" />
                  {isAr ? 'أعلى الشاشة.' : 'at the top corner.'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  {isAr
                    ? 'اختر «تثبيت التطبيق» (Install App) أو «الإضافة إلى الشاشة الرئيسية».'
                    : 'Tap "Install App" or "Add to Home screen" and confirm.'}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 p-3.5 space-y-2.5 text-xs text-stone-700 dark:text-stone-200">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  {isAr
                    ? 'افتح رابط التطبيق في متصفح Safari على جهاز الآيفون أو الآيباد.'
                    : 'Open the app link in Safari on your iPhone or iPad.'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span className="flex items-center gap-1 flex-wrap">
                  {isAr ? 'اضغط على أيقونة المشاركة' : 'Tap the Share button'}
                  <Share className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 inline" />
                  {isAr ? 'أسفل شريط المتصفح.' : 'in the bottom toolbar.'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span className="flex items-center gap-1 flex-wrap">
                  {isAr ? 'مرّر للأسفل واختر «إضافة إلى الشاشة الرئيسية»' : 'Scroll down and tap "Add to Home Screen"'}
                  <PlusSquare className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 inline" />
                  {isAr ? 'ثم اضغط «إضافة».' : 'then tap "Add".'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Key Mobile App Advantages */}
        <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-800 p-3.5 space-y-2 text-[11px] text-stone-600 dark:text-stone-300">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>
              {isAr
                ? 'يعمل بدون إنترنت بالكامل لجميع الـ 54 لعبة والأجواء الصوتية.'
                : 'Works 100% offline across all 54 games and ambient soundscapes.'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>
              {isAr
                ? 'يتحدّث تلقائياً في الخلفية فور اتصال الهاتف بالإنترنت.'
                : 'Updates automatically in the background whenever connected.'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>
              {isAr
                ? 'خفيف جداً على الهاتف ويحفظ جميع نقاطك وأوسمتك محلياً بخصوصية تامة.'
                : 'Ultra-lightweight and keeps all XP, badges, and notes private on your device.'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[44px] py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
        >
          {isAr ? 'حسناً' : 'Done'}
        </button>
      </div>
    </div>
  );
};
