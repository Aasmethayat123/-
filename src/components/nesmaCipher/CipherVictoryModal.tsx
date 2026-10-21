import React from 'react';
import { CipherLevel } from '../../types/nesmaCipher';
import { CheckCircle2, Star, Sparkles, ArrowLeft, Compass, BookOpen } from 'lucide-react';
import { soundManager } from '../../utils/audio';

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
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 text-center">
        {/* Top Trophy Icon & Star Rating */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            أحسنت! فككت الشفرة بنجاح 🌿
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
    </div>
  );
};
