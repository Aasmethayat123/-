import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Bookmark, 
  ArrowRight, 
  Flame, 
  Zap, 
  HelpCircle
} from 'lucide-react';

interface EmotionRouletteGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface RouletteChallenge {
  id: string;
  colorName: string;
  colorHex: string;
  icon: string;
  dareTitle: string;
  dareAction: string;
  psychologicalWhy: string;
}

const ROULETTE_SEGMENTS: RouletteChallenge[] = [
  {
    id: 'r1',
    colorName: 'النار الحمراء',
    colorHex: 'from-rose-500 to-red-600',
    icon: '🔥',
    dareTitle: 'الإيموجي المجنون غير المتوقع 🤪',
    dareAction: 'افتحي الشات حالاً، وارسلي إيموجي مجنون وغير مفهوم (زي: 🦖 أو 🛸 أو 🦹‍♀️) لأول شخص يظهر في محادثاتك دون أي توضيح وشوفي رد فعله!',
    psychologicalWhy: '«كسر هوس السيطرة والكمال: عندما تفعلين شيئاً عفوياً غريباً دون اعتذار، يتعلم جهازك العصبي أن العالم لا ينهار إذا لم تكوني رسمية دائماً».'
  },
  {
    id: 'r2',
    colorName: 'الزرقة العميقة',
    colorHex: 'from-sky-500 to-blue-700',
    icon: '🌊',
    dareTitle: 'المشي بالمعكوس ٢٠ خطوة 🚶‍♀️🔙',
    dareAction: 'قومي من مكانك وامشي ٢٠ خطوة للوراء بتركيز وبطء، وتذكري في الخطوة الأخيرة آخر موقف ضحكتِ فيه من كل قلبك حتى دمعت عيناكِ!',
    psychologicalWhy: '«إعادة ضبط المسار البصري والمكاني: المشي للخلف ينشط الفص الجداري (Parietal Lobe) ويعيد توجيه الذاكرة العاطفية نحو البهجة الفطرية».'
  },
  {
    id: 'r3',
    colorName: 'الأصفر الذهبي',
    colorHex: 'from-amber-400 to-yellow-500',
    icon: '⚡',
    dareTitle: 'سؤال الذكرى الذهبية 🍯',
    dareAction: 'اكتبي لصديقة مقربة رسالة من سطر واحد: "افتكرت فجأة.. تفتكري إيه أجمل وأغرب موقف جمعنا زمان؟"، وانتظري إجابتها الدافئة.',
    psychologicalWhy: '«تنشيط حلقة الذاكرة الإيجابية المشتركة: الذكريات المشتركة تفرز دفقة دوبامين وأوكسيتوسين تحمي من الشعور بالوحشة والاغتراب».'
  },
  {
    id: 'r4',
    colorName: 'الأخضر الزمردي',
    colorHex: 'from-emerald-500 to-teal-700',
    icon: '🌿',
    dareTitle: 'زئير الأسد الصامت 🦁',
    dareAction: 'انظري لأعلى، افتحي فمكِ بالكامل ومدّي لسانكِ لأقصى حد وازفري بقوة بدون صوت كأنكِ أسد يزأر في البرية ٣ مرات!',
    psychologicalWhy: '«تمرين Simhasana القديم لتحرير عضلات الحلق والفك: يفرغ الشد العضلي الحبيس في الفك نتيجة الغضب أو الكلمات المكبوتة».'
  }
];

export const EmotionRouletteGame: React.FC<EmotionRouletteGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [selectedSegment, setSelectedSegment] = useState<RouletteChallenge | null>(null);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSpinAndStop = () => {
    if (isSpinning) {
      // Stop action (Shoot!)
      setIsSpinning(false);
      soundManager.playPop();
      soundManager.playHarmonicAffirmation();

      // Pick random segment
      const chosen = ROULETTE_SEGMENTS[Math.floor(Math.random() * ROULETTE_SEGMENTS.length)];
      setSelectedSegment(chosen);
      triggerConfetti(0.5, 0.4);
      if (onAddXP) onAddXP(45);
    } else {
      // Start spinning
      soundManager.playSoftTap();
      setSelectedSegment(null);
      setIsSpinning(true);
    }
  };

  useEffect(() => {
    let frameId: number;
    if (isSpinning) {
      const spin = () => {
        setRotationAngle(prev => (prev + 28) % 360);
        frameId = requestAnimationFrame(spin);
      };
      frameId = requestAnimationFrame(spin);
    }
    return () => cancelAnimationFrame(frameId);
  }, [isSpinning]);

  const handleSaveMoment = () => {
    if (!selectedSegment) return;

    saveMoment({
      gameId: 'emotion-roulette',
      gameTitle: isAr ? 'مسدس المشاعر (Roulette Shoot)' : 'Emotion Roulette Shoot',
      quote: selectedSegment.dareTitle,
      reflection: userReflection || selectedSegment.dareAction,
      tag: isAr ? 'تحديات الروليت' : 'Roulette Dare'
    });

    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            {isAr ? '٣. لعبة: مسدس المشاعر (الروليت) 🎯🎡' : '3. Emotion Roulette 🎯🎡'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {isAr ? 'تحديات واقعية جريئة' : 'Real-Life Micro Dares'}
        </span>
      </div>

      <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <div className="space-y-1 max-w-md mx-auto">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
            {isAr ? 'بدل القراءة النظرية.. اضربي الطلقة وخدي التحدي' : 'Spin, Shoot, and Take the Dare'}
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900">
            {isAr ? 'لفّي الروليت واضغطي "إطلاق" لإيقافها! 🎡' : 'Spin the Wheel and Shoot to Stop! 🎡'}
          </h2>
          <p className="text-xs text-stone-500">
            {isAr ? 'كل خانة تخبئ تحدياً واقعياً مرحاً في الشارع أو مع أصدقائك يفرغ التوتر فوراً.' : 'Each stop hides a spontaneous real-world challenge to break hesitation.'}
          </p>
        </div>

        {/* The Animated Spinning Wheel */}
        <div className="py-6 flex flex-col items-center justify-center relative">
          {/* Wheel Pointer Indicator */}
          <div className="z-20 text-3xl mb-[-12px] animate-bounce">
            🔻
          </div>

          <div
            className="w-56 sm:w-64 h-56 sm:h-64 rounded-full border-4 border-stone-900 shadow-2xl relative overflow-hidden transition-transform"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            {/* 4 Quadrants of the Wheel */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="bg-rose-500 flex items-center justify-center text-3xl font-extrabold text-white">🔥</div>
              <div className="bg-sky-600 flex items-center justify-center text-3xl font-extrabold text-white">🌊</div>
              <div className="bg-amber-400 flex items-center justify-center text-3xl font-extrabold text-white">⚡</div>
              <div className="bg-emerald-600 flex items-center justify-center text-3xl font-extrabold text-white">🦁</div>
            </div>

            {/* Wheel Center Button */}
            <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-stone-900 border-4 border-white shadow-md flex items-center justify-center text-white font-mono text-xs font-bold">
              🎯
            </div>
          </div>

          {/* Trigger Button */}
          <div className="pt-6">
            <button
              onClick={handleSpinAndStop}
              className={`px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-md cursor-pointer transition-transform hover:scale-103 ${
                isSpinning
                  ? 'bg-rose-600 hover:bg-rose-700 animate-pulse'
                  : 'bg-stone-900 hover:bg-stone-800'
              }`}
            >
              {isSpinning 
                ? (isAr ? '🎯 إطلاق الرصاصة وإيقاف الروليت الآن!' : '🎯 SHOOT & STOP NOW!') 
                : (isAr ? '🔄 لفّي الروليت بسرعة' : '🔄 Spin the Wheel')}
            </button>
          </div>
        </div>

        {/* The Revealed Real-World Dare Card */}
        {selectedSegment && (
          <div className="p-6 bg-gradient-to-br from-sky-500/10 via-amber-500/10 to-transparent rounded-3xl border-2 border-sky-300 text-start space-y-4 max-w-xl mx-auto animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{selectedSegment.icon}</span>
              <div>
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                  {isAr ? 'التحدي الواقعي الفوري:' : 'Immediate Real-Life Dare:'}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-stone-900">
                  {selectedSegment.dareTitle}
                </h3>
              </div>
            </div>

            <p className="text-sm font-semibold text-stone-800 leading-relaxed p-4 bg-white/90 rounded-2xl border border-stone-200">
              {selectedSegment.dareAction}
            </p>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-950 font-serif leading-relaxed">
              {selectedSegment.psychologicalWhy}
            </div>

            {/* Reflection Input */}
            <div className="space-y-2 pt-2 border-t border-sky-200">
              <label className="text-xs font-bold text-stone-800 block">
                {isAr ? 'كيف كانت شجاعتك في تنفيذ هذا التحدي؟' : 'How bold was your execution?'}
              </label>
              <textarea
                rows={2}
                value={userReflection}
                onChange={(e) => setUserReflection(e.target.value)}
                placeholder={isAr ? 'اكتبي رد الفعل أو الضحكة التي حدثت...' : 'What happened when you did it?...'}
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-sky-600 text-stone-800"
              />
              <div className="flex justify-end pt-1">
                <button
                  disabled={isSaved}
                  onClick={handleSaveMoment}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-700 hover:bg-sky-800 disabled:bg-sky-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
