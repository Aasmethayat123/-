import React from 'react';
import { KeyRound, Lock, Unlock, Cog, Sparkles } from 'lucide-react';

interface CipherVisualAmbianceProps {
  progressCount: number;
  isSolved: boolean;
}

export const CipherVisualAmbiance: React.FC<CipherVisualAmbianceProps> = ({ progressCount, isSolved }) => {
  return (
    <div className="flex items-center justify-center gap-4 py-2.5 px-5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs select-none">
      {/* Spinning Gear with dynamic speed */}
      <div className="relative flex items-center justify-center text-emerald-600 dark:text-emerald-400">
        <Cog className="w-5 h-5 animate-spin" style={{ animationDuration: isSolved ? '4s' : '10s' }} />
      </div>

      {/* Pulsing Key with opacity scaling */}
      <div className="relative flex items-center justify-center text-amber-600 dark:text-amber-400">
        <KeyRound className="w-5 h-5 animate-pulse" style={{ opacity: Math.min(1, 0.5 + (progressCount * 0.1)) }} />
      </div>

      {/* Interactive Lock / Unlock State */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
        {isSolved ? (
          <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 animate-bounce">
            <Unlock className="w-4 h-4 text-emerald-500" />
            <span>تم فك قفل الشفرة</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>آلية القفل تعمل</span>
          </div>
        )}
      </div>
    </div>
  );
};
