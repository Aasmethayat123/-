import React, { useEffect } from 'react';
import { Language } from '../types';
import { AVATARS, BADGES, getEarnedBadges } from '../utils/gameState';
import { soundManager } from '../utils/audio';
import { X, Check, Award, Lock } from 'lucide-react';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentAvatarId: string;
  onSelectAvatar: (id: string) => void;
  earnedBadgeIds?: string[];
  totalGamesCompleted?: number;
  onViewAllBadges?: () => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  language,
  currentAvatarId,
  onSelectAvatar,
  earnedBadgeIds = [],
  totalGamesCompleted = 0,
  onViewAllBadges
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAr = language === 'ar';
  const avatars = AVATARS[language];
  const earnedBadges = getEarnedBadges(earnedBadgeIds);
  const earnedSet = new Set(earnedBadges.map((b) => b.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 relative text-start transition-colors my-auto"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={isAr ? 'إغلاق' : 'Close'}
          className="absolute top-4 end-4 w-11 h-11 inline-flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5 pe-10">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            {isAr ? 'ملفك الشخصي وشخصيات نسمة حياة' : 'Player Profile & Character Roster'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-1 font-serif">
            {isAr ? 'اختر شخصيتك وتابع أوسمتك' : 'Choose Your Character & Badges'}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {isAr
              ? 'لكل شخصية نمط تفكير فريد ورحلة وعي خاصة بها:'
              : 'Each character has a unique thought pattern and inner journey:'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {avatars.map((av) => {
            const isSelected = av.id === currentAvatarId;
            return (
              <button
                key={av.id}
                type="button"
                onClick={() => {
                  soundManager.playSoftTap();
                  onSelectAvatar(av.id);
                }}
                className={`p-3.5 rounded-2xl border-2 text-start transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/80 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${av.color} text-2xl flex items-center justify-center shadow-xs shrink-0`}
                >
                  {av.avatarChar}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                      {av.name}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">
                    {av.title}
                  </span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug line-clamp-2">
                    {av.personality}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Earned Badges Preview */}
        <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 space-y-3 mb-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-stone-800 dark:text-stone-100">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                {isAr
                  ? `أوسمة الإنجاز (${earnedBadges.length}/${BADGES.length})`
                  : `Completion Badges (${earnedBadges.length}/${BADGES.length})`}
              </span>
            </div>
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 font-mono">
              {isAr
                ? `${totalGamesCompleted} ${totalGamesCompleted === 1 ? 'لعبة مكتملة' : 'ألعاب مكتملة'}`
                : `${totalGamesCompleted} completed`}
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {BADGES.map((badge) => {
              const unlocked = earnedSet.has(badge.id);
              return (
                <div
                  key={badge.id}
                  title={
                    isAr
                      ? `${badge.nameAr} — ${unlocked ? 'مكتسب' : `يتطلب ${badge.requiredGames} ألعاب`}`
                      : `${badge.nameEn} — ${unlocked ? 'Unlocked' : `Requires ${badge.requiredGames} games`}`
                  }
                  className={`h-11 rounded-xl flex flex-col items-center justify-center border text-base relative ${
                    unlocked
                      ? `bg-gradient-to-br ${badge.emblemGradient} text-white border-transparent shadow-2xs`
                      : 'bg-stone-100 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-400 grayscale'
                  }`}
                >
                  <span role="img" aria-hidden="true">
                    {badge.icon}
                  </span>
                  {!unlocked && (
                    <Lock className="w-2.5 h-2.5 text-stone-400 absolute bottom-1 end-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {onViewAllBadges ? (
            <button
              type="button"
              onClick={() => {
                soundManager.playSoftTap();
                onViewAllBadges();
              }}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'استعراض جميع الأوسمة' : 'View Full Badges Showcase'}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap"
          >
            {isAr ? 'حفظ وإغلاق' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

