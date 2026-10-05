import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Bookmark, 
  ArrowRight, 
  Flame, 
  Zap, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface TouchAndBreakGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface BurdenMirror {
  id: string;
  label: string;
  themeColor: string;
  secretRevelation: {
    shockTruth: string;
    realOrigin: string;
    healingMantra: string;
  };
}

const BURDEN_MIRRORS: BurdenMirror[] = [
  {
    id: 'm1',
    label: 'التردد وشلل الاختيار 🌫️',
    themeColor: 'from-amber-400 to-rose-500',
    secretRevelation: {
      shockTruth: 'أنتِ لا تخافين من الاختيار الخاطئ، أنتِ مرعوبة من لوم نفسكِ بعده!',
      realOrigin: 'التردد ليس نقصاً في ذكائك، بل هو دفاع طفولي قديم لحمايتك من النقد القاسي لو حدث خطأ.',
      healingMantra: '«القرار السيئ يمكن تعديله دائماً، أما شلل التردد فيسرق عمركِ دون مقابل. اختاري واطمئني».'
    }
  },
  {
    id: 'm2',
    label: 'الخوف من كلام الناس ونظراتهم 👁️',
    themeColor: 'from-purple-500 to-indigo-600',
    secretRevelation: {
      shockTruth: 'الناس لا يفكرون فيكِ أصلاً ٩٩٪ من الوقت.. هم مشغولون تماماً بقلقهم على أنفسهم!',
      realOrigin: 'تضخيم كلام الناس هو انعكاس للناقد الداخلي في رأسك؛ أنتِ تفترضين أنهم يرون نفس العيوب التي تجلدين بها ذاتك.',
      healingMantra: '«أنتِ لستِ معروضة في مسرح للمحاكمة؛ أنتِ تعيشين حياتكِ الخاصة فقط».'
    }
  },
  {
    id: 'm3',
    label: 'الكتمان والتظاهر بأن كل شيء تمام 🎭',
    themeColor: 'from-teal-500 to-cyan-700',
    secretRevelation: {
      shockTruth: 'قوتكِ المصطنعة لا تحميكِ، بل تجعل آلامكِ تعفن في الظلام تحت الجلد!',
      realOrigin: 'الكتمان نشأ عندما تعلمتِ أن دموعكِ "مزعجة" للآخرين، فقررتِ حرمان نفسك من حق الضعف الإنساني الطبيعي.',
      healingMantra: '«الاعتراف بالتعب ليس استسلاماً، بل هو أول شهيق حقيقي تأخذينه منذ سنوات».'
    }
  },
  {
    id: 'm4',
    label: 'الرعب من الفشل والتقصير ⚡',
    themeColor: 'from-rose-500 to-red-700',
    secretRevelation: {
      shockTruth: 'الفشل ليس عكس النجاح؛ الفشل جزء لا يتجزأ من كل تجربة حية على الأرض!',
      realOrigin: 'ربطتِ قيمتك الإنسانية ومقدار حب الناس لكِ بإنجازاتك فقط؛ إذا لم تكوني خارقة تشعرين أنكِ لا تستحقين شيئاً.',
      healingMantra: '«أنتِ محبوبة ومحترمة لأنكِ أنتِ، لا لأن ورقة إنجازكِ كاملة».'
    }
  }
];

export const TouchAndBreakGame: React.FC<TouchAndBreakGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [selectedMirrorId, setSelectedMirrorId] = useState<string>(BURDEN_MIRRORS[0].id);
  const [hits, setHits] = useState<number>(0);
  const targetHits = 8;
  const [isShattered, setIsShattered] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const activeMirror = BURDEN_MIRRORS.find(m => m.id === selectedMirrorId) || BURDEN_MIRRORS[0];

  const handleHit = () => {
    if (isShattered) return;

    // Haptic feedback if supported by browser/device
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 20, 50]);
      } catch {
        // ignore
      }
    }

    soundManager.playPop();
    setShake(true);
    setTimeout(() => setShake(false), 120);

    const nextHits = hits + 1;
    setHits(nextHits);

    if (nextHits >= targetHits) {
      setTimeout(() => {
        setIsShattered(true);
        soundManager.playHarmonicAffirmation();
        triggerConfetti(0.5, 0.4);
        if (onAddXP) onAddXP(50);
      }, 200);
    }
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'touch-and-break',
      gameTitle: isAr ? 'المرآة المكسورة (Touch & Break)' : 'Shatter the Mirror',
      quote: activeMirror.secretRevelation.shockTruth,
      reflection: userReflection || activeMirror.secretRevelation.healingMantra,
      tag: isAr ? 'تحطيم الأوهام' : 'Truth Shock'
    });

    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = (newId?: string) => {
    soundManager.playSoftTap();
    if (newId) setSelectedMirrorId(newId);
    setHits(0);
    setIsShattered(false);
    setIsSaved(false);
    setUserReflection('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            {isAr ? '١. لعبة: المرآة المكسورة 🪞💥' : '1. Shatter the Mirror 🪞💥'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-300">
          <span>{isAr ? `الضربات: ${hits}/${targetHits}` : `Hits: ${hits}/${targetHits}`}</span>
        </div>
      </div>

      {/* Mirror Burden Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {BURDEN_MIRRORS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleRestart(m.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              m.id === selectedMirrorId
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {!isShattered ? (
        /* The Glass Mirror under Attack */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1 max-w-md mx-auto">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
              {isAr ? 'تفريغ حسي عنيف وصادم للأوهام' : 'Tactile Haptic Shatter'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'اضغطي بسرعة وبقوة لتحطيم هذا الوهم! 🔨' : 'Tap Forcefully to Smash the Mirror! 🔨'}
            </h2>
            <p className="text-xs text-stone-500">
              {isAr ? 'انقري مراراً على لوح الزجاج حتى يتهشم تماماً ويكشف لكِ الحقيقة المستترة خلفه.' : 'Repeatedly tap the glass to break the illusion and unveil the hidden truth.'}
            </p>
          </div>

          {/* Interactive Glass Pane */}
          <div className="flex justify-center">
            <div
              onClick={handleHit}
              className={`relative w-72 sm:w-80 h-72 sm:h-80 rounded-3xl border-4 border-slate-300 shadow-2xl cursor-pointer select-none overflow-hidden transition-transform flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200 ${
                shake ? 'scale-95 rotate-1 border-rose-400 ring-4 ring-rose-300/40' : 'hover:scale-102 active:scale-95'
              }`}
            >
              {/* Glass Reflection Glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none transform -skew-x-12" />

              {/* Crack Overlay Lines increasing with hits */}
              {hits > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-85 stroke-rose-950/70" viewBox="0 0 100 100">
                  {hits >= 1 && <path d="M 50,50 L 20,20 L 10,40" strokeWidth="1.5" fill="none" strokeDasharray="1,1" />}
                  {hits >= 2 && <path d="M 50,50 L 80,15 L 90,35" strokeWidth="2" fill="none" />}
                  {hits >= 3 && <path d="M 50,50 L 30,85 L 15,70" strokeWidth="1.8" fill="none" />}
                  {hits >= 4 && <path d="M 50,50 L 75,80 L 85,90" strokeWidth="2.5" fill="none" />}
                  {hits >= 5 && <path d="M 50,50 L 5,50 M 50,50 L 95,50" strokeWidth="2" fill="none" />}
                  {hits >= 6 && <path d="M 50,50 L 50,5 M 50,50 L 50,95" strokeWidth="2" fill="none" />}
                  {hits >= 7 && (
                    <circle cx="50" cy="50" r="30" strokeWidth="3" fill="none" strokeDasharray="3,2" className="animate-spin-slow" />
                  )}
                </svg>
              )}

              {/* Burden text printed on the glass */}
              <div className="relative z-10 text-center space-y-2">
                <span className="text-4xl block filter drop-shadow-md">🪞</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 font-serif leading-snug">
                  {activeMirror.label}
                </h3>
                <span className="text-[11px] font-bold text-rose-600 block bg-rose-50 px-3 py-1 rounded-full border border-rose-200 shadow-2xs">
                  {isAr ? `انقري هنا لتحطيمه (${targetHits - hits} متبقية)` : `Tap to Shatter (${targetHits - hits} left)`}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* The Secret Revelation Behind the Broken Mirror */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto text-3xl shadow-inner">
            💥
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
              {isAr ? 'كارت السر: الصدمة الإيجابية المحررة' : 'Positive Shock & Hidden Origin'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
              {isAr ? 'تحطم لوح الزجاج وتعرّت الحقيقة! 🌿' : 'The Glass Has Shattered!'}
            </h2>
          </div>

          {/* The Big Shocking Truth */}
          <div className="p-6 bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-transparent rounded-3xl border-2 border-rose-300 text-start space-y-4 max-w-xl mx-auto shadow-2xs">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                  {isAr ? 'الصدمة الإيجابية الصريحة:' : 'The Direct Truth:'}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-stone-900 leading-relaxed font-serif">
                  «{activeMirror.secretRevelation.shockTruth}»
                </h3>
              </div>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1.5 leading-relaxed">
              <span className="font-extrabold block text-stone-900">
                🔍 {isAr ? 'من أين جاء هذا القلق أصلاً؟' : 'Where did this originate?'}
              </span>
              <p>{activeMirror.secretRevelation.realOrigin}</p>
            </div>

            <div className="p-3.5 bg-rose-900 text-white rounded-2xl text-xs font-serif font-bold italic leading-relaxed text-center shadow-xs">
              {activeMirror.secretRevelation.healingMantra}
            </div>
          </div>

          {/* Reflection Input */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 max-w-xl mx-auto space-y-3 text-start">
            <label className="text-xs font-bold text-stone-800 block">
              {isAr ? 'ما الذي سقط عن كتفك بعد قراءة هذه الحقيقة؟' : 'What burden felt lifted just now?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي خاطرة صادقة في رحلتك...' : 'A candid reflection...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-rose-600 text-stone-800"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 disabled:bg-rose-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => handleRestart()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'تحطيم وهم آخر' : 'Smash Another'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'قائمة الألعاب' : 'All Games'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
