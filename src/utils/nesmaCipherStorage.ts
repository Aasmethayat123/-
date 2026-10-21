import { CipherProgress, CipherQuote, GardenCollectible } from '../types/nesmaCipher';
import { CIPHER_QUOTES, CIPHER_LEVELS, CIPHER_GARDEN_COLLECTIBLES } from '../data/nesmaCipherData';

const CIPHER_STORAGE_KEY = 'nesma_cipher_progress_v1';

export const INITIAL_CIPHER_PROGRESS: CipherProgress = {
  completedLevels: [],
  levelStars: {},
  unlockedLevels: [1], // Level 1 is always unlocked
  discoveredQuotes: [],
  score: 0,
  gardenItems: [],
  hintsUsedCount: {},
  secretDoorsUnlocked: [],
  lastPlayedLevel: 1
};

export function loadCipherProgress(): CipherProgress {
  if (typeof window === 'undefined') {
    return INITIAL_CIPHER_PROGRESS;
  }
  try {
    const raw = localStorage.getItem(CIPHER_STORAGE_KEY);
    if (!raw) return INITIAL_CIPHER_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
      levelStars: typeof parsed.levelStars === 'object' && parsed.levelStars !== null ? parsed.levelStars : {},
      unlockedLevels: Array.isArray(parsed.unlockedLevels) && parsed.unlockedLevels.length > 0 
        ? parsed.unlockedLevels 
        : [1],
      discoveredQuotes: Array.isArray(parsed.discoveredQuotes) ? parsed.discoveredQuotes : [],
      score: typeof parsed.score === 'number' ? parsed.score : 0,
      gardenItems: Array.isArray(parsed.gardenItems) ? parsed.gardenItems : [],
      hintsUsedCount: typeof parsed.hintsUsedCount === 'object' && parsed.hintsUsedCount !== null ? parsed.hintsUsedCount : {},
      secretDoorsUnlocked: Array.isArray(parsed.secretDoorsUnlocked) ? parsed.secretDoorsUnlocked : [],
      lastPlayedLevel: typeof parsed.lastPlayedLevel === 'number' ? parsed.lastPlayedLevel : 1
    };
  } catch (err) {
    console.error('Error loading Nesma Cipher progress:', err);
    return INITIAL_CIPHER_PROGRESS;
  }
}

export function saveCipherProgress(progress: CipherProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CIPHER_STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving Nesma Cipher progress:', err);
  }
}

export interface LevelCompletionResult {
  updatedProgress: CipherProgress;
  isFirstCompletion: boolean;
  scoreEarned: number;
  newlyDiscoveredQuote?: CipherQuote;
  newlyUnlockedCollectible?: GardenCollectible;
}

export function completeCipherLevel(
  levelId: number,
  stars: number,
  hintsUsed: number
): LevelCompletionResult {
  const current = loadCipherProgress();
  const isFirstCompletion = !current.completedLevels.includes(levelId);
  const targetLevel = CIPHER_LEVELS.find(l => l.id === levelId);

  // Prevent double scoring exploit
  const baseXP = targetLevel ? targetLevel.xpReward : 100;
  // Penalty of -20 XP per hint used, but minimum 40% of base
  const hintDeduction = hintsUsed * 20;
  const scoreEarned = isFirstCompletion 
    ? Math.max(Math.round(baseXP * 0.4), baseXP - hintDeduction)
    : 0; // replay gives no duplicate base score

  // 1. Update completed & stars
  const nextCompleted = isFirstCompletion 
    ? [...current.completedLevels, levelId].sort((a, b) => a - b)
    : current.completedLevels;

  const previousStars = current.levelStars[levelId] || 0;
  const bestStars = Math.max(previousStars, stars);
  const nextLevelStars = {
    ...current.levelStars,
    [levelId]: bestStars
  };

  // 2. Unlock next level (e.g. if level 1 completed, level 2 unlocks)
  const nextLevelToUnlock = levelId + 1;
  const nextUnlocked = (nextLevelToUnlock <= 30 && !current.unlockedLevels.includes(nextLevelToUnlock))
    ? [...current.unlockedLevels, nextLevelToUnlock].sort((a, b) => a - b)
    : current.unlockedLevels;

  // 3. Record hints used
  const nextHints = {
    ...current.hintsUsedCount,
    [levelId]: hintsUsed
  };

  // 4. Check if a full quote was completed
  let newlyDiscoveredQuote: CipherQuote | undefined = undefined;
  let nextDiscoveredQuotes = [...current.discoveredQuotes];

  if (targetLevel) {
    const parentQuote = CIPHER_QUOTES.find(q => q.id === targetLevel.quoteId);
    if (parentQuote && !current.discoveredQuotes.includes(parentQuote.id)) {
      const allLevelsDone = parentQuote.levelIds.every(id => nextCompleted.includes(id));
      if (allLevelsDone) {
        newlyDiscoveredQuote = parentQuote;
        nextDiscoveredQuotes.push(parentQuote.id);
      }
    }
  }

  // 5. Check garden collectibles
  let newlyUnlockedCollectible: GardenCollectible | undefined = undefined;
  const nextGardenItems = [...current.gardenItems];

  CIPHER_GARDEN_COLLECTIBLES.forEach(item => {
    if (item.requiredLevel <= levelId && !nextGardenItems.includes(item.id)) {
      nextGardenItems.push(item.id);
      if (item.requiredLevel === levelId) {
        newlyUnlockedCollectible = item;
      }
    }
  });

  const updatedProgress: CipherProgress = {
    completedLevels: nextCompleted,
    levelStars: nextLevelStars,
    unlockedLevels: nextUnlocked,
    discoveredQuotes: nextDiscoveredQuotes,
    score: current.score + scoreEarned,
    gardenItems: nextGardenItems,
    hintsUsedCount: nextHints,
    secretDoorsUnlocked: current.secretDoorsUnlocked,
    lastPlayedLevel: levelId
  };

  saveCipherProgress(updatedProgress);

  return {
    updatedProgress,
    isFirstCompletion,
    scoreEarned,
    newlyDiscoveredQuote,
    newlyUnlockedCollectible
  };
}

export function resetCipherProgress(): CipherProgress {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CIPHER_STORAGE_KEY);
  }
  return INITIAL_CIPHER_PROGRESS;
}
