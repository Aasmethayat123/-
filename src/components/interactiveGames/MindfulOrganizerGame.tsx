import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Bookmark, 
  CheckCircle2, 
  Layers, 
  SlidersHorizontal,
  Lightbulb,
  Heart
} from 'lucide-react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { 
  getGameLevelProgress, 
  completeStage, 
  setActiveStage, 
  GameProgressData 
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface MindfulOrganizerGameProps {
  language: Language;
  onBackToMap: () => void;
  onAddXP?: (amount: number) => void;
}

interface ShelfItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'book' | 'plant' | 'crystal' | 'cozy';
  height: number; // 1 to 5
  color: string;
  icon: string;
  idealShelf: 0 | 1 | 2; // 0: Top, 1: Middle, 2: Bottom
}

// Stage Items Libraries
const ALL_STAGE_ITEMS: Record<number, ShelfItem[]> = {
  // Stage 1: 6 Cozy Items (Beginner)
  1: [
    { id: 's1_b1', nameAr: 'كتاب الهدوء الأخضر', nameEn: 'Emerald Calm Book', category: 'book', height: 4, color: 'bg-emerald-600 border-emerald-500', icon: '📗', idealShelf: 1 },
    { id: 's1_b2', nameAr: 'كتاب البصيرة الأزرق', nameEn: 'Insight Sky Book', category: 'book', height: 3, color: 'bg-sky-600 border-sky-500', icon: '📘', idealShelf: 1 },
    { id: 's1_c1', nameAr: 'بلورة كوارتز شفافة', nameEn: 'Clear Quartz', category: 'crystal', height: 3, color: 'bg-cyan-100 text-cyan-900 border-cyan-300', icon: '💎', idealShelf: 0 },
    { id: 's1_c2', nameAr: 'شمعة صويا دافئة', nameEn: 'Soy Candle', category: 'cozy', height: 2, color: 'bg-amber-100 text-amber-900 border-amber-300', icon: '🕯️', idealShelf: 0 },
    { id: 's1_p1', nameAr: 'نبتة صبار هادئة', nameEn: 'Calm Succulent', category: 'plant', height: 3, color: 'bg-emerald-200 text-emerald-900 border-emerald-400', icon: '🪴', idealShelf: 2 },
    { id: 's1_p2', nameAr: 'كوب شاي فخاري', nameEn: 'Ceramic Teacup', category: 'cozy', height: 2, color: 'bg-rose-200 text-rose-900 border-rose-300', icon: '☕', idealShelf: 2 }
  ],

  // Stage 2: 9 Items (Intermediate)
  2: [
    { id: 's2_b1', nameAr: 'كتاب الهدوء الأخضر', nameEn: 'Emerald Calm Book', category: 'book', height: 4, color: 'bg-emerald-600 border-emerald-500', icon: '📗', idealShelf: 1 },
    { id: 's2_b2', nameAr: 'كتاب البصيرة الأزرق', nameEn: 'Insight Sky Book', category: 'book', height: 3, color: 'bg-sky-600 border-sky-500', icon: '📘', idealShelf: 1 },
    { id: 's2_b3', nameAr: 'كتاب الدفء البرتقالي', nameEn: 'Warmth Book', category: 'book', height: 5, color: 'bg-amber-600 border-amber-500', icon: '📙', idealShelf: 1 },
    { id: 's2_b4', nameAr: 'كتاب السكينة البنفسجي', nameEn: 'Serenity Book', category: 'book', height: 2, color: 'bg-purple-600 border-purple-500', icon: '📕', idealShelf: 1 },
    { id: 's2_c1', nameAr: 'بلورة كوارتز شفافة', nameEn: 'Clear Quartz', category: 'crystal', height: 3, color: 'bg-cyan-100 text-cyan-900 border-cyan-300', icon: '💎', idealShelf: 0 },
    { id: 's2_c2', nameAr: 'شمعة صويا دافئة', nameEn: 'Soy Candle', category: 'cozy', height: 2, color: 'bg-amber-100 text-amber-900 border-amber-300', icon: '🕯️', idealShelf: 0 },
    { id: 's2_c3', nameAr: 'ساعة رملية مصغرة', nameEn: 'Mini Hourglass', category: 'cozy', height: 3, color: 'bg-stone-200 text-stone-800 border-stone-400', icon: '⏳', idealShelf: 0 },
    { id: 's2_p1', nameAr: 'نبتة صبار هادئة', nameEn: 'Calm Succulent', category: 'plant', height: 3, color: 'bg-emerald-200 text-emerald-900 border-emerald-400', icon: '🪴', idealShelf: 2 },
    { id: 's2_p2', nameAr: 'شجيرة بونزاي مصغرة', nameEn: 'Mini Bonsai', category: 'plant', height: 4, color: 'bg-teal-200 text-teal-900 border-teal-400', icon: '🌿', idealShelf: 2 }
  ],

  // Stage 3: 12 Items (Advanced)
  3: [
    { id: 's3_b1', nameAr: 'كتاب الفلسفة الهادئة', nameEn: 'Philosophy Book', category: 'book', height: 5, color: 'bg-emerald-700 border-emerald-600', icon: '📗', idealShelf: 1 },
    { id: 's3_b2', nameAr: 'ديوان شعر الطبيعة', nameEn: 'Nature Poetry', category: 'book', height: 4, color: 'bg-sky-600 border-sky-500', icon: '📘', idealShelf: 1 },
    { id: 's3_b3', nameAr: 'دفتر يوميات الامتنان', nameEn: 'Gratitude Diary', category: 'book', height: 3, color: 'bg-amber-600 border-amber-500', icon: '📙', idealShelf: 1 },
    { id: 's3_b4', nameAr: 'دليل الألوان النفسية', nameEn: 'Color Guide', category: 'book', height: 2, color: 'bg-rose-600 border-rose-500', icon: '📕', idealShelf: 1 },
    { id: 's3_b5', nameAr: 'مخطوطة الحكمة القديمة', nameEn: 'Ancient Wisdom', category: 'book', height: 5, color: 'bg-stone-700 border-stone-600', icon: '📓', idealShelf: 1 },
    { id: 's3_c1', nameAr: 'هرم أميثيست بنفسجي', nameEn: 'Amethyst Pyramid', category: 'crystal', height: 3, color: 'bg-purple-100 text-purple-900 border-purple-300', icon: '🔮', idealShelf: 0 },
    { id: 's3_c2', nameAr: 'شمعة صويا دافئة', nameEn: 'Soy Candle', category: 'cozy', height: 2, color: 'bg-amber-100 text-amber-900 border-amber-300', icon: '🕯️', idealShelf: 0 },
    { id: 's3_c3', nameAr: 'ساعة رملية عتيقة', nameEn: 'Vintage Hourglass', category: 'cozy', height: 3, color: 'bg-stone-200 text-stone-800 border-stone-400', icon: '⏳', idealShelf: 0 },
    { id: 's3_c4', nameAr: 'مصباح ملح الهيمالايا', nameEn: 'Salt Lamp', category: 'cozy', height: 4, color: 'bg-orange-100 text-orange-900 border-orange-300', icon: '🏮', idealShelf: 0 },
    { id: 's3_p1', nameAr: 'نبتة صبار هادئة', nameEn: 'Calm Succulent', category: 'plant', height: 3, color: 'bg-emerald-200 text-emerald-900 border-emerald-400', icon: '🪴', idealShelf: 2 },
    { id: 's3_p2', nameAr: 'شجيرة بونزاي مصغرة', nameEn: 'Mini Bonsai', category: 'plant', height: 4, color: 'bg-teal-200 text-teal-900 border-teal-400', icon: '🌿', idealShelf: 2 },
    { id: 's3_p3', nameAr: 'إبريق فخار ريفي', nameEn: 'Rustic Clay Pitcher', category: 'cozy', height: 4, color: 'bg-stone-300 text-stone-800 border-stone-400', icon: '🏺', idealShelf: 2 }
  ],

  // Stage 4: 15 Items (Master Sanctuary)
  4: [
    { id: 's4_b1', nameAr: 'موسوعة السلام الداخلي', nameEn: 'Peace Encyclopedia', category: 'book', height: 5, color: 'bg-emerald-800 border-emerald-700', icon: '📗', idealShelf: 1 },
    { id: 's4_b2', nameAr: 'كتاب البصيرة الأزرق', nameEn: 'Insight Sky Book', category: 'book', height: 4, color: 'bg-sky-600 border-sky-500', icon: '📘', idealShelf: 1 },
    { id: 's4_b3', nameAr: 'كتاب الدفء البرتقالي', nameEn: 'Warmth Book', category: 'book', height: 3, color: 'bg-amber-600 border-amber-500', icon: '📙', idealShelf: 1 },
    { id: 's4_b4', nameAr: 'كتاب السكينة البنفسجي', nameEn: 'Serenity Book', category: 'book', height: 2, color: 'bg-purple-600 border-purple-500', icon: '📕', idealShelf: 1 },
    { id: 's4_b5', nameAr: 'مخطوطة النور الذهبي', nameEn: 'Golden Manuscript', category: 'book', height: 4, color: 'bg-yellow-600 border-yellow-500', icon: '📒', idealShelf: 1 },
    { id: 's4_b6', nameAr: 'ديوان التأمل المسائي', nameEn: 'Night Meditations', category: 'book', height: 3, color: 'bg-indigo-700 border-indigo-600', icon: '📓', idealShelf: 1 },
    { id: 's4_c1', nameAr: 'بلورة كوارتز شفافة', nameEn: 'Clear Quartz', category: 'crystal', height: 3, color: 'bg-cyan-100 text-cyan-900 border-cyan-300', icon: '💎', idealShelf: 0 },
    { id: 's4_c2', nameAr: 'هرم أميثيست بنفسجي', nameEn: 'Amethyst Pyramid', category: 'crystal', height: 3, color: 'bg-purple-100 text-purple-900 border-purple-300', icon: '🔮', idealShelf: 0 },
    { id: 's4_c3', nameAr: 'شمعة صويا دافئة', nameEn: 'Soy Candle', category: 'cozy', height: 2, color: 'bg-amber-100 text-amber-900 border-amber-300', icon: '🕯️', idealShelf: 0 },
    { id: 's4_c4', nameAr: 'ساعة رملية عتيقة', nameEn: 'Vintage Hourglass', category: 'cozy', height: 3, color: 'bg-stone-200 text-stone-800 border-stone-400', icon: '⏳', idealShelf: 0 },
    { id: 's4_c5', nameAr: 'مصباح ملح الهيمالايا', nameEn: 'Salt Lamp', category: 'cozy', height: 4, color: 'bg-orange-100 text-orange-900 border-orange-300', icon: '🏮', idealShelf: 0 },
    { id: 's4_p1', nameAr: 'نبتة صبار هادئة', nameEn: 'Calm Succulent', category: 'plant', height: 3, color: 'bg-emerald-200 text-emerald-900 border-emerald-400', icon: '🪴', idealShelf: 2 },
    { id: 's4_p2', nameAr: 'شجيرة بونزاي مصغرة', nameEn: 'Mini Bonsai', category: 'plant', height: 4, color: 'bg-teal-200 text-teal-900 border-teal-400', icon: '🌿', idealShelf: 2 },
    { id: 's4_p3', nameAr: 'إبريق فخار ريفي', nameEn: 'Rustic Clay Pitcher', category: 'cozy', height: 4, color: 'bg-stone-300 text-stone-800 border-stone-400', icon: '🏺', idealShelf: 2 },
    { id: 's4_p4', nameAr: 'كوب شاي ياسمين', nameEn: 'Jasmine Tea Cup', category: 'cozy', height: 2, color: 'bg-rose-200 text-rose-900 border-rose-300', icon: '☕', idealShelf: 2 }
  ]
};

const GAME_ID = 'mindful-organizer';

export const MindfulOrganizerGame: React.FC<MindfulOrganizerGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStage, setCurrentStage] = useState<number>(() => progress.currentStage || 1);

  const currentStageItems = ALL_STAGE_ITEMS[currentStage] || ALL_STAGE_ITEMS[1];

  // Shelves state: 0 Top, 1 Middle, 2 Bottom
  const [shelves, setShelves] = useState<ShelfItem[][]>([[], [], []]);
  const [trayItems, setTrayItems] = useState<ShelfItem[]>(currentStageItems);
  const [selectedItem, setSelectedItem] = useState<ShelfItem | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [starsAwarded, setStarsAwarded] = useState<number>(3);
  const [earnedXP, setEarnedXP] = useState<number>(50);

  const loadStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    setActiveStage(GAME_ID, stageNum);
    const items = ALL_STAGE_ITEMS[stageNum] || ALL_STAGE_ITEMS[1];
    setShelves([[], [], []]);
    setTrayItems(items);
    setSelectedItem(null);
    setShowCompletionModal(false);
  };

  const totalPlaced = shelves[0].length + shelves[1].length + shelves[2].length;
  const isFullyOrganized = totalPlaced === currentStageItems.length;

  // Harmony calculation
  const correctShelfCount = shelves.reduce((acc, shelf, shelfIdx) => {
    return acc + shelf.filter(item => item.idealShelf === shelfIdx).length;
  }, 0);
  const harmonyPercentage = Math.round((correctShelfCount / currentStageItems.length) * 100);

  const handleSelectItemFromTray = (item: ShelfItem) => {
    soundManager.playSoftTap();
    setSelectedItem(item);
  };

  const handlePlaceOnShelf = (shelfIdx: 0 | 1 | 2) => {
    if (!selectedItem) return;

    soundManager.playWoodClink();

    // Remove from tray or from other shelves
    setTrayItems(prev => prev.filter(i => i.id !== selectedItem.id));
    const nextShelves = shelves.map((shelf, idx) => {
      const filtered = shelf.filter(i => i.id !== selectedItem.id);
      if (idx === shelfIdx) {
        return [...filtered, selectedItem];
      }
      return filtered;
    });

    setShelves(nextShelves);

    const isLastOne = trayItems.length === 1 && selectedItem.id === trayItems[0].id;
    if (isLastOne) {
      // Re-evaluate harmony
      const nextTotalPlaced = nextShelves.reduce((acc, s) => acc + s.length, 0);
      const nextCorrect = nextShelves.reduce((acc, s, sIdx) => {
        return acc + s.filter(item => item.idealShelf === sIdx).length;
      }, 0);
      const finalHarmony = Math.round((nextCorrect / currentStageItems.length) * 100);

      let stars = 3;
      if (finalHarmony < 70) stars = 1;
      else if (finalHarmony < 88) stars = 2;

      setStarsAwarded(stars);

      const result = completeStage(GAME_ID, currentStage, stars, undefined, onAddXP);
      setEarnedXP(result.xpAwarded);
      setProgress(getGameLevelProgress(GAME_ID));
      setShowCompletionModal(true);
    }

    setSelectedItem(null);
  };

  const handleReturnToTray = (item: ShelfItem) => {
    soundManager.playSoftTap();
    setShelves(prev => prev.map(s => s.filter(i => i.id !== item.id)));
    setTrayItems(prev => [...prev, item]);
    if (selectedItem?.id === item.id) setSelectedItem(null);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    loadStage(currentStage);
  };

  const handleNextStage = () => {
    if (currentStage < 4) {
      loadStage(currentStage + 1);
    } else {
      setShowCompletionModal(false);
    }
  };

  const handleSaveToMoments = () => {
    soundManager.playChime();
    saveMoment({
      gameId: 'mindful-organizer',
      gameTitle: isAr ? `ترتيب الرفوف (المرحلة ${currentStage})` : `Mindful Organizer (Stage ${currentStage})`,
      quote: isAr 
        ? `أكملت المرحلة ${currentStage} بنسبة تناغم وتناسق ${harmonyPercentage}٪` 
        : `Completed Stage ${currentStage} with ${harmonyPercentage}% harmony!`,
      reflection: isAr 
        ? '«ترتيب الأشياء الخارجية يفرغ عقل الإنسان من الفوضى، ويمنحه شعوراً عميقاً بالسيطرة والسكينة.»'
        : '“Organizing our physical surroundings declutters the mind, restoring grounding, order, and calm.”',
      tag: isAr ? 'تنظيم وهدوء' : 'Organization'
    });
    setIsSaved(true);
    if (onAddXP) onAddXP(20);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
                {isAr ? 'ترتيب الفوضى والرفوف والسكينة 🪴' : 'The Mindful Organizer 🪴'}
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                {isAr ? '٤ مستويات متدرجة 🏆' : '4 Progressive Stages 🏆'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAr 
                ? 'رتب مقتنياتك الجميلة على الرفوف الخشبية عبر ٤ مراحل متدرجة لتستعيد هدوء ذهنك وسيطرتك.' 
                : 'Tidy books, crystals, and botanicals across 4 progressive stages to restore deep calm.'}
            </p>
          </div>
        </div>

        {/* Right Stage Selector & Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <StageLevelSelector
            language={language}
            gameId={GAME_ID}
            currentStage={currentStage}
            progress={progress}
            onSelectStage={(num) => loadStage(num)}
            showCompletionModal={showCompletionModal}
            completedStageNumber={currentStage}
            starsEarned={starsAwarded}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={handleReset}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />

          <div className="flex items-center gap-1.5 ms-auto sm:ms-0">
            {totalPlaced > 0 && (
              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title={isAr ? 'إعادة الترتيب' : 'Reset'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleSaveToMoments}
              disabled={isSaved || totalPlaced === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : totalPlaced > 0
                  ? 'bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? (isAr ? 'تم الحفظ 🌿' : 'Saved 🌿') : (isAr ? 'حفظ الرف' : 'Save Shelves')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* The Cozy Wooden Bookshelf Stage */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-900/30 dark:border-stone-800 bg-gradient-to-b from-[#fbf8f3] via-[#f7f2ea] to-[#eee6d8] dark:from-[#1c1815] dark:via-[#171412] dark:to-[#0f0d0b] p-5 sm:p-8 shadow-xl space-y-6">
        
        {/* Top Shelf Bar: Crystals & Illumination */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-amber-300">
            <span>{isAr ? 'الرف العلوي: مقتنيات النور والصفاء والشموع 💎' : 'Top Shelf: Crystals & Illumination'}</span>
            <span className="text-[10px] text-stone-400 font-mono">({shelves[0].length} عناصر)</span>
          </div>
          
          <div 
            onClick={() => handlePlaceOnShelf(0)}
            className={`min-h-[80px] p-3 rounded-2xl border-2 border-dashed transition-all flex items-end gap-3 flex-wrap cursor-pointer ${
              selectedItem 
                ? 'border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 shadow-inner' 
                : 'border-stone-300 dark:border-stone-800 bg-white/40 dark:bg-black/20'
            }`}
          >
            {shelves[0].map(item => (
              <div 
                key={item.id}
                onClick={(e) => {
                  if (!selectedItem) {
                    e.stopPropagation();
                    handleReturnToTray(item);
                  }
                }}
                className="group relative flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-stone-800 border shadow-xs hover:scale-105 transition-transform cursor-pointer"
                title={isAr ? 'انقر لإعادته للصندوق' : 'Click to return to tray'}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 mt-1 max-w-[65px] truncate">
                  {isAr ? item.nameAr : item.nameEn}
                </span>
              </div>
            ))}
            {shelves[0].length === 0 && (
              <span className="text-xs text-stone-400 italic m-auto">
                {selectedItem ? (isAr ? 'انقر هنا لوضع الغرض المختار' : 'Click to place selected item') : (isAr ? 'رف فارغ' : 'Empty Shelf')}
              </span>
            )}
          </div>
          {/* Wooden Shelf Plank */}
          <div className="w-full h-3 rounded-full bg-gradient-to-r from-[#92400e] via-[#b45309] to-[#78350f] shadow-md" />
        </div>

        {/* Middle Shelf Bar: The Books */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-amber-300">
            <span>{isAr ? 'الرف الأوسط: الكتب وتدرج الأحجام 📚' : 'Middle Shelf: Mindful Books'}</span>
            <span className="text-[10px] text-stone-400 font-mono">({shelves[1].length} عناصر)</span>
          </div>

          <div 
            onClick={() => handlePlaceOnShelf(1)}
            className={`min-h-[85px] p-3 rounded-2xl border-2 border-dashed transition-all flex items-end gap-2.5 flex-wrap cursor-pointer ${
              selectedItem 
                ? 'border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 shadow-inner' 
                : 'border-stone-300 dark:border-stone-800 bg-white/40 dark:bg-black/20'
            }`}
          >
            {shelves[1].map(item => (
              <div 
                key={item.id}
                onClick={(e) => {
                  if (!selectedItem) {
                    e.stopPropagation();
                    handleReturnToTray(item);
                  }
                }}
                className={`group relative flex flex-col items-center justify-end p-2 rounded-xl text-white border shadow-xs hover:scale-105 transition-transform cursor-pointer ${item.color}`}
                style={{ height: `${item.height * 14 + 20}px`, minWidth: '42px' }}
                title={isAr ? 'انقر لإعادته للصندوق' : 'Click to return to tray'}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-[9px] font-bold truncate max-w-[50px] mt-0.5">
                  {isAr ? item.nameAr.split(' ')[0] : item.nameEn.split(' ')[0]}
                </span>
              </div>
            ))}
            {shelves[1].length === 0 && (
              <span className="text-xs text-stone-400 italic m-auto">
                {selectedItem ? (isAr ? 'انقر هنا لوضع الغرض المختار' : 'Click to place selected item') : (isAr ? 'رف الكتب فارغ' : 'Empty Book Shelf')}
              </span>
            )}
          </div>
          {/* Wooden Shelf Plank */}
          <div className="w-full h-3 rounded-full bg-gradient-to-r from-[#92400e] via-[#b45309] to-[#78350f] shadow-md" />
        </div>

        {/* Bottom Shelf Bar: Plants & Ceramics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-amber-300">
            <span>{isAr ? 'الرف السفلي: النباتات والفخار والجمال الأرضي 🪴' : 'Bottom Shelf: Botanical & Ceramics'}</span>
            <span className="text-[10px] text-stone-400 font-mono">({shelves[2].length} عناصر)</span>
          </div>

          <div 
            onClick={() => handlePlaceOnShelf(2)}
            className={`min-h-[85px] p-3 rounded-2xl border-2 border-dashed transition-all flex items-end gap-3 flex-wrap cursor-pointer ${
              selectedItem 
                ? 'border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 shadow-inner' 
                : 'border-stone-300 dark:border-stone-800 bg-white/40 dark:bg-black/20'
            }`}
          >
            {shelves[2].map(item => (
              <div 
                key={item.id}
                onClick={(e) => {
                  if (!selectedItem) {
                    e.stopPropagation();
                    handleReturnToTray(item);
                  }
                }}
                className="group relative flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-stone-800 border shadow-xs hover:scale-105 transition-transform cursor-pointer"
                title={isAr ? 'انقر لإعادته للصندوق' : 'Click to return to tray'}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 mt-1 max-w-[65px] truncate">
                  {isAr ? item.nameAr : item.nameEn}
                </span>
              </div>
            ))}
            {shelves[2].length === 0 && (
              <span className="text-xs text-stone-400 italic m-auto">
                {selectedItem ? (isAr ? 'انقر هنا لوضع الغرض المختار' : 'Click to place selected item') : (isAr ? 'رف النباتات فارغ' : 'Empty Plant Shelf')}
              </span>
            )}
          </div>
          {/* Wooden Shelf Plank */}
          <div className="w-full h-3 rounded-full bg-gradient-to-r from-[#92400e] via-[#b45309] to-[#78350f] shadow-md" />
        </div>

        {/* Progress & Harmony Gauge */}
        <div className="flex items-center justify-between text-xs pt-2">
          <span className="font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
            <span>{isAr ? `الأغراض المنظمة: ${totalPlaced} من ${currentStageItems.length}` : `Organized Items: ${totalPlaced}/${currentStageItems.length}`}</span>
          </span>
          <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
            {isAr ? `مؤشر التناغم: ${harmonyPercentage}%` : `Harmony: ${harmonyPercentage}%`}
          </span>
        </div>
      </div>

      {/* Completion Celebration Banner */}
      {isFullyOrganized && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-2 border-emerald-400/80 dark:border-emerald-700 text-center space-y-2 animate-bounce">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm sm:text-base font-black text-emerald-900 dark:text-emerald-100">
              {isAr ? `🎉 اكتمل تنظيم المرحلة ${currentStage} بهدوء وتناغم تام!` : `🎉 Stage ${currentStage} Shelves Organized!`}
            </h3>
          </div>
          <div className="flex items-center justify-center gap-3 pt-1">
            {currentStage < 4 && (
              <button
                onClick={handleNextStage}
                className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
              >
                {isAr ? `المرحلة التالية (${currentStage + 1}) 🚀` : `Next Stage (${currentStage + 1}) 🚀`}
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-200 transition-colors cursor-pointer"
            >
              {isAr ? 'إعادة المرحلة ↺' : 'Replay Stage'}
            </button>
          </div>
        </div>
      )}

      {/* Unorganized Items Tray Box */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">📦</span>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
              {isAr ? 'صندوق الأغراض بانتظار الترتيب (انقر على غرض ثم اختر الرف):' : 'Item Tray (Select an item, then click a shelf):'}
            </h3>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            {isAr ? `متبقي ${trayItems.length} أغراض` : `${trayItems.length} items left`}
          </span>
        </div>

        {trayItems.length === 0 ? (
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 text-center text-xs text-stone-400 font-medium">
            {isAr ? 'الصندوق فارغ! كل الأغراض استقرت على رفوفها بسلام 🌿' : 'Tray is empty! All items found their peaceful spot.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {trayItems.map(item => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItemFromTray(item)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    isSelected 
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 scale-105 shadow-md shadow-amber-500/20' 
                      : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-750 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate w-full">
                    {isAr ? item.nameAr : item.nameEn}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {isSelected ? (isAr ? 'محدد ✓' : 'Selected') : (isAr ? 'انقر للاختيار' : 'Tap to select')}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
