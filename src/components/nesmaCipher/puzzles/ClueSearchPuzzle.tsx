import React, { useState } from 'react';
import { ClueSearchData } from "../../../types/nesmaCipher";
import { CheckCircle2, Search, Sparkles, Eye, X } from 'lucide-react';
import { soundManager } from "../../../utils/audio";
import { SafeCipherImage } from "../SafeCipherImage";

interface ClueSearchPuzzleProps {
  data: ClueSearchData;
  onSolve: () => void;
  onError?: (msg: string) => void;
}

export const ClueSearchPuzzle: React.FC<ClueSearchPuzzleProps> = ({ data, onSolve }) => {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [showFullScene, setShowFullScene] = useState<boolean>(false);
  const [inspectingItem, setInspectingItem] = useState<{
    id: string;
    nameAr: string;
    descriptionAr: string;
    icon: string;
  } | null>(null);
  const [inspectedIds, setInspectedIds] = useState<string[]>([]);

  const totalItems = data.hiddenItems.length;

  const handleHotspotClick = (item: { id: string; nameAr: string; descriptionAr: string; icon: string }) => {
    if (foundIds.includes(item.id) || isSolved) return;
    soundManager.playClick();
    setInspectingItem(item);
  };

  const handleConfirmInspection = () => {
    if (!inspectingItem || isSolved) return;
    soundManager.playCorrect();

    const currentId = inspectingItem.id;
    const nextInspected = inspectedIds.includes(currentId) ? inspectedIds : [...inspectedIds, currentId];
    setInspectedIds(nextInspected);

    const nextFound = foundIds.includes(currentId) ? foundIds : [...foundIds, currentId];
    setFoundIds(nextFound);
    setInspectingItem(null);

    if (nextFound.length === totalItems) {
      setIsSolved(true);
      setTimeout(() => {
        onSolve();
      }, 900);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 max-w-lg mx-auto w-full">
      {/* Instructions & Tracker */}
      <div className="text-center space-y-1.5 w-full">
        <p className="text-stone-700 dark:text-stone-300 text-sm font-medium">
          {data.instructionsAr}
        </p>
        <div className="flex items-center justify-between text-xs text-stone-500 bg-stone-100 dark:bg-stone-800/80 px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span>تم فحص وجمع {foundIds.length} من {totalItems} أدلة</span>
          </div>
          <button
            type="button"
            onClick={() => setShowFullScene(true)}
            className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة المشهد بدقة كاملة 🔍</span>
          </button>
        </div>
      </div>

      {/* Interactive Scene Canvas — explicit paddingBottom:100% guarantees 1:1 square on all mobile WebViews */}
      <div
        dir="ltr"
        className="relative w-full max-w-[440px] rounded-2xl overflow-hidden shadow-xl border border-stone-700/60 bg-stone-800 select-none touch-manipulation"
        style={{ paddingBottom: 'min(100%, 440px)' }}
      >
        <div className="absolute inset-0 w-full h-full">
          {/* Background Image */}
          <SafeCipherImage
            src={data.sceneBackground}
            alt="مشهد البحث عن الأدلة"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Hotspots */}
          {data.hiddenItems.map((item) => {
            const isFound = foundIds.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleHotspotClick(item)}
                disabled={isFound || isSolved}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isFound
                    ? 'bg-emerald-600/90 text-white ring-4 ring-emerald-300 scale-110 shadow-lg'
                    : 'bg-white/20 hover:bg-amber-400/40 backdrop-blur-xs ring-2 ring-white/60 animate-pulse hover:scale-125'
                }`}
                title={isFound ? item.nameAr : 'انقر لفحص الدليل'}
                aria-label={item.nameAr}
              >
                <span className="text-xl drop-shadow">{item.icon}</span>
              </button>
            );
          })}

          {/* Success overlay */}
          {isSolved && (
            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
              <span className="text-base font-bold text-white">تم ربط جميع الأدلة بنجاح!</span>
            </div>
          )}
        </div>
      </div>

      {/* Checklist of Items */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {data.hiddenItems.map((item) => {
          const isFound = foundIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                isFound
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <span className={`text-xs font-bold block truncate ${isFound ? 'line-through opacity-75' : ''}`}>
                  {item.nameAr}
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  {isFound ? 'تم فحص الدليل ✓' : 'انقر للفحص'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspectable Clue Modal / Popup */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in" dir="rtl">
          <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto text-3xl shadow-inner">
              {inspectingItem.icon}
            </div>

            <div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 rounded-md">
                فحص عميق للدليل
              </span>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100 mt-1">
                {inspectingItem.nameAr}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700">
              {inspectingItem.descriptionAr}
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleConfirmInspection}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>تأكيد فحص الدليل وجمعه ✓</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full High-Resolution Scene Preview Modal */}
      {showFullScene && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in" dir="rtl">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold">معاينة مشهد البحث كاملًا بدقة عالية</h3>
                  <span className="text-[11px] text-stone-400">تأمّل تفاصيل اللوحة للعثور على مواضع الأدلة</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFullScene(false)}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 overflow-auto bg-stone-950 p-2 sm:p-4 flex items-center justify-center">
              <SafeCipherImage
                src={data.sceneBackground}
                alt="المشهد كاملًا"
                className="max-h-[65vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-stone-800"
              />
            </div>

            <div className="p-4 border-t border-stone-800 bg-stone-900/90 flex items-center justify-between gap-3 text-stone-300 text-xs">
              <span>الأدلة موزعة بعناية داخل اللوحة؛ انقر على العناصر المشعة في المشهد الرئيسي لفحصها.</span>
              <button
                type="button"
                onClick={() => setShowFullScene(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                العودة للغز
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
