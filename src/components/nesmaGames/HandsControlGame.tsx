import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Check, 
  Bookmark, 
  ArrowRight,
  Hand,
  CloudRain
} from 'lucide-react';

interface HandsControlGameProps {
  language: Language;
  onBackToMap?: () => void;
}

const ITEMS_DATA = [
  { text: 'رأي الناس وكلامهم عني', inHands: false, note: 'رأي الآخرين يخص عوالمهم وظروفهم، وليس بيدك التحكم فيه.' },
  { text: 'المجهود اللي ببذله النهاردة', inHands: true, note: 'سعيك اليوم وساعات تركيزك هي مساحتك الحقيقية.' },
  { text: 'الماضي والقرارات اللي فاتت', inHands: false, note: 'الماضي انتهى وخرج من حيز التأثير المباشر، ما بيدك هو الحاضر.' },
  { text: 'طريقة ردي لما أتعصب', inHands: true, note: 'بين الغضب وردة الفعل مساحة حرة؛ قرار ردك بيدك أنت وحدك.' },
  { text: 'نتيجة الامتحان أو المقابلة', inHands: false, note: 'النتيجة خاضعة لعوامل متعددة؛ سهمك هو السعي لا النتيجة.' },
  { text: 'ساعات نومي واهتمامي بصحتي', inHands: true, note: 'وضع هاتفك جانباً وإكرام جسدك بالراحة قرار تصنعه أنت.' },
  { text: 'الزحمة وتأخر المواصلات', inHands: false, note: 'عوامل الطريق خارجة عن إرادتك؛ بيدك فقط كيف تتنفس وتنتظر.' },
  { text: 'الحدود اللي بطلبها بلطف من غيري', inHands: true, note: 'التعبير عن حدودك الشخصية حقك الكامل ومسؤوليتك.' }
];

export const HandsControlGame: React.FC<HandsControlGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const currentItem = ITEMS_DATA[currentIndex];

  const handleChoice = (choiceInHands: boolean) => {
    soundManager.playSoftTap();
    setUserChoice(choiceInHands);
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < ITEMS_DATA.length) {
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
      gameId: 'hands-control',
      gameTitle: isAr ? 'في إيدي / برّا إيدي' : 'In My Hands / Outside',
      quote: isAr ? 'طاقتي أثمن من أن تضيع في محاولة السيطرة على ما ليس بيدي.' : 'My energy is too precious to waste on what I cannot control.',
      reflection: userReflection || (isAr ? 'أدركت اليوم الفرق بين ما أملكه وما لا أملكه.' : 'Recognized my circle of control.'),
      tag: isAr ? 'دائرة السيطرة' : 'Control'
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
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {isAr ? '١. في إيدي / برّا إيدي 🤲' : '1. In My Hands / Outside 🤲'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {currentIndex + 1} / {ITEMS_DATA.length}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              {isAr ? 'دائرة السيطرة والاطمئنان' : 'Circle of Control'}
            </span>
            <p className="text-xs text-stone-500">
              {isAr ? 'اقرأ هذا الأمر واسأل نفسك: هل هو في يدك أم خارج يدك؟' : 'Ask yourself: Is this truly in your hands or outside?'}
            </p>
          </div>

          {/* Item Card */}
          <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 shadow-inner">
            <p className="text-xl sm:text-2xl font-bold text-stone-900 font-serif leading-snug">
              «{currentItem.text}»
            </p>
          </div>

          {/* Two Choice Buttons */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <button
              onClick={() => handleChoice(true)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                userChoice === true
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
              }`}
            >
              <Hand className="w-6 h-6 text-emerald-700" />
              <span className="text-sm font-bold">{isAr ? 'في إيدي 🤲' : 'In My Hands'}</span>
              <span className="text-[10px] text-stone-500">{isAr ? 'أملك التأثير فيه' : 'I can control'}</span>
            </button>

            <button
              onClick={() => handleChoice(false)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                userChoice === false
                  ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-500'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
              }`}
            >
              <CloudRain className="w-6 h-6 text-sky-700" />
              <span className="text-sm font-bold">{isAr ? 'برّا إيدي 🌧️' : 'Outside Hands'}</span>
              <span className="text-[10px] text-stone-500">{isAr ? 'أفوّض وأسلّم' : 'Outside control'}</span>
            </button>
          </div>

          {/* Gentle Educational Note */}
          {userChoice !== null && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-2 animate-fade-in max-w-md mx-auto text-start">
              <span className="font-bold block">
                {isAr ? (currentItem.inHands ? '✨ هذا في يدك:' : '🌿 هذا خارج يدك:') : 'Insight:'}
              </span>
              <p className="leading-relaxed text-stone-700">{currentItem.note}</p>

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
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl">
            🤲
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'خفّف الحمل عما ليس في يدك 🌿' : 'Lighten What is Not in Your Hands'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«اللهم امنحني السكينة لأتقبل ما لا أستطيع تغييره، والشجاعة لأغير ما أستطيع، والحكمة لأميز بينهما».'
                : 'Grant me the serenity to accept what I cannot change, the courage to change what I can, and the wisdom to know the difference.'}
            </p>
          </div>

          {/* Reflection Input */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 block">
              {isAr ? 'سؤال خفيف: ما هو الشيء الوحيد الذي تقرر أن تتركه وشأنه اليوم؟' : 'What is one thing you choose to let go of today?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتب خاطرة خفيفة لنفسك...' : 'A gentle personal note...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white rounded-xl text-xs font-bold cursor-pointer"
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
