import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, Compass } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface CipherGrandSecretModalProps {
  onClose: () => void;
  onSolveGrandSecret: () => void;
  isAlreadySolved: boolean;
}

export const CipherGrandSecretModal: React.FC<CipherGrandSecretModalProps> = ({
  onClose,
  onSolveGrandSecret,
  isAlreadySolved
}) => {
  const [solved, setSolved] = useState<boolean>(isAlreadySolved);
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);

  // The 3 threads to arrange in unified sequence
  const threads = [
    { id: 't_observe', title: 'المراقبة الهادئة للأفكار دون غرق', icon: '💎' },
    { id: 't_boundary', title: 'صون الحدود بصدق وحماية المساحة', icon: '📜' },
    { id: 't_gentle', title: 'الرفق بالذات والخطوة الصغيرة', icon: '🌸' }
  ];

  const correctOrder = ['t_gentle', 't_boundary', 't_observe'];

  const handleThreadClick = (id: string) => {
    soundManager.playClick();
    if (selectedOrder.includes(id)) {
      setSelectedOrder(selectedOrder.filter(item => item !== id));
    } else {
      const next = [...selectedOrder, id];
      setSelectedOrder(next);
      if (next.length === 3) {
        // Check if correct order
        const isCorrect = next.every((val, idx) => val === correctOrder[idx]);
        if (isCorrect) {
          soundManager.playSuccess();
          setSolved(true);
          onSolveGrandSecret();
        } else {
          soundManager.playIncorrect();
          setSelectedOrder([]);
        }
      }
    }
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in" dir="rtl">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 relative">
        {/* Glowing background */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700">
              🌟
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 rounded-md">
                السر الأعظم — تلاقي الخيوط الثلاثة
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100">
                خلاصة رحلة شفرة نسمة
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 bg-stone-100 dark:bg-stone-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {solved ? (
          <div className="space-y-5 relative z-10 text-center sm:text-start">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>الرسالة الكبرى المتكاملة:</span>
              </div>
              <p className="text-sm sm:text-base font-serif text-stone-900 dark:text-stone-100 leading-relaxed font-bold bg-white dark:bg-stone-900 p-4 rounded-xl border border-amber-200/60 dark:border-amber-800/60">
                «الرفق بالذات في خطواتك الصغيرة، وصون حدودك الشخصية بوعي، والمراقبة الهادئة لأفكارك العابرة... تصنع معاً سلام الحاضر وسكينة الروح.»
              </p>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              لقد أتممت ربط الدوائر الثلاث: حديقة البدايات، مكتبة الأسرار، وكهف التفكير. أنت الآن تملك بوصلتك الداخلية الكاملة؛ امشِ برفق وسلام.
            </p>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>احتفظ بالسر في قلبك واغلق النافذة</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 relative z-10">
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              لقد جمعت الأسرار الثلاثة الخفية من العوالم كلها. لكي تتكشف الرسالة الكبرى، رتّب الخيوط الثلاثة بالترتيب المنطقي للرحلة (من البداية إلى الإدراك العميق):
            </p>

            <div className="space-y-2.5">
              {threads.map((item) => {
                const index = selectedOrder.indexOf(item.id);
                const isSelected = index !== -1;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleThreadClick(item.id)}
                    className={`w-full p-4 rounded-2xl border text-start flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-600 font-bold shadow-md scale-[1.01]'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-white/80 dark:bg-stone-900 shadow-2xs">
                        {item.icon}
                      </span>
                      <span className="text-xs sm:text-sm font-bold">{item.title}</span>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-stone-400">
                اختر الخيوط الثلاثة بالتتابع الصحيح (1 ثم 2 ثم 3).
              </span>
              <button
                type="button"
                onClick={() => setSelectedOrder([])}
                className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
