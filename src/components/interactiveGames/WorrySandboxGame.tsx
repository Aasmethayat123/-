import React, { useState } from 'react';
import { 
  ArrowRight, 
  Hourglass, 
  Wind, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Bookmark, 
  RotateCcw, 
  Calendar, 
  ShieldAlert,
  ArrowDown,
  Lock,
  Unlock,
  Check
} from 'lucide-react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { recordStreakActivity } from '../../utils/streakManager';

interface WorrySandboxGameProps {
  language: Language;
  onBackToMap: () => void;
  onAddXP?: (amount: number) => void;
}

interface WorryItem {
  id: string;
  text: string;
  type: 'actionable' | 'hypothetical';
  scheduledTime?: string;
  microAction?: string;
  isSifted: boolean;
}

const PRESET_WORRIES = [
  {
    ar: 'ماذا لو ساءت الأمور في المقابلة أو الاجتماع القادم؟',
    en: 'What if everything goes wrong in the upcoming meeting?',
    type: 'hypothetical' as const
  },
  {
    id: 'unfinished_task',
    ar: 'لدي مهام متراكمة لم أنهها بعد وأشعر بالذنب!',
    en: 'I have pending tasks piling up and feel immense guilt!',
    type: 'actionable' as const
  },
  {
    ar: 'أشعر أن هناك خبراً سيئاً على وشك الحدوث دون سبب واضح.',
    en: 'I feel impending bad news is about to hit for no clear reason.',
    type: 'hypothetical' as const
  }
];

export const WorrySandboxGame: React.FC<WorrySandboxGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  
  const [worryInput, setWorryInput] = useState<string>('');
  const [activeWorry, setActiveWorry] = useState<string>('');
  const [selectedClassification, setSelectedClassification] = useState<'actionable' | 'hypothetical' | null>(null);
  const [microStep, setMicroStep] = useState<string>('');
  const [scheduledAppointment, setScheduledAppointment] = useState<string>('17:30');
  
  // Visual states
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [isDissolved, setIsDissolved] = useState<boolean>(false);
  const [isCapsuleLocked, setIsCapsuleLocked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [completedCount, setCompletedCount] = useState<number>(0);

  const handleStartWorry = (text: string) => {
    soundManager.playSoftTap();
    setActiveWorry(text);
    setSelectedClassification(null);
    setIsDissolved(false);
    setIsCapsuleLocked(false);
    setMicroStep('');
    soundManager.playSandTrickle();
    setIsPouring(true);
    setTimeout(() => setIsPouring(false), 800);
  };

  const handleClassify = (type: 'actionable' | 'hypothetical') => {
    soundManager.playSoftTap();
    setSelectedClassification(type);
    if (type === 'hypothetical') {
      // Wind blowing away hypothetical worry
      soundManager.playSandTrickle();
      setIsDissolved(true);
      setCompletedCount(prev => prev + 1);
      recordStreakActivity('worry_sandbox');
      if (onAddXP) onAddXP(30);
    }
  };

  const handleLockCapsule = () => {
    soundManager.playChime();
    setIsCapsuleLocked(true);
    setCompletedCount(prev => prev + 1);
    recordStreakActivity('worry_sandbox');
    if (onAddXP) onAddXP(35);
  };

  const handleSaveToMoments = () => {
    soundManager.playChime();
    saveMoment({
      gameId: 'worry-sandbox',
      gameTitle: isAr ? 'ساعة الرمل العكسية: فن تأجيل القلق' : 'The Worry Sandbox',
      quote: activeWorry,
      reflection: selectedClassification === 'actionable' 
        ? (isAr ? `إجراء واقعي مصغر: ${microStep} (موعد التفريغ: ${scheduledAppointment})` : `Micro-action: ${microStep} (Appointment: ${scheduledAppointment})`)
        : (isAr ? 'توقع مستقبلي خارج عن سيطرتي تم نثره في مهب الريح وتحرير الذهن منه.' : 'Hypothetical future out of my control; released into the wind.'),
      tag: isAr ? 'تأجيل القلق (CBT)' : 'Worry Postponement'
    });
    setIsSaved(true);
    if (onAddXP) onAddXP(20);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
                {isAr ? 'ساعة الرمل العكسية: فن تأجيل القلق ⏳' : 'The Worry Sandbox ⏳'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                {isAr ? 'ضبط المنبه الزمني (CBT)' : 'Worry Postponement'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr 
                ? 'لا تقاوم القلق ولا تدعه يبتلع يومك: صبّه في الرمل، فرز حقيقته، وأجّل موعده بحكمة.' 
                : 'Don’t suppress worries; funnel them into sand, sift real actions, and postpone with intention.'}
            </p>
          </div>
        </div>

        {activeWorry && (
          <button
            onClick={handleSaveToMoments}
            disabled={isSaved}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200'
            }`}
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? (isAr ? 'تم الحفظ 🌿' : 'Saved 🌿') : (isAr ? 'حفظ التجربة' : 'Save Moment')}</span>
          </button>
        )}
      </div>

      {/* Input or Presets */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          {isAr ? '١. ما الفكرة المقلقة التي تحاول سرقة انتباهك الآن؟' : '1. What worry thought is intruding on your mind right now?'}
        </span>

        <div className="flex gap-2">
          <input
            type="text"
            value={worryInput}
            onChange={(e) => setWorryInput(e.target.value)}
            placeholder={isAr ? 'اكتب ما يقلقك هنا (مثلاً: أخشى ألا أتمكن من إتمام هذا المشروع...)' : 'Type your worry thought here...'}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && worryInput.trim()) {
                handleStartWorry(worryInput.trim());
              }
            }}
          />
          <button
            onClick={() => {
              if (worryInput.trim()) handleStartWorry(worryInput.trim());
            }}
            disabled={!worryInput.trim()}
            className="px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shrink-0"
          >
            {isAr ? 'صب في الرمل' : 'Funnel In'}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[11px] text-stone-400 self-center">{isAr ? 'أو اختر نموذجاً:' : 'Or choose preset:'}</span>
          {PRESET_WORRIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleStartWorry(isAr ? preset.ar : preset.en)}
              className="text-xs px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-50 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
            >
              {isAr ? preset.ar : preset.en}
            </button>
          ))}
        </div>
      </div>

      {/* The Hourglass Sifting Stage */}
      {activeWorry && (
        <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-gradient-to-b from-stone-900 via-stone-925 to-stone-950 p-6 sm:p-8 text-white shadow-xl space-y-6">
          {/* Hourglass Graphical Container */}
          <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-stone-800/80">
            {/* Glowing Sand Stream */}
            <div className="flex items-center gap-3 mb-4">
              <Hourglass className={`w-8 h-8 text-amber-400 ${isPouring ? 'animate-spin' : ''}`} />
              <div className="text-center">
                <span className="text-[11px] uppercase tracking-wider text-amber-400/80 font-mono font-bold block">
                  {isAr ? 'كبسولة الرمل النشطة' : 'Active Sand Capsule'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white font-serif max-w-lg mt-0.5">
                  «{activeWorry}»
                </h3>
              </div>
            </div>

            {/* Sifter Decision Branch */}
            {!selectedClassification && (
              <div className="w-full space-y-3 pt-2">
                <p className="text-xs text-center text-stone-300 font-medium">
                  {isAr ? '٢. انخل الفكرة في غربال الواقع: هل هذا القلق أمر بيدك حله اليوم، أم وهم مستقبلي؟' : '2. Sift the worry: Is this something actionable today, or a hypothetical future?'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  <button
                    onClick={() => handleClassify('actionable')}
                    className="p-4 rounded-2xl bg-stone-800/80 hover:bg-emerald-950/60 border border-stone-700 hover:border-emerald-500 text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                      <Check className="w-4 h-4" />
                      <span>{isAr ? 'أمر واقعي بيدي فعل شيء بشأنه' : 'Actionable Real Problem'}</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-snug">
                      {isAr ? 'هناك خطوة ملموسة أستطيع اتخاذها لتخفيفه أو إنجازه.' : 'There is a tangible micro-step I can take to address it.'}
                    </p>
                  </button>

                  <button
                    onClick={() => handleClassify('hypothetical')}
                    className="p-4 rounded-2xl bg-stone-800/80 hover:bg-sky-950/60 border border-stone-700 hover:border-sky-500 text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-xs mb-1">
                      <Wind className="w-4 h-4" />
                      <span>{isAr ? 'توقع أو سيناريو خارج عن سيطرتي' : 'Hypothetical "What-If"'}</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-snug">
                      {isAr ? 'أمر في الغيب أو في عقول الآخرين، لا حيلة لي فيه الآن.' : 'Future uncertainty beyond immediate control.'}
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Branch A: Hypothetical Worry Dissolved in Sand */}
            {selectedClassification === 'hypothetical' && (
              <div className="w-full p-5 rounded-2xl bg-sky-950/40 border border-sky-800/60 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                  <Wind className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-sky-200">
                    {isAr ? 'تطايرت ذرات الرمل مع الريح! 💨' : 'Scattered to the Winds! 💨'}
                  </h4>
                  <p className="text-xs text-sky-300/90 max-w-md mx-auto mt-1 leading-relaxed">
                    {isAr
                      ? '«هذا القلق مبني على سيناريو لم يحدث بعد. عقلك كان يحاول حمايتك بالتنبؤ، لكن طاقتك الحالية ملك لهذه اللحظة فقط.»'
                      : '“This worry is based on an unwritten future. Your mind was trying to protect you, but your energy belongs to the present.”'}
                  </p>
                </div>
              </div>
            )}

            {/* Branch B: Actionable Worry & Scheduled Postponement Appointment */}
            {selectedClassification === 'actionable' && !isCapsuleLocked && (
              <div className="w-full max-w-lg space-y-4 pt-2 animate-fade-in">
                <div className="p-4 rounded-2xl bg-stone-800/90 border border-stone-700 space-y-2">
                  <label className="text-xs font-bold text-emerald-300 block">
                    {isAr ? '٣. ما هي أصغر خطوة واقعية (Micro-action) يمكنك فعلها؟' : '3. What is the smallest single micro-step you can take?'}
                  </label>
                  <input
                    type="text"
                    value={microStep}
                    onChange={(e) => setMicroStep(e.target.value)}
                    placeholder={isAr ? 'مثال: كتابة فقرة واحدة، إرسال إيميل من سطرين...' : 'e.g. Write 1 sentence, send a 2-line email...'}
                    className="w-full px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-amber-200 block">
                      {isAr ? 'موعد جلسة القلق المحددة اليوم (Worry Window):' : 'Designated Worry Appointment:'}
                    </span>
                    <span className="text-[11px] text-amber-400/80">
                      {isAr ? '١٠ دقائق فقط في المساء لتصفية الذهن دون إفساد نهارك' : '10 minutes only in the evening'}
                    </span>
                  </div>
                  <input
                    type="time"
                    value={scheduledAppointment}
                    onChange={(e) => setScheduledAppointment(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 border border-amber-600/60 text-xs font-mono font-bold text-amber-300 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleLockCapsule}
                  disabled={!microStep.trim()}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:opacity-95 shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isAr ? 'إغلاق الكبسولة وتأجيلها حتى موعد المساء 🔒' : 'Lock Capsule & Postpone to Appointment 🔒'}</span>
                </button>
              </div>
            )}

            {/* Locked State Display */}
            {isCapsuleLocked && (
              <div className="w-full p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-2 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-emerald-200">
                  {isAr ? `تم إغلاق الكبسولة بنجاح حتى الساعة ${scheduledAppointment}!` : `Capsule Safely Locked until ${scheduledAppointment}!`}
                </h4>
                <p className="text-xs text-emerald-300/90 max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? `عقلك الآن حر للتركيز على حاضرك. موعدك القادم مع هذه الفكرة محجوز، والخطوة المصغرة جاهزة: «${microStep}».`
                    : `Your mind is freed to focus on your day. Your appointment is set with micro-action: "${microStep}".`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
