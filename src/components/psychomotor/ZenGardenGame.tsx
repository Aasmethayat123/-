import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  Brush, 
  Trash2, 
  Camera, 
  ArrowRight,
  Hand,
  Check
} from 'lucide-react';

interface ZenGardenGameProps {
  language: Language;
  onBackToMap?: () => void;
}

interface PlacedObject {
  id: string;
  emoji: string;
  label: string;
  x: number;
  y: number;
}

const ZEN_OBJECTS = [
  { emoji: '🪨', label: 'حجر بازلت أملس', meaning: 'الثبات والرسوخ' },
  { emoji: '🌸', label: 'زهرة لوتس', meaning: 'النقاء والتجدد' },
  { emoji: '🎋', label: 'غصن خيزران', meaning: 'المرونة في وجه الرياح' },
  { emoji: '💎', label: 'بلورة صفاء', meaning: 'وضوح الرؤية' },
  { emoji: '🍂', label: 'ورقة خريف ذهبية', meaning: 'جمال القبول والتسليم' }
];

export const ZenGardenGame: React.FC<ZenGardenGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rakeMode, setRakeMode] = useState<'rake5' | 'wide' | 'smooth'>('rake5');
  const [selectedTool, setSelectedTool] = useState<'rake' | 'place'>('rake');
  const [selectedZenEmoji, setSelectedZenEmoji] = useState<string>('🪨');
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([
    { id: '1', emoji: '🪨', label: 'حجر بازلت', x: 260, y: 150 },
    { id: '2', emoji: '🌸', label: 'لوتس', x: 120, y: 220 }
  ]);

  const [completed, setCompleted] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Initialize Canvas Sand Texture
  const initSandCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with warm Japanese Zen sand color (#e8dec8 / #dfd2b5)
    ctx.fillStyle = '#e5dbca';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle fine sand grain noise
    ctx.fillStyle = 'rgba(180, 160, 135, 0.15)';
    for (let i = 0; i < 6000; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }

    // Default gentle initial rake lines
    ctx.strokeStyle = 'rgba(145, 125, 100, 0.22)';
    ctx.lineWidth = 3;
    for (let y = 30; y < canvas.height; y += 22) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.bezierCurveTo(150, y - 6, 280, y + 6, canvas.width - 30, y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    initSandCanvas();
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const drawRakeMark = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    soundManager.playRakeSound();

    if (rakeMode === 'smooth') {
      // Soft sand leveler (smoothes back to clean sand)
      ctx.fillStyle = 'rgba(229, 219, 202, 0.4)';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    } else if (rakeMode === 'wide') {
      // Wide soft ridge
      ctx.strokeStyle = 'rgba(135, 115, 90, 0.25)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - 2, y - 2);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // Fine 5-prong traditional zen rake
      ctx.strokeStyle = 'rgba(125, 105, 80, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';

      const prongs = [-12, -6, 0, 6, 12];
      prongs.forEach(offset => {
        ctx.beginPath();
        ctx.moveTo(x + offset, y - 2);
        ctx.lineTo(x + offset, y);
        ctx.stroke();
      });
    }
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);

    if (selectedTool === 'place') {
      // Place Zen stone
      soundManager.playStonePlop();
      const newObj: PlacedObject = {
        id: `obj_${Date.now()}`,
        emoji: selectedZenEmoji,
        label: selectedZenEmoji,
        x,
        y
      };
      setPlacedObjects(prev => [...prev, newObj]);
    } else {
      setIsDrawing(true);
      drawRakeMark(x, y);
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool !== 'rake') return;
    const { x, y } = getCanvasCoords(e);
    drawRakeMark(x, y);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleClearAll = () => {
    soundManager.playSoftTap();
    initSandCanvas();
    setPlacedObjects([]);
  };

  const handleCompleteGarden = () => {
    soundManager.playHarmonicAffirmation();
    triggerConfetti(0.5, 0.4);
    setCompleted(true);
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'zen-garden',
      gameTitle: isAr ? 'حديقة الرمال والتأمل 🪨' : 'Zen Sand Garden 🪨',
      quote: isAr 
        ? 'تمشيط الرمال هو تمشيط للعقل المشوش؛ تتلاشى الفوضى حين نمارس الحضور في تفاصيل اللحظة.' 
        : 'Raking the sand clears the cluttered mind; calm returns in the present moment.',
      reflection: userReflection || (isAr ? 'مشّطت الرمال وصنعت مساحة هدوء وسكينة لروحي.' : 'Created a personal sanctuary of calm in the zen sand.'),
      tag: isAr ? 'حديقة الرمال' : 'Zen Garden'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    initSandCanvas();
    setCompleted(false);
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
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            {isAr ? 'حديقة الرمال والتأمل (Zen Garden) 🪨' : 'Zen Sand Garden 🪨'}
          </span>
        </div>

        <button
          onClick={handleClearAll}
          className="flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          title={isAr ? 'مسح وتسوية الرمال' : 'Smooth All Sand'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isAr ? 'تسوية الرمال' : 'Reset Sand'}</span>
        </button>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-5 text-center">
          <div className="space-y-1 max-w-md mx-auto">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              {isAr ? 'فن الاستغراق الحسي وتهدئة العقل الفوضوي' : 'Sensory Immersion & Mental Stillness'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'مشّطي الرمال ورتّبي أحجارك بسكينة 🪨' : 'Rake the Sand & Balance Your Stones 🪨'}
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              {isAr
                ? 'مرري إصبعك أو الماوس لرسم التموجات الرملية المهدئة، واختاري أحجار وزهور التوازن لوضعها في حديقتك الخاصة.'
                : 'Draw soothing waves in the sand and place grounding stones to craft your sanctuary.'}
            </p>
          </div>

          {/* Interactive Zen Tools Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-stone-100 rounded-2xl max-w-lg mx-auto text-xs font-bold">
            {/* Tool: 5-Prong Rake */}
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setSelectedTool('rake');
                setRakeMode('rake5');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTool === 'rake' && rakeMode === 'rake5'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>〰️</span>
              <span>{isAr ? 'مشط الرمال' : 'Fine Rake'}</span>
            </button>

            {/* Tool: Wide Ripple */}
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setSelectedTool('rake');
                setRakeMode('wide');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTool === 'rake' && rakeMode === 'wide'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>🌊</span>
              <span>{isAr ? 'تموجات عريضة' : 'Wide Wave'}</span>
            </button>

            {/* Tool: Sand Smoother */}
            <button
              onClick={() => {
                soundManager.playSoftTap();
                setSelectedTool('rake');
                setRakeMode('smooth');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTool === 'rake' && rakeMode === 'smooth'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>🧹</span>
              <span>{isAr ? 'تنعيم ومسح' : 'Smoother'}</span>
            </button>
          </div>

          {/* Zen Objects Placement Selector */}
          <div className="flex items-center justify-center gap-2.5 p-2 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto">
            <span className="text-[11px] font-bold text-stone-400">
              {isAr ? 'إضافة عناصر:' : 'Add Items:'}
            </span>
            {ZEN_OBJECTS.map((obj) => (
              <button
                key={obj.emoji}
                onClick={() => {
                  soundManager.playSoftTap();
                  setSelectedTool('place');
                  setSelectedZenEmoji(obj.emoji);
                }}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                  selectedTool === 'place' && selectedZenEmoji === obj.emoji
                    ? 'bg-amber-100 border-2 border-amber-600 scale-110 shadow-xs'
                    : 'bg-white hover:bg-stone-100 border border-stone-200'
                }`}
                title={obj.label}
              >
                {obj.emoji}
              </button>
            ))}
          </div>

          {/* The Zen Sand Canvas Container */}
          <div className="relative mx-auto w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-stone-700 bg-[#e5dbca] select-none touch-none">
            <canvas
              ref={canvasRef}
              width={600}
              height={450}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              className="w-full h-full cursor-crosshair"
            />

            {/* Render Placed Zen Stones/Objects Over the Canvas */}
            {placedObjects.map((obj) => (
              <div
                key={obj.id}
                className="absolute text-3xl sm:text-4xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2 filter drop-shadow-md select-none transition-transform"
                style={{
                  left: `${(obj.x / 600) * 100}%`,
                  top: `${(obj.y / 450) * 100}%`
                }}
              >
                {obj.emoji}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-lg mx-auto pt-2">
            <p className="text-xs text-stone-400 italic">
              {isAr
                ? '💡 انقري واسحبي لتمشيط الرمال، أو اختاري حجراً واضغطي لوضعه في الحديقة.'
                : '💡 Click & drag to rake sand, or pick a stone and click to place.'}
            </p>

            <button
              onClick={handleCompleteGarden}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span>{isAr ? 'اكتملت لوحة الهدوء 🌿' : 'Finish Garden 🌿'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🪨
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'سكينة الرمال استقرت في روحك 🌿' : 'Stillness Settles in Your Soul 🌿'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed font-serif">
              {isAr
                ? '«كما تسكن الرمال وتصنع تموجات ناعمة بعد مرور المشط، يهدأ عقلك حين تمنحينه لحظات تأمل حقيقية خالية من الاستعجال».'
                : 'As the sand settles into serene harmonious waves, your mind returns to stillness in the present moment.'}
            </p>
          </div>

          {/* Reflection Input and Save to My Journey Option */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-3 text-start">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <Bookmark className="w-4 h-4 text-amber-700" />
              <span>{isAr ? 'سؤال خفيف لتدوينه في رحلتك:' : 'A gentle reflection for your journey:'}</span>
            </div>
            <label className="text-xs text-stone-600 block">
              {isAr ? 'ما هو أثر هدوء الرمال الذي تودين حمله معك لباقي يومك؟' : 'What quiet feeling would you like to carry forward today?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'اكتبي خاطرتك الهادئة...' : 'Your peaceful thought...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 text-stone-800"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved to My Journey ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment to My Journey')}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'حديقة جديدة' : 'New Garden'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
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
