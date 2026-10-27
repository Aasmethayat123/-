import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Gamepad2,
  HelpCircle,
  Sparkles,
  Star,
  Type,
  X,
} from 'lucide-react';
import { GameMode, Language } from '../../types';
import { GAME_GUIDES, GameGuideInfo } from '../../data/gameGuides';
import { soundManager } from '../../utils/audio';
import { FONT_SCALE_OPTIONS, useFontScale } from '../../utils/fontPreferences';

export const SEEN_GAME_GUIDES_STORAGE_KEY = 'fakkerfeha_seen_game_guides_v1';
export const AUTO_SHOW_GAME_GUIDES_STORAGE_KEY = 'fakkerfeha_auto_game_guides_v1';
export const GAME_GUIDE_PREF_CHANGED_EVENT = 'nesma:game-guide-pref-changed';

export function isAutoGameGuideEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(AUTO_SHOW_GAME_GUIDES_STORAGE_KEY);
    return val !== 'false';
  } catch {
    return true;
  }
}

export function setAutoGameGuideEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTO_SHOW_GAME_GUIDES_STORAGE_KEY, String(enabled));
    if (typeof CustomEvent === 'function' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent(GAME_GUIDE_PREF_CHANGED_EVENT));
    }
  } catch {
    // ignore
  }
}

export function resetSeenGameGuides(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SEEN_GAME_GUIDES_STORAGE_KEY);
    setAutoGameGuideEnabled(true);
  } catch {
    // ignore
  }
}

function readSeenGamesMap(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SEEN_GAME_GUIDES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function markGameGuideSeen(gameId: GameMode): void {
  if (typeof window === 'undefined') return;
  try {
    const map = readSeenGamesMap();
    map[gameId] = true;
    localStorage.setItem(SEEN_GAME_GUIDES_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

interface GameHowToPlayModalProps {
  guide: GameGuideInfo;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const GameHowToPlayModal: React.FC<GameHowToPlayModalProps> = ({
  guide,
  language,
  isOpen,
  onClose,
}) => {
  const isAr = language === 'ar';
  const [autoShowEnabled, setAutoShowEnabled] = useState<boolean>(() =>
    isAutoGameGuideEnabled()
  );

  useEffect(() => {
    if (!isOpen) return;
    setAutoShowEnabled(isAutoGameGuideEnabled());
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sections = [
    {
      icon: Compass,
      title: isAr ? 'فكرة اللعبة وهدفها' : 'Idea & Goal',
      body: isAr ? guide.ideaAndGoalAr : guide.ideaAndGoalEn,
      tone: 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60',
    },
    {
      icon: Gamepad2,
      title: isAr ? 'طريقة اللعب والتحكم' : 'How to Play & Controls',
      body: isAr ? guide.controlsAr : guide.controlsEn,
      tone: 'text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-800/70 border-stone-200/90 dark:border-stone-700',
    },
    {
      icon: CheckCircle2,
      title: isAr ? 'كيفية إكمال المرحلة أو الفوز' : 'How to Complete & Win',
      body: isAr ? guide.winConditionAr : guide.winConditionEn,
      tone: 'text-teal-900 dark:text-teal-200 bg-teal-50/70 dark:bg-teal-950/35 border-teal-200/80 dark:border-teal-800/60',
    },
    {
      icon: Star,
      title: isAr ? 'النقاط والنجوم والتلميحات' : 'Points, Stars & Hints',
      body: isAr ? guide.scoringAndHintsAr : guide.scoringAndHintsEn,
      tone: 'text-amber-900 dark:text-amber-200 bg-amber-50/75 dark:bg-amber-950/35 border-amber-200/80 dark:border-amber-800/60',
    },
    {
      icon: BookOpen,
      title: isAr ? 'المرحلة التالية أو الخروج' : 'Next Stage & Exiting',
      body: isAr ? guide.navigationAndExitAr : guide.navigationAndExitEn,
      tone: 'text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-800/70 border-stone-200/90 dark:border-stone-700',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/65 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-how-to-play-title"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        className="w-full max-w-xl rounded-t-3xl sm:rounded-3xl bg-white dark:bg-stone-900 border-t sm:border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-2xl shrink-0">
              {guide.icon}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 block">
                {isAr ? 'دليل طريقة اللعب السريع' : 'Quick How-To-Play Guide'}
              </span>
              <h3
                id="game-how-to-play-title"
                className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 leading-snug"
              >
                {isAr ? guide.titleAr : guide.titleEn}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق الشرح والعودة للعبة' : 'Close guide and resume game'}
            className="min-w-[44px] min-h-[44px] -me-2 flex items-center justify-center rounded-full text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Structured Guide Blocks */}
        <div className="space-y-2.5">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border space-y-1 ${sec.tone}`}
              >
                <div className="flex items-center gap-2 text-xs font-extrabold">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{sec.title}</span>
                </div>
                <p className="text-sm text-stone-800 dark:text-stone-100 leading-relaxed font-normal">
                  {sec.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* Auto-show preference + Start/Resume CTA */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2.5 text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!autoShowEnabled}
              onChange={(e) => {
                const skipAuto = e.target.checked;
                setAutoShowEnabled(!skipAuto);
                setAutoGameGuideEnabled(!skipAuto);
              }}
              className="w-4 h-4 rounded accent-emerald-700 cursor-pointer"
            />
            <span>
              {isAr
                ? 'تخطي فتح الشرح تلقائياً عند دخول ألعاب جديدة'
                : 'Skip auto-opening guides on new games'}
            </span>
          </label>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{isAr ? 'ابدأ / متابعة اللعب الآن' : 'Start / Resume Game'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface GameGuideWrapperProps {
  gameMode: GameMode;
  language: Language;
  children: React.ReactNode;
}

/**
 * Wraps any playable game without ever unmounting `children`.
 * Provides:
 * 1. Persistent, non-blocking top bar with «طريقة اللعب» button + 1-tap Font Scale toggle.
 * 2. Skippable first-visit intro modal that preserves 100% of live game state when opened/closed.
 */
export const GameGuideWrapper: React.FC<GameGuideWrapperProps> = ({
  gameMode,
  language,
  children,
}) => {
  const isAr = language === 'ar';
  const guide = GAME_GUIDES[gameMode];
  const { fontScale, cycleNextFontScale } = useFontScale();
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!guide) {
      setIsGuideOpen(false);
      return;
    }
    const seenMap = readSeenGamesMap();
    if (!seenMap[gameMode] && isAutoGameGuideEnabled()) {
      setIsGuideOpen(true);
    } else {
      setIsGuideOpen(false);
    }
  }, [gameMode, guide]);

  if (!guide) {
    return <>{children}</>;
  }

  const handleCloseGuide = () => {
    soundManager.playSoftTap();
    markGameGuideSeen(gameMode);
    setIsGuideOpen(false);
  };

  const handleOpenGuide = () => {
    soundManager.playSoftTap();
    markGameGuideSeen(gameMode);
    setIsGuideOpen(true);
  };

  const activeFontOpt =
    FONT_SCALE_OPTIONS.find((o) => o.id === fontScale) || FONT_SCALE_OPTIONS[0];

  return (
    <>
      {/* Slim, Non-Intrusive In-Game Companion Strip */}
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className="bg-stone-100/90 dark:bg-stone-900/95 border-b border-stone-200/90 dark:border-stone-800 px-3 sm:px-6 py-2 print:hidden"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <span aria-hidden="true" className="text-base shrink-0">
              {guide.icon}
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
              {isAr ? guide.titleAr : guide.titleEn}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick In-Game Font Scale Button */}
            <button
              type="button"
              onClick={() => {
                soundManager.playSoftTap();
                cycleNextFontScale();
              }}
              title={
                isAr
                  ? `تكبير حجم الخط (الحالي: ${activeFontOpt.labelAr})`
                  : `Cycle font size (Current: ${activeFontOpt.labelEn})`
              }
              className="min-h-[38px] px-3 py-1 rounded-xl bg-white hover:bg-stone-50 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Type className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>
                {isAr ? `الخط: ${activeFontOpt.labelAr}` : `Text: ${activeFontOpt.labelEn}`}
              </span>
            </button>

            {/* Always-Available How-To-Play Button */}
            <button
              type="button"
              onClick={handleOpenGuide}
              className="min-h-[38px] px-3.5 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <HelpCircle className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>{isAr ? 'طريقة اللعب' : 'How to Play'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Game Content (Never unmounted when modal opens/closes!) */}
      {children}

      {/* Non-Destructive How-To-Play Modal */}
      <GameHowToPlayModal
        guide={guide}
        language={language}
        isOpen={isGuideOpen}
        onClose={handleCloseGuide}
      />
    </>
  );
};
