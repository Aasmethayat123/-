import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Scale, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Bookmark, 
  Plus, 
  Trash2, 
  HelpCircle,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

interface DecisionalScalesGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface WeightItem {
  id: string;
  text: string;
  weight: number; // 10, 20, 35
  category: 'safety' | 'growth';
}

interface DecisionScenario {
  id: string;
  titleAr: string;
  titleEn: string;
  dilemmaAr: string;
  dilemmaEn: string;
  leftPanLabelAr: string;
  leftPanLabelEn: string;
  rightPanLabelAr: string;
  rightPanLabelEn: string;
  presetWeights: WeightItem[];
  clinicalInsightAr: string;
  clinicalInsightEn: string;
  healingMantraAr: string;
  healingMantraEn: string;
}

const PRESET_SCENARIOS: DecisionScenario[] = [
  {
    id: 'say-no',
    titleAr: 'قول «لا» واعتذار شجاع',
    titleEn: 'Saying "No" with Courage',
    dilemmaAr: 'طُلب منك التزام إضافي يرهق طاقتك وصحتك، وأنت معتاد على إرضاء الجميع على حساب نفسك.',
    dilemmaEn: 'Asked for an exhausting extra commitment while used to pleasing others at your own expense.',
    leftPanLabelAr: 'كفة الأمان المؤقت (الموافقة المترددة)',
    leftPanLabelEn: 'Temporary Safety (Reluctant Yes)',
    rightPanLabelAr: 'كفة النمو الحقيقي (الاعتذار الصادق)',
    rightPanLabelEn: 'Real Growth (Courageous No)',
    presetWeights: [
      { id: 'w1', text: 'تجنب نظرة اللوم اللحظية', weight: 15, category: 'safety' },
      { id: 'w2', text: 'الهروب من شعور الذنب المؤقت', weight: 20, category: 'safety' },
      { id: 'w3', text: 'حماية طاقتي العصبية ونومي', weight: 35, category: 'growth' },
      { id: 'w4', text: 'ترسيخ احترامي لحدودي وقيمتي', weight: 30, category: 'growth' },
      { id: 'w5', text: 'منع تراكم الغضب المكبوت', weight: 25, category: 'growth' },
    ],
    clinicalInsightAr: '«نعم» المترددة تشتري راحة خمس دقائق للآخرين وتبيع خمسة أسابيع من صحتك النفسية. الرفض المهذب ليس أنانية بل حماية لقدرتك على العطاء الحقيقي.',
    clinicalInsightEn: 'A reluctant "Yes" buys 5 minutes of relief for others at the cost of weeks of your inner peace. Healthy boundaries protect true capacity to give.',
    healingMantraAr: '«أعتذر بابتسامة وهدوء، فكرامتي وراحتي أولى بالرعاية».',
    healingMantraEn: 'I decline with warmth and peace; my inner wellbeing deserves care.'
  },
  {
    id: 'confrontation',
    titleAr: 'المصارحة بدل الكتمان المرير',
    titleEn: 'Honest Clarification vs Silence',
    dilemmaAr: 'تصرف مؤذٍ تكرر من شخص قريب، وتتردد بين بلع الغصة أو فتح حوار صريح وهادئ.',
    dilemmaEn: 'Repeated hurtful behavior from someone close; torn between bottled silence and open dialogue.',
    leftPanLabelAr: 'كفة الصمت المريح ظاهرياً',
    leftPanLabelEn: 'Apparent Silence & Avoidance',
    rightPanLabelAr: 'كفة المصارحة والنضج المشترك',
    rightPanLabelEn: 'Honest Dialogue & Mature Clarity',
    presetWeights: [
      { id: 'c1', text: 'تجنب توتر المواجهة الآن', weight: 15, category: 'safety' },
      { id: 'c2', text: 'الخوف من رد فعل الطرف الآخر', weight: 25, category: 'safety' },
      { id: 'c3', text: 'تنظيف العلاقة من السموم الخفية', weight: 35, category: 'growth' },
      { id: 'c4', text: 'إعطاء فرصة حقيقية للتصحيح', weight: 25, category: 'growth' },
      { id: 'c5', text: 'التوقف عن استنزاف أفكاري ليلاً', weight: 30, category: 'growth' },
    ],
    clinicalInsightAr: 'الصمت عن الخطأ لا يحافظ على العلاقة، بل يبني سداً غير مرئي من الاستياء المتراكم حتى ينفجر فجأة. المصارحة الهادئة هي عملية جراحية تنقذ الرابط الإنساني.',
    clinicalInsightEn: 'Silence does not save relationships; it builds hidden resentment. Clear and gentle confrontation is life-saving medicine for connection.',
    healingMantraAr: '«أتحدث بصدق ولطف لأصلح ما بيننا، لا لأنتصر».',
    healingMantraEn: 'I speak with truth and kindness to repair, not to defeat.'
  },
  {
    id: 'career-change',
    titleAr: 'الخطوة الجديدة وكسر منطقة الراحة',
    titleEn: 'Stepping Beyond Comfort Zone',
    dilemmaAr: 'فرصة للتعلم أو بدء خطوة كنت تؤجلها خوفاً من الفشل أو نقص الاستعداد التام.',
    dilemmaEn: 'An opportunity to grow or start something you delayed out of fear of failure or perfectionism.',
    leftPanLabelAr: 'كفة البقاء في المألوف',
    leftPanLabelEn: 'Staying in the Known Rut',
    rightPanLabelAr: 'كفة المبادرة والتجربة',
    rightPanLabelEn: 'Initiative & Bold Learning',
    presetWeights: [
      { id: 'p1', text: 'الأمان المضمون بدون مخاطرة', weight: 20, category: 'safety' },
      { id: 'p2', text: 'عدم مواجهة قلق البدايات', weight: 20, category: 'safety' },
      { id: 'p3', text: 'اكتشاف قدرات دفينة في نفسي', weight: 35, category: 'growth' },
      { id: 'p4', text: 'التحرر من حسرة «ماذا لو حاولت؟»', weight: 35, category: 'growth' },
      { id: 'p5', text: 'توسيع آفاق حياتي وثقتي الذاتية', weight: 30, category: 'growth' },
    ],
    clinicalInsightAr: 'أكبر وهم نصدقه هو أن البقاء في منطقة الراحة لا ثمن له. تكلفة الركود هي ضياع سنوات من الشغف والنمو. الشجاعة ليست غياب الخوف، بل التحرك برغم وجوده.',
    clinicalInsightEn: 'Staying in comfort zones carries a heavy silent cost: stagnant vitality. Courage is moving forward while fear is present.',
    healingMantraAr: '«أخطو خطوة اليوم، فالتعلم بالممارسة أعظم من الانتظار المثالي».',
    healingMantraEn: 'I take a step today; imperfect action beats eternal hesitation.'
  }
];

export const DecisionalScalesGame: React.FC<DecisionalScalesGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const [scenarioIndex, setScenarioIndex] = useState<number>(0);
  const currentScenario = PRESET_SCENARIOS[scenarioIndex];

  const [activeWeights, setActiveWeights] = useState<WeightItem[]>(currentScenario.presetWeights);
  const [customText, setCustomText] = useState<string>('');
  const [customWeightVal, setCustomWeightVal] = useState<number>(20);
  const [customCategory, setCustomCategory] = useState<'safety' | 'growth'>('growth');
  
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showHowTo, setShowHowTo] = useState<boolean>(false);

  // Compute total weights for both pans
  const safetyWeight = activeWeights
    .filter(w => w.category === 'safety')
    .reduce((sum, w) => sum + w.weight, 0);

  const growthWeight = activeWeights
    .filter(w => w.category === 'growth')
    .reduce((sum, w) => sum + w.weight, 0);

  // Tilt angle between -22 and +22 degrees
  const diff = growthWeight - safetyWeight;
  const tiltAngle = Math.max(-20, Math.min(20, diff * 0.45));

  const handleSelectScenario = (idx: number) => {
    soundManager.playSoftTap();
    setScenarioIndex(idx);
    setActiveWeights(PRESET_SCENARIOS[idx].presetWeights);
    setIsAnalyzed(false);
    setIsSaved(false);
  };

  const handleToggleWeight = (id: string) => {
    soundManager.playScaleTilt();
    setActiveWeights(prev => prev.filter(w => w.id !== id));
  };

  const handleAddCustomWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    soundManager.playStonePlop();
    const newItem: WeightItem = {
      id: `custom_${Date.now()}`,
      text: customText.trim(),
      weight: customWeightVal,
      category: customCategory
    };
    setActiveWeights(prev => [...prev, newItem]);
    setCustomText('');
  };

  const handleAnalyze = () => {
    soundManager.playSuccess();
    triggerConfetti();
    if (onAddXP) {
      onAddXP(35);
    }
    setIsAnalyzed(true);
  };

  const handleSaveMoment = () => {
    if (isSaved) return;
    soundManager.playCoinSound();
    saveMoment({
      gameId: 'decisional-balance',
      gameTitle: isAr ? 'ميزان الأفكار والقرارات' : 'Decisional Scales',
      quote: isAr ? currentScenario.healingMantraAr : currentScenario.healingMantraEn,
      reflection: isAr 
        ? `وزنت أفكاري في موقف «${currentScenario.titleAr}». ثقل النمو: ${growthWeight}، وثقل الأمان الوهمي: ${safetyWeight}. ${currentScenario.clinicalInsightAr}`
        : `Balanced options in "${currentScenario.titleEn}". Growth weight: ${growthWeight}, Comfort weight: ${safetyWeight}.`,
      tag: isAr ? 'قرارات واعية' : 'Decisions'
    });
    setIsSaved(true);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setActiveWeights(currentScenario.presetWeights);
    setIsAnalyzed(false);
    setIsSaved(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              {isAr ? 'ميزان الأفكار والقرارات' : 'Decisional Balance Scales'}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold">
                CBT
              </span>
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isAr ? 'وزّن عواقب اختياراتك بحياد عقلاني لكسر شلل التردد والأمان الوهمي' : 'Weigh psychological options neutrally to break hesitation and illusion of safety'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHowTo(!showHowTo)}
            className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            title={isAr ? 'كيف ألعب؟' : 'How to play'}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              <span>{isAr ? 'العودة للمكتبة' : 'Back to Library'}</span>
            </button>
          )}
        </div>
      </div>

      {/* How to Play Help Drawer */}
      {showHowTo && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-2 animate-fade-in">
          <h4 className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {isAr ? 'القاعدة العلمية للميزان المعرفي:' : 'Scientific Basis:'}
          </h4>
          <p className="leading-relaxed">
            {isAr 
              ? 'عندما نتردد، نبالغ لاإرادياً في تقدير «ألم المواجهة المؤقت»، ونتجاهل تماماً «التكلفة الباهظة للاستسلام الطويل». هذا الميزان يضع الأثقال الحقيقية أمام عينيك بالفيزياء المعرفية ليتحرك مؤشر الحقيقة بوضوح.'
              : 'Hesitation exaggerates short-term friction while concealing long-term decay. This scale gives physical weight to cognitive truths so you act with clarity.'}
          </p>
        </div>
      )}

      {/* Scenario Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {PRESET_SCENARIOS.map((sc, idx) => (
          <button
            key={sc.id}
            onClick={() => handleSelectScenario(idx)}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              scenarioIndex === idx
                ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-md scale-102'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-amber-400'
            }`}
          >
            <span>{idx === 0 ? '🛡️' : idx === 1 ? '🗣️' : '🚀'}</span>
            <span>{isAr ? sc.titleAr : sc.titleEn}</span>
          </button>
        ))}
      </div>

      {/* Dilemma Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-100 to-amber-50 dark:from-stone-900 dark:to-stone-850 border border-stone-200 dark:border-stone-800">
        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1">
          {isAr ? 'الموقف النفسي الراهن:' : 'Current Dilemma:'}
        </span>
        <p className="text-sm sm:text-base font-semibold text-stone-800 dark:text-stone-200 leading-relaxed">
          {isAr ? currentScenario.dilemmaAr : currentScenario.dilemmaEn}
        </p>
      </div>

      {/* Physical Interactive Balance Scale Render */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
        {/* Scale Top Pivot & Beam */}
        <div className="relative flex flex-col items-center pt-2">
          {/* Fulcrum indicator */}
          <div className="w-10 h-10 rounded-full bg-stone-800 dark:bg-stone-700 text-amber-400 flex items-center justify-center font-bold text-xs shadow-md z-10 border-2 border-amber-400">
            ⚖️
          </div>
          {/* Fulcrum support stand */}
          <div className="w-3 h-20 bg-stone-400 dark:bg-stone-600 rounded-t-sm shadow-inner -mt-1" />
          <div className="w-32 h-3.5 bg-stone-700 dark:bg-stone-600 rounded-full -mt-0.5 shadow-sm" />

          {/* Rotating Beam with dynamic CSS transform */}
          <div 
            className="absolute top-4 w-full max-w-lg h-3 bg-gradient-to-r from-stone-400 via-amber-500 to-stone-400 dark:from-stone-600 dark:via-amber-400 dark:to-stone-600 rounded-full transition-transform duration-500 ease-out origin-center flex justify-between items-center px-4 shadow-sm"
            style={{ transform: `rotate(${tiltAngle}deg)` }}
          >
            {/* Left suspension hook */}
            <div className="w-2.5 h-2.5 rounded-full bg-stone-900 dark:bg-white ring-2 ring-stone-400" />
            {/* Right suspension hook */}
            <div className="w-2.5 h-2.5 rounded-full bg-stone-900 dark:bg-white ring-2 ring-stone-400" />
          </div>
        </div>

        {/* Both Scale Pans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* LEFT PAN: Safety / Avoidance */}
          <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            safetyWeight > growthWeight 
              ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 shadow-md ring-2 ring-rose-400/20'
              : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <span>🛑</span>
                  {isAr ? currentScenario.leftPanLabelAr : currentScenario.leftPanLabelEn}
                </h3>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {isAr ? 'الأمان المؤقت وتجنب الألم اللحظي' : 'Short-term comfort & avoidance'}
                </span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 font-mono font-black text-sm">
                {safetyWeight} {isAr ? 'ثقل' : 'pts'}
              </div>
            </div>

            <div className="space-y-2 mt-4 min-h-[140px]">
              {activeWeights.filter(w => w.category === 'safety').length === 0 ? (
                <div className="text-center py-8 text-xs text-stone-400">
                  {isAr ? 'كفة فارغة.. تم التحرر من هذا الثقل!' : 'Empty pan! Released this weight.'}
                </div>
              ) : (
                activeWeights
                  .filter(w => w.category === 'safety')
                  .map((w) => (
                    <div 
                      key={w.id}
                      className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 flex items-center justify-between gap-2 shadow-2xs group hover:border-rose-400 transition"
                    >
                      <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                        {w.text}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-750 text-stone-600 dark:text-stone-400 font-mono font-bold">
                          +{w.weight}
                        </span>
                        <button
                          onClick={() => handleToggleWeight(w.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                          title={isAr ? 'إزالة هذا الثقل' : 'Remove weight'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* RIGHT PAN: Growth / Real Value */}
          <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            growthWeight >= safetyWeight 
              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-md ring-2 ring-emerald-400/20'
              : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <span>🌱</span>
                  {isAr ? currentScenario.rightPanLabelAr : currentScenario.rightPanLabelEn}
                </h3>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {isAr ? 'النمو الحقيقي والراحة طويلة المدى' : 'True growth & long-term peace'}
                </span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-mono font-black text-sm">
                {growthWeight} {isAr ? 'ثقل' : 'pts'}
              </div>
            </div>

            <div className="space-y-2 mt-4 min-h-[140px]">
              {activeWeights.filter(w => w.category === 'growth').length === 0 ? (
                <div className="text-center py-8 text-xs text-stone-400">
                  {isAr ? 'أضف أسباباً وأهدافاً تدعم شجاعتك' : 'Add reasons supporting your courage'}
                </div>
              ) : (
                activeWeights
                  .filter(w => w.category === 'growth')
                  .map((w) => (
                    <div 
                      key={w.id}
                      className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 flex items-center justify-between gap-2 shadow-2xs group hover:border-emerald-400 transition"
                    >
                      <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                        {w.text}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-750 text-stone-600 dark:text-stone-400 font-mono font-bold">
                          +{w.weight}
                        </span>
                        <button
                          onClick={() => handleToggleWeight(w.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                          title={isAr ? 'إزالة هذا الثقل' : 'Remove weight'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Add Custom Thought / Weight form */}
        <form onSubmit={handleAddCustomWeight} className="p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-500" />
              {isAr ? 'أضف فكرة أو شعوراً شخصياً إلى الميزان:' : 'Add a personal thought to the scale:'}
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setCustomCategory('safety')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition ${
                  customCategory === 'safety'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                {isAr ? 'كفة التردد' : 'Safety Pan'}
              </button>
              <button
                type="button"
                onClick={() => setCustomCategory('growth')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition ${
                  customCategory === 'growth'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                {isAr ? 'كفة النمو' : 'Growth Pan'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={isAr ? 'مثال: سأشعر بالحرية وأتخلص من الصداع الملازم لي..' : 'e.g. I will gain true clarity and peace..'}
              className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="flex items-center gap-2">
              <select
                value={customWeightVal}
                onChange={(e) => setCustomWeightVal(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-200 cursor-pointer"
              >
                <option value={10}>{isAr ? 'خفيف (+10)' : 'Light (+10)'}</option>
                <option value={20}>{isAr ? 'متوسط (+20)' : 'Medium (+20)'}</option>
                <option value={35}>{isAr ? 'ثقيل (+35)' : 'Heavy (+35)'}</option>
              </select>
              <button
                type="submit"
                disabled={!customText.trim()}
                className="px-4 py-2 bg-stone-900 dark:bg-amber-600 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-40 cursor-pointer"
              >
                {isAr ? 'وضع في الميزان' : 'Add to Scale'}
              </button>
            </div>
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة ضبط الميزان' : 'Reset Scale'}</span>
          </button>

          <button
            onClick={handleAnalyze}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white rounded-2xl text-sm font-black shadow-lg transition-transform hover:scale-103 flex items-center gap-2 cursor-pointer"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{isAr ? 'تحليل الميزان واستخلاص البصيرة (+35 XP)' : 'Analyze Balance & Reveal Insight (+35 XP)'}</span>
          </button>
        </div>
      </div>

      {/* Clinical Revelation & Notebook Save Modal/Card */}
      {isAnalyzed && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-stone-900 to-stone-950 text-white border-2 border-indigo-500/50 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-indigo-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center font-black shadow-md">
                💡
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  {isAr ? 'البصيرة المعرفية العميقة' : 'Clinical Cognitive Insight'}
                </h3>
                <p className="text-xs text-indigo-200">
                  {isAr ? 'ماذا يقول ميزانك بعد فرز الأوهام عن الحقائق؟' : 'What your scale reveals after clearing illusion'}
                </p>
              </div>
            </div>

            <div className="px-3 py-1 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {growthWeight >= safetyWeight 
                  ? (isAr ? 'رجحت كفة النمو الشجاع!' : 'Growth Pan Triumphed!')
                  : (isAr ? 'كفة الخوف أثقل.. تحتاج لدعم كفة النمو' : 'Safety Pan Heavy.. reinforce growth!')}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
              {isAr ? currentScenario.clinicalInsightAr : currentScenario.clinicalInsightEn}
            </p>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-xs text-amber-300 font-bold block mb-1">
                {isAr ? 'الجملة الشافية لليوم (تعويذة القرار):' : 'Healing Mantra:'}
              </span>
              <p className="text-base sm:text-lg font-bold text-white tracking-wide">
                {isAr ? currentScenario.healingMantraAr : currentScenario.healingMantraEn}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-indigo-300 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isAr ? 'تمت إضافة ٣٥ نقطة وعي لحسابك' : '+35 Awareness XP recorded'}
            </span>

            <button
              onClick={handleSaveMoment}
              disabled={isSaved}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-emerald-600/60 text-white cursor-default'
                  : 'bg-white text-stone-900 hover:bg-stone-100 shadow-md hover:scale-102'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>
                {isSaved 
                  ? (isAr ? 'محفوظ في دفتر رحلتي ✓' : 'Saved in Journey ✓')
                  : (isAr ? 'حفظ التجربة في دفتر رحلتي' : 'Save to Journey Notebook')}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DecisionalScalesGame;
