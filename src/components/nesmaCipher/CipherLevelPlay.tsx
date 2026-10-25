import React, { useState } from 'react';
import { CipherLevel, CipherQuote, CipherProgress } from '../../types/nesmaCipher';
import { CIPHER_WORLDS, CIPHER_QUOTES } from '../../data/nesmaCipherData';
import { 
  ArrowRight, 
  Lightbulb, 
  RotateCcw, 
  HelpCircle, 
  X, 
  Sparkles, 
  Trophy,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { spendCipherXP } from '../../utils/nesmaCipherStorage';
import { CipherVisualAmbiance } from './CipherVisualAmbiance';

// Puzzle Components
import { TilePuzzle } from './puzzles/TilePuzzle';
import { LetterScramblePuzzle } from './puzzles/LetterScramblePuzzle';
import { WordSequencePuzzle } from './puzzles/WordSequencePuzzle';
import { PathMazePuzzle } from './puzzles/PathMazePuzzle';
import { PatternMatrixPuzzle } from './puzzles/PatternMatrixPuzzle';
import { ClueSearchPuzzle } from './puzzles/ClueSearchPuzzle';
import { MissingPiecePuzzle } from './puzzles/MissingPiecePuzzle';
import { SymbolCipherPuzzle } from './puzzles/SymbolCipherPuzzle';
import { ScenarioOrderPuzzle } from './puzzles/ScenarioOrderPuzzle';
import { HybridChallengePuzzle } from './puzzles/HybridChallengePuzzle';

interface CipherLevelPlayProps {
  level: CipherLevel;
  progress: CipherProgress;
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (diff: 'easy' | 'medium' | 'hard') => void;
  onSolveLevel: (solvedLevelId: number, hintsUsed: number, isDeepChallenge: boolean) => void;
  onReturnToMap: () => void;
}

export const CipherLevelPlay: React.FC<CipherLevelPlayProps> = ({
  level,
  progress,
  difficulty,
  onDifficultyChange,
  onSolveLevel,
  onReturnToMap
}) => {
  const [hintsUnlockedCount, setHintsUnlockedCount] = useState<number>(0);
  const [isDeepChallengeMode, setIsDeepChallengeMode] = useState<boolean>(false);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [puzzleKey, setPuzzleKey] = useState<number>(0); // for instant reset

  const [userScore, setUserScore] = useState<number>(progress.score);
  const [revealedLetter, setRevealedLetter] = useState<string | null>(null);
  const [revealedConceptClue, setRevealedConceptClue] = useState<boolean>(false);

  const currentWorld = CIPHER_WORLDS.find(w => w.id === level.worldId) || CIPHER_WORLDS[0];
  const associatedQuote = CIPHER_QUOTES.find(q => q.id === level.quoteId);

  const maxHintsAllowed = difficulty === 'hard' ? 1 : difficulty === 'medium' ? 2 : 3;

  const handleUnlockNextHint = () => {
    if (hintsUnlockedCount < maxHintsAllowed) {
      soundManager.playClick();
      setHintsUnlockedCount(prev => prev + 1);
    }
  };

  const handleSpendForLetter = () => {
    const cost = 25;
    if (userScore < cost) {
      soundManager.playIncorrect();
      return;
    }
    const updated = spendCipherXP(cost);
    if (updated) {
      soundManager.playCorrect();
      setUserScore(updated.score);
      const targetStr = level.rewardToken?.value || level.titleAr;
      const randomChar = targetStr.charAt(Math.floor(Math.random() * targetStr.length));
      setRevealedLetter(randomChar);
    }
  };

  const handleSpendForConcept = () => {
    const cost = 30;
    if (userScore < cost || revealedConceptClue) {
      soundManager.playIncorrect();
      return;
    }
    const updated = spendCipherXP(cost);
    if (updated) {
      soundManager.playCorrect();
      setUserScore(updated.score);
      setRevealedConceptClue(true);
    }
  };

  const [isSolved, setIsSolved] = useState<boolean>(false);
  const isMountedRef = React.useRef<boolean>(true);
  const hasSolvedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleRestartPuzzle = () => {
    soundManager.playClick();
    hasSolvedRef.current = false;
    setIsSolved(false);
    setPuzzleKey(prev => prev + 1);
  };

  const handlePuzzleSolved = React.useCallback(() => {
    if (!isMountedRef.current || hasSolvedRef.current) return;
    hasSolvedRef.current = true;
    setIsSolved(true);
    onSolveLevel(level.id, hintsUnlockedCount, isDeepChallengeMode);
  }, [level.id, hintsUnlockedCount, isDeepChallengeMode, onSolveLevel]);

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      {/* Level Play Sticky Header */}
      <header className="sticky top-0 z-30 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Back & Level Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReturnToMap}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              title="العودة لخريطة المراحل"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                  المرحلة {level.id}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {currentWorld.nameAr}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-tight">
                {level.titleAr}
              </h1>
            </div>
          </div>

          {/* Action buttons: Deep Challenge Mode, Hint & Reset */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsDeepChallengeMode(!isDeepChallengeMode);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isDeepChallengeMode
                  ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-md animate-pulse'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
              title="تفعيل وضع التحدي العميق لمضاعفة النقاط وبناء خفة الحركة الذهنية"
            >
              <span>⚡ تحدي عميق {isDeepChallengeMode ? '(مفعل 2x)' : ''}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setShowHintModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all cursor-pointer shadow-2xs"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>التلميحات {hintsUnlockedCount > 0 ? `(${hintsUnlockedCount}/3)` : ''}</span>
            </button>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => { soundManager.playClick(); onDifficultyChange('easy'); }}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${difficulty === 'easy' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'}`}
              >
                سهل
              </button>
              <button
                type="button"
                onClick={() => { soundManager.playClick(); onDifficultyChange('medium'); }}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${difficulty === 'medium' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'}`}
              >
                متوسط
              </button>
              <button
                type="button"
                onClick={() => { soundManager.playClick(); onDifficultyChange('hard'); }}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${difficulty === 'hard' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'}`}
              >
                صعب 2x
              </button>
            </div>

            <button
              type="button"
              onClick={handleRestartPuzzle}
              className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="إعادة بدء اللغز"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Play Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 space-y-6">
        {/* Animated SVG Ambiance Widget: Locks, Gears & Keys */}
        <CipherVisualAmbiance progressCount={hintsUnlockedCount} isSolved={isSolved} />

        {/* Companion Guidance Banner (بوصلة نسمة) */}
        {level.narrativeContext && (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-amber-950/30 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs text-lg">
              🧭
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  بوصلة نسمة — {level.narrativeContext.storyChapterAr}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {level.narrativeContext.companionIntroAr}
              </p>
            </div>
          </div>
        )}

        {/* Quote Chain Progress Strip */}
        {associatedQuote && (
          <div className="bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 dark:text-stone-400 font-medium">
                سلسلة المقولة: <strong className="text-stone-900 dark:text-stone-100">{associatedQuote.topic}</strong>
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">
                مكافأة المرحلة: {level.rewardToken.value}
              </span>
            </div>

            {/* Token slots in this quote */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {associatedQuote.tokens.map((tokenObj) => {
                const isThisLevel = tokenObj.levelId === level.id;
                const isAlreadyCollected = progress.completedLevels.includes(tokenObj.levelId);

                return (
                  <div
                    key={tokenObj.levelId}
                    className={`py-1.5 px-2 rounded-xl text-center border text-xs transition-all ${
                      isAlreadyCollected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold'
                        : isThisLevel
                          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold ring-2 ring-amber-400/50'
                          : 'bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-400'
                    }`}
                  >
                    <span className="block text-[10px] text-stone-400 mb-0.5">
                      مرحلة {tokenObj.levelId}
                    </span>
                    <span className="block truncate">
                      {isAlreadyCollected ? tokenObj.token : isThisLevel ? '✨ قيد الحل' : '🔒'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Puzzle Board Container */}
        <div className="bg-white dark:bg-stone-900 p-5 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
          {/* Dispatch corresponding puzzle component */}
          <div key={puzzleKey}>
            {level.puzzleType === 'tile_puzzle' && (
              <TilePuzzle
                data={level.puzzleData as any}
                onSolve={handlePuzzleSolved}
              />
            )}
            {level.puzzleType === 'letter_scramble' && (
              <LetterScramblePuzzle
                data={level.puzzleData as any}
                onSolve={handlePuzzleSolved}
              />
            )}
            {level.puzzleType === 'word_sequence' && (
              <WordSequencePuzzle
                data={level.puzzleData as any}
                onSolve={handlePuzzleSolved}
              />
            )}
            {level.puzzleType === 'path_maze' && (
              <PathMazePuzzle
                data={level.puzzleData as any}
                onSolve={handlePuzzleSolved}
              />
            )}
            {level.puzzleType === 'pattern_matrix' && (
              <PatternMatrixPuzzle
                data={level.puzzleData as any}
                onSolve={handlePuzzleSolved}
              />
            )}
            {level.puzzleType === 'clue_search' && (
              <ClueSearchPuzzle
                data={level.puzzleData as any}
                onSolve={handlePuzzleSolved}
              />
            )}
            {level.puzzleType === 'missing_piece' && (
              <MissingPiecePuzzle
                data={level.puzzleData as any}
                onSolve={handlePuzzleSolved}
              />
            )}
            {level.puzzleType === 'symbol_cipher' && (
              <SymbolCipherPuzzle
                data={level.puzzleData as any}
                onSolve={handlePuzzleSolved}
              />
            )}
            {level.puzzleType === 'scenario_order' && (
              <ScenarioOrderPuzzle
                data={level.puzzleData as any}
                onSolve={handlePuzzleSolved}
              />
            )}
            {level.puzzleType === 'hybrid_challenge' && (
              <HybridChallengePuzzle
                data={level.puzzleData as any}
                onSolve={handlePuzzleSolved}
              />
            )}
          </div>
        </div>
      </main>

      {/* 3-Tier Progressive Hints Modal */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-base">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>تلميحات المرحلة {level.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHintModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              التلميحات مصممة تدريجياً لتعينك دون حرق متعة الاكتشاف. استخدام التلميحات يقلل قليلاً من نقاط المكافأة لكنه يساعدك على الاستمرار بسلام.
            </p>

            {/* XP Store for Advanced Hints & Concept Clues */}
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
                <span>🪙 متجر إنفاق الـ XP للمساعدة:</span>
                <span className="bg-amber-200/80 dark:bg-amber-900 px-2 py-0.5 rounded-md tabular-nums">رصيدك: {userScore} XP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSpendForLetter}
                  disabled={userScore < 25}
                  className="py-2 px-3 bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-700 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-100 disabled:opacity-40 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>كشف حرف من الشفرة</span>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded font-mono">25 XP</span>
                </button>

                <button
                  type="button"
                  onClick={handleSpendForConcept}
                  disabled={userScore < 30 || revealedConceptClue}
                  className="py-2 px-3 bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-700 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-100 disabled:opacity-40 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>إضاءة المفهوم النفسي</span>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded font-mono">30 XP</span>
                </button>
              </div>

              {revealedLetter && (
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 text-center font-bold animate-in fade-in">
                  🔑 حرف مكشوف من مفتاح الشفرة: «{revealedLetter}»
                </div>
              )}

              {revealedConceptClue && (
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 text-center font-medium animate-in fade-in leading-relaxed">
                  🧠 <strong>الإضاءة النفسية العميقة:</strong> {level.insightNote}
                </div>
              )}
            </div>

            {/* Hint Levels 1, 2, 3 */}
            <div className="space-y-3">
              {[0, 1, 2].map((idx) => {
                const isUnlocked = idx < hintsUnlockedCount;
                const hintLabels = ['١. توجيه عام للمسار', '٢. إيضاح المفتاح الأساسي', '٣. الحل الإرشادي المباشر'];

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200'
                        : 'bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-400'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1">
                      {hintLabels[idx]}
                    </span>
                    {isUnlocked ? (
                      <p className="text-xs leading-relaxed font-medium">
                        {level.hints[idx]}
                      </p>
                    ) : (
                      <span className="text-[11px] flex items-center gap-1.5 opacity-70">
                        <Lock className="w-3.5 h-3.5" />
                        <span>مغلق؛ انقر على زر كشف التلميح أدناه</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Unlock Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleUnlockNextHint}
                disabled={hintsUnlockedCount >= 3}
                className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {hintsUnlockedCount === 0 
                    ? 'كشف التلميح الأول' 
                    : hintsUnlockedCount < 3 
                      ? 'كشف التلميح التالي' 
                      : 'تم كشف كل التلميحات'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowHintModal(false)}
                className="py-2 px-4 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer"
              >
                إغلاق والعودة للعب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
