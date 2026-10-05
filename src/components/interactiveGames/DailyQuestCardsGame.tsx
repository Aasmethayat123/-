import React, { useState } from 'react';
import { Language, DailyQuest } from '../../types';
import { DAILY_QUESTS_DATA } from '../../data/gamificationData';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  Bookmark, 
  ArrowRight, 
  Flame, 
  Gift, 
  Award,
  Zap
} from 'lucide-react';

interface DailyQuestCardsGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

export const DailyQuestCardsGame: React.FC<DailyQuestCardsGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [activeQuestId, setActiveQuestId] = useState<string>(DAILY_QUESTS_DATA[0].id);

  const activeQuest = DAILY_QUESTS_DATA.find(q => q.id === activeQuestId) || DAILY_QUESTS_DATA[0];
  const isQuestDone = completedQuestIds.includes(activeQuest.id);

  const handleCompleteQuest = (quest: DailyQuest) => {
    if (completedQuestIds.includes(quest.id)) return;

    soundManager.playHarmonicAffirmation();
    triggerConfetti(0.5, 0.4);
    setCompletedQuestIds(prev => [...prev, quest.id]);
    
    if (onAddXP) onAddXP(quest.xpReward);

    saveMoment({
      gameId: 'daily-quests',
      gameTitle: isAr ? 'مهمة يومية حركية' : 'Daily Quest',
      quote: quest.title,
      reflection: quest.psychologicalConcept,
      tag: isAr ? 'مهام حركية' : 'Daily Quest'
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {isAr ? 'كروت المهام الحركية اليومية 📜' : 'Daily Action Quests 📜'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-300 font-bold">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{completedQuestIds.length} / {DAILY_QUESTS_DATA.length} {isAr ? 'مكتملة' : 'Completed'}</span>
        </div>
      </div>

      <div className="text-center max-w-md mx-auto space-y-1">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
          {isAr ? 'بدل النصيحة النظرية.. حركة ملموسة' : 'Real Action Over Theory'}
        </span>
        <h2 className="text-2xl font-extrabold text-stone-900">
          {isAr ? 'كروت المهام اليومية التطبيقية 🌿' : 'Daily Embodied Quests 🌿'}
        </h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          {isAr
            ? 'خطوات حركية وواقعية صغيرة في يومك تعيد الأمان لخلاياك وتمنحك نقاط وعي فورية.'
            : 'Tangible physical actions that reset your neurobiology and award awareness XP.'}
        </p>
      </div>

      {/* Quest Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {DAILY_QUESTS_DATA.map((quest) => {
          const isSelected = quest.id === activeQuestId;
          const isDone = completedQuestIds.includes(quest.id);

          return (
            <button
              key={quest.id}
              onClick={() => {
                soundManager.playSoftTap();
                setActiveQuestId(quest.id);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>{quest.icon}</span>
              <span className="max-w-[130px] truncate">{quest.title}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Active Quest Showcase Card */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto shadow-inner">
          {activeQuest.icon}
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              +{activeQuest.xpReward} XP
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {activeQuest.title}
          </h3>
          <p className="text-sm font-semibold text-stone-800 leading-relaxed p-4 bg-stone-50 rounded-2xl border border-stone-200">
            {activeQuest.actionText}
          </p>
        </div>

        {/* Psychological Concept behind this quest */}
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1 text-start max-w-lg mx-auto">
          <span className="font-extrabold block text-emerald-900">
            🧠 {isAr ? 'السر النفسي والعصبي خلف هذه الحركة:' : 'The neuroscience behind this:'}
          </span>
          <p className="leading-relaxed">
            {activeQuest.psychologicalConcept}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => handleCompleteQuest(activeQuest)}
            disabled={isQuestDone}
            className={`px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all shadow-md flex items-center gap-2 ${
              isQuestDone
                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transform hover:scale-103'
            }`}
          >
            {isQuestDone ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{isAr ? 'تمت المهمة وانحفظت في رحلتك ✓' : 'Completed & Saved to Diary ✓'}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>{isAr ? `أنجزت هذه المهمة الآن (+${activeQuest.xpReward} XP)` : `I Did This Quest (+${activeQuest.xpReward} XP)`}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
