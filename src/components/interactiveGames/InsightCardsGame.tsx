import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Bookmark, 
  ArrowRight, 
  Eye, 
  HelpCircle,
  Compass,
  Heart
} from 'lucide-react';

interface InsightCardsGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface MysteryCard {
  id: string;
  coverPattern: string;
  category: string;
  revealedQuestion: string;
  deepContext: string;
  soothingThought: string;
}

const MYSTERY_CARDS: MysteryCard[] = [
  {
    id: 'c1',
    coverPattern: '🌿',
    category: 'الدفين غير المعلن',
    revealedQuestion: 'لو اختفت كل توقعات الآخرين منك غداً، ما أول شيء ستتوقفين عن فعله فوراً؟',
    deepContext: 'أحياناً نحمل أثقالاً لا تخصنا لمجرد أننا اعتدنا أن نكون كما يريدون منا أن نكون.',
    soothingThought: '«راحتك ليست خيانة لأحد، وحقك في أن تتنفسي يسبق كل رغباتهم».'
  },
  {
    id: 'c2',
    coverPattern: '🌙',
    category: 'الخوف المستتر',
    revealedQuestion: 'ما هي الكلمة التي تنتظرين أن يقولها لك شخص معين لتشعري أنك بخير؟',
    deepContext: 'البحث عن الأمان الخارجي هو احتياج طفولي مشروع، لكن القلب يشفى حين يعطي نفسه هذا الأمان أولاً.',
    soothingThought: '«أنتِ كافية قبل أن يقولوها، ومحاولتك الصادقة تستحق التقدير الآن».'
  },
  {
    id: 'c3',
    coverPattern: '🌊',
    category: 'الشجاعة والصدق',
    revealedQuestion: 'ما هو الشيء الذي تصمتين عنه خوفاً من أن يتغير رأي الناس فيكِ؟',
    deepContext: 'الصمت المنهك يحمي صورة وهمية، لكنه يأكل الصدق والسلام الداخلي مع الوقت.',
    soothingThought: '«من يحبك حقاً سيحب حقيقتك الكاملة بضعفها، لا القناع فقط».'
  },
  {
    id: 'c4',
    coverPattern: '🕯️',
    category: 'المكان الآمن',
    revealedQuestion: 'متى كانت آخر مرة شعرتِ فيها أنك في أمان تام ولا أحد يطالبك بشيء؟',
    deepContext: 'تذكر اللحظات الآمنة يعيد برمجة الجهاز العصبي ويذكره بأنه قادر على العودة إلى مرفأ الهدوء.',
    soothingThought: '«ذلك المرفأ الآمن ليس مكاناً في الماضي، بل هو مساحة في صدرك يمكنك الرجوع إليها بأنفاسك».'
  },
  {
    id: 'c5',
    coverPattern: '🪞',
    category: 'الرفق بالذات',
    revealedQuestion: 'لو قابلتِ نسختك الصغيرة في سن السابعة الآن، ماذا ستهمسين في أذنها؟',
    deepContext: 'شفاء الحاضر يبدأ حين ننظر للطفل الذي كنا عليه بحب وحماية لا بقسوة أو تبرؤ.',
    soothingThought: '«قولي لها: لقد كبرنا، وأنا هنا لأحميكِ ولن أسمح لأحد أن يؤذيكِ مجدداً».'
  },
  {
    id: 'c6',
    coverPattern: '☀️',
    category: 'المسار الحقيقي',
    revealedQuestion: 'ما هو القرار البسيط الذي تؤجلينه منذ شهر وأنتِ تعلمين أنه سيريح قلبك؟',
    deepContext: 'التأجيل ليس كسلاً، بل هو صراع بين الأمان القديم المألوف والحرية الجديدة المخيفة.',
    soothingThought: '«خطوة صغيرة واحدة غير مكتملة خير من ألف نية مثالية مؤجلة».'
  }
];

export const InsightCardsGame: React.FC<InsightCardsGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const activeCard = MYSTERY_CARDS.find(c => c.id === selectedCardId);

  const handleSelectCard = (id: string) => {
    if (selectedCardId === id && isFlipped) return;
    
    soundManager.playPop();
    setSelectedCardId(id);
    setIsFlipped(false);

    // Flip animation with mysterious revelation chime
    setTimeout(() => {
      setIsFlipped(true);
      soundManager.playHarmonicAffirmation();
      if (onAddXP) onAddXP(40);
    }, 250);
  };

  const handleSaveMoment = () => {
    if (!activeCard) return;

    saveMoment({
      gameId: 'cards-insight',
      gameTitle: isAr ? 'البطاقات المقلوبة' : 'Insight Cards',
      quote: activeCard.revealedQuestion,
      reflection: userReflection || (isAr ? 'كشفت كارت البصيرة وتأملت في الحقيقة غير المعلنة.' : 'Uncovered subconscious insight card.'),
      tag: isAr ? 'استكشاف باطني' : 'Insight Card'
    });

    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
    triggerConfetti(0.5, 0.4);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setSelectedCardId(null);
    setIsFlipped(false);
    setUserReflection('');
    setIsSaved(false);
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
          <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
            {isAr ? 'لعبة: البطاقات المقلوبة 🃏' : 'Insight Cards 🃏'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {isAr ? 'استكشاف بدون إجبار' : 'Gentle Projection'}
        </span>
      </div>

      <div className="text-center max-w-md mx-auto space-y-1">
        <span className="text-xs font-bold text-violet-800 uppercase tracking-wider block">
          {isAr ? 'بدل الاستجواب المباشر.. اختاري حدسك' : 'Intuitive Subconscious Inquiry'}
        </span>
        <h2 className="text-2xl font-extrabold text-stone-900">
          {isAr ? 'اختاري بطاقة مقلوبة تكشف لك الحقيقة 🔮' : 'Pick a Mystery Card to Reveal Truth 🔮'}
        </h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          {isAr
            ? 'لا نسألك "ما الذي يقلقك؟"؛ دعي حدسك يختار رمزاً من البطاقات المقلوبة بالأسفل، واكتشفي السؤال غير المتوقع الذي يحتاجه قلبك الآن.'
            : 'Instead of dry questions, trust your intuition to choose a card and discover the reflection your heart needs right now.'}
        </p>
      </div>

      {!activeCard || !isFlipped ? (
        /* The 6 Face-down Mystery Cards Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
          {MYSTERY_CARDS.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleSelectCard(card.id)}
              className="group aspect-[3/4] rounded-3xl p-5 bg-gradient-to-br from-stone-900 via-stone-800 to-violet-950 text-white border-2 border-stone-700 hover:border-violet-400 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between items-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-radial from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-8 h-8 rounded-full border border-stone-600 flex items-center justify-center text-xs font-mono font-bold text-stone-400 group-hover:text-violet-300 group-hover:border-violet-400">
                0{idx + 1}
              </div>

              <div className="space-y-1">
                <span className="text-4xl filter drop-shadow-sm group-hover:scale-125 transition-transform block">
                  {card.coverPattern}
                </span>
                <span className="text-[11px] font-bold text-violet-300/80 tracking-widest block uppercase">
                  {isAr ? 'اكشفي البصيرة' : 'Reveal'}
                </span>
              </div>

              <span className="text-[10px] text-stone-500 font-serif">
                {isAr ? 'انقري للقلب' : 'Tap to flip'}
              </span>
            </button>
          ))}
        </div>
      ) : (
        /* The Revealed Card Details */
        <div className="bg-white rounded-3xl border-2 border-violet-200 p-6 sm:p-8 shadow-sm space-y-6 text-center animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-violet-50 text-violet-900 border border-violet-200">
              {activeCard.category}
            </span>
            <span className="text-2xl">{activeCard.coverPattern}</span>
          </div>

          {/* The Big Question */}
          <div className="space-y-2 max-w-lg mx-auto py-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              {isAr ? 'السؤال المفاجئ لقلبك الآن:' : 'The unexpected question for you:'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif leading-relaxed">
              «{activeCard.revealedQuestion}»
            </h3>
          </div>

          {/* Deep Context & Soothing Thought */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-2 text-start max-w-lg mx-auto leading-relaxed">
            <p className="font-medium text-stone-600">
              {activeCard.deepContext}
            </p>
            <div className="p-3 bg-violet-50/70 rounded-xl border border-violet-200 text-violet-950 font-serif font-bold italic">
              {activeCard.soothingThought}
            </div>
          </div>

          {/* Reflection Input and Save to My Journey */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 max-w-lg mx-auto space-y-3 text-start">
            <label className="text-xs font-bold text-stone-800 block">
              {isAr ? 'ما أول جواب أو ومضة خطرت في بالك حين قرأتِ السؤال؟' : 'What immediate thought surfaced when you read this?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي جوابك بصدق وبدون مراجعة أو تصحيح...' : 'Write your honest, unfiltered thought...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-violet-600 text-stone-800"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-700 hover:bg-violet-800 disabled:bg-violet-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved to My Journey ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'اختيار بطاقة أخرى' : 'Pick Another Card'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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
