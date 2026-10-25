import { GameMode } from '../types';

export type IslandRegionId =
  | 'cipher-valley'
  | 'balance-bridge'
  | 'vials-garden'
  | 'order-library'
  | 'choice-gate'
  | 'secrets-mountain'
  | 'hidden-observatory'
  | 'treasure-vault'
  | 'finale-sanctuary';

export type IslandCollectibleType =
  | 'cipher_shard'
  | 'balance_crystal'
  | 'garden_seed'
  | 'library_key'
  | 'choice_stone'
  | 'mountain_fragment';

export type IslandCoreGameId =
  | 'nesma-cipher'
  | 'zen-puzzle'
  | 'emotion-sort-puzzle'
  | 'mindful-organizer'
  | 'hands-control'
  | 'break-mountain';

export type IslandPuzzleMechanicType =
  | 'symbol_lock'
  | 'bridge_counterweight'
  | 'elixir_synthesis'
  | 'archive_codex'
  | 'gate_scales'
  | 'star_triangulation';

export interface CollectibleMeta {
  type: IslandCollectibleType;
  nameAr: string;
  nameEn: string;
  singularAr: string;
  icon: string;
  totalCount: number;
  sourceRegionId: IslandRegionId;
  sourceGameId: IslandCoreGameId;
  purposeAr: string;
  unlocksSummaryAr: string;
  accentClass: string;
  badgeClass: string;
}

export interface IslandClue {
  id: string;
  titleAr: string;
  sourceRegionId: IslandRegionId;
  sourceChallengeId: string;
  codeDisplay: string;
  summaryAr: string;
  finaleStepHintAr: string;
}

export interface IslandRelic {
  id: string;
  nameAr: string;
  subtitleAr: string;
  descriptionAr: string;
  sourceAr: string;
  xpBonus: number;
}

export interface IslandRegionDef {
  id: IslandRegionId;
  order: number;
  nameAr: string;
  subtitleAr: string;
  descriptionAr: string;
  linkedGameId?: IslandCoreGameId;
  linkedGameNameAr?: string;
  collectibleType?: IslandCollectibleType;
  isSecretRegion?: boolean;
  isFinaleRegion?: boolean;
  unlockRequirementSummaryAr: string;
  worldEffectSummaryAr: string;
  // Map SVG coordinates (viewBox 0 0 1000 620)
  mapX: number;
  mapY: number;
  themeGradient: string;
  accentHex: string;
}

export type ChallengeVerificationRule =
  | {
      kind: 'game_stage';
      gameId: IslandCoreGameId;
      minCompletedStages?: number;
      specificStage?: number;
      minStarsOnStage?: number;
      maxHintsOnAnyLevel?: number;
      maxMovesOnStage?: number;
    }
  | {
      kind: 'island_puzzle';
      puzzleType: IslandPuzzleMechanicType;
      requiredCollectibles?: Partial<Record<IslandCollectibleType, number>>;
      requiredClueIds?: string[];
    };

export interface IslandChallengeDef {
  id: string;
  number: number;
  regionId: IslandRegionId;
  titleAr: string;
  descriptionAr: string;
  howToCompleteAr: string;
  verification: ChallengeVerificationRule;
  targetStageOrLevel?: number;
  rewardCollectible?: IslandCollectibleType;
  rewardClueId?: string;
  rewardRelicId?: string;
  rewardXP: number;
  worldImpactAr: string;
}

export interface RotatingIslandQuestDef {
  id: string;
  titleAr: string;
  descriptionAr: string;
  rewardXP: number;
  category:
    | 'discover_clue'
    | 'cipher_low_hints'
    | 'two_games_combo'
    | 'unlock_secret_path'
    | 'complete_collectible_set';
  targetCount: number;
}

export const COLLECTIBLES_CATALOG: Record<IslandCollectibleType, CollectibleMeta> = {
  cipher_shard: {
    type: 'cipher_shard',
    nameAr: 'شظايا الشفرة',
    nameEn: 'Cipher Shards',
    singularAr: 'شظية شفرة',
    icon: '🗝️',
    totalCount: 4,
    sourceRegionId: 'cipher-valley',
    sourceGameId: 'nesma-cipher',
    purposeAr: 'تُلتقط من فك ألغاز «شفرة نسمة» والمسلة الصوتية في وادي الشفرات.',
    unlocksSummaryAr: 'تفتح جسر التوازن، وتُسهم في إصلاح الجسر المنهار، وكشف مرصد الضباب، وفتح غرفة الكنوز.',
    accentClass: 'text-amber-700 dark:text-amber-300',
    badgeClass: 'bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800',
  },
  balance_crystal: {
    type: 'balance_crystal',
    nameAr: 'بلورات التوازن',
    nameEn: 'Balance Crystals',
    singularAr: 'بلورة توازن',
    icon: '💎',
    totalCount: 4,
    sourceRegionId: 'balance-bridge',
    sourceGameId: 'zen-puzzle',
    purposeAr: 'تتبلور عند إقامة الأبراج المستقرة في «أحجار التوازن» ومعايرة أوزان الجسر.',
    unlocksSummaryAr: 'تُعيد بناء جسر التوازن المنهار، وتفتح البوابة المزدوجة لمكتبة النظام، وتثبّت منشور النهاية.',
    accentClass: 'text-teal-700 dark:text-teal-300',
    badgeClass: 'bg-teal-100/90 dark:bg-teal-950/70 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-800',
  },
  garden_seed: {
    type: 'garden_seed',
    nameAr: 'بذور الحديقة',
    nameEn: 'Garden Seeds',
    singularAr: 'بذرة حديقة',
    icon: '🌱',
    totalCount: 4,
    sourceRegionId: 'vials-garden',
    sourceGameId: 'emotion-sort-puzzle',
    purposeAr: 'تنمو مع كل فرز نقي للمشاعر في «فرز قوارير المشاعر» ومزج ندى البصيرة.',
    unlocksSummaryAr: 'تبدّد الضباب عن المرصد الخفي، وتفتح غرفة الكنوز، وتغذي بوابة الاختيار.',
    accentClass: 'text-emerald-700 dark:text-emerald-300',
    badgeClass: 'bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800',
  },
  library_key: {
    type: 'library_key',
    nameAr: 'مفاتيح المكتبة',
    nameEn: 'Library Keys',
    singularAr: 'مفتاح مكتبة',
    icon: '🔑',
    totalCount: 4,
    sourceRegionId: 'order-library',
    sourceGameId: 'mindful-organizer',
    purposeAr: 'تُستعاد عند تحقيق التناغم على رفوف «ترتيب الفوضى والرفوف» وفهرسة المخطوطات.',
    unlocksSummaryAr: 'تفتح أقفال غرفة الكنوز المفقودة، وتمهّد فتح بوابة الاختيار واللغز الختامي.',
    accentClass: 'text-sky-700 dark:text-sky-300',
    badgeClass: 'bg-sky-100/90 dark:bg-sky-950/70 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-800',
  },
  choice_stone: {
    type: 'choice_stone',
    nameAr: 'أحجار الاختيار',
    nameEn: 'Choice Stones',
    singularAr: 'حجر اختيار',
    icon: '🧭',
    totalCount: 4,
    sourceRegionId: 'choice-gate',
    sourceGameId: 'hands-control',
    purposeAr: 'تُصقل عند التمييز الواعي بين ما في يدك وما خارجها في «في إيدي / برّا إيدي».',
    unlocksSummaryAr: 'تفتح مصراعي جبل الأسرار وتمدّ المرحلة الرابعة من اللغز الختامي بنبض الإرادة.',
    accentClass: 'text-indigo-700 dark:text-indigo-300',
    badgeClass: 'bg-indigo-100/90 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800',
  },
  mountain_fragment: {
    type: 'mountain_fragment',
    nameAr: 'قطع الجبل',
    nameEn: 'Mountain Fragments',
    singularAr: 'قطعة جبل',
    icon: '⛰️',
    totalCount: 4,
    sourceRegionId: 'secrets-mountain',
    sourceGameId: 'break-mountain',
    purposeAr: 'تُستخلص من تفتيت صخور العبء في «كسّري الجبل» ومحاذاة مرصد النجوم.',
    unlocksSummaryAr: 'تكسر الختم الصخري حول قمة معبد البصيرة وتُفعّل اللغز الختامي الكبير.',
    accentClass: 'text-rose-700 dark:text-rose-300',
    badgeClass: 'bg-rose-100/90 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800',
  },
};

export const ISLAND_CLUES: Record<string, IslandClue> = {
  clue_cipher_code: {
    id: 'clue_cipher_code',
    titleAr: 'نبض البوصلة الرباعي',
    sourceRegionId: 'cipher-valley',
    sourceChallengeId: 'ch_cipher_2',
    codeDisplay: '٤ — ١ — ٣ — ٢',
    summaryAr: 'نقش قديم من وادي الشفرات يحدّد تردد أوتاد المنشور: الرابع، فالأول، فالثالث، فالثاني.',
    finaleStepHintAr: 'في الخطوة الثانية من اللغز الختامي، اضبط الأوتاد الأربعة على التسلسل الرقمي ٤ ثم ١ ثم ٣ ثم ٢.',
  },
  clue_balance_ratio: {
    id: 'clue_balance_ratio',
    titleAr: 'قانون الارتكاز الثلاثي',
    sourceRegionId: 'balance-bridge',
    sourceChallengeId: 'ch_balance_2',
    codeDisplay: 'قاعدة عريضة ← قلب متزن ← قمة خفيفة',
    summaryAr: 'وثيقة معمارية من جسر التوازن تؤكد أن الثبات يبدأ بتأسيس الوادي ثم التوازن قبل تصفية القوارير.',
    finaleStepHintAr: 'تذكّر في الخطوة الأولى أن التوازن يأتي مباشرة بعد فك إشارة الوادي وقبل دخول حديقة القوارير.',
  },
  clue_vials_spectrum: {
    id: 'clue_vials_spectrum',
    titleAr: 'طيف الصفاء الثلاثي',
    sourceRegionId: 'vials-garden',
    sourceChallengeId: 'ch_vials_2',
    codeDisplay: 'ذهبي البصيرة · أزرق المعرفة · أخضر الجذور',
    summaryAr: 'معادلة لونية من حديقة القوارير تربط كل خلاصة نقية بطبقة الارتفاع المناسبة لها.',
    finaleStepHintAr: 'في الخطوة الثالثة، ضع الخلاصة الذهبية في الرف الأعلى، والزرقاء في الأوسط، والخضراء في الأسفل.',
  },
  clue_library_shelves: {
    id: 'clue_library_shelves',
    titleAr: 'ميثاق الرفوف الثلاثة',
    sourceRegionId: 'order-library',
    sourceChallengeId: 'ch_library_2',
    codeDisplay: 'الأعلى للبصيرة · الأوسط للمعرفة · الأسفل للجذور',
    summaryAr: 'سجل أمين المكتبة الذي يحدد موضع كل جوهر في خزانة الحكمة دون خلط أو فوضى.',
    finaleStepHintAr: 'الرف العلوي يستقبل النور الذهبي، والأوسط يستقبل المعرفة الزرقاء، والسفلي يحتضن الجذور الخضراء.',
  },
  clue_choice_compass: {
    id: 'clue_choice_compass',
    titleAr: 'بوصلة الإرادة والتسليم',
    sourceRegionId: 'choice-gate',
    sourceChallengeId: 'ch_choice_2',
    codeDisplay: 'أمسك خطوتك الآن · وحرّر ما وراء الغيم',
    summaryAr: 'حكمة بوابة الاختيار: القوة الحقيقية تنبع من اختيار الفعل الحاضر وترك نتائج الأمس والغد.',
    finaleStepHintAr: 'في الخطوة الرابعة، اختر فقط الأفعال الواقعة في يدك الآن لتوليد نبضة كسر الصخرة الأخيرة.',
  },
  clue_mountain_core: {
    id: 'clue_mountain_core',
    titleAr: 'سر القمة المتصدعة',
    sourceRegionId: 'secrets-mountain',
    sourceChallengeId: 'ch_mountain_2',
    codeDisplay: 'ستة أختامٍ متتابعة تفتح قلب الصخرة',
    summaryAr: 'نقش محفور في قلب جبل الأسرار يروي ترتيب الرحلة من الوادي حتى القمة دون قفز.',
    finaleStepHintAr: 'ترتيب الأختام الستة يبدأ بوادي الشفرات وينتهي بجبل الأسرار مروراً بالجسر والحديقة والمكتبة والبوابة.',
  },
};

export const ISLAND_RELICS: Record<string, IslandRelic> = {
  mist_navigator_lens: {
    id: 'mist_navigator_lens',
    nameAr: 'عدسة راصد الضباب',
    subtitleAr: 'أثر المرصد الخفي',
    descriptionAr: 'عدسة بلورية تكشف المسارات المستترة خلف ضباب التشتت وتمنح حاملها بصيرة هادئة.',
    sourceAr: 'محاذاة النجوم في مرصد الضباب الخفي',
    xpBonus: 120,
  },
  vault_crown_relic: {
    id: 'vault_crown_relic',
    nameAr: 'ختم أمين الكنوز الستة',
    subtitleAr: 'كنز الخزنة الأثرية',
    descriptionAr: 'وسام ذهبي عتيق يُمنح لمن جمع مفاتيح النظام وبذور الحديقة وشظايا الشفرة في تناغم واحد.',
    sourceAr: 'فتح غرفة الكنوز المفقودة',
    xpBonus: 180,
  },
  island_heart_prism: {
    id: 'island_heart_prism',
    nameAr: 'منشور نسمة المتوهج — قلب الجزيرة',
    subtitleAr: 'المقتنى الأسطوري الختامي',
    descriptionAr: 'جوهرة الجزيرة المتحركة التي تتوحد فيها ألوان الألعاب الست؛ رمز الفهم العميق، والتوازن، والخطوة الحرة.',
    sourceAr: 'حل اللغز الختامي الكبير في معبد البصيرة',
    xpBonus: 500,
  },
};

export const ISLAND_REGIONS: IslandRegionDef[] = [
  {
    id: 'cipher-valley',
    order: 1,
    nameAr: 'وادي الشفرات',
    subtitleAr: 'بوابة الإشارات الأولى',
    descriptionAr: 'وادٍ صخري هادئ تنبعث منه رموز مضيئة؛ هنا تبدأ رحلتك بفك الألغاز واستخراج شظايا الشفرة.',
    linkedGameId: 'nesma-cipher',
    linkedGameNameAr: 'شفرة نسمة',
    collectibleType: 'cipher_shard',
    unlockRequirementSummaryAr: 'مفتوحة منذ لحظة وصولك إلى الجزيرة.',
    worldEffectSummaryAr: 'شظاياها تفتح ضفة الجسر، وحلها بلا تلميحات يكشف المسار المختصر المتوهج عبر البحيرة.',
    mapX: 165,
    mapY: 470,
    themeGradient: 'from-amber-700 to-emerald-800',
    accentHex: '#d97706',
  },
  {
    id: 'balance-bridge',
    order: 2,
    nameAr: 'جسر التوازن',
    subtitleAr: 'الممر المعلّق فوق المضيق',
    descriptionAr: 'جسر حجري قديم تصدّعت ركائزه؛ يحتاج إلى بلورات التوازن ومعايرة الأوزان ليعود معبراً آمناً.',
    linkedGameId: 'zen-puzzle',
    linkedGameNameAr: 'أحجار التوازن وميزان القرارات',
    collectibleType: 'balance_crystal',
    unlockRequirementSummaryAr: 'اجمع شظية شفرة واحدة على الأقل من وادي الشفرات.',
    worldEffectSummaryAr: 'إكمال معايرة الجسر يُصلح الجسر المنهار فعلياً على الخريطة ويفتح العبور نحو وسط الجزيرة.',
    mapX: 350,
    mapY: 390,
    themeGradient: 'from-teal-700 to-stone-800',
    accentHex: '#0d9488',
  },
  {
    id: 'vials-garden',
    order: 3,
    nameAr: 'حديقة القوارير',
    subtitleAr: 'ينابيع الصفاء اللوني',
    descriptionAr: 'مدرجات نباتية تسقيها قوارير المشاعر المصفّاة؛ كل لون نقي ينبت بذرة تفتح آفاق الجزيرة.',
    linkedGameId: 'emotion-sort-puzzle',
    linkedGameNameAr: 'فرز قوارير المشاعر',
    collectibleType: 'garden_seed',
    unlockRequirementSummaryAr: 'أصلح جسر التوازن المنهار، أو افتح المسار المختصر المتوهج من وادي الشفرات.',
    worldEffectSummaryAr: 'بذورها وطيفها يبدّدان الضباب عن المرصد الخفي ويغذيان البوابة المزدوجة لمكتبة النظام.',
    mapX: 330,
    mapY: 205,
    themeGradient: 'from-emerald-600 to-teal-800',
    accentHex: '#059669',
  },
  {
    id: 'order-library',
    order: 4,
    nameAr: 'مكتبة النظام',
    subtitleAr: 'أرشيف الرفوف المتناغمة',
    descriptionAr: 'قاعة خشبية دافئة تحرسها بوابة مزدوجة؛ فيها تُرتّب المخطوطات والمقتنيات لاستعادة مفاتيح المعرفة.',
    linkedGameId: 'mindful-organizer',
    linkedGameNameAr: 'ترتيب الفوضى والرفوف',
    collectibleType: 'library_key',
    unlockRequirementSummaryAr: 'بوابة مزدوجة: أكمل مرحلة في «أحجار التوازن» ومرحلة في «فرز قوارير المشاعر».',
    worldEffectSummaryAr: 'مفاتيحها تفتح غرفة الكنوز المفقودة وتكشف ميثاق الرفوف اللازم للغز الختامي.',
    mapX: 555,
    mapY: 315,
    themeGradient: 'from-sky-700 to-slate-800',
    accentHex: '#0284c7',
  },
  {
    id: 'choice-gate',
    order: 5,
    nameAr: 'بوابة الاختيار',
    subtitleAr: 'مفترق الإرادة والتسليم',
    descriptionAr: 'بوابة حجرية ذات كفتين عظيمتين؛ لا تنفتح إلا لمن يفرز بصدق ما في يده عما يثقل كاهله.',
    linkedGameId: 'hands-control',
    linkedGameNameAr: 'في إيدي / برّا إيدي',
    collectibleType: 'choice_stone',
    unlockRequirementSummaryAr: 'احصل على مفتاح مكتبة واحد وبذرة حديقة واحدة على الأقل.',
    worldEffectSummaryAr: 'أحجار الاختيار وميزان البوابتين يفتحان الدرب الصاعد إلى جبل الأسرار.',
    mapX: 735,
    mapY: 395,
    themeGradient: 'from-indigo-700 to-stone-800',
    accentHex: '#4f46e5',
  },
  {
    id: 'secrets-mountain',
    order: 6,
    nameAr: 'جبل الأسرار',
    subtitleAr: 'منحدر الصخور المتراكمة',
    descriptionAr: 'قمة شامخة تحجبها صخور الضغوط المتراكمة؛ تفتيتها خطوة بخطوة يكشف المدخل نحو المعبد الأسمى.',
    linkedGameId: 'break-mountain',
    linkedGameNameAr: 'كسّري الجبل',
    collectibleType: 'mountain_fragment',
    unlockRequirementSummaryAr: 'افتح بوابة الاختيار واجمع حجر اختيار واحداً على الأقل.',
    worldEffectSummaryAr: 'قطع الجبل تفعّل ختم القمة وتفتح الطريق أمام اللغز الختامي الكبير.',
    mapX: 825,
    mapY: 220,
    themeGradient: 'from-rose-700 to-amber-900',
    accentHex: '#e11d48',
  },
  {
    id: 'hidden-observatory',
    order: 7,
    nameAr: 'مرصد الضباب الخفي',
    subtitleAr: 'منطقة سرية وراء الغيم',
    descriptionAr: 'مرصد فلكي قديم كان محتجباً خلف ضباب البحيرة؛ تتلاقى فيه عدسات الشفرة وطيف الحديقة.',
    isSecretRegion: true,
    unlockRequirementSummaryAr: 'منطقة سرية: اكتشف دليل «نبض البوصلة الرباعي» ودليل «طيف الصفاء الثلاثي» لتبديد الضباب.',
    worldEffectSummaryAr: 'يمنح عدسة راصد الضباب وقطعة الجبل الرابعة النادرة.',
    mapX: 165,
    mapY: 145,
    themeGradient: 'from-teal-800 to-indigo-950',
    accentHex: '#14b8a6',
  },
  {
    id: 'treasure-vault',
    order: 8,
    nameAr: 'غرفة الكنوز المفقودة',
    subtitleAr: 'الخزنة الأثرية للجزيرة',
    descriptionAr: 'غرفة منحوتة في قلب الصخر تضم نفائس الجزيرة وسجلاتها النادرة؛ تُفتح بتكامل مقتنياتك.',
    isSecretRegion: true,
    unlockRequirementSummaryAr: 'اجمع شظيتي شفرة (٢) + بذرتي حديقة (٢) + مفتاحي مكتبة (٢) لفتح الأقفال الثلاثة.',
    worldEffectSummaryAr: 'تمنح ختم أمين الكنوز الستة (+١٨٠ XP) وتكشف تلميحاً ذهبياً شاملاً للغز الختامي.',
    mapX: 545,
    mapY: 495,
    themeGradient: 'from-amber-600 to-yellow-900',
    accentHex: '#f59e0b',
  },
  {
    id: 'finale-sanctuary',
    order: 9,
    nameAr: 'معبد البصيرة الأسمى',
    subtitleAr: 'قمة الجزيرة واللغز الختامي',
    descriptionAr: 'قلب الجزيرة المتحركة؛ هنا تجتمع خلاصة رحلتك عبر الألعاب الست في لغز ختامي متعدد المراحل.',
    isFinaleRegion: true,
    unlockRequirementSummaryAr: 'أكمل تحدياً في كل لعبة من الألعاب الست، واجمع ٦ أنواع من المقتنيات و٤ أدلة لبدء اللغز الختامي.',
    worldEffectSummaryAr: 'حل اللغز الختامي يضيء الجزيرة بالكامل ويمنحك «منشور نسمة المتوهج» ومشهد التتويج الشخصي.',
    mapX: 605,
    mapY: 115,
    themeGradient: 'from-emerald-700 via-amber-600 to-teal-900',
    accentHex: '#10b981',
  },
];

export const ISLAND_CHALLENGES: IslandChallengeDef[] = [
  // ==================== 1. وادي الشفرات (Cipher Valley) ====================
  {
    id: 'ch_cipher_1',
    number: 1,
    regionId: 'cipher-valley',
    titleAr: 'إشارة الوادي الأولى',
    descriptionAr: 'فك أولى شفرات الوادي في لعبة «شفرة نسمة» لالتقاط الرنين الكاشف لضفة المضيق.',
    howToCompleteAr: 'أكمل المرحلة ١ على الأقل في لعبة «شفرة نسمة».',
    verification: {
      kind: 'game_stage',
      gameId: 'nesma-cipher',
      minCompletedStages: 1,
    },
    targetStageOrLevel: 1,
    rewardCollectible: 'cipher_shard',
    rewardXP: 50,
    worldImpactAr: 'يفتح الطريق نحو منطقة «جسر التوازن».',
  },
  {
    id: 'ch_cipher_2',
    number: 2,
    regionId: 'cipher-valley',
    titleAr: 'صفاء البصيرة بلا اتكاء',
    descriptionAr: 'برهن على صفاء ملاحظتك بحل ٣ مراحل في «شفرة نسمة» مع إنهاء مرحلة واحدة على الأقل بـ ٣ نجوم كاملة (دون تلميحات).',
    howToCompleteAr: 'أنهِ ٣ مراحل في «شفرة نسمة» واحصل على ٣ نجوم (صفر تلميحات) في إحدى المراحل.',
    verification: {
      kind: 'game_stage',
      gameId: 'nesma-cipher',
      minCompletedStages: 3,
      maxHintsOnAnyLevel: 0,
    },
    targetStageOrLevel: 2,
    rewardCollectible: 'cipher_shard',
    rewardClueId: 'clue_cipher_code',
    rewardXP: 85,
    worldImpactAr: 'يكشف دليل «نبض البوصلة الرباعي» ويفتح «المسار المختصر المتوهج» عبر البحيرة مباشرة إلى حديقة القوارير!',
  },
  {
    id: 'ch_cipher_3',
    number: 3,
    regionId: 'cipher-valley',
    titleAr: 'مستكشف النقوش الخمسة',
    descriptionAr: 'تعمّق في سرداب الوادي وأكمل ٥ مراحل في «شفرة نسمة» لاستخراج الشظية الثالثة.',
    howToCompleteAr: 'أكمل ٥ مراحل على الأقل في «شفرة نسمة».',
    verification: {
      kind: 'game_stage',
      gameId: 'nesma-cipher',
      minCompletedStages: 5,
    },
    targetStageOrLevel: 5,
    rewardCollectible: 'cipher_shard',
    rewardXP: 100,
    worldImpactAr: 'يزيد رصيد شظايا الشفرة لفتح غرفة الكنوز المفقودة.',
  },
  {
    id: 'ch_cipher_4',
    number: 4,
    regionId: 'cipher-valley',
    titleAr: 'آلية المسلة الصوتية',
    descriptionAr: 'لغز تفاعلي على أرض الوادي: اضبط تروس المسلة الأربعة وفق نبض الوادي لفك قفل الضفة الشرقية.',
    howToCompleteAr: 'افتح نافذة اللغز التفاعلي واضبط التروس الأربعة على الرموز المتناغمة.',
    verification: {
      kind: 'island_puzzle',
      puzzleType: 'symbol_lock',
      requiredCollectibles: { cipher_shard: 1 },
    },
    rewardCollectible: 'cipher_shard',
    rewardXP: 90,
    worldImpactAr: 'يحرّر ركيزة الربط الأولى لجسر التوازن.',
  },

  // ==================== 2. جسر التوازن (Balance Bridge) ====================
  {
    id: 'ch_balance_1',
    number: 5,
    regionId: 'balance-bridge',
    titleAr: 'وتد القاعدة الراسخة',
    descriptionAr: 'أقم أول برج متوازن في لعبة «أحجار التوازن وميزان القرارات» واجتز اختبار الثبات.',
    howToCompleteAr: 'أكمل المرحلة ١ في «أحجار التوازن وميزان القرارات».',
    verification: {
      kind: 'game_stage',
      gameId: 'zen-puzzle',
      specificStage: 1,
    },
    targetStageOrLevel: 1,
    rewardCollectible: 'balance_crystal',
    rewardXP: 60,
    worldImpactAr: 'يمنح البلورة الأولى ويفعّل الشق الأول من البوابة المزدوجة لمكتبة النظام.',
  },
  {
    id: 'ch_balance_2',
    number: 6,
    regionId: 'balance-bridge',
    titleAr: 'ميزان الدقة الهندسية',
    descriptionAr: 'أكمل المرحلة ٢ في «أحجار التوازن» بتقدير ٣ نجوم لإثبات دقة مركز الثقل.',
    howToCompleteAr: 'حقق ٣ نجوم في المرحلة ٢ من «أحجار التوازن».',
    verification: {
      kind: 'game_stage',
      gameId: 'zen-puzzle',
      specificStage: 2,
      minStarsOnStage: 3,
    },
    targetStageOrLevel: 2,
    rewardCollectible: 'balance_crystal',
    rewardClueId: 'clue_balance_ratio',
    rewardXP: 95,
    worldImpactAr: 'يكشف دليل «قانون الارتكاز الثلاثي» الضروري للغز الختامي.',
  },
  {
    id: 'ch_balance_3',
    number: 7,
    regionId: 'balance-bridge',
    titleAr: 'الصمود أمام رياح المضيق',
    descriptionAr: 'تغلّب على الرياح المتغيرة في المرحلة ٣ من «أحجار التوازن» وحافظ على استقرار البرج.',
    howToCompleteAr: 'أكمل المرحلة ٣ في «أحجار التوازن وميزان القرارات».',
    verification: {
      kind: 'game_stage',
      gameId: 'zen-puzzle',
      specificStage: 3,
    },
    targetStageOrLevel: 3,
    rewardCollectible: 'balance_crystal',
    rewardXP: 110,
    worldImpactAr: 'يثبّت دعائم الجسر ضد عواصف المضيق.',
  },
  {
    id: 'ch_balance_4',
    number: 8,
    regionId: 'balance-bridge',
    titleAr: 'إصلاح الجسر المنهار (تحدي مترابط)',
    descriptionAr: 'استخدم شظية شفرة وبلورة توازن لمعايرة كفتي الجسر المعلّق وإعادة مدّ ألواحه الحجرية.',
    howToCompleteAr: 'يتطلب شظية شفرة (١) + بلورة توازن (١)، ثم موازنة عزوم الكفتين حتى الصفر تماماً.',
    verification: {
      kind: 'island_puzzle',
      puzzleType: 'bridge_counterweight',
      requiredCollectibles: { cipher_shard: 1, balance_crystal: 1 },
    },
    rewardCollectible: 'balance_crystal',
    rewardXP: 120,
    worldImpactAr: 'يُصلح الجسر المنهار فعلياً على خريطة الجزيرة ويفتح العبور الرسمي إلى حديقة القوارير!',
  },

  // ==================== 3. حديقة القوارير (Vials Garden) ====================
  {
    id: 'ch_vials_1',
    number: 9,
    regionId: 'vials-garden',
    titleAr: 'قطرة السكينة الأولى',
    descriptionAr: 'افرز القوارير المختلطة في المرحلة ١ من «فرز قوارير المشاعر» لريّ التربة العطشى.',
    howToCompleteAr: 'أكمل المرحلة ١ في «فرز قوارير المشاعر».',
    verification: {
      kind: 'game_stage',
      gameId: 'emotion-sort-puzzle',
      specificStage: 1,
    },
    targetStageOrLevel: 1,
    rewardCollectible: 'garden_seed',
    rewardXP: 55,
    worldImpactAr: 'يكمل شرط البوابة المزدوجة (مع التوازن) لفتح مكتبة النظام!',
  },
  {
    id: 'ch_vials_2',
    number: 10,
    regionId: 'vials-garden',
    titleAr: 'تقطير الثلاثي المتناغم',
    descriptionAr: 'أتمم المرحلة ٢ في «فرز قوارير المشاعر» بـ ٣ نجوم (بأقل نقلات ممكنة) لاستخلاص طيف الصفاء.',
    howToCompleteAr: 'أكمل المرحلة ٢ في «فرز قوارير المشاعر» بتقدير ٣ نجوم.',
    verification: {
      kind: 'game_stage',
      gameId: 'emotion-sort-puzzle',
      specificStage: 2,
      minStarsOnStage: 3,
    },
    targetStageOrLevel: 2,
    rewardCollectible: 'garden_seed',
    rewardClueId: 'clue_vials_spectrum',
    rewardXP: 90,
    worldImpactAr: 'يكشف دليل «طيف الصفاء الثلاثي» ويفتح (مع دليل الشفرة) مرصد الضباب الخفي!',
  },
  {
    id: 'ch_vials_3',
    number: 11,
    regionId: 'vials-garden',
    titleAr: 'ينبوع المشاعر الأربعة',
    descriptionAr: 'افصل المشاعر الأربعة المتداخلة في المرحلة ٣ من «فرز قوارير المشاعر».',
    howToCompleteAr: 'أكمل المرحلة ٣ أو أعلى في «فرز قوارير المشاعر».',
    verification: {
      kind: 'game_stage',
      gameId: 'emotion-sort-puzzle',
      specificStage: 3,
    },
    targetStageOrLevel: 3,
    rewardCollectible: 'garden_seed',
    rewardXP: 105,
    worldImpactAr: 'يمنح البذرة الثالثة لفتح غرفة الكنوز المفقودة.',
  },
  {
    id: 'ch_vials_4',
    number: 12,
    regionId: 'vials-garden',
    titleAr: 'حوض مزج ندى البصيرة',
    descriptionAr: 'لغز تفاعلي مترابط: اسكب خلاصات الحديقة بالترتيب النقي لإزهار الجسر النباتي.',
    howToCompleteAr: 'استعن ببذرة حديقة واحدة ورتّب طبقات السكب الثلاث في حوض الحديقة.',
    verification: {
      kind: 'island_puzzle',
      puzzleType: 'elixir_synthesis',
      requiredCollectibles: { garden_seed: 1 },
    },
    rewardCollectible: 'garden_seed',
    rewardXP: 95,
    worldImpactAr: 'يكتمل طقم بذور الحديقة (٤/٤) ويزدهر الممر الأخضر نحو بوابة الاختيار.',
  },

  // ==================== 4. مكتبة النظام (Order Library) ====================
  {
    id: 'ch_library_1',
    number: 13,
    regionId: 'order-library',
    titleAr: 'ترتيب الركن الهادئ',
    descriptionAr: 'استعد النظام في المرحلة ١ من «ترتيب الفوضى والرفوف» للعثور على المفتاح البرونزي الأول.',
    howToCompleteAr: 'أكمل المرحلة ١ في «ترتيب الفوضى والرفوف».',
    verification: {
      kind: 'game_stage',
      gameId: 'mindful-organizer',
      specificStage: 1,
    },
    targetStageOrLevel: 1,
    rewardCollectible: 'library_key',
    rewardXP: 60,
    worldImpactAr: 'يسهم مع بذور الحديقة في فتح «بوابة الاختيار».',
  },
  {
    id: 'ch_library_2',
    number: 14,
    regionId: 'order-library',
    titleAr: 'تناغم خزانة الباحث',
    descriptionAr: 'حقق ٣ نجوم في المرحلة ٢ من «ترتيب الفوضى والرفوف» لكشف ميثاق الرفوف الثلاثة.',
    howToCompleteAr: 'أكمل المرحلة ٢ في «ترتيب الفوضى والرفوف» بتقدير ٣ نجوم.',
    verification: {
      kind: 'game_stage',
      gameId: 'mindful-organizer',
      specificStage: 2,
      minStarsOnStage: 3,
    },
    targetStageOrLevel: 2,
    rewardCollectible: 'library_key',
    rewardClueId: 'clue_library_shelves',
    rewardXP: 95,
    worldImpactAr: 'يكشف دليل «ميثاق الرفوف الثلاثة» ويفتح القفل الثالث لغرفة الكنوز المفقودة.',
  },
  {
    id: 'ch_library_3',
    number: 15,
    regionId: 'order-library',
    titleAr: 'صومعة المقتنيات الدقيقة',
    descriptionAr: 'نسّق المقتنيات الاثني عشر في المرحلة ٣ من «ترتيب الفوضى والرفوف».',
    howToCompleteAr: 'أكمل المرحلة ٣ في «ترتيب الفوضى والرفوف».',
    verification: {
      kind: 'game_stage',
      gameId: 'mindful-organizer',
      specificStage: 3,
    },
    targetStageOrLevel: 3,
    rewardCollectible: 'library_key',
    rewardXP: 110,
    worldImpactAr: 'يعزّز خزانة المفاتيح ويقربك من إتمام الفئة كاملة.',
  },
  {
    id: 'ch_library_4',
    number: 16,
    regionId: 'order-library',
    titleAr: 'فهرس المخطوطات المتقاطعة',
    descriptionAr: 'لغز تفاعلي يربط المكتبة بالحديقة والجسر: صنّف ٦ مخطوطات أثرية على الرفوف الثلاثة الصحيحة.',
    howToCompleteAr: 'يتطلب مفتاح مكتبة (١) + بلورة توازن (١) لتوزيع المخطوطات الست بلا خطأ.',
    verification: {
      kind: 'island_puzzle',
      puzzleType: 'archive_codex',
      requiredCollectibles: { library_key: 1, balance_crystal: 1 },
    },
    rewardCollectible: 'library_key',
    rewardXP: 115,
    worldImpactAr: 'يفتح السجل السري لأرشيف الجزيرة ويمنح المفتاح الرابع.',
  },

  // ==================== 5. بوابة الاختيار (Choice Gate) ====================
  {
    id: 'ch_choice_1',
    number: 17,
    regionId: 'choice-gate',
    titleAr: 'فرز الكفّ والغيم',
    descriptionAr: 'ميّز ما تملكه بيدك عما لا تملكه في المرحلة ١ من «في إيدي / برّا إيدي».',
    howToCompleteAr: 'أكمل المرحلة ١ في لعبة «في إيدي / برّا إيدي».',
    verification: {
      kind: 'game_stage',
      gameId: 'hands-control',
      specificStage: 1,
    },
    targetStageOrLevel: 1,
    rewardCollectible: 'choice_stone',
    rewardXP: 60,
    worldImpactAr: 'يفتح البوابة المؤدية إلى سفح «جبل الأسرار»!',
  },
  {
    id: 'ch_choice_2',
    number: 18,
    regionId: 'choice-gate',
    titleAr: 'صفاء القرار بلا تردد',
    descriptionAr: 'أنهِ المرحلة ٢ من «في إيدي / برّا إيدي» بـ ٣ نجوم لاستخلاص بوصلة الإرادة.',
    howToCompleteAr: 'احصل على ٣ نجوم في المرحلة ٢ من «في إيدي / برّا إيدي».',
    verification: {
      kind: 'game_stage',
      gameId: 'hands-control',
      specificStage: 2,
      minStarsOnStage: 3,
    },
    targetStageOrLevel: 2,
    rewardCollectible: 'choice_stone',
    rewardClueId: 'clue_choice_compass',
    rewardXP: 95,
    worldImpactAr: 'يكشف دليل «بوصلة الإرادة والتسليم» الحاسم في الخطوة الرابعة من اللغز الختامي.',
  },
  {
    id: 'ch_choice_3',
    number: 19,
    regionId: 'choice-gate',
    titleAr: 'ثبات البديهة تحت الضغط',
    descriptionAr: 'اجتز المرحلة ٣ الموقوتة في «في إيدي / برّا إيدي» بثقة وهدوء.',
    howToCompleteAr: 'أكمل المرحلة ٣ في لعبة «في إيدي / برّا إيدي».',
    verification: {
      kind: 'game_stage',
      gameId: 'hands-control',
      specificStage: 3,
    },
    targetStageOrLevel: 3,
    rewardCollectible: 'choice_stone',
    rewardXP: 115,
    worldImpactAr: 'يمنح حجر الاختيار الثالث ويزيد جاهزية القمة.',
  },
  {
    id: 'ch_choice_4',
    number: 20,
    regionId: 'choice-gate',
    titleAr: 'ميزان البوابتين (تحدي مترابط)',
    descriptionAr: 'لغز تفاعلي على أعتاب الجبل: افرز ٤ مواقف من رحلة الجزيرة بين كفة الفعل وسحابة التسليم.',
    howToCompleteAr: 'يتطلب حجر اختيار (١) + مفتاح مكتبة (١) لفتح المصراعين الصخريين.',
    verification: {
      kind: 'island_puzzle',
      puzzleType: 'gate_scales',
      requiredCollectibles: { choice_stone: 1, library_key: 1 },
    },
    rewardCollectible: 'choice_stone',
    rewardXP: 110,
    worldImpactAr: 'يكمل أحجار الاختيار الأربعة ويشرع المصراع الشرقي لجبل الأسرار.',
  },

  // ==================== 6. جبل الأسرار والمرصد الخفي ====================
  {
    id: 'ch_mountain_1',
    number: 21,
    regionId: 'secrets-mountain',
    titleAr: 'تفتيت صخرة البداية',
    descriptionAr: 'ابدأ شق طريق القمة بتفتيت الصخور الثلاث في المرحلة ١ من «كسّري الجبل».',
    howToCompleteAr: 'أكمل المرحلة ١ في لعبة «كسّري الجبل».',
    verification: {
      kind: 'game_stage',
      gameId: 'break-mountain',
      specificStage: 1,
    },
    targetStageOrLevel: 1,
    rewardCollectible: 'mountain_fragment',
    rewardXP: 65,
    worldImpactAr: 'يمهّد الدرج الصخري الأول نحو قمة معبد البصيرة!',
  },
  {
    id: 'ch_mountain_2',
    number: 22,
    regionId: 'secrets-mountain',
    titleAr: 'كسر الحاجز الأوسط',
    descriptionAr: 'فتّت الصخور الثماني في المرحلة ٢ من «كسّري الجبل» لكشف النقش المحفور في قلب الجبل.',
    howToCompleteAr: 'أكمل المرحلة ٢ في لعبة «كسّري الجبل».',
    verification: {
      kind: 'game_stage',
      gameId: 'break-mountain',
      specificStage: 2,
    },
    targetStageOrLevel: 2,
    rewardCollectible: 'mountain_fragment',
    rewardClueId: 'clue_mountain_core',
    rewardXP: 100,
    worldImpactAr: 'يكشف دليل «سر القمة المتصدعة» حول ترتيب الأختام الستة.',
  },
  {
    id: 'ch_mountain_3',
    number: 23,
    regionId: 'secrets-mountain',
    titleAr: 'عبور السلسلة الكبرى',
    descriptionAr: 'أتمم تفتيت الصخور الاثنتي عشرة في المرحلة ٣ من «كسّري الجبل» للوصول إلى مشارف القمة.',
    howToCompleteAr: 'أكمل المرحلة ٣ في لعبة «كسّري الجبل».',
    verification: {
      kind: 'game_stage',
      gameId: 'break-mountain',
      specificStage: 3,
    },
    targetStageOrLevel: 3,
    rewardCollectible: 'mountain_fragment',
    rewardXP: 130,
    worldImpactAr: 'يفتح الشرفة العليا المؤدية لمعبد البصيرة الأسمى.',
  },
  {
    id: 'ch_observatory_vault',
    number: 24,
    regionId: 'hidden-observatory',
    titleAr: 'محاذاة عدسات النجم السابع',
    descriptionAr: 'تحدٍ سري داخل «مرصد الضباب الخفي»: اجمع نبض الوادي وطيف الحديقة لمحاذاة الحلقات الفلكية الثلاث.',
    howToCompleteAr: 'افتح مرصد الضباب الخفي أولاً، ثم اضبط زوايا العدسات الفلكية الثلاث بدقة.',
    verification: {
      kind: 'island_puzzle',
      puzzleType: 'star_triangulation',
      requiredClueIds: ['clue_cipher_code', 'clue_vials_spectrum'],
    },
    rewardCollectible: 'mountain_fragment',
    rewardRelicId: 'mist_navigator_lens',
    rewardXP: 150,
    worldImpactAr: 'يمنح «عدسة راصد الضباب» وقطعة الجبل الرابعة النادرة ويكشف مسار النجوم نحو المعبد الأسمى!',
  },
];

export const ROTATING_ISLAND_QUESTS: RotatingIslandQuestDef[] = [
  {
    id: 'isl_quest_clue_hunter',
    titleAr: 'راصد الأدلة الخفية',
    descriptionAr: 'اعثر على دليلين على الأقل من أدلة الجزيرة الموزعة بين المناطق لربط خيوط اللغز الكبير.',
    rewardXP: 100,
    category: 'discover_clue',
    targetCount: 2,
  },
  {
    id: 'isl_quest_pure_cipher',
    titleAr: 'فك الشفرة بصفاء تام',
    descriptionAr: 'أنهِ مرحلة في «شفرة نسمة» بأقل عدد ممكن من التلميحات (صفر تلميحات / ٣ نجوم).',
    rewardXP: 110,
    category: 'cipher_low_hints',
    targetCount: 1,
  },
  {
    id: 'isl_quest_dual_harmony',
    titleAr: 'تناغم عالمين مختلفين',
    descriptionAr: 'أكمل تحديين مرتبطين بلعبتين مختلفتين على خريطة الجزيرة.',
    rewardXP: 95,
    category: 'two_games_combo',
    targetCount: 2,
  },
  {
    id: 'isl_quest_secret_wayfarer',
    titleAr: 'عابر المسارات المستترة',
    descriptionAr: 'افتح المسار المختصر المتوهج أو اكشف مرصد الضباب الخفي أو غرفة الكنوز المفقودة.',
    rewardXP: 130,
    category: 'unlock_secret_path',
    targetCount: 1,
  },
  {
    id: 'isl_quest_master_collector',
    titleAr: 'جامع الجواهر الكاملة',
    descriptionAr: 'أكمل جمع ٤/٤ قطع في أي فئة من فئات المقتنيات الست على الجزيرة.',
    rewardXP: 150,
    category: 'complete_collectible_set',
    targetCount: 1,
  },
];

export const MAP_CONNECTIONS: {
  id: string;
  from: IslandRegionId;
  to: IslandRegionId;
  style: 'standard' | 'bridge' | 'shortcut' | 'dual_gate' | 'secret_mist' | 'vault' | 'finale';
  labelAr: string;
}[] = [
  { id: 'conn_1', from: 'cipher-valley', to: 'balance-bridge', style: 'standard', labelAr: 'ممر الوادي' },
  { id: 'conn_2', from: 'balance-bridge', to: 'vials-garden', style: 'bridge', labelAr: 'الجسر المعلّق' },
  { id: 'conn_shortcut', from: 'cipher-valley', to: 'vials-garden', style: 'shortcut', labelAr: 'المسار المختصر المتوهج' },
  { id: 'conn_3', from: 'vials-garden', to: 'order-library', style: 'dual_gate', labelAr: 'البوابة المزدوجة' },
  { id: 'conn_3b', from: 'balance-bridge', to: 'order-library', style: 'dual_gate', labelAr: 'عتبة التوازن' },
  { id: 'conn_4', from: 'order-library', to: 'choice-gate', style: 'standard', labelAr: 'رواق الحكمة' },
  { id: 'conn_5', from: 'choice-gate', to: 'secrets-mountain', style: 'standard', labelAr: 'معبر الإرادة' },
  { id: 'conn_mist_1', from: 'vials-garden', to: 'hidden-observatory', style: 'secret_mist', labelAr: 'أثر الضباب' },
  { id: 'conn_vault', from: 'order-library', to: 'treasure-vault', style: 'vault', labelAr: 'سرداب الخزنة' },
  { id: 'conn_finale', from: 'secrets-mountain', to: 'finale-sanctuary', style: 'finale', labelAr: 'مدرج المعبد الأسمى' },
];
