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
  Palette,
  CheckCircle2,
  Heart
} from 'lucide-react';

interface VisualProjectionGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface ProjectionSymbol {
  id: string;
  artVisual: string;
  visualTitle: string;
  firstImpressionOptions: {
    label: string;
    subconsciousMeaning: string;
    psychologicalMirror: string;
  }[];
}

const PROJECTION_ITEMS: ProjectionSymbol[] = [
  {
    id: 'proj1',
    artVisual: '⛵🌊🌌',
    visualTitle: 'قارب صغير تحت سماء ليلية مليئة بالنجوم',
    firstImpressionOptions: [
      {
        label: 'رأيتُ أولاً: هدوء النجوم وجمال السماء الواسعة',
        subconsciousMeaning: 'البحث عن السكينة والجمال (Aesthetic Seeking)',
        psychologicalMirror: 'عقلك الباطن يبحث عن الهدوء والانسحاب المؤقت من الضوضاء. أنتِ في فترة تحتاجين فيها لمساحة صمت وتأمل دون مطالبات من أحد.'
      },
      {
        label: 'رأيتُ أولاً: وحدة القارب الصغير في البحر العارم',
        subconsciousMeaning: 'الشعور بالمسؤولية المنفردة (Solitary Weight)',
        psychologicalMirror: 'تشعرين في أعماقك أنكِ تبحرين وحدك في مشاكلك وأن لا أحد يفهم تماماً حجم ما تمرين به. تذكري أن القوارب صُممت لتطفو، وأن طلب المساعدة شجاعة.'
      },
      {
        label: 'رأيتُ أولاً: أمواج البحر والرياح المحركة للقارب',
        subconsciousMeaning: 'الرغبة في الانطلاق والتغيير (Dynamic Movement)',
        psychologicalMirror: 'طاقتك الداخلية جاهزة لمغامرة أو مرحلة جديدة، وتنتظرين الإشارة لتبدأي. لا تخافي من الحركة؛ الأمواج في صالحك.'
      }
    ]
  },
  {
    id: 'proj2',
    artVisual: '🌳🍃🌤️',
    visualTitle: 'شجرة باسقة تهتز أوراقها مع نسيم دافئ',
    firstImpressionOptions: [
      {
        label: 'رأيتُ أولاً: الجذور الراسخة الثابتة في الأرض',
        subconsciousMeaning: 'الحاجة للأمان والاستقرار (Anchoring Need)',
        psychologicalMirror: 'تبحثين عن أرضية صلبة تقفين عليها. التغييرات المتسارعة من حولك تجعلك تتمنين وجود روتين يومي آمن ومطمئن.'
      },
      {
        label: 'رأيتُ أولاً: الأوراق الخضراء التي تتراقص مع الهواء',
        subconsciousMeaning: 'المرونة والتأقلم العفوي (Adaptive Grace)',
        psychologicalMirror: 'لديكِ قدرة فطرية على امتصاص الصدمات دون أن تنكسري. أنتِ تميلين مع العاصفة بمرونة وتعرفين كيف تعودين للاستقامة مجدداً.'
      }
    ]
  }
];

export const VisualProjectionGame: React.FC<VisualProjectionGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const currentItem = PROJECTION_ITEMS[currentIndex];
  const chosenInterpretation = selectedIndex !== null ? currentItem.firstImpressionOptions[selectedIndex] : null;

  const handleSelectOption = (idx: number) => {
    soundManager.playPop();
    setSelectedIndex(idx);
    soundManager.playHarmonicAffirmation();
    if (onAddXP) onAddXP(30);
  };

  const handleSaveMoment = () => {
    if (!chosenInterpretation) return;

    saveMoment({
      gameId: 'visual-projection',
      gameTitle: isAr ? 'إسقاط المشاعر البصري' : 'Visual Projection',
      quote: `${currentItem.visualTitle}: ${chosenInterpretation.label}`,
      reflection: userReflection || chosenInterpretation.psychologicalMirror,
      tag: isAr ? 'إسقاط لاواعي' : 'Subconscious Projection'
    });

    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (currentIndex + 1 < PROJECTION_ITEMS.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedIndex(null);
      setUserReflection('');
      setIsSaved(false);
    } else {
      triggerConfetti(0.5, 0.4);
      soundManager.playLevelUpFanfare();
    }
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
            {isAr ? 'لعبة: إسقاط المشاعر البصري 🎨' : 'Visual Projection 🎨'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {currentIndex + 1} / {PROJECTION_ITEMS.length}
        </span>
      </div>

      <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
            {isAr ? 'ما تراه عيناكِ أولاً يكشف ما في قلبك' : 'What your eyes catch first'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {currentItem.visualTitle}
          </h2>
          <p className="text-xs text-stone-500">
            {isAr ? 'تأملي المشهد الرمزي بالأسفل؛ ما أول تفصيل لفت انتباهك وشعرتِ به؟' : 'Look at the symbolic scene below; what did you notice first?'}
          </p>
        </div>

        {/* Visual Showcase Card */}
        <div className="py-10 px-6 rounded-3xl bg-gradient-to-tr from-stone-950 via-teal-950 to-stone-900 border-2 border-teal-500/40 text-center space-y-3 shadow-inner">
          <div className="text-6xl sm:text-7xl filter drop-shadow-lg animate-gentle-float">
            {currentItem.artVisual}
          </div>
          <p className="text-xs text-teal-200 font-medium font-serif italic">
            «{currentItem.visualTitle}»
          </p>
        </div>

        {/* Options: What did you see first? */}
        <div className="space-y-3 max-w-xl mx-auto pt-2">
          {currentItem.firstImpressionOptions.map((opt, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-start transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm font-bold ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 text-teal-950 shadow-xs ring-2 ring-teal-400/40'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                ) : (
                  <Eye className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Revealed Subconscious Interpretation */}
        {chosenInterpretation && (
          <div className="p-6 bg-emerald-50/80 rounded-3xl border-2 border-emerald-300 text-start space-y-4 max-w-xl mx-auto animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  {isAr ? 'مرآة اللاوعي:' : 'Subconscious Mirror:'}
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-emerald-950">
                  {chosenInterpretation.subconsciousMeaning}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
              {chosenInterpretation.psychologicalMirror}
            </p>

            {/* Reflection note input */}
            <div className="space-y-2 pt-2 border-t border-emerald-200">
              <label className="text-xs font-bold text-stone-800 block">
                {isAr ? 'خاطرة سريعة في دفتر رحلتك:' : 'Save a quick insight to your diary:'}
              </label>
              <textarea
                rows={2}
                value={userReflection}
                onChange={(e) => setUserReflection(e.target.value)}
                placeholder={isAr ? 'ما الذي أضاء في داخلك بعد قراءة هذا الإسقاط؟...' : 'Your takeaway...'}
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 text-stone-800"
              />
              <div className="flex items-center justify-between pt-1">
                <button
                  disabled={isSaved}
                  onClick={handleSaveMoment}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
                </button>

                {currentIndex + 1 < PROJECTION_ITEMS.length && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <span>{isAr ? 'المشهد التالي' : 'Next Scene'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
