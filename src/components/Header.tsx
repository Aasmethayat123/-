import React, { useEffect, useState } from 'react';
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
  FolderKanban,
  Settings,
  Sun,
  Moon,
  Terminal,
  HeartHandshake,
  KeyRound,
  Share2,
  RefreshCw
} from 'lucide-react';
import { GameMode, Language, UserRank, RankProgress } from '../types';
import { AMBIENT_SOUNDSCAPES, AmbientSoundscapeId, soundManager } from '../utils/audio';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { StreakHeaderBadge } from './StreakHeaderBadge';
import { RankHeaderBadge } from './RankHeaderBadge';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenBreathing: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  playerXP: number;
  userRank?: UserRank;
  rankProgress?: RankProgress;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onAddXP?: (amount: number) => void;
  onOpenTechnicalAudit?: () => void;
  onOpenShare?: () => void;
  onOpenUpdate?: () => void;
  onOpenSettings?: () => void;
  earnedBadgeIds?: string[];
  totalGamesCompleted?: number;
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
  userRank,
  rankProgress,
  theme = 'light',
  onToggleTheme,
  onAddXP,
  onOpenTechnicalAudit,
  onOpenShare,
  onOpenUpdate,
  onOpenSettings,
  earnedBadgeIds = [],
  totalGamesCompleted = 0
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSoundscape, setActiveSoundscape] = useState<AmbientSoundscapeId>(() =>
    soundManager.getSoundscape()
  );
  const isAr = language === 'ar';

  useEffect(() => {
    const sync = () => setActiveSoundscape(soundManager.getSoundscape());
    return soundManager.subscribe(sync);
  }, []);

  const activeSoundscapeOption =
    soundEnabled && activeSoundscape !== 'off'
      ? AMBIENT_SOUNDSCAPES.find((s) => s.id === activeSoundscape)
      : undefined;

  const navItems = [
    { mode: 'map' as GameMode, label: isAr ? 'الرئيسية 🌿' : 'Home 🌿', icon: Compass },
    { mode: 'moving-island' as GameMode, label: isAr ? 'جزيرة الأسرار 🏝️' : 'Secrets Island 🏝️', icon: MapPin },
    { mode: 'nesma-cipher' as GameMode, label: isAr ? 'شفرة نسمة 🗝️' : 'Nesma Cipher 🗝️', icon: KeyRound },
    { mode: 'library' as GameMode, label: isAr ? 'مكتبة الألعاب 🎮' : 'Library 🎮', icon: Gamepad2 },
    { mode: 'weekly-session' as GameMode, label: isAr ? 'الجلسة الأسبوعية 🛋️' : 'Weekly Session 🛋️', icon: HeartHandshake },
    { mode: 'projects' as GameMode, label: isAr ? 'المشروعات' : 'Projects', icon: FolderKanban },
    { mode: 'discover' as GameMode, label: isAr ? 'إضاءات ومقالات' : 'Discover', icon: BookOpen },
    { mode: 'my-journey' as GameMode, label: isAr ? 'دفتر رحلتي' : 'My Journey', icon: Bookmark },
    { mode: 'profile' as GameMode, label: isAr ? 'أوسمتي 🏅' : 'Badges 🏅', icon: Award },
    { mode: 'workshop' as GameMode, label: isAr ? 'دليل الورش' : 'Workshop', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      {/* Top Banner: Brand and Controls */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <button 
            onClick={() => onSelectMode('map')}
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer text-start min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-2xl bg-gradient-to-tr from-stone-900 to-emerald-900 dark:from-emerald-950 dark:to-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-lg sm:text-xl">🌿</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-stone-900 dark:text-stone-100 font-serif whitespace-nowrap">
                  {isAr ? 'فكر فيها' : 'Think About It'}
                </span>
                <span className="hidden sm:inline-block text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.5 rounded-md whitespace-nowrap">
                  {isAr ? 'نسمة حياة' : 'Nesma Hayat'}
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                {isAr ? 'ألعاب نفسية تفاعلية — جزء من نسمة حياة 🌿' : 'Interactive Games — Part of Nesma Hayat 🌿'}
              </p>
            </div>
          </button>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Awareness Rank Badge (XP-Based Progression) */}
          <RankHeaderBadge 
            language={language} 
            playerXP={playerXP} 
            userRank={userRank} 
            rankProgress={rankProgress}
            earnedBadgeIds={earnedBadgeIds}
            totalGamesCompleted={totalGamesCompleted}
            onOpenProfile={() => onSelectMode('profile')}
          />

          {/* Daily Streak Fire Tracking */}
          <StreakHeaderBadge language={language} onAddXP={onAddXP} />

          {/* PWA In-App Install Prompt & Offline Info */}
          <div className="hidden sm:block">
            <PWAInstallPrompt language={language} />
          </div>

          {/* Breathing Pause Quick Action */}
          <button
            onClick={() => {
              soundManager.playSoftTap();
              onOpenBreathing();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 transition-all cursor-pointer shadow-2xs"
            title={isAr ? 'وقفة أنفاس مهدئة' : 'Mindful Breathing Pause'}
          >
            <Wind className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">{isAr ? 'وقفة أنفاس' : 'Breathe'}</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onToggleTheme();
              }}
              className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-full border border-stone-200/90 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer shadow-2xs text-xs font-semibold"
              title={theme === 'dark' ? (isAr ? 'التبديل إلى الوضع الفاتح ☀️' : 'Light Mode ☀️') : (isAr ? 'التبديل إلى الوضع الداكن 🌙' : 'Dark Mode 🌙')}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[11px] font-bold text-amber-300">{isAr ? 'فاتح' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                  <span className="hidden sm:inline text-[11px] font-bold text-stone-600">{isAr ? 'داكن' : 'Dark'}</span>
                </>
              )}
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`hidden sm:inline-flex p-2 rounded-full border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 border-stone-200 dark:border-stone-700 line-through'
            }`}
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Settings & Ambient Soundscapes Trigger (Desktop) */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={() => {
                soundManager.playSoftTap();
                onOpenSettings();
              }}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSoundscapeOption
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
              }`}
              title={
                activeSoundscapeOption
                  ? isAr
                    ? `الإعدادات — أجواء نشطة: ${activeSoundscapeOption.labelAr}`
                    : `Settings — Active: ${activeSoundscapeOption.labelEn}`
                  : isAr
                  ? 'الإعدادات والأجواء الصوتية'
                  : 'Settings & Soundscapes'
              }
              aria-label={isAr ? 'الإعدادات والأجواء الصوتية' : 'Settings and Soundscapes'}
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
              {activeSoundscapeOption ? (
                <span className="hidden lg:inline">
                  {isAr ? activeSoundscapeOption.labelAr : activeSoundscapeOption.labelEn}
                </span>
              ) : (
                <span className="hidden xl:inline">{isAr ? 'الإعدادات' : 'Settings'}</span>
              )}
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-100/60 dark:bg-stone-800/60 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-200/80 dark:hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span className="font-mono">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Share App Trigger (Desktop) */}
          {onOpenShare && (
            <button
              type="button"
              onClick={() => {
                soundManager.playSoftTap();
                onOpenShare();
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
              title={isAr ? 'مشاركة التطبيق مع أصدقائك' : 'Share App'}
              aria-label={isAr ? 'مشاركة التطبيق' : 'Share App'}
            >
              <Share2 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xl:inline">{isAr ? 'مشاركة' : 'Share'}</span>
            </button>
          )}

          {/* Update App Trigger (Desktop) */}
          {onOpenUpdate && (
            <button
              type="button"
              onClick={() => {
                soundManager.playSoftTap();
                onOpenUpdate();
              }}
              className="hidden sm:inline-flex p-2 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title={isAr ? 'تحديث التطبيق والتحقق من أحدث إصدار' : 'Check for App Updates'}
              aria-label={isAr ? 'تحديث التطبيق' : 'Update App'}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Info Modal Trigger */}
          <button
            onClick={() => setShowInfo(true)}
            className="hidden sm:inline-flex p-2 rounded-full border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="عن الألعاب"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Technical Audit & Code Verification Trigger */}
          {onOpenTechnicalAudit && (
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onOpenTechnicalAudit();
              }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
              title={isAr ? 'التدقيق التقني وفحص الكود والأمان' : 'Technical Audit & Code Verification'}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{isAr ? 'تدقيق الكود' : 'Code Audit'}</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={isAr ? 'القائمة الرئيسية' : 'Main menu'}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Nav Tabs: Desktop */}
      <div className="hidden md:block border-t border-stone-200/60 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/60">
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
                      ? 'bg-stone-900 dark:bg-emerald-700 text-white shadow-2xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-4 py-3 space-y-1 animate-fade-in">
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
                    ? 'bg-stone-900 dark:bg-emerald-700 text-white'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Mobile Quick Actions: Settings/Soundscapes, Share & Update App + Theme + Install */}
          <div className="pt-2.5 mt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playSoftTap();
                  setMobileMenuOpen(false);
                  onOpenSettings();
                }}
                className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeSoundscapeOption
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>{isAr ? 'الإعدادات والأجواء الصوتية' : 'Settings & Soundscapes'}</span>
                </div>
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                  {activeSoundscapeOption
                    ? isAr
                      ? activeSoundscapeOption.labelAr
                      : activeSoundscapeOption.labelEn
                    : isAr
                    ? 'إيقاف'
                    : 'Off'}
                </span>
              </button>
            )}

            {(onOpenShare || onOpenUpdate) && (
              <div className="grid grid-cols-2 gap-2">
                {onOpenShare && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playSoftTap();
                      setMobileMenuOpen(false);
                      onOpenShare();
                    }}
                    className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Share2 className="w-4 h-4 shrink-0" />
                    <span>{isAr ? 'مشاركة التطبيق' : 'Share App'}</span>
                  </button>
                )}

                {onOpenUpdate && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playSoftTap();
                      setMobileMenuOpen(false);
                      onOpenUpdate();
                    }}
                    className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-stone-200/80 hover:bg-stone-300/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <RefreshCw className="w-4 h-4 shrink-0" />
                    <span>{isAr ? 'تحديث التطبيق' : 'Update App'}</span>
                  </button>
                )}
              </div>
            )}

            <div className="sm:hidden">
              <PWAInstallPrompt language={language} />
            </div>

            {onToggleTheme && (
              <button
                onClick={() => {
                  soundManager.playSoftTap();
                  onToggleTheme();
                }}
                className="w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
                  <span>{theme === 'dark' ? (isAr ? 'الوضع الفاتح ☀️' : 'Light Mode ☀️') : (isAr ? 'الوضع الداكن 🌙' : 'Dark Mode 🌙')}</span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">{theme === 'dark' ? 'DARK ON' : 'LIGHT ON'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Info & Vision Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌿</span>
                <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100 font-serif">
                  {isAr ? 'عن ألعاب نسمة حياة' : 'About Nesma Hayat'}
                </h3>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              <p>
                {isAr
                  ? 'مجموعة ألعاب تفاعلية ونفسية حركية مصممة خصيصاً لمساعدتك على فك تشابك الأفكار، وتهدئة فورة المشاعر، وتفريغ التوتر الجسدي في أوقات الضغط والامتحانات والعلاقات.'
                  : 'A suite of interactive and psychomotor games designed to help you untangle thoughts, regulate intense emotions, and discharge physical stress.'}
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs">
                {isAr
                  ? '⚠️ تنويه مهم: هذه الألعاب أدوات استكشاف ومساعدة ذاتية، وليست تشخيصاً طبياً أو بديلاً عن الاستشارة المتخصصة.'
                  : '⚠️ Disclaimer: These games are self-help awareness tools, not clinical psychiatric diagnosis.'}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowInfo(false)}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
