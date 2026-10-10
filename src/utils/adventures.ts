import { ALL_36_GAMES, GameCatalogItem, ExperienceState } from '../data/gamesCatalog';
import { GameMode } from '../types';

const LAST_PLAYED_KEY = 'fakkerfeha_last_played_v1';
const PLAYED_HISTORY_KEY = 'fakkerfeha_played_history_v1';

export interface LastPlayedRecord {
  id: GameMode;
  levelId?: string;
  nameAr: string;
  nameEn: string;
  timestamp: number;
}

export interface HiddenPath {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  color: string;
  gameIds: GameMode[];
  completionQuoteAr: string;
  completionQuoteEn: string;
}

export const HIDDEN_PATHS: HiddenPath[] = [
  {
    id: 'calm-anchor',
    titleAr: 'مسار الطمأنينة وتفريغ الضغط',
    titleEn: 'Path of Calm & Pressure Release',
    descAr: 'رحلة ثلاثية تبدأ بدائرة السيطرة، ثم تنفس البالون، وتنتهي بفاصل جسدي مهدئ.',
    descEn: 'A 3-step journey: circle of control, balloon breathing, and physical rest.',
    icon: '🌿',
    color: 'from-emerald-500 to-teal-700',
    gameIds: ['hands-control', 'game-balloon-breath', 'gentle-break'],
    completionQuoteAr: '«الطمأنينة ليست في انتهاء المهام، بل في معرفة أين تضع ثقل قلبك الآن».',
    completionQuoteEn: 'Peace is not the end of tasks, but knowing where to gently place your heart.'
  },
  {
    id: 'cognitive-agility',
    titleAr: 'مسار المرونة وتحدي التفكير',
    titleEn: 'Path of Cognitive Agility',
    descAr: 'رحلة تفكيك الفخاخ الذهنية: فرز الأفكار، تحويل الصوت الداخلي، وميزان الأفكار.',
    descEn: 'Untangle thought traps: separate blitz, compassionate voice, and perspective scale.',
    icon: '🧠',
    color: 'from-indigo-500 to-sky-700',
    gameIds: ['challenge-separate', 'reframe-sentence', 'challenge-perspective'],
    completionQuoteAr: '«أفكارك مجرد فرضيات يطرحها عقلك؛ لست مجبراً على تصديق كل ما يمر ببالك».',
    completionQuoteEn: 'Thoughts are mental hypotheses; you do not have to believe every passing thought.'
  },
  {
    id: 'visceral-release',
    titleAr: 'مسار التفريغ الحسي والجرأة',
    titleEn: 'Path of Tactile & Somatic Dares',
    descAr: 'تفريغ فوري وشجاع: تحطيم المرآة، نفض التوتر الجسدي، وتحدي مسدس المشاعر.',
    descEn: 'Instant bold release: shatter illusions, somatic shake, and emotion roulette.',
    icon: '🪞',
    color: 'from-rose-500 to-red-700',
    gameIds: ['touch-and-break', 'game-somatic-shake', 'emotion-roulette'],
    completionQuoteAr: '«الجسد يحتفظ بالتوتر حتى نتحرك بصدق؛ النفض والتفريغ لغة الشفاء البيولوجي».',
    completionQuoteEn: 'The body holds tension until we move with authenticity; shaking is biology healing.'
  },
  {
    id: 'self-insight',
    titleAr: 'مسار فهم الذات والبصيرة',
    titleEn: 'Path of Insight & Self-Truth',
    descAr: 'استكشاف الأنماط غير المرئية: كروت البصيرة، كاشف الكذب الذاتي، ودوائر الأمان.',
    descEn: 'Unveil subconscious patterns: insight cards, self-lie radar, and boundaries.',
    icon: '🔮',
    color: 'from-purple-500 to-violet-800',
    gameIds: ['cards-insight', 'speed-lie-detector', 'boundaries-circle'],
    completionQuoteAr: '«حين تكف عن تجميل مشاعرك لنفسك، تصبح الحقيقة خفيفة وقابلة للحل».',
    completionQuoteEn: 'When you stop sugarcoating your feelings to yourself, truth becomes light.'
  },
  {
    id: 'grounding-presence',
    titleAr: 'مسار الحضور واليقظة الحسية',
    titleEn: 'Path of Sensory Presence',
    descAr: 'العودة الفورية للحاضر: تأريض الحواس ٥-٤-٣-٢-١، مسار اللانهاية، ولمّ الفقاعات.',
    descEn: 'Snap back to now: 5 senses grounding, infinity flow tracking, and priority bubbles.',
    icon: '⚓',
    color: 'from-teal-500 to-emerald-700',
    gameIds: ['game-sensory-grounding', 'game-infinity-flow', 'gather-bubbles'],
    completionQuoteAr: '«اللحظة الحالية هي المكان الوحيد الذي تملك فيه قوة التنفس والبدء».',
    completionQuoteEn: 'The present moment is the only place where your power to breathe and begin resides.'
  }
];

export function getLastPlayedGame(): LastPlayedRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LAST_PLAYED_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function recordLastPlayedGame(game: GameCatalogItem) {
  if (typeof window === 'undefined') return;
  try {
    const record: LastPlayedRecord = {
      id: game.id,
      levelId: game.levelId,
      nameAr: game.nameAr,
      nameEn: game.nameEn,
      timestamp: Date.now()
    };
    localStorage.setItem(LAST_PLAYED_KEY, JSON.stringify(record));

    // Also record in history
    const history = getPlayedGamesHistory();
    const key = game.levelId ? `${game.id}:${game.levelId}` : game.id;
    if (!history.includes(key)) {
      history.push(key);
      localStorage.setItem(PLAYED_HISTORY_KEY, JSON.stringify(history));
    }
  } catch {
    // ignore
  }
}

export function getPlayedGamesHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PLAYED_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// «افتح بابًا جديدًا»: اختيار لعبة لم يجربها المستخدم من قبل
export function getUnplayedDoorGame(): GameCatalogItem {
  const history = getPlayedGamesHistory();
  const unplayed = ALL_36_GAMES.filter((g) => {
    const key = g.levelId ? `${g.id}:${g.levelId}` : g.id;
    return !history.includes(key);
  });

  if (unplayed.length > 0) {
    const randomIndex = Math.floor(Math.random() * unplayed.length);
    return unplayed[randomIndex];
  }

  // If all played, return a random surprise from all 36
  const rand = Math.floor(Math.random() * ALL_36_GAMES.length);
  return ALL_36_GAMES[rand];
}

// «تحدي اليوم»: تحديد لعبة اليوم بحساب تقويمي دقيق ومتسق وثابت خلال اليوم
export function getTodayChallenge(): GameCatalogItem {
  const now = new Date();
  // Generate deterministic daily seed: YYYY * 365 + MM * 31 + DD
  const daySeed = now.getFullYear() * 365 + (now.getMonth() + 1) * 31 + now.getDate();
  const index = Math.abs(daySeed) % ALL_36_GAMES.length;
  return ALL_36_GAMES[index];
}

// «اختار حسب حالتك»
export function getGamesByState(state: ExperienceState): GameCatalogItem[] {
  return ALL_36_GAMES.filter((g) => g.states.includes(state));
}

// «اصنع تجربتك» (تحديد مدة + نوع طاقة)
export function getRecommendedMix(durationTier: '1min' | '2-3min' | '5min', energyType: 'calm' | 'move' | 'think'): GameCatalogItem[] {
  return ALL_36_GAMES.filter((g) => {
    // Match energy
    const matchEnergy = 
      energyType === 'calm' ? (g.experienceType === 'calm' || g.states.includes('calm')) :
      energyType === 'move' ? (g.experienceType === 'somatic' || g.experienceType === 'sensory' || g.states.includes('move_release')) :
      (g.experienceType === 'cognitive' || g.states.includes('mental_challenge'));

    return matchEnergy;
  });
}
