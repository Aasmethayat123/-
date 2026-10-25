import React, { useState, useEffect } from 'react';
import { GameMode, Language } from './types';
import { Header } from './components/Header';
import { GameMap } from './components/GameMap';
import { JourneyMode } from './components/JourneyMode';
import { SeparateThemGame } from './components/SeparateThemGame';
import { NameTheFeelingGame } from './components/NameTheFeelingGame';
import { ChangePerspectiveGame } from './components/ChangePerspectiveGame';
import { BeforeYouReactGame } from './components/BeforeYouReactGame';
import { WorkshopMode } from './components/WorkshopMode';
import { FinalScreen } from './components/FinalScreen';
import { MindfulBreathingModal } from './components/MindfulBreathingModal';
import { AvatarModal } from './components/AvatarModal';

// 9 Core Nesma Hayat Games
import { HandsControlGame } from './components/nesmaGames/HandsControlGame';
import { ReframeSentenceGame } from './components/nesmaGames/ReframeSentenceGame';
import { BreakTheMountainGame } from './components/nesmaGames/BreakTheMountainGame';
import { BrainTrafficBubblesGame } from './components/nesmaGames/BrainTrafficBubblesGame';
import { BoundariesCircleGame } from './components/nesmaGames/BoundariesCircleGame';
import { MandatoryGentleBreakGame } from './components/nesmaGames/MandatoryGentleBreakGame';
import { FirstSentenceFamilyGame } from './components/nesmaGames/FirstSentenceFamilyGame';
import { DistanceCirclesGame } from './components/nesmaGames/DistanceCirclesGame';
import { SmallLightHopeGame } from './components/nesmaGames/SmallLightHopeGame';
import { MyJourneyDrawer } from './components/MyJourneyDrawer';

// Psychomotor Somatic Games
import { ButterflyTapGame } from './components/psychomotor/ButterflyTapGame';
import { SomaticShakeGame } from './components/psychomotor/SomaticShakeGame';
import { PmrSqueezeGame } from './components/psychomotor/PmrSqueezeGame';
import { SensoryGroundingGame } from './components/psychomotor/SensoryGroundingGame';
import { InfinityFlowGame } from './components/psychomotor/InfinityFlowGame';
import { BalloonBreathGame } from './components/psychomotor/BalloonBreathGame';
import { DiscoverReadings } from './components/DiscoverReadings';
import { WeeklyPsychologicalSession } from './components/WeeklyPsychologicalSession';
import { CrisisSafetyModal } from './components/CrisisSafetyModal';
import { TechnicalAuditModal } from './components/TechnicalAuditModal';

// Subconscious & Physical Gamified Games
import { InsightCardsGame } from './components/interactiveGames/InsightCardsGame';
import { QuickScenariosGame } from './components/interactiveGames/QuickScenariosGame';
import { VisualProjectionGame } from './components/interactiveGames/VisualProjectionGame';
import { MicroChallenge30sGame } from './components/interactiveGames/MicroChallenge30sGame';
import { DailyQuestCardsGame } from './components/interactiveGames/DailyQuestCardsGame';
import { WisdomVaultView } from './components/interactiveGames/WisdomVaultView';

// 6 Visceral & Tactile Psychological Games
import { TouchAndBreakGame } from './components/visceralGames/TouchAndBreakGame';
import { BodyMotionChallengeGame } from './components/visceralGames/BodyMotionChallengeGame';
import { EmotionRouletteGame } from './components/visceralGames/EmotionRouletteGame';
import { ScratchToRevealGame } from './components/visceralGames/ScratchToRevealGame';
import { MultiSensoryQuestGame } from './components/visceralGames/MultiSensoryQuestGame';
import { SpeedLieDetectorGame } from './components/visceralGames/SpeedLieDetectorGame';

// 4 Advanced Psychological Games (عيادة التفكير والتحرر)
import { DecisionalScalesGame } from './components/interactiveGames/DecisionalScalesGame';
import { ThoughtShredderGame } from './components/interactiveGames/ThoughtShredderGame';
import { CoreNeedsCompassGame } from './components/interactiveGames/CoreNeedsCompassGame';
import { InnerMirrorGame } from './components/interactiveGames/InnerMirrorGame';

// 4 Creative & Deep Interactive Experiences
import { CognitiveReframingPuzzleGame } from './components/interactiveGames/CognitiveReframingPuzzleGame';
import { InnerLabyrinthGame } from './components/interactiveGames/InnerLabyrinthGame';
import { DigitalReleaseRitualGame } from './components/interactiveGames/DigitalReleaseRitualGame';
import { RelationalEnergyMatrixGame } from './components/interactiveGames/RelationalEnergyMatrixGame';

// 4 New Innovative & Mindful Games (إبداعات الوعي والسكينة)
import { ResonanceChamberGame } from './components/interactiveGames/ResonanceChamberGame';
import { MentalLoomGame } from './components/interactiveGames/MentalLoomGame';
import { WorrySandboxGame } from './components/interactiveGames/WorrySandboxGame';
import { BloomingGratitudeGame } from './components/interactiveGames/BloomingGratitudeGame';

// Real Tactical, Organizing & Satisfying Puzzle Games (ألعاب الترتيب والبازل اللمسية)
import { MindfulOrganizerGame } from './components/interactiveGames/MindfulOrganizerGame';
import { ZenStonePuzzleGame } from './components/interactiveGames/ZenStonePuzzleGame';
import { EmotionSortPuzzleGame } from './components/interactiveGames/EmotionSortPuzzleGame';
import { UnifiedGamesHub } from './components/games/UnifiedGamesHub';

// شفرة نسمة — لعبة الألغاز النفسية التفاعلية الحقيقية
import { NesmaCipherMain } from './components/nesmaCipher/NesmaCipherMain';
import { MovingIslandMain, ActiveIslandMissionContext } from './components/movingIsland/MovingIslandMain';
import { ISLAND_CHALLENGES } from './data/movingIslandData';
import {
  isChallengeConditionMet,
  loadMovingIslandState,
  readAllSixGamesSnapshot,
} from './utils/movingIslandManager';

// Choose Your Adventure & Creative Discovery Modals
import { AdventureHome } from './components/AdventureHome';
import { MinuteReflectionModal } from './components/creative/MinuteReflectionModal';
import { HiddenPathModal } from './components/creative/HiddenPathModal';
import { ExperienceMixerModal } from './components/creative/ExperienceMixerModal';

// Real Projects & Content Management CMS
import { ProjectsHubView } from './components/ProjectsHubView';
import { ContentManagementView } from './components/ContentManagementView';

import { useGameState } from './utils/gameState';
import { soundManager } from './utils/audio';
import { getInitialTheme, applyTheme, ThemeMode } from './utils/theme';
import { ALL_36_GAMES } from './data/gamesCatalog';
import { recordLastPlayedGame } from './utils/adventures';
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

function getModeFromUrl(): GameMode | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Search params: ?mode=... or ?game=...
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode') || params.get('game') || params.get('view');
    if (modeParam) {
      if (modeParam === 'cipher' || modeParam === 'nesma_cipher') return 'nesma-cipher';
      if (VALID_MODES.has(modeParam)) return modeParam as GameMode;
    }

    // 2. Hash params: #nesma-cipher or #cipher
    const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim().toLowerCase();
    if (hash) {
      if (hash === 'cipher' || hash === 'nesma_cipher') return 'nesma-cipher';
      if (VALID_MODES.has(hash)) return hash as GameMode;
    }
  } catch {
    // ignore
  }
  return null;
}

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

  const { stats, addXP, recordLevelCompletion, setAvatar, currentRank, rankProgress } = useGameState();

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

        {/* Main 'Choose Your Adventure' System (اختار مغامرتك) */}
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
            onOpenMinuteReflection={() => setIsMinuteReflectionOpen(true)}
            onOpenHiddenPaths={() => setIsHiddenPathsOpen(true)}
            onOpenExperienceMixer={() => setIsExperienceMixerOpen(true)}
            onOpenBreathing={() => setIsBreathingOpen(true)}
            playerStats={{ xp: stats.xp, avatarId: stats.avatarId }}
            onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
          />
        )}

        {/* Full 40 Games Catalog with Search & Filter (مكتبة الألعاب الـ ٤٠) */}
        {currentMode === 'library' && (
          <GameMap
            language={language}
            onSelectLevel={handleStartLevel}
            onNavigateMode={(mode) => setCurrentMode(mode)}
            playerStats={stats}
            onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
          />
        )}

        {/* 9 Core Nesma Hayat Games */}
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
            onAddXP={addXP}
          />
        )}

        {currentMode === 'reframe-sentence' && (
          <ReframeSentenceGame
            language={language}
            onBackToMap={() => setCurrentMode('map')}
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
            onAddXP={addXP}
          />
        )}

        {currentMode === 'gather-bubbles' && (
          <BrainTrafficBubblesGame
            language={language}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'boundaries-circle' && (
          <BoundariesCircleGame
            language={language}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'gentle-break' && (
          <MandatoryGentleBreakGame
            language={language}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'first-sentence' && (
          <FirstSentenceFamilyGame
            language={language}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'distance-safe' && (
          <DistanceCirclesGame
            language={language}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'small-light' && (
          <SmallLightHopeGame
            language={language}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {/* Psychomotor Somatic Games */}
        {currentMode === 'game-butterfly-tap' && (
          <ButterflyTapGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'game-somatic-shake' && (
          <SomaticShakeGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'game-pmr-squeeze' && (
          <PmrSqueezeGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'game-sensory-grounding' && (
          <SensoryGroundingGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'game-infinity-flow' && (
          <InfinityFlowGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'game-balloon-breath' && (
          <BalloonBreathGame
            language={language}
            onAddXP={addXP}
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
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'scenarios-quick' && (
          <QuickScenariosGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'visual-projection' && (
          <VisualProjectionGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {/* Physical & Somatic Gamified Quests & Rewards */}
        {currentMode === 'micro-challenge-30s' && (
          <MicroChallenge30sGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'daily-quests' && (
          <DailyQuestCardsGame
            language={language}
            onAddXP={addXP}
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
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'body-motion-challenge' && (
          <BodyMotionChallengeGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'emotion-roulette' && (
          <EmotionRouletteGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'scratch-to-reveal' && (
          <ScratchToRevealGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'multi-sensory-quest' && (
          <MultiSensoryQuestGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'speed-lie-detector' && (
          <SpeedLieDetectorGame
            language={language}
            onAddXP={addXP}
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
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'challenge-feeling' && (
          <NameTheFeelingGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'challenge-perspective' && (
          <ChangePerspectiveGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'challenge-react' && (
          <BeforeYouReactGame
            language={language}
            onOpenBreathing={() => setIsBreathingOpen(true)}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {/* 4 Advanced Psychological Games (عيادة التفكير والتحرر) */}
        {currentMode === 'decisional-balance' && (
          <DecisionalScalesGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'thought-shredder' && (
          <ThoughtShredderGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'core-needs-compass' && (
          <CoreNeedsCompassGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'inner-mirror' && (
          <InnerMirrorGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {/* 4 Creative & Deep Interactive Experiences */}
        {currentMode === 'cognitive-reframing-puzzle' && (
          <CognitiveReframingPuzzleGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'inner-labyrinth' && (
          <InnerLabyrinthGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'digital-release-ritual' && (
          <DigitalReleaseRitualGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'relational-energy-matrix' && (
          <RelationalEnergyMatrixGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {/* 4 New Innovative & Mindful Games (إبداعات الوعي والسكينة) */}
        {currentMode === 'resonance-chamber' && (
          <ResonanceChamberGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'mental-loom' && (
          <MentalLoomGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'worry-sandbox' && (
          <WorrySandboxGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {currentMode === 'blooming-gratitude' && (
          <BloomingGratitudeGame
            language={language}
            onAddXP={addXP}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {/* Real Tactical, Organizing & Satisfying Puzzle Games (ألعاب الترتيب والبازل اللمسية) */}
        {currentMode === 'mindful-organizer' && (
          <MindfulOrganizerGame
            language={language}
            onAddXP={addXP}
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
            onAddXP={addXP}
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
            onAddXP={addXP}
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
            onSelectGame={(gId) => setCurrentMode(gId)}
            onBackToHome={() => setCurrentMode('library')}
            onAddXP={addXP}
          />
        )}

        {/* جزيرة الأسرار المتحركة — رحلة اكتشاف ما وراء الألغاز */}
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
            onAddXP={addXP}
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
                setCurrentMode('map');
              }
            }}
            onAddXP={addXP}
          />
        )}

        {/* Weekly Psychological Reflection & Companion Session (الجلسة النفسية الأسبوعية) */}
        {currentMode === 'weekly-session' && (
          <WeeklyPsychologicalSession
            language={language}
            onBackToMap={() => setCurrentMode('map')}
            onAddXP={addXP}
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
          />
        )}
      </main>

      {/* Game Footer */}
      <footer 
        role="contentinfo" 
        aria-label={language === 'ar' ? 'تذييل الصفحة ومعلومات المبادرة' : 'Page footer and initiative info'} 
        className="border-t border-stone-200/80 bg-stone-100/60 py-5 px-4 text-xs text-stone-500"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-800">
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
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-stone-500"
          >
            <button
              type="button"
              role="button"
              onClick={() => setCurrentMode('map')}
              aria-label={language === 'ar' ? 'الانتقال إلى خريطة الألعاب وكل الألعاب' : 'Navigate to all games map'}
              aria-current={currentMode === 'map' ? 'page' : undefined}
              className={`hover:text-stone-900 transition-colors cursor-pointer font-bold ${currentMode === 'map' ? 'text-amber-700 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'كل الألعاب' : 'All Games'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              role="button"
              onClick={() => setCurrentMode('projects')}
              aria-label={language === 'ar' ? 'الانتقال إلى ركن المشروعات والتدخلات النفسية' : 'Navigate to projects hub'}
              aria-current={currentMode === 'projects' ? 'page' : undefined}
              className={`hover:text-stone-900 transition-colors cursor-pointer font-bold ${currentMode === 'projects' ? 'text-amber-700 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'المشروعات' : 'Projects'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              role="button"
              onClick={() => setCurrentMode('weekly-session')}
              aria-label={language === 'ar' ? 'الانتقال إلى الجلسة النفسية الأسبوعية' : 'Navigate to weekly session'}
              aria-current={currentMode === 'weekly-session' ? 'page' : undefined}
              className={`hover:text-stone-900 transition-colors cursor-pointer font-bold ${currentMode === 'weekly-session' ? 'text-amber-700 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'الجلسة الأسبوعية 🛋️' : 'Weekly Session 🛋️'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              role="button"
              onClick={() => setCurrentMode('my-journey')}
              aria-label={language === 'ar' ? 'الانتقال إلى سجل ودفتر رحلتي' : 'Navigate to my journey notebook'}
              aria-current={currentMode === 'my-journey' ? 'page' : undefined}
              className={`hover:text-stone-900 transition-colors cursor-pointer font-bold ${currentMode === 'my-journey' ? 'text-amber-700 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'دفتر رحلتي' : 'My Journey'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              role="button"
              onClick={() => setCurrentMode('workshop')}
              aria-label={language === 'ar' ? 'الانتقال إلى دليل واستمارات الورش التفاعلية' : 'Navigate to interactive workshops guide'}
              aria-current={currentMode === 'workshop' ? 'page' : undefined}
              className={`hover:text-stone-900 transition-colors cursor-pointer font-bold ${currentMode === 'workshop' ? 'text-amber-700 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'دليل الورش' : 'Workshop'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              role="button"
              onClick={() => setCurrentMode('admin-cms')}
              aria-label={language === 'ar' ? 'الانتقال إلى نظام إدارة المحتوى والأنشطة' : 'Navigate to content management system'}
              aria-current={currentMode === 'admin-cms' ? 'page' : undefined}
              className={`hover:text-stone-900 transition-colors cursor-pointer font-bold ${currentMode === 'admin-cms' ? 'text-amber-700 underline underline-offset-4 decoration-2' : ''}`}
            >
              {language === 'ar' ? 'إدارة المحتوى' : 'CMS'}
            </button>
          </nav>
        </div>
      </footer>

      {/* Mindful Pause Modal */}
      {isBreathingOpen && (
        <MindfulBreathingModal
          isOpen={isBreathingOpen}
          onClose={() => setIsBreathingOpen(false)}
          language={language}
        />
      )}

      {/* Character Selection Modal */}
      {isAvatarModalOpen && (
        <AvatarModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          language={language}
          currentAvatarId={stats.avatarId}
          onSelectAvatar={setAvatar}
        />
      )}

      {/* 1-Minute Reflection Reset Modal */}
      {isMinuteReflectionOpen && (
        <MinuteReflectionModal
          isOpen={isMinuteReflectionOpen}
          onClose={() => setIsMinuteReflectionOpen(false)}
          language={language}
          onRewardXP={addXP}
        />
      )}

      {/* Hidden Paths Modal */}
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

      {/* Experience Mixer Modal */}
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

      {/* Crisis Safety & Emergency Hotlines Modal (بروتوكول الأمان ورصد الطوارئ) */}
      <CrisisSafetyModal
        language={language}
        onOpenBreathing={() => setIsBreathingOpen(true)}
      />

      {/* Real-time Technical Audit & Code Verification Modal (لوحة التدقيق التقني المباشر) */}
      <TechnicalAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        language={language}
      />
    </div>
  );
}
