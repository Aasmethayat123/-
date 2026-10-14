import React, { useState } from 'react';
import { 
  Flame, 
  Calendar, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Zap, 
  HeartHandshake, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Language } from '../types';
import { useStreak, getRecentWeekDays, StreakMilestone } from '../utils/streakManager';
import { soundManager } from '../utils/audio';

interface StreakHeaderBadgeProps {
  language: Language;
  onAddXP?: (amount: number) => void;
}

export const StreakHeaderBadge: React.FC<StreakHeaderBadgeProps> = ({ language, onAddXP }) => {
  const isAr = language === 'ar';
  const { streakData, claimToday } = useStreak();
  const [isOpen, setIsOpen] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);

  const { currentStreak, longestStreak, totalActiveDays, todayCompleted, isPendingToday, level, milestones } = streakData;

  const handleOpen = () => {
    soundManager.playSoftTap();
    setIsOpen(true);
  };

  const handleClose = () => {
    soundManager.playSoftTap();
    setIsOpen(false);
  };

  const handleClaim = () => {
    const result = claimToday();
    if (result.isFirstToday) {
      setJustClaimed(true);
      if (onAddXP && result.xpAwarded > 0) {
        onAddXP(result.xpAwarded);
      }
      setTimeout(() => setJustClaimed(false), 3000);
    }
  };

  const recentDays = getRecentWeekDays(streakData);

  // Next upcoming milestone
  const nextMilestone = milestones.find(m => !m.unlocked);

  return (
    <>
      {/* Header Flame Badge Button */}
      <button
        onClick={handleOpen}
        className={`relative group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer shadow-2xs select-none ${
          todayCompleted
            ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-rose-500/15 dark:from-amber-900/40 dark:via-orange-950/50 dark:to-rose-950/40 border-amber-400/60 dark:border-amber-600/70 text-amber-900 dark:text-amber-200 hover:border-amber-500 hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]'
            : currentStreak > 0
            ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 hover:bg-amber-100/90'
            : 'bg-stone-100 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200/80'
        }`}
        title={
          isAr
            ? `شعلة الاستمرارية: ${currentStreak} ${currentStreak === 1 ? 'يوم' : 'أيام'} متتالية ${todayCompleted ? '(مكتمل لليوم ✨)' : '(بانتظار حضورك اليوم 🔥)'}`
            : `Daily Streak: ${currentStreak} day(s) ${todayCompleted ? '(Completed Today ✨)' : '(Pending Today 🔥)'}`
        }
        aria-label="Daily Streak Tracking"
      >
        {/* Animated Flame Icon */}
        <div className="relative flex items-center justify-center">
          <Flame 
            className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
              todayCompleted
                ? 'text-orange-500 dark:text-orange-400 fill-orange-500 dark:fill-orange-400 drop-shadow-[0_0_6px_rgba(249,115,22,0.6)] animate-pulse'
                : currentStreak > 0
                ? 'text-amber-500 dark:text-amber-400 fill-amber-500/50'
                : 'text-stone-400 dark:text-stone-500'
            }`} 
          />
          {/* Pending today indicator dot */}
          {!todayCompleted && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </div>

        {/* Counter Number */}
        <span className={`text-xs font-black font-mono tracking-tight ${
          todayCompleted 
            ? 'text-amber-950 dark:text-amber-100' 
            : currentStreak > 0 
            ? 'text-amber-800 dark:text-amber-300' 
            : 'text-stone-500 dark:text-stone-400'
        }`}>
          {currentStreak}
        </span>

        {/* Sub-label for desktop screens */}
        <span className="hidden xl:inline text-[11px] font-bold text-amber-800/80 dark:text-amber-300/80">
          {isAr ? (currentStreak === 1 ? 'يوم' : 'أيام') : (currentStreak === 1 ? 'day' : 'days')}
        </span>
      </button>

      {/* Streak Details Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={handleClose}
        >
          <div 
            className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Fire Banner */}
            <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-rose-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/20 border-b border-amber-200/50 dark:border-stone-800">
              <button
                onClick={handleClose}
                className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg shadow-orange-500/25 flex items-center justify-center">
                  <Flame className="w-8 h-8 fill-white/90 animate-bounce" />
                  <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse pointer-events-none" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
                      {currentStreak} {isAr ? (currentStreak === 1 ? 'يوم' : 'أيام متتالية') : (currentStreak === 1 ? 'Day' : 'Days Streak')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {isAr ? level.nameAr : level.nameEn}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-medium">
                    {isAr ? level.descriptionAr : level.descriptionEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Today's Status Banner */}
              {todayCompleted ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      {isAr ? 'شعلتك مشتعلة ومكتملة لليوم! 🌿' : 'Your flame is burning bright today! 🌿'}
                    </h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                      {isAr 
                        ? 'رائع! حضورك اليوم يعزز مساراتك العصبية للهدوء والاستجابة الواعية بدلاً من رد الفعل التلقائي.' 
                        : 'Great job! Your presence today reinforces calm neural pathways for mindful responses.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/60 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 animate-pulse">
                      <Flame className="w-5 h-5 fill-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                        {isAr ? 'شعلتك بانتظارك اليوم للحفاظ على استمراريتك!' : 'Your flame is waiting for today!'}
                      </h4>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                        {isAr
                          ? 'أكمل دقيقة تأمل، أو العب إحدى الألعاب الـ ٤٤، أو اضغط أدناه لتسجيل حضورك اليومي واستلام +25 نقطة خبرة.'
                          : 'Practice 1 mindful minute, play any game, or claim your check-in below for +25 XP.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleClaim}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:opacity-95 shadow-md shadow-orange-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAr ? 'تسجيل حضور اليوم الواعي (+25 نقطة خبرة) ✨' : 'Claim Daily Mindful Check-in (+25 XP) ✨'}</span>
                  </button>
                </div>
              )}

              {justClaimed && (
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 text-xs font-bold text-center border border-amber-300 dark:border-amber-700 animate-bounce">
                  {isAr ? '🎉 مبروك! تم تحديث شعلتك وإضافة نقاط الخبرة بنجاح!' : '🎉 Congratulations! Streak updated and XP awarded!'}
                </div>
              )}

              {/* 7-Day Consistency Week Strip */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    {isAr ? 'شريط الاستمرارية الأسبوعي' : 'Weekly Consistency Strip'}
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {isAr ? `${totalActiveDays} يوم نشط إجمالاً` : `${totalActiveDays} total active days`}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
                  {recentDays.map((day) => (
                    <div 
                      key={day.dateStr}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                        day.isCompleted
                          ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/20 dark:from-amber-950/60 dark:to-orange-950/60 border border-amber-300 dark:border-amber-700'
                          : day.isToday
                          ? 'bg-white dark:bg-stone-800 border-2 border-dashed border-amber-400 dark:border-amber-500'
                          : 'bg-white/50 dark:bg-stone-850/40 border border-stone-200/60 dark:border-stone-700/60'
                      }`}
                    >
                      <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 mb-1">
                        {isAr ? day.dayNameAr : day.dayNameEn}
                      </span>
                      
                      <div className="w-7 h-7 rounded-full flex items-center justify-center">
                        {day.isCompleted ? (
                          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 drop-shadow-xs" />
                        ) : day.isToday ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600" />
                        )}
                      </div>

                      <span className={`text-[10px] font-mono mt-0.5 ${
                        day.isToday ? 'font-bold text-amber-700 dark:text-amber-300' : 'text-stone-500 dark:text-stone-400'
                      }`}>
                        {day.dayNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics & Records */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 block">
                      {isAr ? 'أفضل رقم استمرارية' : 'Longest Streak'}
                    </span>
                    <span className="text-base font-black font-mono text-stone-900 dark:text-stone-100">
                      {longestStreak} {isAr ? 'أيام' : 'days'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 block">
                      {isAr ? 'إجمالي الأيام المكتملة' : 'Total Days Practiced'}
                    </span>
                    <span className="text-base font-black font-mono text-stone-900 dark:text-stone-100">
                      {totalActiveDays} {isAr ? 'يوم' : 'days'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Milestone Card */}
              {nextMilestone && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 dark:from-stone-800 dark:to-stone-750 text-white border border-stone-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-200">
                        {isAr ? 'الوسام القادم' : 'Next Milestone'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">
                      {isAr ? `متبقي ${Math.max(0, nextMilestone.days - currentStreak)} أيام` : `${Math.max(0, nextMilestone.days - currentStreak)} days left`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      {isAr ? nextMilestone.titleAr : nextMilestone.titleEn} ({nextMilestone.days} {isAr ? 'أيام' : 'days'})
                    </span>
                    <span className="text-amber-400 font-bold text-[11px] font-mono">
                      +{nextMilestone.rewardXP} XP
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (currentStreak / nextMilestone.days) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Psychological Wisdom Note */}
              <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-200/60 dark:border-amber-800/40 flex items-start gap-3">
                <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300 font-medium">
                  {isAr 
                    ? '«التغيير النفسي المستدام لا يأتي من طفرات متباعدة، بل من دقيقة حضور واعي واحدة تتكرر كل يوم بحب ولطف مع الذات.» — نسمة حياة 🌿'
                    : '“Sustainable psychological transformation doesn’t arise from sudden bursts, but from a single mindful minute repeated each day with gentle self-compassion.” — Nesma Hayat 🌿'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200/80 dark:border-stone-800 flex justify-end">
              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors cursor-pointer"
              >
                {isAr ? 'إغلاق ومتابعة الرحلة 🌿' : 'Close & Continue Journey 🌿'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
