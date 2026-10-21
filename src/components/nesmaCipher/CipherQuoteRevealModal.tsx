import React from 'react';
import { CipherQuote } from '../../types/nesmaCipher';
import { BookOpen, Sparkles, Heart, Check, Share2, Copy } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface CipherQuoteRevealModalProps {
  quote: CipherQuote;
  onClose: () => void;
}

export const CipherQuoteRevealModal: React.FC<CipherQuoteRevealModalProps> = ({
  quote,
  onClose
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleCopy = () => {
    soundManager.playClick();
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(`${quote.fullText}\n— من لعبة شفرة نسمة (مبادرة نسمة حياة)`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl border border-amber-300/60 dark:border-amber-800 shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Celebration Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl shadow-lg ring-8 ring-amber-400/20 animate-pulse">
            ✨
          </div>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            تتويج سلسلة: {quote.categoryAr}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            اكتملت المقولة النفسية العميقة! 📜
          </h2>
        </div>

        {/* The Full Quote Banner in Beautiful Typography */}
        <div className="p-6 bg-gradient-to-tr from-stone-900 via-emerald-950 to-stone-900 rounded-3xl text-white shadow-xl border border-emerald-800/60 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          <div className="relative z-10 space-y-3">
            <span className="text-3xl text-amber-300/80 font-serif block">“</span>
            <p className="text-lg sm:text-xl font-bold leading-relaxed font-serif text-emerald-100 tracking-wide">
              {quote.fullText}
            </p>
            <span className="text-xs text-emerald-400/80 font-medium block">
              — شفرة نسمة | مبادرة نسمة حياة
            </span>
          </div>
        </div>

        {/* Psychological Meaning */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700/60 text-start space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <Heart className="w-4 h-4 text-emerald-600" />
            <span>المعنى والتحليل النفسي:</span>
          </div>
          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
            {quote.psychologicalMeaning}
          </p>
        </div>

        {/* Practical Application */}
        <div className="p-4 bg-amber-50/70 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-start space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>تطبيق عملي مقترح اليوم:</span>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
            {quote.practicalApplication}
          </p>
        </div>

        {/* Scientific Basis Note */}
        <p className="text-[11px] text-stone-400 dark:text-stone-500 text-start leading-relaxed">
          🔍 <strong>الأساس العلمي:</strong> {quote.foundation}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full py-3 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>حفظ في دفتر الحكمة ومتابعة المغامرة</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ المقولة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
