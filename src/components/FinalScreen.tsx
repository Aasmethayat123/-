import React from 'react';
import { Language, GameMode, PlayerStats } from '../types';
import {
  AVATARS,
  BADGES,
  getEarnedBadges,
  getNextBadgeProgress,
  getUserRank
} from '../utils/gameState';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import {
  HeartHandshake,
  Wind,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Brain,
  Award,
  Lock,
  Gamepad2
} from 'lucide-react';
import { SectionGuideBanner } from './common/SectionGuideBanner';

interface FinalScreenProps {
  language: Language;
  onNavigate: (mode: GameMode) => void;
  onOpenBreathing: () => void;
  playerStats?: PlayerStats;
  onOpenAvatarModal?: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({
  language,
  onNavigate,
  onOpenBreathing,
  playerStats,
  onOpenAvatarModal
}) => {
  const isAr = language === 'ar';

  const xp = playerStats?.xp ?? 0;
  const totalGamesCompleted = playerStats?.totalGamesCompleted ?? 0;
  const badgeIds = playerStats?.badges ?? [];
  const avatarId = playerStats?.avatarId ?? 'sara';

  const currentAvatar =
    AVATARS[language].find((a) => a.id === avatarId) || AVATARS[language][0];
  const currentRank = getUserRank(xp);
  const earnedBadges = getEarnedBadges(badgeIds);
  const earnedSet = new Set(earnedBadges.map((b) => b.id));
  const { nextBadge, remainingGames, progressPercent } =
    getNextBadgeProgress(totalGamesCompleted);

  const pillars = [
    {
      title: isAr ? 'ليست كل فكرة حقيقة' : 'Not Every Thought is a Fact',
      body: isAr
        ? 'تتدفق في عقولنا آلاف الأفكار التلقائية يومياً. مجرد وميض فكرة في ذهنك لا يجعلها أمراً واقعاً أو مصيراً محتوماً.'
        : 'Our minds generate thousands of automatic thoughts daily. Having a thought does not make it real or prophetic.',
      icon: Brain
    },
    {
      title: isAr ? 'مشاعرك ليست عيباً ولا ضعفاً' : 'Your Feelings Are Not a Weakness',
      body: isAr
        ? 'المشاعر رسائل وإشارات بيولوجية تخبرك بما يحدث في داخلك. لا تخجل منها ولا تحاربها، بل امنحها اسماً وافهم رسالتها برفق.'
        : 'Emotions are biological signals and messengers. They are not something to be ashamed of or repressed; name them with gentle curiosity.',
      icon: HeartHandshake
    },
    {
      title: isAr ? 'المشاعر لا تُملي عليك رد فعلك' : 'Emotions Don’t Dictate Actions',
      body: isAr
        ? 'يمكنك أن تشعر باندفاع الغضب، أو وخزة الخوف، ومع ذلك تختار رداً هادئاً رصيناً يحفظ كرامتك وسلامك الداخلي.'
        : 'You can feel an intense surge of anger or fear, and still choose a dignified, grounded action in the pause.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10 animate-fade-in">
      {/* Hero Affirmation Banner */}
      <div className="bg-gradient-to-br from-emerald-900 to-stone-900 text-stone-100 rounded-3xl p-7 sm:p-11 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800/60 text-emerald-200 rounded-full text-xs font-semibold mb-4 border border-emerald-600/40">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>{isAr ? 'ملف الوعي ورسالة نسمة حياة' : 'Mindful Profile & Reflection'}</span>
        </span>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-serif leading-tight max-w-2xl mx-auto">
          {isAr
            ? '«أنت أكثر بكثير من مجرد أفكارك العابرة، ومشاعرك ليست نقطة ضعف.»'
            : '“You are more than your thoughts. Your emotions are not a weakness.”'}
        </h1>

        <p className="text-emerald-100/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6 font-light">
          {isAr
            ? 'عندما تتعلم أن تلاحظها وتفهم ما يدور بداخلك، تبدأ في الاستجابة بطريقة مختلفة، وتسترد مقود حياتك.'
            : 'When you learn to notice and understand them, you can begin to respond differently.'}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-xs text-emerald-300">
          <span>🌿</span>
          <span className="font-medium">
            {isAr
              ? 'نسمة حياة — نساعدك على فهم نفسك قبل أن يصبح العبء أثقل'
              : 'Nesma Hayat — Helping you understand yourself before the struggle becomes heavier'}
          </span>
        </div>
      </div>

      {/* Section Guide Banner */}
      <SectionGuideBanner sectionId="profile" language={language} />

      {/* Player Profile & Badges Showcase */}
      <section aria-labelledby="badges-section-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
              {isAr ? 'سجل الإنجاز والأوسمة' : 'Completion Milestones'}
            </span>
            <h2
              id="badges-section-heading"
              className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-serif mt-0.5"
            >
              {isAr ? 'أوسمة الألعاب المكتملة' : 'Games Completed Badges'}
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {isAr
                ? `مكتسب: ${earnedBadges.length} من ${BADGES.length} أوسمة`
                : `Earned: ${earnedBadges.length} of ${BADGES.length} badges`}
            </span>
          </div>
        </div>

        {/* Profile Summary & Next Badge Progress Bar */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => {
                  if (onOpenAvatarModal) {
                    soundManager.playSoftTap();
                    onOpenAvatarModal();
                  }
                }}
                title={isAr ? 'تغيير الشخصية' : 'Change Character'}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${currentAvatar.color} text-3xl flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer shrink-0`}
              >
                {currentAvatar.avatarChar}
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100">
                    {currentAvatar.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ${currentRank.badgeBg} ${currentRank.badgeBorder} ${currentRank.badgeText}`}
                  >
                    <span>{currentRank.icon}</span>
                    <span>{isAr ? currentRank.nameAr : currentRank.nameEn}</span>
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {currentAvatar.title} · <span className="font-mono font-bold">{xp} XP</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs font-extrabold">
                <Gamepad2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {isAr
                    ? `${totalGamesCompleted} ${totalGamesCompleted === 1 ? 'لعبة مكتملة' : 'ألعاب مكتملة'}`
                    : `${totalGamesCompleted} ${totalGamesCompleted === 1 ? 'Game' : 'Games'} Completed`}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Toward Next Milestone */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
            {nextBadge ? (
              <>
                <div className="flex items-center justify-between gap-2 text-xs font-bold">
                  <span className="text-stone-700 dark:text-stone-200">
                    {isAr
                      ? `الوسام القادم: ${nextBadge.icon} ${nextBadge.nameAr}`
                      : `Next Badge: ${nextBadge.icon} ${nextBadge.nameEn}`}
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono">
                    {isAr
                      ? `متبقي ${remainingGames} ${remainingGames === 1 ? 'لعبة' : 'ألعاب'} (${totalGamesCompleted}/${nextBadge.requiredGames})`
                      : `${remainingGames} ${remainingGames === 1 ? 'game' : 'games'} left (${totalGamesCompleted}/${nextBadge.requiredGames})`}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-700 dark:text-amber-400">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  {isAr
                    ? 'أحرزت جميع أوسمة نسمة حياة الستة بنجاح كامل!'
                    : 'You have unlocked all 6 Nesma Hayat completion badges!'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* All 6 Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = earnedSet.has(badge.id);
            const itemProgress = Math.min(100, Math.round((totalGamesCompleted / badge.requiredGames) * 100));

            return (
              <div
                key={badge.id}
                onClick={() => {
                  if (isUnlocked) {
                    soundManager.playHarmonicAffirmation();
                    triggerConfetti(0.5, 0.4);
                  }
                }}
                className={`rounded-2xl border p-5 transition-all flex flex-col justify-between gap-4 ${
                  isUnlocked
                    ? `${badge.badgeBg} ${badge.badgeBorder} shadow-xs cursor-pointer hover:-translate-y-0.5`
                    : 'bg-white/70 dark:bg-stone-900/60 border-stone-200/80 dark:border-stone-800 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                        isUnlocked
                          ? `bg-gradient-to-br ${badge.emblemGradient} text-white shadow-sm`
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400 grayscale'
                      }`}
                    >
                      <span role="img" aria-hidden="true">
                        {badge.icon}
                      </span>
                    </div>

                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/80 dark:bg-stone-900/80 text-emerald-700 dark:text-emerald-400 text-[11px] font-extrabold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{isAr ? 'مكتسب' : 'Unlocked'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-[11px] font-bold font-mono">
                        <Lock className="w-3 h-3 shrink-0" />
                        <span>
                          {totalGamesCompleted}/{badge.requiredGames}
                        </span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                      {isAr ? badge.nameAr : badge.nameEn}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mt-1">
                      {isAr ? badge.descriptionAr : badge.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 dark:text-stone-400">
                    <span>
                      {isAr
                        ? `الشرط: إتمام ${badge.requiredGames === 1 ? 'لعبة واحدة' : `${badge.requiredGames} ألعاب`}`
                        : `Goal: Complete ${badge.requiredGames} ${badge.requiredGames === 1 ? 'game' : 'games'}`}
                    </span>
                    <span className="font-mono">{itemProgress}%</span>
                  </div>
                  {!isUnlocked && (
                    <div className="w-full h-1.5 rounded-full bg-stone-200/80 dark:bg-stone-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${itemProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            {isAr ? 'الركائز الثلاث للوعي النفسي' : 'The Three Pillars of Awareness'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 font-serif">
            {isAr ? 'الرسالة وراء لعبة فكر فيها' : 'The Message Behind the Game'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Practical Action Bar */}
      <div className="bg-stone-100 dark:bg-stone-900 rounded-2xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 text-center space-y-4">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
          {isAr ? 'أين تحب أن تبدأ خطوتك القادمة؟' : 'Where would you like to explore next?'}
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
          {isAr
            ? 'تستطيع دائماً العودة إلى مكتبة الألعاب لكسب المزيد من الأوسمة، أو تجربة التحديات التفاعلية لصقل مهاراتك اليومية.'
            : 'Return to the games library to unlock more badges, or sharpen your daily skills in the interactive challenges.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playSoftTap();
              onNavigate('library');
            }}
            className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <span>{isAr ? 'استكشاف مكتبة الألعاب' : 'Explore Games Library'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playSoftTap();
              onNavigate('journey');
            }}
            className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{isAr ? 'خوض رحلة موقف جديد' : 'Situation Journey'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playSoftTap();
              onOpenBreathing();
            }}
            className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            <Wind className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>{isAr ? 'وقفة تنفس واعية' : 'Mindful Breathing'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

