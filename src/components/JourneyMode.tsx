import React, { useState } from 'react';
import { 
  Scenario, 
  ThoughtOption, 
  EmotionOption, 
  ActionOption, 
  Language, 
  StageId 
} from '../types';
import { SCENARIOS } from '../data/scenarios';
import { AVATARS } from '../utils/gameState';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Heart, 
  Activity, 
  Sparkles, 
  MessageSquare, 
  Star, 
  Check, 
  Flame, 
  Smartphone, 
  Compass, 
  Rewind,
  Zap
} from 'lucide-react';

interface JourneyModeProps {
  language: Language;
  onOpenBreathing: () => void;
  selectedLevelId?: string;
  onBackToMap?: () => void;
  playerAvatarId?: string;
  onRecordStars?: (levelId: string, stars: number) => void;
}

export const JourneyMode: React.FC<JourneyModeProps> = ({
  language,
  onOpenBreathing,
  selectedLevelId = 'unread-message',
  onBackToMap,
  playerAvatarId = 'sara',
  onRecordStars
}) => {
  const isAr = language === 'ar';
  const scenarios = SCENARIOS[language];

  const [currentScenarioId, setCurrentScenarioId] = useState<string>(selectedLevelId);
  const [stage, setStage] = useState<StageId | 6>(1);

  // Player choices
  const [selectedThought, setSelectedThought] = useState<ThoughtOption | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionOption | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionOption | null>(null);

  // Reframe stage
  const [altThought, setAltThought] = useState<string>('');
  const [isRewound, setIsRewound] = useState<boolean>(false);

  const scenario = scenarios.find((s) => s.id === currentScenarioId) || scenarios[0];
  const avatar = AVATARS[language].find(a => a.id === playerAvatarId) || AVATARS[language][0];

  // Live Game Vitals
  const currentBPM = selectedEmotion 
    ? (stage >= 5 ? 70 : selectedEmotion.heartBpm || 115) 
    : 75;

  const getLeadingPointerAngle = () => {
    if (stage === 1) return 0; // neutral
    if (stage === 2) return -45; // Thoughts leading
    if (stage === 3) return 45; // Feelings leading
    if (stage === 4) return selectedThought?.type === 'catastrophic' ? -60 : 30;
    if (stage >= 5) return 0; // Balanced conscious center!
    return 0;
  };

  const getAvatarFace = () => {
    if (stage >= 5) return '🌿'; // Zen/Balanced
    if (!selectedEmotion) return avatar.avatarChar;
    switch (selectedEmotion.category) {
      case 'anxiety': return '😟';
      case 'anger': return '😠';
      case 'sadness': return '🥺';
      case 'frustration': return '😤';
      case 'fear': return '😨';
      case 'calm': return '😌';
      default: return '🤔';
    }
  };

  const handleSelectThought = (thought: ThoughtOption) => {
    soundManager.playSoftTap();
    setSelectedThought(thought);
  };

  const handleSelectEmotion = (emotion: EmotionOption) => {
    soundManager.playHeartbeat();
    setSelectedEmotion(emotion);
  };

  const handleSelectAction = (action: ActionOption) => {
    soundManager.playSoftTap();
    setSelectedAction(action);
  };

  const handleRewindAndReframe = () => {
    soundManager.playRewindSound();
    setIsRewound(true);
    setTimeout(() => {
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
      if (onRecordStars) {
        onRecordStars(scenario.id, 3);
      }
    }, 400);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setStage(1);
    setSelectedThought(null);
    setSelectedEmotion(null);
    setSelectedAction(null);
    setIsRewound(false);
    setAltThought('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Game Navigation & Vitals HUD */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Back button & Scenario title */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {onBackToMap && (
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onBackToMap();
              }}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'الخريطة' : 'Map'}</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                {isAr ? `المستوى ${scenario.levelNumber}` : `Level ${scenario.levelNumber}`}
              </span>
              <span className="text-stone-500">·</span>
              <span className="text-xs text-stone-400">{scenario.category}</span>
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {scenario.title}
            </h2>
          </div>
        </div>

        {/* Center: Live Character Vitals (Heart BPM & Expression) */}
        <div className="flex items-center gap-4 bg-stone-800/90 px-4 py-2 rounded-2xl border border-stone-700 text-xs w-full md:w-auto justify-around">
          {/* Animated Avatar Face */}
          <div className="flex items-center gap-2">
            <span className="text-2xl transition-transform transform scale-110">
              {getAvatarFace()}
            </span>
            <div>
              <span className="text-[10px] text-stone-400 block uppercase font-semibold">
                {avatar.name}
              </span>
              <span className="text-xs font-bold text-emerald-300">
                {stage >= 5 ? (isAr ? 'متزن وواعٍ 🌿' : 'Centered 🌿') : (selectedEmotion ? selectedEmotion.name : (isAr ? 'طبيعي' : 'Normal'))}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-stone-700" />

          {/* Simulated Heart Pulse BPM */}
          <div className="flex items-center gap-2">
            <Activity className={`w-4 h-4 text-rose-500 ${currentBPM > 90 ? 'animate-bounce' : 'animate-pulse'}`} />
            <div>
              <span className="text-[10px] text-stone-400 block uppercase font-semibold">
                {isAr ? 'نبضات القلب' : 'Pulse BPM'}
              </span>
              <span className={`text-sm font-bold font-mono ${currentBPM > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentBPM} BPM
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-stone-700" />

          {/* Meter: Who is Leading? */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-400 uppercase font-semibold mb-0.5">
              {isAr ? 'من يقود الآن؟' : 'Who Leads?'}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span className={stage === 2 ? 'text-amber-400' : 'text-stone-500'}>🧠</span>
              <span className="text-stone-600">/</span>
              <span className={stage === 3 ? 'text-rose-400' : 'text-stone-500'}>❤️</span>
              <span className="text-stone-600">/</span>
              <span className={stage >= 5 ? 'text-emerald-400 font-extrabold' : 'text-stone-500'}>🌿</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Progress Bar (1 -> 2 -> 3 -> 4 -> 5) */}
      <div className="flex items-center justify-between gap-1 p-1 bg-white rounded-2xl border border-stone-200 shadow-xs text-xs font-semibold">
        {[
          { num: 1, label: isAr ? '1. ماذا حدث؟' : '1. Event' },
          { num: 2, label: isAr ? '2. الفكرة' : '2. Thought' },
          { num: 3, label: isAr ? '3. الشعور' : '3. Emotion' },
          { num: 4, label: isAr ? '4. رد الفعل' : '4. Action' },
          { num: 5, label: isAr ? '5. إعادة الصياغة 🌿' : '5. Reframe 🌿' }
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => {
              if (s.num <= stage) {
                soundManager.playSoftTap();
                setStage(s.num as StageId);
              }
            }}
            className={`flex-1 py-2 px-2 text-center rounded-xl transition-all cursor-pointer truncate ${
              stage === s.num
                ? 'bg-stone-900 text-white font-bold shadow-xs'
                : stage > s.num
                ? 'text-emerald-800 hover:bg-emerald-50'
                : 'text-stone-300 cursor-not-allowed'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* STAGE 1: What Happened? (The Interactive Phone / Scene Sim) */}
      {/* ============================================================== */}
      {stage === 1 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {isAr ? 'المرحلة 1: نقطة البداية' : 'Stage 1: The Raw Trigger'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                {isAr ? 'ما الذي حدث على أرض الواقع؟' : 'What Actually Happened?'}
              </h2>
            </div>
            <span className="text-3xl">📱</span>
          </div>

          {/* Interactive Phone Simulation Card */}
          <div className="max-w-md mx-auto bg-stone-900 rounded-3xl p-4 shadow-xl border-4 border-stone-700 text-stone-100 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-stone-800 pb-2">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isAr ? 'إشعار وارد' : 'Notification'}</span>
              </div>
            </div>

            <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">
                  {scenario.context}
                </span>
                <span className="text-[10px] text-stone-400">10:00 AM</span>
              </div>
              <p className="text-sm font-medium text-stone-100 leading-relaxed font-serif">
                «{scenario.situation}»
              </p>
            </div>

            <div className="text-center pt-1 text-[11px] text-stone-400">
              {isAr ? 'هذا كل ما رصدته الكاميرا والشاشة — لا مشاعر ولا قصص حتى الآن.' : 'Raw observable facts — zero story added yet.'}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setStage(2);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <span>{isAr ? 'الخطوة التالية: بماذا فكّرت؟' : 'Next: What Did I Think?'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STAGE 2: What Did I Think? (Automatic Thought Selection) */}
      {/* ============================================================== */}
      {stage === 2 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {isAr ? 'المرحلة 2: وميض الأفكار 🧠' : 'Stage 2: Automatic Thought 🧠'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              {isAr ? 'أي فكرة تلقائية لمعت في رأسك فوراً؟' : 'Which thought flashed in your mind instantly?'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {isAr ? 'اختر الفكرة التي تشعر أنها تهاجمك أو تخطر ببالك:' : 'Choose the thought that feels most familiar:'}
            </p>
          </div>

          <div className="space-y-3">
            {scenario.thoughtOptions.map((thought) => {
              const isSelected = selectedThought?.id === thought.id;
              return (
                <button
                  key={thought.id}
                  onClick={() => handleSelectThought(thought)}
                  className={`w-full text-start p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500 text-amber-950'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm sm:text-base font-bold text-stone-900">
                      {thought.text}
                    </p>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs">
                        {isAr ? 'تم الاختيار ✓' : 'Selected ✓'}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-amber-200/60 text-xs text-amber-900">
                      <span className="font-bold">{isAr ? 'فخ التفكير: ' : 'Cognitive Trap: '}</span>
                      {thought.insight}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setStage(1);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{isAr ? 'السابق' : 'Back'}</span>
            </button>

            <button
              disabled={!selectedThought}
              onClick={() => {
                if (selectedThought) {
                  soundManager.playSoftTap();
                  setStage(3);
                }
              }}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                selectedThought
                  ? 'bg-stone-900 text-white hover:bg-stone-800 cursor-pointer shadow-xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'الخطوة التالية: ما الذي اشتعل بداخلك؟' : 'Next: What Did I Feel?'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STAGE 3: What Did I Feel? (Naming the Emotion & Pulse Surge) */}
      {/* ============================================================== */}
      {stage === 3 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              {isAr ? 'المرحلة 3: اشتعال المشاعر ❤️' : 'Stage 3: Emotional Surge ❤️'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              {isAr ? 'ما هو الشعور المحدد الذي وُلد في صدرك؟' : 'What exact emotion erupted?'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {isAr
                ? 'استجابة لفكرة: «' + selectedThought?.text + '»'
                : `Sparked by: “${selectedThought?.text}”`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scenario.emotionOptions.map((emotion) => {
              const isSelected = selectedEmotion?.id === emotion.id;
              return (
                <button
                  key={emotion.id}
                  onClick={() => handleSelectEmotion(emotion)}
                  className={`text-start p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500 text-rose-950'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-bold text-stone-900">
                      {emotion.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-600">
                      {emotion.heartBpm} BPM
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    {emotion.sensationDescription}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setStage(2);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{isAr ? 'السابق' : 'Back'}</span>
            </button>

            <button
              disabled={!selectedEmotion}
              onClick={() => {
                if (selectedEmotion) {
                  soundManager.playSoftTap();
                  setStage(4);
                }
              }}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                selectedEmotion
                  ? 'bg-stone-900 text-white hover:bg-stone-800 cursor-pointer shadow-xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'الخطوة التالية: ما الذي فعلته؟' : 'Next: What Did I Do?'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STAGE 4: What Did I Do? (Action & Immediate vs Long-term Outcome) */}
      {/* ============================================================== */}
      {stage === 4 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {isAr ? 'المرحلة 4: رد الفعل الفعلي ⚡' : 'Stage 4: Reaction & Behavior ⚡'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              {isAr ? 'تحت وطأة هذا الشعور، ما التصرف الذي قمت به؟' : 'Under this emotion, how did you react?'}
            </h2>
          </div>

          <div className="space-y-3">
            {scenario.actionOptions.map((act) => {
              const isSelected = selectedAction?.id === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => handleSelectAction(act)}
                  className={`w-full text-start p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-stone-900 bg-stone-100 ring-2 ring-stone-900'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-stone-900">
                      {act.action}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full bg-stone-900 text-white font-bold text-xs">
                        {isAr ? 'تم الاختيار' : 'Chosen'}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-stone-200/60 p-2.5 rounded-xl">
                        <span className="font-bold text-stone-800 block mb-0.5">
                          {isAr ? 'الراحة اللحظية:' : 'Short-Term Relief:'}
                        </span>
                        <p className="text-stone-700">{act.shortTermResult}</p>
                      </div>
                      <div className="bg-rose-100/70 p-2.5 rounded-xl text-rose-950">
                        <span className="font-bold block mb-0.5">
                          {isAr ? 'الثمن الحقيقي على المدى البعيد:' : 'Long-Term Cost:'}
                        </span>
                        <p>{act.longTermResult}</p>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setStage(3);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{isAr ? 'السابق' : 'Back'}</span>
            </button>

            <button
              disabled={!selectedAction}
              onClick={() => {
                if (selectedAction) {
                  soundManager.playHarmonicAffirmation();
                  setStage(5);
                }
              }}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                selectedAction
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'الآن: أعِد تشغيل المشهد بوعي جديد ⏪' : 'Now: Rewind the Scene With Awareness ⏪'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STAGE 5: The Rewind & Alternative Reframe (Game Turning Point) */}
      {/* ============================================================== */}
      {stage === 5 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'قوة الوعي وإعادة المشهد 🌿' : 'The Conscious Rewind 🌿'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'نفس الموقف — تغيير الفكرة يغير كل شيء!' : 'Same Situation — Changing Thought Changes Everything!'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              {isAr
                ? 'شاهد كيف يعود جهازك العصبي للهدوء (70 BPM) بمجرد استبدال الفكرة القاتمة بتفسير رحيم.'
                : 'Watch your nervous system drop to 70 BPM simply by choosing a compassionate lens.'}
            </p>
          </div>

          {/* Interactive Rewind Tape Box */}
          <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-300 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                {isAr ? 'التفسير البديل المقترح (مسار نسمة حياة)' : 'Conscious Reframe (Nesma Hayat)'}
              </span>
              <button
                onClick={handleRewindAndReframe}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
              >
                <Rewind className="w-3.5 h-3.5" />
                <span>{isAr ? 'تفعيل الإعادة ⏪' : 'Activate Rewind ⏪'}</span>
              </button>
            </div>

            <p className="text-base sm:text-lg font-bold text-emerald-950 font-serif italic leading-relaxed">
              «{scenario.healthyAlternatives.thought}»
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1">
                  {isAr ? '💛 الشعور الجديد:' : '💛 New Emotion:'}
                </span>
                <p className="text-stone-800 font-semibold">{scenario.healthyAlternatives.emotion}</p>
                <span className="text-[11px] text-emerald-700">نبض هادئ ومستقر (70 BPM) ✓</span>
              </div>
              <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1">
                  {isAr ? '⚡ السلوك الواعي:' : '⚡ Conscious Response:'}
                </span>
                <p className="text-stone-800 font-semibold">{scenario.healthyAlternatives.action}</p>
                <span className="text-[11px] text-emerald-700">يحفظ كرامتك وهدوءك ✓</span>
              </div>
            </div>

            <p className="text-xs text-emerald-900 font-medium pt-1">
              💡 {scenario.healthyAlternatives.explanation}
            </p>
          </div>

          {/* Level Complete / Rewards Bar */}
          <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <span className="font-bold text-white block">
                  {isAr ? 'أحسنت! فزت بـ 3 نجوم ⭐⭐⭐' : 'Victory! 3 Stars Earned ⭐⭐⭐'}
                </span>
                <span className="text-emerald-400">+150 XP نقاط وعي</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-bold cursor-pointer"
              >
                {isAr ? 'إعادة اللعب' : 'Replay'}
              </button>
              {onBackToMap && (
                <button
                  onClick={onBackToMap}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  {isAr ? 'خريطة المستويات' : 'Back to Map'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
