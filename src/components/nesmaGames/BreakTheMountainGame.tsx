import React, { useState } from 'react';
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

interface BreakTheMountainGameProps {
  language: Language;
  onBackToMap?: () => void;
}

interface StressPiece {
  id: string;
  title: string;
  category: string;
  icon: string;
  reliefNote: string;
  isCustom?: boolean;
}

const INITIAL_STRESS_PIECES: StressPiece[] = [
  {
    id: 'p1',
    title: 'تراكم محاضرات ودروس الأسبوع',
    category: 'دراسة',
    icon: '📚',
    reliefNote: 'محاضرة واحدة تكفي كبداية اليوم، لا تحملي الأسبوع كله دفعة واحدة.'
  },
  {
    id: 'p2',
    title: 'الخوف من الامتحان والدرجات',
    category: 'قلق مستقبلي',
    icon: '📝',
    reliefNote: 'الدرجة تقيّم أداء ورقة، ولا تقيّم قيمتك أو ذكاءك الإنساني.'
  },
  {
    id: 'p3',
    title: 'موعد تسليم البحث أو المشروع',
    category: 'مهام',
    icon: '⏳',
    reliefNote: 'البحث يُنجز فقرة بعد فقرة؛ افتحي الملف واكتبي جملة واحدة فقط.'
  },
  {
    id: 'p4',
    title: 'توقعات الأهل العالية والضغط النفسي',
    category: 'علاقات',
    icon: '🏠',
    reliefNote: 'حب أهلك لكِ ثابت، ومحاولتك الصادقة هي كل ما تملكينه بيدك.'
  },
  {
    id: 'p5',
    title: 'المقارنة مع إنجازات وتفوق زملائي',
    category: 'مقارنات',
    icon: '👥',
    reliefNote: 'لكل شخص رحلته الخاصة وسرعته وظروفه غير المرئية.'
  },
  {
    id: 'p6',
    title: 'قلة النوم والصداع وتشتت التركيز',
    category: 'جسد',
    icon: '☕',
    reliefNote: 'الجسد المنهك لا ينتج؛ راحتك ونومك هما أول خطوة في المذاكرة.'
  },
  {
    id: 'p7',
    title: 'تأنيب الضمير والشعور بالتقصير',
    category: 'صوت داخلي',
    icon: '💭',
    reliefNote: 'جلد الذات لا يصلح ما فات، الرفق بنفسك هو ما يمنحك الطاقة لتبدأي.'
  },
  {
    id: 'p8',
    title: 'كثرة المهام والشعور بالضياع',
    category: 'فوضى',
    icon: '🌀',
    reliefNote: 'السر في الخطوة القادمة فقط؛ افعلي شيئاً واحداً ثم تنفسي.'
  }
];

export const BreakTheMountainGame: React.FC<BreakTheMountainGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [remainingPieces, setRemainingPieces] = useState<StressPiece[]>(INITIAL_STRESS_PIECES);
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

  const totalOriginal = Math.max(INITIAL_STRESS_PIECES.length, remainingPieces.length + brokenPiecesCount);
  const mountainWeightPercent = Math.round((remainingPieces.length / totalOriginal) * 100);

  // When clicking a stress piece, shatter it with animation
  const handlePieceClick = (piece: StressPiece) => {
    if (dissolvingId) return;

    soundManager.playPop();
    setDissolvingId(piece.id);
    setLastReliefNote(piece.reliefNote);

    setTimeout(() => {
      const nextRemaining = remainingPieces.filter(p => p.id !== piece.id);
      setRemainingPieces(nextRemaining);
      setBrokenPiecesCount(prev => prev + 1);
      setDissolvingId(null);

      // Check if all pieces were broken
      if (nextRemaining.length === 0) {
        setTimeout(() => {
          setCompleted(true);
          soundManager.playHarmonicAffirmation();
          triggerConfetti(0.5, 0.4);
        }, 350);
      }
    }, 280);
  };

  // Add custom user stress stone
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
      gameTitle: isAr ? 'كسّري الجبل (تفكيك الضغوط)' : 'Break the Mountain',
      quote: isAr 
        ? 'الجبل ليس صخرة واحدة عملاقة؛ هو مجرد حجارة متراكمة تتلاشى عندما نأخذها حبة بحبة.' 
        : 'The mountain is not a monolith, but stones cleared one by one.',
      reflection: userReflection || (isAr ? 'فتّت كل ضغوط اليوم وتذكرت أن خطوة واحدة تكفي.' : 'Broke down all pressures into manageable pieces.'),
      tag: isAr ? 'الحمل الدراسي والضغوط' : 'Pressure Release'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setRemainingPieces(INITIAL_STRESS_PIECES);
    setBrokenPiecesCount(0);
    setLastReliefNote(null);
    setDissolvingId(null);
    setCompleted(false);
    setIsSaved(false);
    setUserReflection('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            {isAr ? '٣. كسّري الجبل ⛰️' : '3. Break the Mountain ⛰️'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-300">
          <span>{isAr ? `متبقي: ${remainingPieces.length}` : `Left: ${remainingPieces.length}`}</span>
          <span className="text-stone-600">·</span>
          <span className="text-teal-400">{mountainWeightPercent}% {isAr ? 'ثقل الجبل' : 'Weight'}</span>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          {/* Instructions */}
          <div className="space-y-1 max-w-md mx-auto">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
              {isAr ? 'الحمل الدراسي والضغوطات اليومية' : 'Academic & Everyday Overwhelm'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'اضغطي على كل ضغط لتفتيته وإخفائه ⛏️' : 'Tap Each Pressure Stone to Shatter It ⛏️'}
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              {isAr
                ? 'الجبل المتراكم في رأسك يتكون من هذه القطع المتشابكة. انقري على كل قطعة لتكسيرها وإزالتها من طريقك واحدة بعد أخرى.'
                : 'Your mental mountain is made of these entangled pressure stones. Click each piece to shatter it and lighten the load.'}
            </p>
          </div>

          {/* Visual Mountain Landscape Graphic with Blooming Greenery */}
          <div className="max-w-xs mx-auto space-y-2">
            <div className="relative py-2 flex items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <span className={`text-5xl transition-all duration-500 transform ${
                  mountainWeightPercent === 0 
                    ? 'scale-110' 
                    : mountainWeightPercent < 50 
                    ? 'scale-90 opacity-80' 
                    : 'scale-100'
                }`}>
                  {mountainWeightPercent === 0 
                    ? '🌸' 
                    : mountainWeightPercent < 35 
                    ? '🌿' 
                    : mountainWeightPercent < 70 
                    ? '🪨' 
                    : '⛰️'}
                </span>
                
                {brokenPiecesCount > 0 && (
                  <div className="flex gap-1 text-emerald-600 animate-gentle-float">
                    {Array.from({ length: Math.min(5, brokenPiecesCount) }).map((_, i) => (
                      <span key={i} className="text-xs">🌱</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Health Meter */}
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-300 rounded-full"
                style={{ width: `${mountainWeightPercent}%` }}
              />
            </div>
          </div>

          {/* Dynamic Relief Note Toast */}
          {lastReliefNote && (
            <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-xs text-emerald-950 animate-fade-in max-w-lg mx-auto flex items-center gap-2 text-start shadow-2xs">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <p className="font-medium leading-relaxed">{lastReliefNote}</p>
            </div>
          )}

          {/* Add Custom Personal Stress Button / Form */}
          <div className="max-w-xl mx-auto text-start">
            {!showAddCustom ? (
              <button
                onClick={() => setShowAddCustom(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? '✍️ أضيفي ضغطاً خاصاً بكِ لتكسيره' : 'Add Custom Stress Stone'}</span>
              </button>
            ) : (
              <form onSubmit={handleAddCustomStress} className="flex gap-2 animate-fade-in">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={isAr ? 'اكتبي ما يثقل رأسك الآن (مثال: مكالمة مؤجلة)...' : 'Type what weighs on you...'}
                  className="flex-1 text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-teal-600"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'إضافة للجبل' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="px-3 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </form>
            )}
          </div>

          {/* The Grid of Stress Pieces */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-1">
            {remainingPieces.map((piece) => {
              const isDissolving = dissolvingId === piece.id;

              return (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece)}
                  className={`p-4 rounded-2xl border-2 text-start transition-all duration-300 cursor-pointer shadow-xs transform flex items-center justify-between select-none ${
                    isDissolving
                      ? 'scale-50 opacity-0 bg-teal-200 border-teal-400 rotate-6 pointer-events-none'
                      : piece.isCustom
                      ? 'border-amber-400 bg-amber-50/80 hover:bg-amber-100 hover:scale-102 text-stone-800'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-teal-400 hover:scale-102 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0">{piece.icon}</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                        {piece.title}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-semibold block mt-0.5">
                        {piece.category}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-xl bg-stone-200 hover:bg-teal-200 text-stone-700 font-bold shrink-0 transition-colors">
                    {isAr ? 'تفتيت ⛏️' : 'Break ⛏️'}
                  </span>
                </button>
              );
            })}
          </div>

          {remainingPieces.length > 0 && (
            <p className="text-[11px] text-stone-400 italic">
              {isAr 
                ? `تبقت ${remainingPieces.length} قطع؛ انقري لتفتيتها جميعاً وتطهير المسار!` 
                : `${remainingPieces.length} stones remaining; clear the path!`}
            </p>
          )}
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-20 h-20 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🌸
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'تلاشى الجبل وأصبح طريقك حديقة خضراء! 🌿' : 'The Mountain Has Crumbled! 🌿'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«الجبل لم يكن صلباً كما تخيلتِ؛ كان مجرد ضغوط متراكمة فتّتيها قطعة بعد قطعة. والآن بعد أن خفّ الحمل، ابدأي بأي خطوة صغيرة بخفة وطمأنينة».'
                : 'The mountain was never an immovable wall; it was just accumulated thoughts. You are free to take a gentle single step.'}
            </p>
          </div>

          {/* Reflection Input and Save to My Journey Option */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-3 text-start">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <Bookmark className="w-4 h-4 text-teal-700" />
              <span>{isAr ? 'سؤال خفيف لتدوينه في رحلتك:' : 'A gentle reflection for your journey:'}</span>
            </div>
            <label className="text-xs text-stone-600 block">
              {isAr ? 'ما هي الخطوة الوحيدة الخفيفة التي ستبدأين بها بعد قليل؟' : 'What is the tiny, peaceful step you choose to take next?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'مثال: هفتح الكتاب وأقرا صفحتين بس / هشرب كوب شاي بهدوء...' : 'E.g., I will open the notes for 5 minutes...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-teal-600 text-stone-800"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved to My Journey ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment to My Journey')}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة اللعب' : 'Play Again'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
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
