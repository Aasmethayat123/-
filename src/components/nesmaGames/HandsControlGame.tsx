import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import {
  RotateCcw,
  Sparkles,
  Bookmark,
  Hand,
  CloudRain,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Timer
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface HandsControlGameProps {
  language: Language;
  onBackToMap?: () => void;
  onAddXP?: (amount: number) => void;
}

interface ItemControl {
  text: string;
  textEn: string;
  inHands: boolean;
  note: string;
  noteEn: string;
}

const STAGE_ITEMS: Record<number, ItemControl[]> = {
  1: [
    {
      text: 'رأي الناس وكلامهم عني',
      textEn: 'Other people’s opinions about me',
      inHands: false,
      note: 'رأي الآخرين يخص عوالمهم وظروفهم، وليس بيدك التحكم فيه.',
      noteEn: 'Others’ opinions belong to their own lens, not your control.'
    },
    {
      text: 'المجهود اللي ببذله النهاردة',
      textEn: 'The honest effort I put in today',
      inHands: true,
      note: 'سعيك اليوم وساعات تركيزك هي مساحتك الحقيقية.',
      noteEn: 'Your daily focus and effort are genuinely within your hands.'
    },
    {
      text: 'صعوبة أسئلة الامتحان',
      textEn: 'How hard the exam questions turn out',
      inHands: false,
      note: 'محتوى ورقة الامتحان خارج إرادتك؛ بيدك فقط كيف تدير وقتك واستقرارك.',
      noteEn: 'Exam content is external; managing your preparation and calm is yours.'
    },
    {
      text: 'ساعات نومي واهتمامي بصحتي',
      textEn: 'My sleep routine and caring for my body',
      inHands: true,
      note: 'وضع هاتفك جانباً وإكرام جسدك بالراحة قرار تصنعه أنت.',
      noteEn: 'Setting your phone aside to rest your body is an active choice.'
    },
    {
      text: 'الزحمة وتأخر المواصلات',
      textEn: 'Traffic jams and transit delays',
      inHands: false,
      note: 'عوامل الطريق خارجة عن إرادتك؛ بيدك فقط كيف تتنفس وتنتظر بهدوء.',
      noteEn: 'Road delays are outside your hands; how you breathe while waiting is yours.'
    },
    {
      text: 'طريقة ردي لما أتعصب',
      textEn: 'How I choose to respond when angry',
      inHands: true,
      note: 'بين الغضب وردة الفعل مساحة حرة؛ قرار ردك بيدك أنت وحدك.',
      noteEn: 'Between trigger and response lies a space that belongs to you.'
    }
  ],
  2: [
    {
      text: 'توقعات أهلي المبالغة وتطلعاتهم',
      textEn: 'Unrealistic expectations from relatives',
      inHands: false,
      note: 'رغبات الآخرين تخصهم؛ ما بيدك هو المحاولة بصدق والبر بلطف.',
      noteEn: 'Others’ wishes belong to them; kindness without self-erasure is yours.'
    },
    {
      text: 'الحدود اللي بطلبها بلطف من غيري',
      textEn: 'Asking gently for clear personal boundaries',
      inHands: true,
      note: 'التعبير عن حدودك الشخصية حقك الكامل ومسؤوليتك الواعية.',
      noteEn: 'Voicing clear boundaries respectfully is fully in your hands.'
    },
    {
      text: 'مزاج شريكي أو صديقي المتقلب',
      textEn: 'A friend’s sudden mood swings',
      inHands: false,
      note: 'لست مسؤولاً عن تصليح مزاج الآخرين أو امتصاص توترهم.',
      noteEn: 'You are not responsible for regulating someone else’s mood.'
    },
    {
      text: 'اعتذاري الصادق لما أغلط',
      textEn: 'Offering a sincere apology when I err',
      inHands: true,
      note: 'الاعتراف بالخطأ وتصحيحه شجاعة حقيقية بيدك أنت وحدك.',
      noteEn: 'Owning a mistake and repairing it is courageous agency.'
    },
    {
      text: 'سخرية أو نقد جارح في تجمع عائلي',
      textEn: 'Snide remarks at a family gathering',
      inHands: false,
      note: 'سلوك القائل يعكس نقصه؛ بيدك فقط هل تأخذ الكلام لقلبك أم تتركه يمر.',
      noteEn: 'The speaker’s remark reflects them; letting it pass is your shield.'
    },
    {
      text: 'تحديد وقت لنفسي للاستراحة دون خجل',
      textEn: 'Carving out guilt-free rest time',
      inHands: true,
      note: 'حماية طاقتك من الاستنزاف واجب أصيل تجاه نفسك.',
      noteEn: 'Protecting your energy from burnout is your direct responsibility.'
    },
    {
      text: 'مقارنة الناس لنتائجي مع قريبي',
      textEn: 'People comparing my path to a cousin’s',
      inHands: false,
      note: 'المقارنات آفة شائعة؛ مسارك منفصل وفريد تماماً.',
      noteEn: 'External comparisons are noise; your timeline is uniquely yours.'
    },
    {
      text: 'الحديث الداخلي الرحيم مع نفسي',
      textEn: 'Speaking to myself with compassion',
      inHands: true,
      note: 'أن تكون صديقاً لنفسك بدل جلادها خيار يومي ملموس.',
      noteEn: 'Being an ally rather than a judge to yourself is a daily choice.'
    }
  ],
  3: [
    {
      text: 'الماضي والقرارات اللي فاتت خلاص',
      textEn: 'Past chapters and decisions already made',
      inHands: false,
      note: 'الماضي انتهى وخرج من حيز التأثير المباشر، ما بيدك هو الحاضر.',
      noteEn: 'The past is complete; only the present moment is actionable.'
    },
    {
      text: 'تقبلي لضعفي البشري وإنسانيتي',
      textEn: 'Accepting my human limits with grace',
      inHands: true,
      note: 'التسليم بالضعف هو بداية القوة الحقيقية والتواضع المطمئن.',
      noteEn: 'Embracing human imperfection is the root of grounded strength.'
    },
    {
      text: 'المرض أو التعب المفاجئ في غير وقته',
      textEn: 'Unexpected illness or sudden fatigue',
      inHands: false,
      note: 'ابتلاء الجسد قدر؛ بيدك فقط كيف ترعى نفسك وتطلب العلاج برضى.',
      noteEn: 'Sudden fatigue happens; tending to your recovery gently is yours.'
    },
    {
      text: 'خطوتي القادمة المصغرة في الحياة',
      textEn: 'My very next tiny step forward',
      inHands: true,
      note: 'مهما كانت العاصفة، الخطوة الواحدة التالية دائماً ممكنة.',
      noteEn: 'No matter the storm, the next micro-step remains yours to take.'
    },
    {
      text: 'رحيل بعض الأشخاص أو تغير مشاعرهم',
      textEn: 'People drifting away or changing feelings',
      inHands: false,
      note: 'قلوب الناس ومساراتهم ليست ملكك؛ التسليم يمنحك السلام.',
      noteEn: 'Others’ hearts are not yours to hold by force; release brings peace.'
    },
    {
      text: 'أن أطلب المساعدة لما أحتاجها بصدق',
      textEn: 'Asking for support when carrying too much',
      inHands: true,
      note: 'طلب العون ليس ضعفاً؛ بل شجاعة واعية تحفظك من الانهيار.',
      noteEn: 'Reaching out for help is wise strength, not weakness.'
    },
    {
      text: 'النتيجة النهائية للمشروع بعد إتقاني',
      textEn: 'Final outcomes after doing my best work',
      inHands: false,
      note: 'الأقدار بيد الله والظروف مركبة؛ بيدك شرف السعي والنية الطيبة.',
      noteEn: 'Outcomes depend on many variables; honest effort is your victory.'
    },
    {
      text: 'تنفسي العميق في هذه اللحظة بالذات',
      textEn: 'My deep steady breath right now',
      inHands: true,
      note: 'الشهيق والزفير الآن هو مرساتك الحية في الوجود.',
      noteEn: 'This inhale and exhale is your living anchor in the present.'
    }
  ]
};

const GAME_ID = 'hands-control';
const STAGE3_SECONDS = 8;

export const HandsControlGame: React.FC<HandsControlGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const stageItems = STAGE_ITEMS[currentStage] || STAGE_ITEMS[1];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [earnedXP, setEarnedXP] = useState<number>(40);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(STAGE3_SECONDS);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const currentItem = stageItems[currentIndex] || stageItems[0];

  useEffect(() => {
    if (currentStage !== 3 || completed || userChoice !== null) return;
    setTimeLeft(STAGE3_SECONDS);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          soundManager.playSoftTap();
          setUserChoice(!currentItem.inHands);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStage, currentIndex, completed, userChoice, currentItem.inHands]);

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setCurrentIndex(0);
    setUserChoice(null);
    setCorrectCount(0);
    setCompleted(false);
    setShowCompletionModal(false);
    setDragOffset({ x: 0, y: 0 });
    setTimeLeft(STAGE3_SECONDS);
  };

  const handleChoice = (choiceInHands: boolean) => {
    if (userChoice !== null) return;
    soundManager.playSoftTap();
    setUserChoice(choiceInHands);
    setDragOffset({ x: 0, y: 0 });

    if (choiceInHands === currentItem.inHands) {
      soundManager.playCorrect();
      setCorrectCount(prev => prev + 1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (userChoice !== null) return;
    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || userChoice !== null) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 75;
    if (dragOffset.x < -threshold) {
      handleChoice(isAr ? false : true);
    } else if (dragOffset.x > threshold) {
      handleChoice(isAr ? true : false);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < stageItems.length) {
      setCurrentIndex(prev => prev + 1);
      setUserChoice(null);
      setDragOffset({ x: 0, y: 0 });
    } else {
      setCompleted(true);
      const ratio = correctCount / stageItems.length;
      const stars = ratio >= 0.85 ? 3 : ratio >= 0.6 ? 2 : 1;
      setEarnedStars(stars);
      const result = completeStage(GAME_ID, currentStage, stars, correctCount, onAddXP);
      setEarnedXP(result.xpAwarded);
      setProgress(getGameLevelProgress(GAME_ID));
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

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'hands-control',
      gameTitle: isAr ? `في إيدي / برّا إيدي (المرحلة ${currentStage})` : `In My Hands / Outside (Stage ${currentStage})`,
      quote: isAr
        ? `أكملت المرحلة ${currentStage}؛ راحة البال تبدأ عندما نحصر طاقتنا فيما نملك تغييره ونترك الباقي بتسليم.`
        : `Completed Stage ${currentStage}; peace begins by channeling effort only into what we control.`,
      reflection: userReflection || (isAr ? 'فرزت مواقف اليوم وعرفت أين أضع طاقتي بسلام.' : 'Sorted my circle of control and set boundaries with peace.'),
      tag: isAr ? 'دائرة السيطرة' : 'Circle of Control'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
    if (onAddXP) onAddXP(20);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    loadStage(currentStage);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
                {isAr ? 'في إيدي / برّا إيدي 🤲' : 'In My Hands / Outside 🤲'}
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {isAr ? '٣ مراحل وعي متدرجة' : '3 Progressive Stages'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr
                ? 'دائرة السيطرة؛ فرز ما تملكه عما ليس بيدك لخفض القلق فوراً عبر ٣ مستويات متعمقة.'
                : 'Circle of control: distinguish what you can change vs what is outside your hands.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <StageLevelSelector
            language={language}
            gameId={GAME_ID}
            currentStage={currentStage}
            progress={progress}
            onSelectStage={(num) => loadStage(num)}
            showCompletionModal={showCompletionModal}
            completedStageNumber={currentStage}
            starsEarned={earnedStars}
            movesMade={correctCount}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={handleRestart}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />

          <button
            onClick={handleRestart}
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer ms-auto sm:ms-0"
            title={isAr ? 'إعادة هذه المرحلة' : 'Reset Stage'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!completed ? (
        <div className="relative rounded-3xl overflow-hidden border border-emerald-900/20 dark:border-stone-800 bg-gradient-to-b from-[#f0fdf4] via-[#ecfdf5] to-[#d1fae5] dark:from-[#06201a] dark:via-[#041713] dark:to-[#020d0b] p-6 sm:p-10 shadow-xl space-y-7">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-300">
            <span className="font-mono tabular-nums">
              {isAr ? `الموقف ${currentIndex + 1} من ${stageItems.length}` : `Card ${currentIndex + 1} of ${stageItems.length}`}
            </span>
            <div className="flex items-center gap-3">
              {currentStage === 3 && userChoice === null && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono tabular-nums text-xs border ${
                  timeLeft <= 3 ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse' : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  <Timer className="w-3.5 h-3.5" />
                  <span>{timeLeft}s</span>
                </span>
              )}
              <span className="text-emerald-700 dark:text-emerald-300 font-mono tabular-nums">
                {isAr ? `الدقة: ${correctCount}/${stageItems.length}` : `Accuracy: ${correctCount}/${stageItems.length}`}
              </span>
            </div>
          </div>

          {currentStage === 3 && userChoice === null && (
            <div className="w-full h-1.5 rounded-full bg-stone-200/80 dark:bg-stone-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${timeLeft <= 3 ? 'bg-rose-500' : 'bg-amber-500'}`}
                style={{ width: `${(timeLeft / STAGE3_SECONDS) * 100}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-center min-h-[180px] sm:min-h-[220px]">
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border-2 shadow-xl text-center space-y-4 transition-transform select-none cursor-grab active:cursor-grabbing ${
                dragOffset.x !== 0 ? 'transition-none' : 'duration-300'
              } ${
                userChoice !== null
                  ? userChoice === currentItem.inHands
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40'
                    : 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40'
                  : 'border-stone-200 dark:border-stone-700 hover:border-emerald-400'
              }`}
              style={{
                transform: `translate(${dragOffset.x}px, ${dragOffset.y * 0.5}px) rotate(${dragOffset.x * 0.05}deg)`
              }}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl">
                💭
              </div>

              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 font-serif leading-relaxed">
                {isAr ? currentItem.text : currentItem.textEn}
              </h2>

              {userChoice === null && (
                <p className="text-[11px] text-stone-400 font-medium">
                  {isAr ? 'اسحبي البطاقة لليمين (في إيدي) أو لليسار (برّا إيدي)' : 'Drag right (In Hands) or left (Outside)'}
                </p>
              )}

              {userChoice !== null && (
                <div className="p-3 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 animate-fade-in space-y-1">
                  <div className="font-bold flex items-center justify-center gap-1.5">
                    {userChoice === currentItem.inHands ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {isAr ? 'إدراك دقيق وصحيح! ✓' : 'Accurate insight! ✓'}
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <HelpCircle className="w-4 h-4" />
                        {isAr ? 'تأملي معي:' : 'Mindful perspective:'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300">
                    {isAr ? currentItem.note : currentItem.noteEn}
                  </p>
                </div>
              )}
            </div>
          </div>

          {userChoice === null ? (
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              <button
                onClick={() => handleChoice(true)}
                className="min-h-12 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Hand className="w-4 h-4" />
                <span>{isAr ? 'في إيدي (أملك تغييره)' : 'In My Hands'}</span>
              </button>

              <button
                onClick={() => handleChoice(false)}
                className="min-h-12 py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CloudRain className="w-4 h-4" />
                <span>{isAr ? 'برّا إيدي (خارج تحكمي)' : 'Outside My Hands'}</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center max-w-lg mx-auto">
              <button
                onClick={handleNext}
                className="w-full min-h-12 py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-sm shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {currentIndex + 1 < stageItems.length
                    ? (isAr ? 'الموقف التالي ⏩' : 'Next Situation ⏩')
                    : (isAr ? 'إنهاء المرحلة واكتمال الفرز 🎉' : 'Finish Stage 🎉')}
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border-2 border-emerald-400 text-center space-y-4 animate-scale-up">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
              {isAr ? `اكتملت المرحلة ${currentStage} بنجاح ووضوح تام!` : `Stage ${currentStage} Completed!`}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
              {isAr
                ? '«راحة البال ليست في السيطرة على كل شيء؛ بل في التوقف عن محاولة التحكم فيما ليس بيدك.»'
                : '“Peace of mind is not about controlling everything; it is letting go of what never was yours.”'}
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2 pt-2 text-start">
            <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'تسجيل خاطرة في دفترك عن هذه المرحلة:' : 'Note for your journal:'}
            </label>
            <input
              type="text"
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'مثلاً: قررت اليوم أن أترك آراء الآخرين وأركز على سعيه فقط...' : 'e.g., Today I release what I cannot change...'}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={handleSaveMoment}
              disabled={isSaved}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isSaved ? 'bg-emerald-600 text-white' : 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-emerald-600'
              }`}
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? (isAr ? 'تم الحفظ في دفتري 🌿' : 'Saved 🌿') : (isAr ? 'حفظ في دفتري' : 'Save Moment')}</span>
            </button>

            {currentStage < 3 && (
              <button
                onClick={handleNextStage}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
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
