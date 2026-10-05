import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  Coffee, 
  Play, 
  Pause, 
  ArrowRight,
  Heart
} from 'lucide-react';

interface MandatoryGentleBreakGameProps {
  language: Language;
  onBackToMap?: () => void;
}

export const MandatoryGentleBreakGame: React.FC<MandatoryGentleBreakGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [duration, setDuration] = useState<number>(60); // 60 seconds break
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            soundManager.playHarmonicAffirmation();
            triggerConfetti(0.5, 0.4);
            setIsRunning(false);
            setCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleStartBreak = () => {
    soundManager.playBreathBell(true);
    setIsRunning(true);
  };

  const handlePause = () => {
    soundManager.playSoftTap();
    setIsRunning(false);
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'gentle-break',
      gameTitle: isAr ? 'فاصل إجباري لطيف' : 'Mandatory Gentle Break',
      quote: isAr ? 'الراحة ليست مكافأة على الإنجاز، بل حق ووقود للاستمرار.' : 'Rest is not a reward, it is a human necessity.',
      reflection: userReflection || (isAr ? 'أخذت دقيقة راحة كاملة بدون تأنيب ضمير.' : 'Took a full minute of guilt-free rest.'),
      tag: isAr ? 'الراحة المستحقة' : 'Rest'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleReset = (newSec = 60) => {
    soundManager.playSoftTap();
    setIsRunning(false);
    setDuration(newSec);
    setTimeLeft(newSec);
    setCompleted(false);
    setIsSaved(false);
    setUserReflection('');
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
            {isAr ? '٦. فاصل إجباري لطيف ☕' : '6. Mandatory Gentle Break ☕'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono font-bold">
          {formatSeconds(timeLeft)}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              {isAr ? 'راحة مستحقة بدون تأنيب ضمير' : 'Guilt-Free Permission to Stop'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'توقفي لدقيقة واحدة.. العالم سينتظر ☕' : 'Stop For One Minute.. The World Can Wait ☕'}
            </h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              {isAr
                ? 'الراحة ليست جائزة مؤجلة؛ هي حق أساسي لجسدك. اضغطي على زر البدء، وأسندي ظهرك وأغمضي عينيك بهدوء حتى ينتهي الرنين.'
                : 'Rest is not a reward for burning out; it is fundamental fuel. Tap start, lean back, soften shoulders.'}
            </p>
          </div>

          {/* Calming Ripple Breathing Ring */}
          <div className="relative py-6 flex flex-col items-center justify-center">
            <div className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-amber-300 bg-amber-50/50 flex flex-col items-center justify-center p-6 text-center transition-all ${
              isRunning ? 'animate-breathe shadow-lg shadow-amber-200/50' : 'shadow-inner'
            }`}>
              <span className="text-4xl sm:text-5xl font-mono font-bold text-stone-800">
                {formatSeconds(timeLeft)}
              </span>
              <span className="text-xs font-semibold text-amber-900 mt-2">
                {isRunning ? (isAr ? 'تنفسي براحة واسترخاء...' : 'Soft breathing...') : (isAr ? 'جاهزة للراحة؟' : 'Ready to rest?')}
              </span>
            </div>
          </div>

          {/* Duration Selector & Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!isRunning ? (
              <div className="flex items-center gap-2">
                {[60, 120, 180].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleReset(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      duration === s ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {s / 60} {isAr ? 'دقيقة' : 'min'}
                  </button>
                ))}
              </div>
            ) : null}

            <button
              onClick={isRunning ? handlePause : handleStartBreak}
              className={`px-8 py-3 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                isRunning ? 'bg-stone-800 hover:bg-stone-700 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'ابدأي الفاصل اللطيف 🌿' : 'Begin Break 🌿')}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
            ☕
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'أحسنتِ إكرام نفسك بالراحة!' : 'Well Deserved Rest!'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«الأشجار تسقط أوراقها في الشتاء لتستريح، ولا أحد يعاتبها. خذ استراحتك بلا عتاب، ثم عُد بروح أصفى».'
                : 'Nature takes pauses without apology. Rest is what allows life to flourish again.'}
            </p>
          </div>

          {/* Reflection Input */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 block">
              {isAr ? 'سؤال خفيف: كيف يشعر جسدك الآن بعد أن سمحتِ له بالتوقف؟' : 'How does your body feel having paused?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي ما تشعرين به...' : 'A note on your calm...'}
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
              onClick={() => handleReset(60)}
              className="inline-flex items-center gap-2 px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'فاصل جديد' : 'Break Again'}</span>
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
