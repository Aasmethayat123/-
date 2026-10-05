import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Flame, 
  Wind,
  ArrowRight
} from 'lucide-react';

interface SomaticShakeGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface BodyZone {
  id: string;
  name: string;
  tensionLevel: number; // 0 to 100
  icon: string;
  instruction: string;
}

export const SomaticShakeGame: React.FC<SomaticShakeGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const initialZones: BodyZone[] = [
    { 
      id: 'shoulders', 
      name: isAr ? 'الكتفان وأعلى الظهر' : 'Shoulders & Neck', 
      tensionLevel: 90, 
      icon: '🥋', 
      instruction: isAr ? 'اهتز وانفض كتفيك للأعلى والأسفل بحرية' : 'Drop and shake shoulders up and down loosely' 
    },
    { 
      id: 'hands', 
      name: isAr ? 'اليدان والأصابع' : 'Hands & Wrists', 
      tensionLevel: 85, 
      icon: '🤲', 
      instruction: isAr ? 'انفض يديك في الهواء كأنك تتخلص من قطرات ماء' : 'Flick and shake hands as if shedding droplets' 
    },
    { 
      id: 'jaw', 
      name: isAr ? 'الفك والوجه' : 'Jaw & Face', 
      tensionLevel: 95, 
      icon: '🗣️', 
      instruction: isAr ? 'أرخِ فكك وافتح فمك قليلاً مع تنهيدة زفير طويلة' : 'Unclench jaw, soften lips with a sighing exhale' 
    },
    { 
      id: 'chest', 
      name: isAr ? 'الصدر والبطن' : 'Chest & Belly', 
      tensionLevel: 80, 
      icon: '🫁', 
      instruction: isAr ? 'أخرج زفيراً متقطعاً واهتز برفق من الجذع' : 'Pulsed exhales while vibrating torso gently' 
    },
    { 
      id: 'legs', 
      name: isAr ? 'الساقان والقدمان' : 'Legs & Feet', 
      tensionLevel: 75, 
      icon: '🦵', 
      instruction: isAr ? 'اركل الهواء برفق ودع ركبتيك لينة ومرنة' : 'Shake legs softly, bounce on soft knees' 
    }
  ];

  const [zones, setZones] = useState<BodyZone[]>(initialZones);
  const [activeZoneId, setActiveZoneId] = useState<string>('shoulders');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const activeZone = zones.find(z => z.id === activeZoneId) || zones[0];

  const handleShakeTap = () => {
    setIsShaking(true);
    soundManager.playShakeRattle();

    setZones(prev => {
      const updated = prev.map(z => {
        if (z.id === activeZoneId) {
          const nextTension = Math.max(0, z.tensionLevel - 20);
          return { ...z, tensionLevel: nextTension };
        }
        return z;
      });

      // Check if all zones are cleared
      const allZero = updated.every(z => z.tensionLevel === 0);
      if (allZero) {
        setCompleted(true);
        soundManager.playLevelUpFanfare();
        triggerConfetti(0.5, 0.4);
        if (onAddXP) onAddXP(60);
      }

      return updated;
    });

    setTimeout(() => setIsShaking(false), 150);
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setZones(initialZones);
    setActiveZoneId('shoulders');
    setCompleted(false);
  };

  const overallTension = Math.round(
    zones.reduce((sum, z) => sum + z.tensionLevel, 0) / zones.length
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Arcade Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? '← الألعاب' : '← Games'}
            </button>
          )}
          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
            {isAr ? 'لعبة: نفض وتفريغ التوتر الجسدي 🫨' : 'Psychomotor: Somatic Shake 🫨'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold font-mono">
          <Activity className="w-4 h-4 text-orange-400" />
          <span>{isAr ? `التوتر المتبقي: ${overallTension}%` : `Tension: ${overallTension}%`}</span>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider block">
              {isAr ? 'تفريغ هرمونات الكورتيزول والأدرينالين حركياً' : 'Discharge Biological Survival Stress'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'انفض التوتر خارج جسدك!' : 'Shake the Tension Out!'}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isAr
                ? 'الحيوانات في الطبيعة تنفض أجسادها بالكامل بعد النجاة من خطر لتفريغ شحنة الصدمة. اختر منطقة جسدك واضغط بقوة لنفض التوتر المتراكم.'
                : 'Mammals naturally shake violently after a threat to reset their nervous system. Target each zone and shake loose!'}
            </p>
          </div>

          {/* Body Zones Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {zones.map((zone) => {
              const isSelected = zone.id === activeZoneId;
              const isCleared = zone.tensionLevel === 0;

              return (
                <button
                  key={zone.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    setActiveZoneId(zone.id);
                  }}
                  className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between space-y-1.5 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-400 shadow-sm'
                      : isCleared
                      ? 'border-emerald-300 bg-emerald-50/70 text-emerald-900'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <span className="text-2xl">{isCleared ? '🌿' : zone.icon}</span>
                  <span className="text-xs font-bold truncate w-full">{zone.name}</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isCleared ? 'bg-emerald-200 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {isCleared ? 'متحرر ✓' : `${zone.tensionLevel}%`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Target Interactive Shaker Button */}
          <div className="p-8 bg-gradient-to-br from-stone-50 to-orange-50/60 rounded-3xl border-2 border-stone-200 text-center space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-orange-800 uppercase tracking-wider block">
                {isAr ? `المنطقة النشطة: ${activeZone.name}` : `Active Target: ${activeZone.name}`}
              </span>
              <p className="text-sm font-bold text-stone-900 font-serif">
                «{activeZone.instruction}»
              </p>
            </div>

            {/* Giant Shake Action Button */}
            <div className="pt-2">
              <button
                onClick={handleShakeTap}
                className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-orange-500 bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-extrabold text-lg sm:text-xl shadow-xl transition-all cursor-pointer transform active:scale-90 flex flex-col items-center justify-center space-y-1 mx-auto select-none ${
                  isShaking ? 'animate-bounce scale-105' : 'hover:scale-105'
                }`}
              >
                <span className="text-4xl">🫨</span>
                <span>{isAr ? 'انفض الآن!' : 'Shake Loose!'}</span>
                <span className="text-xs font-mono opacity-90">-{20}%</span>
              </button>
            </div>

            <p className="text-xs text-stone-500">
              {isAr
                ? '💡 انفض المنطقة جسدياً في الواقع مع كل نقرة على الزر!'
                : '💡 Physically shake this body zone in real life with each tap!'}
            </p>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🫨
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'تم تفريغ كامل الشحنة الجسدية بنجاح!' : 'Full Somatic Release Achieved!'}
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
              {isAr
                ? 'لقد انخفض مستوى التوتر الجسدي في جميع المناطق إلى 0%. خذ زفيراً طويلاً من الفم واستشعر الخفة في جسدك.'
                : 'Tension across all 5 somatic centers reached 0%. Take a long releasing sigh.'}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة النفض' : 'Shake Again'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'العودة لقائمة الألعاب' : 'Back to Games'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
