import {
  COLLECTIBLES_CATALOG,
  ISLAND_CHALLENGES,
  ISLAND_CLUES,
  ISLAND_REGIONS,
  ISLAND_RELICS,
  IslandChallengeDef,
  IslandCollectibleType,
  IslandCoreGameId,
  IslandPuzzleMechanicType,
  IslandRegionId,
  ROTATING_ISLAND_QUESTS,
} from '../data/movingIslandData';
import { getGameLevelProgress, GameProgressData, setActiveStage } from './gameLevelsManager';
import { loadCipherProgress } from './nesmaCipherStorage';
import { CipherProgress } from '../types/nesmaCipher';

export const MOVING_ISLAND_STORAGE_KEY = 'nesma_moving_island_v1';

export interface WorldMutationsState {
  bridgeRepaired: boolean;
  alternateShortcutActive: boolean;
  dualGateOpened: boolean;
  hiddenCoveRevealed: boolean;
  treasureVaultOpened: boolean;
  finaleSanctuaryUnlocked: boolean;
}

export interface MovingIslandSaveState {
  version: number;
  selectedRegionId: IslandRegionId;
  visitedRegions: IslandRegionId[];
  claimedChallengeIds: string[];
  solvedIslandPuzzles: string[]; // challenge IDs of solved interactive island puzzles
  collectibles: Record<IslandCollectibleType, number>;
  discoveredClueIds: string[];
  relicIds: string[];
  worldMutations: WorldMutationsState;
  vaultRewardClaimed: boolean;
  // Grand Finale state
  finaleCurrentStep: 1 | 2 | 3 | 4;
  finaleAttempts: number;
  finaleHintsUsed: number;
  finaleCompleted: boolean;
  finaleCompletedAt?: string;
  // Rotating non-punitive quests
  claimedQuestKeys: string[]; // e.g. "2026-W43:isl_quest_clue_hunter"
  totalIslandXP: number;
  lastSyncedAt: string;
}

export interface SixGamesSnapshot {
  cipher: CipherProgress;
  zenPuzzle: GameProgressData;
  emotionSort: GameProgressData;
  mindfulOrganizer: GameProgressData;
  handsControl: GameProgressData;
  breakMountain: GameProgressData;
  hadReadError: boolean;
}

export interface IslandSyncNotification {
  newlyClaimedChallenges: IslandChallengeDef[];
  newlyUnlockedRegions: IslandRegionId[];
  newlyDiscoveredClues: string[];
  newlyUnlockedRelics: string[];
  newWorldMutations: (keyof WorldMutationsState)[];
  xpAwarded: number;
}

const ALL_COLLECTIBLE_TYPES: IslandCollectibleType[] = [
  'cipher_shard',
  'balance_crystal',
  'garden_seed',
  'library_key',
  'choice_stone',
  'mountain_fragment',
];

const ALL_REGION_IDS: IslandRegionId[] = ISLAND_REGIONS.map((r) => r.id);

export function createInitialIslandState(): MovingIslandSaveState {
  return {
    version: 1,
    selectedRegionId: 'cipher-valley',
    visitedRegions: ['cipher-valley'],
    claimedChallengeIds: [],
    solvedIslandPuzzles: [],
    collectibles: {
      cipher_shard: 0,
      balance_crystal: 0,
      garden_seed: 0,
      library_key: 0,
      choice_stone: 0,
      mountain_fragment: 0,
    },
    discoveredClueIds: [],
    relicIds: [],
    worldMutations: {
      bridgeRepaired: false,
      alternateShortcutActive: false,
      dualGateOpened: false,
      hiddenCoveRevealed: false,
      treasureVaultOpened: false,
      finaleSanctuaryUnlocked: false,
    },
    vaultRewardClaimed: false,
    finaleCurrentStep: 1,
    finaleAttempts: 0,
    finaleHintsUsed: 0,
    finaleCompleted: false,
    claimedQuestKeys: [],
    totalIslandXP: 0,
    lastSyncedAt: new Date().toISOString(),
  };
}

/**
 * Safely read the progress of all 6 linked games without ever throwing or mutating them.
 */
export function readAllSixGamesSnapshot(): SixGamesSnapshot {
  let hadReadError = false;

  const safeLoadGame = (gameId: IslandCoreGameId): GameProgressData => {
    try {
      return getGameLevelProgress(gameId);
    } catch {
      hadReadError = true;
      return {
        gameId,
        currentStage: 1,
        unlockedStages: [1],
        stars: {},
        bestMoves: {},
        completedStagesCount: 0,
      };
    }
  };

  let cipher: CipherProgress;
  try {
    cipher = loadCipherProgress();
  } catch {
    hadReadError = true;
    cipher = {
      completedLevels: [],
      levelStars: {},
      unlockedLevels: [1],
      discoveredQuotes: [],
      score: 0,
      gardenItems: [],
      hintsUsedCount: {},
      secretDoorsUnlocked: [],
      lastPlayedLevel: 1,
    };
  }

  return {
    cipher,
    zenPuzzle: safeLoadGame('zen-puzzle'),
    emotionSort: safeLoadGame('emotion-sort-puzzle'),
    mindfulOrganizer: safeLoadGame('mindful-organizer'),
    handsControl: safeLoadGame('hands-control'),
    breakMountain: safeLoadGame('break-mountain'),
    hadReadError,
  };
}

/**
 * Load & sanitize Moving Island state from localStorage.
 * Recovers gracefully from missing or corrupted JSON.
 */
export function loadMovingIslandState(): MovingIslandSaveState {
  const fallback = createInitialIslandState();
  if (typeof window === 'undefined' && typeof globalThis.localStorage === 'undefined') {
    return fallback;
  }

  try {
    const raw = globalThis.localStorage?.getItem(MOVING_ISLAND_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback;

    const validChallengeIds = new Set(ISLAND_CHALLENGES.map((c) => c.id));
    const validClueIds = new Set(Object.keys(ISLAND_CLUES));
    const validRelicIds = new Set(Object.keys(ISLAND_RELICS));
    const validRegionSet = new Set<string>(ALL_REGION_IDS);

    const claimedChallengeIds: string[] = Array.isArray(parsed.claimedChallengeIds)
      ? Array.from(
          new Set<string>(
            parsed.claimedChallengeIds.filter(
              (id: unknown): id is string => typeof id === 'string' && validChallengeIds.has(id)
            )
          )
        )
      : [];

    const solvedIslandPuzzles: string[] = Array.isArray(parsed.solvedIslandPuzzles)
      ? Array.from(
          new Set<string>(
            parsed.solvedIslandPuzzles.filter(
              (id: unknown): id is string => typeof id === 'string' && validChallengeIds.has(id)
            )
          )
        )
      : [];

    // Recompute exact collectible counts from claimedChallengeIds to prevent tampering or drift
    const collectibles: Record<IslandCollectibleType, number> = {
      cipher_shard: 0,
      balance_crystal: 0,
      garden_seed: 0,
      library_key: 0,
      choice_stone: 0,
      mountain_fragment: 0,
    };
    for (const cId of claimedChallengeIds) {
      const def = ISLAND_CHALLENGES.find((c) => c.id === cId);
      if (def?.rewardCollectible) {
        collectibles[def.rewardCollectible] = Math.min(
          COLLECTIBLES_CATALOG[def.rewardCollectible].totalCount,
          collectibles[def.rewardCollectible] + 1
        );
      }
    }

    const discoveredClueIds: string[] = Array.isArray(parsed.discoveredClueIds)
      ? Array.from(
          new Set<string>(
            parsed.discoveredClueIds.filter(
              (id: unknown): id is string => typeof id === 'string' && validClueIds.has(id)
            )
          )
        )
      : [];
    // Ensure clues from claimed challenges are always present
    for (const cId of claimedChallengeIds) {
      const def = ISLAND_CHALLENGES.find((c) => c.id === cId);
      if (def?.rewardClueId && !discoveredClueIds.includes(def.rewardClueId)) {
        discoveredClueIds.push(def.rewardClueId);
      }
    }

    const relicIds: string[] = Array.isArray(parsed.relicIds)
      ? Array.from(
          new Set<string>(
            parsed.relicIds.filter(
              (id: unknown): id is string => typeof id === 'string' && validRelicIds.has(id)
            )
          )
        )
      : [];
    for (const cId of claimedChallengeIds) {
      const def = ISLAND_CHALLENGES.find((c) => c.id === cId);
      if (def?.rewardRelicId && !relicIds.includes(def.rewardRelicId)) {
        relicIds.push(def.rewardRelicId);
      }
    }

    const finaleCompleted = Boolean(parsed.finaleCompleted);
    if (finaleCompleted && !relicIds.includes('island_heart_prism')) {
      relicIds.push('island_heart_prism');
    }

    const visitedRegions: IslandRegionId[] = Array.isArray(parsed.visitedRegions)
      ? Array.from(
          new Set<IslandRegionId>(
            parsed.visitedRegions.filter(
              (r: unknown): r is IslandRegionId => typeof r === 'string' && validRegionSet.has(r)
            )
          )
        )
      : ['cipher-valley'];
    if (!visitedRegions.includes('cipher-valley')) {
      visitedRegions.unshift('cipher-valley');
    }

    const selectedRegionId: IslandRegionId =
      typeof parsed.selectedRegionId === 'string' && validRegionSet.has(parsed.selectedRegionId)
        ? (parsed.selectedRegionId as IslandRegionId)
        : 'cipher-valley';

    const stepRaw = parsed.finaleCurrentStep;
    const finaleCurrentStep: 1 | 2 | 3 | 4 =
      stepRaw === 1 || stepRaw === 2 || stepRaw === 3 || stepRaw === 4 ? stepRaw : 1;

    const state: MovingIslandSaveState = {
      version: 1,
      selectedRegionId,
      visitedRegions,
      claimedChallengeIds,
      solvedIslandPuzzles,
      collectibles,
      discoveredClueIds,
      relicIds,
      worldMutations: {
        bridgeRepaired: Boolean(parsed.worldMutations?.bridgeRepaired),
        alternateShortcutActive: Boolean(parsed.worldMutations?.alternateShortcutActive),
        dualGateOpened: Boolean(parsed.worldMutations?.dualGateOpened),
        hiddenCoveRevealed: Boolean(parsed.worldMutations?.hiddenCoveRevealed),
        treasureVaultOpened: Boolean(parsed.worldMutations?.treasureVaultOpened),
        finaleSanctuaryUnlocked: finaleCompleted,
      },
      vaultRewardClaimed: Boolean(parsed.vaultRewardClaimed),
      finaleCurrentStep,
      finaleAttempts:
        typeof parsed.finaleAttempts === 'number' && parsed.finaleAttempts >= 0
          ? Math.floor(parsed.finaleAttempts)
          : 0,
      finaleHintsUsed:
        typeof parsed.finaleHintsUsed === 'number' && parsed.finaleHintsUsed >= 0
          ? Math.floor(parsed.finaleHintsUsed)
          : 0,
      finaleCompleted,
      finaleCompletedAt:
        typeof parsed.finaleCompletedAt === 'string' ? parsed.finaleCompletedAt : undefined,
      claimedQuestKeys: Array.isArray(parsed.claimedQuestKeys)
        ? parsed.claimedQuestKeys.filter((k: unknown): k is string => typeof k === 'string')
        : [],
      totalIslandXP:
        typeof parsed.totalIslandXP === 'number' && !isNaN(parsed.totalIslandXP)
          ? Math.max(0, Math.floor(parsed.totalIslandXP))
          : 0,
      lastSyncedAt:
        typeof parsed.lastSyncedAt === 'string' ? parsed.lastSyncedAt : new Date().toISOString(),
    };

    const snapshot = readAllSixGamesSnapshot();
    state.worldMutations = computeWorldMutations(state, snapshot);
    return state;
  } catch (err) {
    console.error('Error reading Moving Island state; recovering safely:', err);
    return fallback;
  }
}

export function saveMovingIslandState(state: MovingIslandSaveState): boolean {
  try {
    globalThis.localStorage?.setItem(MOVING_ISLAND_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('Failed saving Moving Island state:', err);
    return false;
  }
}

export function getGameProgressFromSnapshot(
  gameId: IslandCoreGameId,
  snapshot: SixGamesSnapshot
): GameProgressData | null {
  switch (gameId) {
    case 'zen-puzzle':
      return snapshot.zenPuzzle;
    case 'emotion-sort-puzzle':
      return snapshot.emotionSort;
    case 'mindful-organizer':
      return snapshot.mindfulOrganizer;
    case 'hands-control':
      return snapshot.handsControl;
    case 'break-mountain':
      return snapshot.breakMountain;
    default:
      return null;
  }
}

/**
 * Evaluate whether a specific challenge's underlying condition is met.
 */
export function isChallengeConditionMet(
  challenge: IslandChallengeDef,
  state: MovingIslandSaveState,
  snapshot: SixGamesSnapshot
): boolean {
  const rule = challenge.verification;

  if (rule.kind === 'island_puzzle') {
    return state.solvedIslandPuzzles.includes(challenge.id);
  }

  if (rule.gameId === 'nesma-cipher') {
    const completedCount = snapshot.cipher.completedLevels.length;
    if (rule.minCompletedStages && completedCount < rule.minCompletedStages) {
      return false;
    }
    if (rule.specificStage && !snapshot.cipher.completedLevels.includes(rule.specificStage)) {
      return false;
    }
    if (rule.maxHintsOnAnyLevel !== undefined) {
      // Check if at least one completed level has stars === 3 or hintsUsed <= maxHintsOnAnyLevel
      const hasLowHintSolve = snapshot.cipher.completedLevels.some((lvlId) => {
        const stars = snapshot.cipher.levelStars[lvlId] || 0;
        const recordedHints = snapshot.cipher.hintsUsedCount[lvlId];
        if (recordedHints !== undefined) {
          return recordedHints <= rule.maxHintsOnAnyLevel!;
        }
        return rule.maxHintsOnAnyLevel === 0 ? stars >= 3 : stars >= 2;
      });
      if (!hasLowHintSolve) return false;
    }
    return true;
  }

  const prog = getGameProgressFromSnapshot(rule.gameId, snapshot);
  if (!prog) return false;

  const completedStages = Object.keys(prog.stars)
    .map((k) => Number(k))
    .filter((k) => (prog.stars[k] || 0) > 0);

  if (rule.minCompletedStages && completedStages.length < rule.minCompletedStages) {
    return false;
  }

  if (rule.specificStage !== undefined) {
    const starsOnTarget = prog.stars[rule.specificStage] || 0;
    // Also accept if player already completed a higher stage in CASE specificStage was skipped, EXCEPT when minStarsOnStage is required
    if (rule.minStarsOnStage !== undefined) {
      if (starsOnTarget < rule.minStarsOnStage) return false;
    } else {
      const hasStageOrHigher = completedStages.some((s) => s >= rule.specificStage!);
      if (!hasStageOrHigher) return false;
    }
  }

  if (rule.maxMovesOnStage !== undefined && rule.specificStage !== undefined) {
    const moves = prog.bestMoves[rule.specificStage];
    if (moves === undefined || moves > rule.maxMovesOnStage) return false;
  }

  return true;
}

/**
 * Check if an interactive island puzzle's prerequisites (collectibles / clues / region unlock) are met so the player can open & solve it.
 */
export function canOpenIslandPuzzle(
  challenge: IslandChallengeDef,
  state: MovingIslandSaveState,
  unlockedRegions: IslandRegionId[]
): { allowed: boolean; missingReasonsAr: string[] } {
  const reasons: string[] = [];

  if (!unlockedRegions.includes(challenge.regionId)) {
    const reg = ISLAND_REGIONS.find((r) => r.id === challenge.regionId);
    reasons.push(`يجب فتح منطقة «${reg?.nameAr || challenge.regionId}» أولاً.`);
  }

  if (challenge.verification.kind === 'island_puzzle') {
    const reqCols = challenge.verification.requiredCollectibles;
    if (reqCols) {
      for (const [colKey, minCount] of Object.entries(reqCols)) {
        const key = colKey as IslandCollectibleType;
        const owned = state.collectibles[key] || 0;
        if (minCount && owned < minCount) {
          const meta = COLLECTIBLES_CATALOG[key];
          reasons.push(`تحتاج إلى ${minCount} من «${meta.nameAr}» (لديك حالياً: ${owned}).`);
        }
      }
    }

    const reqClues = challenge.verification.requiredClueIds;
    if (reqClues) {
      for (const clueId of reqClues) {
        if (!state.discoveredClueIds.includes(clueId)) {
          const clue = ISLAND_CLUES[clueId];
          reasons.push(`تحتاج إلى اكتشاف دليل «${clue?.titleAr || clueId}».`);
        }
      }
    }
  }

  return {
    allowed: reasons.length === 0,
    missingReasonsAr: reasons,
  };
}

/**
 * Compute world mutations from current island collectibles, clues, solved puzzles, and game snapshots.
 * Mutations are monotonic (once unlocked in save state, they remain unlocked).
 */
export function computeWorldMutations(
  state: MovingIslandSaveState,
  snapshot: SixGamesSnapshot
): WorldMutationsState {
  const zenCompleted = Object.values(snapshot.zenPuzzle.stars).some((s) => s > 0);
  const vialsCompleted = Object.values(snapshot.emotionSort.stars).some((s) => s > 0);
  const zenThreeStar = Object.values(snapshot.zenPuzzle.stars).some((s) => s >= 3);

  const bridgeRepaired =
    state.worldMutations.bridgeRepaired || state.solvedIslandPuzzles.includes('ch_balance_4');

  const alternateShortcutActive =
    state.worldMutations.alternateShortcutActive ||
    state.claimedChallengeIds.includes('ch_cipher_2') ||
    (state.collectibles.cipher_shard >= 1 && zenThreeStar);

  const dualGateOpened =
    state.worldMutations.dualGateOpened ||
    (zenCompleted && vialsCompleted) ||
    (state.collectibles.balance_crystal >= 1 && state.collectibles.garden_seed >= 1);

  const hiddenCoveRevealed =
    state.worldMutations.hiddenCoveRevealed ||
    (state.discoveredClueIds.includes('clue_cipher_code') &&
      state.discoveredClueIds.includes('clue_vials_spectrum'));

  const treasureVaultOpened =
    state.worldMutations.treasureVaultOpened ||
    (state.collectibles.cipher_shard >= 2 &&
      state.collectibles.garden_seed >= 2 &&
      state.collectibles.library_key >= 2);

  const finaleSanctuaryUnlocked =
    state.worldMutations.finaleSanctuaryUnlocked || state.finaleCompleted;

  return {
    bridgeRepaired,
    alternateShortcutActive,
    dualGateOpened,
    hiddenCoveRevealed,
    treasureVaultOpened,
    finaleSanctuaryUnlocked,
  };
}

/**
 * Determine all currently unlocked regions on the Moving Island.
 */
export function computeUnlockedRegions(
  state: MovingIslandSaveState,
  snapshot?: SixGamesSnapshot
): IslandRegionId[] {
  const snap = snapshot || readAllSixGamesSnapshot();
  const mutations = computeWorldMutations(state, snap);
  const unlocked = new Set<IslandRegionId>(['cipher-valley']);

  // 2. Balance Bridge: requires >= 1 cipher shard
  if (state.collectibles.cipher_shard >= 1) {
    unlocked.add('balance-bridge');
  }

  // 3. Vials Garden: requires repaired bridge OR glowing alternate shortcut
  if (mutations.bridgeRepaired || mutations.alternateShortcutActive) {
    unlocked.add('vials-garden');
  }

  // 4. Order Library: requires dual gate (condition across 2 games: Balance + Vials)
  if (mutations.dualGateOpened) {
    unlocked.add('order-library');
  }

  // 5. Choice Gate: requires >= 1 library key AND >= 1 garden seed
  if (state.collectibles.library_key >= 1 && state.collectibles.garden_seed >= 1) {
    unlocked.add('choice-gate');
  }

  // 6. Mountain of Secrets: requires Choice Gate unlocked + >= 1 choice stone
  if (unlocked.has('choice-gate') && state.collectibles.choice_stone >= 1) {
    unlocked.add('secrets-mountain');
  }

  // 7. Hidden Observatory: requires hiddenCoveRevealed
  if (mutations.hiddenCoveRevealed) {
    unlocked.add('hidden-observatory');
  }

  // 8. Treasure Vault: requires treasureVaultOpened
  if (mutations.treasureVaultOpened) {
    unlocked.add('treasure-vault');
  }

  // 9. Finale Sanctuary: unlocks only when Grand Finale readiness is met (or already completed)
  if (
    mutations.finaleSanctuaryUnlocked ||
    checkGrandFinaleReadiness(state, snap).isReady
  ) {
    unlocked.add('finale-sanctuary');
  }

  return ALL_REGION_IDS.filter((id) => unlocked.has(id));
}

/**
 * Synchronize Moving Island state with all 6 games' real progress,
 * idempotently claiming newly satisfied challenges, collectibles, clues, and vault rewards.
 */
export function syncIslandWithGames(
  onAddXP?: (amount: number) => void
): { state: MovingIslandSaveState; notification: IslandSyncNotification } {
  const prevState = loadMovingIslandState();
  const snapshot = readAllSixGamesSnapshot();
  const prevUnlocked = computeUnlockedRegions(prevState, snapshot);
  const prevMutations = { ...prevState.worldMutations };

  const nextState: MovingIslandSaveState = {
    ...prevState,
    visitedRegions: [...prevState.visitedRegions],
    claimedChallengeIds: [...prevState.claimedChallengeIds],
    solvedIslandPuzzles: [...prevState.solvedIslandPuzzles],
    collectibles: { ...prevState.collectibles },
    discoveredClueIds: [...prevState.discoveredClueIds],
    relicIds: [...prevState.relicIds],
    worldMutations: { ...prevState.worldMutations },
    claimedQuestKeys: [...prevState.claimedQuestKeys],
  };

  const newlyClaimedChallenges: IslandChallengeDef[] = [];
  const newlyDiscoveredClues: string[] = [];
  const newlyUnlockedRelics: string[] = [];
  let xpAwarded = 0;

  // Iteratively evaluate challenges (in case claiming one unlocks a region/mutation)
  let changed = true;
  while (changed) {
    changed = false;
    nextState.worldMutations = computeWorldMutations(nextState, snapshot);

    for (const challenge of ISLAND_CHALLENGES) {
      if (nextState.claimedChallengeIds.includes(challenge.id)) continue;

      if (isChallengeConditionMet(challenge, nextState, snapshot)) {
        nextState.claimedChallengeIds.push(challenge.id);
        newlyClaimedChallenges.push(challenge);
        xpAwarded += challenge.rewardXP;

        if (challenge.rewardCollectible) {
          const type = challenge.rewardCollectible;
          nextState.collectibles[type] = Math.min(
            COLLECTIBLES_CATALOG[type].totalCount,
            (nextState.collectibles[type] || 0) + 1
          );
        }

        if (challenge.rewardClueId && !nextState.discoveredClueIds.includes(challenge.rewardClueId)) {
          nextState.discoveredClueIds.push(challenge.rewardClueId);
          newlyDiscoveredClues.push(challenge.rewardClueId);
        }

        if (challenge.rewardRelicId && !nextState.relicIds.includes(challenge.rewardRelicId)) {
          nextState.relicIds.push(challenge.rewardRelicId);
          newlyUnlockedRelics.push(challenge.rewardRelicId);
        }

        changed = true;
      }
    }
  }

  nextState.worldMutations = computeWorldMutations(nextState, snapshot);

  // Auto-grant Treasure Vault relic once when vault opens
  if (nextState.worldMutations.treasureVaultOpened && !nextState.vaultRewardClaimed) {
    nextState.vaultRewardClaimed = true;
    if (!nextState.relicIds.includes('vault_crown_relic')) {
      nextState.relicIds.push('vault_crown_relic');
      newlyUnlockedRelics.push('vault_crown_relic');
    }
    xpAwarded += ISLAND_RELICS.vault_crown_relic.xpBonus;
  }

  if (xpAwarded > 0) {
    nextState.totalIslandXP += xpAwarded;
    if (onAddXP) {
      onAddXP(xpAwarded);
    }
  }

  nextState.lastSyncedAt = new Date().toISOString();
  saveMovingIslandState(nextState);

  const nextUnlocked = computeUnlockedRegions(nextState, snapshot);
  const newlyUnlockedRegions = nextUnlocked.filter((r) => !prevUnlocked.includes(r));

  const mutationKeys: (keyof WorldMutationsState)[] = [
    'bridgeRepaired',
    'alternateShortcutActive',
    'dualGateOpened',
    'hiddenCoveRevealed',
    'treasureVaultOpened',
    'finaleSanctuaryUnlocked',
  ];
  const newWorldMutations = mutationKeys.filter(
    (k) => nextState.worldMutations[k] && !prevMutations[k]
  );

  return {
    state: nextState,
    notification: {
      newlyClaimedChallenges,
      newlyUnlockedRegions,
      newlyDiscoveredClues,
      newlyUnlockedRelics,
      newWorldMutations,
      xpAwarded,
    },
  };
}

// ============================================================================
// Interactive Cross-Game Island Puzzle Validation & Completion
// ============================================================================

export type IslandPuzzlePayload =
  | { type: 'symbol_lock'; symbols: string[] }
  | { type: 'bridge_counterweight'; slots: [number, number, number, number] } // positions -2, -1, +1, +2 using weights [2, 3, 4, 6]
  | { type: 'elixir_synthesis'; layers: string[] }
  | { type: 'archive_codex'; assignments: Record<string, number> }
  | { type: 'gate_scales'; choices: Record<string, boolean> }
  | { type: 'star_triangulation'; rings: [number, number, number] };

export const ARCHIVE_CODEX_ITEMS: { id: string; labelAr: string; idealShelf: 0 | 1 | 2 }[] = [
  { id: 'codex_star_prism', labelAr: 'بلورة رصد الشفق', idealShelf: 0 },
  { id: 'codex_candle_calm', labelAr: 'سراج التأمل الهادئ', idealShelf: 0 },
  { id: 'codex_cipher_scroll', labelAr: 'مخطوطة رموز الوادي', idealShelf: 1 },
  { id: 'codex_bridge_blueprint', labelAr: 'سجل هندسة الجسور', idealShelf: 1 },
  { id: 'codex_garden_fern', labelAr: 'أصيص سرخس الحديقة', idealShelf: 2 },
  { id: 'codex_river_stone', labelAr: 'حجر الارتكاز النهري', idealShelf: 2 },
];

export const GATE_SCALES_DILEMMAS: { id: string; textAr: string; inHands: boolean }[] = [
  { id: 'gs_1', textAr: 'ترتيب خطوتي القادمة بهدوء ووضوح', inHands: true },
  { id: 'gs_2', textAr: 'سرعة هدوء الرياح فوق مضيق الجزيرة', inHands: false },
  { id: 'gs_3', textAr: 'اختيار الكلمات الرحيمة مع نفسي عند الخطأ', inHands: true },
  { id: 'gs_4', textAr: 'أحكام الآخرين وتوقعاتهم المسبقة عني', inHands: false },
];

export function validateIslandPuzzleAttempt(
  expectedType: IslandPuzzleMechanicType,
  payload: IslandPuzzlePayload
): { valid: boolean; feedbackAr: string } {
  if (payload.type !== expectedType) {
    return { valid: false, feedbackAr: 'نوع آلية اللغز غير مطابق للتحدي الحالي.' };
  }

  switch (payload.type) {
    case 'symbol_lock': {
      // Expected resonance order: شمس الوضوح -> مفتاح الشفرة -> موجة السكينة -> نجمة الهداية
      const target = ['sun', 'key', 'wave', 'star'];
      const isMatch =
        payload.symbols.length === 4 && payload.symbols.every((s, idx) => s === target[idx]);
      return isMatch
        ? { valid: true, feedbackAr: 'تناغمت تروس المسلة الأربعة وانفتح قفل الضفة الشرقية!' }
        : {
            valid: false,
            feedbackAr:
              'لم تتطابق التروس بعد؛ تذكّر نقش المسلة: يبدأ الفجر بالشمس، فيفتح المفتاح، فتهدأ الموجة، وتسطع النجمة.',
          };
    }

    case 'bridge_counterweight': {
      const [wLeftFar, wLeftNear, wRightNear, wRightFar] = payload.slots;
      const expectedWeights = [2, 3, 4, 6];
      const sorted = [...payload.slots].sort((a, b) => a - b);
      const usesExactSet =
        sorted.length === 4 && sorted.every((val, idx) => val === expectedWeights[idx]);
      if (!usesExactSet) {
        return {
          valid: false,
          feedbackAr: 'يجب وضع الأوزان الحجرية الأربعة المختلفة (٢، ٣، ٤، ٦ كجم) كلٌّ في موضع واحد.',
        };
      }
      const netTorque = -2 * wLeftFar + -1 * wLeftNear + 1 * wRightNear + 2 * wRightFar;
      if (netTorque === 0) {
        return {
          valid: true,
          feedbackAr: 'تعادلت عزوم الجسر تماماً (صفر ميل) وعادت الألواح الحجرية إلى مكانها!',
        };
      }
      return {
        valid: false,
        feedbackAr:
          netTorque < 0
            ? `الجسر يميل نحو اليسار بمقدار ${Math.abs(netTorque)} وحدة عزم؛ خفّف الوزن البعيد يساراً أو عزّز اليمين.`
            : `الجسر يميل نحو اليمين بمقدار ${netTorque} وحدة عزم؛ وازن الكفة اليسرى مع اليمنى.`,
      };
    }

    case 'elixir_synthesis': {
      const target = ['emerald_roots', 'azure_clarity', 'golden_hope'];
      const isMatch =
        payload.layers.length === 3 && payload.layers.every((l, idx) => l === target[idx]);
      return isMatch
        ? {
            valid: true,
            feedbackAr: 'امتزج ندى البصيرة بنقاء تام وتفتّحت الجذور المضيئة!',
          }
        : {
            valid: false,
            feedbackAr:
              'ترتيب الطبقات يحتاج لتعديل: ابدأ بالجذور الزمردية في القاع، ثم صفاء السماء الأزرق، وتوّج القمة بالأمل الذهبي.',
          };
    }

    case 'archive_codex': {
      let correctCount = 0;
      for (const item of ARCHIVE_CODEX_ITEMS) {
        if (payload.assignments[item.id] === item.idealShelf) {
          correctCount++;
        }
      }
      if (correctCount === ARCHIVE_CODEX_ITEMS.length) {
        return {
          valid: true,
          feedbackAr: 'انتظمت المخطوطات والمقتنيات الست بتناغم ١٠٠٪ وظهر المفتاح الرابع!',
        };
      }
      return {
        valid: false,
        feedbackAr: `تم وضع ${correctCount} من ٦ في رفها المثالي؛ تذكّر: الرف العلوي للنور والبلور، والأوسط للمخطوطات، والسفلي للنبات والحجر.`,
      };
    }

    case 'gate_scales': {
      let correct = 0;
      for (const d of GATE_SCALES_DILEMMAS) {
        if (payload.choices[d.id] === d.inHands) {
          correct++;
        }
      }
      if (correct === GATE_SCALES_DILEMMAS.length) {
        return {
          valid: true,
          feedbackAr: 'استوت كفتا البوابة وانفرج المصراع الصخري نحو جبل الأسرار!',
        };
      }
      return {
        valid: false,
        feedbackAr: `أصبت في ${correct} من ٤ مواقف؛ ميّز بدقة بين الفعل الذي تملكه الآن وبين الظروف الخارجية.`,
      };
    }

    case 'star_triangulation': {
      // Ring 1 = 4 (first digit of clue_cipher_code 4-1-3-2), Ring 2 = 3 (3 spectrum layers), Ring 3 = 6 (6 core games/seals)
      const [r1, r2, r3] = payload.rings;
      if (r1 === 4 && r2 === 3 && r3 === 6) {
        return {
          valid: true,
          feedbackAr: 'تلاقت العدسات الثلاث على النجم السابع وانكشف سر المرصد الخفي!',
        };
      }
      return {
        valid: false,
        feedbackAr:
          'لم تتطابق بؤرة العدسات بعد؛ راجع الأدلة: العدسة الأولى = أول أرقام نبض الوادي (٤)، الثانية = عدد أطياف الصفاء (٣)، الثالثة = عدد مناطق الألعاب الأساسية (٦).',
      };
    }
  }
}

/**
 * Solve & persist an interactive island puzzle challenge (idempotent — never double-rewards).
 */
export function completeIslandPuzzleChallenge(
  challengeId: string,
  payload: IslandPuzzlePayload,
  onAddXP?: (amount: number) => void
): {
  success: boolean;
  feedbackAr: string;
  alreadyClaimed: boolean;
  state: MovingIslandSaveState;
  notification?: IslandSyncNotification;
} {
  const currentState = loadMovingIslandState();
  const snapshot = readAllSixGamesSnapshot();
  const unlockedRegions = computeUnlockedRegions(currentState, snapshot);
  const challenge = ISLAND_CHALLENGES.find((c) => c.id === challengeId);

  if (!challenge || challenge.verification.kind !== 'island_puzzle') {
    return {
      success: false,
      feedbackAr: 'التحدي المطلوب غير موجود أو ليس لغزاً تفاعلياً.',
      alreadyClaimed: false,
      state: currentState,
    };
  }

  const prereq = canOpenIslandPuzzle(challenge, currentState, unlockedRegions);
  if (!prereq.allowed) {
    return {
      success: false,
      feedbackAr: prereq.missingReasonsAr.join(' '),
      alreadyClaimed: false,
      state: currentState,
    };
  }

  const validation = validateIslandPuzzleAttempt(challenge.verification.puzzleType, payload);
  if (!validation.valid) {
    return {
      success: false,
      feedbackAr: validation.feedbackAr,
      alreadyClaimed: false,
      state: currentState,
    };
  }

  const alreadyClaimed = currentState.claimedChallengeIds.includes(challengeId);
  if (!currentState.solvedIslandPuzzles.includes(challengeId)) {
    currentState.solvedIslandPuzzles.push(challengeId);
    saveMovingIslandState(currentState);
  }

  const synced = syncIslandWithGames(onAddXP);
  return {
    success: true,
    feedbackAr: validation.feedbackAr,
    alreadyClaimed,
    state: synced.state,
    notification: synced.notification,
  };
}

// ============================================================================
// Grand Finale Multi-Step Engine
// ============================================================================

export interface GrandFinaleReadiness {
  isReady: boolean;
  gamesCompletedMap: Record<IslandCoreGameId, boolean>;
  completedGamesCount: number;
  collectibleCategoriesOwned: number;
  totalCollectiblesOwned: number;
  cluesOwnedCount: number;
  missingRequirementsAr: string[];
}

export function checkGrandFinaleReadiness(
  state?: MovingIslandSaveState,
  snapshot?: SixGamesSnapshot
): GrandFinaleReadiness {
  const st = state || loadMovingIslandState();
  const snap = snapshot || readAllSixGamesSnapshot();

  const hasStages = (p: GameProgressData) => Object.values(p.stars).some((s) => s > 0);

  const gamesCompletedMap: Record<IslandCoreGameId, boolean> = {
    'nesma-cipher':
      snap.cipher.completedLevels.length > 0 || st.collectibles.cipher_shard > 0,
    'zen-puzzle': hasStages(snap.zenPuzzle) || st.collectibles.balance_crystal > 0,
    'emotion-sort-puzzle': hasStages(snap.emotionSort) || st.collectibles.garden_seed > 0,
    'mindful-organizer': hasStages(snap.mindfulOrganizer) || st.collectibles.library_key > 0,
    'hands-control': hasStages(snap.handsControl) || st.collectibles.choice_stone > 0,
    'break-mountain': hasStages(snap.breakMountain) || st.collectibles.mountain_fragment > 0,
  };

  const completedGamesCount = Object.values(gamesCompletedMap).filter(Boolean).length;
  const collectibleCategoriesOwned = ALL_COLLECTIBLE_TYPES.filter(
    (t) => (st.collectibles[t] || 0) >= 1
  ).length;
  const totalCollectiblesOwned = ALL_COLLECTIBLE_TYPES.reduce(
    (sum, t) => sum + (st.collectibles[t] || 0),
    0
  );
  const cluesOwnedCount = st.discoveredClueIds.length;

  const missingRequirementsAr: string[] = [];
  if (completedGamesCount < 6) {
    missingRequirementsAr.push(
      `أكمل تحدياً واحداً على الأقل في جميع الألعاب الست المرتبطة بالجزيرة (${completedGamesCount}/٦ مكتمل).`
    );
  }
  if (collectibleCategoriesOwned < 6) {
    missingRequirementsAr.push(
      `احصل على مقتنى واحد على الأقل من كل فئة من الفئات الست (${collectibleCategoriesOwned}/٦ فئات).`
    );
  }
  if (cluesOwnedCount < 4) {
    missingRequirementsAr.push(
      `اكتشف ٤ أدلة على الأقل من أنحاء الجزيرة لفك أختام المعبد (${cluesOwnedCount}/٤ أدلة).`
    );
  }

  return {
    isReady: missingRequirementsAr.length === 0,
    gamesCompletedMap,
    completedGamesCount,
    collectibleCategoriesOwned,
    totalCollectiblesOwned,
    cluesOwnedCount,
    missingRequirementsAr,
  };
}

export type GrandFinaleStepInput =
  | { step: 1; orderedRegions: IslandRegionId[] }
  | { step: 2; pins: [number, number, number, number] }
  | { step: 3; shelves: { top: string; middle: string; bottom: string } }
  | { step: 4; selectedAnchorIds: string[] };

export const FINALE_STEP_HINTS: Record<1 | 2 | 3 | 4, [string, string]> = {
  1: [
    'فكّر في رحلتك منذ لحظة النزول على الشاطئ: ما أول منطقة فُتحت لك، وأي منطقة قادتك إلى الأخرى؟',
    'تتبّع الخريطة خطوة بخطوة: تبدأ بـ «وادي الشفرات» ثم تعبر «جسر التوازن» نحو «حديقة القوارير»، تليها «مكتبة النظام» ثم «بوابة الاختيار» وصولاً إلى «جبل الأسرار».',
  ],
  2: [
    'انظر إلى شريط «أدلتك المكتشفة» أعلاه وابحث عن الدليل القادم من منطقة «وادي الشفرات».',
    'دليل «نبض البوصلة الرباعي» يحمل أربعة أرقام مفصولة بشرطات؛ اضبط الوتد ١ على الرقم الأول من اليمين، وتابع بالترتيب حتى الوتد ٤.',
  ],
  3: [
    'اربط بين طبيعة كل رف (النور في الأعلى، الحكمة في الوسط، الجذور في الأسفل) وبين دلالة ألوان الطيف الثلاثة.',
    'راجع دليل «ميثاق الرفوف الثلاثة»: الضوء الذهبي يعلو في القمة، والمعرفة الزرقاء تستقر في الوسط، والجذور الخضراء ترسو في الأسفل.',
  ],
  4: [
    'استحضر جوهر لعبة «في إيدي / برّا إيدي»: استبعد أي خيار يتعلق بتغيير الماضي أو إجبار الآخرين.',
    'تأمّل الخيارات الخمسة: هناك ٣ أفعال حاضرة يمكنك ممارستها بنفسك الآن (التنفس والخطوة الحاضرة، رسم الحدود بلطف، وطلب المساندة الصادقة).',
  ],
};

export const FINALE_STEP4_OPTIONS: { id: string; labelAr: string; isActionable: boolean }[] = [
  { id: 'breath_step', labelAr: 'تنفسي العميق وخطوتي الصغيرة الحاضرة', isActionable: true },
  { id: 'yesterday_regret', labelAr: 'تغيير أحداث الأمس التي مضت وانقضت', isActionable: false },
  { id: 'honest_boundary', labelAr: 'رسم حدودي بوضوح ولطف لحماية طاقتي', isActionable: true },
  { id: 'others_reactions', labelAr: 'إجبار الآخرين على الرضا التام عني دائماً', isActionable: false },
  { id: 'ask_support', labelAr: 'طلب المساندة الصادقة حين يثقل الحمل', isActionable: true },
];

export function submitGrandFinaleStep(
  input: GrandFinaleStepInput,
  onAddXP?: (amount: number) => void
): {
  correct: boolean;
  feedbackAr: string;
  completedFinaleNow: boolean;
  state: MovingIslandSaveState;
} {
  const state = loadMovingIslandState();
  const readiness = checkGrandFinaleReadiness(state);

  if (!readiness.isReady && !state.finaleCompleted) {
    return {
      correct: false,
      feedbackAr: readiness.missingRequirementsAr[0] || 'لم تكتمل متطلبات اللغز الختامي بعد.',
      completedFinaleNow: false,
      state,
    };
  }

  let isCorrect = false;
  let feedbackAr = '';

  if (input.step === 1) {
    const expected: IslandRegionId[] = [
      'cipher-valley',
      'balance-bridge',
      'vials-garden',
      'order-library',
      'choice-gate',
      'secrets-mountain',
    ];
    isCorrect =
      input.orderedRegions.length === 6 &&
      input.orderedRegions.every((r, idx) => r === expected[idx]);
    feedbackAr = isCorrect
      ? 'أحسنت! انتظمت أختام المناطق الست في مدار واحد متوهج.'
      : 'ترتيب الأختام الستة غير متسق مع مسار الرحلة؛ راجع كيف مهّدت كل منطقة للمنطقة التي تليها.';
  } else if (input.step === 2) {
    const expected = [4, 1, 3, 2];
    isCorrect = input.pins.every((val, idx) => val === expected[idx]);
    feedbackAr = isCorrect
      ? 'استقر وتد المنشور على تردد ٤-١-٣-٢ دون أي اهتزاز!'
      : 'التردد غير مطابق لنقش وادي الشفرات؛ تحقّق من الأرقام الأربعة في دفتر الأدلة.';
  } else if (input.step === 3) {
    isCorrect =
      input.shelves.top === 'gold' &&
      input.shelves.middle === 'blue' &&
      input.shelves.bottom === 'green';
    feedbackAr = isCorrect
      ? 'تناغم طيف القوارير مع رفوف المكتبة الثلاثة وأضاء قلب القاعة!'
      : 'توزيع الخلاصات على الرفوف يحتاج مراجعة؛ طابق كل لون بطبقته في ميثاق المكتبة.';
  } else if (input.step === 4) {
    const expectedIds = ['breath_step', 'honest_boundary', 'ask_support'];
    const selectedSet = new Set(input.selectedAnchorIds);
    isCorrect =
      selectedSet.size === 3 && expectedIds.every((id) => selectedSet.has(id));
    feedbackAr = isCorrect
      ? 'انكسر الغلاف الصخري الأخير وأشرق «منشور نسمة المتوهج» في قمة الجزيرة!'
      : 'اختر الأفعال الثلاثة التي تقع في يدك فعلياً فقط، دون التمسك بما هو خارج سيطرتك.';
  }

  if (!isCorrect) {
    state.finaleAttempts += 1;
    saveMovingIslandState(state);
    return {
      correct: false,
      feedbackAr,
      completedFinaleNow: false,
      state,
    };
  }

  let completedFinaleNow = false;
  if (input.step < 4) {
    state.finaleCurrentStep = (input.step + 1) as 2 | 3 | 4;
  } else {
    if (!state.finaleCompleted) {
      completedFinaleNow = true;
      state.finaleCompleted = true;
      state.finaleCompletedAt = new Date().toISOString();
      state.worldMutations.finaleSanctuaryUnlocked = true;
      if (!state.relicIds.includes('island_heart_prism')) {
        state.relicIds.push('island_heart_prism');
      }
      const bonus = ISLAND_RELICS.island_heart_prism.xpBonus;
      state.totalIslandXP += bonus;
      if (onAddXP) {
        onAddXP(bonus);
      }
    }
  }

  saveMovingIslandState(state);
  return {
    correct: true,
    feedbackAr,
    completedFinaleNow,
    state,
  };
}

export function recordFinaleHintUsed(): MovingIslandSaveState {
  const state = loadMovingIslandState();
  state.finaleHintsUsed += 1;
  saveMovingIslandState(state);
  return state;
}

export function selectAndVisitIslandRegion(regionId: IslandRegionId): MovingIslandSaveState {
  const state = loadMovingIslandState();
  const unlocked = computeUnlockedRegions(state);
  if (!unlocked.includes(regionId)) {
    return state;
  }
  state.selectedRegionId = regionId;
  if (!state.visitedRegions.includes(regionId)) {
    state.visitedRegions.push(regionId);
  }
  saveMovingIslandState(state);
  return state;
}

// ============================================================================
// Optional Non-Punitive Rotating Island Quests
// ============================================================================

export function getCurrentQuestCycleId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
  // 3-day calm rotation cycle — offline deterministic, never punishes missed days
  const cycleNum = Math.floor(dayOfYear / 3) + 1;
  return `${year}-C${cycleNum}`;
}

export interface EvaluatedIslandQuest {
  id: string;
  cycleKey: string;
  titleAr: string;
  descriptionAr: string;
  rewardXP: number;
  currentCount: number;
  targetCount: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export function getEvaluatedRotatingQuests(
  state?: MovingIslandSaveState,
  snapshot?: SixGamesSnapshot
): EvaluatedIslandQuest[] {
  const st = state || loadMovingIslandState();
  const snap = snapshot || readAllSixGamesSnapshot();
  const cycleId = getCurrentQuestCycleId();

  //Count distinct games that have at least 1 claimed challenge on the island
  const distinctGamesWithClaimed = new Set<string>();
  for (const cid of st.claimedChallengeIds) {
    const ch = ISLAND_CHALLENGES.find((c) => c.id === cid);
    if (ch?.verification.kind === 'game_stage') {
      distinctGamesWithClaimed.add(ch.verification.gameId);
    }
  }

  const cipherZeroHintCount = snap.cipher.completedLevels.filter((lvlId) => {
    const h = snap.cipher.hintsUsedCount[lvlId];
    const stars = snap.cipher.levelStars[lvlId] || 0;
    return h !== undefined ? h === 0 : stars >= 3;
  }).length;

  const secretPathsCount = [
    st.worldMutations.alternateShortcutActive,
    st.worldMutations.hiddenCoveRevealed,
    st.worldMutations.treasureVaultOpened,
  ].filter(Boolean).length;

  const fullSetsCount = ALL_COLLECTIBLE_TYPES.filter(
    (t) => (st.collectibles[t] || 0) >= COLLECTIBLES_CATALOG[t].totalCount
  ).length;

  return ROTATING_ISLAND_QUESTS.map((q) => {
    let currentCount = 0;
    switch (q.category) {
      case 'discover_clue':
        currentCount = st.discoveredClueIds.length;
        break;
      case 'cipher_low_hints':
        currentCount = cipherZeroHintCount;
        break;
      case 'two_games_combo':
        currentCount = distinctGamesWithClaimed.size;
        break;
      case 'unlock_secret_path':
        currentCount = secretPathsCount;
        break;
      case 'complete_collectible_set':
        currentCount = fullSetsCount;
        break;
    }

    const cycleKey = `${cycleId}:${q.id}`;
    const isClaimed = st.claimedQuestKeys.includes(cycleKey);
    const isCompleted = currentCount >= q.targetCount;

    return {
      id: q.id,
      cycleKey,
      titleAr: q.titleAr,
      descriptionAr: q.descriptionAr,
      rewardXP: q.rewardXP,
      currentCount: Math.min(q.targetCount, currentCount),
      targetCount: q.targetCount,
      isCompleted,
      isClaimed,
    };
  });
}

export function claimRotatingIslandQuest(
  questId: string,
  onAddXP?: (amount: number) => void
): { claimed: boolean; xpAwarded: number; state: MovingIslandSaveState } {
  const state = loadMovingIslandState();
  const quests = getEvaluatedRotatingQuests(state);
  const target = quests.find((q) => q.id === questId);

  if (!target || !target.isCompleted || target.isClaimed) {
    return { claimed: false, xpAwarded: 0, state };
  }

  state.claimedQuestKeys.push(target.cycleKey);
  state.totalIslandXP += target.rewardXP;
  saveMovingIslandState(state);

  if (onAddXP) {
    onAddXP(target.rewardXP);
  }

  return { claimed: true, xpAwarded: target.rewardXP, state };
}

/**
 * Prepare target stage in the linked game before navigating so the player opens right on the relevant stage.
 */
export function prepareGameStageForIslandMission(
  gameId: IslandCoreGameId,
  targetStage?: number
): number | undefined {
  if (!targetStage || targetStage < 1) return undefined;
  if (gameId === 'nesma-cipher') {
    const cipherProg = loadCipherProgress();
    if (cipherProg.unlockedLevels.includes(targetStage)) {
      return targetStage;
    }
    const maxUnlocked = Math.max(...cipherProg.unlockedLevels, 1);
    return maxUnlocked;
  }

  try {
    const prog = getGameLevelProgress(gameId);
    if (prog.unlockedStages.includes(targetStage)) {
      setActiveStage(gameId, targetStage);
      return targetStage;
    }
    const highestUnlocked = Math.max(...prog.unlockedStages, 1);
    setActiveStage(gameId, highestUnlocked);
    return highestUnlocked;
  } catch {
    return 1;
  }
}

/**
 * Gather a personalized accomplishment summary across all 6 games for the Ending Sanctuary scene.
 */
export function buildEndingAccomplishmentSummary(
  state?: MovingIslandSaveState,
  snapshot?: SixGamesSnapshot
) {
  const st = state || loadMovingIslandState();
  const snap = snapshot || readAllSixGamesSnapshot();

  const countCompleted = (p: GameProgressData) =>
    Object.values(p.stars).filter((s) => s > 0).length;

  const totalCollectibles = ALL_COLLECTIBLE_TYPES.reduce(
    (sum, t) => sum + (st.collectibles[t] || 0),
    0
  );

  return {
    cipherLevelsSolved: snap.cipher.completedLevels.length,
    cipherQuotesFound: snap.cipher.discoveredQuotes.length,
    zenStagesBalanced: countCompleted(snap.zenPuzzle),
    vialsStagesPurified: countCompleted(snap.emotionSort),
    libraryStagesHarmonized: countCompleted(snap.mindfulOrganizer),
    choiceStagesSorted: countCompleted(snap.handsControl),
    mountainStagesBroken: countCompleted(snap.breakMountain),
    challengesClaimed: st.claimedChallengeIds.length,
    totalChallenges: ISLAND_CHALLENGES.length,
    totalCollectibles,
    maxCollectibles: 24,
    cluesDiscovered: st.discoveredClueIds.length,
    relicsEarned: st.relicIds.length,
    islandXPEarned: st.totalIslandXP,
    finaleAttempts: st.finaleAttempts,
  };
}
