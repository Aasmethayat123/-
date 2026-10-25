import { GAME_STAGES_CONFIG, getGameLevelProgress } from './gameLevelsManager';

export interface DailyChallengeInfo {
  dateString: string; // YYYY-MM-DD
  gameId: string;
  gameNameAr: string;
  gameNameEn: string;
  stageNumber: number;
  stageTitleAr: string;
  stageTitleEn: string;
  specialConditionAr: string;
  specialConditionEn: string;
  bonusXP: number;
  isCompleted: boolean;
}

export interface WeeklyQuestInfo {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  targetCount: number;
  currentCount: number;
  rewardXP: number;
  isClaimed: boolean;
}

export interface GamesHubState {
  lastCompletedDailyDate?: string;
  dailyStreak: number;
  totalDailyCompleted: number;
  completedMasteryChallenges: string[]; // `${gameId}_${stageNumber}`
  claimedWeeklyQuests: string[];
}

const STORAGE_KEY = 'nesma_smart_games_hub_v1';

const REGISTERED_GAMES_LIST = [
  { id: 'nesma-cipher', nameAr: 'شفرة نسمة — فك الألغاز', nameEn: 'Nesma Cipher' },
  { id: 'zen-puzzle', nameAr: 'أحجار التوازن وميزان القرارات', nameEn: 'Zen Stone Balance' },
  { id: 'emotion-sort-puzzle', nameAr: 'فرز قوارير المشاعر', nameEn: 'Emotion Sort Puzzle' },
  { id: 'mindful-organizer', nameAr: 'ترتيب الفوضى والسكينة', nameEn: 'Mindful Organizer' },
  { id: 'hands-control', nameAr: 'في إيدي / برّا إيدي', nameEn: 'In My Hands / Control Circles' },
  { id: 'break-mountain', nameAr: 'كسّري الجبل والضغوط', nameEn: 'Break Mountain' }
];

export function getTodayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getHubState(): GamesHubState {
  if (typeof window === 'undefined') {
    return {
      dailyStreak: 0,
      totalDailyCompleted: 0,
      completedMasteryChallenges: [],
      claimedWeeklyQuests: []
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read smart games hub state', e);
  }
  return {
    dailyStreak: 0,
    totalDailyCompleted: 0,
    completedMasteryChallenges: [],
    claimedWeeklyQuests: []
  };
}

export function saveHubState(state: GamesHubState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save smart games hub state', e);
  }
}

/**
 * Deterministically calculate Today's Challenge based on YYYY-MM-DD
 */
export function getTodayChallenge(): DailyChallengeInfo {
  const dateStr = getTodayDateString();
  const state = getHubState();

  // Create simple hash from date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const gameIndex = positiveHash % REGISTERED_GAMES_LIST.length;
  const game = REGISTERED_GAMES_LIST[gameIndex];

  let stageNumber = 1;
  let stageTitleAr = 'المرحلة الأولى';
  let stageTitleEn = 'Stage 1';

  if (game.id === 'nesma-cipher') {
    stageNumber = (positiveHash % 60) + 1;
    stageTitleAr = `المرحلة ${stageNumber} في شفرة نسمة`;
    stageTitleEn = `Stage ${stageNumber} in Nesma Cipher`;
  } else if (game.id === 'zen-puzzle') {
    stageNumber = (positiveHash % 35) + 1;
    stageTitleAr = `المرحلة ${stageNumber} في ميزان الأحجار`;
    stageTitleEn = `Stage ${stageNumber} in Zen Stones`;
  } else {
    const config = GAME_STAGES_CONFIG[game.id] || [];
    if (config.length > 0) {
      const idx = positiveHash % config.length;
      stageNumber = config[idx].stageNumber;
      stageTitleAr = config[idx].titleAr;
      stageTitleEn = config[idx].titleEn;
    }
  }

  const specialConditions = [
    { ar: 'شرط اليوم: إكمال المرحلة بأقل من ٧ حركات للحصول على مكافأة مضاعفة! ⚡', en: 'Daily Condition: Finish under 7 moves for double XP! ⚡' },
    { ar: 'شرط اليوم: ثبات أقصى ودقة عالية دون التراجع عن الحركات! 🎯', en: 'Daily Condition: High stability without undoing! 🎯' },
    { ar: 'شرط اليوم: الاعتماد على التفكير الذاتي ودقة الملاحظة! 🧠', en: 'Daily Condition: Pure focus & self-reliance! 🧠' }
  ];

  const cond = specialConditions[positiveHash % specialConditions.length];

  return {
    dateString: dateStr,
    gameId: game.id,
    gameNameAr: game.nameAr,
    gameNameEn: game.nameEn,
    stageNumber,
    stageTitleAr,
    stageTitleEn,
    specialConditionAr: cond.ar,
    specialConditionEn: cond.en,
    bonusXP: 80,
    isCompleted: state.lastCompletedDailyDate === dateStr
  };
}

export function completeDailyChallenge(onAddXP?: (amount: number) => void): void {
  const state = getHubState();
  const todayStr = getTodayDateString();

  if (state.lastCompletedDailyDate === todayStr) return; // Prevent duplicate claiming

  state.lastCompletedDailyDate = todayStr;
  state.dailyStreak = (state.dailyStreak || 0) + 1;
  state.totalDailyCompleted = (state.totalDailyCompleted || 0) + 1;

  saveHubState(state);

  if (onAddXP) {
    onAddXP(80);
  }
}

export function getWeeklyQuests(): WeeklyQuestInfo[] {
  const state = getHubState();
  const claimed = state.claimedWeeklyQuests || [];

  // Calculate total completed stages across games
  const zenProg = getGameLevelProgress('zen-puzzle');
  const sortProg = getGameLevelProgress('emotion-sort-puzzle');
  const orgProg = getGameLevelProgress('mindful-organizer');
  const handsProg = getGameLevelProgress('hands-control');
  const breakProg = getGameLevelProgress('break-mountain');

  const totalCompletedStages = 
    zenProg.completedStagesCount + 
    sortProg.completedStagesCount + 
    orgProg.completedStagesCount + 
    handsProg.completedStagesCount + 
    breakProg.completedStagesCount;

  return [
    {
      id: 'quest_master_5_stages',
      titleAr: 'سيد الإتقان: إكمال ٥ مراحل ألعاب',
      titleEn: 'Mastering 5 Stages',
      descAr: 'أكمل ٥ مراحل في أي لعبة تفاعلية داخل التطبيق لتلقي شحنة صفاء ذهني.',
      descEn: 'Complete 5 stages across interactive games.',
      targetCount: 5,
      currentCount: Math.min(5, totalCompletedStages),
      rewardXP: 120,
      isClaimed: claimed.includes('quest_master_5_stages')
    },
    {
      id: 'quest_daily_streak_3',
      titleAr: 'المواظبة السحرية: ٣ أيام من التحدي اليومي',
      titleEn: 'Consistency Magic: 3 Daily Challenges',
      descAr: 'أنجز التحدي اليومي المتجدد لمدة ٣ أيام متتالية لتنمية عادة الهدوء.',
      descEn: 'Finish 3 consecutive daily challenges.',
      targetCount: 3,
      currentCount: Math.min(3, state.dailyStreak || 0),
      rewardXP: 150,
      isClaimed: claimed.includes('quest_daily_streak_3')
    },
    {
      id: 'quest_zen_world_1',
      titleAr: 'خبير التوازن: ختم وادي السكينة في أحجار الزن',
      titleEn: 'Balance Guru: Complete World 1 in Zen Stones',
      descAr: 'أكمل ٥ مراحل في لعبة أحجار التوازن واستخرج حجر الكوارتز النقي.',
      descEn: 'Complete 5 stages in Zen Stones.',
      targetCount: 5,
      currentCount: Math.min(5, zenProg.completedStagesCount),
      rewardXP: 180,
      isClaimed: claimed.includes('quest_zen_world_1')
    }
  ];
}

export function claimWeeklyQuest(questId: string, onAddXP?: (amount: number) => void): boolean {
  const state = getHubState();
  const quests = getWeeklyQuests();
  const targetQuest = quests.find(q => q.id === questId);

  if (!targetQuest || targetQuest.isClaimed || targetQuest.currentCount < targetQuest.targetCount) {
    return false;
  }

  state.claimedWeeklyQuests = [...(state.claimedWeeklyQuests || []), questId];
  saveHubState(state);

  if (onAddXP) {
    onAddXP(targetQuest.rewardXP);
  }

  return true;
}
