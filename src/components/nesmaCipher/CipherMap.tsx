import React, { useState } from 'react';
import { CipherProgress, CipherWorldId } from '../../types/nesmaCipher';
import { CIPHER_WORLDS, CIPHER_LEVELS, CIPHER_QUOTES, CIPHER_IMAGES } from '../../data/nesmaCipherData';
import { 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Star, 
  BookOpen, 
  Flower2, 
  ChevronRight, 
  ChevronLeft,
  Compass,
  Trophy,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface CipherMapProps {
  progress: CipherProgress;
  onSelectLevel: (levelId: number) => void;
  onOpenQuotesVault: () => void;
  onOpenGarden: () => void;
  onResetProgress: () => void;
  onExitToMainApp: () => void;
}

export const CipherMap: React.FC<CipherMapProps> = ({
  progress,
  onSelectLevel,
  onOpenQuotesVault,
  onOpenGarden,
  onResetProgress,
  onExitToMainApp
}) => {
  const [activeWorldId, setActiveWorldId] = useState<CipherWorldId>(() => {
    // Default to world of last played or highest unlocked level
    const highest = Math.max(...progress.unlockedLevels, 1);
    if (highest <= 10) return 'garden';
    if (highest <= 20) return 'library';
    return 'cave';
  });

  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const activeWorld = CIPHER_WORLDS.find(w => w.id === activeWorldId) || CIPHER_WORLDS[0];
  const [startLvl, endLvl] = activeWorld.levelsRange;
  const worldLevels = CIPHER_LEVELS.filter(l => l.id >= startLvl && l.id <= endLvl);

  const totalCompleted = progress.completedLevels.length;
  const quotesDiscoveredCount = progress.discoveredQuotes.length;

  const handleLevelClick = (levelId: number) => {
    const isUnlocked = progress.unlockedLevels.includes(levelId);
    if (!isUnlocked) {
      soundManager.playIncorrect();
      return;
    }
    soundManager.playClick();
    onSelectLevel(levelId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-emerald-200">
      {/* Top Bar: Brand, World Selector, Quick Nav */}
      <div className="sticky top-0 z-30 bg-stone-50/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Exit */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExitToMainApp}
              className="px-2.5 py-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-300 dark:border-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>← العودة للرئيسية</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">🗝️</span>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">
                  شفرة نسمة
                </h1>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  كل لغز يقرّبك من معنى
                </p>
              </div>
            </div>
          </div>

          {/* Quick Hub Buttons: Quotes Vault & Garden */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenQuotesVault();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all cursor-pointer shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>دفتر المقولات ({quotesDiscoveredCount}/5)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenGarden();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer shadow-2xs"
            >
              <Flower2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>حديقة الشفرة ({progress.gardenItems.length}/7)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Overall Adventure Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">المراحل المنجزة</span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {totalCompleted} / 30
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">نسمات النور (النقاط)</span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {progress.score}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">المقولات المكتشفة</span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {quotesDiscoveredCount} / 5
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">حفظ التقدم</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                محفوظ تلقائياً ✓
              </span>
            </div>
          </div>
        </div>

        {/* 3 Worlds Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-stone-200/60 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-x-auto">
          {CIPHER_WORLDS.map((w) => {
            const isSelected = w.id === activeWorldId;
            const [wStart, wEnd] = w.levelsRange;
            const wCompleted = progress.completedLevels.filter(id => id >= wStart && id <= wEnd).length;
            const isUnlocked = progress.unlockedLevels.some(id => id >= wStart);

            return (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveWorldId(w.id);
                }}
                className={`flex-1 min-w-[170px] py-2.5 px-3 rounded-xl transition-all flex items-center justify-between text-start cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm ring-1 ring-stone-900/5'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{w.icon}</span>
                  <div>
                    <span className="text-xs font-bold block">{w.nameAr}</span>
                    <span className="text-[10px] text-stone-500 block">
                      المراحل {wStart}-{wEnd}
                    </span>
                  </div>
                </div>
                <div className="text-end">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block tabular-nums">
                    {wCompleted}/10
                  </span>
                  {!isUnlocked && <Lock className="w-3 h-3 text-stone-400 ml-auto" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active World Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-800 aspect-16/9 sm:aspect-21/9 max-h-[220px]">
          <img
            src={activeWorld.heroImage}
            alt={activeWorld.nameAr}
            className="w-full h-full object-cover brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent p-5 flex flex-col justify-end text-white">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
              <span>{activeWorld.icon}</span>
              <span>{activeWorld.nameAr}</span>
              <span>·</span>
              <span>المراحل {startLvl} إلى {endLvl}</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 max-w-2xl leading-relaxed">
              {activeWorld.descAr}
            </p>
          </div>
        </div>

        {/* World Levels Grid / Adventure Path */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>مسار مراحل {activeWorld.nameAr}</span>
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              انقر على أي مرحلة مفتوحة لبدء اللغز
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {worldLevels.map((lvl) => {
              const isUnlocked = progress.unlockedLevels.includes(lvl.id);
              const isCompleted = progress.completedLevels.includes(lvl.id);
              const stars = progress.levelStars[lvl.id] || 0;
              const isCurrent = isUnlocked && !isCompleted;

              let cardBg = 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800';
              if (isCurrent) {
                cardBg = 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 ring-2 ring-amber-400/50 shadow-md';
              } else if (isCompleted) {
                cardBg = 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800';
              } else if (!isUnlocked) {
                cardBg = 'bg-stone-100/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-60';
              }

              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleLevelClick(lvl.id)}
                  disabled={!isUnlocked}
                  className={`p-3.5 rounded-2xl border text-start flex flex-col justify-between gap-3 transition-all relative group cursor-pointer ${cardBg} ${
                    isUnlocked ? 'hover:scale-[1.02] active:scale-[0.98]' : 'cursor-not-allowed'
                  }`}
                >
                  {/* Top indicator: Level number & Status */}
                  <div className="flex items-center justify-between w-full">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isCompleted 
                        ? 'bg-emerald-600 text-white' 
                        : isCurrent 
                          ? 'bg-amber-500 text-white animate-pulse' 
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}>
                      {lvl.id}
                    </span>

                    {/* Star rating or lock */}
                    {isCompleted ? (
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-700'}`}
                          />
                        ))}
                      </div>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded-md">
                        ابدأ الآن
                      </span>
                    ) : (
                      <Lock className="w-4 h-4 text-stone-400" />
                    )}
                  </div>

                  {/* Level title & subtitle */}
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                      {lvl.titleAr}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {lvl.subtitleAr}
                    </p>
                  </div>

                  {/* Reward Token Preview */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 font-medium">مكافأة الشفرة:</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded ${
                      isCompleted 
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300' 
                        : 'text-stone-600 dark:text-stone-400'
                    }`}>
                      {isCompleted ? lvl.rewardToken.value : '🔒 مخفي'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="p-3.5 bg-stone-100 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          🌿 <strong>تنويه مبادرة نسمة حياة:</strong> لعبة «شفرة نسمة» أداة توعوية ترفيهية تفاعلية تهدف لتعزيز اليقظة الذهنية والرفق بالنفس، وليست بديلاً عن الاستشارة أو العلاج النفسي المتخصص.
        </div>

        {/* Reset Progress Safe Escape */}
        <div className="flex items-center justify-end pt-4 border-t border-stone-200 dark:border-stone-800">
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                هل أنت متأكد من مسح تقدمك باللعبة والبدء من جديد؟
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer"
              >
                نعم، مسح التقدم
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-1 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة تعيين التقدم</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
