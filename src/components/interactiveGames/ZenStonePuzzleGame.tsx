import React, { useState } from 'react';
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
  Shapes
} from 'lucide-react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { recordStreakActivity } from '../../utils/streakManager';

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

const STONES: ZenStone[] = [
  { id: 's1', nameAr: 'حجر النهر القاعدي العريض', nameEn: 'River Bedrock Base', widthPercent: 88, heightPx: 42, color: '#57534e', gradient: 'from-stone-600 to-stone-700', texture: 'river', weight: 5 },
  { id: 's2', nameAr: 'حجر الحمم البركانية المستقر', nameEn: 'Volcanic Anchor', widthPercent: 72, heightPx: 38, color: '#44403c', gradient: 'from-stone-700 to-stone-850', texture: 'lava', weight: 4 },
  { id: 's3', nameAr: 'حجر المرمر الرملي الأملس', nameEn: 'Smooth Sandstone', widthPercent: 55, heightPx: 34, color: '#78716c', gradient: 'from-stone-500 to-stone-600', texture: 'smooth', weight: 3 },
  { id: 's4', nameAr: 'حجر الياسمين البيضاوي', nameEn: 'Oval River Pebble', widthPercent: 40, heightPx: 30, color: '#a8a29e', gradient: 'from-stone-400 to-stone-500', texture: 'pebble', weight: 2 },
  { id: 's5', nameAr: 'بلورة قمة الهرم المضيئة', nameEn: 'Zen Summit Crystal', widthPercent: 24, heightPx: 26, color: '#e7e5e4', gradient: 'from-amber-200 to-amber-400', texture: 'crystal', weight: 1 }
];

export const ZenStonePuzzleGame: React.FC<ZenStonePuzzleGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';

  const [stackedStones, setStackedStones] = useState<ZenStone[]>([]);
  const [availableStones, setAvailableStones] = useState<ZenStone[]>(STONES);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTowerBalanced, setIsTowerBalanced] = useState<boolean>(false);

  // Stacking a stone
  const handleAddStone = (stone: ZenStone) => {
    soundManager.playStoneClick();
    const newStacked = [...stackedStones, stone];
    setStackedStones(newStacked);
    setAvailableStones(prev => prev.filter(s => s.id !== stone.id));

    if (newStacked.length === STONES.length) {
      setIsTowerBalanced(true);
      soundManager.playLevelUpFanfare();
      recordStreakActivity('zen_puzzle');
      if (onAddXP) onAddXP(50);
    }
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setStackedStones([]);
    setAvailableStones(STONES);
    setIsTowerBalanced(false);
  };

  const handleSaveToMoments = () => {
    soundManager.playChime();
    saveMoment({
      gameId: 'zen-puzzle',
      gameTitle: isAr ? 'بازل وتوازن أحجار الزن والسكينة' : 'Zen Stone Balancing Puzzle',
      quote: isAr ? 'برج توازن أحجار الزن الخمسة متزن بنجاح' : 'Tower of 5 Zen Stones perfectly balanced',
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
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
                {isAr ? 'بازل وتوازن أحجار الزن 🪨' : 'Zen Stone Balancing Puzzle 🪨'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                {isAr ? 'تركيز وحضور آني' : 'Flow State & Focus'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr 
                ? 'وازن أحجار النهر الخمسة بهدوء؛ ركّب كل حجر بحجمه المناسب لتشييد برج السكينة والتوازن.' 
                : 'Mindfully balance river stones in ascending harmony to build a pillar of stillness.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            <span>{isSaved ? (isAr ? 'تم الحفظ 🌿' : 'Saved 🌿') : (isAr ? 'حفظ البرج المتزن' : 'Save Tower')}</span>
          </button>
        </div>
      </div>

      {/* The Zen Garden Balancing Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-gradient-to-b from-[#e7e5e4] via-[#d6d3d1] to-[#a8a29e] dark:from-[#1c1917] dark:via-[#141210] dark:to-[#0c0a09] p-6 sm:p-10 shadow-xl min-h-[360px] flex flex-col justify-end items-center">
        {/* Background Zen Ripples SVG */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
          <div className="w-72 h-72 rounded-full border border-stone-800 dark:border-white animate-ping" />
          <div className="w-96 h-96 rounded-full border border-stone-800 dark:border-white" />
        </div>

        {/* Ambient Nature Elements */}
        <div className="absolute top-4 start-6 flex items-center gap-2 text-stone-600 dark:text-stone-400 text-xs font-medium">
          <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
          <span>{isAr ? 'حديقة التأمل والسكينة' : 'Zen Mindfulness Garden'}</span>
        </div>

        {/* The Tower of Stacked Stones */}
        <div className="relative z-10 flex flex-col-reverse items-center justify-end w-full max-w-sm mb-2">
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
          <div className="w-64 h-5 rounded-2xl bg-gradient-to-r from-stone-800 via-stone-700 to-stone-900 border-2 border-stone-600 shadow-xl flex items-center justify-center mt-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400">
              {isAr ? 'قاعدة الاتزان المائي' : 'ZEN PEDIMENT'}
            </span>
          </div>
        </div>

        {/* Completion Message */}
        {isTowerBalanced && (
          <div className="absolute top-8 z-20 px-5 py-2.5 rounded-2xl bg-emerald-600/90 text-white text-xs sm:text-sm font-bold shadow-xl backdrop-blur-md flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAr ? 'برج السكينة متزن بنجاح وتناغم تام! 🌿' : 'Tower Balanced in Perfect Harmony! 🌿'}</span>
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
            {isAr ? 'استقرت جميع الأحجار الخمسة في قمة البرج بنجاح 🪷' : 'All stones placed into the balanced tower.'}
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
                    {isAr ? `العرض: ${stone.widthPercent}% · الوزن: ${stone.weight}` : `Width: ${stone.widthPercent}% · Weight: ${stone.weight}`}
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
