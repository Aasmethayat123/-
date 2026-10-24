import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';
import {
  RotateCcw,
  Activity,
  Flame
} from 'lucide-react';

interface SomaticShakeGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface BodyZone {
  id: string;
  name: string;
  tensionLevel: number;
  icon: string;
  instruction: string;
}

const GAME_ID = 'game-somatic-shake';

export const SomaticShakeGame: React.FC<SomaticShakeGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const getZonesForStage = (stage: number): BodyZone[] => {
    const allZones: BodyZone[] = [
      {
        id: 'shoulders',
        name: isAr ? 'الكتفان وأعلى الظهر' : 'Shoulders & Neck',
        tensionLevel: stage === 1 ? 75 : 90,
        icon: '🥋',
        instruction: isAr ? 'اهتز وانفض كتفيك للأعلى والأسفل بحرية' : 'Drop and shake shoulders up and down loosely'
      },
      {
        id: 'hands',
        name: isAr ? 'اليدان والأصابع' : 'Hands & Wrists',
        tensionLevel: stage === 1 ? 75 : 85,
        icon: '🤲',
        instruction: isAr ? 'انفض يديك في الهواء كأنك تتخلص من قطرات ماء' : 'Flick and shake hands as if shedding droplets'
      },
      {
        id: 'jaw',
        name: isAr ? 'الفك والوجه' : 'Jaw & Face',
        tensionLevel: stage === 1 ? 75 : 95,
        icon: '🗣️',
        instruction: isAr ? 'أرخِ فكك وافتح فمك قليلاً مع تنهيدة زفير طويلة' : 'Unclench jaw, soften lips with a sighing exhale'
      },
      {
        id: 'chest',
        name: isAr ? 'الصدر والبطن' : 'Chest & Belly',
        tensionLevel: 85,
        icon: '🫁',
        instruction: isAr ? 'أخرج زفيراً متقطعاً واهتز برفق من الجذع' : 'Pulsed exhales while vibrating torso gently'
      },
      {
        id: 'legs',
        name: isAr ? 'الساقان والقدمان' : 'Legs & Feet',
        tensionLevel: 80,
        icon: '🦵',
        instruction: isAr ? 'اركل الهواء برفق ودع ركبتيك لينة ومرنة' : 'Shake legs softly, bounce on soft knees'
      },
      {
        id: 'spine',
        name: isAr ? 'العمود الفقري والحوض' : 'Spine & Pelvis Armor',
        tensionLevel: 100,
        icon: '⚡',
        instruction: isAr ? 'تمايل من الحوض والظهر لفك تجمد الاستجابة الدفاعية العميقة!' : 'Sway pelvis and spine to melt deep freeze armor!'
      }
    ];

    if (stage === 1) return allZones.slice(0, 3);
    if (stage === 2) return allZones.slice(0, 5);
    return allZones;
  };

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => getGameLevelProgress(GAME_ID).currentStage);
  const [zones, setZones] = useState<BodyZone[]>(() => getZonesForStage(getGameLevelProgress(GAME_ID).currentStage));
  const [activeZoneId, setActiveZoneId] = useState<string>('shoulders');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [tapCount, setTapCount] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lastCompletedResult, setLastCompletedResult] = useState<{
    stage: number;
    stars: number;
    moves: number;
    xp: number;
  } | null>(null);

  // Stage 3 mechanic: Deep freeze armor creeps back +5% every 1.9s on partially tense zones if idle!
  useEffect(() => {
    if (currentStage < 3 || completed) return;
    const creepTimer = setInterval(() => {
      setZones(prev =>
        prev.map(z => {
          if (z.tensionLevel > 0 && z.tensionLevel < 95) {
            return { ...z, tensionLevel: Math.min(100, z.tensionLevel + 5) };
          }
          return z;
        })
      );
      setComboStreak(prev => Math.max(0, prev - 1));
    }, 1900);
    return () => clearInterval(creepTimer);
  }, [currentStage, completed]);

  const resetForStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setZones(getZonesForStage(stageNum));
    setActiveZoneId('shoulders');
    setComboStreak(0);
    setTapCount(0);
    setCompleted(false);
    setShowCompletionModal(false);
  };

  const handleSelectStage = (stageNum: number) => {
    setActiveStage(GAME_ID, stageNum);
    setProgress(getGameLevelProgress(GAME_ID));
    resetForStage(stageNum);
  };

  const activeZone = zones.find(z => z.id === activeZoneId) || zones[0];
  const dropPerTap = currentStage === 1 ? 25 : currentStage === 2 ? 20 : (comboStreak >= 4 ? 22 : 16);

  const handleShakeTap = () => {
    if (completed) return;
    setIsShaking(true);
    const nextTaps = tapCount + 1;
    const nextCombo = comboStreak + 1;
    setTapCount(nextTaps);
    setComboStreak(nextCombo);

    if (nextCombo > 0 && nextCombo % 5 === 0) {
      soundManager.playComboSound(Math.min(5, Math.floor(nextCombo / 5)));
    } else {
      soundManager.playShakeRattle();
    }

    setZones(prev => {
      const updated = prev.map(z => {
        if (z.id === activeZoneId) {
          const nextTension = Math.max(0, z.tensionLevel - dropPerTap);
          return { ...z, tensionLevel: nextTension };
        }
        return z;
      });

      // Auto-advance active zone if current just hit 0 and others remain
      const currentAfter = updated.find(z => z.id === activeZoneId);
      if (currentAfter && currentAfter.tensionLevel === 0) {
        const nextRemaining = updated.find(z => z.tensionLevel > 0);
        if (nextRemaining) {
          setTimeout(() => setActiveZoneId(nextRemaining.id), 180);
        }
      }

      const allZero = updated.every(z => z.tensionLevel === 0);
      if (allZero && !completed) {
        setCompleted(true);
        const idealTaps = currentStage === 1 ? 12 : currentStage === 2 ? 25 : 38;
        const stars = nextTaps <= idealTaps + 6 ? 3 : nextTaps <= idealTaps + 16 ? 2 : 1;
        const res = completeStage(GAME_ID, currentStage, stars, nextTaps, onAddXP);
        setProgress(getGameLevelProgress(GAME_ID));
        setLastCompletedResult({
          stage: currentStage,
          stars,
          moves: nextTaps,
          xp: res.xpAwarded
        });
        setShowCompletionModal(true);
      }

      return updated;
    });

    setTimeout(() => setIsShaking(false), 140);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    resetForStage(currentStage);
  };

  const overallTension = Math.round(
    zones.reduce((sum, z) => sum + z.tensionLevel, 0) / zones.length
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-fade-in">
      {/* Top Arcade Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← الألعاب' : '← Games'}
            </button>
          )}
          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
            {isAr ? 'نفض وتفريغ التوتر الجسدي 🫨' : 'Somatic Shake 🫨'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold font-mono">
          {currentStage >= 2 && comboStreak >= 2 && (
            <span className="flex items-center gap-1 text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              x{comboStreak}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-orange-400" />
            <span>{isAr ? `التوتر: ${overallTension}%` : `Tension: ${overallTension}%`}</span>
          </div>
        </div>
      </div>

      {/* Stage Selector */}
      <StageLevelSelector
        language={language}
        gameId={GAME_ID}
        currentStage={currentStage}
        progress={progress}
        onSelectStage={handleSelectStage}
        showCompletionModal={showCompletionModal}
        completedStageNumber={lastCompletedResult?.stage || currentStage}
        starsEarned={lastCompletedResult?.stars || 3}
        movesMade={lastCompletedResult?.moves}
        xpEarned={lastCompletedResult?.xp}
        onNextStage={() => handleSelectStage(currentStage + 1)}
        onReplayStage={handleReset}
        onCloseCompletionModal={() => setShowCompletionModal(false)}
      />

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider block">
              {currentStage === 1 && (isAr ? 'المرحلة ١: تفريغ الجزء العلوي (٣ مراكز خفيفة)' : 'Stage 1: Upper Body Quick Release (3 Zones)')}
              {currentStage === 2 && (isAr ? 'المرحلة ٢: مسح الجسد الكامل وبناء سلسلة النفض (٥ مراكز)' : 'Stage 2: Full Body Combo Discharge (5 Zones)')}
              {currentStage === 3 && (isAr ? 'المرحلة ٣: كسر درع التجمد العميق قبل عودة الشد! (٦ مراكز)' : 'Stage 3: Deep Freeze Armor — Keep Shaking Before Tension Creeps Back!')}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'انفض التوتر خارج جسدك!' : 'Shake the Tension Out!'}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              {currentStage === 3
                ? (isAr
                    ? 'تنبيه المرحلة ٣: الشد العميق يحاول العودة تدريجياً للمناطق غير المكتملة! حافظ على إيقاع نفض متواصل حتى تصل كل منطقة إلى ٠٪.'
                    : 'Stage 3 Alert: Partially tense zones slowly tighten back up if idle! Clear each zone all the way to 0% to lock its release.')
                : (isAr
                    ? 'اختر كل منطقة جسدية واضغط مع النفض الواقعي لكتفيك ويديك لتفريغ الكورتيزول المخزن.'
                    : 'Target each body center and physically shake loose along with every tap!')}
            </p>
          </div>

          {/* Body Zones Selector Grid */}
          <div className={`grid gap-2.5 ${zones.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}>
            {zones.map((zone) => {
              const isSelected = zone.id === activeZoneId;
              const isCleared = zone.tensionLevel === 0;

              return (
                <button
                  key={zone.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    setActiveZoneId(zone.id);
                  }}
                  className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between space-y-1.5 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-400 shadow-sm'
                      : isCleared
                      ? 'border-emerald-300 bg-emerald-50/70 text-emerald-900'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <span className="text-2xl">{isCleared ? '🌿' : zone.icon}</span>
                  <span className="text-xs font-bold truncate w-full">{zone.name}</span>
                  <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 ${isCleared ? 'bg-emerald-500' : 'bg-orange-500'}`}
                      style={{ width: `${zone.tensionLevel}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isCleared ? 'bg-emerald-200 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {isCleared ? (isAr ? 'متحرر ✓' : 'Released ✓') : `${zone.tensionLevel}%`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Target Interactive Shaker Button */}
          <div className="p-7 bg-gradient-to-br from-stone-50 to-orange-50/60 rounded-3xl border-2 border-stone-200 text-center space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-orange-800 uppercase tracking-wider block">
                {isAr ? `المنطقة النشطة: ${activeZone.name}` : `Active Target: ${activeZone.name}`}
              </span>
              <p className="text-sm font-bold text-stone-900 font-serif">
                «{activeZone.instruction}»
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleShakeTap}
                className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-orange-500 bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-extrabold text-lg sm:text-xl shadow-xl transition-all cursor-pointer transform active:scale-90 flex flex-col items-center justify-center space-y-1 mx-auto select-none ${
                  isShaking ? 'animate-bounce scale-105' : 'hover:scale-105'
                }`}
              >
                <span className="text-4xl">🫨</span>
                <span>{isAr ? 'انفض الآن!' : 'Shake Loose!'}</span>
                <span className="text-xs font-mono opacity-90">-{dropPerTap}%</span>
              </button>
            </div>

            <p className="text-xs text-stone-500">
              {isAr
                ? '💡 انفض المنطقة جسدياً في الواقع مع كل نقرة على الزر!'
                : '💡 Physically shake this body zone in real life with each tap!'}
            </p>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🫨
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'تم تفريغ كامل الشحنة الجسدية بنجاح!' : 'Full Somatic Release Achieved!'}
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
              {isAr
                ? `حررت جميع المراكز الجسدية في المرحلة ${currentStage} إلى ٠٪ بـ ${tapCount} نفضة نشطة.`
                : `Cleared all somatic centers in Stage ${currentStage} to 0% in ${tapCount} shakes.`}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة المرحلة' : 'Shake Again'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'العودة لقائمة الألعاب' : 'Back to Games'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
