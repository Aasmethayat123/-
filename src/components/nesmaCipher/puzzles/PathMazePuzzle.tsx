import React, { useState, useEffect, useCallback } from 'react';
import { PathMazeData } from '../../types/nesmaCipher';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Key, DoorClosed, RotateCcw, CheckCircle2 } from 'lucide-react';
import { soundManager } from '@/src/utils/audio';

interface PathMazePuzzleProps {
  data: PathMazeData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

export const PathMazePuzzle: React.FC<PathMazePuzzleProps> = ({ data, onSolve }) => {
  const [currentPos, setCurrentPos] = useState<[number, number]>([...data.startPos]);
  const [collectedKeys, setCollectedKeys] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [bumpAnim, setBumpAnim] = useState<boolean>(false);

  const totalKeys = data.keyPositions.length;
  const allKeysCollected = collectedKeys.length === totalKeys;

  const movePlayer = useCallback((dr: number, dc: number) => {
    if (isSolved) return;

    const [r, c] = currentPos;
    const nr = r + dr;
    const nc = c + dc;

    // Check bounds
    if (nr < 0 || nr >= data.gridRows || nc < 0 || nc >= data.gridCols) {
      soundManager.playIncorrect();
      setBumpAnim(true);
      setTimeout(() => setBumpAnim(false), 200);
      return;
    }

    // Check obstacles
    const isObstacle = data.obstacles.some(([or, oc]) => or === nr && oc === nc);
    if (isObstacle) {
      soundManager.playIncorrect();
      setBumpAnim(true);
      setTimeout(() => setBumpAnim(false), 200);
      return;
    }

    // Valid move
    soundManager.playClick();
    setCurrentPos([nr, nc]);

    // Check key pickup
    const keyAtCell = data.keyPositions.find(([kr, kc]) => kr === nr && kc === nc);
    if (keyAtCell) {
      const keyId = `${nr}-${nc}`;
      if (!collectedKeys.includes(keyId)) {
        setCollectedKeys(prev => [...prev, keyId]);
        soundManager.playCorrect();
      }
    }

    // Check end position
    if (nr === data.endPos[0] && nc === data.endPos[1]) {
      if (allKeysCollected || (collectedKeys.length + (keyAtCell ? 1 : 0) >= totalKeys)) {
        setIsSolved(true);
        soundManager.playCorrect();
        setTimeout(() => {
          onSolve();
        }, 800);
      }
    }
  }, [currentPos, isSolved, data, collectedKeys, allKeysCollected, totalKeys, onSolve]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp') movePlayer(-1, 0);
      if (e.key === 'ArrowDown') movePlayer(1, 0);
      if (e.key === 'ArrowLeft') movePlayer(0, -1);
      if (e.key === 'ArrowRight') movePlayer(0, 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  const handleReset = () => {
    setCurrentPos([...data.startPos]);
    setCollectedKeys([]);
    setIsSolved(false);
    soundManager.playClick();
  };

  return (
    <div className="flex flex-col items-center gap-5 max-w-md mx-auto w-full">
      {/* Objective Banner */}
      <div className="text-center space-y-1">
        <p className="text-stone-700 dark:text-stone-300 text-sm font-medium">
          {data.instructionsAr}
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-amber-500" />
            المفاتيح: {collectedKeys.length} من {totalKeys}
          </span>
          <span>·</span>
          <span>المخرج: {allKeysCollected ? 'مفتوح 🔓' : 'مغلق 🔒'}</span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className={`p-3 bg-stone-900 dark:bg-stone-950 rounded-2xl shadow-xl border border-stone-800 w-full max-w-[340px] aspect-square transition-transform ${bumpAnim ? 'scale-98 ring-2 ring-red-400' : ''}`}>
        <div 
          className="grid gap-1.5 w-full h-full bg-stone-800/80 rounded-xl p-1.5"
          style={{
            gridTemplateRows: `repeat(${data.gridRows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${data.gridCols}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: data.gridRows }).map((_, r) =>
            Array.from({ length: data.gridCols }).map((__, c) => {
              const isPlayer = currentPos[0] === r && currentPos[1] === c;
              const isEnd = data.endPos[0] === r && data.endPos[1] === c;
              const isObstacle = data.obstacles.some(([or, oc]) => or === r && oc === c);
              const keyItem = data.keyPositions.find(([kr, kc]) => kr === r && kc === c);
              const isKeyHere = keyItem && !collectedKeys.includes(`${r}-${c}`);

              let cellBg = 'bg-stone-700/40';
              if (isObstacle) cellBg = 'bg-stone-900 border border-stone-700/60';
              if (isEnd) cellBg = allKeysCollected ? 'bg-emerald-950 border border-emerald-500' : 'bg-stone-800 border border-stone-600';

              return (
                <div
                  key={`${r}-${c}`}
                  className={`relative rounded-lg flex items-center justify-center text-lg select-none transition-all ${cellBg}`}
                >
                  {isObstacle && <span className="text-xs text-stone-600">⛔</span>}
                  {isKeyHere && !isPlayer && (
                    <Key className="w-5 h-5 text-amber-400 animate-pulse drop-shadow" />
                  )}
                  {isEnd && !isPlayer && (
                    <DoorClosed className={`w-5 h-5 ${allKeysCollected ? 'text-emerald-400' : 'text-stone-500'}`} />
                  )}
                  {isPlayer && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 ring-4 ring-emerald-300/40 flex items-center justify-center text-white text-xs font-bold shadow-lg animate-in zoom-in-75">
                      🌱
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* D-Pad Controls for Mobile & Touch */}
      {!isSolved && (
        <div className="flex flex-col items-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => movePlayer(-1, 0)}
            className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-800 dark:text-stone-100 active:scale-95 transition-all shadow-xs cursor-pointer"
            aria-label="تحرك للأعلى"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => movePlayer(0, 1)}
              className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-800 dark:text-stone-100 active:scale-95 transition-all shadow-xs cursor-pointer"
              aria-label="تحرك لليمين"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
              title="إعادة المحاولة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => movePlayer(0, -1)}
              className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-800 dark:text-stone-100 active:scale-95 transition-all shadow-xs cursor-pointer"
              aria-label="تحرك لليسار"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => movePlayer(1, 0)}
            className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-800 dark:text-stone-100 active:scale-95 transition-all shadow-xs cursor-pointer"
            aria-label="تحرك للأسفل"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Solved Banner */}
      {isSolved && (
        <div className="w-full p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>تم اجتياز المتاهة وفتح البوابة بنجاح!</span>
        </div>
      )}
    </div>
  );
};
