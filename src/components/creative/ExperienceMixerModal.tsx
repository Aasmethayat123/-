import React, { useState, useEffect } from 'react';
import { Language, GameMode } from '../../types';
import { ALL_36_GAMES, GameCatalogItem } from '../../data/gamesCatalog';
import { soundManager } from '../../utils/audio';
import { recordLastPlayedGame } from '../../utils/adventures';
import { X, Sparkles, Clock, Compass, ArrowRight, Check, AlertCircle } from 'lucide-react';

interface ExperienceMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectGame: (gameId: GameMode, levelId?: string) => void;
}

type DurationTier = '1min' | '3min' | '5min' | 'all';
type MoodTarget = 'calm' | 'move' | 'think' | 'insight';

export const ExperienceMixerModal: React.FC<ExperienceMixerModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectGame
}) => {
  const isAr = language === 'ar';
  const [selectedDuration, setSelectedDuration] = useState<DurationTier>('3min');
  const [selectedMood, setSelectedMood] = useState<MoodTarget>('calm');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Exact matching games based on structured catalog metadata
  const primaryMatches = ALL_36_GAMES.filter((g) => {
    // Mood match
    const matchMood = 
      selectedMood === 'calm' ? (g.experienceType === 'calm' || g.states.includes('calm')) :
      selectedMood === 'move' ? (g.experienceType === 'somatic' || g.experienceType === 'sensory' || g.states.includes('move_release')) :
      selectedMood === 'insight' ? (g.experienceType === 'projective' || g.states.includes('understand_self')) :
      (g.experienceType === 'cognitive' || g.states.includes('mental_challenge') || g.states.includes('focus'));

    if (!matchMood) return false;

    // Duration match
    if (selectedDuration === '1min') {
      return g.approxDuration.includes('١') || g.approxDuration.includes('٣٠ ثانية') || g.approxDuration.includes('45s') || g.approxDuration.includes('1-2');
    } else if (selectedDuration === '3min') {
      return g.approxDuration.includes('٢') || g.approxDuration.includes('٣') || g.approxDuration.includes('3-5');
    } else if (selectedDuration === '5min') {
      return g.approxDuration.includes('٥') || g.approxDuration.includes('5') || g.approxDuration.includes('مفتوحة');
    }
    return true;
  });

  // Resilient fallback: If no exact matches for the strict duration, take top games from the same mood
  const isFallback = primaryMatches.length === 0;
  const displayGames = (isFallback 
    ? ALL_36_GAMES.filter((g) => {
        return selectedMood === 'calm' ? (g.experienceType === 'calm' || g.states.includes('calm')) :
               selectedMood === 'move' ? (g.experienceType === 'somatic' || g.experienceType === 'sensory' || g.states.includes('move_release')) :
               selectedMood === 'insight' ? (g.experienceType === 'projective' || g.states.includes('understand_self')) :
               (g.experienceType === 'cognitive' || g.states.includes('mental_challenge'));
      })
    : primaryMatches
  ).slice(0, 4);

  const handlePick = (game: GameCatalogItem) => {
    soundManager.playSoftTap();
    recordLastPlayedGame(game);
    onClose();
    onSelectGame(game.id, game.levelId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 dark:bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative text-start transition-colors space-y-5 max-h-[90vh] overflow-y-auto"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xl">
              🎛️
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                {isAr ? 'اصنع تجربتك 🎛️' : 'Experience Mixer 🎛️'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {isAr ? 'حدّد وقتك والهدف المطلوب لاقتراح التجربة الأنسب من المكتبة' : 'Set your available time and goal for curated matches'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Time Available */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{isAr ? 'المدة المتاحة لك الآن:' : 'Available duration:'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: '1min' as DurationTier, labelAr: 'دقيقة خاطفة ⏱️', labelEn: '1-2 Mins' },
              { id: '3min' as DurationTier, labelAr: '٣ دقائق ⏳', labelEn: '3 Mins' },
              { id: '5min' as DurationTier, labelAr: '٥ دقائق 🕰️', labelEn: '5 Mins' },
              { id: 'all' as DurationTier, labelAr: 'تجربة مفتوحة 🚀', labelEn: 'Open Time' },
            ].map((dur) => (
              <button
                key={dur.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setSelectedDuration(dur.id);
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                  selectedDuration === dur.id
                    ? 'bg-stone-900 dark:bg-amber-600 text-white border-stone-900 dark:border-amber-600 shadow-2xs'
                    : 'bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                {isAr ? dur.labelAr : dur.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Desired Goal / State */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-stone-400" />
            <span>{isAr ? 'الهدف المطلوب من التجربة:' : 'Desired outcome:'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'calm' as MoodTarget, labelAr: 'الهدوء والسكينة 🌿', labelEn: 'Calm 🌿' },
              { id: 'move' as MoodTarget, labelAr: 'تفريغ وحركة 🫨', labelEn: 'Release 🫨' },
              { id: 'think' as MoodTarget, labelAr: 'تفكير وتركيز 🧠', labelEn: 'Focus 🧠' },
              { id: 'insight' as MoodTarget, labelAr: 'فهم الذات 🔍', labelEn: 'Insight 🔍' },
            ].map((mood) => (
              <button
                key={mood.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setSelectedMood(mood.id);
                }}
                className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                  selectedMood === mood.id
                    ? 'bg-stone-900 dark:bg-emerald-700 text-white border-stone-900 dark:border-emerald-700 shadow-2xs'
                    : 'bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                {isAr ? mood.labelAr : mood.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Exact Matching Games Results */}
        <div className="space-y-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
              {isFallback 
                ? (isAr ? 'أقرب تجارب مقترحة تناسب هدفك:' : 'Closest matches for your goal:')
                : (isAr ? `تجارب مطابقة تماماً لاختيارك (${displayGames.length}):` : `Exact matches (${displayGames.length}):`)}
            </span>
          </div>

          <div className="space-y-2">
            {displayGames.map((game) => {
              const Icon = game.icon;
              return (
                <div
                  key={`${game.id}-${game.levelId || ''}`}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {isAr ? game.nameAr : game.nameEn}
                      </h4>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                        {game.approxDuration} · {isAr ? game.badgeAr : game.badgeEn}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePick(game)}
                    className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-transform hover:scale-103 shrink-0"
                  >
                    {isAr ? 'العب الآن' : 'Play Now'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400 dark:text-stone-500 leading-relaxed">
          {isAr
            ? 'تعتمد التوصيات على قواعد برمجية لتصنيف ألعاب المشروع الـ٤٠ ومددها الموثقة لتسهيل الوصول، وليست تشخيصاً أو قياساً نفسياً معتمداً.'
            : 'Recommendations are based on catalog tags & estimated durations, not clinical evaluation.'}
        </div>
      </div>
    </div>
  );
};
