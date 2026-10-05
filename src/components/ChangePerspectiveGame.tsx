import React, { useState } from 'react';
import { Language } from '../types';
import { PERSPECTIVE_CHALLENGES } from '../data/challenges';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  Scale, 
  PenLine,
  Zap
} from 'lucide-react';

interface ChangePerspectiveGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

export const ChangePerspectiveGame: React.FC<ChangePerspectiveGameProps> = ({ 
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const challenges = PERSPECTIVE_CHALLENGES[language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAltIndex, setSelectedAltIndex] = useState<number | null>(null);
  const [scaleBalanced, setScaleBalanced] = useState<boolean>(false);
  const [userCustom, setUserCustom] = useState('');
  const [completed, setCompleted] = useState(false);

  const currentChallenge = challenges[currentIndex];

  const handleSelectAlternative = (idx: number) => {
    setSelectedAltIndex(idx);
    const score = currentChallenge.alternativePerspectives[idx].helpfulScore;
    if (score >= 4) {
      setScaleBalanced(true);
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
      if (onAddXP) onAddXP(30);
    } else {
      setScaleBalanced(false);
      soundManager.playSoftTap();
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAltIndex(null);
      setScaleBalanced(false);
      setUserCustom('');
    } else {
      setCompleted(true);
      soundManager.playLevelUpFanfare();
      triggerConfetti(0.5, 0.3);
    }
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setCurrentIndex(0);
    setSelectedAltIndex(null);
    setScaleBalanced(false);
    setUserCustom('');
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
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            {isAr ? 'حلبة: ميزان الأفكار ⚖️' : 'Arena: Perspective Scale ⚖️'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
          <Scale className="w-4 h-4" />
          <span>{isAr ? 'وازن كفتي الموقف' : 'Balance the Scales'}</span>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
            <span>
              {isAr ? `اللغز ${currentIndex + 1} من ${challenges.length}` : `Puzzle ${currentIndex + 1} of ${challenges.length}`}
            </span>
            <span className="text-sky-700">
              {isAr ? 'ابحث عن حجر التفسير البديل' : 'Find the Balancing Reframe'}
            </span>
          </div>

          {/* Interactive Scale Visual Representation */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                {isAr ? 'الموقف الواقعي' : 'The Situation'}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${scaleBalanced ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {scaleBalanced ? (isAr ? 'الكفتان متوازنتان! ⚖️' : 'Balanced! ⚖️') : (isAr ? 'الكفة مائلة للتشاؤم ⚠️' : 'Tilted Negative ⚠️')}
              </span>
            </div>

            <p className="text-base sm:text-lg font-bold text-stone-900 font-serif">
              «{currentChallenge.situation}»
            </p>

            {/* The Visual Balance Seesaw Bar */}
            <div className="py-4 relative">
              <div className="flex items-center justify-between text-xs font-bold px-2 mb-2">
                <span className="text-rose-700 flex items-center gap-1">
                  <span>🪨</span>
                  <span>{isAr ? 'الفكرة السلبية الثقيلة' : 'Heavy Negative Bias'}</span>
                </span>
                <span className="text-emerald-700 flex items-center gap-1">
                  <span>💎</span>
                  <span>{isAr ? 'جوهر التفسير البديل' : 'Balancing Perspective'}</span>
                </span>
              </div>

              {/* Animated Balance Beam */}
              <div className="relative h-3 bg-stone-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 rounded-full ${
                    scaleBalanced ? 'bg-emerald-500 w-1/2 mx-auto' : 'bg-rose-500 w-3/4 mr-auto rtl:mr-0 rtl:ml-auto'
                  }`}
                />
              </div>
            </div>

            {/* Negative Thought Banner */}
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-1 text-xs">
              <span className="font-bold text-rose-900 block">
                {isAr ? 'الفكرة التلقائية التي أثقلت الكفة:' : 'The Heavy Automatic Thought:'}
              </span>
              <p className="text-sm font-semibold text-rose-950 italic">
                «{currentChallenge.automaticThought}»
              </p>
              <span className="text-rose-700 block text-[11px] pt-1">
                فخ التفكير: {currentChallenge.distortionType}
              </span>
            </div>
          </div>

          {/* Perspective Options (Gems) */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-700 block px-1">
              {isAr ? 'اختر حجر التفسير الذي يعيد التوازن لميزان عقلك:' : 'Choose the thought stone to balance the scale:'}
            </span>

            {currentChallenge.alternativePerspectives.map((alt, idx) => {
              const isSelected = selectedAltIndex === idx;
              const isHigh = alt.helpfulScore >= 4;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAlternative(idx)}
                  className={`w-full text-start p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? isHigh
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400'
                        : 'border-amber-400 bg-amber-50 text-amber-950 font-bold'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-stone-900 font-serif leading-relaxed">
                      {alt.text}
                    </p>
                    {isSelected && (
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isHigh ? 'text-emerald-700' : 'text-amber-600'}`} />
                    )}
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-stone-200 text-xs font-normal">
                      <span className="font-bold block mb-0.5">
                        {isHigh ? (isAr ? '🌿 وزن هذا التفسير:' : '🌿 Mindful Weight:') : (isAr ? '⚠️ تنبيه:' : '⚠️ Warning:')}
                      </span>
                      <p className="text-stone-700">{alt.feedback}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              disabled={!scaleBalanced}
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                scaleBalanced
                  ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'اللغز التالي' : 'Next Puzzle'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            ⚖️
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'اكتملت موازنة الأفكار بنجاح!' : 'Scales Balanced!'}
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
              {isAr
                ? 'لقد دربت عقلك اليوم على رؤية الصورة الكاملة برحمة وموضوعية.'
                : 'You have trained your cognitive flexibility to invite balance into any situation.'}
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
                className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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
