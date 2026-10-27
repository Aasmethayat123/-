export type SectionGuideId =
  | 'map'
  | 'library'
  | 'moving-island'
  | 'nesma-cipher'
  | 'smart-games-hub'
  | 'weekly-session'
  | 'discover'
  | 'my-journey'
  | 'profile'
  | 'workshop'
  | 'projects'
  | 'admin-cms';

export interface SectionGuideInfo {
  id: SectionGuideId;
  icon: string;
  sectionNameAr: string;
  sectionNameEn: string;
  ideaAr: string;
  ideaEn: string;
  benefitAr: string;
  benefitEn: string;
  howToStartAr: string;
  howToStartEn: string;
  ethicalNoteAr?: string;
  ethicalNoteEn?: string;
}

export const SECTION_GUIDES: Record<SectionGuideId, SectionGuideInfo> = {
  map: {
    id: 'map',
    icon: '🌿',
    sectionNameAr: 'الرئيسية — اختار مغامرتك اليوم',
    sectionNameEn: 'Home — Choose Your Adventure Today',
    ideaAr:
      'البوابة الرئيسية التي تساعدك على اختيار نشاط يناسب حالتك الشعورية الحالية دون حيرة أو تشتت.',
    ideaEn:
      'The main gateway that helps you pick a calm activity matching your current emotional state without overwhelm.',
    benefitAr:
      'توفر لك وصولاً سريعاً لتجارب التهدئة، فهم الذات، تفريغ التوتر الحركي، أو استكمال آخر لعبة توقفت عندها.',
    benefitEn:
      'Gives you quick access to calming breathwork, self-reflection, somatic tension release, or resuming your last game.',
    howToStartAr:
      'اختر البوابة التي تعبّر عما تحتاجه الآن (أهدأ، أفهم نفسي، أفرّغ توتري، أو أجرّب شيئاً جديداً)، ثم اضغط على البطاقة لبدء التجربة بهدوء.',
    howToStartEn:
      'Pick the gateway that matches how you feel right now, then tap any activity card to begin at your own pace.',
    ethicalNoteAr:
      'أنشطة التطبيق مصممة للتوعية الذاتية وتنظيم الهدوء اليومي، وليست تشخيصاً طبياً أو بديلاً عن المختص.',
    ethicalNoteEn:
      'Activities are supportive self-awareness and calm tools, not clinical diagnosis or therapy.',
  },
  library: {
    id: 'library',
    icon: '🎮',
    sectionNameAr: 'مكتبة الألعاب الشاملة وخريطة المسارات',
    sectionNameEn: 'Full Games Library & Paths Map',
    ideaAr:
      'فهرس منظم يضم جميع ألعاب ومسارات «نسمة حياة» التفاعلية مقسمة حسب نوع المهارة النفسية أو الحسية.',
    ideaEn:
      'An organized catalog of all interactive Nesma Hayat games and story paths grouped by skill and focus.',
    benefitAr:
      'يسهّل عليك البحث بالاسم أو التصفية حسب الفئة لاكتشاف كل الألعاب الفكرية والحسية والقصصية في مكان واحد.',
    benefitEn:
      'Lets you search by keyword or filter by category to explore cognitive, somatic, puzzle, and story games.',
    howToStartAr:
      'اكتب كلمة في خانة البحث أو اختر تبويب التصنيف الذي يهمك، ثم اضغط على أي بطاقة لفتح اللعبة ومعرفة طريقة لعبها.',
    howToStartEn:
      'Use the search bar or select a category tab, then tap any game card to launch it.',
  },
  'moving-island': {
    id: 'moving-island',
    icon: '🏝️',
    sectionNameAr: 'جزيرة الأسرار المتحركة',
    sectionNameEn: 'Moving Secrets Island',
    ideaAr:
      'مغامرة استكشافية مترابطة تجمع ٦ ألعاب أساسية في خريطة حية تتغير تضاريسها وتنفتح جسورها كلما أنجزت مراحلها.',
    ideaEn:
      'An interconnected world map linking 6 core games where completing stages repairs bridges, clears fog, and unlocks relics.',
    benefitAr:
      'تحوّل التقدم المتفرق في الألعاب إلى رحلة متكاملة تكافئك بمقتنيات وأدلة تقودك إلى فتح معبد البصيرة الختامي.',
    benefitEn:
      'Turns your progress across games into a cohesive quest with collectibles, clues, and a culminating grand puzzle.',
    howToStartAr:
      'اتبع شريط الإرشاد العلوي وابدأ من «وادي الشفرات»، ثم اضغط «انطلق للمهمة» أو تفقد أي منطقة مقفلة لمعرفة شرط فتحها.',
    howToStartEn:
      'Follow the top guidance banner starting at Cipher Valley, tap Launch Mission, or tap any locked region to view its unlock condition.',
  },
  'nesma-cipher': {
    id: 'nesma-cipher',
    icon: '🗝️',
    sectionNameAr: 'مغامرة شفرة نسمة (٦٠ مرحلة)',
    sectionNameEn: 'Nesma Cipher Adventure (60 Levels)',
    ideaAr:
      'رحلة ألغاز بصرية ومنطقية ولغوية من ٦ عوالم متدرجة تكشف مع كل مرحلة كلمة أو رمزاً يكمل مقولات ملهمة.',
    ideaEn:
      'A 6-world visual, logic, and word puzzle journey where each solved stage reveals tokens that complete inspiring quotes.',
    benefitAr:
      'تنشّط التركيز الهادئ والتفكير المرن، وتبني تدريجياً «دفتر المقولات» و«حديقة الشفرة» الخاصة بك.',
    benefitEn:
      'Sharpens calm focus and flexible thinking while unlocking entries in your Quotes Vault and Cipher Garden.',
    howToStartAr:
      'اختر العالم المفتوح من الخريطة، حدد مستوى الصعوبة (سهل، متوسط، أو صعب)، ثم اضغط على المرحلة المتاحة لبدء حل اللغز.',
    howToStartEn:
      'Choose an unlocked world on the map, pick your preferred difficulty, and tap an available stage number to play.',
  },
  'smart-games-hub': {
    id: 'smart-games-hub',
    icon: '✨',
    sectionNameAr: 'مركز التحديات المتجددة والمهام الأسبوعية',
    sectionNameEn: 'Daily Challenges & Weekly Quests Hub',
    ideaAr:
      'مساحة متجددة تقترح عليك تحدياً يومياً مختاراً وثلاث مهام أسبوعية مرتبطة بمراحل الألعاب الذهنية.',
    ideaEn:
      'A rotating hub offering a daily featured stage challenge and weekly mastery quests across puzzle games.',
    benefitAr:
      'تساعدك على بناء عادة يومية خفيفة ومستمرة دون ملل، مع نقاط خبرة إضافية عند إتمام المهام.',
    benefitEn:
      'Helps build a gentle, consistent daily habit with bonus XP rewards when quests are completed.',
    howToStartAr:
      'ابدأ ببطاقة «تحدي اليوم» في أعلى الصفحة، أو راجع شريط تقدم المهام الأسبوعية واضغط استلام المكافأة عند اكتمالها.',
    howToStartEn:
      'Start with Today’s Challenge card at the top, or check your Weekly Quests progress and claim completed rewards.',
  },
  'weekly-session': {
    id: 'weekly-session',
    icon: '🛋️',
    sectionNameAr: 'الجلسة النفسية الأسبوعية الهادئة',
    sectionNameEn: 'Weekly Mindful Reflection Session',
    ideaAr:
      'مساحة تأمل ذاتي مقسمة إلى ٥ خطوات هادئة لرصد المزاج وإشارات الجسد وتفريغ الأفكار ووضع نية بسيطة للأسبوع.',
    ideaEn:
      'A structured 5-step self-reflection check-in to notice mood, body tension, heavy thoughts, and a gentle weekly intention.',
    benefitAr:
      'تمنحك وقفة أسبوعية منظمة لترتيب ما يدور بداخلك بهدوء وحفظ ملخصك محلياً على جهازك بخصوصية تامة.',
    benefitEn:
      'Provides a calm weekly pause to unpack mental clutter and optionally save a private summary on your device.',
    howToStartAr:
      'ابدأ بالخطوة الأولى لتحديد مستوى طاقتك ومشاعرك الحالية، ثم انتقل بالتدريج عبر الخطوات بالسرعة التي تريحك.',
    howToStartEn:
      'Begin at Step 1 by selecting your current mood and body signals, then move step-by-step at your own pace.',
    ethicalNoteAr:
      'هذه الجلسة أداة مساندة للتأمل الذاتي والتثقيف النفسي، وليست جلسة علاج سريري أو بديلاً عن المختصين.',
    ethicalNoteEn:
      'This session is a supportive self-reflection guide, not clinical psychotherapy or medical advice.',
  },
  discover: {
    id: 'discover',
    icon: '💡',
    sectionNameAr: 'إضاءات ومقالات نسمة حياة',
    sectionNameEn: 'Nesma Hayat Readings & Insights',
    ideaAr:
      'مكتبة مقالات نفسية مبسطة وقصيرة تشرح المفاهيم اليومية وتربط كل فكرة مباشرة بلعبة تفاعلية لتجربتها عملياً.',
    ideaEn:
      'Concise, accessible articles explaining everyday emotional patterns, each paired directly with an interactive game.',
    benefitAr:
      'تحوّل القراءة من معلومات نظرية إلى ممارسة ملموسة تساعدك على استيعاب الفكرة وتطبيقها في يومك.',
    benefitEn:
      'Bridges gentle reading with hands-on practice so insights stick naturally in daily life.',
    howToStartAr:
      'اختر المقال الأقرب لما يشغل بالك حالياً، اقرأه في دقيقتين، ثم اضغط زر اللعبة المرتبطة أسفل البطاقة لتجربة الفكرة.',
    howToStartEn:
      'Pick an article that resonates with your day, read its 2-minute summary, then tap the linked game button below it.',
  },
  'my-journey': {
    id: 'my-journey',
    icon: '📖',
    sectionNameAr: 'دفتر رحلتي واللحظات المحفوظة',
    sectionNameEn: 'My Journey Notebook & Saved Moments',
    ideaAr:
      'سجلك الشخصي الآمن الذي يجمع كل التأملات والاقتباسات واللحظات التي اخترت حفظها أثناء خوض الألعاب.',
    ideaEn:
      'Your private personal log collecting all reflections, quotes, and moments you chose to save across games.',
    benefitAr:
      'يتيح لك الرجوع إلى ما اكتشفته عن نفسك بمرور الوقت، مع إمكانية طباعة الدفتر أو حذف أي ملاحظة متى شئت.',
    benefitEn:
      'Lets you revisit personal insights over time, print your reflection log, or remove any entry whenever you wish.',
    howToStartAr:
      'تصفح بطاقات تأملاتك المحفوظة بالترتيب الزمني، وإذا كان الدفتر فارغاً أكمل أي لعبة واضغط «احفظ اللحظة في رحلتي».',
    howToStartEn:
      'Browse your saved reflection cards chronologically, or complete any game and tap Save Moment to add your first entry.',
  },
  profile: {
    id: 'profile',
    icon: '🏅',
    sectionNameAr: 'ملف الوعي وأوسمة الإنجاز',
    sectionNameEn: 'Awareness Profile & Completion Badges',
    ideaAr:
      'لوحة متابعة تعرض شخصيتك الرمزية، رتبة الوعي الحالية، نقاط الخبرة، والأوسمة التي فتحتها بإكمال الألعاب.',
    ideaEn:
      'Your personal milestone view displaying your avatar, awareness rank, XP progress, and earned completion badges.',
    benefitAr:
      'تحتفي بخطواتك الصغيرة وتوضّح لك عدد الألعاب المتبقية للوصول إلى الوسام التالي دون ضغط أو مقارنة بالآخرين.',
    benefitEn:
      'Celebrates your small steps and clearly shows how many completed games unlock your next milestone badge.',
    howToStartAr:
      'راجع شريط تقدمك نحو الوسام القادم، ويمكنك تغيير شخصيتك الرمزية أو الانطلاق إلى لعبة جديدة من الأزرار السفلية.',
    howToStartEn:
      'Check your progress bar toward the next badge, customize your avatar, or jump into a new game below.',
  },
  workshop: {
    id: 'workshop',
    icon: '👥',
    sectionNameAr: 'دليل ورش العمل والجلسات الجماعية',
    sectionNameEn: 'Interactive Workshops & Group Guide',
    ideaAr:
      'دليل تيسير متكامل يضم ٦ ورش تثقيف نفسي جماعية مع مؤقت زمني وأسئلة حوارية واستمارات ملاحظات قابلة للطباعة.',
    ideaEn:
      'A facilitation guide featuring 6 group psycho-educational workshops with a built-in timer, discussion prompts, and printable notes.',
    benefitAr:
      'يساعد الميسّرين والمعلمين والأسر على تحويل ألعاب التطبيق إلى حوار جماعي آمن ومحترم.',
    benefitEn:
      'Helps facilitators, educators, and families turn interactive games into structured, respectful group conversations.',
    howToStartAr:
      'اختر عنوان الورشة من الشريط العلوي، شغّل المؤقت الزمني للنشاط، ودوّن أفكار المجموعة في الخانات المخصصة أو اطبعها كملف PDF.',
    howToStartEn:
      'Select one of the 6 workshops, start the facilitator timer, and record group reflections or print the worksheet.',
    ethicalNoteAr:
      'ورش تثقيفية وتوعوية اختيارية بالكامل؛ يحق لأي مشارك تخطي أي سؤال لا يرتاح لمشاركته.',
    ethicalNoteEn:
      'Voluntary psycho-educational workshops; any participant may skip any prompt at any time.',
  },
  projects: {
    id: 'projects',
    icon: '📂',
    sectionNameAr: 'المشروعات والمبادرات المعتمدة',
    sectionNameEn: 'Verified Projects & Initiatives',
    ideaAr:
      'معرض تعريفي يقدّم المشروعات والتطبيقات والمبادرات الحقيقية المعتمدة ضمن مظلة العمل دون مبالغات أو أرقام افتراضية.',
    ideaEn:
      'An authentic showcase presenting verified projects, initiatives, and applications with transparent details.',
    benefitAr:
      'يتيح لك التعرف على هدف كل مشروع ومزاياه الفعلية وحالته الحالية (نشط، قيد التطوير، أو قادم).',
    benefitEn:
      'Lets you explore each project’s real purpose, key features, and current status clearly.',
    howToStartAr:
      'استخدم أزرار التصفية حسب الفئة لاستعراض البطاقات، واضغط على الرابط المرفق إن وجد لزيارة المشروع مباشرة.',
    howToStartEn:
      'Filter projects by category to read their details, and open any published link directly.',
  },
  'admin-cms': {
    id: 'admin-cms',
    icon: '⚙️',
    sectionNameAr: 'لوحة إدارة المحتوى والمشروعات',
    sectionNameEn: 'Projects & Content Management (CMS)',
    ideaAr:
      'لوحة تحكم محلية لإضافة المشروعات الحقيقية أو تعديل بياناتها أو التحكم في حالة نشرها وتنزيل حزمة النشر.',
    ideaEn:
      'A local management panel to add, edit, publish, or reset verified project entries and export build packages.',
    benefitAr:
      'تحافظ على دقة البيانات المعروضة في قسم المشروعات وتتيح التحديث الفوري مع حفظ التعديلات محلياً.',
    benefitEn:
      'Keeps showcased project information accurate and up to date with instant local persistence.',
    howToStartAr:
      'اضغط «إضافة مشروع حقيقي» لإدخال مشروع جديد، أو اضغط أيقونة التعديل بجانب أي مشروع حالي لتحديث بياناته.',
    howToStartEn:
      'Tap Add Project to create a new entry, or tap the edit icon on an existing card to update its details.',
  },
};
