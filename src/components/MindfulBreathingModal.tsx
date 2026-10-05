import React, { useState, useEffect } from 'react';
import { X, Play, Pause, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { soundManager } from '../utils/audio';

interface MindfulBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

export const MindfulBreathingModal: React.FC<MindfulBreathingModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const isAr = language === 'ar';
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Box Breathing cycle: 4s Inhale, 4s Hold, 4s Exhale, 4s Rest
  useEffect(() => {
    if (!isOpen || !isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phase
        if (phase === 'inhale') {
          soundManager.playBreathBell(false);
          setPhase('hold');
          return 4;
        } else if (phase === 'hold') {
          soundManager.playBreathBell(false);
          setPhase('exhale');
          return 4;
        } else if (phase === 'exhale') {
          setPhase('rest');
          return 4;
        } else {
          soundManager.playBreathBell(true);
          setPhase('inhale');
          setCyclesCompleted((c) => c + 1);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, phase]);

  if (!isOpen) return null;

  const phaseInstruction = {
    inhale: isAr ? 'شهيق هادئ من الأنف...' : 'Gentle inhale through the nose...',
    hold: isAr ? 'احبس النفس بلطف واسترخاء...' : 'Hold gently and soften your shoulders...',
    exhale: isAr ? 'زفير طويل وبطيء من الفم...' : 'Slow, releasing exhale through the mouth...',
    rest: isAr ? 'استقرار وسكون تام...' : 'Rest in peaceful stillness...'
  };

  const getScaleClass = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-115 transition-transform duration-4000 ease-out bg-emerald-100 border-emerald-300';
      case 'hold':
        return 'scale-115 transition-transform duration-1000 bg-teal-100 border-teal-300';
      case 'exhale':
        return 'scale-85 transition-transform duration-4000 ease-in bg-stone-100 border-stone-300';
      case 'rest':
        return 'scale-85 transition-transform duration-1000 bg-stone-50 border-stone-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-stone-200 relative text-center"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close breathing modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-2 text-emerald-700">
          <HeartHandshake className="w-5 h-5" />
          <span className="text-xs uppercase font-semibold tracking-wider">
            {isAr ? 'وقفة الأنفاس الواعية' : 'The Mindful Reset'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-stone-900 mb-1">
          {isAr ? 'تنفس المربع (Box Breathing)' : 'Box Breathing'}
        </h3>
        <p className="text-xs text-stone-500 mb-8 max-w-xs mx-auto">
          {isAr 
            ? 'عندما ترتفع وتيرة الأفكار أو تشتعل المشاعر، أعد جهازك العصبي إلى نقطة الأمان أولاً.'
            : 'When thoughts accelerate or emotions surge, return your nervous system to safety first.'}
        </p>

        {/* Breathing Circle */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-8">
          <div 
            className={`w-40 h-40 rounded-full border-2 flex flex-col items-center justify-center transition-all ${getScaleClass()}`}
          >
            <span className="text-3xl font-light text-stone-800 tracking-tight font-mono">
              {secondsLeft}
            </span>
            <span className="text-xs font-medium text-stone-600 capitalize mt-1">
              {phase === 'inhale' ? (isAr ? 'شهيق' : 'Inhale') :
               phase === 'hold' ? (isAr ? 'حبس' : 'Hold') :
               phase === 'exhale' ? (isAr ? 'زفير' : 'Exhale') :
               (isAr ? 'سكون' : 'Rest')}
            </span>
          </div>
        </div>

        <p className="text-sm font-medium text-stone-700 min-h-6 mb-6">
          {phaseInstruction[phase]}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isActive ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'استئناف' : 'Resume')}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {isAr ? 'العودة بتوازن' : 'Return Centered'}
          </button>
        </div>

        {cyclesCompleted > 0 && (
          <p className="text-[11px] text-stone-600 mt-4">
            {isAr 
              ? `أتممتَ ${cyclesCompleted} دورات تنفس كاملة 🌿`
              : `Completed ${cyclesCompleted} full breath cycles 🌿`}
          </p>
        )}
      </div>
    </div>
  );
};
