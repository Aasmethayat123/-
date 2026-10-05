import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Hand, 
  CheckCircle2, 
  Wind,
  ArrowRight
} from 'lucide-react';

interface PmrSqueezeGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

export const PmrSqueezeGame: React.FC<PmrSqueezeGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const muscleGroups = [
    { id: 'fists', title: isAr ? 'قبضتا اليدين والأصابع' : 'Fists & Hands', instruction: isAr ? 'اقبض كفيك بقوة وشد أصابعك...' : 'Clench your fists tightly...' },
    { id: 'shoulders', title: isAr ? 'الكتفان والرقبة' : 'Shoulders & Neck', instruction: isAr ? 'ارفع كتفيك للأعلى باتجاه أذنيك واحبس الشد...' : 'Hunch shoulders up toward your ears...' },
    { id: 'jaw', title: isAr ? 'الفك وعضلات الوجه' : 'Jaw & Face', instruction: isAr ? 'أغلق فكك وابتسم بشدة واضغط عضلات وجهك...' : 'Clench jaw lightly and squeeze face...' },
    { id: 'belly', title: isAr ? 'البطن والجذع' : 'Stomach & Core', instruction: isAr ? 'شد عضلات بطنك كأنك تستعد لصد ضربة...' : 'Tighten abdominal core...' }
  ];

  const [groupIndex, setGroupIndex] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const [phase, setPhase] = useState<'ready' | 'squeezing' | 'melted'>('ready');
  const [completed, setCompleted] = useState(false);

  const currentGroup = muscleGroups[groupIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSqueeze = () => {
    if (phase === 'melted') return;
    setIsPressing(true);
    setPhase('squeezing');
    soundManager.playHeartbeat();
  };

  const cancelSqueeze = () => {
    if (phase === 'squeezing' && holdProgress < 100) {
      setIsPressing(false);
      setHoldProgress(0);
      setPhase('ready');
    }
  };

  useEffect(() => {
    if (isPressing && phase === 'squeezing') {
      timerRef.current = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            clearInterval(timerRef.current!);
            // Trigger release melt!
            soundManager.playHarmonicAffirmation();
            triggerConfetti(0.5, 0.4);
            setPhase('melted');
            setIsPressing(false);
            return 100;
          }
          return prev + 20; // 5 steps (approx 5 sec)
        });
      }, 700);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPressing, phase]);

  const handleNextGroup = () => {
    soundManager.playSoftTap();
    if (groupIndex + 1 < muscleGroups.length) {
      setGroupIndex(prev => prev + 1);
      setPhase('ready');
      setHoldProgress(0);
    } else {
      setCompleted(true);
      soundManager.playLevelUpFanfare();
      triggerConfetti(0.5, 0.3);
      if (onAddXP) onAddXP(55);
    }
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setGroupIndex(0);
    setPhase('ready');
    setHoldProgress(0);
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
              {isAr ? '← الألعاب' : '← Games'}
            </button>
          )}
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            {isAr ? 'لعبة: الشد والارتخاء العضلي (PMR) ✊' : 'Psychomotor: Squeeze & Melt (PMR) ✊'}
          </span>
        </div>

        <span className="text-xs font-bold text-rose-300">
          {isAr ? `المجموعة ${groupIndex + 1} من ${muscleGroups.length}` : `Group ${groupIndex + 1} of ${muscleGroups.length}`}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
              {isAr ? 'تقنية إدموند جاكوبسون للاسترخاء العميق' : 'Jacobson Progressive Neuromuscular Relaxation'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {currentGroup.title}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-serif">
              «{currentGroup.instruction}»
            </p>
          </div>

          {/* Interactive Squeeze & Melt Trigger Circle */}
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <button
              onMouseDown={startSqueeze}
              onMouseUp={cancelSqueeze}
              onTouchStart={startSqueeze}
              onTouchEnd={cancelSqueeze}
              className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 transition-all duration-300 flex flex-col items-center justify-center p-4 cursor-pointer select-none shadow-xl ${
                phase === 'melted'
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-950 scale-105 shadow-emerald-200'
                  : isPressing
                  ? 'border-rose-600 bg-rose-500 text-white scale-90 shadow-inner'
                  : 'border-rose-400 bg-rose-50 text-rose-950 hover:bg-rose-100'
              }`}
            >
              {phase === 'melted' ? (
                <>
                  <span className="text-5xl">🌿</span>
                  <span className="text-base font-extrabold mt-1">{isAr ? 'ارتخاء تام!' : 'Deep Melt!'}</span>
                  <span className="text-[11px] text-emerald-700">{isAr ? 'استشعر الدفء في العضلات' : 'Feel the soft warmth'}</span>
                </>
              ) : isPressing ? (
                <>
                  <span className="text-5xl animate-pulse">✊</span>
                  <span className="text-base font-extrabold mt-1">{isAr ? 'شد بقوة!' : 'Hold Tight!'}</span>
                  <span className="text-xs font-mono font-bold">{holdProgress}%</span>
                </>
              ) : (
                <>
                  <span className="text-5xl">🖐️</span>
                  <span className="text-sm font-extrabold mt-1">{isAr ? 'اضغط مع الاستمرار' : 'Press & Hold'}</span>
                  <span className="text-[10px] opacity-75">{isAr ? '5 ثوانٍ للشد' : '5s to squeeze'}</span>
                </>
              )}
            </button>

            <p className="text-xs text-stone-400">
              {isAr
                ? '💡 اضغط مع الاستمرار بإصبعك أو الماوس، وشد عضلاتك في الواقع بالتوازي!'
                : '💡 Hold down and physically squeeze the muscle group in real life!'}
            </p>
          </div>

          {phase === 'melted' && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 space-y-2 animate-fade-in max-w-md mx-auto">
              <span className="font-bold block">
                {isAr ? '✨ سر التقنية الجسدية:' : '✨ The Somatic Secret:'}
              </span>
              <p>
                {isAr
                  ? 'عندما تشد العضلة بأقصى طاقتها ثم تتركها، يرسل الدماغ إشارة استرخاء مضاعفة تتجاوز مستوى هدوئك الأصلي.'
                  : 'Deliberate maximum contraction followed by release triggers a deeper rebound parasympathetic relaxation.'}
              </p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNextGroup}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  {isAr ? 'المجموعة العضلية التالية' : 'Next Muscle Group'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            ✊
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'اكتملت دورة الاسترخاء العضلي العميق!' : 'Deep PMR Complete!'}
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
              {isAr
                ? 'لقد تعلم جسدك وعقلك الفرق الحقيقي بين الشد والارتخاء، وهو مفتاحك لمنع تراكم التوتر في عضلاتك.'
                : 'Your neuromuscular system now knows the clear contrast between contraction and calm.'}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة الجلسة' : 'Play Again'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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
