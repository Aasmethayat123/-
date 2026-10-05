import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Wind, 
  Cloud, 
  Bookmark, 
  ArrowRight,
  Sun,
  Heart
} from 'lucide-react';

interface BalloonBreathGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

export const BalloonBreathGame: React.FC<BalloonBreathGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  // Breath cycle phase
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathCycles, setBreathCycles] = useState<number>(0);
  const targetCycles = 6;
  const [altitude, setAltitude] = useState<number>(30); // 0 to 100%
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth automatic or guided breathing flow (4s inhale, 4s hold, 6s exhale)
  useEffect(() => {
    if (phase === 'idle' || isCompleted) return;

    let countdown = 0;
    const interval = setInterval(() => {
      countdown += 1;
      
      if (phase === 'inhale') {
        setAltitude(prev => Math.min(85, prev + 2.5));
        if (countdown >= 16) { // 4 seconds (16 * 250ms)
          setPhase('hold');
          soundManager.playChime(523, 1.2);
          countdown = 0;
        }
      } else if (phase === 'hold') {
        // slight hover
        setAltitude(prev => prev + (Math.sin(countdown) * 0.4));
        if (countdown >= 12) { // 3 seconds
          setPhase('exhale');
          soundManager.playWhoosh();
          countdown = 0;
        }
      } else if (phase === 'exhale') {
        setAltitude(prev => Math.max(25, prev - 1.8));
        if (countdown >= 24) { // 6 seconds
          const nextCycle = breathCycles + 1;
          setBreathCycles(nextCycle);
          soundManager.playHarmonicAffirmation();

          if (nextCycle >= targetCycles) {
            setIsCompleted(true);
            soundManager.playLevelUpFanfare();
            triggerConfetti(0.5, 0.4);
            if (onAddXP) onAddXP(60);
          } else {
            setPhase('inhale');
            soundManager.playBreathBell(true);
          }
          countdown = 0;
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [phase, breathCycles, isCompleted, onAddXP]);

  const handleStartFlight = () => {
    soundManager.playBreathBell(true);
    setPhase('inhale');
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'game-balloon-breath',
      gameTitle: isAr ? 'بالون التنفس الحركي' : 'Breath Balloon Flight',
      quote: isAr 
        ? 'الزفير الطويل هو كابح الطوارئ الطبيعي للجهاز العصبي.' 
        : 'A prolonged exhale is the nervous system’s natural brake pedal.',
      reflection: userReflection || (isAr ? 'أتممت 6 دورات تنفس بطني هادئة وحلّقت بخفة.' : 'Flew smoothly with diaphragmatic breathing.'),
      tag: isAr ? 'تنفس حركي' : 'Somatic Breath'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setPhase('idle');
    setBreathCycles(0);
    setAltitude(30);
    setIsCompleted(false);
    setIsSaved(false);
    setUserReflection('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            {isAr ? 'لعبة: بالون التنفس الحركي 🎈' : 'Psychomotor: Breath Balloon 🎈'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold text-sky-300">
          <span>{isAr ? `الدورات: ${breathCycles}/${targetCycles}` : `Cycles: ${breathCycles}/${targetCycles}`}</span>
          <span className="text-stone-600">·</span>
          <span>{isAr ? `الارتفاع: ${Math.round(altitude)}m` : `Alt: ${Math.round(altitude)}m`}</span>
        </div>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1 max-w-md mx-auto">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
              {isAr ? 'التنفس البطني المهدئ للعصب الحائر' : 'Diaphragmatic Parasympathetic Flight'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'حلّقي ببالونك مع أنفاسك الهادئة 🎈' : 'Elevate the Balloon With Your Breath 🎈'}
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              {isAr
                ? 'شهيق عميق يملأ بطنك يرفع البالون نحو سماء هادئة، زفير أطول وأبطأ يجعله ينساب بخفة ونعومة بين الغيوم.'
                : 'Deep belly inhale lifts the balloon, long smooth exhale glides gently through the serene sky.'}
            </p>
          </div>

          {/* Interactive Sky Canvas */}
          <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 rounded-3xl border-2 border-sky-300 overflow-hidden shadow-inner flex flex-col justify-between p-4">
            {/* Sun & Clouds */}
            <div className="flex justify-between items-start opacity-90">
              <Sun className="w-12 h-12 text-amber-400 fill-amber-300 animate-spin-slow" />
              <div className="flex gap-4">
                <Cloud className="w-10 h-10 text-white/80 animate-float" />
                <Cloud className="w-14 h-14 text-white/90" />
              </div>
            </div>

            {/* Flying Hot Air Balloon */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 flex flex-col items-center select-none"
              style={{ bottom: `${altitude}%` }}
            >
              <div className="text-5xl sm:text-6xl filter drop-shadow-md animate-gentle-float">
                🎈
              </div>
              <div className="bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-stone-800 border border-stone-200 mt-1 shadow-xs">
                {phase === 'inhale' && (isAr ? 'شهيق عميق... ⬆️' : 'Inhale... ⬆️')}
                {phase === 'hold' && (isAr ? 'حبس هادئ... ⏸️' : 'Hold... ⏸️')}
                {phase === 'exhale' && (isAr ? 'زفير بطيء طويل... ⬇️' : 'Slow Exhale... ⬇️')}
                {phase === 'idle' && (isAr ? 'جاهزة للإقلاع' : 'Ready')}
              </div>
            </div>

            {/* Gentle Landscape Hills below */}
            <div className="h-10 bg-gradient-to-t from-emerald-600/60 to-transparent rounded-b-2xl" />
          </div>

          {/* Status & Action Control */}
          <div className="space-y-4 max-w-sm mx-auto">
            {phase === 'idle' ? (
              <button
                onClick={handleStartFlight}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-extrabold text-sm shadow-md cursor-pointer transition-transform hover:scale-102"
              >
                {isAr ? 'ابدأي التحليق والتنفس الآن 🌿' : 'Begin Flight & Breath 🌿'}
              </button>
            ) : (
              <div className="p-4 rounded-2xl border-2 border-sky-300 bg-sky-50 text-sky-950 font-bold text-sm shadow-xs animate-pulse">
                {phase === 'inhale' && (isAr ? '🫁 شهيق عميق من الأنف (٤ ثوانٍ)' : '🫁 Deep Inhale (4s)')}
                {phase === 'hold' && (isAr ? '⏸️ احتفظي بالهواء في استرخاء (٣ ثوانٍ)' : '⏸️ Gentle Hold (3s)')}
                {phase === 'exhale' && (isAr ? '💨 زفير ناعم وطويل من الفم (٦ ثوانٍ)' : '💨 Smooth Long Exhale (6s)')}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-20 h-20 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🎈
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'هبط البالون بسلام، وهدأ نبضك 🌿' : 'Safe Landing & Calm Rhythm!'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«أتممتِ ٦ دورات تنفس بطني حركي كاملة. الزفير الطويل هو رسالة أمان كيميائية يرسلها جسدك إلى عقلك ليخبره أن الخطر قد زال».'
                : 'You completed 6 full diaphragmatic breath cycles. Notice how relaxed your chest and shoulders feel.'}
            </p>
          </div>

          {/* Reflection Input */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-3 text-start">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <Bookmark className="w-4 h-4 text-sky-700" />
              <span>{isAr ? 'احفظي أثر التحليق في رحلتك:' : 'Save this flight to your diary:'}</span>
            </div>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'كيف يشعر صدرك وأنفاسك الآن؟...' : 'How does your chest and breathing feel now?...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-sky-600 text-stone-800"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-700 hover:bg-sky-800 disabled:bg-sky-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved to My Journey ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment to My Journey')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'تحليق جديد' : 'Fly Again'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'قائمة الألعاب' : 'All Games'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
