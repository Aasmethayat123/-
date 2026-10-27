import React, { useState } from 'react';
import { Trophy, ChevronDown, Award, X, Sparkles } from 'lucide-react';
import { Language, UserRank, RankProgress } from '../types';
import { USER_RANKS, BADGES, getEarnedBadges, getUserRank, getRankProgress } from '../utils/gameState';
import { soundManager } from '../utils/audio';

interface RankHeaderBadgeProps {
  language: Language;
  playerXP: number;
  userRank?: UserRank;
  rankProgress?: RankProgress;
  earnedBadgeIds?: string[];
  totalGamesCompleted?: number;
  onOpenProfile?: () => void;
}

export const RankHeaderBadge: React.FC<RankHeaderBadgeProps> = ({
  language,
  playerXP,
  userRank,
  rankProgress,
  earnedBadgeIds = [],
  totalGamesCompleted = 0,
  onOpenProfile
}) => {
  const isAr = language === 'ar';
  const [isOpen, setIsOpen] = useState(false);

  // Fallbacks if not passed directly
  const activeRank = userRank || getUserRank(playerXP);
  const activeProgress = rankProgress || getRankProgress(playerXP);
  const earnedBadges = getEarnedBadges(earnedBadgeIds);
  const earnedSet = new Set(earnedBadges.map((b) => b.id));

  const nextRank = activeProgress.nextRank;

  return (
    <div className="relative inline-block">
      {/* Badge Button in Header */}
      <button
        onClick={() => {
          soundManager.playSoftTap();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border transition-all cursor-pointer shadow-2xs hover:scale-102 ${activeRank.badgeBg} ${activeRank.badgeBorder} ${activeRank.badgeText}`}
        title={isAr ? `رتبتك الحالية: ${activeRank.nameAr} (${playerXP} XP)` : `Current Rank: ${activeRank.nameEn} (${playerXP} XP)`}
      >
        <span className="text-sm leading-none">{activeRank.icon}</span>
        
        <div className="flex items-center gap-1">
          <span className="text-xs font-black tracking-tight hidden sm:inline">
            {isAr ? activeRank.nameAr : activeRank.nameEn}
          </span>
          <span className="text-xs font-black tracking-tight sm:hidden">
            {isAr ? activeRank.nameAr.split(' ')[0] : activeRank.nameEn.split(' ')[0]}
          </span>
          
          <span className="text-[10px] font-mono font-bold opacity-80 px-1 py-0.2 rounded-md bg-black/5 dark:bg-white/10">
            {playerXP} XP
          </span>
        </div>

        <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Interactive Popover / Modal of Ranks */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-x-3 top-24 sm:absolute sm:inset-x-auto sm:top-auto sm:end-0 sm:mt-2 sm:w-92 p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl z-50 animate-scale-up space-y-3.5 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-stone-900 dark:text-stone-100 font-serif">
                    {isAr ? 'نظام الرتب ومستويات الوعي' : 'Awareness Rank System'}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {isAr ? `إجمالي النقاط: ${playerXP} XP` : `Total XP: ${playerXP}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active Rank Card */}
            <div className={`p-3.5 rounded-2xl border ${activeRank.badgeBg} ${activeRank.badgeBorder} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeRank.icon}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-stone-900 dark:text-stone-100">
                        {isAr ? activeRank.nameAr : activeRank.nameEn}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-stone-900 text-white dark:bg-white dark:text-stone-900">
                        {isAr ? `المستوى ${activeRank.level}` : `Lvl ${activeRank.level}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5 leading-snug">
                      {isAr ? activeRank.descriptionAr : activeRank.descriptionEn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress to Next Rank */}
              {nextRank ? (
                <div className="space-y-1.5 pt-1 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-stone-600 dark:text-stone-300">
                      {isAr ? `الرتبة القادمة: ${nextRank.nameAr}` : `Next Rank: ${nextRank.nameEn}`}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-mono">
                      {activeProgress.progressPercent}% ({isAr ? `متبقي ${activeProgress.xpToNext} XP` : `${activeProgress.xpToNext} XP left`})
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${activeProgress.progressPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? '🎉 وصلت إلى أعلى رتب السكينة والوعي!' : '🎉 Reached Pinnacle Master Rank!'}</span>
                </div>
              )}
            </div>

            {/* All Ranks Ladder Preview */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-stone-400 block px-1">
                {isAr ? 'سلم مستويات الوعي السبعة:' : 'The 7 Awareness Tiers:'}
              </span>

              <div className="max-h-48 overflow-y-auto space-y-1 pe-1">
                {USER_RANKS.map((r) => {
                  const isCurrent = r.level === activeRank.level;
                  const isUnlocked = playerXP >= r.minXP;

                  return (
                    <div
                      key={r.id}
                      className={`p-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-amber-500/10 border border-amber-400/80 font-bold dark:bg-amber-950/40 text-stone-900 dark:text-stone-100'
                          : isUnlocked
                          ? 'bg-stone-50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300'
                          : 'opacity-40 bg-stone-50/50 dark:bg-stone-850/50 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{r.icon}</span>
                        <div>
                          <span className="font-bold block">
                            {isAr ? r.nameAr : r.nameEn}
                          </span>
                          <span className="text-[9px] text-stone-400 font-mono">
                            {r.minXP} XP
                          </span>
                        </div>
                      </div>

                      <div>
                        {isCurrent ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                            {isAr ? 'رتبتك الحالية' : 'Current'}
                          </span>
                        ) : isUnlocked ? (
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ {isAr ? 'مكتمل' : 'Unlocked'}
                          </span>
                        ) : (
                          <span className="text-[9px] text-stone-400">
                            🔒 {r.minXP} XP
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Earned Completion Badges Strip */}
            <div className="pt-2.5 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-700 dark:text-stone-200">
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    {isAr
                      ? `أوسمة الألعاب (${earnedBadges.length}/${BADGES.length})`
                      : `Badges (${earnedBadges.length}/${BADGES.length})`}
                  </span>
                </span>
                <span className="text-[10px] font-mono font-bold text-stone-400">
                  {isAr ? `${totalGamesCompleted} مكتملة` : `${totalGamesCompleted} done`}
                </span>
              </div>

              <div className="grid grid-cols-6 gap-1.5">
                {BADGES.map((badge) => {
                  const unlocked = earnedSet.has(badge.id);
                  return (
                    <div
                      key={badge.id}
                      title={isAr ? badge.nameAr : badge.nameEn}
                      className={`h-9 rounded-xl flex items-center justify-center text-sm border ${
                        unlocked
                          ? `bg-gradient-to-br ${badge.emblemGradient} text-white border-transparent`
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 opacity-45 grayscale'
                      }`}
                    >
                      <span role="img" aria-hidden="true">
                        {badge.icon}
                      </span>
                    </div>
                  );
                })}
              </div>

              {onOpenProfile && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playSoftTap();
                    setIsOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isAr ? 'فتح ملفي وجميع الأوسمة ←' : 'Open Profile & All Badges →'}
                </button>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};
