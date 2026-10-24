import React, { useState } from 'react';
import { Language } from '../types';
import { FEELING_CHALLENGES } from '../data/challenges';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import {
  CheckCircle2,
  RotateCcw,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../utils/gameLevelsManager';
import { StageLevelSelector } from './common/StageLevelSelector';

interface NameTheFeelingGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface FeelingCase {
  character: string;
  situation: string;
  clues: string[];
  options: {
    name: string;
    description: string;
    feedback: string;
    isPrimary: boolean;
  }[];
  deeperTakeaway: string;
}

const ADVANCED_FEELING_STAGES: Record<2 | 3, Record<Language, FeelingCase[]>> = {
  // Stage 2: Limited Detective Scan Budget + 4 nuanced social masks
  2: {
    ar: [
      {
        character: 'ليلى (في اجتماع العائلة)',
        situation: 'عندما أعلن ابن خالتها خطوبته، أطلقت ليلى نكتة ساخرة سريعة ثم انشغلت بهاتفها طوال العشاء رافضة تذوق الحلوى.',
        clues: [
          'غصة مفاجئة في الحلق عند سماع الخبر',
          'ابتسامة مشدودة لم تصل لعينيها',
          'تنهد خافت في طريق العودة للبيت'
        ],
        options: [
          { name: 'الغيرة العدائية والحقد', description: 'تتمنى زوال النعمة عن قريبها.', feedback: 'السخرية كانت درعاً دفاعياً سريعاً وليست حقداً حقيقياً.', isPrimary: false },
          { name: 'اللامبالاة والملل', description: 'لا تهتم بالمناسبات العائلية أصلاً.', feedback: 'الانشغال المحموم بالهاتف هروب من ألم داخلي وليس مللاً.', isPrimary: false },
          { name: 'الشوق الدفين والخشية من فوات القطار', description: 'حنين صادق للأنس والارتباط ممزوج بوخزة وحدة مفاجئة.', feedback: 'دقيق جداً! السخرية غطّت حنيناً رقيقاً وخشية من الوحدة.', isPrimary: true },
          { name: 'الغضب من ضوضاء التجمع', description: 'انزعاج سطحي من الصوت العالي.', feedback: 'التغير بدأ لحظة الخبر تحديداً لا بسبب الضوضاء.', isPrimary: false }
        ],
        deeperTakeaway: 'كثيراً ما يرتدي الحنين المؤلم قناع السخرية اللاذعة حتى لا يرى الآخرون هشاشتنا.'
      },
      {
        character: 'كريم (بعد ترقية زميله)',
        situation: 'هنّأ كريم زميله بحماس مبالغ فيه، ثم عاد لمكتبه وبدأ ينتقد خطأً إملائياً صغيراً في تقرير المتدرب الجديد بحدة غير معتادة.',
        clues: [
          'انقباض الكتفين وتصلب الرقبة',
          'شعور بالانكماش في الصدر بعد إعلان الترقية',
          'مراجعة ملف إنجازاته سراً ثلاث مرات'
        ],
        options: [
          { name: 'القسوة الإدارية وحب السيطرة', description: 'يستمتع بتوبيخ الأصغر منه.', feedback: 'هذه إزاحة انفعالية مؤقتة وليست طبعه الأصلي.', isPrimary: false },
          { name: 'الشعور بعدم الكفاية وخذلان التقدير', description: 'ألم خفي بأنه غير مرئي رغم تعبه الطويل.', feedback: 'أصبتِ جوهر الشعور! الشعور بالتهميش تحوّل لحدة عابرة.', isPrimary: true },
          { name: 'الحرص المهني المفرط على الجودة', description: 'اهتمام طبيعي بالتدقيق اللغوي.', feedback: 'حدة النبرة تكشف جرحاً عاطفياً أعمق من مجرد خطأ إملائي.', isPrimary: false },
          { name: 'الإرهاق الجسدي العادي', description: 'نقص في النوم والقهوة فقط.', feedback: 'المحفز كان إعلان الترقية مباشرة.', isPrimary: false }
        ],
        deeperTakeaway: 'حين يتألم شعورنا بالقيمة ونكتمه، يتسرب على هيئة عصبية في تفاصيل صغيرة لا علاقة لها بالجرح الأصلي.'
      }
    ],
    en: [
      {
        character: 'Layla (Family Dinner)',
        situation: 'When her cousin announced his engagement, Layla cracked a sharp sarcastic joke and stared at her phone all evening.',
        clues: ['Sudden lump in her throat', 'Tight smile not reaching her eyes', 'Quiet sigh on the ride home'],
        options: [
          { name: 'Malicious Spite', description: 'Wishing harm on her cousin.', feedback: 'Sarcasm was a shield, not malice.', isPrimary: false },
          { name: 'Boredom & Apathy', description: 'Simply uninterested in family events.', feedback: 'Phone scrolling was an escape from tenderness.', isPrimary: false },
          { name: 'Tender Longing & Fear of Being Left Behind', description: 'A quiet ache for companionship masked by humor.', feedback: 'Spot on! Humor shielded vulnerable longing.', isPrimary: true },
          { name: 'Sensory Annoyance', description: 'Bothered by room noise.', feedback: 'The shift happened right at the announcement.', isPrimary: false }
        ],
        deeperTakeaway: 'Unspoken longing often puts on the armor of irony so no one sees our tender heart.'
      },
      {
        character: 'Karim (At the Office)',
        situation: 'After a peer got promoted, Karim congratulated him loudly, then snapped over a tiny typo in an intern’s draft.',
        clues: ['Rigid shoulders', 'Sinking chest sensation', 'Secretly re-reading his own performance sheet'],
        options: [
          { name: 'Bossy Cruelty', description: 'Enjoying power over juniors.', feedback: 'This was displaced hurt, not his true nature.', isPrimary: false },
          { name: 'Feeling Unseen & Inadequate', description: 'Hurt that his quiet hard work went unrecognized.', feedback: 'Exact match! Unacknowledged hurt leaked out as irritability.', isPrimary: true },
          { name: 'High Quality Standards', description: 'Purely editorial rigor.', feedback: 'The disproportionate tone signals emotional pain.', isPrimary: false },
          { name: 'Simple Caffeine Crash', description: 'Just afternoon tiredness.', feedback: 'Triggered directly by the promotion news.', isPrimary: false }
        ],
        deeperTakeaway: 'Suppressed feelings of invisibility often leak out as sharpness toward unrelated minor flaws.'
      }
    ]
  },

  // Stage 3: Master Dual-Mask Cases (Max 1 scan for 3 stars!)
  3: {
    ar: [
      {
        character: 'نور (مع صديقتها المقربة)',
        situation: 'طلبت صديقتها تأجيل لقائهما للمرة الثانية، فردت نور فوراً: «عادي جداً ولا يهمك، أصلاً كنت محتاجة أقعد لوحدي!» ثم حذفت مسودة رسالة طويلة كانت تكتبها لها.',
        clues: [
          'برودة في الأطراف وشعور بالانكماش الداخلي',
          'مسح دمعة سريعة قبل إغلاق الهاتف',
          'خشية قديمة من أن تكون ثقيلة على من تحب'
        ],
        options: [
          { name: 'الراحة الحقيقية للاستقلالية', description: 'سعيدة فعلاً بإلغاء الموعد.', feedback: 'مسودة الرسالة المحذوفة تكشف عكس هذا الادعاء.', isPrimary: false },
          { name: 'الغضب الانتقامي والقطيعة', description: 'تخطط لمعاقبة صديقتها بالتجاهل.', feedback: 'نور لم تنتقم بل انكمشت لحماية نفسها.', isPrimary: false },
          { name: 'جرح الهجر والخوف من أن تكون عبئاً غير مرغوب', description: 'انسحاب استباقي خلف قناع الاكتفاء الكاذب لحماية كرامتها من الرفض.', feedback: 'قراءة نفسية عبقرية! الاكتفاء المبالغ فيه هنا درع يحمي خوفاً رقيقاً من الرفض.', isPrimary: true },
          { name: 'التشتت والنسيان', description: 'نسيت سبب اللقاء أصلاً.', feedback: 'استجابتها كانت فورية ومشحونة عاطفياً.', isPrimary: false }
        ],
        deeperTakeaway: 'التظاهر المفرط بعدم الاحتياج («عادي مش فارق معايا») غالباً ما يخبئ قلباً يخشى أن يطلب الدفء فيُردّ خائباً.'
      },
      {
        character: 'يوسف (أمام والده)',
        situation: 'حين سأله والده عن نتائج مشروعه المتعثر، رفع يوسف صوته مدافعاً بعناد: «السوق كله واقع ومحدش بيفهم في المجال ده غيري!» ثم أغلق باب غرفته وجلس صامتاً في الظلام.',
        clues: [
          'ارتجافة خفيفة في الصوت أثناء العلو',
          'ثقل جاثم فوق الصدر عند نظرة والده',
          'جلوس طويل في العتمة بلا حراك'
        ],
        options: [
          { name: 'الغرور والتكبر المهني', description: 'يرى نفسه فوق الجميع فعلاً.', feedback: 'الغرور الصاخب هنا قناع هش يغطي انكساراً داخلياً.', isPrimary: false },
          { name: 'الخزي العميق والخوف من خذلان نظرة الأب', description: 'ألم حاد من الشعور بالفشل أمام أكثر شخص يتمنى فخره.', feedback: 'تشخيص عميق ودقيق! العناد العالي كان درعاً يحجب وجع الخزي وطلب القبول.', isPrimary: true },
          { name: 'التمرد على السلطة الأسرية', description: 'يرفض تدخل والده من حيث المبدأ.', feedback: 'جلوسه في العتمة يظهر حزناً وخزياً لا نشوة تمرد.', isPrimary: false },
          { name: 'الغضب الموضوعي من حالة الاقتصاد', description: 'تحليل اقتصادي بحت.', feedback: 'الانفعال موجه لنظرة التقييم لا للأرقام.', isPrimary: false }
        ],
        deeperTakeaway: 'تحت قناع المكابرة والعناد الصاخب، يختبئ أحياناً طفل يخشى أن يفقد مكانته في عيون من يحبهم.'
      }
    ],
    en: [
      {
        character: 'Nour (Close Friendship)',
        situation: 'Her best friend rescheduled twice. Nour texted “Totally fine! I wanted to be alone anyway!” then deleted a long heartfelt draft.',
        clues: ['Cold hands & inward shrinking', 'Wiping a quick tear', 'Old fear of being a burden'],
        options: [
          { name: 'Genuine Relief for Solitude', description: 'Happy to cancel.', feedback: 'The deleted draft shows deep unspoken hurt.', isPrimary: false },
          { name: 'Vengeful Rage', description: 'Plotting payback.', feedback: 'She withdrew inward rather than attacking.', isPrimary: false },
          { name: 'Fear of Rejection & Being a Burden', description: 'Pre-emptive withdrawal behind pseudo-independence.', feedback: 'Masterful insight! Hyper-independence shielded tender vulnerability.', isPrimary: true },
          { name: 'Simple Distraction', description: 'Forgot about the meetup.', feedback: 'Her reaction was emotionally charged.', isPrimary: false }
        ],
        deeperTakeaway: 'Saying “I don’t care anyway” is often armor worn by a heart afraid to admit “I missed you.”'
      },
      {
        character: 'Youssef (With His Father)',
        situation: 'Asked about his struggling venture, Youssef raised his voice: “The whole market is broken, nobody gets my vision!” then sat silently in his dark room.',
        clues: ['Slight voice tremor', 'Heavy chest under his father’s gaze', 'Sitting motionless in the dark'],
        options: [
          { name: 'Arrogant Grandiosity', description: 'Believing he is superior.', feedback: 'Bluster here masks fragile pain.', isPrimary: false },
          { name: 'Deep Shame & Fear of Disappointing His Father', description: 'Acute pain of feeling inadequate before someone whose pride he craves.', feedback: 'Brilliant! Loud defensiveness was shielding deep shame.', isPrimary: true },
          { name: 'Rebellion Against Authority', description: 'Pure defiance.', feedback: 'His silent collapse afterward points to shame, not defiance.', isPrimary: false },
          { name: 'Objective Market Frustration', description: 'Purely analytical critique.', feedback: 'The emotional charge is relational.', isPrimary: false }
        ],
        deeperTakeaway: 'Beneath loud defensiveness often sits quiet shame longing to hear: “You are still worthy even when you stumble.”'
      }
    ]
  }
};

const GAME_ID = 'challenge-feeling';

export const NameTheFeelingGame: React.FC<NameTheFeelingGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const challenges: FeelingCase[] = currentStage === 1
    ? FEELING_CHALLENGES[language]
    : ADVANCED_FEELING_STAGES[currentStage as 2 | 3][language];

  const maxFreeScans = currentStage === 1 ? 99 : currentStage === 2 ? 2 : 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showTakeaway, setShowTakeaway] = useState(false);
  const [revealedClues, setRevealedClues] = useState<number[]>([0]);
  const [extraScansUsed, setExtraScansUsed] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const [completed, setCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  const currentChallenge = challenges[currentIndex] || challenges[0];

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setShowTakeaway(false);
    setRevealedClues([0]);
    setExtraScansUsed(0);
    setCorrectCount(0);
    setCompleted(false);
    setShowCompletionModal(false);
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOptionIndex(idx);
    setShowTakeaway(true);

    if (currentChallenge.options[idx].isPrimary) {
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
      setCorrectCount(c => c + 1);
    } else {
      soundManager.playSoftTap();
    }
  };

  const handleRevealClue = (clueIdx: number) => {
    if (!revealedClues.includes(clueIdx)) {
      soundManager.playSoftTap();
      setRevealedClues([...revealedClues, clueIdx]);
      setExtraScansUsed(s => s + 1);
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setShowTakeaway(false);
      setRevealedClues([0]);
    } else {
      const allCorrect = correctCount === challenges.length;
      const withinScanBudget = extraScansUsed <= maxFreeScans;
      const stars = allCorrect && withinScanBudget ? 3 : correctCount >= Math.ceil(challenges.length / 2) ? 2 : 1;
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
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              {isAr ? 'حلبة: كاشف المشاعر الدفينة 🔍' : 'Arena: Emotion Detective 🔍'}
            </span>
            <p className="text-[11px] text-stone-400">
              {currentStage === 1
                ? (isAr ? 'المرحلة ١: فحص حر لإشارات الجسد والمشاعر الأساسية' : 'Stage 1: Unlimited clue scans & primary emotions')
                : currentStage === 2
                ? (isAr ? 'المرحلة ٢: ميزانية فحص محدودة (فحصان إضافيان لـ ٣ نجوم) + ٤ خيارات' : 'Stage 2: Detective Clue Budget (max 2 extra scans for 3★)')
                : (isAr ? 'المرحلة ٣: الأقنعة الاجتماعية المزدوجة (فحص واحد فقط لـ ٣ نجوم!)' : 'Stage 3: Dual Social Masks (max 1 extra scan for 3★!)')}
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
          movesMade={correctCount}
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
              {isAr ? `الحالة ${currentIndex + 1} من ${challenges.length}` : `Case ${currentIndex + 1} of ${challenges.length}`}
            </span>
            {currentStage > 1 && (
              <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400 font-bold">
                {isAr
                  ? `عدسات الفحص المستخدمة: ${extraScansUsed} / ${maxFreeScans}`
                  : `Extra Scans Used: ${extraScansUsed} / ${maxFreeScans}`}
              </span>
            )}
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-extrabold text-base flex items-center justify-center">
                {currentChallenge.character.slice(0, 1)}
              </span>
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold block">
                  {isAr ? 'ملف الحالة:' : 'Character Case:'}
                </span>
                <span className="text-base font-extrabold text-stone-900 dark:text-stone-100">{currentChallenge.character}</span>
              </div>
            </div>

            <p className="text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-relaxed font-serif">
              «{currentChallenge.situation}»
            </p>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{isAr ? 'أدلة الجسد المكتشفة:' : 'Somatic Signals:'}</span>
              </span>

              <div className="flex flex-wrap gap-2">
                {currentChallenge.clues.map((clue, idx) => {
                  const isDiscovered = revealedClues.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleRevealClue(idx)}
                      className={`min-h-10 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isDiscovered
                          ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:bg-stone-200'
                      }`}
                    >
                      {isDiscovered ? `🔎 ${clue}` : (isAr ? '🔒 اكشفي الدليل' : '🔒 Scan clue')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block px-1">
              {isAr ? 'ما هو الشعور الجوهري المختبئ خلف السلوك الظاهري؟' : 'What authentic core emotion hides beneath the surface?'}
            </span>

            {currentChallenge.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              let style = 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 text-stone-900 dark:text-stone-100';
              if (selectedOptionIndex !== null) {
                if (opt.isPrimary) {
                  style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-400';
                } else if (isSelected && !opt.isPrimary) {
                  style = 'border-rose-300 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 font-semibold';
                } else {
                  style = 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-400 opacity-55';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedOptionIndex !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-start p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${style}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm sm:text-base font-bold">{opt.name}</span>
                    {selectedOptionIndex !== null && opt.isPrimary && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs opacity-85 leading-relaxed">{opt.description}</p>
                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-700 text-xs font-normal">
                      {opt.feedback}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {showTakeaway && (
            <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 rounded-2xl text-xs text-amber-950 dark:text-amber-200 space-y-2 animate-fade-in">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 text-sm">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>{isAr ? 'إضاءة نفسية:' : 'Psychological Insight:'}</span>
              </div>
              <p className="leading-relaxed text-stone-800 dark:text-stone-200 font-medium">
                {currentChallenge.deeperTakeaway}
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="min-h-10 flex items-center gap-1.5 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
                >
                  <span>{currentIndex + 1 < challenges.length ? (isAr ? 'الحالة التالية' : 'Next Case') : (isAr ? 'إنهاء المرحلة 🏆' : 'Finish Stage 🏆')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-4xl">
            💛
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {isAr ? `أتممتِ المرحلة ${currentStage} ببصيرة عميقة!` : `Stage ${currentStage} Detective Mastery!`}
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
