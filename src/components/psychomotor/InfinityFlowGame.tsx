import React, { useState, useEffect, useRef } from 'react';
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
  Infinity as InfinityIcon,
  Sparkles,
  Wind
} from 'lucide-react';

interface InfinityFlowGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

const GAME_ID = 'game-infinity-flow';

export const InfinityFlowGame: React.FC<InfinityFlowGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => getGameLevelProgress(GAME_ID).currentStage);
  const [laps, setLaps] = useState<number>(0);
  const [orbAngle, setOrbAngle] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [syncSamples, setSyncSamples] = useState<{ hits: number; total: number }>({ hits: 0, total: 0 });
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lastCompletedResult, setLastCompletedResult] = useState<{
    stage: number;
    stars: number;
    moves: number;
    xp: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const syncRef = useRef<{ hits: number; total: number }>({ hits: 0, total: 0 });

  const targetLaps = currentStage === 1 ? 5 : currentStage === 2 ? 6 : 8;
  const angularSpeed = currentStage === 1 ? 0.036 : currentStage === 2 ? 0.032 : 0.028;

  const computeOrbCoords = (angle: number) => {
    const scale = 110;
    const sinT = Math.sin(angle);
    const cosT = Math.cos(angle);
    const denom = 1 + sinT * sinT;
    return {
      x: (scale * cosT) / denom + 150,
      y: (scale * sinT * cosT) / denom + 90
    };
  };

  const resetStageState = (stageNum: number) => {
    setCurrentStage(stageNum);
    setLaps(0);
    setOrbAngle(0);
    setIsCompleted(false);
    setPointerPos(null);
    pointerRef.current = null;
    syncRef.current = { hits: 0, total: 0 };
    setSyncSamples({ hits: 0, total: 0 });
    setShowCompletionModal(false);
  };

  const handleSelectStage = (stageNum: number) => {
    setActiveStage(GAME_ID, stageNum);
    setProgress(getGameLevelProgress(GAME_ID));
    resetStageState(stageNum);
  };

  useEffect(() => {
    if (isCompleted) return;

    const interval = setInterval(() => {
      setOrbAngle(prev => {
        const next = prev + angularSpeed;
        const coords = computeOrbCoords(next);

        if (currentStage >= 2) {
          syncRef.current.total += 1;
          if (pointerRef.current) {
            const dx = pointerRef.current.x - coords.x;
            const dy = pointerRef.current.y - coords.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= (currentStage === 2 ? 48 : 40)) {
              syncRef.current.hits += 1;
            }
          }
          if (syncRef.current.total % 6 === 0) {
            setSyncSamples({ ...syncRef.current });
          }
        }

        if (next >= Math.PI * 2) {
          setLaps(l => {
            const nextLap = l + 1;
            soundManager.playHarmonicAffirmation();
            if (nextLap >= targetLaps) {
              setIsCompleted(true);
              const syncPct = currentStage === 1
                ? 100
                : Math.round((syncRef.current.hits / Math.max(1, syncRef.current.total)) * 100);
              const stars = currentStage === 1
                ? 3
                : syncPct >= 65
                ? 3
                : syncPct >= 35
                ? 2
                : 1;
              const res = completeStage(GAME_ID, currentStage, stars, nextLap, onAddXP);
              setProgress(getGameLevelProgress(GAME_ID));
              setLastCompletedResult({
                stage: currentStage,
                stars,
                moves: nextLap,
                xp: res.xpAwarded
              });
              setShowCompletionModal(true);
            }
            return nextLap;
          });
          return 0;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isCompleted, targetLaps, angularSpeed, currentStage, onAddXP]);

  const updatePointerFromClient = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 300;
    const y = ((clientY - rect.top) / rect.height) * 180;
    const p = { x, y };
    pointerRef.current = p;
    setPointerPos(p);
  };

  const { x: orbX, y: orbY } = computeOrbCoords(orbAngle);
  const harmonicTwin = computeOrbCoords(orbAngle + Math.PI);
  const harmonyPct = currentStage === 1
    ? 100
    : syncSamples.total > 0
    ? Math.round((syncSamples.hits / syncSamples.total) * 100)
    : 100;
  const breathSide = orbAngle < Math.PI ? 'inhale' : 'exhale';

  const handleReset = () => {
    soundManager.playSoftTap();
    resetStageState(currentStage);
  };

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
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            {isAr ? 'مسار اللانهاية البصري (∞) 🌊' : 'Infinity Flow (∞) 🌊'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
          <InfinityIcon className="w-4 h-4 text-cyan-400" />
          <span>{isAr ? `الدورات: ${laps}/${targetLaps}` : `Loops: ${laps}/${targetLaps}`}</span>
        </div>
      </div>

      {/* Stage Selector */}
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
          <div className="px-3 py-1.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>{isAr ? `تناغم التتبع باللمس: ${harmonyPct}%` : `Touch Harmony: ${harmonyPct}%`}</span>
          </div>
        )}
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider block">
              {currentStage === 1 && (isAr ? 'المرحلة ١: التتبع البصري الهادئ بالعينين (٥ دورات)' : 'Stage 1: Calm Ocular Tracking (5 Loops)')}
              {currentStage === 2 && (isAr ? 'المرحلة ٢: التتبع الحركي بالإصبع أو المؤشر فوق النور (٦ دورات)' : 'Stage 2: Interactive Finger/Cursor Tracking (6 Loops)')}
              {currentStage === 3 && (isAr ? 'المرحلة ٣: التناغم المزدوج مع الشهيق والزفير (٨ دورات)' : 'Stage 3: Breath-Synced Dual Harmonic Infinity (8 Loops)')}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {currentStage === 1
                ? (isAr ? 'تتبع النقطة المضيئة بعينيك بهدوء' : 'Trace the Glowing Orb with Soft Eyes')
                : (isAr ? 'رافق النقطة السماوية بإصبعك وعينيك بانسيابية' : 'Glide Your Finger/Cursor Along the Cyan Orb')}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-serif">
              {currentStage === 1 && (isAr
                ? 'الحركة البصرية الأفقية على شكل علامة اللانهاية (∞) تهدئ التوتر في عضلات العين والجمجمة.'
                : 'Smooth lateral figure-eight ocular movement triggers parasympathetic braking.')}
              {currentStage === 2 && (isAr
                ? 'مرر إصبعك أو الماوس فوق المدار المضيء لمرافقة الكرة الفيروزية وبناء تناغم بصري-حركي عميق.'
                : 'Keep your finger or cursor gently gliding with the cyan orb to build hand-eye vagal harmony.')}
              {currentStage === 3 && (isAr
                ? 'رافق النور الفيروزي بإصبعك مع تنظيم أنفاسك: الفص الأول شهيق ناعم، والفص الثاني زفير مريح طويل.'
                : 'Trace the cyan orb while breathing: first loop gentle inhale, second loop slow releasing exhale.')}
            </p>
          </div>

          {currentStage === 3 && (
            <div className={`max-w-xs mx-auto py-2 px-4 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              breathSide === 'inhale'
                ? 'bg-sky-50 border-sky-200 text-sky-900'
                : 'bg-teal-50 border-teal-200 text-teal-900'
            }`}>
              <Wind className="w-4 h-4" />
              <span>
                {breathSide === 'inhale'
                  ? (isAr ? '🫁 الفص الأيمن: شهيق هادئ...' : '🫁 Right Loop: Soft Inhale...')
                  : (isAr ? '💨 الفص الأيسر: زفير عميق...' : '💨 Left Loop: Slow Exhale...')}
              </span>
            </div>
          )}

          {/* Infinity Visual Canvas */}
          <div className="relative w-full max-w-md h-56 mx-auto flex items-center justify-center bg-stone-900 rounded-3xl p-4 shadow-inner border-2 border-stone-800 overflow-hidden touch-none select-none">
            <svg
              ref={svgRef}
              viewBox="0 0 300 180"
              className="w-full h-full cursor-pointer"
              onMouseMove={(e) => {
                if (currentStage >= 2) updatePointerFromClient(e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                if (currentStage >= 2 && e.touches[0]) {
                  updatePointerFromClient(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              onTouchMove={(e) => {
                if (currentStage >= 2 && e.touches[0]) {
                  updatePointerFromClient(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
            >
              {/* Subtle background path */}
              <path
                d="M 150,90 C 200,30 270,30 270,90 C 270,150 200,150 150,90 C 100,30 30,30 30,90 C 30,150 100,150 150,90 Z"
                fill="none"
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="6"
                strokeDasharray="4 6"
              />

              {/* Stage 3 Twin Harmonic Counter-Orb */}
              {currentStage === 3 && (
                <circle
                  cx={harmonicTwin.x}
                  cy={harmonicTwin.y}
                  r="6"
                  fill="#fbbf24"
                  opacity="0.65"
                />
              )}

              {/* User Touch Halo in Stage 2+ */}
              {currentStage >= 2 && pointerPos && (
                <circle
                  cx={pointerPos.x}
                  cy={pointerPos.y}
                  r="20"
                  fill="rgba(34, 211, 238, 0.15)"
                  stroke="rgba(34, 211, 238, 0.55)"
                  strokeWidth="1.5"
                />
              )}

              {/* Glowing Primary Orb */}
              <circle
                cx={orbX}
                cy={orbY}
                r="11"
                fill="#22d3ee"
                className="filter drop-shadow-[0_0_12px_#22d3ee]"
              />
              <circle
                cx={orbX}
                cy={orbY}
                r="4.5"
                fill="#ffffff"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-700 block">
              {isAr ? `الدورة ${laps + 1} من ${targetLaps}` : `Cycle ${laps + 1} of ${targetLaps}`}
            </span>
            <p className="text-xs text-stone-400">
              {currentStage === 1
                ? (isAr ? 'أرخِ فكك وكتفيك وتنفس بعمق مع حركة النور 🌿' : 'Keep shoulders soft, breathe gently with the light 🌿')
                : (isAr ? 'أبقِ إصبعك أو المؤشر داخل هالة النور المتحركة 🌊' : 'Keep your finger or pointer gliding over the cyan orb 🌊')}
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
                ? `أتممت ${targetLaps} دورات لانهاية متناغمة في المرحلة ${currentStage}.`
                : `Completed ${targetLaps} smooth infinity tracking cycles in Stage ${currentStage}.`}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة المرحلة' : 'Trace Again'}</span>
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
