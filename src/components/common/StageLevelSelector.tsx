import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  Lock, 
  Star, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Trophy,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import { Language } from '../../types';
import { 
  StageDefinition, 
  GameProgressData, 
  GAME_STAGES_CONFIG 
} from '../../utils/gameLevelsManager';
import { soundManager } from '../../utils/audio';

interface StageLevelSelectorProps {
  language: Language;
  gameId: string;
  currentStage: number;
  progress: GameProgressData;
  onSelectStage: (stageNumber: number) => void;
  // Modal props when a stage is just completed
  showCompletionModal?: boolean;
  completedStageNumber?: number;
  starsEarned?: number;
  movesMade?: number;
  xpEarned?: number;
  onNextStage?: () => void;
  onReplayStage?: () => void;
  onCloseCompletionModal?: () => void;
}

export const StageLevelSelector: React.FC<StageLevelSelectorProps> = ({
  language,
  gameId,
  currentStage,
  progress,
  onSelectStage,
  showCompletionModal = false,
  completedStageNumber = currentStage,
  starsEarned = 3,
  movesMade,
  xpEarned,
  onNextStage,
  onReplayStage,
  onCloseCompletionModal
}) => {
  const isAr = language === 'ar';
  const stages: StageDefinition[] = GAME_STAGES_CONFIG[gameId] || [];
  const currentStageDef = stages.find(s => s.stageNumber === currentStage) || stages[0];
  const [isOpen, setIsOpen] = useState(false);

  if (!stages.length) return null;

  const totalStages = stages.length;
  const unlockedCount = progress.unlockedStages.length;
  const progressPercent = Math.round((progress.completedStagesCount / totalStages) * 100);

  const getDifficultyBadgeColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'hard':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-800';
      case 'expert':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'master':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800 shadow-xs';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  const handleStageClick = (stageNum: number) => {
    if (!progress.unlockedStages.includes(stageNum)) {
      soundManager.playSoftTap();
      return;
    }
    soundManager.playSoftTap();
    onSelectStage(stageNum);
    setIsOpen(false);
  };

  const hasNextStage = completedStageNumber < totalStages;

  return (
    <>
      {/* Level Selector Bar */}
      <div className="relative inline-block w-full sm:w-auto">
        <button
          onClick={() => {
            soundManager.playSoftTap();
            setIsOpen(!isOpen);
          }}
          className="w-full sm:w-auto flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer text-start"
        >
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
              {currentStage}
            </span>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100">
                  {isAr ? `المرحلة ${currentStage} من ${totalStages}` : `Stage ${currentStage} of ${totalStages}`}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getDifficultyBadgeColor(currentStageDef.difficulty)}`}>
                  {isAr ? currentStageDef.difficultyAr : currentStageDef.difficultyEn}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-snug">
                {isAr ? currentStageDef.titleAr : currentStageDef.titleEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-stone-400">
            {/* Display Stars for current stage if earned */}
            {progress.stars[currentStage] ? (
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < progress.stars[currentStage] ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-600'}`} 
                  />
                ))}
              </div>
            ) : null}
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Dropdown Menu of Stages */}
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-xs" 
              onClick={() => setIsOpen(false)} 
            />
            <div className="absolute start-0 mt-2 w-full sm:w-80 p-3 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl z-50 animate-scale-up space-y-2">
              <div className="flex items-center justify-between px-1 pb-2 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-1.5 text-xs font-black text-stone-800 dark:text-stone-200">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isAr ? 'خريطة مراحل التحدي' : 'Stage Challenge Map'}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {isAr ? `مكتمل ${progressPercent}٪` : `${progressPercent}% Done`}
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* List of Stages */}
              <div className="max-h-72 overflow-y-auto space-y-1.5 pe-1 py-1">
                {stages.map((stage) => {
                  const isUnlocked = progress.unlockedStages.includes(stage.stageNumber);
                  const isSelected = stage.stageNumber === currentStage;
                  const stars = progress.stars[stage.stageNumber] || 0;

                  return (
                    <button
                      key={stage.stageNumber}
                      disabled={!isUnlocked}
                      onClick={() => handleStageClick(stage.stageNumber)}
                      className={`w-full p-2.5 rounded-2xl border text-start transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-500/10 border-amber-500 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100 shadow-xs' 
                          : isUnlocked 
                          ? 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-750 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300' 
                          : 'opacity-50 bg-stone-100/50 dark:bg-stone-850/50 border-stone-200/40 dark:border-stone-800/40 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected 
                            ? 'bg-amber-500 text-white' 
                            : isUnlocked 
                            ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200' 
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                        }`}>
                          {isUnlocked ? stage.stageNumber : <Lock className="w-3.5 h-3.5" />}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold truncate">
                              {isAr ? stage.titleAr : stage.titleEn}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-md border shrink-0 ${getDifficultyBadgeColor(stage.difficulty)}`}>
                              {isAr ? stage.difficultyAr : stage.difficultyEn}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate">
                            {isAr ? stage.descriptionAr : stage.descriptionEn}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 gap-0.5">
                        {isUnlocked && stars > 0 ? (
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-600'}`} 
                              />
                            ))}
                          </div>
                        ) : isUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {isAr ? 'مفتوح ⚡' : 'Unlocked'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">
                            {isAr ? 'مغلق 🔒' : 'Locked'}
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-stone-400">+{stage.xpReward} XP</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Stage Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-400 dark:border-amber-500/80 shadow-2xl text-center space-y-5 animate-scale-up">
            
            {/* Top Trophy Icon with Confetti Vibes */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-950 shadow-lg shadow-amber-400/30 animate-bounce">
              <Trophy className="w-10 h-10" />
              <div className="absolute -top-1 -end-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-stone-900">
                ✓
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                {isAr ? `تهانينا! أكملت المرحلة ${completedStageNumber}` : `Stage ${completedStageNumber} Completed!`}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif pt-1">
                {isAr 
                  ? (stages.find(s => s.stageNumber === completedStageNumber)?.titleAr || 'إنجاز رائع ومتقن!')
                  : (stages.find(s => s.stageNumber === completedStageNumber)?.titleEn || 'Outstanding Mastery!')}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
                {isAr 
                  ? 'خطوة جديدة في التدرج والوعي؛ كفاءتك الذهنية ترتفع مع كل مستوى تتخطاه بنجاح.'
                  : 'Your cognitive agility expands with every progressive stage you conquer.'}
              </p>
            </div>

            {/* Stars Rating Display */}
            <div className="flex items-center justify-center gap-2 py-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i}
                  className={`p-2.5 rounded-2xl border transition-all transform ${
                    i < starsEarned 
                      ? 'bg-amber-500/10 border-amber-400 text-amber-400 scale-110 shadow-md shadow-amber-500/20' 
                      : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-300 dark:text-stone-600'
                  }`}
                >
                  <Star className={`w-7 h-7 ${i < starsEarned ? 'fill-amber-400 text-amber-400' : ''}`} />
                </div>
              ))}
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-3 py-1 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
                <span className="text-stone-400 text-[10px] block">{isAr ? 'نقاط الوعي المكتسبة' : 'XP Awarded'}</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                  <Zap className="w-4 h-4" />
                  <span>+{xpEarned || (completedStageNumber * 40 + 30)} XP</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
                <span className="text-stone-400 text-[10px] block">{isAr ? 'عدد الحركات' : 'Moves Made'}</span>
                <span className="text-base font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-4 h-4" />
                  <span>{movesMade !== undefined ? movesMade : '✓'}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {hasNextStage && onNextStage && (
                <button
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNextStage();
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-102"
                >
                  <span>{isAr ? `انتقلي للمرحلة التالية (${completedStageNumber + 1}) 🚀` : `Next Stage (${completedStageNumber + 1}) 🚀`}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              )}

              <div className="flex items-center gap-2">
                {onReplayStage && (
                  <button
                    onClick={() => {
                      soundManager.playSoftTap();
                      onReplayStage();
                    }}
                    className="flex-1 py-2.5 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إعادة المرحلة' : 'Replay Stage'}</span>
                  </button>
                )}

                {onCloseCompletionModal && (
                  <button
                    onClick={() => {
                      soundManager.playSoftTap();
                      onCloseCompletionModal();
                    }}
                    className="flex-1 py-2.5 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{isAr ? 'البقاء هنا' : 'Stay Here'}</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
