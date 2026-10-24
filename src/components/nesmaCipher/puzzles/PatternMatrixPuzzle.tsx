import React, { useState } from 'react';
import { PatternMatrixData } from "../../../types/nesmaCipher";
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { soundManager } from "../../../utils/audio";

interface PatternMatrixPuzzleProps {
  data: PatternMatrixData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

export const PatternMatrixPuzzle: React.FC<PatternMatrixPuzzleProps> = ({ data, onSolve }) => {
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelectOption = (opt: { id: string; label: string; icon: string; explanation: string; isCorrect: boolean }) => {
    if (isSolved) return;
    setSelectedOptId(opt.id);

    if (opt.isCorrect) {
      setIsSolved(true);
      setFeedback(opt.explanation);
      soundManager.playCorrect();
      setTimeout(() => {
        onSolve();
      }, 800);
    } else {
      soundManager.playIncorrect();
      setFeedback(`حاول مرة أخرى: ${opt.explanation}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-lg mx-auto w-full">
      {/* Instructions */}
      <div className="text-center space-y-1.5">
        <p className="text-stone-700 dark:text-stone-300 text-sm font-medium">
          {data.instructionsAr}
        </p>
      </div>

      {/* The Pattern Sequence */}
      <div className="w-full bg-stone-100 dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {data.patternSequence.map((item, idx) => {
            const isMissingSlot = idx === data.missingIndex;
            const chosenCorrectOpt = isSolved 
              ? data.options.find(o => o.isCorrect) 
              : null;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all ${
                  isMissingSlot
                    ? isSolved
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-sm'
                      : 'bg-amber-50 dark:bg-amber-950/30 border-dashed border-amber-400 animate-pulse'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span className="text-2xl">
                  {isMissingSlot && chosenCorrectOpt ? chosenCorrectOpt.icon : item.icon}
                </span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                  {isMissingSlot && chosenCorrectOpt ? chosenCorrectOpt.label : item.label}
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-2">
                  {isMissingSlot && chosenCorrectOpt ? chosenCorrectOpt.explanation : item.explanation}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Options */}
      <div className="w-full space-y-2">
        <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block text-center">
          اختر العنصر المناسب لإكمال النمط المنطقي:
        </span>
        <div className="grid grid-cols-1 gap-2.5">
          {data.options.map((opt) => {
            const isSelected = selectedOptId === opt.id;
            let btnStyle = 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-emerald-400';
            if (isSelected) {
              btnStyle = opt.isCorrect 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-400' 
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 ring-2 ring-rose-300';
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={isSolved}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-start gap-3 transition-all cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-1.5 rounded-lg bg-stone-100 dark:bg-stone-700/60 shrink-0">
                    {opt.icon}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {opt.label}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {opt.explanation}
                    </p>
                  </div>
                </div>
                {isSelected && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logic feedback */}
      {feedback && (
        <div className={`w-full p-3 rounded-xl border text-xs flex items-center gap-2 ${
          isSolved
            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-900 dark:text-amber-200'
        }`}>
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
};
