import { ALL_36_GAMES, GameCatalogItem, ExperienceState } from '../data/gamesCatalog';
import { GameMode } from '../types';

const LAST_PLAYED_KEY = 'fakkerfeha_last_played_v1';
const PLAYED_HISTORY_KEY = 'fakkerfeha_played_history_v1';
const PATHS_PROGRESS_KEY = 'fakkerfeha_paths_progress_v1';

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

// 5 Curated Guided Paths (المسارات الخمسة الموجهة)
export const HIDDEN_PATHS: HiddenPath[] = [
  {
    id: 'super-observation',
    titleAr: 'مسار الملاحظة الفائقة',
    titleEn: 'Super Observation Path',
    descAr: 'رحلة حواس يقظة: تأريض الحواس ٥-٤-٣-٢-١، مسار اللانهاية البصري، ولمّ فقاعات التشتت.',
    descEn: 'A mindful sensory voyage: 5-4-3-2-1 grounding, infinity flow tracking, and priority bubbles.',
    icon: '👁️',
    color: 'from-teal-600 to-emerald-700',
    gameIds: ['game-sensory-grounding', 'game-infinity-flow', 'gather-bubbles'],
    completionQuoteAr: '«اللحظة الحاضرة هي المكان الوحيد الذي تملك فيه زمام تنفسك وقدرتك على التأثير».',
    completionQuoteEn: 'The present moment is the only ground where your breath and autonomy reside.'
  },
  {
    id: 'cognitive-flexibility',
    titleAr: 'مسار المرونة في التفكير',
    titleEn: 'Cognitive Flexibility Path',
    descAr: 'تفكيك التشوهات العقلية: فرز الأفكار عن المشاعر، استبدال النقد القاسي، وميزان الزوايا البديلة.',
    descEn: 'Deconstructing mental distortions: separate facts from feelings, reframe critique, perspective scale.',
    icon: '🧠',
    color: 'from-indigo-600 to-blue-700',
    gameIds: ['challenge-separate', 'reframe-sentence', 'challenge-perspective'],
    completionQuoteAr: '«أفكارك مجرد فرضيات يطرحها العقل؛ لست مجبراً على تصديق كل سيناريو يمر برأسك».',
    completionQuoteEn: 'Thoughts are hypotheses; you do not have to believe every narrative passing through mind.'
  },
  {
    id: 'inner-calm-somatic',
    titleAr: 'مسار الهدوء الداخلي والتنظيم الجسدي',
    titleEn: 'Inner Calm & Somatic Regulation Path',
    descAr: 'استعادة الأمان العصبي: دائرة السيطرة، بالون التنفس الحركي، والفاصل الإجباري اللطيف.',
    descEn: 'Restore neuro-safety: sphere of control, animated balloon breath, and mandatory gentle break.',
    icon: '🌿',
    color: 'from-emerald-600 to-teal-800',
    gameIds: ['hands-control', 'game-balloon-breath', 'gentle-break'],
    completionQuoteAr: '«الطمأنينة ليست في انتهاء عواصف الحياة، بل في معرفة أين تضع ثقل قلبك الآن».',
    completionQuoteEn: 'Tranquility is not life with no storms, but knowing where to gently drop your anchor.'
  },
  {
    id: 'release-liberation',
    titleAr: 'مسار التفريغ والتحرر',
    titleEn: 'Release & Somatic Liberation Path',
    descAr: 'تفريغ التوتر الحبيس: تحطيم المرآة المكسورة، نفض الجسد السوماتي، وروليت إطلاق المشاعر.',
    descEn: 'Discharging pent-up tension: break illusion mirror, somatic shake, and emotion roulette.',
    icon: '🫨',
    color: 'from-rose-600 to-orange-700',
    gameIds: ['touch-and-break', 'game-somatic-shake', 'emotion-roulette'],
    completionQuoteAr: '«الجسد يحتفظ بالضغط حتى نتحرك بوعي؛ التفريغ الحركي يعيد ضبط نظام الإنذار الداخلي».',
    completionQuoteEn: 'The body holds tension until conscious movement discharges the alarm system.'
  },
  {
    id: 'wisdom-self-insight',
    titleAr: 'مسار الحكمة واستكشاف الذات',
    titleEn: 'Wisdom & Self-Exploration Path',
    descAr: 'سبر الأغوار العميقة: كروت البصيرة، رادار كاشف الكذب الداخلي، ورسم دوائر الأمان والحدود.',
    descEn: 'Deep inquiry: insight cards, internal lie radar, and personal boundaries circle.',
    icon: '👑',
    color: 'from-purple-600 to-violet-800',
    gameIds: ['cards-insight', 'speed-lie-detector', 'boundaries-circle'],
    completionQuoteAr: '«حين تكف عن تجميل مشاعرك لنفسك، تصبح الحقيقة خفيفة وقابلة للفهم والحل».',
    completionQuoteEn: 'When you stop sugarcoating your reality, truth becomes clear and manageable.'
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

export interface UnplayedDoorResult {
  game: GameCatalogItem;
  isAllCompleted: boolean;
  totalPlayed: number;
}

// «افتح بابًا جديدًا»: اختيار لعبة لم يجربها المستخدم من قبل
export function getUnplayedDoorGame(): UnplayedDoorResult {
  const history = getPlayedGamesHistory();
  const unplayed = ALL_36_GAMES.filter((g) => {
    const key = g.levelId ? `${g.id}:${g.levelId}` : g.id;
    return !history.includes(key);
  });

  if (unplayed.length > 0) {
    const randomIndex = Math.floor(Math.random() * unplayed.length);
    return {
      game: unplayed[randomIndex],
      isAllCompleted: false,
      totalPlayed: history.length
    };
  }

  // If all 36 games have been played
  const rand = Math.floor(Math.random() * ALL_36_GAMES.length);
  return {
    game: ALL_36_GAMES[rand],
    isAllCompleted: true,
    totalPlayed: history.length
  };
}

// «تحدي اليوم»: تحديد لعبة اليوم بحساب تقويمي دقيق ومتسق وثابت خلال اليوم
export function getTodayChallenge(): GameCatalogItem {
  const now = new Date();
  // Deterministic daily seed: YYYY * 365 + MM * 31 + DD
  const daySeed = now.getFullYear() * 365 + (now.getMonth() + 1) * 31 + now.getDate();
  const index = Math.abs(daySeed) % ALL_36_GAMES.length;
  return ALL_36_GAMES[index];
}

// «اختار حسب حالتك»
export function getGamesByState(state: ExperienceState): GameCatalogItem[] {
  return ALL_36_GAMES.filter((g) => g.states.includes(state));
}

// Hidden Paths Progress Storage & Management
export function getHiddenPathProgress(pathId: string): GameMode[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${PATHS_PROGRESS_KEY}_${pathId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordPathStepCompleted(pathId: string, gameId: GameMode): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getHiddenPathProgress(pathId);
    if (!current.includes(gameId)) {
      current.push(gameId);
      localStorage.setItem(`${PATHS_PROGRESS_KEY}_${pathId}`, JSON.stringify(current));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function resetHiddenPathProgress(pathId: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${PATHS_PROGRESS_KEY}_${pathId}`);
  } catch {
    // ignore
  }
}
