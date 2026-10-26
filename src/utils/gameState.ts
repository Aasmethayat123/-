import { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerStats, AvatarProfile, UserRank, RankProgress, BadgeDefinition } from '../types';
import { soundManager } from './audio';
import { triggerConfetti } from './confetti';
import { getStreakData, recordStreakActivity } from './streakManager';

export const AVATARS: Record<'en' | 'ar', AvatarProfile[]> = {
  ar: [
    {
      id: 'nada',
      name: 'ندى',
      avatarChar: '🌸',
      title: 'الباحثة عن الهدوء',
      personality: 'حساسة، تلتقط أدق التفاصيل في كلام وتصرفات الآخرين.',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'karim',
      name: 'كريم',
      avatarChar: '⚡',
      title: 'المفكر السريع',
      personality: 'عقله يسبق اللحظة، يحلل السيناريوهات بسرعة البرق.',
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'sara',
      name: 'سارة',
      avatarChar: '🌿',
      title: 'المتأملة الواعية',
      personality: 'تميل لملاحظة أنفاسها وتفكيك المواقف بروية ومحبة.',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'omar',
      name: 'عمر',
      avatarChar: '🌊',
      title: 'الهادئ الصامد',
      personality: 'يحاول حماية كبريائه بالصمت، ويتعلم كيف يعبر بصدق.',
      color: 'from-sky-400 to-blue-500'
    }
  ],
  en: [
    {
      id: 'nada',
      name: 'Nada',
      avatarChar: '🌸',
      title: 'The Sensitive Empath',
      personality: 'Highly perceptive to subtleties, prone to over-analyzing social tones.',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'karim',
      name: 'Karim',
      avatarChar: '⚡',
      title: 'The Fast Thinker',
      personality: 'Analytical and quick, prone to immediate catastrophic projections.',
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'sara',
      name: 'Sara',
      avatarChar: '🌿',
      title: 'The Mindful Observer',
      personality: 'Cultivates the pause, keen on reality-testing automatic assumptions.',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'omar',
      name: 'Omar',
      avatarChar: '🌊',
      title: 'The Steady Anchor',
      personality: 'Often guards vulnerability with a calm exterior; practicing authentic expression.',
      color: 'from-sky-400 to-blue-500'
    }
  ]
};

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first_step',
    requiredGames: 1,
    icon: '🌱',
    nameAr: 'الخطوة الأولى',
    nameEn: 'First Mindful Step',
    descriptionAr: 'إتمام أول تجربة نفسية تفاعلية وبدء رحلة مراقبة الأفكار والمشاعر بوعي.',
    descriptionEn: 'Completed your very first interactive game and began your mindful awareness journey.',
    tier: 'bronze',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
    badgeText: 'text-amber-800 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/70',
    emblemGradient: 'from-amber-400 to-orange-500'
  },
  {
    id: 'insight_explorer',
    requiredGames: 3,
    icon: '🧭',
    nameAr: 'مستكشف البصيرة',
    nameEn: 'Insight Explorer',
    descriptionAr: 'إتمام ٣ ألعاب تفاعلية واكتشاف زوايا أعمق لفهم الذات وفصل الحقائق عن الظنون.',
    descriptionEn: 'Completed 3 interactive games exploring new angles of thought and emotion.',
    tier: 'silver',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/50',
    badgeText: 'text-sky-800 dark:text-sky-300',
    badgeBorder: 'border-sky-200 dark:border-sky-800/70',
    emblemGradient: 'from-sky-400 to-cyan-600'
  },
  {
    id: 'balance_practitioner',
    requiredGames: 5,
    icon: '🌿',
    nameAr: 'ممارس التوازن',
    nameEn: 'Balance Practitioner',
    descriptionAr: 'إتمام ٥ ألعاب تفاعلية وترسيخ عادة التمهّل الواعي وتنظيم الاستجابة الانفعالية.',
    descriptionEn: 'Completed 5 games cultivating the mindful pause and steady emotional regulation.',
    tier: 'emerald',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800/70',
    emblemGradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'clarity_artisan',
    requiredGames: 10,
    icon: '✨',
    nameAr: 'صانع الصفاء',
    nameEn: 'Clarity Artisan',
    descriptionAr: 'إتمام ١٠ ألعاب تفاعلية وبناء قدرة راسخة على تفكيك الضغوط وترتيب الأولويات بهدوء.',
    descriptionEn: 'Completed 10 games mastering mental decluttering, grounding, and inner clarity.',
    tier: 'gold',
    badgeBg: 'bg-yellow-50 dark:bg-yellow-950/50',
    badgeText: 'text-yellow-800 dark:text-yellow-300',
    badgeBorder: 'border-yellow-300 dark:border-yellow-800/70',
    emblemGradient: 'from-amber-400 to-yellow-600'
  },
  {
    id: 'resilience_guardian',
    requiredGames: 20,
    icon: '🛡️',
    nameAr: 'حارس المرونة النفسية',
    nameEn: 'Resilience Guardian',
    descriptionAr: 'إتمام ٢٠ لعبة تفاعلية وتشكيل درع متزن من الحدود الصحية والتعاطف الصادق مع النفس.',
    descriptionEn: 'Completed 20 games forging healthy boundaries and compassionate psychological resilience.',
    tier: 'amethyst',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/50',
    badgeText: 'text-purple-800 dark:text-purple-300',
    badgeBorder: 'border-purple-200 dark:border-purple-800/70',
    emblemGradient: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'nesma_laureate',
    requiredGames: 36,
    icon: '👑',
    nameAr: 'تاج نسمة حياة',
    nameEn: 'Nesma Hayat Laureate',
    descriptionAr: 'إتمام ٣٦ لعبة كاملة والوصول إلى ذروة التناغم، البصيرة، والسيادة العاطفية.',
    descriptionEn: 'Completed 36 games achieving the full Nesma Hayat pinnacle of emotional sovereignty.',
    tier: 'crown',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/50',
    badgeText: 'text-rose-800 dark:text-rose-300',
    badgeBorder: 'border-rose-300 dark:border-rose-800/70',
    emblemGradient: 'from-rose-500 to-amber-500'
  }
];

export function getEarnedBadges(badgeIds: string[]): BadgeDefinition[] {
  const normalized = new Set(badgeIds);
  if (normalized.has('first_loop')) normalized.add('first_step');
  if (normalized.has('journey_master')) normalized.add('insight_explorer');
  return BADGES.filter((b) => normalized.has(b.id));
}

export function getNextBadgeProgress(totalGamesCompleted: number): {
  nextBadge: BadgeDefinition | null;
  remainingGames: number;
  progressPercent: number;
} {
  const nextBadge = BADGES.find((b) => totalGamesCompleted < b.requiredGames) || null;
  if (!nextBadge) {
    return {
      nextBadge: null,
      remainingGames: 0,
      progressPercent: 100
    };
  }

  const nextIdx = BADGES.findIndex((b) => b.id === nextBadge.id);
  const prevThreshold = nextIdx > 0 ? BADGES[nextIdx - 1].requiredGames : 0;
  const span = Math.max(1, nextBadge.requiredGames - prevThreshold);
  const gained = Math.max(0, totalGamesCompleted - prevThreshold);
  const progressPercent = Math.min(100, Math.max(0, Math.round((gained / span) * 100)));

  return {
    nextBadge,
    remainingGames: Math.max(0, nextBadge.requiredGames - totalGamesCompleted),
    progressPercent
  };
}

export const USER_RANKS: UserRank[] = [
  {
    level: 1,
    id: 'novice',
    nameAr: 'مبتدئ السكينة',
    nameEn: 'Peace Novice',
    minXP: 0,
    nextXP: 150,
    icon: '🌱',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/70',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    descriptionAr: 'بداية بذور الوعي الذاتي وملاحظة الأنفاس والأفكار.',
    descriptionEn: 'The initial seeds of self-awareness and mindful pause.'
  },
  {
    level: 2,
    id: 'explorer',
    nameAr: 'مستكشف الهدوء',
    nameEn: 'Calm Explorer',
    minXP: 150,
    nextXP: 350,
    icon: '🧭',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/70',
    badgeText: 'text-teal-700 dark:text-teal-300',
    badgeBorder: 'border-teal-200 dark:border-teal-800',
    descriptionAr: 'استكشاف دائرة السيطرة وفك تشابك المشاعر.',
    descriptionEn: 'Exploring circles of control and emotional clarity.'
  },
  {
    level: 3,
    id: 'seeker',
    nameAr: 'ساعٍ للوعي',
    nameEn: 'Mindful Seeker',
    minXP: 350,
    nextXP: 650,
    icon: '✨',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/70',
    badgeText: 'text-sky-700 dark:text-sky-300',
    badgeBorder: 'border-sky-200 dark:border-sky-800',
    descriptionAr: 'إعادة صياغة الصوت الداخلي وتفكيك الضغوط خطوة بخطوة.',
    descriptionEn: 'Reframing the inner critic and breaking mountain pressures.'
  },
  {
    level: 4,
    id: 'practitioner',
    nameAr: 'ممارس متزن',
    nameEn: 'Balanced Adept',
    minXP: 650,
    nextXP: 1100,
    icon: '🌿',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/70',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    descriptionAr: 'تطبيق يومي راسخ للحدود النفسية والترتيب الداخلي.',
    descriptionEn: 'Grounded daily application of psychological boundaries.'
  },
  {
    level: 5,
    id: 'guide',
    nameAr: 'مرشد متأمل',
    nameEn: 'Serene Guide',
    minXP: 1100,
    nextXP: 1700,
    icon: '🕯️',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/70',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800',
    descriptionAr: 'بصيرة عميقة ونقاء في فرز المشاعر وإكسير الحكمة.',
    descriptionEn: 'Deep insight and clear emotional granularity.'
  },
  {
    level: 6,
    id: 'sage',
    nameAr: 'حكيم البصيرة',
    nameEn: 'Insightful Sage',
    minXP: 1700,
    nextXP: 2500,
    icon: '🔮',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/70',
    badgeText: 'text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-200 dark:border-purple-800',
    descriptionAr: 'تدفق نفسي عالٍ وتوازن صلب كأحجار الزن الصامتة.',
    descriptionEn: 'High flow state and unbreakable inner equilibrium.'
  },
  {
    level: 7,
    id: 'master',
    nameAr: 'ماستر السكينة',
    nameEn: 'Zen Master',
    minXP: 2500,
    nextXP: 5000,
    icon: '👑',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/70',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-300 dark:border-rose-700',
    descriptionAr: 'قمة التحرر النفسي والسيادة العاطفية والسلام التام.',
    descriptionEn: 'Pinnacle of psychological sovereignty and deep peace.'
  }
];

export function getUserRank(xp: number): UserRank {
  for (let i = USER_RANKS.length - 1; i >= 0; i--) {
    if (xp >= USER_RANKS[i].minXP) {
      return USER_RANKS[i];
    }
  }
  return USER_RANKS[0];
}

export function getRankProgress(xp: number): RankProgress {
  const currentRank = getUserRank(xp);
  const nextRank = USER_RANKS.find(r => r.level === currentRank.level + 1) || null;
  
  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      progressPercent: 100,
      xpInLevel: xp - currentRank.minXP,
      xpToNext: 0
    };
  }

  const range = nextRank.minXP - currentRank.minXP;
  const xpInLevel = Math.max(0, xp - currentRank.minXP);
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInLevel / range) * 100)));
  const xpToNext = Math.max(0, nextRank.minXP - xp);

  return {
    currentRank,
    nextRank,
    progressPercent,
    xpInLevel,
    xpToNext
  };
}

const STORAGE_KEY = 'nesma_hayat_game_state_v2';
const STAGE_PROGRESS_PREFIX = 'nesma_game_levels_progression_';
const GAME_COMPLETED_EVENT = 'nesma:game-completed';

let lastStageEmitAt = 0;

export function emitGameCompleted(gameId: string, fallbackXP = 0): void {
  if (typeof window === 'undefined') return;
  lastStageEmitAt = Date.now();
  window.dispatchEvent(
    new CustomEvent<{ gameId: string; fallbackXP: number }>(GAME_COMPLETED_EVENT, {
      detail: { gameId, fallbackXP }
    })
  );
}

export function wasStageCompletionJustEmitted(withinMs = 900): boolean {
  return Date.now() - lastStageEmitAt < withinMs;
}

function computeSeededCompletedGames(levelStars?: Record<string, number>): number {
  let count = Object.keys(levelStars || {}).length;
  if (typeof window === 'undefined') return count;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STAGE_PROGRESS_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.stars && typeof parsed.stars === 'object') {
            count += Object.keys(parsed.stars).length;
          }
        }
      }
    }
  } catch {
    // ignore storage read errors
  }
  return count;
}

function syncBadgesForCount(existingBadges: string[], totalCompleted: number): string[] {
  const badgeSet = new Set<string>();
  for (const id of existingBadges) {
    if (id === 'first_loop') {
      badgeSet.add('first_step');
    } else if (id === 'journey_master') {
      badgeSet.add('insight_explorer');
    } else {
      badgeSet.add(id);
    }
  }
  for (const badge of BADGES) {
    if (totalCompleted >= badge.requiredGames) {
      badgeSet.add(badge.id);
    }
  }
  return Array.from(badgeSet);
}

const defaultStats: PlayerStats = {
  xp: 0,
  gems: 0,
  levelStars: {},
  streak: 0,
  badges: [],
  totalGamesCompleted: 0,
  avatarId: 'sara',
  rankId: 'novice'
};

export function useGameState() {
  const [stats, setStats] = useState<PlayerStats>(() => {
    const currentStreakCount = typeof window !== 'undefined' ? getStreakData().currentStreak : 0;
    if (typeof window === 'undefined') return { ...defaultStats, streak: currentStreakCount };
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const seededCount = computeSeededCompletedGames(parsed.levelStars);
        const totalGamesCompleted =
          typeof parsed.totalGamesCompleted === 'number'
            ? Math.max(parsed.totalGamesCompleted, seededCount)
            : seededCount;
        const rawBadges = Array.isArray(parsed.badges) ? parsed.badges : [];
        const badges = syncBadgesForCount(rawBadges, totalGamesCompleted);

        return {
          ...defaultStats,
          ...parsed,
          badges,
          totalGamesCompleted,
          streak: currentStreakCount
        };
      }
    } catch {
      // fallback
    }
    const seededCount = computeSeededCompletedGames({});
    return {
      ...defaultStats,
      totalGamesCompleted: seededCount,
      badges: syncBadgesForCount([], seededCount),
      streak: currentStreakCount
    };
  });

  const [celebrationQueue, setCelebrationQueue] = useState<BadgeDefinition[]>([]);
  const lastCelebratedIdRef = useRef<string | null>(null);

  const rankProgress = getRankProgress(stats.xp);
  const currentRank = rankProgress.currentRank;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...stats,
        rankId: currentRank.id
      }));
    } catch {
      // ignore
    }
  }, [stats, currentRank]);

  const triggerBadgeCelebration = useCallback((unlockedBadges: BadgeDefinition[]) => {
    if (unlockedBadges.length === 0) return;

    const latestId = unlockedBadges[unlockedBadges.length - 1].id;
    if (lastCelebratedIdRef.current !== latestId) {
      lastCelebratedIdRef.current = latestId;
      soundManager.playLevelUpFanfare();
      triggerConfetti(0.5, 0.35);
      setTimeout(() => triggerConfetti(0.28, 0.45), 260);
      setTimeout(() => triggerConfetti(0.72, 0.45), 440);
    }

    setCelebrationQueue((prev) => {
      const existingIds = new Set(prev.map((b) => b.id));
      const toAdd = unlockedBadges.filter((b) => !existingIds.has(b.id));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
  }, []);

  const addXP = useCallback((amount: number, showSparkles = true) => {
    setStats((prev) => {
      const oldRank = getUserRank(prev.xp);
      const newXP = prev.xp + amount;
      const newRank = getUserRank(newXP);
      const newGems = Math.floor(newXP / 100);

      if (newRank.level > oldRank.level) {
        soundManager.playLevelUpFanfare();
        triggerConfetti(0.5, 0.4);
      } else {
        soundManager.playCoinSound();
        if (showSparkles) {
          triggerConfetti(0.5, 0.3);
        }
      }

      return {
        ...prev,
        xp: newXP,
        gems: Math.max(prev.gems, newGems),
        rankId: newRank.id
      };
    });
  }, []);

  const recordGameCompletion = useCallback(
    (_gameId?: string, xpReward = 0, showSparkles = true) => {
      setStats((prev) => {
        const nextTotalGames = (prev.totalGamesCompleted || 0) + 1;
        const currentBadgeSet = new Set(prev.badges || []);
        const newlyEarned: BadgeDefinition[] = [];

        for (const badge of BADGES) {
          if (nextTotalGames >= badge.requiredGames && !currentBadgeSet.has(badge.id)) {
            currentBadgeSet.add(badge.id);
            newlyEarned.push(badge);
          }
        }

        const oldRank = getUserRank(prev.xp);
        const newXP = prev.xp + Math.max(0, xpReward);
        const newRank = getUserRank(newXP);
        const newGems = Math.floor(newXP / 100);

        if (newlyEarned.length > 0) {
          setTimeout(() => triggerBadgeCelebration(newlyEarned), 0);
        } else if (xpReward > 0) {
          if (newRank.level > oldRank.level) {
            soundManager.playLevelUpFanfare();
            triggerConfetti(0.5, 0.4);
          } else {
            soundManager.playCoinSound();
            if (showSparkles) {
              triggerConfetti(0.5, 0.3);
            }
          }
        }

        return {
          ...prev,
          xp: newXP,
          gems: Math.max(prev.gems, newGems),
          totalGamesCompleted: nextTotalGames,
          badges: Array.from(currentBadgeSet),
          rankId: newRank.id
        };
      });
    },
    [triggerBadgeCelebration]
  );

  // Listen to stage completions emitted from gameLevelsManager
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStageCompleted = (e: Event) => {
      const custom = e as CustomEvent<{ gameId: string; fallbackXP: number }>;
      const fallbackXP = custom.detail?.fallbackXP || 0;
      recordGameCompletion(custom.detail?.gameId, fallbackXP, false);
    };
    window.addEventListener(GAME_COMPLETED_EVENT, handleStageCompleted);
    return () => window.removeEventListener(GAME_COMPLETED_EVENT, handleStageCompleted);
  }, [recordGameCompletion]);

  const recordLevelCompletion = useCallback(
    (levelId: string, stars: number) => {
      const streakResult = recordStreakActivity('level_completed');

      setStats((prev) => {
        const currentStars = prev.levelStars[levelId] || 0;
        const bestStars = Math.max(currentStars, stars);
        const newStars = { ...prev.levelStars, [levelId]: bestStars };
        const nextTotalGames = (prev.totalGamesCompleted || 0) + 1;

        const currentBadgeSet = new Set(prev.badges || []);
        const newlyEarned: BadgeDefinition[] = [];

        for (const badge of BADGES) {
          if (nextTotalGames >= badge.requiredGames && !currentBadgeSet.has(badge.id)) {
            currentBadgeSet.add(badge.id);
            newlyEarned.push(badge);
          }
        }

        const addedXP = stars * 50 + (streakResult.isFirstToday ? streakResult.xpAwarded : 0);
        const newXP = prev.xp + addedXP;
        const newRank = getUserRank(newXP);

        if (newlyEarned.length > 0) {
          setTimeout(() => triggerBadgeCelebration(newlyEarned), 0);
        } else {
          soundManager.playLevelUpFanfare();
          triggerConfetti(0.5, 0.4);
        }

        return {
          ...prev,
          xp: newXP,
          gems: Math.max(prev.gems, Math.floor(newXP / 100)),
          streak: streakResult.streak,
          levelStars: newStars,
          totalGamesCompleted: nextTotalGames,
          badges: Array.from(currentBadgeSet),
          rankId: newRank.id
        };
      });
    },
    [triggerBadgeCelebration]
  );

  const setAvatar = useCallback((avatarId: string) => {
    soundManager.playSoftTap();
    setStats((prev) => ({ ...prev, avatarId }));
  }, []);

  const dismissCelebrationBadge = useCallback(() => {
    soundManager.playSoftTap();
    setCelebrationQueue((prev) => prev.slice(1));
  }, []);

  return {
    stats,
    addXP,
    recordGameCompletion,
    recordLevelCompletion,
    setAvatar,
    currentRank,
    rankProgress,
    activeCelebrationBadge: celebrationQueue[0] || null,
    dismissCelebrationBadge
  };
}

