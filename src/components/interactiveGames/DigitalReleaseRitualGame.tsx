import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Bookmark, 
  ShieldCheck, 
  Wind, 
  Droplet, 
  Heart, 
  Lock, 
  Flame,
  Feather
} from 'lucide-react';

interface DigitalReleaseRitualGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

type RitualType = 'water-ink' | 'autumn-leaves' | 'stardust';

export const DigitalReleaseRitualGame: React.FC<DigitalReleaseRitualGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const [inputText, setInputText] = useState<string>('');
  const [selectedEmotionTag, setSelectedEmotionTag] = useState<string>('grief');
  const [selectedRitual, setSelectedRitual] = useState<RitualType>('water-ink');
  const [isReleasing, setIsReleasing] = useState<boolean>(false);
  const [releaseProgress, setReleaseProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [savedMomentSuccess, setSavedMomentSuccess] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const emotionPresets = [
    { id: 'grief', labelAr: 'حزن أو خيبة أمل', labelEn: 'Hidden grief & sorrow', icon: '💧' },
    { id: 'overwhelm', labelAr: 'ضغط وتراكم مهام', labelEn: 'Overwhelm & burnout', icon: '🌪️' },
    { id: 'unsaid', labelAr: 'عتب أو كلام عالق', labelEn: 'Unspoken words & resentment', icon: '🤐' },
    { id: 'self-criticism', labelAr: 'جلد ذات وشكوك', labelEn: 'Self-blame & doubt', icon: '🪞' },
  ];

  // Play ASMR calming ambient tone using Web Audio API
  const playASMRTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Soft noise / serene chime chord
      [220, 329.63, 440, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.5 + idx * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 4.8);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Canvas dissolution particle effect
  useEffect(() => {
    if (!isReleasing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = 300;

    // Generate particles representing text dissolving
    const particleCount = selectedRitual === 'stardust' ? 120 : selectedRitual === 'autumn-leaves' ? 45 : 80;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: 100 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 1.5 + (selectedRitual === 'autumn-leaves' ? 2 : 0),
      vy: selectedRitual === 'stardust' ? -Math.random() * 2 - 0.5 : (Math.random() - 0.2) * 1.5,
      size: Math.random() * 5 + 2,
      alpha: 1,
      color: 
        selectedRitual === 'water-ink' 
          ? `rgba(45, 212, 191, ${Math.random() * 0.7 + 0.3})`
          : selectedRitual === 'autumn-leaves'
          ? `rgba(245, 158, 11, ${Math.random() * 0.8 + 0.2})`
          : `rgba(216, 180, 254, ${Math.random() * 0.9 + 0.1})`
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.006;
        if (p.alpha < 0) p.alpha = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        if (selectedRitual === 'autumn-leaves') {
          // Leaf shape
          ctx.ellipse(p.x, p.y, p.size * 1.5, p.size * 0.8, Math.PI / 4, 0, 2 * Math.PI);
        } else {
          // Soft circular glow
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();
      });

      if (frame < 180) {
        animationFrameId.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isReleasing, selectedRitual]);

  // Release sequence timer
  useEffect(() => {
    if (!isReleasing) return;

    playASMRTone();
    soundManager.playChime(396, 3.0);

    const interval = setInterval(() => {
      setReleaseProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReleasing(false);
          setIsCompleted(true);
          soundManager.playSuccess();
          triggerConfetti();
          if (onAddXP) onAddXP(45);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isReleasing, onAddXP]);

  const handleStartRelease = () => {
    if (!inputText.trim()) return;
    soundManager.playSoftTap();
    setIsReleasing(true);
    setReleaseProgress(0);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setInputText('');
    setIsReleasing(false);
    setReleaseProgress(0);
    setIsCompleted(false);
    setSavedMomentSuccess(false);
  };

  const handleSaveToJourney = () => {
    soundManager.playChime(520, 2.0);
    setSavedMomentSuccess(true);
    const chosenPreset = emotionPresets.find((p) => p.id === selectedEmotionTag);
    saveMoment({
      gameId: 'digital-release-ritual',
      gameTitle: isAr ? 'مرآة الأعماق: طقوس التحرر' : 'Digital Release Ritual',
      quote: isAr 
        ? '«أفرغت حمولة ثقيلة في مرآة الأعماق وتركتها تذوب بسلام؛ استعدت خفة صدري»' 
        : '"I released a heavy burden into the reflective mirror and let it dissolve into peace; my chest is light once again"',
      reflection: isAr 
        ? `طقس تحرر رمزي لمشاعر (${chosenPreset?.labelAr || 'الحياة'}). تم إفراغ الكلمات بأمان تام.` 
        : 'Symbolic venting catharsis. Released private weight safely through mindful dissolution.',
      tag: isAr ? 'تفريغ وتخفف شعوري' : 'Emotional Catharsis'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 text-stone-100 animate-fadeIn" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-stone-900/90 border border-stone-800 p-4 rounded-3xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
            <Droplet className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black font-serif text-stone-100">
                {isAr ? 'مرآة الأعماق: طقوس التحرر الرقمي' : 'Digital Release Ritual'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                {isAr ? 'خصوصية تامة ١٠٠٪' : '100% Private'}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {isAr 
                ? 'واجهة تفريغ عاطفي ورمزي عميق: اكتب ما يثقل كاهلك، واشهَد ذوبانه وتلاشيه في مرآة الماء النقية' 
                : 'Deep emotional catharsis: write heavy burdens and watch them dissolve like ink into peaceful water'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-xs font-bold text-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'طقس جديد' : 'New Ritual'}</span>
          </button>

          {onBackToMap && (
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onBackToMap();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-xs font-bold text-stone-200 transition-colors cursor-pointer border border-stone-700"
            >
              {isAr ? '← خريطة الألعاب' : '← Back'}
            </button>
          )}
        </div>
      </div>

      {/* Main Obsidian Mirror Box */}
      <div className="bg-stone-950 border border-stone-800/90 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle Obsidian Water Reflection Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-950 to-stone-950 pointer-events-none" />

        {/* Confidentiality Guarantee Banner */}
        <div className="relative z-10 flex items-center justify-between text-xs font-bold text-stone-400 pb-4 mb-4 border-b border-stone-850">
          <span className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            {isAr 
              ? 'مساحتك الآمنة المطلقة: كلماتك لا تُرفع لأي خادم، وتتلاشى فوراً بعد الطقس' 
              : 'Absolute safe space: zero server uploads, words dissolve permanently'}
          </span>
          <span className="text-[11px] text-stone-500">
            {isAr ? 'تفريغ وتطهير شعوري (Catharsis)' : 'Emotional Venting Interface'}
          </span>
        </div>

        {!isCompleted ? (
          <div className="relative z-10 space-y-5">
            {/* Emotion Preset Chips */}
            <div>
              <label className="block text-xs font-bold text-stone-400 mb-2">
                {isAr ? 'اختر لون أو صبغة الشعور الذي يثقل صدرك اليوم:' : 'Select the nature of the feeling you wish to release:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {emotionPresets.map((preset) => {
                  const isSelected = selectedEmotionTag === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        soundManager.playSoftTap();
                        setSelectedEmotionTag(preset.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-500/20'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <span>{preset.icon}</span>
                      <span>{isAr ? preset.labelAr : preset.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ritual Choice (Ink vs Autumn Leaves vs Stardust) */}
            <div>
              <label className="block text-xs font-bold text-stone-400 mb-2">
                {isAr ? 'اختر شكل طقس التحرر البصري:' : 'Choose your visual release metaphor:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'water-ink', labelAr: 'ذوبان الحبر في الماء', labelEn: 'Ink in Still Water', icon: '💧', descAr: 'تذوب الكلمات وتصفو المرآة كلياً', descEn: 'Words dissolve and mirror clears completely' },
                  { id: 'autumn-leaves', labelAr: 'أوراق الخريف والنسيم', labelEn: 'Autumn Breeze', icon: '🍂', descAr: 'تتطاير الكلمات كأوراق شجر هادئة', descEn: 'Words flutter away like calm autumn leaves' },
                  { id: 'stardust', labelAr: 'الشهب والنور الكوني', labelEn: 'Cosmic Stardust', icon: '✨', descAr: 'تتفتت الحروف إلى غبار كواكب مضيء', descEn: 'Letters disperse into luminous cosmic stardust' },
                ].map((item) => {
                  const isSelected = selectedRitual === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundManager.playSoftTap();
                        setSelectedRitual(item.id as RitualType);
                      }}
                      className={`p-3 rounded-2xl text-start border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-500/40'
                          : 'bg-stone-950 border-stone-850 text-stone-400 hover:border-stone-750'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span>{item.icon}</span>
                        <span className="text-xs font-black">{isAr ? item.labelAr : item.labelEn}</span>
                      </div>
                      <div className="text-[10px] text-stone-500">{isAr ? item.descAr : item.descEn}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The Text Mirror Area */}
            <div className="relative">
              <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center justify-between">
                <span>{isAr ? 'اكتب ما بداخلك بكل صدق وبدون أي أحكام مسبقة:' : 'Pour out your unspoken words without filter:'}</span>
                <span className="text-[10px] text-stone-500 font-mono">{inputText.length} {isAr ? 'حرف' : 'chars'}</span>
              </label>

              <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900/80 focus-within:border-cyan-500/80 transition-colors">
                <textarea
                  value={inputText}
                  disabled={isReleasing}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isAr
                      ? 'ما هو الثقل الذي أرهقك؟ ما هي الكلمات التي كتمتها طويلاً؟ اكتبها هنا لتتركها ترحل بسلام...'
                      : 'What heavy burden is weighing on your soul? Write it here and watch it set free...'
                  }
                  rows={5}
                  className="w-full p-4 bg-transparent text-stone-100 placeholder-stone-600 text-sm sm:text-base leading-relaxed focus:outline-none resize-none font-sans"
                  style={{
                    opacity: isReleasing ? Math.max(0, 1 - releaseProgress / 70) : 1,
                    filter: isReleasing ? `blur(${(releaseProgress / 100) * 8}px)` : 'none',
                    transition: 'opacity 0.2s, filter 0.2s'
                  }}
                />

                {/* Particle Canvas Layer for Dissolution */}
                {isReleasing && (
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />
                )}
              </div>
            </div>

            {/* Release Action Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-500 italic">
                {isAr ? 'الاعتراف بالشعور هو الخطوة الأولى للشفاء' : 'Acknowledging the feeling is the seed of release'}
              </span>

              <button
                onClick={handleStartRelease}
                disabled={!inputText.trim() || isReleasing}
                className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
                  !inputText.trim() || isReleasing
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-600/30'
                }`}
              >
                <Feather className="w-4 h-4 animate-bounce" />
                <span>
                  {isReleasing
                    ? (isAr ? `تتحرر الكلمات الآن (${releaseProgress}%)...` : `Dissolving (${releaseProgress}%)...`)
                    : (isAr ? 'تحرير وإطلاق في المرآة 🕊️' : 'Release & Let Go 🕊️')}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Post-Ritual Catharsis Gratitude Screen */
          <div className="relative z-10 py-8 px-4 text-center space-y-5 animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-cyan-500/20 via-teal-500/20 to-indigo-500/20 border border-teal-500/40 flex items-center justify-center text-4xl shadow-xl shadow-teal-500/10">
              🪞🕊️
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                {isAr ? 'اكتمل طقس التحرر بنجاح' : 'Ritual Completed in Peace'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-serif">
                {isAr ? 'لقد غادرت الكلمات.. وعاد الصفاء لروحك' : 'The Burden Has Dissolved Into Serenity'}
              </h2>
            </div>

            <div className="max-w-lg mx-auto p-4 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs sm:text-sm text-stone-300 leading-relaxed space-y-2">
              <p>
                {isAr 
                  ? 'نشكر شجاعتك في مواجهة هذا الشعور وتسميته. عندما تخرج الكلمات من ظلام الكتمان، تفقد قدرتها على إيذائك.' 
                  : 'Thank you for your courage in naming this emotion. When thoughts are brought into the light, they lose their power to wound you.'}
              </p>
              <p className="text-teal-300 font-bold">
                {isAr ? '🌿 خذ الآن شهيقاً بطيئاً، واشعر بالخفة والاتساع في صدرك.' : '🌿 Take a gentle deep breath now, and notice the lightness in your chest.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={handleSaveToJourney}
                disabled={savedMomentSuccess}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  savedMomentSuccess
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-stone-900 hover:bg-stone-100 shadow-md'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>
                  {savedMomentSuccess 
                    ? (isAr ? 'تم توثيق لحظة الخفة في دفتر رحلتك ✓' : 'Moment Preserved in Journey ✓')
                    : (isAr ? 'توثيق رمز الخفة في دفتر رحلتي' : 'Log Milestone to My Journey')}
                </span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-xs font-bold text-stone-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'تفريغ شعور آخر' : 'Release Another Thought'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DigitalReleaseRitualGame;
