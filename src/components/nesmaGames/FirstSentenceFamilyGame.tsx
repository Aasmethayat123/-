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
  MessageCircle, 
  Heart,
  ArrowRight
} from 'lucide-react';

interface FirstSentenceFamilyGameProps {
  language: Language;
  onBackToMap?: () => void;
}

const PUZZLE_SENTENCES = [
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
];

export const FirstSentenceFamilyGame: React.FC<FirstSentenceFamilyGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const currentPuzzle = PUZZLE_SENTENCES[puzzleIndex];

  // Scramble words for the picker
  const [availableWords, setAvailableWords] = useState<string[]>(() => {
    return [...currentPuzzle.targetWords].sort(() => Math.random() - 0.5);
  });

  const handlePickWord = (word: string) => {
    soundManager.playPop();
    const nextSelected = [...selectedWords, word];
    setSelectedWords(nextSelected);
    setAvailableWords(availableWords.filter(w => w !== word));

    if (nextSelected.length === currentPuzzle.targetWords.length) {
      soundManager.playHarmonicAffirmation();
    }
  };

  const handleRemoveWord = (word: string) => {
    soundManager.playSoftTap();
    setSelectedWords(selectedWords.filter(w => w !== word));
    setAvailableWords([...availableWords, word]);
  };

  const handleNextPuzzle = () => {
    soundManager.playSoftTap();
    if (puzzleIndex + 1 < PUZZLE_SENTENCES.length) {
      const nextIdx = puzzleIndex + 1;
      setPuzzleIndex(nextIdx);
      setSelectedWords([]);
      setAvailableWords([...PUZZLE_SENTENCES[nextIdx].targetWords].sort(() => Math.random() - 0.5));
    } else {
      setCompleted(true);
      soundManager.playLevelUpFanfare();
      triggerConfetti(0.5, 0.4);
    }
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'first-sentence',
      gameTitle: isAr ? 'الجملة الأولى' : 'The First Sentence',
      quote: selectedWords.join(' '),
      reflection: userReflection || (isAr ? 'أعدت كتابة الكلمات القديمة بحقيقتي الصادقة.' : 'Rewrote early family echoes into healing truth.'),
      tag: isAr ? 'كلام الأسرة' : 'Family Echoes'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setPuzzleIndex(0);
    setSelectedWords([]);
    setAvailableWords([...PUZZLE_SENTENCES[0].targetWords].sort(() => Math.random() - 0.5));
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
          <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
            {isAr ? '٧. الجملة الأولى 💬' : '7. The First Sentence 💬'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {puzzleIndex + 1} / {PUZZLE_SENTENCES.length}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-pink-800 uppercase tracking-wider block">
              {isAr ? 'تفكيك كلام المقربين وإعادة بناء الحقيقة' : 'Untangling Early Childhood Echoes'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'رتّبي كلمات الجملة الشافية 🧩' : 'Arrange the Healing Sentence 🧩'}
            </h2>
          </div>

          {/* Old Echo Banner */}
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-950 space-y-1 max-w-md mx-auto text-start">
            <span className="font-bold block opacity-75">
              {isAr ? 'الصدى القديم الذي تسلل إليكِ:' : 'The old painful echo:'}
            </span>
            <p className="text-sm font-semibold italic">{currentPuzzle.oldHarshEcho}</p>
          </div>

          {/* Assembled Sentence Box */}
          <div className="p-6 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-300 min-h-24 flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
            {selectedWords.length === 0 ? (
              <span className="text-xs text-stone-400">
                {isAr ? 'انقري على الكلمات بالأسفل لترتيبها هنا...' : 'Tap words below to arrange them here...'}
              </span>
            ) : (
              selectedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveWord(word)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-rose-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-colors"
                >
                  {word} ✕
                </button>
              ))
            )}
          </div>

          {/* Available Words Pool */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
            {availableWords.map((word, idx) => (
              <button
                key={idx}
                onClick={() => handlePickWord(word)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-bold border border-stone-200 shadow-xs cursor-pointer transform hover:scale-105 transition-all"
              >
                {word}
              </button>
            ))}
          </div>

          {selectedWords.length === currentPuzzle.targetWords.length && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 space-y-1 animate-fade-in max-w-md mx-auto">
              <span className="font-bold block">✨ {currentPuzzle.meaning}</span>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNextPuzzle}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'الجملة التالية' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto text-3xl">
            💬
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'أنتِ صانعة قصتك وكلماتك الجديدة 🌿' : 'You Author Your Own Story 🌿'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«الكلمات التي قالوها قديماً كانت تعبر عن قلقهم ومخاوفهم هم، لا عن حقيقتك. اليوم أنت تختارين الجملة التي تليق بك».'
                : 'Their words were reflections of their own fears, not of your truth.'}
            </p>
          </div>

          {/* Reflection Input */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 block">
              {isAr ? 'سؤال خفيف: ما هي الجملة التي تقررين أن تصدقيها عن نفسك من الآن فصاعداً؟' : 'What is the sentence you choose to believe about yourself?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي جملتك الحقيقية...' : 'Your chosen sentence...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-pink-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-pink-700 hover:bg-pink-800 disabled:bg-pink-300 text-white rounded-xl text-xs font-bold cursor-pointer"
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
