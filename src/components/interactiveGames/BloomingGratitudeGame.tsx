import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Droplet, 
  Sun, 
  Heart, 
  Bookmark, 
  RotateCcw, 
  CheckCircle2, 
  Flower2,
  Trees
} from 'lucide-react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { recordStreakActivity } from '../../utils/streakManager';

interface BloomingGratitudeGameProps {
  language: Language;
  onBackToMap: () => void;
  onAddXP?: (amount: number) => void;
}

interface GratitudePrompt {
  id: string;
  categoryAr: string;
  categoryEn: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  examplesAr: string[];
  examplesEn: string[];
}

const PROMPTS: GratitudePrompt[] = [
  {
    id: 'sensory_blessing',
    categoryAr: 'نعمة حسية بسيطة',
    categoryEn: 'Sensory Blessing',
    titleAr: 'شيء بسيط أسعد حواسك اليوم (رائحة، طعم، دفء، ضوء):',
    titleEn: 'A simple sensory pleasure that warmed you today:',
    icon: '☕',
    examplesAr: [
      'رائحة القهوة الصباحية الهادئة',
      'دفء أشعة الشمس على وجهي لدقائق',
      'شربة ماء باردة أروَت عطشي',
      'نسمة هواء عليلة دخلت من النافذة'
    ],
    examplesEn: [
      'The quiet morning aroma of coffee/tea',
      'Warm sunlight bathing my face for a few minutes',
      'A cool, refreshing sip of water',
      'A gentle breeze brushing through the window'
    ]
  },
  {
    id: 'human_warmth',
    categoryAr: 'دفء إنساني عابر',
    categoryEn: 'Relational Warmth',
    titleAr: 'تفاعل لطيف، ابتسامة، أو كلمة طيبة تلقيتها أو قدمتها:',
    titleEn: 'A kind word, smile, or warm human interaction today:',
    icon: '🕊️',
    examplesAr: [
      'ابتسامة عابرة من شخص في الطريق',
      'رسالة اطمئنان غير متوقعة من عزيز',
      'فرصة لمساعدة شخص دون مقابل',
      'لحظة صمت مريحة مع من أحب'
    ],
    examplesEn: [
      'A sincere passing smile from a stranger',
      'An unexpected check-in text from someone dear',
      'A chance to offer quiet help to someone',
      'A comforting, unspoken shared silence'
    ]
  },
  {
    id: 'inner_win',
    categoryAr: 'إنجاز ذاتي خفي',
    categoryEn: 'Quiet Inner Win',
    titleAr: 'لحظة صمود، تأنٍ، أو لطف قدمته لنفسك اليوم:',
    titleEn: 'A moment of patience, boundary, or self-kindness today:',
    icon: '🌱',
    examplesAr: [
      'اخترت ألا أرد بانفعال وأخذت نفساً عميقاً',
      'سمحت لنفسي بالراحة دون جلد ذات',
      'أتممت مهمة صغيرة كانت تثقل بالي',
      'استيقظت بنية حضور واعية وحقيقية'
    ],
    examplesEn: [
      'I chose not to react impulsively and took a deep breath',
      'I allowed myself to rest without harsh self-blame',
      'I finished a small lingering task off my shoulders',
      'I woke up with an intentional, mindful presence'
    ]
  }
];

export const BloomingGratitudeGame: React.FC<BloomingGratitudeGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  
  const [currentPromptIdx, setCurrentPromptIdx] = useState<number>(0);
  const [blooms, setBlooms] = useState<{ id: string; text: string; color: string }[]>([]);
  const [customInput, setCustomInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [treeWateredCount, setTreeWateredCount] = useState<number>(0);

  const activePrompt = PROMPTS[currentPromptIdx];
  const isTreeFullyBloomed = blooms.length >= 3;

  const handleBloomGratitude = (text: string) => {
    if (blooms.some(b => b.text === text)) return;

    soundManager.playBloomChime();
    const colors = ['#f59e0b', '#ec4899', '#10b981'];
    const newBlooms = [...blooms, { id: activePrompt.id, text, color: colors[blooms.length % colors.length] }];
    setBlooms(newBlooms);
    setTreeWateredCount(prev => prev + 1);
    setCustomInput('');

    if (currentPromptIdx < PROMPTS.length - 1) {
      setCurrentPromptIdx(prev => prev + 1);
    }

    if (newBlooms.length === 3) {
      recordStreakActivity('blooming_gratitude');
      if (onAddXP) onAddXP(40);
    }
  };

  const handleSaveToMoments = () => {
    soundManager.playChime();
    const reflections = blooms.map((b, i) => `🌸 ${b.text}`).join('\n');
    saveMoment({
      gameId: 'blooming-gratitude',
      gameTitle: isAr ? 'شجرة الامتنان ذات البراعم المتفتحة' : 'The Blooming Gratitude Arbor',
      quote: isAr ? 'باقة امتنان يومية متفتحة من ٣ نعم واعية' : 'Daily Gratitude Bouquet of 3 mindful blessings',
      reflection: reflections,
      tag: isAr ? 'امتنان وسكينة' : 'Gratitude Savoring'
    });
    setIsSaved(true);
    if (onAddXP) onAddXP(20);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setBlooms([]);
    setCurrentPromptIdx(0);
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
                {isAr ? 'شجرة الامتنان ذات البراعم 🌸' : 'The Blooming Gratitude Arbor 🌸'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                {isAr ? 'علم النفس الإيجابي وتثبيت النعم' : 'Gratitude Savoring'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr 
                ? 'اروَ شجرة سلامك الداخلي بثلاث نعم واعية عشتها اليوم، وشاهد أزهارها تتفتح بالنور.' 
                : 'Nourish your inner arbor with 3 mindful daily blessings and watch flowers blossom in radiant light.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {blooms.length > 0 && (
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title={isAr ? 'إعادة البستنة' : 'Replant'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleSaveToMoments}
            disabled={isSaved || blooms.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : blooms.length > 0
                ? 'bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-500 text-white'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
            }`}
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? (isAr ? 'تم الحفظ 🌿' : 'Saved 🌿') : (isAr ? 'حفظ باقة الامتنان' : 'Save Bouquet')}</span>
          </button>
        </div>
      </div>

      {/* Visual Garden & Blooming Bonsai Tree Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-gradient-to-b from-stone-900 via-stone-925 to-stone-950 p-6 sm:p-8 text-white shadow-xl flex flex-col items-center justify-center min-h-[300px]">
        {/* Soft Background Lanterns */}
        <div className="absolute top-4 left-6 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-6 right-8 w-32 h-32 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tree Visual Representation */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Canopy Flowers Ring */}
          <div className="relative w-44 h-40 flex items-center justify-center">
            {/* Tree Canopy Cloud SVG */}
            <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md">
              <path
                d="M 50 120 C 20 120 10 90 30 70 C 20 40 50 20 80 30 C 100 10 140 10 160 35 C 185 30 200 60 185 85 C 200 110 180 130 150 125 C 130 140 80 140 50 120 Z"
                fill={isTreeFullyBloomed ? '#064e3b' : '#14532d'}
                stroke={isTreeFullyBloomed ? '#34d399' : '#22c55e'}
                strokeWidth="2"
                opacity="0.85"
                className="transition-colors duration-700"
              />
              {/* Tree Trunk */}
              <path
                d="M 90 120 C 85 140 75 155 60 160 L 140 160 C 125 155 115 140 110 120 Z"
                fill="#78350f"
                stroke="#451a03"
                strokeWidth="1.5"
              />
            </svg>

            {/* Glowing Blossom Overlays */}
            {blooms.map((bloom, idx) => {
              const positions = [
                { top: '25%', left: '30%' },
                { top: '15%', left: '55%' },
                { top: '45%', left: '65%' }
              ];
              const pos = positions[idx] || { top: '50%', left: '50%' };
              return (
                <div
                  key={idx}
                  className="absolute p-2 rounded-full bg-white/20 backdrop-blur-xs border border-white/60 shadow-lg animate-bounce"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <Flower2 className="w-5 h-5 text-rose-300 fill-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                </div>
              );
            })}
          </div>

          {/* Status Label */}
          <div className="mt-2 text-center">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? `تفتحت ${blooms.length} من ٣ براعم امتنان` : `${blooms.length} of 3 gratitude buds bloomed`}</span>
            </span>
            {isTreeFullyBloomed && (
              <p className="text-xs text-amber-200 mt-1 font-serif animate-pulse">
                {isAr ? '🌿 شجرتك مزهرة بالكامل اليوم! الامتنان يحول ما تملكه إلى كفاية وزيادة.' : '🌿 Your arbor is in full bloom! Gratitude turns what we have into enough.'}
              </p>
            )}
          </div>
        </div>

        {/* Woven Flowers Cards Grid */}
        {blooms.length > 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-6 z-10">
            {blooms.map((bloom, i) => (
              <div 
                key={i}
                className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2"
              >
                <span className="text-base">🌸</span>
                <span className="truncate">{bloom.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prompts & Active Gardening Actions */}
      {!isTreeFullyBloomed && activePrompt && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activePrompt.icon}</span>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                  {isAr ? activePrompt.categoryAr : activePrompt.categoryEn} (البُرعم #{currentPromptIdx + 1})
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {isAr ? activePrompt.titleAr : activePrompt.titleEn}
                </h3>
              </div>
            </div>
          </div>

          {/* Quick preset blooms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(isAr ? activePrompt.examplesAr : activePrompt.examplesEn).map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleBloomGratitude(example)}
                className="p-3 rounded-2xl bg-stone-50 hover:bg-rose-50/60 dark:bg-stone-800/60 dark:hover:bg-stone-750 border border-stone-200 dark:border-stone-700 hover:border-rose-300 text-start text-xs font-bold text-stone-800 dark:text-stone-200 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>{example}</span>
                <span className="text-rose-500 font-mono text-[11px]">+ ري 🌸</span>
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder={isAr ? 'أو اكتب نعمتك الخاصة هنا...' : 'Or type your own personal blessing...'}
              className="flex-1 px-4 py-2 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customInput.trim()) {
                  handleBloomGratitude(customInput.trim());
                }
              }}
            />
            <button
              onClick={() => {
                if (customInput.trim()) handleBloomGratitude(customInput.trim());
              }}
              disabled={!customInput.trim()}
              className="px-4 py-2 rounded-2xl bg-stone-900 dark:bg-rose-600 text-white text-xs font-bold hover:opacity-90 disabled:opacity-40 cursor-pointer"
            >
              {isAr ? 'تفتيح الزهرة' : 'Bloom'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
