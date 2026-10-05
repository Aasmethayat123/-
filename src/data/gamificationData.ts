import { WisdomCard, DailyQuest, AwarenessLevel, Language } from '../types';

export const AWARENESS_LEVELS: Record<Language, AwarenessLevel[]> = {
  ar: [
    {
      level: 1,
      title: 'المستيقظ للأنفاس 🌿',
      minXp: 0,
      badge: '🌱',
      description: 'بداية ملاحظة الجسد والتنفس؛ تدرك أنك لست مجرد أفكار تجري في رأسك.'
    },
    {
      level: 2,
      title: 'فاحص الأفكار 🔍',
      minXp: 150,
      badge: '🔍',
      description: 'بدأت تميز بين الفكرة والشعور والحقيقة؛ لم تعد تصدق كل ما يمليه عقلك فوراً.'
    },
    {
      level: 3,
      title: 'حارس الحدود 🛡️',
      minXp: 350,
      badge: '🛡️',
      description: 'تعرف متى تقول نعم ومتى تقول لا؛ تحمي طاقتك دون قسوة أو شعور بالذنب.'
    },
    {
      level: 4,
      title: 'مستوعب العواصف 🌊',
      minXp: 600,
      badge: '🌊',
      description: 'تسمح للمشاعر الثقيلة بالمرور دون أن تغرق فيها؛ جسدك يعرف كيف يفرغ التوتر.'
    },
    {
      level: 5,
      title: 'الحكيم الساكن ☀️',
      minXp: 950,
      badge: '👑',
      description: 'وصلت للمسافة الذهبية؛ قريب من دفء الحياة ومستقل بسلامك وكرامتك الداخلية.'
    }
  ],
  en: [
    {
      level: 1,
      title: 'Breath Awakening 🌿',
      minXp: 0,
      badge: '🌱',
      description: 'Noticing somatic presence; realizing you are not merely your thoughts.'
    },
    {
      level: 2,
      title: 'Thought Inquirer 🔍',
      minXp: 150,
      badge: '🔍',
      description: 'Distinguishing fact from thought; questioning automatic narrative tapes.'
    },
    {
      level: 3,
      title: 'Boundary Guardian 🛡️',
      minXp: 350,
      badge: '🛡️',
      description: 'Protecting sovereignty with compassion, without fear or guilt.'
    },
    {
      level: 4,
      title: 'Storm Absorber 🌊',
      minXp: 600,
      badge: '🌊',
      description: 'Allowing emotions to flow through somatic release without sinking.'
    },
    {
      level: 5,
      title: 'Still Sage ☀️',
      minXp: 950,
      badge: '👑',
      description: 'Centered in the golden relational distance with deep rooted peace.'
    }
  ]
};

export const WISDOM_CARDS_COLLECTION: WisdomCard[] = [
  {
    id: 'w1',
    title: 'سر التفويض',
    quote: 'ما ليس بيدك لا تحمله فوق ظهرك؛ فرّق بين السعي والنتيجة.',
    category: 'دائرة السيطرة',
    rarity: 'common',
    icon: '🤲',
    unlockedAtXp: 0,
    reflection: 'كلما زاد تركيزك على ما في يدك، قل قلقك من المجهول.'
  },
  {
    id: 'w2',
    title: 'لغة الرحمة الذاتية',
    quote: 'لا أحد يزهر بالقسوة؛ كلمي نفسك كما تكلمين أحب الناس إليك.',
    category: 'الصوت الداخلي',
    rarity: 'common',
    icon: '💬',
    unlockedAtXp: 100,
    reflection: 'الناقد الداخلي هو طفل خائف متنكر في رداء الجلاد.'
  },
  {
    id: 'w3',
    title: 'تفتيت الجبال',
    quote: 'الجبل لا يُنقل دفعة واحدة، بل حجراً بعد حجر.',
    category: 'الإنتاجية بالرفق',
    rarity: 'rare',
    icon: '⛰️',
    unlockedAtXp: 250,
    reflection: 'الشلل التسويفي ينتهي مع أول خطوة مدتها 5 دقائق فقط.'
  },
  {
    id: 'w4',
    title: 'سحر النفض الجسدي',
    quote: 'الجسد يتذكر ما ينساه العقل؛ تفريغ التوتر الحركي يعيد الأمان للخلايا.',
    category: 'الجسد العصبي',
    rarity: 'rare',
    icon: '🫨',
    unlockedAtXp: 400,
    reflection: 'العصب الحائر يستجيب للاهتزاز والزفير الطويل أسرع من الكلام.'
  },
  {
    id: 'w5',
    title: 'المسافة الذهبية',
    quote: 'قريب بما يكفي للدفء، وبعيد بما يكفي لحفظ السلام والكرامة.',
    category: 'العلاقات والحدود',
    rarity: 'legendary',
    icon: '⚪',
    unlockedAtXp: 650,
    reflection: 'الحب الحقيقي يزدهر في المساحة الآمنة التي تحترم كينونة الطرفين.'
  },
  {
    id: 'w6',
    title: 'النور الحي الداخلي',
    quote: 'الظلام لا يملك قوة حقيقية، هو مجرد غياب للنور. ونورك في صدرك ينتظر التذكر.',
    category: 'الرجاء الحي',
    rarity: 'legendary',
    icon: '🕯️',
    unlockedAtXp: 900,
    reflection: 'في أشد الليالي حلكة، تظل شعلة الرجاء حية تسع كل ضعفك.'
  }
];

export const DAILY_QUESTS_DATA: DailyQuest[] = [
  {
    id: 'q1',
    title: 'اكتبي الشعور في ورقة ومزّقيها',
    actionText: 'اكتبي أي كلمة قاسية أو قلق حالي على ورقة صغيرة حقيقية، ثم قطعيها إرباً إرباً وألقيها في السلة.',
    psychologicalConcept: 'التجسيد الحسي والفصل الإدراكي (Defusion & Tactile Release): العقل يصدق الحركة الجسدية الملموسة أكثر من الكلام المجرد.',
    xpReward: 40,
    category: 'physical',
    icon: '✂️'
  },
  {
    id: 'q2',
    title: 'تغيير مكان ٣ أشياء حولك',
    actionText: 'قومي فوراً وغيري مكان ٣ أشياء موجودة على مكتبك أو في غرفتك الآن.',
    psychologicalConcept: 'كسر الجمود البصري والمرونة العصبية (Neuroplastic Reorientation): الحركة في المحيط تكسر دوامة التفكير المفرط المغلقة.',
    xpReward: 35,
    category: 'physical',
    icon: '🔄'
  },
  {
    id: 'q3',
    title: 'رشفة ماء بوعي كامل للحواس الخمس',
    actionText: 'اشربي رشفة ماء باردة ببطء شديد، وركزي في ملمس الماء وبرودته وحركته في حلقك.',
    psychologicalConcept: 'التأريض الحسي السريع (Micro-Grounding): تحويل الانتباه من قشرة المخ التحليلية إلى الإحساس الحسي المباشر.',
    xpReward: 30,
    category: 'mindful',
    icon: '💧'
  },
  {
    id: 'q4',
    title: 'ابتسامة دافئة لمرآتك ٥ ثوانٍ',
    actionText: 'انظري لعينيك في المرآة أو كاميرا الهاتف وابتسمي لنفسك ابتسامة اعتراف ورفق مدتها 5 ثوانٍ.',
    psychologicalConcept: 'التغذية الراجعة لعضلات الوجه (Facial Feedback Hypothesis): انقباض عضلات الابتسام يرسل إشارات حيوية لمركز الأمان في الدماغ.',
    xpReward: 40,
    category: 'boundary',
    icon: '🪞'
  },
  {
    id: 'q5',
    title: 'رسالة ود قصيرة من كلمتين',
    actionText: 'أرسلي رسالة لطيفة لشخص تحبينه: «فكرت فيكِ وبتمنى لك يوم دافي».',
    psychologicalConcept: 'إفراز الأوكسيتوسين التواصلي (Social Engagement System): العطاء والتواصل الآمن يخفضان مستويات الكورتيزول في الدم.',
    xpReward: 50,
    category: 'social',
    icon: '💌'
  }
];

export function getCurrentAwarenessLevel(xp: number, language: Language = 'ar'): AwarenessLevel {
  const levels = AWARENESS_LEVELS[language];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXp) {
      return levels[i];
    }
  }
  return levels[0];
}
