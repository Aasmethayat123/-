import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { soundManager } from '../utils/audio';
import { 
  Users, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  FileDown, 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  Lightbulb,
  MessageCircle,
  Brain
} from 'lucide-react';

interface WorkshopModeProps {
  language: Language;
}

export const WorkshopMode: React.FC<WorkshopModeProps> = ({ language }) => {
  const isAr = language === 'ar';

  // Facilitator Timer state
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min default
  const [initialDuration, setInitialDuration] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Group notes state for workshop participants
  const [groupNotes, setGroupNotes] = useState({
    situation: isAr ? 'صديقك شاهد رسالتك وقرأها، لكنه لم يرد طوال اليوم.' : 'Your friend saw your message (read receipts) but didn’t reply all day.',
    thought: '',
    emotion: '',
    reaction: '',
    alternativeExplanation: '',
    emotionalShift: ''
  });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
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
  }, [isTimerRunning, timerSeconds]);

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
    window.print();
  };

  const learningCycles = [
    { name: isAr ? 'العب' : 'Play', desc: isAr ? 'خوض سيناريوهات اللعبة التفاعلية' : 'Immerse in interactive game situations', icon: Play },
    { name: isAr ? 'لاحظ' : 'Notice', desc: isAr ? 'رصد الأفكار التلقائية وإشارات الجسد' : 'Observe automatic thoughts & body signals', icon: Lightbulb },
    { name: isAr ? 'ناقش' : 'Discuss', desc: isAr ? 'تبادل وجهات النظر في مجموعات صغيرة' : 'Share and compare in small groups', icon: MessageCircle },
    { name: isAr ? 'افهم' : 'Understand', desc: isAr ? 'إدراك الرابط بين الفكرة والشعور' : 'Connect thoughts, emotions, and actions', icon: Brain },
    { name: isAr ? 'تدرّب' : 'Practice', desc: isAr ? 'تطبيق وقفة الأنفاس والتفسير البديل يومياً' : 'Apply pause and reframing to real life', icon: Sparkles },
  ];

  const questions = [
    { key: 'thought', num: '1', title: isAr ? 'ما هي الفكرة التي قد تلمع في الذهن أولاً؟' : 'What thought might appear first in mind?', placeholder: isAr ? 'مثال: "هو يتجاهلني متعمداً..."' : 'E.g., "They are intentionally avoiding me..."' },
    { key: 'emotion', num: '2', title: isAr ? 'ما هو الشعور العاطفي الذي قد يتبع تلك الفكرة؟' : 'What emotion might follow that thought?', placeholder: isAr ? 'مثال: قلق، غضب، خيبة أمل، شعور بالرفض...' : 'E.g., Anxiety, burning frustration, rejection...' },
    { key: 'reaction', num: '3', title: isAr ? 'ما هو السلوك أو رد الفعل الذي قد ينتج عن هذا الشعور؟' : 'What reaction or behavior might happen?', placeholder: isAr ? 'مثال: انسحاب، صمت عقابي، رسالة هجومية...' : 'E.g., Silent treatment, angry confrontation...' },
    { key: 'alternativeExplanation', num: '4', title: isAr ? 'هل يمكن أن يكون هناك تفسير آخر لما حدث؟' : 'Could there be another explanation?', placeholder: isAr ? 'مثال: انشغال مفاجئ، ضغط عمل، نفاد البطارية...' : 'E.g., Sudden emergency, social exhaustion, meeting...' },
    { key: 'emotionalShift', num: '5', title: isAr ? 'هل تغيير التفسير يغير الاستجابة العاطفية ورد الفعل؟' : 'Would changing the interpretation change the emotional response?', placeholder: isAr ? 'مثال: نعم، يحل الهدوء والتفهم بدلاً من الغضب...' : 'E.g., Yes, calm empathy replaces defensiveness...' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Workshop Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 rounded-full text-xs font-semibold mb-2 border border-emerald-200/50">
          <Users className="w-3.5 h-3.5 text-emerald-700" />
          <span>{isAr ? 'ورشة عمل نسمة حياة 🌿' : 'Nesma Hayat Workshop Integration 🌿'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          {isAr ? 'ورشة: «من الفكرة إلى الشعور»' : 'Workshop: “From Thought to Feeling”'}
        </h1>
        <p className="text-stone-600 text-sm mt-2 leading-relaxed">
          {isAr
            ? 'دليل تيسير ورش العمل التفاعلية؛ حيث يتحول اللعب الفردي إلى حوار جماعي مثمر يبني الوعي الذاتي والتفهم الإنساني.'
            : 'Interactive facilitation guide turning solo reflection into a vibrant group dialogue that cultivates self-awareness and empathy.'}
        </p>
      </div>

      {/* The 5-Step Learning Cycle Visual */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8 shadow-xs">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-3">
          {isAr ? 'حلقة التعلّم الخماسية في الورشة' : 'The 5-Step Workshop Learning Cycle'}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {learningCycles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center flex flex-col items-center justify-center space-y-1.5"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-stone-900">{item.name}</span>
                <span className="text-[11px] text-stone-500 leading-tight">{item.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Facilitator Toolkit: Timer & Group Prompt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Facilitator Timer */}
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'مؤقت حوار المجموعات' : 'Discussion Timer'}</span>
              </span>
              <span>{formatTime(timerSeconds)}</span>
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-light text-center my-4 tracking-tight">
              {formatTime(timerSeconds)}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleStartPause}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'بدء' : 'Start')}</span>
              </button>
              <button
                onClick={() => handleResetTimer(initialDuration)}
                className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors"
                title={isAr ? 'إعادة ضبط' : 'Reset'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Duration presets */}
            <div className="flex items-center justify-center gap-1 pt-1 text-[11px]">
              {[180, 300, 600, 900].map((sec) => (
                <button
                  key={sec}
                  onClick={() => handleResetTimer(sec)}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    initialDuration === sec ? 'bg-stone-700 text-emerald-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {sec / 60}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Facilitation Instructions */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {isAr ? 'إرشادات ميسّر الجلسة (Facilitator Guide)' : 'Facilitator Instructions'}
              </span>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isAr ? 'طباعة استمارة الورشة' : 'Print Reflection Sheet'}</span>
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-3">
              {isAr
                ? 'قسّم المشاركين إلى مجموعات صغيرة (3 إلى 5 أفراد). اطرح عليهم الموقف التالي، واطلب منهم المرور بالأسئلة الخمسة معاً دون مقاطعة أو أحكام.'
                : 'Divide participants into small groups of 3-5. Present the prompt below, and encourage them to unpack the 5 questions together without judgment.'}
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl text-xs text-emerald-950">
            <span className="font-bold block mb-1">
              {isAr ? 'الموقف المطروح للنقاش الجماعي:' : 'The Core Group Prompt:'}
            </span>
            <p className="font-serif italic text-sm text-stone-900">
              «{groupNotes.situation}»
            </p>
          </div>
        </div>
      </div>

      {/* Interactive 5-Question Group Reflection Form */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {isAr ? 'استمارة تدوين نقاش المجموعة' : 'Group Reflection & Discussion Form'}
            </h2>
            <p className="text-xs text-stone-500">
              {isAr
                ? 'يمكن لكل مجموعة تسجيل خلاصات نقاشها هنا تمهيداً لعرضها ومشاركتها مع بقية المشاركين.'
                : 'Groups can record their collective findings here before sharing with the plenary.'}
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isAr ? 'تصدير' : 'Export'}</span>
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q) => {
            const val = groupNotes[q.key as keyof typeof groupNotes];
            return (
              <div key={q.key} className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 inline-flex items-center justify-center font-bold text-[11px] mr-1.5 rtl:mr-0 rtl:ml-1.5">
                    {q.num}
                  </span>
                  {q.title}
                </label>
                <textarea
                  rows={2}
                  value={val}
                  onChange={(e) => setGroupNotes({ ...groupNotes, [q.key]: e.target.value })}
                  placeholder={q.placeholder}
                  className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 text-stone-800 bg-stone-50/50"
                />
              </div>
            );
          })}
        </div>

        {/* Facilitator Debrief Wisdom */}
        <div className="p-4 bg-stone-900 text-stone-100 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'خلاصة الورشة للربط بالحياة الواقعية:' : 'Facilitator Debrief to Real Life:'}</span>
          </div>
          <p className="leading-relaxed text-stone-300">
            {isAr
              ? 'يربط الميسر تجربة اللعبة بمواقف العمل والأسرة اليومية: المشكلة نادراً ما تكون في الموقف الخارجي، بل في القصة التي نبنيها بسرعة البرق ونصدقها دون فحص. عندما نتعلم وقفة الأنفاس الخمسة ونبحث عن احتمالات بديلة، نستعيد زمام حياتنا وهدوءنا.'
              : 'The facilitator connects this to everyday life: the friction rarely lives in the external event, but in the unexamined story we believe in a flash. The pause and the reframe give us back our peace.'}
          </p>
        </div>
      </div>
    </div>
  );
};
