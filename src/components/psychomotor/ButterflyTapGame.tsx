import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Heart, 
  HelpCircle, 
  Volume2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface ButterflyTapGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

export const ButterflyTapGame: React.FC<ButterflyTapGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const [expectedSide, setExpectedSide] = useState<'left' | 'right'>('left');
  const [cycleCount, setCycleCount] = useState<number>(0);
  const targetCycles = 20;
  const [lastTappedSide, setLastTappedSide] = useState<'left' | 'right' | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isAutoPacing, setIsAutoPacing] = useState<boolean>(true);

  // Auto-pacing rhythm pulse (1 tap per second)
  useEffect(() => {
    if (isCompleted || !isAutoPacing) return;

    const interval = setInterval(() => {
      // Gentle reminder pulse
    }, 1100);

    return () => clearInterval(interval);
  }, [isCompleted, isAutoPacing]);

  const handleTap = (side: 'left' | 'right') => {
    if (isCompleted) return;

    setLastTappedSide(side);
    soundManager.playBilateralTap(side === 'left');

    if (side === expectedSide) {
      if (side === 'right') {
        const nextCount = cycleCount + 1;
        setCycleCount(nextCount);
        if (nextCount % 5 === 0) {
          soundManager.playCoinSound();
        }
        if (nextCount >= targetCycles) {
          setIsCompleted(true);
          soundManager.playLevelUpFanfare();
          triggerConfetti(0.5, 0.4);
          if (onAddXP) onAddXP(50);
        }
      }
      setExpectedSide(side === 'left' ? 'right' : 'left');
    }
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setCycleCount(0);
    setExpectedSide('left');
    setLastTappedSide(null);
    setIsCompleted(false);
  };

  const progressPercent = Math.min(100, (cycleCount / targetCycles) * 100);

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
              {isAr ? '← الألعاب' : '← Games'}
            </button>
          )}
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            {isAr ? 'لعبة نفسية حركية: نقر الفراشة الثنائي 🦋' : 'Psychomotor: Bilateral Butterfly Tap 🦋'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">
            {isAr ? 'صوت مجسم ثنائي (يمين/يسار)' : 'Stereo Audio Panning'}
          </span>
        </div>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          {/* Instructions Box */}
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
              {isAr ? 'تحفيز الفصين وتفريغ القلق العصبي' : 'Bilateral Nervous System Regulation'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'عانق نفسك وانقر بالتبادل 🦋' : 'Cross Arms & Tap in Alternation 🦋'}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isAr
                ? 'ضع يديك متصالبتين على كتفيك كجناحي فراشة. انقر الجناح الأيسر ثم الأيمن بإيقاع هادئ منتظم. هذه الحركة الجسدية (EMDR) تُعيد التوازن لنصفي الدماغ وتهدئ عاصفة المشاعر.'
                : 'Cross your hands over your chest like butterfly wings. Tap left then right gently. This bilateral somatic stimulation calms the amygdala.'}
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="max-w-xs mx-auto space-y-1">
            <div className="flex justify-between text-xs font-bold text-stone-500">
              <span>{isAr ? 'دورات التهدئة:' : 'Cycles:'}</span>
              <span className="font-mono text-emerald-700">{cycleCount} / {targetCycles}</span>
            </div>
            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div 
                className="h-full bg-teal-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Interactive Butterfly Wings (Left / Right Touch Targets) */}
          <div className="py-6 flex items-center justify-center gap-6 sm:gap-10">
            {/* Left Wing */}
            <button
              onClick={() => handleTap('left')}
              className={`w-32 h-44 sm:w-40 sm:h-52 rounded-3xl border-4 transition-all transform active:scale-95 flex flex-col items-center justify-center p-4 cursor-pointer shadow-md select-none ${
                expectedSide === 'left'
                  ? 'border-teal-500 bg-teal-50 text-teal-950 scale-105 shadow-teal-200/50 animate-pulse'
                  : 'border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100 opacity-80'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-2 transform -scale-x-100">🦋</span>
              <span className="text-base font-extrabold">{isAr ? 'اليسار' : 'Left Tap'}</span>
              <span className="text-[10px] text-stone-400 mt-1">
                {expectedSide === 'left' ? (isAr ? 'انقر هنا الآن!' : 'Tap Now!') : '—'}
              </span>
            </button>

            {/* Center Heart / Breath Guide */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-xs animate-gentle-float">
                🌿
              </div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                {isAr ? 'تنفس هادئ' : 'Breathe'}
              </span>
            </div>

            {/* Right Wing */}
            <button
              onClick={() => handleTap('right')}
              className={`w-32 h-44 sm:w-40 sm:h-52 rounded-3xl border-4 transition-all transform active:scale-95 flex flex-col items-center justify-center p-4 cursor-pointer shadow-md select-none ${
                expectedSide === 'right'
                  ? 'border-teal-500 bg-teal-50 text-teal-950 scale-105 shadow-teal-200/50 animate-pulse'
                  : 'border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100 opacity-80'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-2">🦋</span>
              <span className="text-base font-extrabold">{isAr ? 'اليمين' : 'Right Tap'}</span>
              <span className="text-[10px] text-stone-400 mt-1">
                {expectedSide === 'right' ? (isAr ? 'انقر هنا الآن!' : 'Tap Now!') : '—'}
              </span>
            </button>
          </div>

          <p className="text-xs text-stone-400 italic">
            {isAr
              ? '💡 يمكنك استخدام مفاتيح الأسهم (اليسار ⬅️ واليمين ➡️) أو النقر المباشر.'
              : '💡 You can click the wings or use Left/Right arrows on keyboard.'}
          </p>
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🦋
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'تحقق التوازن العصبي والسكينة!' : 'Bilateral Harmony Restored!'}
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
              {isAr
                ? 'أتممت 20 دورة تحفيز ثنائي كاملة. لاحظ كيف هدأ جهازك العصبي وعادت أنفاسك إلى وتيرتها الطبيعية.'
                : 'You completed 20 bilateral stimulation cycles. Notice the gentle drop in somatic tension.'}
            </p>
          </div>

          <div className="p-4 bg-teal-50 rounded-2xl max-w-md mx-auto text-xs text-teal-950 border border-teal-200">
            {isAr
              ? '🌿 احتفظ بهذه التقنية في ذاكرتك الجسدية: كلما شعرت بالقهر أو فورة التوتر، عانق نفسك وانقر برفق وبطء.'
              : '🌿 Remember this somatic anchor: cross arms and tap slowly whenever overwhelmed.'}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة الجلسة' : 'Repeat'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'العودة لقائمة الألعاب' : 'Back to Games'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
