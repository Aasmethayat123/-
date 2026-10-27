import React, { useEffect } from 'react';
import { Award, Sparkles, X, ArrowRight } from 'lucide-react';
import { BadgeDefinition, Language } from '../types';
import { triggerConfetti } from '../utils/confetti';
import { soundManager } from '../utils/audio';

interface BadgeCelebrationModalProps {
  badge: BadgeDefinition | null;
  totalGamesCompleted: number;
  language: Language;
  onClose: () => void;
  onViewAllBadges: () => void;
}

export const BadgeCelebrationModal: React.FC<BadgeCelebrationModalProps> = ({
  badge,
  totalGamesCompleted,
  language,
  onClose,
  onViewAllBadges
}) => {
  const isAr = language === 'ar';

  useEffect(() => {
    if (!badge) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [badge, onClose]);

  if (!badge) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-celebration-title"
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-2xl text-center animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Celebration Glow */}
        <div
          className={`pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-br ${badge.emblemGradient} opacity-15 blur-3xl`}
          aria-hidden="true"
        />

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={isAr ? 'إغلاق نافذة الوسام' : 'Close badge celebration'}
          className="absolute top-4 end-4 w-11 h-11 inline-flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Kicker */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-300 text-xs font-extrabold mb-5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{isAr ? 'إنجاز جديد في رحلتك' : 'New Milestone Unlocked'}</span>
        </div>

        {/* Badge Emblem */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-5 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              soundManager.playHarmonicAffirmation();
              triggerConfetti(0.5, 0.38);
            }}
            title={isAr ? 'اضغط للاحتفال مرة أخرى' : 'Tap to celebrate'}
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br ${badge.emblemGradient} text-5xl sm:text-6xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer`}
          >
            <span role="img" aria-hidden="true">
              {badge.icon}
            </span>
          </button>
        </div>

        {/* Badge Title & Milestone */}
        <h2
          id="badge-celebration-title"
          className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-serif tracking-tight"
        >
          {isAr ? badge.nameAr : badge.nameEn}
        </h2>

        <p className="mt-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
          {isAr
            ? `إجمالي الألعاب المكتملة: ${totalGamesCompleted} (${badge.requiredGames === 1 ? 'أول لعبة مكتملة' : `${badge.requiredGames} ألعاب`})`
            : `Total Games Completed: ${totalGamesCompleted} (${badge.requiredGames} ${badge.requiredGames === 1 ? 'game' : 'games'} milestone)`}
        </p>

        {/* Psychological Description */}
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-sm mx-auto">
          {isAr ? badge.descriptionAr : badge.descriptionEn}
        </p>

        {/* Actions */}
        <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{isAr ? 'مواصلة الرحلة' : 'Continue Journey'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onViewAllBadges();
            }}
            className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{isAr ? 'عرض كل أوسمتي' : 'View My Badges'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
