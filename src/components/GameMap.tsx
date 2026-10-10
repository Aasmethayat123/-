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
  Timer,
  Flame,
  Eraser,
  FolderKanban,
  Settings,
  Search,
  X
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

type CategoryTab = 'all' | 'visceral' | 'nesma9' | 'projective' | 'physical_quests' | 'somatic' | 'cognitive';

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

  const [activeTab, setActiveTab] = useState<CategoryTab>('nesma9');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 6 Visceral & Tactile Psychological Games
  const visceralGames = [
    {
      id: 'touch-and-break' as GameMode,
      title: isAr ? '١. المرآة المكسورة 🪞💥' : '1. Shatter the Mirror 🪞💥',
      desc: isAr ? 'اضغطي بقوة وسرعة لتحطيم زجاج الأوهام واكتشاف كارت السر الصادم' : 'Forceful tactile smash breaking illusions to reveal the hidden truth',
      icon: Flame,
      color: 'from-rose-500 to-red-700',
      badge: isAr ? 'تحطيم وهزة حسية' : 'Touch & Break'
    },
    {
      id: 'body-motion-challenge' as GameMode,
      title: isAr ? '٢. عقارب الساعة المعكوسة ⏳🤸' : '2. Reverse Clock Motion ⏳🤸',
      desc: isAr ? 'سيبي الشاشة وركزي مع جسمك ١٥ ثانية مع حركة مجنونة واكتشفي نمطك' : '15-second screenless body dare & playful archetype breakdown',
      icon: Activity,
      color: 'from-amber-500 to-orange-600',
      badge: isAr ? 'حركة ١٥ ثانية' : 'Body Motion'
    },
    {
      id: 'emotion-roulette' as GameMode,
      title: isAr ? '٣. مسدس المشاعر (الروليت) 🎯🎡' : '3. Emotion Roulette 🎯🎡',
      desc: isAr ? 'لفي العجلة واضغطي إطلاق لوقفها على تحدي واقعي ومرح في يومك' : 'High-speed wheel shoot unlocking real-life spontaneous micro-dares',
      icon: Sparkles,
      color: 'from-sky-500 to-blue-700',
      badge: isAr ? 'روليت المشاعر' : 'Roulette Shoot'
    },
    {
      id: 'scratch-to-reveal' as GameMode,
      title: isAr ? '٤. مسح الحبر وكشط الحقيقة 🎨🖤' : '4. Scratch to Reveal 🎨🖤',
      desc: isAr ? 'اكشطي طبقة الحبر بصباعك لتفريغ التوتر واكتشاف كاريكاتير الحقيقة' : 'Tactile scratch canvas relieving tension to unveil comforting art',
      icon: Eraser,
      color: 'from-emerald-500 to-teal-700',
      badge: isAr ? 'كشط الحبر' : 'Scratch & Win'
    },
    {
      id: 'multi-sensory-quest' as GameMode,
      title: isAr ? '٥. صندوق الأسرار والروائح ☕🌿' : '5. Multi-Sensory Quest ☕🌿',
      desc: isAr ? 'مهمة حواس حقيقية في غرفتك (شم، لمس، سمع) مع كشف سر كيمياء الدماغ' : 'Real-room 5 senses quest proving instant neurochemical shift',
      icon: Coffee,
      color: 'from-amber-600 to-yellow-600',
      badge: isAr ? 'حواس وأعصاب' : 'Multi-Sensory'
    },
    {
      id: 'speed-lie-detector' as GameMode,
      title: isAr ? '٦. رادار كاشف الكذب الذاتي ⚡🕵️' : '6. Self-Lie Radar ⚡🕵️',
      desc: isAr ? 'أسئلة خاطفة وسريعة تمنع عقلك من التجميل وتكشف حقيقة قلبك' : 'Sub-second reflex quiz bypassing analytical ego to reveal raw truth',
      icon: Zap,
      color: 'from-red-600 to-rose-700',
      badge: isAr ? 'كاشف الكذب' : 'Speed Radar'
    }
  ];

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

  // Unified list of all 36 games for instant live search and universal filtering
  const allGamesUnified = [
    ...nesma9Games.map((g) => ({
      id: g.id,
      title: g.title,
      desc: g.desc,
      icon: g.icon,
      color: g.color,
      badge: g.badge,
      category: 'nesma9' as CategoryTab,
      categoryLabel: isAr ? 'ألعاب نسمة حياة' : 'Nesma Hayat',
      actionType: 'navigate' as const
    })),
    ...visceralGames.map((g) => ({
      id: g.id,
      title: g.title,
      desc: g.desc,
      icon: g.icon,
      color: g.color,
      badge: g.badge,
      category: 'visceral' as CategoryTab,
      categoryLabel: isAr ? 'التفريغ الحسي والصدمة' : 'Visceral & Tactile',
      actionType: 'navigate' as const
    })),
    ...projectiveGames.map((g) => ({
      id: g.id,
      title: g.title,
      desc: g.desc,
      icon: g.icon,
      color: g.color,
      badge: g.badge,
      category: 'projective' as CategoryTab,
      categoryLabel: isAr ? 'استكشاف باطني' : 'Projective',
      actionType: 'navigate' as const
    })),
    ...physicalQuestGames.map((g) => ({
      id: g.id,
      title: g.title,
      desc: g.desc,
      icon: g.icon,
      color: g.color,
      badge: g.badge,
      category: 'physical_quests' as CategoryTab,
      categoryLabel: isAr ? 'تحديات وكروت حكمة' : 'Physical Quests',
      actionType: 'navigate' as const
    })),
    ...somaticGames.map((g) => ({
      id: g.id,
      title: g.title,
      desc: g.desc,
      icon: g.icon,
      color: g.color,
      badge: g.badge,
      category: 'somatic' as CategoryTab,
      categoryLabel: isAr ? 'نفسية حركية' : 'Psychomotor',
      actionType: 'navigate' as const
    })),
    ...cognitiveGames.map((g) => ({
      id: g.id,
      title: g.title,
      desc: g.desc,
      icon: g.icon,
      color: g.color,
      badge: g.badge,
      category: 'cognitive' as CategoryTab,
      categoryLabel: isAr ? 'حلبات فكر فيها' : 'Cognitive Arena',
      actionType: 'navigate' as const
    })),
    ...scenarios.map((sc, idx) => ({
      id: sc.id as GameMode,
      title: sc.title,
      desc: sc.situation,
      icon: Sparkles,
      color: 'from-indigo-600 to-blue-700',
      badge: isAr ? `مستوى ${idx + 1} · ${sc.context}` : `Level ${idx + 1} · ${sc.context}`,
      category: 'cognitive' as CategoryTab,
      categoryLabel: isAr ? 'رحلة المواقف' : 'Story Level',
      actionType: 'level' as const,
      levelId: sc.id
    }))
  ];

  // Filter games based on search query
  const searchResults = searchQuery.trim()
    ? allGamesUnified.filter((g) => {
        const query = searchQuery.trim().toLowerCase();
        return (
          g.title.toLowerCase().includes(query) ||
          g.desc.toLowerCase().includes(query) ||
          g.badge.toLowerCase().includes(query)
        );
      })
    : [];

  const handleGameClick = (item: { actionType: 'navigate' | 'level'; id: GameMode; levelId?: string }) => {
    soundManager.playSoftTap();
    if (item.actionType === 'level' && item.levelId) {
      onSelectLevel(item.levelId);
    } else {
      onNavigateMode(item.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-6 animate-fade-in">
      {/* Return to Choose Your Adventure Mode */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundManager.playSoftTap();
            onNavigateMode('map');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <span className="text-base group-hover:scale-110 transition-transform">🌿</span>
          <span className="rtl:rotate-180 group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>{isAr ? 'العودة إلى نظام: اختار مغامرتك' : 'Back to: Choose Your Adventure'}</span>
        </button>

        <span className="text-xs font-extrabold text-stone-400 dark:text-stone-500 hidden sm:inline">
          {isAr ? 'المكتبة الشاملة للألعاب (٣٦ لعبة)' : 'Full Games Catalog (36 Games)'}
        </span>
      </div>

      {/* Calm & Refined Welcome Hero + Player Stats */}
      <div className="bg-gradient-to-r from-emerald-50/80 via-white to-stone-50 dark:from-stone-900/90 dark:via-stone-900/95 dark:to-stone-950 border border-emerald-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xs transition-colors space-y-4">
        {/* Top line: Greeting + Player Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Greeting */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onOpenAvatarModal();
              }}
              className="relative group cursor-pointer shrink-0"
              title={isAr ? 'تغيير الشخصية' : 'Change Character'}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentAvatar.color} flex items-center justify-center text-2xl shadow-xs border border-white/60 dark:border-stone-700 group-hover:scale-105 transition-transform`}>
                {currentAvatar.avatarChar}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-stone-900 dark:bg-emerald-600 text-[9px] text-white px-1 py-0.2 rounded-full font-bold">
                {isAr ? 'تغيير' : 'Edit'}
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">
                  {isAr ? 'فكّر فيها — نسمة حياة' : 'Think About It — Nesma Hayat'}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  {currentAvatar.name}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                {isAr
                  ? 'مساحتك الهادئة لتفكيك الأفكار، تنظيم المشاعر، والتفريغ الحسي'
                  : 'Your calm sanctuary for reframing thoughts and nervous system regulation'}
              </p>
            </div>
          </div>

          {/* Quick Stats: XP + Awareness Level + Diary */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
            {/* XP Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs font-bold text-amber-900 dark:text-amber-200 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{playerStats.xp} XP</span>
            </div>

            {/* Level Badge linking to Wisdom Vault */}
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onNavigateMode('wisdom-vault');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700/80 text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-colors shadow-2xs"
              title={isAr ? 'مستوى الوعي الحالي وخزينة الحكمة' : 'Awareness Level & Wisdom Cards'}
            >
              <span>{currentLevel.badge}</span>
              <span className="truncate max-w-[100px] sm:max-w-xs">{currentLevel.title}</span>
            </button>

            {/* Diary Shortcut */}
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onNavigateMode('my-journey');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              title={isAr ? 'عرض اللحظات المحفوظة' : 'My Saved Diary'}
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-200" />
              <span>{isAr ? `دفتر رحلتي (${savedCount})` : `Diary (${savedCount})`}</span>
            </button>
          </div>
        </div>

        {/* Bottom line: Quick compact shortcuts to Discover Readings, Projects & CMS */}
        <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onNavigateMode('discover');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 font-semibold cursor-pointer transition-colors border border-stone-200/80 dark:border-stone-700/60"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAr ? 'إضاءات وقراءات نفسية' : 'Readings & Insights'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playSoftTap();
                onNavigateMode('projects');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 font-semibold cursor-pointer transition-colors border border-stone-200/80 dark:border-stone-700/60"
            >
              <FolderKanban className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? 'المشروعات المعتمدة' : 'Verified Projects'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundManager.playSoftTap();
              onNavigateMode('admin-cms');
            }}
            className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer transition-colors"
            title={isAr ? 'إدارة المحتوى للمسؤول' : 'Content Management'}
          >
            <Settings className="w-3 h-3" />
            <span>{isAr ? 'إدارة المحتوى' : 'CMS'}</span>
          </button>
        </div>
      </div>

      {/* Search & Category Tabs Strip */}
      <div className="space-y-3">
        {/* Instant Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث في ٣٦ لعبة أو تمرين نفسي بالاسم، الكلمات الدلالية، أو الهدف...'
                : 'Search any of 36 games or somatic exercises...'
            }
            className="w-full ps-10 pe-9 py-2.5 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl text-xs font-medium text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5 cursor-pointer"
              title={isAr ? 'مسح البحث' : 'Clear search'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clean, Non-Crowded Category Filter Tabs */}
        {!searchQuery && (
          <div className="flex items-center gap-1.5 p-1.5 bg-stone-100/90 dark:bg-stone-900/90 rounded-2xl overflow-x-auto text-xs font-bold border border-stone-200/70 dark:border-stone-800 scrollbar-none">
            {[
              { id: 'nesma9' as CategoryTab, label: isAr ? 'نسمة حياة (٩)' : 'Nesma Hayat (9)', icon: '🌿' },
              { id: 'visceral' as CategoryTab, label: isAr ? 'تفريغ وصدمة (٦)' : 'Visceral (6)', icon: '🪞' },
              { id: 'projective' as CategoryTab, label: isAr ? 'استكشاف باطني (٣)' : 'Projective (3)', icon: '🔮' },
              { id: 'physical_quests' as CategoryTab, label: isAr ? 'تحديات وكروت (٣)' : 'Quests (3)', icon: '⚡' },
              { id: 'somatic' as CategoryTab, label: isAr ? 'نفسية حركية (٦)' : 'Psychomotor (6)', icon: '🫨' },
              { id: 'cognitive' as CategoryTab, label: isAr ? 'مواقف وفكر فيها (٩)' : 'Cognitive (9)', icon: '🧠' },
              { id: 'all' as CategoryTab, label: isAr ? 'عرض الكل (٣٦)' : 'All Games (36)', icon: '🎮' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-xs font-bold ${
                    isActive
                      ? 'bg-stone-900 dark:bg-emerald-700 text-white shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* SEARCH RESULTS VIEW (when searchQuery is active) */}
      {/* ============================================================== */}
      {searchQuery && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>{isAr ? 'نتائج البحث عن:' : 'Search Results for:'}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono">«{searchQuery}»</span>
              <span className="text-xs text-stone-400 font-normal">({searchResults.length})</span>
            </h2>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer font-semibold underline"
            >
              {isAr ? 'عرض الأقسام' : 'Back to categories'}
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-stone-900/60 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
              <span className="text-3xl">🔍</span>
              <h3 className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                {isAr ? 'لم يتم العثور على ألعاب مطابقة' : 'No matching games found'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                {isAr ? 'جرّب البحث بكلمة مختلفة مثل: تحكم، تنفس، جبل، مرآة، شعور' : 'Try searching for: control, breath, mountain, mirror'}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-stone-900 dark:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'إعادة ضبط البحث' : 'Clear search'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {searchResults.map((game) => {
                const Icon = game.icon;
                return (
                  <button
                    key={`${game.category}-${game.id}`}
                    onClick={() => handleGameClick(game)}
                    className="text-start bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 shadow-2xs hover:shadow-md hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                          {game.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">
                          {game.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-400 pt-2 border-t border-stone-100 dark:border-stone-800/80">
                      <span>{isAr ? 'فتح اللعبة 🌿' : 'Play Now 🌿'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* CATEGORY 1: The 9 Core Nesma Hayat Games */}
      {/* ============================================================== */}
      {!searchQuery && (activeTab === 'all' || activeTab === 'nesma9') && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                {isAr ? 'ألعاب نسمة حياة الأساسية (٩ ألعاب)' : 'Core Nesma Hayat Games (9)'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'استكشاف الذات، السيطرة، والهدوء الداخلي' : 'Inner Peace & Self-Exploration'}
              </h2>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {isAr ? 'بدون تشخيص · حفظ اختياري' : 'Self-guided'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {nesma9Games.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNavigateMode(game.id);
                  }}
                  className="text-start bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-stone-400 dark:text-stone-500 font-mono">
                        {game.number}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 block w-fit mb-1 border border-stone-200 dark:border-stone-700">
                        {game.badge}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">
                        {game.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-400 pt-2 border-t border-stone-100 dark:border-stone-800/80">
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
      {/* CATEGORY 2: Visceral & Tactile Psychological Games */}
      {/* ============================================================== */}
      {!searchQuery && (activeTab === 'all' || activeTab === 'visceral') && (
        <div className={`space-y-3.5 ${activeTab === 'all' ? 'pt-4 border-t border-stone-200 dark:border-stone-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
                {isAr ? 'ألعاب الصدمة والتفريغ الحسي الجريء (٦ ألعاب)' : 'Visceral & Tactile Games (6)'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'تحطيم الأوهام، تحدي الحركة، ومسدس المشاعر' : 'Tactile Smash & Motion Dares'}
              </h2>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {isAr ? 'تفريغ فوري · إثبات حي' : 'Immediate Release'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {visceralGames.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNavigateMode(game.id);
                  }}
                  className="text-start bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:border-rose-400 dark:hover:border-rose-500/70 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 block w-fit mb-1 border border-rose-200 dark:border-rose-900/60">
                        {game.badge}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">
                        {game.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-rose-800 dark:text-rose-400 pt-2 border-t border-stone-100 dark:border-stone-800/80">
                    <span>{isAr ? 'العب هذه اللعبة 💥' : 'Play Now 💥'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CATEGORY 3: Subconscious & Projective Gamified Exploration */}
      {/* ============================================================== */}
      {!searchQuery && (activeTab === 'all' || activeTab === 'projective') && (
        <div className={`space-y-3.5 ${activeTab === 'all' ? 'pt-4 border-t border-stone-200 dark:border-stone-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider block">
                {isAr ? 'استكشاف الذات الباطني والإسقاط (٣ ألعاب)' : 'Subconscious & Projective (3)'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'كروت البصيرة، السيناريوهات السريعة، والإسقاط البصري' : 'Insight Cards & Projective Dilemmas'}
              </h2>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {isAr ? 'بدون استجواب' : 'Archetype Insights'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {projectiveGames.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNavigateMode(game.id);
                  }}
                  className="text-start bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:border-violet-400 dark:hover:border-violet-500/70 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 block w-fit mb-1 border border-violet-200 dark:border-violet-900/60">
                        {game.badge}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">
                        {game.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-violet-800 dark:text-violet-400 pt-2 border-t border-stone-100 dark:border-stone-800/80">
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
      {/* CATEGORY 4: Physical Quests & Wisdom Rewards */}
      {/* ============================================================== */}
      {!searchQuery && (activeTab === 'all' || activeTab === 'physical_quests') && (
        <div className={`space-y-3.5 ${activeTab === 'all' ? 'pt-4 border-t border-stone-200 dark:border-stone-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider block">
                {isAr ? 'التحديات الحركية وكروت الحكمة (٣ أدوات)' : 'Physical Quests & Rewards (3)'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'تحدي ٣٠ ثانية، كروت المهام، وصندوق مستويات الوعي' : 'Embodied Actions & Wisdom Vault'}
              </h2>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {isAr ? 'مكافآت وXP' : 'Quests & Badges'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {physicalQuestGames.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNavigateMode(game.id);
                  }}
                  className="text-start bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:border-orange-400 dark:hover:border-orange-500/70 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 block w-fit mb-1 border border-orange-200 dark:border-orange-900/60">
                        {game.badge}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">
                        {game.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-orange-800 dark:text-orange-400 pt-2 border-t border-stone-100 dark:border-stone-800/80">
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
      {/* CATEGORY 5: Psychomotor Somatic Games */}
      {/* ============================================================== */}
      {!searchQuery && (activeTab === 'all' || activeTab === 'somatic') && (
        <div className={`space-y-3.5 ${activeTab === 'all' ? 'pt-4 border-t border-stone-200 dark:border-stone-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
                {isAr ? 'الألعاب النفسية الحركية (٦ ألعاب)' : 'Psychomotor Somatic Games (6)'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'تنظيم الجهاز العصبي وتفريغ التوتر حركياً' : 'Nervous System Regulation'}
              </h2>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {isAr ? 'تهدئة حركية' : 'Somatic Flow'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {somaticGames.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNavigateMode(game.id);
                  }}
                  className="text-start bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:border-teal-400 dark:hover:border-teal-500/70 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 block w-fit mb-1 border border-teal-200 dark:border-teal-900/60">
                        {game.badge}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">
                        {game.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-teal-800 dark:text-teal-400 pt-2 border-t border-stone-100 dark:border-stone-800/80">
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
      {/* CATEGORY 6: Cognitive Scenarios & Arenas (فكر فيها) */}
      {/* ============================================================== */}
      {!searchQuery && (activeTab === 'all' || activeTab === 'cognitive') && (
        <div className={`space-y-4 ${activeTab === 'all' ? 'pt-4 border-t border-stone-200 dark:border-stone-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                {isAr ? 'فَكِّر فِيهَا — رحلة المواقف وحلبات الأفكار (٩ تجارب)' : 'Cognitive Story & Arenas (9)'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'من يقود: أفكارنا أم مشاعرنا؟' : 'Thoughts vs. Feelings'}
              </h2>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {isAr ? '٥ مستويات + ٤ حلبات' : '5 Levels + 4 Arenas'}
            </span>
          </div>

          {/* Story Levels (5 levels) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {scenarios.map((sc, index) => {
              const starsWon = playerStats.levelStars[sc.id] || 0;
              return (
                <div
                  key={sc.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-4.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
                        {isAr ? `المستوى ${index + 1}` : `Level ${index + 1}`} · {sc.context}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                        {sc.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx <= starsWon ? 'text-amber-400 fill-amber-400' : 'text-stone-200 dark:text-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 font-serif leading-relaxed line-clamp-2">
                    «{sc.situation}»
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-bold">+150 XP</span>
                    <button
                      onClick={() => {
                        soundManager.playSoftTap();
                        onSelectLevel(sc.id);
                      }}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      {isAr ? 'خوض الموقف' : 'Play Level'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cognitive Arenas (4 games) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {cognitiveGames.map((arena) => {
              const Icon = arena.icon;
              return (
                <button
                  key={arena.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    onNavigateMode(arena.id);
                  }}
                  className="text-start bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-3.5 shadow-2xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/70 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${arena.color} text-white flex items-center justify-center shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {arena.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug line-clamp-2">{arena.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
