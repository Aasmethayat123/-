import React, { useState } from 'react';
import { HybridChallengeData } from '../../types/nesmaCipher';
import { CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, KeyRound, Check } from 'lucide-react';
import { soundManager } from '@/src/utils/audio';

interface HybridChallengePuzzleProps {
  data: HybridChallengeData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

export const HybridChallengePuzzle: React.FC<HybridChallengePuzzleProps> = ({ data, onSolve }) => {
  const [currentPhase, setCurrentPhase] = useState<1 | 2>(1);
  
  // Phase 1: Cipher
  const [phase1Filled, setPhase1Filled] = useState<string[]>(['', '']);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [phase1Done, setPhase1Done] = useState<boolean>(false);

  // Phase 2: Order
  const [phase2Words, setPhase2Words] = useState<string[]>([...data.phase2.words]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [phase2Error, setPhase2Error] = useState<string | null>(null);

  // Phase 1 letter picking
  const availableLetters = Array.from(new Set(Object.values(data.phase1.cipherKey)));

  const handlePickPhase1 = (letter: string) => {
    if (phase1Done) return;
    soundManager.playClick();

    const next = [...phase1Filled];
    next[activeSlot] = letter;
    setPhase1Filled(next);

    if (activeSlot === 0) {
      setActiveSlot(1);
    } else {
      // Check solution
      const word = next.join('');
      if (word === data.phase1.solution) {
        soundManager.playCorrect();
        setPhase1Done(true);
        setTimeout(() => {
          setCurrentPhase(2);
        }, 800);
      } else {
        soundManager.playIncorrect();
      }
    }
  };

  // Phase 2 word movements
  const handleSwapWords = (idx: number, target: number) => {
    if (isSolved || target < 0 || target >= phase2Words.length) return;
    soundManager.playClick();
    const next = [...phase2Words];
    const temp = next[target];
    next[target] = next[idx];
    next[idx] = temp;
    setPhase2Words(next);
    setPhase2Error(null);
  };

  const handleVerifyPhase2 = () => {
    const isCorrect = phase2Words.every((w, i) => w === data.phase2.correctOrder[i]);
    if (isCorrect) {
      setIsSolved(true);
      setPhase2Error(null);
      soundManager.playCorrect();
      setTimeout(() => {
        onSolve();
      }, 900);
    } else {
      soundManager.playIncorrect();
      setPhase2Error('الترتيب يحتاج مراجعة؛ تذكر: الذات المراقبة تسبق ملاحظة الفكرة.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-lg mx-auto w-full">
      {/* Stepper Header */}
      <div className="flex items-center gap-3 w-full justify-center">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
          currentPhase === 1 
            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400' 
            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
        }`}>
          <span>١. فك الشفرة</span>
          {phase1Done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        </div>
        <span className="text-stone-300 dark:text-stone-700 font-bold">←</span>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
          currentPhase === 2 
            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400' 
            : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
        }`}>
          <span>٢. ترتيب مسار الوعي</span>
          {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        </div>
      </div>

      {/* PHASE 1: Cipher Section */}
      {currentPhase === 1 && (
        <div className="w-full space-y-4 animate-in fade-in">
          <div className="text-center">
            <p className="text-stone-700 dark:text-stone-300 text-xs font-medium">
              فك شفرة الرمزين لاستخراج كلمة العبور الأولى:
            </p>
          </div>

          {/* Cipher Table */}
          <div className="bg-stone-100 dark:bg-stone-900/60 p-3 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-around">
            {Object.entries(data.phase1.cipherKey).map(([sym, char]) => (
              <div key={sym} className="flex items-center gap-2">
                <span className="text-xl">{sym}</span>
                <span className="text-stone-400 font-mono">→</span>
                <span className="text-sm font-bold bg-white dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-300 dark:border-stone-700">
                  {char}
                </span>
              </div>
            ))}
          </div>

          {/* Slots */}
          <div className="flex items-center justify-center gap-3">
            {data.phase1.codeWords.map((sym, idx) => {
              const char = phase1Filled[idx];
              const isActive = activeSlot === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlot(idx)}
                  className={`w-14 h-20 rounded-2xl border-2 flex flex-col items-center justify-between p-2 cursor-pointer ${
                    isActive ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-2 ring-amber-300' : 'border-stone-300 dark:border-stone-700'
                  }`}
                >
                  <span className="text-2xl">{sym}</span>
                  <div className="w-full h-7 bg-white dark:bg-stone-800 rounded flex items-center justify-center font-bold">
                    {char || '؟'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Letter Bank */}
          <div className="flex items-center justify-center gap-3">
            {availableLetters.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handlePickPhase1(c)}
                className="w-12 h-12 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 font-bold text-lg hover:border-emerald-500 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 2: Words Sequence */}
      {currentPhase === 2 && (
        <div className="w-full space-y-4 animate-in fade-in">
          <div className="text-center">
            <p className="text-stone-700 dark:text-stone-300 text-xs font-medium">
              {data.phase2.prompt}
            </p>
          </div>

          {/* Words */}
          <div className="flex items-center justify-center gap-2.5">
            {phase2Words.map((word, idx) => (
              <div
                key={idx}
                className="p-3 bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl flex flex-col items-center shadow-xs"
              >
                <span className="text-base font-bold text-stone-900 dark:text-stone-100 py-1">
                  {word}
                </span>
                {!isSolved && (
                  <div className="flex items-center gap-1 mt-1 pt-1 border-t border-stone-100 dark:border-stone-700">
                    <button
                      type="button"
                      onClick={() => handleSwapWords(idx, idx + 1)}
                      disabled={idx === phase2Words.length - 1}
                      className="p-1 rounded text-stone-400 hover:text-stone-900 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwapWords(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1 rounded text-stone-400 hover:text-stone-900 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {phase2Error && (
            <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg text-center">
              {phase2Error}
            </div>
          )}

          {isSolved ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>تم اجتياز التحدي المزدوج بنجاح باهر!</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleVerifyPhase2}
              className="w-full max-w-xs mx-auto py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>تحقق من التحدي المركب</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
