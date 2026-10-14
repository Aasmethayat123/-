import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  ShoppingBag,
  ArrowRight,
  PackageCheck,
  Wind,
  Layers,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';

interface BrainTrafficBubblesGameProps {
  language: Language;
  onBackToMap?: () => void;
}

interface BubbleItem {
  id: string;
  text: string;
  category: string;
  icon: string;
}

const BUBBLES_DATA: BubbleItem[] = [
  { id: 'b1', text: 'الرد على رسالة مهمة', category: 'اليوم', icon: '✉️' },
  { id: 'b2', text: 'التفكير في شغل الأسبوع الجاي', category: 'مؤجل', icon: '📅' },
  { id: 'b3', text: 'شرب ماء وأخذ دواء', category: 'اليوم', icon: '💧' },
  { id: 'b4', text: 'خناقة الصباح مع فلان', category: 'تفريغ', icon: '💭' },
  { id: 'b5', text: 'تجهيز وجبة غداء بسيطة', category: 'اليوم', icon: '🥗' },
  { id: 'b6', text: 'مشروع التخرج أو خطة الشهر', category: 'مؤجل', icon: '📚' },
  { id: 'b7', text: 'ترتيب السرير والغرفة', category: 'اليوم', icon: '🛏️' },
  { id: 'b8', text: 'القلق على المستقبل عموماً', category: 'أفكار عابرة', icon: '🌫️' }
];

type ShelfDestination = 'today' | 'later' | 'release';

export const BrainTrafficBubblesGame: React.FC<BrainTrafficBubblesGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [viewMode, setViewMode] = useState<'shelves' | 'bubbles'>('shelves');
  
  // Shelves State: mapping item id -> destination
  const [assignments, setAssignments] = useState<Record<string, ShelfDestination>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Classic bubble selection
  const [gatheredIds, setGatheredIds] = useState<string[]>([]);
  
  const [completed, setCompleted] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const maxToGather = 3;

  // Classic Bubble Toggle
  const handleToggleBubble = (id: string) => {
    soundManager.playPop();
    if (gatheredIds.includes(id)) {
      setGatheredIds(gatheredIds.filter(i => i !== id));
    } else {
      if (gatheredIds.length < maxToGather) {
        const next = [...gatheredIds, id];
        setGatheredIds(next);
        if (next.length === maxToGather) {
          soundManager.playHarmonicAffirmation();
        }
      }
    }
  };

  // Shelves Placement Handlers
  const handleAssignItem = (itemId: string, destination: ShelfDestination) => {
    // If today basket, enforce max 3
    if (destination === 'today') {
      const todayCount = Object.entries(assignments).filter(([id, dest]) => dest === 'today' && id !== itemId).length;
      if (todayCount >= 3) {
        soundManager.playSoftTap();
        return;
      }
    }

    soundManager.playPop();
    setAssignments(prev => ({
      ...prev,
      [itemId]: destination
    }));
    setSelectedItemId(null);
  };

  const handleUnassignItem = (itemId: string) => {
    soundManager.playSoftTap();
    setAssignments(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const todayItems = BUBBLES_DATA.filter(b => assignments[b.id] === 'today');
  const laterItems = BUBBLES_DATA.filter(b => assignments[b.id] === 'later');
  const releaseItems = BUBBLES_DATA.filter(b => assignments[b.id] === 'release');
  const unassignedItems = BUBBLES_DATA.filter(b => !assignments[b.id]);

  const handleFinish = () => {
    setCompleted(true);
    soundManager.playHarmonicAffirmation();
    triggerConfetti(0.5, 0.4);
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'gather-bubbles',
      gameTitle: isAr ? 'لمّ اللي تقدر تلمّيه وخزانة العقل' : 'Gather What You Can & Mind Shelves',
      quote: isAr ? 'دماغك مش سلة مهملات لتشيل كل الدنيا في دقيقة واحدة.' : 'Pick what belongs to today, let the rest float safely.',
      reflection: userReflection || (isAr ? 'رتّبت أرفف عقلي واخترت ٣ أولويات فقط ليومي، واستودعت الباقي بسلام.' : 'Selected only 3 anchors for today.'),
      tag: isAr ? 'ترتيب الأفكار' : 'Mental Space'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setGatheredIds([]);
    setAssignments({});
    setSelectedItemId(null);
    setCompleted(false);
    setIsSaved(false);
    setUserReflection('');
  };

  const canFinish = viewMode === 'shelves' 
    ? todayItems.length > 0 
    : gatheredIds.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in select-none">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? '٤. لمّ اللي تقدر تلمّيه وترتيب الأرفف 🧺' : '4. Gather & Sort Shelves 🧺'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-stone-800 p-1 rounded-xl flex items-center gap-1 text-[11px] font-bold">
            <button
              onClick={() => { setViewMode('shelves'); soundManager.playSoftTap(); }}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'shelves' ? 'bg-sky-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>{isAr ? 'ترتيب الأرفف' : 'Shelves'}</span>
            </button>
            <button
              onClick={() => { setViewMode('bubbles'); soundManager.playSoftTap(); }}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'bubbles' ? 'bg-sky-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>🫧 {isAr ? 'فقاعات' : 'Bubbles'}</span>
            </button>
          </div>

          <span className="text-xs text-stone-400 font-mono">
            {viewMode === 'shelves' ? todayItems.length : gatheredIds.length} / 3
          </span>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
              {isAr ? 'تخفيف زحمة الدماغ وترتيب الأشياء والأولويات' : 'Mind Declutter & Tactile Sorting'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {viewMode === 'shelves'
                ? (isAr ? 'رتّبي مهامك وأفكارك على ۳ أرفف مريحة 🧺' : 'Organize your mind items into 3 peaceful shelves 🧺')
                : (isAr ? 'اختاري ۳ فقاعات بس تخص النهاردة 🫧' : 'Select only 3 bubbles for today 🫧')}
            </h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              {isAr
                ? 'مش مطلوب منك تخلصي كل مشاكل الحياة النهاردة. ضعي فقط ۳ أشياء في سلة اليوم، ودعي الباقي يذهب لصندوق الغد أو نهر التحرر بسلام.'
                : 'You don’t have to solve your entire life today. Place 3 items in today’s basket, and store the rest calmly.'}
            </p>
          </div>

          {viewMode === 'shelves' ? (
            /* SHELVES & TACTILE ORGANIZER VIEW */
            <div className="space-y-6 text-start">
              {/* Unassigned Items Pool */}
              {unassignedItems.length > 0 && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>{isAr ? 'الأفكار والمهام قيد الترتيب (انقري العنصر ثم اختر رفّه):' : 'Items to Sort (Tap item then select shelf):'}</span>
                    <span className="text-stone-400">{unassignedItems.length} {isAr ? 'متبقية' : 'left'}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {unassignedItems.map((item) => {
                      const isSelected = selectedItemId === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            soundManager.playSoftTap();
                            setSelectedItemId(isSelected ? null : item.id);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'border-sky-500 bg-sky-100/90 text-sky-950 ring-2 ring-sky-400 scale-105 shadow-sm'
                              : 'border-stone-200 bg-white hover:border-stone-400 text-stone-800'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedItemId && (
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-bold animate-fade-in border-t border-stone-200/80">
                      <span className="text-stone-500">{isAr ? 'أين تريد وضعه؟' : 'Place into:'}</span>
                      <button
                        onClick={() => handleAssignItem(selectedItemId, 'today')}
                        disabled={todayItems.length >= 3}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>{isAr ? '🧺 سلة اليوم' : 'Today Basket'}</span>
                      </button>
                      <button
                        onClick={() => handleAssignItem(selectedItemId, 'later')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <PackageCheck className="w-3 h-3" />
                        <span>{isAr ? '📦 صندوق الاستيداع للغد' : 'Tomorrow Box'}</span>
                      </button>
                      <button
                        onClick={() => handleAssignItem(selectedItemId, 'release')}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <Wind className="w-3 h-3" />
                        <span>{isAr ? '🕊️ نهر التحرر' : 'Release Stream'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Three Tactile Shelves & Baskets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Today Basket */}
                <div className="p-4 bg-emerald-50/70 rounded-2xl border-2 border-emerald-300 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-emerald-700" />
                      <span>{isAr ? 'سلة اليوم 🧺' : 'Today’s Basket'}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                      {todayItems.length} / 3
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    {isAr ? 'أولويات أنجزها اليوم فقط' : 'Top 3 anchors for today'}
                  </p>

                  <div className="min-h-24 space-y-1.5">
                    {todayItems.length === 0 ? (
                      <div className="text-[11px] text-stone-400 py-6 text-center italic">
                        {isAr ? 'فارغ (أقصى شيء ٣)' : 'Empty (max 3)'}
                      </div>
                    ) : (
                      todayItems.map(item => (
                        <div
                          key={item.id}
                          className="p-2 bg-white rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-950 flex items-center justify-between shadow-xs animate-scale-in"
                        >
                          <span className="truncate">{item.icon} {item.text}</span>
                          <button
                            onClick={() => handleUnassignItem(item.id)}
                            className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                            title={isAr ? 'إرجاع للترتيب' : 'Remove'}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Later Box */}
                <div className="p-4 bg-amber-50/70 rounded-2xl border-2 border-amber-300 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <PackageCheck className="w-4 h-4 text-amber-700" />
                      <span>{isAr ? 'صندوق الاستيداع 📦' : 'Tomorrow Box'}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                      {laterItems.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    {isAr ? 'محفوظ بأمان للأيام القادمة' : 'Safe storage for future'}
                  </p>

                  <div className="min-h-24 space-y-1.5">
                    {laterItems.length === 0 ? (
                      <div className="text-[11px] text-stone-400 py-6 text-center italic">
                        {isAr ? 'فارغ حالياً' : 'Empty'}
                      </div>
                    ) : (
                      laterItems.map(item => (
                        <div
                          key={item.id}
                          className="p-2 bg-white rounded-xl border border-amber-200 text-xs font-semibold text-amber-950 flex items-center justify-between shadow-xs animate-scale-in"
                        >
                          <span className="truncate">{item.icon} {item.text}</span>
                          <button
                            onClick={() => handleUnassignItem(item.id)}
                            className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                            title={isAr ? 'إرجاع للترتيب' : 'Remove'}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. Release Stream */}
                <div className="p-4 bg-sky-50/70 rounded-2xl border-2 border-sky-300 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                      <Wind className="w-4 h-4 text-sky-700" />
                      <span>{isAr ? 'نهر التحرر 🕊️' : 'Release Stream'}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-200/80 text-sky-900">
                      {releaseItems.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    {isAr ? 'أفكار وقلق أتركه يعوم بسلام' : 'Thoughts drifting away'}
                  </p>

                  <div className="min-h-24 space-y-1.5">
                    {releaseItems.length === 0 ? (
                      <div className="text-[11px] text-stone-400 py-6 text-center italic">
                        {isAr ? 'فارغ حالياً' : 'Empty'}
                      </div>
                    ) : (
                      releaseItems.map(item => (
                        <div
                          key={item.id}
                          className="p-2 bg-white rounded-xl border border-sky-200 text-xs font-semibold text-sky-950 flex items-center justify-between shadow-xs animate-scale-in"
                        >
                          <span className="truncate">{item.icon} {item.text}</span>
                          <button
                            onClick={() => handleUnassignItem(item.id)}
                            className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                            title={isAr ? 'إرجاع للترتيب' : 'Remove'}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CLASSIC BUBBLES INTERACTIVE GRID */
            <div className="py-4 grid grid-cols-2 gap-3 max-w-lg mx-auto">
              {BUBBLES_DATA.map((bubble) => {
                const isGathered = gatheredIds.includes(bubble.id);

                return (
                  <button
                    key={bubble.id}
                    onClick={() => handleToggleBubble(bubble.id)}
                    className={`p-4 rounded-3xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-center space-y-1 shadow-xs transform hover:scale-102 ${
                      isGathered
                        ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-400 shadow-md'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span className="text-2xl">{isGathered ? '✨' : '🫧'}</span>
                    <span className="text-xs sm:text-sm font-semibold leading-tight">{bubble.text}</span>
                    <span className="text-[10px] text-stone-400">{bubble.category}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Basket Footer */}
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 max-w-md mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-sky-900 font-bold">
              <ShoppingBag className="w-4 h-4 text-sky-700" />
              <span>
                {viewMode === 'shelves'
                  ? (isAr ? `في سلة يومك: ${todayItems.length} من 3` : `In today’s basket: ${todayItems.length} of 3`)
                  : (isAr ? `في سلتك اليوم: ${gatheredIds.length} من ${maxToGather}` : `In your basket: ${gatheredIds.length} of ${maxToGather}`)}
              </span>
            </div>

            <button
              disabled={!canFinish}
              onClick={handleFinish}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                canFinish
                  ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer shadow-xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isAr ? 'اكتفيت بهذا الترتيب اليوم ✓' : 'Done For Today ✓'}
            </button>
          </div>
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto text-3xl">
            🧺
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'هدأت الزحمة وترتّبت الأفكار 🌿' : 'The Clutter Has Settled 🌿'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«الحياة تُعاش يوماً بيوم، وساعتك تسع لشيء واحد فقط في اللحظة. تركتِ الباقي يعوم واستودعتِ الهموم، واحتفظتِ بما في وسعك».'
                : 'Life is lived day by day. You chose what fits your hands today.'}
            </p>
          </div>

          {/* Reflection Input */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 block">
              {isAr ? 'سؤال خفيف: كيف يبدو شعور دماغك الآن بعد ترتيب الأرفف وتخفيف الحمل؟' : 'How does your head feel having sorted your mental shelves?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي شعورك الآن...' : 'A note on how you feel...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-sky-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-700 hover:bg-sky-800 disabled:bg-sky-300 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة' : 'Replay'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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
