import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Infinity as InfinityIcon, 
  CheckCircle2, 
  ArrowRight,
  Eye
} from 'lucide-react';

interface InfinityFlowGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

export const InfinityFlowGame: React.FC<InfinityFlowGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const [laps, setLaps] = useState<number>(0);
  const targetLaps = 8;
  const [orbAngle, setOrbAngle] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(true);

  // Smooth automatic tracking guide along figure-eight / lemniscate
  useEffect(() => {
    if (isCompleted) return;

    const interval = setInterval(() => {
      setOrbAngle(prev => {
        const next = prev + 0.035;
        if (next >= Math.PI * 2) {
          setLaps(l => {
            const nextLap = l + 1;
            soundManager.playHarmonicAffirmation();
            if (nextLap >= targetLaps) {
              setIsCompleted(true);
              soundManager.playLevelUpFanfare();
              triggerConfetti(0.5, 0.4);
              if (onAddXP) onAddXP(50);
            }
            return nextLap;
          });
          return 0;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isCompleted, targetLaps]);

  // Lemniscate of Bernoulli parametric equations
  const scale = 110;
  const sinT = Math.sin(orbAngle);
  const cosT = Math.cos(orbAngle);
  const denom = 1 + sinT * sinT;
  const orbX = (scale * cosT) / denom + 150;
  const orbY = (scale * sinT * cosT) / denom + 90;

  const handleReset = () => {
    soundManager.playSoftTap();
    setLaps(0);
    setOrbAngle(0);
    setIsCompleted(false);
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
              {isAr ? '← الألعاب' : '← Games'}
            </button>
          )}
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            {isAr ? 'لعبة: مسار اللانهاية والتهدئة البصرية (∞) 🌊' : 'Psychomotor: Infinity Flow (∞) 🌊'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
          <InfinityIcon className="w-4 h-4 text-cyan-400" />
          <span>{isAr ? `الدورات: ${laps}/${targetLaps}` : `Loops: ${laps}/${targetLaps}`}</span>
        </div>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider block">
              {isAr ? 'تنظيم حركة العين وتنشيط العصب الحائر' : 'Ocular-Motor Tracking & Vagal Regulation'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'تتبع النقطة المضيئة بعينيك بهدوء' : 'Trace the Glowing Orb with Soft Eyes'}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-serif">
              {isAr
                ? 'الحركة البصرية الأفقية السلسة على شكل علامة اللانهاية (∞) تحفز الاستجابة السمبثاوية العكسية وتهدئ التوتر في عضلات العين والجمجمة.'
                : 'Smooth lateral figure-eight ocular movement triggers parasympathetic braking, soothing cranial and visual strain.'}
            </p>
          </div>

          {/* Infinity Visual Canvas */}
          <div className="relative w-full max-w-sm h-48 mx-auto flex items-center justify-center bg-stone-900 rounded-3xl p-4 shadow-inner border-2 border-stone-800 overflow-hidden">
            {/* SVG Lemniscate Path */}
            <svg viewBox="0 0 300 180" className="w-full h-full">
              {/* Subtle background path */}
              <path
                d="M 150,90 C 200,30 270,30 270,90 C 270,150 200,150 150,90 C 100,30 30,30 30,90 C 30,150 100,150 150,90 Z"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="6"
                strokeDasharray="4 6"
              />

              {/* Glowing Orb */}
              <circle
                cx={orbX}
                cy={orbY}
                r="10"
                fill="#22d3ee"
                className="filter drop-shadow-[0_0_12px_#22d3ee]"
              />
              <circle
                cx={orbX}
                cy={orbY}
                r="4"
                fill="#ffffff"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-700 block">
              {isAr ? `الدورة ${laps + 1} من ${targetLaps}` : `Cycle ${laps + 1} of ${targetLaps}`}
            </span>
            <p className="text-xs text-stone-400">
              {isAr ? 'أرخِ فكك وكتفيك وتنفس بعمق مع حركة النور 🌿' : 'Keep shoulders soft, breathe gently with the light 🌿'}
            </p>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            ♾️
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'تحققت السكينة البصرية والذهنية!' : 'Visual-Motor Flow Complete!'}
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
              {isAr
                ? 'أتممت 8 دورات تتبع كاملة لمسار اللانهاية. لاحظ استرخاء محجري العينين والهدوء في تفكيرك.'
                : 'Completed 8 smooth infinity tracking cycles. Notice the gentle softness behind the eyes.'}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة التتبع' : 'Trace Again'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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
