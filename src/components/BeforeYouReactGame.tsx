import React, { useState, useEffect } from 'react';
import { Language, ReactConsequenceOption } from '../types';
import { BEFORE_YOU_REACT_ITEMS } from '../data/challenges';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { 
  ShieldAlert, 
  RotateCcw, 
  Flame, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  PauseCircle,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface BeforeYouReactGameProps {
  language: Language;
  onOpenBreathing: () => void;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

export const BeforeYouReactGame: React.FC<BeforeYouReactGameProps> = ({ 
  language, 
  onOpenBreathing,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const items = BEFORE_YOU_REACT_ITEMS[language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<ReactConsequenceOption | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const [timeFrozen, setTimeFrozen] = useState<boolean>(false);
  const [completed, setCompleted] = useState(false);

  const currentItem = items[currentIndex];

  useEffect(() => {
    setCountdown(5);
    setTimeFrozen(false);
    setSelectedOption(null);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        soundManager.playHeartbeat();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleFreezeTime = () => {
    soundManager.playBreathBell(true);
    setTimeFrozen(true);
  };

  const handleSelectOption = (opt: ReactConsequenceOption) => {
    soundManager.playSoftTap();
    setSelectedOption(opt);
    if (opt.actionType === 'conscious') {
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
      if (onAddXP) onAddXP(40);
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < items.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      soundManager.playLevelUpFanfare();
      triggerConfetti(0.5, 0.3);
    }
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setCurrentIndex(0);
    setSelectedOption(null);
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
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            {isAr ? 'حلبة: ثواني قبل الانفجار 🔥' : 'Arena: Adrenaline Slow-Mo 🔥'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
          <Activity className="w-4 h-4 animate-bounce text-rose-500" />
          <span>{isAr ? '128 BPM تسارع النبض' : '128 BPM Adrenaline'}</span>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
            <span>
              {isAr ? `الموقف ${currentIndex + 1} من ${items.length}` : `Scenario ${currentIndex + 1} of ${items.length}`}
            </span>
            <span className="text-rose-700 font-bold">
              {isAr ? 'جمّد الوقت وتريّث' : 'Freeze Time & Breathe'}
            </span>
          </div>

          {/* Trigger Alert Card */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">
                {isAr ? 'الاستفزاز المباغت:' : 'The Acute Trigger:'}
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-stone-900 font-serif leading-relaxed">
                {currentItem.situation}
              </p>
            </div>

            {/* Adrenaline Surge Details */}
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>{isAr ? 'غليان المشاعر:' : 'Internal Emotional Spike:'}</span>
              </div>
              <p className="text-sm font-bold text-rose-950">
                {currentItem.emotionSurge}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
                {currentItem.physicalSensations.map((sens, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white rounded-lg text-rose-900 font-semibold border border-rose-200 text-[11px]"
                  >
                    ⚡ {sens}
                  </span>
                ))}
              </div>
            </div>

            {/* The Slow-Motion Freeze Button */}
            <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
              timeFrozen ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-stone-900 border-rose-500 text-white'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold">
                <PauseCircle className={`w-5 h-5 ${timeFrozen ? 'text-emerald-700' : 'text-rose-400 animate-pulse'}`} />
                <span>
                  {timeFrozen
                    ? (isAr ? 'تم تجميد الوقت بنجاح! هدأ نبضك واستعدت السيطرة 🌿' : 'Time Frozen! Pulse normalized, clarity restored 🌿')
                    : (isAr ? 'اضغط لتجميد الوقت وإبطاء الانفعال:' : 'Tap to Slow Down Time:')}
                </span>
              </div>

              {!timeFrozen ? (
                <button
                  onClick={handleFreezeTime}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg animate-bounce cursor-pointer"
                >
                  ⏸️ {isAr ? 'وقفة الأنفاس (Slow-Mo)' : 'Slow-Mo Pause'} ({countdown}s)
                </button>
              ) : (
                <span className="px-3 py-1 bg-emerald-200 text-emerald-900 font-extrabold text-xs rounded-lg">
                  ✓ {isAr ? 'الوعي مفعّل' : 'Mindful Active'}
                </span>
              )}
            </div>
          </div>

          {/* Options: Choose Move */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-700 block px-1">
              {isAr ? 'اختر حركتك وقارن العواقب:' : 'Choose your move and compare outcomes:'}
            </span>

            {currentItem.options.map((opt) => {
              const isSelected = selectedOption?.id === opt.id;
              const isConscious = opt.actionType === 'conscious';

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-start p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? isConscious
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400'
                        : 'border-stone-400 bg-stone-100 text-stone-900'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-extrabold">{opt.title}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      isConscious ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {isConscious ? (isAr ? 'سوبر باور واعي 🌿' : 'Conscious Power 🌿') : (isAr ? 'رد فعل أعمى' : 'Blind Reaction')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mb-2">
                    {opt.description}
                  </p>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-stone-200 text-xs space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2.5 bg-stone-100 rounded-xl">
                          <span className="font-bold text-stone-700 block mb-0.5">
                            {isAr ? 'المكسب اللحظي السريع:' : 'Immediate Payoff:'}
                          </span>
                          <span className="text-stone-600">{opt.shortTermConsequence}</span>
                        </div>
                        <div className={`p-2.5 rounded-xl border ${
                          isConscious ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-medium' : 'bg-rose-100 border-rose-200 text-rose-950'
                        }`}>
                          <span className="font-bold block mb-0.5">
                            {isAr ? 'العواقب الحقيقية:' : 'Long-Term Impact:'}
                          </span>
                          <span>{opt.longTermConsequence}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              disabled={!selectedOption}
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                selectedOption
                  ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'الموقف التالي' : 'Next Scenario'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🛡️
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'قوة التحكم في اللحظة الحرجة!' : 'Adrenaline Mastered!'}
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
              {isAr
                ? '«بين المثير واستجابتك مساحة؛ في تلك المساحة تكمن قوتك وحريتك». عندما تتوقف لثوانٍ معدودة، فإنك تسترد مقود حياتك.'
                : 'Between stimulus and response there is a space. In that space lies your power to choose.'}
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
                className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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
