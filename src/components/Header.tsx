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
  Award
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
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  language,
  onToggleLanguage,
  onOpenBreathing,
  soundEnabled,
  onToggleSound,
  playerXP
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = language === 'ar';

  const navItems = [
    { mode: 'map' as GameMode, label: isAr ? 'كل الألعاب' : 'All Games', icon: MapPin },
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
