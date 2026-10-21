import React, { useState } from 'react';
import { CipherProgress } from '../../types/nesmaCipher';
import { CIPHER_QUOTES } from '../../data/nesmaCipherData';
import { BookOpen, ArrowRight, Lock, Sparkles, Heart, Check, Copy } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface CipherQuotesVaultProps {
  progress: CipherProgress;
  onBack: () => void;
}

export const CipherQuotesVault: React.FC<CipherQuotesVaultProps> = ({
  progress,
  onBack
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    soundManager.playClick();
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n— من لعبة شفرة نسمة`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span>دفتر حكمة الشفرة</span>
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                المقولات النفسية الخمس التي جمعت أجزاءها عبر رحلتك
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 tabular-nums">
            {progress.discoveredQuotes.length} من 5 مقولات مكتملة
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        <div className="space-y-4">
          {CIPHER_QUOTES.map((quote) => {
            const isDiscovered = progress.discoveredQuotes.includes(quote.id);
            // Count how many parts of this quote have been collected
            const collectedTokensCount = quote.tokens.filter(t => 
              progress.completedLevels.includes(t.levelId)
            ).length;

            return (
              <div
                key={quote.id}
                className={`rounded-3xl border transition-all p-5 sm:p-6 space-y-4 ${
                  isDiscovered
                    ? 'bg-white dark:bg-stone-900 border-amber-200 dark:border-amber-900/60 shadow-sm'
                    : 'bg-stone-100/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      {quote.categoryAr}
                    </span>
                    <span>·</span>
                    <span className="text-xs text-stone-400">
                      المراحل {quote.levelIds[0]} - {quote.levelIds[quote.levelIds.length - 1]}
                    </span>
                  </div>

                  {isDiscovered ? (
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      مكتملة ومكتشفة ✓
                    </span>
                  ) : (
                    <span className="text-xs text-stone-500 bg-stone-200 dark:bg-stone-800 px-2.5 py-0.5 rounded-full tabular-nums">
                      {collectedTokensCount} من 6 أجزاء تم جمعها
                    </span>
                  )}
                </div>

                {/* Quote Content */}
                {isDiscovered ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white rounded-2xl border border-emerald-800/60 shadow-xs">
                      <p className="text-base sm:text-lg font-bold font-serif leading-relaxed text-emerald-100">
                        «{quote.fullText}»
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700/60 text-xs space-y-1">
                        <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-emerald-600" />
                          <span>المعنى والتحليل النفسي:</span>
                        </span>
                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                          {quote.psychologicalMeaning}
                        </p>
                      </div>

                      <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs space-y-1">
                        <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>تطبيق عملي:</span>
                        </span>
                        <p className="text-amber-900 dark:text-amber-300 leading-relaxed">
                          {quote.practicalApplication}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-stone-400">
                        الأساس العلمي: {quote.foundation}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(quote.id, quote.fullText)}
                        className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-300 hover:text-stone-900 px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                      >
                        {copiedId === quote.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === quote.id ? 'تم النسخ!' : 'نسخ'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                    <Lock className="w-8 h-8 text-stone-400" />
                    <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                      هذه المقولة ما زالت مشفرة
                    </span>
                    <p className="text-xs text-stone-500 max-w-sm">
                      أكمل المراحل من {quote.levelIds[0]} إلى {quote.levelIds[quote.levelIds.length - 1]} لجمع حروفها وأجزائها الستة وكشف رسالتها الكاملة.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
