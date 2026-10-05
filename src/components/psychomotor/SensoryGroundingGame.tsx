import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { 
  RotateCcw, 
  Sparkles, 
  Eye, 
  Hand, 
  Ear, 
  Flower2, 
  Coffee, 
  CheckCircle2, 
  ArrowRight,
  Anchor
} from 'lucide-react';

interface SensoryGroundingGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

export const SensoryGroundingGame: React.FC<SensoryGroundingGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const steps = [
    {
      level: 5,
      sense: isAr ? 'البصر 👁️' : 'Sight 👁️',
      title: isAr ? '5 أشياء يمكنك رؤيتها الآن' : '5 Things You Can See',
      desc: isAr ? 'انظر حولك وابحث عن تفاصيل صغيرة: لون، حافة طاولة، بقعة ضوء...' : 'Scan the room for subtle visual details: light, shadows, textures...',
      examples: isAr ? ['لون الستارة', 'ساعة الحائط', 'نبتة أو زجاجة', 'حذاء أو حقيبة', 'حافة الشاشة'] : ['Wall shadow', 'Window frame', 'A plant', 'A cup', 'Key texture']
    },
    {
      level: 4,
      sense: isAr ? 'اللمس 🖐️' : 'Touch 🖐️',
      title: isAr ? '4 أشياء يمكنك لمسها بيدك' : '4 Things You Can Touch',
      desc: isAr ? 'المس سطح المكتب، قماش ملابسك، برودة الهاتف، أو ملمس مقعدك...' : 'Touch desk surface, fabric of your shirt, phone coolness, or hair...',
      examples: isAr ? ['ملمس القماش', 'برودة الزجاج أو الطاولة', 'راحة قدميك على الأرض', 'أصابع يديك تتشابك'] : ['Fabric of jeans', 'Cool desk', 'Feet flat on floor', 'Fingers intertwined']
    },
    {
      level: 3,
      sense: isAr ? 'السمع 👂' : 'Hearing 👂',
      title: isAr ? '3 أصوات يمكنك سماعها في المحيط' : '3 Things You Can Hear',
      desc: isAr ? 'أنصت بدقة: صوت المكيف، حركة بالخارج، أنفاسك الهادئة...' : 'Listen carefully: hum of AC, distant street sound, your breath...',
      examples: isAr ? ['صوت الأنفاس', 'صوت في الشارع أو الغرفة', 'صوت نقرات المفاتيح'] : ['Hum of computer fan', 'Distant birds or traffic', 'Your own breathing']
    },
    {
      level: 2,
      sense: isAr ? 'الشم 👃' : 'Smell 👃',
      title: isAr ? 'شيئان يمكنك شمهما' : '2 Things You Can Smell',
      desc: isAr ? 'رائحة القهوة، عطرك، هواء الغرفة، أو خذ نفساً عميقاً من معصمك...' : 'Coffee aroma, laundry soap, room air, or your skin...',
      examples: isAr ? ['رائحة معصمك أو عطرك', 'هواء الغرفة المنعش'] : ['Laundry detergent', 'Fresh air or coffee']
    },
    {
      level: 1,
      sense: isAr ? 'التذوق 👅' : 'Taste 👅',
      title: isAr ? 'شيء واحد يمكنك تذوقه' : '1 Thing You Can Taste',
      desc: isAr ? 'رشفة ماء، طعم الشاي في فمك، أو مرر لسانك على أسنانك بهدوء...' : 'Take a sip of water, or notice the clean taste in your mouth...',
      examples: isAr ? ['رشفة ماء نقية'] : ['Sip of cool water']
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const step = steps[currentStepIndex];

  const handleToggleItem = (idx: number) => {
    soundManager.playPop();
    if (!completedItems.includes(idx)) {
      const next = [...completedItems, idx];
      setCompletedItems(next);
      if (next.length >= step.examples.length) {
        soundManager.playHarmonicAffirmation();
      }
    }
  };

  const handleNextStep = () => {
    soundManager.playSoftTap();
    if (currentStepIndex + 1 < steps.length) {
      setCurrentStepIndex(prev => prev + 1);
      setCompletedItems([]);
    } else {
      setIsFinished(true);
      soundManager.playLevelUpFanfare();
      triggerConfetti(0.5, 0.3);
      if (onAddXP) onAddXP(60);
    }
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setCurrentStepIndex(0);
    setCompletedItems([]);
    setIsFinished(false);
  };

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
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {isAr ? 'لعبة: تأريض الحواس الخمسة 5-4-3-2-1 ⚓' : 'Psychomotor: 5-4-3-2-1 Grounding ⚓'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
          <Anchor className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? `المستوى ${step.level}` : `Level ${step.level}`}</span>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block">
              {isAr ? 'إعادة العقل إلى الواقع الحقيقي الملموس' : 'Anchor to the Physical Present'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {step.title}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-serif">
              «{step.desc}»
            </p>
          </div>

          {/* Interactive Check Items */}
          <div className="space-y-2.5 max-w-md mx-auto">
            {step.examples.map((item, idx) => {
              const isChecked = completedItems.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleToggleItem(idx)}
                  className={`w-full text-start p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <span className="text-sm font-semibold">{item}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isChecked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-300'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-3 max-w-md mx-auto">
            <button
              disabled={completedItems.length < step.examples.length}
              onClick={handleNextStep}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                completedItems.length >= step.examples.length
                  ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'الحاسة التالية' : 'Next Sense'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center space-y-5 animate-fade-in shadow-md">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-4xl shadow-inner">
            ⚓
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isAr ? 'أنت الآن راسخ في اللحظة الراهنة!' : 'Fully Anchored in the Present!'}
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
              {isAr
                ? 'لقد قطعت الحواس الخمس سلسلة الأفكار الوهمية وأعادتك إلى أمان غرفتك وجسدك الحقيقي.'
                : 'Your 5 physical senses have successfully interrupted the mental panic loop.'}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة التأريض' : 'Ground Again'}</span>
            </button>
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
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
