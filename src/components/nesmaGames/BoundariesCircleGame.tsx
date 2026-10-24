import React, { useState, useRef } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import {
  RotateCcw,
  Sparkles,
  Bookmark,
  Heart,
  Shield,
  Clock,
  Move
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface BoundariesCircleGameProps {
  language: Language;
  onBackToMap?: () => void;
  onAddXP?: (amount: number) => void;
}

type BoundaryZone = 'allow' | 'conditional' | 'outside';

interface BoundaryScenario {
  text: string;
  textEn: string;
  targetZone: BoundaryZone;
  reason: string;
  reasonEn: string;
}

const STAGE_BOUNDARIES: Record<number, BoundaryScenario[]> = {
  // Stage 1: Clear 2-Zone Boundaries (Allow vs Outside)
  1: [
    {
      text: 'طلب سلف أو خدمة فوق استطاعتك وتوقيت راحتك',
      textEn: 'Request for a heavy favor beyond your capacity',
      targetZone: 'outside',
      reason: 'حقك أن تعتذري بلطف: «ودي أساعد بس مش هقدر الفترة دي».',
      reasonEn: 'You have every right to decline kindly without guilt.'
    },
    {
      text: 'كلمة طيبة ودعم صادق من صديقة مخلصة',
      textEn: 'Warm, sincere encouragement from a trusted friend',
      targetZone: 'allow',
      reason: 'افتحي قلبك للدعم والمحبة النظيفة؛ هي غذاء الروح.',
      reasonEn: 'Welcome clean warmth and mutual support into your sanctuary.'
    },
    {
      text: 'نقد جارح وسخرية من مظهرك أو اختياراتك',
      textEn: 'Mockery or harsh criticism of your appearance',
      targetZone: 'outside',
      reason: 'هذا النقد يقف عند الباب؛ لا تسمحي له بالدخول لغرفتك الداخلية.',
      reasonEn: 'Disrespect stays outside the door of your self-worth.'
    },
    {
      text: 'عتاب رقيق وبنّاء من شخص يحبك ويريد استمرار الود',
      textEn: 'Gentle, respectful feedback aimed at mutual closeness',
      targetZone: 'allow',
      reason: 'العتاب المحب مساحة نقاش آمنة تقرب القلوب.',
      reasonEn: 'Loving, respectful dialogue deepens healthy connection.'
    },
    {
      text: 'ابتزاز عاطفي وتحميلك ذنب تعكر مزاج شخص آخر',
      textEn: 'Emotional guilt-tripping blaming you for their mood',
      targetZone: 'outside',
      reason: 'مشاعر الآخرين ومزاجهم مسؤوليتهم هم، وليست عبئاً عليكِ.',
      reasonEn: 'Emotional blackmail never belongs inside your inner peace.'
    }
  ],

  // Stage 2: Subtle Grey-Zone & People-Pleasing Traps (2 Zones)
  2: [
    {
      text: 'صديقة تفرّغ شكاواها السلبية ساعتين يومياً دون أن تسألك عن حالك',
      textEn: 'Friend venting non-stop for 2 hours daily without asking how you are',
      targetZone: 'outside',
      reason: 'التعاطف جميل، لكن التحول إلى سلة تفريغ يومية من طرف واحد يستنزف روحك.',
      reasonEn: 'Unilateral emotional dumping drains your sanctuary; step back kindly.'
    },
    {
      text: 'طلب نصيحة مهنية سريعة من زميلة تحترم وقتك وتشكر جهدك',
      textEn: 'Brief, respectful professional question from a grateful peer',
      targetZone: 'allow',
      reason: 'العطاء المتوازن مع من يحترم وقتك يثري الطرفين دون استنزاف.',
      reasonEn: 'Respectful, bounded reciprocity nourishes community.'
    },
    {
      text: 'تدخل قريب في تفاصيل قراراتك الشخصية بدعوى «أنا خايف لمصلحتك»',
      textEn: 'Intrusive prying disguised as “I only worry for your own good”',
      targetZone: 'outside',
      reason: 'النوايا الطيبة لا تبرر اختراق الخصوصية؛ اشكري اهتمامه واحتفظي بقرارك.',
      reasonEn: 'Good intentions do not grant permission to override your autonomy.'
    },
    {
      text: 'مشاركة لحظة ضعف حقيقية مع شخص أمين يحفظ سرك ولا يحكم عليكِ',
      textEn: 'Sharing honest vulnerability with someone safe and non-judgmental',
      targetZone: 'allow',
      reason: 'الأمان الحقيقي يبنى حين نسمح للأمناء بالاقتراب من إنسانيتنا.',
      reasonEn: 'Safe vulnerability with trustworthy people heals isolation.'
    },
    {
      text: 'إلحاح متكرر بعد أن قلتِ «لا» بوضوح («عشاني بس المرة دي!»)',
      textEn: 'Repeated pushing after you already said a clear No',
      targetZone: 'outside',
      reason: 'تغيير رأيك تحت الإلحاح يعلم الآخرين أن حدودك قابلة للكسر بالضغط.',
      reasonEn: 'Holding firm when pushed teaches others to respect your first No.'
    },
    {
      text: 'اقتراح لطيف لقضاء نزهة هادئة مع إعطائك كامل الحرية في القبول أو التأجيل',
      textEn: 'No-pressure invitation giving you full freedom to accept or reschedule',
      targetZone: 'allow',
      reason: 'العلاقات الصحية تمنحك مساحة الاختيار الحر دون ثقل.',
      reasonEn: 'Healthy invitations always leave room for your free choice.'
    }
  ],

  // Stage 3: 3-Zone Master Triage (Sanctuary Allow / Conditional Time-Bound / Firm Outside)
  3: [
    {
      text: 'أختك تحتاج مساعدة في مشروعها وأنتِ لديكِ ساعة واحدة متاحة فقط اليوم',
      textEn: 'Sister needs help while you only have 1 free hour today',
      targetZone: 'conditional',
      reason: 'الحل الناضج ليس الرفض التام ولا التضحية بيومك كله؛ بل «قبول مشروط بوقت محدد: معكِ من ٥ إلى ٦ مساءً».',
      reasonEn: 'Conditional boundary: “I can help for 45 minutes at 5 PM, then I need to rest.”'
    },
    {
      text: 'شخص يسخر من قيمك ومبادئك ثم يقول «أنتِ نكدية ومبتقبليش الهزار!»',
      textEn: 'Mocking your values then gaslighting you with “It’s just a joke!”',
      targetZone: 'outside',
      reason: 'التقليل من الكرامة تحت ستار المزاح يتطلب درعاً حازماً خارج الدائرة تماماً.',
      reasonEn: 'Disrespect disguised as humor stays strictly outside.'
    },
    {
      text: 'شريك أو صديق مقرب يعتذر بصدق ويغيّر سلوكه فعلياً بعد خلاف',
      textEn: 'Loved one offering genuine apology backed by changed behavior',
      targetZone: 'allow',
      reason: 'الاعتذار المقترن بتعديل السلوك يستحق فتح باب المودة والأمان.',
      reasonEn: 'Accountability paired with real behavioral repair earns trust.'
    },
    {
      text: 'اتصال عمل في المساء لموضوع يمكن حله في ١٠ دقائق صباح الغد',
      textEn: 'After-hours work call for something solvable tomorrow morning',
      targetZone: 'conditional',
      reason: 'بدل التجاهل الموتر أو العمل ليلاً: ضعيه في المنطقة المشروطة برسالة «سأراجعه ٩ صباح الغد بإذن الله».',
      reasonEn: 'Time-bound boundary: schedule it for 9 AM rather than sacrificing your evening.'
    },
    {
      text: 'زيارة عائلية دافئة لكن تطول أحياناً فتتعب طاقتك الاجتماعية',
      textEn: 'Warm family visit that tends to run too long for your energy',
      targetZone: 'conditional',
      reason: 'احضري بمحبة وحددي وقت المغادرة مسبقاً بلطف؛ هكذا تكرمين أهلك وتحمين طاقتك.',
      reasonEn: 'Attend warmly with a pre-set departure window to honor both love and rest.'
    },
    {
      text: 'شخص يفشي أسرارك الخاصة للآخرين رغم تنبيهك السابق له',
      textEn: 'Someone who repeatedly leaks your private confidences',
      targetZone: 'outside',
      reason: 'أسرارك أمانة؛ من لا يصونها يبقى في الدائرة الخارجية دون عداوة ولكن بحذر تام.',
      reasonEn: 'Repeatedly broken confidentiality requires firm external boundaries.'
    }
  ]
};

const GAME_ID = 'boundaries-circle';

export const BoundariesCircleGame: React.FC<BoundariesCircleGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const stageItems = STAGE_BOUNDARIES[currentStage] || STAGE_BOUNDARIES[1];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<BoundaryZone | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const currentItem = stageItems[currentIndex] || stageItems[0];
  const hasConditionalZone = currentStage === 3;

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setCurrentIndex(0);
    setUserChoice(null);
    setCorrectCount(0);
    setDragOffset({ x: 0, y: 0 });
    setCompleted(false);
    setShowCompletionModal(false);
    setIsSaved(false);
  };

  const handleDecide = (zone: BoundaryZone) => {
    if (userChoice !== null) return;
    setUserChoice(zone);
    setDragOffset({ x: 0, y: 0 });
    if (zone === currentItem.targetZone) {
      soundManager.playHarmonicAffirmation();
      setCorrectCount(c => c + 1);
    } else {
      soundManager.playSoftTap();
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
    setDragOffset({
      x: e.clientX - startPosRef.current.x,
      y: e.clientY - startPosRef.current.y
    });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.y < -60) {
      handleDecide('allow');
    } else if (hasConditionalZone && Math.abs(dragOffset.x) > 70 && Math.abs(dragOffset.y) <= 60) {
      handleDecide('conditional');
    } else if (dragOffset.y > 60 || (!hasConditionalZone && Math.abs(dragOffset.x) > 75)) {
      handleDecide('outside');
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
      const ratio = correctCount / stageItems.length;
      const stars = ratio >= 0.8 ? 3 : ratio >= 0.55 ? 2 : 1;
      setEarnedStars(stars);
      const res = completeStage(GAME_ID, currentStage, stars, correctCount, onAddXP);
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

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'boundaries-circle',
      gameTitle: isAr ? `حدودك حواليك (المرحلة ${currentStage})` : `Your Boundaries (Stage ${currentStage})`,
      quote: isAr ? 'وضع الحدود ليس أنانية ولا قسوة، بل صيانة لمساحتك الآمنة.' : 'Boundaries are safe doors with doorknobs on the inside.',
      reflection: userReflection || (isAr ? 'تدربت على فرز الحدود المرنة والحازمة بسلام.' : 'Practiced discerning firm and flexible boundaries.'),
      tag: isAr ? 'الحدود النفسية' : 'Boundaries'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
    if (onAddXP) onAddXP(15);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>{isAr ? 'حدودك حواليك (الدوائر المدارية) 🛡️' : 'Orbital Boundaries Shield 🛡️'}</span>
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {currentStage === 1
                ? (isAr ? 'المرحلة ١: التمييز الواضح بين المسموح والمرفوض' : 'Stage 1: Clear Inner vs Outer Boundaries')
                : currentStage === 2
                ? (isAr ? 'المرحلة ٢: كشف الابتزاز الخفي وإرضاء الآخرين' : 'Stage 2: Subtle Guilt-Trips & Grey Zones')
                : (isAr ? 'المرحلة ٣: الدوائر الثلاث (أمان داخلي / قبول مشروط بوقت / درع خارجي)' : 'Stage 3: 3-Zone Triage (Inner / Conditional / Shield)')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StageLevelSelector
            language={language}
            gameId={GAME_ID}
            currentStage={currentStage}
            progress={progress}
            onSelectStage={(s) => loadStage(s)}
            showCompletionModal={showCompletionModal}
            completedStageNumber={currentStage}
            starsEarned={earnedStars}
            movesMade={correctCount}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={() => loadStage(currentStage)}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />
          <button
            onClick={() => loadStage(currentStage)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span className="font-mono tabular-nums">
              {isAr ? `الموقف ${currentIndex + 1} من ${stageItems.length}` : `Scenario ${currentIndex + 1} of ${stageItems.length}`}
            </span>
            <span className="font-mono tabular-nums text-violet-700 dark:text-violet-400">
              {isAr ? `الدقة: ${correctCount}/${stageItems.length}` : `Score: ${correctCount}/${stageItems.length}`}
            </span>
          </div>

          {/* Concentric Sanctuary Visual */}
          <div className="relative py-2 flex items-center justify-center">
            <div className={`w-52 h-52 sm:w-60 sm:h-60 rounded-full border-2 flex items-center justify-center transition-all ${
              hasConditionalZone ? 'border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/20' : 'border-transparent'
            }`}>
              <div className={`w-40 h-40 sm:w-44 sm:h-44 rounded-full border-4 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center space-y-1.5 shadow-inner ${
                userChoice === 'allow'
                  ? 'border-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/50 scale-105'
                  : userChoice === 'conditional'
                  ? 'border-amber-400 bg-amber-100/70 dark:bg-amber-950/50 scale-105'
                  : userChoice === 'outside'
                  ? 'border-violet-400 bg-violet-100/60 dark:bg-violet-950/50'
                  : 'border-dashed border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20'
              }`}>
                <span className="text-3xl">
                  {userChoice === 'allow' ? '💚' : userChoice === 'conditional' ? '⏳' : userChoice === 'outside' ? '🛡️' : '🌿'}
                </span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-100">
                  {userChoice === 'allow'
                    ? (isAr ? 'قلب المساحة الآمنة' : 'Inner Sanctuary')
                    : userChoice === 'conditional'
                    ? (isAr ? 'الشرفة المشروطة بوقت' : 'Time-Bound Porch')
                    : userChoice === 'outside'
                    ? (isAr ? 'خارج الأسوار بلطف' : 'Kept Outside')
                    : (isAr ? 'مساحتك النفسية' : 'Your Sanctuary')}
                </span>
              </div>
            </div>
          </div>

          {/* Draggable Card */}
          <div className="relative flex items-center justify-center min-h-[104px]">
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease'
              }}
              className={`w-full max-w-lg p-5 rounded-3xl border-2 select-none touch-none cursor-grab active:cursor-grabbing ${
                isDragging
                  ? 'shadow-2xl ring-4 ring-violet-300 bg-white dark:bg-stone-800 border-violet-400'
                  : 'shadow-sm bg-stone-50 dark:bg-stone-800/70 border-stone-200 dark:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-stone-400 text-[10px] font-bold mb-1">
                <Move className="w-3 h-3" />
                <span>{isAr ? 'اسحبي البطاقة أو اختاري الدائرة المناسبة بالأسفل' : 'Drag card or tap a boundary zone below'}</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif leading-snug">
                «{isAr ? currentItem.text : currentItem.textEn}»
              </p>
            </div>
          </div>

          {/* Zone Choice Buttons */}
          <div className={`grid gap-3 max-w-xl mx-auto ${hasConditionalZone ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
            <button
              disabled={userChoice !== null}
              onClick={() => handleDecide('allow')}
              className={`min-h-14 p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                userChoice === 'allow'
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 font-bold'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 hover:border-emerald-400 text-stone-800 dark:text-stone-200'
              }`}
            >
              <Heart className="w-4 h-4 text-emerald-600" />
              <span className="text-xs sm:text-sm font-bold">{isAr ? 'دخول للقلب 🚪' : 'Inner Circle 🚪'}</span>
            </button>

            {hasConditionalZone && (
              <button
                disabled={userChoice !== null}
                onClick={() => handleDecide('conditional')}
                className={`min-h-14 p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  userChoice === 'conditional'
                    ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 font-bold'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 hover:border-amber-400 text-stone-800 dark:text-stone-200'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-xs sm:text-sm font-bold">{isAr ? 'قبول مشروط بوقت ⏳' : 'Time-Bound ⏳'}</span>
              </button>
            )}

            <button
              disabled={userChoice !== null}
              onClick={() => handleDecide('outside')}
              className={`min-h-14 p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                userChoice === 'outside'
                  ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/50 text-violet-950 dark:text-violet-100 font-bold'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 hover:border-violet-400 text-stone-800 dark:text-stone-200'
              }`}
            >
              <Shield className="w-4 h-4 text-violet-600" />
              <span className="text-xs sm:text-sm font-bold">{isAr ? 'درع خارجي حازم 🛡️' : 'Firm Outside 🛡️'}</span>
            </button>
          </div>

          {userChoice !== null && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-fade-in max-w-lg mx-auto text-start ${
              userChoice === currentItem.targetZone
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
            }`}>
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {userChoice === currentItem.targetZone
                    ? (isAr ? '✓ تقدير متزن ودقيق للحدود!' : '✓ Wise boundary placement!')
                    : (isAr ? '💡 تأملي البوصلة الأعمق لهذا الموقف:' : '💡 Deeper boundary insight:')}
                </span>
              </span>
              <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                {isAr ? currentItem.reason : currentItem.reasonEn}
              </p>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="min-h-10 px-5 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-violet-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {currentIndex + 1 < stageItems.length ? (isAr ? 'الموقف التالي' : 'Next') : (isAr ? 'إنهاء المرحلة ✨' : 'Finish Stage ✨')}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mx-auto text-3xl">
            🛡️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {isAr ? `اكتملت المرحلة ${currentStage} — حدودك محبة لنفسك 🌿` : `Stage ${currentStage} Complete — Healthy Sovereignty`}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«الحدود ليست جدراناً للقطيعة، بل أبواباً بمقابض داخلية أنتِ وحدك تملكين مفتاحها.»'
                : 'Boundaries are doors with knobs on the inside.'}
            </p>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'ما الحد اللطيف الذي تنوين تطبيقه هذا الأسبوع؟' : 'What gentle boundary will you honor this week?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي موقفاً تضعين فيه حداً...' : 'A boundary you choose to keep...'}
              className="w-full text-xs p-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-violet-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-700 hover:bg-violet-800 disabled:bg-violet-300 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => loadStage(currentStage)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة المرحلة' : 'Replay'}</span>
            </button>
            {currentStage < 3 && (
              <button
                onClick={handleNextStage}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black cursor-pointer"
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
