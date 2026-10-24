import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';
import {
  RotateCcw,
  Volume2,
  Wind,
  Activity
} from 'lucide-react';

interface ButterflyTapGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

const GAME_ID = 'game-butterfly-tap';

export const ButterflyTapGame: React.FC<ButterflyTapGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => getGameLevelProgress(GAME_ID).currentStage);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lastCompletedResult, setLastCompletedResult] = useState<{
    stage: number;
    stars: number;
    moves: number;
    xp: number;
  } | null>(null);

  const [expectedSide, setExpectedSide] = useState<'left' | 'right'>('left');
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [totalTaps, setTotalTaps] = useState<number>(0);
  const [rhythmHits, setRhythmHits] = useState<number>(0);
  const [inRhythmWindow, setInRhythmWindow] = useState<boolean>(true);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const targetCycles = currentStage === 1 ? 10 : currentStage === 2 ? 15 : 20;

  // Stage 2 & 3 rhythm window pulse + Stage 3 breath guidance
  useEffect(() => {
    if (isCompleted) return;

    let tick = 0;
    const interval = setInterval(() => {
      tick += 1;
      // Rhythm window alternates open (750ms) and rest (450ms) on Stage 2+
      if (currentStage >= 2) {
        const phasePos = tick % 4;
        setInRhythmWindow(phasePos <= 2);
      } else {
        setInRhythmWindow(true);
      }

      // Stage 3: 4s Inhale (13 ticks of 300ms) -> 6s Exhale (20 ticks of 300ms)
      if (currentStage === 3) {
        const breathCycleTick = tick % 33;
        setBreathPhase(breathCycleTick < 13 ? 'inhale' : 'exhale');
      }
    }, 300);

    return () => clearInterval(interval);
  }, [currentStage, isCompleted]);

  // Keyboard Left/Right support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;
      if (e.key === 'ArrowLeft') handleTap('left');
      if (e.key === 'ArrowRight') handleTap('right');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const resetStageState = (stageNum: number) => {
    setCurrentStage(stageNum);
    setCycleCount(0);
    setTotalTaps(0);
    setRhythmHits(0);
    setExpectedSide('left');
    setBreathPhase('inhale');
    setIsCompleted(false);
    setShowCompletionModal(false);
  };

  const handleSelectStage = (stageNum: number) => {
    setActiveStage(GAME_ID, stageNum);
    setProgress(getGameLevelProgress(GAME_ID));
    resetStageState(stageNum);
  };

  const handleTap = (side: 'left' | 'right') => {
    if (isCompleted) return;

    const nextTotalTaps = totalTaps + 1;
    setTotalTaps(nextTotalTaps);
    soundManager.playBilateralTap(side === 'left');

    if (side === expectedSide) {
      const nextRhythmHits = (currentStage === 1 || inRhythmWindow) ? rhythmHits + 1 : rhythmHits;
      setRhythmHits(nextRhythmHits);

      if (side === 'right') {
        const nextCount = cycleCount + 1;
        setCycleCount(nextCount);
        if (nextCount % 5 === 0) {
          soundManager.playCoinSound();
        }
        if (nextCount >= targetCycles) {
          setIsCompleted(true);
          const accuracy = Math.round((nextRhythmHits / Math.max(1, nextTotalTaps)) * 100);
          const stars = currentStage === 1
            ? (nextTotalTaps <= targetCycles * 2 + 2 ? 3 : 2)
            : accuracy >= 80
            ? 3
            : accuracy >= 60
            ? 2
            : 1;

          const result = completeStage(GAME_ID, currentStage, stars, nextCount, onAddXP);
          setProgress(getGameLevelProgress(GAME_ID));
          setLastCompletedResult({
            stage: currentStage,
            stars,
            moves: nextCount,
            xp: result.xpAwarded
          });
          setShowCompletionModal(true);
        }
      }
      setExpectedSide(side === 'left' ? 'right' : 'left');
    }
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    resetStageState(currentStage);
  };

  const progressPercent = Math.min(100, (cycleCount / targetCycles) * 100);
  const rhythmAccuracy = totalTaps > 0 ? Math.round((rhythmHits / totalTaps) * 100) : 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-fade-in">
      {/* Top Arcade Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex flex-wrap items-center justify-between gap-3">
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
            {isAr ? 'نقر الفراشة الثنائي 🦋' : 'Bilateral Butterfly Tap 🦋'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">
            {isAr ? 'صوت مجسم ثنائي (يمين/يسار)' : 'Stereo Audio Panning'}
          </span>
        </div>
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
          onNextStage={() => {
            const next = currentStage + 1;
            handleSelectStage(next);
          }}
          onReplayStage={handleReset}
          onCloseCompletionModal={() => setShowCompletionModal(false)}
        />

        {currentStage >= 2 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-900">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>{isAr ? `دقة الإيقاع: ${rhythmAccuracy}%` : `Rhythm Sync: ${rhythmAccuracy}%`}</span>
          </div>
        )}
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          {/* Instructions Box */}
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
              {currentStage === 1 && (isAr ? 'المرحلة ١: التربيت الثنائي الحر والهادئ' : 'Stage 1: Gentle Free Alternation')}
              {currentStage === 2 && (isAr ? 'المرحلة ٢: التزامن مع نبض الهالة المضيئة' : 'Stage 2: Tempo-Window Synchronization')}
              {currentStage === 3 && (isAr ? 'المرحلة ٣: التربيت المتزامن مع الشهيق والزفير الطويل' : 'Stage 3: Breath-Coupled Bilateral Flow')}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'عانق نفسك وانقر بالتبادل 🦋' : 'Cross Arms & Tap in Alternation 🦋'}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              {currentStage === 1 && (isAr
                ? 'ضع يديك متصالبتين على كتفيك كجناحي فراشة، وانقر الجناح الأيسر ثم الأيمن بإيقاعك الهادئ لـ ١٠ دورات.'
                : 'Cross hands over your chest like butterfly wings and alternate left-right for 10 cycles.')}
              {currentStage === 2 && (isAr
                ? 'انقر عندما تتوهج حلقة الإيقاع باللون الفيروزي لتحقيق تناغم عصبي أدق بين فصي الدماغ لـ ١٥ دورة.'
                : 'Tap inside the glowing emerald rhythm window to deepen inter-hemispheric sync across 15 cycles.')}
              {currentStage === 3 && (isAr
                ? 'اجمع بين التربيت الثنائي المتزن وموجة التنفس الحيوية (٤ ثوانٍ شهيق و٦ ثوانٍ زفير مريح) لـ ٢٠ دورة عميقة.'
                : 'Pair steady bilateral tapping with 4s inhale and 6s calming exhale across 20 restorative cycles.')}
            </p>
          </div>

          {/* Stage 3 Breath Banner */}
          {currentStage === 3 && (
            <div className={`max-w-sm mx-auto py-2.5 px-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 text-xs font-extrabold ${
              breathPhase === 'inhale'
                ? 'bg-sky-50 border-sky-300 text-sky-900 scale-102'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <Wind className="w-4 h-4" />
              <span>
                {breathPhase === 'inhale'
                  ? (isAr ? '🫁 شهيق هادئ من الأنف (٤ ثوانٍ) مع استمرار النقر...' : '🫁 Inhale Gently (4s) while tapping...')
                  : (isAr ? '💨 زفير طويل وناعم من الفم (٦ ثوانٍ) مع النقر...' : '💨 Long Slow Exhale (6s) while tapping...')}
              </span>
            </div>
          )}

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
          <div className="py-5 flex items-center justify-center gap-4 sm:gap-10">
            {/* Left Wing */}
            <button
              onClick={() => handleTap('left')}
              className={`w-32 h-44 sm:w-40 sm:h-52 rounded-3xl border-4 transition-all transform active:scale-95 flex flex-col items-center justify-center p-4 cursor-pointer shadow-md select-none ${
                expectedSide === 'left'
                  ? inRhythmWindow
                    ? 'border-teal-500 bg-teal-50 text-teal-950 scale-105 ring-4 ring-teal-300/50 shadow-teal-200/50'
                    : 'border-amber-400 bg-amber-50/60 text-stone-800 scale-102'
                  : 'border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100 opacity-80'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-2 transform -scale-x-100">🦋</span>
              <span className="text-base font-extrabold">{isAr ? 'اليسار' : 'Left Tap'}</span>
              <span className="text-[10px] font-bold text-teal-700 mt-1">
                {expectedSide === 'left'
                  ? (currentStage >= 2
                      ? (inRhythmWindow ? (isAr ? '✨ نبضة مثالية الآن!' : '⏳ انتظر النبضة...') : (isAr ? 'انقر هنا الآن!' : 'Tap Now!'))
                      : (isAr ? 'انقر هنا الآن!' : 'Tap Now!'))
                  : '—'}
              </span>
            </button>

            {/* Center Rhythm / Breath Guide */}
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                inRhythmWindow
                  ? 'bg-emerald-100 text-emerald-700 scale-110 ring-4 ring-emerald-300/60 shadow-md'
                  : 'bg-stone-100 text-stone-500 scale-95'
              }`}>
                🌿
              </div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                {currentStage >= 2
                  ? (inRhythmWindow ? (isAr ? 'إيقاع متناغم' : 'Pulse Open') : (isAr ? 'سكون خفيف' : 'Soft Pause'))
                  : (isAr ? 'تنفس هادئ' : 'Breathe')}
              </span>
            </div>

            {/* Right Wing */}
            <button
              onClick={() => handleTap('right')}
              className={`w-32 h-44 sm:w-40 sm:h-52 rounded-3xl border-4 transition-all transform active:scale-95 flex flex-col items-center justify-center p-4 cursor-pointer shadow-md select-none ${
                expectedSide === 'right'
                  ? inRhythmWindow
                    ? 'border-teal-500 bg-teal-50 text-teal-950 scale-105 ring-4 ring-teal-300/50 shadow-teal-200/50'
                    : 'border-amber-400 bg-amber-50/60 text-stone-800 scale-102'
                  : 'border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100 opacity-80'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-2">🦋</span>
              <span className="text-base font-extrabold">{isAr ? 'اليمين' : 'Right Tap'}</span>
              <span className="text-[10px] font-bold text-teal-700 mt-1">
                {expectedSide === 'right'
                  ? (currentStage >= 2
                      ? (inRhythmWindow ? (isAr ? '✨ نبضة مثالية الآن!' : '⏳ انتظر النبضة...') : (isAr ? 'انقر هنا الآن!' : 'Tap Now!'))
                      : (isAr ? 'انقر هنا الآن!' : 'Tap Now!'))
                  : '—'}
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
                ? `أتممت ${targetCycles} دورة تحفيز ثنائي بنجاح في المرحلة ${currentStage} بدقة إيقاع ${rhythmAccuracy}%.`
                : `You completed ${targetCycles} bilateral stimulation cycles in Stage ${currentStage} with ${rhythmAccuracy}% sync.`}
            </p>
          </div>

          <div className="p-4 bg-teal-50 rounded-2xl max-w-md mx-auto text-xs text-teal-950 border border-teal-200">
            {isAr
              ? '🌿 احتفظ بهذه التقنية في ذاكرتك الجسدية: كلما شعرت بفورة التوتر، عانق نفسك وانقر برفق وبطء.'
              : '🌿 Remember this somatic anchor: cross arms and tap slowly whenever overwhelmed.'}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة المرحلة' : 'Repeat Stage'}</span>
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
