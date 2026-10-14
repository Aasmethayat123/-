import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  Heart, 
  Wind, 
  X, 
  Sparkles, 
  AlertTriangle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { CERTIFIED_HOTLINES, CRISIS_EVENT_NAME } from '../utils/safetyInterceptor';
import { soundManager } from '../utils/audio';

interface CrisisSafetyModalProps {
  language: 'ar' | 'en';
  onOpenBreathing?: () => void;
}

export const CrisisSafetyModal: React.FC<CrisisSafetyModalProps> = ({
  language,
  onOpenBreathing
}) => {
  const isAr = language === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [matchedSnippet, setMatchedSnippet] = useState<string>('');
  const [activeStep, setActiveStep] = useState<'emergency' | 'grounding' | 'safe_exit'>('emergency');
  const [isBreathActive, setIsBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(4);

  useEffect(() => {
    const handleCrisis = (e: Event) => {
      const customEvent = e as CustomEvent<{ matchedText: string; source: string }>;
      setMatchedSnippet(customEvent.detail?.matchedText || '');
      setIsOpen(true);
      setActiveStep('emergency');
      try {
        soundManager.playChime();
      } catch {
        // ignore
      }
    };

    window.addEventListener(CRISIS_EVENT_NAME, handleCrisis);
    return () => {
      window.removeEventListener(CRISIS_EVENT_NAME, handleCrisis);
    };
  }, []);

  // 4-7-8 Breathing timer if opened in modal
  useEffect(() => {
    if (!isBreathActive) return;

    let timer: NodeJS.Timeout;
    if (breathPhase === 'inhale') {
      if (breathCount > 1) {
        timer = setTimeout(() => setBreathCount(c => c - 1), 1000);
      } else {
        setBreathPhase('hold');
        setBreathCount(7);
      }
    } else if (breathPhase === 'hold') {
      if (breathCount > 1) {
        timer = setTimeout(() => setBreathCount(c => c - 1), 1000);
      } else {
        setBreathPhase('exhale');
        setBreathCount(8);
      }
    } else if (breathPhase === 'exhale') {
      if (breathCount > 1) {
        timer = setTimeout(() => setBreathCount(c => c - 1), 1000);
      } else {
        setBreathPhase('inhale');
        setBreathCount(4);
      }
    }

    return () => clearTimeout(timer);
  }, [isBreathActive, breathPhase, breathCount]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-modal-title"
    >
      <div 
        className="relative w-full max-w-lg bg-stone-900 border-2 border-rose-500/70 rounded-3xl shadow-2xl p-6 sm:p-7 text-stone-100 space-y-5 max-h-[92vh] overflow-y-auto"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Urgent Header */}
        <div className="flex items-start justify-between gap-3 border-b border-rose-900/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7 animate-pulse text-rose-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest block">
                {isAr ? 'بروتوكول الأمان ورعاية الحياة 🛡️' : 'Safety & Crisis Protocol 🛡️'}
              </span>
              <h2 id="crisis-modal-title" className="text-lg sm:text-xl font-extrabold text-white">
                {isAr ? 'أنت لست وحدك، وسلامتك هي الأهم دائماً' : 'You are not alone, your safety matters most'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label={isAr ? 'إغلاق نافذة الأمان' : 'Close Safety Modal'}
            className="text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Empathy Box */}
        <div className="bg-rose-950/40 border border-rose-800/40 rounded-2xl p-4 text-xs sm:text-sm text-rose-200 leading-relaxed space-y-2">
          <p className="font-semibold">
            {isAr 
              ? 'لاحظنا من خلال ما كتبته أنك قد تمر بلحظة ألم نفسي شديد أو نوبة ضيق بالغة. نريد أن نؤكد لك أن مشاعرك حقيقية وتستحق الاحتواء، ولكن إنهاء حياتك أو إيذاء نفسك ليس حلاً.'
              : 'We sensed from your words that you might be experiencing intense emotional distress. Your feelings are valid, but harming yourself is never the answer.'}
          </p>
          <p className="text-[11px] text-rose-300/80">
            {isAr
              ? 'تطبيق «نسمة حياة» أداة توعوية وليس بديلاً عن التدخل الطبي أو الطوارئ المتخصصة. يرجى التواصل فوراً مع الخطوط المجانية المعتمدة أدناه:'
              : 'Nesma Hayat is an educational awareness tool and cannot replace immediate emergency services. Please reach out to certified hotlines below:'}
          </p>
        </div>

        {/* Action Hotlines */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
            {isAr ? 'خطوط المساعدة النفسية المباشرة والمجانية (24/7):' : 'Certified 24/7 Emergency Helplines:'}
          </span>

          <div className="grid grid-cols-1 gap-2">
            {CERTIFIED_HOTLINES.map((hotline, idx) => (
              <a
                key={idx}
                href={`tel:${hotline.phone}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-stone-800/80 hover:bg-rose-900/30 border border-stone-700 hover:border-rose-500/50 transition-all text-xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      {isAr ? hotline.countryAr : hotline.countryEn}: {isAr ? hotline.nameAr : hotline.nameEn}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold">
                      {hotline.is24x7 ? (isAr ? 'متاح على مدار الساعة (مجاناً)' : '24/7 Available (Free)') : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-mono font-extrabold text-sm rounded-xl shrink-0 shadow-sm">
                  <span>{hotline.phone}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Immediate 4-7-8 Breathing Grounding */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">
                {isAr ? 'تثبيت الجهاز العصبي وتمرين التنفس الفوري (4-7-8)' : 'Instant 4-7-8 Nervous System Stabilization'}
              </span>
            </div>

            <button
              onClick={() => {
                if (onOpenBreathing) {
                  setIsOpen(false);
                  onOpenBreathing();
                } else {
                  setIsBreathActive(!isBreathActive);
                }
              }}
              className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors"
            >
              {isBreathActive ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'ابدأ الآن' : 'Start Now')}
            </button>
          </div>

          {isBreathActive && (
            <div className="p-4 rounded-xl bg-stone-900 border border-emerald-700/50 text-center space-y-2 animate-fade-in">
              <div className="text-sm font-bold text-emerald-300">
                {breathPhase === 'inhale' && (isAr ? 'شهيق عميق من الأنف 🌸' : 'Inhale deeply through nose 🌸')}
                {breathPhase === 'hold' && (isAr ? 'احتفظ بالهواء بلطف وثبات ⏳' : 'Gently hold your breath ⏳')}
                {breathPhase === 'exhale' && (isAr ? 'زفير بطيء وناعم من الفم 🍃' : 'Slow gentle exhale through mouth 🍃')}
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400">
                {breathCount}
              </div>
            </div>
          )}
        </div>

        {/* Safe Dismissal Confirmation */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
          <span className="text-stone-400 text-[11px]">
            {isAr ? 'هل أنت في مكان آمن الآن ومستعد للمتابعة؟' : 'Are you in a safe space now?'}
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl font-bold transition-colors cursor-pointer"
          >
            {isAr ? 'أنا بخير الآن وأريد المتابعة' : 'I am safe now and wish to proceed'}
          </button>
        </div>
      </div>
    </div>
  );
};
