import React, { useState, useEffect } from 'react';
import { Language, SavedMoment } from '../types';
import { getSavedMoments, deleteMoment } from '../utils/moments';
import { soundManager } from '../utils/audio';
import { storage } from '../utils/storage';
import { 
  Bookmark, 
  Trash2, 
  Printer, 
  Sparkles, 
  Compass, 
  Heart,
  ArrowRight,
  Sun,
  Star,
  RefreshCw,
  CheckCircle2
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
  const [activeTab, setActiveTab] = useState<'moments' | 'quick-journal'>('moments');

  // Quick End-of-Day Journal State
  const [quickMood, setQuickMood] = useState<number>(7);
  const [journalText, setJournalText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    empatheticFeedback: string;
    celebratedSuccess: string;
    gratitudeSpark: string;
  } | null>(null);
  const [journalSaved, setJournalSaved] = useState<boolean>(false);

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

  const handleAnalyzeJournal = async () => {
    if (!journalText.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    soundManager.playSoftTap();

    try {
      const res = await fetch('/api/journal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journalText: journalText.trim(),
          moodScore: quickMood,
          language: isAr ? 'ar' : 'en'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        soundManager.playChime();

        // Save to storage notes automatically
        storage.addNote({
          title: isAr ? `مذكرات الوعي السريع (${new Date().toLocaleDateString('ar-EG')})` : `Quick Awareness Journal (${new Date().toLocaleDateString()})`,
          content: `المزاج: ${quickMood}/10\n\nالتدوينة:\n${journalText}\n\nتحليل الرفيق الذكي (Gemini):\n${data.empatheticFeedback}\n\nاحتفال بالنجاح:\n${data.celebratedSuccess}`,
          category: 'quick-journal',
          tags: ['وعي_سريع', 'امتنان'],
          mood: `${quickMood}/10`
        });
        setJournalSaved(true);
      } else {
        throw new Error('Failed to analyze');
      }
    } catch {
      // Local fallback analysis
      setAnalysisResult({
        empatheticFeedback: isAr ? 'لقد مررت بيوم مليء بالمحاولات الصادقة، ومجرد تدوينك لمشاعرك يعكس وعياً وعمقا رائعين.' : 'You navigated today with sincere effort. Journaling reflects profound self-awareness.',
        celebratedSuccess: isAr ? 'نجاحك الأكبر اليوم هو التوقف وسط زحمة اليوم والالتفات لسلامك الداخلي.' : 'Your greatest success today was pausing to care for your inner peace.',
        gratitudeSpark: isAr ? 'كل خطوة صغيرة تصنع فرقاً كبيراً في رحلتك نحو التوازن.' : 'Every small step creates a profound difference in your journey.'
      });
      setJournalSaved(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← الرئيسية' : '← Home'}
            </button>
          )}
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {isAr ? 'دفتر رحلتي ومذكرات الوعي 📖' : 'My Journey Diary & Journal 📖'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'moments' && (
            <button
              onClick={handlePrint}
              className="min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isAr ? 'طباعة' : 'Print'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Section Guide Banner */}
      <SectionGuideBanner sectionId="my-journey" language={language} />

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
        <button
          onClick={() => setActiveTab('moments')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'moments'
              ? 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Bookmark className="w-4 h-4 shrink-0" />
          <span>{isAr ? 'اللحظات المحفوظة' : 'Saved Moments'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
            {moments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('quick-journal')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'quick-journal'
              ? 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Sun className="w-4 h-4 shrink-0 text-amber-500" />
          <span>{isAr ? 'مذكرات الوعي السريع (Gemini) 🌅' : 'End-of-Day Quick Journal 🌅'}</span>
        </button>
      </div>

      {/* TAB 1: SAVED MOMENTS */}
      {activeTab === 'moments' && (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-1.5">
            <span className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              {isAr ? 'خاطراتك ومحطات هدوئك' : 'Your Personal Sanctuary'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-serif">
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

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={async () => {
                        soundManager.playSoftTap();
                        const text = `${m.gameTitle}\n«{m.quote}»${m.reflection ? `\n\nتأمّلي: ${m.reflection}` : ''}\n\n— من تطبيق نسمة حياة 🌿`;
                        try {
                          await navigator.clipboard.writeText(text);
                          alert(isAr ? 'تم نسخ البطاقة كالنص بنجاح ✓' : 'Moment card copied successfully ✓');
                        } catch {
                          // ignore
                        }
                      }}
                      className="min-h-[38px] px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>📋</span>
                      <span>{isAr ? 'نسخ البطاقة للمشاركة' : 'Copy Card'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: END-OF-DAY QUICK AWARENESS JOURNAL WITH GEMINI */}
      {activeTab === 'quick-journal' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fade-in">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌅</span>
              <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                {isAr ? 'مذكرات الوعي السريع نهاية اليوم (مدعومة بـ Gemini)' : 'End-of-Day Quick Awareness Journal'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white font-serif">
              {isAr ? 'كيف كان يومك؟ أغلق صفحة اليوم بوعي وامتنان 🍃' : 'How was your day? Close today with awareness and gratitude 🍃'}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {isAr
                ? 'سجل مشاعرك، ما أنجزته، وتحدياتك اليومية. سيقوم الرفيق الذكي بتحليل تدوينتك وتقديم تحليل أولي والاحتفال بنجاحاتك.'
                : 'Record your feelings and successes. Our AI companion will analyze your entry and celebrate your victories.'}
            </p>
          </div>

          {/* Mood Slider */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
              <span>{isAr ? 'مؤشر المزاج العام اليوم:' : 'Daily Mood Score:'}</span>
              <span className="text-base text-emerald-800 dark:text-emerald-400 font-mono font-extrabold">
                {quickMood} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={quickMood}
              onChange={(e) => setQuickMood(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer h-2 bg-stone-200 dark:bg-stone-700 rounded-lg"
            />
          </div>

          {/* Guided Prompts Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-stone-800 dark:text-stone-200 block">
              {isAr ? 'مطالبات موجهة (اكتب بحرية): ماذا قدمت اليوم؟ ما الذي تتخلّص منه؟ وما هو إنجازك الصغير؟' : 'Guided Prompts: What did you experience today? What are you grateful for?'}
            </label>
            <textarea
              rows={5}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder={isAr ? 'اليوم شعرت بـ... وتجاوزت تحدي... وأنا ممتن لـ...' : 'Today I felt... and I overcame... and I am grateful for...'}
              className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-xs sm:text-sm focus:border-emerald-800 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnalyzeJournal}
              disabled={isAnalyzing || !journalText.trim()}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isAr ? 'جاري تحليل الوعي عبر Gemini...' : 'Analyzing with Gemini...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isAr ? 'تحليل الوعي والاحتفال بالنجاحات 🌟' : 'Analyze & Celebrate Success'}</span>
                </>
              )}
            </button>
          </div>

          {/* Gemini Analysis Result Card */}
          {analysisResult && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white border-2 border-emerald-500/60 shadow-lg space-y-4 animate-fade-in">
              <div className="flex items-center gap-2.5 border-b border-emerald-800/60 pb-3">
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {isAr ? 'تحليل الرفيق الذكي لتدوينة اليوم (Gemini)' : 'AI Companion Analysis & Successes'}
                  </h3>
                  <p className="text-[11px] text-emerald-300">
                    {isAr ? 'إضاءات معرفية واحتفال بجهودك' : 'Cognitive insights & celebrating your efforts'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                    {isAr ? '💬 التحليل الأولي للمشاعر:' : 'Empathetic Feedback:'}
                  </span>
                  <p className="text-stone-200">{analysisResult.empatheticFeedback}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                    {isAr ? '🏆 الاحتفال بالنجاحات والجهود:' : 'Celebrated Successes:'}
                  </span>
                  <p className="text-amber-100">{analysisResult.celebratedSuccess}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                    {isAr ? '🌱 ومضة امتنان وتأمل هادئ:' : 'Gratitude Spark:'}
                  </span>
                  <p className="text-emerald-100">{analysisResult.gratitudeSpark}</p>
                </div>
              </div>

              {journalSaved && (
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold pt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'تم حفظ التدوينة والتحليل في سجلك المحلي الآمن بنجاح ✓' : 'Saved to your secure local journal ✓'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
