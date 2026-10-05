import React from 'react';
import { Language, GameMode } from '../types';
import { soundManager } from '../utils/audio';
import { 
  HeartHandshake, 
  Wind, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Brain
} from 'lucide-react';

interface FinalScreenProps {
  language: Language;
  onNavigate: (mode: GameMode) => void;
  onOpenBreathing: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({
  language,
  onNavigate,
  onOpenBreathing
}) => {
  const isAr = language === 'ar';

  const pillars = [
    {
      title: isAr ? 'ليست كل فكرة حقيقة' : 'Not Every Thought is a Fact',
      body: isAr 
        ? 'تتدفق في عقولنا آلاف الأفكار التلقائية يومياً. مجرد وميض فكرة في ذهنك لا يجعلها أمراً واقعاً أو مصيراً محتوماً.'
        : 'Our minds generate thousands of automatic thoughts daily. Having a thought does not make it real or prophetic.',
      icon: Brain
    },
    {
      title: isAr ? 'مشاعرك ليست عيباً ولا ضعفاً' : 'Your Feelings Are Not a Weakness',
      body: isAr
        ? 'المشاعر رسائل وإشارات بيولوجية تخبرك بما يحدث في داخلك. لا تخجل منها ولا تحاربها، بل امنحها اسماً وافهم رسالتها برفق.'
        : 'Emotions are biological signals and messengers. They are not something to be ashamed of or repressed; name them with gentle curiosity.',
      icon: HeartHandshake
    },
    {
      title: isAr ? 'المشاعر لا تُملي عليك رد فعلك' : 'Emotions Don’t Dictate Actions',
      body: isAr
        ? 'يمكنك أن تشعر باندفاع الغضب، أو وخزة الخوف، ومع ذلك تختار رداً هادئاً رصيناً يحفظ كرامتك وسلامك الداخلي.'
        : 'You can feel an intense surge of anger or fear, and still choose a dignified, grounded action in the pause.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero Affirmation Banner */}
      <div className="bg-gradient-to-br from-emerald-900 to-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 text-center shadow-lg relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800/60 text-emerald-200 rounded-full text-xs font-semibold mb-4 border border-emerald-600/40">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>{isAr ? 'رسالة نسمة حياة الختامية' : 'Nesma Hayat Final Reflection'}</span>
        </span>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-serif leading-tight max-w-2xl mx-auto">
          {isAr
            ? '«أنت أكثر بكثير من مجرد أفكارك العابرة، ومشاعرك ليست نقطة ضعف.»'
            : '“You are more than your thoughts. Your emotions are not a weakness.”'}
        </h1>

        <p className="text-emerald-100/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6 font-light">
          {isAr
            ? 'عندما تتعلم أن تلاحظها وتفهم ما يدور بداخلك، تبدأ في الاستجابة بطريقة مختلفة، وتسترد مقود حياتك.'
            : 'When you learn to notice and understand them, you can begin to respond differently.'}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-xs text-emerald-300">
          <span>🌿</span>
          <span className="font-medium">
            {isAr 
              ? 'نسمة حياة — نساعدك على فهم نفسك قبل أن يصبح العبء أثقل'
              : 'Nesma Hayat — Helping you understand yourself before the struggle becomes heavier'}
          </span>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="mb-10">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            {isAr ? 'الركائز الثلاث للوعي النفسي' : 'The Three Pillars of Awareness'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            {isAr ? 'الرسالة وراء لعبة فكر فيها' : 'The Message Behind the Game'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical Action Bar */}
      <div className="bg-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-200 text-center space-y-4">
        <h3 className="text-base font-bold text-stone-900">
          {isAr ? 'أين تحب أن تبدأ خطوتك القادمة؟' : 'Where would you like to explore next?'}
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          {isAr
            ? 'تستطيع دائماً العودة إلى رحلة المواقف، أو تجربة التحديات التفاعلية لصقل مهاراتك اليومية.'
            : 'Return to the situation journey, or sharpen your daily skills in the interactive challenges.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              soundManager.playSoftTap();
              onNavigate('journey');
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <span>{isAr ? 'خوض رحلة موقف جديد' : 'Explore Situation Journey'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          <button
            onClick={() => {
              soundManager.playSoftTap();
              onNavigate('challenge-separate');
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <span>{isAr ? 'تحدي: افصل بينها' : 'Separate Them Challenge'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playSoftTap();
              onOpenBreathing();
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <Wind className="w-4 h-4 text-emerald-700" />
            <span>{isAr ? 'وقفة تنفس واعية' : 'Mindful Breathing'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
