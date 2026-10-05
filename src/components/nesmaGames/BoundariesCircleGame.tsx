import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  ShieldCheck, 
  ShieldAlert, 
  Heart, 
  ArrowRight,
  Shield
} from 'lucide-react';

interface BoundariesCircleGameProps {
  language: Language;
  onBackToMap?: () => void;
}

const BOUNDARY_ITEMS = [
  { text: 'طلب سلف أو خدمة فوق استطاعتك وتوقيت راحتك', shouldAllow: false, reason: 'حقك أن تعتذر بلطف: «ودي أساعد بس مش هقدر الفترة دي».' },
  { text: 'كلمة طيبة ودعم صادق من صديق مخلص', shouldAllow: true, reason: 'افتحي قلبك للدعم والمحبة النظيفة؛ هي غذاء الروح.' },
  { text: 'نقد جارح وسخرية من مظهرك أو اختياراتك', shouldAllow: false, reason: 'هذا النقد يقف عند الباب؛ لا تسمحي له بالدخول لغرفتك الداخلية.' },
  { text: 'عتاب رقيق وبناء من شخص يحبك ويريد استمرار الود', shouldAllow: true, reason: 'العتاب المحب مساحة نقاش آمنة تقرب القلوب.' },
  { text: 'ابتزاز عاطفي وتحميلك ذنب تعكر مزاج شخص آخر', shouldAllow: false, reason: 'مشاعر الآخرين ومزاجهم مسؤوليتهم هم، وليست عبئاً عليكِ.' }
];

export const BoundariesCircleGame: React.FC<BoundariesCircleGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const currentItem = BOUNDARY_ITEMS[currentIndex];

  const handleDecide = (allowIn: boolean) => {
    soundManager.playSoftTap();
    setUserChoice(allowIn);
    if (allowIn === currentItem.shouldAllow) {
      soundManager.playHarmonicAffirmation();
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < BOUNDARY_ITEMS.length) {
      setCurrentIndex(prev => prev + 1);
      setUserChoice(null);
    } else {
      setCompleted(true);
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
    }
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'boundaries-circle',
      gameTitle: isAr ? 'حدودك حواليك' : 'Your Boundaries',
      quote: isAr ? 'وضع الحدود ليس أنانية ولا قسوة، بل صيانة لمساحتك الآمنة.' : 'Boundaries are not walls, but safe doors with doorknobs on the inside.',
      reflection: userReflection || (isAr ? 'تعلمت أن أقول لا بلطف ودون شعور بالذنب.' : 'Practiced saying a kind, firm no.'),
      tag: isAr ? 'الحدود النفسية' : 'Boundaries'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setCurrentIndex(0);
    setUserChoice(null);
    setCompleted(false);
    setIsSaved(false);
    setUserReflection('');
  };

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
          <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
            {isAr ? '٥. حدودك حواليك 🛡️' : '5. Your Boundaries 🛡️'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {currentIndex + 1} / {BOUNDARY_ITEMS.length}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-violet-800 uppercase tracking-wider block">
              {isAr ? 'صيانة المساحة الشخصية والأمان النفسي' : 'Protecting Your Emotional Space'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'هل تسمحين لهذا الشيء بالدخول لدائرتك؟' : 'Do you let this inside your safe circle?'}
            </h2>
            <p className="text-xs text-stone-500">
              {isAr ? 'أنت حارسة بابك الداخلي؛ اختاري ما يدخل وما يقف بالخارج' : 'You hold the keys to your inner sanctuary.'}
            </p>
          </div>

          {/* Central Sanctuary Circle Graphic */}
          <div className="relative py-4 flex items-center justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-dashed border-violet-300 bg-violet-50/50 flex flex-col items-center justify-center p-6 text-center space-y-2 relative shadow-inner">
              <span className="text-3xl">🌿</span>
              <span className="text-xs font-bold text-violet-900">{isAr ? 'مساحتك الآمنة' : 'Safe Sanctuary'}</span>
              <span className="text-[10px] text-stone-400">{isAr ? 'طاقتك وسلامك' : 'Your Energy'}</span>
            </div>
          </div>

          {/* Incoming Demand Card */}
          <div className="p-6 bg-stone-50 rounded-3xl border border-stone-200 shadow-sm max-w-md mx-auto space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              {isAr ? 'الطلب أو الكلمة الواقفة عند الباب:' : 'At Your Doorstep:'}
            </span>
            <p className="text-base sm:text-lg font-bold text-stone-900 font-serif leading-snug">
              «{currentItem.text}»
            </p>
          </div>

          {/* Choice Buttons */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <button
              onClick={() => handleDecide(true)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                userChoice === true
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
              }`}
            >
              <Heart className="w-5 h-5 text-emerald-700" />
              <span className="text-sm font-bold">{isAr ? 'أسمح له بالدخول 🚪' : 'Let Inside 🚪'}</span>
              <span className="text-[10px] text-stone-500">{isAr ? 'مرحب به ومغذي' : 'Nourishing'}</span>
            </button>

            <button
              onClick={() => handleDecide(false)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                userChoice === false
                  ? 'border-violet-600 bg-violet-50 text-violet-950 font-bold ring-2 ring-violet-500'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
              }`}
            >
              <Shield className="w-5 h-5 text-violet-700" />
              <span className="text-sm font-bold">{isAr ? 'يقف بالخارج بلطف 🛡️' : 'Keep Outside 🛡️'}</span>
              <span className="text-[10px] text-stone-500">{isAr ? 'أضع حداً آمناً' : 'Gentle Boundary'}</span>
            </button>
          </div>

          {/* Feedback */}
          {userChoice !== null && (
            <div className="p-4 bg-violet-50 border border-violet-200 rounded-2xl text-xs text-violet-950 space-y-2 animate-fade-in max-w-md mx-auto text-start">
              <span className="font-bold block">
                {isAr ? '💡 حكمة نسمة حياة في الحدود:' : '💡 Boundary Wisdom:'}
              </span>
              <p className="leading-relaxed text-stone-700">{currentItem.reason}</p>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'التالي' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mx-auto text-3xl">
            🛡️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'دائرتك مقدسة، وحدودك محبة لنفسك 🌿' : 'Your Boundaries Are an Act of Love'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«الحدود ليست جدراناً للقطيعة، بل أبواباً بمقابض داخلية أنت وحدك تملكين مفتاحها. لا أحد يدخل إلا بما يحفظ كرامتك».'
                : 'Boundaries are not walls of isolation, but doors with knobs on the inside.'}
            </p>
          </div>

          {/* Reflection Input */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 block">
              {isAr ? 'سؤال خفيف: ما هو الموقف الذي تنوين أن تقولي فيه «لا» بلطف هذا الأسبوع؟' : 'What is one situation where you choose to say a gentle no this week?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي موقفاً تضعين فيه حداً...' : 'A boundary you choose to keep...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-violet-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-700 hover:bg-violet-800 disabled:bg-violet-300 text-white rounded-xl text-xs font-bold cursor-pointer"
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
