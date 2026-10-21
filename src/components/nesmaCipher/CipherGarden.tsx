import React from 'react';
import { CipherProgress } from '../../types/nesmaCipher';
import { CIPHER_GARDEN_COLLECTIBLES, CIPHER_IMAGES } from '../../data/nesmaCipherData';
import { Flower2, ArrowRight, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface CipherGardenProps {
  progress: CipherProgress;
  onBack: () => void;
}

export const CipherGarden: React.FC<CipherGardenProps> = ({ progress, onBack }) => {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Flower2 className="w-5 h-5 text-emerald-600" />
                <span>حديقة السكينة والشفرة</span>
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                مساحتك الهادئة التي تزدهر مع كل مرحلة تنجزها في اللعبة
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 tabular-nums">
            {progress.gardenItems.length} من 7 عناصر مزهرة
          </span>
        </div>
      </header>

      {/* Main Garden View */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Garden Hero Visual */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-800 aspect-16/9 max-h-[260px]">
          <img
            src={CIPHER_IMAGES.gardenDawn}
            alt="حديقة السكينة"
            className="w-full h-full object-cover brightness-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent p-6 flex flex-col justify-end text-white">
            <span className="text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ملاذ التعافي والامتنان</span>
            </span>
            <p className="text-xs sm:text-sm text-stone-200 max-w-xl leading-relaxed">
              كل لغز تحله في شفرة نسمة يغرس بذرة أو يوقد قنديلاً في هذه الحديقة؛ هنا تتجمع كل ثمار سعيك النفسي والذهني في مشهد متناغم.
            </p>
          </div>
        </div>

        {/* Collectibles Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            مقتنيات الحديقة التفاعلية
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CIPHER_GARDEN_COLLECTIBLES.map((item) => {
              const isUnlocked = progress.gardenItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'bg-white dark:bg-stone-900 border-emerald-200 dark:border-emerald-800/60 shadow-xs'
                      : 'bg-stone-100/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked 
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 shadow-2xs' 
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                  }`}>
                    {isUnlocked ? item.icon : '🔒'}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {item.nameAr}
                      </h3>
                      {isUnlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                      {isUnlocked ? item.descAr : `يُفتح عند إتمام المرحلة ${item.requiredLevel} في رحلة الشفرة.`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
