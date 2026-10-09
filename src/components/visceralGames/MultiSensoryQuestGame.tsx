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
  Wind, 
  Coffee, 
  Hand, 
  Ear,
  Eye,
  CheckCircle2,
  Zap
} from 'lucide-react';

interface MultiSensoryQuestGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface SensoryCard {
  id: string;
  sense: string;
  senseIcon: string;
  taskTitle: string;
  realRoomAction: string;
  brainChemistrySecret: string;
}

const SENSORY_CARDS: SensoryCard[] = [
  {
    id: 's1',
    sense: 'حاسة الشم (The Olfactory Magic)',
    senseIcon: '☕',
    taskTitle: 'شمّ أروع رائحة قريبة منك حالاً 👃',
    realRoomAction: 'قومي فوراً واقتربي من أكثر رائحة تحبينها بجانبك (بن قهوة، برفان، قشر برتقال، أو افتحي الشباك وشمّي هواء الصباح) واستنشقيها ببطء لـ ٥ ثوانٍ!',
    brainChemistrySecret: '«إضاءة نفسية وحسية: حاسة الشم ترتبط وثيقاً بذاكرة المشاعر؛ استنشاق رائحة طيبة ومألوفة يساعد على تشتيت دائرة القلق وتحفيز شعور الألفة والاسترخاء الذاتي».'
  },
  {
    id: 's2',
    sense: 'حاسة اللمس (Tactile Grounding)',
    senseIcon: '✋',
    taskTitle: 'المسي أكثر شيء خشن في غرفتك 🪨',
    realRoomAction: 'مدي يدك والمسي سطحاً خشناً (حائط، قماش جينز، غلاف كتاب مجعد) وركزي بكل انتباهك في تفاصيل الملمس وافركيه برفق.',
    brainChemistrySecret: '«إضاءة نفسية وحسية: التركيز في الملمس المادي الخارجي هو أحد أساليب التأريض (Grounding) الشائعة، حيث يساعد على نقل الانتباه من زحام الأفكار إلى الحواس الحاضرة».'
  },
  {
    id: 's3',
    sense: 'حاسة السمع (Auditory Horizon)',
    senseIcon: '👂',
    taskTitle: 'التقطي أبعد صوت خافت في المكان 🎶',
    realRoomAction: 'اغمضي عينيكِ لمدة ٧ ثوانٍ، وابحثي بأذنيكِ عن أبعد صوت خافت في المكان (صوت مروحة، ثلاجة، ريح في الخارج، عصفور بعيد).',
    brainChemistrySecret: '«إضاءة نفسية وسمعية: توجيه الانتباه نحو الأصوات البعيدة يساعد العقل على توسيع مدى إدراكه وتخفيف حدة التركيز الضيق على الأفكار المقلقة».'
  }
];

export const MultiSensoryQuestGame: React.FC<MultiSensoryQuestGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [selectedCardIdx, setSelectedCardIdx] = useState<number>(0);
  const [isActionCompleted, setIsActionCompleted] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const activeCard = SENSORY_CARDS[selectedCardIdx];

  const handleCompleteAction = () => {
    soundManager.playHarmonicAffirmation();
    triggerConfetti(0.5, 0.4);
    setIsActionCompleted(true);
    if (onAddXP) onAddXP(45);
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'multi-sensory-quest',
      gameTitle: isAr ? 'صندوق الأسرار والروائح' : 'Multi-Sensory Quest',
      quote: activeCard.taskTitle,
      reflection: userReflection || activeCard.brainChemistrySecret,
      tag: isAr ? 'حواس وأعصاب' : 'Sensory Chemistry'
    });

    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleSwitchCard = (idx: number) => {
    soundManager.playSoftTap();
    setSelectedCardIdx(idx);
    setIsActionCompleted(false);
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
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {isAr ? '٥. لعبة: صندوق الأسرار والروائح ☕🌿' : '5. Multi-Sensory Quest ☕🌿'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {selectedCardIdx + 1} / {SENSORY_CARDS.length}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SENSORY_CARDS.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleSwitchCard(idx)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              idx === selectedCardIdx
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>{card.senseIcon}</span>
            <span>{card.sense.split('(')[0]}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mx-auto shadow-inner">
          {activeCard.senseIcon}
        </div>

        <div className="space-y-1 max-w-md mx-auto">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
            {activeCard.sense}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {activeCard.taskTitle}
          </h2>
          <p className="text-sm font-semibold text-stone-800 leading-relaxed p-4 bg-amber-50 rounded-2xl border border-amber-200">
            {activeCard.realRoomAction}
          </p>
        </div>

        {!isActionCompleted ? (
          <div className="pt-2">
            <button
              onClick={handleCompleteAction}
              className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-extrabold text-sm shadow-md cursor-pointer transition-transform hover:scale-103 flex items-center gap-2 mx-auto"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isAr ? 'تم التنفيذ الحسي في الغرفة! ✓' : 'Sensory Action Completed! ✓'}</span>
            </button>
          </div>
        ) : (
          /* Brain Chemistry Revelation */
          <div className="p-6 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent rounded-3xl border-2 border-amber-300 text-start space-y-4 max-w-xl mx-auto animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  {isAr ? 'كيف تغيرت كيمياء دماغك في هذه اللحظة؟' : 'Instant Neurochemical Shift:'}
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-amber-950 font-serif">
                  {isAr ? 'إثبات علمي وعصبي فوري 🧠' : 'Immediate Neurological Reset 🧠'}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans font-medium">
              {activeCard.brainChemistrySecret}
            </p>

            {/* Reflection Input */}
            <div className="space-y-2 pt-2 border-t border-amber-200">
              <label className="text-xs font-bold text-stone-800 block">
                {isAr ? 'ما الذي تغير في إحساس رأسك وصدرك الآن؟' : 'How does your chest & head feel?'}
              </label>
              <textarea
                rows={2}
                value={userReflection}
                onChange={(e) => setUserReflection(e.target.value)}
                placeholder={isAr ? 'شعرت بهدوء ونبضي أصبح أبطأ وأكثر راحة...' : 'A quick note on how it felt...'}
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 text-stone-800"
              />
              <div className="flex items-center justify-between pt-1">
                <button
                  disabled={isSaved}
                  onClick={handleSaveMoment}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
                </button>

                <button
                  onClick={() => handleSwitchCard((selectedCardIdx + 1) % SENSORY_CARDS.length)}
                  className="flex items-center gap-1 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <span>{isAr ? 'حاسة أخرى' : 'Next Sense'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
