import { GameMode } from '../types';
import { 
  Brain, 
  Shield, 
  Heart, 
  Scissors, 
  Compass, 
  Flame, 
  Lightbulb, 
  MessageCircle, 
  Sparkles,
  Users,
  LucideIcon
} from 'lucide-react';

export interface WorkshopQuestion {
  key: string;
  num: string;
  titleAr: string;
  titleEn: string;
  placeholderAr: string;
  placeholderEn: string;
}

export interface WorkshopLinkedGame {
  id: GameMode;
  titleAr: string;
  titleEn: string;
  roleAr: string;
  roleEn: string;
  badgeAr: string;
  badgeEn: string;
}

export interface WorkshopItem {
  id: string;
  number: number;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  categoryKey: 'cognitive' | 'boundaries' | 'compassion' | 'defusion' | 'communication' | 'somatic';
  categoryLabelAr: string;
  categoryLabelEn: string;
  targetAudienceAr: string;
  targetAudienceEn: string;
  suggestedDurationMinutes: number;
  icon: LucideIcon;
  themeColor: {
    bg: string;
    text: string;
    border: string;
    gradient: string;
    accent: string;
  };
  goalAr: string;
  goalEn: string;
  situationAr: string;
  situationEn: string;
  practicalActivityTitleAr: string;
  practicalActivityTitleEn: string;
  practicalActivityDescAr: string;
  practicalActivityDescEn: string;
  debriefWisdomAr: string;
  debriefWisdomEn: string;
  linkedGames: WorkshopLinkedGame[];
  questions: WorkshopQuestion[];
}

export const WORKSHOPS_CATALOG: WorkshopItem[] = [
  // 1. ورشة من الفكرة إلى الشعور
  {
    id: 'thought-to-feeling',
    number: 1,
    titleAr: 'ورشة: «من الفكرة إلى الشعور: فك شفرات التفسير التلقائي»',
    titleEn: 'Workshop: “From Thought to Feeling: Decoding Automatic Reframes”',
    subtitleAr: 'تفكيك التشوهات المعرفية وقراءة الأفكار والاستنتاج الكارثي في التواصل اليومي',
    subtitleEn: 'Unpacking cognitive distortions, mind-reading, and catastrophic assumptions in daily life',
    categoryKey: 'cognitive',
    categoryLabelAr: 'العلاج المعرفي CBT',
    categoryLabelEn: 'Cognitive CBT',
    targetAudienceAr: 'الشباب، طلاب الجامعات، فرق العمل، عامة الباحثين عن الوعي',
    targetAudienceEn: 'Youth, university students, workplace teams, general seekers of mindfulness',
    suggestedDurationMinutes: 45,
    icon: Brain,
    themeColor: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-800 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800',
      gradient: 'from-indigo-600 to-blue-700',
      accent: 'indigo'
    },
    goalAr: 'تدريب المشاركين على التمييز الفوري بين الواقعة المجردة والقصة الدرامية التي يصنعها العقل بسرعة البرق، وبناء تفسيرات إنسانية رحيمة تحمي من الانفجار العاطفي.',
    goalEn: 'Train participants to clearly distinguish raw events from the lightning-fast stories minds construct, fostering charitable interpretations that prevent emotional explosions.',
    situationAr: 'أرسلتَ رسالة لفريق العمل أو لصديق مقرّب وشاهدها فوراً (علامتا القراءة الزرقاوان)، لكنه لم يرد طوال اليوم.. كيف بدأت القصة في عقلك وماذا نتج عنها؟',
    situationEn: 'You sent a crucial text to your team or a close friend. Read receipts confirmed they saw it immediately, yet no reply came all day. What story began to brew?',
    practicalActivityTitleAr: 'تمرين حائط الفرز: (حقائق مثبتة 📋 vs افتراضات خيالية 💭)',
    practicalActivityTitleEn: 'Sorting Wall: (Verified Facts 📋 vs Mental Inventions 💭)',
    practicalActivityDescAr: 'يكتب كل مشارك على بطاقة ما يعرفه يقيناً (الحقيقة: مرت 8 ساعات دون رسالة)، وما اضافه خياله (الافتراض: هو يتجاهلني أو مستاء مني). تتبادل المجموعات البطاقات لتفكيك التخمينات.',
    practicalActivityDescEn: 'Participants write on index cards what they verifiably know (Fact: 8 hours passed without a message) vs what mind fabricated (Assumption: they resent me). Groups swap cards to deconstruct guesses.',
    debriefWisdomAr: 'المشكلة نادراً ما تكمن في تصرفات الآخرين، بل في السرعة التي نصدق بها سيناريوهات الخوف دون دليل. عندما نمنح الآخرين مساحة الإنسانية ونبحث عن فرضيات بديلة، نستعيد زمام سلامنا الداخلي.',
    debriefWisdomEn: 'Friction rarely lives in external behaviors, but in how swiftly we believe catastrophic scripts without proof. Giving people allowance restores our tranquility.',
    linkedGames: [
      {
        id: 'challenge-separate',
        titleAr: 'حلبة: افصل بينها',
        titleEn: 'Arena: Separate Them',
        roleAr: 'تطبيق الفرز السريع بين الفكرة والشعور والحقيقة',
        roleEn: 'Blitz sorting between thoughts, feelings, and facts',
        badgeAr: 'فرز سريع',
        badgeEn: 'Cognitive Blitz'
      },
      {
        id: 'reframe-sentence',
        titleAr: 'بدّلي الجملة',
        titleEn: 'Reframe the Sentence',
        roleAr: 'صياغة التفسير البديل الهادئ للخطاب الداخلي',
        roleEn: 'Construct soothing, rational alternative scripts',
        badgeAr: 'صوت داخلي',
        badgeEn: 'Inner Reframe'
      },
      {
        id: 'challenge-perspective',
        titleAr: 'ميزان الأفكار والزوايا',
        titleEn: 'Perspective Scale',
        roleAr: 'موازنة كفة التفسير السلبي برفع أثقال الزوايا الأخرى',
        roleEn: 'Weigh down negative cognitive bias with balanced reality',
        badgeAr: 'ميزان الأفكار',
        badgeEn: 'Perspective'
      }
    ],
    questions: [
      {
        key: 'thought',
        num: '١',
        titleAr: 'ما هي الفكرة الخاطفة التي لمعت في الذهن أولاً؟',
        titleEn: 'What automatic thought flashed in your mind first?',
        placeholderAr: 'مثال: "هو يستخف بي متعمداً.. لقد أخطأت حين بادرته..."',
        placeholderEn: 'E.g., "They are intentionally disrespecting me; I shouldn’t have reached out..."'
      },
      {
        key: 'emotion',
        num: '٢',
        titleAr: 'ما هو الشعور العاطفي والإحساس البدني المصاحب لتلك الفكرة؟',
        titleEn: 'What emotional feeling and bodily sensation accompanied that thought?',
        placeholderAr: 'مثال: انقباض في المعدة، حرارة بالوجه، حزن مفاجئ، رغبة في العزلة...',
        placeholderEn: 'E.g., Knot in stomach, facial heat, sudden sinking sorrow, withdrawal urge...'
      },
      {
        key: 'reaction',
        num: '٣',
        titleAr: 'ما هو السلوك أو رد الفعل الذي كانت ستندفع إليه لو صدقت الفكرة تماماً؟',
        titleEn: 'What reflex or behavior would you execute if you fully bought that thought?',
        placeholderAr: 'مثال: صمت عقابي، رسالة لوم عاصفة، حذف المحادثة وإلغاء المتابعة...',
        placeholderEn: 'E.g., Silent treatment, accusatory text, blocking, passive aggression...'
      },
      {
        key: 'alternativeExplanation',
        num: '٤',
        titleAr: 'ما هي ٣ تفسيرات إنسانية بديلة محتملة لا علاقة لها بك؟',
        titleEn: 'What are 3 plausible alternative explanations completely unrelated to you?',
        placeholderAr: 'مثال: طارئ أسري مفاجئ، استنزاف طاقة اجتماعية، نسيان أثناء اجتماع...',
        placeholderEn: 'E.g., Family emergency, social exhaustion, battery died, opened while rushing...'
      },
      {
        key: 'emotionalShift',
        num: '٥',
        titleAr: 'كيف يتغير نبضك وموقفك حين تتبنى التفسير البديل الأكثر حكمة ورحمة؟',
        titleEn: 'How does your bodily state transform when adopting the wiser reframe?',
        placeholderAr: 'مثال: ترتخي الأكتاف، يحل التماس العذر والدعاء له بدلاً من الغضب...',
        placeholderEn: 'E.g., Shoulders drop, calm empathy replaces defensiveness, patience emerges...'
      }
    ]
  },

  // 2. ورشة دوائر السيطرة والحدود النفسية
  {
    id: 'control-and-boundaries',
    number: 2,
    titleAr: 'ورشة: «دوائر السيطرة والحدود: صيانة الطاقة النفسية»',
    titleEn: 'Workshop: “Circles of Control & Safe Boundaries: Preserving Energy”',
    subtitleAr: 'فرز أعباء الحياة وتفكيك ثقل إرضاء الآخرين وصياغة حدود لطيفة وحازمة',
    subtitleEn: 'Sorting life burdens, detaching from people-pleasing, and speaking gentle yet firm limits',
    categoryKey: 'boundaries',
    categoryLabelAr: 'الحدود والمسؤولية',
    categoryLabelEn: 'Boundaries & Agency',
    targetAudienceAr: 'المعلمون، الأمهات والآباء، مقدمو الرعاية، المفرطون في الالتزامات',
    targetAudienceEn: 'Educators, parents, healthcare caregivers, chronic over-committers',
    suggestedDurationMinutes: 60,
    icon: Shield,
    themeColor: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      gradient: 'from-emerald-600 to-teal-700',
      accent: 'emerald'
    },
    goalAr: 'تمكين المشاركين من تحديد ما يملكونه فعلياً وما يقع خارج قدرتهم، وتدريبهم على رفض الطلبات المستنزفة بلباقة عالية ووضوح خالٍ من الشعور بالذنب.',
    goalEn: 'Enable participants to distinguish what is genuinely within their locus of control, and practice boundary-setting with graceful firmness devoid of toxic guilt.',
    situationAr: 'تتزاحم عليك طلبات العمل وتوقعات العائلة في وقت واحد، وتشعر بأن طاقتك نفدت تماماً، ومع ذلك تجد صعوبة خانقة في قول (لا) خوفاً من أن تُتهم بالتقصير أو الأنانية..',
    situationEn: 'Work deliverables collide with heavy family expectations. Your battery is at 2%, yet uttering a polite “No” feels impossible due to agonizing guilt.',
    practicalActivityTitleAr: 'تمرين رسم الدائرتين: (ما في إيدي 🤲 vs ما هو برّا إيدي 🌐)',
    practicalActivityTitleEn: 'Two Circles Mapping: (In My Hands 🤲 vs Beyond Reach 🌐)',
    practicalActivityDescAr: 'ترسم المجموعات دائرة داخلية ودائرة خارجية. توضع ردود أفعال الآخرين وتوقعاتهم في الخارج، بينما يوضع وقتنا وطاقتنا وأولوياتنا في الداخل، وتُصاغ جملة اعتذار واحدة ناضجة.',
    practicalActivityDescEn: 'Groups map inner/outer circles. External approvals and moods go outside; current energy, values, and sleep go inside. Everyone drafts one elegant refusal sentence.',
    debriefWisdomAr: 'رسم الحدود ليس جداراً للقطيعة، بل هو باب يحفظ طاقتك كي تبقى قادراً على العطاء الصادق حين تفتح الباب برغبتك، بدلاً من أن تُستنزف حتى الاحتراق.',
    debriefWisdomEn: 'Boundaries are not walls of estrangement; they are sacred doors protecting your capacity to give with joy rather than resentment.',
    linkedGames: [
      {
        id: 'hands-control',
        titleAr: 'في إيدي / برّا إيدي',
        titleEn: 'In My Hands / Outside',
        roleAr: 'فرز تفاعلي سريع لما تملكه عما لا تملكه',
        roleEn: 'Interactive circle of control sorting',
        badgeAr: 'دائرة السيطرة',
        badgeEn: 'Control Circle'
      },
      {
        id: 'boundaries-circle',
        titleAr: 'حدودك حواليك',
        titleEn: 'Your Boundaries',
        roleAr: 'بناء الدائرة الآمنة لحماية حيزك الخاص',
        roleEn: 'Cultivate personal psychological safe radius',
        badgeAr: 'الحدود الشخصية',
        badgeEn: 'Boundaries'
      },
      {
        id: 'break-mountain',
        titleAr: 'كسّري الجبل',
        titleEn: 'Break the Mountain',
        roleAr: 'تفكيك المسؤوليات الضخمة إلى خطوات متناهية الصغر',
        roleEn: 'Deconstruct overwhelming mountains into micro-stones',
        badgeAr: 'تفكيك الضغوط',
        badgeEn: 'Deconstruction'
      }
    ],
    questions: [
      {
        key: 'thought',
        num: '١',
        titleAr: 'ما هي الأعباء أو الهموم التي تحملها اليوم وهي فعلياً خارج نطاق سيطرتك؟',
        titleEn: 'What burdens are you carrying today that are strictly beyond your control?',
        placeholderAr: 'مثال: رضا فلان، نتائج القرارات المستقبلية، أمزجة الآخرين...',
        placeholderEn: 'E.g., Approval of relatives, economic shifts, other people’s emotional reactions...'
      },
      {
        key: 'emotion',
        num: '٢',
        titleAr: 'ما هو الخوف الدفين الذي يجعلك توافق على حساب راحتك وصحتك النفسية؟',
        titleEn: 'What underlying fear makes you over-say “yes” at your health’s expense?',
        placeholderAr: 'مثال: الخوف من فقدان التقدير، الخوف من وصمي بالأنانية، عقدة الذنب...',
        placeholderEn: 'E.g., Fear of being cast out, chronic guilt, belief that my worth equals my sacrifice...'
      },
      {
        key: 'reaction',
        num: '٣',
        titleAr: 'ما هي صياغة جملة الرفض اللطيفة والحازمة التي لا تحتوي على تبريرات مفرطة؟',
        titleEn: 'What is a clean, assertive sentence of decline without over-apologizing?',
        placeholderAr: 'مثال: "يسعدني ثقتك، لكني أعتذر بصدق لعدم قدرتي على تلبية ذلك في هذه الفترة."',
        placeholderEn: 'E.g., "Thank you for trusting me; however, I cannot take this on right now."'
      },
      {
        key: 'alternativeExplanation',
        num: '٤',
        titleAr: 'إذا وضعت ٣ أولويات فقط داخل دائرتك الآمنة لهذا الأسبوع، فماذا ستكون؟',
        titleEn: 'If you only select 3 non-negotiables inside your safe circle this week, what are they?',
        placeholderAr: 'مثال: نوم ٧ ساعات، إنهاء المشروع الأساسي، ساعة هدوء مع العائلة...',
        placeholderEn: 'E.g., 7 hours sleep, wrapping core deliverable, uninterrupted peaceful evening...'
      },
      {
        key: 'emotionalShift',
        num: '٥',
        titleAr: 'ما هو الشعور بالحرية والخفة الذي يملأ صدرك عندما تسلّم ما ليس بيدك لأقداره؟',
        titleEn: 'What sensation of lightness arises when you surrender what you cannot steer?',
        placeholderAr: 'مثال: تنفس عميق، زوال عبء ثقيل عن كاهلي، طمأنينة متزنة...',
        placeholderEn: 'E.g., Deep chest release, weight lifted off neck, quiet steady peace...'
      }
    ]
  },

  // 3. ورشة مرآة الحوار الداخلي والناقد الرحيم
  {
    id: 'inner-dialogue-cft',
    number: 3,
    titleAr: 'ورشة: «مرآة الحوار الداخلي: ترويض الناقد وصناعة المشجع»',
    titleEn: 'Workshop: “The Inner Mirror: Transforming Self-Criticism into Compassion”',
    subtitleAr: 'بروتوكول الشفقة بالذات (CFT) لإصلاح العلاقة الحميمية مع النفس وترميم شروخ الذنب',
    subtitleEn: 'Compassion-Focused Therapy (CFT) to heal self-dialogue and mend cracks of shame',
    categoryKey: 'compassion',
    categoryLabelAr: 'العلاج بالشفقة CFT',
    categoryLabelEn: 'Compassion CFT',
    targetAudienceAr: 'مرضى الكمالية (Perfectionists)، المبدعون، كل من يعاني من جلد الذات الشرس',
    targetAudienceEn: 'Perfectionists, creatives, overachievers battling relentless self-judgment',
    suggestedDurationMinutes: 60,
    icon: Heart,
    themeColor: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-800 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      gradient: 'from-rose-500 via-pink-600 to-indigo-600',
      accent: 'rose'
    },
    goalAr: 'مواجهة أصوات جلد الذات الشرسة وتحويلها إلى صوت "المشجع الحكيم" عبر ركائز التعاطف الثلاث: اليقظة الذهنية، الإنسانية المشتركة، واللطف بالذات.',
    goalEn: 'Transform punitive self-reproach into the voice of a wise compassionate mentor using the 3 pillars: mindfulness, common humanity, and self-kindness.',
    situationAr: 'ارتكبتَ خطأً بسيطاً أو واجهت عثرة في عملك أو دراستك، وانطلق صوت داخلي لاذع يكرر: «أنت دائماً تفشل، لا أمل منك، الجميع يلاحظ ضعفك».. كيف تؤثر هذه القسوة على عزيمتك؟',
    situationEn: 'You stumbled on a minor mistake at work or study. An internal prosecutor instantly erupted: “You always ruin everything; you’re an embarrassment.” How does this erode your spirit?',
    practicalActivityTitleAr: 'تمرين كارت المشجع الحكيم: (رسالة صديقك الأوفى 💌)',
    practicalActivityTitleEn: 'The Wise Mentor Card: (Letter from Your Truest Ally 💌)',
    practicalActivityDescAr: 'يكتب كل مشارك عبارة الناقد القاسية، ثم يغمض عينيه ويكتب الرد الذي كان سيقوله لصديق روحه لو أتاه باكياً بنفس الخطأ، مع تطبيق لمسة تهدئة حسية.',
    practicalActivityDescEn: 'Participants jot down their worst critic quote, close their eyes, and rewrite what they would say to a cherished friend weeping with that exact stumble.',
    debriefWisdomAr: 'القسوة على الذات لا تصنع نجاحاً ولا تبني وعياً، بل تصنع خوفاً وانكماشاً. أنت في أشد الحاجة لرحمة نفسك واحتوائها في اللحظة التي تخطئ فيها بالتحديد.',
    debriefWisdomEn: 'Self-flogging never builds genuine resilience; it only breeds hyper-vigilant dread. You need your own compassion most urgently precisely when you fall.',
    linkedGames: [
      {
        id: 'inner-mirror',
        titleAr: 'مرآة الحوار الداخلي والناقد الرحيم',
        titleEn: 'Inner Dialogue Mirror',
        roleAr: 'ترميم شروخ المرآة الزجاجية بركائز الشفقة الثلاث',
        roleEn: 'Mend broken mirror shards through CFT pillars',
        badgeAr: 'الشفقة بالذات',
        badgeEn: 'CFT Compassion'
      },
      {
        id: 'reframe-sentence',
        titleAr: 'بدّلي الجملة',
        titleEn: 'Reframe the Sentence',
        roleAr: 'تليين الخطاب اللفظي الداخلي من الشراسة إلى الرأفة',
        roleEn: 'Soften the internal verbal tone from harsh to kind',
        badgeAr: 'لغة رحيمة',
        badgeEn: 'Gentle Voice'
      },
      {
        id: 'first-sentence',
        titleAr: 'الجملة الأولى',
        titleEn: 'The First Sentence',
        roleAr: 'تفكيك أصوات التنشئة الأولى وإعادة صياغة العبارات الشافية',
        roleEn: 'Untangle ancestral family echoes into personal truth',
        badgeAr: 'أثر التنشئة',
        badgeEn: 'Roots'
      }
    ],
    questions: [
      {
        key: 'thought',
        num: '١',
        titleAr: 'ما هي الكلمة أو العبارة القاسية التي يجلدك بها صوتك الداخلي عند الخطأ؟',
        titleEn: 'What harsh words or labels does your inner critic whip you with when you err?',
        placeholderAr: 'مثال: "أنت متأخر عن الجميع.. لم تعد ذكياً كما كنت.."',
        placeholderEn: 'E.g., "You are lagging behind everyone.. you were never competent enough.."'
      },
      {
        key: 'emotion',
        num: '٢',
        titleAr: 'من أين ورثت هذه النبرة الصارمة؟ وهل كنت ترضى أن تخاطب بها طفلاً أو صديقاً تحبه؟',
        titleEn: 'Where did this stern tone originate? Would you ever speak this way to a child?',
        placeholderAr: 'مثال: ورثتها من توقعات مدرسية أو أسرية صارمة.. مستحيل أن أقولها لأحد.',
        placeholderEn: 'E.g., Internalized from rigid early expectations; I would never hurt a friend with it.'
      },
      {
        key: 'reaction',
        num: '٣',
        titleAr: 'ما هي ركيزة «الإنسانية المشتركة»: كيف يمر مليارات البشر بنفس هذا القصور والعثرة؟',
        titleEn: 'What is the “Common Humanity” truth: how are millions stumbling like this today?',
        placeholderAr: 'مثال: الخطأ جزء طبيعي من التعلم، ولست كائناً فضائياً معزولاً عن الضعف الإنساني.',
        placeholderEn: 'E.g., To err is human; making mistakes is proof that I am engaging with life, not a defect.'
      },
      {
        key: 'alternativeExplanation',
        num: '٤',
        titleAr: 'كيف يعيد "المشجع الحكيم" صياغة هذا الموقف بلغة التقبل والدعم العملي؟',
        titleEn: 'How does your “Wise Inner Mentor” reframe this stumbling block with support?',
        placeholderAr: 'مثال: "أنا فخور بسعيك، هذه عثرة تعلمنا درساً قيماً.. خذ نفساً وسنبدأ معاً من جديد."',
        placeholderEn: 'E.g., "I honor your bravery; this glitch is a great lesson. Breathe, and let’s adjust."'
      },
      {
        key: 'emotionalShift',
        num: '٥',
        titleAr: 'ما هو الشعور بالدفء والأمان الداخلي عندما تضع يدك على قلبك وتطمئن نفسك؟',
        titleEn: 'What sensation of warmth unlocks when placing a soothing hand on your chest?',
        placeholderAr: 'مثال: تلاشي عقدة الخوف، شعور بالسند الداخلي، انبعاث رغبة صادقة في المحاولة مجدداً.',
        placeholderEn: 'E.g., The terror melts, internal grounding surges, and fresh courage arrives.'
      }
    ]
  },

  // 4. ورشة مفرمة الأفكار وفك الاندماج المعرفي ACT
  {
    id: 'cognitive-defusion-act',
    number: 4,
    titleAr: 'ورشة: «مفرمة الأفكار وفك الاندماج: التحرر من سطوة العقل»',
    titleEn: 'Workshop: “Thought Shredder & Defusion: Untangling from Mind Traps”',
    subtitleAr: 'تقنيات علاج القبول والالتزام (ACT) لتدريب الوعي على أن الأفكار أحداث عابرة وليست حقائق',
    subtitleEn: 'Acceptance & Commitment Therapy (ACT) experiential defusion: thoughts as leaves on a stream',
    categoryKey: 'defusion',
    categoryLabelAr: 'التحرر المعرفي ACT',
    categoryLabelEn: 'ACT Defusion',
    targetAudienceAr: 'أصحاب الاجترار الفكري، القلقون من المستقبل، من يعانون الأفكار المزعجة الملحة',
    targetAudienceEn: 'Chronic ruminators, future-anxiety sufferers, individuals tangled in intrusive loops',
    suggestedDurationMinutes: 50,
    icon: Scissors,
    themeColor: {
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      text: 'text-teal-800 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-800',
      gradient: 'from-rose-500 to-teal-600',
      accent: 'teal'
    },
    goalAr: 'فك الالتصاق القهري بالأفكار السلبية، وإدراك الفرق الجوهري بين (أنا الفكرة) وبين (أنا الشاهد الواعي الذي يلاحظ مرور الفكرة كما تمر السحب في السماء).',
    goalEn: 'Break cognitive fusion with sticky negative loops, shifting identity from “I am this thought” to “I am the conscious observer watching weather pass through mind”.',
    situationAr: 'فكرة سوداوية ملحة تتردد في رأسك: «المستقبل ضائع، لا جدوى من المحاولة، أنت لست مؤهلاً».. تلتصق بك وتمنعك من النوم والتركيز والبهجة بالحاضر..',
    situationEn: 'A sticky intrusive thought loops incessantly: “The future is hopeless, why bother trying, you are unqualified.” It clings like glue, robbing sleep and presence.',
    practicalActivityTitleAr: 'تمرين التمزيق الحركي ونهر التنفس (Physical Shred & Float 🍃)',
    practicalActivityTitleEn: 'Physical Shredding & Leaf Floating Exercise (🍃)',
    practicalActivityDescAr: 'يكتب كل فرد الفكرة على قصاصة ورقية، يقرؤها بصوت مضحك أو بطيء لتجريدها من الهيبة، ثم يمزقها بيديه بقوة مفرغة أو يضعها على كف يده وينفخها مع زفير طويل.',
    practicalActivityDescEn: 'Participants write the thought on scrap paper, say it in a cartoon voice to strip its gravity, then physically shred it into bits or blow it off their palm with an exhale.',
    debriefWisdomAr: 'الأفكار مثل قطارات تمر في المحطة.. لست مجبراً على الركوب في كل قطار بائس يمر أمامك. يمكنك الجلوس على الرصيف ومراقبته وهو يمضي في حال سبيله.',
    debriefWisdomEn: 'Thoughts are like passing trains at a platform. You are never obligated to board every catastrophic carriage that stops. You can sit peacefully and watch it roll away.',
    linkedGames: [
      {
        id: 'thought-shredder',
        titleAr: 'مفرمة الأفكار ونهر التحرر',
        titleEn: 'Thought Shredder & River',
        roleAr: 'تمزيق حركي وفيزيائي للأفكار أو إطلاقها كأوراق على النهر',
        roleEn: 'Tactile shredding & serene river floating defusion',
        badgeAr: 'فك الاندماج ACT',
        badgeEn: 'ACT Defusion'
      },
      {
        id: 'decisional-balance',
        titleAr: 'ميزان الأفكار والقرارات',
        titleEn: 'Decisional Scales',
        roleAr: 'وزن التكلفة الخفية للأمان الوهمي مقابل ثمار الشجاعة',
        roleEn: 'Weigh comfort avoidance vs courageous growth',
        badgeAr: 'الميزان المعرفي',
        badgeEn: 'Decisional CBT'
      },
      {
        id: 'game-infinity-flow',
        titleAr: 'مسار اللانهاية البصري (∞)',
        titleEn: 'Infinity Flow Tracker',
        roleAr: 'تنظيم حركة العين وتشتيت التركيز على الفكرة السامة',
        roleEn: 'Ocular-motor tracking soothing over-active amygdala',
        badgeAr: 'بصري حركي',
        badgeEn: 'Ocular Flow'
      }
    ],
    questions: [
      {
        key: 'thought',
        num: '١',
        titleAr: 'ما هي الفكرة اللزجة الأكثر تكراراً وإزعاجاً لعقلك في هذه الأيام؟',
        titleEn: 'What is the stickiest thought recurring in your headspace these days?',
        placeholderAr: 'مثال: "كل شيء سينهار قريباً.. أنا عاجز عن السيطرة.."',
        placeholderEn: 'E.g., "Everything will collapse soon.. I cannot hold things together.."'
      },
      {
        key: 'emotion',
        num: '٢',
        titleAr: 'تطبيق تقنية التسمية: كيف تختلف جملة «أنا فاشل» عن «أنا ألاحظ أن لدي فكرة أنني فاشل»؟',
        titleEn: 'Defusion labeling: How does “I am a failure” differ from “I notice I have a thought that…”?',
        placeholderAr: 'مثال: الأولى تجعلني سجيناً للفكرة، بينما الثانية تضع مسافة واعية بيني وبينها.',
        placeholderEn: 'E.g., The first defines my essence; the second reminds me it is merely mental chatter.'
      },
      {
        key: 'reaction',
        num: '٣',
        titleAr: 'ما هي تكلفة البقاء مندمجاً مع هذه الفكرة (ما الذي تحرمك منه في واقعك)؟',
        titleEn: 'What is the real-world cost of fusing with this thought (what does it rob)?',
        placeholderAr: 'مثال: تحرمني من الاستمتاع بأولادي، تؤجل إطلاق مشروعي، تسرق طاقتي ونومي...',
        placeholderEn: 'E.g., Steals quality time with family, paralyzes creative projects, poisons sleep...'
      },
      {
        key: 'alternativeExplanation',
        num: '٤',
        titleAr: 'إذا تركت هذه الفكرة تطفو كورقة شجر على النهر دون ملاحقتها، فما القيمة الحقيقية التي ستتجه إليها؟',
        titleEn: 'If you let this thought float away downriver, what core value will you step towards?',
        placeholderAr: 'مثال: قيمة الشجاعة، قيمة الصدق مع النفس، قيمة العطاء والتعلم المستمر...',
        placeholderEn: 'E.g., Value of courage, authenticity, presence with loved ones, meaningful craft...'
      },
      {
        key: 'emotionalShift',
        num: '٥',
        titleAr: 'كيف تصف شعور الخفة والتنفس الحر عندما تدرك أنك لست أفكارك؟',
        titleEn: 'Describe the sensation of free breathing when knowing you are not your thoughts.',
        placeholderAr: 'مثال: اتساع في الصدر، انخفاض الضجيج الذهني، عودة الشعور بالحاضر الحي.',
        placeholderEn: 'E.g., Spacious chest, mental noise dials down, vibrant anchor to the present moment.'
      }
    ]
  },

  // 5. ورشة بوصلة الاحتياجات والتواصل غير العنيف NVC
  {
    id: 'core-needs-nvc',
    number: 5,
    titleAr: 'ورشة: «بوصلة الاحتياجات والتواصل غير العنيف: فك شفرة الغضب»',
    titleEn: 'Workshop: “Core Needs Compass & NVC: Translating Reactivity to Empathy”',
    subtitleAr: 'تحويل الانفعال الناري واللوم إلى تحديد الاحتياج النفسي الأصيل وصياغة طلب ناضج',
    subtitleEn: 'Decoding blazing anger and blame into unmet human needs and assertive NVC requests',
    categoryKey: 'communication',
    categoryLabelAr: 'التواصل غير العنيف NVC',
    categoryLabelEn: 'NVC Communication',
    targetAudienceAr: 'الأزواج، فرق العمل، شركاء المشاريع، العائلات والمربين',
    targetAudienceEn: 'Couples, co-workers, business partners, family circles, educators',
    suggestedDurationMinutes: 60,
    icon: Compass,
    themeColor: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      gradient: 'from-emerald-500 to-indigo-600',
      accent: 'amber'
    },
    goalAr: 'تدريب المشاركين على إدراك أن وراء كل سلوك غاضب أو جارح "احتياجاً إنسانياً مشروعاً غير ملبى"، وتمكينهم من صياغة جملة القوة الرباعية في التواصل دون هجوم أو دفاع.',
    goalEn: 'Train participants to recognize that beneath every harsh outburst lies an unmet legitimate human need, mastering the 4-part NVC statement without attack or defense.',
    situationAr: 'زميلك في العمل أو شريكك غيّر اتفاقاً مهماً دون إخبارك، أو لم يقدّر مجهودك الشاق في إنجاز مهمة مشتركة.. اشتعل الغضب واندفعت لرغبة عارمة في الهجوم والتقريع..',
    situationEn: 'A colleague or partner altered an agreement without looping you in, or overlooked your painstaking efforts. Red fury flared with an impulse to attack and blame.',
    practicalActivityTitleAr: 'تمرين رباعية التواصل النقي: (ملاحظة + شعور + احتياج + طلب)',
    practicalActivityTitleEn: 'The 4-Part NVC Formula: (Observation + Feeling + Need + Request)',
    practicalActivityDescAr: 'تأخذ كل مجموعة عبارة اتهام مألوفة («أنت دائماً أناني ومهمل») وتحولها عبر الخطوات الأربع إلى طلب محدد وقابل للتنفيذ يحفظ الكرامة ويبني التعاون.',
    practicalActivityDescEn: 'Groups take toxic blame phrases (“You never care, you’re so selfish”) and translate them into clean NVC formula: When I see X, I feel Y, because I need Z, would you be willing to W?',
    debriefWisdomAr: 'الغضب هو الحارس الشخصي لاحتياج عميق تعرض للإهمال أو الخوف. عندما تتحدث إلى الاحتياج مباشرة، يتنحى الحارس جانباً بسلام وتُفتح أبواب التفاهم الحقيقي.',
    debriefWisdomEn: 'Anger is merely the bodyguard of an unhonored vulnerable need. When you speak directly to the core need, the guard stands down in peace.',
    linkedGames: [
      {
        id: 'core-needs-compass',
        titleAr: 'بوصلة الاحتياجات النفسية',
        titleEn: 'Core Needs Compass',
        roleAr: 'دوران الإبرة المغناطيسية لتحديد الاحتياج الباطني وصياغة جملة القوة',
        roleEn: 'Magnetic compass decoding surface storms to core needs',
        badgeAr: 'بوصلة الاحتياج',
        badgeEn: 'NVC Compass'
      },
      {
        id: 'challenge-feeling',
        titleAr: 'كاشف المشاعر الدفينة',
        titleEn: 'Emotion Detective',
        roleAr: 'اكتشاف المشاعر الهشة تحت درع الغضب والاستياء',
        roleEn: 'Detect tender emotions beneath anger armor',
        badgeAr: 'ذكاء عاطفي',
        badgeEn: 'Granularity'
      },
      {
        id: 'distance-safe',
        titleAr: 'مسافة (الوحدة والقرب)',
        titleEn: 'Safe Distance',
        roleAr: 'ضبط المسافة الذهبية المريحة في العلاقات لتجنب الاحتراق',
        roleEn: 'Balance comfortable relational proximity and space',
        badgeAr: 'المسافة الآمنة',
        badgeEn: 'Relational Balance'
      }
    ],
    questions: [
      {
        key: 'thought',
        num: '١',
        titleAr: 'ما هي عبارة اللوم أو الاتهام التلقائية التي تصدر منك عند اشتعال الموقف؟',
        titleEn: 'What automatic accusatory sentence bursts out when you feel triggered?',
        placeholderAr: 'مثال: "أنت لا تهتم بي أبداً.. أنت لا تحترم مجهودي..."',
        placeholderEn: 'E.g., "You never respect my time.. you only care about yourself..."'
      },
      {
        key: 'emotion',
        num: '٢',
        titleAr: 'ما هو الشعور الحقيقي الهش والمؤلم المستتر تحت درع الغضب والانفعال؟',
        titleEn: 'What vulnerable, tender feeling hides beneath the armor of anger?',
        placeholderAr: 'مثال: شعور بالوحدة، خوف من الاستغلال، خيبة أمل عميقة، ألم عدم التقدير...',
        placeholderEn: 'E.g., Pain of invisibility, fear of betrayal, exhaustion, deep disappointment...'
      },
      {
        key: 'reaction',
        num: '٣',
        titleAr: 'إلى أي احتياج إنساني أصيل تشير البوصلة (أمان، وضوح، تقدير، شراكة، راحة)؟',
        titleEn: 'Which core human need is the compass pointing to (safety, clarity, respect)?',
        placeholderAr: 'مثال: احتياجي للوضوح والشفافية المسبقة، احتياجي للشعور بأن جهدي مقدّر...',
        placeholderEn: 'E.g., Need for predictability & transparent consultation, need for mutual honor...'
      },
      {
        key: 'alternativeExplanation',
        num: '٤',
        titleAr: 'صياغة «جملة القوة والتواصل غير العنيف»: كيف تطلب ما تحتاجه بوضوح ولطف؟',
        titleEn: 'Craft the 4-part NVC statement: How do you request what you need clearly?',
        placeholderAr: 'مثال: "حين تتغير الخطة دون علمي، أشعر بالقلق لحاجتي للوضوح، فهل نتفق على رسالة تنبيه مسبقة؟"',
        placeholderEn: 'E.g., "When plans shift without my knowing, I feel anxious because I need clarity; can we agree to ping beforehand?"'
      },
      {
        key: 'emotionalShift',
        num: '٥',
        titleAr: 'كيف يتحول الحوار من ساحة حرب ومبارزة إلى شراكة وبناء عندما تسمى الاحتياجات؟',
        titleEn: 'How does collision turn into genuine partnership when core needs are voiced?',
        placeholderAr: 'مثال: يزول الدفاع والإنكار، يشعر الطرف الآخر بالأمان، ونصل لحل يرضي الطرفين.',
        placeholderEn: 'E.g., Defensive walls crumble, the other feels safe to listen, creative solutions open.'
      }
    ]
  },

  // 6. ورشة ثواني قبل الانفجار والتنظيم الحركي الجسدي
  {
    id: 'pause-and-somatic-regulation',
    number: 6,
    titleAr: 'ورشة: «ثواني قبل الانفجار: تنظيم الجهاز العصبي والوقفة الحكيمة»',
    titleEn: 'Workshop: “Seconds Before Reaction: Somatic Regulation & The Wise Pause”',
    subtitleAr: 'نموذج تثقيفي استكشافي لرصد استثارة الجهاز العصبي وتجربة ممارسات جسدية واعية للتهدئة',
    subtitleEn: 'An exploratory psycho-educational model to observe nervous system arousal and cultivate grounding',
    categoryKey: 'somatic',
    categoryLabelAr: 'تثقيف حركي وجسدي',
    categoryLabelEn: 'Somatic & Regulatory',
    targetAudienceAr: 'أصحاب ردود الفعل السريعة، أولياء الأمور، فرق العمل تحت الضغط، وعامة الراغبين في ضبط النفس',
    targetAudienceEn: 'Quick-tempered individuals, parents, high-stress teams, anyone seeking grounded self-regulation',
    suggestedDurationMinutes: 45,
    icon: Flame,
    themeColor: {
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
      gradient: 'from-orange-500 to-rose-700',
      accent: 'orange'
    },
    goalAr: 'تدريب تثقيفي استكشافي للمشاركين على ملاحظة إشارات الاستثارة الجسدية المبكرة (تسارع النبض، انقباض الفك)، وتجربة أدوات حركية وتنفسية واعية للمساعدة على أخذ مهلة هادئة قبل الرد (دون اعتبار أي تمرين بديلاً عن الإرشاد الطبي المتخصص).',
    goalEn: 'An experiential educational drill to observe early somatic arousal cues (accelerated pulse, tight jaw) and practice voluntary breathing pauses before reacting.',
    situationAr: 'في لحظة ازدحام أو إرهاق شديد، وجّه أحدهم إليك كلمة مستفزة أو سلوكاً وقحاً.. شعرت بدمك يغلي في عروقك، وجاءتك الرغبة العارمة في الصراخ أو تحطيم شيء..',
    situationEn: 'Exhausted in traffic or meeting, someone threw an insolent remark. Boiling heat flushed your veins with an overwhelming urge to lash out or smash a cup.',
    practicalActivityTitleAr: 'تمرين النفض الحركي اللطيف وزفير التهدئة (مشاركة اختيارية 🫨)',
    practicalActivityTitleEn: 'Gentle Somatic Shake & Calming Exhale (Voluntary Drill 🫨)',
    practicalActivityDescAr: 'المشاركة اختيارية تماماً: يمكن للمشاركين تجربة نفض لطيف لليدين والأكتاف كأداة حركية واعية للمساعدة على تفريغ شحنة التوتر، يتبعها زفير بطيء ممتد. يحق لأي مشارك الاكتفاء بالملاحظة أو الجلوس بهدوء دون أي حرج.',
    practicalActivityDescEn: 'Strictly voluntary: Participants may gently shake out wrists and shoulders as an exploratory physical cue to ease tension, followed by a steady elongated exhale. Any participant may opt out or observe in comfort.',
    debriefWisdomAr: 'بين المثير المزعج ورد فعلك توجد مسافة زمنية مقدسة لا تتجاوز ثوانٍ معدودة.. في تلك المساحة وحدها تكمن حريتك الكاملة، وبها تقرر: هل تكون أسيراً لانفعالك أم سيداً لمصيرك؟',
    debriefWisdomEn: 'Between stimulus and response there is a space. In that sacred space lies our freedom and our power to choose our growth and our peace.',
    linkedGames: [
      {
        id: 'challenge-react',
        titleAr: 'ثواني قبل الانفجار',
        titleEn: 'Before You React',
        roleAr: 'وقفة الأنفاس ومحاكي عواقب رد الفعل الاندفاعي',
        roleEn: 'Slow-motion pause and consequence simulation',
        badgeAr: 'محاكي العواقب',
        badgeEn: 'The Pause'
      },
      {
        id: 'game-somatic-shake',
        titleAr: 'نفض وتفريغ التوتر',
        titleEn: 'Somatic Shake',
        roleAr: 'تفريغ هرمونات الكورتيزول والأدرينالين بحركة الجسد',
        roleEn: 'Discharge survival adrenaline from muscular zones',
        badgeAr: 'تفريغ حركي',
        badgeEn: 'Somatic Shake'
      },
      {
        id: 'game-butterfly-tap',
        titleAr: 'نقر الفراشة الثنائي',
        titleEn: 'Butterfly Tap',
        roleAr: 'تحفيز الفصين وتسكين اللوزة الدماغية بحركة اليدين',
        roleEn: 'Bilateral stimulation calming hyper-arousal',
        badgeAr: 'تهدئة EMDR',
        badgeEn: 'Butterfly EMDR'
      }
    ],
    questions: [
      {
        key: 'thought',
        num: '١',
        titleAr: 'ما هي الإشارة الجسدية الأولى التي يرسلها جسمك محذراً قبل أن تنفجر؟',
        titleEn: 'What is the very first bodily flare warning you before you explode?',
        placeholderAr: 'مثال: شد في الفك، انقباض في الصدر، تسارع النبض، سخونة في الرقبة...',
        placeholderEn: 'E.g., Clenched molars, sudden chest constriction, heat rising to neck, tunnel vision...'
      },
      {
        key: 'emotion',
        num: '٢',
        titleAr: 'لو نفذت رد الفعل الاندفاعي في أول ٥ ثوانٍ، ما هي الفاتورة الباهظة التي ستدفعها؟',
        titleEn: 'If you unleashed the impulse in the first 5 seconds, what costly price would you pay?',
        placeholderAr: 'مثال: خسارة علاقة مهمة، ندم مرير، تدمير سمعة مهنية، هبوط احترامي لنفسي...',
        placeholderEn: 'E.g., Severed bond, agonizing remorse, professional damage, feeling small later...'
      },
      {
        key: 'reaction',
        num: '٣',
        titleAr: 'ما هي حركة التدخل السريع التي تختارها لإخماد الاستثارة فوراً؟',
        titleEn: 'What physical micro-action do you select to extinguish the fire instantly?',
        placeholderAr: 'مثال: شرب رشفة ماء بارد، نقر الفراشة الثنائي، الخروج من الغرفة لدقيقة، نفض اليدين...',
        placeholderEn: 'E.g., Sip ice water, step outside for 60 sec, bilateral butterfly tap, long deep sigh...'
      },
      {
        key: 'alternativeExplanation',
        num: '٤',
        titleAr: 'ما هي الكلمة الحكيمة التي تهمس بها لنفسك أثناء وقفة الأنفاس الخمسة؟',
        titleEn: 'What soothing anchor word do you whisper to your heart during the 5 breaths?',
        placeholderAr: 'مثال: "اهدأ.. الموقف لا يستحق حرق أعصابك.. أنت أقوى من هذا الاستفزاز."',
        placeholderEn: 'E.g., "Steady.. this storm is temporary.. my peace is worth far more than their bait."'
      },
      {
        key: 'emotionalShift',
        num: '٥',
        titleAr: 'كيف تشعر بالفخر والسيادة على الذات حين تمر العاصفة وأنت ثابت ومحترم؟',
        titleEn: 'How does triumphant self-mastery feel when the tempest passes and you stood grounded?',
        placeholderAr: 'مثال: اعتزاز عميق، شعور بالنضج الحقيقي، نوم هانئ دون تأنيب ضمير.',
        placeholderEn: 'E.g., Deep dignity, profound mature strength, peaceful sleep unmarred by regret.'
      }
    ]
  }
];
