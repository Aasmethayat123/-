import React, { useState } from 'react';
import { CardCategory, Language } from '../types';
import { SEPARATE_ITEMS } from '../data/challenges';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Layers, 
  Sparkles, 
  Heart, 
  FileText, 
  Flame, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface SeparateThemGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

export const SeparateThemGame: React.FC<SeparateThemGameProps> = ({ 
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const items = SEPARATE_ITEMS[language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentItem = items[currentIndex];

  const handleCategoryChoice = (chosen: CardCategory) => {
    if (isAnswered) return;

    setSelectedCategory(chosen);
    setIsAnswered(true);

    const isCorrect = chosen === currentItem.correctCategory;
    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((prev) => prev + (nextStreak >= 3 ? 20 : 10));
      soundManager.playComboSound(nextStreak);

      if (nextStreak >= 3) {
        triggerConfetti(0.5, 0.4);
      }
      if (onAddXP) {
        onAddXP(nextStreak >= 3 ? 25 : 15);
      }
    } else {
      setStreak(0);
      soundManager.playSoftTap();
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < items.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedCategory(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      soundManager.playLevelUpFanfare();
      triggerConfetti(0.5, 0.3);
    }
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setCurrentIndex(0);
    setSelectedCategory(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
  };

  const categoryLabels = {
    thought: {
      title: isAr ? '💭 فكرة (Thought)' : '💭 Thought',
      desc: isAr ? 'حكم أو تأويل عقلي قد يخطئ' : 'Mental narrative or judgment',
      icon: Sparkles,
      color: 'border-indigo-400 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950',
      activeColor: 'border-indigo-600 bg-indigo-600 text-white'
    },
    feeling: {
      title: isAr ? '💛 شعور (Feeling)' : '💛 Feeling',
      desc: isAr ? 'استجابة وجدانية وجسدية حيوية' : 'Biological emotion and sensation',
      icon: Heart,
      color: 'border-amber-400 bg-amber-50/70 hover:bg-amber-100 text-amber-950',
      activeColor: 'border-amber-600 bg-amber-600 text-white'
    },
    fact: {
      title: isAr ? '📋 حقيقة (Fact)' : '📋 Fact',
      desc: isAr ? 'واقعة محايدة تسجلها الكاميرا' : 'Objective verifiable data',
      icon: FileText,
      color: 'border-emerald-400 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950',
      activeColor: 'border-emerald-600 bg-emerald-600 text-white'
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Arcade HUD */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← الخريطة' : '← Map'}
            </button>
          )}
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider hidden sm:inline">
            {isAr ? 'حلبة الفرز السريع 🎮' : 'Arcade Sorter 🎮'}
          </span>
        </div>

        {/* Streaks & Score */}
        <div className="flex items-center gap-4 text-xs font-bold">
          {streak >= 2 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30 animate-pulse">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{isAr ? `${streak} متتالية! x2` : `${streak} Streak! x2`}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-stone-800 px-3 py-1 rounded-full border border-stone-700 font-mono text-sm text-yellow-400">
            <Zap className="w-3.5 h-3.5 fill-yellow-400" />
            <span>{score} PTS</span>
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
            <span>
              {isAr ? `البطاقة ${currentIndex + 1} من ${items.length}` : `Card ${currentIndex + 1} of ${items.length}`}
            </span>
            <span>
              {isAr ? 'صنّف العبارة بأسرع وقت' : 'Sort the Card!'}
            </span>
          </div>

          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            />
          </div>

          {/* Main Statement Game Card */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 sm:p-10 text-center shadow-md relative overflow-hidden">
            <div className="absolute top-3 left-4 rtl:left-auto rtl:right-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              {isAr ? 'البطاقة الحالية' : 'Current Card'}
            </div>

            <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug max-w-lg mx-auto font-serif py-3">
              {currentItem.statement}
            </p>
          </div>

          {/* 3 Sorting Target Buckets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['thought', 'feeling', 'fact'] as CardCategory[]).map((cat) => {
              const meta = categoryLabels[cat];
              const isSelected = selectedCategory === cat;
              const isCorrect = currentItem.correctCategory === cat;

              let style = meta.color;
              if (isAnswered) {
                if (isCorrect) {
                  style = 'border-emerald-600 bg-emerald-100 text-emerald-950 font-bold ring-4 ring-emerald-400';
                } else if (isSelected && !isCorrect) {
                  style = 'border-rose-400 bg-rose-100 text-rose-950 opacity-80';
                } else {
                  style = 'border-stone-200 bg-stone-100 text-stone-400 opacity-40';
                }
              }

              return (
                <button
                  key={cat}
                  disabled={isAnswered}
                  onClick={() => handleCategoryChoice(cat)}
                  className={`p-5 rounded-2xl border-2 text-start transition-all cursor-pointer transform hover:-translate-y-1 shadow-xs ${style}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-extrabold">{meta.title}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>
                  <p className="text-xs opacity-85 leading-relaxed">
                    {meta.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Feedback Drawer on Answer */}
          {isAnswered && (
            <div className={`p-5 rounded-2xl border text-xs animate-fade-in space-y-2 ${
              selectedCategory === currentItem.correctCategory
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedCategory === currentItem.correctCategory ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>{isAr ? 'فرز صحيح ومتقن! 🎯' : 'Spot on! 🎯'}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-amber-700" />
                    <span>
                      {isAr 
                        ? `هذه في الحقيقة: ${categoryLabels[currentItem.correctCategory].title}`
                        : `This is actually a: ${categoryLabels[currentItem.correctCategory].title}`}
                    </span>
                  </>
                )}
              </div>
              <p className="text-stone-700 leading-relaxed font-medium">
                {currentItem.explanation}
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
                >
                  <span>{isAr ? 'البطاقة التالية' : 'Next Card'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🏆
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'انتصار الفرز السريع!' : 'Sorting Victory!'}
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              {isAr ? `جمعتَ ${score} نقطة وعي!` : `Total Score: ${score} XP!`}
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl max-w-md mx-auto text-xs text-stone-700 border border-stone-200">
            {isAr
              ? 'تذكر دائماً: المشاعر تُقبل وتُفهم، والحقائق لا تتغير، أما الأفكار فأنت سيدها ويمكنك دائماً فحصها واختبارها.'
              : 'Remember: Emotions are felt and honored, facts are accepted, but thoughts can always be questioned.'}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة اللعب' : 'Play Again'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'العودة للخريطة' : 'Back to Map'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
