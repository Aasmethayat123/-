import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import {
  RotateCcw,
  Bookmark,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';
import {
  getGameLevelProgress,
  completeStage,
  setActiveStage,
  GameProgressData
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface FirstSentenceFamilyGameProps {
  language: Language;
  onBackToMap?: () => void;
  onAddXP?: (amount: number) => void;
}

interface EchoSentence {
  oldHarshEcho: string;
  targetWords: string[];
  distractorWords?: string[];
  meaning: string;
}

const STAGE_SENTENCES: Record<number, EchoSentence[]> = {
  // Stage 1: Pure ordered healing assembly
  1: [
    {
      oldHarshEcho: '«أنتِ دائماً بتكسفينا ومبتعرفيش تتصرفي»',
      targetWords: ['أنا', 'لي', 'طريقتي', 'الخاصة', 'وقيمتي', 'محفوظة'],
      meaning: 'أنتِ لستِ نسخة من أحد، وعفويتك حقك الطبيعي.'
    },
    {
      oldHarshEcho: '«شايفة فلانة وصلت لفين وأنتِ مكانك؟»',
      targetWords: ['مساري', 'يخصني', 'وحدي', 'وسعيي', 'مقدّر'],
      meaning: 'المقارنة سرقة لوقتك؛ لكل زهرة توقيت إزهارها الخاص.'
    },
    {
      oldHarshEcho: '«أنتِ حساسة زيادة عن اللزوم ومبتستحمليش كلمة»',
      targetWords: ['حساسيتي', 'صدق', 'وقلبي', 'حي', 'ورحيم'],
      meaning: 'الرهافة ليست عيباً ولا ضعفاً، بل رادار للصدق والجمال.'
    }
  ],

  // Stage 2: Strict word order + Harsh Echo Distractor Words mixed in!
  2: [
    {
      oldHarshEcho: '«حبنا ليكِ مشروط بإنك تسمعي الكلام ومتعترضيش أبداً»',
      targetWords: ['اختلافي', 'في', 'الرأي', 'نضج', 'وليس', 'عقوقاً'],
      distractorWords: ['ذنب', 'أنانية'],
      meaning: 'الاستقلال الفكري مع الاحترام حق إنساني أصيل وليس جحوداً.'
    },
    {
      oldHarshEcho: '«إوعي تبيني زعلك قدام حد.. ابلعي وجعك واسكتي»',
      targetWords: ['مشاعري', 'مشروعة', 'والتعبير', 'الهادئ', 'شفاء'],
      distractorWords: ['فضيحة', 'ضعف'],
      meaning: 'كتمان الألم يورث الإنهاك؛ التعبير المتزن شجاعة صحية.'
    },
    {
      oldHarshEcho: '«أنتِ اللي مسؤولة تلمّي البيت وتصلحي مزاج الكل»',
      targetWords: ['أنا', 'أمنح', 'المودة', 'ولست', 'مسؤولة', 'عن', 'انفعالاتهم'],
      distractorWords: ['مقصرة', 'ملزمة'],
      meaning: 'أنتِ فرد محبوب في الأسرة ولستِ معالجة نفسية مسؤولة عن توتر الجميع.'
    }
  ],

  // Stage 3: Live Family Pressure Boundary Replies (longer ordered sentences + 3 traps)
  3: [
    {
      oldHarshEcho: '«ليه قافلة على نفسك؟ مفيش حاجة اسمها خصوصية بيننا!»',
      targetWords: ['محبتي', 'لكم', 'ثابتة', 'ومساحتي', 'الخاصة', 'تحفظ', 'طاقتي'],
      distractorWords: ['عزلة', 'قسوة', 'تقصير'],
      meaning: 'الخصوصية داخل الأسرة لا تنقص المحبة بل تحميها من الاختناق.'
    },
    {
      oldHarshEcho: '«بعد كل اللي عملناه عشانك بتختاري تخصص أو طريق تاني؟»',
      targetWords: ['أقدّر', 'تعبكم', 'بامتنان', 'ومستقبلي', 'أبنيه', 'ببصيرتي'],
      distractorWords: ['نكران', 'خوف', 'تبعية'],
      meaning: 'الامتنان للأهل يجتمع بانسجام تام مع اختيار رسالتك الخاصة في الحياة.'
    }
  ]
};

const GAME_ID = 'first-sentence';

interface WordToken {
  id: string;
  word: string;
  targetIdx: number; // -1 for distractor
}

function buildPool(puzzle: EchoSentence): WordToken[] {
  const valid: WordToken[] = puzzle.targetWords.map((w, i) => ({
    id: `v_${i}_${w}`,
    word: w,
    targetIdx: i
  }));
  const traps: WordToken[] = (puzzle.distractorWords || []).map((w, i) => ({
    id: `t_${i}_${w}`,
    word: w,
    targetIdx: -1
  }));
  const combined = [...valid, ...traps];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = (i * 5 + 2) % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined;
}

export const FirstSentenceFamilyGame: React.FC<FirstSentenceFamilyGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const puzzles = STAGE_SENTENCES[currentStage] || STAGE_SENTENCES[1];
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentPuzzle = puzzles[puzzleIndex] || puzzles[0];

  const [selectedTokens, setSelectedTokens] = useState<WordToken[]>([]);
  const [availableTokens, setAvailableTokens] = useState<WordToken[]>(() => buildPool(currentPuzzle));
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  useEffect(() => {
    const p = (STAGE_SENTENCES[currentStage] || STAGE_SENTENCES[1])[puzzleIndex];
    if (!p) return;
    setSelectedTokens([]);
    setAvailableTokens(buildPool(p));
    setFeedbackError(null);
  }, [currentStage, puzzleIndex]);

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    setPuzzleIndex(0);
    setMistakes(0);
    setCompleted(false);
    setShowCompletionModal(false);
    setIsSaved(false);
  };

  const isSentenceComplete = selectedTokens.length === currentPuzzle.targetWords.length;

  const handlePickToken = (token: WordToken) => {
    if (isSentenceComplete) return;

    if (token.targetIdx === -1) {
      soundManager.playIncorrect();
      setMistakes(m => m + 1);
      setFeedbackError(
        isAr
          ? `كلمة «${token.word}» صدى قديم من الشعور بالذنب! اتركيها خارج جملتك الشافية.`
          : `“${token.word}” is an old guilt echo — leave it out of your truth!`
      );
      return;
    }

    const expectedIdx = selectedTokens.length;
    if (currentStage >= 2 && token.targetIdx !== expectedIdx) {
      // Allow same identical word if duplicate, otherwise enforce order in Stages 2 & 3
      const expectedWord = currentPuzzle.targetWords[expectedIdx];
      if (token.word !== expectedWord) {
        soundManager.playSoftTap();
        setMistakes(m => m + 1);
        setFeedbackError(isAr ? 'رتّبي الكلمات بالتسلسل الصحيح لتستقيم الجملة الشافية.' : 'Tap the next word in sequence.');
        return;
      }
    }

    setFeedbackError(null);
    soundManager.playPop();
    const nextSelected = [...selectedTokens, token];
    setSelectedTokens(nextSelected);
    setAvailableTokens(availableTokens.filter(t => t.id !== token.id));

    if (nextSelected.length === currentPuzzle.targetWords.length) {
      soundManager.playHarmonicAffirmation();
    }
  };

  const handleRemoveToken = (token: WordToken) => {
    soundManager.playSoftTap();
    setSelectedTokens(selectedTokens.filter(t => t.id !== token.id));
    setAvailableTokens([...availableTokens, token]);
  };

  const handleNextPuzzle = () => {
    soundManager.playSoftTap();
    if (puzzleIndex + 1 < puzzles.length) {
      setPuzzleIndex(prev => prev + 1);
    } else {
      const stars = mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1;
      setEarnedStars(stars);
      const res = completeStage(GAME_ID, currentStage, stars, mistakes, onAddXP);
      setEarnedXP(res.xpAwarded);
      setProgress(getGameLevelProgress(GAME_ID));
      setCompleted(true);
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
      gameId: 'first-sentence',
      gameTitle: isAr ? `الجملة الأولى (المرحلة ${currentStage})` : `First Sentence (Stage ${currentStage})`,
      quote: currentPuzzle.targetWords.join(' '),
      reflection: userReflection || (isAr ? 'أعدت كتابة الصدى القديم بحقيقتي الصادقة.' : 'Rewrote early family echoes into healing truth.'),
      tag: isAr ? 'كلام الأسرة' : 'Family Echoes'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
    if (onAddXP) onAddXP(15);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
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
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'الجملة الأولى 💬' : 'The First Sentence 💬'}</span>
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {currentStage === 1
                ? (isAr ? 'المرحلة ١: بناء الجملة الشافية من أصداء الطفولة' : 'Stage 1: Assemble the healing truth')
                : currentStage === 2
                ? (isAr ? 'المرحلة ٢: الترتيب المتسلسل مع استبعاد كلمات الذنب الدخيلة' : 'Stage 2: Ordered synthesis while filtering guilt traps')
                : (isAr ? 'المرحلة ٣: صياغة ردود حدودية ناضجة تحت الضغط العائلي' : 'Stage 3: Mature boundary statements under pressure')}
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
            movesMade={mistakes}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={() => loadStage(currentStage)}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />
          <button
            onClick={() => loadStage(currentStage)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span className="font-mono tabular-nums">
              {isAr ? `الصدى ${puzzleIndex + 1} من ${puzzles.length}` : `Echo ${puzzleIndex + 1} of ${puzzles.length}`}
            </span>
            {(currentPuzzle.distractorWords?.length || 0) > 0 && (
              <span className="text-rose-600 dark:text-rose-400 text-[11px]">
                {isAr ? `تجنبي ${currentPuzzle.distractorWords?.length} كلمات سامة دخيلة` : `Avoid ${currentPuzzle.distractorWords?.length} guilt trap words`}
              </span>
            )}
          </div>

          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900 text-xs text-rose-950 dark:text-rose-100 space-y-1 max-w-lg mx-auto text-start">
            <span className="font-bold block opacity-75">
              {isAr ? 'الصدى القديم الذي تسلل إليكِ:' : 'The old painful echo:'}
            </span>
            <p className="text-sm sm:text-base font-bold font-serif">{currentPuzzle.oldHarshEcho}</p>
          </div>

          {feedbackError && !isSentenceComplete && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2 max-w-lg mx-auto text-start animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{feedbackError}</span>
            </div>
          )}

          <div className="p-6 bg-stone-50 dark:bg-stone-800/60 rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-700 min-h-24 flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
            {selectedTokens.length === 0 ? (
              <span className="text-xs text-stone-400">
                {isAr ? 'انقري الكلمات الصادقة بالترتيب لبناء جملتك...' : 'Tap the true words in order...'}
              </span>
            ) : (
              selectedTokens.map((tok) => (
                <button
                  key={tok.id}
                  onClick={() => !isSentenceComplete && handleRemoveToken(tok)}
                  className="min-h-10 px-3.5 py-1.5 bg-emerald-600 hover:bg-rose-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-colors"
                >
                  {tok.word} {!isSentenceComplete && '✕'}
                </button>
              ))
            )}
          </div>

          {!isSentenceComplete && (
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
              {availableTokens.map((tok) => (
                <button
                  key={tok.id}
                  onClick={() => handlePickToken(tok)}
                  className="min-h-11 px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 rounded-xl text-xs sm:text-sm font-bold border border-stone-200 dark:border-stone-700 shadow-xs cursor-pointer transform hover:scale-105 transition-all"
                >
                  {tok.word}
                </button>
              ))}
            </div>
          )}

          {isSentenceComplete && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs text-emerald-950 dark:text-emerald-100 space-y-2 animate-fade-in max-w-lg mx-auto">
              <span className="font-bold block">✨ {currentPuzzle.meaning}</span>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNextPuzzle}
                  className="min-h-10 px-5 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-pink-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {puzzleIndex + 1 < puzzles.length ? (isAr ? 'الجملة التالية' : 'Next') : (isAr ? 'إتمام المرحلة 🎉' : 'Finish Stage 🎉')}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto text-3xl">
            💬
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {isAr ? `أنتِ صانعة كلماتك الجديدة (المرحلة ${currentStage}) 🌿` : `Stage ${currentStage} Complete — Author Your Truth`}
            </h2>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'ما الجملة التي تقررين تصديقها عن نفسك اليوم؟' : 'What sentence do you choose to believe about yourself?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي جملتك الحقيقية...' : 'Your chosen sentence...'}
              className="w-full text-xs p-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-pink-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-pink-700 hover:bg-pink-800 disabled:bg-pink-300 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => loadStage(currentStage)}
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
