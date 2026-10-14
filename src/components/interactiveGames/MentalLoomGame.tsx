import React, { useState } from 'react';
import { 
  ArrowRight, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Bookmark, 
  RotateCcw, 
  Heart, 
  Sun, 
  Anchor, 
  Compass,
  Download,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { recordStreakActivity } from '../../utils/streakManager';

interface MentalLoomGameProps {
  language: Language;
  onBackToMap: () => void;
  onAddXP?: (amount: number) => void;
}

type ThreadCategory = 'sensory' | 'memory' | 'mantra' | 'sanctuary';

interface SafetySpool {
  id: ThreadCategory;
  nameAr: string;
  nameEn: string;
  color: string;
  stroke: string;
  bgGrad: string;
  icon: string;
  itemsAr: string[];
  itemsEn: string[];
}

const SPOOLS: SafetySpool[] = [
  {
    id: 'sensory',
    nameAr: 'خيط الأمان الحسي والجسدي',
    nameEn: 'Sensory Body Anchors',
    color: 'emerald',
    stroke: '#10b981',
    bgGrad: 'from-emerald-500 to-teal-600',
    icon: '🌿',
    itemsAr: [
      'ملامسة الأرض بكعبين ثابتين واستشعار الثقل',
      'كوب شاي دافئ يحيط بكفوف اليدين',
      'غسل الوجه بماء بارد منعش يعيد الانتباه',
      'التفاف في بطانية ناعمة وتخفيف الإضاءة'
    ],
    itemsEn: [
      'Grounding feet flat on floor feeling the stable earth',
      'Warm mug held gently in both palms',
      'Splashing refreshing cool water on face',
      'Wrapping in a soft blanket with softened lights'
    ]
  },
  {
    id: 'memory',
    nameAr: 'خيط الذكريات المضيئة',
    nameEn: 'Luminous Memories',
    color: 'amber',
    stroke: '#f59e0b',
    bgGrad: 'from-amber-400 to-orange-500',
    icon: '✨',
    itemsAr: [
      'لحظة انتصار صامتة تجاوزت فيها ما ظننته مستحيلاً',
      'ضحكة صافية من القلب مع صديق مخلص',
      'نظرة فخر ومحبة تلقيتها دون أي شروط',
      'يوم استيقظت فيه وشعرت بخفة غير متوقعة'
    ],
    itemsEn: [
      'A silent victory where you endured what felt impossible',
      'Uncontrollable hearty laughter with a trusted friend',
      'An unconditional look of love and appreciation',
      'A morning you woke up feeling unexpectedly light'
    ]
  },
  {
    id: 'mantra',
    nameAr: 'خيط الكلمات الراسخة',
    nameEn: 'Grounding Truths',
    color: 'sky',
    stroke: '#0ea5e9',
    bgGrad: 'from-sky-400 to-blue-600',
    icon: '🌊',
    itemsAr: [
      '«أنا هنا والآن في أمان، وهذا الشعور سينقشع كالسحاب»',
      '«لست مضطراً لحل كل شيء اليوم، خطوة واحدة تكفي»',
      '«جسدي يتعافى بهدوء وعقلي يتعلم كيف يهدأ»',
      '«قيمتي ثابتة ولا تتأثر بنظرات أو تقييمات الآخرين»'
    ],
    itemsEn: [
      '“I am safe here and now, and this feeling will pass like clouds”',
      '“I don’t have to solve everything today; one step suffices”',
      '“My body is recovering and my mind is learning stillness”',
      '“My self-worth is invariant and unbent by outside opinions”'
    ]
  },
  {
    id: 'sanctuary',
    nameAr: 'خيط الملاذ الآمن',
    nameEn: 'Inner Sanctuary',
    color: 'purple',
    stroke: '#8b5cf6',
    bgGrad: 'from-purple-500 to-indigo-600',
    icon: '🪷',
    itemsAr: [
      'شاطئ بحر هادئ في ساعات الصباح الأولى وصوت النوارس',
      'شرفة دافئة مع نسيم فجر عذب وصمت مريح',
      'ظل شجرة وارفة يتسلل من بين أوراقها شعاع شمس لطيف',
      'ركنك المفضل في البيت محاطاً بالهدوء'
    ],
    itemsEn: [
      'Quiet morning sea with gentle waves and sea breeze',
      'Warm balcony at dawn with soothing silence',
      'Basking beneath a canopy of green leaves and dappled sunlight',
      'Your favorite cozy corner surrounded by peaceful stillness'
    ]
  }
];

export const MentalLoomGame: React.FC<MentalLoomGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  
  // Woven threads state: each spool can be selected
  const [selectedSpool, setSelectedSpool] = useState<ThreadCategory>('sensory');
  const [wovenItems, setWovenItems] = useState<{ category: ThreadCategory; text: string; color: string }[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const currentSpool = SPOOLS.find(s => s.id === selectedSpool)!;

  const handleWeaveItem = (text: string) => {
    if (wovenItems.some(item => item.text === text)) return;
    
    // Play plucked string sound!
    const noteIdx = wovenItems.length;
    soundManager.playLoomString(noteIdx);

    const newItems = [...wovenItems, { category: selectedSpool, text, color: currentSpool.stroke }];
    setWovenItems(newItems);

    if (newItems.length >= 4 && !completed) {
      setCompleted(true);
      recordStreakActivity('mental_loom');
      if (onAddXP) onAddXP(40);
    }
  };

  const handleResetLoom = () => {
    soundManager.playSoftTap();
    setWovenItems([]);
    setCompleted(false);
  };

  const handleSaveToMoments = () => {
    soundManager.playChime();
    const summaryReflection = wovenItems.map(item => `• ${item.text}`).join('\n');
    saveMoment({
      gameId: 'mental-loom',
      gameTitle: isAr ? 'نول الحياكة الذهنية: شبكة الأمان النفسي' : 'The Mental Loom',
      quote: isAr ? `نسيج أمان مكون من ${wovenItems.length} خيوط واعية` : `Safety Tapestry with ${wovenItems.length} woven anchors`,
      reflection: summaryReflection,
      tag: isAr ? 'شبكة الأمان النفسي' : 'Safety Tapestry'
    });
    setIsSaved(true);
    if (onAddXP) onAddXP(20);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
                {isAr ? 'نول الحياكة الذهنية: شبكة الأمان 🧵' : 'The Mental Loom 🧵'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                {isAr ? 'الترسيخ البوليفيجال (Polyvagal)' : 'Somatic Anchoring'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr 
                ? 'انسج خيوط أمانك الحسي والوجداني لتصنع سجادة أمان داخلية ترتكز عليها حين تعصف الأفكار.' 
                : 'Weave sensory and emotional threads into an inner safety tapestry to anchor your nervous system.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {wovenItems.length > 0 && (
            <button
              onClick={handleResetLoom}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title={isAr ? 'إعادة نسج النول' : 'Reset Loom'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleSaveToMoments}
            disabled={isSaved || wovenItems.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : wovenItems.length > 0
                ? 'bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
            }`}
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? (isAr ? 'تم الحفظ 🌿' : 'Saved 🌿') : (isAr ? 'حفظ شبكة الأمان' : 'Save Tapestry')}</span>
          </button>
        </div>
      </div>

      {/* Loom Canvas & Visual Tapestry */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-gradient-to-b from-stone-900 via-stone-925 to-stone-950 p-6 sm:p-8 text-white shadow-xl">
        {/* Loom Wooden Frame Top & Bottom Bars */}
        <div className="w-full h-3 rounded-full bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 shadow-md mb-4 flex justify-between px-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/80 -mt-0.5 shadow-xs" />
          ))}
        </div>

        {/* The Weaving Interactive Grid */}
        <div className="relative h-60 w-full rounded-2xl bg-black/40 border border-stone-800/80 flex items-center justify-center overflow-hidden">
          {/* Vertical Warp Threads */}
          <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-30">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-px h-full bg-stone-500 dashed" />
            ))}
          </div>

          {/* Render Woven Threads */}
          {wovenItems.length === 0 ? (
            <div className="text-center p-6 space-y-2 z-10">
              <Layers className="w-8 h-8 text-stone-600 mx-auto animate-pulse" />
              <p className="text-xs text-stone-400 font-medium">
                {isAr ? 'النول بانتظار خيوطك الأولى! اختر من البكرات أدناه لإضافة خيوط الأمان' : 'The loom awaits your threads! Select safety anchors below to begin weaving.'}
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col justify-around py-3 px-4 z-10">
              {wovenItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-2 rounded-xl backdrop-blur-md border animate-fade-in transition-all"
                  style={{
                    backgroundColor: `${item.color}15`,
                    borderColor: `${item.color}60`
                  }}
                >
                  <span 
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-bold text-white truncate font-serif">
                    {item.text}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 ms-auto shrink-0">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tapestry Completion Ring & Badge */}
          {completed && (
            <div className="absolute top-3 end-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-lg animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? 'شبكة الأمان مكتملة ومتماسكة! 🌿' : 'Safety Net Woven & Ready!'}</span>
            </div>
          )}
        </div>

        {/* Loom Wooden Frame Bottom */}
        <div className="w-full h-3 rounded-full bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 shadow-md mt-4 flex justify-between px-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/80 -mt-0.5 shadow-xs" />
          ))}
        </div>

        {/* Weft Status Bar */}
        <div className="flex items-center justify-between text-xs text-stone-400 mt-4">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? `كثافة النسيج: ${wovenItems.length} من ٤ خيوط أساسية` : `Tapestry Density: ${wovenItems.length}/4 basic anchors`}</span>
          </span>
          <span className="font-mono text-amber-400 font-bold">
            {Math.min(100, Math.round((wovenItems.length / 4) * 100))}%
          </span>
        </div>
      </div>

      {/* 4 Spool Categories Tabs */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
          {isAr ? 'اختر بكرة الأمان لإضافة خيوطها إلى نولك:' : 'Select a Safety Spool to add its anchors to your loom:'}
        </span>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SPOOLS.map((spool) => {
            const isSelected = selectedSpool === spool.id;
            const countForSpool = wovenItems.filter(item => item.category === spool.id).length;
            return (
              <button
                key={spool.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setSelectedSpool(spool.id);
                }}
                className={`p-3 rounded-2xl border transition-all text-start cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-stone-900 dark:bg-emerald-700 text-white border-transparent shadow-md scale-102'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base">{spool.icon}</span>
                  {countForSpool > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white font-mono">
                      ✓ {countForSpool}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold">{isAr ? spool.nameAr : spool.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Anchors for Selected Spool */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{currentSpool.icon}</span>
          <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200">
            {isAr ? `انقر لنسج خيط من «${currentSpool.nameAr}» في نولك:` : `Tap to weave an anchor from "${currentSpool.nameEn}":`}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(isAr ? currentSpool.itemsAr : currentSpool.itemsEn).map((itemText, i) => {
            const isAlreadyWoven = wovenItems.some(item => item.text === itemText);
            return (
              <button
                key={i}
                onClick={() => handleWeaveItem(itemText)}
                disabled={isAlreadyWoven}
                className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isAlreadyWoven
                    ? 'bg-stone-100 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-60 cursor-default'
                    : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200/90 dark:border-stone-700 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-stone-750'
                }`}
              >
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 leading-snug">
                  {itemText}
                </span>
                <span className={`px-2 py-1 rounded-xl text-[10px] font-bold shrink-0 ${
                  isAlreadyWoven ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}>
                  {isAlreadyWoven ? (isAr ? 'منسوج ✓' : 'Woven ✓') : (isAr ? '+ نسج' : '+ Weave')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
