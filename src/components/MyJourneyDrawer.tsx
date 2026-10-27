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
import { SectionGuideBanner } from './common/SectionGuideBanner';

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
          className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{isAr ? 'طباعة' : 'Print'}</span>
        </button>
      </div>

      {/* Section Guide Banner */}
      <SectionGuideBanner sectionId="my-journey" language={language} />

      <div className="text-center max-w-lg mx-auto space-y-1.5">
        <span className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
          {isAr ? 'خاطراتك ومحطات هدوئك' : 'Your Personal Sanctuary'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          {isAr ? 'لحظات الوعي في رحلتك 🌿' : 'Saved Moments in Your Journey 🌿'}
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {isAr
            ? 'كل لحظة حفظتها في ألعاب نسمة حياة تبقى هنا، مساحة آمنة لتتذكري ما تعلمته عن نفسك.'
            : 'All your saved reflections and insights are kept safely here for you.'}
        </p>
      </div>

      {moments.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-800 p-10 sm:p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center mx-auto text-3xl">
            📖
          </div>
          <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
            {isAr ? 'لا توجد لحظات محفوظة بعد' : 'No moments saved yet'}
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
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
              className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-3.5 relative group"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap border-b border-stone-100 dark:border-stone-800 pb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {m.gameTitle}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">{m.date}</span>
                </div>

                <button
                  onClick={() => handleDelete(m.id)}
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center text-stone-500 hover:text-rose-600 transition-colors p-1.5 cursor-pointer"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Quote */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/70 rounded-2xl border border-stone-200/70 dark:border-stone-800 text-sm sm:text-base font-serif font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
                «{m.quote}»
              </div>

              {/* Reflection */}
              {m.reflection && (
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-stone-600 dark:text-stone-300 block">
                    {isAr ? 'تأملك الشخصي:' : 'Your reflection:'}
                  </span>
                  <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
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
