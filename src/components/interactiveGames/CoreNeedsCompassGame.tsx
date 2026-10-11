import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Compass, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  Bookmark, 
  ShieldCheck, 
  HelpCircle,
  Heart,
  MessageSquare,
  Lock,
  UserCheck,
  Zap
} from 'lucide-react';

interface CoreNeedsCompassGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface EmotionCase {
  id: string;
  emoji: string;
  nameAr: string;
  nameEn: string;
  surfaceTriggerAr: string;
  surfaceTriggerEn: string;
  targetNeedIndex: number; // 0 to 4
  needNameAr: string;
  needNameEn: string;
  rescueQuestionAr: string;
  rescueQuestionEn: string;
  powerSentenceAr: string;
  powerSentenceEn: string;
  angle: number; // degrees
}

const EMOTION_CASES: EmotionCase[] = [
  {
    id: 'anger',
    emoji: '🔥',
    nameAr: 'الغضب والانفجار المفاجئ',
    nameEn: 'Sudden Anger & Flare-up',
    surfaceTriggerAr: '«لماذا تصرفوا بهذا الشكل؟ لا أحتمل هذا التجاهل أو التقليل!»',
    surfaceTriggerEn: '"Why did they act like this? I can\'t stand being dismissed!"',
    targetNeedIndex: 1, // Validation & Respect
    needNameAr: 'التقدير ورؤية القيمة الحقيقية',
    needNameEn: 'Validation & Respect',
    rescueQuestionAr: 'ما هو الجرح الخفي؟ هل شعرت أن مجهودك أو كرامتك تم تجاهلها؟',
    rescueQuestionEn: 'What is the hidden wound? Did you feel unseen or unappreciated?',
    powerSentenceAr: '«أنا لا أغضب لأؤذي أحداً، بل لأن كرامتي واجتهادي يستحقان الاحترام والوضوح».',
    powerSentenceEn: 'I am not angry to hurt; I speak because my dignity and effort deserve clear respect.',
    angle: 72
  },
  {
    id: 'anxiety',
    emoji: '🌪️',
    nameAr: 'القلق والتوجس من المجهول',
    nameEn: 'Anxiety & Dread of the Future',
    surfaceTriggerAr: '«ماذا لو حدثت كارثة؟ ماذا لو خرجت الأمور عن السيطرة وفشلت؟»',
    surfaceTriggerEn: '"What if a disaster happens? What if everything collapses?"',
    targetNeedIndex: 0, // Safety & Predictability
    needNameAr: 'الأمان النفسي والطمأنينة',
    needNameEn: 'Psychological Safety & Grounding',
    rescueQuestionAr: 'ما هو الاحتياج المفقود الآن؟ هل أحتاج إلى خطوة واحدة مؤكدة تحت قدمي بدلاً من محاولة التحكم في الغد كله؟',
    rescueQuestionEn: 'What is missing? Do you need one grounded certainty rather than controlling all tomorrows?',
    powerSentenceAr: '«أنا بأمان الآن في هذه اللحظة، ولا أحتاج لمعرفة كل التفاصيل لأكون مطمئناً».',
    powerSentenceEn: 'I am safe in this moment; I do not need to control the entire future to be grounded.',
    angle: 0
  },
  {
    id: 'exhaustion',
    emoji: '🥀',
    nameAr: 'الإنهاك وثقل المسؤوليات',
    nameEn: 'Deep Exhaustion & Burnout',
    surfaceTriggerAr: '«الجميع يعتمد علي، ولم يعد لدي طاقة لأتنفس حتى!»',
    surfaceTriggerEn: '"Everyone relies on me; I have zero energy left to even breathe!"',
    targetNeedIndex: 4, // Rest & Personal Boundaries
    needNameAr: 'الراحة والحدود الشخصية الصحية',
    needNameEn: 'Rest & Sacred Boundaries',
    rescueQuestionAr: 'لماذا نفدت بطاريتي؟ لأنني وافقت على ما يفوق طاقتي لحماية مشاعر الآخرين.',
    rescueQuestionEn: 'Why is my battery drained? Because I agreed to what exceeds my capacity to spare others.',
    powerSentenceAr: '«راحتي وصحتي ليست رفاهية ثانوية؛ التوقف الآن هو مسؤوليتي الأولى تجاه نفسي».',
    powerSentenceEn: 'My rest is not a luxury; pausing right now is my primary responsibility to myself.',
    angle: 288
  },
  {
    id: 'loneliness',
    emoji: '🍂',
    nameAr: 'الوحدة والشعور بالغربة',
    nameEn: 'Loneliness & Disconnection',
    surfaceTriggerAr: '«حتى لو كنت محاطاً بالناس، أشعر أنني في كوكب آخر وحدي.»',
    surfaceTriggerEn: '"Even when surrounded by people, I feel like I\'m on a lonely island."',
    targetNeedIndex: 3, // Belonging & Human Warmth
    needNameAr: 'الانتماء والتواصل الإنساني الصادق',
    needNameEn: 'Belonging & Authentic Warmth',
    rescueQuestionAr: 'هل أحتاج لكثرة الناس أم لشخص واحد أكون معه على سجيتي بدون أقنعة؟',
    rescueQuestionEn: 'Do you need more crowds, or just one safe space to be authentic without masks?',
    powerSentenceAr: '«أحتاج لتواصل حقيقي وصادق، وسأمنح نفسي الإذن بأن أكون شفافاً مع من أثق بهم».',
    powerSentenceEn: 'I crave authentic connection, and I allow myself to be vulnerable with safe people.',
    angle: 216
  },
  {
    id: 'control-rebel',
    emoji: '⛓️',
    nameAr: 'الشعور بالاختناق والتحكم الخارجي',
    nameEn: 'Feeling Controlled or Constrained',
    surfaceTriggerAr: '«أشعر أن قراراتي ليست بيدي، وأن الجميع يقرر عني مساري!»',
    surfaceTriggerEn: '"I feel trapped, like everyone else decides my path for me!"',
    targetNeedIndex: 2, // Autonomy & Agency
    needNameAr: 'الاستقلالية وحرية الاختيار الذاتي',
    needNameEn: 'Autonomy & Agency',
    rescueQuestionAr: 'ما هي المساحة الصغيرة التي أملك فيها قراري المستقل اليوم دون إذن من أحد؟',
    rescueQuestionEn: 'What is one small space where I have pure agency today without seeking permission?',
    powerSentenceAr: '«أنا صاحب حياتي ومسؤول عن اختياراتي؛ أملك حق تقرير ما يناسبني بحرية ونضج».',
    powerSentenceEn: 'I am the author of my life; I hold the mature right to choose what aligns with me.',
    angle: 144
  }
];

const CORE_PILLARS = [
  { index: 0, angle: 0, labelAr: 'الأمان والطمأنينة', labelEn: 'Safety & Peace', icon: '🛡️', color: 'text-amber-500' },
  { index: 1, angle: 72, labelAr: 'التقدير والاحترام', labelEn: 'Validation', icon: '💎', color: 'text-rose-500' },
  { index: 2, angle: 144, labelAr: 'الاستقلالية والحرية', labelEn: 'Autonomy', icon: '🦅', color: 'text-emerald-500' },
  { index: 3, angle: 216, labelAr: 'الانتماء والدفء', labelEn: 'Belonging', icon: '🤝', color: 'text-blue-500' },
  { index: 4, angle: 288, labelAr: 'الراحة والحدود', labelEn: 'Rest & Bounds', icon: '🌿', color: 'text-teal-500' },
];

export const CoreNeedsCompassGame: React.FC<CoreNeedsCompassGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const [selectedEmotion, setSelectedEmotion] = useState<EmotionCase>(EMOTION_CASES[0]);
  const [needleAngle, setNeedleAngle] = useState<number>(EMOTION_CASES[0].angle);
  const [isSpun, setIsSpun] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showHowTo, setShowHowTo] = useState<boolean>(false);

  const handleSelectEmotion = (c: EmotionCase) => {
    soundManager.playCompassTick();
    setSelectedEmotion(c);
    // Add extra spin turns for dramatic magnetic alignment
    const newAngle = c.angle + 360 * 2;
    setNeedleAngle(newAngle);
    setIsSpun(true);
    setIsSaved(false);

    if (onAddXP) {
      onAddXP(30);
    }
    triggerConfetti();
  };

  const handleSaveMoment = () => {
    if (isSaved) return;
    soundManager.playCoinSound();
    saveMoment({
      gameId: 'core-needs-compass',
      gameTitle: isAr ? 'بوصلة الاحتياجات النفسية' : 'Core Needs Compass',
      quote: isAr ? selectedEmotion.powerSentenceAr : selectedEmotion.powerSentenceEn,
      reflection: isAr 
        ? `في لحظة «${selectedEmotion.nameAr}»، كشفت البوصلة أن احتياجي الحقيقي العميق هو: ${selectedEmotion.needNameAr}. السؤال الشافي: ${selectedEmotion.rescueQuestionAr}`
        : `Behind emotion "${selectedEmotion.nameEn}", the core need revealed was: ${selectedEmotion.needNameEn}.`,
      tag: isAr ? 'بوصلة الاحتياج' : 'Core Needs'
    });
    setIsSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              {isAr ? 'بوصلة الاحتياجات النفسية' : 'Core Needs Compass'}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold">
                Schema & NVC
              </span>
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isAr ? 'اكتشف الاحتياج الإنساني الدفين غير الملبي خلف المشاعر العاصفة' : 'Identify the unmet core human need beneath overwhelming emotions'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHowTo(!showHowTo)}
            className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            title={isAr ? 'كيف ألعب؟' : 'How to play'}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              <span>{isAr ? 'العودة للمكتبة' : 'Back to Library'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Scientific Theory Card */}
      {showHowTo && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 space-y-2 animate-fade-in">
          <h4 className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {isAr ? 'سر البوصلة النفسية:' : 'The Compass Secret:'}
          </h4>
          <p className="leading-relaxed">
            {isAr 
              ? 'وفقاً لعلاج المخططات (Schema Therapy) والتواصل غير العنيف (NVC)، لا توجد مشاعر «شريرة». الغضب ليس سوى دخان ينبهك لحريق احتياج غير ملبى. عندما تكتشف الاحتياج الحقيقي وتعبر عنه بوضوح، يهدأ الانفعال تلقائياً ويتحول إلى حكمة.'
              : 'Emotions are warning smoke, not the fire. Beneath anger or fear lies an unmet core need. Identifying and naming the need calms the nervous system.'}
          </p>
        </div>
      )}

      {/* Step 1: Select Emotional Storm */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-3">
        <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
          {isAr ? '١. ما هو الشعور العاصف الذي تواجهه أو ترغب في فك شفرته؟' : '1. Which emotional storm are you facing or curious to decode?'}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {EMOTION_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectEmotion(c)}
              className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                selectedEmotion.id === c.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-[10px] font-mono text-stone-400">
                  {c.angle}°
                </span>
              </div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {isAr ? c.nameAr : c.nameEn}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Interactive Rotating Compass Graphic */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-950 text-white border-2 border-stone-800 shadow-2xl space-y-6 flex flex-col items-center">
        <div className="w-full flex items-center justify-between pb-2 border-b border-stone-800 text-xs">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            {isAr ? 'قرص البوصلة المغناطيسي' : 'Magnetic Compass Dial'}
          </span>
          <span className="text-stone-400">
            {isAr ? 'مؤشر التوجيه الحركي' : 'Direction Needle'}
          </span>
        </div>

        {/* The Round Dial */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-stone-700 bg-radial from-stone-900 via-stone-950 to-black shadow-2xl flex items-center justify-center my-4">
          {/* Degree ticks around edge */}
          <div className="absolute inset-2 rounded-full border border-stone-800 pointer-events-none" />

          {/* 5 Core Need Pillars around the perimeter */}
          {CORE_PILLARS.map((pillar) => {
            const rad = (pillar.angle - 90) * (Math.PI / 180);
            const radius = 110; // px
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            const isTarget = selectedEmotion.targetNeedIndex === pillar.index;

            return (
              <div
                key={pillar.index}
                className={`absolute flex flex-col items-center justify-center transition-all duration-300 ${
                  isTarget ? 'scale-115 z-20 font-black' : 'opacity-60 scale-95'
                }`}
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md border ${
                  isTarget 
                    ? 'bg-emerald-500 text-stone-950 border-white ring-4 ring-emerald-400/40' 
                    : 'bg-stone-800 text-white border-stone-700'
                }`}>
                  {pillar.icon}
                </div>
                <span className={`text-[10px] mt-1 whitespace-nowrap px-1.5 py-0.5 rounded-md ${
                  isTarget ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600' : 'text-stone-400'
                }`}>
                  {isAr ? pillar.labelAr : pillar.labelEn}
                </span>
              </div>
            );
          })}

          {/* Magnetic Needle Pivot & Pointer */}
          <div 
            className="relative w-4 h-40 flex flex-col items-center justify-center transition-transform duration-1000 ease-out origin-center z-10"
            style={{ transform: `rotate(${needleAngle}deg)` }}
          >
            {/* North Pointing Arrow (Red/Emerald tip) */}
            <div className="w-0 h-0 border-x-6 border-x-transparent border-b-28 border-b-emerald-400 drop-shadow-md" />
            <div className="w-1.5 h-16 bg-gradient-to-b from-emerald-400 to-stone-500 rounded-full" />
            {/* Center Pivot Jewel */}
            <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-stone-900 shadow-md flex items-center justify-center text-[8px] font-bold text-stone-950">
              ●
            </div>
            {/* South Tail */}
            <div className="w-1.5 h-16 bg-gradient-to-b from-stone-500 to-rose-400 rounded-full" />
            <div className="w-0 h-0 border-x-6 border-x-transparent border-t-28 border-t-rose-400 drop-shadow-md" />
          </div>
        </div>

        {/* Compass Status Output */}
        <div className="text-center space-y-1">
          <span className="text-xs text-stone-400">
            {isAr ? 'الإبرة تشير الآن بثبات إلى الاحتياج:' : 'Needle clearly points to:'}
          </span>
          <h3 className="text-lg sm:text-xl font-black text-emerald-400">
            {isAr ? selectedEmotion.needNameAr : selectedEmotion.needNameEn}
          </h3>
        </div>
      </div>

      {/* Step 3: Clinical Translation & Power Sentence */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-indigo-950 to-stone-900 text-white border-2 border-indigo-500/40 shadow-xl space-y-5 animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedEmotion.emoji}</span>
            <div>
              <h4 className="text-base font-bold text-white">
                {isAr ? selectedEmotion.nameAr : selectedEmotion.nameEn}
              </h4>
              <span className="text-xs text-indigo-300">
                {isAr ? selectedEmotion.surfaceTriggerAr : selectedEmotion.surfaceTriggerEn}
              </span>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 font-mono font-bold">
            +30 XP
          </span>
        </div>

        {/* Rescue Question */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-xs font-bold text-amber-300 block">
            {isAr ? 'سؤال الإنقاذ للوعي الذاتي:' : 'Rescue Awareness Question:'}
          </span>
          <p className="text-sm text-stone-200 leading-relaxed font-medium">
            {isAr ? selectedEmotion.rescueQuestionAr : selectedEmotion.rescueQuestionEn}
          </p>
        </div>

        {/* Sentence of Emotional Power */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-400/40 space-y-1">
          <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            {isAr ? 'جملة القوة النفسية (للتحدث مع الذات أو الآخرين):' : 'Sentence of Power (NVC Expression):'}
          </span>
          <p className="text-base sm:text-lg font-black text-white leading-relaxed">
            {isAr ? selectedEmotion.powerSentenceAr : selectedEmotion.powerSentenceEn}
          </p>
        </div>

        {/* Save in Journey Notebook */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveMoment}
            disabled={isSaved}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isSaved
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-white text-stone-900 hover:bg-stone-100 shadow-md hover:scale-102'
            }`}
          >
            <Bookmark className="w-4 h-4 text-emerald-600" />
            <span>
              {isSaved 
                ? (isAr ? 'محفوظ في دفتر رحلتي ✓' : 'Saved in Journey ✓')
                : (isAr ? 'حفظ بوصلة اليوم في دفتر رحلتي' : 'Save Compass Insight')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default CoreNeedsCompassGame;
