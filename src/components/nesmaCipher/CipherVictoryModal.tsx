import React, { useState } from 'react';
import { CipherLevel } from '../../types/nesmaCipher';
import { CheckCircle2, Star, Sparkles, ArrowLeft, Compass, KeyRound } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { loadCipherProgress, unlockSecretDoor } from '../../utils/nesmaCipherStorage';
import { CipherGrandSecretModal } from './CipherGrandSecretModal';

interface CipherVictoryModalProps {
  level: CipherLevel;
  stars: number;
  scoreEarned: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReturnToMap: () => void;
}

export const CipherVictoryModal: React.FC<CipherVictoryModalProps> = ({
  level,
  stars,
  scoreEarned,
  hasNextLevel,
  onNextLevel,
  onReturnToMap
}) => {
  const [showGrandModal, setShowGrandModal] = useState<boolean>(false);
  const progress = loadCipherProgress();

  const isLevel30 = level.id === 30;
  const allSecretsDiscovered = ['garden_dawn_secret', 'library_manuscript_secret', 'cave_crystal_secret'].every(
    sId => progress.secretDoorsUnlocked.includes(sId)
  );
  const isGrandSecretSolved = progress.secretDoorsUnlocked.includes('grand_secret_solved');

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 text-center">
        {/* Top Trophy Icon & Star Rating */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {isLevel30 ? 'تهانينا! أتممت شفرة نسمة الكبرى 🌟' : 'أحسنت! فككت الشفرة بنجاح 🌿'}
          </h2>
          <div className="flex items-center gap-1.5 text-amber-500">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < stars ? 'fill-amber-400 text-amber-400 scale-110' : 'text-stone-300 dark:text-stone-700'}`}
              />
            ))}
          </div>
        </div>

        {/* Reward Token Card */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 text-center space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
            جزء المقولة المكتشف:
          </span>
          <span className="text-xl font-extrabold text-emerald-950 dark:text-emerald-100 font-serif block">
            «{level.rewardToken.value}»
          </span>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
            {level.rewardToken.explanationAr}
          </p>
        </div>

        {/* Grand Secret Challenge Section for Level 30 */}
        {isLevel30 && (
          <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
            allSecretsDiscovered
              ? 'bg-gradient-to-r from-amber-50 to-amber-100/60 dark:from-amber-950/60 dark:to-stone-900 border-amber-400 dark:border-amber-600 shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700'
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              <KeyRound className="w-4 h-4 text-amber-500 shrink-0" />
              <span>السر الأعظم — ربط الخيوط الثلاثة</span>
            </div>
            {allSecretsDiscovered ? (
              <div className="space-y-2">
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {isGrandSecretSolved ? 'لقد ربطت خيوط الرحلة الكبرى بنجاح ✓' : 'اكتشفت الأسرار الثلاثة كلها! انقر هنا لكشف الرسالة الكبرى.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setShowGrandModal(true);
                  }}
                  className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGrandSecretSolved ? 'عرض خلاصة السر الأعظم' : 'تفعيل تحدي السر الأعظم ✨'}</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                🔒 السر الأعظم مغلق؛ اكتشف الأسرار الثلاثة الخفية في العوالم الثلاثة لفتح هذا التحدي الختامي.
              </p>
            )}
          </div>
        )}

        {/* Insight Note */}
        <div className="p-3.5 bg-stone-100 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/60 text-start space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>إضاءة نفسية:</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {level.insightNote}
          </p>
        </div>

        {/* Points & Score Badge */}
        {scoreEarned > 0 && (
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>+{scoreEarned} نسمة نور مكتسبة</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          {hasNextLevel ? (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onNextLevel();
              }}
              className="w-full py-3 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>المرحلة التالية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onReturnToMap();
              }}
              className="w-full py-3 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>اكتملت جميع المراحل! العودة للخريطة</span>
              <Compass className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onReturnToMap();
            }}
            className="w-full sm:w-auto py-2.5 px-4 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
          >
            خريطة المراحل
          </button>
        </div>
      </div>

      {/* Grand Secret Modal */}
      {showGrandModal && (
        <CipherGrandSecretModal
          onClose={() => setShowGrandModal(false)}
          onSolveGrandSecret={() => {
            unlockSecretDoor('grand_secret_solved');
          }}
          isAlreadySolved={progress.secretDoorsUnlocked.includes('grand_secret_solved')}
        />
      )}
    </div>
  );
};
