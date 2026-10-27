import React, { useState } from 'react';
import { SymbolCipherData } from "../../../types/nesmaCipher";
import { CheckCircle2, RotateCcw, KeyRound } from 'lucide-react';
import { soundManager } from "../../../utils/audio";

interface SymbolCipherPuzzleProps {
  data: SymbolCipherData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

export const SymbolCipherPuzzle: React.FC<SymbolCipherPuzzleProps> = ({ data, onSolve }) => {
  // Candidate letters pool (including all correct letters + unique keys from table)
  const availableLetters = Array.from(new Set(Object.values(data.cipherTable)));
  
  // Slots currently filled for each encrypted symbol
  const [filledLetters, setFilledLetters] = useState<string[]>(() =>
    data.encryptedMessage.map(() => '')
  );
  const [activeSlotIdx, setActiveSlotIdx] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [errorShake, setErrorShake] = useState<boolean>(false);

  const handlePickLetter = (letter: string) => {
    if (isSolved) return;
    soundManager.playClick();

    const next = [...filledLetters];
    next[activeSlotIdx] = letter;
    setFilledLetters(next);

    // Auto-advance slot or check
    if (activeSlotIdx < data.encryptedMessage.length - 1) {
      setActiveSlotIdx(prev => prev + 1);
    } else {
      // Check full word
      const currentWord = next.join('');
      if (currentWord === data.targetWord) {
        setIsSolved(true);
        soundManager.playCorrect();
        setTimeout(() => {
          onSolve();
        }, 800);
      } else {
        soundManager.playIncorrect();
        setErrorShake(true);
        setTimeout(() => setErrorShake(false), 600);
      }
    }
  };

  const handleReset = () => {
    setFilledLetters(data.encryptedMessage.map(() => ''));
    setActiveSlotIdx(0);
    setIsSolved(false);
    soundManager.playClick();
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto w-full">
      {/* Instructions */}
      <div className="text-center space-y-1.5">
        <p className="text-stone-700 dark:text-stone-300 text-sm font-medium">
          {data.instructionsAr}
        </p>
      </div>

      {/* Cipher Key Table */}
      <div className="w-full bg-stone-100 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 mb-2">
          <KeyRound className="w-3.5 h-3.5" />
          <span>جدول مفاتيح الشفرة:</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {Object.entries(data.cipherTable).map(([sym, letter]) => (
            <div
              key={sym}
              className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-2 flex flex-col items-center shadow-2xs"
            >
              <span className="text-xl">{sym}</span>
              <span className="text-xs text-stone-400 font-mono">↓</span>
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{letter}</span>
            </div>
          ))}
        </div>
      </div>

      {/* The Encrypted Message Display */}
      <div className="w-full text-center space-y-2">
        <span className="text-xs text-stone-500 font-medium">الرسالة المشفرة:</span>
        <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${errorShake ? 'animate-shake' : ''}`}>
          {data.encryptedMessage.map((sym, idx) => {
            const filledChar = filledLetters[idx];
            const isActive = activeSlotIdx === idx && !isSolved;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlotIdx(idx)}
                disabled={isSolved}
                className={`w-14 h-20 rounded-2xl border-2 flex flex-col items-center justify-between p-1.5 transition-all cursor-pointer ${
                  isActive 
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-300' 
                    : filledChar 
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' 
                      : 'border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800'
                }`}
              >
                <span className="text-2xl drop-shadow">{sym}</span>
                <div className="w-full h-8 bg-white dark:bg-stone-800 rounded-lg flex items-center justify-center text-lg font-bold text-stone-900 dark:text-stone-100 shadow-2xs">
                  {filledChar || (isActive ? '؟' : '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Letter Bank */}
      {!isSolved && (
        <div className="w-full space-y-2">
          <span className="text-xs text-stone-500 block text-center">
            اختر الحرف لخانة الرمز المحدد ({data.encryptedMessage[activeSlotIdx]}):
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {availableLetters.map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => handlePickLetter(char)}
                className="w-11 h-12 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-xl text-lg font-bold text-stone-800 dark:text-stone-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Solved Banner */}
      {isSolved && (
        <div className="w-full p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>تم فك شفرة الكلمة بنجاح! ({data.targetWord})</span>
        </div>
      )}

      {/* Reset button */}
      <button
        type="button"
        onClick={handleReset}
        disabled={isSolved}
        className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>مسح الحروف والبدء من جديد</span>
      </button>
    </div>
  );
};
