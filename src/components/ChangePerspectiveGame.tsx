import React, { useState } from 'react';
import { Language } from '../types';
import { PERSPECTIVE_CHALLENGES } from '../data/challenges';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import {
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Scale
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../utils/gameLevelsManager';
import { StageLevelSelector } from './common/StageLevelSelector';

interface ChangePerspectiveGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface PerspectiveGem {
  text: string;
  helpfulScore: number; // In Stages 2 & 3, player combines 2 gems to hit target >= 8! Traps have negative/low scores.
  feedback: string;
}

interface PerspectivePuzzle {
  situation: string;
  automaticThought: string;
  distortionType: string;
  targetWeight: number;
  requiredSelections: number;
  alternativePerspectives: PerspectiveGem[];
}

const MULTI_GEM_STAGES: Record<2 | 3, Record<Language, PerspectivePuzzle[]>> = {
  // Stage 2: Combine 2 Complementary Evidence Gems to reach >= 8 pts (avoiding Toxic Positivity traps!)
  2: {
    ar: [
      {
        situation: 'قدّمتِ عرضاً لمشروعك، فأشاد المدير بفقرتين وطلب تعديل الفقرة الثالثة بالكامل.',
        automaticThought: '«التعديل يعني أن مشروعي سيئ وفشلت في إقناعهم!»',
        distortionType: 'الفلترة الانتقائية وتجاهل الإيجابي',
        targetWeight: 8,
        requiredSelections: 2,
        alternativePerspectives: [
          {
            text: 'الإشادة بفقرتين دليل واقعي على قوة الأساس الذي بنيته (+5)',
            helpfulScore: 5,
            feedback: 'دليل موضوعي يكسر التعميم السلبي.'
          },
          {
            text: 'طلب التعديل جزء طبيعي من تطوير أي عمل احترافي لا إدانة لشخصي (+4)',
            helpfulScore: 4,
            feedback: 'فصل ناضج بين تطوير المخرجات وقيمة الذات.'
          },
          {
            text: 'أكيد المدير يغار من ذكائي ومشروعي كامل ١٠٠٪ بلا أي نقص! (-2)',
            helpfulScore: -2,
            feedback: 'فخ الإيجابية الزائفة والإنكار! يمنعك من الاستفادة من الملاحظات.'
          },
          {
            text: 'ربما جاملني في الفقرتين فقط لكي لا يحرجني (-1)',
            helpfulScore: -1,
            feedback: 'فخ قراءة الأفكار وتبخيس النجاح.'
          }
        ]
      },
      {
        situation: 'بدأتِ عادة صحية جديدة والتزمتِ بها ١٠ أيام، ثم انقطعتِ يومين بسبب ضغط طارئ.',
        automaticThought: '«ضاع كل شيء! أنا لا ألتزم بأي خطة أبداً.»',
        distortionType: 'التفكير الأبيض والأسود (الكل أو لا شيء)',
        targetWeight: 8,
        requiredSelections: 2,
        alternativePerspectives: [
          {
            text: '١٠ أيام التزام من أصل ١٢ تعني نسبة نجاح تفوق ٨٣٪ على أرض الواقع (+5)',
            helpfulScore: 5,
            feedback: 'الحقائق الرقمية تبطل وهم «ضاع كل شيء».'
          },
          {
            text: 'التوقف المؤقت محطة استراحة وليس عودة لنقطة الصفر (+4)',
            helpfulScore: 4,
            feedback: 'المرونة هي سر الاستمرارية الطويلة.'
          },
          {
            text: 'سأعاقب نفسي غداً بمضاعفة التمرين ثلاث مرات لتعويض اليومين (-2)',
            helpfulScore: -2,
            feedback: 'فخ القسوة التعويضية! يؤدي للإرهاق والانقطاع مجدداً.'
          },
          {
            text: 'الأفضل ألا أضع أي أهداف في حياتي حتى لا أحبط (-1)',
            helpfulScore: -1,
            feedback: 'فخ التجنب والاستسلام.'
          }
        ]
      }
    ],
    en: [
      {
        situation: 'Your manager praised two sections of your proposal and asked to revise the third.',
        automaticThought: '“Asking for revisions means my whole proposal failed!”',
        distortionType: 'Mental Filter & Discounting the Positive',
        targetWeight: 8,
        requiredSelections: 2,
        alternativePerspectives: [
          { text: 'Praise on two sections is concrete evidence of a solid foundation (+5)', helpfulScore: 5, feedback: 'Grounds the scale in real evidence.' },
          { text: 'Revisions refine the work product, not my personal worth (+4)', helpfulScore: 4, feedback: 'Healthy separation of feedback and identity.' },
          { text: 'My draft is already 100% flawless and needs zero edits! (-2)', helpfulScore: -2, feedback: 'Denial trap! Blocks growth.' },
          { text: 'They only praised the first two parts out of pity (-1)', helpfulScore: -1, feedback: 'Discounting the positive.' }
        ]
      },
      {
        situation: 'You kept a healthy habit for 10 days, then missed 2 days during an emergency.',
        automaticThought: '“Everything is ruined! I never stick to anything.”',
        distortionType: 'All-or-Nothing Thinking',
        targetWeight: 8,
        requiredSelections: 2,
        alternativePerspectives: [
          { text: '10 out of 12 days is over 83% real-world consistency (+5)', helpfulScore: 5, feedback: 'Objective math dissolves all-or-nothing bias.' },
          { text: 'A brief pause is a pit stop, not erasing prior progress (+4)', helpfulScore: 4, feedback: 'Self-compassion sustains long-term habits.' },
          { text: 'I must punish myself with triple effort tomorrow (-2)', helpfulScore: -2, feedback: 'Harsh overcompensation leads to burnout.' },
          { text: 'I should stop setting goals altogether (-1)', helpfulScore: -1, feedback: 'Avoidance trap.' }
        ]
      }
    ]
  },

  // Stage 3: Master 3-Gem Synthesis against Deep Core Distortions (Target >= 12 pts)
  3: {
    ar: [
      {
        situation: 'اعتذرتِ عن تلبية طلب إضافي لزميلة في وقت راحتك، فبدت ملامحها مقتضبة لبقية اليوم.',
        automaticThought: '«أنا إنسانة أنانية وقاسية؛ كان يجب أن أضغط على نفسي ولا أزعلها.»',
        distortionType: 'الشخصنة المفرطة وعقدة المنقذ',
        targetWeight: 12,
        requiredSelections: 3,
        alternativePerspectives: [
          {
            text: 'حقي في الراحة مشروع، والاعتذار المهذب ليس اعتداءً على أحد (+4)',
            helpfulScore: 4,
            feedback: 'تأصيل الحق الشخصي بلا عدوانية.'
          },
          {
            text: 'ضيقها المؤقت من عدم توفر الخدمة طبيعي، وهي قادرة على تدبر أمرها كشخص ناضج (+4)',
            helpfulScore: 4,
            feedback: 'احترام قدرة الآخرين على تحمل الإحباط البسيط.'
          },
          {
            text: 'لو وافقتُ وأنا مستنزفة لحملتُ ضغينة خفية أفسدت الود الحقيقي بيننا (+5)',
            helpfulScore: 5,
            feedback: 'بصيرة عميقة: الحدود تحمي العلاقة من المرارة المكتومة.'
          },
          {
            text: 'مشاعر الآخرين لا تعنيني إطلاقاً وليغضب من يغضب! (-3)',
            helpfulScore: -3,
            feedback: 'فخ القسوة الدفاعية المعاكسة!'
          },
          {
            text: 'سأرسل لها اعتذاراً طويلاً وأنجز عملها الليلة من بيتي (-2)',
            helpfulScore: -2,
            feedback: 'فخ التراجع تحت وطأة الذنب الزائف.'
          }
        ]
      }
    ],
    en: [
      {
        situation: 'You politely declined an extra task during your break, and your colleague lookedbriefly displeased.',
        automaticThought: '“I am selfish; I should have sacrificed my break so she wouldn’t feel upset.”',
        distortionType: 'Over-Responsibility & People-Pleasing',
        targetWeight: 12,
        requiredSelections: 3,
        alternativePerspectives: [
          { text: 'Polite boundaries honor my capacity without harming anyone (+4)', helpfulScore: 4, feedback: 'Healthy self-respect.' },
          { text: 'Her brief disappointment is hers to process as a capable adult (+4)', helpfulScore: 4, feedback: 'Allows others emotional autonomy.' },
          { text: 'Saying yes while exhausted breeds silent resentment that harms trust (+5)', helpfulScore: 5, feedback: 'Deep insight: boundaries protect genuine warmth.' },
          { text: 'Nobody’s feelings matter at all, I don’t care! (-3)', helpfulScore: -3, feedback: 'Defensive callousness trap.' },
          { text: 'I’ll apologize profusely and do her work tonight (-2)', helpfulScore: -2, feedback: 'Guilt-driven collapse of boundaries.' }
        ]
      }
    ]
  }
};

const GAME_ID = 'challenge-perspective';

export const ChangePerspectiveGame: React.FC<ChangePerspectiveGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const stage1Puzzles: PerspectivePuzzle[] = PERSPECTIVE_CHALLENGES[language].map(ch => ({
    situation: ch.situation,
    automaticThought: ch.automaticThought,
    distortionType: ch.distortionType,
    targetWeight: 4,
    requiredSelections: 1,
    alternativePerspectives: ch.alternativePerspectives
  }));

  const challenges: PerspectivePuzzle[] = currentStage === 1
    ? stage1Puzzles
    : MULTI_GEM_STAGES[currentStage as 2 | 3][language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  const currentChallenge = challenges[currentIndex] || challenges[0];

  const currentWeight = selectedIndices.reduce(
    (sum, idx) => sum + (currentChallenge.alternativePerspectives[idx]?.helpfulScore || 0),
    0
  );
  const scaleBalanced = currentWeight >= currentChallenge.targetWeight && selectedIndices.length === currentChallenge.requiredSelections;

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setCurrentIndex(0);
    setSelectedIndices([]);
    setMistakes(0);
    setCompleted(false);
    setShowCompletionModal(false);
  };

  const handleToggleAlternative = (idx: number) => {
    const gem = currentChallenge.alternativePerspectives[idx];
    if (currentChallenge.requiredSelections === 1) {
      setSelectedIndices([idx]);
      if (gem.helpfulScore >= currentChallenge.targetWeight) {
        soundManager.playHarmonicAffirmation();
        triggerConfetti(0.5, 0.4);
      } else {
        setMistakes(m => m + 1);
        soundManager.playScaleTilt();
      }
      return;
    }

    if (selectedIndices.includes(idx)) {
      soundManager.playSoftTap();
      setSelectedIndices(selectedIndices.filter(i => i !== idx));
      return;
    }

    if (selectedIndices.length >= currentChallenge.requiredSelections) {
      soundManager.playSoftTap();
      return;
    }

    const next = [...selectedIndices, idx];
    setSelectedIndices(next);
    if (gem.helpfulScore <= 0) {
      setMistakes(m => m + 1);
      soundManager.playIncorrect();
    } else {
      soundManager.playScaleTilt();
      const nextWeight = next.reduce((s, i) => s + currentChallenge.alternativePerspectives[i].helpfulScore, 0);
      if (nextWeight >= currentChallenge.targetWeight && next.length === currentChallenge.requiredSelections) {
        soundManager.playHarmonicAffirmation();
        triggerConfetti(0.5, 0.4);
      }
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedIndices([]);
    } else {
      const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
      setEarnedStars(stars);
      const res = completeStage(GAME_ID, currentStage, stars, mistakes, onAddXP);
      setEarnedXP(res.xpAwarded);
      setProgress(getGameLevelProgress(GAME_ID));
      setCompleted(true);
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

  const progressRatio = Math.max(0, Math.min(100, Math.round((currentWeight / currentChallenge.targetWeight) * 100)));

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
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>{isAr ? 'حلبة: ميزان الأفكار ⚖️' : 'Arena: Perspective Scale ⚖️'}</span>
            </span>
            <p className="text-[11px] text-stone-400">
              {currentStage === 1
                ? (isAr ? 'المرحلة ١: اختيار جوهرة برهان واحدة لموازنة الكفة' : 'Stage 1: Pick 1 counterweight evidence gem')
                : currentStage === 2
                ? (isAr ? 'المرحلة ٢: دمج جوهرتين متكاملتين (+8) وتجنب الإيجابية الزائفة!' : 'Stage 2: Combine 2 evidence gems (>=8 pts) & avoid traps!')
                : (isAr ? 'المرحلة ٣: توليف ٣ براهين عميقة (+12) لتفكيك القناعات الجذرية' : 'Stage 3: Synthesize 3 core evidence gems (>=12 pts)')}
            </p>
          </div>
        </div>

        <StageLevelSelector
          language={language}
          gameId={GAME_ID}
          currentStage={currentStage}
          progress={progress}
          onSelectStage={(s) => loadStage(s)}
          showCompletionModal={showCompletionModal}
          completedStageNumber={currentStage}
          starsEarned={earnedStars}
          movesMade={mistakes}
          xpEarned={earnedXP}
          onNextStage={handleNextStage}
          onReplayStage={() => loadStage(currentStage)}
          onCloseCompletionModal={() => setShowCompletionModal(false)}
        />
      </div>

      {!completed ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
            <span className="font-mono tabular-nums">
              {isAr ? `اللغز ${currentIndex + 1} من ${challenges.length}` : `Puzzle ${currentIndex + 1} of ${challenges.length}`}
            </span>
            <span className="font-mono tabular-nums text-sky-700 dark:text-sky-400 font-bold">
              {isAr
                ? `وزن البرهان: ${currentWeight} / ${currentChallenge.targetWeight} (${selectedIndices.length}/${currentChallenge.requiredSelections} جواهر)`
                : `Weight: ${currentWeight}/${currentChallenge.targetWeight} (${selectedIndices.length}/${currentChallenge.requiredSelections} gems)`}
            </span>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                {isAr ? 'الموقف الواقعي' : 'The Situation'}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-md ${
                scaleBalanced ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {scaleBalanced ? (isAr ? 'الكفتان متوازنتان! ⚖️' : 'Balanced! ⚖️') : (isAr ? 'الكفة مائلة للتشاؤم ⚠️' : 'Tilted Negative ⚠️')}
              </span>
            </div>

            <p className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">
              «{currentChallenge.situation}»
            </p>

            <div className="py-2">
              <div className="relative h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    scaleBalanced ? 'bg-emerald-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${Math.max(12, progressRatio)}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-1 text-xs">
              <span className="font-bold text-rose-900 dark:text-rose-200 block">
                {isAr ? 'الفكرة التلقائية الثقيلة:' : 'Heavy Automatic Thought:'}
              </span>
              <p className="text-sm font-semibold text-rose-950 dark:text-rose-100 italic">
                «{currentChallenge.automaticThought}»
              </p>
              <span className="text-rose-700 dark:text-rose-400 block text-[11px] pt-1">
                {isAr ? 'التشوه المعرفي: ' : 'Distortion: '}{currentChallenge.distortionType}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block px-1">
              {currentChallenge.requiredSelections === 1
                ? (isAr ? 'اختاري حجر التفسير الواقعي لموازنة الكفة:' : 'Pick 1 balanced perspective stone:')
                : (isAr
                    ? `اختاري ${currentChallenge.requiredSelections} من جواهر البراهين المتزنة (انقري لإلغاء الاختيار إذا وقعتِ في فخ):`
                    : `Select ${currentChallenge.requiredSelections} grounded gems (tap again to unselect traps):`)}
            </span>

            {currentChallenge.alternativePerspectives.map((alt, idx) => {
              const isSelected = selectedIndices.includes(idx);
              const isHelpful = alt.helpfulScore >= 4;

              return (
                <button
                  key={idx}
                  onClick={() => handleToggleAlternative(idx)}
                  className={`w-full text-start p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? isHelpful
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-400'
                        : 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 font-bold'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 text-stone-900 dark:text-stone-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-serif leading-relaxed">{alt.text}</p>
                    {isSelected && (
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isHelpful ? 'text-emerald-600' : 'text-rose-600'}`} />
                    )}
                  </div>

                  {isSelected && (
                    <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-stone-700 text-xs font-normal">
                      <p className="text-stone-700 dark:text-stone-300">{alt.feedback}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              disabled={!scaleBalanced}
              onClick={handleNext}
              className={`min-h-11 flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                scaleBalanced
                  ? 'bg-stone-900 hover:bg-stone-800 dark:bg-sky-600 text-white cursor-pointer'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{currentIndex + 1 < challenges.length ? (isAr ? 'اللغز التالي' : 'Next Puzzle') : (isAr ? 'إتمام المرحلة ✨' : 'Finish Stage ✨')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto text-4xl">
            ⚖️
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {isAr ? `اكتملت موازنة المرحلة ${currentStage} بنجاح!` : `Stage ${currentStage} Scales Balanced!`}
          </h2>
          <div className="flex justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => loadStage(currentStage)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة المرحلة' : 'Replay'}</span>
            </button>
            {currentStage < 3 && (
              <button
                onClick={handleNextStage}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black cursor-pointer"
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
