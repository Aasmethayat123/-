import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import {
  RotateCcw,
  Bookmark,
  Sun,
  CloudFog,
  Star
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface SmallLightHopeGameProps {
  language: Language;
  onBackToMap?: () => void;
  onAddXP?: (amount: number) => void;
}

const STAGE_ANCHORS: Record<number, string[]> = {
  1: [
    'نَفَس عميق يدخل رئتيك الآن ويجدد خلاياك',
    'شخص واحد في العالم يتمنى لك الخير والسكينة',
    'صباح جديد وفرصة غير مكتوبة بعد',
    'قوتك الداخلية التي عبرت بك كل الأيام الصعبة السابقة',
    'رحمة الله الواسعة التي تسع ضعفك واحتياجك'
  ],
  2: [
    'لمسة دفء في كوب شاي أو نسمة هواء هادئة',
    'قدرتك على البدء من جديد حتى بعد التعب',
    'دمعة صادقة غسلت قلبك وخففت ثقله',
    'خطوة واحدة صغيرة تكفي اليوم ولا يلزمك القفز',
    'أثر طيب تركتِه في قلب إنسان دون أن تدري',
    'حكمة نضجت داخلك من قلب التجربة الصعبة',
    'نور الفجر يولد دائماً من أعمق ساعات الليل'
  ],
  3: [
    'نجمة الصبر: ما زرعتِه بدمعك سيزهر في أوانه',
    'نجمة الرحمة: لستِ مطالبة بحمل الكون وحدك',
    'نجمة الصدق: قلبك السليم كنز لا يصدأ',
    'نجمة التجاوز: نجوتِ ١٠٠٪ من أشد أيامك السابقة',
    'نجمة السكينة: في التمهّل بركة لا يراها المستعجل',
    'نجمة القبول: ضعفك البشري باب للطف الإلهي',
    'نجمة الوصل: هناك دائماً قلوب تشبه نقاءك',
    'نجمة الرجاء: الغد صفحة بيضاء لم تُكتب بعد'
  ]
};

interface DoubtCloud {
  id: number;
  x: number;
  y: number;
  label: string;
}

const CONSTELLATION_POINTS = [
  { x: 18, y: 68 },
  { x: 30, y: 42 },
  { x: 44, y: 55 },
  { x: 52, y: 26 },
  { x: 65, y: 48 },
  { x: 74, y: 22 },
  { x: 84, y: 56 },
  { x: 50, y: 78 }
];

const GAME_ID = 'small-light';

export const SmallLightHopeGame: React.FC<SmallLightHopeGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const anchors = STAGE_ANCHORS[currentStage] || STAGE_ANCHORS[1];
  const maxSteps = anchors.length;

  const [lightStep, setLightStep] = useState<number>(1);
  // Stage 2: Doubt clouds that appear and block feeding until cleared!
  const [clouds, setClouds] = useState<DoubtCloud[]>([]);
  const [cloudsCleared, setCloudsCleared] = useState<number>(0);

  // Stage 3: Constellation star nodes lit in order
  const [litStars, setLitStars] = useState<number[]>([0]);

  const [completed, setCompleted] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setLightStep(1);
    setClouds([]);
    setCloudsCleared(0);
    setLitStars([0]);
    setCompleted(false);
    setShowCompletionModal(false);
    setIsSaved(false);
  };

  // Spawn doubt clouds in Stage 2 periodically
  useEffect(() => {
    if (currentStage !== 2 || completed) return;
    const labels = isAr
      ? ['«لا فائدة من المحاولة»', '«الظلام لن ينتهي»', '«تأخرتُ كثيراً»']
      : ['“Nothing will change”', '“Too late now”', '“Why even try”'];
    const timer = setInterval(() => {
      setClouds(prev => {
        if (prev.length >= 2) return prev;
        return [
          ...prev,
          {
            id: Date.now(),
            x: 15 + ((Date.now() * 7) % 65),
            y: 18 + ((Date.now() * 3) % 55),
            label: labels[Date.now() % labels.length]
          }
        ];
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [currentStage, completed, isAr]);

  const finishStage = (stars = 3) => {
    setEarnedStars(stars);
    const res = completeStage(GAME_ID, currentStage, stars, maxSteps, onAddXP);
    setEarnedXP(res.xpAwarded);
    setProgress(getGameLevelProgress(GAME_ID));
    setCompleted(true);
    setShowCompletionModal(true);
  };

  const handleClearCloud = (id: number) => {
    soundManager.playWhoosh();
    setClouds(prev => prev.filter(c => c.id !== id));
    setCloudsCleared(c => c + 1);
  };

  const handleFeedLight = () => {
    if (currentStage === 2 && clouds.length > 0) {
      soundManager.playSoftTap();
      return;
    }
    soundManager.playBloomChime();
    if (lightStep < maxSteps) {
      setLightStep(prev => prev + 1);
    } else {
      const stars = currentStage === 2 ? (cloudsCleared >= 2 ? 3 : 2) : 3;
      finishStage(stars);
    }
  };

  const handleLightConstellationStar = (idx: number) => {
    if (currentStage !== 3 || completed) return;
    if (idx !== litStars.length) {
      soundManager.playSoftTap();
      return;
    }
    soundManager.playBloomChime();
    const next = [...litStars, idx];
    setLitStars(next);
    setLightStep(next.length);
    if (next.length >= CONSTELLATION_POINTS.length) {
      setTimeout(() => finishStage(3), 450);
    }
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
      gameId: 'small-light',
      gameTitle: isAr ? `نور صغير (المرحلة ${currentStage})` : `A Little Light (Stage ${currentStage})`,
      quote: isAr ? 'يكفي نور صغير جداً ليبدد أعتى الظلمات.' : 'A tiny light is enough to pierce the darkest night.',
      reflection: userReflection || (isAr ? 'أضأت كوكبة الرجاء في قلبي.' : 'Lit the constellation of hope within.'),
      tag: isAr ? 'الرجاء والأمل' : 'Hope'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
    if (onAddXP) onAddXP(15);
  };

  const lightGlowSize = 72 + lightStep * 32;

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
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              <span>{isAr ? 'نور صغير (الرجاء) 🕯️' : 'A Little Light (Hope) 🕯️'}</span>
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {currentStage === 1
                ? (isAr ? 'المرحلة ١: إيقاد ٥ شرارات رجاء هادئة' : 'Stage 1: Kindle 5 calm sparks of hope')
                : currentStage === 2
                ? (isAr ? 'المرحلة ٢: بدّدي غيوم اليأس العابرة بالنقر لتحمي الشعلة!' : 'Stage 2: Tap away drifting doubt clouds to feed the flame!')
                : (isAr ? 'المرحلة ٣: وصّلي كوكبة النجوم الـ ٨ بالترتيب في سماء الليل' : 'Stage 3: Connect all 8 Constellation Stars in sequence')}
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
            movesMade={lightStep}
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
        <div className="bg-stone-950 text-white rounded-3xl border-2 border-stone-800 p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-stone-400 relative z-10">
            <span className="font-mono tabular-nums">
              {isAr ? `الإشراق ${lightStep} من ${maxSteps}` : `Spark ${lightStep} of ${maxSteps}`}
            </span>
            {currentStage === 2 && (
              <span className="text-amber-300 font-mono tabular-nums">
                {isAr ? `غيوم مبددة: ${cloudsCleared}` : `Clouds cleared: ${cloudsCleared}`}
              </span>
            )}
          </div>

          {currentStage < 3 ? (
            <div className="py-6 relative h-64 flex items-center justify-center">
              {/* Stage 2 Drifting Doubt Clouds */}
              {clouds.map(cloud => (
                <button
                  key={cloud.id}
                  onClick={() => handleClearCloud(cloud.id)}
                  style={{ left: `${cloud.x}%`, top: `${cloud.y}%` }}
                  className="absolute z-20 px-3 py-2 rounded-2xl bg-stone-800/95 border border-stone-600 text-stone-200 text-xs font-bold flex items-center gap-1.5 shadow-xl cursor-pointer hover:bg-amber-500 hover:text-stone-950 transition-colors animate-pulse"
                >
                  <CloudFog className="w-4 h-4" />
                  <span>{cloud.label} ✕</span>
                </button>
              ))}

              <div
                onClick={handleFeedLight}
                className={`rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-100 flex items-center justify-center cursor-pointer transform hover:scale-105 transition-all duration-700 select-none ${
                  clouds.length > 0 ? 'opacity-45 scale-90' : ''
                }`}
                style={{
                  width: `${lightGlowSize}px`,
                  height: `${lightGlowSize}px`,
                  boxShadow: `0 0 ${lightStep * 22}px rgba(251, 191, 36, 0.75)`
                }}
              >
                <span className="text-3xl sm:text-4xl">✨</span>
              </div>
            </div>
          ) : (
            /* Stage 3: Interactive Star Constellation Canvas */
            <div className="relative h-72 rounded-2xl bg-gradient-to-b from-[#090d1a] to-[#131b36] border border-indigo-900/60 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {litStars.map((starIdx, i) => {
                  if (i === 0) return null;
                  const prev = CONSTELLATION_POINTS[litStars[i - 1]];
                  const curr = CONSTELLATION_POINTS[starIdx];
                  return (
                    <line
                      key={starIdx}
                      x1={prev.x}
                      y1={prev.y}
                      x2={curr.x}
                      y2={curr.y}
                      stroke="#fbbf24"
                      strokeWidth="0.8"
                      strokeDasharray="2 1"
                    />
                  );
                })}
              </svg>

              {CONSTELLATION_POINTS.map((pt, idx) => {
                const isLit = litStars.includes(idx);
                const isNext = idx === litStars.length;
                return (
                  <button
                    key={idx}
                    onClick={() => handleLightConstellationStar(idx)}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    className={`-translate-x-1/2 -translate-y-1/2 absolute w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isLit
                        ? 'bg-amber-400 text-stone-950 shadow-[0_0_20px_rgba(251,191,36,0.9)] scale-105'
                        : isNext
                        ? 'bg-indigo-900/90 border-2 border-amber-400 text-amber-300 animate-pulse scale-110'
                        : 'bg-stone-800/70 border border-stone-700 text-stone-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isLit ? 'fill-stone-950' : ''}`} />
                    <span className="text-[9px] font-mono font-bold ms-0.5">{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="p-4 bg-stone-900/90 rounded-2xl border border-stone-800 max-w-md mx-auto space-y-1 relative z-10">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              {isAr ? 'رسالة النور الحالية:' : 'Present Spark of Hope:'}
            </span>
            <p className="text-sm font-semibold text-stone-200 font-serif">
              «{anchors[Math.min(lightStep - 1, anchors.length - 1)]}»
            </p>
          </div>

          {currentStage < 3 && (
            <div className="flex justify-center pt-1 relative z-10">
              <button
                onClick={handleFeedLight}
                disabled={clouds.length > 0}
                className={`min-h-11 px-8 py-3 rounded-2xl text-xs font-extrabold shadow-lg transition-all ${
                  clouds.length > 0
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer transform hover:scale-105'
                }`}
              >
                {clouds.length > 0
                  ? (isAr ? 'انقري غيوم الشك أولاً لتبديدها ☁️' : 'Tap Doubt Clouds First ☁️')
                  : (isAr ? 'تغذية النور بنَفَس هادئ ✨' : 'Feed the Light ✨')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
            ☀️
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            {isAr ? `أشرقت المرحلة ${currentStage} في أعماقك 🌿` : `Stage ${currentStage} Light Has Dawned 🌿`}
          </h2>

          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'ما هو النور الصغير الذي تشعرين بالامتنان له في هذه اللحظة؟' : 'What tiny spark are you grateful for right now?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي نورك الصغير...' : 'A grateful spark...'}
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
