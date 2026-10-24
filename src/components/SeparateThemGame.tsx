import React, { useState, useEffect } from 'react';
import { CardCategory, Language } from '../types';
import { SEPARATE_ITEMS } from '../data/challenges';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Heart,
  FileText,
  Flame,
  Zap,
  ArrowRight,
  Timer
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../utils/gameLevelsManager';
import { StageLevelSelector } from './common/StageLevelSelector';

interface SeparateThemGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface SortCard {
  statement: string;
  correctCategory: CardCategory;
  explanation: string;
}

const EXTRA_STAGE_CARDS: Record<2 | 3, Record<Language, SortCard[]>> = {
  // Stage 2: Disguised thoughts ("I feel that...") + 12s timer
  2: {
    ar: [
      {
        statement: '«أشعر أن زملائي يتقصدون تهميشي في الاجتماع.»',
        correctCategory: 'thought',
        explanation: 'فخ لغوي شهير! وجود كلمة «أشعر أن» بعدها اتهام لنوايا الآخرين يجعلها (فكرة وتأويلاً) لا شعوراً جسدياً.'
      },
      {
        statement: '«وصلت الرسالة الساعة ٩:١٥ مساءً ولم يُفتح إشعار القراءة بعد.»',
        correctCategory: 'fact',
        explanation: 'واقعة رقمية محايدة تسجلها الكاميرا والوقت دون أي افتراض عن السبب.'
      },
      {
        statement: '«انقباض في المعدة وحرارة خفيفة في الوجه مع خيبة أمل.»',
        correctCategory: 'feeling',
        explanation: 'وصف دقيق لشعور وجداني واستجابة فسيولوجية في الجسد دون تأويل.'
      },
      {
        statement: '«حاسس إن مفيش فايدة من أي محاولة جديدة.»',
        correctCategory: 'thought',
        explanation: 'رغم كلمة «حاسس»، هذا تعميم وتنبؤ سلبي بالمستقبل؛ أي فكرة قابلة للفحص وليست شعوراً.'
      },
      {
        statement: '«اعتذر صديقي عن الحضور قائلاً إن لديه ظرفاً عائلياً.»',
        correctCategory: 'fact',
        explanation: 'هذا نص ما قيل فعلياً على أرض الواقع؛ أما التشكيك في صدقه فهو فكرة إضافية.'
      },
      {
        statement: '«رهبة وتوتر هادئ في الصدر قبل إلقاء العرض التقديمي.»',
        correctCategory: 'feeling',
        explanation: 'تسمية صافية للشعور والإحساس الجسدي الطبيعي قبل حدث مهم.'
      }
    ],
    en: [
      {
        statement: '“I feel like my coworkers are intentionally excluding me.”',
        correctCategory: 'thought',
        explanation: 'Classic trap! “I feel like...” followed by reading others’ minds is a Thought, not an emotion.'
      },
      {
        statement: '“The message was delivered at 9:15 PM and remains unread.”',
        correctCategory: 'fact',
        explanation: 'Purely verifiable timestamp data without assumptions.'
      },
      {
        statement: '“Tightness in my stomach and a wave of disappointment.”',
        correctCategory: 'feeling',
        explanation: 'Authentic somatic sensation and primary emotion.'
      },
      {
        statement: '“I feel that trying again is completely pointless.”',
        correctCategory: 'thought',
        explanation: 'Fortune-telling disguised with the word “feel” — this is a cognitive conclusion.'
      },
      {
        statement: '“My friend texted saying they have a family obligation tonight.”',
        correctCategory: 'fact',
        explanation: 'Observable statement of what was communicated.'
      },
      {
        statement: '“A flutter of nervousness in my chest before presenting.”',
        correctCategory: 'feeling',
        explanation: 'Direct naming of emotion and bodily state.'
      }
    ]
  },

  // Stage 3: Compound nuanced statements + 8s Master Blitz Timer
  3: {
    ar: [
      {
        statement: '«بما أنه رد بكلمة واحدة (تمام)، فهذا يثبت أنه غاضب مني.»',
        correctCategory: 'thought',
        explanation: 'الشق الأول واقعة، لكن العبارة ككل قفزت لاستنتاج قاطع («يثبت أنه غاضب»)؛ لذا هي فكرة استنتاجية.'
      },
      {
        statement: '«حصلت على ٨٢٪ في الاختبار بينما المعدل العام للقاعة ٧٩٪.»',
        correctCategory: 'fact',
        explanation: 'أرقام قياسية موثقة تخلو من أحكام «أنا فاشل» أو «كان يجب ١٠٠٪».'
      },
      {
        statement: '«مزيج من الحنين الدافئ والحزن الهادئ عند سماع هذه الأنغام.»',
        correctCategory: 'feeling',
        explanation: 'شعور مركّب ناضج يصف التجربة الوجدانية الصافية دون إطلاق أحكام.'
      },
      {
        statement: '«لو كنتُ شخصاً كفؤاً حقاً لما احتجتُ لطلب المساعدة من أحد.»',
        correctCategory: 'thought',
        explanation: 'قاعدة ذهنية صارمة من قواعد الكمال (ينبغي/لو)، وهي فكرة وليست حقيقة كونية.'
      },
      {
        statement: '«استمرت المكالمة ٤ دقائق وانتهت باتفاق على المراجعة غداً.»',
        correctCategory: 'fact',
        explanation: 'توصيف إجرائي دقيق لما حدث دون تهويل أو قراءة للنوايا.'
      },
      {
        statement: '«إرهاق ثقيل في الكتفين مع رغبة صادقة في السكينة والهدوء.»',
        correctCategory: 'feeling',
        explanation: 'اتصال واعي بإحساس الجسد والشعور الداخلي المباشر.'
      }
    ],
    en: [
      {
        statement: '“Since he replied with just ‘OK’, that proves he is upset with me.”',
        correctCategory: 'thought',
        explanation: 'Jumping from a brief text to “proves he is upset” is mind-reading (Thought).'
      },
      {
        statement: '“I scored 82% on the exam while the class average was 79%.”',
        correctCategory: 'fact',
        explanation: 'Objective numerical data free of self-judgment.'
      },
      {
        statement: '“A bittersweet blend of warmth and quiet grief hearing this song.”',
        correctCategory: 'feeling',
        explanation: 'Nuanced dual emotion experienced in the body and heart.'
      },
      {
        statement: '“If I were truly competent, I would never need to ask for help.”',
        correctCategory: 'thought',
        explanation: 'A rigid perfectionistic rule (“should/if”), making it a cognitive construct.'
      },
      {
        statement: '“The call lasted 4 minutes and ended with a plan to review tomorrow.”',
        correctCategory: 'fact',
        explanation: 'Verifiable factual summary.'
      },
      {
        statement: '“Heaviness in my shoulders paired with a longing for quiet rest.”',
        correctCategory: 'feeling',
        explanation: 'Direct somatic and emotional awareness.'
      }
    ]
  }
};

const GAME_ID = 'challenge-separate';

export const SeparateThemGame: React.FC<SeparateThemGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const items: SortCard[] = currentStage === 1
    ? SEPARATE_ITEMS[language]
    : EXTRA_STAGE_CARDS[currentStage as 2 | 3][language];

  const blitzSeconds = currentStage === 1 ? 0 : currentStage === 2 ? 12 : 8;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(blitzSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  const currentItem = items[currentIndex] || items[0];

  useEffect(() => {
    if (blitzSeconds === 0 || isAnswered || isCompleted) return;
    setTimeLeft(blitzSeconds);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          soundManager.playSoftTap();
          setIsAnswered(true);
          setStreak(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStage, currentIndex, isAnswered, isCompleted, blitzSeconds]);

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setCurrentIndex(0);
    setSelectedCategory(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setIsCompleted(false);
    setShowCompletionModal(false);
  };

  const handleCategoryChoice = (chosen: CardCategory) => {
    if (isAnswered) return;

    setSelectedCategory(chosen);
    setIsAnswered(true);

    const isCorrect = chosen === currentItem.correctCategory;
    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setCorrectCount(c => c + 1);
      setScore(prev => prev + (nextStreak >= 3 ? 20 : 10));
      soundManager.playComboSound(nextStreak);
      if (nextStreak >= 3) triggerConfetti(0.5, 0.4);
    } else {
      setStreak(0);
      soundManager.playSoftTap();
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < items.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedCategory(null);
      setIsAnswered(false);
    } else {
      const ratio = correctCount / items.length;
      const stars = ratio >= 0.8 ? 3 : ratio >= 0.55 ? 2 : 1;
      setEarnedStars(stars);
      const res = completeStage(GAME_ID, currentStage, stars, score, onAddXP);
      setEarnedXP(res.xpAwarded);
      setProgress(getGameLevelProgress(GAME_ID));
      setIsCompleted(true);
      setShowCompletionModal(true);
    }
  };

  const handleNextStage = () => {
    if (currentStage < 3) {
      loadStage(currentStage + 1);
    } else {
      setShowCompletionModal(false);
    }
  };

  const categoryLabels = {
    thought: {
      title: isAr ? '💭 فكرة (Thought)' : '💭 Thought',
      desc: isAr ? 'حكم أو تأويل عقلي قابل للفحص' : 'Mental narrative or judgment',
      icon: Sparkles,
      color: 'border-indigo-400 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-200'
    },
    feeling: {
      title: isAr ? '💛 شعور (Feeling)' : '💛 Feeling',
      desc: isAr ? 'استجابة وجدانية وجسدية صافية' : 'Biological emotion & sensation',
      icon: Heart,
      color: 'border-amber-400 bg-amber-50/70 hover:bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200'
    },
    fact: {
      title: isAr ? '📋 حقيقة (Fact)' : '📋 Fact',
      desc: isAr ? 'واقعة محايدة تسجلها الكاميرا' : 'Objective verifiable data',
      icon: FileText,
      color: 'border-emerald-400 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← الخريطة' : '← Map'}
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              {isAr ? 'حلبة الفرز السريع 🎮' : 'Thought vs Feeling vs Fact 🎮'}
            </span>
            <p className="text-[11px] text-stone-400">
              {currentStage === 1
                ? (isAr ? 'المرحلة ١: فرز هادئ بدون مؤقت' : 'Stage 1: Calm untimed sorting')
                : currentStage === 2
                ? (isAr ? 'المرحلة ٢: الأفكار المتنكرة بلباس المشاعر + مؤقت ١٢ ثانية!' : 'Stage 2: Disguised thoughts + 12s Blitz!')
                : (isAr ? 'المرحلة ٣: عبارات مركبة دقيقة + مؤقت خاطف ٨ ثوانٍ!' : 'Stage 3: Compound nuances + 8s Master Blitz!')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StageLevelSelector
            language={language}
            gameId={GAME_ID}
            currentStage={currentStage}
            progress={progress}
            onSelectStage={(s) => loadStage(s)}
            showCompletionModal={showCompletionModal}
            completedStageNumber={currentStage}
            starsEarned={earnedStars}
            movesMade={score}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={() => loadStage(currentStage)}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />

          <div className="flex items-center gap-1.5 bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700 font-mono tabular-nums text-xs text-yellow-400">
            <Zap className="w-3.5 h-3.5 fill-yellow-400" />
            <span>{score} PTS</span>
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
            <span className="font-mono tabular-nums">
              {isAr ? `البطاقة ${currentIndex + 1} من ${items.length}` : `Card ${currentIndex + 1} of ${items.length}`}
            </span>

            <div className="flex items-center gap-2">
              {streak >= 2 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>x2 ({streak})</span>
                </span>
              )}
              {blitzSeconds > 0 && !isAnswered && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono tabular-nums font-bold ${
                  timeLeft <= 3 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  <Timer className="w-3.5 h-3.5" />
                  <span>{timeLeft}s</span>
                </span>
              )}
            </div>
          </div>

          <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            />
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 sm:p-10 text-center shadow-md relative overflow-hidden">
            <p className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 leading-snug max-w-lg mx-auto font-serif py-2">
              {currentItem.statement}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['thought', 'feeling', 'fact'] as CardCategory[]).map((cat) => {
              const meta = categoryLabels[cat];
              const isSelected = selectedCategory === cat;
              const isCorrect = currentItem.correctCategory === cat;

              let style = meta.color;
              if (isAnswered) {
                if (isCorrect) {
                  style = 'border-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-400';
                } else if (isSelected && !isCorrect) {
                  style = 'border-rose-400 bg-rose-100 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 opacity-85';
                } else {
                  style = 'border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-400 opacity-45';
                }
              }

              return (
                <button
                  key={cat}
                  disabled={isAnswered}
                  onClick={() => handleCategoryChoice(cat)}
                  className={`min-h-20 p-5 rounded-2xl border-2 text-start transition-all cursor-pointer transform hover:-translate-y-0.5 shadow-xs ${style}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-extrabold">{meta.title}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-700" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                  </div>
                  <p className="text-xs opacity-85 leading-relaxed">{meta.desc}</p>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className={`p-5 rounded-2xl border text-xs animate-fade-in space-y-2 ${
              selectedCategory === currentItem.correctCategory
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedCategory === currentItem.correctCategory ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    <span>{isAr ? 'فرز متقن ودقيق! 🎯' : 'Spot on! 🎯'}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    <span>
                      {selectedCategory === null
                        ? (isAr ? `انتهى الوقت! التصنيف الصحيح: ${categoryLabels[currentItem.correctCategory].title}` : `Time up! Correct: ${categoryLabels[currentItem.correctCategory].title}`)
                        : (isAr ? `التصنيف الدقيق: ${categoryLabels[currentItem.correctCategory].title}` : `Actually: ${categoryLabels[currentItem.correctCategory].title}`)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {currentItem.explanation}
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="min-h-10 flex items-center gap-1.5 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
                >
                  <span>{currentIndex + 1 < items.length ? (isAr ? 'البطاقة التالية' : 'Next Card') : (isAr ? 'إنهاء المرحلة 🏆' : 'Finish Stage 🏆')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🏆
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {isAr ? `انتصار المرحلة ${currentStage}!` : `Stage ${currentStage} Victory!`}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono tabular-nums">
              {isAr ? `جمعتِ ${score} نقطة بدقة ${correctCount}/${items.length}` : `Score: ${score} PTS (${correctCount}/${items.length})`}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => loadStage(currentStage)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة المرحلة' : 'Replay'}</span>
            </button>
            {currentStage < 3 && (
              <button
                onClick={handleNextStage}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
              >
                {isAr ? `المرحلة التالية (${currentStage + 1}) 🚀` : `Next Stage (${currentStage + 1}) 🚀`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
