import React, { useState, useEffect, Suspense, lazy } from 'react';
import { GameMode, Language } from './types';
import { Header } from './components/Header';
import { AdventureHome } from './components/AdventureHome';
import { BadgeCelebrationModal } from './components/BadgeCelebrationModal';
import { CrisisSafetyModal } from './components/CrisisSafetyModal';
import { AppUpdateAvailableToast, AppUpdateModal } from './components/AppUpdateModal';
import type { ActiveIslandMissionContext } from './components/movingIsland/MovingIslandMain';
import { ISLAND_CHALLENGES, IslandCoreGameId } from './data/movingIslandData';
import {
  isChallengeConditionMet,
  loadMovingIslandState,
  prepareGameStageForIslandMission,
  readAllSixGamesSnapshot,
} from './utils/movingIslandManager';
import { useGameState, wasStageCompletionJustEmitted } from './utils/gameState';
import { soundManager } from './utils/audio';
import { getInitialTheme, applyTheme, ThemeMode } from './utils/theme';
import { ALL_36_GAMES } from './data/gamesCatalog';
import { recordLastPlayedGame } from './utils/adventures';

// Lazy-loaded Views & Modals for fast, lightweight initial startup (all chunks are precached by PWA Service Worker for 100% offline play)
const GameMap = lazy(() => import('./components/GameMap').then((m) => ({ default: m.GameMap })));
const JourneyMode = lazy(() => import('./components/JourneyMode').then((m) => ({ default: m.JourneyMode })));
const SeparateThemGame = lazy(() => import('./components/SeparateThemGame').then((m) => ({ default: m.SeparateThemGame })));
const NameTheFeelingGame = lazy(() => import('./components/NameTheFeelingGame').then((m) => ({ default: m.NameTheFeelingGame })));
const ChangePerspectiveGame = lazy(() => import('./components/ChangePerspectiveGame').then((m) => ({ default: m.ChangePerspectiveGame })));
const BeforeYouReactGame = lazy(() => import('./components/BeforeYouReactGame').then((m) => ({ default: m.BeforeYouReactGame })));
const WorkshopMode = lazy(() => import('./components/WorkshopMode').then((m) => ({ default: m.WorkshopMode })));
const FinalScreen = lazy(() => import('./components/FinalScreen').then((m) => ({ default: m.FinalScreen })));

// 9 Core Nesma Hayat Games
const HandsControlGame = lazy(() => import('./components/nesmaGames/HandsControlGame').then((m) => ({ default: m.HandsControlGame })));
const ReframeSentenceGame = lazy(() => import('./components/nesmaGames/ReframeSentenceGame').then((m) => ({ default: m.ReframeSentenceGame })));
const BreakTheMountainGame = lazy(() => import('./components/nesmaGames/BreakTheMountainGame').then((m) => ({ default: m.BreakTheMountainGame })));
const BrainTrafficBubblesGame = lazy(() => import('./components/nesmaGames/BrainTrafficBubblesGame').then((m) => ({ default: m.BrainTrafficBubblesGame })));
const BoundariesCircleGame = lazy(() => import('./components/nesmaGames/BoundariesCircleGame').then((m) => ({ default: m.BoundariesCircleGame })));
const MandatoryGentleBreakGame = lazy(() => import('./components/nesmaGames/MandatoryGentleBreakGame').then((m) => ({ default: m.MandatoryGentleBreakGame })));
const FirstSentenceFamilyGame = lazy(() => import('./components/nesmaGames/FirstSentenceFamilyGame').then((m) => ({ default: m.FirstSentenceFamilyGame })));
const DistanceCirclesGame = lazy(() => import('./components/nesmaGames/DistanceCirclesGame').then((m) => ({ default: m.DistanceCirclesGame })));
const SmallLightHopeGame = lazy(() => import('./components/nesmaGames/SmallLightHopeGame').then((m) => ({ default: m.SmallLightHopeGame })));
const MyJourneyDrawer = lazy(() => import('./components/MyJourneyDrawer').then((m) => ({ default: m.MyJourneyDrawer })));

// Psychomotor Somatic Games
const ButterflyTapGame = lazy(() => import('./components/psychomotor/ButterflyTapGame').then((m) => ({ default: m.ButterflyTapGame })));
const SomaticShakeGame = lazy(() => import('./components/psychomotor/SomaticShakeGame').then((m) => ({ default: m.SomaticShakeGame })));
const PmrSqueezeGame = lazy(() => import('./components/psychomotor/PmrSqueezeGame').then((m) => ({ default: m.PmrSqueezeGame })));
const SensoryGroundingGame = lazy(() => import('./components/psychomotor/SensoryGroundingGame').then((m) => ({ default: m.SensoryGroundingGame })));
const InfinityFlowGame = lazy(() => import('./components/psychomotor/InfinityFlowGame').then((m) => ({ default: m.InfinityFlowGame })));
const BalloonBreathGame = lazy(() => import('./components/psychomotor/BalloonBreathGame').then((m) => ({ default: m.BalloonBreathGame })));

// Sections & Hubs
const DiscoverReadings = lazy(() => import('./components/DiscoverReadings').then((m) => ({ default: m.DiscoverReadings })));
const WeeklyPsychologicalSession = lazy(() => import('./components/WeeklyPsychologicalSession').then((m) => ({ default: m.WeeklyPsychologicalSession })));
const ProjectsHubView = lazy(() => import('./components/ProjectsHubView').then((m) => ({ default: m.ProjectsHubView })));
const ContentManagementView = lazy(() => import('./components/ContentManagementView').then((m) => ({ default: m.ContentManagementView })));

// Subconscious & Physical Gamified Games
const InsightCardsGame = lazy(() => import('./components/interactiveGames/InsightCardsGame').then((m) => ({ default: m.InsightCardsGame })));
const QuickScenariosGame = lazy(() => import('./components/interactiveGames/QuickScenariosGame').then((m) => ({ default: m.QuickScenariosGame })));
const VisualProjectionGame = lazy(() => import('./components/interactiveGames/VisualProjectionGame').then((m) => ({ default: m.VisualProjectionGame })));
const MicroChallenge30sGame = lazy(() => import('./components/interactiveGames/MicroChallenge30sGame').then((m) => ({ default: m.MicroChallenge30sGame })));
const DailyQuestCardsGame = lazy(() => import('./components/interactiveGames/DailyQuestCardsGame').then((m) => ({ default: m.DailyQuestCardsGame })));
const WisdomVaultView = lazy(() => import('./components/interactiveGames/WisdomVaultView').then((m) => ({ default: m.WisdomVaultView })));

// 6 Visceral & Tactile Psychological Games
const TouchAndBreakGame = lazy(() => import('./components/visceralGames/TouchAndBreakGame').then((m) => ({ default: m.TouchAndBreakGame })));
const BodyMotionChallengeGame = lazy(() => import('./components/visceralGames/BodyMotionChallengeGame').then((m) => ({ default: m.BodyMotionChallengeGame })));
const EmotionRouletteGame = lazy(() => import('./components/visceralGames/EmotionRouletteGame').then((m) => ({ default: m.EmotionRouletteGame })));
const ScratchToRevealGame = lazy(() => import('./components/visceralGames/ScratchToRevealGame').then((m) => ({ default: m.ScratchToRevealGame })));
const MultiSensoryQuestGame = lazy(() => import('./components/visceralGames/MultiSensoryQuestGame').then((m) => ({ default: m.MultiSensoryQuestGame })));
const SpeedLieDetectorGame = lazy(() => import('./components/visceralGames/SpeedLieDetectorGame').then((m) => ({ default: m.SpeedLieDetectorGame })));

// 4 Advanced Psychological Games
const DecisionalScalesGame = lazy(() => import('./components/interactiveGames/DecisionalScalesGame').then((m) => ({ default: m.DecisionalScalesGame })));
const ThoughtShredderGame = lazy(() => import('./components/interactiveGames/ThoughtShredderGame').then((m) => ({ default: m.ThoughtShredderGame })));
const CoreNeedsCompassGame = lazy(() => import('./components/interactiveGames/CoreNeedsCompassGame').then((m) => ({ default: m.CoreNeedsCompassGame })));
const InnerMirrorGame = lazy(() => import('./components/interactiveGames/InnerMirrorGame').then((m) => ({ default: m.InnerMirrorGame })));

// 4 Creative & Deep Interactive Experiences
const CognitiveReframingPuzzleGame = lazy(() => import('./components/interactiveGames/CognitiveReframingPuzzleGame').then((m) => ({ default: m.CognitiveReframingPuzzleGame })));
const InnerLabyrinthGame = lazy(() => import('./components/interactiveGames/InnerLabyrinthGame').then((m) => ({ default: m.InnerLabyrinthGame })));
const DigitalReleaseRitualGame = lazy(() => import('./components/interactiveGames/DigitalReleaseRitualGame').then((m) => ({ default: m.DigitalReleaseRitualGame })));
const RelationalEnergyMatrixGame = lazy(() => import('./components/interactiveGames/RelationalEnergyMatrixGame').then((m) => ({ default: m.RelationalEnergyMatrixGame })));

// 4 Innovative & Mindful Games
const ResonanceChamberGame = lazy(() => import('./components/interactiveGames/ResonanceChamberGame').then((m) => ({ default: m.ResonanceChamberGame })));
const MentalLoomGame = lazy(() => import('./components/interactiveGames/MentalLoomGame').then((m) => ({ default: m.MentalLoomGame })));
const WorrySandboxGame = lazy(() => import('./components/interactiveGames/WorrySandboxGame').then((m) => ({ default: m.WorrySandboxGame })));
const BloomingGratitudeGame = lazy(() => import('./components/interactiveGames/BloomingGratitudeGame').then((m) => ({ default: m.BloomingGratitudeGame })));

// Tactical, Organizing & Satisfying Puzzle Games + Hubs
const MindfulOrganizerGame = lazy(() => import('./components/interactiveGames/MindfulOrganizerGame').then((m) => ({ default: m.MindfulOrganizerGame })));
const ZenStonePuzzleGame = lazy(() => import('./components/interactiveGames/ZenStonePuzzleGame').then((m) => ({ default: m.ZenStonePuzzleGame })));
const EmotionSortPuzzleGame = lazy(() => import('./components/interactiveGames/EmotionSortPuzzleGame').then((m) => ({ default: m.EmotionSortPuzzleGame })));
const UnifiedGamesHub = lazy(() => import('./components/games/UnifiedGamesHub').then((m) => ({ default: m.UnifiedGamesHub })));
const NesmaCipherMain = lazy(() => import('./components/nesmaCipher/NesmaCipherMain').then((m) => ({ default: m.NesmaCipherMain })));
const MovingIslandMain = lazy(() => import('./components/movingIsland/MovingIslandMain').then((m) => ({ default: m.MovingIslandMain })));

// Lazy-loaded Modals (loaded on demand when opened)
const MindfulBreathingModal = lazy(() => import('./components/MindfulBreathingModal').then((m) => ({ default: m.MindfulBreathingModal })));
const AvatarModal = lazy(() => import('./components/AvatarModal').then((m) => ({ default: m.AvatarModal })));
const MinuteReflectionModal = lazy(() => import('./components/creative/MinuteReflectionModal').then((m) => ({ default: m.MinuteReflectionModal })));
const HiddenPathModal = lazy(() => import('./components/creative/HiddenPathModal').then((m) => ({ default: m.HiddenPathModal })));
const ExperienceMixerModal = lazy(() => import('./components/creative/ExperienceMixerModal').then((m) => ({ default: m.ExperienceMixerModal })));
const TechnicalAuditModal = lazy(() => import('./components/TechnicalAuditModal').then((m) => ({ default: m.TechnicalAuditModal })));
const AppShareModal = lazy(() => import('./components/AppShareModal').then((m) => ({ default: m.AppShareModal })));
const AppInstallModal = lazy(() => import('./components/AppInstallModal').then((m) => ({ default: m.AppInstallModal })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then((m) => ({ default: m.SettingsModal })));

const VALID_MODES: Set<string> = new Set<string>([
  'map',
  'library',
  'journey',
  'hands-control',
  'reframe-sentence',
  'break-mountain',
  'gather-bubbles',
  'boundaries-circle',
  'gentle-break',
  'first-sentence',
  'distance-safe',
  'small-light',
  'game-butterfly-tap',
  'game-somatic-shake',
  'game-pmr-squeeze',
  'game-sensory-grounding',
  'game-infinity-flow',
  'game-balloon-breath',
  'discover',
  'cards-insight',
  'scenarios-quick',
  'visual-projection',
  'micro-challenge-30s',
  'daily-quests',
  'wisdom-vault',
  'touch-and-break',
  'body-motion-challenge',
  'emotion-roulette',
  'scratch-to-reveal',
  'multi-sensory-quest',
  'speed-lie-detector',
  'challenge-separate',
  'challenge-feeling',
  'challenge-perspective',
  'challenge-react',
  'decisional-balance',
  'thought-shredder',
  'core-needs-compass',
  'inner-mirror',
  'cognitive-reframing-puzzle',
  'inner-labyrinth',
  'digital-release-ritual',
  'relational-energy-matrix',
  'resonance-chamber',
  'mental-loom',
  'worry-sandbox',
  'blooming-gratitude',
  'nesma-cipher',
  'mindful-organizer',
  'zen-puzzle',
  'emotion-sort-puzzle',
  'smart-games-hub',
  'moving-island',
  'workshop',
  'my-journey',
  'weekly-session',
  'profile',
  'projects',
  'cms',
  'admin-cms',
]);

function normalizeModeAlias(raw: string): GameMode | null {
  const cleaned = raw.trim().toLowerCase();
  if (cleaned === 'cipher' || cleaned === 'nesma_cipher') return 'nesma-cipher';
  if (cleaned === 'cms') return 'admin-cms';
  if (VALID_MODES.has(cleaned)) return cleaned as GameMode;
  return null;
}

function getModeFromUrl(): GameMode | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Search params: ?mode=... or ?game=... or ?view=...
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode') || params.get('game') || params.get('view');
    if (modeParam) {
      const normalized = normalizeModeAlias(modeParam);
      if (normalized) return normalized;
    }

    // 2. Hash params: #nesma-cipher or #cipher or #cms
    const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    if (hash) {
      const normalized = normalizeModeAlias(hash);
      if (normalized) return normalized;
    }
  } catch {
    // ignore
  }
  return null;
}

const ViewLoadingFallback: React.FC<{ language: Language }> = ({ language }) => (
  <div
    role="status"
    aria-live="polite"
    className="max-w-xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-3"
  >
    <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-emerald-700 dark:border-emerald-400 border-t-transparent animate-spin" />
    </div>
    <p className="text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300">
      {language === 'ar' ? 'جاري فتح المساحة التفاعلية بهدوء...' : 'Opening interactive space...'}
    </p>
  </div>
);

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>(() => {
    return getModeFromUrl() || 'map';
  });
  const [selectedLevelId, setSelectedLevelId] = useState<string>('unread-message');
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [isBreathingOpen, setIsBreathingOpen] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [isMinuteReflectionOpen, setIsMinuteReflectionOpen] = useState<boolean>(false);
  const [isHiddenPathsOpen, setIsHiddenPathsOpen] = useState<boolean>(false);
  const [isExperienceMixerOpen, setIsExperienceMixerOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [islandReturnActive, setIslandReturnActive] = useState<boolean>(false);
  const [activeIslandMission, setActiveIslandMission] = useState<ActiveIslandMissionContext | null>(null);
  const [islandCipherLevel, setIslandCipherLevel] = useState<number | undefined>(undefined);

  const SOUND_STORAGE_KEY = 'fakkerfeha_sound_v1';
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const val = localStorage.getItem(SOUND_STORAGE_KEY);
      return val !== 'false';
    } catch {
      return true;
    }
  });

  const {
    stats,
    addXP,
    recordGameCompletion,
    recordLevelCompletion,
    setAvatar,
    currentRank,
    rankProgress,
    activeCelebrationBadge,
    dismissCelebrationBadge
  } = useGameState();

  const handleGameRewardXP = (amount: number, showSparkles = true) => {
    if (amount >= 25 && !wasStageCompletionJustEmitted()) {
      recordGameCompletion(currentMode, amount, showSparkles);
    } else {
      addXP(amount, showSparkles);
    }
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    soundManager.enabled = soundEnabled;
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  // Synchronize URL hash with currentMode & ensure top of screen is visible
  const isPopNavigationRef = React.useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    try {
      const targetHash = currentMode === 'map' ? '' : `#${currentMode}`;
      if (window.location.hash !== targetHash) {
        const nextUrl = targetHash || window.location.pathname + window.location.search;
        if (isPopNavigationRef.current) {
          window.history.replaceState({ mode: currentMode }, '', nextUrl);
        } else {
          window.history.pushState({ mode: currentMode }, '', nextUrl);
        }
      }
      isPopNavigationRef.current = false;
    } catch {
      // ignore
    }
  }, [currentMode]);

  // Handle browser back/forward buttons (especially on mobile navigation)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationChange = () => {
      isPopNavigationRef.current = true;
      const detected = getModeFromUrl() || 'map';
      setCurrentMode(detected);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleStartLevel = (levelId: string) => {
    const game = ALL_36_GAMES.find((g) => g.id === 'journey' && g.levelId === levelId);
    if (game) {
      recordLastPlayedGame(game);
    }
    setSelectedLevelId(levelId);
    setCurrentMode('journey');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 dark:bg-stone-950 dark:text-stone-100 transition-colors duration-200 overflow-x-hidden">
      {/* Skip to main content link for screen reader accessibility */}
      <a
        href="#main-content"
        role="link"
        aria-label={language === 'ar' ? 'الانتقال مباشرة إلى المحتوى الرئيسي' : 'Skip directly to main content'}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-stone-900 focus:text-amber-300 focus:border-2 focus:border-amber-400 focus:rounded-lg focus:shadow-xl focus:outline-none text-xs font-bold transition-all"
      >
        {language === 'ar' ? 'الانتقال مباشرة إلى المحتوى الرئيسي' : 'Skip to main content'}
      </a>

      {/* Game Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setIslandReturnActive(false);
          setActiveIslandMission(null);
          setCurrentMode(mode);
        }}
        language={language}
        onToggleLanguage={toggleLanguage}
        onOpenBreathing={() => setIsBreathingOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        playerXP={stats.xp}
        userRank={currentRank}
        rankProgress={rankProgress}
        theme={theme}
        onToggleTheme={toggleTheme}
        onAddXP={addXP}
        onOpenTechnicalAudit={() => setIsAuditModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenUpdate={() => setIsUpdateModalOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        earnedBadgeIds={stats.badges}
        totalGamesCompleted={stats.totalGamesCompleted}
      />

      {/* Main Game Screen */}
      <main 
        id="main-content" 
        tabIndex={-1} 
        role="main" 
        aria-label={language === 'ar' ? 'المحتوى الرئيسي للتطبيق والألعاب التفاعلية' : 'Main application and interactive games content'} 
        className="flex-1 pb-12 outline-none"
      >
        {/* Active Moving Island Mission Companion Bar */}
        {islandReturnActive &&
          ['nesma-cipher', 'zen-puzzle', 'emotion-sort-puzzle', 'mindful-organizer', 'hands-control', 'break-mountain'].includes(currentMode) && (() => {
            const missionDef = activeIslandMission
              ? ISLAND_CHALLENGES.find((c) => c.id === activeIslandMission.challengeId)
              : undefined;
            const isMissionMetNow = missionDef
              ? isChallengeConditionMet(
                  missionDef,
                  loadMovingIslandState(),
                  readAllSixGamesSnapshot()
                )
              : false;

            return (
              <div
                className={`${
                  isMissionMetNow
                    ? 'bg-emerald-800 border-emerald-400'
                    : 'bg-emerald-950 border-emerald-700/70'
                } text-white border-b px-4 py-2.5 transition-colors`}
                dir="rtl"
              >
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md font-black ${
                        isMissionMetNow
                          ? 'bg-emerald-300 text-stone-950'
                          : 'bg-amber-500 text-stone-950'
                      }`}
                    >
                      {isMissionMetNow
                        ? '✓ اكتمل هدف المهمة!'
                        : `مهمة جزيرة الأسرار ${activeIslandMission ? `#${activeIslandMission.challengeNumber}` : ''}`}
                    </span>
                    <span className="font-extrabold text-emerald-100">
                      {isMissionMetNow
                        ? `أنجزت «${activeIslandMission?.titleAr}» بنجاح — عد للجزيرة الآن لاستلام المقتنى وفتح المسار!`
                        : activeIslandMission
                        ? `${activeIslandMission.titleAr} — ${activeIslandMission.howToCompleteAr}`
                        : 'كل تقدم تحرزه في هذه اللعبة يُحتسب تلقائياً في جزيرة الأسرار المتحركة.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIslandReturnActive(false);
                      setActiveIslandMission(null);
                      setIslandCipherLevel(undefined);
                      setCurrentMode('moving-island');
                    }}
                    className={`min-h-9 px-3.5 py-1.5 rounded-xl font-black cursor-pointer self-start sm:self-auto shrink-0 transition-colors ${
                      isMissionMetNow
                        ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-sm'
                        : 'bg-white/15 hover:bg-white/25 text-white'
                    }`}
                  >
                    {isMissionMetNow
                      ? 'العودة للجزيرة واستلام المكافأة ←'
                      : 'العودة لجزيرة الأسرار واستلام التقدم ←'}
                  </button>
                </div>
              </div>
            );
          })()}

        {/* Main 'Choose Your Adventure' System (اختار مغامرتك) — Eagerly rendered for instant first paint */}
        {currentMode === 'map' && (
          <AdventureHome
            language={language}
            onNavigateToGame={(gameId, levelId) => {
              const game = ALL_36_GAMES.find((g) => g.id === gameId && (!levelId || g.levelId === levelId)) ||
                           ALL_36_GAMES.find((g) => g.id === gameId);
              if (game) {
                recordLastPlayedGame(game);
              }
              if (levelId) {
                setSelectedLevelId(levelId);
                setCurrentMode('journey');
              } else {
                setCurrentMode(gameId);
              }
            }}
            onNavigateToLibrary={() => setCurrentMode('library')}
            onNavigateToJourney={() => setCurrentMode('my-journey')}
            onNavigateToWorkshop={() => setCurrentMode('workshop')}
            onNavigateToProfile={() => setCurrentMode('profile')}
            onOpenMinuteReflection={() => setIsMinuteReflectionOpen(true)}
            onOpenHiddenPaths={() => setIsHiddenPathsOpen(true)}
            onOpenExperienceMixer={() => setIsExperienceMixerOpen(true)}
            onOpenBreathing={() => setIsBreathingOpen(true)}
            playerStats={{
              xp: stats.xp,
              avatarId: stats.avatarId,
              badges: stats.badges,
              totalGamesCompleted: stats.totalGamesCompleted
            }}
            onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
            onOpenInstall={() => setIsInstallModalOpen(true)}
            onOpenShare={() => setIsShareModalOpen(true)}
            onOpenUpdate={() => setIsUpdateModalOpen(true)}
          />
        )}

        {/* Code-Split Interactive Games & Secondary Sections */}
        {currentMode !== 'map' && (
          <Suspense fallback={<ViewLoadingFallback language={language} />}>
            {/* Full Games Catalog with Search & Filter */}
            {currentMode === 'library' && (
              <GameMap
                language={language}
                onSelectLevel={handleStartLevel}
                onNavigateMode={(mode) => setCurrentMode(mode)}
                playerStats={stats}
                onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
              />
            )}

            {/* 9 Core Nesma Hayat Games (All 9 wired with XP & Badge progression) */}
            {currentMode === 'hands-control' && (
              <HandsControlGame
                language={language}
                onBackToMap={() => {
                  if (islandReturnActive) {
                    setIslandReturnActive(false);
                    setActiveIslandMission(null);
                    setCurrentMode('moving-island');
                  } else {
                    setCurrentMode('map');
                  }
                }}
                onAddXP={handleGameRewardXP}
              />
            )}

            {currentMode === 'reframe-sentence' && (
              <ReframeSentenceGame
                language={language}
                onBackToMap={() => setCurrentMode('map')}
                onAddXP={handleGameRewardXP}
              />
            )}

            {currentMode === 'break-mountain' && (
              <BreakTheMountainGame
                language={language}
                onBackToMap={() => {
                  if (islandReturnActive) {
                    setIslandReturnActive(false);
                    setActiveIslandMission(null);
                    setCurrentMode('moving-island');
                  } else {
                    setCurrentMode('map');
                  }
                }}
                onAddXP={handleGameRewardXP}
              />
            )}

            {currentMode === 'gather-bubbles' && (
              <BrainTrafficBubblesGame
                language={language}
                onBackToMap={() => setCurrentMode('map')}
                onAddXP={handleGameRewardXP}
              />
            )}

            {currentMode === 'boundaries-circle' && (
              <BoundariesCircleGame
                language={language}
                onBackToMap={() => setCurrentMode('map')}
                onAddXP={handleGameRewardXP}
              />
            )}

            {currentMode === 'gentle-break' && (
              <MandatoryGentleBreakGame
                language={language}
                onBackToMap={() => setCurrentMode('map')}
                onAddXP={handleGameRewardXP}
              />
            )}

            {currentMode === 'first-sentence' && (
              <FirstSentenceFamilyGame
                language={language}
                onBackToMap={() => setCurrentMode('map')}
                onAddXP={handleGameRewardXP}
              />
            )}

            {currentMode === 'distance-safe' && (
              <DistanceCirclesGame
                language={language}
                onBackToMap={() => setCurrentMode('map')}
                onAddXP={handleGameRewardXP}
              />
            )}

            {currentMode === 'small-light' && (
              <SmallLightHopeGame
                language={language}
                onBackToMap={() => setCurrentMode('map')}
                onAddXP={handleGameRewardXP}
              />
            )}

            {/* Psychomotor Somatic Games */}
            {currentMode === 'game-butterfly-tap' && (
              <ButterflyTapGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'game-somatic-shake' && (
              <SomaticShakeGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'game-pmr-squeeze' && (
              <PmrSqueezeGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'game-sensory-grounding' && (
              <SensoryGroundingGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'game-infinity-flow' && (
              <InfinityFlowGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'game-balloon-breath' && (
              <BalloonBreathGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {/* Discover & Articles linked directly to games */}
            {currentMode === 'discover' && (
              <DiscoverReadings
                language={language}
                onNavigateToGame={(gameId) => setCurrentMode(gameId)}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {/* Real Projects Showcase */}
            {currentMode === 'projects' && (
              <ProjectsHubView
                language={language}
                onNavigateMode={(mode) => setCurrentMode(mode)}
              />
            )}

            {/* Dedicated Content Management (CMS) */}
            {currentMode === 'admin-cms' && (
              <ContentManagementView
                language={language}
                onNavigateMode={(mode) => setCurrentMode(mode)}
              />
            )}

            {/* Subconscious & Projective Gamified Exploration */}
            {currentMode === 'cards-insight' && (
              <InsightCardsGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'scenarios-quick' && (
              <QuickScenariosGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'visual-projection' && (
              <VisualProjectionGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {/* Physical & Somatic Gamified Quests & Rewards */}
            {currentMode === 'micro-challenge-30s' && (
              <MicroChallenge30sGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'daily-quests' && (
              <DailyQuestCardsGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'wisdom-vault' && (
              <WisdomVaultView
                language={language}
                playerXP={stats.xp}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {/* 6 Visceral & Tactile Psychological Games */}
            {currentMode === 'touch-and-break' && (
              <TouchAndBreakGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'body-motion-challenge' && (
              <BodyMotionChallengeGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'emotion-roulette' && (
              <EmotionRouletteGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'scratch-to-reveal' && (
              <ScratchToRevealGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'multi-sensory-quest' && (
              <MultiSensoryQuestGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'speed-lie-detector' && (
              <SpeedLieDetectorGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {/* Think About It Story Journey */}
            {currentMode === 'journey' && (
              <JourneyMode
                language={language}
                selectedLevelId={selectedLevelId}
                onOpenBreathing={() => setIsBreathingOpen(true)}
                onBackToMap={() => setCurrentMode('map')}
                playerAvatarId={stats.avatarId}
                onRecordStars={(levelId, stars) => recordLevelCompletion(levelId, stars)}
              />
            )}

            {/* Cognitive Challenges */}
            {currentMode === 'challenge-separate' && (
              <SeparateThemGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'challenge-feeling' && (
              <NameTheFeelingGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'challenge-perspective' && (
              <ChangePerspectiveGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'challenge-react' && (
              <BeforeYouReactGame
                language={language}
                onOpenBreathing={() => setIsBreathingOpen(true)}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {/* 4 Advanced Psychological Games */}
            {currentMode === 'decisional-balance' && (
              <DecisionalScalesGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'thought-shredder' && (
              <ThoughtShredderGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'core-needs-compass' && (
              <CoreNeedsCompassGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'inner-mirror' && (
              <InnerMirrorGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {/* 4 Creative & Deep Interactive Experiences */}
            {currentMode === 'cognitive-reframing-puzzle' && (
              <CognitiveReframingPuzzleGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'inner-labyrinth' && (
              <InnerLabyrinthGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'digital-release-ritual' && (
              <DigitalReleaseRitualGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'relational-energy-matrix' && (
              <RelationalEnergyMatrixGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {/* 4 Innovative & Mindful Games */}
            {currentMode === 'resonance-chamber' && (
              <ResonanceChamberGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'mental-loom' && (
              <MentalLoomGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'worry-sandbox' && (
              <WorrySandboxGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'blooming-gratitude' && (
              <BloomingGratitudeGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {/* Tactical, Organizing & Satisfying Puzzle Games */}
            {currentMode === 'mindful-organizer' && (
              <MindfulOrganizerGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => {
                  if (islandReturnActive) {
                    setIslandReturnActive(false);
                    setActiveIslandMission(null);
                    setCurrentMode('moving-island');
                  } else {
                    setCurrentMode('map');
                  }
                }}
              />
            )}

            {currentMode === 'zen-puzzle' && (
              <ZenStonePuzzleGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => {
                  if (islandReturnActive) {
                    setIslandReturnActive(false);
                    setActiveIslandMission(null);
                    setCurrentMode('moving-island');
                  } else {
                    setCurrentMode('map');
                  }
                }}
              />
            )}

            {currentMode === 'emotion-sort-puzzle' && (
              <EmotionSortPuzzleGame
                language={language}
                onAddXP={handleGameRewardXP}
                onBackToMap={() => {
                  if (islandReturnActive) {
                    setIslandReturnActive(false);
                    setActiveIslandMission(null);
                    setCurrentMode('moving-island');
                  } else {
                    setCurrentMode('map');
                  }
                }}
              />
            )}

            {currentMode === 'smart-games-hub' && (
              <UnifiedGamesHub
                language={language}
                onSelectGame={(gId, stageStr) => {
                  if (stageStr) {
                    const targetNum = parseInt(stageStr, 10);
                    if (!Number.isNaN(targetNum) && targetNum >= 1) {
                      const prepared = prepareGameStageForIslandMission(
                        gId as IslandCoreGameId,
                        targetNum
                      );
                      setIslandCipherLevel(gId === 'nesma-cipher' ? prepared : undefined);
                    }
                  }
                  setCurrentMode(gId);
                }}
                onBackToHome={() => setCurrentMode('library')}
                onAddXP={handleGameRewardXP}
              />
            )}

            {/* جزيرة الأسرار المتحركة */}
            {currentMode === 'moving-island' && (
              <MovingIslandMain
                language={language}
                onBack={() => setCurrentMode('map')}
                onLaunchLinkedGame={(gameId, targetStage, mission) => {
                  setIslandReturnActive(true);
                  setActiveIslandMission(mission || null);
                  setIslandCipherLevel(gameId === 'nesma-cipher' ? targetStage : undefined);
                  setCurrentMode(gameId);
                }}
                onAddXP={handleGameRewardXP}
              />
            )}

            {/* شفرة نسمة — لعبة الألغاز النفسية التفاعلية */}
            {currentMode === 'nesma-cipher' && (
              <NesmaCipherMain
                initialLevelId={islandCipherLevel}
                onExit={() => {
                  if (islandReturnActive) {
                    setIslandReturnActive(false);
                    setActiveIslandMission(null);
                    setIslandCipherLevel(undefined);
                    setCurrentMode('moving-island');
                  } else {
                    setIslandCipherLevel(undefined);
                    setCurrentMode('map');
                  }
                }}
                onAddXP={handleGameRewardXP}
              />
            )}

            {/* Weekly Psychological Reflection & Companion Session */}
            {currentMode === 'weekly-session' && (
              <WeeklyPsychologicalSession
                language={language}
                onBackToMap={() => setCurrentMode('map')}
                onAddXP={handleGameRewardXP}
                onOpenBreathing={() => setIsBreathingOpen(true)}
              />
            )}

            {/* My Journey Saved Moments */}
            {currentMode === 'my-journey' && (
              <MyJourneyDrawer
                language={language}
                onBackToMap={() => setCurrentMode('map')}
              />
            )}

            {/* Workshop Mode */}
            {currentMode === 'workshop' && (
              <WorkshopMode 
                language={language}
                onNavigateGame={(mode) => setCurrentMode(mode)}
                onBackToHome={() => setCurrentMode('map')}
              />
            )}

            {currentMode === 'profile' && (
              <FinalScreen
                language={language}
                onNavigate={(mode) => setCurrentMode(mode)}
                onOpenBreathing={() => setIsBreathingOpen(true)}
                playerStats={stats}
                onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
              />
            )}
          </Suspense>
        )}
      </main>

      {/* Game Footer */}
      <footer 
        role="contentinfo" 
        aria-label={language === 'ar' ? 'تذييل الصفحة ومعلومات المبادرة' : 'Page footer and initiative info'} 
        className="border-t border-stone-200/80 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 py-5 px-4 text-xs text-stone-500 dark:text-stone-400 transition-colors"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-800 dark:text-stone-100">
              {language === 'ar' ? 'فكر فيها' : 'Think About It'}
            </span>
            <span aria-hidden="true">🌿</span>
            <span aria-hidden="true">·</span>
            <span>
              {language === 'ar' 
                ? 'ألعاب نفسية تفاعلية — كجزء من مبادرة نسمة حياة' 
                : 'Interactive Psychological Games — Part of Nesma Hayat'}
            </span>
          </div>

          <nav 
            role="navigation" 
            aria-label={language === 'ar' ? 'روابط التنقل السريع في التذييل' : 'Footer quick navigation links'} 
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-stone-500 dark:text-stone-400"
          >
            <button
              type="button"
              onClick={() => setCurrentMode('map')}
              aria-label={language === 'ar' ? 'الانتقال إلى خريطة الألعاب وكل الألعاب' : 'Navigate to all games map'}
              aria-current={currentMode === 'map' ? 'page' : undefined}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer font-bold ${currentMode === 'map' ? 'text-amber-700 dark:text-amber-400 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'كل الألعاب' : 'All Games'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setCurrentMode('projects')}
              aria-label={language === 'ar' ? 'الانتقال إلى ركن المشروعات والتدخلات النفسية' : 'Navigate to projects hub'}
              aria-current={currentMode === 'projects' ? 'page' : undefined}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer font-bold ${currentMode === 'projects' ? 'text-amber-700 dark:text-amber-400 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'المشروعات' : 'Projects'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setCurrentMode('weekly-session')}
              aria-label={language === 'ar' ? 'الانتقال إلى الجلسة النفسية الأسبوعية' : 'Navigate to weekly session'}
              aria-current={currentMode === 'weekly-session' ? 'page' : undefined}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer font-bold ${currentMode === 'weekly-session' ? 'text-amber-700 dark:text-amber-400 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'الجلسة الأسبوعية 🛋️' : 'Weekly Session 🛋️'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setCurrentMode('my-journey')}
              aria-label={language === 'ar' ? 'الانتقال إلى سجل ودفتر رحلتي' : 'Navigate to my journey notebook'}
              aria-current={currentMode === 'my-journey' ? 'page' : undefined}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer font-bold ${currentMode === 'my-journey' ? 'text-amber-700 dark:text-amber-400 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'دفتر رحلتي' : 'My Journey'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setCurrentMode('profile')}
              aria-label={language === 'ar' ? 'الانتقال إلى ملفي وأوسمة الإنجاز' : 'Navigate to profile and badges'}
              aria-current={currentMode === 'profile' ? 'page' : undefined}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer font-bold ${currentMode === 'profile' ? 'text-amber-700 dark:text-amber-400 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'أوسمتي 🏅' : 'Badges 🏅'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setCurrentMode('workshop')}
              aria-label={language === 'ar' ? 'الانتقال إلى دليل واستمارات الورش التفاعلية' : 'Navigate to interactive workshops guide'}
              aria-current={currentMode === 'workshop' ? 'page' : undefined}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer font-bold ${currentMode === 'workshop' ? 'text-amber-700 dark:text-amber-400 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'دليل الورش' : 'Workshop'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setCurrentMode('admin-cms')}
              aria-label={language === 'ar' ? 'الانتقال إلى نظام إدارة المحتوى والأنشطة' : 'Navigate to content management system'}
              aria-current={currentMode === 'admin-cms' ? 'page' : undefined}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer font-bold ${currentMode === 'admin-cms' ? 'text-amber-700 dark:text-amber-400 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'إدارة المحتوى' : 'CMS'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              aria-label={language === 'ar' ? 'فتح الإعدادات والأجواء الصوتية' : 'Open settings and soundscapes'}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer font-bold"
            >
              {language === 'ar' ? 'الأجواء الصوتية' : 'Soundscapes'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              aria-label={language === 'ar' ? 'تثبيت التطبيق على الموبايل' : 'Install app on mobile'}
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors cursor-pointer font-bold"
            >
              {language === 'ar' ? 'تثبيت على الموبايل' : 'Install App'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              aria-label={language === 'ar' ? 'مشاركة التطبيق مع الآخرين' : 'Share application'}
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors cursor-pointer font-bold"
            >
              {language === 'ar' ? 'مشاركة التطبيق' : 'Share App'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(true)}
              aria-label={language === 'ar' ? 'التحديث التلقائي للتطبيق' : 'Automatic app updates'}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer font-bold"
            >
              {language === 'ar' ? 'التحديث التلقائي' : 'Auto Update'}
            </button>
          </nav>
        </div>
      </footer>

      {/* Celebratory Badge Unlocked Popup */}
      <BadgeCelebrationModal
        badge={activeCelebrationBadge}
        totalGamesCompleted={stats.totalGamesCompleted}
        language={language}
        onClose={dismissCelebrationBadge}
        onViewAllBadges={() => setCurrentMode('profile')}
      />

      {/* Crisis Safety & Emergency Hotlines Modal */}
      <CrisisSafetyModal
        language={language}
        onOpenBreathing={() => setIsBreathingOpen(true)}
      />

      {/* Automatic SW Update Toast */}
      <AppUpdateAvailableToast language={language} />

      {/* Lazy-Loaded On-Demand Modals */}
      <Suspense fallback={null}>
        {isBreathingOpen && (
          <MindfulBreathingModal
            isOpen={isBreathingOpen}
            onClose={() => setIsBreathingOpen(false)}
            language={language}
          />
        )}

        {isAvatarModalOpen && (
          <AvatarModal
            isOpen={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
            language={language}
            currentAvatarId={stats.avatarId}
            onSelectAvatar={setAvatar}
            earnedBadgeIds={stats.badges}
            totalGamesCompleted={stats.totalGamesCompleted}
            onViewAllBadges={() => {
              setIsAvatarModalOpen(false);
              setCurrentMode('profile');
            }}
          />
        )}

        {isMinuteReflectionOpen && (
          <MinuteReflectionModal
            isOpen={isMinuteReflectionOpen}
            onClose={() => setIsMinuteReflectionOpen(false)}
            language={language}
            onRewardXP={addXP}
          />
        )}

        {isHiddenPathsOpen && (
          <HiddenPathModal
            isOpen={isHiddenPathsOpen}
            onClose={() => setIsHiddenPathsOpen(false)}
            language={language}
            onSelectGame={(gameId) => {
              const game = ALL_36_GAMES.find((g) => g.id === gameId);
              if (game) recordLastPlayedGame(game);
              setCurrentMode(gameId);
            }}
          />
        )}

        {isExperienceMixerOpen && (
          <ExperienceMixerModal
            isOpen={isExperienceMixerOpen}
            onClose={() => setIsExperienceMixerOpen(false)}
            language={language}
            onSelectGame={(gameId, levelId) => {
              const game = ALL_36_GAMES.find((g) => g.id === gameId && (!levelId || g.levelId === levelId)) ||
                           ALL_36_GAMES.find((g) => g.id === gameId);
              if (game) recordLastPlayedGame(game);
              if (levelId) {
                setSelectedLevelId(levelId);
                setCurrentMode('journey');
              } else {
                setCurrentMode(gameId);
              }
            }}
          />
        )}

        {isAuditModalOpen && (
          <TechnicalAuditModal
            isOpen={isAuditModalOpen}
            onClose={() => setIsAuditModalOpen(false)}
            language={language}
          />
        )}

        {isShareModalOpen && (
          <AppShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            currentMode={currentMode}
            language={language}
          />
        )}

        {isUpdateModalOpen && (
          <AppUpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            language={language}
          />
        )}

        {isInstallModalOpen && (
          <AppInstallModal
            isOpen={isInstallModalOpen}
            onClose={() => setIsInstallModalOpen(false)}
            language={language}
          />
        )}

        {isSettingsModalOpen && (
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            language={language}
            onToggleLanguage={toggleLanguage}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenInstall={() => setIsInstallModalOpen(true)}
            onOpenShare={() => setIsShareModalOpen(true)}
            onOpenUpdate={() => setIsUpdateModalOpen(true)}
          />
        )}
      </Suspense>
    </div>
  );
}
