import React, { useState, useEffect } from 'react';
import { Language, GameMode } from '../../types';
import { 
  HIDDEN_PATHS, 
  HiddenPath, 
  getHiddenPathProgress, 
  recordPathStepCompleted, 
  resetHiddenPathProgress 
} from '../../utils/adventures';
import { ALL_36_GAMES, GameCatalogItem } from '../../data/gamesCatalog';
import { soundManager } from '../../utils/audio';
import { X, Sparkles, ArrowRight, Check, RotateCw, CheckCircle2 } from 'lucide-react';

interface HiddenPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectGame: (gameId: GameMode) => void;
}

export const HiddenPathModal: React.FC<HiddenPathModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectGame
}) => {
  const isAr = language === 'ar';
  const [selectedPath, setSelectedPath] = useState<HiddenPath>(HIDDEN_PATHS[0]);
  const [completedSteps, setCompletedSteps] = useState<GameMode[]>(() => 
    getHiddenPathProgress(selectedPath.id)
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getGameItem = (id: GameMode): GameCatalogItem | undefined => {
    return ALL_36_GAMES.find((g) => g.id === id);
  };

  const handleSelectPathTab = (path: HiddenPath) => {
    soundManager.playSoftTap();
    setSelectedPath(path);
    setCompletedSteps(getHiddenPathProgress(path.id));
  };

  const handleStartPathGame = (gameId: GameMode) => {
    soundManager.playSoftTap();
    // Record step completion safely
    recordPathStepCompleted(selectedPath.id, gameId);
    setCompletedSteps(getHiddenPathProgress(selectedPath.id));
    onClose();
    onSelectGame(gameId);
  };

  const handleResetPath = () => {
    soundManager.playSoftTap();
    resetHiddenPathProgress(selectedPath.id);
    setCompletedSteps([]);
  };

  const isAllStepsCompleted = selectedPath.gameIds.length > 0 && 
    selectedPath.gameIds.every(id => completedSteps.includes(id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 dark:bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative text-start transition-colors space-y-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-xl">
              🗺️
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                {isAr ? 'المسارات الخمسة الموجهة 🗺️' : 'The 5 Guided Hidden Paths 🗺️'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isAr ? 'سلاسل منسقة من ۳ تجارب مترابطة تصب في غاية وعي واحدة' : 'Curated 3-stage journeys designed around unified intentions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Path Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {HIDDEN_PATHS.map((path) => {
            const isSelected = selectedPath.id === path.id;
            const pathProgress = getHiddenPathProgress(path.id);
            const isFinished = path.gameIds.every(id => pathProgress.includes(id));

            return (
              <button
                key={path.id}
                onClick={() => handleSelectPathTab(path)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 dark:bg-indigo-600 text-white shadow-2xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-750'
                }`}
              >
                <span>{path.icon}</span>
                <span>{isAr ? path.titleAr : path.titleEn}</span>
                {isFinished && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Path Details */}
        <div className="p-5 rounded-2xl bg-stone-50/80 dark:bg-stone-850 border border-stone-200/90 dark:border-stone-800 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPath.icon}</span>
                <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                  {isAr ? selectedPath.titleAr : selectedPath.titleEn}
                </h4>
              </div>

              {isAllStepsCompleted && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isAr ? 'مكتمل بالكامل' : 'Path Completed'}</span>
                </span>
              )}
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {isAr ? selectedPath.descAr : selectedPath.descEn}
            </p>
          </div>

          {/* 3 Steps Sequence */}
          <div className="space-y-2.5 pt-2 border-t border-stone-200/60 dark:border-stone-750">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                {isAr ? 'محطات المسار الثلاث بالتسلسل:' : 'The 3 Sequential Stages:'}
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                {completedSteps.length} / {selectedPath.gameIds.length}
              </span>
            </div>

            <div className="space-y-2">
              {selectedPath.gameIds.map((gameId, index) => {
                const game = getGameItem(gameId);
                if (!game) return null;
                const Icon = game.icon;
                const isStepDone = completedSteps.includes(gameId);

                return (
                  <div
                    key={gameId}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      isStepDone 
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                        isStepDone 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}>
                        {isStepDone ? '✓' : index + 1}
                      </div>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                            {isAr ? game.nameAr : game.nameEn}
                          </h5>
                          {isStepDone && (
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                              {isAr ? 'تمت' : 'Done'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                          {isAr ? game.descAr : game.descEn}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartPathGame(gameId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-transform hover:scale-103 ${
                        isStepDone
                          ? 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                          : 'bg-stone-900 hover:bg-stone-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isStepDone ? (isAr ? 'إعادة خوضها' : 'Replay') : (isAr ? 'خوض المحطة' : 'Play Step')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inspirational Quote of the Path */}
          <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/70 dark:border-indigo-900/40 text-xs font-serif font-bold text-indigo-950 dark:text-indigo-200 leading-relaxed">
            {isAr ? selectedPath.completionQuoteAr : selectedPath.completionQuoteEn}
          </div>

          {/* If all steps done, give a celebratory reset or next action */}
          {isAllStepsCompleted && (
            <div className="p-3 bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between gap-3 text-xs">
              <span className="text-emerald-900 dark:text-emerald-200 font-semibold">
                {isAr ? '✨ رائع! أكملت جميع محطات هذا المسار بنجاح.' : '✨ Great! You have completed all stations of this path.'}
              </span>
              <button
                onClick={handleResetPath}
                className="px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-stone-50 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-lg font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <RotateCw className="w-3 h-3" />
                <span>{isAr ? 'إعادة المسار' : 'Reset'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info & Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400 dark:text-stone-500">
          <p>
            {isAr 
              ? 'المسارات للتأمل والتوعية وتدريب المرونة، وليست تقييماً نفسياً أو بديلاً عن الإرشاد المتخصص.'
              : 'These paths are for reflection and awareness, not psychological evaluation.'}
          </p>

          <button
            onClick={() => {
              const nextUncompleted = selectedPath.gameIds.find(id => !completedSteps.includes(id)) || selectedPath.gameIds[0];
              handleStartPathGame(nextUncompleted);
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-transform hover:scale-103 shadow-xs shrink-0"
          >
            <span>{isAr ? 'متابعة المسار ➜' : 'Continue Path ➜'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
