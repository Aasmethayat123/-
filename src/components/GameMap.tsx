import React, { useState } from 'react';
import { Language, GameMode } from '../types';
import { SCENARIOS } from '../data/scenarios';
import { AVATARS } from '../utils/gameState';
import { soundManager } from '../utils/audio';
import { getSavedMoments } from '../utils/moments';
import { getCurrentAwarenessLevel } from '../data/gamificationData';
import { 
  Play, 
  Star, 
  Layers, 
  Heart, 
  Sparkles, 
  ShieldAlert, 
  Zap, 
  Compass,
  ArrowRight,
  Hand,
  Repeat,
  Mountain,
  ShoppingBag,
  Shield,
  Coffee,
  MessageCircle,
  Users,
  Sun,
  Activity,
  Infinity as InfinityIcon,
  Anchor,
  Bookmark,
  Wind,
  BookOpen,
  Award,
  Palette,
  Timer
} from 'lucide-react';

interface GameMapProps {
  language: Language;
  onSelectLevel: (scenarioId: string) => void;
  onNavigateMode: (mode: GameMode) => void;
  playerStats: {
    xp: number;
    gems: number;
    levelStars: Record<string, number>;
    avatarId: string;
  };
  onOpenAvatarModal: () => void;
}

type CategoryTab = 'all' | 'nesma9' | 'projective' | 'physical_quests' | 'somatic' | 'cognitive';

export const GameMap: React.FC<GameMapProps> = ({
  language,
  onSelectLevel,
  onNavigateMode,
  playerStats,
  onOpenAvatarModal
}) => {
  const isAr = language === 'ar';
  const scenarios = SCENARIOS[language];
  const currentAvatar = AVATARS[language].find(a => a.id === playerStats.avatarId) || AVATARS[language][0];
  const savedCount = getSavedMoments().length;

  const [activeTab, setActiveTab] = useState<CategoryTab>('all');

  // The 9 Core Nesma Hayat Games
  const nesma9Games = [
    {
      id: 'hands-control' as GameMode,
      number: '١',
      title: isAr ? 'في إيدي / برّا إيدي' : 'In My Hands / Outside',
      desc: isAr ? 'دائرة السيطرة؛ فرز ما تملكه عما ليس بيدك' : 'Circle of control: distinguish what you can change',
      icon: Hand,
      color: 'from-emerald-500 to-teal-700',
      badge: isAr ? 'دائرة السيطرة' : 'Control'
    },
    {
      id: 'reframe-sentence' as GameMode,
      number: '٢',
      title: isAr ? 'بدّلي الجملة' : 'Reframe the Sentence',
      desc: isAr ? 'تحويل الصوت الداخلي القاسي إلى لغة حنونة' : 'Soften the harsh inner critic with truth',
      icon: Repeat,
      color: 'from-amber-500 to-orange-600',
      badge: isAr ? 'الصوت الداخلي' : 'Inner Voice'
    },
    {
      id: 'break-mountain' as GameMode,
      number: '٣',
      title: isAr ? 'كسّري الجبل' : 'Break the Mountain',
      desc: isAr ? 'تفكيك الحمل الدراسي والضغوط لخطوات صغيرة' : 'Deconstruct overwhelming tasks into micro-steps',
      icon: Mountain,
      color: 'from-teal-600 to-cyan-700',
      badge: isAr ? 'الحمل والضغوط' : 'Deconstruct'
    },
    {
      id: 'gather-bubbles' as GameMode,
      number: '٤',
      title: isAr ? 'لمّ اللي تقدر تلمّيه' : 'Gather What You Can',
      desc: isAr ? 'تخفيف زحمة الدماغ واختيار ۳ فقاعات لليوم' : 'Select 3 priorities for today, let the rest float',
      icon: ShoppingBag,
      color: 'from-sky-500 to-blue-700',
      badge: isAr ? 'دماغ زحمة' : 'Mental Space'
    },
    {
      id: 'boundaries-circle' as GameMode,
      number: '٥',
      title: isAr ? 'حدودك حواليك' : 'Your Boundaries',
      desc: isAr ? 'الدائرة الآمنة لحماية طاقتك واختيار ما يدخل' : 'Protect your safe circle with gentle boundaries',
      icon: Shield,
      color: 'from-violet-500 to-purple-700',
      badge: isAr ? 'الحدود الشخصية' : 'Boundaries'
    },
    {
      id: 'gentle-break' as GameMode,
      number: '٦',
      title: isAr ? 'فاصل إجباري لطيف' : 'Mandatory Gentle Break',
      desc: isAr ? 'راحة مستحقة لدقيقة واحدة بدون تأنيب ضمير' : 'Guilt-free one-minute pause and rest',
      icon: Coffee,
      color: 'from-amber-600 to-yellow-600',
      badge: isAr ? 'الراحة المستحقة' : 'Rest'
    },
    {
      id: 'first-sentence' as GameMode,
      number: '٧',
      title: isAr ? 'الجملة الأولى' : 'The First Sentence',
      desc: isAr ? 'تفكيك كلام الأسرة وترتيب كلماتك الحقيقية' : 'Untangle early family words into healing truth',
      icon: MessageCircle,
      color: 'from-pink-500 to-rose-600',
      badge: isAr ? 'كلام الأسرة' : 'Family Echoes'
    },
    {
      id: 'distance-safe' as GameMode,
      number: '٨',
      title: isAr ? 'مسافة (الوحدة والقرب)' : 'Safe Distance',
      desc: isAr ? 'ضبط المسافة الذهبية المريحة بينك وبين الآخرين' : 'Find the comfortable relational balance',
      icon: Users,
      color: 'from-indigo-500 to-blue-700',
      badge: isAr ? 'المسافة الآمنة' : 'Relational'
    },
    {
      id: 'small-light' as GameMode,
      number: '٩',
      title: isAr ? 'نور صغير (الرجاء)' : 'A Little Light (Hope)',
      desc: isAr ? 'تغذية نقطة النور لتتسع وتبدد العتمة برفق' : 'Nurture the quiet ember of hope within',
      icon: Sun,
      color: 'from-yellow-400 to-amber-600',
      badge: isAr ? 'الرجاء والأمل' : 'Hope'
    }
  ];

  // Somatic / Psychomotor Games
  const somaticGames = [
    {
      id: 'game-butterfly-tap' as GameMode,
      title: isAr ? 'نقر الفراشة الثنائي 🦋' : 'Bilateral Butterfly Tap 🦋',
      desc: isAr ? 'تحفيز الفصين وتفريغ القلق بحركة اليدين والصوت المجسم' : 'Bilateral stimulation & amygdala regulation',
      icon: Heart,
      color: 'from-teal-500 to-emerald-700',
      badge: isAr ? 'حركي / EMDR' : 'Somatic EMDR'
    },
    {
      id: 'game-somatic-shake' as GameMode,
      title: isAr ? 'نفض وتفريغ التوتر 🫨' : 'Somatic Shake 🫨',
      desc: isAr ? 'تفريغ هرمونات الكورتيزول والأدرينالين من عضلات الجسد' : 'Discharge survival adrenaline from body zones',
      icon: Activity,
      color: 'from-orange-500 to-amber-700',
      badge: isAr ? 'تفريغ جسدي' : 'Somatic Release'
    },
    {
      id: 'game-pmr-squeeze' as GameMode,
      title: isAr ? 'الشد والارتخاء العضلي ✊' : 'PMR Squeeze & Melt ✊',
      desc: isAr ? 'تقنية جاكوبسون للاسترخاء العصبي العضلي العميق' : 'Progressive neuromuscular relaxation',
      icon: Hand,
      color: 'from-rose-500 to-pink-700',
      badge: isAr ? 'استرخاء عضلي' : 'PMR'
    },
    {
      id: 'game-sensory-grounding' as GameMode,
      title: isAr ? 'تأريض الحواس 5-4-3-2-1 ⚓' : '5-4-3-2-1 Sensory Grounding ⚓',
      desc: isAr ? 'إعادة العقل للحاضر الفيزيائي عبر الحواس الخمس' : 'Anchor to the physical room with 5 senses',
      icon: Anchor,
      color: 'from-emerald-600 to-teal-800',
      badge: isAr ? 'تأريض حواسي' : 'Grounding'
    },
    {
      id: 'game-infinity-flow' as GameMode,
      title: isAr ? 'مسار اللانهاية البصري (∞) 🌊' : 'Infinity Flow Tracker 🌊',
      desc: isAr ? 'تنظيم حركة العين وتنشيط العصب الحائر للاسترخاء' : 'Ocular-motor tracking & vagal calming',
      icon: InfinityIcon,
      color: 'from-cyan-500 to-blue-700',
      badge: isAr ? 'بصري حركي' : 'Ocular-Motor'
    },
    {
      id: 'game-balloon-breath' as GameMode,
      title: isAr ? 'بالون التنفس الحركي 🎈' : 'Breath Balloon Flight 🎈',
      desc: isAr ? 'تنفس بطني حركي للتحليق في سماء هادئة وتهدئة النبض' : 'Diaphragmatic breath flight & parasympathetic regulation',
      icon: Wind,
      color: 'from-sky-400 to-blue-600',
      badge: isAr ? 'تنفس حركي' : 'Somatic Breath'
    }
  ];

  // Subconscious & Projective Gamified Exploration
  const projectiveGames = [
    {
      id: 'cards-insight' as GameMode,
      title: isAr ? 'البطاقات المقلوبة 🃏' : 'Insight Cards 🃏',
      desc: isAr ? 'سؤال وموقف باطني مفاجئ يجعلك تفكرين في مساحة أعمق دون استجواب' : 'Intuitive subconscious inquiry without direct interrogation',
      icon: Sparkles,
      color: 'from-violet-500 to-purple-800',
      badge: isAr ? 'استكشاف باطني' : 'Insight Cards'
    },
    {
      id: 'scenarios-quick' as GameMode,
      title: isAr ? 'اختبارات السيناريوهات السريعة 🎭' : 'Interactive Scenarios 🎭',
      desc: isAr ? 'موقف تخيلي سريع (الأسانسير، الرسالة المجهولة) يكشف نمطك النفسي' : 'Quick dilemmas revealing your natural coping archetype',
      icon: Users,
      color: 'from-amber-500 to-orange-700',
      badge: isAr ? 'تحليل النمط' : 'Archetype'
    },
    {
      id: 'visual-projection' as GameMode,
      title: isAr ? 'إسقاط المشاعر البصري 🎨' : 'Visual Projection 🎨',
      desc: isAr ? 'تأمل المشهد والرمز يكشف ما يخزنه اللاوعي برفق' : 'What your eyes catch first reveals subconscious need',
      icon: Palette,
      color: 'from-teal-500 to-emerald-800',
      badge: isAr ? 'إسقاط لاواعي' : 'Projection'
    }
  ];

  // Physical & Somatic Gamified Quests
  const physicalQuestGames = [
    {
      id: 'micro-challenge-30s' as GameMode,
      title: isAr ? 'تحدي الـ 30 ثانية الحركي ⏱️' : '30-Sec Physical Challenge ⏱️',
      desc: isAr ? 'حركة حقيقية في غرفتك لكسر الجمود + لوحة تفريغ الطاقة الحركية' : 'Physical micro-actions breaking loops + touch & release pad',
      icon: Timer,
      color: 'from-orange-500 to-red-600',
      badge: isAr ? 'حركي واقعي' : 'Physical 30s'
    },
    {
      id: 'daily-quests' as GameMode,
      title: isAr ? 'كروت المهام اليومية 📜' : 'Daily Action Quests 📜',
      desc: isAr ? 'بدل نصيحة تقليدية؛ مهمة حركية أو تواصلية تطبقينها فوراً وتمنحك XP' : 'Embodied daily actions resetting neurobiology',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-700',
      badge: isAr ? 'مهام حركية' : 'Daily Quests'
    },
    {
      id: 'wisdom-vault' as GameMode,
      title: isAr ? 'صندوق كروت الحكمة ومستويات الوعي 👑' : 'Wisdom Vault & Levels 👑',
      desc: isAr ? 'استعراض مستويات وعيك الخمسة والكروت النادرة التي فتحتيها' : 'Track your 5 awareness levels and unlocked rare cards',
      icon: Award,
      color: 'from-yellow-400 to-amber-600',
      badge: isAr ? 'نظام المكافآت' : 'Vault & Levels'
    }
  ];

  const currentLevel = getCurrentAwarenessLevel(playerStats.xp, language);

  // Cognitive Challenges
  const cognitiveGames = [
    {
      id: 'challenge-separate' as GameMode,
      title: isAr ? 'حلبة: افصل بينها' : 'Arena: Separate Them',
      desc: isAr ? 'فرز سريع: فكرة 💭 أم شعور 💛 أم حقيقة 📋' : 'Sort: Thought, Feeling, or Fact',
      icon: Layers,
      color: 'from-indigo-500 to-indigo-700',
      badge: isAr ? 'الفرز السريع' : 'Cognitive Blitz'
    },
    {
      id: 'challenge-feeling' as GameMode,
      title: isAr ? 'كاشف المشاعر الدفينة' : 'Emotion Detective',
      desc: isAr ? 'اكتشاف المشاعر الهشة تحت درع الغضب' : 'Detect tender emotions beneath anger',
      icon: Heart,
      color: 'from-amber-500 to-amber-700',
      badge: isAr ? 'الذكاء العاطفي' : 'Granularity'
    },
    {
      id: 'challenge-perspective' as GameMode,
      title: isAr ? 'ميزان الأفكار والزوايا' : 'Perspective Scale',
      desc: isAr ? 'موازنة الكفة ورفع ثقل الفكرة السلبية' : 'Balance cognitive weights with reframes',
      icon: Sparkles,
      color: 'from-sky-500 to-sky-700',
      badge: isAr ? 'إعادة الصياغة' : 'Reframing'
    },
    {
      id: 'challenge-react' as GameMode,
      title: isAr ? 'ثواني قبل الانفجار' : 'Before You React',
      desc: isAr ? 'وقفة الأنفاس ومحاكي عواقب رد الفعل' : 'Slow-mo pause & consequence simulator',
      icon: ShieldAlert,
      color: 'from-rose-500 to-rose-700',
      badge: isAr ? 'محاكي العواقب' : 'The Pause'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      {/* Player Game HUD Header */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-5 sm:p-6 shadow-md border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Avatar info & switcher */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <button
            onClick={() => {
              soundManager.playSoftTap();
              onOpenAvatarModal();
            }}
            className="relative group cursor-pointer"
            title={isAr ? 'تغيير الشخصية' : 'Change Character'}
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${currentAvatar.color} flex items-center justify-center text-2xl shadow-inner border-2 border-stone-700 group-hover:scale-105 transition-transform`}>
              {currentAvatar.avatarChar}
            </div>
            <span className="absolute -bottom-1 -right-1 bg-stone-800 text-[10px] px-1.5 py-0.5 rounded-full border border-stone-600 font-bold">
              {isAr ? 'تبديل' : 'Edit'}
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-wide">
                {currentAvatar.name}
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                {currentAvatar.title}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
              {currentAvatar.personality}
            </p>
          </div>
        </div>

        {/* Level Stats Bar & My Journey shortcut */}
        <div className="flex items-center gap-3 sm:gap-4 bg-stone-800/80 px-4 py-2 rounded-2xl border border-stone-700/60 text-xs w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block font-bold">
                {isAr ? 'نقاط الوعي' : 'XP'}
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {playerStats.xp}
              </span>
            </div>
          </div>

          {/* Awareness Level Badge & Shortcut to Wisdom Vault */}
          <button
            onClick={() => onNavigateMode('wisdom-vault')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl font-bold cursor-pointer transition-colors border border-amber-400/30"
            title={isAr ? 'عرض مستوى الوعي وصندوق كروت الحكمة' : 'View Awareness Level & Wisdom Cards'}
          >
            <span>{currentLevel.badge}</span>
            <span className="max-w-[120px] truncate">{currentLevel.title}</span>
          </button>

          <div className="h-6 w-px bg-stone-700" />

          {/* Shortcut to My Journey */}
          <button
            onClick={() => onNavigateMode('my-journey')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/60 hover:bg-emerald-700 text-emerald-200 rounded-xl font-bold cursor-pointer transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isAr ? `دفتر رحلتي (${savedCount})` : `Diary (${savedCount})`}</span>
          </button>
        </div>
      </div>

      {/* Discover Articles Callout Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 text-start">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              {isAr ? 'إضاءات ومقالات نسمة حياة 💡' : 'Nesma Hayat Discover & Readings 💡'}
            </h3>
            <p className="text-xs text-stone-600 line-clamp-1">
              {isAr ? 'اقرأي الفكرة النظرية وادخلي فوراً للعبتها النفسية المرتبطة بها!' : 'Read practical psychological insights and jump into the linked game!'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playSoftTap();
            onNavigateMode('discover');
          }}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-transform hover:scale-103 shrink-0 shadow-xs flex items-center gap-1.5"
        >
          <span>{isAr ? 'استكشاف المقالات والألعاب' : 'Explore Readings'}</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </button>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-200/60 rounded-2xl overflow-x-auto text-xs font-bold">
        {[
          { id: 'all' as CategoryTab, label: isAr ? 'كل الألعاب هنا 🎮' : 'All Games 🎮' },
          { id: 'nesma9' as CategoryTab, label: isAr ? 'ألعاب نسمة حياة (٩ ألعاب) 🌿' : '9 Nesma Games 🌿' },
          { id: 'projective' as CategoryTab, label: isAr ? 'استكشاف باطني وبصري 🔮' : 'Projective 🔮' },
          { id: 'physical_quests' as CategoryTab, label: isAr ? 'تحديات حركية وكروت حكمة ⚡' : 'Physical Quests ⚡' },
          { id: 'somatic' as CategoryTab, label: isAr ? 'ألعاب نفسية حركية 🫨' : 'Psychomotor 🫨' },
          { id: 'cognitive' as CategoryTab, label: isAr ? 'فكر فيها ورحلة المواقف 🧠' : 'Cognitive & Story 🧠' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundManager.playSoftTap();
              setActiveTab(tab.id);
            }}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-300/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: The 9 Core Nesma Hayat Games */}
      {/* ============================================================== */}
      {(activeTab === 'all' || activeTab === 'nesma9') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                {isAr ? 'خريطة نسمة حياة الرسمية (٩ ألعاب)' : 'Core Nesma Hayat Roadmap (9 Games)'}
              </span>
              <h2 className="text-xl font-bold text-stone-900">
                {isAr ? 'ألعاب استكشاف الذات والهدوء الداخلي' : 'Inner Peace & Self-Exploration Games'}
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              {isAr ? 'بدون تقييم · حفظ اختياري في رحلتي' : 'Non-diagnostic · Save to diary'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nesma9Games.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNavigateMode(game.id);
                  }}
                  className="text-start bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-stone-400 font-mono">
                        {game.number}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 block w-fit mb-1">
                        {game.badge}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                        {game.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 pt-2 border-t border-stone-100">
                    <span>{isAr ? 'العب الآن 🌿' : 'Play Now 🌿'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: Subconscious & Projective Gamified Exploration */}
      {/* ============================================================== */}
      {(activeTab === 'all' || activeTab === 'projective') && (
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-violet-700 uppercase tracking-wider block">
                {isAr ? 'استكشاف الذات غير المباشر (Subconscious & Projective)' : 'Subconscious & Projective Games'}
              </span>
              <h2 className="text-xl font-bold text-stone-900">
                {isAr ? 'بدل السؤال المباشر.. أسئلة وسيناريوهات غير متوقعة' : 'Insight Cards & Projective Dilemmas'}
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              {isAr ? 'بدون استجواب · اكتشاف النمط' : 'Intuitive Archetypes'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectiveGames.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNavigateMode(game.id);
                  }}
                  className="text-start bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-xs hover:shadow-md hover:border-violet-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 block w-fit mb-1 border border-violet-200">
                        {game.badge}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-violet-800 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        {game.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-violet-800 pt-2 border-t border-stone-100">
                    <span>{isAr ? 'ابدأي الاستكشاف 🔮' : 'Explore 🔮'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: Physical & Somatic Gamified Quests & Rewards */}
      {/* ============================================================== */}
      {(activeTab === 'all' || activeTab === 'physical_quests') && (
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block">
                {isAr ? 'الألعاب والتحديات الحركية في يومك (Physical & Gamified Actions)' : 'Physical Gamified Micro-Quests'}
              </span>
              <h2 className="text-xl font-bold text-stone-900">
                {isAr ? 'حركة حقيقية في يومك + نظام مكافآت وكروت حكمة' : 'Embodied Actions & Wisdom Rewards'}
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              {isAr ? 'تحدي ٣٠ ثانية · مهام يومية' : '30s Challenges & Quests'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {physicalQuestGames.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNavigateMode(game.id);
                  }}
                  className="text-start bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-xs hover:shadow-md hover:border-orange-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 block w-fit mb-1 border border-orange-200">
                        {game.badge}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-orange-800 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        {game.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-orange-800 pt-2 border-t border-stone-100">
                    <span>{isAr ? 'فتح التحدي ⚡' : 'Open Quest ⚡'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 4: Psychomotor Somatic Games */}
      {/* ============================================================== */}
      {(activeTab === 'all' || activeTab === 'somatic') && (
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
              {isAr ? 'الألعاب النفسية الحركية والجسدية (Psychomotor & Somatic)' : 'Psychomotor & Somatic Games'}
            </span>
            <h2 className="text-xl font-bold text-stone-900">
              {isAr ? 'تنظيم الجهاز العصبي وتفريغ التوتر حركياً' : 'Nervous System & Somatic Regulation'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {somaticGames.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNavigateMode(game.id);
                  }}
                  className="text-start bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-xs hover:shadow-md hover:border-teal-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 block w-fit mb-1 border border-teal-200">
                        {game.badge}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-teal-800 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        {game.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-teal-800 pt-2 border-t border-stone-100">
                    <span>{isAr ? 'بدء التمرين الحركي 🫨' : 'Start Somatic 🫨'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: Think About It Story Levels & Arenas */}
      {/* ============================================================== */}
      {(activeTab === 'all' || activeTab === 'cognitive') && (
        <div className="space-y-6 pt-4 border-t border-stone-200">
          <div>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
              {isAr ? 'لعبة: فَكِّر فِيهَا — رحلة المواقف اليومية' : 'Think About It — Everyday Situations'}
            </span>
            <h2 className="text-xl font-bold text-stone-900">
              {isAr ? 'من يقود: أفكارنا أم مشاعرنا؟ (المستويات الخمسة)' : 'Who Leads: Thoughts or Feelings?'}
            </h2>
          </div>

          {/* Story Levels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scenarios.map((sc, index) => {
              const starsWon = playerStats.levelStars[sc.id] || 0;
              return (
                <div
                  key={sc.id}
                  className="bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        {isAr ? `المستوى ${index + 1}` : `Level ${index + 1}`} · {sc.context}
                      </span>
                      <h3 className="text-base font-bold text-stone-900">
                        {sc.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx <= starsWon ? 'text-amber-400 fill-amber-400' : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 font-serif leading-relaxed line-clamp-2">
                    «{sc.situation}»
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-emerald-800 font-bold">+150 XP</span>
                    <button
                      onClick={() => {
                        soundManager.playSoftTap();
                        onSelectLevel(sc.id);
                      }}
                      className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      {isAr ? 'خوض الموقف' : 'Play Level'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cognitive Arenas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {cognitiveGames.map((arena) => {
              const Icon = arena.icon;
              return (
                <button
                  key={arena.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNavigateMode(arena.id);
                  }}
                  className="text-start bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${arena.color} text-white flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-stone-900 truncate">{arena.title}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug line-clamp-2">{arena.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
