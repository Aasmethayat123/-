import React, { useState } from 'react';
import { Language, GameMode } from '../../types';
import { soundManager } from '../../utils/audio';
import { 
  Trophy, 
  Sparkles, 
  Flame, 
  Calendar, 
  Target, 
  Lock, 
  CheckCircle2, 
  Compass, 
  Award, 
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Gem,
  BookOpen
} from 'lucide-react';
import { 
  getTodayChallenge, 
  getHubState, 
  getWeeklyQuests, 
  claimWeeklyQuest, 
  completeDailyChallenge,
  isDailyChallengeTargetSolved,
  DailyChallengeInfo
} from '../../utils/dailyGamesHubManager';
import { GAME_STAGES_CONFIG, getGameLevelProgress } from '../../utils/gameLevelsManager';
import { loadCipherProgress } from '../../utils/nesmaCipherStorage';
import { loadMovingIslandState } from '../../utils/movingIslandManager';

interface UnifiedGamesHubProps {
  language: Language;
  onSelectGame: (gameId: GameMode, levelId?: string) => void;
  onBackToHome: () => void;
  onAddXP?: (amount: number) => void;
}

export const UnifiedGamesHub: React.FC<UnifiedGamesHubProps> = ({
  language,
  onSelectGame,
  onBackToHome,
  onAddXP
}) => {
  const isAr = language === 'ar';

  const [todayChallenge, setTodayChallenge] = useState<DailyChallengeInfo>(() => getTodayChallenge());
  const [hubState, setHubState] = useState(() => getHubState());
  const [weeklyQuests, setWeeklyQuests] = useState(() => getWeeklyQuests());

  React.useEffect(() => {
    const current = getTodayChallenge();
    if (!current.isCompleted && isDailyChallengeTargetSolved(current)) {
      completeDailyChallenge(onAddXP);
      setTodayChallenge(getTodayChallenge());
      setHubState(getHubState());
      setWeeklyQuests(getWeeklyQuests());
    }
  }, [onAddXP]);

  const nesmaProgress = loadCipherProgress();
  const islandState = loadMovingIslandState();

  const handleClaimQuest = (questId: string) => {
    soundManager.playLevelUpFanfare();
    const success = claimWeeklyQuest(questId, onAddXP);
    if (success) {
      setWeeklyQuests(getWeeklyQuests());
      setHubState(getHubState());
    }
  };

  const handleLaunchDaily = () => {
    soundManager.playChime();
    onSelectGame(todayChallenge.gameId as GameMode, String(todayChallenge.stageNumber));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fade-in select-none" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-4 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 end-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{isAr ? 'مركز التحديات المتجددة' : 'Smart Games Hub'}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>{isAr ? `سلسلة الأيام: ${hubState.dailyStreak || 0} يوم` : `Streak: ${hubState.dailyStreak || 0} days`}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-100">
              {isAr ? 'مركز التحديات والابتكار 🎮✨' : 'Innovation & Challenge Hub 🎮✨'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mt-1 leading-relaxed font-medium">
              {isAr 
                ? 'تحديات يومية متجددة، وسامات إتقان، ومهام أسبوعية مصممة لاختبار الذكاء والسكينة والتوازن الذهني.'
                : 'Daily rotating challenges, mastery badges, and weekly quests designed for mental harmony.'}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playSoftTap();
              onBackToHome();
            }}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-stone-200 rounded-2xl text-xs font-bold transition-all border border-white/10 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            {isAr ? '← العودة للمكتبة' : '← Back to Library'}
          </button>
        </div>
      </div>

      {/* 1. Today's Featured Challenge Card */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-stone-900 border-2 border-amber-400/60 dark:border-amber-700/60 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 flex items-center justify-center font-black text-xl shadow-md">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 uppercase tracking-wider font-mono">
                  {isAr ? `تحدي اليوم (${todayChallenge.dateString})` : `Daily Challenge (${todayChallenge.dateString})`}
                </span>
                {todayChallenge.isCompleted && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center gap-1 border border-emerald-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{isAr ? 'تم الإنجاز بنجاح 🌿' : 'Completed 🌿'}</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                {isAr ? `${todayChallenge.gameNameAr} — ${todayChallenge.stageTitleAr}` : `${todayChallenge.gameNameEn} — ${todayChallenge.stageTitleEn}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 text-xs font-bold font-mono border border-amber-300 dark:border-amber-800">
              +{todayChallenge.bonusXP} XP {isAr ? 'مكافأة' : 'Bonus'}
            </span>
            <button
              onClick={handleLaunchDaily}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-2xl text-xs font-black shadow-lg hover:scale-103 transition-transform cursor-pointer flex items-center gap-1.5"
            >
              <span>{isAr ? 'العب تحدي اليوم الآن 🎯' : 'Play Today’s Challenge 🎯'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        <div className="p-3.5 bg-white/80 dark:bg-stone-900/80 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 text-xs text-stone-700 dark:text-stone-300 flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{isAr ? todayChallenge.specialConditionAr : todayChallenge.specialConditionEn}</span>
        </div>
      </div>

      {/* 1.5 Moving Island of Secrets Cross-Hub Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-700/70 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold text-amber-300 block">
            {isAr
              ? `مغامرة مترابطة · أنجزت ${islandState.claimedChallengeIds.length}/24 تحدياً و${islandState.discoveredClueIds.length}/6 أدلة`
              : `Unified Adventure · ${islandState.claimedChallengeIds.length}/24 Challenges`}
          </span>
          <h2 className="text-lg sm:text-xl font-black font-serif text-white">
            {isAr ? 'جزيرة الأسرار المتحركة — رحلة اكتشاف ما وراء الألغاز 🏝️' : 'Moving Island of Secrets 🏝️'}
          </h2>
          <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
            {isAr
              ? 'اربط تقدمك في شفرة نسمة وأحجار التوازن وقوارير المشاعر ومكتبة النظام وبوابة الاختيار وجبل الأسرار لفتح الجسور والمناطق الخفية واللغز الختامي الكبير.'
              : 'Connect your progress across 6 core games to repair bridges, reveal secret observatories, and unlock the Grand Finale.'}
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playChime();
            onSelectGame('moving-island');
          }}
          className="min-h-11 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>{isAr ? 'انتقل إلى جزيرة الأسرار' : 'Open Secrets Island'}</span>
        </button>
      </div>

      {/* 2. Weekly Quests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {isAr ? 'المهمات الأسبوعية والجوائز 🏆' : 'Weekly Quests & Rewards 🏆'}
            </h2>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {isAr ? 'تتجدد أسبوعياً' : 'Resets Weekly'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weeklyQuests.map((quest) => {
            const isReady = quest.currentCount >= quest.targetCount;

            return (
              <div
                key={quest.id}
                className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      +{quest.rewardXP} XP
                    </span>
                    {quest.isClaimed && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isAr ? 'مُستلم' : 'Claimed'}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {isAr ? quest.titleAr : quest.titleEn}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {isAr ? quest.descAr : quest.descEn}
                  </p>
                </div>

                {/* Quest Progress Bar */}
                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span>{isAr ? 'التقدم:' : 'Progress:'}</span>
                    <span>{quest.currentCount} / {quest.targetCount}</span>
                  </div>

                  <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (quest.currentCount / quest.targetCount) * 100)}%` }}
                    />
                  </div>

                  <button
                    onClick={() => handleClaimQuest(quest.id)}
                    disabled={!isReady || quest.isClaimed}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      quest.isClaimed
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                        : isReady
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {quest.isClaimed 
                      ? (isAr ? 'تم الاستلام' : 'Claimed')
                      : isReady 
                      ? (isAr ? 'استلم المكافأة الآن 🎁' : 'Claim Reward 🎁') 
                      : (isAr ? 'قيد الإنجاز...' : 'In Progress...')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Discovered Secrets & Collectibles Showcase */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {isAr ? 'خزانة الكنوز والأسرار المكتشفة 💎' : 'Discovered Secrets & Relics 💎'}
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            {isAr ? `${(nesmaProgress.gardenItems || []).length} كنز مكتشف` : `${(nesmaProgress.gardenItems || []).length} Relics Unlocked`}
          </span>
        </div>

        {!(nesmaProgress.gardenItems && nesmaProgress.gardenItems.length > 0) ? (
          <div className="p-6 bg-stone-50 dark:bg-stone-800/40 rounded-2xl text-center space-y-2">
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300">
              {isAr ? 'لم تكتشف أي أسرار أو كنوز بعد' : 'No secrets unlocked yet'}
            </h3>
            <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
              {isAr 
                ? 'أكمل المراحل المميزة في لعبة «شفرة نسمة» أو «أحجار التوازن» لفتح التوهج الكريستالي والأسرار النفسية.'
                : 'Complete stages in Nesma Cipher or Zen Stones to discover hidden psychological secrets.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {nesmaProgress.gardenItems.map((collectibleId: string) => (
              <div
                key={collectibleId}
                className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-center space-y-1.5"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center text-lg">
                  💎
                </div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                  {collectibleId}
                </h4>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">
                  {isAr ? 'محرر من الألغاز' : 'Unlocked'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
