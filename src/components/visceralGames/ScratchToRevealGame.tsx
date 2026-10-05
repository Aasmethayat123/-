import React, { useRef, useState, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Bookmark, 
  ArrowRight, 
  Eraser, 
  CheckCircle2,
  Smile
} from 'lucide-react';

interface ScratchToRevealGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface ScratchArtwork {
  id: string;
  topic: string;
  hiddenEmoji: string;
  hiddenQuote: string;
  caricatureCaption: string;
  soothingAnalysis: string;
}

const ARTWORKS: ScratchArtwork[] = [
  {
    id: 'art1',
    topic: 'متلازمة "أنا متأخرة عن كل الناس"',
    hiddenEmoji: '🐢💨',
    hiddenQuote: '«السلحفاة اللي ماشية في مسارها بتوصل، بينما الأرنب اللي بيبص وراه بيلبس في الشجرة!»',
    caricatureCaption: 'أنتِ مش متأخرة، أنتِ ماشية في توقيتك الخاص بدون زحمة وفذلكة.',
    soothingAnalysis: 'المقارنة مع الناس في السوشيال ميديا هي مقارنة كواليس حياتك بإعلانات غيرك الممولة. لكل شخص قطاره الخاص.'
  },
  {
    id: 'art2',
    topic: 'دماغ الـ 2 صباحاً وحسابات الكون',
    hiddenEmoji: '🦉🧠',
    hiddenQuote: '«دماغك الساعة اتنين بالليل مش حكيم؛ ده مجرد طفل جعان نوم بيألف دراما مجانية!»',
    caricatureCaption: 'لا تتخذي أي قرار مصيري بعد الساعة ١١ مساءً؛ نامي وناقشي مشاكلك الصبح.',
    soothingAnalysis: 'الفص الجبهي المسؤول عن التفكير المنطقي يغلق أبوابه عند الإرهاق، ويترك الميكروفون لمركز الخوف البدائي.'
  }
];

export const ScratchToRevealGame: React.FC<ScratchToRevealGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [artIndex, setArtIndex] = useState<number>(0);
  const [scratchPercent, setScratchPercent] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);

  const currentArt = ARTWORKS[artIndex];

  // Initialize canvas with dark ink layer
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with matte dark ink texture
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle decorative ink strokes
    ctx.fillStyle = '#292524';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isAr ? '✍️ امسحي بصباعك هنا لكشط الحبر...' : '✍️ Scratch here to reveal...', canvas.width / 2, canvas.height / 2);

    setScratchPercent(0);
    setIsRevealed(false);
  };

  useEffect(() => {
    initCanvas();
  }, [artIndex]);

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Erase ink layer
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2, false);
    ctx.fill();

    // Increment approximate scratch progress
    setScratchPercent(prev => {
      const next = Math.min(100, prev + 3.5);
      if (next >= 65 && !isRevealed) {
        setIsRevealed(true);
        soundManager.playHarmonicAffirmation();
        triggerConfetti(0.5, 0.4);
        if (onAddXP) onAddXP(40);
      }
      return next;
    });
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'scratch-to-reveal',
      gameTitle: isAr ? 'مسح الحبر (Scratch & Reveal)' : 'Scratch to Reveal',
      quote: currentArt.hiddenQuote,
      reflection: userReflection || currentArt.caricatureCaption,
      tag: isAr ? 'كشط الحقيقة' : 'Scratch Art'
    });

    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = (newIdx?: number) => {
    soundManager.playSoftTap();
    if (typeof newIdx === 'number') setArtIndex(newIdx);
    setIsRevealed(false);
    setScratchPercent(0);
    setIsSaved(false);
    setUserReflection('');
    setTimeout(initCanvas, 50);
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
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {isAr ? '٤. لعبة: مسح الحبر وكشط الحقيقة 🎨🖤' : '4. Scratch to Reveal 🎨🖤'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-300">
          <Eraser className="w-3.5 h-3.5 text-emerald-400" />
          <span>{Math.round(scratchPercent)}%</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <div className="space-y-1 max-w-md mx-auto">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            {isAr ? 'حركة يدوية تفرغ شحنة التوتر والضيق' : 'Tactile Friction Release'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {currentArt.topic}
          </h2>
          <p className="text-xs text-stone-500">
            {isAr ? 'امسحي بصباعك أو الماوس على اللوح الأسود لكشط الحبر واكتشاف الرسمة والمقولة المستخبية.' : 'Scratch the dark ink layer with your finger/mouse to reveal the comforting art.'}
          </p>
        </div>

        {/* Scratching Arena */}
        <div className="flex justify-center">
          <div className="relative w-80 h-72 sm:w-96 sm:h-80 rounded-3xl overflow-hidden shadow-xl border-4 border-stone-800 select-none">
            {/* The Hidden Artwork Underneath */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-teal-50 to-emerald-50 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <span className="text-5xl filter drop-shadow-md animate-gentle-float">
                {currentArt.hiddenEmoji}
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-stone-900 font-serif leading-relaxed">
                {currentArt.hiddenQuote}
              </p>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                {currentArt.caricatureCaption}
              </span>
            </div>

            {/* The Scratch Canvas on Top */}
            <canvas
              ref={canvasRef}
              width={384}
              height={320}
              onMouseDown={() => (isDrawing.current = true)}
              onMouseUp={() => (isDrawing.current = false)}
              onMouseMove={(e) => {
                if (isDrawing.current) handleScratch(e);
              }}
              onTouchStart={() => (isDrawing.current = true)}
              onTouchEnd={() => (isDrawing.current = false)}
              onTouchMove={handleScratch}
              className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-500 ${
                isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            />
          </div>
        </div>

        {/* Reveal celebration */}
        {isRevealed && (
          <div className="p-6 bg-emerald-50/80 rounded-3xl border-2 border-emerald-300 text-start space-y-4 max-w-xl mx-auto animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  {isAr ? 'السر النفسي بعد الكشط:' : 'The psychological reframe:'}
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-emerald-950 font-serif">
                  {currentArt.caricatureCaption}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
              {currentArt.soothingAnalysis}
            </p>

            {/* Reflection Input */}
            <div className="space-y-2 pt-2 border-t border-emerald-200">
              <label className="text-xs font-bold text-stone-800 block">
                {isAr ? 'خاطرة سريعة لابتسامتك اليوم:' : 'Save a quick note to diary:'}
              </label>
              <textarea
                rows={2}
                value={userReflection}
                onChange={(e) => setUserReflection(e.target.value)}
                placeholder={isAr ? 'اكتبي ما جعلك تبتسمين أو تهدأين...' : 'What made you smile?...'}
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 text-stone-800"
              />
              <div className="flex items-center justify-between pt-1">
                <button
                  disabled={isSaved}
                  onClick={handleSaveMoment}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
                </button>

                <button
                  onClick={() => handleRestart((artIndex + 1) % ARTWORKS.length)}
                  className="flex items-center gap-1 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <span>{isAr ? 'لوحة كشط تانية' : 'Next Scratch Board'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
