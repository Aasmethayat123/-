import React, { useState } from 'react';
import { Language } from '../types';
import { FEELING_CHALLENGES } from '../data/challenges';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { 
  Heart, 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  Sparkles, 
  Eye,
  Zap,
  ArrowRight
} from 'lucide-react';

interface NameTheFeelingGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

export const NameTheFeelingGame: React.FC<NameTheFeelingGameProps> = ({ 
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const challenges = FEELING_CHALLENGES[language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showTakeaway, setShowTakeaway] = useState(false);
  const [revealedClues, setRevealedClues] = useState<number[]>([0]);
  const [completed, setCompleted] = useState(false);

  const currentChallenge = challenges[currentIndex];

  const handleSelectOption = (idx: number) => {
    setSelectedOptionIndex(idx);
    setShowTakeaway(true);

    if (currentChallenge.options[idx].isPrimary) {
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
      if (onAddXP) onAddXP(35);
    } else {
      soundManager.playSoftTap();
    }
  };

  const handleRevealClue = (clueIdx: number) => {
    if (!revealedClues.includes(clueIdx)) {
      soundManager.playSoftTap();
      setRevealedClues([...revealedClues, clueIdx]);
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setShowTakeaway(false);
      setRevealedClues([0]);
    } else {
      setCompleted(true);
      soundManager.playLevelUpFanfare();
      triggerConfetti(0.5, 0.3);
    }
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setShowTakeaway(false);
    setRevealedClues([0]);
    setCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Arcade Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← الخريطة' : '← Map'}
            </button>
          )}
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {isAr ? 'حلبة: كاشف المشاعر الدفينة 🔍' : 'Arena: Emotion Detective 🔍'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <Eye className="w-4 h-4" />
          <span>{isAr ? 'تحت قناع الغضب' : 'Detect the Tender Emotion'}</span>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
            <span>
              {isAr ? `الحالة ${currentIndex + 1} من ${challenges.length}` : `Case ${currentIndex + 1} of ${challenges.length}`}
            </span>
            <span className="text-amber-700">
              {isAr ? 'انقر لكشف إشارات الجسد 🔎' : 'Tap to scan somatic clues 🔎'}
            </span>
          </div>

          {/* Scenario & Clues Scanner */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-extrabold text-base flex items-center justify-center">
                {currentChallenge.character.slice(0, 1)}
              </span>
              <div>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider block">
                  {isAr ? 'ملف الشخصية:' : 'Character Case:'}
                </span>
                <span className="text-base font-extrabold text-stone-900 dark:text-stone-100">{currentChallenge.character}</span>
              </div>
            </div>

            <p className="text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-relaxed font-serif">
              «{currentChallenge.situation}»
            </p>

            {/* Interactive Clue Scanner Buttons */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{isAr ? 'أدلة الجسد المكتشفة:' : 'Detectable Somatic Signals:'}</span>
              </span>

              <div className="flex flex-wrap gap-2">
                {currentChallenge.clues.map((clue, idx) => {
                  const isDiscovered = revealedClues.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleRevealClue(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isDiscovered
                          ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-750'
                      }`}
                    >
                      {isDiscovered ? `🔎 ${clue}` : (isAr ? '🔒 دليل مستتر (انقر لكشفه)' : '🔒 Tap to scan clue')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block px-1">
              {isAr ? 'أي من هذه الخيارات يصف الشعور الدفين الحقيقي؟' : 'Which option identifies the authentic core emotion?'}
            </span>

            {currentChallenge.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;

              let style = 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-900 dark:text-stone-100';
              if (selectedOptionIndex !== null) {
                if (opt.isPrimary) {
                  style = 'border-emerald-500 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-400';
                } else if (isSelected && !opt.isPrimary) {
                  style = 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 font-semibold';
                } else {
                  style = 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-400 dark:text-stone-600 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedOptionIndex !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-start p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${style}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm sm:text-base font-bold">{opt.name}</span>
                    {selectedOptionIndex !== null && opt.isPrimary && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs opacity-85 leading-relaxed">
                    {opt.description}
                  </p>

                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-stone-200 text-xs text-stone-700 font-normal">
                      {opt.feedback}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Deeper Takeaway Box */}
          {showTakeaway && (
            <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 rounded-2xl text-xs text-amber-950 dark:text-amber-200 space-y-2 animate-fade-in shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 text-sm">
                <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>{isAr ? 'إضاءة نسمة حياة النفسية:' : 'Psychological Insight:'}</span>
              </div>
              <p className="leading-relaxed text-stone-800 dark:text-stone-200 font-medium">
                {currentChallenge.deeperTakeaway}
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
                >
                  <span>{isAr ? 'الحالة التالية' : 'Next Case'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto text-4xl shadow-inner">
            💛
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {isAr ? 'أحسنت كشف المشاعر الدفينة!' : 'Detective Mastery Complete!'}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 max-w-md mx-auto">
              {isAr
                ? 'تذكر: الغضب غالباً ما يكون مجرد حارس شخصي لمشاعر أكثر رهافة مثل الخيبة أو الرغبة في التقدير.'
                : 'Remember: Anger is often just a bodyguard for more tender feelings like disappointment or longing.'}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة اللعب' : 'Play Again'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'العودة للخريطة' : 'Back to Map'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
