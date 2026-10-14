import { useState, useEffect } from 'react';
import { soundManager } from './audio';
import { triggerConfetti } from './confetti';

export interface StreakMilestone {
  days: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  rewardXP: number;
  unlocked: boolean;
}

export interface StreakLevelInfo {
  tier: number;
  nameAr: string;
  nameEn: string;
  flameColor: string; // Tailwind gradient / color string
  flameGlow: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // 'YYYY-MM-DD'
  activeDates: string[]; // unique sorted 'YYYY-MM-DD'
  totalActiveDays: number;
  todayCompleted: boolean;
  isPendingToday: boolean;
  level: StreakLevelInfo;
  milestones: StreakMilestone[];
  lastCheckInTimestamp?: number;
}

const STREAK_STORAGE_KEY = 'nesma_hayat_streak_v1';
const STREAK_EVENT_NAME = 'nesma_streak_updated';

// Format Date to YYYY-MM-DD in local time
export function formatLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calculate previous calendar day string YYYY-MM-DD
export function getYesterdayDateString(todayStr: string = formatLocalDate()): string {
  const parts = todayStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  d.setDate(d.getDate() - 1);
  return formatLocalDate(d);
}

// All milestone thresholds
export const ALL_MILESTONES: Omit<StreakMilestone, 'unlocked'>[] = [
  {
    days: 1,
    titleAr: 'أول حضور واعي',
    titleEn: 'First Mindful Step',
    descriptionAr: 'بداية رحلة الحضور وتخصيص دقيقة لنفسك',
    descriptionEn: 'Beginning the journey of presence and self-care',
    rewardXP: 30
  },
  {
    days: 3,
    titleAr: 'شرارة الاستمرارية',
    titleEn: 'Consistency Spark',
    descriptionAr: 'ثلاثة أيام متتالية من الوعي والترويض الذهني',
    descriptionEn: 'Three consecutive days of mental balance',
    rewardXP: 60
  },
  {
    days: 7,
    titleAr: 'شعلة الأسبوع الذهبي',
    titleEn: 'Golden Week Flame',
    descriptionAr: 'أسبوع كامل من الحفاظ على هدوئك وتأملك',
    descriptionEn: 'A full week of mindful reflection and resilience',
    rewardXP: 150
  },
  {
    days: 14,
    titleAr: 'رسوخ العادة الواعية',
    titleEn: 'Rooted Habit',
    descriptionAr: 'أسبوعان من التحرر المعرفي والوعي النفسي العميق',
    descriptionEn: 'Two solid weeks of cognitive reframing habits',
    rewardXP: 300
  },
  {
    days: 30,
    titleAr: 'منارة السلام الداخلي',
    titleEn: 'Beacon of Inner Peace',
    descriptionAr: 'شهر كامل من الثبات والنمو الوجداني المستمر',
    descriptionEn: 'A full month of grounded emotional mastery',
    rewardXP: 600
  },
  {
    days: 60,
    titleAr: 'عمق الإدراك والتوازن',
    titleEn: 'Pillar of Balance',
    descriptionAr: 'شهران من الحكمة اليومية والتناغم الداخلي',
    descriptionEn: 'Two months of unwavering centered awareness',
    rewardXP: 1000
  },
  {
    days: 100,
    titleAr: 'سراج الحكمة الدائم',
    titleEn: 'Everlasting Light',
    descriptionAr: 'مئة يوم من الاستنارة وسلام القلب والعقل',
    descriptionEn: 'One hundred days of radiant mindful living',
    rewardXP: 2000
  }
];

// Determine Streak Visual Level based on current streak days
export function getStreakLevel(days: number): StreakLevelInfo {
  if (days >= 30) {
    return {
      tier: 5,
      nameAr: 'سراج الحكمة الدائم',
      nameEn: 'Everlasting Beacon',
      flameColor: 'from-amber-400 via-rose-500 to-purple-600',
      flameGlow: 'shadow-[0_0_20px_rgba(244,63,94,0.6)]',
      descriptionAr: 'طاقة حضور راسخة أصبحت جزءاً لا يتجزأ من حياتك',
      descriptionEn: 'A radiant presence anchored into your daily essence'
    };
  }
  if (days >= 14) {
    return {
      tier: 4,
      nameAr: 'لهب الصمود الراسخ',
      nameEn: 'Resilience Blaze',
      flameColor: 'from-amber-400 via-orange-500 to-rose-500',
      flameGlow: 'shadow-[0_0_16px_rgba(249,115,22,0.5)]',
      descriptionAr: 'عادة راسخة تحميك من زوابع التوتر والأفكار التلقائية',
      descriptionEn: 'A steadfast habit shielding your inner calm'
    };
  }
  if (days >= 7) {
    return {
      tier: 3,
      nameAr: 'شعلة الأسبوع المتقدة',
      nameEn: 'Weekly Flame',
      flameColor: 'from-yellow-400 via-amber-500 to-orange-500',
      flameGlow: 'shadow-[0_0_14px_rgba(245,158,11,0.5)]',
      descriptionAr: 'أسبوع متواصل من النقاء والتناغم الذهني',
      descriptionEn: 'A full week of sustained mental clarity'
    };
  }
  if (days >= 3) {
    return {
      tier: 2,
      nameAr: 'جذوة الالتزام',
      nameEn: 'Commitment Flame',
      flameColor: 'from-amber-400 to-orange-500',
      flameGlow: 'shadow-[0_0_10px_rgba(245,158,11,0.4)]',
      descriptionAr: 'بدأت الجذوة بالتحول إلى شعلة دافئة ثابتة',
      descriptionEn: 'Your daily spark is blossoming into a warm flame'
    };
  }
  return {
    tier: 1,
    nameAr: 'شرارة البداية',
    nameEn: 'Daily Spark',
    flameColor: 'from-amber-400 to-amber-600',
    flameGlow: 'shadow-[0_0_8px_rgba(251,191,36,0.35)]',
    descriptionAr: 'كل يوم هو خطوة جديدة نحو السلام الداخلي',
    descriptionEn: 'Every mindful day begins with a gentle spark'
  };
}

interface StoredStreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  activeDates: string[];
  totalActiveDays: number;
  lastCheckInTimestamp?: number;
}

// Retrieve raw state from localStorage
function getStoredState(): StoredStreakState {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      activeDates: [],
      totalActiveDays: 0
    };
  }
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
        longestStreak: typeof parsed.longestStreak === 'number' ? parsed.longestStreak : 0,
        lastActiveDate: parsed.lastActiveDate || null,
        activeDates: Array.isArray(parsed.activeDates) ? parsed.activeDates : [],
        totalActiveDays: typeof parsed.totalActiveDays === 'number' ? parsed.totalActiveDays : 0,
        lastCheckInTimestamp: parsed.lastCheckInTimestamp
      };
    }
  } catch {
    // ignore
  }
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    activeDates: [],
    totalActiveDays: 0
  };
}

// Save state to localStorage and broadcast event
function saveStoredState(state: StoredStreakState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(state));
    const fullData = computeStreakData(state);
    window.dispatchEvent(new CustomEvent(STREAK_EVENT_NAME, { detail: fullData }));
  } catch {
    // ignore
  }
}

// Compute dynamic properties from stored state
function computeStreakData(state: StoredStreakState): StreakData {
  const today = formatLocalDate();
  const yesterday = getYesterdayDateString(today);

  const todayCompleted = state.lastActiveDate === today;
  let effectiveStreak = state.currentStreak;

  // If last active date is older than yesterday, and not today, streak has lapsed
  if (state.lastActiveDate && state.lastActiveDate !== today && state.lastActiveDate !== yesterday) {
    effectiveStreak = 0; // pending restart today
  }

  const isPendingToday = !todayCompleted && (effectiveStreak > 0 || state.lastActiveDate === yesterday);

  const milestones: StreakMilestone[] = ALL_MILESTONES.map((m) => ({
    ...m,
    unlocked: state.longestStreak >= m.days || (effectiveStreak >= m.days && todayCompleted)
  }));

  const level = getStreakLevel(effectiveStreak > 0 ? effectiveStreak : 1);

  return {
    currentStreak: effectiveStreak,
    longestStreak: Math.max(state.longestStreak, effectiveStreak),
    lastActiveDate: state.lastActiveDate,
    activeDates: state.activeDates,
    totalActiveDays: state.totalActiveDays,
    todayCompleted,
    isPendingToday,
    level,
    milestones,
    lastCheckInTimestamp: state.lastCheckInTimestamp
  };
}

// Get current evaluated streak data
export function getStreakData(): StreakData {
  const state = getStoredState();
  return computeStreakData(state);
}

// Record an activity (game played, breathing completed, or manual daily check-in)
export function recordStreakActivity(source: string = 'general_activity'): {
  streak: number;
  isFirstToday: boolean;
  milestoneUnlocked: StreakMilestone | null;
  xpAwarded: number;
} {
  const state = getStoredState();
  const today = formatLocalDate();
  const yesterday = getYesterdayDateString(today);

  // If already completed today, just return current streak
  if (state.lastActiveDate === today) {
    const data = computeStreakData(state);
    return {
      streak: data.currentStreak,
      isFirstToday: false,
      milestoneUnlocked: null,
      xpAwarded: 0
    };
  }

  // Calculate new streak
  let newStreak = 1;
  if (state.lastActiveDate === yesterday) {
    newStreak = state.currentStreak + 1;
  } else {
    // Streak was 0 or reset
    newStreak = 1;
  }

  const newLongest = Math.max(state.longestStreak, newStreak);
  const newActiveDates = Array.from(new Set([...state.activeDates, today])).sort();
  const newTotalActive = newActiveDates.length;

  // Check if a new milestone was newly unlocked
  let newlyUnlockedMilestone: StreakMilestone | null = null;
  const prevLongest = state.longestStreak;
  const milestone = ALL_MILESTONES.find(m => m.days === newStreak && prevLongest < m.days);
  if (milestone) {
    newlyUnlockedMilestone = { ...milestone, unlocked: true };
  }

  const newState: StoredStreakState = {
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastActiveDate: today,
    activeDates: newActiveDates,
    totalActiveDays: newTotalActive,
    lastCheckInTimestamp: Date.now()
  };

  saveStoredState(newState);

  // Sound & visual celebrations
  soundManager.playFlameIgnite();
  if (newStreak > 1) {
    triggerConfetti(0.5, 0.35);
  }

  const xpAwarded = 25 + (newlyUnlockedMilestone ? newlyUnlockedMilestone.rewardXP : 0);

  return {
    streak: newStreak,
    isFirstToday: true,
    milestoneUnlocked: newlyUnlockedMilestone,
    xpAwarded
  };
}

// Helper to get 7 days of the recent week window for consistency calendar
export interface WeekDayStatus {
  dateStr: string;
  dayNumber: number;
  dayNameAr: string;
  dayNameEn: string;
  isToday: boolean;
  isCompleted: boolean;
  isFuture: boolean;
}

export function getRecentWeekDays(streakData: StreakData): WeekDayStatus[] {
  const days: WeekDayStatus[] = [];
  const today = new Date();
  const todayStr = formatLocalDate(today);

  const arabicDayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const englishDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // 6 days before today up to today
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = formatLocalDate(d);
    const dayOfWeek = d.getDay();
    const isToday = dateStr === todayStr;
    const isCompleted = streakData.activeDates.includes(dateStr);

    days.push({
      dateStr,
      dayNumber: d.getDate(),
      dayNameAr: arabicDayNames[dayOfWeek],
      dayNameEn: englishDayNames[dayOfWeek],
      isToday,
      isCompleted,
      isFuture: false
    });
  }

  return days;
}

// React Hook for reactive streak tracking
export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>(() => getStreakData());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<StreakData>;
      if (customEvent.detail) {
        setStreakData(customEvent.detail);
      } else {
        setStreakData(getStreakData());
      }
    };

    window.addEventListener(STREAK_EVENT_NAME, handleUpdate);

    // Refresh when user returns to tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setStreakData(getStreakData());
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener(STREAK_EVENT_NAME, handleUpdate);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const claimToday = () => {
    return recordStreakActivity('manual_button_claim');
  };

  return {
    streakData,
    claimToday,
    refreshStreak: () => setStreakData(getStreakData())
  };
}
