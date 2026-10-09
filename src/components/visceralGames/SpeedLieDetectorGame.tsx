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
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  Timer
} from 'lucide-react';

interface SpeedLieDetectorGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface SpeedQuestion {
  id: string;
  text: string;
  underlyingTruthIfYes: string;
  underlyingTruthIfNo: string;
}

const SPEED_QUESTIONS: SpeedQuestion[] = [
  {
    id: 'q1',
    text: 'هل أنتِ مرتاحة فعلاً في العلاقات اللي بتستنزفك، ولا مرعوبة تبقي لوحدك؟',
    underlyingTruthIfYes: 'أنتِ تقايضين سلامك النفسي بأمان زائف؛ تفضلين الألم المألوف على شجاعة الوحدة المؤقتة.',
    underlyingTruthIfNo: 'أنتِ تعلمين الحقيقة في أعماقك: قلبك يستحق مساحة تحترمه ولا تجعله يمشي على أطراف أصابعه.'
  },
  {
    id: 'q2',
    text: 'هل بتأجلي المهام عشان "كسلانة"، ولا عشان مرعوبة ميكنوش كاملين ومثاليين؟',
    underlyingTruthIfYes: 'أنتِ تظلمين نفسك باتهامها بالكسل؛ مشكلتك ليست قلة طاقة بل رعب من النقص والتقييم.',
    underlyingTruthIfNo: 'أنتِ تعرفين أن المثالية فخ؛ إنجاز مشوه خير من نية عبقرية في المقبرة.'
  },
  {
    id: 'q3',
    text: 'هل محتاجة نصائح وحلول عقلانية دلوقتي، ولا محتاجة حد يسمعك ويفهمك وبس؟',
    underlyingTruthIfYes: 'عقلك يبحث عن حلول عملية؛ تذكري ألا تهملي حق مشاعرك في التعبير أولاً.',
    underlyingTruthIfNo: 'قلبك جائع للتعاطف والاحتواء الإنساني، وليس للمزيد من التوجيهات والمحاضرات!'
  },
  {
    id: 'q4',
    text: 'هل اعتذرتِ مؤخراً لمجرد إنهاء الجدال وشراء راحة البال، وأنتِ مش غلطانة؟',
    underlyingTruthIfYes: 'أنتِ تدفنين كرامتك ومشاعركِ لشراء هدوء مؤقت؛ السلام المصطنع يولد مرارة داخلية.',
    underlyingTruthIfNo: 'أنتِ تملكين بوصلة احترام لذاتكِ؛ تعرفين متى تعتذرين ومتى تحافظين على حدودك.'
  }
];

export const SpeedLieDetectorGame: React.FC<SpeedLieDetectorGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, 'yes' | 'no' | 'timed_out'>>({});
  const [timeLeftMs, setTimeLeftMs] = useState<number>(2500); // 2.5s per rapid question
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const currentQ = SPEED_QUESTIONS[questionIdx];

  // Timer loop for rapid response
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isGameActive && !isFinished && timeLeftMs > 0) {
      timer = setTimeout(() => {
        setTimeLeftMs(prev => prev - 50);
      }, 50);
    } else if (timeLeftMs <= 0 && isGameActive && !isFinished) {
      // Time ran out on this question
      handleAnswer('timed_out');
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isGameActive, timeLeftMs, isFinished]);

  const handleStartGame = () => {
    soundManager.playSoftTap();
    setQuestionIdx(0);
    setAnswers({});
    setTimeLeftMs(2500);
    setIsFinished(false);
    setIsGameActive(true);
  };

  const handleAnswer = (ans: 'yes' | 'no' | 'timed_out') => {
    soundManager.playPop();
    const updatedAnswers = { ...answers, [currentQ.id]: ans };
    setAnswers(updatedAnswers);

    if (questionIdx + 1 < SPEED_QUESTIONS.length) {
      setQuestionIdx(prev => prev + 1);
      setTimeLeftMs(2500); // Reset timer for next question
    } else {
      setIsFinished(true);
      setIsGameActive(false);
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
      if (onAddXP) onAddXP(55);
    }
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'speed-lie-detector',
      gameTitle: isAr ? 'رادار كاشف الكذب الذاتي' : 'Self-Lie Speed Radar',
      quote: isAr ? 'كشفتُ الحقيقة في اللاوعي دون تجميل عقلي.' : 'Subconscious truth radar revealed.',
      reflection: userReflection || (isAr ? 'أجبت بسرعة فائقة وتعرفت على صوت قلبي الحقيقي.' : 'Responded via subconscious speed tap.'),
      tag: isAr ? 'كاشف الكذب الذاتي' : 'Subconscious Truth'
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
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            {isAr ? '٦. لعبة: رادار كاشف الكذب الذاتي ⚡🕵️' : '6. Self-Lie Radar ⚡🕵️'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-300">
          <span>{questionIdx + 1} / {SPEED_QUESTIONS.length}</span>
        </div>
      </div>

      {!isGameActive && !isFinished ? (
        /* Intro Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-800 flex items-center justify-center text-3xl mx-auto shadow-inner">
            ⚡
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wider block">
              {isAr ? 'سرعة فائقة لمنع العقل من تزييف الحقيقة' : 'Bypassing the Analytical Ego'}
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900">
              {isAr ? 'أسئلة خاطفة.. اضغطي في أقل من ثانيتين! ⏱️' : 'Rapid Questions.. Answer in 2 Seconds!'}
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              {isAr
                ? 'عندما تفكرين طويلاً، يقوم عقلك الدفاعي بتجميل الواقع. السرعة المفرطة تجعل اللاوعي يجيب بحقيقته العارية دون فلتر.'
                : 'Overthinking lets your defensive ego rationalize. Fast reflex tapping catches the raw truth of your heart.'}
            </p>
            <div className="p-2.5 bg-red-50 rounded-2xl border border-red-200 text-red-900 text-[11px] leading-relaxed">
              {isAr
                ? '⚠️ إضاءة توعوية: هذا التمرين ليس كاشفاً قضائياً أو تشخيصاً طبياً للكذب، بل مساحة استكشافية سريعة لملاحظة إجاباتك العفوية الأولى دون لوم ذاتي.'
                : '⚠️ Disclaimer: This is an experiential self-reflection exercise, not a clinical lie detector or psychiatric assessment.'}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartGame}
              className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-sm shadow-md cursor-pointer transition-transform hover:scale-103 flex items-center gap-2 mx-auto"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isAr ? 'ابدأي الرادار السريع الآن! ⚡' : 'Start Speed Radar!'}</span>
            </button>
          </div>
        </div>
      ) : isGameActive && !isFinished ? (
        /* Rapid Question Active */
        <div className="bg-white rounded-3xl border-2 border-red-300 p-6 sm:p-8 shadow-lg space-y-6 text-center animate-fade-in">
          {/* Rapid Timer Bar */}
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-red-600 transition-all duration-75 rounded-full"
              style={{ width: `${(timeLeftMs / 2500) * 100}%` }}
            />
          </div>

          <div className="py-4 space-y-3 max-w-md mx-auto">
            <span className="text-xs font-bold text-red-700 uppercase tracking-widest block">
              {isAr ? 'جاوبي بحدسك فوراً بدون تفكير:' : 'Answer with your gut instinct:'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif leading-relaxed">
              «{currentQ.text}»
            </h3>
          </div>

          {/* Quick Yes / No Action Buttons */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
            <button
              onClick={() => handleAnswer('yes')}
              className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-base shadow-md cursor-pointer transition-transform flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isAr ? 'نعم' : 'Yes'}</span>
            </button>

            <button
              onClick={() => handleAnswer('no')}
              className="py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-base shadow-md cursor-pointer transition-transform flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              <span>{isAr ? 'لا' : 'No'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* The Subconscious Breakdown Result */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto text-3xl shadow-inner">
            🕵️
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wider block">
              {isAr ? 'تقرير رادار اللاوعي الصريح' : 'Subconscious Radar Breakdown'}
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 font-serif">
              {isAr ? 'ما قاله قلبكِ الحقيقي بدون تجميل 🔍' : 'Your Heart’s Unfiltered Truth 🔍'}
            </h2>
          </div>

          {/* Breakdown of findings */}
          <div className="space-y-3 max-w-xl mx-auto text-start">
            {SPEED_QUESTIONS.map((q) => {
              const ans = answers[q.id];
              const textInsight = ans === 'yes' ? q.underlyingTruthIfYes : q.underlyingTruthIfNo;

              return (
                <div key={q.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-700 font-serif">{q.text}</span>
                    <span className={`px-2 py-0.5 rounded-full shrink-0 text-[10px] ${
                      ans === 'yes' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {ans === 'yes' ? (isAr ? 'إجابتك: نعم' : 'Yes') : (isAr ? 'إجابتك: لا' : 'No')}
                    </span>
                  </div>
                  <p className="text-xs text-red-950 font-medium leading-relaxed bg-red-50/80 p-2.5 rounded-xl border border-red-200">
                    💡 {textInsight}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Reflection Input */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 max-w-xl mx-auto space-y-3 text-start">
            <label className="text-xs font-bold text-stone-800 block">
              {isAr ? 'ما الحقيقة الأكثر وضوحاً التي فاجأتكِ في هذا التقرير؟' : 'Which truth was the most eye-opening?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي ما اعترفتِ به لنفسكِ الآن...' : 'What you admitted to yourself...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-red-600 text-stone-800"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 disabled:bg-red-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleStartGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة الاختبار الخاطف' : 'Retake Speed Test'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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
