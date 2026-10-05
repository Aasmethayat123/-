import { useState, useEffect, useCallback } from 'react';
import { PlayerStats, AvatarProfile } from '../types';
import { soundManager } from './audio';
import { triggerConfetti } from './confetti';

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

const STORAGE_KEY = 'nesma_hayat_game_state_v1';

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getDaysDifference(todayStr: string, pastStr: string): number {
  try {
    const d1 = new Date(todayStr + 'T00:00:00');
    const d2 = new Date(pastStr + 'T00:00:00');
    const diffTime = d1.getTime() - d2.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 999;
  }
}

export interface StreakNotification {
  type: 'app_open' | 'game_complete';
  streak: number;
  bonusXP: number;
  message: string;
}

const defaultStats: PlayerStats = {
  xp: 120,
  gems: 3,
  levelStars: {
    'unread-message': 3
  },
  streak: 1,
  lastActiveDate: getTodayDateString(),
  lastGameCompletedDate: '',
  streakBonusClaimedToday: false,
  badges: ['welcome'],
  avatarId: 'sara'
};

export function useGameState() {
  const [streakNotification, setStreakNotification] = useState<StreakNotification | null>(null);

  const [stats, setStats] = useState<PlayerStats>(() => {
    if (typeof window === 'undefined') return defaultStats;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultStats,
          ...parsed
        };
      }
    } catch {
      // fallback
    }
    return defaultStats;
  });

  // Daily App Open Check
  useEffect(() => {
    const today = getTodayDateString();
    
    setStats((prev) => {
      // Check if this is a new day opening the app
      if (prev.lastActiveDate !== today) {
        let currentStreak = prev.streak || 0;
        
        // Check if user completed a game yesterday
        if (prev.lastGameCompletedDate) {
          const daysSinceGame = getDaysDifference(today, prev.lastGameCompletedDate);
          if (daysSinceGame > 1) {
            // Missed a day or more: streak breaks to 0 until today's game is completed
            currentStreak = 0;
          }
        } else {
          currentStreak = 0;
        }

        const appOpenBonusXP = 20;
        const newXP = prev.xp + appOpenBonusXP;

        // Show subtle welcome daily reward toast
        setTimeout(() => {
          soundManager.playCoinSound();
          setStreakNotification({
            type: 'app_open',
            streak: currentStreak,
            bonusXP: appOpenBonusXP,
            message: `مرحباً بعودتك! كسبت +${appOpenBonusXP} XP لفتح التطبيق اليوم.`
          });
        }, 800);

        return {
          ...prev,
          xp: newXP,
          streak: currentStreak,
          lastActiveDate: today,
          streakBonusClaimedToday: false
        };
      }
      return prev;
    });
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Main daily game completion & streak calculation logic
  const recordDailyGameCompletion = useCallback((gameBonusXP = 0): number => {
    const today = getTodayDateString();
    let earnedStreakBonus = 0;

    setStats((prev) => {
      // Check if user already completed their first game of the day today
      if (prev.lastGameCompletedDate === today && prev.streakBonusClaimedToday) {
        // Already recorded streak for today, just add standard game XP
        return {
          ...prev,
          xp: prev.xp + gameBonusXP
        };
      }

      // Calculate new streak
      let newStreak = 1;
      if (prev.lastGameCompletedDate) {
        const daysDiff = getDaysDifference(today, prev.lastGameCompletedDate);
        if (daysDiff === 1) {
          // Completed yesterday: continue the streak!
          newStreak = (prev.streak || 0) + 1;
        } else if (daysDiff === 0) {
          // Same day (first time claiming streak bonus today)
          newStreak = Math.max(1, prev.streak || 1);
        } else {
          // Broken streak, restart at 1
          newStreak = 1;
        }
      }

      // Calculate streak XP reward: base 50 XP + 10 XP per consecutive day (capped at 150 bonus)
      const streakBonusXP = 50 + Math.min(100, (newStreak - 1) * 10);
      earnedStreakBonus = streakBonusXP;
      const totalEarnedXP = gameBonusXP + streakBonusXP;
      const newTotalXP = prev.xp + totalEarnedXP;
      const newGems = Math.floor(newTotalXP / 100);

      // Trigger celebration
      setTimeout(() => {
        soundManager.playLevelUpFanfare();
        triggerConfetti(0.5, 0.4);
        setStreakNotification({
          type: 'game_complete',
          streak: newStreak,
          bonusXP: streakBonusXP,
          message: `🔥 تتابع يومي: ${newStreak} ${newStreak === 1 ? 'يوم' : 'أيام متتالية'}! كسبت +${streakBonusXP} XP إضافية!`
        });
      }, 300);

      return {
        ...prev,
        xp: newTotalXP,
        gems: Math.max(prev.gems, newGems),
        streak: newStreak,
        lastActiveDate: today,
        lastGameCompletedDate: today,
        streakBonusClaimedToday: true
      };
    });

    return earnedStreakBonus;
  }, []);

  const addXP = useCallback((amount: number, showSparkles = true, isGameCompleted = true) => {
    if (isGameCompleted) {
      recordDailyGameCompletion(amount);
    } else {
      setStats((prev) => {
        const newXP = prev.xp + amount;
        const newGems = Math.floor(newXP / 100);
        return {
          ...prev,
          xp: newXP,
          gems: Math.max(prev.gems, newGems)
        };
      });
      soundManager.playCoinSound();
      if (showSparkles) {
        triggerConfetti(0.5, 0.3);
      }
    }
  }, [recordDailyGameCompletion]);

  const recordLevelCompletion = useCallback((levelId: string, stars: number) => {
    const today = getTodayDateString();
    
    setStats((prev) => {
      const currentStars = prev.levelStars[levelId] || 0;
      const bestStars = Math.max(currentStars, stars);
      const newStars = { ...prev.levelStars, [levelId]: bestStars };
      
      const newBadges = [...prev.badges];
      if (!newBadges.includes('first_loop')) newBadges.push('first_loop');
      if (Object.keys(newStars).length >= 3 && !newBadges.includes('journey_master')) {
        newBadges.push('journey_master');
      }

      // Check streak
      let newStreak = prev.streak || 1;
      let streakBonus = 0;
      if (prev.lastGameCompletedDate !== today || !prev.streakBonusClaimedToday) {
        if (prev.lastGameCompletedDate) {
          const daysDiff = getDaysDifference(today, prev.lastGameCompletedDate);
          if (daysDiff === 1) newStreak += 1;
          else if (daysDiff > 1) newStreak = 1;
        } else {
          newStreak = 1;
        }
        streakBonus = 50 + Math.min(100, (newStreak - 1) * 10);
      }

      const totalXP = prev.xp + stars * 50 + streakBonus;

      if (streakBonus > 0) {
        setTimeout(() => {
          setStreakNotification({
            type: 'game_complete',
            streak: newStreak,
            bonusXP: streakBonus,
            message: `🔥 تتابع يومي: ${newStreak} أيام متتالية! كسبت +${streakBonus} XP إضافية!`
          });
        }, 400);
      }

      return {
        ...prev,
        xp: totalXP,
        levelStars: newStars,
        streak: newStreak,
        lastActiveDate: today,
        lastGameCompletedDate: today,
        streakBonusClaimedToday: true,
        badges: newBadges
      };
    });

    soundManager.playLevelUpFanfare();
    triggerConfetti(0.5, 0.4);
  }, []);

  const setAvatar = useCallback((avatarId: string) => {
    soundManager.playSoftTap();
    setStats((prev) => ({ ...prev, avatarId }));
  }, []);

  const dismissStreakNotification = useCallback(() => {
    setStreakNotification(null);
  }, []);

  const isGameCompletedToday = stats.lastGameCompletedDate === getTodayDateString() && !!stats.streakBonusClaimedToday;

  return {
    stats,
    addXP,
    recordLevelCompletion,
    recordDailyGameCompletion,
    setAvatar,
    streakNotification,
    dismissStreakNotification,
    isGameCompletedToday
  };
}
