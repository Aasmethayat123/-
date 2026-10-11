import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Scissors, 
  Waves, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  Bookmark, 
  Trash2, 
  Wind, 
  HeartHandshake,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

interface ThoughtShredderGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

const PRESET_THOUGHTS_AR = [
  '«أنا متأخر جداً عن أقراني وسأفشل في اللحاق بهم»',
  '«لو أخطأت أمام الناس سيسخرون مني وتتدمر سمعتي»',
  '«يجب أن أكون كاملاً ومثالياً في كل شيء وإلا فلا فائدة مني»',
  '«لا أحد يفهمني بصدق ولن أتلقى التقدير أبداً»',
  '«أنا شخص سيئ لأنني شعرت بهذا الشعور المؤلم»'
];

const PRESET_THOUGHTS_EN = [
  '"I am hopelessly falling behind and will fail to catch up"',
  '"If I make a mistake in public, everyone will judge me"',
  '"I must be flawless in everything, or I am worthless"',
  '"Nobody truly understands me and I will never be appreciated"',
  '"I am a bad person because I felt this dark emotion"'
];

export const ThoughtShredderGame: React.FC<ThoughtShredderGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const presetThoughts = isAr ? PRESET_THOUGHTS_AR : PRESET_THOUGHTS_EN;

  const [activeMode, setActiveMode] = useState<'shredder' | 'river'>('shredder');
  const [selectedThought, setSelectedThought] = useState<string>(presetThoughts[0]);
  const [customInput, setCustomInput] = useState<string>('');
  
  // Shredder animation state
  const [shredProgress, setShredProgress] = useState<number>(0); // 0 to 100
  const [isShredding, setIsShredding] = useState<boolean>(false);
  const [isShredded, setIsShredded] = useState<boolean>(false);

  // River state
  const [leafPosition, setLeafPosition] = useState<number>(0); // 0 to 100% across screen
  const [isDrifting, setIsDrifting] = useState<boolean>(false);
  const [isDriftComplete, setIsDriftComplete] = useState<boolean>(false);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showHowTo, setShowHowTo] = useState<boolean>(false);

  const currentThoughtText = customInput.trim() ? customInput.trim() : selectedThought;

  // Handle shred animation interval
  useEffect(() => {
    if (!isShredding) return;
    const interval = setInterval(() => {
      setShredProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsShredding(false);
          setIsShredded(true);
          soundManager.playSuccess();
          triggerConfetti();
          if (onAddXP) onAddXP(35);
          return 100;
        }
        soundManager.playPaperShred();
        return prev + 12;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [isShredding, onAddXP]);

  // Handle river drift animation
  useEffect(() => {
    if (!isDrifting) return;
    const interval = setInterval(() => {
      setLeafPosition((prev) => {
        if (prev >= 110) {
          clearInterval(interval);
          setIsDrifting(false);
          setIsDriftComplete(true);
          soundManager.playSuccess();
          triggerConfetti();
          if (onAddXP) onAddXP(35);
          return 110;
        }
        return prev + 3;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isDrifting, onAddXP]);

  const handleStartShred = () => {
    if (!currentThoughtText || isShredding || isShredded) return;
    soundManager.playPaperShred();
    setShredProgress(5);
    setIsShredding(true);
  };

  const handleStartRiverDrift = () => {
    if (!currentThoughtText || isDrifting || isDriftComplete) return;
    soundManager.playBreathBell(true);
    setLeafPosition(5);
    setIsDrifting(true);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setShredProgress(0);
    setIsShredding(false);
    setIsShredded(false);
    setLeafPosition(0);
    setIsDrifting(false);
    setIsDriftComplete(false);
    setIsSaved(false);
  };

  const handleSaveMoment = () => {
    if (isSaved) return;
    soundManager.playCoinSound();
    saveMoment({
      gameId: 'thought-shredder',
      gameTitle: isAr ? 'مفرمة الأفكار ونهر التحرر' : 'Thought Shredder & River',
      quote: currentThoughtText,
      reflection: isAr 
        ? `مارست فك الاندماج المعرفي (ACT) مع فكرة: ${currentThoughtText}. أدركت أن الفكرة مجرد موجة عابرة في دماغي وليست حقيقة مقدسة تتحكم في مصيري.`
        : `Practiced ACT cognitive defusion on: ${currentThoughtText}. Recognized that thoughts are just mental leaves drifting away.`,
      tag: isAr ? 'فك الاندماج' : 'Defusion'
    });
    setIsSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-teal-600 text-white flex items-center justify-center shadow-md">
            {activeMode === 'shredder' ? <Scissors className="w-6 h-6" /> : <Waves className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              {isAr ? 'مفرمة الأفكار ونهر التحرر' : 'Thought Shredder & River'}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 font-bold">
                ACT Defusion
              </span>
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isAr ? 'فك الاندماج المعرفي وتمزيق شوائب العقل أو تركها تطفو بعيداً كأوراق الشجر' : 'Cognitive defusion: shred intrusive thoughts or watch them float downriver'}
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

      {/* Scientific Explanation Info */}
      {showHowTo && (
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 text-xs sm:text-sm text-teal-900 dark:text-teal-200 space-y-2 animate-fade-in">
          <h4 className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {isAr ? 'ما هو فك الاندماج المعرفي (Cognitive Defusion)؟' : 'What is Cognitive Defusion?'}
          </h4>
          <p className="leading-relaxed">
            {isAr 
              ? 'في العلاج بالقبول والالتزام (ACT)، نحن لا نحارب الأفكار المزعجة ولا نجادلها، بل نغير علاقتنا بها. أنت لست الفكرة؛ أنت الوعي الذي يلاحظها. تمزيقها حسياً أو مراقبتها تطفو في النهر يعيد تدريب المخ على عدم التماهي مع الأوهام.'
              : 'In ACT therapy, we don’t fight thoughts. We change our relationship with them. You are not your thoughts; you are the awareness observing them. Watch them dissolve without getting hooked.'}
          </p>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800">
        <button
          onClick={() => {
            soundManager.playSoftTap();
            setActiveMode('shredder');
            handleReset();
          }}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === 'shredder'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>{isAr ? 'المفرمة الواعية (تمزيق فيزيائي)' : 'Mindful Shredder (Tactile)'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSoftTap();
            setActiveMode('river');
            handleReset();
          }}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === 'river'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Waves className="w-4 h-4" />
          <span>{isAr ? 'نهر أوراق الشجر (تأمل التدفق)' : 'Leaves on a Stream (Flow)'}</span>
        </button>
      </div>

      {/* Thought Selection & Writing Area */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
            {isAr ? '١. اختر فكرة خانقة شائعة أو اكتب فكرتك الخاصة:' : '1. Choose an intrusive thought or write your own:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {presetThoughts.map((thought, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundManager.playSoftTap();
                  setSelectedThought(thought);
                  setCustomInput('');
                  handleReset();
                }}
                className={`p-2.5 rounded-xl text-start text-xs font-medium transition cursor-pointer border ${
                  selectedThought === thought && !customInput
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 font-bold'
                    : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                }`}
              >
                {thought}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                if (isShredded || isDriftComplete) handleReset();
              }}
              placeholder={isAr ? 'أو اكتب فكرة مؤرقة في رأسك الآن...' : 'Or type a painful thought in your mind right now...'}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* INTERACTIVE EXPERIENCE ARENA */}
      {activeMode === 'shredder' ? (
        /* SHREDDER ARENA */
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 text-white border-2 border-stone-800 shadow-2xl space-y-6 overflow-hidden relative">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <Scissors className="w-4 h-4" />
              {isAr ? 'محطة التمزيق المعرفي' : 'Defusion Shredding Chamber'}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {shredProgress}% {isAr ? 'مكتمل' : 'Shredded'}
            </span>
          </div>

          {/* Shredder Machine Graphical Representation */}
          <div className="relative max-w-md mx-auto min-h-[260px] flex flex-col items-center justify-center">
            {/* The Paper Document */}
            {!isShredded && (
              <div 
                className="w-72 p-4 rounded-xl bg-amber-50 text-stone-900 shadow-2xl border-2 border-amber-200 transition-all duration-300 relative z-10"
                style={{
                  transform: `translateY(${shredProgress * 0.8}px) scale(${1 - shredProgress * 0.003})`,
                  opacity: Math.max(0.1, 1 - shredProgress * 0.01)
                }}
              >
                <div className="text-[10px] text-stone-400 font-mono pb-1 border-b border-stone-200 mb-2 flex justify-between">
                  <span>{isAr ? 'مسوّدة ذهن مؤقتة' : 'Mental Draft'}</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-stone-800 leading-relaxed text-center py-2">
                  {currentThoughtText}
                </p>
                <div className="mt-2 pt-2 border-t border-dashed border-stone-300 text-center text-[10px] text-rose-500 font-bold">
                  {isAr ? '«كلمات عابرة.. وليست هوية أبدية»' : 'Just thoughts, not facts'}
                </div>
              </div>
            )}

            {/* Shredder Mouth Slot */}
            <div className="w-80 h-10 rounded-2xl bg-stone-800 border-2 border-stone-700 shadow-inner flex items-center justify-center relative z-20 mt-4">
              <div className="w-72 h-2.5 bg-black rounded-full shadow-inner border border-stone-900" />
            </div>

            {/* Paper Shredded Strips falling below */}
            {shredProgress > 0 && !isShredded && (
              <div className="flex gap-1.5 justify-center mt-2 z-10 animate-pulse">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 rounded-sm bg-amber-100 shadow-md animate-bounce"
                    style={{ 
                      height: `${20 + (i % 4) * 15}px`,
                      animationDelay: `${i * 40}ms`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Shredded Result Confetti Box */}
            {isShredded && (
              <div className="p-6 rounded-2xl bg-stone-800/80 border border-emerald-500/50 text-center space-y-3 animate-fade-in max-w-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'تم تمزيق الفكرة وتحرير دماغك!' : 'Thought Shredded & Defused!'}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isAr 
                    ? 'رأيت بأم عينك كيف تلاشت الفكرة إلى قصاصات ورقية خاملة. الفكرة فقدت سحرها التدميري؛ إنها مجرد شحنة كهربائية انتهت صلاحيتها.'
                    : 'You witnessed the thought dissolve into harmless scraps. It has no authority over your actions or self-worth.'}
                </p>
              </div>
            )}
          </div>

          {/* Action Shred Button */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!isShredded ? (
              <button
                onClick={handleStartShred}
                disabled={isShredding}
                className="px-8 py-3 bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white rounded-2xl text-sm font-black shadow-lg transition-transform hover:scale-103 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                <span>
                  {isShredding 
                    ? (isAr ? 'جاري التمزيق الحركي..' : 'Shredding in progress..') 
                    : (isAr ? 'ابدأ تمزيق هذه الفكرة الآن (+35 XP)' : 'Shred This Thought Now (+35 XP)')}
                </span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isAr ? 'تمزيق فكرة أخرى' : 'Shred Another Thought'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* RIVER / STREAM ARENA */
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-sky-950 via-teal-950 to-stone-950 text-white border-2 border-teal-800/60 shadow-2xl space-y-6 overflow-hidden relative">
          <div className="flex items-center justify-between pb-3 border-b border-teal-900/60">
            <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
              <Waves className="w-4 h-4" />
              {isAr ? 'تأمل «أوراق الشجر على النهر» (Leaves on a Stream)' : 'Leaves on a Stream Meditation'}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {leafPosition > 100 ? 100 : leafPosition}% {isAr ? 'طفو' : 'Drift'}
            </span>
          </div>

          {/* River Stream Canvas / Visual */}
          <div className="relative h-64 rounded-2xl bg-gradient-to-r from-teal-900/40 via-cyan-900/50 to-teal-900/40 border border-teal-500/30 overflow-hidden flex items-center justify-start px-6">
            {/* Rippling river water waves background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-400 via-transparent to-transparent animate-pulse" />
            </div>

            {/* Floating Autumn Leaf with the Thought text */}
            <div 
              className="absolute transition-all duration-300 ease-out z-10 flex flex-col items-center"
              style={{
                left: `${leafPosition}%`,
                opacity: leafPosition > 95 ? Math.max(0, (110 - leafPosition) / 15) : 1,
                transform: `translateY(${Math.sin(leafPosition * 0.2) * 12}px) rotate(${leafPosition * 0.3}deg)`
              }}
            >
              {/* Leaf graphic */}
              <div className="w-44 p-3 rounded-3xl bg-gradient-to-br from-amber-600 via-emerald-600 to-amber-700 text-stone-950 shadow-2xl border border-amber-300/40 relative">
                <span className="text-[10px] text-white/90 font-mono font-bold block text-center mb-1">
                  🍃 {isAr ? 'ورقة فكرة طافية' : 'Floating Leaf'}
                </span>
                <p className="text-[11px] font-bold text-white text-center leading-tight">
                  {currentThoughtText}
                </p>
              </div>
              {/* Ripple ring under leaf */}
              <div className="w-16 h-2 rounded-full bg-cyan-400/30 blur-xs mt-1 animate-ping" />
            </div>

            {/* Visual Guide Text in the River Center */}
            <div className="mx-auto text-center z-0 opacity-40 text-xs sm:text-sm font-medium text-teal-200">
              {isDrifting 
                ? (isAr ? 'تنفس بهدوء.. راقب الورقة تبتعد دون أن تقفز في الماء معها' : 'Breathe slowly.. watch it drift without jumping into the river')
                : (isAr ? 'ضع الفكرة على ورقة الشجر ودع التيار يحملها بعيداً' : 'Place thought on the leaf and let the current carry it away')}
            </div>
          </div>

          {/* Action Drift Button */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!isDriftComplete ? (
              <button
                onClick={handleStartRiverDrift}
                disabled={isDrifting}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-2xl text-sm font-black shadow-lg transition-transform hover:scale-103 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Wind className="w-4 h-4" />
                <span>
                  {isDrifting 
                    ? (isAr ? 'جاري التدفق مع أنفاسك..' : 'Drifting along your breath..') 
                    : (isAr ? 'أطلق الورقة في النهر (+35 XP)' : 'Release Leaf Downriver (+35 XP)')}
                </span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isAr ? 'إطلاق فكرة أخرى في النهر' : 'Release Another Thought'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Save Moment in Journey Notebook Card */}
      {(isShredded || isDriftComplete) && (
        <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-800 text-stone-900 dark:text-stone-100 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-sm sm:text-base font-bold">
                {isAr ? 'لحظة تحرر نفسي موثقة' : 'Liberating Moment Recorded'}
              </h4>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
              +35 XP
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {isAr 
              ? `لقد نجحت في فصل ذاتك عن فكرة: «${currentThoughtText}». كلما مارست هذا التحرر، أصبح دماغك أكثر مرونة في إسقاط الشحنات السلبية تلقائياً.`
              : `You successfully unhooked yourself from this thought. Regular defusion builds cognitive flexibility.`}
          </p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveMoment}
              disabled={isSaved}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-stone-900 dark:bg-emerald-700 hover:bg-stone-800 text-white shadow-md hover:scale-102'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>
                {isSaved 
                  ? (isAr ? 'محفوظ في دفتر رحلتي ✓' : 'Saved in Journey ✓')
                  : (isAr ? 'توثيق هذا التحرر في دفتر رحلتي' : 'Save Moment to Notebook')}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ThoughtShredderGame;
