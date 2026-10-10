import React, { useState } from 'react';
import { Language, GameMode } from '../types';
import { ALL_36_GAMES, GameCatalogItem, ExperienceType } from '../data/gamesCatalog';
import { soundManager } from '../utils/audio';
import { 
  Search, 
  X, 
  Gamepad2, 
  ArrowRight, 
  Compass, 
  Clock, 
  Filter, 
  Home, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface GamesLibraryProps {
  language: Language;
  onSelectGame: (gameId: GameMode, levelId?: string) => void;
  onBackToHome: () => void;
}

type LibraryCategoryTab = 'all' | 'nesma9' | 'visceral' | 'projective' | 'quests' | 'somatic' | 'cognitive';

export const GamesLibrary: React.FC<GamesLibraryProps> = ({
  language,
  onSelectGame,
  onBackToHome
}) => {
  const isAr = language === 'ar';

  const [activeCategory, setActiveCategory] = useState<LibraryCategoryTab>('nesma9');
  const [typeFilter, setTypeFilter] = useState<'all' | ExperienceType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { id: LibraryCategoryTab; labelAr: string; labelEn: string; icon: string; count: number }[] = [
    { id: 'nesma9', labelAr: 'نسمة حياة (٩)', labelEn: 'Nesma Hayat (9)', icon: '🌿', count: 9 },
    { id: 'visceral', labelAr: 'تفريغ وصدمة (٦)', labelEn: 'Visceral & Tactile (6)', icon: '🪞', count: 6 },
    { id: 'projective', labelAr: 'استكشاف باطني (٣)', labelEn: 'Projective (3)', icon: '🔮', count: 3 },
    { id: 'quests', labelAr: 'تحديات وكروت (٣)', labelEn: 'Quests (3)', icon: '⚡', count: 3 },
    { id: 'somatic', labelAr: 'نفسية حركية (٦)', labelEn: 'Psychomotor (6)', icon: '🫨', count: 6 },
    { id: 'cognitive', labelAr: 'مواقف وتفكير (٩)', labelEn: 'Cognitive (9)', icon: '🧠', count: 9 },
    { id: 'all', labelAr: 'كل الألعاب (٣٦)', labelEn: 'All Games (36)', icon: '🎮', count: 36 },
  ];

  const filteredGames = ALL_36_GAMES.filter((game) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const match = 
        game.nameAr.toLowerCase().includes(q) ||
        game.nameEn.toLowerCase().includes(q) ||
        game.descAr.toLowerCase().includes(q) ||
        game.descEn.toLowerCase().includes(q) ||
        game.badgeAr.toLowerCase().includes(q);
      if (!match) return false;
    } else {
      // 2. Category Tab (when not searching)
      if (activeCategory !== 'all' && game.categoryKey !== activeCategory) {
        return false;
      }
    }

    // 3. Type Filter
    if (typeFilter !== 'all' && game.experienceType !== typeFilter) {
      return false;
    }

    return true;
  });

  const handleGameClick = (game: GameCatalogItem) => {
    soundManager.playSoftTap();
    onSelectGame(game.id, game.levelId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onBackToHome();
              }}
              className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            </button>
            <span className="text-stone-300 dark:text-stone-700">/</span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {isAr ? 'مكتبة الألعاب' : 'Games Library'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-serif">
            {isAr ? 'مكتبة ألعاب فكّر فيها 🎮' : 'Think About It Games Library 🎮'}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {isAr ? '٣٦ لعبة وتطبيقاً تفاعلياً مصممة لمرافقة عقلك ومشاعرك وجسدك' : '36 interactive experiences crafted for thoughts, emotions, and somatic safety'}
          </p>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => {
            soundManager.playSoftTap();
            onBackToHome();
          }}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto border border-stone-200 dark:border-stone-700"
        >
          {isAr ? '← العودة لمغامرتك' : '← Back to Adventure'}
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث في ٣٦ لعبة بالاسم، الوصف، أو الفكرة (مثال: مرآة، غضب، تنفس، جبل)...'
                : 'Search any of 36 games by name, topic, or keyword...'
            }
            className="w-full ps-10 pe-9 py-2.5 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl text-xs font-medium text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5 cursor-pointer"
              title={isAr ? 'مسح البحث' : 'Clear search'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Tabs Strip */}
        {!searchQuery && (
          <div className="flex items-center gap-1.5 p-1.5 bg-stone-100/90 dark:bg-stone-900/90 rounded-2xl overflow-x-auto text-xs font-bold border border-stone-200/70 dark:border-stone-800 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    setActiveCategory(cat.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-xs font-bold ${
                    isActive
                      ? 'bg-stone-900 dark:bg-emerald-700 text-white shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Sub-Filter: Experience Type Filter (هادئة / حركية / حسية / معرفية) */}
        <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium">
            <Filter className="w-3 h-3 text-stone-400" />
            <span>{isAr ? 'نوع التجربة:' : 'Type:'}</span>
            {[
              { id: 'all' as const, labelAr: 'الكل', labelEn: 'All' },
              { id: 'calm' as const, labelAr: 'هادئة 🌿', labelEn: 'Calm 🌿' },
              { id: 'somatic' as const, labelAr: 'حركية 🫨', labelEn: 'Movement 🫨' },
              { id: 'sensory' as const, labelAr: 'حسية 🪞', labelEn: 'Sensory 🪞' },
              { id: 'cognitive' as const, labelAr: 'معرفية 🧠', labelEn: 'Cognitive 🧠' },
            ].map((ft) => (
              <button
                key={ft.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setTypeFilter(ft.id);
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  typeFilter === ft.id
                    ? 'bg-stone-800 dark:bg-stone-700 text-white'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                {isAr ? ft.labelAr : ft.labelEn}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-stone-400 font-mono">
            {filteredGames.length} {isAr ? 'لعبة متاحة' : 'games'}
          </span>
        </div>
      </div>

      {/* Games Cards Grid */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
          <span className="text-3xl">🔍</span>
          <h3 className="font-bold text-stone-800 dark:text-stone-200 text-sm">
            {isAr ? 'لم يتم العثور على ألعاب مطابقة لهذا البحث' : 'No games match your search'}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            {isAr ? 'جرّب تغيير فئة البحث أو مسح الكلمات المكتوبة' : 'Try clearing filters or search terms'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
            }}
            className="px-4 py-2 bg-stone-900 dark:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            {isAr ? 'إعادة ضبط التصفية' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredGames.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={`${game.id}-${game.levelId || ''}`}
                className="text-start bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-3.5 group"
              >
                {/* Card Top: Icon, Duration, Badge */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{game.approxDuration}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                        {isAr ? game.badgeAr : game.badgeEn}
                      </span>
                    </div>
                  </div>

                  {/* Title & 1-line concise description */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {isAr ? game.nameAr : game.nameEn}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">
                      {isAr ? game.descAr : game.descEn}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Single Action Button to Play in Focused Mode */}
                <div className="pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 dark:text-stone-500">
                    {isAr ? game.interactionTypeAr : game.interactionTypeEn}
                  </span>

                  <button
                    onClick={() => handleGameClick(game)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-transform hover:scale-103 shadow-2xs"
                  >
                    <span>{isAr ? 'العب الآن' : 'Play'}</span>
                    <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
