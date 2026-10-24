import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import {
  RotateCcw,
  Sparkles,
  Bookmark,
  Repeat,
  ArrowRight,
  Puzzle,
  Lightbulb,
  CheckCircle2,
  Undo2,
  AlertTriangle
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface ReframeSentenceGameProps {
  language: Language;
  onBackToMap?: () => void;
  onAddXP?: (amount: number) => void;
}

interface PuzzleChunk {
  id: string;
  text: string;
  order: number; // -1 means harsh distractor trap!
}

interface ReframeItem {
  harsh: string;
  kind: string;
  insight: string;
  puzzleChunks: PuzzleChunk[];
}

const STAGE_REFRAME_DATA: Record<number, ReframeItem[]> = {
  // Stage 1: 4 clean chunks - Everyday Self-Criticism
  1: [
    {
      harsh: '«أنا ضيّعت عمري كله ومحققتش حاجة.»',
      kind: '«أنا مريت بسنين شاقة وتجارب صعبة استهلكت طاقتي، ولسه في عمري مساحات رحبة أبدأ فيها خطوة بخطوة.»',
      insight: 'القسوة على الماضي تمحو ما تعلمته؛ التعاطف مع نفسك يفتح لك باب الغد.',
      puzzleChunks: [
        { id: 's1_1_1', text: 'أنا مريت بسنين شاقة', order: 0 },
        { id: 's1_1_2', text: 'وتجارب صعبة استهلكت طاقتي،', order: 1 },
        { id: 's1_1_3', text: 'ولسه في عمري مساحات رحبة', order: 2 },
        { id: 's1_1_4', text: 'أبدأ فيها خطوة بخطوة.', order: 3 }
      ]
    },
    {
      harsh: '«محدش فاهمني ولا حد حاسس بيا في العالم ده.»',
      kind: '«مشاعري عميقة ومحتاجة صبر، وصعب أوصّلها أحياناً، وده لا يعني غياب من يفهمني، بل أحتاج مساحة آمنة للتعبير.»',
      insight: 'الوحدة شعور مؤلم، لكنها ليست حكماً أبدياً بأنك غير مفهوم.',
      puzzleChunks: [
        { id: 's1_2_1', text: 'مشاعري عميقة ومحتاجة صبر،', order: 0 },
        { id: 's1_2_2', text: 'وصعب أوصّلها أحياناً،', order: 1 },
        { id: 's1_2_3', text: 'وده لا يعني غياب من يفهمني،', order: 2 },
        { id: 's1_2_4', text: 'بل أحتاج مساحة آمنة للتعبير.', order: 3 }
      ]
    },
    {
      harsh: '«لازم أكون كاملة ومغلطش ولا غلطة عشان أستاهل التقدير.»',
      kind: '«أنا إنسانة طبيعية بتعلم وبغلط، ومجهودي الصادق كافي جداً، وقيمتي الإنسانية الحقيقية مش مشروطة أبداً بالكمال.»',
      insight: 'الكمال فخ يسرق بهجة السعي. النضج هو قبول المحاولة غير الكاملة.',
      puzzleChunks: [
        { id: 's1_3_1', text: 'أنا إنسانة طبيعية بتعلم وبغلط،', order: 0 },
        { id: 's1_3_2', text: 'ومجهودي الصادق كافي جداً،', order: 1 },
        { id: 's1_3_3', text: 'وقيمتي الإنسانية الحقيقية', order: 2 },
        { id: 's1_3_4', text: 'مش مشروطة أبداً بالكمال.', order: 3 }
      ]
    }
  ],

  // Stage 2: 5 valid chunks + 1 Harsh/Toxic Trap piece (order: -1) to spot and avoid!
  2: [
    {
      harsh: '«لو رفضوني في الشغل ده أو العلاقة دي يبقى العيب فيّ أنا.»',
      kind: '«الرفض جزء طبيعي من مسار الحياة، وعدم توافق فرصة معينة معايا لا يقلل من قدري إطلاقاً، بل يوجهني لمكاني الأنسب بهدوء.»',
      insight: 'احذري شظايا الجلد الذاتي المندسة وسط أفكارك؛ عدم التوافق توجيه لا إدانة.',
      puzzleChunks: [
        { id: 's2_1_1', text: 'الرفض جزء طبيعي من مسار الحياة،', order: 0 },
        { id: 's2_1_2', text: 'وعدم توافق فرصة معينة معايا', order: 1 },
        { id: 's2_1_3', text: 'لا يقلل من قدري إطلاقاً،', order: 2 },
        { id: 's2_1_4', text: 'بل يوجهني لمكاني الأنسب', order: 3 },
        { id: 's2_1_5', text: 'بهدوء ونضج جديد.', order: 4 },
        { id: 's2_1_trap', text: 'لأني دايماً أقل من غيري.', order: -1 }
      ]
    },
    {
      harsh: '«أنا تعبت وبقيت بطيئة جداً.. أكيد أنا كسولة وفاشلة.»',
      kind: '«بطء حركتي اليوم هو نداء استغاثة من جسدي، والراحة الواعية ليست كسلاً، بل صيانة ضرورية لطاقتي لكي أستمر بسلام.»',
      insight: 'التفرقة بين الإرهاق العصبي والكسل تحررك من سوط جلد الذات.',
      puzzleChunks: [
        { id: 's2_2_1', text: 'بطء حركتي اليوم هو نداء', order: 0 },
        { id: 's2_2_2', text: 'استغاثة صادق من جسدي،', order: 1 },
        { id: 's2_2_3', text: 'والراحة الواعية ليست كسلاً،', order: 2 },
        { id: 's2_2_4', text: 'بل صيانة ضرورية لطاقتي', order: 3 },
        { id: 's2_2_5', text: 'لكي أستمر بسلام.', order: 4 },
        { id: 's2_2_trap', text: 'ومينفعش أرتاح قبل ما أنهك تماماً.', order: -1 }
      ]
    },
    {
      harsh: '«طالما قلقانة وخايفة يبقى أنا ضعيفة الإيمان والشخصية.»',
      kind: '«شعوري بالرهبة عند التحديات طبيعة بشرية أصيلة، والشجاعة الحقيقية ليست غياب الخوف، بل التقدم خطوة صغيرة رغم وجوده.»',
      insight: 'الشجاعة لا تعني تبلّد المشاعر، بل احتضان الرجفة والمضي برفق.',
      puzzleChunks: [
        { id: 's2_3_1', text: 'شعوري بالرهبة عند التحديات', order: 0 },
        { id: 's2_3_2', text: 'طبيعة بشرية أصيلة،', order: 1 },
        { id: 's2_3_3', text: 'والشجاعة الحقيقية ليست غياب الخوف،', order: 2 },
        { id: 's2_3_4', text: 'بل التقدم خطوة صغيرة', order: 3 },
        { id: 's2_3_5', text: 'رغم وجود الرجفة.', order: 4 },
        { id: 's2_3_trap', text: 'والإنسان القوي لا يقلق أبداً.', order: -1 }
      ]
    }
  ],

  // Stage 3: 6 valid chunks + 2 Subtle Traps (Toxic Positivity & Self-Blame) - Deep Core Beliefs
  3: [
    {
      harsh: '«لو حطيت حدود وقلت لأ، الناس هتبطل تحبني وهبقى وحيدة للأبد.»',
      kind: '«وضع حدودي بوضوح ولطف يحمي مودتي من الاحتراق، ومن يحبني بصدق سيحترم مساحتي، أما العلاقات المشروطة باستنزافي فلا تحميني.»',
      insight: 'العلاقة التي تنكسر عند أول «لا» محترمة كانت قائمة على الاستغلال لا الود.',
      puzzleChunks: [
        { id: 's3_1_1', text: 'وضع حدودي بوضوح ولطف', order: 0 },
        { id: 's3_1_2', text: 'يحمي مودتي من الاحتراق،', order: 1 },
        { id: 's3_1_3', text: 'ومن يحبني بصدق', order: 2 },
        { id: 's3_1_4', text: 'سيحترم مساحتي الإنسانية،', order: 3 },
        { id: 's3_1_5', text: 'أما القبول المشروط باستنزافي', order: 4 },
        { id: 's3_1_6', text: 'فهو ثمن باهظ لسلامي.', order: 5 },
        { id: 's3_1_trap1', text: 'ولازم أضحي بنفسي دائماً لإرضائهم.', order: -1 },
        { id: 's3_1_trap2', text: 'وأنا مش محتاجة أي بشر في حياتي.', order: -1 }
      ]
    },
    {
      harsh: '«غلطتي القديمة دي وصمة عار مستحيل تتصلح أو أسامح نفسي عليها.»',
      kind: '«أنا لست حبيسة خطأ واحد في الماضي؛ لقد كنت أتصرف بحدود وعيي حينها، واليوم أختار التعلم والغفران لنفسي وبناء حاضر أنضج.»',
      insight: 'محاكمة نفسك القديمة بوعيك الحالي ظلم للنفس؛ الغفران الذاتي يطلق سراح النمو.',
      puzzleChunks: [
        { id: 's3_2_1', text: 'أنا لست حبيسة خطأ واحد،', order: 0 },
        { id: 's3_2_2', text: 'فقد تصرفت بحدود وعيي حينها،', order: 1 },
        { id: 's3_2_3', text: 'والندم الصادق أدى رسالته،', order: 2 },
        { id: 's3_2_4', text: 'واليوم أختار التعلم والغفران', order: 3 },
        { id: 's3_2_5', text: 'لنفسي برحمة ومسؤولية،', order: 4 },
        { id: 's3_2_6', text: 'وبناء حاضر أنضج وأصدق.', order: 5 },
        { id: 's3_2_trap1', text: 'واستمراري في تعذيب نفسي يكفّر عني.', order: -1 },
        { id: 's3_2_trap2', text: 'وكأن شيئاً لم يحدث أبداً.', order: -1 }
      ]
    }
  ]
};

const GAME_ID = 'reframe-sentence';

function shuffleChunks(chunks: PuzzleChunk[]): PuzzleChunk[] {
  const arr = [...chunks];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const ReframeSentenceGame: React.FC<ReframeSentenceGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const stageItems = STAGE_REFRAME_DATA[currentStage] || STAGE_REFRAME_DATA[1];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<'puzzle' | 'card'>('puzzle');
  const [isFlipped, setIsFlipped] = useState(false);

  const [placedChunks, setPlacedChunks] = useState<PuzzleChunk[]>([]);
  const [availableChunks, setAvailableChunks] = useState<PuzzleChunk[]>([]);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [shakeChunkId, setShakeChunkId] = useState<string | null>(null);
  const [trapWarning, setTrapWarning] = useState<string | null>(null);
  const [mistakesCount, setMistakesCount] = useState(0);

  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  const currentItem = stageItems[currentIndex] || stageItems[0];
  const validTargetCount = currentItem.puzzleChunks.filter(c => c.order >= 0).length;
  const trapCount = currentItem.puzzleChunks.filter(c => c.order < 0).length;

  useEffect(() => {
    const item = (STAGE_REFRAME_DATA[currentStage] || STAGE_REFRAME_DATA[1])[currentIndex];
    if (!item) return;
    setAvailableChunks(shuffleChunks(item.puzzleChunks));
    setPlacedChunks([]);
    setPuzzleCompleted(false);
    setIsFlipped(false);
    setTrapWarning(null);
  }, [currentStage, currentIndex]);

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setCurrentIndex(0);
    setMistakesCount(0);
    setCompleted(false);
    setShowCompletionModal(false);
    setIsSaved(false);
  };

  const handleFlip = () => {
    soundManager.playHarmonicAffirmation();
    setIsFlipped(true);
  };

  const handlePlaceChunk = (chunk: PuzzleChunk) => {
    if (puzzleCompleted) return;

    if (chunk.order === -1) {
      soundManager.playIncorrect();
      setMistakesCount(m => m + 1);
      setShakeChunkId(chunk.id);
      setTrapWarning(
        isAr
          ? 'انتبهي! هذه شظية جلد ذاتي أو تطرف فكري وليست جزءاً من الصياغة المتزنة.'
          : 'Watch out! That piece is a cognitive distortion trap, not compassionate truth.'
      );
      setTimeout(() => setShakeChunkId(null), 650);
      return;
    }

    const nextExpectedOrder = placedChunks.length;
    if (chunk.order === nextExpectedOrder) {
      soundManager.playPuzzleSnap();
      setTrapWarning(null);
      const newPlaced = [...placedChunks, chunk];
      setPlacedChunks(newPlaced);
      setAvailableChunks(availableChunks.filter(c => c.id !== chunk.id));

      if (newPlaced.length === validTargetCount) {
        setPuzzleCompleted(true);
        soundManager.playHarmonicAffirmation();
        triggerConfetti(0.5, 0.4);
      }
    } else {
      soundManager.playSoftTap();
      setMistakesCount(m => m + 1);
      setShakeChunkId(chunk.id);
      setTimeout(() => setShakeChunkId(null), 600);
    }
  };

  const handleUndoPiece = () => {
    if (placedChunks.length === 0 || puzzleCompleted) return;
    soundManager.playSoftTap();
    const lastPiece = placedChunks[placedChunks.length - 1];
    setPlacedChunks(placedChunks.slice(0, -1));
    setAvailableChunks([...availableChunks, lastPiece]);
  };

  const handleResetCurrentPuzzle = () => {
    soundManager.playSoftTap();
    setAvailableChunks(shuffleChunks(currentItem.puzzleChunks));
    setPlacedChunks([]);
    setPuzzleCompleted(false);
    setTrapWarning(null);
  };

  const handleSolveHint = () => {
    soundManager.playHint();
    const nextExpectedOrder = placedChunks.length;
    const nextPiece = availableChunks.find(c => c.order === nextExpectedOrder);
    if (nextPiece) {
      handlePlaceChunk(nextPiece);
    }
  };

  const isCurrentStepFinished = mode === 'puzzle' ? puzzleCompleted : isFlipped;

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < stageItems.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCompleted(true);
      const stars = mistakesCount <= 1 ? 3 : mistakesCount <= 4 ? 2 : 1;
      setEarnedStars(stars);
      const res = completeStage(GAME_ID, currentStage, stars, mistakesCount, onAddXP);
      setEarnedXP(res.xpAwarded);
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
      gameId: 'reframe-sentence',
      gameTitle: isAr ? `بدّلي الجملة (المرحلة ${currentStage})` : `Reframe Sentence (Stage ${currentStage})`,
      quote: currentItem.kind,
      reflection: userReflection || (isAr ? 'بدّلت الجملة القاسية بصوت حنون وبازل رحيم.' : 'Replaced inner harshness with kindness.'),
      tag: isAr ? 'إعادة الصياغة' : 'Reframing'
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Header */}
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
              <Puzzle className="w-3.5 h-3.5" />
              <span>{isAr ? 'بدّلي الجملة وبازل الأفكار' : 'Reframe Sentence Puzzle'}</span>
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {currentStage === 1
                ? (isAr ? 'المرحلة ١: ترتيب ٤ شظايا رحيمة واضحة' : 'Stage 1: 4 Clear Reframe Pieces')
                : currentStage === 2
                ? (isAr ? 'المرحلة ٢: ٥ شظايا + فخ جلد ذاتي يجب تجنبه' : 'Stage 2: 5 Pieces + 1 Distortion Trap')
                : (isAr ? 'المرحلة ٣: ٦ شظايا عميقة + فخّان من التطرف الفكري' : 'Stage 3: 6 Core Pieces + 2 Subtle Traps')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StageLevelSelector
            language={language}
            gameId={GAME_ID}
            currentStage={currentStage}
            progress={progress}
            onSelectStage={(s) => loadStage(s)}
            showCompletionModal={showCompletionModal}
            completedStageNumber={currentStage}
            starsEarned={earnedStars}
            movesMade={mistakesCount}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={handleRestart}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />

          <div className="bg-stone-800 p-1 rounded-xl flex items-center gap-1 text-[11px] font-bold">
            <button
              onClick={() => { setMode('puzzle'); soundManager.playSoftTap(); }}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                mode === 'puzzle' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Puzzle className="w-3 h-3" />
              <span>{isAr ? 'بازل' : 'Puzzle'}</span>
            </button>
            <button
              onClick={() => { setMode('card'); soundManager.playSoftTap(); }}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                mode === 'card' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Repeat className="w-3 h-3" />
              <span>{isAr ? 'بطاقة' : 'Card'}</span>
            </button>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span className="font-mono tabular-nums">
              {isAr ? `الجملة ${currentIndex + 1} من ${stageItems.length}` : `Sentence ${currentIndex + 1} of ${stageItems.length}`}
            </span>
            {trapCount > 0 && mode === 'puzzle' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px]">
                <AlertTriangle className="w-3 h-3" />
                <span>{isAr ? `يوجد ${trapCount} فخ فكري يجب استبعاده` : `${trapCount} cognitive trap(s) to avoid`}</span>
              </span>
            )}
          </div>

          <div className="p-4 sm:p-5 bg-rose-50/80 dark:bg-rose-950/30 rounded-2xl border-2 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-100 text-start space-y-1 shadow-xs">
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
              {isAr ? '⚡ الفكرة القاسية القديمة (المُجهدة):' : '⚡ Old Harsh Thought:'}
            </span>
            <p className="text-base sm:text-lg font-bold font-serif leading-snug">
              {currentItem.harsh}
            </p>
          </div>

          {trapWarning && !puzzleCompleted && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2 text-start animate-fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{trapWarning}</span>
            </div>
          )}

          {mode === 'puzzle' ? (
            <div className="space-y-5">
              <div className="space-y-2 text-start">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {isAr
                        ? `مدرج التركيب المتزن (${placedChunks.length}/${validTargetCount}):`
                        : `Balanced Track (${placedChunks.length}/${validTargetCount}):`}
                    </span>
                  </span>

                  {placedChunks.length > 0 && !puzzleCompleted && (
                    <button
                      onClick={handleUndoPiece}
                      className="text-[11px] font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>{isAr ? 'تراجع' : 'Undo'}</span>
                    </button>
                  )}
                </div>

                <div className={`min-h-28 p-4 rounded-2xl border-2 transition-all flex flex-wrap items-center gap-2 ${
                  puzzleCompleted
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 ring-2 ring-amber-300 shadow-md'
                    : 'bg-stone-50 dark:bg-stone-800/50 border-dashed border-stone-300 dark:border-stone-700'
                }`}>
                  {placedChunks.length === 0 ? (
                    <div className="w-full text-center py-4 text-xs text-stone-400 font-medium">
                      {isAr ? '🧩 اختاري أول قطعة متزنة من الأسفل...' : '🧩 Select the first balanced piece below...'}
                    </div>
                  ) : (
                    placedChunks.map((chunk, idx) => (
                      <div
                        key={chunk.id}
                        className="animate-scale-in inline-flex items-center gap-2 px-3.5 py-2 bg-amber-100/90 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 font-bold text-xs sm:text-sm rounded-xl shadow-xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-[10px] font-mono flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span>{chunk.text}</span>
                        {puzzleCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {!puzzleCompleted && (
                <div className="space-y-2 text-start">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                      {isAr ? 'القطع المتاحة (انقري بالترتيب وتجنبي الفخاخ):' : 'Available Pieces (Tap in order, avoid traps):'}
                    </span>
                    <button
                      onClick={handleSolveHint}
                      className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-3 h-3" />
                      <span>{isAr ? 'تلميح' : 'Hint'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {availableChunks.map((chunk) => {
                      const isShaking = shakeChunkId === chunk.id;
                      return (
                        <button
                          key={chunk.id}
                          onClick={() => handlePlaceChunk(chunk)}
                          className={`min-h-12 p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-start flex items-center gap-2.5 shadow-xs transform hover:-translate-y-0.5 active:translate-y-0 select-none ${
                            isShaking
                              ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 ring-2 ring-rose-300'
                              : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-amber-400 text-stone-800 dark:text-stone-100'
                          }`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center text-stone-500 shrink-0">
                            🧩
                          </span>
                          <span className="text-xs sm:text-sm font-semibold leading-snug">
                            {chunk.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {puzzleCompleted && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-950 dark:text-emerald-100 text-start space-y-2 animate-fade-in shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-800 dark:text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? '🎉 اكتمل بازل الفكرة البديلة بنقاء ووضوح!' : '🎉 Reframe puzzle assembled!'}</span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    💡 <strong>{isAr ? 'الاستبصار النفسي: ' : 'Insight: '}</strong>
                    {currentItem.insight}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={handleFlip}
              className={`p-8 rounded-3xl border-2 transition-all cursor-pointer min-h-56 flex flex-col items-center justify-center space-y-3 shadow-sm select-none ${
                isFlipped
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400'
                  : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 text-rose-950 dark:text-rose-100 hover:bg-rose-100/60'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-white/80 dark:bg-stone-800 shadow-xs">
                {isFlipped
                  ? (isAr ? '✨ الجملة البديلة (صوت المحبة)' : 'Kind Truth')
                  : (isAr ? '⚡ الجملة القاسية القديمة (انقري للتبديل)' : 'Old Harsh Sentence (Tap to Flip)')}
              </span>

              <p className="text-xl sm:text-2xl font-bold font-serif leading-relaxed">
                {isFlipped ? currentItem.kind : currentItem.harsh}
              </p>

              {isFlipped && (
                <p className="text-xs text-amber-800 dark:text-amber-300 font-medium pt-2 border-t border-amber-200/60 max-w-md">
                  💡 {currentItem.insight}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
            {mode === 'puzzle' && !puzzleCompleted ? (
              <button
                onClick={handleResetCurrentPuzzle}
                className="text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة البازل' : 'Reset puzzle'}</span>
              </button>
            ) : <div />}

            <button
              disabled={!isCurrentStepFinished}
              onClick={handleNext}
              className={`min-h-11 flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isCurrentStepFinished
                  ? 'bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white cursor-pointer'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>
                {currentIndex + 1 < stageItems.length
                  ? (isAr ? 'الجملة التالية' : 'Next Sentence')
                  : (isAr ? 'إتمام المرحلة ✨' : 'Complete Stage ✨')}
              </span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
            🧩
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {isAr ? `اكتملت المرحلة ${currentStage} بنور ولطف 💛` : `Stage ${currentStage} Reassembled with Kindness`}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«لا أحد يزهر بالقسوة؛ النفوس تُشفى بالرحمة وبإعادة صياغة الأفكار بإنصاف.»'
                : 'Speak to yourself as you would to a beloved friend in distress.'}
            </p>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'ما هي الكلمة الحنونة التي تتمنين سماعها اليوم؟' : 'What kind word do you need to hear today?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي جملتك الحنونة لنفسك...' : 'A warm thought for yourself...'}
              className="w-full text-xs p-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-amber-600"
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
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
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
