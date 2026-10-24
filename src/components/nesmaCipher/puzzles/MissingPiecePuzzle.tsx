import React, { useState } from 'react';
import { MissingPieceData } from "../../../types/nesmaCipher";
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { soundManager } from "../../../utils/audio";

interface MissingPiecePuzzleProps {
  data: MissingPieceData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

export const MissingPiecePuzzle: React.FC<MissingPiecePuzzleProps> = ({ data, onSolve }) => {
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelect = (opt: { id: string; title: string; desc: string; icon: string; isCorrect: boolean; feedbackAr: string }) => {
    if (isSolved) return;
    setSelectedOptId(opt.id);

    if (opt.isCorrect) {
      setIsSolved(true);
      setFeedback(opt.feedbackAr);
      soundManager.playCorrect();
      setTimeout(() => {
        onSolve();
      }, 800);
    } else {
      soundManager.playIncorrect();
      setFeedback(opt.feedbackAr);
    }
  };

  const correctOption = isSolved ? data.options.find(o => o.isCorrect) : null;

  return (
    <div className="flex flex-col items-center gap-6 max-w-lg mx-auto w-full">
      {/* Title & Instructions */}
      <div className="text-center space-y-1.5">
        <p className="text-stone-700 dark:text-stone-300 text-sm font-medium">
          {data.instructionsAr}
        </p>
        <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-lg inline-block">
          {data.conceptTitle}
        </h3>
      </div>

      {/* Board Layout with Items + 1 Missing Slot */}
      <div className="w-full bg-stone-100 dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
        <div className="grid grid-cols-2 gap-3">
          {data.boardItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex flex-col items-center text-center gap-1.5 shadow-xs"
            >
              <span className="text-2xl p-1 bg-stone-50 dark:bg-stone-700 rounded-lg">{item.icon}</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{item.title}</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">{item.desc}</span>
            </div>
          ))}

          {/* Missing Slot */}
          <div
            className={`p-3 rounded-xl border flex flex-col items-center text-center justify-center gap-1.5 transition-all ${
              isSolved && correctOption
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-400 shadow-sm animate-in zoom-in-95'
                : 'bg-amber-50 dark:bg-amber-950/30 border-2 border-dashed border-amber-400 animate-pulse'
            }`}
          >
            {isSolved && correctOption ? (
              <>
                <span className="text-2xl p-1 bg-emerald-100 dark:bg-emerald-900 rounded-lg">{correctOption.icon}</span>
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">{correctOption.title}</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300">{correctOption.desc}</span>
              </>
            ) : (
              <>
                <span className="text-2xl">🧩</span>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">القطعة المفقودة</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400">اختر من الخيارات أدناه</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Options List */}
      <div className="w-full space-y-2">
        <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block text-center">
          اختر القطعة التي تكمل المنظومة النفسية بدقة:
        </span>
        <div className="space-y-2">
          {data.options.map((opt) => {
            const isSelected = selectedOptId === opt.id;
            let style = 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-emerald-400';
            if (isSelected) {
              style = opt.isCorrect 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-400' 
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 ring-2 ring-rose-300';
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt)}
                disabled={isSolved}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-start gap-3 transition-all cursor-pointer ${style}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl p-1.5 rounded-lg bg-stone-100 dark:bg-stone-700/60 shrink-0">
                    {opt.icon}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      {opt.title}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                      {opt.desc}
                    </span>
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

      {/* Explanatory Feedback */}
      {feedback && (
        <div className={`w-full p-3 rounded-xl border text-xs flex items-center gap-2 ${
          isSolved
            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
        }`}>
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
};
