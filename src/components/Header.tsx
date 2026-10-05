import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Heart, 
  Sparkles, 
  ShieldAlert, 
  Users, 
  Volume2, 
  VolumeX, 
  Languages, 
  Wind,
  Info,
  Menu,
  X,
  MapPin,
  Gamepad2,
  BookOpen,
  Bookmark,
  Award,
  Flame,
  CheckCircle2,
  Zap,
  Calendar,
  Trophy
} from 'lucide-react';
import { GameMode, Language } from '../types';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenBreathing: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  playerXP: number;
  streak?: number;
  isGameCompletedToday?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  language,
  onToggleLanguage,
  onOpenBreathing,
  soundEnabled,
  onToggleSound,
  playerXP,
  streak = 1,
  isGameCompletedToday = false
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = language === 'ar';

  const navItems = [
    { mode: 'map' as GameMode, label: isAr ? 'كل الألعاب' : 'All Games', icon: MapPin },
    { mode: 'leaderboard' as GameMode, label: isAr ? 'لوحة التأثير 🏆' : 'Leaderboard 🏆', icon: Trophy },
    { mode: 'discover' as GameMode, label: isAr ? 'إضاءات ومقالات' : 'Discover', icon: BookOpen },
    { mode: 'my-journey' as GameMode, label: isAr ? 'دفتر رحلتي' : 'My Journey', icon: Bookmark },
    { mode: 'workshop' as GameMode, label: isAr ? 'دليل الورش' : 'Workshop', icon: Users },
    { mode: 'profile' as GameMode, label: isAr ? 'الإنجازات' : 'Achievements', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      {/* Top Banner: Brand and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectMode('map')}
            className="flex items-center gap-2.5 group cursor-pointer text-start"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-stone-900 to-emerald-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-stone-900 font-serif">
                  {isAr ? 'نسمة حياة' : 'Nesma Hayat'}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-md">
                  {isAr ? 'ألعاب نفسية' : 'Games'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                {isAr ? 'فكر فيها — من يقود أفكارنا أم مشاعرنا؟' : 'Think About It — Who leads?'}
              </p>
            </div>
          </button>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-2">
          {/* Daily Streak Badge in Header */}
          <button
            onClick={() => {
              soundManager.playSoftTap();
              setShowStreakInfo(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
              isGameCompletedToday
                ? 'bg-amber-500/15 text-amber-900 border-amber-300 hover:bg-amber-500/25 ring-2 ring-amber-400/30'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
            title={isAr ? `التتابع اليومي: ${streak} أيام` : `Daily Streak: ${streak} Days`}
          >
            <Flame className={`w-4 h-4 ${isGameCompletedToday ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-stone-400'}`} />
            <span className="font-mono font-extrabold">{streak}</span>
            <span className="hidden sm:inline text-[11px]">
              {isAr ? (streak === 1 ? 'يوم' : 'أيام') : (streak === 1 ? 'day' : 'days')}
            </span>
            {isGameCompletedToday && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title={isAr ? 'مكتمل اليوم' : 'Completed Today'} />
            )}
          </button>

          {/* Breathing Pause Quick Action */}
          <button
            onClick={() => {
              soundManager.playSoftTap();
              onOpenBreathing();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-all cursor-pointer shadow-2xs"
            title={isAr ? 'وقفة أنفاس مهدئة' : 'Mindful Breathing Pause'}
          >
            <Wind className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">{isAr ? 'وقفة أنفاس' : 'Breathe'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                : 'bg-stone-100 text-stone-400 border-stone-200 line-through'
            }`}
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-mono">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Info Modal Trigger */}
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-full border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="عن الألعاب"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Nav Tabs: Desktop */}
      <div className="hidden md:block border-t border-stone-200/60 bg-stone-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 rtl:space-x-reverse py-1.5" aria-label="Game Modes">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentMode === item.mode;
              return (
                <button
                  key={item.mode}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onSelectMode(item.mode);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50 px-4 py-3 space-y-1 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => {
                  soundManager.playSoftTap();
                  onSelectMode(item.mode);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-start transition-colors ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Daily Streak Info Modal */}
      {showStreakInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-xl space-y-5 text-center">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 text-start">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-stone-900">
                    {isAr ? 'نظام التتابع اليومي' : 'Daily Streak System'}
                  </h3>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {isAr ? 'مكافآت الوعي اليومية' : 'Daily Awareness Rewards'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowStreakInfo(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Streak Number Showcase */}
            <div className="py-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Flame className="w-8 h-8 text-amber-500 fill-amber-500 animate-bounce" />
                <span className="text-4xl font-extrabold text-stone-900 font-mono">
                  {streak}
                </span>
              </div>
              <span className="text-xs font-bold text-amber-800">
                {isAr ? `${streak} ${streak === 1 ? 'يوم' : 'أيام متتالية'}` : `${streak} Consecutive Days`}
              </span>
            </div>

            {/* Today's Mission Status */}
            <div className={`p-4 rounded-2xl border text-start space-y-1.5 ${
              isGameCompletedToday
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold">
                {isGameCompletedToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'مهمة اليوم: مكتملة بنجاح ✓' : 'Today: Completed ✓'}</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>{isAr ? 'مهمة اليوم: بانتظارك!' : 'Today: Waiting for you!'}</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {isGameCompletedToday
                  ? (isAr 
                      ? 'لعبتِ لعبة واحدة على الأقل اليوم وحصلتِ على مكافأة التتابع وإكسترا XP!' 
                      : 'You completed a game today and collected your streak bonus!')
                  : (isAr 
                      ? 'العب أي لعبة واحدة في التطبيق اليوم لكسب +50 XP والحفاظ على تتابعك من الانقطاع.' 
                      : 'Play any game today to earn +50 XP and maintain your streak.')}
              </p>
            </div>

            {/* Reward breakdown rules */}
            <div className="space-y-2 text-xs text-stone-600 text-start bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="font-bold text-stone-800 block">
                🎁 {isAr ? 'كيف يعمل نظام المكافآت؟' : 'How does it work?'}
              </span>
              <ul className="space-y-1.5 text-[11px] leading-relaxed list-disc list-inside text-stone-600">
                <li>{isAr ? 'فتح التطبيق يومياً يمنحك +20 XP هدية ترحيبية.' : 'Opening the app gives +20 XP daily gift.'}</li>
                <li>{isAr ? 'إتمام لعبة واحدة يمنحك +50 XP أساسية + مكافأة متصاعدة عن كل يوم تتابع!' : 'Completing a game awards +50 XP + scaling streak bonuses!'}</li>
              </ul>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowStreakInfo(false)}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'استمرار في اللعب 🌿' : 'Keep Playing 🌿'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info & Vision Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌿</span>
                <h3 className="font-extrabold text-lg text-stone-900 font-serif">
                  {isAr ? 'عن ألعاب نسمة حياة' : 'About Nesma Hayat'}
                </h3>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <p>
                {isAr
                  ? 'مجموعة ألعاب تفاعلية ونفسية حركية مصممة خصيصاً لمساعدتك على فك تشابك الأفكار، وتهدئة فورة المشاعر، وتفريغ التوتر الجسدي في أوقات الضغط والامتحانات والعلاقات.'
                  : 'A suite of interactive and psychomotor games designed to help you untangle thoughts, regulate intense emotions, and discharge physical stress.'}
              </p>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
                {isAr
                  ? '⚠️ تنويه مهم: هذه الألعاب أدوات استكشاف ومساعدة ذاتية، وليست تشخيصاً طبياً أو بديلاً عن الاستشارة المتخصصة.'
                  : '⚠️ Disclaimer: These games are self-help awareness tools, not clinical psychiatric diagnosis.'}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowInfo(false)}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold"
              >
                {isAr ? 'حسناً، فهمت' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
