import { useState, useEffect } from 'react';
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

const STORAGE_KEY = 'nesma_hayat_game_state_v2';

const defaultStats: PlayerStats = {
  xp: 0,
  gems: 0,
  levelStars: {},
  streak: 0,
  badges: [],
  avatarId: 'sara'
};

export function useGameState() {
  const [stats, setStats] = useState<PlayerStats>(() => {
    if (typeof window === 'undefined') return defaultStats;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return defaultStats;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  const addXP = (amount: number, showSparkles = true) => {
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
  };

  const recordLevelCompletion = (levelId: string, stars: number) => {
    setStats((prev) => {
      const currentStars = prev.levelStars[levelId] || 0;
      const bestStars = Math.max(currentStars, stars);
      const newStars = { ...prev.levelStars, [levelId]: bestStars };
      
      const newBadges = [...prev.badges];
      if (!newBadges.includes('first_loop')) newBadges.push('first_loop');
      if (Object.keys(newStars).length >= 3 && !newBadges.includes('journey_master')) {
        newBadges.push('journey_master');
      }

      return {
        ...prev,
        xp: prev.xp + stars * 50,
        levelStars: newStars,
        badges: newBadges
      };
    });
    soundManager.playLevelUpFanfare();
    triggerConfetti(0.5, 0.4);
  };

  const setAvatar = (avatarId: string) => {
    soundManager.playSoftTap();
    setStats((prev) => ({ ...prev, avatarId }));
  };

  return {
    stats,
    addXP,
    recordLevelCompletion,
    setAvatar
  };
}
