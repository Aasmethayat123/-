import React, { useState, useEffect } from 'react';
import { CipherProgress, CipherLevel, CipherQuote } from '../../types/nesmaCipher';
import { CIPHER_LEVELS } from '../../data/nesmaCipherData';
import { 
  loadCipherProgress, 
  completeCipherLevel, 
  resetCipherProgress 
} from '../../utils/nesmaCipherStorage';
import { CipherMap } from './CipherMap';
import { CipherLevelPlay } from './CipherLevelPlay';
import { CipherVictoryModal } from './CipherVictoryModal';
import { CipherQuoteRevealModal } from './CipherQuoteRevealModal';
import { CipherQuotesVault } from './CipherQuotesVault';
import { CipherGarden } from './CipherGarden';
import { soundManager } from '../../utils/audio';

interface NesmaCipherMainProps {
  onExit: () => void;
  onAddXP?: (amount: number) => void;
  initialLevelId?: number;
}

type CipherView = 'map' | 'level' | 'vault' | 'garden';

export const NesmaCipherMain: React.FC<NesmaCipherMainProps> = ({ onExit, onAddXP, initialLevelId }) => {
  const [progress, setProgress] = useState<CipherProgress>(() => loadCipherProgress());
  const [view, setView] = useState<CipherView>(() => {
    const p = loadCipherProgress();
    if (initialLevelId && initialLevelId >= 1 && initialLevelId <= CIPHER_LEVELS.length && p.unlockedLevels.includes(initialLevelId)) {
      return 'level';
    }
    return 'map';
  });
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(() => {
    const p = loadCipherProgress();
    if (initialLevelId && initialLevelId >= 1 && initialLevelId <= CIPHER_LEVELS.length && p.unlockedLevels.includes(initialLevelId)) {
      return initialLevelId;
    }
    return (p.lastPlayedLevel && p.lastPlayedLevel >= 1 && p.lastPlayedLevel <= CIPHER_LEVELS.length) ? p.lastPlayedLevel : 1;
  });

  // Scroll to top immediately on mobile whenever screen or level changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [view, selectedLevelId]);

  // Optional direct level jump if provided in query string (e.g. ?cipherLevel=5)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const lvl = params.get('cipherLevel') || params.get('level');
      if (lvl) {
        const num = parseInt(lvl, 10);
        if (!isNaN(num) && num >= 1 && num <= CIPHER_LEVELS.length && progress.unlockedLevels.includes(num)) {
          setSelectedLevelId(num);
          setView('level');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Victory modal state
  const [victoryData, setVictoryData] = useState<{
    level: CipherLevel;
    stars: number;
    scoreEarned: number;
  } | null>(null);

  // Milestone quote reveal modal state
  const [revealedQuote, setRevealedQuote] = useState<CipherQuote | null>(null);

  const selectedLevel = CIPHER_LEVELS.find(l => l.id === selectedLevelId) || CIPHER_LEVELS[0];

  const handleSelectLevel = (levelId: number) => {
    setSelectedLevelId(levelId);
    setView('level');
  };

  const handleSolveLevel = React.useCallback((solvedLevelId: number, hintsUsed: number, isDeepChallenge: boolean = false) => {
    if (solvedLevelId !== selectedLevel.id) return;

    // Determine stars
    let stars = 3;
    if (hintsUsed === 1) stars = 2;
    if (hintsUsed >= 2) stars = 1;

    const result = completeCipherLevel(selectedLevel.id, stars, hintsUsed);
    let finalScore = result.scoreEarned;
    if (isDeepChallenge || difficulty === 'hard') {
      finalScore *= 2; // Double XP bonus for Deep Challenge or Hard Mode!
    }
    setProgress(result.updatedProgress);

    // Reward XP to main app gamification
    if (finalScore > 0 && onAddXP) {
      onAddXP(finalScore);
    }

    // Set victory modal data
    setVictoryData({
      level: selectedLevel,
      stars,
      scoreEarned: finalScore
    });

    // Check if full quote was completed
    if (result.newlyDiscoveredQuote) {
      // Delay quote reveal until victory modal is acknowledged or show immediately after
      setTimeout(() => {
        setRevealedQuote(result.newlyDiscoveredQuote || null);
      }, 500);
    }
  }, [selectedLevel, difficulty, onAddXP]);

  const handleNextLevel = () => {
    setVictoryData(null);
    const nextId = selectedLevel.id + 1;
    if (nextId <= CIPHER_LEVELS.length) {
      setSelectedLevelId(nextId);
      setView('level');
    } else {
      setView('map');
    }
  };

  const handleReturnToMapFromVictory = () => {
    setVictoryData(null);
    setView('map');
  };

  const handleReset = () => {
    const fresh = resetCipherProgress();
    setProgress(fresh);
    setView('map');
    setSelectedLevelId(1);
    soundManager.playClick();
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 dark:bg-stone-950 font-sans touch-manipulation overflow-x-hidden" dir="rtl">
      {/* 1. Map View */}
      {view === 'map' && (
        <CipherMap
          progress={progress}
          onProgressUpdate={setProgress}
          initialWorldId={selectedLevel.worldId}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onSelectLevel={handleSelectLevel}
          onOpenQuotesVault={() => setView('vault')}
          onOpenGarden={() => setView('garden')}
          onResetProgress={handleReset}
          onExitToMainApp={onExit}
        />
      )}

      {/* 2. Level Play View */}
      {view === 'level' && (
        <CipherLevelPlay
          key={selectedLevel.id}
          level={selectedLevel}
          progress={progress}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onSolveLevel={handleSolveLevel}
          onReturnToMap={() => setView('map')}
        />
      )}

      {/* 3. Discovered Quotes Vault View */}
      {view === 'vault' && (
        <CipherQuotesVault
          progress={progress}
          onBack={() => setView('map')}
        />
      )}

      {/* 4. Secret Garden View */}
      {view === 'garden' && (
        <CipherGarden
          progress={progress}
          onBack={() => setView('map')}
        />
      )}

      {/* Victory Celebration Modal */}
      {victoryData && (
        <CipherVictoryModal
          level={victoryData.level}
          stars={victoryData.stars}
          scoreEarned={victoryData.scoreEarned}
          hasNextLevel={victoryData.level.id < CIPHER_LEVELS.length}
          onNextLevel={handleNextLevel}
          onReturnToMap={handleReturnToMapFromVictory}
        />
      )}

      {/* Grand Quote Reveal Milestone Modal */}
      {revealedQuote && (
        <CipherQuoteRevealModal
          quote={revealedQuote}
          onClose={() => setRevealedQuote(null)}
        />
      )}
    </div>
  );
};
