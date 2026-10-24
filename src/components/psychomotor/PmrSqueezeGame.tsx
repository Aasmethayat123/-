import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';
import {
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface PmrSqueezeGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

const GAME_ID = 'game-pmr-squeeze';

export const PmrSqueezeGame: React.FC<PmrSqueezeGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const getGroupsForStage = (stage: number) => {
    const all = [
      {
        id: 'fists',
        title: isAr ? 'قبضتا اليدين والأصابع' : 'Fists & Hands',
        instruction: isAr ? 'اقبض كفيك بقوة وشد أصابعك بتركيز...' : 'Clench your fists tightly with focus...'
      },
      {
        id: 'shoulders',
        title: isAr ? 'الكتفان والرقبة' : 'Shoulders & Neck',
        instruction: isAr ? 'ارفع كتفيك للأعلى باتجاه أذنيك واحبس الشد...' : 'Hunch shoulders up toward your ears...'
      },
      {
        id: 'jaw',
        title: isAr ? 'الفك وعضلات الوجه' : 'Jaw & Face',
        instruction: isAr ? 'اضغط شفتيك وعضلات الجبهة والوجه بوعي...' : 'Squeeze facial muscles and jaw mindfully...'
      },
      {
        id: 'belly',
        title: isAr ? 'البطن والجذع العميق' : 'Stomach & Core',
        instruction: isAr ? 'شد عضلات البطن والجذع بثبات مع الشهيق...' : 'Tighten abdominal core steadily...'
      },
      {
        id: 'calves',
        title: isAr ? 'الساقان وأصابع القدمين' : 'Calves & Feet',
        instruction: isAr ? 'اثنِ أصابع قدميك وشد عضلات الساقين حتى ذروة الدفء...' : 'Curl toes and tense calves before total release...'
      }
    ];
    if (stage === 1) return all.slice(0, 3);
    if (stage === 2) return all.slice(0, 4);
    return all;
  };

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => getGameLevelProgress(GAME_ID).currentStage);
  const [groupIndex, setGroupIndex] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 130 in precision stages
  const [phase, setPhase] = useState<'ready' | 'squeezing' | 'melted'>('ready');
  const [perfectReleases, setPerfectReleases] = useState(0);
  const [overSqueezeWarning, setOverSqueezeWarning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lastCompletedResult, setLastCompletedResult] = useState<{
    stage: number;
    stars: number;
    moves: number;
    xp: number;
  } | null>(null);

  const muscleGroups = getGroupsForStage(currentStage);
  const currentGroup = muscleGroups[groupIndex] || muscleGroups[0];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stage 1 auto-melts at 100%. Stage 2 & 3 require releasing inside the Golden Melt Window (90% - 115%) without over-clenching (>120%)!
  const stepMs = currentStage === 1 ? 500 : currentStage === 2 ? 450 : 520;
  const stepIncrement = currentStage === 1 ? 25 : 15;

  const resetStageState = (stageNum: number) => {
    setCurrentStage(stageNum);
    setGroupIndex(0);
    setIsPressing(false);
    setHoldProgress(0);
    setPhase('ready');
    setPerfectReleases(0);
    setOverSqueezeWarning(false);
    setCompleted(false);
    setShowCompletionModal(false);
  };

  const handleSelectStage = (stageNum: number) => {
    setActiveStage(GAME_ID, stageNum);
    setProgress(getGameLevelProgress(GAME_ID));
    resetStageState(stageNum);
  };

  const startSqueeze = () => {
    if (phase === 'melted') return;
    setOverSqueezeWarning(false);
    setIsPressing(true);
    setPhase('squeezing');
    soundManager.playHeartbeat();
  };

  const endSqueeze = () => {
    if (phase !== 'squeezing') return;
    setIsPressing(false);

    if (currentStage >= 2 && holdProgress >= 85 && holdProgress <= 118) {
      // Golden Melt Window release!
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
      setPerfectReleases(prev => prev + 1);
      setPhase('melted');
      return;
    }

    if (holdProgress < 100) {
      setHoldProgress(0);
      setPhase('ready');
    }
  };

  useEffect(() => {
    if (isPressing && phase === 'squeezing') {
      timerRef.current = setInterval(() => {
        setHoldProgress(prev => {
          const next = prev + stepIncrement;
          if (currentStage === 1 && next >= 100) {
            if (timerRef.current) clearInterval(timerRef.current);
            soundManager.playHarmonicAffirmation();
            triggerConfetti(0.5, 0.4);
            setPerfectReleases(p => p + 1);
            setPhase('melted');
            setIsPressing(false);
            return 100;
          }
          if (currentStage >= 2 && next >= 125) {
            // Over-clenched past golden release window! Reset or soft melt with warning
            if (timerRef.current) clearInterval(timerRef.current);
            soundManager.playSoftTap();
            setOverSqueezeWarning(true);
            setPhase('melted');
            setIsPressing(false);
            return 100;
          }
          if (currentStage >= 2 && next >= 85 && prev < 85) {
            soundManager.playChime(660, 0.5);
          }
          return next;
        });
      }, stepMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPressing, phase, currentStage, stepMs, stepIncrement]);

  const handleNextGroup = () => {
    soundManager.playSoftTap();
    if (groupIndex + 1 < muscleGroups.length) {
      setGroupIndex(prev => prev + 1);
      setPhase('ready');
      setHoldProgress(0);
      setOverSqueezeWarning(false);
    } else {
      setCompleted(true);
      const stars = currentStage === 1
        ? 3
        : perfectReleases >= muscleGroups.length - 1
        ? 3
        : perfectReleases >= Math.ceil(muscleGroups.length / 2)
        ? 2
        : 1;
      const res = completeStage(GAME_ID, currentStage, stars, perfectReleases, onAddXP);
      setProgress(getGameLevelProgress(GAME_ID));
      setLastCompletedResult({
        stage: currentStage,
        stars,
        moves: perfectReleases,
        xp: res.xpAwarded
      });
      setShowCompletionModal(true);
    }
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    resetStageState(currentStage);
  };

  const inGoldenWindow = currentStage >= 2 && holdProgress >= 85 && holdProgress <= 118;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-fade-in">
      {/* Top Arcade Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex flex-wrap items-center justify-between gap-2">
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
            {isAr ? 'الشد والارتخاء العضلي (PMR) ✊' : 'Squeeze & Melt (PMR) ✊'}
          </span>
        </div>

        <span className="text-xs font-bold text-rose-300">
          {isAr ? `المجموعة ${groupIndex + 1} من ${muscleGroups.length}` : `Group ${groupIndex + 1} of ${muscleGroups.length}`}
        </span>
      </div>

      {/* Progressive Stage Selector */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <StageLevelSelector
          language={language}
          gameId={GAME_ID}
          currentStage={currentStage}
          progress={progress}
          onSelectStage={handleSelectStage}
          showCompletionModal={showCompletionModal}
          completedStageNumber={lastCompletedResult?.stage || currentStage}
          starsEarned={lastCompletedResult?.stars || 3}
          movesMade={lastCompletedResult?.moves}
          xpEarned={lastCompletedResult?.xp}
          onNextStage={() => handleSelectStage(currentStage + 1)}
          onReplayStage={handleReset}
          onCloseCompletionModal={() => setShowCompletionModal(false)}
        />

        {currentStage >= 2 && (
          <div className="px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {isAr ? `إفلات ذهبي متقن: ${perfectReleases}/${muscleGroups.length}` : `Golden Melts: ${perfectReleases}/${muscleGroups.length}`}
            </span>
          </div>
        )}
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
              {currentStage === 1 && (isAr ? 'المرحلة ١: ٣ مجموعات عضلية أساسية (تلقائية الإفلات)' : 'Stage 1: 3 Core Muscle Groups (Auto Release)')}
              {currentStage === 2 && (isAr ? 'المرحلة ٢: ٤ مجموعات + الإفلات في نافذة الذوبان الذهبية!' : 'Stage 2: 4 Groups + Release Inside the Golden Melt Window!')}
              {currentStage === 3 && (isAr ? 'المرحلة ٣: دورة جاكوبسون الكاملة (٥ مجموعات بشد عميق وإفلات دقيق)' : 'Stage 3: Full 5-Group Jacobson Clinical Sequence')}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {currentGroup.title}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-serif">
              «{currentGroup.instruction}»
            </p>
            {currentStage >= 2 && phase !== 'melted' && (
              <p className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
                {isAr
                  ? '🎯 التحدي: اضغط مطولاً، وعندما يتحول الزر للذهبي المشع ارفع إصبعك فوراً مع الزفير قبل الإفراط في الشد!'
                  : '🎯 Hold down, then release your finger the moment the circle turns Golden!'}
              </p>
            )}
          </div>

          {/* Interactive Squeeze & Melt Trigger Circle */}
          <div className="py-5 flex flex-col items-center justify-center space-y-4">
            <button
              onMouseDown={startSqueeze}
              onMouseUp={endSqueeze}
              onMouseLeave={endSqueeze}
              onTouchStart={startSqueeze}
              onTouchEnd={endSqueeze}
              className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 transition-all duration-200 flex flex-col items-center justify-center p-4 cursor-pointer select-none shadow-xl ${
                phase === 'melted'
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-950 scale-105 shadow-emerald-200'
                  : inGoldenWindow
                  ? 'border-amber-400 bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-950 scale-95 ring-8 ring-amber-300/60'
                  : isPressing
                  ? 'border-rose-600 bg-rose-500 text-white scale-90 shadow-inner'
                  : 'border-rose-400 bg-rose-50 text-rose-950 hover:bg-rose-100'
              }`}
            >
              {phase === 'melted' ? (
                <>
                  <span className="text-5xl">🌿</span>
                  <span className="text-base font-extrabold mt-1">{isAr ? 'ارتخاء تام!' : 'Deep Melt!'}</span>
                  <span className="text-[11px] text-emerald-700">
                    {overSqueezeWarning
                      ? (isAr ? 'شددتِ أكثر من اللازم قليلاً، أرخي الآن' : 'Held slightly too long — breathe out')
                      : (isAr ? 'ذوبان عصبي مثالي ودافئ ✨' : 'Perfect Golden Release ✨')}
                  </span>
                </>
              ) : inGoldenWindow ? (
                <>
                  <span className="text-5xl animate-bounce">✨</span>
                  <span className="text-base font-black mt-1">{isAr ? 'اترك الآن مع الزفير!' : 'RELEASE NOW!'}</span>
                  <span className="text-xs font-mono font-bold">{isAr ? 'نافذة الذوبان الذهبية' : 'Golden Melt Window'}</span>
                </>
              ) : isPressing ? (
                <>
                  <span className="text-5xl animate-pulse">✊</span>
                  <span className="text-base font-extrabold mt-1">{isAr ? 'شد بقوة وثبات!' : 'Hold Tight!'}</span>
                  <span className="text-xs font-mono font-bold">{Math.min(100, holdProgress)}%</span>
                </>
              ) : (
                <>
                  <span className="text-5xl">🖐️</span>
                  <span className="text-sm font-extrabold mt-1">{isAr ? 'اضغط مع الاستمرار' : 'Press & Hold'}</span>
                  <span className="text-[10px] opacity-75">
                    {currentStage === 1
                      ? (isAr ? 'شد لطيف ومستمر' : 'Hold until release')
                      : (isAr ? 'شد حتى تتوهج الهالة الذهبية' : 'Hold until Golden Window')}
                  </span>
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
                  ? 'عندما تشد العضلة ثم تطلق سراحها في لحظة الذروة مع الزفير، يرسل الدماغ موجة استرخاء مضاعفة تتجاوز مستوى هدوئك الأصلي.'
                  : 'Deliberate contraction followed by crisp release triggers a deep parasympathetic rebound.'}
              </p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNextGroup}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  {groupIndex + 1 < muscleGroups.length
                    ? (isAr ? 'المجموعة العضلية التالية ←' : 'Next Muscle Group →')
                    : (isAr ? 'إنهاء المرحلة وحصد النجوم 🏆' : 'Complete Stage 🏆')}
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
                ? `أتقنت التمييز الحسي بين الشد والارتخاء عبر ${muscleGroups.length} مجموعات عضلية في المرحلة ${currentStage}.`
                : `Completed ${muscleGroups.length} neuromuscular release groups in Stage ${currentStage}.`}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة المرحلة' : 'Play Again'}</span>
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
