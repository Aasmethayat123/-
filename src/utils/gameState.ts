import { useState, useEffect } from 'react';
import { PlayerStats, AvatarProfile, UserRank, RankProgress } from '../types';
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

const defaultStats: PlayerStats = {
  xp: 0,
  gems: 0,
  levelStars: {},
  streak: 0,
  badges: [],
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
        return {
          ...parsed,
          streak: currentStreakCount
        };
      }
    } catch {
      // fallback
    }
    return { ...defaultStats, streak: currentStreakCount };
  });

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

  const addXP = (amount: number, showSparkles = true) => {
    setStats((prev) => {
      const oldRank = getUserRank(prev.xp);
      const newXP = prev.xp + amount;
      const newRank = getUserRank(newXP);
      const newGems = Math.floor(newXP / 100);

      // Check if player earned a new rank!
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
  };

  const recordLevelCompletion = (levelId: string, stars: number) => {
    const streakResult = recordStreakActivity('level_completed');

    setStats((prev) => {
      const currentStars = prev.levelStars[levelId] || 0;
      const bestStars = Math.max(currentStars, stars);
      const newStars = { ...prev.levelStars, [levelId]: bestStars };
      
      const newBadges = [...prev.badges];
      if (!newBadges.includes('first_loop')) newBadges.push('first_loop');
      if (Object.keys(newStars).length >= 3 && !newBadges.includes('journey_master')) {
        newBadges.push('journey_master');
      }

      const addedXP = stars * 50 + (streakResult.isFirstToday ? streakResult.xpAwarded : 0);
      const newXP = prev.xp + addedXP;
      const oldRank = getUserRank(prev.xp);
      const newRank = getUserRank(newXP);

      if (newRank.level > oldRank.level) {
        soundManager.playLevelUpFanfare();
        triggerConfetti(0.5, 0.4);
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
        badges: newBadges,
        rankId: newRank.id
      };
    });
  };

  const setAvatar = (avatarId: string) => {
    soundManager.playSoftTap();
    setStats((prev) => ({ ...prev, avatarId }));
  };

  return {
    stats,
    addXP,
    recordLevelCompletion,
    setAvatar,
    currentRank,
    rankProgress
  };
}
