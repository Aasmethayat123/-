import React, { useState } from 'react';
import { Language, GameMode } from '../../types';
import { HIDDEN_PATHS, HiddenPath } from '../../utils/adventures';
import { ALL_36_GAMES, GameCatalogItem } from '../../data/gamesCatalog';
import { soundManager } from '../../utils/audio';
import { X, Sparkles, ArrowRight, CheckCircle2, Compass, MapPin } from 'lucide-react';

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
  if (!isOpen) return null;
  const isAr = language === 'ar';

  const [selectedPath, setSelectedPath] = useState<HiddenPath>(HIDDEN_PATHS[0]);

  const getGameItem = (id: GameMode): GameCatalogItem | undefined => {
    return ALL_36_GAMES.find((g) => g.id === id);
  };

  const handleStartPathGame = (gameId: GameMode) => {
    soundManager.playSoftTap();
    onClose();
    onSelectGame(gameId);
  };

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
                {isAr ? 'المسارات الخفية 🗺️' : 'Curated Hidden Paths 🗺️'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isAr ? 'سلسلة من ۳ تجارب منسقة متناغمة تقودك إلى غاية واحدة' : 'Harmonious 3-game curated journeys with focused intention'}
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
            return (
              <button
                key={path.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setSelectedPath(path);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 dark:bg-indigo-600 text-white shadow-2xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-750'
                }`}
              >
                <span>{path.icon}</span>
                <span>{isAr ? path.titleAr : path.titleEn}</span>
              </button>
            );
          })}
        </div>

        {/* Active Path Details */}
        <div className="p-5 rounded-2xl bg-stone-50/80 dark:bg-stone-850 border border-stone-200/90 dark:border-stone-800 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedPath.icon}</span>
              <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                {isAr ? selectedPath.titleAr : selectedPath.titleEn}
              </h4>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {isAr ? selectedPath.descAr : selectedPath.descEn}
            </p>
          </div>

          {/* 3 Steps Sequence */}
          <div className="space-y-2.5 pt-2 border-t border-stone-200/60 dark:border-stone-750">
            <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 block uppercase tracking-wider">
              {isAr ? 'محطات المسار الثلاث بالتسلسل:' : 'The 3 Sequential Stages:'}
            </span>

            <div className="space-y-2">
              {selectedPath.gameIds.map((gameId, index) => {
                const game = getGameItem(gameId);
                if (!game) return null;
                const Icon = game.icon;
                return (
                  <div
                    key={gameId}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-xs text-stone-700 dark:text-stone-300 font-mono">
                        {index + 1}
                      </div>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                          {isAr ? game.nameAr : game.nameEn}
                        </h5>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                          {isAr ? game.descAr : game.descEn}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartPathGame(gameId)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-transform hover:scale-103"
                    >
                      {isAr ? 'خوض المحطة' : 'Play Step'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inspirational Quote of the Path */}
          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 text-xs font-serif font-bold text-indigo-900 dark:text-indigo-200 italic">
            {isAr ? selectedPath.completionQuoteAr : selectedPath.completionQuoteEn}
          </div>
        </div>

        {/* Start Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            {isAr ? 'المسار اختياري تماماً ولا يؤثر على الوصول للألعاب الأصلية' : 'Completely optional curated journey'}
          </span>
          <button
            onClick={() => handleStartPathGame(selectedPath.gameIds[0])}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-transform hover:scale-103 shadow-xs"
          >
            <span>{isAr ? 'بدء المحطة الأولى الآن 🚀' : 'Start First Stage 🚀'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
