import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  Layers, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface BrainTrafficBubblesGameProps {
  language: Language;
  onBackToMap?: () => void;
}

const BUBBLES_DATA = [
  { id: 'b1', text: 'الرد على رسالة مهمة', category: 'اليوم' },
  { id: 'b2', text: 'التفكير في شغل الأسبوع الجاي', category: 'مؤجل' },
  { id: 'b3', text: 'شرب ماء وأخذ دواء', category: 'اليوم' },
  { id: 'b4', text: 'خناقة الصباح مع فلان', category: 'سماع وهدوء' },
  { id: 'b5', text: 'تجهيز وجبة غداء بسيطة', category: 'اليوم' },
  { id: 'b6', text: 'مشروع التخرج أو خطة الشهر', category: 'مؤجل' },
  { id: 'b7', text: 'ترتيب السرير والغرفة', category: 'اليوم' },
  { id: 'b8', text: 'القلق على المستقبل عموماً', category: 'أفكار عابرة' }
];

export const BrainTrafficBubblesGame: React.FC<BrainTrafficBubblesGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [gatheredIds, setGatheredIds] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const maxToGather = 3;

  const handleToggleBubble = (id: string) => {
    soundManager.playPop();
    if (gatheredIds.includes(id)) {
      setGatheredIds(gatheredIds.filter(i => i !== id));
    } else {
      if (gatheredIds.length < maxToGather) {
        const next = [...gatheredIds, id];
        setGatheredIds(next);
        if (next.length === maxToGather) {
          soundManager.playHarmonicAffirmation();
        }
      }
    }
  };

  const handleFinish = () => {
    setCompleted(true);
    soundManager.playHarmonicAffirmation();
    triggerConfetti(0.5, 0.4);
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'gather-bubbles',
      gameTitle: isAr ? 'لمّ اللي تقدر تلمّيه' : 'Gather What You Can',
      quote: isAr ? 'دماغك مش سلة مهملات لتشيل كل الدنيا في دقيقة واحدة.' : 'Pick what belongs to today, let the rest float safely.',
      reflection: userReflection || (isAr ? 'اخترت ثلاث مهام فقط ليومي، وتركت الباقي يعوم بسلام.' : 'Selected only 3 anchors for today.'),
      tag: isAr ? 'تخفيف الزحمة' : 'Mental Space'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setGatheredIds([]);
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
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            {isAr ? '٤. لمّ اللي تقدر تلمّيه 🫧' : '4. Gather What You Can 🫧'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {gatheredIds.length} / {maxToGather} {isAr ? 'فقاعات' : 'Selected'}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
              {isAr ? 'تخفيف زحمة الدماغ والإرهاق الذهني' : 'Overwhelmed Mind Decanting'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'اختاري ٣ فقاعات بس تخص النهاردة 🫧' : 'Select Only 3 Bubbles For Today 🫧'}
            </h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              {isAr
                ? 'مش مطلوب منك تخلصي كل مشاكل الحياة النهاردة. اختاري فقط ۳ أشياء تستطيعين حملها الآن، ودعي باقي الفقاعات تعوم في أمان دون ذنب.'
                : 'You don’t have to solve your entire life today. Select 3 things you can hold right now, and let the rest drift calmly.'}
            </p>
          </div>

          {/* Floating Bubbles Interactive Grid */}
          <div className="py-4 grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {BUBBLES_DATA.map((bubble) => {
              const isGathered = gatheredIds.includes(bubble.id);

              return (
                <button
                  key={bubble.id}
                  onClick={() => handleToggleBubble(bubble.id)}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-center space-y-1 shadow-xs transform hover:scale-102 ${
                    isGathered
                      ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-400 shadow-md'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <span className="text-2xl">{isGathered ? '✨' : '🫧'}</span>
                  <span className="text-xs sm:text-sm font-semibold leading-tight">{bubble.text}</span>
                  <span className="text-[10px] text-stone-400">{bubble.category}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Basket */}
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 max-w-md mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-sky-900 font-bold">
              <ShoppingBag className="w-4 h-4 text-sky-700" />
              <span>{isAr ? `في سلتك اليوم: ${gatheredIds.length} من ${maxToGather}` : `In your basket: ${gatheredIds.length} of ${maxToGather}`}</span>
            </div>

            <button
              disabled={gatheredIds.length === 0}
              onClick={handleFinish}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                gatheredIds.length > 0
                  ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer shadow-xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isAr ? 'اكتفيت بهذا اليوم ✓' : 'Done For Today ✓'}
            </button>
          </div>
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto text-3xl">
            🫧
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'هدأت الزحمة واتضحت الرؤية 🌿' : 'The Clutter Has Settled 🌿'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«الحياة تُعاش يوماً بيوم، وساعتك تسع لشيء واحد فقط في اللحظة. تركتِ الباقي يعوم، واحتفظتِ بما في وسعك».'
                : 'Life is lived day by day. You chose what fits your hands today.'}
            </p>
          </div>

          {/* Reflection Input */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 block">
              {isAr ? 'سؤال خفيف: كيف يبدو شعور دماغك الآن بعد اختيار القليل؟' : 'How does your head feel having picked just a few?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي شعورك الآن...' : 'A note on how you feel...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-sky-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-700 hover:bg-sky-800 disabled:bg-sky-300 text-white rounded-xl text-xs font-bold cursor-pointer"
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
