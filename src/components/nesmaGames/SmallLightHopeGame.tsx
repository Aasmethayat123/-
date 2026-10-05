import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  Sun, 
  Flame, 
  ArrowRight,
  Heart
} from 'lucide-react';

interface SmallLightHopeGameProps {
  language: Language;
  onBackToMap?: () => void;
}

const HOPE_ANCHORS = [
  'نَفَس عميق يدخل رئتيك الآن ويجدد خلاياك',
  'شخص واحد في العالم يتمنى لك الخير والسكينة',
  'صباح جديد وفرصة غير مكتوبة بعد',
  'قوتك الداخلية التي عبرت بك كل الأيام الصعبة السابقة',
  'رحمة الله الواسعة التي تسع ضعفك واحتياجك'
];

export const SmallLightHopeGame: React.FC<SmallLightHopeGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [lightStep, setLightStep] = useState<number>(1); // 1 to 5
  const [completed, setCompleted] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const maxSteps = HOPE_ANCHORS.length;

  const handleFeedLight = () => {
    soundManager.playHarmonicAffirmation();
    if (lightStep < maxSteps) {
      setLightStep(prev => prev + 1);
    } else {
      setCompleted(true);
      soundManager.playLevelUpFanfare();
      triggerConfetti(0.5, 0.4);
    }
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'small-light',
      gameTitle: isAr ? 'نور صغير (الرجاء)' : 'A Little Light (Hope)',
      quote: isAr ? 'يكفي نور صغير جداً ليبدد أعتى الظلمات.' : 'A tiny light is enough to pierce the darkest night.',
      reflection: userReflection || (isAr ? 'تذكرت أن في قلبي نوراً حياً لا ينطفئ.' : 'Remembered the living spark within.'),
      tag: isAr ? 'الرجاء والأمل' : 'Hope'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setLightStep(1);
    setCompleted(false);
    setIsSaved(false);
    setUserReflection('');
  };

  const lightGlowSize = 80 + lightStep * 45;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            {isAr ? '٩. نور صغير (الرجاء) 🕯️' : '9. A Little Light (Hope) 🕯️'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {lightStep} / {maxSteps}
        </span>
      </div>

      {!completed ? (
        <div className="bg-stone-950 text-white rounded-3xl border-2 border-stone-800 p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              {isAr ? 'حتى في أعتى الظلمات.. الرجاء حي' : 'The Living Spark of Hope'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
              {isAr ? 'انقري لتغذية نقطة النور وتوسيعها 🕯️' : 'Tap to Grow the Golden Spark 🕯️'}
            </h2>
            <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
              {isAr
                ? 'مهما ثقل الحزن، توجد دائماً ذرة نور صادقة في أعماقك. مع كل نقرة ونَفَس هادئ، يتسع النور ليدفئ قلبك.'
                : 'No matter the darkness, a quiet ember remains. Breathe and tap to feed the light.'}
            </p>
          </div>

          {/* Interactive Light Sphere */}
          <div className="py-8 relative h-64 flex items-center justify-center">
            {/* Glowing Orb */}
            <div 
              onClick={handleFeedLight}
              className="rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-100 flex items-center justify-center cursor-pointer transform hover:scale-105 transition-all duration-700 select-none shadow-[0_0_60px_rgba(245,158,11,0.6)]"
              style={{
                width: `${lightGlowSize}px`,
                height: `${lightGlowSize}px`,
                boxShadow: `0 0 ${lightStep * 25}px rgba(251, 191, 36, 0.75)`
              }}
            >
              <span className="text-3xl sm:text-4xl animate-pulse">✨</span>
            </div>
          </div>

          {/* Hope Anchor Phrase */}
          <div className="p-4 bg-stone-900/90 rounded-2xl border border-stone-800 max-w-md mx-auto space-y-1 relative z-10">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              {isAr ? 'بذرة النور الحالية:' : 'Present Spark of Hope:'}
            </span>
            <p className="text-sm font-semibold text-stone-200 font-serif">
              «{HOPE_ANCHORS[lightStep - 1]}»
            </p>
          </div>

          <div className="flex justify-center pt-2 relative z-10">
            <button
              onClick={handleFeedLight}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-2xl text-xs font-extrabold shadow-lg cursor-pointer transform hover:scale-105 transition-all"
            >
              {isAr ? 'تغذية النور بنَفَس هادئ ✨' : 'Feed the Light ✨'}
            </button>
          </div>
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
            ☀️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'أشرق النور في أعماقك 🌿' : 'The Light Has Dawned Within 🌿'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«لا تخافي من العتمة؛ الظلام لا يملك قوة حقيقية، هو فقط غياب للنور. ونورك الحقيقي في قلبك ينتظر أن تتذكريه».'
                : 'Darkness has no power of its own; it is only the absence of light. Your living spark remains.'}
            </p>
          </div>

          {/* Reflection Input */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 block">
              {isAr ? 'سؤال خفيف: ما هو الشيء الدافئ الذي تشعرين بالامتنان له في هذه اللحظة؟' : 'What warm thing are you grateful for in this moment?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي نورك الصغير...' : 'A grateful spark...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة' : 'Replay'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'قائمة الألعاب' : 'All Games'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
