import React, { useEffect, useState } from 'react';
import {
  Settings,
  X,
  Volume2,
  VolumeX,
  CloudRain,
  Trees,
  Waves,
  CircleOff,
  Sun,
  Moon,
  Languages,
} from 'lucide-react';
import { Language } from '../types';
import {
  AMBIENT_SOUNDSCAPES,
  AmbientSoundscapeId,
  soundManager,
} from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onToggleLanguage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const SOUNDSCAPE_ICONS: Record<AmbientSoundscapeId, React.ComponentType<{ className?: string }>> = {
  off: CircleOff,
  rain: CloudRain,
  forest: Trees,
  waves: Waves,
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onToggleLanguage,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
}) => {
  const isAr = language === 'ar';
  const [selectedSoundscape, setSelectedSoundscape] = useState<AmbientSoundscapeId>(() =>
    soundManager.getSoundscape()
  );
  const [ambientVolume, setAmbientVolume] = useState<number>(() =>
    soundManager.getAmbientVolume()
  );

  useEffect(() => {
    const sync = () => {
      setSelectedSoundscape(soundManager.getSoundscape());
      setAmbientVolume(soundManager.getAmbientVolume());
    };
    sync();
    return soundManager.subscribe(sync);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectSoundscape = (id: AmbientSoundscapeId) => {
    // If the user picks an active ambient soundscape while master sound is muted, unmute automatically
    if (id !== 'off' && !soundEnabled) {
      soundManager.enabled = true;
      onToggleSound();
    }
    const next = id !== 'off' && selectedSoundscape === id && soundEnabled ? 'off' : id;
    soundManager.setSoundscape(next);
    if (next === 'off') {
      soundManager.playSoftTap();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVol = parseFloat(e.target.value);
    setAmbientVolume(nextVol);
    soundManager.setAmbientVolume(nextVol);
  };

  const volumePercent = Math.round(ambientVolume * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-settings-modal-title"
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white dark:bg-stone-900 border-t sm:border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-2xl space-y-5 text-start max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile grab handle */}
        <div className="w-10 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3
                id="app-settings-modal-title"
                className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-serif truncate"
              >
                {isAr ? 'الإعدادات والأجواء الصوتية' : 'Settings & Soundscapes'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                {isAr
                  ? 'خصّص خلفية الطبيعة المرافقة للّعب وتفضيلات العرض'
                  : 'Customize ambient background audio and display preferences'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق الإعدادات' : 'Close settings'}
            className="min-w-[44px] min-h-[44px] -me-2 flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Soundscapes Section */}
        <section className="space-y-3" aria-labelledby="soundscapes-heading">
          <div className="flex items-baseline justify-between gap-2">
            <h4
              id="soundscapes-heading"
              className="text-xs font-extrabold text-stone-900 dark:text-stone-100"
            >
              {isAr ? 'الأجواء الصوتية المرافقة (Soundscapes)' : 'Ambient Soundscapes'}
            </h4>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              {selectedSoundscape === 'off' || !soundEnabled
                ? isAr
                  ? 'متوقفة'
                  : 'Muted'
                : isAr
                ? 'تعمل في الخلفية'
                : 'Playing'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {AMBIENT_SOUNDSCAPES.map((option) => {
              const Icon = SOUNDSCAPE_ICONS[option.id];
              const isSelected =
                option.id === 'off'
                  ? selectedSoundscape === 'off' || !soundEnabled
                  : selectedSoundscape === option.id && soundEnabled;

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectSoundscape(option.id)}
                  className={`min-h-[68px] p-3 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-700 dark:bg-emerald-800 border-emerald-700 dark:border-emerald-600 text-white shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/70 dark:hover:bg-stone-800 border-stone-200/90 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="text-xs font-extrabold truncate">
                      {isAr ? option.labelAr : option.labelEn}
                    </span>
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected
                          ? 'text-emerald-200'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    />
                  </div>
                  <p
                    className={`text-[11px] leading-snug line-clamp-2 ${
                      isSelected
                        ? 'text-emerald-100/95'
                        : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {isAr ? option.descAr : option.descEn}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Independent Ambient Volume Control */}
          <div className="pt-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="ambient-volume-slider"
                className="font-bold text-stone-700 dark:text-stone-300"
              >
                {isAr ? 'مستوى صوت الأجواء الطبيعية' : 'Ambient Soundscape Volume'}
              </label>
              <span className="font-mono tabular-nums text-[11px] text-stone-500 dark:text-stone-400">
                {volumePercent}%
              </span>
            </div>
            <input
              id="ambient-volume-slider"
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={handleVolumeChange}
              disabled={selectedSoundscape === 'off' || !soundEnabled}
              className="w-full h-2 rounded-lg accent-emerald-700 dark:accent-emerald-500 bg-stone-200 dark:bg-stone-700 cursor-pointer disabled:opacity-45"
            />
          </div>
        </section>

        {/* General Preferences Section */}
        <section
          className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2"
          aria-labelledby="general-prefs-heading"
        >
          <h4
            id="general-prefs-heading"
            className="text-xs font-extrabold text-stone-900 dark:text-stone-100 mb-2"
          >
            {isAr ? 'تفضيلات الصوت والعرض' : 'Audio & Display'}
          </h4>

          {/* Master Audio Toggle */}
          <button
            type="button"
            onClick={() => {
              if (!soundEnabled) {
                soundManager.enabled = true;
              }
              onToggleSound();
            }}
            className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/70 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400 shrink-0" />
              )}
              <span>{isAr ? 'أصوات التفاعل والأجواء' : 'Game & Ambient Audio'}</span>
            </div>
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {soundEnabled ? (isAr ? 'مفعّل' : 'Enabled') : isAr ? 'مكتوم' : 'Muted'}
            </span>
          </button>

          {/* Theme & Language Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playSoftTap();
                onToggleTheme();
              }}
              className="min-h-[46px] px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/70 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-colors whitespace-nowrap"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isAr ? 'الوضع الفاتح' : 'Light Mode'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>{isAr ? 'الوضع الداكن' : 'Dark Mode'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playSoftTap();
                onToggleLanguage();
              }}
              className="min-h-[46px] px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/70 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Languages className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
