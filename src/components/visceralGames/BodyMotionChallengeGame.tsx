import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Timer, 
  RotateCcw, 
  Bookmark, 
  Sparkles, 
  Smile, 
  ArrowRight,
  Zap,
  Activity
} from 'lucide-react';

interface BodyMotionChallengeGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface CrazyMotionMission {
  id: string;
  title: string;
  instruction: string;
  icon: string;
  analyses: {
    bold: string;
    hesitant: string;
    inhibited: string;
  };
}

const MISSIONS: CrazyMotionMission[] = [
  {
    id: 'm1',
    title: 'الرقصة المجنونة الخاطفة 🕺💃',
    instruction: 'سيب الشاشة وقوم اقف حالاً.. اعمل حركة غريبة أو رقصة مجنونة ومضحكة لمدة ١٠ ثوانٍ كاملة بدون ما تفكر في شكلك!',
    icon: '🕺',
    analyses: {
      bold: '«أنتِ شخص تملكين شعلة حرية داخلية غير عادية! كسر النمط والجرأة هما مفتاحك الذهبي للنجاح والابتكار دون اكتراث لأحكام الجالسين في مقاعد المتفرجين».',
      hesitant: '«ترددتِ في البداية لأن جهازك العصبي مبرمج على التحفظ و"المظهر اللائق"، لكن قدرتك على كسر هذا الحاجز تثبت أنكِ قادرة على خوض تجارب جديدة حين تقررين».',
      inhibited: '«التحفظ والشعور بالحرج أمر إنساني طبيعي ومفهوم تماماً. تذكري: السماح لنفسك بالعفوية والمرح الخفيف خطوة لطيفة لتحرير نفسك من ثقل التوقعات الصارمة».'
    }
  },
  {
    id: 'm2',
    title: 'الصرخة الصامتة للوجه 😱',
    instruction: 'افتحي عينيك وفمك لأقصى اتساع ممكن كأنك متفاجئة من كنز ضخم، واحبسي هذا الوجه ٥ ثوانٍ!',
    icon: '😱',
    analyses: {
      bold: '«عضلات وجهك تحررت من التوتر المزمن! قدرتك على السخرية والمرح تجعل كورتيزول التوتر ينهار فوراً أمام حيوية حضورك».',
      hesitant: '«ضحكتِ على نفسك في المنتصف، وهذا عين الذكاء العاطفي! الضحك على المواقف يفرغ شحنة الجدية المفرطة التي ترهق قلبك».',
      inhibited: '«تجدين صعوبة في التخلي عن السيطرة حتى بينك وبين نفسك في غرفتك المغلقة. جسمك يطلب منك إذناً باللعب والتنفس دون محاكمة مستمرة».'
    }
  }
];

export const BodyMotionChallengeGame: React.FC<BodyMotionChallengeGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [missionIndex, setMissionIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(15);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [timeUp, setTimeUp] = useState<boolean>(false);
  
  // Reaction choice: bold, hesitant, inhibited
  const [chosenReaction, setChosenReaction] = useState<'bold' | 'hesitant' | 'inhibited' | null>(null);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const currentMission = MISSIONS[missionIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCounting && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isCounting) {
      setIsCounting(false);
      setTimeUp(true);
      soundManager.playHarmonicAffirmation();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCounting, secondsLeft]);

  const handleStartMission = () => {
    soundManager.playSoftTap();
    setIsCounting(true);
  };

  const handleChooseReaction = (type: 'bold' | 'hesitant' | 'inhibited') => {
    soundManager.playPop();
    setChosenReaction(type);
    soundManager.playHarmonicAffirmation();
    triggerConfetti(0.5, 0.4);
    if (onAddXP) onAddXP(40);
  };

  const handleSaveMoment = () => {
    if (!chosenReaction) return;

    saveMoment({
      gameId: 'body-motion-challenge',
      gameTitle: isAr ? 'عقارب الساعة المعكوسة (Body Motion)' : 'Body Motion Challenge',
      quote: currentMission.title,
      reflection: userReflection || currentMission.analyses[chosenReaction],
      tag: isAr ? 'جرأة وحركة' : 'Body Motion'
    });

    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = (newIdx?: number) => {
    soundManager.playSoftTap();
    if (typeof newIdx === 'number') setMissionIndex(newIdx);
    setSecondsLeft(15);
    setIsCounting(false);
    setTimeUp(false);
    setChosenReaction(null);
    setIsSaved(false);
    setUserReflection('');
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
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {isAr ? '٢. لعبة: عقارب الساعة المعكوسة ⏳🤸' : '2. Reverse Clock Motion ⏳🤸'}
          </span>
        </div>

        <span className="text-xs font-mono font-bold text-amber-300">
          {secondsLeft}s
        </span>
      </div>

      <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <div className="space-y-1 max-w-md mx-auto">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
            {isAr ? 'سيبي الشاشة وركزي مع جسمك ١٥ ثانية فقط' : '15-Second Screenless Physical Pause'}
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900">
            {currentMission.title}
          </h2>
          <p className="text-sm font-semibold text-stone-800 leading-relaxed p-4 bg-amber-50 rounded-2xl border border-amber-200">
            {currentMission.instruction}
          </p>
        </div>

        {/* 15s Countdown Graphic */}
        {!timeUp && !chosenReaction && (
          <div className="py-4 flex flex-col items-center justify-center space-y-4">
            <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-lg transition-all ${
              isCounting ? 'border-amber-500 bg-amber-50 animate-pulse text-amber-700 scale-105' : 'border-stone-300 bg-stone-50 text-stone-600'
            }`}>
              <span className="text-3xl font-extrabold font-mono">{secondsLeft}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">{isAr ? 'ثانية' : 'sec'}</span>
            </div>

            {!isCounting ? (
              <button
                onClick={handleStartMission}
                className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-extrabold text-sm shadow-md cursor-pointer transition-transform hover:scale-102 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{isAr ? 'ابدأي الـ ١٥ ثانية وسيّبي الشاشة! 🤸' : 'Start 15s & Drop the Screen!'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsCounting(false);
                  setTimeUp(true);
                }}
                className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'خلصت الحركة بدري! 💥' : 'Finished Early!'}
              </button>
            )}
          </div>
        )}

        {/* After 15s: Self-Report Questions */}
        {(timeUp || chosenReaction) && !chosenReaction && (
          <div className="space-y-4 max-w-lg mx-auto pt-2 animate-fade-in">
            <h3 className="text-base font-extrabold text-stone-900">
              {isAr ? 'بكل صراحة.. كيف كان تفاعلك مع الحركة؟ 🧐' : 'Honestly, how did you respond?'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleChooseReaction('bold')}
                className="p-4 rounded-2xl border-2 border-stone-200 bg-stone-50 hover:border-emerald-500 hover:bg-emerald-50 text-stone-800 font-bold text-xs cursor-pointer transition-all hover:scale-102 flex flex-col items-center gap-1.5"
              >
                <span className="text-2xl">💥</span>
                <span>{isAr ? 'عملتها بجرأة وجنون!' : 'Did it boldly!'}</span>
              </button>

              <button
                onClick={() => handleChooseReaction('hesitant')}
                className="p-4 rounded-2xl border-2 border-stone-200 bg-stone-50 hover:border-amber-500 hover:bg-amber-50 text-stone-800 font-bold text-xs cursor-pointer transition-all hover:scale-102 flex flex-col items-center gap-1.5"
              >
                <span className="text-2xl">😅</span>
                <span>{isAr ? 'ترددت شوية بس عملتها' : 'Hesitated, but did it'}</span>
              </button>

              <button
                onClick={() => handleChooseReaction('inhibited')}
                className="p-4 rounded-2xl border-2 border-stone-200 bg-stone-50 hover:border-rose-500 hover:bg-rose-50 text-stone-800 font-bold text-xs cursor-pointer transition-all hover:scale-102 flex flex-col items-center gap-1.5"
              >
                <span className="text-2xl">🙈</span>
                <span>{isAr ? 'كسلت / خفت حد يشوفني' : 'Held back / Shy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Witty Psychological Feedback */}
        {chosenReaction && (
          <div className="p-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl border-2 border-amber-300 text-start space-y-4 max-w-xl mx-auto animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  {isAr ? 'تحليل شخصيتك مع الفرص والغرابة:' : 'Your Archetype:'}
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-amber-950 font-serif">
                  {chosenReaction === 'bold' && (isAr ? 'نمط المحارب الحر (Free Spirit)' : 'Free Spirit')}
                  {chosenReaction === 'hesitant' && (isAr ? 'نمط الفاحص الحذر (Cautious Explorer)' : 'Cautious Explorer')}
                  {chosenReaction === 'inhibited' && (isAr ? 'نمط الحارس الصارم (Over-Regulated Sentinel)' : 'Sentinel')}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans font-medium">
              {currentMission.analyses[chosenReaction]}
            </p>

            <div className="space-y-2 pt-2 border-t border-amber-200">
              <label className="text-xs font-bold text-stone-800 block">
                {isAr ? 'خاطرة سريعة في دفتر رحلتك:' : 'Quick insight for diary:'}
              </label>
              <textarea
                rows={2}
                value={userReflection}
                onChange={(e) => setUserReflection(e.target.value)}
                placeholder={isAr ? 'كيف تغير نبضك أو ضحكتِ بعد الموقف؟...' : 'How does your rhythm feel now?...'}
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 text-stone-800"
              />
              <div className="flex justify-end pt-1">
                <button
                  disabled={isSaved}
                  onClick={handleSaveMoment}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => handleRestart((missionIndex + 1) % MISSIONS.length)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isAr ? 'حركة غريبة تانية' : 'Another Movement'}</span>
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
    </div>
  );
};
