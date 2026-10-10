import React, { useState } from 'react';
import { Language, GameMode } from '../../types';
import { ALL_36_GAMES, GameCatalogItem } from '../../data/gamesCatalog';
import { soundManager } from '../../utils/audio';
import { X, Sparkles, Clock, Compass, ArrowRight, Check } from 'lucide-react';

interface ExperienceMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectGame: (gameId: GameMode, levelId?: string) => void;
}

type DurationFilter = '1min' | '2-3min' | 'all';
type MoodFilter = 'calm' | 'move' | 'think';

export const ExperienceMixerModal: React.FC<ExperienceMixerModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectGame
}) => {
  if (!isOpen) return null;
  const isAr = language === 'ar';

  const [selectedDuration, setSelectedDuration] = useState<DurationFilter>('2-3min');
  const [selectedMood, setSelectedMood] = useState<MoodFilter>('calm');

  // Compute recommendations strictly from verified 36 games data
  const matchingGames = ALL_36_GAMES.filter((g) => {
    // Mood match
    const matchMood = 
      selectedMood === 'calm' ? (g.experienceType === 'calm' || g.states.includes('calm')) :
      selectedMood === 'move' ? (g.experienceType === 'somatic' || g.experienceType === 'sensory' || g.states.includes('move_release')) :
      (g.experienceType === 'cognitive' || g.experienceType === 'projective' || g.states.includes('mental_challenge'));

    if (!matchMood) return false;

    // Duration match
    if (selectedDuration === '1min') {
      return g.approxDuration.includes('١') || g.approxDuration.includes('٣٠ ثانية');
    } else if (selectedDuration === '2-3min') {
      return g.approxDuration.includes('٢') || g.approxDuration.includes('٣');
    }
    return true;
  }).slice(0, 4); // Keep top 4 non-crowded recommendations

  const handlePick = (game: GameCatalogItem) => {
    soundManager.playSoftTap();
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
                {isAr ? 'حددي وقتك وطاقتك المقترحة لاكتشاف اللعبة الأنسب لك فوراً' : 'Select your available time & energy to get exact matches'}
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
            <span>{isAr ? 'كم دقيقة تملك الآن؟' : 'How much time do you have?'}</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '1min' as DurationFilter, labelAr: 'دقيقة خاطفة ⏱️', labelEn: '1-2 Mins' },
              { id: '2-3min' as DurationFilter, labelAr: '٢-٣ دقائق ⏳', labelEn: '2-3 Mins' },
              { id: 'all' as DurationFilter, labelAr: 'أي مدة 🕰️', labelEn: 'Any Time' },
            ].map((dur) => (
              <button
                key={dur.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setSelectedDuration(dur.id);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
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

        {/* Step 2: Desired Energy / Mood */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-stone-400" />
            <span>{isAr ? 'ما نوع الطاقة التي تبحث عنها؟' : 'What kind of energy do you seek?'}</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'calm' as MoodFilter, labelAr: 'سكينة وهدوء 🌿', labelEn: 'Calm & Settle 🌿' },
              { id: 'move' as MoodFilter, labelAr: 'حركة وتفريغ 🫨', labelEn: 'Move & Release 🫨' },
              { id: 'think' as MoodFilter, labelAr: 'تحدٍ وفهم 🧠', labelEn: 'Think & Insight 🧠' },
            ].map((mood) => (
              <button
                key={mood.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setSelectedMood(mood.id);
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
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
              {isAr ? `الألعاب الأنسب لاختيارك (${matchingGames.length}):` : `Best Matches (${matchingGames.length}):`}
            </span>
          </div>

          <div className="space-y-2">
            {matchingGames.map((game) => {
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
      </div>
    </div>
  );
};
