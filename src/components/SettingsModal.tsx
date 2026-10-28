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
  Smartphone,
  Share2,
  RefreshCw,
  Type,
  HelpCircle,
  RotateCcw,
  Bell,
} from 'lucide-react';
import { Language } from '../types';
import {
  AMBIENT_SOUNDSCAPES,
  AmbientSoundscapeId,
  soundManager,
} from '../utils/audio';
import {
  NotificationManager,
  WeeklyReminderConfig,
} from '../utils/notificationManager';
import {
  SW_AUTO_PREF_CHANGED_EVENT,
  isAutoUpdateEnabled,
  setAutoUpdateEnabled,
} from '../utils/appLifecycle';
import {
  FONT_SCALE_OPTIONS,
  FontScaleLevel,
  useFontScale,
} from '../utils/fontPreferences';
import {
  GAME_GUIDE_PREF_CHANGED_EVENT,
  isAutoGameGuideEnabled,
  resetSeenGameGuides,
  setAutoGameGuideEnabled,
} from './common/GameGuideSystem';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onToggleLanguage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenInstall?: () => void;
  onOpenShare?: () => void;
  onOpenUpdate?: () => void;
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
  onOpenInstall,
  onOpenShare,
  onOpenUpdate,
}) => {
  const isAr = language === 'ar';
  const { fontScale, setFontScale } = useFontScale();
  const [selectedSoundscape, setSelectedSoundscape] = useState<AmbientSoundscapeId>(() =>
    soundManager.getSoundscape()
  );
  const [ambientVolume, setAmbientVolume] = useState<number>(() =>
    soundManager.getAmbientVolume()
  );
  const [autoUpdate, setAutoUpdate] = useState<boolean>(() => isAutoUpdateEnabled());
  const [autoGameGuides, setAutoGameGuides] = useState<boolean>(() => isAutoGameGuideEnabled());
  const [guidesResetNotice, setGuidesResetNotice] = useState<boolean>(false);
  const [reminderConfig, setReminderConfig] = useState<WeeklyReminderConfig>(() =>
    NotificationManager.getConfig()
  );

  useEffect(() => {
    const sync = () => {
      setSelectedSoundscape(soundManager.getSoundscape());
      setAmbientVolume(soundManager.getAmbientVolume());
      setAutoUpdate(isAutoUpdateEnabled());
      setAutoGameGuides(isAutoGameGuideEnabled());
    };
    sync();
    window.addEventListener(SW_AUTO_PREF_CHANGED_EVENT, sync);
    window.addEventListener(GAME_GUIDE_PREF_CHANGED_EVENT, sync);
    const unsub = soundManager.subscribe(sync);
    return () => {
      window.removeEventListener(SW_AUTO_PREF_CHANGED_EVENT, sync);
      window.removeEventListener(GAME_GUIDE_PREF_CHANGED_EVENT, sync);
      unsub();
    };
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

  const handleSelectFontScale = (level: FontScaleLevel) => {
    soundManager.playSoftTap();
    setFontScale(level);
  };

  const handleSelectSoundscape = (id: AmbientSoundscapeId) => {
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
  const activeFontOption =
    FONT_SCALE_OPTIONS.find((opt) => opt.id === fontScale) || FONT_SCALE_OPTIONS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/65 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-settings-modal-title"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white dark:bg-stone-900 border-t sm:border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-2xl space-y-5 text-start max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile grab handle */}
        <div className="w-10 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3
                id="app-settings-modal-title"
                className="text-lg font-extrabold text-stone-900 dark:text-stone-100 font-serif leading-snug"
              >
                {isAr ? 'الإعدادات وراحة القراءة والأجواء' : 'Reading Comfort, Audio & Settings'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {isAr
                  ? 'اضبط حجم الخط، المظهر، وشرح الألعاب والأجواء الصوتية بما يريح عينيك'
                  : 'Customize font size, theme, game guides, and ambient soundscapes'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق الإعدادات' : 'Close settings'}
            className="min-w-[44px] min-h-[44px] -me-2 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Unified Global Font Size Section (3 Levels: عادي / كبير / كبير جدًا) */}
        <section className="space-y-3" aria-labelledby="font-scale-heading">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <h4
                id="font-scale-heading"
                className="text-sm font-extrabold text-stone-900 dark:text-stone-100"
              >
                {isAr ? 'حجم الخط وراحة القراءة (في كل التطبيق)' : 'App-Wide Text Size'}
              </h4>
            </div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              {isAr ? activeFontOption.labelAr : activeFontOption.labelEn}
            </span>
          </div>

          <div
            role="radiogroup"
            aria-labelledby="font-scale-heading"
            className="grid grid-cols-3 gap-2.5"
          >
            {FONT_SCALE_OPTIONS.map((opt) => {
              const isSelected = fontScale === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectFontScale(opt.id)}
                  className={`min-h-[64px] p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-700 dark:bg-emerald-800 border-emerald-700 dark:border-emerald-500 text-white shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/70 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <span className="text-base font-black leading-none">
                    {isAr ? opt.shortBadgeAr : opt.shortBadgeEn}
                  </span>
                  <span className="text-xs font-extrabold leading-snug">
                    {isAr ? opt.labelAr : opt.labelEn}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-200/80 dark:border-stone-700/70">
            {isAr ? activeFontOption.descAr : activeFontOption.descEn}
          </p>
        </section>

        {/* Weekly Session Reminder (Capacitor Local Notifications) */}
        <section
          className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3"
          aria-labelledby="weekly-reminder-heading"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <h4
                id="weekly-reminder-heading"
                className="text-sm font-extrabold text-stone-900 dark:text-stone-100"
              >
                {isAr ? 'تذكير الجلسة الأسبوعية (عبر الإشعارات)' : 'Weekly Session Reminder'}
              </h4>
            </div>
            <button
              type="button"
              onClick={async () => {
                soundManager.playSoftTap();
                const granted = await NotificationManager.requestPermission();
                if (!granted) {
                  alert(isAr ? 'يرجى السماح بالاستلام من إعدادات المتصفح أو الجهاز.' : 'Please allow notifications in device/browser settings.');
                  return;
                }
                const nextState = !reminderConfig.enabled;
                const updated = { ...reminderConfig, enabled: nextState };
                setReminderConfig(updated);
                await NotificationManager.saveConfig(updated);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                reminderConfig.enabled
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              {reminderConfig.enabled ? (isAr ? 'مفعّل ✓' : 'Enabled ✓') : (isAr ? 'متوقف' : 'Off')}
            </button>
          </div>

          {reminderConfig.enabled && (
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {isAr ? 'يوم الأسبوع:' : 'Day of week:'}
                  </label>
                  <select
                    value={reminderConfig.dayOfWeek}
                    onChange={async (e) => {
                      const val = Number(e.target.value);
                      const updated = { ...reminderConfig, dayOfWeek: val };
                      setReminderConfig(updated);
                      await NotificationManager.saveConfig(updated);
                    }}
                    className="w-full p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-bold"
                  >
                    <option value={5}>{isAr ? 'الجمعة' : 'Friday'}</option>
                    <option value={6}>{isAr ? 'السبت' : 'Saturday'}</option>
                    <option value={0}>{isAr ? 'الأحد' : 'Sunday'}</option>
                    <option value={1}>{isAr ? 'الإثنين' : 'Monday'}</option>
                    <option value={2}>{isAr ? 'الثلاثاء' : 'Tuesday'}</option>
                    <option value={3}>{isAr ? 'الأربعاء' : 'Wednesday'}</option>
                    <option value={4}>{isAr ? 'الخميس' : 'Thursday'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {isAr ? 'الساعة المناسبة:' : 'Time:'}
                  </label>
                  <input
                    type="time"
                    value={`${String(reminderConfig.hour).padStart(2, '0')}:${String(reminderConfig.minute).padStart(2, '0')}`}
                    onChange={async (e) => {
                      const [h, m] = e.target.value.split(':').map(Number);
                      const updated = { ...reminderConfig, hour: h || 19, minute: m || 0 };
                      setReminderConfig(updated);
                      await NotificationManager.saveConfig(updated);
                    }}
                    className="w-full p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-mono font-bold"
                  />
                </div>
              </div>

              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                {isAr
                  ? 'سيقوم التطبيق بإرسال تنبيه لطيف في الموعد المحدد ليذكرك بأهمية جلستك والاعتناء بسلامك الداخلي.'
                  : 'The app will send a gentle reminder at your chosen time for weekly self-care.'}
              </p>
            </div>
          )}
        </section>

        {/* 2. Ambient Soundscapes Section */}
        <section
          className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3"
          aria-labelledby="soundscapes-heading"
        >
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h4
              id="soundscapes-heading"
              className="text-sm font-extrabold text-stone-900 dark:text-stone-100"
            >
              {isAr ? 'الأجواء الصوتية المرافقة (Soundscapes)' : 'Ambient Soundscapes'}
            </h4>
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              {selectedSoundscape === 'off' || !soundEnabled
                ? isAr
                  ? 'متوقفة'
                  : 'Muted'
                : isAr
                ? 'تعمل في الخلفية'
                : 'Playing'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                  className={`min-h-[72px] p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-700 dark:bg-emerald-800 border-emerald-700 dark:border-emerald-600 text-white shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/70 dark:hover:bg-stone-800 border-stone-200/90 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="text-sm font-extrabold leading-snug">
                      {isAr ? option.labelAr : option.labelEn}
                    </span>
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected
                          ? 'text-emerald-200'
                          : 'text-stone-600 dark:text-stone-300'
                      }`}
                    />
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected
                        ? 'text-emerald-50'
                        : 'text-stone-600 dark:text-stone-300'
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
                className="font-bold text-stone-800 dark:text-stone-200"
              >
                {isAr ? 'مستوى صوت الأجواء الطبيعية' : 'Ambient Soundscape Volume'}
              </label>
              <span className="font-mono tabular-nums text-xs font-bold text-stone-700 dark:text-stone-300">
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
              className="w-full h-2.5 rounded-lg accent-emerald-700 dark:accent-emerald-500 bg-stone-200 dark:bg-stone-700 cursor-pointer disabled:opacity-45"
            />
          </div>
        </section>

        {/* 3. General Preferences & Game Guides Section */}
        <section
          className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2.5"
          aria-labelledby="general-prefs-heading"
        >
          <h4
            id="general-prefs-heading"
            className="text-sm font-extrabold text-stone-900 dark:text-stone-100"
          >
            {isAr ? 'تفضيلات العرض والصوت وشرح الألعاب' : 'Display, Audio & Game Guides'}
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
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/70 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-500 shrink-0" />
              )}
              <span>{isAr ? 'أصوات التفاعل والأجواء' : 'Game & Ambient Audio'}</span>
            </div>
            <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
              {soundEnabled ? (isAr ? 'مفعّل' : 'Enabled') : isAr ? 'مكتوم' : 'Muted'}
            </span>
          </button>

          {/* Auto-Show Game Guides Toggle */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={autoGameGuides}
              onClick={() => {
                soundManager.playSoftTap();
                const next = !autoGameGuides;
                setAutoGameGuides(next);
                setAutoGameGuideEnabled(next);
              }}
              className="flex-1 min-h-[48px] px-3.5 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/70 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 text-start">
                <HelpCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>{isAr ? 'شرح تلقائي للألعاب الجديدة' : 'Auto-open Game Guides'}</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 shrink-0">
                {autoGameGuides ? (isAr ? 'مفعّل' : 'On') : isAr ? 'متوقف' : 'Off'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playSoftTap();
                resetSeenGameGuides();
                setAutoGameGuides(true);
                setGuidesResetNotice(true);
                setTimeout(() => setGuidesResetNotice(false), 2500);
              }}
              className="min-h-[48px] px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>
                {guidesResetNotice
                  ? isAr
                    ? 'تمت الإعادة ✓'
                    : 'Reset ✓'
                  : isAr
                  ? 'إظهار كل الشروحات'
                  : 'Reset Guides'}
              </span>
            </button>
          </div>

          {/* Theme & Language Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playSoftTap();
                onToggleTheme();
              }}
              className="min-h-[48px] px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/70 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isAr ? 'الوضع الفاتح' : 'Light Mode'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-stone-700 shrink-0" />
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
              className="min-h-[48px] px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/70 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-colors"
            >
              <Languages className="w-4 h-4 text-stone-600 dark:text-stone-300 shrink-0" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </section>

        {/* 4. Mobile App, Sharing & Automatic Updates Section */}
        <section
          className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2.5"
          aria-labelledby="app-lifecycle-heading"
        >
          <h4
            id="app-lifecycle-heading"
            className="text-sm font-extrabold text-stone-900 dark:text-stone-100"
          >
            {isAr ? 'التثبيت والمشاركة والتحديث التلقائي' : 'Mobile App, Sharing & Auto-Update'}
          </h4>

          {/* Auto-Update Toggle Row */}
          <button
            type="button"
            role="switch"
            aria-checked={autoUpdate}
            onClick={() => {
              soundManager.playSoftTap();
              const next = !autoUpdate;
              setAutoUpdate(next);
              setAutoUpdateEnabled(next);
            }}
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/70 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>{isAr ? 'التحديث التلقائي في الخلفية' : 'Automatic Background Updates'}</span>
            </div>
            <span
              className={`text-xs font-extrabold ${
                autoUpdate
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              {autoUpdate ? (isAr ? 'مفعّل ✓' : 'On ✓') : isAr ? 'يدوي' : 'Manual'}
            </span>
          </button>

          <div className="grid grid-cols-3 gap-2">
            {onOpenInstall && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playSoftTap();
                  onClose();
                  onOpenInstall();
                }}
                className="min-h-[46px] px-2.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'تثبيت' : 'Install'}</span>
              </button>
            )}

            {onOpenShare && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playSoftTap();
                  onClose();
                  onOpenShare();
                }}
                className="min-h-[46px] px-2.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/70 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'مشاركة' : 'Share'}</span>
              </button>
            )}

            {onOpenUpdate && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playSoftTap();
                  onClose();
                  onOpenUpdate();
                }}
                className="min-h-[46px] px-2.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'التحديث' : 'Updates'}</span>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
