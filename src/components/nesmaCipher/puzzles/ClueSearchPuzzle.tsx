import React, { useState } from 'react';
import { ClueSearchData } from '../../types/nesmaCipher';
import { CheckCircle2, Search, Sparkles } from 'lucide-react';
import { soundManager } from '@/src/utils/audio';

interface ClueSearchPuzzleProps {
  data: ClueSearchData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

export const ClueSearchPuzzle: React.FC<ClueSearchPuzzleProps> = ({ data, onSolve }) => {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [recentlyFound, setRecentlyFound] = useState<string | null>(null);

  const totalItems = data.hiddenItems.length;

  const handleItemClick = (item: { id: string; nameAr: string; descriptionAr: string; x: number; y: number; icon: string }) => {
    if (foundIds.includes(item.id) || isSolved) return;

    soundManager.playCorrect();
    const nextFound = [...foundIds, item.id];
    setFoundIds(nextFound);
    setRecentlyFound(item.nameAr);

    if (nextFound.length === totalItems) {
      setIsSolved(true);
      setTimeout(() => {
        onSolve();
      }, 900);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 max-w-lg mx-auto w-full">
      {/* Instructions & Tracker */}
      <div className="text-center space-y-1.5">
        <p className="text-stone-700 dark:text-stone-300 text-sm font-medium">
          {data.instructionsAr}
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <Search className="w-3.5 h-3.5 text-emerald-600" />
          <span>تم العثور على {foundIds.length} من {totalItems} عناصر</span>
        </div>
      </div>

      {/* Interactive Scene Canvas */}
      <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-xl border border-stone-700/60 bg-stone-900 select-none">
        {/* Background Image */}
        <img
          src={data.sceneBackground}
          alt="مشهد البحث عن الأدلة"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Hotspots */}
        {data.hiddenItems.map((item) => {
          const isFound = foundIds.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              disabled={isFound || isSolved}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isFound
                  ? 'bg-emerald-600/90 text-white ring-4 ring-emerald-300 scale-110 shadow-lg'
                  : 'bg-white/20 hover:bg-amber-400/40 backdrop-blur-xs ring-2 ring-white/60 animate-pulse hover:scale-125'
              }`}
              title={isFound ? item.nameAr : 'عنصر مخفي'}
              aria-label={item.nameAr}
            >
              <span className="text-xl drop-shadow">{item.icon}</span>
            </button>
          );
        })}

        {/* Success overlay */}
        {isSolved && (
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <span className="text-base font-bold text-white">تم جمع كل أدلة السكينة!</span>
          </div>
        )}
      </div>

      {/* Checklist of Items */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {data.hiddenItems.map((item) => {
          const isFound = foundIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                isFound
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <span className={`text-xs font-bold block truncate ${isFound ? 'line-through opacity-75' : ''}`}>
                  {item.nameAr}
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  {isFound ? 'تم الاكتشاف ✓' : 'مخفي في المشهد'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {recentlyFound && !isSolved && (
        <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium animate-pulse">
          وجدت: {recentlyFound} ✨
        </span>
      )}
    </div>
  );
};
