import React, { useState } from 'react';
import { WordSequenceData } from "../../../types/nesmaCipher";
import { CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { soundManager } from "../../../utils/audio";

interface WordSequencePuzzleProps {
  data: WordSequenceData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

export const WordSequencePuzzle: React.FC<WordSequencePuzzleProps> = ({ data, onSolve }) => {
  const [currentOrder, setCurrentOrder] = useState<string[]>([...data.scrambledWords]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMoveLeft = (index: number) => {
    if (isSolved || index <= 0) return;
    soundManager.playClick();
    const next = [...currentOrder];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setCurrentOrder(next);
    setErrorMessage(null);
  };

  const handleMoveRight = (index: number) => {
    if (isSolved || index >= currentOrder.length - 1) return;
    soundManager.playClick();
    const next = [...currentOrder];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setCurrentOrder(next);
    setErrorMessage(null);
  };

  const handleVerify = () => {
    const isCorrect = currentOrder.every((word, idx) => word === data.correctSentence[idx]);
    if (isCorrect) {
      setIsSolved(true);
      setErrorMessage(null);
      soundManager.playCorrect();
      setTimeout(() => {
        onSolve();
      }, 700);
    } else {
      soundManager.playIncorrect();
      setErrorMessage('الترتيب الحالي يحتاج تعديلاً؛ راجع تسلسل الفكرة منطقياً.');
    }
  };

  const handleReset = () => {
    setCurrentOrder([...data.scrambledWords]);
    setIsSolved(false);
    setErrorMessage(null);
    soundManager.playClick();
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-lg mx-auto w-full">
      {/* Header instructions */}
      <div className="text-center space-y-1.5">
        <p className="text-stone-700 dark:text-stone-300 text-sm font-medium">
          {data.instructionsAr}
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          استخدم الأسهم لتحريك الكلمات يميناً أو يساراً حتى يكتمل المعنى الصحيح.
        </p>
      </div>

      {/* Words Reordering Strip */}
      <div className="w-full flex flex-wrap items-center justify-center gap-3 py-3">
        {currentOrder.map((word, idx) => (
          <div
            key={`${word}-${idx}`}
            className="flex flex-col items-center bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-2xl p-2.5 shadow-sm min-w-[110px]"
          >
            <span className="text-base font-bold text-stone-900 dark:text-stone-100 py-1 px-2 text-center">
              {word}
            </span>
            {/* Direction Arrows */}
            {!isSolved && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-100 dark:border-stone-700/60 w-full justify-center">
                <button
                  type="button"
                  onClick={() => handleMoveRight(idx)}
                  disabled={idx === currentOrder.length - 1}
                  className="p-1 rounded-md text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
                  title="تحريك لليسار/التالي"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveLeft(idx)}
                  disabled={idx === 0}
                  className="p-1 rounded-md text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
                  title="تحريك لليمين/السابق"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Verification & Status */}
      {errorMessage && (
        <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 px-3 py-1.5 rounded-lg text-center animate-shake">
          {errorMessage}
        </div>
      )}

      {isSolved ? (
        <div className="w-full p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>ترتيب متناسق ومعنى عميق ومكتمل!</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={handleVerify}
            className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>تحقق من الترتيب</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            title="إعادة المحاولة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
