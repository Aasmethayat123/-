import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  Repeat, 
  ArrowRight,
  Heart
} from 'lucide-react';

interface ReframeSentenceGameProps {
  language: Language;
  onBackToMap?: () => void;
}

const REFRAME_DATA = [
  {
    harsh: '«أنا ضيّعت عمري كله ومحققتش حاجة.»',
    kind: '«أنا مريت بسنين شاقة وتجارب صعبة استهلكت طاقتي، ولسه في عمري مساحات رحبة أبدأ فيها خطوة بخطوة.»',
    insight: 'القسوة على الماضي تمحو ما تعلمته؛ التعاطف مع نفسك يفتح لك باب الغد.'
  },
  {
    harsh: '«محدش فاهمني ولا حد حاسس بيا في العالم ده.»',
    kind: '«مشاعري عميقة ومحتاجة صبر، وصعب أوصّلها أحياناً.. بس ده لا يعني إن مفيش ناس مستعدة تسمعني لو عبرت بهدوء.»',
    insight: 'الوحدة شعور مؤلم، لكنها ليست حكماً أبدياً بأنك غير مفهوم.'
  },
  {
    harsh: '«لازم أكون كاملة ومغلطش ولا غلطة عشان أستاهل التقدير.»',
    kind: '«أنا إنسانة طبيعية بتعلم وبغلط، ومجهودي الصادق كافي جداً وقيمتي الإنسانية مش مشروطة بالكمال.»',
    insight: 'الكمال فخ يسرق بهجة السعي. النضج هو قبول المحاولة غير الكاملة.'
  },
  {
    harsh: '«لو رفضوني أو متقبلتش يبقى العيب فيّ أنا.»',
    kind: '«الرفض جزء من مسار الحياة وتوافق الفرص؛ مش كل باب مش مناسب ليا يعني إني قليلة أو معيبة.»',
    insight: 'عدم القبول في مكان معين يوجهك لمكانك الحقيقي ولا يقلل من قدرك.'
  }
];

export const ReframeSentenceGame: React.FC<ReframeSentenceGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const currentItem = REFRAME_DATA[currentIndex];

  const handleFlip = () => {
    soundManager.playHarmonicAffirmation();
    setIsFlipped(true);
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < REFRAME_DATA.length) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
    }
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'reframe-sentence',
      gameTitle: isAr ? 'بدّلي الجملة' : 'Reframe the Sentence',
      quote: currentItem.kind,
      reflection: userReflection || (isAr ? 'بدّلت الجملة القاسية بصوت حنون ورحيم.' : 'Replaced inner harshness with kindness.'),
      tag: isAr ? 'إعادة الصياغة' : 'Reframing'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setCurrentIndex(0);
    setIsFlipped(false);
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
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {isAr ? '٢. بدّلي الجملة 🔄' : '2. Reframe the Sentence 🔄'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {currentIndex + 1} / {REFRAME_DATA.length}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              {isAr ? 'تحويل الصوت الداخلي القاسي إلى لغة رحيمة' : 'Inner Voice Softening'}
            </span>
            <p className="text-xs text-stone-500">
              {isAr ? 'انقري على البطاقة لتبديل الجملة القاسية ببديل حقيقي هادئ' : 'Tap to flip from harshness to gentle reality'}
            </p>
          </div>

          {/* Flip Card Container */}
          <div 
            onClick={handleFlip}
            className={`p-8 rounded-3xl border-2 transition-all cursor-pointer min-h-56 flex flex-col items-center justify-center space-y-3 shadow-sm select-none ${
              isFlipped 
                ? 'bg-amber-50/80 border-amber-300 text-amber-950 ring-2 ring-amber-400' 
                : 'bg-rose-50/60 border-rose-200 text-rose-950 hover:bg-rose-100/60'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 shadow-xs">
              {isFlipped 
                ? (isAr ? '✨ الجملة البديلة (صوت المحبة)' : 'Kind Truth') 
                : (isAr ? '⚡ الجملة القاسية القديمة (انقر للتبديل)' : 'Old Harsh Sentence (Tap to Flip)')}
            </span>

            <p className="text-xl sm:text-2xl font-bold font-serif leading-relaxed">
              {isFlipped ? currentItem.kind : currentItem.harsh}
            </p>

            {isFlipped && (
              <p className="text-xs text-amber-800 font-medium pt-2 border-t border-amber-200/60 max-w-md">
                💡 {currentItem.insight}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              disabled={!isFlipped}
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isFlipped
                  ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'الجملة التالية' : 'Next Sentence'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
            🌿
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'صوتك الداخلي يستحق اللطف 💛' : 'Your Inner Voice Deserves Kindness'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«تكلمي مع نفسك كما تتكلمين مع أعز صديقة تمرين بأزمة؛ لا أحد يزهر بالقسوة، والنفوس تُشفى بالرحمة».'
                : 'Speak to yourself as you would to a beloved friend in distress.'}
            </p>
          </div>

          {/* Reflection Input */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 block">
              {isAr ? 'سؤال خفيف: ما هي الكلمة الحنونة التي تتمنين سماعها اليوم؟' : 'What kind word do you need to hear today?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي جملتك الحنونة لنفسك...' : 'A warm thought for yourself...'}
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
