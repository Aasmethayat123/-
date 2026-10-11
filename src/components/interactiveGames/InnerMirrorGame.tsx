import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Bookmark, 
  HelpCircle, 
  HeartHandshake, 
  Sun, 
  CheckCircle,
  Eye,
  Shield,
  MessageCircleHeart
} from 'lucide-react';

interface InnerMirrorGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface CriticDialogue {
  id: string;
  criticPhraseAr: string;
  criticPhraseEn: string;
  pillar1MindfulnessAr: string;
  pillar1MindfulnessEn: string;
  pillar2HumanityAr: string;
  pillar2HumanityEn: string;
  pillar3KindnessAr: string;
  pillar3KindnessEn: string;
  compassionateVoiceAr: string;
  compassionateVoiceEn: string;
}

const PRESET_DIALOGUES: CriticDialogue[] = [
  {
    id: 'd1',
    criticPhraseAr: '«أنت فاشل، كل المحيطين بك يتقدمون وأنت محلك سر!»',
    criticPhraseEn: '"You are a failure; everyone is succeeding while you remain stuck!"',
    pillar1MindfulnessAr: 'أعترف أنني أشعر بالخوف والحزن الآن، ومقارنة نفسي بالآخرين تؤلم قلبي.',
    pillar1MindfulnessEn: 'I acknowledge that I feel afraid and hurt; comparing myself to others causes deep pain.',
    pillar2HumanityAr: 'لست وحدي في هذا الشعور؛ ملايين البشر يشعرون بالتعثر في فترات من حياتهم، والنمو ليس خطاً مستقيماً.',
    pillar2HumanityEn: 'I am not alone; millions stumble. Life and growth are never straight lines.',
    pillar3KindnessAr: 'سأعامل نفسي كصديق عزيز يمر بمحنة. خطوة صغيرة واحدة اليوم تكفي وتستحق الاحتفاء.',
    pillar3KindnessEn: 'I will treat myself like a dear friend in hardship. One small step today is worthy of celebration.',
    compassionateVoiceAr: '«أنت تكافح وتتعلم بكل شجاعة؛ قيمتك الإنسانية ثابتة ولا يحددها توقيت وصولك للآخرين».',
    compassionateVoiceEn: 'You are striving bravely; your worth is unconditional and not tied to another person\'s clock.'
  },
  {
    id: 'd2',
    criticPhraseAr: '«لماذا تصرفت بغباء وأحرجت نفسك؟ لن ينسوا لك هذا الخطأ أبداً!»',
    criticPhraseEn: '"Why were you so clumsy? They will never forget this humiliating mistake!"',
    pillar1MindfulnessAr: 'أشعر بالحرج ووجع في معدتي، وهذا شعور إنساني طبيعي عند ارتكاب زلة.',
    pillar1MindfulnessEn: 'I feel embarrassment in my stomach, a normal human reaction to making a slip.',
    pillar2HumanityAr: 'كل شخص على وجه الأرض أخطأ وتلعثم وأحرج نفسه مرات لا تُحصى، والناس ينسون زلاتنا سريعاً لانشغالهم بأنفسهم.',
    pillar2HumanityEn: 'Every human stumbles. People move on quickly because they are preoccupied with their own lives.',
    pillar3KindnessAr: 'أتقبل إنسانيتي ونقصي، وأتعلم من الموقف برفق دون أن أجلد نفسي بالسياط.',
    pillar3KindnessEn: 'I accept my imperfect humanity and learn with gentleness rather than harsh self-flogging.',
    compassionateVoiceAr: '«الخطأ دليل على أنك تحاول وتتفاعل؛ لست معصوماً، وأنت تستحق الصفح والمسامحة دائماً».',
    compassionateVoiceEn: 'Mistakes prove that you dare to try. You are human, and you deserve unconditional grace.'
  },
  {
    id: 'd3',
    criticPhraseAr: '«أنت لا تستحق الحب أو النجاح؛ لو عرفوك على حقيقتك لتخلوا عنك!»',
    criticPhraseEn: '"You don\'t deserve love or success; if they truly knew you, they would abandon you!"',
    pillar1MindfulnessAr: 'هذا صوت متوارث من جروح قديمة يخيفني من الرفض، وأنا أراه الآن بوعي.',
    pillar1MindfulnessEn: 'This is an old echo of past rejection scaring me; I see it now with calm mindfulness.',
    pillar2HumanityAr: 'جميعنا يحمل شكوكاً وعيوباً خفية، ومع ذلك نحن جميعاً جديرون بالحب والانتماء.',
    pillar2HumanityEn: 'All people have flaws and vulnerabilities, yet we are all inherently worthy of connection.',
    pillar3KindnessAr: 'أفتح ذراعي لنفسي بكل ما أحمل؛ لن أتخلى عن نفسي حتى لو تخلى عني العالم.',
    pillar3KindnessEn: 'I embrace myself fully; I will never abandon myself even in tough times.',
    compassionateVoiceAr: '«أنت تستحق المحبة والتقدير كما أنت تماماً، في ضعفك وقوتك».',
    compassionateVoiceEn: 'You are worthy of love and dignity exactly as you are, in both strength and vulnerability.'
  }
];

export const InnerMirrorGame: React.FC<InnerMirrorGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const [dialogueIdx, setDialogueIdx] = useState<number>(0);
  const currentDialogue = PRESET_DIALOGUES[dialogueIdx];

  const [activeStep, setActiveStep] = useState<number>(0); // 0 = Critic, 1 = Mindfulness, 2 = Humanity, 3 = Kindness / Transformed
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showHowTo, setShowHowTo] = useState<boolean>(false);

  // Compute mirror clarity: 0 (cracked/blurred) to 100% (radiant golden)
  const mirrorClarity = (activeStep / 3) * 100;

  const handleAdvanceStep = () => {
    soundManager.playChime(440 + activeStep * 110, 1.2);
    if (activeStep < 3) {
      const next = activeStep + 1;
      setActiveStep(next);
      if (next === 3) {
        soundManager.playSuccess();
        triggerConfetti();
        if (onAddXP) onAddXP(40);
      }
    }
  };

  const handleSelectDialogue = (idx: number) => {
    soundManager.playSoftTap();
    setDialogueIdx(idx);
    setActiveStep(0);
    setIsSaved(false);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setActiveStep(0);
    setIsSaved(false);
  };

  const handleSaveMoment = () => {
    if (isSaved) return;
    soundManager.playCoinSound();
    saveMoment({
      gameId: 'inner-mirror',
      gameTitle: isAr ? 'مرآة الحوار الداخلي والناقد الرحيم' : 'Inner Dialogue Mirror',
      quote: isAr ? currentDialogue.compassionateVoiceAr : currentDialogue.compassionateVoiceEn,
      reflection: isAr 
        ? `حولت صوت الناقد القاسي («${currentDialogue.criticPhraseAr}») عبر ركائز التعاطف الذاتي الثلاث (CFT) إلى صوت الحكيم الرحيم: «${currentDialogue.compassionateVoiceAr}».`
        : `Transformed inner critic into compassionate self-voice using 3 pillars of self-compassion.`,
      tag: isAr ? 'حوار رحيم' : 'Self-Compassion'
    });
    setIsSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <MessageCircleHeart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              {isAr ? 'مرآة الحوار الداخلي والناقد الرحيم' : 'Inner Dialogue Mirror'}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 font-bold">
                CFT Compassion
              </span>
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isAr ? 'تحويل جلد الذات والناقد القاسي إلى صوت الصديق الحكيم المشجع' : 'Transform the inner critic into a wise, compassionate inner ally'}
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

      {/* CFT Theory Card */}
      {showHowTo && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-xs sm:text-sm text-rose-900 dark:text-rose-200 space-y-2 animate-fade-in">
          <h4 className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {isAr ? 'ركائز العلاج المرتكز على الشفقة بالذات (Paul Gilbert):' : 'Self-Compassion Pillars (Kristin Neff & Paul Gilbert):'}
          </h4>
          <p className="leading-relaxed">
            {isAr 
              ? 'الناقد الداخلي هو مجرد نظام إنذار قديم يحاول حمايتك بطريقة بدائية قاسية. نحن لا نحاربه بالعنف، بل ننير المرآة عبر ثلاث ركائز: (١) الوعي بالألم، (٢) الإنسانية المشتركة، و(٣) اللطف الذاتي الفعال.'
              : 'The inner critic is an outdated threat system trying clumsily to protect you. We transform it through Mindfulness, Common Humanity, and Active Kindness.'}
          </p>
        </div>
      )}

      {/* Select Inner Critic Dialogue */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PRESET_DIALOGUES.map((d, idx) => (
          <button
            key={d.id}
            onClick={() => handleSelectDialogue(idx)}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              dialogueIdx === idx
                ? 'bg-stone-900 dark:bg-rose-600 text-white shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-rose-400'
            }`}
          >
            <span>{idx === 0 ? '🌪️' : idx === 1 ? '🎭' : '⛓️'}</span>
            <span>
              {isAr ? `عبارة الناقد (${idx + 1})` : `Critic Voice (${idx + 1})`}
            </span>
          </button>
        ))}
      </div>

      {/* The Visual Reflective Glass Mirror */}
      <div className="relative p-8 sm:p-12 rounded-3xl bg-stone-950 border-4 border-stone-800 shadow-2xl overflow-hidden flex flex-col items-center text-center space-y-6">
        {/* Glow ambient background aura that intensifies with clarity */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, rgba(245, 158, 11, ${mirrorClarity * 0.0035}), transparent 70%)`
          }}
        />

        {/* The Frame of the Mirror */}
        <div className={`relative w-72 h-88 sm:w-80 sm:h-96 rounded-full border-8 transition-all duration-700 flex flex-col items-center justify-center p-6 shadow-2xl ${
          activeStep === 3
            ? 'border-amber-400 bg-gradient-to-b from-amber-950/40 via-stone-900 to-amber-950/50 shadow-amber-500/20 ring-8 ring-amber-400/20'
            : activeStep === 2
            ? 'border-indigo-400/70 bg-stone-900/90'
            : activeStep === 1
            ? 'border-stone-600 bg-stone-900/80'
            : 'border-stone-700 bg-stone-900/60 opacity-90'
        }`}>
          {/* Glass crack texture overlay when at step 0 */}
          {activeStep === 0 && (
            <div className="absolute inset-4 rounded-full border border-dashed border-rose-500/30 pointer-events-none animate-pulse" />
          )}

          {/* Crown / Aura Icon */}
          <div className="mb-4">
            {activeStep === 3 ? (
              <div className="w-16 h-16 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg animate-bounce">
                ✨
              </div>
            ) : activeStep === 2 ? (
              <div className="w-14 h-14 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-xl">
                🤝
              </div>
            ) : activeStep === 1 ? (
              <div className="w-14 h-14 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center text-xl">
                👁️
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-rose-950/60 text-rose-400 flex items-center justify-center text-xl">
                ⚡
              </div>
            )}
          </div>

          {/* Current Message reflected on the Glass */}
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-stone-400">
              {activeStep === 0 
                ? (isAr ? 'صوت جلد الذات (الناقد)' : 'Inner Critic Voice')
                : activeStep === 1
                ? (isAr ? 'الركيزة ١: الوعي بالألم' : 'Pillar 1: Mindfulness')
                : activeStep === 2
                ? (isAr ? 'الركيزة ٢: الإنسانية المشتركة' : 'Pillar 2: Common Humanity')
                : (isAr ? 'صوت المشجع الحكيم الرحيم' : 'Compassionate Wise Self')}
            </span>

            <p className={`text-sm sm:text-base font-bold leading-relaxed ${
              activeStep === 3 
                ? 'text-amber-200 scale-102 transition-transform' 
                : activeStep === 0 
                ? 'text-rose-300' 
                : 'text-stone-200'
            }`}>
              {activeStep === 0 && (isAr ? currentDialogue.criticPhraseAr : currentDialogue.criticPhraseEn)}
              {activeStep === 1 && (isAr ? currentDialogue.pillar1MindfulnessAr : currentDialogue.pillar1MindfulnessEn)}
              {activeStep === 2 && (isAr ? currentDialogue.pillar2HumanityAr : currentDialogue.pillar2HumanityEn)}
              {activeStep === 3 && (isAr ? currentDialogue.compassionateVoiceAr : currentDialogue.compassionateVoiceEn)}
            </p>
          </div>
        </div>

        {/* 3 Pillars Progress Indicators */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition ${
            activeStep >= 1 ? 'bg-indigo-900/60 border-indigo-500 text-indigo-200' : 'bg-stone-900 border-stone-800 text-stone-500'
          }`}>
            <span>١. الوعي بالألم</span>
            {activeStep >= 1 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition ${
            activeStep >= 2 ? 'bg-indigo-900/60 border-indigo-500 text-indigo-200' : 'bg-stone-900 border-stone-800 text-stone-500'
          }`}>
            <span>٢. الإنسانية المشتركة</span>
            {activeStep >= 2 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition ${
            activeStep === 3 ? 'bg-amber-900/60 border-amber-500 text-amber-200' : 'bg-stone-900 border-stone-800 text-stone-500'
          }`}>
            <span>٣. اللطف والتشجيع</span>
            {activeStep === 3 && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
          </div>
        </div>

        {/* Interactive Step Trigger */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {activeStep < 3 ? (
            <button
              onClick={handleAdvanceStep}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-90 text-white rounded-2xl text-sm font-black shadow-lg transition-transform hover:scale-103 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {activeStep === 0 
                  ? (isAr ? 'تفعيل ركيزة الوعي بالألم' : 'Activate Mindfulness Pillar')
                  : activeStep === 1
                  ? (isAr ? 'تفعيل ركيزة الإنسانية المشتركة' : 'Activate Common Humanity')
                  : (isAr ? 'إضاءة صوت المشجع الرحيم (+40 XP)' : 'Awaken Compassionate Self (+40 XP)')}
              </span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة الحوار مع عبارة أخرى' : 'Practice Another Dialogue'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Moment in Journey Notebook Card */}
      {activeStep === 3 && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800 text-stone-900 dark:text-stone-100 shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h4 className="text-base font-bold">
                {isAr ? 'أشرقت المرآة بصوتك الرحيم!' : 'Mirror Heals With Your Compassionate Voice!'}
              </h4>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold">
              +40 XP
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
            {isAr 
              ? `«${currentDialogue.compassionateVoiceAr}». كلما استبدلت سوط النقد بلمسة الرحمة، استعاد جهازك العصبي الأمان وتضاعفت قدرتك على الإنجاز والنمو الحقيقي.`
              : `Replacing harshness with compassion soothes the nervous system, empowering sustainable growth.`}
          </p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveMoment}
              disabled={isSaved}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-stone-900 dark:bg-amber-600 hover:bg-stone-800 text-white shadow-md hover:scale-102'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>
                {isSaved 
                  ? (isAr ? 'محفوظ في دفتر رحلتي ✓' : 'Saved in Journey ✓')
                  : (isAr ? 'حفظ هذا الصوت الرحيم في دفتر رحلتي' : 'Save Compassionate Mantra')}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default InnerMirrorGame;
