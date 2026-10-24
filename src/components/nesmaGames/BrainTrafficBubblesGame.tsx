import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import {
  RotateCcw,
  Bookmark,
  ShoppingBag,
  PackageCheck,
  Wind,
  Layers,
  BatteryCharging,
  AlertCircle
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface BrainTrafficBubblesGameProps {
  language: Language;
  onBackToMap?: () => void;
  onAddXP?: (amount: number) => void;
}

type ShelfDestination = 'today' | 'later' | 'release';

interface BubbleItem {
  id: string;
  text: string;
  textEn: string;
  idealShelf: ShelfDestination;
  energyCost: number; // Used in Stage 3 Mental Energy Budget
  icon: string;
}

const STAGE_BUBBLES: Record<number, BubbleItem[]> = {
  // Stage 1: 8 clear everyday items (pick up to 3 for Today)
  1: [
    { id: 's1_1', text: 'الرد على رسالة عمل ضرورية', textEn: 'Reply to urgent work message', idealShelf: 'today', energyCost: 30, icon: '✉️' },
    { id: 's1_2', text: 'التفكير في خطط الشهر الجاي', textEn: 'Planning next month’s schedule', idealShelf: 'later', energyCost: 35, icon: '📅' },
    { id: 's1_3', text: 'شرب ماء وأخذ الدواء بموعده', textEn: 'Drink water & take medicine', idealShelf: 'today', energyCost: 20, icon: '💧' },
    { id: 's1_4', text: 'اجترار خناقة الصباح العابرة', textEn: 'Replaying morning argument', idealShelf: 'release', energyCost: 45, icon: '💭' },
    { id: 's1_5', text: 'تجهيز وجبة غداء مغذية', textEn: 'Prepare a simple lunch', idealShelf: 'today', energyCost: 30, icon: '🥗' },
    { id: 's1_6', text: 'ترتيب خزانة الملابس الشتوية', textEn: 'Organize seasonal wardrobe', idealShelf: 'later', energyCost: 40, icon: '🧥' },
    { id: 's1_7', text: 'القلق العام على المستقبل البعيد', textEn: 'Vague worry about distant future', idealShelf: 'release', energyCost: 50, icon: '🌫️' },
    { id: 's1_8', text: 'مقارنة حياتي بصور السوشيال ميديا', textEn: 'Comparing life to social feeds', idealShelf: 'release', energyCost: 40, icon: '📱' }
  ],

  // Stage 2: 10 items with "Fake Urgency" distractors — must classify ALL items into shelves accurately!
  2: [
    { id: 's2_1', text: 'تسليم المهمة المطلوبة قبل المساء', textEn: 'Submit today’s due assignment', idealShelf: 'today', energyCost: 40, icon: '📝' },
    { id: 's2_2', text: 'إشعار جروب واتساب غير عاجل يطلب رأيك فوراً', textEn: 'Noisy group chat demanding instant take', idealShelf: 'later', energyCost: 25, icon: '🔔' },
    { id: 's2_3', text: 'نصف ساعة مشي أو تمدد لتهدئة أعصابي', textEn: '20-min walk to reset nervous system', idealShelf: 'today', energyCost: 20, icon: '🌿' },
    { id: 's2_4', text: 'تأنيب ضمير على جملة قلتها من ٣ سنين', textEn: 'Guilt over a sentence said 3 years ago', idealShelf: 'release', energyCost: 50, icon: '⏳' },
    { id: 's2_5', text: 'تجديد اشتراك أو أوراق تنتهي الشهر القادم', textEn: 'Paperwork due next month', idealShelf: 'later', energyCost: 30, icon: '🗂️' },
    { id: 's2_6', text: 'مكالمة قصيرة للاطمئنان على والدتي', textEn: 'Short check-in call with family', idealShelf: 'today', energyCost: 25, icon: '💛' },
    { id: 's2_7', text: 'توقعات الناس بأن أرد في نفس الثانية', textEn: 'Others expecting 1-second replies', idealShelf: 'release', energyCost: 45, icon: '⚡' },
    { id: 's2_8', text: 'قراءة كتاب جديد اشتريته بالأمس', textEn: 'Read new book bought yesterday', idealShelf: 'later', energyCost: 25, icon: '📖' },
    { id: 's2_9', text: 'ماذا لو تغيرت الظروف الاقتصادية العام القادم؟', textEn: 'What-if worries about next year', idealShelf: 'release', energyCost: 55, icon: '🌪️' },
    { id: 's2_10', text: 'فرز الفواتير الأسبوعية يوم الجمعة', textEn: 'Sort weekly bills on Friday', idealShelf: 'later', energyCost: 30, icon: '🧾' }
  ],

  // Stage 3: 12 items + Strict Mental Energy Budget (Today's Basket <= 100% Energy!)
  3: [
    { id: 's3_1', text: 'جلسة تركيز عميق على أهم مشروع (٤٥ طاقة)', textEn: 'Deep focus block on core project', idealShelf: 'today', energyCost: 45, icon: '🎯' },
    { id: 's3_2', text: 'محاولة إرضاء كل الزملاء على حساب راحتي (٧٠ طاقة)', textEn: 'People-pleasing everyone at work', idealShelf: 'release', energyCost: 70, icon: '🎭' },
    { id: 's3_3', text: 'وجبة صحية ونوم مبكر الليلة (٢٥ طاقة)', textEn: 'Nourishing dinner & early sleep', idealShelf: 'today', energyCost: 25, icon: '🌙' },
    { id: 's3_4', text: 'مراجعة حساب واحد مهم اليوم (٢٥ طاقة)', textEn: 'Review one urgent budget item', idealShelf: 'today', energyCost: 25, icon: '💳' },
    { id: 's3_5', text: 'حضور عزومة ثقيلة وأنا منهكة تماماً (٦٥ طاقة)', textEn: 'Exhausting social event while drained', idealShelf: 'later', energyCost: 65, icon: '🛋️' },
    { id: 's3_6', text: 'خوف مبهم من الفشل رغم الاجتهاد (٦٠ طاقة)', textEn: 'Vague fear of failure despite effort', idealShelf: 'release', energyCost: 60, icon: '🌑' },
    { id: 's3_7', text: 'تعلم مهارة جديدة بالكامل في ليلة واحدة (٨٠ طاقة)', textEn: 'Master a whole new skill tonight', idealShelf: 'later', energyCost: 80, icon: '🚀' },
    { id: 's3_8', text: 'تنظيف عميق لكل غرف المنزل دفعة واحدة (٧٥ طاقة)', textEn: 'Deep-clean entire house at once', idealShelf: 'later', energyCost: 75, icon: '🧹' },
    { id: 's3_9', text: 'تحليل نبرة صوت شخص لم يقصد شيئاً (٥٠ طاقة)', textEn: 'Overanalyzing someone’s neutral tone', idealShelf: 'release', energyCost: 50, icon: '🔍' },
    { id: 's3_10', text: 'إعداد خطة الإجازة الصيفية القادمة (٣٥ طاقة)', textEn: 'Plan upcoming summer break', idealShelf: 'later', energyCost: 35, icon: '🏖️' }
  ]
};

const GAME_ID = 'gather-bubbles';

export const BrainTrafficBubblesGame: React.FC<BrainTrafficBubblesGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const [assignments, setAssignments] = useState<Record<string, ShelfDestination>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [budgetWarning, setBudgetWarning] = useState<string | null>(null);

  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  const bubblesList = STAGE_BUBBLES[currentStage] || STAGE_BUBBLES[1];
  const todayItems = bubblesList.filter(b => assignments[b.id] === 'today');
  const laterItems = bubblesList.filter(b => assignments[b.id] === 'later');
  const releaseItems = bubblesList.filter(b => assignments[b.id] === 'release');
  const unassignedItems = bubblesList.filter(b => !assignments[b.id]);

  const todayEnergyUsed = todayItems.reduce((sum, item) => sum + item.energyCost, 0);
  const maxEnergyBudget = 100;

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setAssignments({});
    setSelectedItemId(null);
    setBudgetWarning(null);
    setCompleted(false);
    setShowCompletionModal(false);
    setIsSaved(false);
  };

  const handleAssignItem = (itemId: string, destination: ShelfDestination) => {
    const item = bubblesList.find(b => b.id === itemId);
    if (!item) return;

    if (destination === 'today') {
      const currentTodayWithoutItem = todayItems.filter(i => i.id !== itemId);
      if (currentTodayWithoutItem.length >= 3) {
        soundManager.playSoftTap();
        setBudgetWarning(isAr ? 'سلة اليوم تتسع لـ ٣ أولويات فقط لحماية تركيزك!' : 'Today’s basket holds max 3 priorities!');
        return;
      }
      if (currentStage === 3) {
        const projectedEnergy = currentTodayWithoutItem.reduce((s, x) => s + x.energyCost, 0) + item.energyCost;
        if (projectedEnergy > maxEnergyBudget) {
          soundManager.playIncorrect();
          setBudgetWarning(
            isAr
              ? `هذه المهمة ترفع حمل اليوم إلى ${projectedEnergy}٪ (أعلى من طاقتك ١٠٠٪)! ضعي المهام الثقيلة في الغد أو نهر التحرر.`
              : `Exceeds 100% energy budget (${projectedEnergy}%)! Defer heavy drains.`
          );
          return;
        }
      }
    }

    setBudgetWarning(null);
    soundManager.playPop();
    setAssignments(prev => ({
      ...prev,
      [itemId]: destination
    }));
    setSelectedItemId(null);
  };

  const handleUnassignItem = (itemId: string) => {
    soundManager.playSoftTap();
    setBudgetWarning(null);
    setAssignments(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const canFinish = currentStage === 1
    ? todayItems.length >= 2 && unassignedItems.length <= 3
    : unassignedItems.length === 0 && todayItems.length >= 2;

  const handleFinish = () => {
    let accurateMatches = 0;
    const assignedEntries = Object.entries(assignments);
    assignedEntries.forEach(([id, shelf]) => {
      const found = bubblesList.find(b => b.id === id);
      if (found && found.idealShelf === shelf) accurateMatches++;
    });

    const accuracyRatio = bubblesList.length > 0 ? accurateMatches / bubblesList.length : 1;
    const stars = accuracyRatio >= 0.8 ? 3 : accuracyRatio >= 0.55 ? 2 : 1;

    setEarnedStars(stars);
    const res = completeStage(GAME_ID, currentStage, stars, accurateMatches, onAddXP);
    setEarnedXP(res.xpAwarded);
    setProgress(getGameLevelProgress(GAME_ID));
    setCompleted(true);
    setShowCompletionModal(true);
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
      gameId: 'gather-bubbles',
      gameTitle: isAr ? `خزانة العقل (المرحلة ${currentStage})` : `Mind Shelves (Stage ${currentStage})`,
      quote: isAr ? 'دماغك مش سلة لتشيل كل الدنيا في دقيقة واحدة.' : 'Pick what belongs to today, let the rest float safely.',
      reflection: userReflection || (isAr ? 'رتّبت أرفف عقلي واخترت أولوياتي في حدود طاقتي.' : 'Sorted my mental shelves within my energy capacity.'),
      tag: isAr ? 'ترتيب الأفكار' : 'Mental Space'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
    if (onAddXP) onAddXP(15);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    loadStage(currentStage);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in select-none">
      {/* Header */}
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
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'لمّ اللي تقدر تلمّيه وخزانة العقل 🧺' : 'Mind Declutter Shelves 🧺'}</span>
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {currentStage === 1
                ? (isAr ? 'المرحلة ١: فرز مبدئي لـ ٨ مهام يومية' : 'Stage 1: Basic 8-item priority sort')
                : currentStage === 2
                ? (isAr ? 'المرحلة ٢: كشف الطوارئ المزيفة وتصنيف كامل العناصر الـ ١٠' : 'Stage 2: Spot fake urgency & sort all 10 items')
                : (isAr ? 'المرحلة ٣: إدارة ميزانية الطاقة النفسية (أقل من ١٠٠٪ لسلة اليوم)' : 'Stage 3: Mental Energy Budget (<=100% in Today)')}
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
            movesMade={Object.keys(assignments).length}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={handleRestart}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
            title={isAr ? 'إعادة' : 'Reset'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          {/* Stage 3 Energy Budget Bar */}
          {currentStage === 3 && (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-2 text-start">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                  <BatteryCharging className="w-4 h-4" />
                  <span>{isAr ? 'ميزانية طاقة اليوم العصبية:' : 'Today’s Nervous System Energy Budget:'}</span>
                </span>
                <span className={`font-mono tabular-nums ${todayEnergyUsed > 90 ? 'text-amber-600' : 'text-emerald-700 dark:text-emerald-400'}`}>
                  {todayEnergyUsed}% / 100%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    todayEnergyUsed > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, todayEnergyUsed)}%` }}
                />
              </div>
            </div>
          )}

          {budgetWarning && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2 text-start animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{budgetWarning}</span>
            </div>
          )}

          <div className="space-y-6 text-start">
            {unassignedItems.length > 0 && (
              <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                  <span>{isAr ? 'انقري الفكرة ثم اختاري الرف الأنسب لها:' : 'Tap an item then assign its shelf:'}</span>
                  <span className="font-mono tabular-nums text-stone-400">
                    {unassignedItems.length} {isAr ? 'متبقية' : 'left'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {unassignedItems.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          soundManager.playSoftTap();
                          setSelectedItemId(isSelected ? null : item.id);
                        }}
                        className={`min-h-10 px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'border-sky-500 bg-sky-100/90 dark:bg-sky-900/60 text-sky-950 dark:text-sky-100 ring-2 ring-sky-400 scale-102 shadow-sm'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 hover:border-stone-400 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{isAr ? item.text : item.textEn}</span>
                        {currentStage === 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-[10px] font-mono tabular-nums text-stone-600 dark:text-stone-300">
                            {item.energyCost}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedItemId && (
                  <div className="pt-3 flex flex-wrap items-center gap-2 text-xs font-bold animate-fade-in border-t border-stone-200/80 dark:border-stone-700">
                    <span className="text-stone-500">{isAr ? 'نقل إلى:' : 'Move to:'}</span>
                    <button
                      onClick={() => handleAssignItem(selectedItemId, 'today')}
                      className="min-h-10 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isAr ? '🧺 سلة اليوم' : 'Today Basket'}</span>
                    </button>
                    <button
                      onClick={() => handleAssignItem(selectedItemId, 'later')}
                      className="min-h-10 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>{isAr ? '📦 صندوق الغد' : 'Tomorrow Box'}</span>
                    </button>
                    <button
                      onClick={() => handleAssignItem(selectedItemId, 'release')}
                      className="min-h-10 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <Wind className="w-3.5 h-3.5" />
                      <span>{isAr ? '🕊️ نهر التحرر' : 'Release Stream'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Today */}
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>{isAr ? 'سلة اليوم 🧺' : 'Today’s Basket'}</span>
                  </span>
                  <span className="text-[10px] font-mono tabular-nums font-bold px-2 py-0.5 rounded-md bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                    {todayItems.length} / 3
                  </span>
                </div>
                <div className="min-h-24 space-y-1.5">
                  {todayItems.map(item => (
                    <div key={item.id} className="p-2 bg-white dark:bg-stone-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-950 dark:text-emerald-100 flex items-center justify-between gap-1 shadow-xs">
                      <span className="truncate">{item.icon} {isAr ? item.text : item.textEn}</span>
                      <button onClick={() => handleUnassignItem(item.id)} className="text-stone-400 hover:text-rose-600 px-1 cursor-pointer">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Later */}
              <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border-2 border-amber-300 dark:border-amber-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>{isAr ? 'صندوق الاستيداع 📦' : 'Tomorrow Box'}</span>
                  </span>
                  <span className="text-[10px] font-mono tabular-nums font-bold px-2 py-0.5 rounded-md bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                    {laterItems.length}
                  </span>
                </div>
                <div className="min-h-24 space-y-1.5">
                  {laterItems.map(item => (
                    <div key={item.id} className="p-2 bg-white dark:bg-stone-900 rounded-xl border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-950 dark:text-amber-100 flex items-center justify-between gap-1 shadow-xs">
                      <span className="truncate">{item.icon} {isAr ? item.text : item.textEn}</span>
                      <button onClick={() => handleUnassignItem(item.id)} className="text-stone-400 hover:text-rose-600 px-1 cursor-pointer">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Release */}
              <div className="p-4 bg-sky-50/70 dark:bg-sky-950/30 rounded-2xl border-2 border-sky-300 dark:border-sky-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                    <span>{isAr ? 'نهر التحرر 🕊️' : 'Release Stream'}</span>
                  </span>
                  <span className="text-[10px] font-mono tabular-nums font-bold px-2 py-0.5 rounded-md bg-sky-200/80 dark:bg-sky-900 text-sky-900 dark:text-sky-200">
                    {releaseItems.length}
                  </span>
                </div>
                <div className="min-h-24 space-y-1.5">
                  {releaseItems.map(item => (
                    <div key={item.id} className="p-2 bg-white dark:bg-stone-900 rounded-xl border border-sky-200 dark:border-sky-800 text-xs font-semibold text-sky-950 dark:text-sky-100 flex items-center justify-between gap-1 shadow-xs">
                      <span className="truncate">{item.icon} {isAr ? item.text : item.textEn}</span>
                      <button onClick={() => handleUnassignItem(item.id)} className="text-stone-400 hover:text-rose-600 px-1 cursor-pointer">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-sky-900 dark:text-sky-200 font-bold">
              {currentStage === 1
                ? (isAr ? 'ضعي أولويتين على الأقل في سلة اليوم وفرّغي معظم الزحمة' : 'Place at least 2 items in Today & clear clutter')
                : (isAr ? `صنّفي جميع العناصر المتبقية (${unassignedItems.length}) لإتمام المرحلة` : `Sort all remaining items (${unassignedItems.length}) to finish`)}
            </span>

            <button
              disabled={!canFinish}
              onClick={handleFinish}
              className={`min-h-11 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                canFinish
                  ? 'bg-stone-900 hover:bg-stone-800 dark:bg-sky-600 text-white cursor-pointer shadow-xs'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isAr ? 'اعتماد ترتيب الأرفف ✓' : 'Complete Triage ✓'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto text-3xl">
            🧺
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {isAr ? `هدأت الزحمة واكتملت المرحلة ${currentStage} 🌿` : `Stage ${currentStage} Clutter Settled 🌿`}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«الحياة تُعاش يوماً بيوم، وساعتك تسع لشيء واحد فقط في اللحظة.»'
                : 'Life is lived day by day. You chose what fits your hands today.'}
            </p>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'كيف يبدو شعور دماغك الآن بعد ترتيب الأرفف؟' : 'How does your head feel having sorted your shelves?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي شعورك الآن...' : 'A note on how you feel...'}
              className="w-full text-xs p-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-sky-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-700 hover:bg-sky-800 disabled:bg-sky-300 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={handleRestart}
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
