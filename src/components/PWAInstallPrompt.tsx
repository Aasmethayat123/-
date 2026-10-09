import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, X, Share, CheckCircle2, WifiOff, ShieldCheck } from 'lucide-react';

interface PWAInstallPromptProps {
  language: 'ar' | 'en';
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ language }) => {
  const isAr = language === 'ar';
  const { isInstallable, isInstalled, isStandalone, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showOfflineInfo, setShowOfflineInfo] = useState(false);

  // If already installed and running standalone, suppress install prompt
  if (isStandalone || isInstalled) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Android / Chromium / Desktop Install Button */}
        {isInstallable && (
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer animate-pulse"
            title={isAr ? 'تثبيت تطبيق نسمة حياة على جهازك' : 'Install App'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isAr ? 'تثبيت التطبيق 📲' : 'Install App 📲'}</span>
          </button>
        )}

        {/* iOS Safari Guide Button */}
        {isIOS && !isInstallable && (
          <button
            onClick={() => setShowIOSModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-emerald-500/30"
            title={isAr ? 'طريقة تثبيت التطبيق على آيفون' : 'Install on iPhone'}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isAr ? 'تثبيت على آيفون 📱' : 'Install on iOS 📱'}</span>
          </button>
        )}

        {/* Offline capabilities disclosure trigger */}
        <button
          onClick={() => setShowOfflineInfo(true)}
          className="p-1.5 text-stone-500 hover:text-emerald-700 transition-colors cursor-pointer rounded-lg hover:bg-stone-100"
          title={isAr ? 'ما الذي يعمل دون اتصال بالإنترنت؟' : 'Offline Capabilities'}
        >
          <WifiOff className="w-4 h-4" />
        </button>
      </div>

      {/* iOS Installation Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-stone-200 text-start">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <h3 className="text-base font-extrabold text-stone-900 font-serif">
                  {isAr ? 'تثبيت نسمة حياة على الآيفون' : 'Install on iPhone / iPad'}
                </h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <p>
                {isAr
                  ? 'يمكنك تثبيت منصة «نسمة حياة» كتطبيق مستقل على شاشتك الرئيسية في خطوتين بسيطتين عبر متصفح Safari:'
                  : 'Install Nesma Hayat as a standalone app on your home screen in two simple steps via Safari:'}
              </p>

              <div className="p-3 bg-stone-50 rounded-2xl space-y-2 border border-stone-100">
                <div className="flex items-center gap-2 text-stone-900 font-bold">
                  <Share className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? '١. اضغط على زر المشاركة (Share) أسفل المتصفح.' : '1. Tap the Share button at bottom.'}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? '٢. اختر «إضافة إلى الشاشة الرئيسية» (Add to Home Screen).' : '2. Select "Add to Home Screen".'}</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'سيعمل التطبيق في نافذة مستقلة وبشاشة كاملة كأي تطبيق مثبت على جهازك.'
                    : 'The app will launch in full standalone mode without browser bars.'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? 'فهمت، حسناً' : 'Got it'}
            </button>
          </div>
        </div>
      )}

      {/* Offline Capabilities Disclosure Modal */}
      {showOfflineInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-stone-200 text-start">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-extrabold text-stone-900 font-serif">
                  {isAr ? 'دعم العمل دون اتصال بالإنترنت (Offline)' : 'Offline Capabilities'}
                </h3>
              </div>
              <button
                onClick={() => setShowOfflineInfo(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <p className="font-bold text-stone-800">
                {isAr
                  ? 'بمجرد تحميل التطبيق أو تثبيته، يمكنك استخدام الميزات التالية دون الحاجة لأي اتصال بالإنترنت:'
                  : 'Once loaded or installed, the following features work 100% offline:'}
              </p>

              <ul className="space-y-2 text-stone-700 bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isAr ? 'جميع الألعاب الـ 36 (ألعاب نسمة حياة، التمارين الحركية، التحديات المعرفية، والرحلة).' : 'All 36 games and interactive challenges.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isAr ? 'مؤقتات التنفس والاهتزاز والتهدئة العصبية التفاعلية.' : 'Interactive breathing, PMR, and pacing timers.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isAr ? 'دفتر «رحلتي»: حفظ واستعراض التأملات المخزنة محلياً على جهازك بأمان.' : 'My Journey notebook: reading and storing local reflections.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isAr ? 'المقالات النفسية وكتيب الورش التيسيري.' : 'Psycho-educational articles and workshop guide.'}</span>
                </li>
              </ul>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                <span className="font-bold block mb-1">
                  {isAr ? '⚠️ خصوصية التخزين المؤقت:' : '⚠️ Privacy & Cache Policy:'}
                </span>
                {isAr
                  ? 'يتم تخزين ملفات واجهة التطبيق والخطوط والبرمجة فقط في ذاكرة التخزين المؤقت (Cache). ولا يتم مطلقاً تخزين أي تأملات شخصية أو بيانات خاصة في ذاكرة الكاش العامة.'
                  : 'Only static interface assets and fonts are cached. Personal reflections are kept strictly in isolated local storage and never in shared web caches.'}
              </div>
            </div>

            <button
              onClick={() => setShowOfflineInfo(false)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
