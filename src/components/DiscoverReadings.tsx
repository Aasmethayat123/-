import React from 'react';
import { Language, GameMode } from '../types';
import { soundManager } from '../utils/audio';
import { 
  Sparkles, 
  Gamepad2, 
  ArrowRight, 
  BookOpen, 
  Compass, 
  Heart, 
  Clock, 
  ShieldCheck,
  Bookmark
} from 'lucide-react';

interface DiscoverReadingsProps {
  language: Language;
  onNavigateToGame: (gameId: GameMode) => void;
  onBackToMap?: () => void;
}

interface Article {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  category: string;
  summary: string;
  linkedGameId: GameMode;
  linkedGameName: string;
  quote: string;
}

const ARTICLES_DATA: Article[] = [
  {
    id: 'art-control',
    title: 'لماذا يستنزفنا القلق على ما لا نملك تغييره؟',
    subtitle: 'فن التمييز بين دائرة التأثير ودائرة الهموم',
    readTime: 'دقيقتان',
    category: 'الطمأنينة',
    summary: 'معظم طاقتنا النفسية تُهدر في محاولة إجبار العالم أن يسير كما نريد: نتائج الامتحانات، مشاعر الآخرين، وزحمة الطريق. عندما نرسم خطاً فاصلاً بين ما في أيدينا وما هو خارج أيدينا، تعود السكينة فوراً لقلوبنا.',
    linkedGameId: 'hands-control',
    linkedGameName: 'في إيدي / برّا إيدي 🤲',
    quote: '«الهموم تأكلك حين تحاول أن تكون حارساً للكون؛ كن حارساً لسعيك فقط وسلّم الباقي».'
  },
  {
    id: 'art-critic',
    title: 'الصوت الذي يكسر مقاديفنا من الداخل',
    subtitle: 'كيف نتحاور مع الناقد الداخلي القاسي دون أن نهدم أنفسنا؟',
    readTime: '٣ دقائق',
    category: 'الحوار الداخلي',
    summary: 'ذلك الصوت القاسي الذي يهمس: «أنت ضيّعت كل حاجة» أو «محدش هيحبك لو غلطت» ليس حقيقة مطلقة، بل هو مجرد خوف قديم يرتدي قناع القسوة. علاج هذا الصوت ليس إسكاته بالقوة، بل تبديل لغته بحقيقة رحيمة.',
    linkedGameId: 'reframe-sentence',
    linkedGameName: 'بدّلي الجملة 🔄',
    quote: '«تكلمي مع نفسك كما تتكلمين مع صديقة مقربة تبكي؛ لا أحد يزهر بالقسوة».'
  },
  {
    id: 'art-mountain',
    title: 'سر «كسر الجبل»: لماذا نشلّ أمام المهام الكبيرة؟',
    subtitle: 'كيف نحول الشلل التسويفي إلى حركة خفيفة مدتها ٥ دقائق؟',
    readTime: 'دقيقتان',
    category: 'الإنتاجية بالرفق',
    summary: 'عندما ينظر الدماغ إلى المنهج الدراسي أو المشروع ككتلة واحدة ضخمة، يترجمه الجهاز العصبي كخطر داهم فيهرب إلى التشتت والتسويف. السر النفسي البسيط هو كسر الجبل إلى حصى صغيرة لا تخيف العقل.',
    linkedGameId: 'break-mountain',
    linkedGameName: 'كسّري الجبل ⛰️',
    quote: '«الجبل لا يُنقل دفعة واحدة، بل حجراً بعد حجر. ابدأي بصفحة واحدة فقط».'
  },
  {
    id: 'art-bubbles',
    title: 'دماغ زحمة: حين تطلب منك الحياة أن تفعلي كل شيء في ثانية واحدة',
    subtitle: 'قاعدة الفقاعات الثلاث لإنقاذ اليوم المنهك',
    readTime: 'دقيقتان',
    category: 'تخفيف الحمل',
    summary: 'في أيام الضغط، تدور عشرات المشاغل في الرأس كأسراب نحل مزعجة. الحكمة النفسية تقول: لستِ مضطرة لحل كل مشاكل الحياة اليوم. اختاري ۳ أشياء فقط في وسعك، ودعي بقية الأفكار تعوم بسلام.',
    linkedGameId: 'gather-bubbles',
    linkedGameName: 'لمّ اللي تقدر تلمّيه 🫧',
    quote: '«يومك يسع لشيء واحد فقط في اللحظة؛ لا تحملي الغد في قلب اليوم».'
  },
  {
    id: 'art-boundaries',
    title: 'حدودك ليست أنانية.. بل صيانة لبابك الداخلي',
    subtitle: 'كيف تقولي «لا» دون أن تشعري بالذنب؟',
    readTime: '٣ دقائق',
    category: 'العلاقات والحدود',
    summary: 'كثير منا يخلط بين الطيبة والاستباحة. وضع الحدود لا يعني قسوة القلب أو إيذاء الآخرين، بل يعني أنك تقررين ما يسمح له بالدخول لغرفتك النفسية لحماية طاقتك وقدرتك على الاستمرار في العطاء.',
    linkedGameId: 'boundaries-circle',
    linkedGameName: 'حدودك حواليك 🛡️',
    quote: '«الحدود ليست جدراناً للقطيعة، بل أبواباً بمقابض داخلية أنت تملكين مفتاحها».'
  },
  {
    id: 'art-somatic',
    title: 'لماذا تنفض الحيوانات أجسادها بعد النجاة من الخطر؟',
    subtitle: 'المدخل الجسدي (Somatic) لتفريغ الصدمات والتوتر المتراكم',
    readTime: 'دقيقتان',
    category: 'علم الأعصاب الجسدي',
    summary: 'عندما يستجيب الجسد للتوتر، يُفرز الأدرينالين والكورتيزول وتبقى هذه الشحنة حبيسة العضلات حتى بعد انتهاء الموقف. النفض الحركي والتحفيز الثنائي هما أسرع وسيلة لإعادة ضبط الجهاز العصبي الحائر.',
    linkedGameId: 'game-somatic-shake',
    linkedGameName: 'نفض وتفريغ التوتر 🫨',
    quote: '«الجسد يتذكر ما ينساه العقل؛ تفريغ التوتر الحركي يعيد الأمان لخلاياك».'
  }
];

export const DiscoverReadings: React.FC<DiscoverReadingsProps> = ({
  language,
  onNavigateToGame,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? '← خريطة الألعاب' : '← Games Map'}
            </button>
          )}
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {isAr ? 'إضاءات ومقالات نسمة حياة 💡' : 'Nesma Hayat Discover & Insights 💡'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-300 font-bold">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>{ARTICLES_DATA.length} {isAr ? 'إضاءات مرتبطة بالألعاب' : 'Game-Linked Articles'}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block">
          {isAr ? 'اقرأي الفكرة.. ثم عيشيها في لعبة تفاعلية' : 'Read the insight, then play it live'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          {isAr ? 'إضاءات نفسية تُعاش وتُمارس 🌿' : 'Psychological Insights to Experience 🌿'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {isAr
            ? 'المعرفة النظرية وحدها لا تغير المشاعر؛ لذلك يرتبط كل مقال هنا بلعبة نفسية حركية تفاعلية ترسخ الفكرة في ذاكرتك وجسدك.'
            : 'Knowledge alone does not regulate the nervous system. Each article links directly to its interactive somatic or cognitive game.'}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ARTICLES_DATA.map((art) => (
          <div
            key={art.id}
            className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:border-amber-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  {art.category}
                </span>
                <span className="flex items-center gap-1 text-stone-400 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{art.readTime}</span>
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                  {art.title}
                </h3>
                <span className="text-xs text-stone-500 font-medium block mt-1">
                  {art.subtitle}
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans line-clamp-3">
                {art.summary}
              </p>

              {/* Wisdom Quote */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs font-serif font-bold text-stone-800 italic">
                {art.quote}
              </div>
            </div>

            {/* Direct Link to the corresponding game */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400">
                {isAr ? 'التطبيق العملي:' : 'Hands-on:'}
              </span>

              <button
                onClick={() => {
                  soundManager.playSoftTap();
                  onNavigateToGame(art.linkedGameId);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-transform hover:scale-103 shadow-xs"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? `العب: ${art.linkedGameName}` : `Play Game`}</span>
                <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Disclaimer Note */}
      <div className="p-5 bg-stone-100/80 rounded-2xl border border-stone-200 text-center max-w-xl mx-auto space-y-1.5 text-stone-600">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-stone-800">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{isAr ? 'تنويه نسمة حياة:' : 'Nesma Hayat Disclaimer:'}</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          {isAr
            ? 'هذه المقالات والألعاب أدوات استكشاف ذاتي وممارسات للوعي والتهدئة النفسية، وليست تشخيصاً طبياً أو بديلاً عن الاستشارة المتخصصة.'
            : 'These readings and games are supportive self-exploration and somatic regulation tools, not a clinical psychiatric diagnosis.'}
        </p>
      </div>
    </div>
  );
};
