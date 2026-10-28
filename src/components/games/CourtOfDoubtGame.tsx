import React, { useState } from 'react';
import { Language, GameMode } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Scale, 
  Search, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  Award
} from 'lucide-react';
import { SectionGuideBanner } from '../common/SectionGuideBanner';

interface CourtOfDoubtGameProps {
  language: Language;
  onBackToMap: () => void;
  onAddXP?: (amount: number, showSparkles?: boolean) => void;
}

type CourtStep = 'intro' | 'evidence' | 'categorize' | 'interrogate' | 'verdict' | 'result';

interface EvidenceItem {
  id: string;
  title: string;
  category: 'document' | 'object' | 'testimony' | 'timeline';
  content: string;
  source: string;
  correctClassification?: 'fact' | 'assumption' | 'contradiction';
}

interface Suspect {
  id: string;
  name: string;
  role: string;
  avatar: string;
  alibi: string;
  questions: {
    q: string;
    answer: string;
  }[];
}

export const CourtOfDoubtGame: React.FC<CourtOfDoubtGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';
  const [step, setStep] = useState<CourtStep>('intro');
  const [activeEvidenceId, setActiveEvidenceId] = useState<string>('ev_1');
  const [classifications, setClassifications] = useState<Record<string, 'fact' | 'assumption' | 'contradiction'>>({});
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('sus_1');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [interrogationNotes, setInterrogationNotes] = useState<string[]>([]);
  
  // Verdict state
  const [chosenConclusion, setChosenConclusion] = useState<string | null>(null);
  const [selectedKeyEvidence, setSelectedKeyEvidence] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const evidenceList: EvidenceItem[] = [
    {
      id: 'ev_1',
      title: isAr ? 'تقرير نظام الحراسة والأمن' : 'Security System Log',
      category: 'document',
      content: isAr
        ? 'تشير السجلات الرقمية إلى عدم وجود أي كسر في الأبواب أو النوافذ، وعدم انطلاق صفارة الإنذار طوال الليلة. الكاميرات سجلت انقطاعاً مفاجئاً للتيار الكهربائي في الساعة 10:15 مساءً ولمدة 10 دقائق בדיוק.'
        : 'Digital logs show no forced entry or alarm breach. Cameras recorded a sudden power outage at 10:15 PM for exactly 10 minutes.',
      source: isAr ? 'غرفة المراقبة الإلكترونية' : 'Monitoring Room',
      correctClassification: 'fact'
    },
    {
      id: 'ev_2',
      title: isAr ? 'كوب القهوة المكسور' : 'Broken Coffee Mug',
      category: 'object',
      content: isAr
        ? 'عُثر على كوب قهوة مكسور على أرضية صالة المعرض تفوح منه رائحة الهيل القوي، وهو النوع المفضل للمشرف زياد. لكن زياد صرح بأنه لم يدخل صالة المعرض بعد الساعة 8 مساءً.'
        : 'A broken coffee mug smelling of cardamom was found on the gallery floor, matching curator Ziyad’s favorite brew. Yet Ziyad claims he left the gallery by 8 PM.',
      source: isAr ? 'مسرح المعرض' : 'Gallery Floor',
      correctClassification: 'contradiction'
    },
    {
      id: 'ev_3',
      title: isAr ? 'رسالة بريد إلكتروني مطبوعة' : 'Printed Email Draft',
      category: 'document',
      content: isAr
        ? 'رسالة مطبوعة ومتبقية في طابعة مكتب جامع التحف سهر، تتضمن عرض شراء خاص للوحة «شموع الفجر» بقيمة 50 ألف دولار من جامع آثار مجهول.'
        : 'An unsent printed email draft in collector Sahar’s office, discussing a private $50,000 buyer offer for "Dawn Candles".',
      source: isAr ? 'مكتب سهر' : 'Sahar’s Desk',
      correctClassification: 'assumption'
    },
    {
      id: 'ev_4',
      title: isAr ? 'مفتاح خزانة العرض الاحتياطي' : 'Spare Display Key',
      category: 'object',
      content: isAr
        ? 'عُثر على مفتاح الاحتياطي لخزانة اللوحة معلقاً في سقيفة الحديقة المجاورة لعمل البستاني مهاب. مهاب ينكر بشدة دخوله القصر طوال ذلك اليوم الممطر.'
        : 'The spare display key hung in the garden shed used by gardener Mohab, who vehemently denies entering the mansion that rainy day.',
      source: isAr ? 'سقيفة الحديقة' : 'Garden Shed',
      correctClassification: 'contradiction'
    },
    {
      id: 'ev_5',
      title: isAr ? 'بقع الطين البرتقالي' : 'Orange Clay Mud Residue',
      category: 'object',
      content: isAr
        ? 'بقع طين برتقالي نادر مطبوعة على السجاد قرب نافذة صالة المعرض. هذا النوع من الطين لا يوجد إلا في الصوبة الزجاجية الخاصة بالحديقة.'
        : 'Rare orange clay residue on the rug near the gallery window. This exact soil type exists only in the mansion’s greenhouse.',
      source: isAr ? 'نافذة المعرض الداخلية' : 'Gallery Inner Window',
      correctClassification: 'fact'
    }
  ];

  const suspects: Suspect[] = [
    {
      id: 'sus_1',
      name: isAr ? 'زياد (مشرف المعرض)' : 'Ziyad (Curator)',
      role: isAr ? 'مسؤول عن أمن اللوحات وتصنيفها' : 'Responsible for art security & cataloging',
      avatar: '👨‍💼',
      alibi: isAr ? 'كنت أراجع الجرد في مكتبي بالطابق العلوي طوال المساء ولم أغادره.' : 'I was reviewing inventory in my upstairs office all evening.',
      questions: [
        {
          q: isAr ? 'لماذا وُجد كوب قهوتك المكسور داخل صالة المعرض المظلمة؟' : 'Why was your coffee mug found inside the dark gallery?',
          answer: isAr ? 'أوه... ربما نسيته هناك أثناء جولة التفقد قبل الإغلاق بقليل، نعم تذكرت الآن!' : 'Oh... I must have left it there during inspection before closing, yes!'
        },
        {
          q: isAr ? 'هل كان لديك علم بانقطاع الكهرباء لمدة 10 دقائق؟' : 'Did you know about the 10-minute power outage?',
          answer: isAr ? 'انقطاع الكهرباء يحدث دائماً في هذه العواصف، لم أعر الأمر اهتماماً.' : 'Power outages happen in storms all the time, I didn’t pay attention.'
        }
      ]
    },
    {
      id: 'sus_2',
      name: isAr ? 'سهر (جامعة التحف والمالكة)' : 'Sahar (Collector & Owner)',
      role: isAr ? 'ابنة مؤسس القصر والمالكة القانونية' : 'Daughter of founder & legal owner',
      avatar: '👩‍🎨',
      alibi: isAr ? 'كنت أعقد اجتماعاً عبر الإنترنت مع مستثمرين حتى منتصف الليل في غرفة الصالون.' : 'I was in an online investor meeting until midnight in the lounge.',
      questions: [
        {
          q: isAr ? 'ما قصة رسالة البريد الإلكتروني الخاصة بعرض الـ 50 ألف دولار؟' : 'What about the $50,000 email offer?',
          answer: isAr ? 'كنت أفكر في بيعها لتسديد ديون القصر، لكنني تراجع و لم أبعها! هذا لا يعني أنني سرقتها من نفسي!' : 'I considered selling it to pay estate debts, but changed my mind! That doesn’t mean I stole it.'
        },
        {
          q: isAr ? 'أين كنت وقت انقطاع التيار الكهربائي؟' : 'Where were you during the power outage?',
          answer: isAr ? 'انفصل الإنترنت أثناء الاجتماع وذهبت لإعادة تشغيل الراوتر في الممر الرئيسي.' : 'My internet dropped so I went to restart the router in the main hallway.'
        }
      ]
    },
    {
      id: 'sus_3',
      name: isAr ? 'مهاب (البستاني الهادئ)' : 'Mohab (Gardener)',
      role: isAr ? 'مسؤول العناية بالحدائق والصوبات' : 'Greenhouse & garden caretaker',
      avatar: '🧑‍🌾',
      alibi: isAr ? 'لم أترك الصوبة الزجاجية طوال الليل بسبب رعاية النباتات الحساسة ضد الصقيع.' : 'I stayed in the greenhouse all night tending frost-sensitive plants.',
      questions: [
        {
          q: isAr ? 'لماذا وُجد مفتاح خزانة العرض الاحتياطي في سقيفك؟' : 'Why was the spare display key in your shed?',
          answer: isAr ? 'أنا من استبدل قفل الباب الخلفي الشهر الماضي بناءً على طلب زياد، وربما نسيت إعادته للوحة المفاتيح الرئيسية.' : 'I replaced the back door lock last month at Ziyad’s request, forgot to return the key.'
        },
        {
          q: isAr ? 'ما حكاية بقع الطين البرتقالي على سجاد المعرض؟' : 'What about the orange clay mud on the gallery rug?',
          answer: isAr ? 'حذائي دائماً متسخ بطين الصوبة، لكنني لم أضع قدمي داخل القصر منذ الأسبوع الماضي!' : 'My boots are always muddy from the greenhouse, but I haven’t stepped inside the mansion!'
        }
      ]
    }
  ];

  const handleClassificationChange = (evId: string, type: 'fact' | 'assumption' | 'contradiction') => {
    soundManager.playSoftTap();
    setClassifications(prev => ({ ...prev, [evId]: type }));
  };

  const handleAskQuestion = (susId: string, qIdx: number) => {
    soundManager.playSoftTap();
    const targetSuspect = suspects.find(s => s.id === susId);
    if (!targetSuspect) return;
    const item = targetSuspect.questions[qIdx];
    const logEntry = `${targetSuspect.name}: ${item.q} -> "${item.answer}"`;
    if (!interrogationNotes.includes(logEntry)) {
      setInterrogationNotes(prev => [...prev, logEntry]);
    }
  };

  const handleSubmitVerdict = () => {
    soundManager.playLevelUpFanfare();
    triggerConfetti();
    const isCorrect = chosenConclusion === 'sahar_stolen';
    setIsVictory(isCorrect);
    setIsAnswerSubmitted(true);
    setStep('result');

    if (isCorrect && onAddXP) {
      onAddXP(150, true);
    }
  };

  const activeEvidence = evidenceList.find(e => e.id === activeEvidenceId) || evidenceList[0];
  const activeSuspect = suspects.find(s => s.id === selectedSuspectId) || suspects[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header Bar */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onBackToMap}
            className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            {isAr ? '← الرئيسية' : '← Home'}
          </button>
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-sm font-extrabold text-emerald-400">
              {isAr ? 'محكمة الشك واليقين — مسرح التحقيق ⚖️' : 'Court of Doubt — Investigation Theatre ⚖️'}
            </span>
          </div>
        </div>

        {/* Step Navigation Pill */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-stone-300">
          <span className={step === 'intro' ? 'text-emerald-400 font-bold' : ''}>1. القضية</span>
          <span>•</span>
          <span className={step === 'evidence' ? 'text-emerald-400 font-bold' : ''}>2. الأدلة</span>
          <span>•</span>
          <span className={step === 'categorize' ? 'text-emerald-400 font-bold' : ''}>3. التصنيف</span>
          <span>•</span>
          <span className={step === 'interrogate' ? 'text-emerald-400 font-bold' : ''}>4. الاستجواب</span>
          <span>•</span>
          <span className={step === 'verdict' ? 'text-emerald-400 font-bold' : ''}>5. الاستنتاج</span>
        </div>
      </div>

      <SectionGuideBanner sectionId="smart-games-hub" language={language} />

      {/* STEP 1: INTRO & BRIEFING */}
      {step === 'intro' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fade-in">
          <div className="space-y-2 text-center max-w-xl mx-auto">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {isAr ? 'قضية رقم ٠١ — القصر العتيق' : 'Case #01 — Al-Bustan Mansion'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white font-serif">
              {isAr ? 'اللغز الغامض: اختفاء لوحة «شموع الفجر»' : 'The Mystery of the Missing "Dawn Candles" Painting'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {isAr
                ? 'خلال ليلة عاصفة وفي قصر البستان المغلق، اختفت اللوحة التاريخية الأثرية دون أي أثر لكسر الأبواب أو إطلاق الإنذار. ثلاثة أشخاص فقط تواجدوا في الجوار. مهمتك هي فحص الأدلة، كشف التناقضات، واستنتاج الحقيقة بموضوعية.'
                : 'During a stormy night at Al-Bustan Mansion, a priceless historical painting vanished without any forced entry or alarm trigger. Three residents were present. Your task is to examine clues and uncover truth.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 text-center space-y-1">
              <div className="text-2xl">🏛️</div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'مسرح الجريمة' : 'Crime Scene'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isAr ? 'صالة المعرض المغلقة بالقصر' : 'Locked mansion gallery'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 text-center space-y-1">
              <div className="text-2xl">👥</div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'المشتبه بهم (3)' : 'Suspects (3)'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isAr ? 'زياد، سهر، ومهاب' : 'Ziyad, Sahar, and Mohab'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 text-center space-y-1">
              <div className="text-2xl">🔍</div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'الأدلة المتاحة' : 'Available Evidence'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isAr ? '5 أدلة ووثائق تفصيلية' : '5 detailed clues & records'}
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => {
                soundManager.playChime();
                setStep('evidence');
              }}
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>{isAr ? 'دخول مسرح الأدلة والوثائق' : 'Enter Evidence Board'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: EVIDENCE BOARD */}
      {step === 'evidence' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                {isAr ? 'المحطة الثانية: مسرح الأدلة' : 'Step 2: Evidence Board'}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white">
                {isAr ? 'افحص الأدلة والوثائق بعناية 🔍' : 'Examine Clues and Documents 🔍'}
              </h2>
            </div>
            <span className="text-xs font-bold bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full text-stone-600 dark:text-stone-300">
              {evidenceList.length} {isAr ? 'أدلة مكتشفة' : 'Clues found'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Evidence List Selector */}
            <div className="space-y-2 md:col-span-1">
              {evidenceList.map((ev) => {
                const isSelected = activeEvidenceId === ev.id;
                return (
                  <button
                    key={ev.id}
                    onClick={() => {
                      soundManager.playSoftTap();
                      setActiveEvidenceId(ev.id);
                    }}
                    className={`w-full p-3.5 rounded-2xl text-start border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-800 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg">
                        {ev.category === 'document' ? '📄' : ev.category === 'object' ? '🗝️' : '⏱️'}
                      </span>
                      <span className="text-xs font-bold truncate">{ev.title}</span>
                    </div>
                    {classifications[ev.id] && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Evidence Detailed Viewer */}
            <div className="md:col-span-2 p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full">
                    {activeEvidence.source}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">ID: {activeEvidence.id}</span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 font-serif">
                  {activeEvidence.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-medium">
                  {activeEvidence.content}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-xs text-stone-500">
                <span>{isAr ? 'تأكد من مقارنة هذا الدليل مع أقوال المشتبه بهم.' : 'Compare this clue with suspect testimonies.'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => setStep('intro')}
              className="px-4 py-2 text-stone-500 text-xs font-bold"
            >
              {isAr ? 'السابق' : 'Back'}
            </button>

            <button
              onClick={() => {
                soundManager.playChime();
                setStep('categorize');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>{isAr ? 'الانتقال لتصنيف الأدلة' : 'Proceed to Classification'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CATEGORIZATION */}
      {step === 'categorize' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              {isAr ? 'المحطة الثالثة: لوحة التصنيف المنطقي' : 'Step 3: Logical Classification'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
              {isAr ? 'صنّف كل دليل: حقيقة مثبتة أم افتراض أم تناقض؟ ⚖️' : 'Classify each clue: Proven Fact vs Assumption vs Contradiction'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isAr ? 'مهمتك التمييز بين الحقائق الدامغة والتناقضات الخفية.' : 'Distinguish ironclad facts from hidden contradictions.'}
            </p>
          </div>

          <div className="space-y-4">
            {evidenceList.map(ev => {
              const currentClass = classifications[ev.id];
              return (
                <div key={ev.id} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">{ev.title}</h4>
                    <span className="text-[11px] text-stone-500">{ev.content.substring(0, 60)}...</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleClassificationChange(ev.id, 'fact')}
                      className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        currentClass === 'fact'
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                          : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {isAr ? 'حقيقة مثبتة' : 'Proven Fact'}
                    </button>

                    <button
                      onClick={() => handleClassificationChange(ev.id, 'assumption')}
                      className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        currentClass === 'assumption'
                          ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                          : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {isAr ? 'افتراض محتمل' : 'Assumption'}
                    </button>

                    <button
                      onClick={() => handleClassificationChange(ev.id, 'contradiction')}
                      className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        currentClass === 'contradiction'
                          ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                          : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {isAr ? 'تناقض أو تضليل' : 'Contradiction'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => setStep('evidence')}
              className="px-4 py-2 text-stone-500 text-xs font-bold"
            >
              {isAr ? 'السابق' : 'Back'}
            </button>

            <button
              onClick={() => {
                soundManager.playChime();
                setStep('interrogate');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>{isAr ? 'الانتقال للاستجواب' : 'Proceed to Interrogation'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: INTERROGATION */}
      {step === 'interrogate' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              {isAr ? 'المحطة الرابعة: غرفة الاستجواب' : 'Step 4: Interrogation Room'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
              {isAr ? 'استجوب الشخصيات واكشف تناقضات الأقوال 🗣️' : 'Interrogate Suspects & Uncover Contradictions 🗣️'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Suspect Selector */}
            <div className="space-y-2">
              {suspects.map(sus => {
                const isSelected = selectedSuspectId === sus.id;
                return (
                  <button
                    key={sus.id}
                    onClick={() => {
                      soundManager.playSoftTap();
                      setSelectedSuspectId(sus.id);
                    }}
                    className={`w-full p-3.5 rounded-2xl text-start border-2 transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-800 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span className="text-2xl">{sus.avatar}</span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">{sus.name}</h4>
                      <p className="text-[10px] text-stone-500 truncate">{sus.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Suspect Dialogue */}
            <div className="md:col-span-2 p-5 rounded-3xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-4">
              <div className="flex items-center gap-3 border-b border-stone-200/60 dark:border-stone-700 pb-3">
                <span className="text-3xl">{activeSuspect.avatar}</span>
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">{activeSuspect.name}</h3>
                  <p className="text-xs text-stone-500 italic">«{activeSuspect.alibi}»</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  {isAr ? 'اطرح سؤالاً استجوابياً:' : 'Ask an interrogation question:'}
                </span>

                <div className="space-y-2">
                  {activeSuspect.questions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskQuestion(activeSuspect.id, idx)}
                      className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 hover:bg-emerald-50 dark:hover:bg-stone-850 border border-stone-200 dark:border-stone-700 text-xs font-bold text-start text-stone-800 dark:text-stone-200 cursor-pointer transition-colors"
                    >
                      ❓ {item.q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interrogation Notes Log */}
              {interrogationNotes.length > 0 && (
                <div className="pt-3 border-t border-stone-200/60 dark:border-stone-700 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block">
                    {isAr ? '📝 سجل ملاحظات الاستجواب:' : 'Interrogation Notes Log:'}
                  </span>
                  <div className="max-h-28 overflow-y-auto space-y-1 text-[11px] text-stone-600 dark:text-stone-300 font-mono">
                    {interrogationNotes.map((note, i) => (
                      <div key={i} className="p-2 rounded-lg bg-stone-100 dark:bg-stone-900">
                        • {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => setStep('categorize')}
              className="px-4 py-2 text-stone-500 text-xs font-bold"
            >
              {isAr ? 'السابق' : 'Back'}
            </button>

            <button
              onClick={() => {
                soundManager.playChime();
                setStep('verdict');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>{isAr ? 'الانتقال لتقديم الاستنتاج النهائي' : 'Proceed to Final Verdict'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: FINAL VERDICT */}
      {step === 'verdict' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              {isAr ? 'المحطة الخامسة: محكمة الاستنتاج النهائي' : 'Step 5: Final Verdict Court'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
              {isAr ? 'ما هو استنتاجك المنطقي المبني على الأدلة والتحقيق؟ ⚖️' : 'What is your logical deduction based on evidence? ⚖️'}
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'mohab_thief',
                title: isAr ? 'أ) مهاب البستاني هو السارق الوحيد بسبب المفتاح في سقيفته.' : 'A) Mohab the gardener stole it due to the key in his shed.'
              },
              {
                id: 'sahar_stolen',
                title: isAr ? 'ب) سهر المالكة سرقت اللوحة مستغلة انقطاع الكهرباء وورطت البستاني، وزياد تواطأ بنسيان قهوته.' : 'B) Sahar the owner stole it during the power outage, framing Mohab, with Ziyad’s unwitting coffee slip.'
              },
              {
                id: 'insufficient',
                title: isAr ? 'ج) الأدلة غير قاطعة ولا يمكن حسم المسؤولية القانونية دون شهود عيان.' : 'C) Insufficient evidence to definitively conclude responsibility.'
              }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  setChosenConclusion(opt.id);
                }}
                className={`w-full p-4 rounded-2xl text-start border-2 transition-all cursor-pointer flex items-center justify-between ${
                  chosenConclusion === opt.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-800 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold">{opt.title}</span>
                {chosenConclusion === opt.id && <CheckCircle2 className="w-5 h-5 text-emerald-800 dark:text-emerald-400 shrink-0" />}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => setStep('interrogate')}
              className="px-4 py-2 text-stone-500 text-xs font-bold"
            >
              {isAr ? 'السابق' : 'Back'}
            </button>

            <button
              onClick={handleSubmitVerdict}
              disabled={!chosenConclusion}
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>{isAr ? 'إصدار الحكم والنتيجة' : 'Deliver Verdict'}</span>
              <Award className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: RESULT & LEARNING */}
      {step === 'result' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/50 shadow-xl space-y-6 text-center animate-fade-in">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner ${
            isVictory ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
          }`}>
            {isVictory ? '⚖️' : '💡'}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest block text-emerald-800 dark:text-emerald-400">
              {isVictory ? (isAr ? 'إصدار الحكم الصائب بنجاح!' : 'Correct Verdict Delivered!') : (isAr ? 'تحليل استنتاجي جزئي' : 'Partial Deduction')}
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white font-serif">
              {isVictory ? (isAr ? 'أنت محقق عبقري! تم كشف الحقيقة بدقة' : 'Brilliant Detective Work!') : (isAr ? 'قراءة منطقية جيدة، لكن الحل الأدق مختلف' : 'Good logic, but precise solution differs')}
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 text-start space-y-3">
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase">
              {isAr ? '📋 مفتاح الحل والتحليل المنطقي:' : 'Case Solution & Logical Analysis:'}
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed">
              {isAr
                ? 'الحل المعتمد (ب): سهر المالكة هي من دبرت الأمر مستغلة انقطاع التيار الكهربائي المقصود وعلمها بسجلات الكاميرات، ووضعت المفتاح في سقيفة مهاب لتلصق التهمة به، بينما نسي زياد قهوته قبل إغلاق المعرض بساعتين.'
                : 'Correct Solution (B): Sahar arranged the theft during the planned power outage and framed Mohab by planting the key, while Ziyad’s coffee mug was simply left earlier.'}
            </p>
          </div>

          {isVictory && (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-900 dark:text-amber-300 font-extrabold text-sm">
              <Award className="w-5 h-5 text-amber-600" />
              <span>{isAr ? 'حصلت على +150 نقطة وعي وبراعة استنتاج (XP) 🔥' : 'Earned +150 XP for Deduction Mastery 🔥'}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setStep('intro');
                setChosenConclusion(null);
                setIsAnswerSubmitted(false);
              }}
              className="flex items-center gap-1.5 px-6 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 rounded-2xl font-bold text-xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة التحقيق' : 'Replay Case'}</span>
            </button>

            <button
              onClick={onBackToMap}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {isAr ? 'العودة للخريطة والألعاب' : 'Return to Games Map'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
