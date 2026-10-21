import React, { useState, useEffect } from 'react';
import { TilePuzzleData } from '../../types/nesmaCipher';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundManager } from '@/src/utils/audio';

interface TilePuzzleProps {
  data: TilePuzzleData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

// Initial scrambled arrangement for 3x3 (deterministic so it's always solvable and consistent)
const INITIAL_SCRAMBLE = [4, 0, 7, 1, 8, 3, 6, 2, 5];

export const TilePuzzle: React.FC<TilePuzzleProps> = ({ data, onSolve }) => {
  const [tiles, setTiles] = useState<number[]>(INITIAL_SCRAMBLE);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [moveCount, setMoveCount] = useState<number>(0);

  // Check solved state
  useEffect(() => {
    const solved = tiles.every((val, idx) => val === idx);
    if (solved && !isSolved) {
      setIsSolved(true);
      soundManager.playCorrect();
      setTimeout(() => {
        onSolve();
      }, 700);
    }
  }, [tiles, isSolved, onSolve]);

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    soundManager.playClick();

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else if (selectedIdx === index) {
      setSelectedIdx(null); // Deselect
    } else {
      // Swap tiles
      const nextTiles = [...tiles];
      const temp = nextTiles[selectedIdx];
      nextTiles[selectedIdx] = nextTiles[index];
      nextTiles[index] = temp;

      setTiles(nextTiles);
      setSelectedIdx(null);
      setMoveCount(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setTiles(INITIAL_SCRAMBLE);
    setSelectedIdx(null);
    setIsSolved(false);
    setMoveCount(0);
    soundManager.playClick();
  };

  // Convert target tile id (0..8) to row/col percentage for CSS backgroundPosition
  const getTileBgPosition = (tileId: number) => {
    const col = tileId % 3;
    const row = Math.floor(tileId / 3);
    const posX = col * 50; // 0%, 50%, 100%
    const posY = row * 50;
    return `${posX}% ${posY}%`;
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto w-full">
      {/* Instructions & Header */}
      <div className="text-center space-y-1">
        <p className="text-stone-700 dark:text-stone-300 text-sm font-medium">
          {data.instructionsAr}
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          انقر على القطعة الأولى لتحديدها، ثم انقر على القطعة الثانية لتبديل مكانهما.
        </p>
      </div>

      {/* 3x3 Puzzle Board */}
      <div className="relative p-3 bg-stone-900/90 dark:bg-stone-950 rounded-2xl shadow-xl border border-stone-700/60 w-full max-w-[340px] aspect-square">
        <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-full h-full rounded-xl overflow-hidden bg-stone-800">
          {tiles.map((tileId, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrectPosition = tileId === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleTileClick(idx)}
                className={`relative w-full h-full rounded-lg overflow-hidden transition-all duration-200 cursor-pointer focus:outline-hidden ${
                  isSelected 
                    ? 'ring-4 ring-amber-400 scale-95 z-10 shadow-lg' 
                    : 'hover:opacity-90 active:scale-95'
                }`}
                style={{
                  backgroundImage: `url(${data.imageSrc})`,
                  backgroundSize: '300% 300%',
                  backgroundPosition: getTileBgPosition(tileId)
                }}
                aria-label={`قطعة اللغز رقم ${tileId + 1}`}
              >
                {/* Visual marker if in correct place */}
                {isCorrectPosition && !isSolved && (
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white/50" />
                )}
                {/* Selected Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-amber-400/25 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="text-xs font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">محددة</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Solved Overlay */}
        {isSolved && (
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-2 p-4 animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <span className="text-lg font-bold text-white">اكتملت اللوحة بسلام!</span>
            <span className="text-xs text-emerald-200">جاري تسجيل فك الشفرة...</span>
          </div>
        )}
      </div>

      {/* Footer Controls & Stats */}
      <div className="flex items-center justify-between w-full max-w-[340px] text-xs text-stone-500 dark:text-stone-400">
        <span className="tabular-nums">عدد التبديلات: {moveCount}</span>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة ترتيب اللوحة</span>
        </button>
      </div>
    </div>
  );
};
