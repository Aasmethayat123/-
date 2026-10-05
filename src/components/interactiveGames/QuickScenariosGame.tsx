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
  Users, 
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface QuickScenariosGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface ScenarioOption {
  id: string;
  text: string;
  personalityType: string;
  analysis: string;
}

interface InteractiveScenario {
  id: string;
  title: string;
  situation: string;
  icon: string;
  options: ScenarioOption[];
}

const SCENARIOS_LIST: InteractiveScenario[] = [
  {
    id: 's1',
    title: 'معضلة الأسانسير المعطل 🛗',
    situation: 'تخيلي أنكِ معلقة في أسانسير توقف فجأة بين طابقين في الظلام لمدة نصف ساعة، ولديكِ خيار أن تكوني مع إحدى هاتين الشخصيتين فقط:',
    icon: '🛗',
    options: [
      {
        id: 'opt1',
        text: 'شخص قلق جداً ويبكي لكنه يطلب أن تمسكي بيده ليطمئن',
        personalityType: 'النمط الحامي / المتعاطف (Protector)',
        analysis: 'تتحملين المسؤولية العاطفية وتحولين قلقك الخاص إلى رعاية للآخرين. هذا نبل كبير، لكن انتبهي ألا تستنزفي طاقتك في إنقاذ الجميع قبل نفسك.'
      },
      {
        id: 'opt2',
        text: 'شخص صامت وهادئ تماماً يقرأ في هاتفه ولا يتكلم معك نهائياً',
        personalityType: 'النمط المستقل / الذاتي (Autonomous)',
        analysis: 'تقدسين المساحة الشخصية والهدوء الداخلي عند الأزمات. لا تحبين الدراما الزائدة، وتفضلين تنظيم أفكارك بهدوء وترك مسافة أمان.'
      }
    ]
  },
  {
    id: 's2',
    title: 'الرسالة المجهولة والسر القديم ✉️',
    situation: 'وجدتي ظرفاً مغلقاً على بابك مكتوب عليه: «فيه سر حقيقي عنك لا يعرفه أحد سواك، لو فتحتيه ستفهمين لماذا تسير حياتك هكذا»:',
    icon: '✉️',
    options: [
      {
        id: 'opt1',
        text: 'أفتحه فوراً دون تردد.. الفضول ومعرفة الحقيقة يسبقان أي خوف',
        personalityType: 'المستكشف الشجاع (Truth-Seeker)',
        analysis: 'لديكِ شجاعة مواجهة الظلال والأسرار. لا ترضين بالغموض، وتفضلين الألم الصادق على الراحة الكاذبة.'
      },
      {
        id: 'opt2',
        text: 'أتجاهله أو أحرقه.. ماضٍ انتهى وأنا اليوم أصنع قصتي بيدي',
        personalityType: 'النمط العملي / حارس الحاضر (Present Anchor)',
        analysis: 'تتمسكين بزمام الحاضر والواقع العملي، ولا تسمحين للأشباح القديمة أن تعطل خطواتك الحالية.'
      }
    ]
  },
  {
    id: 's3',
    title: 'ساعة واحدة عبر الزمن ⏳',
    situation: 'أتيحت لكِ ساعة واحدة فقط لتجلسي فيها على مقعد في حديقة هادئة مع أحدهما:',
    icon: '⏳',
    options: [
      {
        id: 'opt1',
        text: 'نسختك من الماضي في سن الـ ١٥ لتعانقيها وتخبريها أن كل شيء سيكون بخير',
        personalityType: 'المداوي الداخلي (Inner Healer)',
        analysis: 'تحملين حنيناً عميقاً لإصلاح ما انكسر ومصالحة أجزائك القديمة. قلبك طيب ويسعى للسلام مع جذوره.'
      },
      {
        id: 'opt2',
        text: 'نسختك من المستقبل بعد ٢٠ سنة لتسأليها عن الأخطاء التي ينبغي تجنبها الآن',
        personalityType: 'المخطط البصير (Visionary Planner)',
        analysis: 'عقلك يحب الاستعداد وتأمين المستقبل وتقليل المخاطر. أنتِ تسعين دائماً لأفضل نتيجة بوعي وحكمة.'
      }
    ]
  }
];

export const QuickScenariosGame: React.FC<QuickScenariosGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [scenarioIndex, setScenarioIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const currentScenario = SCENARIOS_LIST[scenarioIndex];
  const chosenOption = currentScenario.options.find(o => o.id === selectedOptionId);

  const handleSelectOption = (optionId: string) => {
    soundManager.playPop();
    setSelectedOptionId(optionId);
    soundManager.playHarmonicAffirmation();
    if (onAddXP) onAddXP(30);
  };

  const handleNext = () => {
    soundManager.playSoftTap();
    if (scenarioIndex + 1 < SCENARIOS_LIST.length) {
      setScenarioIndex(scenarioIndex + 1);
      setSelectedOptionId(null);
      setUserReflection('');
      setIsSaved(false);
    } else {
      triggerConfetti(0.5, 0.4);
      soundManager.playLevelUpFanfare();
    }
  };

  const handleSaveMoment = () => {
    if (!chosenOption) return;

    saveMoment({
      gameId: 'scenarios-quick',
      gameTitle: isAr ? 'اختبار السيناريو السريع' : 'Interactive Scenario',
      quote: `${currentScenario.title}: ${chosenOption.text}`,
      reflection: userReflection || chosenOption.analysis,
      tag: isAr ? 'تحليل النمط الشخصي' : 'Personality Profile'
    });

    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
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
            {isAr ? 'اختبارات السيناريوهات السريعة 🎭' : 'Interactive Scenarios 🎭'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {scenarioIndex + 1} / {SCENARIOS_LIST.length}
        </span>
      </div>

      {/* Main Scenario Box */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <div className="space-y-2 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mx-auto shadow-inner">
            {currentScenario.icon}
          </div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
            {isAr ? 'موقف تخيلي سريع يكشف نمطك' : 'What would you choose?'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {currentScenario.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-serif">
            «{currentScenario.situation}»
          </p>
        </div>

        {/* The Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
          {currentScenario.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-5 rounded-3xl border-2 text-start transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 transform ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 shadow-md scale-102 ring-2 ring-amber-400/50'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-amber-300 text-stone-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-400'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <p className="text-xs sm:text-sm font-bold leading-relaxed">
                    {opt.text}
                  </p>
                </div>

                <span className="text-[10px] font-bold text-amber-800/80 uppercase tracking-wider block pt-2 border-t border-stone-200/60">
                  {isAr ? 'اضغطي لاختيار هذا النمط' : 'Choose option'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Revealed Psychological Analysis */}
        {chosenOption && (
          <div className="p-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl border-2 border-amber-300 text-start space-y-4 max-w-2xl mx-auto animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  {isAr ? 'تحليلك النفسي الدافئ:' : 'Psychological Pattern:'}
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-amber-950">
                  {chosenOption.personalityType}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
              {chosenOption.analysis}
            </p>

            {/* Reflection note input */}
            <div className="space-y-2 pt-2 border-t border-amber-200/60">
              <label className="text-xs font-bold text-stone-800 block">
                {isAr ? 'خاطرة سريعة: هل شعرتِ أن هذا التحليل يشبهك؟' : 'Does this resonate with you?'}
              </label>
              <textarea
                rows={2}
                value={userReflection}
                onChange={(e) => setUserReflection(e.target.value)}
                placeholder={isAr ? 'اكتبي ما فاجأك أو أكده هذا الموقف...' : 'A quick note on what this reveals...'}
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

                {scenarioIndex + 1 < SCENARIOS_LIST.length && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-transform hover:scale-102"
                  >
                    <span>{isAr ? 'السيناريو التالي' : 'Next Scenario'}</span>
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
