import React, { useState } from 'react';
import { Language } from '../../types';
import { 
  WISDOM_CARDS_COLLECTION, 
  AWARENESS_LEVELS, 
  getCurrentAwarenessLevel 
} from '../../data/gamificationData';
import { soundManager } from '../../utils/audio';
import { 
  Sparkles, 
  Award, 
  Lock, 
  Unlock, 
  Bookmark, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';

interface WisdomVaultViewProps {
  language: Language;
  playerXP: number;
  onBackToMap?: () => void;
}

export const WisdomVaultView: React.FC<WisdomVaultViewProps> = ({
  language,
  playerXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const currentLevel = getCurrentAwarenessLevel(playerXP, language);
  const allLevels = AWARENESS_LEVELS[language];
  const nextLevel = allLevels.find(l => l.level === currentLevel.level + 1);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const activeCard = WISDOM_CARDS_COLLECTION.find(c => c.id === selectedCardId);

  // Progress to next level
  const currentBase = currentLevel.minXp;
  const nextTarget = nextLevel ? nextLevel.minXp : currentBase + 500;
  const progressPercent = Math.min(100, Math.round(((playerXP - currentBase) / (nextTarget - currentBase)) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {isAr ? 'صندوق كروت الحكمة ومستويات الوعي 👑' : 'Wisdom Vault & Levels 👑'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold font-mono">
          <Zap className="w-4 h-4 fill-amber-400" />
          <span>{playerXP} XP</span>
        </div>
      </div>

      {/* Awareness Level Progression Card */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-amber-500/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-4xl border border-amber-400/40 shadow-inner">
              {currentLevel.badge}
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {isAr ? `مستوى الوعي ${currentLevel.level}` : `Awareness Level ${currentLevel.level}`}
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                {currentLevel.title}
              </h2>
              <p className="text-xs text-stone-300 mt-1 max-w-md leading-relaxed">
                {currentLevel.description}
              </p>
            </div>
          </div>

          {nextLevel && (
            <div className="text-start sm:text-end text-xs text-stone-400 shrink-0">
              <span className="block font-bold">{isAr ? 'المستوى القادم:' : 'Next Level:'}</span>
              <span className="text-amber-300 font-bold text-sm">{nextLevel.title}</span>
              <span className="block text-[11px] mt-0.5">{nextTarget - playerXP} XP متبقية</span>
            </div>
          )}
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-stone-400">
            <span>{playerXP} XP</span>
            <span>{nextTarget} XP</span>
          </div>
          <div className="w-full h-3 bg-stone-950 rounded-full overflow-hidden border border-stone-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* All Levels Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-stone-800">
          {allLevels.map((lvl) => {
            const isUnlocked = playerXP >= lvl.minXp;
            const isCurrent = lvl.level === currentLevel.level;

            return (
              <div
                key={lvl.level}
                className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-500/20 text-white'
                    : isUnlocked
                    ? 'border-stone-700 bg-stone-900/60 text-stone-300'
                    : 'border-stone-800 bg-stone-950/40 text-stone-600 opacity-60'
                }`}
              >
                <div className="text-xl">{lvl.badge}</div>
                <span className="text-[10px] font-bold block truncate">{lvl.title}</span>
                <span className="text-[9px] font-mono block opacity-75">{lvl.minXp} XP</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collectible Wisdom Cards Grid */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
            {isAr ? 'صندوق كروت الحكمة النادرة' : 'Wisdom Cards Vault'}
          </span>
          <h3 className="text-xl font-bold text-stone-900">
            {isAr ? 'كروت تُفتح مع تقدمك في اللعب' : 'Cards Unlocked by Exploration'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WISDOM_CARDS_COLLECTION.map((card) => {
            const isUnlocked = playerXP >= card.unlockedAtXp;
            const isLegendary = card.rarity === 'legendary';
            const isRare = card.rarity === 'rare';

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (isUnlocked) {
                    soundManager.playHarmonicAffirmation();
                    setSelectedCardId(card.id);
                  } else {
                    soundManager.playSoftTap();
                  }
                }}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                  isUnlocked
                    ? isLegendary
                      ? 'border-amber-400 bg-gradient-to-tr from-amber-50 to-yellow-50 shadow-md hover:scale-102'
                      : isRare
                      ? 'border-teal-300 bg-teal-50/50 shadow-xs hover:scale-102'
                      : 'border-stone-200 bg-white hover:border-amber-300 shadow-xs hover:scale-102'
                    : 'border-stone-200 bg-stone-100 opacity-65 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{card.icon}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isLegendary
                        ? 'bg-amber-200 text-amber-900'
                        : isRare
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {card.category}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <Unlock className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-stone-400" />
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold text-stone-900">
                    {card.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 font-serif italic line-clamp-2">
                    {isUnlocked ? `«${card.quote}»` : 'مقفل حتى تصل للنقاط المطلوبة'}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-bold">
                  {isUnlocked ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isAr ? 'مفتوح في ملفك' : 'Unlocked'}</span>
                    </span>
                  ) : (
                    <span className="text-stone-400 font-mono">
                      {isAr ? `يُفتح عند ${card.unlockedAtXp} XP` : `At ${card.unlockedAtXp} XP`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
