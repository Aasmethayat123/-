import React, { useState } from 'react';
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
  CheckCircle2,
  ArrowRight,
  Anchor,
  Heart
} from 'lucide-react';

interface SensoryGroundingGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface SenseStep {
  level: number;
  sense: string;
  title: string;
  desc: string;
  examples: string[];
  qualities?: string[];
}

const GAME_ID = 'game-sensory-grounding';

export const SensoryGroundingGame: React.FC<SensoryGroundingGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const getStepsForStage = (stage: number): SenseStep[] => {
    if (stage === 1) {
      // Quick 3-2-1 emergency grounding anchor
      return [
        {
          level: 3,
          sense: isAr ? 'البصر 👁️' : 'Sight 👁️',
          title: isAr ? '٣ أشياء تراها أمامك الآن' : '3 Things You See Right Now',
          desc: isAr ? 'مرساة طوارئ سريعة: سمِّ ٣ عناصر مادية ثابتة في محيطك.' : 'Quick emergency anchor: spot 3 solid objects around you.',
          examples: isAr ? ['لون حائط أو ستارة', 'قطعة أثاث ثابتة', 'مصدر ضوء في الغرفة'] : ['Wall or curtain color', 'Solid piece of furniture', 'Light source nearby']
        },
        {
          level: 2,
          sense: isAr ? 'اللمس 🖐️' : 'Touch 🖐️',
          title: isAr ? 'شيئان تلمسهما بيدك أو قدميك' : '2 Things You Can Touch',
          desc: isAr ? 'اشعر بصلابة الأرض تحت قدميك وملمس ملابسك.' : 'Feel the floor beneath your feet and fabric under your fingers.',
          examples: isAr ? ['ثبات القدمين على الأرض', 'ملمس القماش أو الطاولة'] : ['Feet grounded on floor', 'Fabric or desk texture']
        },
        {
          level: 1,
          sense: isAr ? 'النَفَس 🫁' : 'Breath 🫁',
          title: isAr ? 'نَفَس عميق واحد يربطك باللحظة' : '1 Deep Grounding Breath',
          desc: isAr ? 'خذ شهيقاً بطيئاً وازفر ببطء معلناً وصولك لهنا والآن.' : 'Take one slow inhale and long exhale to arrive here.',
          examples: isAr ? ['زفير طويل هادئ يفرغ التوتر'] : ['One long calming exhale']
        }
      ];
    }

    const fullFive: SenseStep[] = [
      {
        level: 5,
        sense: isAr ? 'البصر 👁️' : 'Sight 👁️',
        title: isAr ? '٥ تفاصيل دقيقة يمكنك رؤيتها الآن' : '5 Subtle Visual Details',
        desc: isAr ? 'انظر حولك وابحث عن تفاصيل لم تنتبه لها من قبل: ظل، انعكاس ضوء، تدرج لوني...' : 'Scan the room for subtle visual details: shadows, reflections, shades...',
        examples: isAr
          ? ['تدرج ظل على الحائط', 'انعكاس ضوء صغير', 'نبتة أو زجاجة ماء', 'تفصيلة في سقف الغرفة', 'حافة مكتب أو كتاب']
          : ['Shadow gradient', 'Tiny light reflection', 'Plant or bottle', 'Ceiling corner detail', 'Book or desk edge'],
        qualities: isAr ? ['دافئ الإضاءة ☀️', 'هادئ الظلال 🌙', 'غني بالألوان 🎨'] : ['Warm light ☀️', 'Soft shadows 🌙', 'Colorful 🎨']
      },
      {
        level: 4,
        sense: isAr ? 'اللمس 🖐️' : 'Touch 🖐️',
        title: isAr ? '٤ ملامس مختلفة تحت أصابعك' : '4 Distinct Textures to Touch',
        desc: isAr ? 'قارن بين الناعم والخشن والبارد والدافئ في مكانك.' : 'Compare smooth, rough, cool, and warm surfaces within reach.',
        examples: isAr
          ? ['ملمس قماش ملابسك', 'برودة سطح الطاولة أو الهاتف', 'ثبات قدميك على الأرض', 'دفء كف يدك على الأخرى']
          : ['Shirt fabric', 'Coolness of desk/screen', 'Feet flat on ground', 'Warmth of palm on palm'],
        qualities: isAr ? ['ناعم ومريح ☁️', 'بارد ومنعش ❄️', 'صلب وثابت 🪨'] : ['Soft & cozy ☁️', 'Cool & crisp ❄️', 'Solid & steady 🪨']
      },
      {
        level: 3,
        sense: isAr ? 'السمع 👂' : 'Hearing 👂',
        title: isAr ? '٣ طبقات صوتية في المحيط' : '3 Layers of Sound',
        desc: isAr ? 'التقط صوتاً قريباً جداً، وصوتاً في الغرفة، وصوتاً بعيداً في الخارج.' : 'Catch a close sound, a room sound, and a distant horizon sound.',
        examples: isAr
          ? ['إيقاع أنفاسك القريب', 'صوت خافت داخل الغرفة', 'صوت بعيد خلف النافذة']
          : ['Your close breathing', 'Subtle hum inside room', 'Distant sound outside'],
        qualities: isAr ? ['سكون لطيف 🍃', 'همس رتيب 🌊', 'حيوية هادئة 🐦'] : ['Gentle quiet 🍃', 'Rhythmic hum 🌊', 'Soft life 🐦']
      },
      {
        level: 2,
        sense: isAr ? 'الشم 👃' : 'Smell 👃',
        title: isAr ? 'شيئان يمكنك استنشاقهما بوعي' : '2 Scents in Your Space',
        desc: isAr ? 'استنشق هواء المكان أو رائحة قهوة أو عطر على معصمك.' : 'Inhale the room air, coffee, soap, or your wrist.',
        examples: isAr ? ['رائحة معصمك أو ملابسك', 'نسيم وهواء الغرفة'] : ['Scent on wrist/clothes', 'Freshness of room air'],
        qualities: isAr ? ['منعش ونقي 🌿', 'دافئ ومألوف ☕'] : ['Fresh & clean 🌿', 'Warm & familiar ☕']
      },
      {
        level: 1,
        sense: isAr ? 'التذوق والنبض الداخلي 👅💓' : 'Taste & Interoceptive Anchor 👅💓',
        title: stage === 3
          ? (isAr ? 'مرساة التذوق + نبض القلب الداخلي (Interoception)' : '1 Taste + Inner Heartbeat Anchor')
          : (isAr ? 'شيء واحد يمكنك تذوقه بهدوء' : '1 Thing You Can Taste'),
        desc: stage === 3
          ? (isAr ? 'تذوق رشفة ماء أو رطوبة فمك، ثم ضع يدك على صدرك واستشعر نبضة أمان واحدة.' : 'Notice taste in your mouth, then place a hand on your chest and feel one steady heartbeat.')
          : (isAr ? 'رشفة ماء، أو لاحظ الإحساس النقي داخل فمك بهدوء.' : 'Take a sip of water or notice the calm sensation in your mouth.'),
        examples: stage === 3
          ? (isAr ? ['انتعاش الفم ورشفة الماء', 'نبضة القلب الدافئة تحت كفي'] : ['Clean taste / sip of water', 'Steady heartbeat beneath my palm'])
          : (isAr ? ['رشفة ماء نقية وحضور تام'] : ['Clean sip of water']),
        qualities: isAr ? ['أمان داخلي عميق 💚', 'امتنان وحضور ✨'] : ['Deep inner safety 💚', 'Grounded gratitude ✨']
      }
    ];

    return fullFive;
  };

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => getGameLevelProgress(GAME_ID).currentStage);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [totalChecks, setTotalChecks] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lastCompletedResult, setLastCompletedResult] = useState<{
    stage: number;
    stars: number;
    moves: number;
    xp: number;
  } | null>(null);

  const steps = getStepsForStage(currentStage);
  const step = steps[currentStepIndex] || steps[0];

  const resetStageState = (stageNum: number) => {
    setCurrentStage(stageNum);
    setCurrentStepIndex(0);
    setCompletedItems([]);
    setSelectedQuality(null);
    setTotalChecks(0);
    setIsFinished(false);
    setShowCompletionModal(false);
  };

  const handleSelectStage = (stageNum: number) => {
    setActiveStage(GAME_ID, stageNum);
    setProgress(getGameLevelProgress(GAME_ID));
    resetStageState(stageNum);
  };

  const handleToggleItem = (idx: number) => {
    soundManager.playPop();
    if (!completedItems.includes(idx)) {
      const next = [...completedItems, idx];
      setCompletedItems(next);
      setTotalChecks(prev => prev + 1);
      if (next.length >= step.examples.length) {
        soundManager.playHarmonicAffirmation();
      }
    }
  };

  const requiresQuality = currentStage === 3 && !!step.qualities?.length;
  const canProceed = completedItems.length >= step.examples.length && (!requiresQuality || !!selectedQuality);

  const handleNextStep = () => {
    soundManager.playSoftTap();
    if (currentStepIndex + 1 < steps.length) {
      setCurrentStepIndex(prev => prev + 1);
      setCompletedItems([]);
      setSelectedQuality(null);
    } else {
      setIsFinished(true);
      const res = completeStage(GAME_ID, currentStage, 3, totalChecks, onAddXP);
      setProgress(getGameLevelProgress(GAME_ID));
      setLastCompletedResult({
        stage: currentStage,
        stars: 3,
        moves: totalChecks,
        xp: res.xpAwarded
      });
      setShowCompletionModal(true);
    }
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    resetStageState(currentStage);
  };

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
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {isAr ? 'تأريض الحواس 5-4-3-2-1 ⚓' : '5-4-3-2-1 Grounding ⚓'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
          <Anchor className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? `المحطة ${step.level}` : `Anchor ${step.level}`}</span>
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

      {!isFinished ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block">
              {currentStage === 1 && (isAr ? 'المرحلة ١: مرساة الطوارئ السريعة (٣-٢-١)' : 'Stage 1: Rapid 3-2-1 Emergency Anchor')}
              {currentStage === 2 && (isAr ? 'المرحلة ٢: المسح الحسي الكامل (٥-٤-٣-٢-١)' : 'Stage 2: Full 5-4-3-2-1 Sensory Scan')}
              {currentStage === 3 && (isAr ? 'المرحلة ٣: التأريض العميق + البصمة الحسية والنبض الداخلي' : 'Stage 3: Deep Interoceptive & Qualitative Grounding')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {step.title}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-serif">
              «{step.desc}»
            </p>
          </div>

          {/* Interactive Check Items */}
          <div className="space-y-2.5 max-w-md mx-auto">
            {step.examples.map((item, idx) => {
              const isChecked = completedItems.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleToggleItem(idx)}
                  className={`w-full text-start p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <span className="text-sm font-semibold">{item}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isChecked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-300'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stage 3 Mindful Quality Tagging */}
          {requiresQuality && (
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-teal-900">
                <Heart className="w-3.5 h-3.5 text-teal-600" />
                <span>{isAr ? 'صِف طبيعة الإحساس الغالب في هذه الحاسة الآن:' : 'Name the dominant sensory quality right now:'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {step.qualities!.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      soundManager.playSoftTap();
                      setSelectedQuality(q);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedQuality === q
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-teal-400'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2 max-w-md mx-auto">
            <button
              disabled={!canProceed}
              onClick={handleNextStep}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                canProceed
                  ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>
                {currentStepIndex + 1 < steps.length
                  ? (isAr ? 'الحاسة التالية' : 'Next Sense')
                  : (isAr ? 'إتمام التأريض الكامل' : 'Complete Grounding')}
              </span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            ⚓
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'أنت الآن راسخ في اللحظة الراهنة!' : 'Fully Anchored in the Present!'}
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
              {isAr
                ? `أكملت المرحلة ${currentStage} بنجاح؛ عادت حواسك لتؤكد لجهازك العصبي أنك في مكان آمن الآن.`
                : `Completed Stage ${currentStage}; your physical senses interrupted the mental worry loop.`}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة المرحلة' : 'Ground Again'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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
