import React, { useState, useEffect } from 'react';
import { Language, GameMode } from '../types';
import { soundManager } from '../utils/audio';
import { 
  WORKSHOPS_CATALOG, 
  WorkshopItem 
} from '../data/workshopsData';
import { 
  Users, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Printer, 
  Lightbulb, 
  MessageCircle, 
  Brain, 
  Sparkles,
  ArrowRight,
  Gamepad2,
  Target,
  Home,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { SectionGuideBanner } from './common/SectionGuideBanner';

interface WorkshopModeProps {
  language: Language;
  onNavigateGame?: (gameId: GameMode) => void;
  onBackToHome?: () => void;
}

const WORKSHOP_NOTES_STORAGE_KEY = 'fakkerfeha_workshop_notes_v1';
const WORKSHOP_ACTIVE_ID_STORAGE_KEY = 'fakkerfeha_workshop_active_id_v1';

export const WorkshopMode: React.FC<WorkshopModeProps> = ({ 
  language,
  onNavigateGame,
  onBackToHome
}) => {
  const isAr = language === 'ar';

  // 1. Persistent Selected Workshop ID
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(WORKSHOP_ACTIVE_ID_STORAGE_KEY);
      if (saved && WORKSHOPS_CATALOG.some(w => w.id === saved)) {
        return saved;
      }
    } catch {}
    return WORKSHOPS_CATALOG[0].id;
  });

  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Active workshop item
  const activeWorkshop = WORKSHOPS_CATALOG.find(w => w.id === selectedWorkshopId) || WORKSHOPS_CATALOG[0];

  // 2. Persistent Group Notes mapped per workshop ID
  const [allWorkshopNotes, setAllWorkshopNotes] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const raw = localStorage.getItem(WORKSHOP_NOTES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {}
    // Initialize default fallback structure
    const initial: Record<string, Record<string, string>> = {};
    WORKSHOPS_CATALOG.forEach(w => {
      initial[w.id] = {};
      w.questions.forEach(q => {
        initial[w.id][q.key] = '';
      });
    });
    return initial;
  });

  // Save notes whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(WORKSHOP_NOTES_STORAGE_KEY, JSON.stringify(allWorkshopNotes));
    } catch {}
  }, [allWorkshopNotes]);

  // Save active workshop whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WORKSHOP_ACTIVE_ID_STORAGE_KEY, selectedWorkshopId);
    } catch {}
  }, [selectedWorkshopId]);

  // Current notes for the active workshop
  const currentNotes = allWorkshopNotes[activeWorkshop.id] || {};

  const handleNoteChange = (key: string, value: string) => {
    setAllWorkshopNotes(prev => ({
      ...prev,
      [activeWorkshop.id]: {
        ...(prev[activeWorkshop.id] || {}),
        [key]: value
      }
    }));
  };

  const handleClearCurrentNotes = () => {
    soundManager.playSoftTap();
    const updated = { ...allWorkshopNotes };
    const emptyNotes: Record<string, string> = {};
    activeWorkshop.questions.forEach(q => {
      emptyNotes[q.key] = '';
    });
    updated[activeWorkshop.id] = emptyNotes;
    setAllWorkshopNotes(updated);
    setShowClearConfirm(false);
  };

  // 3. Facilitator Timer State & Logic
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min default interval
  const [initialDuration, setInitialDuration] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            soundManager.playHarmonicAffirmation();
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handleStartPause = () => {
    soundManager.playSoftTap();
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = (seconds: number) => {
    soundManager.playSoftTap();
    setIsTimerRunning(false);
    setInitialDuration(seconds);
    setTimerSeconds(seconds);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrint = () => {
    soundManager.playSoftTap();
    window.print();
  };

  const filteredWorkshops = categoryFilter === 'all'
    ? WORKSHOPS_CATALOG
    : WORKSHOPS_CATALOG.filter(w => w.categoryKey === categoryFilter);

  const learningCycles = [
    { name: isAr ? 'العب' : 'Play', desc: isAr ? 'خوض سيناريوهات اللعبة التفاعلية' : 'Immerse in interactive game situations', icon: Play },
    { name: isAr ? 'لاحظ' : 'Notice', desc: isAr ? 'رصد الأفكار التلقائية وإشارات الجسد' : 'Observe automatic thoughts & body signals', icon: Lightbulb },
    { name: isAr ? 'ناقش' : 'Discuss', desc: isAr ? 'تبادل وجهات النظر في مجموعات صغيرة' : 'Share and compare in small groups', icon: MessageCircle },
    { name: isAr ? 'افهم' : 'Understand', desc: isAr ? 'إدراك الرابط بين الفكرة والشعور' : 'Connect thoughts, emotions, and actions', icon: Brain },
    { name: isAr ? 'تدرّب' : 'Practice', desc: isAr ? 'تطبيق وقفة الأنفاس والتفسير البديل يومياً' : 'Apply pause and reframing to real life', icon: Sparkles },
  ];

  const ActiveIcon = activeWorkshop.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-9 space-y-7 animate-fade-in print:p-0 print:space-y-4 print:max-w-none">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-3 print:hidden">
        <div className="flex items-center gap-2">
          {onBackToHome && (
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onBackToHome();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            </button>
          )}
          {onBackToHome && <span className="text-stone-300 dark:text-stone-700">/</span>}
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {isAr ? 'دليل ورش العمل التفاعلية (٦ ورش)' : 'Interactive Workshops Guide (6 Workshops)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            title={isAr ? 'طباعة الاستمارة أو حفظها كملف PDF عبر نافذة المتصفح' : 'Print sheet or save as PDF via browser print window'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 transition-all cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isAr ? 'طباعة / حفظ كـ PDF' : 'Print / Save as PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5 print:hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/60 shadow-2xs">
          <Users className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>{isAr ? 'مبادرة «نسمة حياة» — دليل التيسير الجماعي 🌿' : 'Nesma Hayat — Group Facilitation Guide 🌿'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          {isAr ? 'مكتبة ورش العمل التفاعلية والجلسات الجماعية' : 'Interactive Workshops & Group Dialogue Hub'}
        </h1>
        <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto">
          {isAr
            ? 'ست ورش عمل متخصصة مبنية على المدارس النفسية المعتمدة، تحول تجربة الألعاب التفاعلية إلى حوارات جماعية مثمرة تبني الوعي الذاتي والتفهم الإنساني.'
            : 'Six specialized psycho-educational workshops converting interactive exercises into fruitful group dialogues that build self-awareness and mutual understanding.'}
        </p>
      </div>

      {/* Section Guide Banner */}
      <SectionGuideBanner sectionId="workshop" language={language} />

      {/* ================================================================ */}
      {/* PSYCHO-EDUCATIONAL & VOLUNTARY PARTICIPATION NOTICE */}
      {/* ================================================================ */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/85 dark:bg-amber-950/35 border border-amber-200/90 dark:border-amber-800/60 flex items-start gap-3 text-sm text-amber-950 dark:text-amber-200 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <strong className="font-bold block">
            {isAr ? 'تنبيه تثقيفي ومشاركة اختيارية:' : 'Psycho-Educational & Voluntary Notice:'}
          </strong>
          <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
            {isAr
              ? 'هذه الورش والتمارين مصممة لأغراض التوعية والتطوير الذاتي التثقيفي، ولا تُعد علاجاً نفسياً مضموناً أو بديلاً عن الرعاية السريرية المتخصصة. المشاركة في كافة الأنشطة والأسئلة اختيارية تماماً؛ ويحق لأي مشارك تجاوز أي تمرين أو سؤال يسبب له انزعاجاً أو ضيقاً.'
              : 'These workshops and exercises are designed for psycho-educational self-growth and awareness; they are not guaranteed clinical treatments or substitutes for professional healthcare. Participation is strictly voluntary, and any participant may freely skip any prompt or exercise causing discomfort.'}
          </p>
        </div>
      </div>

      {/* ================================================================ */}
      {/* WORKSHOPS SELECTOR CAROUSEL & FILTERS */}
      {/* ================================================================ */}
      <div className="space-y-3 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              {isAr ? 'اختر ورشة العمل للتيسير والتدوين:' : 'Select Workshop to Facilitate:'}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              ({WORKSHOPS_CATALOG.length} {isAr ? 'ورش جاهزة' : 'Ready Workshops'})
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 text-[11px] font-bold overflow-x-auto scrollbar-none pb-0.5">
            {[
              { id: 'all', label: isAr ? 'الكل (٦)' : 'All (6)' },
              { id: 'cognitive', label: 'CBT' },
              { id: 'boundaries', label: isAr ? 'الحدود' : 'Boundaries' },
              { id: 'compassion', label: 'CFT' },
              { id: 'defusion', label: 'ACT' },
              { id: 'communication', label: 'NVC' },
              { id: 'somatic', label: isAr ? 'جسدية' : 'Somatic' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setCategoryFilter(tab.id);
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  categoryFilter === tab.id
                    ? 'bg-stone-900 dark:bg-emerald-700 text-white'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 bg-stone-100/60 dark:bg-stone-850'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Workshops Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredWorkshops.map((workshop) => {
            const isSelected = workshop.id === selectedWorkshopId;
            const Icon = workshop.icon;
            return (
              <button
                key={workshop.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setSelectedWorkshopId(workshop.id);
                  setTimerSeconds(300);
                  setIsTimerRunning(false);
                }}
                className={`text-start p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                  isSelected
                    ? 'bg-white dark:bg-stone-900 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-white dark:bg-stone-900/60 border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/60 shadow-2xs'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${workshop.themeColor.gradient} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                        {isAr ? workshop.categoryLabelAr : workshop.categoryLabelEn}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{workshop.suggestedDurationMinutes}د</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                      {isAr ? `الورشة رقم ${workshop.number}` : `Workshop #${workshop.number}`}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {isAr ? workshop.titleAr.replace(/^ورشة:\s*/, '') : workshop.titleEn.replace(/^Workshop:\s*/, '')}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {isAr ? workshop.subtitleAr : workshop.subtitleEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80 text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                  <span>{isSelected ? (isAr ? 'الورشة الحالية ✓' : 'Selected ✓') : (isAr ? 'عرض وتيسير الورشة' : 'Open Workshop')}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* ACTIVE WORKSHOP FULL FACILITATION CARD */}
      {/* ================================================================ */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 p-5 sm:p-8 space-y-7 shadow-xs print:border-none print:p-0 print:shadow-none">
        {/* Printable Formal Header (visible only on paper or PDF print) */}
        <div className="hidden print:block border-b-2 border-stone-900 pb-3 mb-4 text-center space-y-1">
          <span className="text-xs font-bold text-stone-600 block">
            {isAr ? 'مبادرة «نسمة حياة» للتوعية النفسية والنمو الذاتي' : 'Nesma Hayat — Mental Health & Personal Growth'}
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            {isAr ? activeWorkshop.titleAr : activeWorkshop.titleEn}
          </h2>
          <div className="flex items-center justify-center gap-6 text-xs text-stone-700 pt-1 font-serif">
            <span>{isAr ? 'اسم المجموعة / المشارك: ____________________' : 'Participant / Group: ____________________'}</span>
            <span>{isAr ? 'التاريخ: ____________________' : 'Date: ____________________'}</span>
            <span>{isAr ? 'الميسر: ____________________' : 'Facilitator: ____________________'}</span>
          </div>
        </div>

        {/* Active Workshop Banner Header (Screen) */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5 print:hidden">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${activeWorkshop.themeColor.gradient} text-white flex items-center justify-center shadow-2xs`}>
                <ActiveIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                {isAr ? activeWorkshop.categoryLabelAr : activeWorkshop.categoryLabelEn}
              </span>
              <span className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isAr ? `المدة المقترحة: ${activeWorkshop.suggestedDurationMinutes} دقيقة` : `Duration: ${activeWorkshop.suggestedDurationMinutes} mins`}</span>
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              {isAr ? activeWorkshop.titleAr : activeWorkshop.titleEn}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {isAr ? activeWorkshop.subtitleAr : activeWorkshop.subtitleEn}
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500 dark:text-stone-400">
              <span className="font-bold text-stone-700 dark:text-stone-300">{isAr ? 'الفئة المستهدفة:' : 'Target Audience:'}</span>
              <span>{isAr ? activeWorkshop.targetAudienceAr : activeWorkshop.targetAudienceEn}</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center sm:flex-col gap-2">
            <button
              onClick={handlePrint}
              title={isAr ? 'طباعة الاستمارة أو حفظها كـ PDF عبر خيار الحفظ بالمتصفح' : 'Print sheet or save as PDF via browser print window'}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-900 dark:bg-emerald-700 hover:bg-stone-800 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isAr ? 'طباعة / حفظ كـ PDF' : 'Print / Save PDF'}</span>
            </button>
            <span className="text-[10px] text-stone-400 dark:text-stone-500 text-center hidden sm:block">
              {isAr ? 'عبر نافذة الطباعة واختيار (Save as PDF)' : 'Via print dialog (Save as PDF)'}
            </span>
          </div>
        </div>

        {/* Goal & Psychological Core */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800 space-y-1.5 print:bg-stone-50 print:border-stone-300">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>{isAr ? 'الهدف المعرفي والنفسي للورشة:' : 'Core Facilitation Goal:'}</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
            {isAr ? activeWorkshop.goalAr : activeWorkshop.goalEn}
          </p>
        </div>

        {/* The 5-Step Learning Cycle Visual */}
        <div className="space-y-3 print:hidden">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
            {isAr ? 'حلقة التعلّم الخماسية في الورشة' : 'The 5-Step Workshop Learning Cycle'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {learningCycles.map((item, idx) => {
              const CycleIcon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-3 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-800 text-center flex flex-col items-center justify-center space-y-1.5 shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                    <CycleIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{item.name}</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">{item.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Facilitator Toolkit: Timer & Group Prompt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print:grid-cols-1">
          {/* Facilitator Timer Card (Hidden when printing) */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs space-y-4 print:hidden">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'مؤقت حوار المجموعات' : 'Discussion Timer'}</span>
                </span>
                <span className="font-mono text-emerald-400">{formatTime(timerSeconds)}</span>
              </div>
              <div className="text-4xl sm:text-5xl font-mono font-light text-center my-3 tracking-tight text-white">
                {formatTime(timerSeconds)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleStartPause}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'بدء المؤقت' : 'Start Timer')}</span>
                </button>
                <button
                  onClick={() => handleResetTimer(initialDuration)}
                  className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors cursor-pointer"
                  title={isAr ? 'إعادة ضبط' : 'Reset'}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Duration presets */}
              <div className="flex items-center justify-center gap-1 pt-1 text-[11px]">
                {[180, 300, 600, 900, 1200].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => handleResetTimer(sec)}
                    className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      initialDuration === sec ? 'bg-stone-700 text-emerald-400 font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {sec / 60}د
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Facilitation Instructions & Situation Card */}
          <div className="md:col-span-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/60 p-5 sm:p-6 flex flex-col justify-between space-y-4 print:p-4 print:bg-white print:border-stone-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'إرشادات الميسّر والموقف المطروح للنقاش:' : 'Facilitator Instructions & Core Prompt:'}</span>
                </span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed mb-3">
                {isAr
                  ? 'قسّم المشاركين إلى مجموعات صغيرة (٣ إلى ٥ أفراد). اطرح عليهم سيناريو الموقف الواقعي التالي، واطلب من كل مجموعة المرور بالأسئلة الخمسة معاً بحرية ودون أحكام مسبقة، مع تدوين الخلاصات المشتركة.'
                  : 'Divide participants into small groups of 3-5. Present the core prompt below, encouraging open reflection through the 5 prompts without judgment.'}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-stone-900 border border-emerald-300/80 dark:border-emerald-700/60 rounded-2xl shadow-2xs print:border-stone-300 print:shadow-none">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                {isAr ? 'الموقف الواقعي المطروح للنقاش الجماعي:' : 'The Real-Life Group Case:'}
              </span>
              <p className="font-serif italic text-xs sm:text-sm text-stone-900 dark:text-stone-100 leading-relaxed">
                «{isAr ? activeWorkshop.situationAr : activeWorkshop.situationEn}»
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* LINKED GAMES FROM THE 40-GAME CATALOG */}
        {/* ================================================================ */}
        {activeWorkshop.linkedGames && activeWorkshop.linkedGames.length > 0 && (
          <div className="space-y-3.5 pt-3 border-t border-stone-100 dark:border-stone-800 print:hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  {isAr ? 'التطبيق العملي مع ألعاب المنصة' : 'Integrated Practical Games'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isAr ? 'ألعاب وتطبيقات مقترحة لخوضها في الورشة 🎮' : 'Recommended In-Workshop Interactive Games 🎮'}</span>
                </h3>
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {isAr ? 'من مكتبة الـ ٤٠ لعبة' : 'From 40-Game Library'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeWorkshop.linkedGames.map((lg) => (
                <div
                  key={lg.id}
                  className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-3.5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {isAr ? lg.badgeAr : lg.badgeEn}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {isAr ? lg.titleAr : lg.titleEn}
                    </h4>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                      {isAr ? lg.roleAr : lg.roleEn}
                    </p>
                  </div>

                  {onNavigateGame && (
                    <button
                      onClick={() => {
                        soundManager.playSoftTap();
                        onNavigateGame(lg.id);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white dark:bg-stone-900 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-700 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800/80 transition-all cursor-pointer shadow-2xs group"
                    >
                      <span>{isAr ? 'تشغيل اللعبة الآن 🌿' : 'Play Game 🌿'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* INTERACTIVE 5-QUESTION GROUP REFLECTION FORM */}
        {/* ================================================================ */}
        <div className="space-y-5 pt-3 border-t border-stone-100 dark:border-stone-800 print:border-none print:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isAr ? 'استمارة تدوين نقاش المجموعة (الأسئلة الخمسة الموجهة)' : 'Group Reflection & Discussion Form (5 Prompts)'}</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isAr
                  ? 'تسجل كل مجموعة خلاصة أفكارها وتفسيراتها هنا؛ الإجابات تُحفظ تلقائياً في المتصفح لاستئنافها عند الرجوع.'
                  : 'Answers are automatically saved locally and preserved when navigating away and returning.'}
              </p>
            </div>

            {/* Clear / Reset notes button (Screen only) */}
            <div className="flex items-center gap-2 print:hidden">
              {showClearConfirm ? (
                <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/60 p-1 px-2 rounded-xl border border-rose-200 dark:border-rose-900 text-xs">
                  <span className="text-[11px] text-rose-800 dark:text-rose-300 font-bold">{isAr ? 'متأكد من المسح؟' : 'Clear notes?'}</span>
                  <button
                    onClick={handleClearCurrentNotes}
                    className="px-2 py-0.5 bg-rose-600 text-white rounded-md text-[10px] font-bold cursor-pointer"
                  >
                    {isAr ? 'نعم، امسح' : 'Yes'}
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-0.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-md text-[10px] cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                  title={isAr ? 'مسح إجابات هذه الورشة' : 'Clear current workshop notes'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تفريغ الاستمارة' : 'Clear form'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {activeWorkshop.questions.map((q) => {
              const val = currentNotes[q.key] || '';
              return (
                <div key={q.key} className="space-y-1.5 bg-stone-50/70 dark:bg-stone-800/40 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800 print:bg-white print:border-stone-300 print:p-2.5 break-inside-avoid">
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 inline-flex items-center justify-center font-bold text-[11px] mr-1.5 rtl:mr-0 rtl:ml-1.5 print:border print:border-stone-400">
                      {q.num}
                    </span>
                    {isAr ? q.titleAr : q.titleEn}
                  </label>

                  {/* Interactive Textarea (Screen) */}
                  <textarea
                    rows={2}
                    value={val}
                    onChange={(e) => handleNoteChange(q.key, e.target.value)}
                    placeholder={isAr ? q.placeholderAr : q.placeholderEn}
                    className="w-full text-xs p-3 border border-stone-200/90 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 placeholder-stone-400 transition-all leading-relaxed print:hidden"
                  />

                  {/* Printable Answer Box (Print View) */}
                  <div className="hidden print:block min-h-[50px] p-2 border border-stone-300 rounded-lg text-xs font-serif leading-relaxed text-stone-900 bg-stone-50/30">
                    {val ? val : (isAr ? '....................................................................................................................................................................................................' : '....................................................................................................................................................................................................')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Practical Embodied Activity Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2 print:bg-stone-50 print:border-stone-300 break-inside-avoid">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 print:text-stone-900">
            <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 print:text-stone-800" />
            <span>{isAr ? `تمرين عملي وتطبيقي: ${activeWorkshop.practicalActivityTitleAr}` : `Practical Activity: ${activeWorkshop.practicalActivityTitleEn}`}</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans print:text-stone-800">
            {isAr ? activeWorkshop.practicalActivityDescAr : activeWorkshop.practicalActivityDescEn}
          </p>
        </div>

        {/* Facilitator Debrief Wisdom */}
        <div className="p-5 sm:p-6 bg-stone-900 text-stone-100 rounded-2xl space-y-2.5 text-xs shadow-md print:bg-white print:text-stone-900 print:border print:border-stone-300 print:shadow-none break-inside-avoid">
          <div className="flex items-center gap-2 text-emerald-400 dark:text-emerald-400 print:text-emerald-800 font-bold text-xs sm:text-sm">
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'خلاصة الورشة للربط بالحياة الواقعية (Facilitator Debrief):' : 'Facilitator Real-Life Debrief Wisdom:'}</span>
          </div>
          <p className="leading-relaxed text-stone-300 dark:text-stone-300 print:text-stone-800 sm:text-xs text-[11px] font-sans">
            «{isAr ? activeWorkshop.debriefWisdomAr : activeWorkshop.debriefWisdomEn}»
          </p>
        </div>
      </div>
    </div>
  );
};
