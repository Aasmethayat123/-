import React, { useState, useEffect } from 'react';
import { Language, SavedMoment } from '../types';
import { getSavedMoments, deleteMoment } from '../utils/moments';
import { soundManager } from '../utils/audio';
import { 
  Bookmark, 
  Trash2, 
  Printer, 
  Sparkles, 
  Compass, 
  Heart,
  ArrowRight
} from 'lucide-react';

interface MyJourneyDrawerProps {
  language: Language;
  onBackToMap?: () => void;
}

export const MyJourneyDrawer: React.FC<MyJourneyDrawerProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [moments, setMoments] = useState<SavedMoment[]>([]);

  useEffect(() => {
    setMoments(getSavedMoments());
  }, []);

  const handleDelete = (id: string) => {
    soundManager.playSoftTap();
    deleteMoment(id);
    setMoments(prev => prev.filter(m => m.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
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
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {isAr ? 'دفتر رحلتي واللحظات المحفوظة 📖' : 'My Journey Diary 📖'}
          </span>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{isAr ? 'طباعة' : 'Print'}</span>
        </button>
      </div>

      <div className="text-center max-w-md mx-auto space-y-1">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
          {isAr ? 'خاطراتك ومحطات هدوئك' : 'Your Personal Sanctuary'}
        </span>
        <h2 className="text-2xl font-extrabold text-stone-900">
          {isAr ? 'لحظات الوعي في رحلتك 🌿' : 'Saved Moments in Your Journey 🌿'}
        </h2>
        <p className="text-xs text-stone-500">
          {isAr
            ? 'كل لحظة حفظتها في ألعاب نسمة حياة تبقى هنا، مساحة آمنة لتتذكري ما تعلمته عن نفسك.'
            : 'All your saved reflections and insights are kept safely here for you.'}
        </p>
      </div>

      {moments.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-stone-300 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-3xl">
            📖
          </div>
          <h3 className="text-base font-bold text-stone-700">
            {isAr ? 'لا توجد لحظات محفوظة بعد' : 'No moments saved yet'}
          </h3>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            {isAr
              ? 'عند الانتهاء من أي لعبة، انقري على «احفظ اللحظة في رحلتي» لتسجيل تأملاتك هنا.'
              : 'Complete any game and tap "Save Moment" to record your reflections here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {moments.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-sm space-y-3 relative group"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {m.gameTitle}
                  </span>
                  <span className="text-[11px] text-stone-400">{m.date}</span>
                </div>

                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-stone-300 hover:text-rose-600 transition-colors p-1"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Quote */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs font-serif font-bold text-stone-800 italic">
                «{m.quote}»
              </div>

              {/* Reflection */}
              {m.reflection && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    {isAr ? 'تأملك الشخصي:' : 'Your reflection:'}
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {m.reflection}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
