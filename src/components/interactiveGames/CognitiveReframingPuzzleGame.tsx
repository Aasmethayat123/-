import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Puzzle, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Bookmark, 
  HelpCircle, 
  CheckCircle,
  Eye,
  Award,
  Layers,
  ChevronRight,
  Palette,
  Heart
} from 'lucide-react';

interface CognitiveReframingPuzzleGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface PuzzlePiece {
  id: string;
  originalTextAr: string;
  originalTextEn: string;
  targetTextAr: string;
  targetTextEn: string;
  isDistorted: boolean;
  optionsAr: string[];
  optionsEn: string[];
  selectedChoiceIndex: number;
}

interface ThoughtPuzzle {
  id: string;
  categoryAr: string;
  categoryEn: string;
  themeTitleAr: string;
  themeTitleEn: string;
  artworkColor: string;
  artPattern: string;
  initialNegativeThoughtAr: string;
  initialNegativeThoughtEn: string;
  completedReframedThoughtAr: string;
  completedReframedThoughtEn: string;
  insightAr: string;
  insightEn: string;
  artworkSymbol: string;
  pieces: PuzzlePiece[];
}

const PRESET_PUZZLES: ThoughtPuzzle[] = [
  {
    id: 'boundaries',
    categoryAr: 'حدود العلاقات والذات',
    categoryEn: 'Boundaries & Self-Preservation',
    themeTitleAr: 'حدود واضحة.. قلب مطمئن',
    themeTitleEn: 'Clear Boundaries, Peaceful Heart',
    artworkColor: 'from-amber-500 via-rose-500 to-indigo-600',
    artPattern: 'bg-radial-[at_top_right]',
    initialNegativeThoughtAr: '«أنا دائماً أفشل في وضع حدود للآخرين ولا أستحق الاحترام»',
    initialNegativeThoughtEn: '"I always fail at setting boundaries and do not deserve respect"',
    completedReframedThoughtAr: '«أنا أتعلم وضع حدود صحية تدريجياً وبوعي، ومن حقي الحفاظ على سلامي»',
    completedReframedThoughtEn: '"I am learning healthy boundaries gradually with awareness; protecting my peace is my right"',
    insightAr: 'الحدود مهارة تُكتسب بالتكرار كالعضلات، وليست خصلة تولد مع الإنسان. استبدال التعميم ("دائماً") بالتدرج ("أتعلم تدريجياً") يزيل الشلل الشعوري.',
    insightEn: 'Boundaries are a learned skill, not an innate trait. Replacing absolutes like "always" with gradual progress unlocks emotional freedom.',
    artworkSymbol: '🛡️✨',
    pieces: [
      {
        id: 'p1',
        originalTextAr: 'أنا دائماً',
        originalTextEn: 'I always',
        targetTextAr: 'أنا أتعلم',
        targetTextEn: 'I am learning',
        isDistorted: true,
        optionsAr: ['أنا دائماً', 'أنا عاجز عن', 'أنا أتعلم'],
        optionsEn: ['I always', 'I am unable to', 'I am learning'],
        selectedChoiceIndex: 0
      },
      {
        id: 'p2',
        originalTextAr: 'أفشل في',
        originalTextEn: 'fail at',
        targetTextAr: 'وضع حدود صحية',
        targetTextEn: 'setting healthy boundaries',
        isDistorted: true,
        optionsAr: ['أفشل في', 'أعاقب نفسي بـ', 'وضع حدود صحية'],
        optionsEn: ['fail at', 'punish myself by', 'setting healthy boundaries'],
        selectedChoiceIndex: 0
      },
      {
        id: 'p3',
        originalTextAr: 'وضع حدود للآخرين',
        originalTextEn: 'boundaries for others',
        targetTextAr: 'تدريجياً وبوعي',
        targetTextEn: 'gradually with awareness',
        isDistorted: true,
        optionsAr: ['وضع حدود للآخرين', 'إرضاء الجميع', 'تدريجياً وبوعي'],
        optionsEn: ['boundaries for others', 'pleasing everyone', 'gradually with awareness'],
        selectedChoiceIndex: 0
      },
      {
        id: 'p4',
        originalTextAr: 'ولا أستحق الاحترام',
        originalTextEn: 'and do not deserve respect',
        targetTextAr: 'ومن حقي الحفاظ على سلامي',
        targetTextEn: 'and protecting my peace is my right',
        isDistorted: true,
        optionsAr: ['ولا أستحق الاحترام', 'ولن يتقبلني أحد', 'ومن حقي الحفاظ على سلامي'],
        optionsEn: ['and do not deserve respect', 'and nobody likes me', 'and protecting my peace is my right'],
        selectedChoiceIndex: 0
      }
    ]
  },
  {
    id: 'perfectionism',
    categoryAr: 'وهم الكمالية والإنجاز',
    categoryEn: 'Perfectionism & Achievement',
    themeTitleAr: 'الجمال في النقص المتقن',
    themeTitleEn: 'Beauty in Mindful Progress',
    artworkColor: 'from-emerald-400 via-teal-600 to-cyan-800',
    artPattern: 'bg-radial-[at_bottom_left]',
    initialNegativeThoughtAr: '«إذا لم يكن عملي مثالياً تماماً فكل جهدي بلا فائدة وفاشل»',
    initialNegativeThoughtEn: '"If my work is not 100% flawless, all my effort is worthless and useless"',
    completedReframedThoughtAr: '«الكمال وهم مستحيل، والإتقان والمحاولة المستمرة هما مقياس النمو الحقيقي»',
    completedReframedThoughtEn: '"Perfection is an illusion; mindful effort and learning are the true measures of real growth"',
    insightAr: 'فخ الأبيض والأسود يعزل الإنجازات عن الواقع. العمل المكتمل بنسبة 80% أفضل بكثير من العمل المثالي الذي لم يكتمل قط.',
    insightEn: 'All-or-nothing thinking invalidates genuine effort. Finished beats unfinished perfection every single time.',
    artworkSymbol: '🌱💎',
    pieces: [
      {
        id: 'pf1',
        originalTextAr: 'إذا لم يكن عملي مثالياً',
        originalTextEn: 'If my work is not flawless',
        targetTextAr: 'الكمال وهم مستحيل',
        targetTextEn: 'Perfection is an illusion',
        isDistorted: true,
        optionsAr: ['إذا لم يكن عملي مثالياً', 'إذا ارتكبت هفوة', 'الكمال وهم مستحيل'],
        optionsEn: ['If my work is not flawless', 'If I make a slip', 'Perfection is an illusion'],
        selectedChoiceIndex: 0
      },
      {
        id: 'pf2',
        originalTextAr: 'فكل جهدي بلا فائدة',
        originalTextEn: 'all my effort is worthless',
        targetTextAr: 'والإتقان والمحاولة',
        targetTextEn: 'and mindful effort',
        isDistorted: true,
        optionsAr: ['فكل جهدي بلا فائدة', 'فلن يقدرني أحد', 'والإتقان والمحاولة'],
        optionsEn: ['all my effort is worthless', 'no one values me', 'and mindful effort'],
        selectedChoiceIndex: 0
      },
      {
        id: 'pf3',
        originalTextAr: 'وفاشل تماماً',
        originalTextEn: 'and a total failure',
        targetTextAr: 'هما مقياس النمو الحقيقي',
        targetTextEn: 'are the true measures of growth',
        isDistorted: true,
        optionsAr: ['وفاشل تماماً', 'ودليل على ضعفي', 'هما مقياس النمو الحقيقي'],
        optionsEn: ['and a total failure', 'proof of weakness', 'are the true measures of growth'],
        selectedChoiceIndex: 0
      }
    ]
  },
  {
    id: 'mindreading',
    categoryAr: 'افتراض الأسوأ ونظرة الآخرين',
    categoryEn: 'Social Perception & Projections',
    themeTitleAr: 'حرية التحرر من أوهام الرأي',
    themeTitleEn: 'Freedom from Projected Judgments',
    artworkColor: 'from-fuchsia-500 via-purple-600 to-blue-700',
    artPattern: 'bg-radial-[at_center]',
    initialNegativeThoughtAr: '«الجميع ينظرون إلي وينتقدون هفواتي ويسخرون من ارتباكي»',
    initialNegativeThoughtEn: '"Everyone is staring at me, mocking my flaws, and judging my anxiety"',
    completedReframedThoughtAr: '«الناس مشغولون بحياتهم، وقيمتي ثابتة وأخطائي تجارب طبيعية لنموي»',
    completedReframedThoughtEn: '"People are absorbed in their own lives; my worth is unshakable and mistakes are natural steps"',
    insightAr: 'تأثير الأضواء (Spotlight Effect) يجعلنا نبالغ في تقدير انتباه الآخرين لنا بعشرة أضعاف. الحقيقة هي أن كل شخص مشغول بمخاوفه الخاصة.',
    insightEn: 'The Spotlight Effect makes us overestimate how closely people scrutinize us. People are preoccupied with their own worlds.',
    artworkSymbol: '🌟🕊️',
    pieces: [
      {
        id: 'mr1',
        originalTextAr: 'الجميع ينظرون إلي',
        originalTextEn: 'Everyone is staring at me',
        targetTextAr: 'الناس مشغولون بحياتهم',
        targetTextEn: 'People are absorbed in their lives',
        isDistorted: true,
        optionsAr: ['الجميع ينظرون إلي', 'كل العيون مسلطة علي', 'الناس مشغولون بحياتهم'],
        optionsEn: ['Everyone is staring at me', 'All eyes judge me', 'People are absorbed in their lives'],
        selectedChoiceIndex: 0
      },
      {
        id: 'mr2',
        originalTextAr: 'وينتقدون هفواتي',
        originalTextEn: 'and mocking my flaws',
        targetTextAr: 'وقيمتي ثابتة ومحفوظة',
        targetTextEn: 'and my worth is unshakable',
        isDistorted: true,
        optionsAr: ['وينتقدون هفواتي', 'ولا يغفرون لي', 'وقيمتي ثابتة ومحفوظة'],
        optionsEn: ['and mocking my flaws', 'and never forgive', 'and my worth is unshakable'],
        selectedChoiceIndex: 0
      },
      {
        id: 'mr3',
        originalTextAr: 'ويسخرون من ارتباكي',
        originalTextEn: 'and laughing at my nervousness',
        targetTextAr: 'وأخطائي تجارب لنموي',
        targetTextEn: 'and mistakes are steps to grow',
        isDistorted: true,
        optionsAr: ['ويسخرون من ارتباكي', 'ويرونني ضعيفاً', 'وأخطائي تجارب لنموي'],
        optionsEn: ['and laughing at my nervousness', 'and see me weak', 'and mistakes are steps to grow'],
        selectedChoiceIndex: 0
      }
    ]
  }
];

export const CognitiveReframingPuzzleGame: React.FC<CognitiveReframingPuzzleGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [puzzlesState, setPuzzlesState] = useState<ThoughtPuzzle[]>(PRESET_PUZZLES);
  const [activePieceId, setActivePieceId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [savedArtworks, setSavedArtworks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nesma_cbt_artworks_gallery');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const activePuzzle = puzzlesState[currentPuzzleIndex];

  // Check completion whenever the active puzzle changes
  useEffect(() => {
    const allPiecesResolved = activePuzzle.pieces.every(
      (p) => (isAr ? p.optionsAr[p.selectedChoiceIndex] : p.optionsEn[p.selectedChoiceIndex]) === 
             (isAr ? p.targetTextAr : p.targetTextEn)
    );

    if (allPiecesResolved && !isCompleted) {
      setIsCompleted(true);
      soundManager.playSuccess();
      triggerConfetti();
      if (onAddXP) onAddXP(40);
    }
  }, [activePuzzle, isCompleted, isAr, onAddXP]);

  const handleSelectOption = (pieceId: string, optionIndex: number) => {
    soundManager.playSoftTap();
    setPuzzlesState((prev) => {
      const updated = [...prev];
      const puzzle = { ...updated[currentPuzzleIndex] };
      puzzle.pieces = puzzle.pieces.map((piece) => {
        if (piece.id === pieceId) {
          return { ...piece, selectedChoiceIndex: optionIndex };
        }
        return piece;
      });
      updated[currentPuzzleIndex] = puzzle;
      return updated;
    });
  };

  const handleResetPuzzle = () => {
    soundManager.playSoftTap();
    setIsCompleted(false);
    setSavedSuccess(false);
    setPuzzlesState((prev) => {
      const updated = [...prev];
      const p = { ...updated[currentPuzzleIndex] };
      p.pieces = p.pieces.map((piece) => ({
        ...piece,
        selectedChoiceIndex: 0
      }));
      updated[currentPuzzleIndex] = p;
      return updated;
    });
  };

  const handleSaveToGallery = () => {
    soundManager.playChime(520, 2.0);
    setSavedSuccess(true);
    const artworkId = activePuzzle.id;

    if (!savedArtworks.includes(artworkId)) {
      const updatedList = [...savedArtworks, artworkId];
      setSavedArtworks(updatedList);
      try {
        localStorage.setItem('nesma_cbt_artworks_gallery', JSON.stringify(updatedList));
      } catch {
        // ignore
      }
    }

    saveMoment({
      gameId: 'cognitive-reframing-puzzle',
      gameTitle: isAr ? 'صانع الأنماط: فك شفرة الأفكار' : 'Cognitive Reframing Puzzle',
      quote: isAr ? activePuzzle.completedReframedThoughtAr : activePuzzle.completedReframedThoughtEn,
      reflection: isAr ? activePuzzle.insightAr : activePuzzle.insightEn,
      tag: isAr ? 'لوحة فكرية مضيئة' : 'Luminous Thought Artwork'
    });
  };

  const handleNextPuzzle = () => {
    soundManager.playSoftTap();
    setIsCompleted(false);
    setSavedSuccess(false);
    setActivePieceId(null);
    setCurrentPuzzleIndex((prev) => (prev + 1) % puzzlesState.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 text-stone-800 dark:text-stone-100 animate-fadeIn" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Puzzle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black font-serif">
                {isAr ? 'صانع الأنماط: فك شفرة الأفكار التلقائية' : 'Cognitive Reframing Puzzle'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                {isAr ? 'بازل CBT فني' : 'Artistic CBT'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr 
                ? 'فكك أجزاء الفكرة المشوهة، استبدل قطع البازل، وشاهد تحولها إلى لوحة مضيئة ملهمة' 
                : 'Deconstruct automatic thoughts, swap distorted puzzle pieces, and restore luminous inner artwork'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              soundManager.playSoftTap();
              setShowGallery(!showGallery);
            }}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-750 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span>{isAr ? `معرض اللوحات (${savedArtworks.length})` : `Gallery (${savedArtworks.length})`}</span>
          </button>

          {onBackToMap && (
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onBackToMap();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-xs font-bold transition-colors cursor-pointer"
            >
              {isAr ? '← خريطة الألعاب' : '← Back'}
            </button>
          )}
        </div>
      </div>

      {/* Gallery Modal / Section */}
      {showGallery && (
        <div className="mb-6 p-4 bg-gradient-to-br from-amber-500/10 via-indigo-500/10 to-stone-900/10 border border-amber-500/30 rounded-3xl animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold">{isAr ? 'معرض لوحات الأفكار المرممة' : 'Restored Artworks Gallery'}</h2>
            </div>
            <button
              onClick={() => setShowGallery(false)}
              className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>

          {savedArtworks.length === 0 ? (
            <p className="text-xs text-stone-500 dark:text-stone-400 text-center py-4">
              {isAr ? 'لم ترمم أي لوحة بعد. ركب بازل الأفكار بالأسفل لتحفظ أول لوحة مضيئة في معرضك!' : 'No artworks unlocked yet. Solve the thought puzzle below to preserve your first luminous piece!'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {savedArtworks.map((id) => {
                const puzzle = PRESET_PUZZLES.find((p) => p.id === id);
                if (!puzzle) return null;
                return (
                  <div
                    key={id}
                    className={`p-3 rounded-2xl bg-gradient-to-br ${puzzle.artworkColor} text-white shadow-md relative overflow-hidden`}
                  >
                    <div className="text-2xl mb-1">{puzzle.artworkSymbol}</div>
                    <div className="text-xs font-black mb-1">{isAr ? puzzle.themeTitleAr : puzzle.themeTitleEn}</div>
                    <div className="text-[11px] leading-relaxed opacity-95 line-clamp-3">
                      {isAr ? puzzle.completedReframedThoughtAr : puzzle.completedReframedThoughtEn}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Puzzle Interactive Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
        {/* Scenario Header Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-400">
              {isAr ? `تحدي ${currentPuzzleIndex + 1} من ${puzzlesState.length}` : `Challenge ${currentPuzzleIndex + 1} of ${puzzlesState.length}`}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/50 dark:border-indigo-800">
              {isAr ? activePuzzle.categoryAr : activePuzzle.categoryEn}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {PRESET_PUZZLES.map((pz, idx) => (
              <button
                key={pz.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setCurrentPuzzleIndex(idx);
                  setIsCompleted(false);
                  setSavedSuccess(false);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                  currentPuzzleIndex === idx
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
                title={isAr ? pz.themeTitleAr : pz.themeTitleEn}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Phase A: Puzzle Not Completed - Interactive Pieces Assembly */}
        {!isCompleted ? (
          <div className="space-y-6">
            <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 p-3 sm:p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold mb-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'الفكرة التلقائية المشوهة الحالية:' : 'Current Automatic Distorted Thought:'}</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-rose-950 dark:text-rose-200 leading-relaxed font-serif">
                {isAr ? activePuzzle.initialNegativeThoughtAr : activePuzzle.initialNegativeThoughtEn}
              </p>
            </div>

            {/* The Puzzle Assembly Board */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  {isAr ? 'لوحة تركيب البازل (انقر على أي قطعة لتعديلها واستبدال الجزء المشوه):' : 'Puzzle Assembly Board (tap any piece to substitute distortion):'}
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                  {isAr ? 'القطع المتطابقة تشع بنور ذهبي' : 'Matched pieces glow golden'}
                </span>
              </div>

              {/* Interlocking Puzzle Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 p-3 sm:p-4 bg-stone-100/90 dark:bg-stone-950/70 rounded-2xl border border-stone-200/90 dark:border-stone-800">
                {activePuzzle.pieces.map((piece, index) => {
                  const currentText = isAr ? piece.optionsAr[piece.selectedChoiceIndex] : piece.optionsEn[piece.selectedChoiceIndex];
                  const targetText = isAr ? piece.targetTextAr : piece.targetTextEn;
                  const isResolved = currentText === targetText;
                  const isSelected = activePieceId === piece.id;

                  return (
                    <div
                      key={piece.id}
                      onClick={() => {
                        soundManager.playSoftTap();
                        setActivePieceId(isSelected ? null : piece.id);
                      }}
                      className={`relative p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[92px] group select-none ${
                        isResolved
                          ? 'bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-indigo-500/15 border-emerald-500/60 shadow-sm shadow-emerald-500/10'
                          : isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-400/30'
                          : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-750 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mb-1">
                        <span>{isAr ? `قطعة #${index + 1}` : `Piece #${index + 1}`}</span>
                        {isResolved ? (
                          <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                            <CheckCircle className="w-3 h-3" />
                            {isAr ? 'سليمة' : 'Aligned'}
                          </span>
                        ) : (
                          <span className="text-amber-500 font-bold">
                            {isAr ? 'تحتاج ترميم' : 'Needs Repair'}
                          </span>
                        )}
                      </div>

                      <div className={`text-xs sm:text-sm font-bold leading-snug ${isResolved ? 'text-emerald-700 dark:text-emerald-300' : 'text-stone-800 dark:text-stone-200'}`}>
                        {currentText}
                      </div>

                      <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-between">
                        <span>{isAr ? 'انقر للتبديل' : 'Tap to swap'}</span>
                        <ChevronRight className="w-3 h-3 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Piece Option Selector Tray */}
            {activePieceId && (() => {
              const activePiece = activePuzzle.pieces.find((p) => p.id === activePieceId);
              if (!activePiece) return null;

              return (
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 rounded-2xl animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Puzzle className="w-3.5 h-3.5 text-amber-600" />
                      {isAr ? 'اختر القطعة البديلة الأكثر تعاطفاً وعقلانية:' : 'Choose the most compassionate and balanced replacement piece:'}
                    </span>
                    <button
                      onClick={() => setActivePieceId(null)}
                      className="text-[11px] text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {isAr ? 'تم' : 'Done'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activePiece.optionsAr.map((optAr, optIdx) => {
                      const optEn = activePiece.optionsEn[optIdx];
                      const isCurrent = activePiece.selectedChoiceIndex === optIdx;
                      const isTarget = (isAr ? optAr : optEn) === (isAr ? activePiece.targetTextAr : activePiece.targetTextEn);

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(activePiece.id, optIdx)}
                          className={`p-3 rounded-xl text-xs font-bold text-start border transition-all cursor-pointer ${
                            isCurrent
                              ? isTarget
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-amber-500 text-white border-amber-500 shadow-sm'
                              : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{isAr ? optAr : optEn}</span>
                            {isCurrent && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Helpful hint for user */}
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-2">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {isAr ? 'الهدف: استبدال لغة اللوم والتعميم بلغة التدرج والتعاطف' : 'Goal: Replace blaming & rigid terms with compassion and progress'}
              </span>
              <button
                onClick={handleResetPuzzle}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isAr ? 'إعادة ضبط البازل' : 'Reset'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Phase B: Puzzle Completed - Radiant Artwork Transformation */
          <div className="space-y-6 animate-fadeIn">
            {/* Luminous Canvas Card */}
            <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${activePuzzle.artworkColor} text-white shadow-xl relative overflow-hidden transition-all duration-700`}>
              <div className="absolute top-2 end-3 text-6xl opacity-15 select-none pointer-events-none">
                {activePuzzle.artworkSymbol}
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                    {isAr ? 'لوحة الأنماط المرممة بنجاح ✨' : 'Luminous Thought Artwork ✨'}
                  </span>
                  <span className="text-xs font-bold opacity-90">
                    {isAr ? activePuzzle.themeTitleAr : activePuzzle.themeTitleEn}
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-black font-serif leading-relaxed drop-shadow-sm">
                  {isAr ? activePuzzle.completedReframedThoughtAr : activePuzzle.completedReframedThoughtEn}
                </div>

                {/* Insight & Wisdom */}
                <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 text-xs sm:text-sm leading-relaxed opacity-95">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-200">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{isAr ? 'العمق النفسي لإعادة الصياغة:' : 'Psychological Insight:'}</span>
                  </div>
                  {isAr ? activePuzzle.insightAr : activePuzzle.insightEn}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToGallery}
                  disabled={savedSuccess}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    savedSuccess
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:opacity-90 shadow-sm'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>
                    {savedSuccess 
                      ? (isAr ? 'تم الحفظ في معرضك ودفتر رحلتك ✓' : 'Saved to Gallery & Journey ✓')
                      : (isAr ? 'حفظ اللوحة في معرض إنجازاتي' : 'Save to My Artworks Gallery')}
                  </span>
                </button>

                <button
                  onClick={handleResetPuzzle}
                  className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-850 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إعادة تفكيك البازل' : 'Replay Puzzle'}</span>
                </button>
              </div>

              <button
                onClick={handleNextPuzzle}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                <span>{isAr ? 'الانتقال إلى اللغز التالي' : 'Next Thought Puzzle'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CognitiveReframingPuzzleGame;
