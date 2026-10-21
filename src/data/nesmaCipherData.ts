import { 
  CipherWorld, 
  CipherQuote, 
  CipherLevel, 
  GardenCollectible 
} from '../types/nesmaCipher';

// Image assets generated for Nesma Cipher
export const CIPHER_IMAGES = {
  heroMap: '/src/assets/images/nesma_cipher_hero_map_1792598958892.jpg',
  gardenDawn: '/src/assets/images/puzzle_garden_dawn_1792598959302.jpg',
  librarySecrets: '/src/assets/images/puzzle_library_secrets_1792598959558.jpg',
  caveReflection: '/src/assets/images/puzzle_cave_reflection_1792598961556.jpg',
};

// 1. العوالم الثلاثة
export const CIPHER_WORLDS: CipherWorld[] = [
  {
    id: 'garden',
    nameAr: 'حديقة البدايات',
    nameEn: 'Garden of Beginnings',
    descAr: 'مراحل تعليمية دافئة ولطيفة، تساعدك على ممارسة الرفق بالنفس، التحكم بالقطع، وتفكيك التوتر خطوة بخطوة.',
    themeColor: 'emerald',
    accentColor: '#059669',
    bgGradient: 'from-emerald-950/80 via-stone-900 to-stone-950',
    icon: '🌱',
    levelsRange: [1, 10],
    heroImage: CIPHER_IMAGES.gardenDawn
  },
  {
    id: 'library',
    nameAr: 'مكتبة الأسرار',
    nameEn: 'Library of Secrets',
    descAr: 'مراحل متوسطة في أروقة الفكر؛ نبحث فيها عن أدلة الحدود الصحية، ترتيب الأنماط، وتسمية المشاعر بمسمياتها الحقيقية.',
    themeColor: 'amber',
    accentColor: '#d97706',
    bgGradient: 'from-amber-950/80 via-stone-900 to-stone-950',
    icon: '📜',
    levelsRange: [11, 20],
    heroImage: CIPHER_IMAGES.librarySecrets
  },
  {
    id: 'cave',
    nameAr: 'كهف التفكير',
    nameEn: 'Cave of Thinking',
    descAr: 'مراحل عميقة وأكثر تحدياً؛ تجمع بين متاهات الوعي، فك الشفرات، واستكشاف الذات المراقبة التي تفصل بين الأفكار والحقيقة.',
    themeColor: 'teal',
    accentColor: '#0d9488',
    bgGradient: 'from-teal-950/80 via-stone-900 to-stone-950',
    icon: '💎',
    levelsRange: [21, 30],
    heroImage: CIPHER_IMAGES.caveReflection
  }
];

// 2. المقولات النفسية الخمس (كل مقولة موزعة على سلسلة مراحل حقيقية)
export const CIPHER_QUOTES: CipherQuote[] = [
  {
    id: 'quote-1',
    fullText: 'مش لازم أحل كل حاجة النهارده؛ خطوة صغيرة كفاية.',
    topic: 'الرفق بالنفس والخطوات الصغيرة',
    categoryAr: 'تخفيف الضغط والتنظيم الذاتي',
    worldId: 'garden',
    levelIds: [1, 2, 3, 4, 5, 6],
    tokens: [
      { levelId: 1, token: 'مش لازم', order: 1 },
      { levelId: 2, token: 'أحل', order: 2 },
      { levelId: 3, token: 'كل حاجة', order: 3 },
      { levelId: 4, token: 'النهارده؛', order: 4 },
      { levelId: 5, token: 'خطوة صغيرة', order: 5 },
      { levelId: 6, token: 'كفاية.', order: 6 },
    ],
    psychologicalMeaning: 'التفكير الكارثي أو الرغبة في الكمال (Perfectionism) يوهم الدماغ بضرورة إنهاء كل عبء في لحظة واحدة، مما يصيب الجهاز العصبي بالتجمد (Freeze Mode). تقسيم الحمل إلى خطوة واحدة ميكروية يحفظ طاقتك ويعيد تدفق السكينة.',
    practicalApplication: 'اختر مهمة واحدة تشعرك بالثقل اليوم، ولا تكملها كلها؛ افعل منها خطوة لا تتجاوز دقيقتين فقط ثم تنفس واحتفِ بما أنجزت.',
    foundation: 'مستندة إلى مبادئ العلاج المعرفي السلوكي (CBT) وعلاج تقبل الالتزام (ACT) وتفكيك التفكير الكلّي أو اللاشيء.'
  },
  {
    id: 'quote-2',
    fullText: 'مشاعري إشارات تدلني، وليست أوامر تلزمني.',
    topic: 'المرونة والذكاء العاطفي',
    categoryAr: 'فهم المشاعر وإدارتها',
    worldId: 'garden',
    levelIds: [7, 8, 9, 10, 11, 12],
    tokens: [
      { levelId: 7, token: 'مشاعري', order: 1 },
      { levelId: 8, token: 'إشارات', order: 2 },
      { levelId: 9, token: 'تدلني،', order: 3 },
      { levelId: 10, token: 'وليست', order: 4 },
      { levelId: 11, token: 'أوامر', order: 5 },
      { levelId: 12, token: 'تلزمني.', order: 6 },
    ],
    psychologicalMeaning: 'المشاعر ليست حقائق مطلقة ولا قرارات إلزامية، بل هي كأضواء لوحة تحكم السيارة؛ تخبرك بوجود حاجة أو خطر محتمل، لكن القيادة تظل في يد وعيك وقيمك العليا.',
    practicalApplication: 'عندما تشعر بالاندفاع أو الغضب، خذ شهيقاً عميقاً وقل لنفسك: «أنا ألاحظ شعور الغضب، وسأقرر رد فعلي بعد دقيقة واحدة».',
    foundation: 'قائمة على نظرية التنظيم الانفعالي وعلم الأعصاب الإدراكي (Emotional Regulation & Metacognition).'
  },
  {
    id: 'quote-3',
    fullText: 'الحدود ليست جداراً لقسوة، بل سياج يحمي مساحتي لكي أحب بصدق.',
    topic: 'الحدود الشخصية والعلاقات الآمنة',
    categoryAr: 'العلاقات والاتزان النفسي',
    worldId: 'library',
    levelIds: [13, 14, 15, 16, 17, 18],
    tokens: [
      { levelId: 13, token: 'الحدود ليست', order: 1 },
      { levelId: 14, token: 'جداراً لقسوة،', order: 2 },
      { levelId: 15, token: 'بل سياج', order: 3 },
      { levelId: 16, token: 'يحمي مساحتي', order: 4 },
      { levelId: 17, token: 'لكي أحب', order: 5 },
      { levelId: 18, token: 'بصدق.', order: 6 },
    ],
    psychologicalMeaning: 'وضع الحدود ليس أنانية أو صدّاً للآخرين، بل هو الشفط الذي يمنع الاستنزاف والعداوة الدفينة؛ فالشخص الذي لا يستطيع قول «لا» صادقة، لا يستطيع تقديم «نعم» مخلصة.',
    practicalApplication: 'تدرّب هذا الأسبوع على التمهل قبل الموافقة التلقائية على أي طلب يرهقك، واستخدم عبارة: «دعني أراجع وقتي وأرد عليك غداً».',
    foundation: 'أدبيات الذكاء العلائقي والعلاج السلوكي الجدلي (DBT - Interpersonal Effectiveness).'
  },
  {
    id: 'quote-4',
    fullText: 'الغلط مش نهاية الطريق؛ الغلط مسوّدة بتعلّمني أكتب صح.',
    topic: 'عقلية النمو وتقبّل التعثر',
    categoryAr: 'التسامح مع الذات والتعلم',
    worldId: 'library',
    levelIds: [19, 20, 21, 22, 23, 24],
    tokens: [
      { levelId: 19, token: 'الغلط', order: 1 },
      { levelId: 20, token: 'مش نهاية', order: 2 },
      { levelId: 21, token: 'الطريق؛', order: 3 },
      { levelId: 22, token: 'الغلط مسوّدة', order: 4 },
      { levelId: 23, token: 'بتعلّمني', order: 5 },
      { levelId: 24, token: 'أكتب صح.', order: 6 },
    ],
    psychologicalMeaning: 'دماغ الإنسان يتعلم من التناقض والخطأ أكثر بكثير مما يتعلم من النجاح المريح؛ إعادة تسمية الخطأ كـ «مسودة أولى» تحرر الإبداع وتزيل رعب النقد الذاتي القاسي.',
    practicalApplication: 'عند حدوث أي زلة أو إخفاق غير مقصود، اسأل نفسك فوراً: «ما هي الحكمة الثمينة التي كشفتها لي هذه التجربة مجاناً؟».',
    foundation: 'مفهوم عقلية النمو (Growth Mindset) والتعاطف الذاتي (Self-Compassion by Kristin Neff).'
  },
  {
    id: 'quote-5',
    fullText: 'أنا لست أفكاري؛ أنا المراقب الهادئ الذي يختار ما يُصدّق.',
    topic: 'فك الارتباط المعرفي والوعي بالذات',
    categoryAr: 'اليقظة الذهنية والتحرر الداخلي',
    worldId: 'cave',
    levelIds: [25, 26, 27, 28, 29, 30],
    tokens: [
      { levelId: 25, token: 'أنا لست', order: 1 },
      { levelId: 26, token: 'أفكاري؛', order: 2 },
      { levelId: 27, token: 'أنا المراقب', order: 3 },
      { levelId: 28, token: 'الهادئ الذي', order: 4 },
      { levelId: 29, token: 'يختار ما', order: 5 },
      { levelId: 30, token: 'يُصدّق.', order: 6 },
    ],
    psychologicalMeaning: 'الأفكار تمر في الرأس مثل غيوم في سماء زرقاء أو سيارات في طريق سريع. لست مضطراً للركوب في كل فكرة قلقة، فأنت السماء الصامتة التي تشهد العابرين دون أن تفقد صفاءها.',
    practicalApplication: 'عندما تهاجمك فكرة سلبية متسلطة، قل بصوت داخلي هادئ: «أنا أرى فكرة تقول كذا... وأسمح لها بالمرور مثل ورقة شجر على سطح ماء جارٍ».',
    foundation: 'فك الارتباط المعرفي (Cognitive Defusion) في علاج القبول والالتزام والتأمل القائم على اليقظة.'
  }
];

// 3. مستويات اللعبة الـ 30 كاملة ببيانات حقيقية وشروط فوز دقيقة
export const CIPHER_LEVELS: CipherLevel[] = [
  // ==========================================
  // العالم الأول: حديقة البدايات (المستويات 1 - 10)
  // ==========================================
  {
    id: 1,
    worldId: 'garden',
    titleAr: 'بوابة الهدوء',
    subtitleAr: 'رتّب قطع لوحة الفجر بالحديقة لاكتشاف البداية',
    quoteId: 'quote-1',
    rewardToken: {
      type: 'word',
      value: 'مش لازم',
      display: 'مش لازم',
      explanationAr: 'كلمة السر الأولى للتحرر من عبء إرضاء كل المطالب في آن واحد.'
    },
    puzzleType: 'tile_puzzle',
    difficulty: 'easy',
    xpReward: 100,
    hints: [
      'ركّز أولاً على مطابقة زوايا اللوحة ومسار الأحجار الحجرية.',
      'السماء المشرقة ونور الفجر يقعان في الصف العلوي.',
      'انقر على أي قطعتين لتبديل مكانهما حتى تكتمل لوحة البداية.'
    ],
    insightNote: 'الهدوء يبدأ عندما نتوقف عن الركض وراء كل التفاصيل دفعة واحدة.',
    puzzleData: {
      instructionsAr: 'انقر على قطعتين لتبديل مكانهما حتى تكتمل صورة الحديقة الصباحية في 9 مربعات.',
      previewTitle: 'لوحة فجر السكينة بالحديقة',
      gridSize: 3,
      imageSrc: CIPHER_IMAGES.gardenDawn,
      targetOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    }
  },
  {
    id: 2,
    worldId: 'garden',
    titleAr: 'صندوق الأمان',
    subtitleAr: 'رتّب الحروف المبعثرة لتكوين كلمة فك العقدة',
    quoteId: 'quote-1',
    rewardToken: {
      type: 'word',
      value: 'أحل',
      display: 'أحل',
      explanationAr: 'الفعل الذي نثقل به كاهلنا حين نظن أن واجبنا حل كل معضلة كونية.'
    },
    puzzleType: 'letter_scramble',
    difficulty: 'easy',
    xpReward: 120,
    hints: [
      'الكلمة تتكون من 4 حروف تبدأ بالهمزة وتدل على الاستقرار النفسي.',
      'الحرف الثاني هو الميم والحرف الأخير هو النون.',
      'الكلمة هي "أمان"؛ اضغط على الحروف بترتيبها الصحيح.'
    ],
    insightNote: 'الشعور بالأمان هو التربة التي تنمو فيها كل الأفكار الطيبة والقرارات المتزنة.',
    puzzleData: {
      instructionsAr: 'اضغط على الحروف بالترتيب الصحيح لتكوين الكلمة التي تمثل جوهر السكينة النفسية.',
      targetWord: 'أمان',
      scrambledLetters: ['ن', 'أ', 'ا', 'م'],
      meaningAr: 'الطمأنينة وزوال الخوف والتهديد الداخلي.',
      clueAr: 'شعور ينبع من قبول اللحظة والشعور بالحماية.'
    }
  },
  {
    id: 3,
    worldId: 'garden',
    titleAr: 'تأليف النوايا',
    subtitleAr: 'رتّب كلمات التعاطف الذاتي لتنظيم النفس',
    quoteId: 'quote-1',
    rewardToken: {
      type: 'word',
      value: 'كل حاجة',
      display: 'كل حاجة',
      explanationAr: 'الوهم الذي يرهق الذهن: أن كل شيء يتطلب تدخلك الفوري.'
    },
    puzzleType: 'word_sequence',
    difficulty: 'easy',
    xpReward: 140,
    hints: [
      'ابدأ بالفعل الدال على الحضور باللحظة.',
      'الترتيب المنطقي: الفعل الحاضر، ثم كيفية التنفس، ثم توقيت الحضور.',
      'الترتيب الصحيح هو: "أتنفس" ثم "بهدوء" ثم "الآن".'
    ],
    insightNote: 'التنفس الواعي هو الجسر الفوري الذي يعيد التوازن لجهازك العصبي في ثوانٍ.',
    puzzleData: {
      instructionsAr: 'رتّب البطاقات بالترتيب المنطقي الذي يساعدك على استعادة التركيز والهدوء.',
      correctSentence: ['أتنفس', 'بهدوء', 'الآن'],
      scrambledWords: ['الآن', 'أتنفس', 'بهدوء'],
      contextAr: 'تأريض الجهاز العصبي واستدعاء الحضور الكامل.'
    }
  },
  {
    id: 4,
    worldId: 'garden',
    titleAr: 'أدلة السكينة',
    subtitleAr: 'ابحث عن عناصر الأمل والتنفس المخفية في مشهد الحديقة',
    quoteId: 'quote-1',
    rewardToken: {
      type: 'word',
      value: 'النهارده؛',
      display: 'النهارده؛',
      explanationAr: 'تذكير بأن اليوم له طاقة محدودة، والغد يتكفل بمهامه.'
    },
    puzzleType: 'clue_search',
    difficulty: 'easy',
    xpReward: 150,
    hints: [
      'ابحث عن نبتة الياسمين البيضاء بالقرب من الممر الحجري على اليسار.',
      'ابحث عن الفانوس الدافئ المعلق بالقرب من البوابة الحجرية.',
      'ابحث عن حجر التوازن الأملس بجوار بركة الماء الهادئة.'
    ],
    insightNote: 'ملاحظة التفاصيل الصغيرة من حولنا تنتشل الذهن من دوامة الاجترار الذهني (Grounding).',
    puzzleData: {
      instructionsAr: 'اضغط على العناصر الثلاثة المخفية في الحديقة: (زهرة الياسمين، فانوس النور، حجر التأريض).',
      sceneBackground: CIPHER_IMAGES.gardenDawn,
      hiddenItems: [
        {
          id: 'jasmine',
          nameAr: 'زهرة الياسمين الندية',
          descriptionAr: 'رمز للسلام والبدايات الخالية من القلق.',
          x: 25,
          y: 72,
          icon: '🌸'
        },
        {
          id: 'lantern',
          nameAr: 'فانوس النور الدافئ',
          descriptionAr: 'رمز للبصيرة التي تضيء مسار خطوة واحدة قادمة.',
          x: 52,
          y: 50,
          icon: '🏮'
        },
        {
          id: 'calm_stone',
          nameAr: 'حجر التأريض والاتزان',
          descriptionAr: 'رمز للثبات عند تقلبات المشاعر الخارجية.',
          x: 78,
          y: 62,
          icon: '🪨'
        }
      ]
    }
  },
  {
    id: 5,
    worldId: 'garden',
    titleAr: 'شفرة البصيرة',
    subtitleAr: 'فك رموز الشفرة للوصول إلى مفتاح الحركة البسيطة',
    quoteId: 'quote-1',
    rewardToken: {
      type: 'word',
      value: 'خطوة صغيرة',
      display: 'خطوة صغيرة',
      explanationAr: 'المفتاح السري للإنجاز المستدام: قوة التراكم الهادئ.'
    },
    puzzleType: 'symbol_cipher',
    difficulty: 'easy',
    xpReward: 160,
    hints: [
      'انظر إلى جدول الرموز: الرمز 🌟 يطابق الحرف ن، والرمز 🌿 يطابق الحرف و.',
      'الرمز 💎 يطابق الحرف ر، ليكون مجموع الكلمة كلمة مرتبطة بالإشراق.',
      'الكلمة المشفرة هي "نور"؛ اختر الحروف بالترتيب.'
    ],
    insightNote: 'حتى أصغر شعاع نور كافٍ لتبديد عتمة الحيرة؛ ابدأ بما تملك الآن.',
    puzzleData: {
      instructionsAr: 'استخدم جدول استبدال الرموز لفك الكلمة المشفرة المكونة من 3 رموز.',
      cipherTable: {
        '🌟': 'ن',
        '🌿': 'و',
        '💎': 'ر',
        '🍃': 'س',
        '🌊': 'م'
      },
      encryptedMessage: ['🌟', '🌿', '💎'],
      targetWord: 'نور',
      hintsLetters: {
        '🌟': 'ن'
      }
    }
  },
  {
    id: 6,
    worldId: 'garden',
    titleAr: 'تتويج المقولة الأولى',
    subtitleAr: 'اكتشف النمط وأكمل الشطر السادس لاكتشاف المقولة كاملة',
    quoteId: 'quote-1',
    rewardToken: {
      type: 'word',
      value: 'كفاية.',
      display: 'كفاية.',
      explanationAr: 'كلمة الختام والراحة التي تضع حداً لسباق الكمال المرهق.'
    },
    puzzleType: 'pattern_matrix',
    difficulty: 'easy',
    xpReward: 200,
    hints: [
      'النمط يتدرج من توتر شديد -> تنفس عميق -> سكينة متوازنة.',
      'ما هو العنصر الذي يمثل الاستقرار والرضا عن الخطوة المنجزة؟',
      'اختر "الرضا والسكينة 🌿" لإتمام النمط وفتح المقولة الأولى بالكامل.'
    ],
    insightNote: 'كلمة "كفاية" ليست استسلاماً، بل هي حكمة الشبع والامتنان لما تم إنجازه.',
    puzzleData: {
      instructionsAr: 'تأمل مسار التحول النفسي، واختر المحطة الرابعة المتممة لنمط التعافي.',
      patternSequence: [
        { id: 'p1', label: 'تزاحم الأفكار', icon: '⚡', explanation: 'الشعور بالضغط وتراكم المهام.' },
        { id: 'p2', label: 'وقفة واعية', icon: '⏸️', explanation: 'إيقاف الاندفاع وأخذ شهيق.' },
        { id: 'p3', label: 'خطوة واحدة', icon: '👣', explanation: 'البدء بأصغر إجراء ممكن.' },
        { id: 'p4', label: '؟', icon: '❓', explanation: 'المحطة المتممة.' }
      ],
      missingIndex: 3,
      options: [
        { id: 'opt1', label: 'الرضا والسكينة', icon: '🌿', explanation: 'الشعور بالكفاية وإغلاق ملف اليوم بسلام.', isCorrect: true },
        { id: 'opt2', label: 'المزيد من التوتر', icon: '🌪️', explanation: 'تكرار نفس الحلقة المجهدة.', isCorrect: false },
        { id: 'opt3', label: 'تأجيل كل شيء للأبد', icon: '💤', explanation: 'تجنب غير بنّاء للمسؤولية.', isCorrect: false }
      ],
      logicExplanationAr: 'المسار الصحيح: بعد التزاحم، نتوقف، ثم نخطو خطوة صغيرة، فنصل للشعور بالكفاية والرضا.'
    }
  },
  {
    id: 7,
    worldId: 'garden',
    titleAr: 'متاهة النبض',
    subtitleAr: 'حرّك الوعي داخل الممر لجمع مفتاح اليقظة وتجنب فخاخ العجلة',
    quoteId: 'quote-2',
    rewardToken: {
      type: 'word',
      value: 'مشاعري',
      display: 'مشاعري',
      explanationAr: 'مبتدأ الرحلة العاطفية: الاعتراف بوجود المشاعر دون إنكارها.'
    },
    puzzleType: 'path_maze',
    difficulty: 'easy',
    xpReward: 150,
    hints: [
      'استخدم أسهم التوجيه لتحريك كرة الوعي الخضراء نحو مفتاح السكينة الذهبي أولاً.',
      'تجنب الدوائر الحمراء التي تمثل فخاخ الاندفاع ورد الفعل التلقائي.',
      'بعد التقاط المفتاح الذهبي، توجه مباشرة إلى بوابة الخروج في الأسفل.'
    ],
    insightNote: 'التحرك داخل المتاهة يشبه إدارة المشاعر؛ التروي والالتفاف حول العقبات يوصلك للهدف دون خسائر.',
    puzzleData: {
      instructionsAr: 'حرّك رمز الوعي (🌱) لجمع مفتاح الحكمة (🗝️) ثم الوصول لبوابة الخروج (🚪) متجنباً الحواجز (⛔).',
      gridRows: 5,
      gridCols: 5,
      startPos: [0, 0],
      endPos: [4, 4],
      obstacles: [[1, 1], [1, 2], [3, 1], [3, 2], [2, 3]],
      keyPositions: [[2, 1]],
      pathTheme: 'serenity'
    }
  },
  {
    id: 8,
    worldId: 'garden',
    titleAr: 'صندوق البوصلة',
    subtitleAr: 'رتّب الحروف المبعثرة لكلمة تدل على استقبال المشاعر كما هي',
    quoteId: 'quote-2',
    rewardToken: {
      type: 'word',
      value: 'إشارات',
      display: 'إشارات',
      explanationAr: 'المعنى الحقيقي للمشاعر: علامات إرشادية وليست قيوداً جبرية.'
    },
    puzzleType: 'letter_scramble',
    difficulty: 'easy',
    xpReward: 160,
    hints: [
      'الكلمة مكونة من 4 حروف وتبدأ بحرف القاف.',
      'الحرف الثاني باء، والثالث واو، والأخير لام.',
      'الكلمة هي "قبول"؛ البوابة الأولى نحو السلام النفسي.'
    ],
    insightNote: 'القبول ليس موافقة على ما لا يعجبك، بل هو اعتراف صادق بالواقع لتستطيع تغييره بحكمة.',
    puzzleData: {
      instructionsAr: 'رتّب الحروف لتشكل المفهوم النفسي الذي يسبق أي تغيير وتطور حقيقي.',
      targetWord: 'قبول',
      scrambledLetters: ['ل', 'ق', 'و', 'ب'],
      meaningAr: 'استقبال المشاعر والتجارب دون قتال أو إنكار مرهق.',
      clueAr: 'خطوة تفتح باب السلام الداخلي وتبدأ بحرف القاف.'
    }
  },
  {
    id: 9,
    worldId: 'garden',
    titleAr: 'شجرة الدلالات',
    subtitleAr: 'اكتشف النمط المنطقي للترابط بين الشعور والحاجة العميقة',
    quoteId: 'quote-2',
    rewardToken: {
      type: 'word',
      value: 'تدلني،',
      display: 'تدلني،',
      explanationAr: 'وظيفة المشاعر الرائعة: إرشادك إلى ما تهتم به فعلاً.'
    },
    puzzleType: 'pattern_matrix',
    difficulty: 'easy',
    xpReward: 170,
    hints: [
      'الخوف يدل على الحاجة للأمان، والحزن يدل على فقدان شيء ثمين.',
      'على ماذا يدل شعور الغضب الصحي عادة؟',
      'الغضب الصحي يشير إلى انتهاك الحدود أو الحاجة للعدل والاحترام.'
    ],
    insightNote: 'كل شعور يحمل في جيبه رسالة؛ حين تقرأ الرسالة، يهدأ جرس الإنذار تلقائياً.',
    puzzleData: {
      instructionsAr: 'اختر المعنى المتمم للنمط الإرشادي للمشاعر الإنسانية.',
      patternSequence: [
        { id: 'em1', label: 'الخوف', icon: '😨', explanation: 'يدل على: طلب الأمان والحماية.' },
        { id: 'em2', label: 'الحزن', icon: '😢', explanation: 'يدل على: قيمة ما تم فقده والتأمل.' },
        { id: 'em3', label: 'الغضب', icon: '😤', explanation: 'يدل على: انتهاك حد أو قيمة هامة.' },
        { id: 'em4', label: '؟', icon: '❓', explanation: 'رسالة الشعور المتمم.' }
      ],
      missingIndex: 3,
      options: [
        { id: 'opt_guilt', label: 'الذنب الصحي 🧭', icon: '🧭', explanation: 'يدل على: رغبة في إصلاح خطأ والعودة لقيمك الأصيلة.', isCorrect: true },
        { id: 'opt_hate', label: 'الكراهية العمياء 💥', icon: '💥', explanation: 'انفعال تدميري يفتقر للرسالة البناءة.', isCorrect: false },
        { id: 'opt_numb', label: 'التبلد والانفصال 🧊', icon: '🧊', explanation: 'آلية دفاعية للهروب من الشعور.', isCorrect: false }
      ],
      logicExplanationAr: 'المشاعر إشارات: الخوف يطلب الأمان، الغضب يحمي الحدود، والحزن يقدّر القيمة، والذنب الواعي يدعو لإصلاح المسار.'
    }
  },
  {
    id: 10,
    worldId: 'garden',
    titleAr: 'دائرة السيطرة',
    subtitleAr: 'اختر القطعة الناقصة التي تقع حقاً داخل نطاق يدك',
    quoteId: 'quote-2',
    rewardToken: {
      type: 'word',
      value: 'وليست',
      display: 'وليست',
      explanationAr: 'أداة الفصل والتمييز بين المؤثر الخارجي واختيارك الحر الداخلي.'
    },
    puzzleType: 'missing_piece',
    difficulty: 'medium',
    xpReward: 180,
    hints: [
      'ما الذي يقع 100% تحت تصرفك وتحكمك المباشر في هذه اللحظة؟',
      'آراء الآخرين، والماضي، والطقس تقع في الدائرة الخارجية (خارج السيطرة).',
      'اختر "رد فعلي وطريقة كلامي 🎯" كعنصر ينتمي لقلب دائرة السيطرة.'
    ],
    insightNote: 'راحة البال تكمن في ترك ما لا نملك تغييره، وتوجيه كل طاقتنا لما نملك اختياره.',
    puzzleData: {
      instructionsAr: 'حدد العنصر الذي يكمل حزام دائرة السيطرة الحقيقية للإنسان.',
      conceptTitle: 'دائرة السيطرة النفسية (في إيدي)',
      boardItems: [
        { title: 'أفكاري التي أتبناها', desc: 'ما أختاره بوعي', icon: '🧠' },
        { title: 'مجهودي وعملي', desc: 'طاقتي المبذولة', icon: '⚡' },
        { title: 'طريقة تنفسي وهدوئي', desc: 'استجابتي الجسدية', icon: '🌬️' }
      ],
      missingSlotIndex: 3,
      options: [
        { id: 'opt_ctrl1', title: 'رد فعلي واختياراتي', desc: 'كيف أستجيب للموقف بحكمة', icon: '🎯', isCorrect: true, feedbackAr: 'صحيح تماماً! استجابتك هي جوهر ما تملكه.' },
        { id: 'opt_ctrl2', title: 'آراء وتقييمات الناس', desc: 'ما يفكر فيه الآخرون عني', icon: '👥', isCorrect: false, feedbackAr: 'آراء الناس خارج سيطرتك؛ ملاحقتها تستنزف الروح.' },
        { id: 'opt_ctrl3', title: 'نتائج الأمور في المستقبل', desc: 'الأقدار وما سيحدث غداً', icon: '⏳', isCorrect: false, feedbackAr: 'المستقبل بيد الله؛ ما نملكه هو السعي في الحاضر.' }
      ]
    }
  },

  // ==========================================
  // العالم الثاني: مكتبة الأسرار (المستويات 11 - 20)
  // ==========================================
  {
    id: 11,
    worldId: 'library',
    titleAr: 'قاعة المخطوطات',
    subtitleAr: 'رتّب لوحة مكتبة الحكمة لاستكمال مقولة المشاعر',
    quoteId: 'quote-2',
    rewardToken: {
      type: 'word',
      value: 'أوامر',
      display: 'أوامر',
      explanationAr: 'المشاعر ليست سلطة استبدادية تفرض عليك التصرف بحماقة.'
    },
    puzzleType: 'tile_puzzle',
    difficulty: 'medium',
    xpReward: 200,
    hints: [
      'طابق المصباح المضيء في الجزء العلوي من رف الكتب.',
      'طابق طاولة القراءة والمخطوطة الذهبية في الوسط والأسفل.',
      'بدّل بين القطع حتى تظهر الباحثة في مكتبة المعرفة بوضوح.'
    ],
    insightNote: 'المعرفة الحقيقية ليست حفظ الكتب، بل فهم الطبيعة البشرية بإنصاف ومودة.',
    puzzleData: {
      instructionsAr: 'رتّب قطع لوحة المكتبة الدافئة لتفتح درج المخطوطة السرية.',
      previewTitle: 'مكتبة أسرار الفكر والوعي',
      gridSize: 3,
      imageSrc: CIPHER_IMAGES.librarySecrets,
      targetOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    }
  },
  {
    id: 12,
    worldId: 'library',
    titleAr: 'تتويج المقولة الثانية',
    subtitleAr: 'فك شفرة الحروف الأثرية لختام مقولة إشارات المشاعر',
    quoteId: 'quote-2',
    rewardToken: {
      type: 'word',
      value: 'تلزمني.',
      display: 'تلزمني.',
      explanationAr: 'كلمة التحرر؛ الشعور يقترح، والوعي يقرر بحرية.'
    },
    puzzleType: 'symbol_cipher',
    difficulty: 'medium',
    xpReward: 240,
    hints: [
      'الرموز تمثل حروف كلمة تعبر عن التحرر والقدرة على الاختيار.',
      'الرمز 🗝️ يطابق الحرف خ، والرمز 🕊️ يطابق الحرف ي، والرمز ⚖️ يطابق الحرف ا، والرمز 🛡️ يطابق الحرف ر.',
      'الكلمة هي "خيار"؛ اضغط الحروف لتثبيت حرية إرادتك.'
    ],
    insightNote: 'بين المثير والاستجابة توجد مساحة؛ في تلك المساحة تكمن قوتنا وحريتنا في الاختيار.',
    puzzleData: {
      instructionsAr: 'فك الشفرة الرمزية لكلمة القوة التي تلغي الإلزام الأعمى للمشاعر.',
      cipherTable: {
        '🗝️': 'خ',
        '🕊️': 'ي',
        '⚖️': 'ا',
        '🛡️': 'ر'
      },
      encryptedMessage: ['🗝️', '🕊️', '⚖️', '🛡️'],
      targetWord: 'خيار',
      hintsLetters: {
        '🗝️': 'خ'
      }
    }
  },
  {
    id: 13,
    worldId: 'library',
    titleAr: 'هندسة الحدود',
    subtitleAr: 'رتّب خطوات الرد الحكيم عند التعرض لطلب مرهق ومفاجئ',
    quoteId: 'quote-3',
    rewardToken: {
      type: 'word',
      value: 'الحدود ليست',
      display: 'الحدود ليست',
      explanationAr: 'تصحيح المفهوم الشائع الخاطئ عن الحدود الشخصية.'
    },
    puzzleType: 'scenario_order',
    difficulty: 'medium',
    xpReward: 210,
    hints: [
      'الخطوة الأولى هي التوقف عن الإجابة الفورية وأخذ نفس للتفكير.',
      'الخطوة الثانية فحص طاقتك المتاحة بصدق دون مجاملة.',
      'الخطوة الثالثة هي تقديم رد واضح وهادئ يعتذر بلطف ودون تبريرات مفرطة.'
    ],
    insightNote: 'الرد الهادئ الحاسم يقطع دابر الاستنزاف ويحفظ الاحترام المتبادل في العلاقات.',
    puzzleData: {
      instructionsAr: 'رتّب الخطوات الأربع للاستجابة الصحية عندما يطلب منك أحدهم طلباً فوق طاقتك.',
      situationTitle: 'طلب خدمة تتجاوز طاقتك ووقتك المتاح',
      situationDesc: 'أحد المعارف يطلب منك مهمة شاقة فورية ستكلفك راحتك ونومك.',
      steps: [
        { id: 'st1', text: 'أخذ نفس عميق وتأجيل الرد الفوري («دعني أراجع جدولي»)', correctOrder: 1, reflectionAr: 'يحميك من فخ الموافقة التلقائية بدافع الحرج.' },
        { id: 'st2', text: 'فحص طاقتي النفسية والجسدية وما إذا كان لدي متسع حقيقي', correctOrder: 2, reflectionAr: 'الصدق مع نفسك قبل الصدق مع الآخرين.' },
        { id: 'st3', text: 'صياغة اعتذار لطيف ومباشر دون تأليف أعذار وهمية', correctOrder: 3, reflectionAr: '«لا أستطيع المساعدة هذه المرة، وأتمنى لك التوفيق».' },
        { id: 'st4', text: 'إغلاق الموضوع دون اجترار مشاعر الذنب أو لوم النفس', correctOrder: 4, reflectionAr: 'لكل إنسان حق مشروع في حماية وقته وطاقته.' }
      ]
    }
  },
  {
    id: 14,
    worldId: 'library',
    titleAr: 'صندوق السياج',
    subtitleAr: 'جمّع حروف الكلمة التي تبني البيوت النفسية الآمنة',
    quoteId: 'quote-3',
    rewardToken: {
      type: 'word',
      value: 'جداراً لقسوة،',
      display: 'جداراً لقسوة،',
      explanationAr: 'الحدود ليست عقاباً ولا عداوة، بل صون للمودة الحقيقية.'
    },
    puzzleType: 'letter_scramble',
    difficulty: 'medium',
    xpReward: 220,
    hints: [
      'الكلمة مكونة من 4 حروف وتبدأ بحرف الحاء.',
      'تتكون من: ح - د - و - د.',
      'الكلمة هي "حدود"؛ رتبها لتفتح درج الحكمة.'
    ],
    insightNote: 'الشخص الذي يحترم حدوده الخاصة، يسهل عليه احترام حدود الآخرين دون حساسية.',
    puzzleData: {
      instructionsAr: 'رتّب الحروف لتشكل المفهوم الأكثر أهمية في حماية الصحة النفسية والعلاقات.',
      targetWord: 'حدود',
      scrambledLetters: ['د', 'ح', 'د', 'و'],
      meaningAr: 'الخط الفاصل الواعي بين ما يخصني وما يخص الآخرين.',
      clueAr: 'سياج الأمان الذي يحمي خصوصيتك وطاقتك.'
    }
  },
  {
    id: 15,
    worldId: 'library',
    titleAr: 'أدلة الوضوح',
    subtitleAr: 'ابحث عن رموز الصدق والوضوح في أروقة المكتبة',
    quoteId: 'quote-3',
    rewardToken: {
      type: 'word',
      value: 'بل سياج',
      display: 'بل سياج',
      explanationAr: 'السياج يسمح بالرؤية وتبادل السلام، لكنه يمنع التعدي.'
    },
    puzzleType: 'clue_search',
    difficulty: 'medium',
    xpReward: 230,
    hints: [
      'ابحث عن الريشة الذهبية على مكتب الكتابة.',
      'ابحث عن قنديل الحكمة المعلق على الدرج الحلزوني.',
      'ابحث عن لفافة الميثاق على الرف السفلي الأيمن.'
    ],
    insightNote: 'البحث عن الأدلة يدرّب العين على التقاط المعاني العميقة خلف ضجيج الحياة اليومية.',
    puzzleData: {
      instructionsAr: 'انقر على العناصر الثلاثة الدالة على وضوح الرؤية في مشهد المكتبة.',
      sceneBackground: CIPHER_IMAGES.librarySecrets,
      hiddenItems: [
        {
          id: 'quill',
          nameAr: 'ريشة التدوين والصدق',
          descriptionAr: 'كتابة المشاعر بوضوح تزيل الضباب عن القرارات.',
          x: 58,
          y: 65,
          icon: '🪶'
        },
        {
          id: 'lantern_stair',
          nameAr: 'قنديل الحكمة المرتفع',
          descriptionAr: 'نور يوضح معالم الطريق لمن يصعد سلم الوعي.',
          x: 44,
          y: 38,
          icon: '🏮'
        },
        {
          id: 'scroll_bottom',
          nameAr: 'لفافة ميثاق الأمان',
          descriptionAr: 'وثيقة تذكرك بأن كرامتك وسلامك الداخلي غير قابلين للتفاوض.',
          x: 88,
          y: 68,
          icon: '📜'
        }
      ]
    }
  },
  {
    id: 16,
    worldId: 'library',
    titleAr: 'متاهة العلاقات الآمنة',
    subtitleAr: 'اعبر مسار المكتبة لجمع بوصلة الاحترام والوصول لباب النضج',
    quoteId: 'quote-3',
    rewardToken: {
      type: 'word',
      value: 'يحمي مساحتي',
      display: 'يحمي مساحتي',
      explanationAr: 'حقك الطبيعي في امتلاك مساحة خاصة للتنفس والتفكير والراحة.'
    },
    puzzleType: 'path_maze',
    difficulty: 'medium',
    xpReward: 230,
    hints: [
      'انطلق من الزاوية العليا اليمين، وانزل خطوتين لتجنب رف الكتب المغلق.',
      'التقط رمز بوصلة الاحترام (🧭) في المنتصف.',
      'اتجه يساراً ثم للأسفل نحو بوابة المودة الصادقة.'
    ],
    insightNote: 'المتاهات تعلّمنا الصبر؛ الطريق الآمن لا يعني دائماً أقصر طريق، بل الأكثر ثباتاً.',
    puzzleData: {
      instructionsAr: 'حرّك الباحث (🚶) عبر مسار المكتبة، التقط بوصلة الاحترام (🧭) واخرج من البوابة (🚪).',
      gridRows: 6,
      gridCols: 6,
      startPos: [0, 5],
      endPos: [5, 0],
      obstacles: [[1, 5], [1, 4], [2, 2], [3, 2], [4, 2], [4, 1], [3, 4], [4, 4]],
      keyPositions: [[2, 3]],
      pathTheme: 'focus'
    }
  },
  {
    id: 17,
    worldId: 'library',
    titleAr: 'مصفوفة التواصل الصادق',
    subtitleAr: 'اكتشف النمط المنطقي للتعبير عن النفس بحزم وهدوء',
    quoteId: 'quote-3',
    rewardToken: {
      type: 'word',
      value: 'لكي أحب',
      display: 'لكي أحب',
      explanationAr: 'الحب الحقيقي لا يزدهر إلا على أرضية من الصدق والحرية.'
    },
    puzzleType: 'pattern_matrix',
    difficulty: 'medium',
    xpReward: 240,
    hints: [
      'التواصل السلبي: كبت واستسلام؛ التواصل العدواني: هجوم وإيذاء.',
      'ما هو النمط الثالث الناضج الذي يجمع بين احترام الذات واحترام الآخر؟',
      'التواصل الحازم الهادئ (Assertiveness) هو الخيار الصحيح.'
    ],
    insightNote: 'الحزم النفسي هو التعبير عن حقك ومشاعرك بوضوح دون خوف ودون اعتداء على أحد.',
    puzzleData: {
      instructionsAr: 'اختر النمط المتزن الذي يكمل مصفوفة أنماط التعبير الإنساني.',
      patternSequence: [
        { id: 'as1', label: 'الاستسلام السلبي', icon: '🙈', explanation: 'كتمان الحق بداعي الخجل أو الخوف.' },
        { id: 'as2', label: 'الهجوم العدواني', icon: '😡', explanation: 'فرض الرأي بالقسوة وتجاهل مشاعر الآخرين.' },
        { id: 'as3', label: 'المراوغة السلبية', icon: '🎭', explanation: 'إظهار الرضا وإخفاء الاستياء بالتعطيل.' },
        { id: 'as4', label: '؟', icon: '❓', explanation: 'النمط الناضج المتمم.' }
      ],
      missingIndex: 3,
      options: [
        { id: 'opt_assert', label: 'الحزم الهادئ المنصف', icon: '🛡️', explanation: '«أنا أحترمك وأحترم رغبتك، ولكني أعتذر لأن هذا لا يناسبني الآن».', isCorrect: true },
        { id: 'opt_isolate', label: 'الهروب والقطيعة التامة', icon: '🚪', explanation: 'قطع العلاقات دون توضيح أو نضج.', isCorrect: false },
        { id: 'opt_pretend', label: 'المجاملة الكاذبة الدائمة', icon: '🤡', explanation: 'الموافقة الظاهرية مع الاحتراق الداخلي.', isCorrect: false }
      ],
      logicExplanationAr: 'مصفوفة التواصل: السلبية تهدر حقك، العدوانية تهدر حق الآخر، والحزم الهادئ يصون حق الطرفين.'
    }
  },
  {
    id: 18,
    worldId: 'library',
    titleAr: 'تتويج المقولة الثالثة',
    subtitleAr: 'رتّب شطر المقولة الختامية لتتويج حكمة الحدود النفسية',
    quoteId: 'quote-3',
    rewardToken: {
      type: 'word',
      value: 'بصدق.',
      display: 'بصدق.',
      explanationAr: 'الصدق هو الثمرة الكبرى للحدود؛ لا نفاق ولا ضغينة مستترة.'
    },
    puzzleType: 'word_sequence',
    difficulty: 'medium',
    xpReward: 260,
    hints: [
      'الجملة تلخص غاية الحدود في العلاقات الإنسانية.',
      'الترتيب: سياج الأمان، ثم حماية الكيان، ثم المحبة الحقيقية.',
      'الترتيب الصحيح: "سياج الأمان" -> "يحمي مساحتي" -> "لكي أحب بصدق".'
    ],
    insightNote: 'عندما تحمي مساحتك بوعي، يصبح عطاؤك للآخرين نابعاً من فيض، لا من خوف الفقد.',
    puzzleData: {
      instructionsAr: 'رتّب البطاقات الثلاث لتكوين المعنى الختامي لمقولة الحدود والمحبة.',
      correctSentence: ['سياج الأمان', 'يحمي مساحتي', 'لكي أحب بصدق'],
      scrambledWords: ['لكي أحب بصدق', 'سياج الأمان', 'يحمي مساحتي'],
      contextAr: 'الغاية السامية من الحدود ليست العزلة، بل الحب الناضج النظيف من الاستنزاف.'
    }
  },
  {
    id: 19,
    worldId: 'library',
    titleAr: 'شفرة المسودة',
    subtitleAr: 'فك شفرة المخطوطة النقدية لإعادة تعريف الخطأ البشري',
    quoteId: 'quote-4',
    rewardToken: {
      type: 'word',
      value: 'الغلط',
      display: 'الغلط',
      explanationAr: 'طبيعة الإنسان النقص، والخطأ هو معلمنا الأول في مدرسة الحياة.'
    },
    puzzleType: 'symbol_cipher',
    difficulty: 'medium',
    xpReward: 220,
    hints: [
      'الرموز تمثل حروف كلمة دالة على الاستمرار والنهوض بعد العثرة.',
      'الرمز 🌿 = ن، الرمز 👣 = م، الرمز 🌱 = و.',
      'الكلمة هي "نمو"؛ اضغط الحروف لتكتشف سر التطور.'
    ],
    insightNote: 'الشجرة لا تنمو مستقيمة طوال الوقت؛ تنحني مع الريح وتصحح مسارها نحو الشمس باستمرار.',
    puzzleData: {
      instructionsAr: 'فك شفرة الكلمة التي تمثل جوهر عقلية التطور المستمر.',
      cipherTable: {
        '🌿': 'ن',
        '👣': 'م',
        '🌱': 'و'
      },
      encryptedMessage: ['🌿', '👣', '🌱'],
      targetWord: 'نمو',
      hintsLetters: {
        '🌿': 'ن'
      }
    }
  },
  {
    id: 20,
    worldId: 'library',
    titleAr: 'صندوق التجربة',
    subtitleAr: 'جمّع حروف كلمة السر التي تنقذك من رعب الفشل',
    quoteId: 'quote-4',
    rewardToken: {
      type: 'word',
      value: 'مش نهاية',
      display: 'مش نهاية',
      explanationAr: 'الخطأ محطة على الطريق وليس جرفاً يسقطك في العدم.'
    },
    puzzleType: 'letter_scramble',
    difficulty: 'medium',
    xpReward: 230,
    hints: [
      'الكلمة مكونة من 5 حروف وتبدأ بحرف التاء.',
      'تتكون من: ت - ج - ر - ب - ة.',
      'الكلمة هي "تجربة"؛ رتبها لتدرك أن كل خطوة هي اختبار معرفي.'
    ],
    insightNote: 'لا توجد هزائم في طريق السعي؛ هناك نتائج ودروس تصقل البصيرة وتزيدك خبرة.',
    puzzleData: {
      instructionsAr: 'رتّب حروف الكلمة التي تحول الخطأ من تهمة شخصية إلى فرصة تعلم علمية.',
      targetWord: 'تجربة',
      scrambledLetters: ['ة', 'ت', 'ب', 'ج', 'ر'],
      meaningAr: 'محاولة واعية واستكشاف لاكتشاف ما ينفع وما لا ينفع.',
      clueAr: 'الاسم العلمي لكل خطوة نخطوها في الحياة قبل الحكم عليها.'
    }
  },

  // ==========================================
  // العالم الثالث: كهف التفكير (المستويات 21 - 30)
  // ==========================================
  {
    id: 21,
    worldId: 'cave',
    titleAr: 'بلورات التأمل',
    subtitleAr: 'رتّب قطع كهف البصيرة المضاء بالبلورات الهادئة',
    quoteId: 'quote-4',
    rewardToken: {
      type: 'word',
      value: 'الطريق؛',
      display: 'الطريق؛',
      explanationAr: 'الحياة مسار طويل مستمر، والتعثر جزء طبيعي من المشي.'
    },
    puzzleType: 'tile_puzzle',
    difficulty: 'challenging',
    xpReward: 250,
    hints: [
      'ابدأ بمطابقة فتحة السقف التي ينفذ منها شعاع الشمس في الأعلى.',
      'طابق بلورات الكهف الذهبية اللامعة على الجانبين الأيمن والأيسر.',
      'طابق انعكاس الضوء على سطح الماء الفيروزي الهادئ في الأسفل.'
    ],
    insightNote: 'الكهوف في علم النفس ترمز للعمق الداخلي؛ النزول إليها ليس ضياعاً بل اكتشاف لكنوز الوعي.',
    puzzleData: {
      instructionsAr: 'رتّب قطع لوحة كهف التفكير ليكتمل المشهد الصامت للبصيرة.',
      previewTitle: 'كهف البلورات والتأمل الهادئ',
      gridSize: 3,
      imageSrc: CIPHER_IMAGES.caveReflection,
      targetOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    }
  },
  {
    id: 22,
    worldId: 'cave',
    titleAr: 'تسلسل احتواء التعثر',
    subtitleAr: 'رتّب خطوات التعامل النفسي السليم لحظة اكتشاف خطأ غير مقصود',
    quoteId: 'quote-4',
    rewardToken: {
      type: 'word',
      value: 'الغلط مسوّدة',
      display: 'الغلط مسوّدة',
      explanationAr: 'تشبيه عبقري: المسودة قابلة للتعديل والتحسين وليست حكماً بالإعدام.'
    },
    puzzleType: 'scenario_order',
    difficulty: 'challenging',
    xpReward: 260,
    hints: [
      'الخطوة الأولى: أوقف جلد الذات وأخذ نفس عميق لتهدئة اللوزة الدماغية (Amygdala).',
      'الخطوة الثانية: تقبل حدوث الخطأ دون إنكار أو تبرير كاذب.',
      'الخطوة الثالثة: استخراج الدرس، والخطوة الرابعة: تعديل المسار والبدء من جديد.'
    ],
    insightNote: 'العقول العظيمة لا تخلو من الأخطاء، لكنها تملك مرونة فائقة في سرعة التعافي وتعديل الخطة.',
    puzzleData: {
      instructionsAr: 'رتّب الخطوات الأربع الحكيمة للاستجابة النفسية عند ارتكاب زلة أو خطأ غير مقصود.',
      situationTitle: 'اكتشاف خطأ في مشروع أو كلمة غير مناسبة خرجت منك',
      situationDesc: 'شعور مفاجئ بالارتباك وتأنيب الضمير الحاد ورغبة في الاختباء.',
      steps: [
        { id: 'sc_err1', text: 'إيقاف صوت الناقد الداخلي القاسي والتنفس («أنا بشر والخطأ وارد»)', correctOrder: 1, reflectionAr: 'تهدئة الطوارئ العصبية لمنع الانحدار للوم الذاتي.' },
        { id: 'sc_err2', text: 'الاعتراف الصادق بما حدث دون تهويل كارثي أو تهوين مخل', correctOrder: 2, reflectionAr: 'النظر للواقع بحجمه الحقيقي دون نظارات التشاؤم.' },
        { id: 'sc_err3', text: 'استخلاص الدرس الواضح: ما الذي سأفعله بشكل مختلف في المرة القادمة؟', correctOrder: 3, reflectionAr: 'تحويل الحادثة إلى رصيد من الخبرة والذكاء.' },
        { id: 'sc_err4', text: 'اتخاذ خطوة إصلاحية فورية والمضي قدماً برأس مرفوعة', correctOrder: 4, reflectionAr: 'الاعتذار إن لزم أو إعادة صياغة العمل بابتسامة متصالحة.' }
      ]
    }
  },
  {
    id: 23,
    worldId: 'cave',
    titleAr: 'قطعة المرونة المفقودة',
    subtitleAr: 'حدد المفتاح النفسي الذي يكمل فسيفساء المرونة العقلية',
    quoteId: 'quote-4',
    rewardToken: {
      type: 'word',
      value: 'بتعلّمني',
      display: 'بتعلّمني',
      explanationAr: 'التعليم الفعلي يبدأ من الاحتكاك المباشر مع صعوبات الحياة وتجاوزها.'
    },
    puzzleType: 'missing_piece',
    difficulty: 'challenging',
    xpReward: 260,
    hints: [
      'المرونة النفسية تحتاج: قبول الواقع، وتفكيك الصدمة، والسعي المرن.',
      'ما هي السمة التي تجعل الإنسان يتعلم دون أن ينكسر كبرياؤه؟',
      'التعاطف مع النفس وقت الضعف (Self-Compassion) هو القطعة الأساسية المفقودة.'
    ],
    insightNote: 'القسوة على النفس لا تصنع أبطالاً، بل تصنع قلقاً مزروعاً بالهشاشة؛ التعاطف يصنع قوة لا تُقهر.',
    puzzleData: {
      instructionsAr: 'اختر المكون الأهم المتمم لمعادلة المرونة والصلابة النفسية عند الخطأ.',
      conceptTitle: 'ركائز التعافي النفسي من العثرات',
      boardItems: [
        { title: 'الواقعية وتقبل النقص', desc: 'إدراك أن الكمال المطلق مستحيل', icon: '🌱' },
        { title: 'عقلية النمو والتعلم', desc: 'كل مهارة قابلة للصقل بالممارسة', icon: '💡' },
        { title: 'المبادرة وتعديل الخطة', desc: 'الحركة إلى الأمام دون جمود', icon: '🚀' }
      ],
      missingSlotIndex: 3,
      options: [
        { id: 'opt_comp', title: 'التعاطف الذاتي والرفق', desc: 'معاملة نفسك كصديق عزيز أخطأ ويحتاج دعماً', icon: '🤍', isCorrect: true, feedbackAr: 'بالتأكيد! بدون الرفق بالنفس، يتحول الخطأ إلى سياط تدمير.' },
        { id: 'opt_punish', title: 'عقاب النفس الصارم', desc: 'حرمان الذات من الراحة لضمان عدم التكرار', icon: '⛓️', isCorrect: false, feedbackAr: 'العقاب الصارم يزيد التوتر ويؤدي لتكرار الأخطاء.' },
        { id: 'opt_deny', title: 'التظاهر بأن شيئاً لم يحدث', desc: 'دفن المشاعر وتجاهل النتائج تماماً', icon: '🙈', isCorrect: false, feedbackAr: 'الإنكار يمنع التعلم ويترك المشكلة لتنفجر لاحقاً.' }
      ]
    }
  },
  {
    id: 24,
    worldId: 'cave',
    titleAr: 'تتويج المقولة الرابعة',
    subtitleAr: 'رتّب كلمات الشطر لتتويج حكمة المسودة وتعديل المسار',
    quoteId: 'quote-4',
    rewardToken: {
      type: 'word',
      value: 'أكتب صح.',
      display: 'أكتب صح.',
      explanationAr: 'الوصول إلى الإتقان والصفاء هو ثمرة تجارب المسودات الكثيرة.'
    },
    puzzleType: 'word_sequence',
    difficulty: 'challenging',
    xpReward: 280,
    hints: [
      'الجملة تصف كيف نصل للصواب عبر المرور بالتجربة.',
      'الترتيب: التعلم من المسودة، ثم تصحيح الكلمات، ثم بلوغ الصواب.',
      'الترتيب: "التعلم من المسودة" -> "يصقل بصيرتي" -> "لكي أكتب صح".'
    ],
    insightNote: 'الكاتب البارع يرمي عشرات الصفحات في السلة قبل أن تخرج روايته العظيمة؛ لا تخجل من مسوداتك.',
    puzzleData: {
      instructionsAr: 'رتّب البطاقات الثلاث لتكوين المعنى النهائي لمقولة تقبل الخطأ والنمو.',
      correctSentence: ['التعلم من المسودة', 'يصقل بصيرتي', 'لكي أكتب صح'],
      scrambledWords: ['لكي أكتب صح', 'التعلم من المسودة', 'يصقل بصيرتي'],
      contextAr: 'الصواب والإتقان ليسا وحياً ينزل فجأة، بل تراكم واعٍ من مراجعة المسودات.'
    }
  },
  {
    id: 25,
    worldId: 'cave',
    titleAr: 'متاهة الوعي الداخلي',
    subtitleAr: 'اعبر مسارات الكهف المعقدة متجنباً فخاخ الاجترار الذهني',
    quoteId: 'quote-5',
    rewardToken: {
      type: 'word',
      value: 'أنا لست',
      display: 'أنا لست',
      explanationAr: 'النفي التحريري الأعظم: أنت لست محتوى أفكارك العابرة.'
    },
    puzzleType: 'path_maze',
    difficulty: 'challenging',
    xpReward: 260,
    hints: [
      'ابدأ من الأعلى يسار، واتجه يميناً خطوتين ثم انزل عبر الممر المائي.',
      'التقط شعلة البصيرة (🕯️) بالقرب من بلورة الكهف المركزية.',
      'اعبر الممر السفلي وتجنب دوامة القلق المظلمة لتصل إلى بوابة الحضور (🚪).'
    ],
    insightNote: 'المتاهات الصعبة تعلمنا الثقة في البوصلة الداخلية؛ عندما تكون الرؤية ضبابية، يكفي أن ترى الخطوة التالية فقط.',
    puzzleData: {
      instructionsAr: 'حرّك رمز الوعي (🧘) في متاهة الكهف المعقدة، التقط شعلة البصيرة (🕯️) واخرج بسلام (🚪).',
      gridRows: 6,
      gridCols: 6,
      startPos: [0, 0],
      endPos: [5, 5],
      obstacles: [[0, 2], [1, 2], [1, 3], [2, 0], [2, 4], [3, 2], [4, 2], [4, 4], [5, 1]],
      keyPositions: [[3, 3]],
      pathTheme: 'courage'
    }
  },
  {
    id: 26,
    worldId: 'cave',
    titleAr: 'صندوق الذات المراقبة',
    subtitleAr: 'جمّع حروف الكلمة التي تعبر عن الأفكار العابرة',
    quoteId: 'quote-5',
    rewardToken: {
      type: 'word',
      value: 'أفكاري؛',
      display: 'أفكاري؛',
      explanationAr: 'مجرد اقتراحات عقلية يولدها الدماغ، وليست هويتك الجوهرية.'
    },
    puzzleType: 'letter_scramble',
    difficulty: 'challenging',
    xpReward: 260,
    hints: [
      'الكلمة مكونة من 5 حروف وتدل على الغيوم الذهنية التي تعبر سماء رأسنا.',
      'الحروف هي: أ - ف - ك - ا - ر.',
      'الكلمة هي "أفكار"؛ رتبها لتدرك أنها مجرد أحداث عقلية مؤقتة.'
    ],
    insightNote: 'الدماغ مصنع للأفكار، ينتج آلاف الأفكار يومياً؛ حريتك هي ألا تشتري كل ما يصنعه.',
    puzzleData: {
      instructionsAr: 'رتّب الحروف لتشكل المفهوم الذي نخلط بينه وبين حقيقتنا أحياناً.',
      targetWord: 'أفكار',
      scrambledLetters: ['ر', 'أ', 'ك', 'ف', 'ا'],
      meaningAr: 'الكلمات والصور والسيناريوهات التي تجول في الذهن باستمرار.',
      clueAr: 'أحداث عقلية تروح وتجيء، ولا تمثل حقيقتك الصامتة.'
    }
  },
  {
    id: 27,
    worldId: 'cave',
    titleAr: 'شفرة المراقب الصامت',
    subtitleAr: 'فك الشفرة الرمزية للوصول إلى اسم الذات التي تشهد كل شيء بسلام',
    quoteId: 'quote-5',
    rewardToken: {
      type: 'word',
      value: 'أنا المراقب',
      display: 'أنا المراقب',
      explanationAr: 'الذات الواعية الثابتة خلف العواصف الذهنية (The Observing Self).'
    },
    puzzleType: 'symbol_cipher',
    difficulty: 'challenging',
    xpReward: 270,
    hints: [
      'الرموز تمثل حروف كلمة "يقظة" التي تعني الحضور والانتباه في اللحظة.',
      'الرمز 👁️ = ي، الرمز 🌿 = ق، الرمز 🛡️ = ظ، الرمز 🌸 = ة.',
      'الكلمة هي "يقظة"؛ اضغط الحروف بالترتيب الصحيح.'
    ],
    insightNote: 'عندما تستيقظ للأن وهنا، تفقد الأفكار المستقبلية والماضية سلطتها الوهمية على نبضك.',
    puzzleData: {
      instructionsAr: 'فك شفرة الكلمة التي تمثل مهارة الحضور الكامل مع النفس دون تشتت.',
      cipherTable: {
        '👁️': 'ي',
        '🌿': 'ق',
        '🛡️': 'ظ',
        '🌸': 'ة'
      },
      encryptedMessage: ['👁️', '🌿', '🛡️', '🌸'],
      targetWord: 'يقظة',
      hintsLetters: {
        '👁️': 'ي'
      }
    }
  },
  {
    id: 28,
    worldId: 'cave',
    titleAr: 'أدلة العمق والسكينة',
    subtitleAr: 'ابحث عن رموز البصيرة العميقة المخبأة في أعماق كهف التفكير',
    quoteId: 'quote-5',
    rewardToken: {
      type: 'word',
      value: 'الهادئ الذي',
      display: 'الهادئ الذي',
      explanationAr: 'الهدوء ليس غياب العواصف، بل وجود المركز الثابت داخلك.'
    },
    puzzleType: 'clue_search',
    difficulty: 'challenging',
    xpReward: 270,
    hints: [
      'ابحث عن بلورة البصيرة الكهرمانية في الجانب الأيسر من الكهف.',
      'ابحث عن بركة الماء الصامتة العاكسة للنور في المنتصف والأسفل.',
      'ابحث عن حجر التأمل الهادئ المرتفع الذي يجلس عليه المتأمل في اليمين.'
    ],
    insightNote: 'الماء الساكن يعكس السماء بوضوح؛ وعندما يهدأ عقلك، ترى حقائق الأمور كما هي دون تشويه.',
    puzzleData: {
      instructionsAr: 'انقر على العناصر الثلاثة التي تشهد على عمق السكينة في الكهف الصامت.',
      sceneBackground: CIPHER_IMAGES.caveReflection,
      hiddenItems: [
        {
          id: 'amber_crystal',
          nameAr: 'بلورة الكهرمان اللامعة',
          descriptionAr: 'رمز للبصيرة التي تختزن النور الداخلي.',
          x: 18,
          y: 65,
          icon: '💎'
        },
        {
          id: 'still_water',
          nameAr: 'مرآة الماء الصامت',
          descriptionAr: 'رمز للوعي الصافي الذي لا يتكدر بمرور الأفكار العابرة.',
          x: 48,
          y: 78,
          icon: '💧'
        },
        {
          id: 'meditation_stone',
          nameAr: 'صخرة الثبات والتأمل',
          descriptionAr: 'مقام الذات المراقبة التي تشهد حركة الحياة دون انفعال أعمى.',
          x: 74,
          y: 60,
          icon: '🪨'
        }
      ]
    }
  },
  {
    id: 29,
    worldId: 'cave',
    titleAr: 'التحدي المركب: فك الشفرة والترتيب',
    subtitleAr: 'اجمع بين فك الرموز وترتيب مسار التحرر المعرفي',
    quoteId: 'quote-5',
    rewardToken: {
      type: 'word',
      value: 'يختار ما',
      display: 'يختار ما',
      explanationAr: 'امتلاك زمام الانتقاء: أنت تقرر أي الأفكار تخدم قيمك وأيها تتركها ترحل.'
    },
    puzzleType: 'hybrid_challenge',
    difficulty: 'challenging',
    xpReward: 300,
    hints: [
      'المرحلة الأولى: فك الشفرة للرمزين 💎 و 🌟 للوصول لكلمة "سر".',
      'المرحلة الثانية: رتّب الكلمات الثلاث لتشكل عبارة: "أنا ألاحظ الفكرة".',
      'بعد الانتهاء من المرحلتين، سيتم فتح الشطر قبل الأخير من المقولة الكبرى.'
    ],
    insightNote: 'التحديات المركبة تعكس تعقيد الحياة الواقعية؛ عندما نمتلك المهارة والصبر، يحل كل عقدة في أوانها.',
    puzzleData: {
      instructionsAr: 'أكمل التحدي المزدوج: فك الشفرة أولاً، ثم رتّب خطوات تفكيك الفكرة ثانياً.',
      phase1: {
        type: 'cipher',
        cipherKey: { '💎': 'س', '🌟': 'ر' },
        codeWords: ['💎', '🌟'],
        solution: 'سر'
      },
      phase2: {
        type: 'order',
        prompt: 'رتّب البطاقات الثلاث لتمارس تفكيك الفكرة التسلطية:',
        words: ['الفكرة', 'أنا', 'ألاحظ'],
        correctOrder: ['أنا', 'ألاحظ', 'الفكرة']
      }
    }
  },
  {
    id: 30,
    worldId: 'cave',
    titleAr: 'تتويج شفرة نسمة الكبرى',
    subtitleAr: 'اللغز الختامي لفك شفرة الأفق وفتح المقولة الخامسة وبوابة الحكمة',
    quoteId: 'quote-5',
    rewardToken: {
      type: 'word',
      value: 'يُصدّق.',
      display: 'يُصدّق.',
      explanationAr: 'كلمة الختام والسيادة: لا تصدق كل ما يقوله عقلك القلق، بل صدق ما يبنيك.'
    },
    puzzleType: 'pattern_matrix',
    difficulty: 'challenging',
    xpReward: 500,
    hints: [
      'تأمل مسار الرحلة النفسية الكاملة: من الجسد المتوتر -> إلى تنظيم المشاعر -> إلى حماية الحدود -> إلى التعلم من الخطأ.',
      'ما هي المحطة الخامسة الكبرى التي تتوج كل هذا البناء؟',
      'اختر "الوعي الحر والسيادة الداخلية 👑" لإتمام اللعبة الختامية وكشف المقولة الكبرى.'
    ],
    insightNote: 'مبارك عليك! لقد أكملت 30 مرحلة من التدريب الذهني والنفسي، وجمعت 5 مقولات خالدة تدعم حياتك.',
    puzzleData: {
      instructionsAr: 'اختر التتويج النهائي الذي يكمل مسار البصيرة الكبرى للعبة شفرة نسمة.',
      patternSequence: [
        { id: 'all1', label: 'الرفق بالنفس', icon: '🌱', explanation: 'خطوة صغيرة كفاية والرحمة بالذات.' },
        { id: 'all2', label: 'إشارات المشاعر', icon: '🧭', explanation: 'فهم دلالات المشاعر دون الانقياد لها.' },
        { id: 'all3', label: 'سياج الحدود', icon: '🛡️', explanation: 'حماية المساحة للحب والصدق.' },
        { id: 'all4', label: 'مسودة الخطأ', icon: '📝', explanation: 'التعلم والتطور المستمر دون خجل.' },
        { id: 'all5', label: '؟', icon: '❓', explanation: 'التاج النهائي للرحلة.' }
      ],
      missingIndex: 4,
      options: [
        { id: 'opt_mastery', label: 'الوعي الحر والمراقب الصامت', icon: '👑', explanation: 'أنا لست أفكاري؛ أنا المراقب الهادئ الذي يختار ما يصدق.', isCorrect: true },
        { id: 'opt_control_all', label: 'التحكم المطلق في كل البشر', icon: '⚡', explanation: 'وهم السيطرة المستحيلة.', isCorrect: false },
        { id: 'opt_forget', label: 'نسيان كل الدروس السابقة', icon: '🌫️', explanation: 'العودة للتخبط الأول.', isCorrect: false }
      ],
      logicExplanationAr: 'مسار التطور الإنساني: رفق بالنفس، ثم فهم للمشاعر، ثم صون للحدود، ثم تسامح مع الخطأ، ليتوج بالوعي بالذات المراقبة الحرة.'
    }
  }
];

// 4. مقتنيات الحديقة التفاعلية (Garden Collectibles)
export const CIPHER_GARDEN_COLLECTIBLES: GardenCollectible[] = [
  {
    id: 'jasmine_seedling',
    nameAr: 'شتلة الياسمين الندية',
    descAr: 'تنمو عند إتمام أول 3 مراحل من حديقة البدايات. رمز للرفق الداخلي.',
    icon: '🌸',
    requiredLevel: 3,
    category: 'plant'
  },
  {
    id: 'lantern_serenity',
    nameAr: 'فانوس السكينة الذهبي',
    descAr: 'يضيء في الحديقة عند اكتشاف المقولة الأولى كاملة. رمز لنور الخطوة الصغيرة.',
    icon: '🏮',
    requiredLevel: 6,
    category: 'light'
  },
  {
    id: 'water_basin',
    nameAr: 'حوض الماء الرقراق',
    descAr: 'يتدفق ماؤه عند إكمال نصف حديقة البدايات. رمز لتجدد المشاعر وتدفقها.',
    icon: '⛲',
    requiredLevel: 9,
    category: 'fountain'
  },
  {
    id: 'wisdom_feather',
    nameAr: 'ريشة الحكمة الأثرية',
    descAr: 'توضع على مكتب الحديقة عند فتح مكتبة الأسرار واكتشاف مقولة إشارات المشاعر.',
    icon: '🪶',
    requiredLevel: 12,
    category: 'stone'
  },
  {
    id: 'bamboo_fence',
    nameAr: 'سياج الخيزران الأخضر',
    descAr: 'يحمي أطراف الحديقة عند اكتشاف مقولة الحدود الشخصية. رمز للمحبة الصادقة.',
    icon: '🎋',
    requiredLevel: 18,
    category: 'plant'
  },
  {
    id: 'sun_crystal',
    nameAr: 'بلورة البصيرة الكهرمانية',
    descAr: 'تشع في وسط الحديقة عند دخول كهف التفكير وتجاوز مرحلة مسودة الخطأ.',
    icon: '💎',
    requiredLevel: 24,
    category: 'stone'
  },
  {
    id: 'grand_tree',
    nameAr: 'شجرة الحياة والنور الكبرى',
    descAr: 'تتفتح أوراقها الذهبية في سماء الحديقة عند إكمال المستوى 30 وفك شفرة نسمة الكبرى بالكامل.',
    icon: '🌳',
    requiredLevel: 30,
    category: 'plant'
  }
];
