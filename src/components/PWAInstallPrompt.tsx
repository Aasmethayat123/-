import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, X, CheckCircle2, WifiOff } from 'lucide-react';
import { AppInstallModal } from './AppInstallModal';
import { soundManager } from '../utils/audio';

interface PWAInstallPromptProps {
  language: 'ar' | 'en';
  compactMobile?: boolean;
  onOpenInstallModal?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  language,
  compactMobile = false,
  onOpenInstallModal,
}) => {
  const isAr = language === 'ar';
  const { isInstallable, isInstalled, isStandalone, install } = usePWAInstall();
  const [localInstallModalOpen, setLocalInstallModalOpen] = useState(false);
  const [showOfflineInfo, setShowOfflineInfo] = useState(false);

  const openGuide = () => {
    if (onOpenInstallModal) {
      onOpenInstallModal();
    } else {
      setLocalInstallModalOpen(true);
    }
  };

  const handleInstallClick = async () => {
    soundManager.playSoftTap();
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        openGuide();
      }
      return;
    }
    openGuide();
  };

  // If already installed and running standalone, suppress install prompt
  if (isStandalone || isInstalled) {
    return null;
  }

  if (compactMobile) {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className="min-w-[38px] min-h-[38px] px-2.5 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
          title={isAr ? 'تثبيت التطبيق على الموبايل' : 'Install on Mobile'}
          aria-label={isAr ? 'تثبيت التطبيق على الموبايل' : 'Install on Mobile'}
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>{isAr ? 'تثبيت' : 'Install'}</span>
        </button>

        {!onOpenInstallModal && (
          <AppInstallModal
            isOpen={localInstallModalOpen}
            onClose={() => setLocalInstallModalOpen(false)}
            language={language}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleInstallClick}
          className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
          title={isAr ? 'تثبيت تطبيق نسمة حياة على الموبايل أو الجهاز' : 'Install App on your device'}
        >
          {isInstallable ? (
            <Download className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{isAr ? 'تثبيت التطبيق' : 'Install App'}</span>
        </button>

        {/* Offline capabilities disclosure trigger */}
        <button
          type="button"
          onClick={() => setShowOfflineInfo(true)}
          className="p-2 text-stone-500 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
          title={isAr ? 'ما الذي يعمل دون اتصال بالإنترنت؟' : 'Offline Capabilities'}
          aria-label={isAr ? 'العمل بدون إنترنت' : 'Offline Capabilities'}
        >
          <WifiOff className="w-4 h-4" />
        </button>
      </div>

      {!onOpenInstallModal && (
        <AppInstallModal
          isOpen={localInstallModalOpen}
          onClose={() => setLocalInstallModalOpen(false)}
          language={language}
        />
      )}

      {/* Offline Capabilities Disclosure Modal */}
      {showOfflineInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setShowOfflineInfo(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 p-6 shadow-2xl space-y-4 border border-stone-200 dark:border-stone-800 text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-serif">
                  {isAr ? 'دعم العمل دون اتصال بالإنترنت (Offline)' : 'Offline Capabilities'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOfflineInfo(false)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              <p className="font-bold text-stone-800 dark:text-stone-100">
                {isAr
                  ? 'بمجرد تحميل التطبيق أو تثبيته، يمكنك استخدام جميع الأقسام والألعاب دون الحاجة لأي اتصال بالإنترنت:'
                  : 'Once loaded or installed, all sections and games work 100% offline:'}
              </p>

              <ul className="space-y-2 text-stone-700 dark:text-stone-200 bg-stone-50 dark:bg-stone-800/70 p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? 'جميع الألعاب والتجارب التفاعلية الـ 54 بما فيها شفرة نسمة وجزيرة الأسرار.'
                      : 'All 54 interactive games, Nesma Cipher, and Secrets Island.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? 'الأجواء الصوتية المهدئة (المطر، الغابة، الأمواج) ومؤقتات التنفس بتوليد Web Audio محلي.'
                      : 'Ambient soundscapes (Rain, Forest, Waves) & Web Audio timers.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? 'الجلسة الأسبوعية ومحرك الرفيق المعرفي المحلي (CBT/ACT) ودفتر «رحلتي» والأوسمة.'
                      : 'Weekly session with local CBT/ACT engine, My Journey notebook, and badges.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? 'المقالات النفسية وكتيب الورش التيسيري وإدارة المحتوى.'
                      : 'Psycho-educational articles, workshop guide, and CMS.'}
                  </span>
                </li>
              </ul>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
                <span className="font-bold block mb-1">
                  {isAr ? 'خصوصية التخزين المؤقت:' : 'Privacy & Cache Policy:'}
                </span>
                {isAr
                  ? 'يتم تخزين ملفات واجهة التطبيق والخطوط والبرمجة فقط في ذاكرة التخزين المؤقت. ولا يتم مطلقاً تخزين أي تأملات شخصية أو بيانات خاصة في ذاكرة الكاش العامة.'
                  : 'Only static interface assets and fonts are cached. Personal reflections are kept strictly in isolated local storage and never in shared web caches.'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowOfflineInfo(false)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
