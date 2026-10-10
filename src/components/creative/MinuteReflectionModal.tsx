import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { 
  X, 
  Sparkles, 
  Eye, 
  RotateCw, 
  Check, 
  ArrowRight, 
  Timer, 
  CheckCircle2, 
  Shuffle, 
  Lightbulb, 
  Compass
} from 'lucide-react';

interface MinuteReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onRewardXP?: (xp: number) => void;
}

type ExerciseType = 'observation' | 'perspective' | 'unravel';

export const MinuteReflectionModal: React.FC<MinuteReflectionModalProps> = ({
  isOpen,
  onClose,
  language,
  onRewardXP
}) => {
  if (!isOpen) return null;
  const isAr = language === 'ar';

  const [activeExercise, setActiveExercise] = useState<ExerciseType>('observation');
  const [stage, setStage] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [secondsLeft, setSecondsLeft] = useState<number>(45);

  // 1. Observation state
  const [observedItems, setObservedItems] = useState<Record<number, boolean>>({});

  // 2. Perspective state
  const [selectedInitial, setSelectedInitial] = useState<number | null>(null);
  const [isSecretRevealed, setIsSecretRevealed] = useState<boolean>(false);

  // 3. Unravel state
  const [unravelOrder, setUnravelOrder] = useState<number[]>([]);
  const targetUnravelSequence = [1, 2, 3, 4];

  // Timer effect
  useEffect(() => {
    if (stage !== 'playing') return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  const handleStart = (exercise: ExerciseType) => {
    soundManager.playSoftTap();
    setActiveExercise(exercise);
    setObservedItems({});
    setSelectedInitial(null);
    setIsSecretRevealed(false);
    setUnravelOrder([]);
    setSecondsLeft(exercise === 'perspective' ? 60 : 45);
    setStage('playing');
  };

  const handleFinish = () => {
    soundManager.playSuccess();
    setStage('completed');
    if (onRewardXP) {
      onRewardXP(80);
    }
  };

  const toggleObserved = (index: number) => {
    soundManager.playSoftTap();
    const next = { ...observedItems, [index]: !observedItems[index] };
    setObservedItems(next);
    if (Object.keys(next).filter((k) => next[Number(k)]).length >= 3) {
      setTimeout(() => handleFinish(), 500);
    }
  };

  const handleUnravelClick = (num: number) => {
    soundManager.playSoftTap();
    if (unravelOrder.includes(num)) return;
    const next = [...unravelOrder, num];
    setUnravelOrder(next);
    if (next.length === 4) {
      setTimeout(() => handleFinish(), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 dark:bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative text-start transition-colors space-y-5"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Timer className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                {isAr ? 'دقيقة تفكير ⏱️' : 'Minute of Reflection ⏱️'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {isAr ? 'تجارب تفاعلية سريعة (٣٠-٦٠ ثانية) لإعادة صفاء ذهنك' : 'Micro-actions resetting your perspective in 60s'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* INTRO SCREEN: Pick Exercise */}
        {stage === 'intro' && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {isAr 
                ? 'اختر تجربة سريعة تناسب دقيقتك الحالية. كل تجربة مصممة بآلية تفاعلية حقيقية تدرب عقلك على زاوية جديدة:'
                : 'Choose a 60-second micro-experience designed to unlock fresh perspective:'}
            </p>

            <div className="space-y-2.5">
              {/* Exercise 1 */}
              <button
                onClick={() => handleStart('observation')}
                className="w-full text-start p-4 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-emerald-500/60 bg-stone-50/60 dark:bg-stone-850 hover:bg-emerald-50/40 dark:hover:bg-stone-800 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {isAr ? '١. رادار الملاحظة الحية (٣ تفاصيل)' : '1. Live Observation Radar'}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isAr ? 'التقاط ٣ تفاصيل حسية في غرفتك لإيقاف فرط التفكير' : 'Spot 3 unnoticed sensory details in your room'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  ٤٥ ثانية
                </span>
              </button>

              {/* Exercise 2 */}
              <button
                onClick={() => handleStart('perspective')}
                className="w-full text-start p-4 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-amber-500/60 bg-stone-50/60 dark:bg-stone-850 hover:bg-amber-50/40 dark:hover:bg-stone-800 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <RotateCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {isAr ? '٢. المنظور المتحول (المعلومة الخفية)' : '2. The Shifting Angle'}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isAr ? 'اختر تفسيرك ثم اكشف الحقيقة التي تغير المعنى ١٨٠ درجة' : 'Test an assumption, then uncover the missing link'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  ٦٠ ثانية
                </span>
              </button>

              {/* Exercise 3 */}
              <button
                onClick={() => handleStart('unravel')}
                className="w-full text-start p-4 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-indigo-500/60 bg-stone-50/60 dark:bg-stone-850 hover:bg-indigo-50/40 dark:hover:bg-stone-800 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Shuffle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                      {isAr ? '٣. فك تشابك الأفكار الخاطف' : '3. Rapid Unraveling Sequence'}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isAr ? 'ترتيب خطوات الخروج من العقدة الذهنية خطوة بخطوة' : 'Sequence the 4 steps that unlock mental loops'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  ٤٥ ثانية
                </span>
              </button>
            </div>
          </div>
        )}

        {/* PLAYING SCREEN: Active micro-exercise */}
        {stage === 'playing' && (
          <div className="space-y-4 animate-fade-in">
            {/* Top timer bar */}
            <div className="flex items-center justify-between bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl text-xs font-bold">
              <span className="text-stone-600 dark:text-stone-300">
                {activeExercise === 'observation' && (isAr ? 'تحدي الملاحظة الحية' : 'Observation Radar')}
                {activeExercise === 'perspective' && (isAr ? 'المنظور المتحول' : 'Shifting Perspective')}
                {activeExercise === 'unravel' && (isAr ? 'فك التشابك' : 'Rapid Unravel')}
              </span>
              <span className="font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                <span>{secondsLeft} ثانية</span>
              </span>
            </div>

            {/* EXERCISE 1: OBSERVATION */}
            {activeExercise === 'observation' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {isAr 
                    ? 'التفت حولك في غرفتك الآن بهدوء، واعثر على هذه التفاصيل الثلاثة واضغط على كل كارت عند رصده:'
                    : 'Look around your room right now. Find these 3 items and check them off:'}
                </p>

                <div className="space-y-2">
                  {[
                    { id: 1, text: isAr ? 'عنصر لونه أزرق أو لونه بارد مريح للعين' : 'Something blue or cold-colored in your view' },
                    { id: 2, text: isAr ? 'ملمس ناعم أو خشبي يمكنك لمسه بيدك الآن' : 'A texture (wood, fabric) you can touch now' },
                    { id: 3, text: isAr ? 'تفصيلة دقيقة في الغرفة لم تنتبه لوجودها منذ أيام' : 'A small detail you haven’t paid attention to in days' }
                  ].map((item) => {
                    const isChecked = !!observedItems[item.id];
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleObserved(item.id)}
                        className={`w-full text-start p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isChecked 
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-200' 
                            : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <span className="text-xs font-semibold">{item.text}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EXERCISE 2: PERSPECTIVE */}
            {activeExercise === 'perspective' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                  <span className="font-bold block mb-1">الموقف:</span>
                  «زميلك في العمل أو الدراسة لم يلقِ عليك التحية اليوم ومر بجانبك بوجه عابس دون أن ينظر إليك».
                </div>

                {!isSecretRevealed ? (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                      ما هو التفسير التلقائي الأول الذي يهمس به عقلك؟
                    </span>
                    {[
                      { id: 1, text: '«هو متجاهلني ومضايق مني أو عملت حاجة غلط»' },
                      { id: 2, text: '«هو شخص متكبر ومش بيحب يتعامل معايا»' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedInitial(opt.id)}
                        className={`w-full text-start p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                          selectedInitial === opt.id 
                            ? 'bg-amber-100 dark:bg-amber-900/60 border-amber-500 text-amber-950 dark:text-amber-100' 
                            : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}

                    {selectedInitial && (
                      <button
                        onClick={() => {
                          soundManager.playSoftTap();
                          setIsSecretRevealed(true);
                        }}
                        className="w-full mt-2 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-transform hover:scale-102 flex items-center justify-center gap-1.5"
                      >
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <span>اكشفي المعلومة الخفية الصادمة 🔍</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200 animate-fade-in leading-relaxed">
                    <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                      <Sparkles className="w-4 h-4" />
                      <span>المعلومة الخفية التي لم تكن تعرفها:</span>
                    </div>
                    <p>
                      «هذا الزميل كان قادماً من المستشفى لتوه بعد تعرض والدته لوعكة صحية طارئة، وعقله مشتت بالكامل ولم يرَ أمامه شبحاً من شدة الصدمة».
                    </p>
                    <button
                      onClick={handleFinish}
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer transition-colors mt-2"
                    >
                      فهمت الدرس.. إنهاء التجربة 🌿
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* EXERCISE 3: UNRAVEL */}
            {activeExercise === 'unravel' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {isAr 
                    ? 'رتّب الخطوات الأربع بالتسلسل السليم للخروج من دوامة التفكير المفرط (اضغط بالترتيب الصحيح):'
                    : 'Sequence the 4 steps to escape overthinking in correct order:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 1, text: '١. وقفة أنفاس طويلة وتنزيل الأكتاف' },
                    { id: 2, text: '٢. تسمية الشعور الحقيقي بدقة دون لوم' },
                    { id: 3, text: '٣. فصل ما بيدك عما ليس بيدك' },
                    { id: 4, text: '٤. اتخاذ خطوة صغيرة متناهية الصغر' }
                  ].map((step) => {
                    const isPicked = unravelOrder.includes(step.id);
                    const pickIndex = unravelOrder.indexOf(step.id) + 1;
                    return (
                      <button
                        key={step.id}
                        onClick={() => handleUnravelClick(step.id)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-start transition-all cursor-pointer flex items-center justify-between ${
                          isPicked 
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200' 
                            : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-stone-400 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <span>{step.text}</span>
                        {isPicked && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                            {pickIndex}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* COMPLETED SCREEN */}
        {stage === 'completed' && (
          <div className="text-center py-4 space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
              ✨
            </div>
            <div>
              <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                {isAr ? 'أحسنت! أتممت دقيقة التفكير بنجاح 🌿' : 'Great job! Minute of reflection complete 🌿'}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto leading-relaxed">
                {isAr
                  ? 'دقيقة واحدة من اليقظة وإعادة التوجيه كافية لخفض نشاط اللوزة الدماغية واستعادة زمام الموقف.'
                  : 'A single 60s pause is enough to silence automatic threat loops and restore autonomy.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setStage('intro')}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isAr ? 'تجربة أخرى ↺' : 'Another Minute'}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                {isAr ? 'العودة للمغامرة' : 'Back to Adventure'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
