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

import { useGameState } from './utils/gameState';
import { soundManager } from './utils/audio';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('map');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('unread-message');
  const [language, setLanguage] = useState<Language>('ar');
  const [isBreathingOpen, setIsBreathingOpen] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const { 
    stats, 
    addXP, 
    recordLevelCompletion, 
    setAvatar,
    streakNotification,
    dismissStreakNotification,
    isGameCompletedToday
  } = useGameState();

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.enabled = nextState;
  };

  const handleStartLevel = (levelId: string) => {
    setSelectedLevelId(levelId);
    setCurrentMode('journey');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 transition-colors">
      {/* Game Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        language={language}
        onToggleLanguage={toggleLanguage}
        onOpenBreathing={() => setIsBreathingOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        playerXP={stats.xp}
        streak={stats.streak}
        isGameCompletedToday={isGameCompletedToday}
      />

      {/* Daily Streak Celebration Toast */}
      {streakNotification && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 animate-bounce max-w-md w-full px-4">
          <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-pulse">🔥</span>
              <div>
                <h4 className="text-xs font-bold text-amber-400">
                  {streakNotification.type === 'game_complete' 
                    ? (language === 'ar' ? 'مكافأة التتابع اليومي! 🔥' : 'Daily Streak Reward! 🔥') 
                    : (language === 'ar' ? 'هدية تسجيل الدخول اليومي 🎁' : 'Daily Login Reward 🎁')}
                </h4>
                <p className="text-xs text-stone-200 font-medium">
                  {streakNotification.message}
                </p>
              </div>
            </div>
            <button
              onClick={dismissStreakNotification}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold cursor-pointer shrink-0"
            >
              {language === 'ar' ? 'رائع!' : 'Awesome!'}
            </button>
          </div>
        </div>
      )}

      {/* Main Game Screen */}
      <main className="flex-1 pb-12">
        {currentMode === 'map' && (
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
            onBackToMap={() => setCurrentMode('map')}
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
            onBackToMap={() => setCurrentMode('map')}
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

        {/* My Journey Saved Moments */}
        {currentMode === 'my-journey' && (
          <MyJourneyDrawer
            language={language}
            onBackToMap={() => setCurrentMode('map')}
          />
        )}

        {/* Workshop Mode */}
        {currentMode === 'workshop' && (
          <WorkshopMode language={language} />
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
      <footer className="border-t border-stone-200/80 bg-stone-100/60 py-5 px-4 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-800">
              {language === 'ar' ? 'نسمة حياة' : 'Nesma Hayat'}
            </span>
            <span>🌿</span>
            <span>·</span>
            <span>
              {language === 'ar' 
                ? 'فكر فيها — ألعاب الوعي النفسي والحركي' 
                : 'Nesma Hayat Mental Health & Psychomotor Games'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-500">
            <button
              onClick={() => setCurrentMode('map')}
              className="hover:text-stone-900 transition-colors cursor-pointer font-bold"
            >
              {language === 'ar' ? 'كل الألعاب' : 'All Games'}
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentMode('my-journey')}
              className="hover:text-stone-900 transition-colors cursor-pointer font-bold"
            >
              {language === 'ar' ? 'دفتر رحلتي' : 'My Journey'}
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentMode('workshop')}
              className="hover:text-stone-900 transition-colors cursor-pointer font-bold"
            >
              {language === 'ar' ? 'دليل الورش' : 'Workshop'}
            </button>
          </div>
        </div>
      </footer>

      {/* Mindful Pause Modal */}
      <MindfulBreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
        language={language}
      />

      {/* Character Selection Modal */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        language={language}
        currentAvatarId={stats.avatarId}
        onSelectAvatar={setAvatar}
      />
    </div>
  );
}
