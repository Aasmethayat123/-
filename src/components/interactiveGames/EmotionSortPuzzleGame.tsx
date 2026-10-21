import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Bookmark, 
  CheckCircle2, 
  FlaskConical, 
  Droplet, 
  Heart, 
  Undo2,
  Trophy,
  HelpCircle
} from 'lucide-react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { 
  getGameLevelProgress, 
  completeStage, 
  setActiveStage, 
  GameProgressData 
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface EmotionSortPuzzleGameProps {
  language: Language;
  onBackToMap: () => void;
  onAddXP?: (amount: number) => void;
}

type EmotionColor = 'blue' | 'green' | 'pink' | 'purple' | 'gold';

interface EmotionInfo {
  nameAr: string;
  nameEn: string;
  hex: string;
  lightHex: string;
  meaningAr: string;
  meaningEn: string;
}

const EMOTIONS_INFO: Record<EmotionColor, EmotionInfo> = {
  blue: {
    nameAr: 'الحزن والشجن',
    nameEn: 'Tender Grief',
    hex: '#0284c7', // sky-600
    lightHex: '#38bdf8',
    meaningAr: 'دموع تفرغ الثقل وتذكرنا بما له قيمة حقيقية في حياتنا.',
    meaningEn: 'Tears releasing weight and honoring what holds true value.'
  },
  green: {
    nameAr: 'الأمان والسكينة',
    nameEn: 'Grounded Peace',
    hex: '#059669', // emerald-600
    lightHex: '#34d399',
    meaningAr: 'اتزان الجهاز العصبي واستشعار ثبات الأرض تحت أقدامنا.',
    meaningEn: 'Nervous system regulation and feeling the ground beneath us.'
  },
  pink: {
    nameAr: 'المحبة والامتنان',
    nameEn: 'Gratitude & Love',
    hex: '#db2777', // pink-600
    lightHex: '#f472b6',
    meaningAr: 'دفء القلب والانفتاح على الجمال والتراحم مع النفس.',
    meaningEn: 'Heartfelt warmth and embracing gentle self-compassion.'
  },
  purple: {
    nameAr: 'الدهشة والاستكشاف',
    nameEn: 'Curiosity & Awe',
    hex: '#7c3aed', // violet-600
    lightHex: '#a78bfa',
    meaningAr: 'فضول طفولي يعيد الحياة للألوان ويبدد رتابة الخوف.',
    meaningEn: 'Childlike awe reviving colors and dissolving routine fear.'
  },
  gold: {
    nameAr: 'الأمل واليقين الذهبي',
    nameEn: 'Golden Hope & Clarity',
    hex: '#d97706', // amber-600
    lightHex: '#fbbf24',
    meaningAr: 'بصيص نور يشرق في القلب ويبعث الطمأنينة في الغد.',
    meaningEn: 'Radiant inner hope reminding the soul of dawn after the dark.'
  }
};

// 5 Progressive Puzzle Stages
const STAGE_PUZZLES: Record<number, EmotionColor[][]> = {
  // Stage 1: Beginner (2 colors, 3 tubes)
  1: [
    ['blue', 'green', 'blue', 'green'],
    ['green', 'blue', 'green', 'blue'],
    [] // Empty tube
  ],
  // Stage 2: Intermediate (3 colors, 4 tubes)
  2: [
    ['pink', 'blue', 'green', 'pink'],
    ['blue', 'green', 'pink', 'blue'],
    ['green', 'pink', 'blue', 'green'],
    [] // Empty tube
  ],
  // Stage 3: Advanced (4 colors, 5 tubes)
  3: [
    ['blue', 'green', 'pink', 'purple'],
    ['pink', 'blue', 'purple', 'green'],
    ['green', 'purple', 'blue', 'pink'],
    ['purple', 'pink', 'green', 'blue'],
    [] // Empty tube
  ],
  // Stage 4: Expert (4 colors, 6 tubes with 2 empty buffer flasks)
  4: [
    ['purple', 'pink', 'blue', 'green'],
    ['green', 'purple', 'pink', 'blue'],
    ['blue', 'green', 'purple', 'pink'],
    ['pink', 'blue', 'green', 'purple'],
    [], // Buffer 1
    []  // Buffer 2
  ],
  // Stage 5: Grand Master (5 colors including Gold, 7 tubes)
  5: [
    ['gold', 'blue', 'green', 'pink'],
    ['purple', 'gold', 'blue', 'green'],
    ['pink', 'purple', 'gold', 'blue'],
    ['green', 'pink', 'purple', 'gold'],
    ['blue', 'green', 'pink', 'purple'],
    [], // Buffer 1
    []  // Buffer 2
  ]
};

const GAME_ID = 'emotion-sort-puzzle';

export const EmotionSortPuzzleGame: React.FC<EmotionSortPuzzleGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const [tubes, setTubes] = useState<EmotionColor[][]>(() => 
    (STAGE_PUZZLES[currentStage] || STAGE_PUZZLES[1]).map(t => [...t])
  );
  const [selectedTubeIdx, setSelectedTubeIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<EmotionColor[][][]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [starsAwarded, setStarsAwarded] = useState<number>(3);
  const [earnedXP, setEarnedXP] = useState<number>(60);

  // Sync when current stage changes
  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    const initialTubes = (STAGE_PUZZLES[stageNum] || STAGE_PUZZLES[1]).map(t => [...t]);
    setTubes(initialTubes);
    setSelectedTubeIdx(null);
    setHistory([]);
    setMovesCount(0);
    setIsGameWon(false);
    setShowCompletionModal(false);
  };

  // Check if all tubes are either empty or completely filled with a single color
  const checkWin = (currentTubes: EmotionColor[][]): boolean => {
    return currentTubes.every(tube => {
      if (tube.length === 0) return true;
      if (tube.length !== 4) return false;
      const first = tube[0];
      return tube.every(color => color === first);
    });
  };

  const handleTubeClick = (idx: number) => {
    if (isGameWon) return;

    // If no tube selected, select this one (if not empty)
    if (selectedTubeIdx === null) {
      if (tubes[idx].length === 0) return;
      soundManager.playSoftTap();
      setSelectedTubeIdx(idx);
      return;
    }

    // If clicking the same tube, deselect
    if (selectedTubeIdx === idx) {
      soundManager.playSoftTap();
      setSelectedTubeIdx(null);
      return;
    }

    // Attempt pour from selectedTubeIdx into idx
    const fromTube = [...tubes[selectedTubeIdx]];
    const toTube = [...tubes[idx]];

    if (toTube.length >= 4) {
      // Destination is full
      soundManager.playSoftTap();
      setSelectedTubeIdx(null);
      return;
    }

    const colorToPour = fromTube[fromTube.length - 1];

    // Destination must be either empty or have matching top color
    if (toTube.length > 0 && toTube[toTube.length - 1] !== colorToPour) {
      soundManager.playSoftTap();
      setSelectedTubeIdx(null);
      return;
    }

    // Save history for undo
    setHistory(prev => [...prev, tubes.map(t => [...t])]);

    // Pour all matching top layers that can fit
    soundManager.playWaterPour();
    while (
      fromTube.length > 0 && 
      fromTube[fromTube.length - 1] === colorToPour && 
      toTube.length < 4
    ) {
      fromTube.pop();
      toTube.push(colorToPour);
    }

    const nextTubes = tubes.map((t, i) => {
      if (i === selectedTubeIdx) return fromTube;
      if (i === idx) return toTube;
      return t;
    });

    setTubes(nextTubes);
    setSelectedTubeIdx(null);
    const newMoves = movesCount + 1;
    setMovesCount(newMoves);

    if (checkWin(nextTubes)) {
      setIsGameWon(true);

      // Determine stars based on moves and stage
      let stars = 3;
      if (currentStage === 1 && newMoves > 10) stars = 2;
      else if (currentStage === 2 && newMoves > 14) stars = 2;
      else if (currentStage === 3 && newMoves > 20) stars = 2;
      else if (currentStage >= 4 && newMoves > 28) stars = 2;

      setStarsAwarded(stars);

      // Save progression
      const result = completeStage(GAME_ID, currentStage, stars, newMoves, onAddXP);
      setEarnedXP(result.xpAwarded);
      setProgress(getGameLevelProgress(GAME_ID));
      setShowCompletionModal(true);
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || isGameWon) return;
    soundManager.playSoftTap();
    const lastState = history[history.length - 1];
    setTubes(lastState);
    setHistory(prev => prev.slice(0, prev.length - 1));
    setSelectedTubeIdx(null);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    loadStage(currentStage);
  };

  const handleNextStage = () => {
    if (currentStage < 5) {
      loadStage(currentStage + 1);
    } else {
      setShowCompletionModal(false);
    }
  };

  const handleSaveToMoments = () => {
    soundManager.playChime();
    saveMoment({
      gameId: 'emotion-sort-puzzle',
      gameTitle: isAr ? `بازل فرز المشاعر (المرحلة ${currentStage})` : `Emotion Sorting Puzzle (Stage ${currentStage})`,
      quote: isAr 
        ? `أكملت المرحلة ${currentStage} بنقاء تام بـ ${movesCount} نقلات عاطفية متوازنة!`
        : `Completed Stage ${currentStage} with ${movesCount} mindful emotional moves!`,
      reflection: isAr
        ? '«التمايز العاطفي الدقيق (Emotional Granularity) يمنح العقل وضوحاً كاملاً؛ حين نفصل الحزن عن الخوف والمحبة عن الحيرة، يهدأ جهازنا العصبي فوراً.»'
        : '“Emotional Granularity clarifies inner fog; distinguishing grief, fear, and love restores emotional sovereignty.”',
      tag: isAr ? 'فرز المشاعر' : 'Emotional Clarity'
    });
    setIsSaved(true);
    if (onAddXP) onAddXP(20);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Active colors present in this stage
  const activeColorsInStage = Array.from(new Set(
    (STAGE_PUZZLES[currentStage] || STAGE_PUZZLES[1]).flat()
  )) as EmotionColor[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
                {isAr ? 'بازل فرز قوارير المشاعر 🧪' : 'Emotion Color Sort Puzzle 🧪'}
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                {isAr ? 'مراحل متدرجة الصعوبة 🏆' : 'Progressive Stages 🏆'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr 
                ? 'اسكب وافرز السوائل الملونة لتفصل كل شعور في قارورته الخاصة بنقاء تام عبر ٥ مستويات متدرجة.' 
                : 'Pour and sort colored emotional elixirs through 5 progressive difficulty stages.'}
            </p>
          </div>
        </div>

        {/* Right Actions & Stage Selector */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <StageLevelSelector
            language={language}
            gameId={GAME_ID}
            currentStage={currentStage}
            progress={progress}
            onSelectStage={(num) => loadStage(num)}
            showCompletionModal={showCompletionModal}
            completedStageNumber={currentStage}
            starsEarned={starsAwarded}
            movesMade={movesCount}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={handleReset}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />

          <div className="flex items-center gap-1.5 ms-auto sm:ms-0">
            {history.length > 0 && !isGameWon && (
              <button
                onClick={handleUndo}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title={isAr ? 'تراجع عن النقلة' : 'Undo Move'}
              >
                <Undo2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title={isAr ? 'إعادة هذه المرحلة' : 'Reset Stage'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {isGameWon && (
              <button
                onClick={handleSaveToMoments}
                disabled={isSaved}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  isSaved ? 'bg-emerald-600 text-white' : 'bg-stone-900 dark:bg-purple-600 text-white'
                }`}
              >
                {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? (isAr ? 'تم الحفظ 🌿' : 'Saved 🌿') : (isAr ? 'حفظ إنجازي' : 'Save Moment')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* The Glass Laboratory Stage */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-900/30 dark:border-stone-800 bg-gradient-to-b from-[#f8f5ff] via-[#f1ebff] to-[#e4d9ff] dark:from-[#171124] dark:via-[#110d1c] dark:to-[#0a0712] p-5 sm:p-8 shadow-xl space-y-6">
        
        {/* Moves & Tips Bar */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-stone-700 dark:text-stone-300 font-mono bg-white/70 dark:bg-stone-800/80 px-2.5 py-1 rounded-xl border border-stone-200 dark:border-stone-700">
              {isAr ? `عدد النقلات: ${movesCount}` : `Moves: ${movesCount}`}
            </span>
            <span className="font-bold text-purple-700 dark:text-purple-300 text-[11px]">
              {isAr ? `المرحلة ${currentStage} من ٥` : `Stage ${currentStage}/5`}
            </span>
          </div>

          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium hidden sm:inline">
            {isAr ? 'انقر على قارورة لرفعها، ثم انقر على المستهدفة للسكب' : 'Tap vial to lift, tap target to pour'}
          </span>
        </div>

        {/* The Flasks Grid */}
        <div className="flex items-end justify-center gap-3 sm:gap-5 py-3 flex-wrap">
          {tubes.map((tube, tubeIdx) => {
            const isSelected = selectedTubeIdx === tubeIdx;
            const isPure = tube.length === 4 && tube.every(c => c === tube[0]);

            return (
              <div
                key={tubeIdx}
                onClick={() => handleTubeClick(tubeIdx)}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected ? '-translate-y-4 scale-105' : 'translate-y-0'
                }`}
              >
                {/* Flask Glass Body */}
                <div 
                  className={`w-13 sm:w-16 h-48 rounded-b-3xl border-3 transition-all relative flex flex-col-reverse p-1.5 overflow-hidden backdrop-blur-md ${
                    isPure
                      ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                      : isSelected
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg'
                      : 'border-stone-400/80 dark:border-stone-600 bg-white/40 dark:bg-black/30'
                  }`}
                >
                  {/* Glass Lip Top */}
                  <div className="absolute top-0 inset-x-0 h-2 border-b border-stone-300 dark:border-stone-700 bg-white/30" />

                  {/* Liquid Layers */}
                  {tube.map((color, layerIdx) => (
                    <div
                      key={layerIdx}
                      className="w-full h-10 rounded-xl transition-all duration-300 relative flex items-center justify-center my-0.5 shadow-inner"
                      style={{
                        backgroundColor: EMOTIONS_INFO[color]?.hex || '#0284c7',
                        boxShadow: `inset 0 2px 4px ${EMOTIONS_INFO[color]?.lightHex || '#38bdf8'}50`
                      }}
                    >
                      {/* Subtle liquid surface reflection */}
                      <div className="absolute top-0 inset-x-2 h-1 rounded-full bg-white/30 pointer-events-none" />
                    </div>
                  ))}

                  {/* Empty Slots Placeholder */}
                  {tube.length === 0 && (
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono text-center my-auto">
                      {isAr ? 'فارغ' : 'Empty'}
                    </span>
                  )}
                </div>

                {/* Pure Tube Star Glow */}
                {isPure && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-bounce" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Win Celebration Banner */}
        {isGameWon && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-2 border-emerald-400 text-center space-y-2 animate-bounce">
            <h3 className="text-base font-black text-emerald-900 dark:text-emerald-100 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{isAr ? `🎉 اكتمل فرز المرحلة ${currentStage} بنقاء وتمايز عاطفي بديع!` : `🎉 Stage ${currentStage} Emotions Purified!`}</span>
            </h3>
            <div className="flex items-center justify-center gap-3 pt-1">
              {currentStage < 5 && (
                <button
                  onClick={handleNextStage}
                  className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
                >
                  {isAr ? `المرحلة التالية (${currentStage + 1}) 🚀` : `Next Stage (${currentStage + 1}) 🚀`}
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-200 transition-colors cursor-pointer"
              >
                {isAr ? 'إعادة المرحلة ↺' : 'Replay Stage'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Emotion Legend & Meanings Guide for Active Colors */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-purple-500" />
          {isAr ? 'دليل قوارير المشاعر في هذه المرحلة:' : 'Emotion Granularity in this Stage:'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {activeColorsInStage.map((colorKey) => {
            const info = EMOTIONS_INFO[colorKey];
            if (!info) return null;
            return (
              <div 
                key={colorKey}
                className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/50 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" 
                    style={{ backgroundColor: info.hex }}
                  />
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    {isAr ? info.nameAr : info.nameEn}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                  {isAr ? info.meaningAr : info.meaningEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
