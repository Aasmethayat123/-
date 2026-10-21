import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Bookmark, 
  CheckCircle2, 
  Layers, 
  Compass, 
  Wind,
  ShieldCheck,
  Shapes,
  Trophy,
  Flame
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

interface ZenStonePuzzleGameProps {
  language: Language;
  onBackToMap: () => void;
  onAddXP?: (amount: number) => void;
}

interface ZenStone {
  id: string;
  nameAr: string;
  nameEn: string;
  widthPercent: number; // width relative to base
  heightPx: number;
  color: string;
  gradient: string;
  texture: string;
  weight: number;
}

const STAGE_STONES: Record<number, ZenStone[]> = {
  // Stage 1: 3 Gentle Foundation Stones
  1: [
    { id: 's1_1', nameAr: 'حجر النهر القاعدي العريض', nameEn: 'River Bedrock Base', widthPercent: 88, heightPx: 44, color: '#57534e', gradient: 'from-stone-600 to-stone-700', texture: 'river', weight: 5 },
    { id: 's1_2', nameAr: 'حجر المرمر الرملي الأملس', nameEn: 'Smooth Sandstone', widthPercent: 55, heightPx: 36, color: '#78716c', gradient: 'from-stone-500 to-stone-600', texture: 'smooth', weight: 3 },
    { id: 's1_3', nameAr: 'بلورة قمة الهرم المضيئة', nameEn: 'Zen Summit Crystal', widthPercent: 25, heightPx: 28, color: '#e7e5e4', gradient: 'from-amber-200 to-amber-400', texture: 'crystal', weight: 1 }
  ],

  // Stage 2: 5 Classic Stones
  2: [
    { id: 's2_1', nameAr: 'حجر النهر القاعدي العريض', nameEn: 'River Bedrock Base', widthPercent: 88, heightPx: 42, color: '#57534e', gradient: 'from-stone-600 to-stone-700', texture: 'river', weight: 5 },
    { id: 's2_2', nameAr: 'حجر الحمم البركانية المستقر', nameEn: 'Volcanic Anchor', widthPercent: 72, heightPx: 38, color: '#44403c', gradient: 'from-stone-700 to-stone-850', texture: 'lava', weight: 4 },
    { id: 's2_3', nameAr: 'حجر المرمر الرملي الأملس', nameEn: 'Smooth Sandstone', widthPercent: 55, heightPx: 34, color: '#78716c', gradient: 'from-stone-500 to-stone-600', texture: 'smooth', weight: 3 },
    { id: 's2_4', nameAr: 'حجر الياسمين البيضاوي', nameEn: 'Oval River Pebble', widthPercent: 40, heightPx: 30, color: '#a8a29e', gradient: 'from-stone-400 to-stone-500', texture: 'pebble', weight: 2 },
    { id: 's2_5', nameAr: 'بلورة قمة الهرم المضيئة', nameEn: 'Zen Summit Crystal', widthPercent: 24, heightPx: 26, color: '#e7e5e4', gradient: 'from-amber-200 to-amber-400', texture: 'crystal', weight: 1 }
  ],

  // Stage 3: 6 Stones + Breeze
  3: [
    { id: 's3_1', nameAr: 'حجر الجرانيت الصلد', nameEn: 'Solid Granite Slab', widthPercent: 90, heightPx: 44, color: '#44403c', gradient: 'from-stone-700 to-stone-900', texture: 'granite', weight: 6 },
    { id: 's3_2', nameAr: 'حجر الحمم البركانية المستقر', nameEn: 'Volcanic Anchor', widthPercent: 74, heightPx: 38, color: '#57534e', gradient: 'from-stone-600 to-stone-800', texture: 'lava', weight: 5 },
    { id: 's3_3', nameAr: 'حجر البازلت المائي المصقول', nameEn: 'Polished Basalt', widthPercent: 60, heightPx: 34, color: '#292524', gradient: 'from-stone-800 to-zinc-900', texture: 'basalt', weight: 4 },
    { id: 's3_4', nameAr: 'حجر المرمر الرملي الأملس', nameEn: 'Smooth Sandstone', widthPercent: 48, heightPx: 30, color: '#78716c', gradient: 'from-stone-500 to-stone-600', texture: 'smooth', weight: 3 },
    { id: 's3_5', nameAr: 'حصاة الفيروز الهادئة', nameEn: 'Turquoise River Pebble', widthPercent: 34, heightPx: 26, color: '#0d9488', gradient: 'from-teal-600 to-teal-800', texture: 'pebble', weight: 2 },
    { id: 's3_6', nameAr: 'بلورة الكوارتز النقي', nameEn: 'Pure Quartz Summit', widthPercent: 20, heightPx: 24, color: '#e7e5e4', gradient: 'from-cyan-200 to-cyan-400', texture: 'crystal', weight: 1 }
  ],

  // Stage 4: 7 Sacred Stones (Master Flow)
  4: [
    { id: 's4_1', nameAr: 'لوح الشست الرسوبي العريض', nameEn: 'Schist Bedrock', widthPercent: 92, heightPx: 44, color: '#44403c', gradient: 'from-stone-800 to-stone-950', texture: 'bedrock', weight: 7 },
    { id: 's4_2', nameAr: 'حجر الجرانيت الصلد', nameEn: 'Solid Granite Slab', widthPercent: 78, heightPx: 40, color: '#57534e', gradient: 'from-stone-700 to-stone-850', texture: 'granite', weight: 6 },
    { id: 's4_3', nameAr: 'حجر الحمم البركانية المستقر', nameEn: 'Volcanic Anchor', widthPercent: 66, heightPx: 36, color: '#78716c', gradient: 'from-stone-600 to-stone-750', texture: 'lava', weight: 5 },
    { id: 's4_4', nameAr: 'حجر المرمر الرملي الأملس', nameEn: 'Smooth Sandstone', widthPercent: 54, heightPx: 32, color: '#a8a29e', gradient: 'from-stone-500 to-stone-650', texture: 'smooth', weight: 4 },
    { id: 's4_5', nameAr: 'حجر اليشم الأخضر الوقور', nameEn: 'Noble Jade Pebble', widthPercent: 42, heightPx: 28, color: '#059669', gradient: 'from-emerald-600 to-teal-800', texture: 'jade', weight: 3 },
    { id: 's4_6', nameAr: 'حجر اللازورد الأزرق العميق', nameEn: 'Lapis Lazuli Sphere', widthPercent: 30, heightPx: 26, color: '#2563eb', gradient: 'from-blue-600 to-indigo-800', texture: 'lapis', weight: 2 },
    { id: 's4_7', nameAr: 'تاج الجمشت الملكي المشع', nameEn: 'Amethyst Apex Crown', widthPercent: 18, heightPx: 24, color: '#9333ea', gradient: 'from-purple-400 via-pink-400 to-amber-300', texture: 'amethyst', weight: 1 }
  ]
};

const GAME_ID = 'zen-puzzle';

export const ZenStonePuzzleGame: React.FC<ZenStonePuzzleGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const initialStones = STAGE_STONES[currentStage] || STAGE_STONES[1];
  const [stackedStones, setStackedStones] = useState<ZenStone[]>([]);
  const [availableStones, setAvailableStones] = useState<ZenStone[]>(initialStones);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTowerBalanced, setIsTowerBalanced] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [starsAwarded, setStarsAwarded] = useState<number>(3);
  const [earnedXP, setEarnedXP] = useState<number>(50);

  // Breeze animation for Stage 3 & 4
  const [breezeOffset, setBreezeOffset] = useState<number>(0);

  useEffect(() => {
    if (currentStage < 3) return;
    const interval = setInterval(() => {
      setBreezeOffset(Math.sin(Date.now() / 1200) * 8);
    }, 80);
    return () => clearInterval(interval);
  }, [currentStage]);

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    const stones = STAGE_STONES[stageNum] || STAGE_STONES[1];
    setStackedStones([]);
    setAvailableStones(stones);
    setIsTowerBalanced(false);
    setShowCompletionModal(false);
  };

  const handleAddStone = (stone: ZenStone) => {
    soundManager.playStoneClick();
    const newStacked = [...stackedStones, stone];
    setStackedStones(newStacked);
    const remaining = availableStones.filter(s => s.id !== stone.id);
    setAvailableStones(remaining);

    if (newStacked.length === initialStones.length) {
      setIsTowerBalanced(true);

      // Check balance quality: was it stacked with ascending widths (widest at bottom)?
      let isPerfectOrder = true;
      for (let i = 0; i < newStacked.length - 1; i++) {
        if (newStacked[i].widthPercent < newStacked[i + 1].widthPercent) {
          isPerfectOrder = false;
          break;
        }
      }

      const stars = isPerfectOrder ? 3 : 2;
      setStarsAwarded(stars);

      const result = completeStage(GAME_ID, currentStage, stars, undefined, onAddXP);
      setEarnedXP(result.xpAwarded);
      setProgress(getGameLevelProgress(GAME_ID));
      setShowCompletionModal(true);
    }
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    loadStage(currentStage);
  };

  const handleNextStage = () => {
    if (currentStage < 4) {
      loadStage(currentStage + 1);
    } else {
      setShowCompletionModal(false);
    }
  };

  const handleSaveToMoments = () => {
    soundManager.playChime();
    saveMoment({
      gameId: 'zen-puzzle',
      gameTitle: isAr ? `توازن أحجار الزن (المرحلة ${currentStage})` : `Zen Stone Balance (Stage ${currentStage})`,
      quote: isAr 
        ? `أكملت موازنة برج السكينة في المرحلة ${currentStage} بنجاح وتناغم تام!`
        : `Balanced Stage ${currentStage} Zen Tower in perfect harmony!`,
      reflection: isAr
        ? '«توازن الأحجار يحاكي توازن الحياة؛ كل طبقة تحتاج أن تستند برفق على ما قبلها دون تسرع أو عنف.»'
        : '“Balancing stones mirrors balancing life; every layer rests gently on the foundation with mindful patience.”',
      tag: isAr ? 'توازن وهدوء' : 'Zen Balance'
    });
    setIsSaved(true);
    if (onAddXP) onAddXP(20);
    setTimeout(() => setIsSaved(false), 3000);
  };

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
                {isAr ? 'بازل وتوازن أحجار الزن 🪨' : 'Zen Stone Balancing Puzzle 🪨'}
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                {isAr ? '٤ مراحل توازن متدرجة 🏆' : '4 Progressive Stages 🏆'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr 
                ? 'وازن أحجار النهر بهدوء وصبر؛ ركّب كل حجر بحجمه المناسب لتشييد برج السكينة والتوازن عبر ٤ مستويات.' 
                : 'Mindfully balance river stones in ascending harmony across 4 progressive challenges.'}
            </p>
          </div>
        </div>

        {/* Right Stage Selector & Actions */}
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
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={handleReset}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />

          <div className="flex items-center gap-1.5 ms-auto sm:ms-0">
            {stackedStones.length > 0 && (
              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title={isAr ? 'إعادة بناء البرج' : 'Rebuild Tower'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleSaveToMoments}
              disabled={isSaved || stackedStones.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : stackedStones.length > 0
                  ? 'bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? (isAr ? 'تم الحفظ 🌿' : 'Saved 🌿') : (isAr ? 'حفظ البرج' : 'Save Tower')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* The Zen Garden Balancing Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-gradient-to-b from-[#e7e5e4] via-[#d6d3d1] to-[#a8a29e] dark:from-[#1c1917] dark:via-[#141210] dark:to-[#0c0a09] p-6 sm:p-10 shadow-xl min-h-[380px] flex flex-col justify-end items-center">
        {/* Background Zen Ripples SVG */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
          <div className="w-72 h-72 rounded-full border border-stone-800 dark:border-white animate-ping" />
          <div className="w-96 h-96 rounded-full border border-stone-800 dark:border-white" />
        </div>

        {/* Ambient Nature Elements & Wind indicator if Stage >= 3 */}
        <div className="absolute top-4 start-6 flex items-center gap-3 text-stone-600 dark:text-stone-400 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
            <span>{isAr ? `حديقة التأمل والسكينة (المرحلة ${currentStage})` : `Zen Garden (Stage ${currentStage})`}</span>
          </div>

          {currentStage >= 3 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-800 dark:text-teal-200 flex items-center gap-1">
              <span>{isAr ? 'نسيم الطبيعة المتحرك 🍃' : 'Gentle Breeze 🍃'}</span>
            </span>
          )}
        </div>

        {/* The Tower of Stacked Stones */}
        <div 
          className="relative z-10 flex flex-col-reverse items-center justify-end w-full max-w-sm mb-2 transition-transform duration-300"
          style={{
            transform: currentStage >= 3 ? `translateX(${breezeOffset}px)` : 'none'
          }}
        >
          {stackedStones.map((stone, idx) => (
            <div
              key={stone.id}
              className={`relative rounded-3xl border-2 border-stone-800/40 shadow-lg bg-gradient-to-r ${stone.gradient} flex items-center justify-center transition-all duration-300 hover:scale-102`}
              style={{
                width: `${stone.widthPercent}%`,
                height: `${stone.heightPx}px`,
                marginBottom: '-6px'
              }}
            >
              {/* Highlight sheen reflection */}
              <div className="absolute top-1 inset-x-3 h-1.5 rounded-full bg-white/20 pointer-events-none" />
              <span className="text-[10px] font-bold text-white/90 drop-shadow-xs truncate px-2">
                {isAr ? stone.nameAr.split(' ')[0] : stone.nameEn.split(' ')[0]}
              </span>
            </div>
          ))}

          {/* Wooden / Slate Pediment Base */}
          <div className="w-68 h-5 rounded-2xl bg-gradient-to-r from-stone-800 via-stone-700 to-stone-900 border-2 border-stone-600 shadow-xl flex items-center justify-center mt-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400">
              {isAr ? `قاعدة الاتزان المائي · المرحلة ${currentStage}` : `ZEN PEDIMENT · STAGE ${currentStage}`}
            </span>
          </div>
        </div>

        {/* Completion Message */}
        {isTowerBalanced && (
          <div className="absolute top-8 z-20 px-5 py-2.5 rounded-2xl bg-emerald-600/90 text-white text-xs sm:text-sm font-bold shadow-xl backdrop-blur-md flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAr ? `برج المرحلة ${currentStage} متزن بنجاح وتناغم تام! 🌿` : `Stage ${currentStage} Tower Balanced! 🌿`}</span>
          </div>
        )}
      </div>

      {/* Available Stones to Stack (صندوق الأحجار النهرية المتاحة) */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🪨</span>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
              {isAr ? 'اختر الحجر التالي لموازنته فوق البرج (من الأعرض إلى الأضيق):' : 'Select next stone to balance (Widest to Narrowest):'}
            </h3>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            {isAr ? `متبقي ${availableStones.length} أحجار` : `${availableStones.length} stones left`}
          </span>
        </div>

        {availableStones.length === 0 ? (
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 text-center text-xs text-stone-400 font-medium">
            {isAr ? 'استقرت جميع أحجار هذه المرحلة في قمة البرج بنجاح 🪷' : 'All stones placed into the balanced tower.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {availableStones.map(stone => (
              <button
                key={stone.id}
                onClick={() => handleAddStone(stone)}
                className="p-3.5 rounded-2xl border text-start transition-all cursor-pointer bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-750 border-stone-200 dark:border-stone-700 hover:border-amber-400 flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    {isAr ? stone.nameAr : stone.nameEn}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {isAr ? `العرض: ${stone.widthPercent}٪ · الوزن: ${stone.weight}` : `Width: ${stone.widthPercent}% · Weight: ${stone.weight}`}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 group-hover:bg-amber-100 dark:group-hover:bg-amber-950/80 group-hover:text-amber-800 dark:group-hover:text-amber-300">
                  {isAr ? '+ موازنة' : '+ Balance'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
