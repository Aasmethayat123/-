import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import {
  RotateCcw,
  Bookmark,
  Users,
  Lock
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface DistanceCirclesGameProps {
  language: Language;
  onBackToMap?: () => void;
  onAddXP?: (amount: number) => void;
}

interface PersonaOrbit {
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  minSafe: number;
  maxSafe: number;
  driftSpeed: number; // Stage 3 live pull/push drift!
  emoji: string;
}

const STAGE_PERSONAS: Record<number, PersonaOrbit[]> = {
  // Stage 1: Wide intuitive safe distance
  1: [
    {
      nameAr: 'صديقة الدراسة اليومية',
      nameEn: 'Daily Study Friend',
      descAr: 'علاقة ودودة تحتاج قرباً دافئاً دون التلاصق الذي يعطل تركيزك.',
      descEn: 'Friendly bond needing warmth without losing personal focus.',
      minSafe: 38,
      maxSafe: 62,
      driftSpeed: 0,
      emoji: '🤝'
    },
    {
      nameAr: 'زميل العمل كثير الشكوى',
      nameEn: 'Chronically Complaining Coworker',
      descAr: 'يحتاج احتراماً مهنياً مع مسافة أمان أوسع حتى لا تمتصي توتره.',
      descEn: 'Requires polite professionalism with wider buffer distance.',
      minSafe: 55,
      maxSafe: 78,
      driftSpeed: 0,
      emoji: '💼'
    }
  ],

  // Stage 2: Distinct narrow calibrated zones per relationship archetype
  2: [
    {
      nameAr: 'الشخصية الاعتمادية المتشبثة',
      nameEn: 'Clingy Dependent Acquaintance',
      descAr: 'تطلب وجودك كل دقيقة؛ المسافة الآمنة معها أوسع لحماية استقلالك.',
      descEn: 'Demands constant availability; needs a wider firm buffer.',
      minSafe: 60,
      maxSafe: 76,
      driftSpeed: 0,
      emoji: '🧲'
    },
    {
      nameAr: 'الشريك أو الصديق الأمين الداعم',
      nameEn: 'Trusted Safe Confidant',
      descAr: 'يحترم حدودك ويمنحك الأمان؛ يمكنكِ الاقتراب بدفء مع حفظ كيانك.',
      descEn: 'Honors your boundaries; safe for closer warm connection.',
      minSafe: 28,
      maxSafe: 44,
      driftSpeed: 0,
      emoji: '💛'
    },
    {
      nameAr: 'قريب محب لكنه كثير التدخل والنقد',
      nameEn: 'Caring Yet Critical Relative',
      descAr: 'وازني بين صلة الرحم الراقية ومسافة تمنع اختراق قراراتك.',
      descEn: 'Balance family respect with protective emotional distance.',
      minSafe: 52,
      maxSafe: 68,
      driftSpeed: 0,
      emoji: '🏡'
    }
  ],

  // Stage 3: Live Emotional Drift! Persona actively pulls closer or pushes away until locked!
  3: [
    {
      nameAr: 'دوامة الابتزاز العاطفي (سحب مغناطيسي للداخل!)',
      nameEn: 'Guilt-Pull Vortex (Pulls Inward!)',
      descAr: 'يسحبك باستمرار نحو التداخل الخانق (٠٪)؛ عادلي السحب وثبّتي المسافة الذهبية!',
      descEn: 'Actively pulls toward suffocating 0% — counter-adjust & lock!',
      minSafe: 58,
      maxSafe: 72,
      driftSpeed: -2.2,
      emoji: '🌀'
    },
    {
      nameAr: 'جدار الهروب الجاف بعد الخلاف (اندفاع للعزلة!)',
      nameEn: 'Avoidant Withdrawal Drift (Drifts Outward!)',
      descAr: 'يدفع العلاقة نحو القطيعة الباردة (١٠٠٪)؛ أعيدي الدفء المعتدل دون ملاحقة خانقة!',
      descEn: 'Drifts toward icy 100% isolation — stabilize warm middle ground!',
      minSafe: 36,
      maxSafe: 50,
      driftSpeed: 2.2,
      emoji: '❄️'
    },
    {
      nameAr: 'علاقة عمل عالية الضغط والتذبذب',
      nameEn: 'High-Pressure Boundary Calibration',
      descAr: 'اضبطي مسافة مهنية رصينة وثبّتيها بدقة قبل أن يجرفك التوتر.',
      descEn: 'Lock precise professional composure against pull.',
      minSafe: 54,
      maxSafe: 66,
      driftSpeed: -2.6,
      emoji: '⚖️'
    }
  ]
};

const GAME_ID = 'distance-safe';

export const DistanceCirclesGame: React.FC<DistanceCirclesGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const personas = STAGE_PERSONAS[currentStage] || STAGE_PERSONAS[1];
  const [personaIdx, setPersonaIdx] = useState(0);
  const currentPersona = personas[personaIdx] || personas[0];

  const [distance, setDistance] = useState<number>(20);
  const [attempts, setAttempts] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  useEffect(() => {
    setDistance(currentPersona.driftSpeed < 0 ? 35 : 22);
  }, [currentStage, personaIdx]);

  // Stage 3 live emotional pull/drift
  useEffect(() => {
    if (completed || currentPersona.driftSpeed === 0) return;
    const interval = setInterval(() => {
      setDistance(prev => {
        const next = Math.max(5, Math.min(95, prev + currentPersona.driftSpeed));
        return Math.round(next * 10) / 10;
      });
    }, 350);
    return () => clearInterval(interval);
  }, [completed, currentPersona]);

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setPersonaIdx(0);
    setAttempts(0);
    setCompleted(false);
    setShowCompletionModal(false);
    setIsSaved(false);
  };

  const isGolden = distance >= currentPersona.minSafe && distance <= currentPersona.maxSafe;

  const getStatusText = (val: number) => {
    if (val < currentPersona.minSafe) {
      return {
        label: isAr ? 'قرب زائد يستنزف حدودك ⚠️' : 'Too close — draining boundaries ⚠️',
        desc: isAr ? 'ابتعدي قليلاً لحماية مساحتك الخاصة من الاحتراق.' : 'Step back slightly to protect your autonomy.',
        color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
      };
    }
    if (val > currentPersona.maxSafe) {
      return {
        label: isAr ? 'ابتعاد وجفاء أكثر من اللازم ❄️' : 'Too distant — cold disconnection ❄️',
        desc: isAr ? 'اقتربي قليلاً لحفظ خيط الود والتواصل المتزن.' : 'Move slightly closer to maintain healthy connection.',
        color: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800'
      };
    }
    return {
      label: isAr ? '✨ المسافة الذهبية المتزنة لهذه العلاقة!' : '✨ Calibrated Golden Distance!',
      desc: isAr ? 'توازن مثالي بين الود الإنساني وحماية السيادة النفسية.' : 'Ideal balance of warmth and personal sovereignty.',
      color: 'text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700'
    };
  };

  const status = getStatusText(distance);

  const handleLockOrbit = () => {
    setAttempts(a => a + 1);
    if (!isGolden) {
      soundManager.playSoftTap();
      return;
    }
    soundManager.playHarmonicAffirmation();
    if (personaIdx + 1 < personas.length) {
      setPersonaIdx(p => p + 1);
    } else {
      const stars = attempts <= personas.length + 1 ? 3 : attempts <= personas.length + 3 ? 2 : 1;
      setEarnedStars(stars);
      const res = completeStage(GAME_ID, currentStage, stars, personas.length, onAddXP);
      setEarnedXP(res.xpAwarded);
      setProgress(getGameLevelProgress(GAME_ID));
      setCompleted(true);
      setShowCompletionModal(true);
    }
  };

  const handleNextStage = () => {
    if (currentStage < 3) {
      loadStage(currentStage + 1);
    } else {
      setShowCompletionModal(false);
    }
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'distance-safe',
      gameTitle: isAr ? `مسافة الأمان (المرحلة ${currentStage})` : `Safe Distance (Stage ${currentStage})`,
      quote: isAr ? 'لا تقترب لحد الاحتراق، ولا تبتعد لحد الصقيع.' : 'Not too close to burn, not too far to freeze.',
      reflection: userReflection || (isAr ? 'ضبطت المسافة الصحية لكل علاقة بحسب طبيعتها.' : 'Calibrated healthy relational distances.'),
      tag: isAr ? 'المسافة الآمنة' : 'Relational Balance'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
    if (onAddXP) onAddXP(15);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{isAr ? 'مسافة (الوحدة والقرب) ⚪' : 'Safe Relational Distance ⚪'}</span>
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {currentStage === 1
                ? (isAr ? 'المرحلة ١: ضبط مسافة الأمان في علاقتين واضحتين' : 'Stage 1: Basic relational distance calibration')
                : currentStage === 2
                ? (isAr ? 'المرحلة ٢: ٣ أنماط بشرية مختلفة تحتاج كل منها مسافة خاصة' : 'Stage 2: 3 distinct personas with custom safe zones')
                : (isAr ? 'المرحلة ٣: مقاومة السحب العاطفي الحي وتثبيت المدار الذهبي!' : 'Stage 3: Counter live emotional pull/drift & lock orbit!')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StageLevelSelector
            language={language}
            gameId={GAME_ID}
            currentStage={currentStage}
            progress={progress}
            onSelectStage={(s) => loadStage(s)}
            showCompletionModal={showCompletionModal}
            completedStageNumber={currentStage}
            starsEarned={earnedStars}
            movesMade={personas.length}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={() => loadStage(currentStage)}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />
          <button
            onClick={() => loadStage(currentStage)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span className="font-mono tabular-nums">
              {isAr ? `العلاقة ${personaIdx + 1} من ${personas.length}` : `Persona ${personaIdx + 1} of ${personas.length}`}
            </span>
            <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
              {isAr ? `المسافة الحالية: ${Math.round(distance)}٪` : `Distance: ${Math.round(distance)}%`}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 max-w-lg mx-auto space-y-1">
            <h2 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100">
              {currentPersona.emoji} {isAr ? currentPersona.nameAr : currentPersona.nameEn}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              {isAr ? currentPersona.descAr : currentPersona.descEn}
            </p>
          </div>

          {/* Dynamic Orbit Circles */}
          <div className="py-8 relative h-48 bg-stone-50 dark:bg-stone-800/60 rounded-3xl border border-stone-200 dark:border-stone-700 flex items-center justify-center overflow-hidden">
            <div
              className="w-24 h-24 rounded-full bg-emerald-600 text-white font-extrabold flex flex-col items-center justify-center text-xs shadow-md transition-transform duration-150"
              style={{ transform: `translateX(${isAr ? distance * 0.9 : -distance * 0.9}px)` }}
            >
              <span className="text-lg">🌿</span>
              <span>{isAr ? 'أنا' : 'Me'}</span>
            </div>

            <div
              className="w-24 h-24 rounded-full bg-indigo-600 text-white font-extrabold flex flex-col items-center justify-center text-xs shadow-md transition-transform duration-150"
              style={{ transform: `translateX(${isAr ? -distance * 0.9 : distance * 0.9}px)` }}
            >
              <span className="text-lg">{currentPersona.emoji}</span>
              <span>{isAr ? 'الآخر' : 'Other'}</span>
            </div>
          </div>

          {/* Slider with Golden Zone Highlight */}
          <div className="max-w-md mx-auto space-y-3">
            <div className="relative h-3 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-emerald-400/50 border-x-2 border-emerald-600"
                style={{
                  insetInlineStart: `${currentPersona.minSafe}%`,
                  width: `${currentPersona.maxSafe - currentPersona.minSafe}%`
                }}
              />
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={distance}
              onChange={(e) => {
                soundManager.playSoftTap();
                setDistance(Number(e.target.value));
              }}
              className="w-full accent-indigo-600 cursor-pointer h-2"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-bold px-1 font-mono tabular-nums">
              <span>{isAr ? 'تداخل (0%)' : 'Fused (0%)'}</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                {isAr ? `النطاق الصحي (${currentPersona.minSafe}٪–${currentPersona.maxSafe}٪)` : `Safe (${currentPersona.minSafe}%–${currentPersona.maxSafe}%)`}
              </span>
              <span>{isAr ? 'عزلة (100%)' : 'Isolated (100%)'}</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border-2 text-xs space-y-1 max-w-md mx-auto ${status.color}`}>
            <span className="font-extrabold text-sm block">{status.label}</span>
            <p className="leading-relaxed">{status.desc}</p>
          </div>

          <div className="flex justify-center pt-1">
            <button
              disabled={!isGolden}
              onClick={handleLockOrbit}
              className={`min-h-11 px-7 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                isGolden
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer scale-102'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>
                {personaIdx + 1 < personas.length
                  ? (isAr ? 'تثبيت المدار والانتقال للعلاقة التالية ✓' : 'Lock Orbit & Next Persona ✓')
                  : (isAr ? 'تثبيت المدار وإتمام المرحلة ✨' : 'Lock Final Orbit ✨')}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto text-3xl">
            ⚪
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            {isAr ? `اكتملت المرحلة ${currentStage} — المسافة أمان وليست قطيعة 🌿` : `Stage ${currentStage} Complete — Sovereign Connection`}
          </h2>

          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'مع من تحتاجين إعادة ضبط مسافة الأمان بهدوء؟' : 'Who in your life calls for a gentle distance reset?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'خاطرة شخصية عن حدودك...' : 'A reflection on your balance...'}
              className="w-full text-xs p-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-indigo-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-300 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => loadStage(currentStage)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة المرحلة' : 'Replay'}</span>
            </button>
            {currentStage < 3 && (
              <button
                onClick={handleNextStage}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black cursor-pointer"
              >
                {isAr ? `المرحلة التالية (${currentStage + 1}) 🚀` : `Next Stage (${currentStage + 1}) 🚀`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
