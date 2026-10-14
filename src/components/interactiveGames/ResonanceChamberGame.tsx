import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Radio, 
  Smile, 
  Waves, 
  Heart, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  Bookmark, 
  Sliders, 
  ShieldCheck, 
  CheckCircle2,
  Mic,
  Disc3
} from 'lucide-react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { recordStreakActivity } from '../../utils/streakManager';

interface ResonanceChamberGameProps {
  language: Language;
  onBackToMap: () => void;
  onAddXP?: (amount: number) => void;
}

type FilterType = 'cartoon' | 'radio' | 'water' | 'mentor';

interface HarshCriticThought {
  id: string;
  textAr: string;
  textEn: string;
  reframedAr: string;
  reframedEn: string;
  sourceContextAr: string;
  sourceContextEn: string;
}

const PRESET_THOUGHTS: HarshCriticThought[] = [
  {
    id: 'imposter',
    textAr: 'أنت مجرد مدّعٍ وسيكتشف الجميع حقيقتك قريباً!',
    textEn: 'You are just a fraud and everyone will find out soon!',
    reframedAr: 'أشعر بالرهبة لأنني مهتم بنجاحي؛ المشاعر ليست حقائق، وتجاربي السابقة تثبت جدارتي.',
    reframedEn: 'I feel awe because I care about succeeding; feelings aren’t facts, and my journey proves my worth.',
    sourceContextAr: 'متلازمة المحتال والخوف من التقييم',
    sourceContextEn: 'Imposter syndrome & fear of judgment'
  },
  {
    id: 'too_late',
    textAr: 'فاتك القطار، الجميع يسبقك وأنت تراوح مكانك!',
    textEn: 'You are too late, everyone is ahead and you are stuck!',
    reframedAr: 'كل إنسان ينمو في موسمه الخاص؛ مقارنة طريقي بمسارات الآخرين تسرق هدوئي وجهدي.',
    reframedEn: 'Everyone grows in their own season; comparing my path to others steals my peace and focus.',
    sourceContextAr: 'المقارنة المجحفة واستعجال النتائج',
    sourceContextEn: 'Unfair social comparison'
  },
  {
    id: 'perfectionist',
    textAr: 'إذا لم تكن النتيجة مثالية ١٠٠٪ فلا قيمة لأي جهد بذلته!',
    textEn: 'If it’s not 100% perfect, your entire effort is worthless!',
    reframedAr: 'السعي للإتقان جميل، لكن الكمال وهم؛ المحاولة الصادقة خطوة حقيقية للأمام.',
    reframedEn: 'Excellence is noble, but perfection is an illusion; honest attempt is genuine progress.',
    sourceContextAr: 'فخ الكمالية وتصلب المعايير',
    sourceContextEn: 'Perfectionism & cognitive rigidity'
  },
  {
    id: 'blame_all',
    textAr: 'أي خطأ يحدث هو دليلك القاطع على ضعفك!',
    textEn: 'Every single mistake is definitive proof of your weakness!',
    reframedAr: 'الخطأ فرصة للتعديل واكتساب الخبرة، وليس حكماً إعدامياً على قيمتي الإنسانية.',
    reframedEn: 'Mistakes are simply data for adjustment, not a verdict on my human worth.',
    sourceContextAr: 'التعميم الزائد واللوم التلقائي',
    sourceContextEn: 'Overgeneralization & self-blame'
  }
];

export const ResonanceChamberGame: React.FC<ResonanceChamberGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  const [selectedThought, setSelectedThought] = useState<HarshCriticThought>(PRESET_THOUGHTS[0]);
  const [customText, setCustomText] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('cartoon');
  
  // Sliders
  const [distance, setDistance] = useState<number>(30); // 0 (inside head) to 100 (distant echo)
  const [pitch, setPitch] = useState<number>(50); // 0 to 100
  const [softness, setSoftness] = useState<number>(40);

  // States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [testedFilters, setTestedFilters] = useState<Set<FilterType>>(new Set(['cartoon']));
  const [wavePhase, setWavePhase] = useState<number>(0);

  // Animation frame for wave oscilloscope
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setWavePhase((prev) => (prev + 0.08) % (Math.PI * 2));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const currentThoughtText = isCustom ? (customText || (isAr ? 'اكتب فكرتك الناقدة...' : 'Type your critic thought...')) : (isAr ? selectedThought.textAr : selectedThought.textEn);
  const currentReframedText = isCustom 
    ? (isAr ? '«أنا ألاحظ أن عقلي يقدم لي حكماً متوتراً، وسأتعامل معه كفكرة عابرة وليس كحقيقة مطلقة.»' : '“I notice my mind offering me an anxious thought; I will treat it as a passing cloud, not an absolute truth.”')
    : (isAr ? selectedThought.reframedAr : selectedThought.reframedEn);

  const handleSelectFilter = (filter: FilterType) => {
    soundManager.playSoftTap();
    setActiveFilter(filter);
    setTestedFilters((prev) => new Set([...prev, filter]));
    soundManager.playEchoDistort(filter);
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 900);
  };

  const handleTriggerChamber = () => {
    soundManager.playEchoDistort(activeFilter);
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1200);

    // Record streak & add XP for exploring the chamber
    recordStreakActivity('resonance_chamber');
    if (onAddXP && testedFilters.size >= 3) {
      onAddXP(30);
    }
  };

  const handleSaveToMoments = () => {
    soundManager.playChime();
    saveMoment({
      gameId: 'resonance-chamber',
      gameTitle: isAr ? 'غرفة الصدى: تفكيك الصوت الناقد' : 'The Resonance Chamber',
      quote: currentThoughtText,
      reflection: currentReframedText,
      tag: isAr ? 'تفكيك الصوت الناقد' : 'Defusion'
    });
    setIsSaved(true);
    if (onAddXP) onAddXP(20);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Compute visual wave amplitude and frequency
  const waveAmplitude = activeFilter === 'cartoon' ? 24 : activeFilter === 'radio' ? 8 : activeFilter === 'water' ? 14 : 18;
  const waveFrequency = activeFilter === 'cartoon' ? 0.08 : activeFilter === 'radio' ? 0.22 : activeFilter === 'water' ? 0.04 : 0.06;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Top Header */}
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
                {isAr ? 'غرفة الصدى: تفكيك الصوت الناقد 📻' : 'The Resonance Chamber 📻'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                {isAr ? 'فك الارتباط المعرفي (ACT)' : 'Cognitive Defusion'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr 
                ? 'جرّد أحكام عقلك القاسية من رهبتها عبر تحويل نبرتها ومسافتها وتفكيك سطوتها.' 
                : 'Strip harsh mental judgments of their dread by altering pitch, distance, and emotional grip.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveToMoments}
          disabled={isSaved}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            isSaved
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200'
          }`}
        >
          {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          <span>{isSaved ? (isAr ? 'تم الحفظ 🌿' : 'Saved 🌿') : (isAr ? 'حفظ في دفتري' : 'Save Moment')}</span>
        </button>
      </div>

      {/* Preset or Custom Thought Selector */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-amber-500" />
            {isAr ? '١. حدد العبارة القاسية التي يرددها الناقد الداخلي:' : '1. Select or type the inner critic’s harsh judgment:'}
          </span>
          <button
            onClick={() => {
              soundManager.playSoftTap();
              setIsCustom(!isCustom);
            }}
            className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {isCustom ? (isAr ? 'اختيار من العبارات الجاهزة' : 'Use Presets') : (isAr ? '+ كتابة فكرتي الخاصة' : '+ Type Custom')}
          </button>
        </div>

        {isCustom ? (
          <div className="space-y-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={isAr ? 'مثال: "أنا دائماً أفشل في اللحظة الأخيرة..."' : 'e.g. "I always fail at the last second..."'}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_THOUGHTS.map((thought) => (
              <button
                key={thought.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setSelectedThought(thought);
                }}
                className={`p-3 rounded-2xl text-start transition-all border cursor-pointer ${
                  selectedThought.id === thought.id
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-2xs'
                    : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200/80 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-700 text-stone-600 dark:text-stone-300 inline-block mb-1">
                  {isAr ? thought.sourceContextAr : thought.sourceContextEn}
                </span>
                <p className="text-xs font-bold text-stone-800 dark:text-stone-200 line-clamp-2">
                  {isAr ? thought.textAr : thought.textEn}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* The Visual Chamber & Audio Oscilloscope */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-gradient-to-b from-stone-950 via-stone-900 to-black p-6 sm:p-8 text-white shadow-xl space-y-6">
        {/* Glow backdrop */}
        <div className={`absolute inset-0 opacity-20 pointer-events-none transition-all duration-700 blur-3xl ${
          activeFilter === 'cartoon' ? 'bg-amber-500' :
          activeFilter === 'radio' ? 'bg-orange-600' :
          activeFilter === 'water' ? 'bg-cyan-500' : 'bg-emerald-500'
        }`} />

        {/* Chamber Oscilloscope Visualizer */}
        <div className="relative h-28 w-full rounded-2xl bg-black/60 border border-stone-800 flex items-center justify-center overflow-hidden">
          {/* Audio Waveform SVG */}
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 100">
            <path
              d={`M 0 50 ${Array.from({ length: 50 }).map((_, i) => {
                const x = i * 10;
                const distFade = (100 - distance * 0.7) / 100;
                const y = 50 + Math.sin(x * waveFrequency + wavePhase) * waveAmplitude * distFade;
                return `L ${x} ${y}`;
              }).join(' ')} L 500 50`}
              fill="none"
              stroke={
                activeFilter === 'cartoon' ? '#f59e0b' :
                activeFilter === 'radio' ? '#f97316' :
                activeFilter === 'water' ? '#06b6d4' : '#10b981'
              }
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Mirror wave */}
            <path
              d={`M 0 50 ${Array.from({ length: 50 }).map((_, i) => {
                const x = i * 10;
                const distFade = (100 - distance * 0.7) / 100;
                const y = 50 - Math.sin(x * waveFrequency + wavePhase * 1.2) * (waveAmplitude * 0.6) * distFade;
                return `L ${x} ${y}`;
              }).join(' ')} L 500 50`}
              fill="none"
              stroke={
                activeFilter === 'cartoon' ? '#fbbf24' :
                activeFilter === 'radio' ? '#fb923c' :
                activeFilter === 'water' ? '#38bdf8' : '#34d399'
              }
              strokeWidth="1.5"
              opacity="0.4"
            />
          </svg>

          {/* Chamber Status Badge */}
          <div className="absolute top-2.5 start-3 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-stone-400">
              {isPlaying ? (isAr ? 'بث الصدى جارٍ...' : 'ECHO ACTIVE') : (isAr ? 'غرفة الصدى جاهزة' : 'CHAMBER READY')}
            </span>
          </div>

          <div className="absolute bottom-2.5 end-3 text-[10px] font-mono text-stone-400">
            {isAr ? `المسافة: ${distance}م | التردد: ${pitch}Hz` : `Distance: ${distance}m | Pitch: ${pitch}Hz`}
          </div>
        </div>

        {/* The Echo Thought Speech Display */}
        <div className="text-center space-y-2 py-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-400 block">
            {isAr ? 'صوت الفكرة المتردد في الغرفة الآن:' : 'Current Echo inside Chamber:'}
          </span>
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            activeFilter === 'cartoon' ? 'bg-amber-950/40 border-amber-600/50 text-amber-200' :
            activeFilter === 'radio' ? 'bg-orange-950/40 border-orange-600/50 text-orange-200 font-mono tracking-wide' :
            activeFilter === 'water' ? 'bg-cyan-950/40 border-cyan-600/50 text-cyan-200 italic' :
            'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
          }`}>
            <p className={`text-base sm:text-lg font-bold transition-all ${isPlaying ? 'scale-102' : 'scale-100'}`}>
              {activeFilter === 'cartoon' && '🐿️ '}
              {activeFilter === 'radio' && '📻 [أثير قديم]: '}
              {activeFilter === 'water' && '🌊 '}
              {activeFilter === 'mentor' && '🕊️ '}
              «{currentThoughtText}»
            </p>
          </div>
        </div>

        {/* 4 Transformation Filters */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-stone-300 block">
            {isAr ? '٢. اختر مُرشح التحويل وتفكيك الهيبة:' : '2. Select Transformation & Defusion Filter:'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Filter 1: Cartoon */}
            <button
              onClick={() => handleSelectFilter('cartoon')}
              className={`p-3 rounded-2xl border transition-all text-start cursor-pointer ${
                activeFilter === 'cartoon'
                  ? 'bg-amber-500 text-stone-950 border-amber-300 font-bold shadow-lg shadow-amber-500/25 scale-102'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850'
              }`}
            >
              <Smile className="w-5 h-5 mb-1 text-amber-300" />
              <div className="text-xs font-bold">{isAr ? 'نبرة كرتونية' : 'Chipmunk Pitch'}</div>
              <p className="text-[10px] opacity-80 mt-0.5">{isAr ? 'تسريع التردد لإزالة الرهبة والضحك' : 'High comic helium tone'}</p>
            </button>

            {/* Filter 2: Vintage Radio */}
            <button
              onClick={() => handleSelectFilter('radio')}
              className={`p-3 rounded-2xl border transition-all text-start cursor-pointer ${
                activeFilter === 'radio'
                  ? 'bg-orange-600 text-white border-orange-400 font-bold shadow-lg shadow-orange-600/25 scale-102'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850'
              }`}
            >
              <Radio className="w-5 h-5 mb-1 text-orange-300" />
              <div className="text-xs font-bold">{isAr ? 'راديو عتيق مبتعد' : 'Vintage Radio'}</div>
              <p className="text-[10px] opacity-80 mt-0.5">{isAr ? 'صوت قديم يبعد آلاف الكيلومترات' : 'Distant AM static transmission'}</p>
            </button>

            {/* Filter 3: Underwater Echo */}
            <button
              onClick={() => handleSelectFilter('water')}
              className={`p-3 rounded-2xl border transition-all text-start cursor-pointer ${
                activeFilter === 'water'
                  ? 'bg-cyan-600 text-white border-cyan-400 font-bold shadow-lg shadow-cyan-600/25 scale-102'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850'
              }`}
            >
              <Waves className="w-5 h-5 mb-1 text-cyan-300" />
              <div className="text-xs font-bold">{isAr ? 'تموجات الماء' : 'Water Ripples'}</div>
              <p className="text-[10px] opacity-80 mt-0.5">{isAr ? 'تذويب الحدة في أعماق هادئة' : 'Softened aquatic echo'}</p>
            </button>

            {/* Filter 4: Compassionate Mentor */}
            <button
              onClick={() => handleSelectFilter('mentor')}
              className={`p-3 rounded-2xl border transition-all text-start cursor-pointer ${
                activeFilter === 'mentor'
                  ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-lg shadow-emerald-600/25 scale-102'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850'
              }`}
            >
              <Heart className="w-5 h-5 mb-1 text-emerald-300" />
              <div className="text-xs font-bold">{isAr ? 'مرآة الصديق' : 'Compassionate Ally'}</div>
              <p className="text-[10px] opacity-80 mt-0.5">{isAr ? 'صوت حكيم وودود يدعمك' : 'Warm, protective reframe'}</p>
            </button>
          </div>
        </div>

        {/* Sliders: Distance & Softness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-black/40 border border-stone-800">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-300 font-medium">{isAr ? 'مسافة الصوت (إبعاده عن عقلك):' : 'Sound Distance from Mind:'}</span>
              <span className="text-amber-400 font-mono font-bold">{distance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>{isAr ? 'ملتصق برأسي' : 'Inside Head'}</span>
              <span>{isAr ? 'أفق بعيد متلاشٍ' : 'Far Horizon'}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-300 font-medium">{isAr ? 'درجة الرأفة واللطف:' : 'Self-Compassion Level:'}</span>
              <span className="text-emerald-400 font-mono font-bold">{softness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={softness}
              onChange={(e) => setSoftness(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>{isAr ? 'صوت خام قاسي' : 'Raw Harsh'}</span>
              <span>{isAr ? 'لطف وحكمة تامة' : 'Total Gentle Wisdom'}</span>
            </div>
          </div>
        </div>

        {/* Play Chamber Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleTriggerChamber}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold text-xs sm:text-sm hover:opacity-95 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Volume2 className="w-4 h-4 animate-bounce" />
            <span>{isAr ? 'تشغيل وتجربة الصدى المبدَّل 🔊' : 'Trigger Distorted Echo 🔊'}</span>
          </button>
        </div>
      </div>

      {/* Compassionate Reframing Insight Box */}
      <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
            {isAr ? 'الترجمة الحكيمة للصوت القاسي (ماذا يقول الجزء العطوف بداخلك؟):' : 'The Compassionate Mentor Translation:'}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed font-serif">
          {currentReframedText}
        </p>
      </div>
    </div>
  );
};
