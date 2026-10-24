import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import {
  RotateCcw,
  Bookmark,
  Coffee,
  Play,
  Pause,
  CheckCircle2,
  Wind,
  Sparkles
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface MandatoryGentleBreakGameProps {
  language: Language;
  onBackToMap?: () => void;
  onAddXP?: (amount: number) => void;
}

const BODY_CHECKS = [
  { id: 'jaw', ar: 'إرخاء الفك والجبين من الشد', en: 'Unclench jaw & soften forehead' },
  { id: 'shoulders', ar: 'إسقاط الكتفين بعيداً عن الأذنين', en: 'Drop shoulders away from ears' },
  { id: 'hands', ar: 'بسط الكفين وإبطاء الزفير', en: 'Open palms & lengthen exhale' }
];

const GAME_ID = 'gentle-break';

export const MandatoryGentleBreakGame: React.FC<MandatoryGentleBreakGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const stageDuration = currentStage === 1 ? 30 : currentStage === 2 ? 45 : 60;
  const [timeLeft, setTimeLeft] = useState<number>(stageDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Stage 1 mechanic: Somatic body checkpoints
  const [checkedBodyIds, setCheckedBodyIds] = useState<string[]>([]);

  // Stage 2 mechanic: Breath bell sync taps (every 9s window an exhale cue glows)
  const [syncedBreaths, setSyncedBreaths] = useState<number>(0);

  // Stage 3 mechanic: Pure Stillness Sanctuary (hasty clicks disturb stillness)
  const [disturbances, setDisturbances] = useState<number>(0);
  const [rippleWarning, setRippleWarning] = useState<boolean>(false);

  const [completed, setCompleted] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  const loadStage = (stageNum: number) => {
    const dur = stageNum === 1 ? 30 : stageNum === 2 ? 45 : 60;
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setIsRunning(false);
    setTimeLeft(dur);
    setCheckedBodyIds([]);
    setSyncedBreaths(0);
    setDisturbances(0);
    setRippleWarning(false);
    setCompleted(false);
    setShowCompletionModal(false);
    setIsSaved(false);
  };

  useEffect(() => {
    if (!isRunning || completed) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          finishStageNow();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, completed, currentStage, checkedBodyIds.length, syncedBreaths, disturbances]);

  const finishStageNow = () => {
    let stars = 3;
    if (currentStage === 1) {
      stars = checkedBodyIds.length >= 3 ? 3 : checkedBodyIds.length >= 2 ? 2 : 1;
    } else if (currentStage === 2) {
      stars = syncedBreaths >= 3 ? 3 : syncedBreaths >= 1 ? 2 : 1;
    } else {
      stars = disturbances === 0 ? 3 : disturbances <= 2 ? 2 : 1;
    }
    setEarnedStars(stars);
    const res = completeStage(GAME_ID, currentStage, stars, stageDuration, onAddXP);
    setEarnedXP(res.xpAwarded);
    setProgress(getGameLevelProgress(GAME_ID));
    setCompleted(true);
    setShowCompletionModal(true);
  };

  const elapsed = stageDuration - timeLeft;
  const isExhaleWindow = currentStage === 2 && isRunning && (elapsed % 9 >= 4 && elapsed % 9 <= 8);

  const handleToggleBodyCheck = (id: string) => {
    soundManager.playSoftTap();
    setCheckedBodyIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const handleBreathCueTap = () => {
    if (!isRunning || currentStage !== 2) return;
    if (isExhaleWindow) {
      soundManager.playBreathBell(false);
      setSyncedBreaths(b => b + 1);
    } else {
      soundManager.playSoftTap();
    }
  };

  const handleStillnessPondTap = () => {
    if (!isRunning || currentStage !== 3) return;
    soundManager.playWaterPour();
    setDisturbances(d => d + 1);
    setRippleWarning(true);
    setTimeout(() => setRippleWarning(false), 1200);
  };

  const handleStartBreak = () => {
    soundManager.playBreathBell(true);
    setIsRunning(true);
  };

  const handlePause = () => {
    soundManager.playSoftTap();
    setIsRunning(false);
  };

  const handleNextStage = () => {
    if (currentStage < 3) {
      loadStage(currentStage + 1);
    } else {
      setShowCompletionModal(false);
    }
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'gentle-break',
      gameTitle: isAr ? `فاصل إجباري لطيف (المرحلة ${currentStage})` : `Gentle Break (Stage ${currentStage})`,
      quote: isAr ? 'الراحة ليست مكافأة على الإنجاز، بل حق ووقود للاستمرار.' : 'Rest is not a reward, it is a human necessity.',
      reflection: userReflection || (isAr ? 'سمحت لجسدي بالتوقف التام دون تأنيب ضمير.' : 'Allowed my nervous system guilt-free rest.'),
      tag: isAr ? 'الراحة المستحقة' : 'Rest'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
    if (onAddXP) onAddXP(15);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5" />
              <span>{isAr ? 'فاصل إجباري لطيف ☕' : 'Mandatory Gentle Break ☕'}</span>
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {currentStage === 1
                ? (isAr ? 'المرحلة ١ (٣٠ ثانية): تحرير ٣ نقاط شد في الجسد' : 'Stage 1 (30s): Release 3 body tension checkpoints')
                : currentStage === 2
                ? (isAr ? 'المرحلة ٢ (٤٥ ثانية): مزامنة الزفير مع نبض الجرس الدافئ' : 'Stage 2 (45s): Sync exhale taps with warm breath cues')
                : (isAr ? 'المرحلة ٣ (٦٠ ثانية): بحيرة السكون العميق بلا عجلة أو نقر' : 'Stage 3 (60s): Pure Stillness Pond — resist hasty tapping')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StageLevelSelector
            language={language}
            gameId={GAME_ID}
            currentStage={currentStage}
            progress={progress}
            onSelectStage={(s) => loadStage(s)}
            showCompletionModal={showCompletionModal}
            completedStageNumber={currentStage}
            starsEarned={earnedStars}
            movesMade={stageDuration}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={() => loadStage(currentStage)}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />
          <button
            onClick={() => loadStage(currentStage)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
              {isAr ? 'إذن حقيقي بالتوقف بدون ذنب' : 'Guilt-Free Nervous System Pause'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {currentStage === 1
                ? (isAr ? 'أرخي جسدك نقطة بنقطة لمدة ٣٠ ثانية ☕' : 'Release 3 Tension Points Over 30s ☕')
                : currentStage === 2
                ? (isAr ? 'تنفسي بهدوء وانقري الحلقة عند ضوء الزفير 🌬️' : 'Tap the Ring When Exhale Glows 🌬️')
                : (isAr ? 'دقيقة سكون صافية.. دعي البحيرة تهدأ دون لمس 🪷' : '60s Stillness Sanctuary — Let the Pond Settle 🪷')}
            </h2>
          </div>

          {/* Central Interactive Breathing / Stillness Sphere */}
          <div className="relative py-4 flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={currentStage === 2 ? handleBreathCueTap : currentStage === 3 ? handleStillnessPondTap : undefined}
              className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 flex flex-col items-center justify-center p-6 text-center transition-all duration-700 ${
                currentStage === 2 && isExhaleWindow
                  ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 scale-105 shadow-xl shadow-emerald-400/30 cursor-pointer'
                  : rippleWarning
                  ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 scale-95'
                  : isRunning
                  ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/30 shadow-lg shadow-amber-200/40'
                  : 'border-amber-300 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/50'
              }`}
            >
              <span className="text-4xl sm:text-5xl font-mono tabular-nums font-bold text-stone-800 dark:text-stone-100">
                {formatSeconds(timeLeft)}
              </span>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 mt-2">
                {!isRunning
                  ? (isAr ? 'اضغطي زر البدء بالأسفل' : 'Press Begin Below')
                  : currentStage === 2
                  ? isExhaleWindow
                    ? (isAr ? '✨ زفير بطيء.. انقري الآن!' : '✨ Exhale window — Tap!')
                    : (isAr ? 'شهيق هادئ وامتلاء...' : 'Gentle inhale...')
                  : currentStage === 3
                  ? rippleWarning
                    ? (isAr ? 'تموجت البحيرة! تنفسي دون لمس الشاشة' : 'Ripples! Simply rest hands-free')
                    : (isAr ? 'صفاء عميق يتسع بهدوء...' : 'Stillness deepening...')
                  : (isAr ? 'تنفسي براحة واسترخاء...' : 'Soft breathing...')}
              </span>
            </button>
          </div>

          {/* Stage-Specific Interactive Controls */}
          {currentStage === 1 && (
            <div className="max-w-md mx-auto space-y-2 text-start">
              <p className="text-xs font-bold text-stone-600 dark:text-stone-400 text-center">
                {isAr ? `نقاط تحرير الجسد (${checkedBodyIds.length}/3):` : `Body Release Checkpoints (${checkedBodyIds.length}/3):`}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {BODY_CHECKS.map(chk => {
                  const done = checkedBodyIds.includes(chk.id);
                  return (
                    <button
                      key={chk.id}
                      onClick={() => handleToggleBodyCheck(chk.id)}
                      className={`min-h-11 p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        done
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                          : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>{isAr ? chk.ar : chk.en}</span>
                      <CheckCircle2 className={`w-4 h-4 ${done ? 'text-emerald-600' : 'text-stone-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStage === 2 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono tabular-nums">
              <Wind className="w-4 h-4" />
              <span>{isAr ? `نبضات الزفير المتزامنة: ${syncedBreaths} / 3` : `Synced Exhale Pulses: ${syncedBreaths} / 3`}</span>
            </div>
          )}

          {currentStage === 3 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs font-bold text-sky-800 dark:text-sky-300 font-mono tabular-nums">
              <Sparkles className="w-4 h-4" />
              <span>
                {isAr
                  ? `نقاء البحيرة: ${Math.max(0, 100 - disturbances * 20)}٪`
                  : `Pond Clarity: ${Math.max(0, 100 - disturbances * 20)}%`}
              </span>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              onClick={isRunning ? handlePause : handleStartBreak}
              className={`min-h-12 px-8 py-3 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                isRunning ? 'bg-stone-800 hover:bg-stone-700 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'ابدأي الفاصل اللطيف 🌿' : 'Begin Break 🌿')}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
            ☕
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {isAr ? `أكرمتِ نفسك بالسكينة (المرحلة ${currentStage})!` : `Stage ${currentStage} Rest Completed!`}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«الأشجار تسقط أوراقها في الشتاء لتستريح، ولا أحد يعاتبها.»'
                : 'Nature pauses without apology. Rest allows life to flourish again.'}
            </p>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'كيف يشعر جسدك الآن بعد التوقف؟' : 'How does your body feel after pausing?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي ما تشعرين به...' : 'A note on your calm...'}
              className="w-full text-xs p-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-amber-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => loadStage(currentStage)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة المرحلة' : 'Replay'}</span>
            </button>
            {currentStage < 3 && (
              <button
                onClick={handleNextStage}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black cursor-pointer"
              >
                {isAr ? `المرحلة التالية (${currentStage + 1}) 🚀` : `Next Stage (${currentStage + 1}) 🚀`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
