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
  Heart,
  Puzzle,
  Lightbulb,
  CheckCircle2,
  Undo2
} from 'lucide-react';

interface ReframeSentenceGameProps {
  language: Language;
  onBackToMap?: () => void;
}

interface ReframeItem {
  harsh: string;
  kind: string;
  insight: string;
  puzzleChunks: { id: string; text: string; order: number }[];
}

const REFRAME_DATA: ReframeItem[] = [
  {
    harsh: '«أنا ضيّعت عمري كله ومحققتش حاجة.»',
    kind: '«أنا مريت بسنين شاقة وتجارب صعبة استهلكت طاقتي، ولسه في عمري مساحات رحبة أبدأ فيها خطوة بخطوة.»',
    insight: 'القسوة على الماضي تمحو ما تعلمته؛ التعاطف مع نفسك يفتح لك باب الغد.',
    puzzleChunks: [
      { id: 'p1_1', text: 'أنا مريت بسنين شاقة', order: 0 },
      { id: 'p1_2', text: 'وتجارب صعبة استهلكت طاقتي،', order: 1 },
      { id: 'p1_3', text: 'ولسه في عمري مساحات رحبة', order: 2 },
      { id: 'p1_4', text: 'أبدأ فيها خطوة بخطوة.', order: 3 }
    ]
  },
  {
    harsh: '«محدش فاهمني ولا حد حاسس بيا في العالم ده.»',
    kind: '«مشاعري عميقة ومحتاجة صبر، وصعب أوصّلها أحياناً.. بس ده لا يعني إن مفيش ناس مستعدة تسمعني لو عبرت بهدوء.»',
    insight: 'الوحدة شعور مؤلم، لكنها ليست حكماً أبدياً بأنك غير مفهوم.',
    puzzleChunks: [
      { id: 'p2_1', text: 'مشاعري عميقة ومحتاجة صبر،', order: 0 },
      { id: 'p2_2', text: 'وصعب أوصّلها أحياناً،', order: 1 },
      { id: 'p2_3', text: 'وده لا يعني غياب من يفهمني،', order: 2 },
      { id: 'p2_4', text: 'بل أحتاج مساحة آمنة للتعبير.', order: 3 }
    ]
  },
  {
    harsh: '«لازم أكون كاملة ومغلطش ولا غلطة عشان أستاهل التقدير.»',
    kind: '«أنا إنسانة طبيعية بتعلم وبغلط، ومجهودي الصادق كافي جداً وقيمتي الإنسانية مش مشروطة بالكمال.»',
    insight: 'الكمال فخ يسرق بهجة السعي. النضج هو قبول المحاولة غير الكاملة.',
    puzzleChunks: [
      { id: 'p3_1', text: 'أنا إنسانة طبيعية بتعلم وبغلط،', order: 0 },
      { id: 'p3_2', text: 'ومجهودي الصادق كافي جداً،', order: 1 },
      { id: 'p3_3', text: 'وقيمتي الإنسانية الحقيقية', order: 2 },
      { id: 'p3_4', text: 'مش مشروطة أبداً بالكمال.', order: 3 }
    ]
  },
  {
    harsh: '«لو رفضوني أو متقبلتش يبقى العيب فيّ أنا.»',
    kind: '«الرفض جزء من مسار الحياة وتوافق الفرص؛ مش كل باب مش مناسب ليا يعني إني قليلة أو معيبة.»',
    insight: 'عدم القبول في مكان معين يوجهك لمكانك الحقيقي ولا يقلل من قدرك.',
    puzzleChunks: [
      { id: 'p4_1', text: 'الرفض جزء من مسار الحياة،', order: 0 },
      { id: 'p4_2', text: 'ومش كل باب مش مناسب ليا', order: 1 },
      { id: 'p4_3', text: 'يعني إني قليلة أو معيبة،', order: 2 },
      { id: 'p4_4', text: 'بل يوجهني لمكاني الحقيقي.', order: 3 }
    ]
  }
];

export const ReframeSentenceGame: React.FC<ReframeSentenceGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<'puzzle' | 'card'>('puzzle');
  
  // Card mode state
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Puzzle mode state
  const [placedChunks, setPlacedChunks] = useState<{ id: string; text: string; order: number }[]>([]);
  const [availableChunks, setAvailableChunks] = useState<{ id: string; text: string; order: number }[]>([]);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [shakeChunkId, setShakeChunkId] = useState<string | null>(null);

  // Overall game state
  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const currentItem = REFRAME_DATA[currentIndex];

  // Initialize or shuffle puzzle chunks when currentIndex changes
  useEffect(() => {
    const chunks = [...currentItem.puzzleChunks];
    // Deterministic shuffle
    const shuffled = [...chunks].sort((a, b) => ((a.order * 3 + 1) % 5) - ((b.order * 3 + 1) % 5));
    setAvailableChunks(shuffled);
    setPlacedChunks([]);
    setPuzzleCompleted(false);
    setIsFlipped(false);
  }, [currentIndex]);

  const handleFlip = () => {
    soundManager.playHarmonicAffirmation();
    setIsFlipped(true);
  };

  const handlePlaceChunk = (chunk: { id: string; text: string; order: number }) => {
    const nextExpectedOrder = placedChunks.length;
    
    // Check if clicked piece is the next sequential piece in the sentence
    if (chunk.order === nextExpectedOrder) {
      soundManager.playPop();
      const newPlaced = [...placedChunks, chunk];
      setPlacedChunks(newPlaced);
      setAvailableChunks(availableChunks.filter(c => c.id !== chunk.id));

      if (newPlaced.length === currentItem.puzzleChunks.length) {
        setPuzzleCompleted(true);
        soundManager.playHarmonicAffirmation();
        triggerConfetti(0.5, 0.4);
      }
    } else {
      // Gentle hint / feedback
      soundManager.playSoftTap();
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
    const chunks = [...currentItem.puzzleChunks];
    const shuffled = [...chunks].sort((a, b) => ((a.order * 3 + 1) % 5) - ((b.order * 3 + 1) % 5));
    setAvailableChunks(shuffled);
    setPlacedChunks([]);
    setPuzzleCompleted(false);
  };

  const handleSolveHint = () => {
    soundManager.playSoftTap();
    const nextExpectedOrder = placedChunks.length;
    const nextPiece = availableChunks.find(c => c.order === nextExpectedOrder);
    if (nextPiece) {
      handlePlaceChunk(nextPiece);
    }
  };

  const isCurrentStepFinished = mode === 'puzzle' ? puzzleCompleted : isFlipped;

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < REFRAME_DATA.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCompleted(true);
      soundManager.playHarmonicAffirmation();
      triggerConfetti(0.5, 0.4);
    }
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'reframe-sentence',
      gameTitle: isAr ? 'بدّلي الجملة' : 'Reframe the Sentence',
      quote: currentItem.kind,
      reflection: userReflection || (isAr ? 'بدّلت الجملة القاسية بصوت حنون وبازل رحيم.' : 'Replaced inner harshness with kindness.'),
      tag: isAr ? 'إعادة الصياغة' : 'Reframing'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
    setIsSaved(false);
    setUserReflection('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Puzzle className="w-3.5 h-3.5" />
            <span>{isAr ? '٢. بدّلي الجملة وبازل الأفكار' : '2. Reframe Sentence & Puzzle'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-stone-800 p-1 rounded-xl flex items-center gap-1 text-[11px] font-bold">
            <button
              onClick={() => { setMode('puzzle'); soundManager.playSoftTap(); }}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                mode === 'puzzle' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Puzzle className="w-3 h-3" />
              <span>{isAr ? 'بازل تفاعلي' : 'Puzzle'}</span>
            </button>
            <button
              onClick={() => { setMode('card'); soundManager.playSoftTap(); }}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                mode === 'card' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Repeat className="w-3 h-3" />
              <span>{isAr ? 'بطاقة كلاسيكية' : 'Card'}</span>
            </button>
          </div>

          <span className="text-xs text-stone-400 font-mono">
            {currentIndex + 1} / {REFRAME_DATA.length}
          </span>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              {isAr ? 'تحويل الصوت الداخلي القاسي إلى لغة رحيمة' : 'Inner Voice Softening'}
            </span>
            <p className="text-xs text-stone-500">
              {mode === 'puzzle'
                ? (isAr ? 'رتّبي قطع البازل الحركية لبناء الجملة البديلة المليئة بالرحمة والواقعية' : 'Arrange the puzzle pieces to build the compassionate reframe sentence')
                : (isAr ? 'انقري على البطاقة لتبديل الجملة القاسية ببديل حقيقي هادئ' : 'Tap to flip from harshness to gentle reality')}
            </p>
          </div>

          {/* Harsh Thought Banner (The origin thought with fracture line) */}
          <div className="p-4 sm:p-5 bg-rose-50/80 rounded-2xl border-2 border-rose-200 text-rose-950 text-start space-y-1 shadow-xs">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
              {isAr ? '⚡ الفكرة القاسية القديمة (المُجهدة):' : '⚡ Old Harsh Thought:'}
            </span>
            <p className="text-base sm:text-lg font-bold font-serif leading-snug">
              {currentItem.harsh}
            </p>
          </div>

          {mode === 'puzzle' ? (
            /* PUZZLE ASSEMBLY ARENA */
            <div className="space-y-5">
              {/* Assembly Track Tray */}
              <div className="space-y-2 text-start">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isAr ? 'مدرج تركيب الجملة البديلة (اضغطي القطع بالترتيب):' : 'Assembly Track (Tap pieces in order):'}</span>
                  </span>
                  
                  {placedChunks.length > 0 && !puzzleCompleted && (
                    <button
                      onClick={handleUndoPiece}
                      className="text-[11px] font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>{isAr ? 'تراجع عن آخر قطعة' : 'Undo piece'}</span>
                    </button>
                  )}
                </div>

                <div className={`min-h-28 p-4 rounded-2xl border-2 transition-all flex flex-wrap items-center gap-2 ${
                  puzzleCompleted
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-md'
                    : 'bg-stone-50 border-dashed border-stone-300'
                }`}>
                  {placedChunks.length === 0 ? (
                    <div className="w-full text-center py-4 text-xs text-stone-400 font-medium">
                      {isAr ? '🧩 ابدئي باختيار أول قطعة من قطع البازل بالأسفل...' : '🧩 Select the first piece from below to begin...'}
                    </div>
                  ) : (
                    placedChunks.map((chunk, idx) => (
                      <div
                        key={chunk.id}
                        className="animate-scale-in inline-flex items-center gap-2 px-3.5 py-2 bg-amber-100/90 border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-[10px] font-mono flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span>{chunk.text}</span>
                        {puzzleCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Scrambled Available Pieces Rack */}
              {!puzzleCompleted && (
                <div className="space-y-2 text-start">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-600">
                      {isAr ? 'شظايا وقطع البازل المتاحة (انقري لإدراجها في مكانها):' : 'Available Pieces (Tap to slot):'}
                    </span>
                    <button
                      onClick={handleSolveHint}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-3 h-3" />
                      <span>{isAr ? 'تلميح بالقطعة التالية' : 'Hint'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {availableChunks.map((chunk) => {
                      const isShaking = shakeChunkId === chunk.id;
                      return (
                        <button
                          key={chunk.id}
                          onClick={() => handlePlaceChunk(chunk)}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-start flex items-center gap-2.5 shadow-xs transform hover:-translate-y-0.5 active:translate-y-0 select-none ${
                            isShaking
                              ? 'border-rose-400 bg-rose-50 animate-shake text-rose-900 ring-2 ring-rose-300'
                              : 'border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 text-stone-800'
                          }`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 shrink-0">
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

              {/* Completed Puzzle Affirmation & Insight */}
              {puzzleCompleted && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-950 text-start space-y-2 animate-fade-in shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? '🎉 اكتمل بازل الفكرة البديلة بنجاح ووضوح!' : '🎉 Reframe puzzle assembled successfully!'}</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    💡 <strong className="text-stone-900">{isAr ? 'الاستبصار النفسي: ' : 'Insight: '}</strong>
                    {currentItem.insight}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* CLASSIC FLIP CARD MODE */
            <div 
              onClick={handleFlip}
              className={`p-8 rounded-3xl border-2 transition-all cursor-pointer min-h-56 flex flex-col items-center justify-center space-y-3 shadow-sm select-none ${
                isFlipped 
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950 ring-2 ring-amber-400' 
                  : 'bg-rose-50/60 border-rose-200 text-rose-950 hover:bg-rose-100/60'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 shadow-xs">
                {isFlipped 
                  ? (isAr ? '✨ الجملة البديلة (صوت المحبة)' : 'Kind Truth') 
                  : (isAr ? '⚡ الجملة القاسية القديمة (انقر للتبديل)' : 'Old Harsh Sentence (Tap to Flip)')}
              </span>

              <p className="text-xl sm:text-2xl font-bold font-serif leading-relaxed">
                {isFlipped ? currentItem.kind : currentItem.harsh}
              </p>

              {isFlipped && (
                <p className="text-xs text-amber-800 font-medium pt-2 border-t border-amber-200/60 max-w-md">
                  💡 {currentItem.insight}
                </p>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            {mode === 'puzzle' && !puzzleCompleted ? (
              <button
                onClick={handleResetCurrentPuzzle}
                className="text-xs text-stone-500 hover:text-stone-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة ترتيب هذا البازل' : 'Reset puzzle'}</span>
              </button>
            ) : <div />}

            <button
              disabled={!isCurrentStepFinished}
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isCurrentStepFinished
                  ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'الجملة التالية' : 'Next Sentence'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
            🧩
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'صوتك الداخلي اكتمل بنوره ولطفه 💛' : 'Your Inner Voice Reassembled with Kindness'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«تكلمي مع نفسك كما تتكلمين مع أعز صديقة تمرين بأزمة؛ لا أحد يزهر بالقسوة، والنفوس تُشفى بالرحمة وبإعادة ترتيب الأفكار».'
                : 'Speak to yourself as you would to a beloved friend in distress.'}
            </p>
          </div>

          {/* Reflection Input */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 block">
              {isAr ? 'سؤال خفيف: ما هي الكلمة الحنونة التي تتمنين سماعها اليوم؟' : 'What kind word do you need to hear today?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي جملتك الحنونة لنفسك...' : 'A warm thought for yourself...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
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

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة' : 'Replay'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'قائمة الألعاب' : 'All Games'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
