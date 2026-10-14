import React, { useState, useRef } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  Hand,
  CloudRain,
  Move,
  CheckCircle2,
  HelpCircle
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

  // Kinetic Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const currentItem = ITEMS_DATA[currentIndex];

  const handleChoice = (choiceInHands: boolean) => {
    soundManager.playSoftTap();
    setUserChoice(choiceInHands);
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (userChoice !== null) return;
    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || userChoice !== null) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    // If dragged significantly towards one of the sides:
    // In RTL: Dragging Left (negative x) towards In-Hands or Right (positive x) towards Outside
    const threshold = 75;
    if (dragOffset.x < -threshold) {
      // Dragged to one zone
      handleChoice(isAr ? false : true);
    } else if (dragOffset.x > threshold) {
      // Dragged to opposite zone
      handleChoice(isAr ? true : false);
    } else {
      // Snap back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < ITEMS_DATA.length) {
      setCurrentIndex(prev => prev + 1);
      setUserChoice(null);
      setDragOffset({ x: 0, y: 0 });
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
      reflection: userReflection || (isAr ? 'أدركت اليوم الفرق بين ما أملكه وما لا أملكه عبر الفرز الحركي.' : 'Recognized my circle of control.'),
      tag: isAr ? 'دائرة السيطرة' : 'Control'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setCurrentIndex(0);
    setUserChoice(null);
    setDragOffset({ x: 0, y: 0 });
    setCompleted(false);
    setIsSaved(false);
    setUserReflection('');
  };

  // Hover zone active states based on drag position
  const isHoveringInHands = isAr ? dragOffset.x > 50 : dragOffset.x < -50;
  const isHoveringOutside = isAr ? dragOffset.x < -50 : dragOffset.x > 50;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in select-none">
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
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Hand className="w-3.5 h-3.5" />
            <span>{isAr ? '١. في إيدي / برّا إيدي (فرز حركي) 🤲' : '1. In My Hands / Outside 🤲'}</span>
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
              {isAr ? 'دائرة السيطرة والاطمئنان (سحب وإفلات تفاعلي)' : 'Circle of Control (Tactile Drag & Drop)'}
            </span>
            <p className="text-xs text-stone-500 flex items-center justify-center gap-1">
              <Move className="w-3 h-3 text-stone-400" />
              <span>{isAr ? 'اسحب البطاقة بيدك نحو الكف أو السحابة، أو انقر للاختيار مباشرة' : 'Drag card towards the Hand or Cloud, or tap to choose'}</span>
            </p>
          </div>

          {/* Kinetic Card with Pointer Events & Shadow */}
          <div className="relative py-4 flex items-center justify-center min-h-[160px]">
            <div
              ref={cardRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                transform: `translate3d(${dragOffset.x}px, ${dragOffset.y * 0.4}px, 0) rotate(${dragOffset.x * 0.04}deg)`,
                transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border-2 select-none touch-none cursor-grab active:cursor-grabbing transition-shadow ${
                isDragging 
                  ? 'shadow-2xl ring-4 ring-emerald-300/60 scale-102 bg-white border-emerald-400' 
                  : 'shadow-md bg-stone-50 hover:bg-stone-100/80 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-stone-400 text-[11px] font-bold mb-2">
                <Move className="w-3.5 h-3.5" />
                <span>{isAr ? 'اسحبني بيدك 🖐️' : 'Drag me 🖐️'}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-stone-900 font-serif leading-snug">
                «{currentItem.text}»
              </p>
            </div>
          </div>

          {/* Two Tactile Drop Targets / Choice Buttons */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {/* IN HANDS ZONE */}
            <button
              onClick={() => handleChoice(true)}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                userChoice === true
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500 scale-102 shadow-md'
                  : isHoveringInHands
                  ? 'border-emerald-500 bg-emerald-100/60 text-emerald-900 ring-4 ring-emerald-300 scale-105'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800 hover:border-emerald-300'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Hand className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">{isAr ? 'في إيدي 🤲' : 'In My Hands'}</span>
              <span className="text-[10px] text-stone-500">{isAr ? 'أملك التأثير والسعي' : 'I can control'}</span>
            </button>

            {/* OUTSIDE HANDS ZONE */}
            <button
              onClick={() => handleChoice(false)}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                userChoice === false
                  ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-500 scale-102 shadow-md'
                  : isHoveringOutside
                  ? 'border-sky-500 bg-sky-100/60 text-sky-900 ring-4 ring-sky-300 scale-105'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800 hover:border-sky-300'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">{isAr ? 'برّا إيدي 🌧️' : 'Outside Hands'}</span>
              <span className="text-[10px] text-stone-500">{isAr ? 'أفوّض وأسلّم بسلام' : 'Outside control'}</span>
            </button>
          </div>

          {/* Gentle Educational Note */}
          {userChoice !== null && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-2 animate-fade-in max-w-md mx-auto text-start">
              <span className="font-bold block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? (currentItem.inHands ? '✨ هذا في يدك:' : '🌿 هذا خارج يدك:') : 'Insight:'}</span>
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
