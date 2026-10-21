import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  Mountain, 
  Pickaxe, 
  ArrowRight,
  Plus,
  Flame,
  Check,
  Flower2
} from 'lucide-react';
import { 
  getGameLevelProgress, 
  completeStage, 
  setActiveStage, 
  GameProgressData 
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface BreakTheMountainGameProps {
  language: Language;
  onBackToMap?: () => void;
  onAddXP?: (amount: number) => void;
}

interface StressPiece {
  id: string;
  title: string;
  category: string;
  icon: string;
  reliefNote: string;
  isCustom?: boolean;
}

const STAGE_PIECES: Record<number, StressPiece[]> = {
  // Stage 1: The Gentle Hill (3 Micro-Stresses)
  1: [
    {
      id: 's1_p1',
      title: 'تراكم دروس ومحاضرات الصباح',
      category: 'بداية اليوم',
      icon: '📚',
      reliefNote: 'محاضرة واحدة تكفي كبداية اليوم، لا تحملي الأسبوع كله دفعة واحدة.'
    },
    {
      id: 's1_p2',
      title: 'تشتت الرسائل والتنبيهات',
      category: 'تركيز',
      icon: '📱',
      reliefNote: 'ضعي الهاتف في وضع الصامت لمدة ٢٥ دقيقة فقط؛ العالم سينتظرك بسلام.'
    },
    {
      id: 's1_p3',
      title: 'الشعور بالكسل وثقل البداية',
      category: 'طاقة',
      icon: '☕',
      reliefNote: 'اشربي كوب ماء بارد، الخطوة الأولى لا تتطلب حماساً خارقاً، بل دقيقة واحدة فقط.'
    }
  ],

  // Stage 2: The Burden Mountain (8 Rocks)
  2: [
    {
      id: 's2_p1',
      title: 'تراكم محاضرات ودروس الأسبوع',
      category: 'دراسة',
      icon: '📚',
      reliefNote: 'محاضرة واحدة تكفي كبداية اليوم، لا تحملي الأسبوع كله دفعة واحدة.'
    },
    {
      id: 's2_p2',
      title: 'الخوف من الامتحان والدرجات',
      category: 'قلق مستقبلي',
      icon: '📝',
      reliefNote: 'الدرجة تقيّم أداء ورقة في ساعة، ولا تقيّم قيمتك أو ذكاءك الإنساني.'
    },
    {
      id: 's2_p3',
      title: 'موعد تسليم البحث أو المشروع',
      category: 'مهام',
      icon: '⏳',
      reliefNote: 'البحث يُنجز فقرة بعد فقرة؛ افتحي الملف واكتبي جملة واحدة فقط.'
    },
    {
      id: 's2_p4',
      title: 'توقعات الأهل العالية والضغط النفسي',
      category: 'علاقات',
      icon: '🏠',
      reliefNote: 'حب أهلك لكِ ثابت، ومحاولتك الصادقة هي كل ما تملكينه بيدك.'
    },
    {
      id: 's2_p5',
      title: 'المقارنة مع إنجازات وتفوق زملائي',
      category: 'مقارنات',
      icon: '👥',
      reliefNote: 'لكل شخص رحلته الخاصة وسرعته وظروفه غير المرئية.'
    },
    {
      id: 's2_p6',
      title: 'قلة النوم والصداع وتشتت التركيز',
      category: 'جسد',
      icon: '☕',
      reliefNote: 'الجسد المنهك لا ينتج؛ راحتك ونومك هما أول خطوة في المذاكرة.'
    },
    {
      id: 's2_p7',
      title: 'تأنيب الضمير والشعور بالتقصير',
      category: 'صوت داخلي',
      icon: '💭',
      reliefNote: 'جلد الذات لا يصلح ما فات، الرفق بنفسك هو ما يمنحك الطاقة لتبدأي.'
    },
    {
      id: 's2_p8',
      title: 'كثرة المهام والشعور بالضياع',
      category: 'فوضى',
      icon: '🌀',
      reliefNote: 'السر في الخطوة القادمة فقط؛ افعلي شيئاً واحداً ثم تنفسي.'
    }
  ],

  // Stage 3: The Great Ridge (12 Comprehensive Stresses)
  3: [
    { id: 's3_p1', title: 'تراكم محاضرات ودروس الأسبوع', category: 'دراسة', icon: '📚', reliefNote: 'محاضرة واحدة تكفي كبداية اليوم، لا تحملي الأسبوع كله دفعة واحدة.' },
    { id: 's3_p2', title: 'الخوف من الامتحان والدرجات', category: 'قلق مستقبلي', icon: '📝', reliefNote: 'الدرجة تقيّم أداء ورقة، ولا تقيّم قيمتك أو ذكاءك الإنساني.' },
    { id: 's3_p3', title: 'موعد تسليم البحث أو المشروع', category: 'مهام', icon: '⏳', reliefNote: 'البحث يُنجز فقرة بعد فقرة؛ افتحي الملف واكتبي جملة واحدة فقط.' },
    { id: 's3_p4', title: 'توقعات الأهل العالية والضغط النفسي', category: 'علاقات', icon: '🏠', reliefNote: 'حب أهلك لكِ ثابت، ومحاولتك الصادقة هي كل ما تملكينه بيدك.' },
    { id: 's3_p5', title: 'المقارنة مع إنجازات وتفوق زملائي', category: 'مقارنات', icon: '👥', reliefNote: 'لكل شخص رحلته الخاصة وسرعته وظروفه غير المرئية.' },
    { id: 's3_p6', title: 'قلة النوم والصداع وتشتت التركيز', category: 'جسد', icon: '☕', reliefNote: 'الجسد المنهك لا ينتج؛ راحتك ونومك هما أول خطوة في المذاكرة.' },
    { id: 's3_p7', title: 'تأنيب الضمير والشعور بالتقصير', category: 'صوت داخلي', icon: '💭', reliefNote: 'جلد الذات لا يصلح ما فات، الرفق بنفسك هو ما يمنحك الطاقة لتبدأي.' },
    { id: 's3_p8', title: 'كثرة المهام والشعور بالضياع', category: 'فوضى', icon: '🌀', reliefNote: 'السر في الخطوة القادمة فقط؛ افعلي شيئاً واحداً ثم تنفسي.' },
    { id: 's3_p9', title: 'الخوف من الفشل وإحباط الآخرين', category: 'مخاوف عميقة', icon: '💔', reliefNote: 'الفشل ليس محطة أخيرة، بل تجربة تعلّم تثقل الحكمة.' },
    { id: 's3_p10', title: 'عدم القدرة على الالتزام بالجدول', category: 'تخطيط', icon: '🗓️', reliefNote: 'المرونة أهم من الصرامة؛ أعيدي صياغة اليوم بما يناسب طاقتك.' },
    { id: 's3_p11', title: 'المسؤوليات العائلية والمنزلية المفاجئة', category: 'ظروف', icon: '🏡', reliefNote: 'تحدث الحياة رغم خططنا؛ خذي نفساً وتقبلي ما لا تملكينه.' },
    { id: 's3_p12', title: 'فقدان الشغف والهدف من المذاكرة', category: 'معنى', icon: '🌟', reliefNote: 'الشغف يأتي بعد الحركة لا قبلها؛ ابدأي دقيقتين وسيتبعك الإلهام.' }
  ]
};

const GAME_ID = 'break-mountain';

export const BreakTheMountainGame: React.FC<BreakTheMountainGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const initialPieces = STAGE_PIECES[currentStage] || STAGE_PIECES[1];

  const [remainingPieces, setRemainingPieces] = useState<StressPiece[]>(initialPieces);
  const [brokenPiecesCount, setBrokenPiecesCount] = useState<number>(0);
  const [lastReliefNote, setLastReliefNote] = useState<string | null>(null);
  
  // Custom stress addition
  const [customInput, setCustomInput] = useState<string>('');
  const [showAddCustom, setShowAddCustom] = useState<boolean>(false);

  // Dissolving state for animation
  const [dissolvingId, setDissolvingId] = useState<string | null>(null);
  
  const [completed, setCompleted] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [earnedXP, setEarnedXP] = useState<number>(40);

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    const pieces = STAGE_PIECES[stageNum] || STAGE_PIECES[1];
    setRemainingPieces(pieces);
    setBrokenPiecesCount(0);
    setLastReliefNote(null);
    setDissolvingId(null);
    setCompleted(false);
    setShowCompletionModal(false);
  };

  const totalOriginal = Math.max(initialPieces.length, remainingPieces.length + brokenPiecesCount);
  const mountainWeightPercent = Math.round((remainingPieces.length / totalOriginal) * 100);

  const handlePieceClick = (piece: StressPiece) => {
    if (dissolvingId) return;

    soundManager.playPop();
    setDissolvingId(piece.id);
    setLastReliefNote(piece.reliefNote);

    setTimeout(() => {
      const nextRemaining = remainingPieces.filter(p => p.id !== piece.id);
      setRemainingPieces(nextRemaining);
      const newBroken = brokenPiecesCount + 1;
      setBrokenPiecesCount(newBroken);
      setDissolvingId(null);

      // Check if all pieces were broken
      if (nextRemaining.length === 0) {
        setTimeout(() => {
          setCompleted(true);
          const result = completeStage(GAME_ID, currentStage, 3, newBroken, onAddXP);
          setEarnedXP(result.xpAwarded);
          setProgress(getGameLevelProgress(GAME_ID));
          setShowCompletionModal(true);
        }, 350);
      }
    }, 280);
  };

  const handleAddCustomStress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    soundManager.playSoftTap();
    const newPiece: StressPiece = {
      id: `custom_${Date.now()}`,
      title: customInput.trim(),
      category: isAr ? 'ضغط خاص بي' : 'My Personal Stress',
      icon: '⚡',
      reliefNote: isAr 
        ? `حتى «${customInput.trim()}» يمكن تفكيكه والتعامل معه خطوة بخطوة دون رعب.`
        : `Even this personal stress can be deconstructed stone by stone.`,
      isCustom: true
    };

    setRemainingPieces([newPiece, ...remainingPieces]);
    setCustomInput('');
    setShowAddCustom(false);
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'break-mountain',
      gameTitle: isAr ? `كسّري الجبل (المرحلة ${currentStage})` : `Break the Mountain (Stage ${currentStage})`,
      quote: isAr 
        ? `أكملت المرحلة ${currentStage}؛ الجبل ليس صخرة واحدة عملاقة بل حجارة تلاشت حبة بحبة.` 
        : `Completed Stage ${currentStage}; the mountain stones were cleared one by one.`,
      reflection: userReflection || (isAr ? 'فتّت كل ضغوط اليوم وتذكرت أن خطوة واحدة تكفي.' : 'Broke down all pressures into manageable pieces.'),
      tag: isAr ? 'الحمل الدراسي والضغوط' : 'Pressure Release'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
    if (onAddXP) onAddXP(20);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleNextStage = () => {
    if (currentStage < 3) {
      loadStage(currentStage + 1);
    } else {
      setShowCompletionModal(false);
    }
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
                {isAr ? 'كسّري الجبل (تفكيك الضغوط) ⛏️' : 'Break the Mountain ⛏️'}
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                {isAr ? '٣ مراحل متدرجة 🏆' : '3 Progressive Stages 🏆'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr 
                ? 'الجبل الكبير مجرد صخور صغيرة متراكمة؛ انقري على كل صخرة لتفتيتها وتحويلها لمسار سهل.' 
                : 'Deconstruct massive workloads into manageable micro-steps across 3 progressive stages.'}
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
            movesMade={brokenPiecesCount}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={handleRestart}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer ms-auto sm:ms-0"
            title={isAr ? 'إعادة بناء الجبل' : 'Reset'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mountain Progress Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-teal-900/20 dark:border-stone-800 bg-gradient-to-b from-[#f0fdfa] via-[#e6fffa] to-[#ccfbf1] dark:from-[#0d1f1c] dark:via-[#091714] dark:to-[#040d0b] p-6 sm:p-8 shadow-xl space-y-5">
        
        {/* Mountain Weight Status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {isAr ? `ثقل الجبل المتبقي (المرحلة ${currentStage}):` : `Mountain Weight (Stage ${currentStage}):`}
            </span>
            <span className="font-mono font-bold text-teal-700 dark:text-teal-300">
              {mountainWeightPercent}%
            </span>
          </div>

          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
            {isAr ? `تم تفتيت ${brokenPiecesCount} من ${totalOriginal} صخور` : `Shattered ${brokenPiecesCount}/${totalOriginal}`}
          </span>
        </div>

        {/* Dynamic Visual Mountain Height Bar */}
        <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${mountainWeightPercent}%` }}
          />
        </div>

        {/* Live Relief Note Box */}
        {lastReliefNote && !completed && (
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-stone-850/80 border border-teal-300 dark:border-teal-800 shadow-sm backdrop-blur-sm animate-fade-in flex items-start gap-2.5">
            <span className="text-base shrink-0">🌿</span>
            <p className="text-xs text-teal-900 dark:text-teal-100 font-medium leading-relaxed">
              {lastReliefNote}
            </p>
          </div>
        )}

        {/* Rocks Grid */}
        {!completed ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {remainingPieces.map((piece) => {
              const isDissolving = dissolvingId === piece.id;
              return (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece)}
                  disabled={isDissolving}
                  className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs group ${
                    isDissolving 
                      ? 'scale-90 opacity-0 bg-teal-200 dark:bg-teal-900 duration-300' 
                      : 'bg-white hover:bg-stone-50 dark:bg-stone-850 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {piece.icon}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {piece.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      {piece.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium pt-1 border-t border-stone-100 dark:border-stone-800/60">
                    <span>{isAr ? 'انقري للتفتيت' : 'Tap to shatter'}</span>
                    <Pickaxe className="w-3.5 h-3.5 text-teal-500 group-hover:rotate-45 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Mountain Completely Shattered Celebration Stage */
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border-2 border-emerald-400 text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
              <Flower2 className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-emerald-900 dark:text-emerald-100">
                {isAr ? `🎉 تفتت الجبل بالكامل في المرحلة ${currentStage} وتحول لبستان أمل!` : `🎉 Mountain Shattered in Stage ${currentStage}!`}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                {isAr 
                  ? '«عندما تقسمين المستحيل إلى خطوات متناهية الصغر، يتلاشى الرعب وتكتشفين قدرتك الهادئة على السعي.»' 
                  : '“When the impossible is broken into micro-moments, panic evaporates into calm momentum.”'}
              </p>
            </div>

            {/* Reflection and Save Section */}
            <div className="max-w-md mx-auto space-y-2 pt-2 text-start">
              <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block">
                {isAr ? 'خاطرة سريعة تودين تسجيلها في دفترك:' : 'Record a quick reflection:'}
              </label>
              <input
                type="text"
                value={userReflection}
                onChange={(e) => setUserReflection(e.target.value)}
                placeholder={isAr ? 'مثلاً: خطوة اليوم الأولى هي مراجعة ٥ صفحات فقط...' : 'e.g., My first micro-step is opening page 1...'}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-teal-500"
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

        {/* Add Personal Custom Stress Input */}
        {!completed && (
          <div className="pt-2">
            {!showAddCustom ? (
              <button
                onClick={() => setShowAddCustom(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? '+ إضافة ضغط شخصي في بالي الآن لتفتيته' : '+ Add personal stress to break'}</span>
              </button>
            ) : (
              <form onSubmit={handleAddCustomStress} className="flex gap-2 animate-fade-in">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={isAr ? 'اكتبي ما يثقل عقلك الآن لتفتتيه...' : 'What weighs on your mind right now?'}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-teal-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-colors cursor-pointer"
                >
                  {isAr ? 'إضافة للجبل' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="px-2.5 py-2 bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs rounded-xl cursor-pointer"
                >
                  ✕
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
