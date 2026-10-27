import React, { useState, useEffect } from 'react';
import { LetterScrambleData } from "../../../types/nesmaCipher";
import { CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';
import { soundManager } from "../../../utils/audio";

interface LetterScramblePuzzleProps {
  data: LetterScrambleData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

export const LetterScramblePuzzle: React.FC<LetterScramblePuzzleProps> = ({ data, onSolve }) => {
  // Letters available in the pool (with unique ids to support repeated letters)
  const [bank, setBank] = useState<{ id: string; char: string }[]>(() =>
    data.scrambledLetters.map((char, idx) => ({ id: `${char}-${idx}`, char }))
  );
  // Letters currently placed in the target slots
  const [placed, setPlaced] = useState<{ id: string; char: string }[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [errorShake, setErrorShake] = useState<boolean>(false);

  const solvedTriggeredRef = React.useRef<boolean>(false);
  const solveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (solveTimerRef.current) clearTimeout(solveTimerRef.current);
    };
  }, []);

  // Check whenever placed letters match target word length
  useEffect(() => {
    if (solvedTriggeredRef.current) return;
    if (placed.length === data.targetWord.length) {
      const currentWord = placed.map(p => p.char).join('');
      if (currentWord === data.targetWord) {
        solvedTriggeredRef.current = true;
        setIsSolved(true);
        soundManager.playCorrect();
        solveTimerRef.current = setTimeout(() => {
          onSolve();
        }, 700);
      } else {
        // Incorrect combination
        setErrorShake(true);
        soundManager.playIncorrect();
        const timer = setTimeout(() => setErrorShake(false), 600);
        return () => clearTimeout(timer);
      }
    }
  }, [placed, data.targetWord, onSolve]);

  const handleResetRefSafe = () => {
    solvedTriggeredRef.current = false;
    if (solveTimerRef.current) {
      clearTimeout(solveTimerRef.current);
      solveTimerRef.current = null;
    }
  };

  const handlePickFromBank = (item: { id: string; char: string }) => {
    if (isSolved || placed.length >= data.targetWord.length) return;
    soundManager.playClick();
    setBank(prev => prev.filter(b => b.id !== item.id));
    setPlaced(prev => [...prev, item]);
  };

  const handleRemoveFromPlaced = (item: { id: string; char: string }) => {
    if (isSolved) return;
    soundManager.playClick();
    setPlaced(prev => prev.filter(p => p.id !== item.id));
    setBank(prev => [...prev, item]);
  };

  const handleReset = () => {
    handleResetRefSafe();
    setBank(data.scrambledLetters.map((char, idx) => ({ id: `${char}-${idx}`, char })));
    setPlaced([]);
    setIsSolved(false);
    soundManager.playClick();
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto w-full">
      {/* Context & Clue Banner */}
      <div className="text-center space-y-2">
        <p className="text-stone-700 dark:text-stone-300 text-sm font-medium">
          {data.instructionsAr}
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg text-amber-800 dark:text-amber-300 text-xs">
          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
          <span>تلميح المعنى: {data.clueAr}</span>
        </div>
      </div>

      {/* Target Word Slots */}
      <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 my-2 transition-transform ${errorShake ? 'animate-shake' : ''}`}>
        {Array.from({ length: data.targetWord.length }).map((_, idx) => {
          const item = placed[idx];
          return (
            <button
              key={idx}
              type="button"
              onClick={() => item && handleRemoveFromPlaced(item)}
              disabled={isSolved || !item}
              className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                item 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-md cursor-pointer hover:border-red-400' 
                  : 'bg-stone-100 dark:bg-stone-800/60 border-dashed border-stone-300 dark:border-stone-700 text-transparent cursor-default'
              }`}
              aria-label={item ? `حرف ${item.char}` : `خانة فارغة رقم ${idx + 1}`}
            >
              {item ? item.char : ''}
            </button>
          );
        })}
      </div>

      {/* Bank of Scrambled Letters */}
      <div className="w-full bg-stone-100 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col items-center gap-3">
        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          الحروف المتاحة (اضغط لإدراج الحرف):
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2.5 min-h-[56px]">
          {bank.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePickFromBank(item)}
              disabled={isSolved}
              className="w-12 h-14 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-xl shadow-xs flex items-center justify-center text-xl font-bold text-stone-800 dark:text-stone-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400 transition-all active:scale-95 cursor-pointer"
            >
              {item.char}
            </button>
          ))}
          {bank.length === 0 && !isSolved && (
            <span className="text-xs text-stone-400">تم اختيار كل الحروف؛ تحقق من الكلمة</span>
          )}
        </div>
      </div>

      {/* Meaning description if solved */}
      {isSolved && (
        <div className="w-full p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span><strong>أحسنت!</strong> {data.meaningAr}</span>
        </div>
      )}

      {/* Reset button */}
      <button
        type="button"
        onClick={handleReset}
        disabled={isSolved || placed.length === 0}
        className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 disabled:opacity-40 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>إفراغ الخانات والبدء من جديد</span>
      </button>
    </div>
  );
};
