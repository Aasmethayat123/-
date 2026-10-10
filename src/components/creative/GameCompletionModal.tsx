import React from 'react';
import { Language, GameMode } from '../../types';
import { ALL_36_GAMES, GameCatalogItem } from '../../data/gamesCatalog';
import { soundManager } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { 
  CheckCircle2, 
  RotateCw, 
  ArrowRight, 
  Bookmark, 
  Sparkles, 
  Gamepad2, 
  Home, 
  X 
} from 'lucide-react';

interface GameCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentGameId: GameMode;
  levelId?: string;
  onReplay: () => void;
  onBackToLibrary: () => void;
  onBackToHome: () => void;
  onPlayNext: (nextGameId: GameMode, nextLevelId?: string) => void;
}

export const GameCompletionModal: React.FC<GameCompletionModalProps> = ({
  isOpen,
  onClose,
  language,
  currentGameId,
  levelId,
  onReplay,
  onBackToLibrary,
  onBackToHome,
  onPlayNext
}) => {
  if (!isOpen) return null;
  const isAr = language === 'ar';

  const currentGame = ALL_36_GAMES.find((g) => g.id === currentGameId && (!levelId || g.levelId === levelId)) || ALL_36_GAMES[0];

  // Find a related game from the same state or category
  const relatedGame = ALL_36_GAMES.find((g) => g.id !== currentGameId && g.categoryKey === currentGame.categoryKey) || 
                      ALL_36_GAMES.find((g) => g.id !== currentGameId) || 
                      ALL_36_GAMES[1];

  const handleNextGame = () => {
    soundManager.playSoftTap();
    onClose();
    onPlayNext(relatedGame.id, relatedGame.levelId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 dark:bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 relative text-center transition-colors space-y-5"
        role="dialog"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Emblem */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-inner border border-emerald-200/80 dark:border-emerald-800/60">
          🌿
        </div>

        {/* Completion Message */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-block">
            {isAr ? 'تمت التجربة بنجاح ✨' : 'Experience Complete ✨'}
          </span>
          <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
            {isAr ? currentGame.nameAr : currentGame.nameEn}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs mx-auto">
            {isAr
              ? 'كل وقفة وعي وتفريغ تخوضها تمنح جهازك العصبي رسالة أمان، وتفتح لعقلك مساحة أرحب للتصرف بحكمة.'
              : 'Every conscious pause signals safety to your nervous system and widens your space for wisdom.'}
          </p>
        </div>

        {/* Suggested Next Related Experience */}
        {relatedGame && (
          <div className="p-3.5 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 text-start space-y-2">
            <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
              {isAr ? 'تجربة أخرى قريبة في الفكرة:' : 'Suggested Next Experience:'}
            </span>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                  {isAr ? relatedGame.nameAr : relatedGame.nameEn}
                </h4>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                  {relatedGame.approxDuration} · {isAr ? relatedGame.badgeAr : relatedGame.badgeEn}
                </p>
              </div>
              <button
                onClick={handleNextGame}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-transform hover:scale-103 shrink-0"
              >
                {isAr ? 'خوض التجربة ➜' : 'Play ➜'}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => {
              soundManager.playSoftTap();
              onClose();
              onReplay();
            }}
            className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4 text-stone-500" />
            <span className="text-[11px]">{isAr ? 'إعادة' : 'Replay'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playSoftTap();
              onClose();
              onBackToLibrary();
            }}
            className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px]">{isAr ? 'المكتبة' : 'Library'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playSoftTap();
              onClose();
              onBackToHome();
            }}
            className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-amber-500" />
            <span className="text-[11px]">{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
