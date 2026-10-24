import React, { useState, useEffect } from 'react';
import {
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
  Activity,
  Sparkles,
  Star,
  Compass,
  Rewind
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
  selectedLevelId = 'unread-message',
  onBackToMap,
  playerAvatarId = 'sara',
  onRecordStars
}) => {
  const isAr = language === 'ar';
  const scenarios = SCENARIOS[language];

  const [currentScenarioId, setCurrentScenarioId] = useState<string>(selectedLevelId);
  const [stage, setStage] = useState<StageId | 6>(1);
  const [completedScenarioIds, setCompletedScenarioIds] = useState<string[]>([]);

  const [selectedThought, setSelectedThought] = useState<ThoughtOption | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionOption | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionOption | null>(null);

  useEffect(() => {
    setCurrentScenarioId(selectedLevelId);
  }, [selectedLevelId]);

  const currentIdx = Math.max(0, scenarios.findIndex((s) => s.id === currentScenarioId));
  const scenario = scenarios[currentIdx] || scenarios[0];
  const nextScenario = currentIdx + 1 < scenarios.length ? scenarios[currentIdx + 1] : null;
  const avatar = AVATARS[language].find(a => a.id === playerAvatarId) || AVATARS[language][0];

  const currentBPM = selectedEmotion
    ? (stage >= 5 ? 70 : selectedEmotion.heartBpm || 115)
    : 75;

  const getAvatarFace = () => {
    if (stage >= 5) return '🌿';
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

  const loadScenario = (scenarioId: string) => {
    soundManager.playSoftTap();
    setCurrentScenarioId(scenarioId);
    setStage(1);
    setSelectedThought(null);
    setSelectedEmotion(null);
    setSelectedAction(null);
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

  const markCurrentLevelComplete = () => {
    if (!completedScenarioIds.includes(scenario.id)) {
      setCompletedScenarioIds(prev => [...prev, scenario.id]);
    }
    if (onRecordStars) {
      onRecordStars(scenario.id, 3);
    }
  };

  const handleRewindAndReframe = () => {
    soundManager.playRewindSound();
    setTimeout(() => {
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
      markCurrentLevelComplete();
    }, 350);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setStage(1);
    setSelectedThought(null);
    setSelectedEmotion(null);
    setSelectedAction(null);
  };

  const handleAdvanceNextStoryLevel = () => {
    markCurrentLevelComplete();
    if (nextScenario) {
      soundManager.playLevelUpFanfare();
      loadScenario(nextScenario.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Game Navigation & Vitals HUD */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {onBackToMap && (
              <button
                onClick={() => {
                  soundManager.playSoftTap();
                  onBackToMap();
                }}
                className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'الخريطة' : 'Map'}</span>
              </button>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider font-mono tabular-nums">
                  {isAr ? `الفصل ${scenario.levelNumber} من ${scenarios.length}` : `Chapter ${scenario.levelNumber} of ${scenarios.length}`}
                </span>
                <span className="text-stone-500">·</span>
                <span className="text-xs text-stone-400">{scenario.category}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {scenario.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-stone-800/90 px-4 py-2 rounded-2xl border border-stone-700 text-xs w-full md:w-auto justify-around">
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

            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 text-rose-500 ${currentBPM > 90 ? 'animate-bounce' : 'animate-pulse'}`} />
              <div>
                <span className="text-[10px] text-stone-400 block uppercase font-semibold">
                  {isAr ? 'نبضات القلب' : 'Pulse BPM'}
                </span>
                <span className={`text-sm font-bold font-mono tabular-nums ${currentBPM > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {currentBPM} BPM
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-stone-700" />

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

        {/* Progressive Story Chapters Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-stone-800 pb-1">
          {scenarios.map((sc) => {
            const active = sc.id === scenario.id;
            const done = completedScenarioIds.includes(sc.id);
            return (
              <button
                key={sc.id}
                onClick={() => loadScenario(sc.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : done
                    ? 'bg-stone-800 text-emerald-300 border border-emerald-700/50'
                    : 'bg-stone-800/60 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="font-mono tabular-nums">{sc.levelNumber}.</span>
                <span>{sc.title}</span>
                {done && <span>★</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Progress Bar (1 -> 2 -> 3 -> 4 -> 5) */}
      <div className="flex items-center justify-between gap-1 p-1 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs text-xs font-semibold">
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
                ? 'bg-stone-900 dark:bg-emerald-600 text-white font-bold shadow-xs'
                : stage > s.num
                ? 'text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-stone-800'
                : 'text-stone-300 dark:text-stone-600 cursor-not-allowed'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {stage === 1 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                {isAr ? 'الخطوة 1: نقطة البداية الواقعية' : 'Step 1: The Raw Trigger'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                {isAr ? 'ما الذي حدث على أرض الواقع؟' : 'What Actually Happened?'}
              </h2>
            </div>
            <span className="text-3xl">📱</span>
          </div>

          <div className="max-w-md mx-auto bg-stone-900 rounded-3xl p-4 shadow-xl border-4 border-stone-700 text-stone-100 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-stone-800 pb-2">
              <span className="font-mono">9:41 AM</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isAr ? 'حدث واقعي مجرد' : 'Observable Event'}</span>
              </div>
            </div>

            <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">
                  {scenario.context}
                </span>
              </div>
              <p className="text-sm font-medium text-stone-100 leading-relaxed font-serif">
                «{scenario.situation}»
              </p>
            </div>

            <div className="text-center pt-1 text-[11px] text-stone-400">
              {isAr ? 'هذا كل ما رصدته الكاميرا — لا أحكام ولا تأويلات حتى الآن.' : 'Raw observable facts — zero story added yet.'}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setStage(2);
              }}
              className="min-h-11 flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <span>{isAr ? 'الخطوة التالية: بماذا فكّرت؟' : 'Next: What Did I Think?'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {stage === 2 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              {isAr ? 'الخطوة 2: وميض الأفكار 🧠' : 'Step 2: Automatic Thought 🧠'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              {isAr ? 'أي فكرة تلقائية لمعت في رأسك فوراً؟' : 'Which thought flashed in your mind instantly?'}
            </h2>
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
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-500 text-amber-950 dark:text-amber-100'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                      {thought.text}
                    </p>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold text-xs shrink-0">
                        {isAr ? 'تم الاختيار ✓' : 'Selected ✓'}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-amber-200/60 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                      <span className="font-bold">{isAr ? 'فخ التفكير: ' : 'Cognitive Trap: '}</span>
                      {thought.insight}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setStage(1);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 cursor-pointer"
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
              className={`min-h-11 flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                selectedThought
                  ? 'bg-stone-900 dark:bg-emerald-600 text-white hover:bg-stone-800 cursor-pointer shadow-xs'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'الخطوة التالية: ما الذي اشتعل بداخلك؟' : 'Next: What Did I Feel?'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {stage === 3 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              {isAr ? 'الخطوة 3: اشتعال المشاعر ❤️' : 'Step 3: Emotional Surge ❤️'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              {isAr ? 'ما هو الشعور المحدد الذي وُلد في صدرك؟' : 'What exact emotion erupted?'}
            </h2>
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
                      ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 ring-2 ring-rose-500 text-rose-950 dark:text-rose-100'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {emotion.name}
                    </span>
                    <span className="text-xs font-mono tabular-nums font-bold text-rose-600 dark:text-rose-400">
                      {emotion.heartBpm} BPM
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {emotion.sensationDescription}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setStage(2);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 cursor-pointer"
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
              className={`min-h-11 flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                selectedEmotion
                  ? 'bg-stone-900 dark:bg-emerald-600 text-white hover:bg-stone-800 cursor-pointer shadow-xs'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'الخطوة التالية: ما الذي فعلته؟' : 'Next: What Did I Do?'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {stage === 4 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {isAr ? 'الخطوة 4: رد الفعل الفعلي ⚡' : 'Step 4: Reaction & Behavior ⚡'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
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
                      ? 'border-stone-900 dark:border-emerald-500 bg-stone-100 dark:bg-stone-800 ring-2 ring-stone-900 dark:ring-emerald-500'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {act.action}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-md bg-stone-900 text-white font-bold text-xs">
                        {isAr ? 'تم الاختيار' : 'Chosen'}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-stone-200/60 dark:bg-stone-700/60 p-2.5 rounded-xl">
                        <span className="font-bold text-stone-800 dark:text-stone-200 block mb-0.5">
                          {isAr ? 'الراحة اللحظية:' : 'Short-Term Relief:'}
                        </span>
                        <p className="text-stone-700 dark:text-stone-300">{act.shortTermResult}</p>
                      </div>
                      <div className="bg-rose-100/70 dark:bg-rose-950/50 p-2.5 rounded-xl text-rose-950 dark:text-rose-200">
                        <span className="font-bold block mb-0.5">
                          {isAr ? 'الثمن الحقيقي بعيد المدى:' : 'Long-Term Cost:'}
                        </span>
                        <p>{act.longTermResult}</p>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setStage(3);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{isAr ? 'السابق' : 'Back'}</span>
            </button>

            <button
              disabled={!selectedAction}
              onClick={() => {
                if (selectedAction) {
                  soundManager.playHarmonicAffirmation();
                  markCurrentLevelComplete();
                  setStage(5);
                }
              }}
              className={`min-h-11 flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                selectedAction
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'أعِد تشغيل المشهد بوعي جديد ⏪' : 'Rewind Scene With Awareness ⏪'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {stage === 5 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 rounded-md text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'قوة الوعي وإعادة المشهد 🌿' : 'The Conscious Rewind 🌿'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {isAr ? 'نفس الموقف — تغيير الفكرة يغير كل شيء!' : 'Same Situation — Changing Thought Changes Everything!'}
            </h2>
          </div>

          <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-3xl border-2 border-emerald-300 dark:border-emerald-800 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-3">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                {isAr ? 'التفسير البديل المتزن' : 'Conscious Reframe'}
              </span>
              <button
                onClick={handleRewindAndReframe}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
              >
                <Rewind className="w-3.5 h-3.5" />
                <span>{isAr ? 'تفعيل الإعادة ⏪' : 'Activate Rewind ⏪'}</span>
              </button>
            </div>

            <p className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-100 font-serif italic leading-relaxed">
              «{scenario.healthyAlternatives.thought}»
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-white/90 dark:bg-stone-900/80 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
                  {isAr ? '💛 الشعور الجديد:' : '💛 New Emotion:'}
                </span>
                <p className="text-stone-800 dark:text-stone-100 font-semibold">{scenario.healthyAlternatives.emotion}</p>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">70 BPM ✓</span>
              </div>
              <div className="bg-white/90 dark:bg-stone-900/80 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
                  {isAr ? '⚡ السلوك الواعي:' : '⚡ Conscious Response:'}
                </span>
                <p className="text-stone-800 dark:text-stone-100 font-semibold">{scenario.healthyAlternatives.action}</p>
              </div>
            </div>

            <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium pt-1">
              💡 {scenario.healthyAlternatives.explanation}
            </p>
          </div>

          <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <span className="font-bold text-white block">
                  {isAr ? `أتممت الفصل ${scenario.levelNumber} بـ ٣ نجوم!` : `Chapter ${scenario.levelNumber} Cleared — 3 Stars!`}
                </span>
                <span className="text-emerald-400 font-mono">+150 XP</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={handleReset}
                className="min-h-10 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-bold cursor-pointer"
              >
                {isAr ? 'إعادة الفصل' : 'Replay'}
              </button>

              {nextScenario && (
                <button
                  onClick={handleAdvanceNextStoryLevel}
                  className="min-h-10 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-black cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <span>{isAr ? `الفصل التالي (${nextScenario.levelNumber}) 🚀` : `Next Chapter (${nextScenario.levelNumber}) 🚀`}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              )}

              {onBackToMap && (
                <button
                  onClick={onBackToMap}
                  className="min-h-10 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  {isAr ? 'الخريطة' : 'Map'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
