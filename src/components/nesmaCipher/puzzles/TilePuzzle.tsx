import React, { useState, useEffect } from 'react';
import { TilePuzzleData } from "../../../types/nesmaCipher";
import { Sparkles, CheckCircle2, RotateCcw, Eye, X, Hash } from 'lucide-react';
import { soundManager } from "../../../utils/audio";
import { SafeCipherImage } from "../SafeCipherImage";

interface TilePuzzleProps {
  data: TilePuzzleData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

// Initial scrambled arrangement for 3x3 (solvable and clear)
const INITIAL_SCRAMBLE = [4, 0, 7, 1, 8, 3, 6, 2, 5];

export const TilePuzzle: React.FC<TilePuzzleProps> = ({ data, onSolve }) => {
  const [tiles, setTiles] = useState<number[]>(INITIAL_SCRAMBLE);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [dragSourceIdx, setDragSourceIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showNumbers, setShowNumbers] = useState<boolean>(true);

  const touchStartRef = React.useRef<{ idx: number; x: number; y: number; moved: boolean } | null>(null);
  const dragOverRef = React.useRef<number | null>(null);
  const suppressClickRef = React.useRef<boolean>(false);

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

  const swapTiles = (fromIdx: number, toIdx: number) => {
    if (isSolved || fromIdx === toIdx || fromIdx < 0 || toIdx < 0) return;
    soundManager.playClick();
    setTiles((prev) => {
      const next = [...prev];
      const temp = next[fromIdx];
      next[fromIdx] = next[toIdx];
      next[toIdx] = temp;
      return next;
    });
    setSelectedIdx(null);
    setDragSourceIdx(null);
    setDragOverIdx(null);
    dragOverRef.current = null;
    setMoveCount((prev) => prev + 1);
  };

  const handleTileClick = (index: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (isSolved) return;

    if (selectedIdx === null) {
      soundManager.playClick();
      setSelectedIdx(index);
    } else if (selectedIdx === index) {
      soundManager.playClick();
      setSelectedIdx(null); // Deselect
    } else {
      swapTiles(selectedIdx, index);
    }
  };

  const handleTouchStart = (index: number, e: React.TouchEvent<HTMLButtonElement>) => {
    if (isSolved || e.touches.length === 0) return;
    const t = e.touches[0];
    touchStartRef.current = { idx: index, x: t.clientX, y: t.clientY, moved: false };
    dragOverRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
    const start = touchStartRef.current;
    if (!start || isSolved || e.touches.length === 0) return;
    const t = e.touches[0];
    const dist = Math.hypot(t.clientX - start.x, t.clientY - start.y);
    if (dist > 10) {
      start.moved = true;
      setDragSourceIdx(start.idx);
      let hit = document.elementFromPoint(t.clientX, t.clientY)?.closest('[data-tile-index]') || null;
      if (!hit) {
        const container = e.currentTarget.parentElement;
        const candidates = Array.from(container?.querySelectorAll('[data-tile-index]') || []);
        hit =
          candidates.find((el) => {
            const r = el.getBoundingClientRect();
            return t.clientX >= r.left && t.clientX <= r.right && t.clientY >= r.top && t.clientY <= r.bottom;
          }) || null;
      }
      const targetAttr = hit?.getAttribute('data-tile-index');
      const targetIdx = targetAttr !== null && targetAttr !== undefined ? Number(targetAttr) : null;
      const validTarget = targetIdx !== null && !Number.isNaN(targetIdx) && targetIdx !== start.idx ? targetIdx : null;
      dragOverRef.current = validTarget;
      setDragOverIdx(validTarget);
    }
  };

  const handleTouchEnd = () => {
    const start = touchStartRef.current;
    const targetIdx = dragOverRef.current;
    touchStartRef.current = null;
    dragOverRef.current = null;
    if (start?.moved) {
      suppressClickRef.current = true;
      if (targetIdx !== null && targetIdx !== start.idx) {
        swapTiles(start.idx, targetIdx);
      } else {
        setDragSourceIdx(null);
        setDragOverIdx(null);
      }
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 300);
    }
  };

  const handleReset = () => {
    setTiles(INITIAL_SCRAMBLE);
    setSelectedIdx(null);
    setDragSourceIdx(null);
    setDragOverIdx(null);
    setIsSolved(false);
    setMoveCount(0);
    soundManager.playClick();
  };

  return (
    <div className="flex flex-col items-center gap-5 max-w-md mx-auto w-full">
      {/* Instructions & Preview Bar */}
      <div className="w-full text-center space-y-2">
        <p className="text-stone-800 dark:text-stone-200 text-sm font-bold">
          {data.instructionsAr}
        </p>

        {/* Thumbnail preview button + guide toggles */}
        <div className="flex items-center justify-between bg-stone-100 dark:bg-stone-800/80 p-2.5 rounded-2xl border border-stone-200 dark:border-stone-700">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-xs group cursor-pointer shrink-0"
              title="معاينة الصورة الأصلية كاملة"
            >
              <SafeCipherImage
                src={data.imageSrc}
                alt="معاينة اللوحة"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                <Eye className="w-4 h-4" />
              </div>
            </button>
            <div className="text-start">
              <span className="text-[11px] font-bold text-stone-900 dark:text-stone-100 block">
                {data.previewTitle || 'اللوحة الأصلية'}
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold underline cursor-pointer"
              >
                اضغط لتكبير الصورة 🔍
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowNumbers(!showNumbers)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                showNumbers
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
              }`}
              title="إظهار/إخفاء أرقام القطع للمساعدة"
            >
              <Hash className="w-3.5 h-3.5" />
              <span>{showNumbers ? 'أرقام: مفعّلة' : 'أرقام القطع'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300">
          اسحب أي قطعة بيدك أو بالماوس إلى مكان قطعة أخرى، أو انقر على قطعتين لتبديل مكانهما حتى تكتمل الصورة.
        </p>
      </div>

      {/* 3x3 Puzzle Board — dir="ltr" ensures tile 0 is top-left and prevents RTL horizontal mirroring */}
      <div
        dir="ltr"
        className="relative p-2.5 sm:p-3 bg-stone-800 dark:bg-stone-900 rounded-3xl shadow-xl border-2 border-stone-700/80 w-full max-w-[320px] sm:max-w-[340px] touch-none select-none"
      >
        <div className="grid grid-cols-3 gap-1.5 w-full rounded-2xl overflow-hidden bg-stone-800">
          {tiles.map((tileId, idx) => {
            const isSelected = selectedIdx === idx || dragSourceIdx === idx;
            const isDragTarget = dragOverIdx === idx;
            const isCorrectPosition = tileId === idx;
            const col = tileId % 3;
            const row = Math.floor(tileId / 3);

            return (
              <div
                key={idx}
                data-tile-index={idx}
                className="relative w-full rounded-xl overflow-hidden bg-emerald-950/50"
                style={{ paddingBottom: '100%' }}
              >
                <button
                  type="button"
                  data-tile-index={idx}
                  draggable={!isSolved}
                  onClick={() => handleTileClick(idx)}
                  onDragStart={(e) => {
                    if (isSolved) return;
                    setDragSourceIdx(idx);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', String(idx));
                  }}
                  onDragOver={(e) => {
                    if (isSolved) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverIdx !== idx) setDragOverIdx(idx);
                  }}
                  onDragLeave={() => {
                    if (dragOverIdx === idx) setDragOverIdx(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const rawFrom = e.dataTransfer.getData('text/plain');
                    const fromIdx = dragSourceIdx !== null ? dragSourceIdx : Number(rawFrom);
                    if (!Number.isNaN(fromIdx) && fromIdx !== idx) {
                      swapTiles(fromIdx, idx);
                    } else {
                      setDragSourceIdx(null);
                      setDragOverIdx(null);
                    }
                  }}
                  onDragEnd={() => {
                    setDragSourceIdx(null);
                    setDragOverIdx(null);
                  }}
                  onTouchStart={(e) => handleTouchStart(idx, e)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`absolute inset-0 block w-full h-full p-0 m-0 border-0 rounded-xl overflow-hidden transition-all duration-150 cursor-grab active:cursor-grabbing focus:outline-hidden touch-none ${
                    isDragTarget
                      ? 'ring-4 ring-emerald-400 scale-95 z-20 brightness-115'
                      : isSelected 
                        ? 'ring-4 ring-amber-400 scale-95 z-20 shadow-2xl brightness-110' 
                        : isCorrectPosition
                          ? 'ring-1 ring-emerald-500/50'
                          : 'hover:opacity-95 active:scale-95'
                  }`}
                  aria-label={`قطعة اللغز رقم ${tileId + 1}`}
                >
                  {/* Explicit full-bleed inner frame so 300% slice coordinates resolve against concrete pixel box on all mobile WebViews */}
                  <div className="relative w-full h-full overflow-hidden pointer-events-none">
                    <SafeCipherImage
                      src={data.imageSrc}
                      alt=""
                      draggable={false}
                      className="absolute max-w-none pointer-events-none select-none object-cover"
                      style={{
                        width: '300%',
                        height: '300%',
                        left: `${-col * 100}%`,
                        top: `${-row * 100}%`,
                      }}
                    />
                  </div>

                  {/* Number Badge Helper */}
                  {showNumbers && (
                    <span className={`absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-md text-[10px] font-black leading-none shadow-sm ${
                      isCorrectPosition
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black/75 text-amber-300 border border-black/40'
                    }`}>
                      {tileId + 1}
                    </span>
                  )}

                  {/* Correct Position Checkmark */}
                  {isCorrectPosition && !isSolved && (
                    <div className="absolute bottom-1 right-1 z-10 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold ring-1 ring-white/60">
                      ✓
                    </div>
                  )}

                  {/* Selected Overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 z-10 bg-amber-400/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white bg-black/75 px-1.5 py-0.5 rounded-md">محددة</span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Solved Overlay */}
        {isSolved && (
          <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-2 p-4 animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <span className="text-lg font-bold text-white">اكتملت اللوحة بسلام!</span>
            <span className="text-xs text-emerald-200">جاري تسجيل فك الشفرة...</span>
          </div>
        )}
      </div>

      {/* Footer Controls & Stats */}
      <div className="flex items-center justify-between w-full max-w-[320px] sm:max-w-[340px] text-xs text-stone-500 dark:text-stone-400">
        <span className="tabular-nums">عدد التبديلات: {moveCount}</span>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white px-2.5 py-1 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة الترتيب</span>
        </button>
      </div>

      {/* Full Artwork Modal Preview */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in" dir="rtl">
          <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🖼️</span>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                  {data.previewTitle || 'اللوحة الصباحية الأصلية'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-inner bg-stone-800"
              style={{ paddingBottom: '100%' }}
            >
              <SafeCipherImage
                src={data.imageSrc}
                alt={data.previewTitle || 'اللوحة الأصلية'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 text-center leading-relaxed">
              هذه هي اللوحة الصباحية المكتملة كما صُممت. رتّب القطع التسع لتطابق هذا المشهد.
            </p>

            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              العودة لحل اللغز
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
