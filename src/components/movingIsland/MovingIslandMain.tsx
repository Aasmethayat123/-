import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Gem,
  KeyRound,
  Lock,
  Map as MapIcon,
  Play,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  Unlock,
} from 'lucide-react';
import { Language } from '../../types';
import {
  COLLECTIBLES_CATALOG,
  ISLAND_CHALLENGES,
  ISLAND_CLUES,
  ISLAND_REGIONS,
  ISLAND_RELICS,
  IslandChallengeDef,
  IslandCollectibleType,
  IslandCoreGameId,
  IslandRegionDef,
  IslandRegionId,
  MAP_CONNECTIONS,
} from '../../data/movingIslandData';
import {
  canOpenIslandPuzzle,
  checkGrandFinaleReadiness,
  claimRotatingIslandQuest,
  computeUnlockedRegions,
  getEvaluatedRotatingQuests,
  IslandSyncNotification,
  loadMovingIslandState,
  MovingIslandSaveState,
  prepareGameStageForIslandMission,
  readAllSixGamesSnapshot,
  selectAndVisitIslandRegion,
  syncIslandWithGames,
} from '../../utils/movingIslandManager';
import { soundManager } from '../../utils/audio';
import { IslandInterconnectedPuzzleModal } from './IslandInterconnectedPuzzleModal';
import { IslandGrandFinaleModal } from './IslandGrandFinaleModal';
import { SectionGuideBanner } from '../common/SectionGuideBanner';

export interface ActiveIslandMissionContext {
  challengeId: string;
  challengeNumber: number;
  titleAr: string;
  howToCompleteAr: string;
  gameId: IslandCoreGameId;
  targetStage?: number;
}

interface MovingIslandMainProps {
  language: Language;
  onBack: () => void;
  onLaunchLinkedGame: (
    gameId: IslandCoreGameId,
    targetStage?: number,
    mission?: ActiveIslandMissionContext
  ) => void;
  onAddXP?: (amount: number) => void;
}

type IslandTab = 'map' | 'vault' | 'quests';

const COLLECTIBLE_KEYS: IslandCollectibleType[] = [
  'cipher_shard',
  'balance_crystal',
  'garden_seed',
  'library_key',
  'choice_stone',
  'mountain_fragment',
];

export const MovingIslandMain: React.FC<MovingIslandMainProps> = ({
  language,
  onBack,
  onLaunchLinkedGame,
  onAddXP,
}) => {
  const [activeTab, setActiveTab] = useState<IslandTab>('map');
  const [islandState, setIslandState] = useState<MovingIslandSaveState>(() =>
    loadMovingIslandState()
  );
  const [syncBanner, setSyncBanner] = useState<IslandSyncNotification | null>(null);
  const [inspectedLockedRegion, setInspectedLockedRegion] = useState<IslandRegionDef | null>(null);
  const [activePuzzleChallenge, setActivePuzzleChallenge] = useState<IslandChallengeDef | null>(
    null
  );
  const [isFinaleModalOpen, setIsFinaleModalOpen] = useState(false);
  const [hadStorageWarning, setHadStorageWarning] = useState(false);

  // Sync automatically on mount to capture any progress earned in the 6 games
  useEffect(() => {
    const snap = readAllSixGamesSnapshot();
    if (snap.hadReadError) {
      setHadStorageWarning(true);
    }
    const { state, notification } = syncIslandWithGames(onAddXP);
    setIslandState(state);
    if (
      notification.newlyClaimedChallenges.length > 0 ||
      notification.newlyUnlockedRegions.length > 0 ||
      notification.newWorldMutations.length > 0
    ) {
      setSyncBanner(notification);
    }
  }, []);

  const snapshot = readAllSixGamesSnapshot();
  const unlockedRegions = computeUnlockedRegions(islandState, snapshot);
  const finaleReadiness = checkGrandFinaleReadiness(islandState, snapshot);
  const rotatingQuests = getEvaluatedRotatingQuests(islandState, snapshot);

  const selectedRegion =
    ISLAND_REGIONS.find((r) => r.id === islandState.selectedRegionId) || ISLAND_REGIONS[0];

  const regionChallenges = ISLAND_CHALLENGES.filter(
    (c) => c.regionId === selectedRegion.id
  );

  const totalCollectiblesOwned = COLLECTIBLE_KEYS.reduce(
    (sum, k) => sum + (islandState.collectibles[k] || 0),
    0
  );

  const handleRegionClick = (region: IslandRegionDef) => {
    soundManager.playSoftTap();
    if (unlockedRegions.includes(region.id)) {
      setInspectedLockedRegion(null);
      const next = selectAndVisitIslandRegion(region.id);
      setIslandState(next);
      if (region.isFinaleRegion) {
        setIsFinaleModalOpen(true);
      }
    } else {
      setInspectedLockedRegion(region);
    }
  };

  const handleLaunchChallengeGame = (challenge: IslandChallengeDef) => {
    if (challenge.verification.kind !== 'game_stage') return;
    soundManager.playClick();
    const gId = challenge.verification.gameId;
    const preparedStage = prepareGameStageForIslandMission(gId, challenge.targetStageOrLevel);
    onLaunchLinkedGame(gId, preparedStage, {
      challengeId: challenge.id,
      challengeNumber: challenge.number,
      titleAr: challenge.titleAr,
      howToCompleteAr: challenge.howToCompleteAr,
      gameId: gId,
      targetStage: preparedStage,
    });
  };

  const handleLaunchRegionGameDirect = (gameId: IslandCoreGameId) => {
    soundManager.playClick();
    // Pick next unclaimed game challenge in this region if any
    const nextUnclaimed = ISLAND_CHALLENGES.find(
      (c) =>
        c.verification.kind === 'game_stage' &&
        c.verification.gameId === gameId &&
        !islandState.claimedChallengeIds.includes(c.id)
    );
    if (nextUnclaimed) {
      handleLaunchChallengeGame(nextUnclaimed);
    } else {
      onLaunchLinkedGame(gameId, undefined, undefined);
    }
  };

  const handleManualSync = () => {
    soundManager.playSoftTap();
    const { state, notification } = syncIslandWithGames(onAddXP);
    setIslandState(state);
    if (notification.newlyClaimedChallenges.length > 0) {
      setSyncBanner(notification);
    }
  };

  const handleClaimQuest = (questId: string) => {
    const res = claimRotatingIslandQuest(questId, onAddXP);
    if (res.claimed) {
      soundManager.playLevelUpFanfare();
      setIslandState(res.state);
    }
  };

  const getMutationLabelAr = (key: keyof MovingIslandSaveState['worldMutations']): string => {
    switch (key) {
      case 'bridgeRepaired':
        return 'إصلاح جسر التوازن المعلّق وفتح العبور المباشر';
      case 'alternateShortcutActive':
        return 'ظهور المسار المختصر المتوهج عبر البحيرة';
      case 'dualGateOpened':
        return 'انفتاح البوابة المزدوجة لمكتبة النظام';
      case 'hiddenCoveRevealed':
        return 'انقشاع الضباب وكشف مرصد الضباب الخفي';
      case 'treasureVaultOpened':
        return 'فتح الأقفال الثلاثة لغرفة الكنوز المفقودة';
      case 'finaleSanctuaryUnlocked':
        return 'إضاءة معبد البصيرة الأسمى وتتويج الجزيرة';
    }
  };

  // Compute clear, non-technical next-step guidance for the player from first entry to Grand Finale
  const nextGuidance = (() => {
    if (islandState.finaleCompleted) {
      const remainingCh = ISLAND_CHALLENGES.find(
        (c) =>
          unlockedRegions.includes(c.regionId) && !islandState.claimedChallengeIds.includes(c.id)
      );
      return {
        badgeAr: 'اكتملت الرحلة الكبرى',
        textAr: remainingCh
          ? `أضأتِ معبد البصيرة! يمكنكِ استكمال تحديات الاستكشاف المتبقية مثل «${remainingCh.titleAr}».`
          : 'أتممتِ جميع تحديات الجزيرة وأسرارها ومعبد البصيرة الأسمى بالكامل!',
        ctaAr: 'استعراض التتويج',
        onAction: () => setIsFinaleModalOpen(true),
      };
    }

    if (finaleReadiness.isReady) {
      return {
        badgeAr: 'أختام المعبد مكتملة!',
        textAr:
          'جمعتِ متطلبات الألعاب الست والأدلة الكافية — افتحي «معبد البصيرة الأسمى» الآن لبدء اللغز الختامي الكبير.',
        ctaAr: 'ابدأ اللغز الختامي الآن',
        onAction: () => setIsFinaleModalOpen(true),
      };
    }

    // First-time player (0 claimed challenges)
    const firstChallenge = ISLAND_CHALLENGES[0];
    if (islandState.claimedChallengeIds.length === 0 && firstChallenge) {
      return {
        badgeAr: 'نقطة البداية · الخطوة ١',
        textAr:
          'ابدأ رحلتك من «وادي الشفرات»: حل المرحلة ١ في لعبة «شفرة نسمة» للحصول على أول شظية شفرة وفتح مسار «جسر التوازن».',
        ctaAr: 'ابدأ التحدي الأول الآن',
        onAction: () => handleLaunchChallengeGame(firstChallenge),
      };
    }

    // Find next actionable unclaimed challenge in any unlocked region (prioritizing core path)
    const nextPlayableChallenge = ISLAND_CHALLENGES.find((ch) => {
      if (islandState.claimedChallengeIds.includes(ch.id)) return false;
      if (!unlockedRegions.includes(ch.regionId)) return false;
      if (ch.verification.kind === 'island_puzzle') {
        return canOpenIslandPuzzle(ch, islandState, unlockedRegions).allowed;
      }
      return true;
    });

    if (nextPlayableChallenge) {
      const reg = ISLAND_REGIONS.find((r) => r.id === nextPlayableChallenge.regionId);
      const isPuzzle = nextPlayableChallenge.verification.kind === 'island_puzzle';
      return {
        badgeAr: `هدفك التالي · ${reg?.nameAr || ''}`,
        textAr: `${nextPlayableChallenge.titleAr}: ${nextPlayableChallenge.howToCompleteAr}`,
        ctaAr: isPuzzle ? 'افتح آلية اللغز' : 'انطلق للمهمة الآن',
        onAction: () => {
          const next = selectAndVisitIslandRegion(nextPlayableChallenge.regionId);
          setIslandState(next);
          if (isPuzzle) {
            setActivePuzzleChallenge(nextPlayableChallenge);
          } else {
            handleLaunchChallengeGame(nextPlayableChallenge);
          }
        },
      };
    }

    return {
      badgeAr: 'تقدّم نحو المعبد',
      textAr: finaleReadiness.missingRequirementsAr[0] || 'استكشف المناطق المفتوحة لجمع الأدلة المتبقية.',
      ctaAr: 'عرض متطلبات المعبد',
      onAction: () => setIsFinaleModalOpen(true),
    };
  })();

  const getPrerequisiteRegionForLocked = (lockedId: IslandRegionId): IslandRegionId => {
    switch (lockedId) {
      case 'balance-bridge':
        return 'cipher-valley';
      case 'vials-garden':
        return unlockedRegions.includes('balance-bridge') ? 'balance-bridge' : 'cipher-valley';
      case 'order-library':
        return unlockedRegions.includes('vials-garden') ? 'vials-garden' : 'balance-bridge';
      case 'choice-gate':
        return unlockedRegions.includes('order-library') ? 'order-library' : 'vials-garden';
      case 'secrets-mountain':
        return unlockedRegions.includes('choice-gate') ? 'choice-gate' : 'order-library';
      case 'hidden-observatory':
      case 'treasure-vault':
        return !islandState.discoveredClueIds.includes('clue_cipher_code')
          ? 'cipher-valley'
          : unlockedRegions.includes('vials-garden')
          ? 'vials-garden'
          : 'balance-bridge';
      default:
        return 'cipher-valley';
    }
  };

  return (
    <div
      className="max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-7 space-y-6 select-none"
      dir="rtl"
    >
      {/* Top Hero Header & Global Island Progress HUD */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900 text-white p-4 sm:p-7 border border-emerald-800/60 shadow-xl space-y-3.5 sm:space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>مغامرة موحّدة تربط ٦ ألعاب في عالم حيّ متغير</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black font-serif text-white tracking-tight leading-snug">
              جزيرة الأسرار المتحركة — رحلة اكتشاف ما وراء الألغاز
            </h1>
            <p className="text-sm sm:text-base text-stone-200 max-w-2xl leading-relaxed">
              كل إنجاز تحققه داخل الألعاب الست يغيّر تضاريس الجزيرة، يصلح جسورها، يبدّد ضبابها، ويمنحك مفاتيح وأدلة تقودك نحو اللغز الختامي الكبير.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              type="button"
              onClick={handleManualSync}
              className="min-h-10 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-stone-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="تحديث التقدم من الألعاب الست"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-300" />
              <span>مزامنة</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playSoftTap();
                onBack();
              }}
              className="min-h-10 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>عودة</span>
            </button>
          </div>
        </div>

        {/* Clean 4-Metric Progress Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-stone-400 block">المناطق المفتوحة</span>
            <span dir="ltr" className="inline-block text-base sm:text-lg font-black text-emerald-300 tabular-nums">
              {unlockedRegions.length} / {ISLAND_REGIONS.length}
            </span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-stone-400 block">التحديات المترابطة</span>
            <span dir="ltr" className="inline-block text-base sm:text-lg font-black text-amber-300 tabular-nums">
              {islandState.claimedChallengeIds.length} / {ISLAND_CHALLENGES.length}
            </span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-stone-400 block">مقتنيات الجزيرة</span>
            <span dir="ltr" className="inline-block text-base sm:text-lg font-black text-sky-300 tabular-nums">
              {totalCollectiblesOwned} / 24
            </span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-stone-400 block">الأدلة والآثار</span>
            <span className="text-sm sm:text-lg font-black text-purple-300 tabular-nums">
              {islandState.discoveredClueIds.length}/6 أدلة · {islandState.relicIds.length}/3 آثار
            </span>
          </div>
        </div>

        {/* Navigation Tabs + Finale Button */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 bg-stone-950/60 p-1 sm:p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto">
            {[
              { id: 'map' as const, label: 'خريطة الجزيرة والمناطق', shortLabel: 'الخريطة', icon: MapIcon },
              { id: 'vault' as const, label: 'المقتنيات ودفتر الأدلة', shortLabel: 'المقتنيات', icon: Gem },
              { id: 'quests' as const, label: 'مهام الجزيرة المتجددة', shortLabel: 'المهام', icon: Target },
            ].map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-label={t.label}
                  onClick={() => {
                    soundManager.playSoftTap();
                    setActiveTab(t.id);
                  }}
                  className={`min-h-10 px-2 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-extrabold flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="sm:hidden">{t.shortLabel}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.playChime();
              setIsFinaleModalOpen(true);
            }}
            className={`min-h-11 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-md ${
              islandState.finaleCompleted
                ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950'
                : finaleReadiness.isReady
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                : 'bg-stone-800 hover:bg-stone-700 text-amber-200 border border-amber-500/40'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>
              {islandState.finaleCompleted
                ? 'مشهد التتويج ومعبد البصيرة'
                : finaleReadiness.isReady
                ? 'افتح اللغز الختامي الكبير الآن!'
                : `اللغز الختامي (${finaleReadiness.completedGamesCount}/6 ألعاب)`}
            </span>
          </button>
        </div>
      </div>

      {/* Section Guide Banner */}
      <SectionGuideBanner sectionId="moving-island" language={language} />

      {/* Friendly Storage Diagnostic Warning if corrupted external key recovered */}
      {hadStorageWarning && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>تم التحقق من سلامة البيانات المحلية واستعادة حالة الجزيرة بأمان دون فقدان أي تقدم.</span>
          </div>
          <button
            type="button"
            onClick={() => setHadStorageWarning(false)}
            className="text-xs font-extrabold underline cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Newly Synced Discoveries Celebration Banner */}
      {syncBanner && (
        <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 dark:border-emerald-700 space-y-2.5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-black text-sm">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>تغيّرت معالم الجزيرة بفضل إنجازاتك الأخيرة! (+{syncBanner.xpAwarded} XP)</span>
            </div>
            <button
              type="button"
              onClick={() => setSyncBanner(null)}
              className="px-3 py-1 rounded-lg bg-emerald-200/70 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 text-xs font-bold cursor-pointer"
            >
              رائع
            </button>
          </div>

          <div className="space-y-1 text-xs text-emerald-900/90 dark:text-emerald-200/90 font-semibold">
            {syncBanner.newlyClaimedChallenges.map((ch) => (
              <p key={ch.id}>
                • اكتمل تحدي «{ch.titleAr}» — {ch.worldImpactAr}
              </p>
            ))}
            {syncBanner.newWorldMutations.map((m) => (
              <p key={m} className="text-amber-800 dark:text-amber-300 font-extrabold">
                ★ تحوّل في الجزيرة: {getMutationLabelAr(m)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 1: INTERACTIVE ISLAND MAP & REGION EXPEDITION                     */}
      {/* ===================================================================== */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          {/* Immediate Player Objective Strip (Clear Next Step Without Scrolling) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-emerald-500/40 dark:border-emerald-700/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                <Compass className="w-3.5 h-3.5" />
                <span>{nextGuidance.badgeAr}</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100 leading-relaxed">
                {nextGuidance.textAr}
              </p>
            </div>
            <button
              type="button"
              onClick={nextGuidance.onAction}
              className="min-h-11 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{nextGuidance.ctaAr}</span>
            </button>
          </div>

          {/* Interactive SVG Archipelago Map */}
          <div className="rounded-3xl bg-gradient-to-b from-sky-950 via-teal-950 to-stone-950 border-2 border-stone-800 shadow-xl overflow-hidden relative">
            {/* Subtle Map Legend Header */}
            <div className="px-4 py-3 bg-stone-950/70 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-300">
              <span className="font-bold text-stone-200">
                انقر على أي منطقة على الخريطة لاستكشاف تحدياتها أو معرفة سر فتحها:
              </span>
              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-300">
                  <Unlock className="w-3.5 h-3.5" /> مفتوحة
                </span>
                <span className="flex items-center gap-1 text-stone-400">
                  <Lock className="w-3.5 h-3.5" /> مغلقة بشرط
                </span>
                {islandState.worldMutations.bridgeRepaired && (
                  <span className="text-teal-300 font-bold">الجسر مُصلح ✓</span>
                )}
                {islandState.worldMutations.alternateShortcutActive && (
                  <span className="text-amber-300 font-bold">المسار المختصر نشط ✓</span>
                )}
                {islandState.worldMutations.hiddenCoveRevealed && (
                  <span className="text-indigo-300 font-bold">المرصد الخفي مكشوف ✓</span>
                )}
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 1000 600"
                className="w-full min-w-[680px] h-auto block"
                role="img"
                aria-label="خريطة جزيرة الأسرار المتحركة التفاعلية"
              >
                <defs>
                  <radialGradient id="seaGlow" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="#134e4a" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#0c0a09" stopOpacity="0.95" />
                  </radialGradient>
                  <linearGradient id="islandLand" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#292524" />
                    <stop offset="55%" stopColor="#1c1917" />
                    <stop offset="100%" stopColor="#0f2922" />
                  </linearGradient>
                  <linearGradient id="prismBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Sea Surface */}
                <rect x="0" y="0" width="1000" height="600" fill="url(#seaGlow)" />

                {/* Gentle Water Ripples */}
                <ellipse cx="260" cy="310" rx="95" ry="42" fill="#0f766e" fillOpacity="0.22" />
                <ellipse cx="500" cy="330" rx="390" ry="225" fill="none" stroke="#2dd4bf" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="8 10" />

                {/* Main Western & Central Landmass */}
                <path
                  d="M 85 480 Q 95 370 215 350 Q 285 340 330 390 Q 320 510 190 540 Q 100 540 85 480 Z"
                  fill="url(#islandLand)"
                  stroke="#57534e"
                  strokeWidth="3"
                />
                <path
                  d="M 275 215 Q 320 125 465 140 Q 595 95 725 130 Q 905 155 910 295 Q 890 465 720 495 Q 560 555 465 495 Q 425 415 385 370 Q 345 315 275 215 Z"
                  fill="url(#islandLand)"
                  stroke="#57534e"
                  strokeWidth="3"
                />

                {/* Northern Secret Observatory Islet */}
                <path
                  d="M 95 150 Q 145 90 225 115 Q 255 165 195 200 Q 115 205 95 150 Z"
                  fill="#1e1b4b"
                  stroke={islandState.worldMutations.hiddenCoveRevealed ? '#2dd4bf' : '#475569'}
                  strokeWidth="2.5"
                />

                {/* Finale Sanctuary Radiance when unlocked */}
                {islandState.worldMutations.finaleSanctuaryUnlocked && (
                  <polygon points="605,70 430,360 780,360" fill="url(#prismBeam)" />
                )}

                {/* Dynamic Connections & World State Paths */}
                {MAP_CONNECTIONS.map((conn) => {
                  const fromReg = ISLAND_REGIONS.find((r) => r.id === conn.from)!;
                  const toReg = ISLAND_REGIONS.find((r) => r.id === conn.to)!;

                  if (conn.style === 'shortcut') {
                    if (!islandState.worldMutations.alternateShortcutActive) {
                      return (
                        <g key={conn.id} opacity="0.28">
                          <path
                            d={`M ${fromReg.mapX} ${fromReg.mapY} Q 210 315 ${toReg.mapX} ${toReg.mapY}`}
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="2"
                            strokeDasharray="4 10"
                          />
                        </g>
                      );
                    }
                    return (
                      <g key={conn.id}>
                        <path
                          d={`M ${fromReg.mapX} ${fromReg.mapY} Q 210 315 ${toReg.mapX} ${toReg.mapY}`}
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="5"
                          strokeDasharray="10 6"
                        />
                        <text
                          x="220"
                          y="328"
                          fill="#fde68a"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          مسار مختصر نشط
                        </text>
                      </g>
                    );
                  }

                  if (conn.style === 'bridge') {
                    const midX = (fromReg.mapX + toReg.mapX) / 2;
                    const midY = (fromReg.mapY + toReg.mapY) / 2;
                    if (!islandState.worldMutations.bridgeRepaired) {
                      return (
                        <g key={conn.id}>
                          <line
                            x1={fromReg.mapX}
                            y1={fromReg.mapY}
                            x2={midX - 12}
                            y2={midY + 22}
                            stroke="#ef4444"
                            strokeWidth="4"
                            strokeDasharray="6 6"
                          />
                          <line
                            x1={midX + 12}
                            y1={midY - 22}
                            x2={toReg.mapX}
                            y2={toReg.mapY}
                            stroke="#ef4444"
                            strokeWidth="4"
                            strokeDasharray="6 6"
                          />
                          <rect
                            x={midX - 48}
                            y={midY - 13}
                            width="96"
                            height="24"
                            rx="8"
                            fill="#450a0a"
                            stroke="#f87171"
                            strokeWidth="1.5"
                          />
                          <text
                            x={midX}
                            y={midY + 4}
                            fill="#fecaca"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            جسر متصدع
                          </text>
                        </g>
                      );
                    }
                    return (
                      <g key={conn.id}>
                        <line
                          x1={fromReg.mapX}
                          y1={fromReg.mapY}
                          x2={toReg.mapX}
                          y2={toReg.mapY}
                          stroke="#14b8a6"
                          strokeWidth="8"
                        />
                        <line
                          x1={fromReg.mapX}
                          y1={fromReg.mapY}
                          x2={toReg.mapX}
                          y2={toReg.mapY}
                          stroke="#99f6e4"
                          strokeWidth="2"
                          strokeDasharray="8 4"
                        />
                      </g>
                    );
                  }

                  if (conn.style === 'secret_mist' && !islandState.worldMutations.hiddenCoveRevealed) {
                    return null;
                  }

                  const bothUnlocked =
                    unlockedRegions.includes(conn.from) && unlockedRegions.includes(conn.to);

                  return (
                    <line
                      key={conn.id}
                      x1={fromReg.mapX}
                      y1={fromReg.mapY}
                      x2={toReg.mapX}
                      y2={toReg.mapY}
                      stroke={bothUnlocked ? '#10b981' : '#57534e'}
                      strokeOpacity={bothUnlocked ? 0.85 : 0.45}
                      strokeWidth={bothUnlocked ? 4 : 2.5}
                      strokeDasharray={bothUnlocked ? undefined : '7 7'}
                    />
                  );
                })}

                {/* Fog Bank over Hidden Observatory when not yet revealed */}
                {!islandState.worldMutations.hiddenCoveRevealed && (
                  <g
                    onClick={() =>
                      handleRegionClick(
                        ISLAND_REGIONS.find((r) => r.id === 'hidden-observatory')!
                      )
                    }
                    className="cursor-pointer"
                  >
                    <ellipse cx="165" cy="145" rx="85" ry="50" fill="#cbd5e1" fillOpacity="0.28" />
                    <ellipse cx="185" cy="155" rx="68" ry="36" fill="#f1f5f9" fillOpacity="0.22" />
                    <text
                      x="165"
                      y="148"
                      fill="#e2e8f0"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ضباب كثيف (منطقة خفية)
                    </text>
                  </g>
                )}

                {/* Region Interactive Nodes */}
                {ISLAND_REGIONS.map((region) => {
                  const isUnlocked = unlockedRegions.includes(region.id);
                  const isSelected = selectedRegion.id === region.id;
                  const regChallenges = ISLAND_CHALLENGES.filter(
                    (c) => c.regionId === region.id
                  );
                  const doneInReg = regChallenges.filter((c) =>
                    islandState.claimedChallengeIds.includes(c.id)
                  ).length;

                  if (
                    region.id === 'hidden-observatory' &&
                    !islandState.worldMutations.hiddenCoveRevealed
                  ) {
                    return null;
                  }

                  return (
                    <g
                      key={region.id}
                      transform={`translate(${region.mapX}, ${region.mapY})`}
                      onClick={() => handleRegionClick(region)}
                      className="cursor-pointer"
                    >
                      {/* Selection Halo */}
                      {isSelected && (
                        <circle
                          r="38"
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="3.5"
                          strokeDasharray="6 4"
                        />
                      )}

                      {/* Node Circle */}
                      <circle
                        r="29"
                        fill={isUnlocked ? region.accentHex : '#292524'}
                        stroke={isSelected ? '#fde68a' : isUnlocked ? '#ecfdf5' : '#78716c'}
                        strokeWidth={isSelected ? '3.5' : '2.5'}
                      />

                      {/* Inner Status Text */}
                      <text
                        y="5"
                        fill="#ffffff"
                        fontSize="14"
                        fontWeight="900"
                        textAnchor="middle"
                      >
                        {!isUnlocked
                          ? '🔒'
                          : region.isFinaleRegion
                          ? islandState.finaleCompleted
                            ? '💠'
                            : '🏛️'
                          : region.id === 'treasure-vault'
                          ? '👑'
                          : `${doneInReg}/${regChallenges.length}`}
                      </text>

                      {/* Region Name Label Plate */}
                      <rect
                        x="-68"
                        y="35"
                        width="136"
                        height="24"
                        rx="8"
                        fill="#0c0a09"
                        fillOpacity="0.88"
                        stroke={isSelected ? '#fbbf24' : '#44403c'}
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="51"
                        fill={isUnlocked ? '#f5f5f4' : '#a8a29e'}
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {region.nameAr}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Mobile-Friendly Quick Region Selector Strip */}
            <div className="p-3 bg-stone-900/95 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
              {ISLAND_REGIONS.map((reg) => {
                const isUnlocked = unlockedRegions.includes(reg.id);
                const isSelected = selectedRegion.id === reg.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => handleRegionClick(reg)}
                    className={`min-h-11 px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-xs'
                        : isUnlocked
                        ? 'bg-stone-800 text-stone-100 border-stone-700 hover:bg-stone-700'
                        : 'bg-stone-950/70 text-stone-400 border-stone-800'
                    }`}
                  >
                    {isUnlocked ? (
                      <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    )}
                    <span>{reg.nameAr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Locked Region Explanation Card (when player clicks a locked node) */}
          {inspectedLockedRegion && (
            <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-black text-base">
                  <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>منطقة مغلقة حالياً: {inspectedLockedRegion.nameAr}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedLockedRegion(null)}
                  className="text-xs font-bold text-amber-800 dark:text-amber-300 underline cursor-pointer"
                >
                  إخفاء
                </button>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-100 font-bold">
                شرط الفتح: {inspectedLockedRegion.unlockRequirementSummaryAr}
              </p>
              <p className="text-xs text-amber-800/90 dark:text-amber-200/80">
                الأثر عند فتحها: {inspectedLockedRegion.worldEffectSummaryAr}
              </p>
              <div className="pt-1">
                {inspectedLockedRegion.isFinaleRegion ? (
                  <button
                    type="button"
                    onClick={() => {
                      setInspectedLockedRegion(null);
                      setIsFinaleModalOpen(true);
                    }}
                    className="min-h-10 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black cursor-pointer"
                  >
                    عرض قائمة متطلبات الأختام الستة
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const targetId = getPrerequisiteRegionForLocked(inspectedLockedRegion.id);
                      const next = selectAndVisitIslandRegion(targetId);
                      setIslandState(next);
                      setInspectedLockedRegion(null);
                    }}
                    className="min-h-10 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-black cursor-pointer"
                  >
                    انتقل إلى المنطقة الممهِّدة للفتح (
                    {ISLAND_REGIONS.find(
                      (r) => r.id === getPrerequisiteRegionForLocked(inspectedLockedRegion.id)
                    )?.nameAr || 'وادي الشفرات'}
                    )
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Selected Unlocked Region Expedition Panel */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
                    المنطقة المختارة · {selectedRegion.subtitleAr}
                  </span>
                  {selectedRegion.collectibleType && (
                    <span
                      className={`px-2.5 py-0.5 rounded-lg border text-xs font-extrabold ${
                        COLLECTIBLES_CATALOG[selectedRegion.collectibleType].badgeClass
                      }`}
                    >
                      {COLLECTIBLES_CATALOG[selectedRegion.collectibleType].icon}{' '}
                      {COLLECTIBLES_CATALOG[selectedRegion.collectibleType].nameAr}:{' '}
                      {islandState.collectibles[selectedRegion.collectibleType]}/4
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
                  {selectedRegion.nameAr}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
                  {selectedRegion.descriptionAr}
                </p>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  تأثير المنطقة في الجزيرة: {selectedRegion.worldEffectSummaryAr}
                </p>
              </div>

              {selectedRegion.linkedGameId && (
                <button
                  type="button"
                  onClick={() => handleLaunchRegionGameDirect(selectedRegion.linkedGameId!)}
                  className="min-h-12 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>ادخل «{selectedRegion.linkedGameNameAr}»</span>
                </button>
              )}

              {selectedRegion.isFinaleRegion && (
                <button
                  type="button"
                  onClick={() => setIsFinaleModalOpen(true)}
                  className="min-h-12 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-stone-950 text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md"
                >
                  <Award className="w-4 h-4" />
                  <span>
                    {islandState.finaleCompleted
                      ? 'استعراض مشهد التتويج'
                      : 'بدء اللغز الختامي الكبير'}
                  </span>
                </button>
              )}
            </div>

            {/* Special Treasure Vault Content */}
            {selectedRegion.id === 'treasure-vault' && (
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">👑</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-amber-950 dark:text-amber-200">
                      {ISLAND_RELICS.vault_crown_relic.nameAr} (مُستلم في خزانتك!)
                    </h3>
                    <p className="text-xs text-amber-900/90 dark:text-amber-200/80">
                      {ISLAND_RELICS.vault_crown_relic.descriptionAr}
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-amber-200 dark:border-amber-800 text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                  <strong>مخطوطة الخزنة الذهبية للغز الختامي:</strong> «تذكّر عند وقوفك في معبد البصيرة: الأختام الستة تتبع ترتيب رحلتك من الوادي للجبل، وأوتاد البوصلة تنبض بـ (٤-١-٣-٢)، والذهب يعلو الأزرق والأخضر، ولا يكسر الصخرة الأخيرة إلا ما في يدك الآن.»
                </div>
              </div>
            )}

            {/* Region Challenges Grid */}
            {regionChallenges.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-stone-800 dark:text-stone-200">
                  التحديات المترابطة في هذه المنطقة ({regionChallenges.length}):
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {regionChallenges.map((ch) => {
                    const isClaimed = islandState.claimedChallengeIds.includes(ch.id);
                    const isIslandPuzzle = ch.verification.kind === 'island_puzzle';
                    const puzzleAccess = isIslandPuzzle
                      ? canOpenIslandPuzzle(ch, islandState, unlockedRegions)
                      : { allowed: true, missingReasonsAr: [] };
                    const rewardCol = ch.rewardCollectible
                      ? COLLECTIBLES_CATALOG[ch.rewardCollectible]
                      : null;
                    const rewardClue = ch.rewardClueId ? ISLAND_CLUES[ch.rewardClueId] : null;

                    return (
                      <div
                        key={ch.id}
                        className={`rounded-2xl p-4 sm:p-5 border flex flex-col justify-between gap-4 transition-all ${
                          isClaimed
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/70'
                            : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                              تحدي #{ch.number} · +{ch.rewardXP} XP
                            </span>
                            {isClaimed ? (
                              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>مكتمل ومُحتسب</span>
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                                {isIslandPuzzle ? 'لغز آلية على الجزيرة' : 'مهمة داخل اللعبة'}
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-black text-stone-900 dark:text-stone-100">
                            {ch.titleAr}
                          </h4>
                          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                            {ch.descriptionAr}
                          </p>

                          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs space-y-1">
                            <p className="font-bold text-stone-800 dark:text-stone-200">
                              المطلوب: {ch.howToCompleteAr}
                            </p>
                            <p className="text-stone-500 dark:text-stone-400">
                              الأثر والمكافأة:{' '}
                              {rewardCol ? `${rewardCol.icon} ${rewardCol.singularAr} · ` : ''}
                              {rewardClue ? `📜 دليل «${rewardClue.titleAr}» · ` : ''}
                              {ch.worldImpactAr}
                            </p>
                          </div>

                          {!isClaimed && isIslandPuzzle && !puzzleAccess.allowed && (
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] font-bold text-amber-900 dark:text-amber-200">
                              متطلبات التفعيل: {puzzleAccess.missingReasonsAr.join(' ')}
                            </div>
                          )}
                        </div>

                        <div className="pt-1">
                          {isIslandPuzzle ? (
                            <button
                              type="button"
                              disabled={!puzzleAccess.allowed}
                              onClick={() => {
                                soundManager.playSoftTap();
                                setActivePuzzleChallenge(ch);
                              }}
                              className={`w-full min-h-11 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                                !puzzleAccess.allowed
                                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                                  : isClaimed
                                  ? 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 cursor-pointer'
                                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer shadow-xs'
                              }`}
                            >
                              <KeyRound className="w-4 h-4" />
                              <span>
                                {isClaimed
                                  ? 'استعراض الآلية المحلولة (بدون تكرار المكافأة)'
                                  : puzzleAccess.allowed
                                  ? 'افتح الآلية التفاعلية وحل اللغز'
                                  : 'اجمع المتطلبات أولاً'}
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleLaunchChallengeGame(ch)}
                              className={`w-full min-h-11 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                                isClaimed
                                  ? 'bg-stone-200/80 hover:bg-stone-300 dark:bg-stone-800 text-stone-700 dark:text-stone-200'
                                  : 'bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-xs'
                              }`}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>
                                {isClaimed
                                  ? 'إعادة اللعب للتدريب (المكافأة مستلمة)'
                                  : 'انطلق للمرحلة المرتبطة الآن'}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: COLLECTIBLES VAULT, RELICS & CLUES JOURNAL                     */}
      {/* ===================================================================== */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          {/* 6 Core Collectible Categories */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-7 space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 font-serif">
                خزانة المقتنيات الوظيفية ({totalCollectiblesOwned} / 24)
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                كل مقتنى هنا أداة فعلية تفتح منطقة، أو تصلح جسراً، أو تفعّل آلية مترابطة على الجزيرة:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COLLECTIBLE_KEYS.map((key) => {
                const meta = COLLECTIBLES_CATALOG[key];
                const owned = islandState.collectibles[key] || 0;
                const missing = meta.totalCount - owned;

                return (
                  <div
                    key={key}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{meta.icon}</span>
                          <h3 className="text-sm font-black text-stone-900 dark:text-stone-100">
                            {meta.nameAr}
                          </h3>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-black ${meta.badgeClass}`}>
                          {owned} / {meta.totalCount}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {meta.purposeAr}
                      </p>
                      <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                        ما يفتحه: {meta.unlocksSummaryAr}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-700">
                      <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${(owned / meta.totalCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block">
                        {missing === 0
                          ? 'اكتملت الفئة بالكامل!'
                          : `ينقصك ${missing} قطع من منطقة «${
                              ISLAND_REGIONS.find((r) => r.id === meta.sourceRegionId)?.nameAr
                            }»`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clues Journal */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-7 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 font-serif">
                دفتر الأدلة والرموز المكتشفة ({islandState.discoveredClueIds.length} / 6)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(ISLAND_CLUES).map((clue) => {
                const discovered = islandState.discoveredClueIds.includes(clue.id);
                const reg = ISLAND_REGIONS.find((r) => r.id === clue.sourceRegionId);
                return (
                  <div
                    key={clue.id}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      discovered
                        ? 'bg-amber-50/60 dark:bg-amber-950/25 border-amber-300 dark:border-amber-800'
                        : 'bg-stone-100/70 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-stone-900 dark:text-stone-100">
                        {discovered ? `📜 ${clue.titleAr}` : '🔒 دليل غامض لم يُكشف بعد'}
                      </span>
                      <span className="text-[11px] font-bold text-stone-500">
                        {reg?.nameAr}
                      </span>
                    </div>
                    {discovered ? (
                      <>
                        <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-800 text-xs font-black text-emerald-700 dark:text-emerald-300">
                          الشفرة / القاعدة: {clue.codeDisplay}
                        </div>
                        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                          {clue.summaryAr}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        أكمل تحدي الإتقان في منطقة «{reg?.nameAr}» لاستخراج هذا الدليل.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legendary Relics */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-7 space-y-4">
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 font-serif">
              الآثار النادرة وأوسمة الجزيرة ({islandState.relicIds.length} / 3)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(ISLAND_RELICS).map((relic) => {
                const owned = islandState.relicIds.includes(relic.id);
                return (
                  <div
                    key={relic.id}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      owned
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700'
                        : 'bg-stone-100 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-70'
                    }`}
                  >
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                      {owned ? 'مُكتسب في خزانتك ✓' : `المصدر: ${relic.sourceAr}`}
                    </span>
                    <h3 className="text-sm font-black text-stone-900 dark:text-stone-100">
                      {relic.nameAr}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {owned
                        ? relic.descriptionAr
                        : 'أكمل المصدر المرتبط بهذا الأثر لفتحه وإضافته لخزانتك الدائمة.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: OPTIONAL NON-PUNITIVE ROTATING ISLAND QUESTS                   */}
      {/* ===================================================================== */}
      {activeTab === 'quests' && (
        <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-7 space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 font-serif">
              مهام الجزيرة المتجددة (اختيارية وبلا عقوبات)
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              مهام هادئة تمنحك نقاط خبرة إضافية عند العودة والاستكشاف، ولا تغلق أي منطقة أو تسحب أي مقتنى عند غيابك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rotatingQuests.map((q) => (
              <div
                key={q.id}
                className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex flex-col justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-extrabold">
                      +{q.rewardXP} XP
                    </span>
                    {q.isClaimed && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> تم الاستلام
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100">
                    {q.titleAr}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {q.descriptionAr}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                    <span>التقدم الحالي</span>
                    <span>
                      {q.currentCount} / {q.targetCount}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (q.currentCount / q.targetCount) * 100)}%`,
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={!q.isCompleted || q.isClaimed}
                    onClick={() => handleClaimQuest(q.id)}
                    className={`w-full min-h-11 py-2 rounded-xl text-xs font-black transition-all ${
                      q.isClaimed
                        ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                        : q.isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {q.isClaimed
                      ? 'تم استلام مكافأة هذه الدورة'
                      : q.isCompleted
                      ? 'استلم المكافأة الآن'
                      : 'قيد الاستكشاف'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Island Puzzle Modal */}
      {activePuzzleChallenge && (
        <IslandInterconnectedPuzzleModal
          challenge={activePuzzleChallenge}
          islandState={islandState}
          onClose={() => setActivePuzzleChallenge(null)}
          onSolved={(newState, notification) => {
            setIslandState(newState);
            if (notification && notification.newlyClaimedChallenges.length > 0) {
              setSyncBanner(notification);
            }
          }}
          onAddXP={onAddXP}
        />
      )}

      {/* Grand Finale Multi-Step Modal */}
      {isFinaleModalOpen && (
        <IslandGrandFinaleModal
          islandState={islandState}
          onClose={() => setIsFinaleModalOpen(false)}
          onStateUpdated={(st) => setIslandState(st)}
          onJumpToGame={(gId) => {
            setIsFinaleModalOpen(false);
            handleLaunchRegionGameDirect(gId);
          }}
          onAddXP={onAddXP}
        />
      )}
    </div>
  );
};
