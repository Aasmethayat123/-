import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  Hand,
  CloudRain,
  Move,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Timer
} from 'lucide-react';
import { 
  getGameLevelProgress, 
  completeStage, 
  setActiveStage, 
  GameProgressData 
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface HandsControlGameProps {
  language: Language;
  onBackToMap?: () => void;
  onAddXP?: (amount: number) => void;
}

interface ItemControl {
  text: string;
  inHands: boolean;
  note: string;
}

const STAGE_ITEMS: Record<number, ItemControl[]> = {
  // Stage 1: Daily Habits & Study Pressures
  1: [
    { text: 'رأي الناس وكلامهم عني', inHands: false, note: 'رأي الآخرين يخص عوالمهم وظروفهم، وليس بيدك التحكم فيه.' },
    { text: 'المجهود اللي ببذله النهاردة', inHands: true, note: 'سعيك اليوم وساعات تركيزك هي مساحتك الحقيقية.' },
    { text: 'صعوبة أسئلة الامتحان', inHands: false, note: 'محتوى ورقة الامتحان خارج إرادتك؛ بيدك فقط كيف تدير وقتك واستقرارك.' },
    { text: 'ساعات نومي واهتمامي بصحتي', inHands: true, note: 'وضع هاتفك جانباً وإكرام جسدك بالراحة قرار تصنعه أنت.' },
    { text: 'الزحمة وتأخر المواصلات', inHands: false, note: 'عوامل الطريق خارجة عن إرادتك؛ بيدك فقط كيف تتنفس وتنتظر بهدوء.' },
    { text: 'طريقة ردي لما أتعصب', inHands: true, note: 'بين الغضب وردة الفعل مساحة حرة؛ قرار ردك بيدك أنت وحدك.' }
  ],

  // Stage 2: Relational Boundaries & Social Friction
  2: [
    { text: 'توقعات أهلي المبالغة وتطلعاتهم', inHands: false, note: 'رغبات الآخرين تخصهم؛ ما بيدك هو المحاولة بصدق والبر بلطف.' },
    { text: 'الحدود اللي بطلبها بلطف من غيري', inHands: true, note: 'التعبير عن حدودك الشخصية حقك الكامل ومسؤوليتك الواعية.' },
    { text: 'مزاج شريكي أو صديقي المتقلب', inHands: false, note: 'لست مسؤولاً عن تصليح مزاج الآخرين أو امتصاص توترهم.' },
    { text: 'اعتذاري الصادق لما أغلط', inHands: true, note: 'الاعتراف بالخطأ وتصحيحه شجاعة حقيقية بيدك أنت وحدك.' },
    { text: 'سخرية أو نقد جارح في تجمع عائلي', inHands: false, note: 'سلوك القائل يعكس نقصه؛ بيدك فقط هل تأخذ الكلام لقلبك أم تتركه يمر.' },
    { text: 'تحديد وقت لنفسي للاستراحة دون خجل', inHands: true, note: 'حماية طاقتك من الاستنزاف واجب أصيل تجاه نفسك.' },
    { text: 'مقارنة الناس لنتائجي مع قريبي', inHands: false, note: 'المقارنات آفة شائعة؛ مسارك منفصل وفريد تماماً.' },
    { text: 'الحديث الداخلي الرحيم مع نفسي', inHands: true, note: 'أن تكون صديقاً لنفسك بدل جلادها خيار يومي ملموس.' }
  ],

  // Stage 3: Life Destinies, Past Regrets & Surrender
  3: [
    { text: 'الماضي والقرارات اللي فاتت خلاص', inHands: false, note: 'الماضي انتهى وخرج من حيز التأثير المباشر، ما بيدك هو الحاضر.' },
    { text: 'تقبلي لضعفي البشري وإنسانيتي', inHands: true, note: 'التسليم بالضعف هو بداية القوة الحقيقية والتواضع المطمئن.' },
    { text: 'المرض أو التعب المفاجئ في غير وقته', inHands: false, note: 'ابتلاء الجسد قدر؛ بيدك فقط كيف ترعى نفسك وتطلب العلاج برضى.' },
    { text: 'خطوتي القادمة المصغرة في الحياة', inHands: true, note: 'مهما كانت العاصفة، الخطوة الواحدة التالية دائماً ممكنة.' },
    { text: 'رحيل بعض الأشخاص أو تغير مشاعرهم', inHands: false, note: 'قلوب الناس ومساراتهم ليست ملكك؛ التسليم يمنحك السلام.' },
    { text: 'أن أطلب المساعدة لما أحتاجها بصدق', inHands: true, note: 'طلب العون ليس ضعفاً؛ بل شجاعة واعية تحفظك من الانهيار.' },
    { text: 'النتيجة النهائية للمشروع بعد إتقاني', inHands: false, note: 'الأقدار بيد الله والظروف مركبة؛ بيدك شرف السعي والنية الطيبة.' },
    { text: 'تنفسي العميق في هذه اللحظة بالذات', inHands: true, note: 'الشهيق والزفير الآن هو مرساتك الحية في الوجود.' }
  ]
};

const GAME_ID = 'hands-control';

export const HandsControlGame: React.FC<HandsControlGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const stageItems = STAGE_ITEMS[currentStage] || STAGE_ITEMS[1];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [earnedXP, setEarnedXP] = useState<number>(40);

  // Kinetic Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setCurrentIndex(0);
    setUserChoice(null);
    setCorrectCount(0);
    setCompleted(false);
    setShowCompletionModal(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const currentItem = stageItems[currentIndex] || stageItems[0];

  const handleChoice = (choiceInHands: boolean) => {
    soundManager.playSoftTap();
    setUserChoice(choiceInHands);
    setDragOffset({ x: 0, y: 0 });

    if (choiceInHands === currentItem.inHands) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (userChoice !== null) return;
    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || userChoice !== null) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 75;
    if (dragOffset.x < -threshold) {
      handleChoice(isAr ? false : true);
    } else if (dragOffset.x > threshold) {
      handleChoice(isAr ? true : false);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < stageItems.length) {
      setCurrentIndex(prev => prev + 1);
      setUserChoice(null);
      setDragOffset({ x: 0, y: 0 });
    } else {
      setCompleted(true);
      const stars = correctCount >= stageItems.length - 1 ? 3 : 2;
      const result = completeStage(GAME_ID, currentStage, stars, undefined, onAddXP);
      setEarnedXP(result.xpAwarded);
      setProgress(getGameLevelProgress(GAME_ID));
      setShowCompletionModal(true);
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
      gameId: 'hands-control',
      gameTitle: isAr ? `في إيدي / برّا إيدي (المرحلة ${currentStage})` : `In My Hands / Outside (Stage ${currentStage})`,
      quote: isAr 
        ? `أكملت المرحلة ${currentStage}؛ راحة البال تبدأ عندما نحصر طاقتنا فيما نملك تغييره ونترك الباقي بتسليم.` 
        : `Completed Stage ${currentStage}; peace begins by channeling effort only into what we control.`,
      reflection: userReflection || (isAr ? 'فرزت مواقف اليوم وعرفت أين أضع طاقتي بسلام.' : 'Sorted my circle of control and set boundaries with peace.'),
      tag: isAr ? 'دائرة السيطرة' : 'Circle of Control'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
    if (onAddXP) onAddXP(20);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    loadStage(currentStage);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
                {isAr ? 'في إيدي / برّا إيدي 🤲' : 'In My Hands / Outside 🤲'}
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {isAr ? '٣ مراحل وعي متدرجة 🏆' : '3 Progressive Stages 🏆'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr 
                ? 'دائرة السيطرة؛ فرز ما تملكه عما ليس بيدك لخفض القلق فوراً عبر ٣ مستويات متعمقة.' 
                : 'Circle of control: distinguish what you can change vs what is outside your hands.'}
            </p>
          </div>
        </div>

        {/* Right Stage Selector & Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <StageLevelSelector
            language={language}
            gameId={GAME_ID}
            currentStage={currentStage}
            progress={progress}
            onSelectStage={(num) => loadStage(num)}
            showCompletionModal={showCompletionModal}
            completedStageNumber={currentStage}
            starsEarned={3}
            movesMade={correctCount}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={handleRestart}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer ms-auto sm:ms-0"
            title={isAr ? 'إعادة هذه المرحلة' : 'Reset Stage'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      {!completed ? (
        <div className="relative rounded-3xl overflow-hidden border border-emerald-900/20 dark:border-stone-800 bg-gradient-to-b from-[#f0fdf4] via-[#ecfdf5] to-[#d1fae5] dark:from-[#06201a] dark:via-[#041713] dark:to-[#020d0b] p-6 sm:p-10 shadow-xl space-y-8">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-300">
            <span className="font-mono">
              {isAr ? `الموقف ${currentIndex + 1} من ${stageItems.length}` : `Card ${currentIndex + 1} of ${stageItems.length}`}
            </span>
            <span className="text-emerald-700 dark:text-emerald-300">
              {isAr ? `المرحلة ${currentStage}` : `Stage ${currentStage}`}
            </span>
          </div>

          {/* Interactive Card Zone */}
          <div className="flex items-center justify-center min-h-[180px] sm:min-h-[220px]">
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border-2 shadow-xl text-center space-y-4 transition-transform select-none cursor-grab active:cursor-grabbing ${
                dragOffset.x !== 0 ? 'transition-none' : 'duration-300'
              } ${
                userChoice !== null
                  ? userChoice === currentItem.inHands
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40'
                    : 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40'
                  : 'border-stone-200 dark:border-stone-700 hover:border-emerald-400'
              }`}
              style={{
                transform: `translate(${dragOffset.x}px, ${dragOffset.y * 0.5}px) rotate(${dragOffset.x * 0.05}deg)`
              }}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl">
                💭
              </div>

              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 font-serif leading-relaxed">
                {currentItem.text}
              </h2>

              {userChoice === null && (
                <p className="text-[11px] text-stone-400 font-medium">
                  {isAr ? 'اسحبي البطاقة نحو اليمين (في إيدي) أو اليسار (برّا إيدي)' : 'Drag right (In Hands) or left (Outside)'}
                </p>
              )}

              {/* Feedback Note after choosing */}
              {userChoice !== null && (
                <div className="p-3 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 animate-fade-in space-y-1">
                  <div className="font-bold flex items-center justify-center gap-1.5">
                    {userChoice === currentItem.inHands ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {isAr ? 'إدراك دقيق وصحيح! ✓' : 'Accurate insight! ✓'}
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <HelpCircle className="w-4 h-4" />
                        {isAr ? 'تأملي معي:' : 'Mindful perspective:'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300">
                    {currentItem.note}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Choice Buttons */}
          {userChoice === null ? (
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              <button
                onClick={() => handleChoice(true)}
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Hand className="w-4 h-4" />
                <span>{isAr ? 'في إيدي (أملك تغييره)' : 'In My Hands'}</span>
              </button>

              <button
                onClick={() => handleChoice(false)}
                className="py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CloudRain className="w-4 h-4" />
                <span>{isAr ? 'برّا إيدي (خارج تحكمي)' : 'Outside My Hands'}</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center max-w-lg mx-auto">
              <button
                onClick={handleNext}
                className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-sm shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{currentIndex + 1 < stageItems.length ? (isAr ? 'الموقف التالي ⏩' : 'Next Situation ⏩') : (isAr ? 'إنهاء المرحلة واكتمال الفرز 🎉' : 'Finish Stage 🎉')}</span>
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Stage Completed Celebration */
        <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border-2 border-emerald-400 text-center space-y-4 animate-scale-up">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
              {isAr ? `🎉 اكتملت المرحلة ${currentStage} بنجاح ووضوح تام!` : `🎉 Stage ${currentStage} Completed!`}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
              {isAr 
                ? '«راحة البال ليست في السيطرة على كل شيء؛ بل في التوقف عن محاولة التحكم فيما ليس بيدك.»' 
                : '“Peace of mind is not about controlling everything; it is letting go of what never was yours.”'}
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2 pt-2 text-start">
            <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'تسجيل خاطرة في دفترك عن هذه المرحلة:' : 'Note for your journal:'}
            </label>
            <input
              type="text"
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'مثلاً: قررت اليوم أن أترك آراء الآخرين وأركز على مذاكرتي فقط...' : 'e.g., Today I release what I cannot change...'}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleSaveMoment}
              disabled={isSaved}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isSaved ? 'bg-emerald-600 text-white' : 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-emerald-600'
              }`}
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? (isAr ? 'تم الحفظ في دفتري 🌿' : 'Saved 🌿') : (isAr ? 'حفظ في دفتري' : 'Save Moment')}</span>
            </button>

            {currentStage < 3 && (
              <button
                onClick={handleNextStage}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
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
