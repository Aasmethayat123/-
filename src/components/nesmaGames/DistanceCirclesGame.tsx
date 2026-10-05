import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Bookmark, 
  HeartHandshake, 
  Shield, 
  Users,
  ArrowRight
} from 'lucide-react';

interface DistanceCirclesGameProps {
  language: Language;
  onBackToMap?: () => void;
}

export const DistanceCirclesGame: React.FC<DistanceCirclesGameProps> = ({
  language,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  const [distance, setDistance] = useState<number>(50); // 0 (suffocating) to 100 (isolated), 50 is golden
  const [completed, setCompleted] = useState<boolean>(false);
  const [userReflection, setUserReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const getStatusText = (val: number) => {
    if (val < 25) {
      return {
        label: isAr ? 'قرب خانق وتداخل مفرط ⚠️' : 'Suffocating proximity ⚠️',
        desc: isAr ? 'التصاق يمحو الحدود الشخصية ويولد الاحتكاك والاعتمادية.' : 'Losing your boundaries and absorbing their storm.',
        color: 'text-rose-600 bg-rose-50 border-rose-200'
      };
    } else if (val > 75) {
      return {
        label: isAr ? 'عزلة وجفاء بعيد ❄️' : 'Distant isolation ❄️',
        desc: isAr ? 'ابتعاد مفرط يمنع التواصل الإنساني والدفء الطبيعي.' : 'Defensive walls that prevent love from reaching in.',
        color: 'text-sky-600 bg-sky-50 border-sky-200'
      };
    } else {
      return {
        label: isAr ? 'المسافة الذهبية الآمنة ✨' : 'The Golden Safe Distance ✨',
        desc: isAr ? 'قريب بما يكفي للدفء والدعم، وبعيد بما يكفي لحماية كرامتك وسلامك.' : 'Close enough for warmth, far enough for sovereignty.',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-300'
      };
    }
  };

  const status = getStatusText(distance);
  const isGolden = distance >= 40 && distance <= 65;

  const handleFinish = () => {
    soundManager.playHarmonicAffirmation();
    triggerConfetti(0.5, 0.4);
    setCompleted(true);
  };

  const handleSaveMoment = () => {
    saveMoment({
      gameId: 'distance-safe',
      gameTitle: isAr ? 'مسافة (الوحدة والقرب)' : 'Safe Distance',
      quote: isAr ? 'لا تقترب لحد الاحتراق، ولا تبتعد لحد الصقيع؛ كن في المسافة الآمنة.' : 'Not too close to burn, not too far to freeze.',
      reflection: userReflection || (isAr ? 'وجدت المسافة الذهبية التي تحمي قلبي وتصل ودي.' : 'Discovered the golden relational distance.'),
      tag: isAr ? 'المسافة الآمنة' : 'Relational Balance'
    });
    soundManager.playHarmonicAffirmation();
    setIsSaved(true);
  };

  const handleRestart = () => {
    soundManager.playSoftTap();
    setDistance(50);
    setCompleted(false);
    setIsSaved(false);
    setUserReflection('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
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
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            {isAr ? '٨. مسافة (الوحدة والقرب) ⚪' : '8. Distance (Warmth vs Space) ⚪'}
          </span>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          {isAr ? `المسافة: ${distance}%` : `Distance: ${distance}%`}
        </span>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">
              {isAr ? 'معضلة العلاقات الإنسانية' : 'The Relational Porcupine Dilemma'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'اضبطي المسافة المريحة بينك وبين الآخر ↔️' : 'Find Your Comfortable Relational Space ↔️'}
            </h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              {isAr
                ? 'حركي الشريط لتحديد المسافة بين دائرتك ودائرة الآخرين. القرب الشديد يخنق، والبعد الشديد يورث البرد؛ ابحثي عن المسافة الذهبية.'
                : 'Slide to adjust the distance between you and the other. Too close suffocates, too far freezes.'}
            </p>
          </div>

          {/* Interactive Dynamic Circles Display */}
          <div className="py-8 relative h-48 bg-stone-50 rounded-3xl border border-stone-200 flex items-center justify-center overflow-hidden">
            {/* Circle 1: Me */}
            <div 
              className="w-24 h-24 rounded-full bg-emerald-600 text-white font-extrabold flex flex-col items-center justify-center text-xs shadow-md transition-all duration-200"
              style={{ transform: `translateX(${isAr ? distance * 0.8 : -distance * 0.8}px)` }}
            >
              <span className="text-lg">🌿</span>
              <span>{isAr ? 'أنا' : 'Me'}</span>
            </div>

            {/* Circle 2: The Other */}
            <div 
              className="w-24 h-24 rounded-full bg-indigo-600 text-white font-extrabold flex flex-col items-center justify-center text-xs shadow-md transition-all duration-200"
              style={{ transform: `translateX(${isAr ? -distance * 0.8 : distance * 0.8}px)` }}
            >
              <span className="text-lg">👥</span>
              <span>{isAr ? 'الآخر' : 'Other'}</span>
            </div>
          </div>

          {/* Distance Slider Control */}
          <div className="max-w-md mx-auto space-y-3">
            <input
              type="range"
              min="5"
              max="95"
              value={distance}
              onChange={(e) => {
                soundManager.playSoftTap();
                setDistance(Number(e.target.value));
              }}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-bold px-1">
              <span>{isAr ? 'قرب شديد (0%)' : 'Close (0%)'}</span>
              <span className="text-emerald-700">{isAr ? 'المسافة الذهبية' : 'Golden Distance'}</span>
              <span>{isAr ? 'بعد تام (100%)' : 'Distant (100%)'}</span>
            </div>
          </div>

          {/* Current Status Box */}
          <div className={`p-4 rounded-2xl border-2 text-xs space-y-1 max-w-md mx-auto ${status.color}`}>
            <span className="font-extrabold text-sm block">{status.label}</span>
            <p className="leading-relaxed">{status.desc}</p>
          </div>

          <div className="flex justify-end pt-2 max-w-md mx-auto">
            <button
              disabled={!isGolden}
              onClick={handleFinish}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isGolden
                  ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isAr ? 'اعتماد المسافة الذهبية ✓' : 'Lock Golden Distance ✓'}
            </button>
          </div>
        </div>
      ) : (
        /* Peaceful End Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto text-3xl">
            ⚪
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'المسافة أمان وليست قطيعة 🌿' : 'Distance is Safety, Not Disconnect'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              {isAr
                ? '«كن لطيفاً وقريباً بحيث تمنح الدفء، ومستقلاً بحيث لا تحترق بأزمات غيرك. في الاعتدال تكمن ديمومة العلاقات».'
                : 'True intimacy requires healthy separation. You can love deeply without losing your sovereignty.'}
            </p>
          </div>

          {/* Reflection Input */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2 text-start">
            <label className="text-xs font-bold text-stone-700 block">
              {isAr ? 'سؤال خفيف: من هو الشخص الذي تحتاجين معه لإعادة ضبط مسافة الأمان؟' : 'Who in your life calls for a gentle reset of distance?'}
            </label>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={isAr ? 'خاطرة شخصية عن حدودك...' : 'A reflection on your balance...'}
              className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-indigo-600"
            />
            <div className="flex justify-end pt-1">
              <button
                disabled={isSaved}
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-300 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? (isAr ? 'تم الحفظ في رحلتي ✓' : 'Saved ✓') : (isAr ? 'احفظ اللحظة في رحلتي' : 'Save Moment')}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة' : 'Replay'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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
