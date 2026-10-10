import React, { useState } from 'react';
import { Language, GameMode } from '../types';
import { 
  ALL_36_GAMES, 
  GameCatalogItem, 
  ExperienceState 
} from '../data/gamesCatalog';
import { 
  getLastPlayedGame, 
  getTodayChallenge, 
  getUnplayedDoorGame, 
  getGamesByState
} from '../utils/adventures';
import { soundManager } from '../utils/audio';
import { getSavedMoments } from '../utils/moments';
import { getCurrentAwarenessLevel } from '../data/gamificationData';
import { 
  Sparkles, 
  Gamepad2, 
  Bookmark, 
  ArrowRight, 
  RotateCcw, 
  DoorOpen, 
  Timer, 
  Map, 
  Sliders, 
  Compass, 
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Wind,
  Flame,
  Award
} from 'lucide-react';

interface AdventureHomeProps {
  language: Language;
  onNavigateToGame: (gameId: GameMode, levelId?: string) => void;
  onNavigateToLibrary: () => void;
  onNavigateToJourney: () => void;
  onOpenMinuteReflection: () => void;
  onOpenHiddenPaths: () => void;
  onOpenExperienceMixer: () => void;
  onOpenBreathing: () => void;
  playerStats: {
    xp: number;
    avatarId: string;
  };
  onOpenAvatarModal?: () => void;
}

export const AdventureHome: React.FC<AdventureHomeProps> = ({
  language,
  onNavigateToGame,
  onNavigateToLibrary,
  onNavigateToJourney,
  onOpenMinuteReflection,
  onOpenHiddenPaths,
  onOpenExperienceMixer,
  onOpenBreathing,
  playerStats,
  onOpenAvatarModal
}) => {
  const isAr = language === 'ar';
  const lastPlayed = getLastPlayedGame();
  const todayChallenge = getTodayChallenge();
  const savedCount = getSavedMoments().length;
  const currentLevel = getCurrentAwarenessLevel(playerStats.xp, language);

  // Selected Category State from the 4 primary gateways
  const [activeCategory, setActiveCategory] = useState<ExperienceState | null>(null);
  const [doorRevealedGame, setDoorRevealedGame] = useState<GameCatalogItem | null>(null);

  // 4 Primary Category Gateways
  const primaryGateways: {
    id: ExperienceState;
    titleAr: string;
    titleEn: string;
    taglineAr: string;
    taglineEn: string;
    icon: string;
    color: string;
    bgAccent: string;
    darkBgAccent: string;
    borderAccent: string;
  }[] = [
    {
      id: 'calm',
      titleAr: 'أهدأ 🌿',
      titleEn: 'Calm Down 🌿',
      taglineAr: 'تجارب الأنفاس، التأريض الحسي، وخفض وتيرة النبض والتوتر',
      taglineEn: 'Breathing, sensory grounding, and heart rate reset',
      icon: '🌿',
      color: 'from-emerald-600 to-teal-700',
      bgAccent: 'bg-emerald-50/70',
      darkBgAccent: 'dark:bg-emerald-950/30',
      borderAccent: 'border-emerald-200 dark:border-emerald-800/60'
    },
    {
      id: 'understand_self',
      titleAr: 'أفهم نفسي 🔍',
      titleEn: 'Understand Myself 🔍',
      taglineAr: 'كروت البصيرة، كاشف الكذب الداخلي، ودوائر الأمان والثقة',
      taglineEn: 'Insight cards, self-lie radar, and concentric boundaries',
      icon: '🔍',
      color: 'from-purple-600 to-indigo-700',
      bgAccent: 'bg-purple-50/70',
      darkBgAccent: 'dark:bg-purple-950/30',
      borderAccent: 'border-purple-200 dark:border-purple-800/60'
    },
    {
      id: 'focus',
      titleAr: 'أركز 🎯',
      titleEn: 'Focus 🎯',
      taglineAr: 'تصفية الذهن، فرز الأولويات، ولمّ الأفكار المشتتة',
      taglineEn: 'Thought sorting, 3 priorities, and eye-flow clarity',
      icon: '🎯',
      color: 'from-sky-600 to-blue-700',
      bgAccent: 'bg-sky-50/70',
      darkBgAccent: 'dark:bg-sky-950/30',
      borderAccent: 'border-sky-200 dark:border-sky-800/60'
    },
    {
      id: 'move_release',
      titleAr: 'أفرغ طاقتي 🫨',
      titleEn: 'Move & Release 🫨',
      taglineAr: 'تحطيم المرآة، نفض التوتر السوماتي، وتحديات الجرأة الحركية',
      taglineEn: 'Shatter mirror, somatic shake, and tactile dares',
      icon: '🫨',
      color: 'from-amber-600 to-orange-700',
      bgAccent: 'bg-amber-50/70',
      darkBgAccent: 'dark:bg-amber-950/30',
      borderAccent: 'border-amber-200 dark:border-amber-800/60'
    }
  ];

  const handleOpenDoor = () => {
    soundManager.playSuccess();
    const game = getUnplayedDoorGame();
    setDoorRevealedGame(game);
  };

  const handleStartGame = (gameId: GameMode, levelId?: string) => {
    soundManager.playSoftTap();
    onNavigateToGame(gameId, levelId);
  };

  const activeCategoryGames = activeCategory ? getGamesByState(activeCategory) : [];
  const activeGatewayObj = primaryGateways.find((g) => g.id === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-7 animate-fade-in">
      {/* 1. Player Info & Brand Header */}
      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onOpenAvatarModal) {
                soundManager.playSoftTap();
                onOpenAvatarModal();
              }
            }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-stone-900 to-emerald-900 dark:from-emerald-950 dark:to-emerald-700 text-white flex items-center justify-center text-2xl shadow-xs hover:scale-105 transition-transform cursor-pointer shrink-0"
            title={isAr ? 'تغيير الشخصية' : 'Change Avatar'}
          >
            {playerStats.avatarId === 'phoenix' ? '🦅' :
             playerStats.avatarId === 'owl' ? '🦉' :
             playerStats.avatarId === 'sprout' ? '🌱' :
             playerStats.avatarId === 'lotus' ? '🪷' : '🧭'}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 font-serif">
                {isAr ? 'اختار مغامرتك اليوم 🌿' : 'Choose Your Adventure 🌿'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {isAr ? currentLevel.title : currentLevel.titleEn}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr ? 'مساحتك الذكية للاكتشاف والتجربة، وتفكيك التوتر بهدوء' : 'Your calm space for mindful discovery & emotional regulation'}
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 text-xs font-bold text-stone-700 dark:text-stone-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{playerStats.xp} XP</span>
          </div>

          <button
            onClick={() => {
              soundManager.playSoftTap();
              onOpenBreathing();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/70 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/60 border border-emerald-300/60 dark:border-emerald-800/60 text-xs font-bold text-emerald-800 dark:text-emerald-300 transition-colors cursor-pointer"
            title={isAr ? 'تمرين التنفس السريع' : 'Quick breathing'}
          >
            <Wind className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'تنفس' : 'Breathe'}</span>
          </button>
        </div>
      </div>

      {/* 2. Resume Last Played (if exists) */}
      {lastPlayed && (
        <div className="bg-gradient-to-r from-stone-100/90 via-emerald-50/50 to-stone-100/90 dark:from-stone-900 dark:via-emerald-950/30 dark:to-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-3 sm:p-3.5 px-4 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold block uppercase tracking-wider">
                {isAr ? 'تابع من حيث توقفت:' : 'Continue where you left off:'}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                {isAr ? lastPlayed.nameAr : lastPlayed.nameEn}
              </h4>
            </div>
          </div>
          <button
            onClick={() => handleStartGame(lastPlayed.id, lastPlayed.levelId)}
            className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-transform hover:scale-103 shrink-0 shadow-2xs flex items-center gap-1.5"
          >
            <span>{isAr ? 'استئناف' : 'Resume'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      )}

      {/* 3. Daily Featured Micro-Adventure (البطاقة الرئيسية اليومية) */}
      <div className="bg-gradient-to-br from-emerald-50/90 via-white to-stone-50 dark:from-stone-900/95 dark:via-stone-900 dark:to-stone-950 border-2 border-emerald-300/80 dark:border-emerald-800/60 rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden transition-all group">
        <div className="absolute top-0 end-0 w-44 h-44 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-2xs uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{isAr ? 'بطاقة اليوم المقترحة' : 'Daily Featured Dare'}</span>
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium font-mono">
                ⏱️ {todayChallenge.approxDuration}
              </span>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md bg-emerald-100/60 dark:bg-emerald-950/60">
                {isAr ? todayChallenge.badgeAr : todayChallenge.badgeEn}
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
              {isAr ? todayChallenge.nameAr : todayChallenge.nameEn}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-lg">
              {isAr ? todayChallenge.descAr : todayChallenge.descEn}
            </p>
          </div>

          <div className="shrink-0 flex items-center sm:flex-col gap-2">
            <button
              onClick={() => handleStartGame(todayChallenge.id, todayChallenge.levelId)}
              className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-transform hover:scale-104 shadow-xs flex items-center justify-center gap-2"
            >
              <span>{isAr ? 'ابدأ تجربة اليوم الآن' : 'Start Today’s Dare'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
            <span className="text-[10px] text-stone-400 dark:text-stone-500 text-center hidden sm:block">
              {isAr ? todayChallenge.interactionTypeAr : todayChallenge.interactionTypeEn}
            </span>
          </div>
        </div>
      </div>

      {/* 4. The 4 Primary Category Gateways (المداخل التصنيفية الأربعة: أهدأ، أفهم نفسي، أركز، أفرغ طاقتي) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              {isAr ? 'مداخل الاستكشاف الأربعة:' : 'Four Adventure Gateways:'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr ? 'اختار بحسب ما تبحث عنه روحك وجسدك الآن' : 'Choose according to your current intention'}
            </p>
          </div>

          {activeCategory && (
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setActiveCategory(null);
              }}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
            >
              <span>{isAr ? 'إغلاق القائمة' : 'Close List'}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* The 4 Gateways Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {primaryGateways.map((gw) => {
            const isSelected = activeCategory === gw.id;
            const gamesCount = getGamesByState(gw.id).length;

            return (
              <button
                key={gw.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setActiveCategory(isSelected ? null : gw.id);
                }}
                className={`text-start p-5 rounded-3xl border transition-all cursor-pointer relative group flex items-start justify-between gap-4 ${
                  isSelected
                    ? 'bg-white dark:bg-stone-900 border-stone-900 dark:border-emerald-500 shadow-md ring-2 ring-stone-900/10 dark:ring-emerald-500/20'
                    : 'bg-white dark:bg-stone-900/90 border-stone-200/90 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${gw.color} text-white flex items-center justify-center text-2xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                    {gw.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-stone-100">
                        {isAr ? gw.titleAr : gw.titleEn}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {gamesCount} {isAr ? 'تجارب' : 'games'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                      {isAr ? gw.taglineAr : gw.taglineEn}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  {isSelected ? (
                    <ChevronUp className="w-5 h-5 text-stone-800 dark:text-stone-200" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 rtl:rotate-180 transition-colors" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ============================================================= */}
        {/* EXPANDED INLINE DRAWER FOR THE SELECTED GATEWAY */}
        {/* ============================================================= */}
        {activeCategory && activeGatewayObj && (
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 shadow-lg space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeGatewayObj.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {isAr ? activeGatewayObj.titleAr : activeGatewayObj.titleEn}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {isAr ? 'تجارب منتقاة بعناية تناسب هذه الحالة الذهنية' : 'Curated experiences fitting this mindset'}
                  </p>
                </div>
              </div>

              {/* Quick Switcher among 4 gateways */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {primaryGateways.map((gw) => (
                  <button
                    key={gw.id}
                    onClick={() => {
                      soundManager.playSoftTap();
                      setActiveCategory(gw.id);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeCategory === gw.id
                        ? 'bg-stone-900 dark:bg-emerald-700 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    <span>{gw.icon} </span>
                    <span className="hidden sm:inline">{isAr ? gw.titleAr.split(' ')[0] : gw.titleEn.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* List of matching curated games */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeCategoryGames.map((game) => {
                const Icon = game.icon;
                return (
                  <div
                    key={`${game.id}-${game.levelId || ''}`}
                    className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-2 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                            {isAr ? game.nameAr : game.nameEn}
                          </h4>
                          <span className="text-[10px] text-stone-400 font-mono shrink-0">
                            {game.approxDuration}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {isAr ? game.descAr : game.descEn}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500">
                        {isAr ? game.badgeAr : game.badgeEn}
                      </span>
                      <button
                        onClick={() => handleStartGame(game.id, game.levelId)}
                        className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-transform hover:scale-103 shadow-2xs flex items-center gap-1"
                      >
                        <span>{isAr ? 'ابدأ' : 'Play'}</span>
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. Complete Catalog Access & My Journey Gateway (الحفاظ على كافة الألعاب والروابط) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        {/* Full Library Button */}
        <button
          onClick={() => {
            soundManager.playSoftTap();
            onNavigateToLibrary();
          }}
          className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-sky-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group text-start"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-700 text-white flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
              🎮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {isAr ? 'مكتبة الألعاب الكاملة' : 'Full Games Catalog'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-extrabold">
                  {isAr ? '٣٦ لعبة' : '36 Games'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {isAr ? 'تصفح بالبحث والفلترة لكامل الألعاب والأدوات' : 'Browse with search, categories, and full filters'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 rtl:rotate-180 transition-colors shrink-0" />
        </button>

        {/* My Journey & Diary Button */}
        <button
          onClick={() => {
            soundManager.playSoftTap();
            onNavigateToJourney();
          }}
          className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-violet-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group text-start"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-500 to-purple-800 text-white flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
              🔖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {isAr ? 'دفتر رحلتي واللحظات' : 'My Journey Diary'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 font-extrabold">
                  {savedCount} {isAr ? 'محفوظات' : 'Saved'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {isAr ? 'كروت الحكمة والتأملات الخاصة التي وثّقتها' : 'Your saved insights and personal milestone reflections'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 rtl:rotate-180 transition-colors shrink-0" />
        </button>
      </div>

      {/* 6. Creative Micro-Tools Strip («افتح باباً جديداً» + «دقيقة تفكير» + «المسار الخفي» + «اصنع تجربتك») */}
      <div className="p-5 rounded-3xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
              {isAr ? 'أدوات الإلهام السريعة' : 'Creative Inspiration Tools'}
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            {isAr ? 'تجارب تفاعلية ذكية' : 'Smart micro-tools'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Tool 1: افتح باباً جديداً */}
          <button
            onClick={handleOpenDoor}
            className="p-3 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/60 text-start transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
              🚪
            </div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              {isAr ? 'افتح باباً جديداً' : 'Open a Door'}
            </h4>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
              {isAr ? 'لعبة لم تجربها بعد' : 'Unplayed discovery'}
            </p>
          </button>

          {/* Tool 2: دقيقة تفكير */}
          <button
            onClick={() => {
              soundManager.playSoftTap();
              onOpenMinuteReflection();
            }}
            className="p-3 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 hover:border-amber-500/60 text-start transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
              ⏱️
            </div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
              {isAr ? 'دقيقة تفكير' : 'Minute Reset'}
            </h4>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
              {isAr ? '٣٠-٦٠ ثانية تفاعلية' : '30-60s micro actions'}
            </p>
          </button>

          {/* Tool 3: المسار الخفي */}
          <button
            onClick={() => {
              soundManager.playSoftTap();
              onOpenHiddenPaths();
            }}
            className="p-3 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 hover:border-indigo-500/60 text-start transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
              🗺️
            </div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {isAr ? 'المسار الخفي' : 'Hidden Paths'}
            </h4>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
              {isAr ? '٥ مسارات منسقة' : '5 curated paths'}
            </p>
          </button>

          {/* Tool 4: اصنع تجربتك */}
          <button
            onClick={() => {
              soundManager.playSoftTap();
              onOpenExperienceMixer();
            }}
            className="p-3 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 hover:border-violet-500/60 text-start transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
              🎛️
            </div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-violet-600 dark:group-hover:text-violet-400">
              {isAr ? 'اصنع تجربتك' : 'Experience Mixer'}
            </h4>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
              {isAr ? 'حدد وقتك وطاقتك' : 'Custom time & mood'}
            </p>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODAL: «افتح بابًا جديدًا» Revealed Game */}
      {/* ================================================================= */}
      {doorRevealedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 dark:bg-stone-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 relative text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🚪✨
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {isAr ? 'باب الاكتشاف المفتوح' : 'Open Door Discovery'}
              </span>
              <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100 mt-1">
                {isAr ? doorRevealedGame.nameAr : doorRevealedGame.nameEn}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
                {isAr ? doorRevealedGame.descAr : doorRevealedGame.descEn}
              </p>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl text-xs text-stone-600 dark:text-stone-400 font-medium">
              <span>{isAr ? 'المدة التقريبية: ' : 'Approx duration: '}</span>
              <strong className="text-stone-900 dark:text-stone-200">{doorRevealedGame.approxDuration}</strong>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setDoorRevealedGame(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
              <button
                onClick={() => {
                  const target = doorRevealedGame;
                  setDoorRevealedGame(null);
                  handleStartGame(target.id, target.levelId);
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-transform hover:scale-103 shadow-xs"
              >
                {isAr ? 'دخول التجربة الآن ➜' : 'Enter Now ➜'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
