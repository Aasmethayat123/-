import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Timer, 
  RotateCcw, 
  Bookmark, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Activity,
  ArrowRight,
  Hand
} from 'lucide-react';

interface MicroChallenge30sGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface PhysicalChallenge {
  id: string;
  title: string;
  actionInstruction: string;
  psychologicalLink: string;
  icon: string;
}

const CHALLENGES_LIST: PhysicalChallenge[] = [
  {
    id: 'ch1',
    title: 'تغيير مكان ٣ أشياء حولك 🔄',
    actionInstruction: 'قومي فوراً من مكانك وغيّري مكان ٣ أشياء على مكتبك أو في غرفتك (كوب، كتاب، قلم)!',
    psychologicalLink: '«المرونة المكانية (Spatial Neuroplasticity): حين تعجزين عن تغيير فكرة عالقة في رأسك، ابدأي بتغيير شيء مادي في بيئتك. الحركة الخارجية تكسر الجمود العصبي فوراً»',
    icon: '🔄'
  },
  {
    id: 'ch2',
    title: 'لمس شيئين مختلفين الملمس ✋',
    actionInstruction: 'ابحثي بيدك عن شيء خشن الملمس وشيء ناعم أو بارد، وتلمسي كل منهما بتركيز ٥ ثوانٍ!',
    psychologicalLink: '«التأريض الحسي (Tactile Grounding): الأعصاب الحسية في أطراف أصابعك ترسل إشارات كهربائية تعيد عقلك من دوامات القلق المستقبلية إلى الواقع الآمن الحالي»',
    icon: '✋'
  },
  {
    id: 'ch3',
    title: 'تمديد الكتفين ورفع الذراعين للسقف 🙆',
    actionInstruction: 'ارفعي ذراعيكِ لأعلى السقف، وافردي ظهرك وكتفيكِ مع زفير عميق وابتسامة خفيفة!',
    psychologicalLink: '«التمدد العصبي المحرر (Postural Feedback): انكماش الظهر والكتفين يخدع الدماغ بأنك في وضع دفاع؛ التمدد يعيد تنشيط إشارات الأمان والرحابة»',
    icon: '🙆'
  }
];

export const MicroChallenge30sGame: React.FC<MicroChallenge30sGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  // Touch & Release interactive sparks pad
  const [releasedEnergyCount, setReleasedEnergyCount] = useState<number>(0);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const currentChallenge = CHALLENGES_LIST[challengeIdx];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      handleChallengeFinish();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const handleStartTimer = () => {
    soundManager.playSoftTap();
    setIsActive(true);
  };

  const handleChallengeFinish = () => {
    setIsCompleted(true);
    soundManager.playLevelUpFanfare();
    triggerConfetti(0.5, 0.4);
    if (onAddXP) onAddXP(50);
  };

  const handleTouchReleasePad = () => {
    soundManager.playPop();
    setReleasedEnergyCount(prev => prev + 1);
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'micro-challenge-30s',
      gameTitle: isAr ? 'تحدي الـ 30 ثانية الحركي' : '30-Second Physical Challenge',
      quote: currentChallenge.title,
      reflection: userReflection || currentChallenge.psychologicalLink,
      tag: isAr ? 'حركة وتفريغ' : 'Physical Challenge'
    });

    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setSecondsLeft(30);
    setIsActive(false);
    setIsCompleted(false);
    setReleasedEnergyCount(0);
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
          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
            {isAr ? 'تحدي الـ 30 ثانية الحركي ⏱️' : '30-Sec Physical Challenge ⏱️'}
          </span>
        </div>

        <span className="text-xs font-mono font-bold text-orange-300">
          {secondsLeft}s
        </span>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block">
              {isAr ? 'ربط الوعي بحركة حقيقية في يومك' : 'Grounding Through Real Action'}
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900">
              {currentChallenge.title}
            </h2>
            <p className="text-sm font-semibold text-stone-700 leading-relaxed p-4 bg-orange-50 rounded-2xl border border-orange-200">
              {currentChallenge.actionInstruction}
            </p>
          </div>

          {/* Interactive Countdown Circle */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shadow-lg transition-all ${
              isActive 
                ? 'border-orange-500 bg-orange-50 animate-pulse text-orange-600 scale-105' 
                : 'border-stone-300 bg-stone-50 text-stone-600'
            }`}>
              <span className="text-4xl font-extrabold font-mono">
                {secondsLeft}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                {isAr ? 'ثانية' : 'sec'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
            {!isActive ? (
              <button
                onClick={handleStartTimer}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-extrabold text-sm shadow-md cursor-pointer transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{isAr ? 'ابدأي التحدي الآن (٣٠ ثانية)' : 'Start Challenge (30s)'}</span>
              </button>
            ) : (
              <button
                onClick={handleChallengeFinish}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-md cursor-pointer transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'تم التنفيذ بنجاح! ✓' : 'Done! ✓'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* End Screen with Psychological Concept & Touch & Release Pad */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 text-center space-y-6 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-inner">
            ⚡
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'أحسنتِ! انكسر الجمود وعادت الحيوية 🌿' : 'Great Job! Stagnation Broken 🌿'}
            </h2>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs text-orange-950 font-serif leading-relaxed mt-2 max-w-lg mx-auto text-start">
              {currentChallenge.psychologicalLink}
            </div>
          </div>

          {/* Touch & Release Energy Pad */}
          <div className="p-5 bg-stone-900 text-white rounded-3xl space-y-3 max-w-md mx-auto">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
              {isAr ? 'لعبة تفريغ الطاقة الحركية (Touch & Release)' : 'Somatic Discharge Pad'}
            </span>
            <p className="text-xs text-stone-300">
              {isAr ? 'انقري على اللوحة عدة مرات لتفريغ أي شحنة عصبية متبقية:' : 'Tap the pad repeatedly to discharge residual energy:'}
            </p>
            <button
              onClick={handleTouchReleasePad}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg font-extrabold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 animate-spin-slow" />
              <span>{isAr ? `تفريغ الطاقة (${releasedEnergyCount})` : `Release (${releasedEnergyCount})`}</span>
            </button>
          </div>

          {/* Reflection Input */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-800 block">
              {isAr ? 'كيف تغير شعور جسمك وانتباهك بعد الحركة؟' : 'How does your body feel now?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'شعرت بأن النبض انتظم / استعدت تركيزي...' : 'Felt more grounded and refreshed...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-orange-600 text-stone-800"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-700 hover:bg-orange-800 disabled:bg-orange-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'تحدٍ جديد' : 'Try Again'}</span>
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
