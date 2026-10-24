import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { BEFORE_YOU_REACT_ITEMS } from '../data/challenges';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import {
  RotateCcw,
  Flame,
  ArrowRight,
  Activity,
  PauseCircle,
  Wind,
  Lock
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../utils/gameLevelsManager';
import { StageLevelSelector } from './common/StageLevelSelector';

interface BeforeYouReactGameProps {
  language: Language;
  onOpenBreathing: () => void;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface ConsequenceChoice {
  id: string;
  title: string;
  description: string;
  actionType: string; // 'conscious' | 'impulsive' | 'passive_aggressive'
  shortTermConsequence: string;
  longTermConsequence: string;
}

interface TriggerScenario {
  situation: string;
  emotionSurge: string;
  physicalSensations: string[];
  requiredBreathsToUnlock: number;
  options: ConsequenceChoice[];
}

const ADVANCED_REACT_STAGES: Record<2 | 3, Record<Language, TriggerScenario[]>> = {
  // Stage 2: Requires 3 calming breath taps to lower BPM before decision options unlock!
  2: {
    ar: [
      {
        situation: 'أرسل زميل في جروب العمل العام ملاحظة توحي بأن التأخير في المشروع كان بسببك، رغم أنك سلّمتِ حصتك في موعدها.',
        emotionSurge: 'غضب حار وشعور بالظلم أمام الفريق (138 BPM)',
        physicalSensations: ['حرارة في الأذنين', 'سرعة كتابة على لوحة المفاتيح', 'شد في الفك'],
        requiredBreathsToUnlock: 3,
        options: [
          {
            id: 's2_1_imp',
            title: 'رد هجومي ساخر فوراً في الجروب العام',
            description: 'كتابة رسالة نارية تفضح أخطاءه السابقة أمام المدير.',
            actionType: 'impulsive',
            shortTermConsequence: 'تفريغ لحظي للغضب وانتصار وهمي.',
            longTermConsequence: 'تحوّل النقاش لمعركة شخصية تضعف صورتك المهنية الهادئة.'
          },
          {
            id: 's2_1_con',
            title: 'توضيح موثق بالأرقام والتواريخ بنبرة محايدة تماماً',
            description: 'إرفاق تاريخ تسليم حصتك بهدوء واقتراح خطوة الحل التالية.',
            actionType: 'conscious',
            shortTermConsequence: 'يحتاج ضبط نفس لـ ٣٠ ثانية قبل الإرسال.',
            longTermConsequence: 'يظهر احترافيتك العالية ويضع الحقائق بوضوح دون صراع.'
          },
          {
            id: 's2_1_avoid',
            title: 'الصمت التام والغليان طوال الليل',
            description: 'عدم الرد إطلاقاً مع اجترار القهر في البيت.',
            actionType: 'impulsive',
            shortTermConsequence: 'تجنب المواجهة اللحظية.',
            longTermConsequence: 'يثبت الانطباع الخاطئ ويستنزف أعصابك.'
          }
        ]
      },
      {
        situation: 'قاطعكِ أحد أفراد الأسرة أثناء حديثكِ المهم وقال باستخفاف: «أنتِ دائماً تكبّرين المواضيع!»',
        emotionSurge: 'انقباض قهر ورغبة في الصراخ أو الانسحاب (134 BPM)',
        physicalSensations: ['ضيق في الصدر', 'رعشة في اليدين'],
        requiredBreathsToUnlock: 3,
        options: [
          {
            id: 's2_2_imp',
            title: 'رفع الصوت وقلب الطاولة بالملامات القديمة',
            description: 'استدعاء مواقف السنوات الماضية في جدال حاد.',
            actionType: 'impulsive',
            shortTermConsequence: 'إثبات الصوت العالي لحظياً.',
            longTermConsequence: 'ضياع أصل الموضوع واستنزاف عاطفي مرهق.'
          },
          {
            id: 's2_2_con',
            title: 'تثبيت الحد بهدوء وثبات: «الموضوع مهم لي، أحب أكمل فكرتي باحترام»',
            description: 'نبرة منخفضة وحازمة تحمي كرامة حديثك دون انفعال.',
            actionType: 'conscious',
            shortTermConsequence: 'شعور بالتماسك والسيادة الداخلية.',
            longTermConsequence: 'يرسّخ احترام حدودك دون منح الطرف الآخر ذريعة التصعيد.'
          }
        ]
      }
    ],
    en: [
      {
        situation: 'A coworker implies in the group chat that the project delay was your fault, even though you delivered on time.',
        emotionSurge: 'Hot indignation & public unfairness spike (138 BPM)',
        physicalSensations: ['Hot ears', 'Furious typing impulse', 'Clenched jaw'],
        requiredBreathsToUnlock: 3,
        options: [
          {
            id: 's2_1_imp',
            title: 'Fire back a sarcastic public takedown',
            description: 'Expose their past mistakes in front of everyone.',
            actionType: 'impulsive',
            shortTermConsequence: 'Brief adrenaline discharge.',
            longTermConsequence: 'Escalates into petty drama and undermines your composure.'
          },
          {
            id: 's2_1_con',
            title: 'Post calm, timestamped facts & next steps',
            description: 'Share objective delivery dates neutrally and focus on forward workflow.',
            actionType: 'conscious',
            shortTermConsequence: 'Requires 30 seconds of self-regulation.',
            longTermConsequence: 'Protects your reputation with indisputable professionalism.'
          }
        ]
      }
    ]
  },

  // Stage 3: 4 breaths required + Subtle Passive-Aggressive Traps disguised as "polite"!
  3: {
    ar: [
      {
        situation: 'نسيت صديقتك المقربة مناسبة مهمة جداً لكِ، ثم اتصلت تطلب منكِ خدمة عاجلة لها وكأن شيئاً لم يكن.',
        emotionSurge: 'مزيج حارق من الخذلان والغضب المكتوم (145 BPM)',
        physicalSensations: ['ثقل في الحنجرة', 'نبض متسارع في الصدغين'],
        requiredBreathsToUnlock: 4,
        options: [
          {
            id: 's3_1_pa',
            title: 'رد مبطن بالسخرية الباردة: «آه طبعاً ما أنتِ مبتفتكرينيش غير وقت المصلحة!»',
            description: 'عتاب لاذع مغلف بابتسامة باردة (عدوان سلبي).',
            actionType: 'passive_aggressive',
            shortTermConsequence: 'إشعارها بالذنب فوراً دون صراخ.',
            longTermConsequence: 'فخ العدوان السلبي! يولّد دفاعية متبادلة ولا يداوي الجرح بصدق.'
          },
          {
            id: 's3_1_con',
            title: 'صدق واضح بلا هجوم: «تأثرت لأنك نسيتِ مناسبتي اليوم، وسأساعدك غداً بعد أن أرتاح»',
            description: 'تسمية الشعور بصراحة محترمة مع حماية طاقتك الحالية.',
            actionType: 'conscious',
            shortTermConsequence: 'شجاعة الوضوح دون قسوة أو ابتلاع للألم.',
            longTermConsequence: 'يبني علاقة ناضجة قائمة على الصدق لا التلميحات المبطنة.'
          },
          {
            id: 's3_1_fawn',
            title: 'تنفيذ خدمتها فوراً بابتسامة مصطنعة وابتلاع الغصة',
            description: 'إخفاء الألم تماماً خوفاً من الزعل.',
            actionType: 'impulsive',
            shortTermConsequence: 'تفادي أي حرج لحظي.',
            longTermConsequence: 'تراكم المرارة الصامتة وبرود المودة تدريجياً.'
          },
          {
            id: 's3_1_cut',
            title: 'حظر الرقم فوراً دون كلمة واحدة',
            description: 'قطع العلاقة في لحظة فوران الدم.',
            actionType: 'impulsive',
            shortTermConsequence: 'شعور زائف بالحسم.',
            longTermConsequence: 'ندم لاحق على غياب فرصة الحوار الناضج.'
          }
        ]
      }
    ],
    en: [
      {
        situation: 'Your close friend forgot your milestone day, then called asking for an urgent favor as if nothing happened.',
        emotionSurge: 'Stinging hurt & suppressed resentment (145 BPM)',
        physicalSensations: ['Tight throat', 'Throbbing temples'],
        requiredBreathsToUnlock: 4,
        options: [
          {
            id: 's3_1_pa',
            title: 'Cold passive-aggressive jab: “Sure, since you only remember me when you need favors!”',
            description: 'Guilt-inducing sarcasm disguised as compliance.',
            actionType: 'passive_aggressive',
            shortTermConsequence: 'Stings her back instantly.',
            longTermConsequence: 'Passive-aggressive trap! Triggers defensiveness instead of repair.'
          },
          {
            id: 's3_1_con',
            title: 'Clear, honest vulnerability + boundary: “I felt hurt you missed today; let’s talk, and I can help tomorrow.”',
            description: 'Direct emotional honesty paired with self-respect.',
            actionType: 'conscious',
            shortTermConsequence: 'Courageous clarity without attack.',
            longTermConsequence: 'Deepens authentic trust and mutual respect.'
          },
          {
            id: 's3_1_fawn',
            title: 'Do the favor immediately while swallowing resentment',
            description: 'Fake smile while hurting inside.',
            actionType: 'impulsive',
            shortTermConsequence: 'Zero immediate friction.',
            longTermConsequence: 'Breeds silent bitterness.'
          }
        ]
      }
    ]
  }
};

const GAME_ID = 'challenge-react';

export const BeforeYouReactGame: React.FC<BeforeYouReactGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const stage1Items: TriggerScenario[] = BEFORE_YOU_REACT_ITEMS[language].map(it => ({
    situation: it.situation,
    emotionSurge: it.emotionSurge,
    physicalSensations: it.physicalSensations,
    requiredBreathsToUnlock: 1,
    options: it.options
  }));

  const items: TriggerScenario[] = currentStage === 1
    ? stage1Items
    : ADVANCED_REACT_STAGES[currentStage as 2 | 3][language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<ConsequenceChoice | null>(null);
  const [breathsTaken, setBreathsTaken] = useState<number>(0);
  const [consciousPicks, setConsciousPicks] = useState<number>(0);

  const [completed, setCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  const currentItem = items[currentIndex] || items[0];
  const isRegulated = breathsTaken >= currentItem.requiredBreathsToUnlock;
  const simulatedBPM = Math.max(72, 140 - breathsTaken * Math.round(68 / currentItem.requiredBreathsToUnlock));

  useEffect(() => {
    setBreathsTaken(0);
    setSelectedOption(null);
  }, [currentStage, currentIndex]);

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setCurrentIndex(0);
    setBreathsTaken(0);
    setSelectedOption(null);
    setConsciousPicks(0);
    setCompleted(false);
    setShowCompletionModal(false);
  };

  const handleBrakeBreath = () => {
    if (isRegulated) return;
    soundManager.playBreathBell(breathsTaken % 2 === 0);
    setBreathsTaken(b => b + 1);
  };

  const handleSelectOption = (opt: ConsequenceChoice) => {
    if (!isRegulated || selectedOption !== null) return;
    setSelectedOption(opt);
    if (opt.actionType === 'conscious') {
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
      setConsciousPicks(c => c + 1);
    } else {
      soundManager.playSoftTap();
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < items.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const ratio = consciousPicks / items.length;
      const stars = ratio >= 0.9 ? 3 : ratio >= 0.5 ? 2 : 1;
      setEarnedStars(stars);
      const res = completeStage(GAME_ID, currentStage, stars, consciousPicks, onAddXP);
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
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>{isAr ? 'حلبة: ثواني قبل الانفجار 🔥' : 'Arena: Before You React 🔥'}</span>
            </span>
            <p className="text-[11px] text-stone-400">
              {currentStage === 1
                ? (isAr ? 'المرحلة ١: وقفة تجميد واحدة لاختيار الاستجابة الواعية' : 'Stage 1: Single Slow-Mo pause before choosing')
                : currentStage === 2
                ? (isAr ? 'المرحلة ٢: مكابح الزفير الثلاثية لخفض النبض وفتح الخيارات!' : 'Stage 2: 3-Breath Vagal Brake required to unlock choices!')
                : (isAr ? 'المرحلة ٣: ٤ أنفاس تهدئة + كشف فخ العدوان السلبي المبطن!' : 'Stage 3: 4-Breath Brake + Spot Passive-Aggressive Traps!')}
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
            movesMade={consciousPicks}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={() => loadStage(currentStage)}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />
          <span className={`px-3 py-1.5 rounded-xl font-mono tabular-nums text-xs font-bold border ${
            isRegulated ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300' : 'bg-rose-950/60 border-rose-700 text-rose-300'
          }`}>
            {simulatedBPM} BPM
          </span>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
            <span className="font-mono tabular-nums">
              {isAr ? `الموقف ${currentIndex + 1} من ${items.length}` : `Scenario ${currentIndex + 1} of ${items.length}`}
            </span>
            <span className="font-mono tabular-nums text-rose-700 dark:text-rose-400 font-bold">
              {isAr
                ? `مكابح التنفس: ${breathsTaken} / ${currentItem.requiredBreathsToUnlock}`
                : `Breath Brake: ${breathsTaken} / ${currentItem.requiredBreathsToUnlock}`}
            </span>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">
                {isAr ? 'الاستفزاز المباغت:' : 'The Acute Trigger:'}
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 font-serif leading-relaxed">
                {currentItem.situation}
              </p>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-2">
              <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold text-xs">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>{currentItem.emotionSurge}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
                {currentItem.physicalSensations.map((sens, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white dark:bg-stone-900 rounded-lg text-rose-900 dark:text-rose-200 font-semibold border border-rose-200 dark:border-rose-800 text-[11px]"
                  >
                    ⚡ {sens}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Breath Brake Bar */}
            <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isRegulated
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-950 dark:text-emerald-100'
                : 'bg-stone-900 border-rose-500 text-white'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold">
                <PauseCircle className={`w-5 h-5 shrink-0 ${isRegulated ? 'text-emerald-600' : 'text-rose-400 animate-pulse'}`} />
                <span>
                  {isRegulated
                    ? (isAr ? 'هدأ النبض إلى 72 BPM! فُتحت خيارات القرار الواعي 🌿' : 'Pulse calmed to 72 BPM! Conscious options unlocked 🌿')
                    : (isAr
                        ? `اضغطي مكابح الزفير (${currentItem.requiredBreathsToUnlock - breathsTaken} مرات متبقية) لفتح القرارات:`
                        : `Tap Exhale Brake (${currentItem.requiredBreathsToUnlock - breathsTaken} left) to unlock options:`)}
                </span>
              </div>

              {!isRegulated ? (
                <button
                  onClick={handleBrakeBreath}
                  className="min-h-11 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Wind className="w-4 h-4" />
                  <span>{isAr ? `زفير التهدئة (${breathsTaken}/${currentItem.requiredBreathsToUnlock})` : `Exhale Brake (${breathsTaken}/${currentItem.requiredBreathsToUnlock})`}</span>
                </button>
              ) : (
                <span className="px-3 py-1 bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-extrabold text-xs rounded-lg shrink-0">
                  ✓ {isAr ? 'متزن وواعٍ' : 'Regulated'}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 px-1">
              {!isRegulated && <Lock className="w-3.5 h-3.5 text-stone-400" />}
              <span>
                {!isRegulated
                  ? (isAr ? 'أكملي أنفاس التهدئة أولاً حتى لا تتخذي قراراً تحت فورة الأدرينالين' : 'Complete calming breaths first before reacting')
                  : (isAr ? 'الآن اختاري استجابتك وقارني الأثر بعيد المدى:' : 'Choose your response and inspect long-term impact:')}
              </span>
            </span>

            {currentItem.options.map((opt) => {
              const isSelected = selectedOption?.id === opt.id;
              const isConscious = opt.actionType === 'conscious';

              return (
                <button
                  key={opt.id}
                  disabled={!isRegulated || selectedOption !== null}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-start p-5 rounded-2xl border-2 transition-all shadow-xs ${
                    !isRegulated
                      ? 'opacity-45 border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 cursor-not-allowed'
                      : isSelected
                      ? isConscious
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-400 cursor-pointer'
                        : 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 cursor-pointer'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 cursor-pointer text-stone-900 dark:text-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm sm:text-base font-extrabold">{opt.title}</span>
                    {selectedOption !== null && (
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold shrink-0 ${
                        isConscious ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                      }`}>
                        {isConscious
                          ? (isAr ? 'استجابة واعية 🌿' : 'Conscious 🌿')
                          : opt.actionType === 'passive_aggressive'
                          ? (isAr ? 'فخ عدوان سلبي ⚠️' : 'Passive-Aggressive ⚠️')
                          : (isAr ? 'اندفاع انفعالي' : 'Impulsive')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs opacity-80 leading-relaxed">{opt.description}</p>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl">
                        <span className="font-bold block mb-0.5">{isAr ? 'الأثر اللحظي:' : 'Short-Term:'}</span>
                        <span>{opt.shortTermConsequence}</span>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${
                        isConscious ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950' : 'bg-rose-100/80 border-rose-300 text-rose-950'
                      }`}>
                        <span className="font-bold block mb-0.5">{isAr ? 'العاقبة الحقيقية:' : 'Long-Term:'}</span>
                        <span>{opt.longTermConsequence}</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              disabled={!selectedOption}
              onClick={handleNext}
              className={`min-h-11 flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                selectedOption
                  ? 'bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 text-white cursor-pointer'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{currentIndex + 1 < items.length ? (isAr ? 'الموقف التالي' : 'Next Scenario') : (isAr ? 'إنهاء المرحلة 🛡️' : 'Finish Stage 🛡️')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto text-4xl">
            🛡️
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {isAr ? `أتقنتِ المرحلة ${currentStage} من ضبط الانفعال!` : `Stage ${currentStage} Impulse Mastery!`}
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
