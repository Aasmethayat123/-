import React, { useState } from 'react';
import { ScenarioOrderData } from '../../types/nesmaCipher';
import { CheckCircle2, RotateCcw, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { soundManager } from '@/src/utils/audio';

interface ScenarioOrderPuzzleProps {
  data: ScenarioOrderData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

export const ScenarioOrderPuzzle: React.FC<ScenarioOrderPuzzleProps> = ({ data, onSolve }) => {
  // Scramble steps initially
  const [steps, setSteps] = useState(() => {
    // Deterministic shuffle
    const copy = [...data.steps];
    return copy.reverse();
  });
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (isSolved) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;

    soundManager.playClick();
    const next = [...steps];
    const temp = next[targetIdx];
    next[targetIdx] = next[index];
    next[index] = temp;
    setSteps(next);
    setErrorMessage(null);
  };

  const handleVerify = () => {
    const isCorrect = steps.every((s, idx) => s.correctOrder === idx + 1);
    if (isCorrect) {
      setIsSolved(true);
      setErrorMessage(null);
      soundManager.playCorrect();
      setTimeout(() => {
        onSolve();
      }, 900);
    } else {
      soundManager.playIncorrect();
      setErrorMessage('ترتيب الخطوات يحتاج إعادة نظر؛ تذكّر: نبدأ دائماً بالتهدئة الداخلية ثم الاستجابة.');
    }
  };

  const handleReset = () => {
    const copy = [...data.steps];
    setSteps(copy.reverse());
    setIsSolved(false);
    setErrorMessage(null);
    soundManager.playClick();
  };

  return (
    <div className="flex flex-col items-center gap-5 max-w-lg mx-auto w-full">
      {/* Scenario header */}
      <div className="text-center space-y-1.5 w-full">
        <p className="text-stone-700 dark:text-stone-300 text-sm font-medium">
          {data.instructionsAr}
        </p>
        <div className="bg-stone-100 dark:bg-stone-900/60 p-3 rounded-xl border border-stone-200 dark:border-stone-800 text-start">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block mb-0.5">
            الموقف: {data.situationTitle}
          </span>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            {data.situationDesc}
          </p>
        </div>
      </div>

      {/* Steps List */}
      <div className="w-full space-y-2.5">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
              isSolved
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400'
                : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 shadow-2xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div>
                <p className="text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-100">
                  {step.text}
                </p>
                {isSolved && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
                    💡 {step.reflectionAr}
                  </p>
                )}
              </div>
            </div>

            {/* Reorder Buttons */}
            {!isSolved && (
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveStep(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-20 cursor-pointer"
                  title="تحريك لأعلى"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveStep(idx, 'down')}
                  disabled={idx === steps.length - 1}
                  className="p-1 rounded text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-20 cursor-pointer"
                  title="تحريك لأسفل"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback message */}
      {errorMessage && (
        <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 px-3 py-1.5 rounded-lg text-center animate-shake">
          {errorMessage}
        </div>
      )}

      {/* Verify & Reset Controls */}
      {isSolved ? (
        <div className="w-full p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>ترتيب حكيم يضمن السكينة والعدل النفسي!</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={handleVerify}
            className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>تحقق من التسلسل</span>
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
