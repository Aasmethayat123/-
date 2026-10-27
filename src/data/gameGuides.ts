import { GameMode } from '../types';
import { CipherPuzzleType } from '../types/nesmaCipher';

export interface GameGuideInfo {
  gameId: GameMode;
  icon: string;
  titleAr: string;
  titleEn: string;
  ideaAndGoalAr: string;
  ideaAndGoalEn: string;
  controlsAr: string;
  controlsEn: string;
  winConditionAr: string;
  winConditionEn: string;
  scoringAndHintsAr: string;
  scoringAndHintsEn: string;
  navigationAndExitAr: string;
  navigationAndExitEn: string;
}

export interface CipherMechanicGuide {
  puzzleType: CipherPuzzleType;
  nameAr: string;
  howToSolveAr: string;
  tipAr: string;
}

export const CIPHER_MECHANIC_GUIDES: Record<CipherPuzzleType, CipherMechanicGuide> = {
  tile_puzzle: {
    puzzleType: 'tile_puzzle',
    nameAr: 'واحة الألغاز — تركيب الصور (٣×٣)',
    howToSolveAr:
      'اسحب القطع وأفلتها بالماوس أو باللمس (أو اضغط على قطعتين متتاليتين) لتبديل مكانيهما حتى تكتمل اللوحة البصرية، مع إمكانية معاينة الصورة الأصلية.',
    tipAr: 'ابدأ بترتيب الزوايا الأربع أولاً ثم أكمل القلب الأوسط بهدوء.',
  },
  letter_scramble: {
    puzzleType: 'letter_scramble',
    nameAr: 'صندوق الحروف المبعثرة',
    howToSolveAr:
      'اقرأ الدليل الدلالي بعناية، ثم اضغط على الحروف بالترتيب الصحيح لتكوين الكلمة المفتاحية، أو اضغط على الحرف المختار لإرجاعه.',
    tipAr: 'اربط بين المعنى النفسي المكتوب وعدد خانات الكلمة لاكتشاف الحرف الأول.',
  },
  word_sequence: {
    puzzleType: 'word_sequence',
    nameAr: 'ترتيب الكلمات وبناء الجملة',
    howToSolveAr:
      'استخدم أسهم التقديم والتأخير أسفل كل بطاقة كلمة لإعادة ترتيبها من اليمين إلى اليسار، ثم اضغط «تحقق من الترتيب» لاعتماد الجملة.',
    tipAr: 'ابحث عن الفعل أو المبتدأ الذي يفتتح المعنى، ثم ركّب بقية الجملة بسلاسة.',
  },
  path_maze: {
    puzzleType: 'path_maze',
    nameAr: 'المتاهة التفاعلية ومفاتيح الوعي',
    howToSolveAr:
      'تحرّك خطوة بخطوة عبر الأسهم أو بالضغط على الخانات المجاورة، اجمع جميع مفاتيح الوعي المضيئة في الممر وتجنب حواجز التشتت للوصول إلى البوابة.',
    tipAr: 'خطط لمسار يمر بكل المفاتيح قبل التوجه نحو مخرج المتاهة.',
  },
  pattern_matrix: {
    puzzleType: 'pattern_matrix',
    nameAr: 'اكتشاف النمط المنطقي',
    howToSolveAr:
      'تأمل تسلسل الرموز والمعاني المعروضة، واكتشف العلاقة التي تربطها، ثم اختر العنصر المكمل للخانة المفقودة.',
    tipAr: 'راقب التدرج في الفكرة أو الشكل من اليمين إلى اليسار قبل اختيار الإجابة.',
  },
  clue_search: {
    puzzleType: 'clue_search',
    nameAr: 'البحث البصري عن الأدلة',
    howToSolveAr:
      'افحص المشهد بعناية واضغط مباشرة على العناصر والرموز المطلوبة في القائمة حتى تكتشفها جميعاً.',
    tipAr: 'اقرأ وصف كل عنصر مطلوب؛ فمكانه في المشهد يرتبط بمعناه دائماً.',
  },
  missing_piece: {
    puzzleType: 'missing_piece',
    nameAr: 'القطعة المعرفية الناقصة',
    howToSolveAr:
      'اقرأ البطاقات الموجودة على اللوحة لفهم الفكرة الكلية، ثم اختر البطاقة الأنسب التي تملأ الفراغ وتكمل المعنى.',
    tipAr: 'استبعد الخيارات القاسية أو المبالغ فيها، واختر الفكرة الأكثر توازناً وواقعية.',
  },
  symbol_cipher: {
    puzzleType: 'symbol_cipher',
    nameAr: 'فك الشفرة بالرموز',
    howToSolveAr:
      'طابق كل رمز في الرسالة المشفرة مع الحرف المقابل له في جدول مفاتيح الشفرة العلوي، واختر الحرف من لوحة الحروف لاكتشاف الكلمة المخفية.',
    tipAr: 'راجع جدول مفاتيح الشفرة رمزاً برمز بالترتيب من اليمين إلى اليسار، ويمكنك الضغط على أي خانة لتعديلها.',
  },
  scenario_order: {
    puzzleType: 'scenario_order',
    nameAr: 'ترتيب خطوات التعامل مع الموقف',
    howToSolveAr:
      'اقرأ الموقف المعروض ثم حرّك الخطوات للأعلى أو للأسفل عبر الأسهم الجانبية من الخطوة الأولى إلى الأخيرة، واضغط «تحقق من التسلسل».',
    tipAr: 'دائماً ما تبدأ الاستجابة الواعية بـ «التوقف والملاحظة» قبل اتخاذ القرار العملي.',
  },
  hybrid_challenge: {
    puzzleType: 'hybrid_challenge',
    nameAr: 'التحدي المركّب متعدد المراحل',
    howToSolveAr:
      'أكمل الشطر الأول من اللغز لفتح الشطر الثاني المرتبط به، ثم ادمج الحلين لإتمام المرحلة.',
    tipAr: 'النتيجة التي تصل إليها في الجزء الأول تمنحك مفتاح الإجابة في الجزء الثاني.',
  },
};

export const GAME_GUIDES: Partial<Record<GameMode, GameGuideInfo>> = {
  'moving-island': {
    gameId: 'moving-island',
    icon: '🏝️',
    titleAr: 'جزيرة الأسرار المتحركة',
    titleEn: 'Moving Secrets Island',
    ideaAndGoalAr:
      'استكشاف ٩ مناطق مترابطة وجمع المقتنيات والأدلة عبر إنجاز مهام حقيقية في ٦ ألعاب أساسية لفتح «معبد البصيرة الأسمى».',
    ideaAndGoalEn:
      'Explore 9 connected regions and gather relics and clues across 6 core games to unlock the Grand Insight Sanctuary.',
    controlsAr:
      'اضغط على أي منطقة مفتوحة في الخريطة لاستعراض تحدياتها، واضغط «انطلق للمهمة» للانتقال للعبة المرتبطة أو حل لغز الجزيرة التفاعلي.',
    controlsEn:
      'Tap any unlocked region on the map to inspect its challenges, then launch the linked game stage or solve the island mechanism.',
    winConditionAr:
      'تُنجز كل مهمة بتحقيق شرطها الفعلي (مثل حل مرحلة أو كسب ٣ نجوم)، وتكتمل الرحلة الكبرى بحل لغز المعبد الختامي المكون من ٣ أختام.',
    winConditionEn:
      'Complete challenges by meeting their stage/star conditions, and finish the adventure by solving the 3-seal Grand Finale.',
    scoringAndHintsAr:
      'تحصل على نقاط خبرة (XP) وشظايا ومفاتيح وأدلة مكتوبة تُحفظ في حقيبة الجزيرة، وتتوفر تلميحات تدريجية داخل الألغاز والختام.',
    scoringAndHintsEn:
      'Earn XP, collectible shards, keys, and written clues stored in your Island Vault, with optional step-by-step hints.',
    navigationAndExitAr:
      'استخدم شريط المهام العلوي للعودة الفورية للجزيرة بعد إتمام المرحلة، أو زر «عودة» أعلى اليسار للرجوع للشاشة الرئيسية.',
    navigationAndExitEn:
      'Use the top companion bar to return to the island after completing a linked stage, or tap Back to return Home.',
  },
  'nesma-cipher': {
    gameId: 'nesma-cipher',
    icon: '🗝️',
    titleAr: 'شفرة نسمة — ألغاز الأنماط والمقولات',
    titleEn: 'Nesma Cipher — Pattern & Quote Puzzles',
    ideaAndGoalAr:
      'حل ألغاز متدرجة عبر ٦ عوالم (٦٠ مرحلة) لجمع كلمات ورموز تكشف ١٠ مقولات حكيمة وتُزهر عناصر حديقة الشفرة.',
    ideaAndGoalEn:
      'Solve progressive puzzles across 6 worlds (60 levels) to collect words and tokens that unlock 10 wise quotes and garden items.',
    controlsAr:
      'تفاعل باللمس أو النقر حسب نوع اللغز (تبديل قطع الصورة، اختيار الحروف والكلمات، السير في المتاهة، أو فك الرموز).',
    controlsEn:
      'Tap or click puzzle elements to swap tiles, assemble words, navigate mazes, or decode symbol tables.',
    winConditionAr:
      'تكتمل المرحلة فور الوصول إلى الترتيب أو الكلمة أو المسار الصحيح، لتنفتح المرحلة التالية تلقائياً.',
    winConditionEn:
      'Complete the stage by reaching the valid arrangement, word, or path to unlock the next level.',
    scoringAndHintsAr:
      'تحصل على ٣ نجوم عند الحل دون تلميحات، نجمتين مع تلميح واحد، ونجمة مع تلميحين، ويضاعف «التحدي العميق» أو المستوى الصعب النقاط (2x).',
    scoringAndHintsEn:
      'Earn 3 stars with 0 hints, 2 stars with 1 hint, and 1 star with 2+ hints. Deep Challenge or Hard mode doubles XP.',
    navigationAndExitAr:
      'من نافذة الفوز اضغط «المرحلة التالية» للمتابعة، أو السهم العلوي للعودة لخريطة العوالم أو الشاشة الرئيسية.',
    navigationAndExitEn:
      'Tap Next Level in the victory modal, or use the top back button to return to the Cipher Map or Home.',
  },
  'hands-control': {
    gameId: 'hands-control',
    icon: '🤲',
    titleAr: 'في إيدي / برّا إيدي (دائرة السيطرة)',
    titleEn: 'In My Hands / Outside My Control',
    ideaAndGoalAr:
      'فرز المواقف اليومية المسببة للقلق والتمييز بوضوح بين ما تملك تغييره بفعلك وما يقع خارج سيطرتك.',
    ideaAndGoalEn:
      'Sort everyday worries by distinguishing between actions within your control and outcomes outside your hands.',
    controlsAr:
      'اقرأ بطاقة الموقف المعروضة، ثم اضغط زر «في إيدي 🤲» أو «برّا إيدي 🍃» لفرز كل بطاقة في مكانها الصحيح.',
    controlsEn:
      'Read each situation card and tap either "In My Hands" or "Outside My Control" to classify it.',
    winConditionAr:
      'أكمل فرز جميع بطاقات المرحلة الحالية بنجاح لفتح المرحلة التالية (٣ مراحل متدرجة).',
    winConditionEn:
      'Correctly sort all cards in the current stage to complete it and unlock the next stage (3 stages total).',
    scoringAndHintsAr:
      'تُمنح حتى ٣ نجوم ونقاط خبرة (XP) بحسب دقة فرزك من المحاولة الأولى، مع تغذية راجعة هادئة تشرح سبب كل إجابة.',
    scoringAndHintsEn:
      'Earn up to 3 stars and XP based on first-try accuracy, with calm explanatory feedback on each card.',
    navigationAndExitAr:
      'بدّل بين المراحل المفتوحة من شريط المراحل العلوي، أو اضغط زر العودة للرجوع إلى الخريطة أو جزيرة الأسرار.',
    navigationAndExitEn:
      'Switch stages via the top Stage Selector or tap Back to return to the main map or Secrets Island.',
  },
  'reframe-sentence': {
    gameId: 'reframe-sentence',
    icon: '🔄',
    titleAr: 'بدّلي الجملة (تهدئة الصوت الداخلي)',
    titleEn: 'Reframe the Sentence',
    ideaAndGoalAr:
      'تحويل عبارات جلد الذات والتعميم القاسي إلى جمل واقعية ورحيمة تساعدك على التقدم دون قسوة.',
    ideaAndGoalEn:
      'Transform harsh self-critical thoughts into balanced, compassionate, and realistic statements.',
    controlsAr:
      'اقرأ الجملة القاسية التلقائية، ثم اختر من البدائل المعروضة الصياغة الأكثر توازناً وإنصافاً لنفسك.',
    controlsEn:
      'Read the harsh automatic thought, then select the most balanced and fair alternative statement.',
    winConditionAr:
      'إتمام جميع مواقف الجمل في الجولة للوصول إلى بطاقة الخلاصة وإمكانية حفظ الفكرة في دفتر رحلتك.',
    winConditionEn:
      'Complete all sentence prompts in the round to reach the summary card and optionally save a reflection.',
    scoringAndHintsAr:
      'كل اختيار متوازن يمنحك نقاط خبرة (XP) مع توضيح الفرق النفسي بين النقد الجارح والتقييم الواقعي.',
    scoringAndHintsEn:
      'Balanced choices award XP and explain why realistic self-talk supports resilience.',
    navigationAndExitAr:
      'انتقل للجملة التالية بزر المتابعة، أو اضغط زر العودة أعلى الشاشة للخروج في أي وقت.',
    navigationAndExitEn:
      'Tap Continue for the next prompt, or use the top Back button to exit anytime.',
  },
  'break-mountain': {
    gameId: 'break-mountain',
    icon: '⛰️',
    titleAr: 'كسّري الجبل (تفتيت المهام الثقيلة)',
    titleEn: 'Break the Mountain',
    ideaAndGoalAr:
      'تفكيك المهام المتراكمة التي تسبب التسويف والشلل الذهني إلى خطوات صغيرة جداً يسهل البدء بها خلال ٥ دقائق.',
    ideaAndGoalEn:
      'Break overwhelming tasks that trigger procrastination into tiny, doable 5-minute micro-steps.',
    controlsAr:
      'اختر المهمة الثقيلة ثم انقر لتفتيت الصخرة واختيار أصغر خطوة عملية أولى قابلة للتنفيذ الآن.',
    controlsEn:
      'Select an overwhelming mountain task, tap to chip it down, and pick the smallest actionable first step.',
    winConditionAr:
      'إكمال تفتيت مهام المرحلة وترتيب خطواتها البسيطة لإتمام المراحل الثلاث بنجاح.',
    winConditionEn:
      'Break down the stage tasks into micro-steps across the 3 progressive stages.',
    scoringAndHintsAr:
      'تكسب من ١ إلى ٣ نجوم ونقاط XP عند إتمام كل مرحلة بدقة، ويُحفظ تقدمك تلقائياً.',
    scoringAndHintsEn:
      'Earn 1–3 stars and XP per stage, saved automatically to your device.',
    navigationAndExitAr:
      'اختر المرحلة التالية من شريط المراحل أو نافذة الإنجاز، أو اضغط العودة للخروج.',
    navigationAndExitEn:
      'Advance via the stage completion modal or Stage Selector, or tap Back to exit.',
  },
  'gather-bubbles': {
    gameId: 'gather-bubbles',
    icon: '🫧',
    titleAr: 'لمّ اللي تقدر تلمّيه (فقاعات الزحمة الذهنية)',
    titleEn: 'Gather What You Can (Mental Traffic Bubbles)',
    ideaAndGoalAr:
      'التدرب على انتقاء ٣ أولويات ممكنة فقط لليوم وترك بقية المشاغل العائمة تمرّ بسلام دون إنهاك.',
    ideaAndGoalEn:
      'Practice picking just 3 manageable priorities for today while letting excess mental clutter float by.',
    controlsAr:
      'راقب الفقاعات المتحركة واضغط فقط على المهام البسيطة القابلة للتنفيذ اليوم لجمعها في سلتك الهادئة.',
    controlsEn:
      'Tap realistic, doable priority bubbles to collect them while ignoring overwhelming distractions.',
    winConditionAr:
      'تكتمل الجولة عند اختيار أولوياتك الثلاث المتزنة وتصفية ذهنك من التشتت.',
    winConditionEn:
      'Complete the round by selecting your balanced set of doable priorities.',
    scoringAndHintsAr:
      'تكافئك اللعبة بنقاط XP عند انتقاء الأولويات الواقعية وتجنب تحميل نفسك فوق طاقتها.',
    scoringAndHintsEn:
      'Earn XP for choosing realistic priorities and avoiding overload.',
    navigationAndExitAr:
      'يمكنك إعادة الجولة بتشكيلة جديدة أو الضغط على زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Replay a fresh round or tap Back to return to the main map.',
  },
  'boundaries-circle': {
    gameId: 'boundaries-circle',
    icon: '🛡️',
    titleAr: 'حدودك حواليك (دوائر الحماية الهادئة)',
    titleEn: 'Your Boundaries Circle',
    ideaAndGoalAr:
      'التدرب على حماية مساحتك النفسية والتمييز بين الطلبات المقبولة والتجاوزات التي تحتاج إلى قول «لا» بلطف وحزم.',
    ideaAndGoalEn:
      'Practice protecting your personal energy and responding calmly to boundary-crossing requests.',
    controlsAr:
      'اقرأ كل موقف اجتماعي واختر الاستجابة التي تحفظ حدودك باحترام دون قسوة أو شعور مفرط بالذنب.',
    controlsEn:
      'Read each interpersonal prompt and select the response that maintains healthy, respectful boundaries.',
    winConditionAr:
      'إتمام جميع مواقف الحدود في الجولة والوصول إلى ملخص الصياغات الصحية.',
    winConditionEn:
      'Complete all boundary scenarios in the session to unlock the reflection summary.',
    scoringAndHintsAr:
      'تحصل على نقاط XP وشرح مختصر يوضح لماذا تُعد الاستجابة المختارة صحية ومتوازنة.',
    scoringAndHintsEn:
      'Gain XP along with clear explanations of assertive vs. passive or aggressive responses.',
    navigationAndExitAr:
      'اضغط التالي للتنقل بين المواقف، أو زر العودة أعلى الصفحة للخروج.',
    navigationAndExitEn:
      'Tap Next to progress through scenarios, or Back at the top to exit.',
  },
  'gentle-break': {
    gameId: 'gentle-break',
    icon: '☕',
    titleAr: 'فاصل إجباري لطيف',
    titleEn: 'Mandatory Gentle Break',
    ideaAndGoalAr:
      'منح الجهاز العصبي استراحة قصيرة هادئة لمدة دقيقة بعيداً عن العجلة والضغط المتواصل.',
    ideaAndGoalEn:
      'Give your nervous system a brief, guilt-free calm pause away from constant urgency.',
    controlsAr:
      'اتبع المؤقت الهادئ وإرشادات التنفس وإرخاء الكتفين على الشاشة دون استعجال النقر.',
    controlsEn:
      'Follow the gentle countdown timer and on-screen breathing and shoulder-drop cues.',
    winConditionAr:
      'تكتمل التجربة بإتمام وقت الاستراحة الهادئة حتى النهاية بسلام.',
    winConditionEn:
      'Complete the experience simply by staying present until the calm timer finishes.',
    scoringAndHintsAr:
      'تمنحك نقاط XP تقديراً لإعطائك نفسك حق الراحة والتقاط الأنفاس.',
    scoringAndHintsEn:
      'Awards XP upon finishing your restorative pause.',
    navigationAndExitAr:
      'بعد انتهاء المؤقت يمكنك حفظ شعورك أو العودة مباشرة للشاشة الرئيسية.',
    navigationAndExitEn:
      'Save a brief note when the pause ends or tap Back to return Home.',
  },
  'first-sentence': {
    gameId: 'first-sentence',
    icon: '💬',
    titleAr: 'الجملة الأولى (فتح الحوار الصعب)',
    titleEn: 'The First Sentence',
    ideaAndGoalAr:
      'التدرب على بدء المحادثات الحساسة مع الأسرة أو الأصدقاء بجملة أولى تعبّر عن شعورك دون اتهام أو دفاعية.',
    ideaAndGoalEn:
      'Learn how to open sensitive conversations using calm "I-statements" instead of blame.',
    controlsAr:
      'اقرأ الموقف العائلي أو الاجتماعي، ثم اختر أفضل «جملة افتتاحية» تفتح باب التفاهم بدلاً من الشجار.',
    controlsEn:
      'Read the relationship scenario and pick the opening sentence most likely to foster calm understanding.',
    winConditionAr:
      'إكمال مواقف الحوار كلها لاكتساب مفاتيح التواصل الهادئ.',
    winConditionEn:
      'Finish all conversation prompts to complete the session.',
    scoringAndHintsAr:
      'نقاط XP لكل صياغة واعية مع توضيح أثر كل جملة على الطرف الآخر.',
    scoringAndHintsEn:
      'Earn XP and see immediate feedback on how each opening affects the listener.',
    navigationAndExitAr:
      'انتقل للموقف التالي بزر المتابعة أو اخرج في أي لحظة من زر العودة.',
    navigationAndExitEn:
      'Tap Next to continue or Back to return to the map.',
  },
  'distance-safe': {
    gameId: 'distance-safe',
    icon: '🪐',
    titleAr: 'مسافة (دوائر القرب والأمان)',
    titleEn: 'Safe Distance Circles',
    ideaAndGoalAr:
      'ترتيب دوائر القرب في علاقاتك وتحديد المسافة النفسية المريحة مع كل نمط من المواقف والأشخاص.',
    ideaAndGoalEn:
      'Map out healthy emotional closeness and safe distance across different relationship dynamics.',
    controlsAr:
      'اختر دائرة المسافة المناسبة (قريب جداً، تواصل متوازن، أو مسافة آمنة) لكل بطاقة موقف تظهر لك.',
    controlsEn:
      'Assign each interaction card to the appropriate closeness ring (inner, balanced, or safe distance).',
    winConditionAr:
      'توزيع جميع المواقف بوعي لتحقيق التوازن في دوائر علاقاتك.',
    winConditionEn:
      'Place all cards thoughtfully across the rings to complete the exercise.',
    scoringAndHintsAr:
      'تحصل على نقاط XP وتوضيح يساعدك على حماية طاقتك دون قطيعة قاسية.',
    scoringAndHintsEn:
      'Awards XP and gentle insights on maintaining healthy relational energy.',
    navigationAndExitAr:
      'أكمل البطاقات للوصول للخلاصة أو عد للرئيسية من زر العودة العلوي.',
    navigationAndExitEn:
      'Finish all cards for your summary or tap Back anytime.',
  },
  'small-light': {
    gameId: 'small-light',
    icon: '🕯️',
    titleAr: 'نور صغير (التقاط النعم البسيطة)',
    titleEn: 'Small Light of Hope',
    ideaAndGoalAr:
      'تدريب الانتباه في الأيام الثقيلة على ملاحظة لحظات اللطف أو الإنجاز الصغيرة جداً دون إنكار الصعوبات.',
    ideaAndGoalEn:
      'Train gentle attention on small moments of warmth or relief during heavy days without toxic positivity.',
    controlsAr:
      'اضغط لإضاءة الفوانيس الصغيرة واختيار أو كتابة أشياء بسيطة ساندتك في يومك.',
    controlsEn:
      'Tap to light small lanterns and select or write tiny grounding moments from your day.',
    winConditionAr:
      'إضاءة أنوار الجولة كاملة لتكوين لوحة امتنان واقعية ودافئة.',
    winConditionEn:
      'Light all lanterns in the session to complete your warm reflection.',
    scoringAndHintsAr:
      'نقاط XP مع إمكانية حفظ هذه اللحظات المضيئة في «دفتر رحلتي».',
    scoringAndHintsEn:
      'Earn XP and optionally save your lit moments to My Journey.',
    navigationAndExitAr:
      'اضغط إنهاء وحفظ عند الاكتمال، أو زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Tap Finish to save or Back to return to the map.',
  },
  'game-butterfly-tap': {
    gameId: 'game-butterfly-tap',
    icon: '🦋',
    titleAr: 'فراشة التربيت الثنائي الهادئ',
    titleEn: 'Bilateral Butterfly Tap',
    ideaAndGoalAr:
      'تهدئة التسارع الانفعالي عبر إيقاع تربيت متبادل ومنتظم بين الجانب الأيمن والأيسر مع التنفس البطيء.',
    ideaAndGoalEn:
      'Settle emotional overwhelm using rhythmic alternating left-right bilateral tapping paired with slow breathing.',
    controlsAr:
      'اضغط بالتناوب على جناحي الفراشة (يمين ثم يسار) أو اتبع الإيقاع البصري المرسوم مع التربيت اللطيف على كتفيك.',
    controlsEn:
      'Tap the right and left butterfly wings rhythmically in sync with the visual pulse.',
    winConditionAr:
      'إتمام دورة الإيقاع المتناوب حتى تهدأ وتيرة المؤقت ويصل شريط السكينة إلى اكتماله.',
    winConditionEn:
      'Maintain the gentle alternating rhythm until the calm cycle completes.',
    scoringAndHintsAr:
      'نقاط XP عند إكمال الجلسة؛ الأهم هنا هو البطء والانتظام وليس السرعة.',
    scoringAndHintsEn:
      'Awards XP on completion—steady, slow rhythm matters far more than speed.',
    navigationAndExitAr:
      'يمكنك إعادة دورة إضافية لمزيد من الهدوء أو الضغط على زر العودة للخروج.',
    navigationAndExitEn:
      'Start another calm cycle or tap Back to exit.',
  },
  'game-somatic-shake': {
    gameId: 'game-somatic-shake',
    icon: '🫨',
    titleAr: 'نفض وتفريغ التوتر الحركي',
    titleEn: 'Somatic Tension Shake',
    ideaAndGoalAr:
      'تحرير الشحنة العضلية المتراكمة في اليدين والكتفين عبر تمرين النفض الحركي الخفيف ثم التوقف لملاحظة الاسترخاء.',
    ideaAndGoalEn:
      'Release pent-up muscular tension in your hands and shoulders through guided light shaking followed by stillness.',
    controlsAr:
      'ابدأ المؤقت واتبع التعليمات بنفض اليدين والكتفين برفق في مكانك أو التفاعل مع زر التفريغ على الشاشة.',
    controlsEn:
      'Start the timer and follow prompts to gently shake out your hands and shoulders or tap along on screen.',
    winConditionAr:
      'إكمال مراحل النفض القصيرة متبوعة بلحظة السكون وملاحظة خفة الجسد.',
    winConditionEn:
      'Complete the brief shake intervals and the closing stillness check-in.',
    scoringAndHintsAr:
      'تحصل على نقاط XP عند إتمام الدورة؛ مارس الحركة بلطف تام وبما يناسب راحتك الجسدية.',
    scoringAndHintsEn:
      'Earn XP on completion; always move gently within your physical comfort.',
    navigationAndExitAr:
      'اضغط إنهاء بعد لحظة السكون أو زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Tap Finish after the stillness check or Back to return Home.',
  },
  'game-pmr-squeeze': {
    gameId: 'game-pmr-squeeze',
    icon: '✊',
    titleAr: 'الشد والإرخاء العضلي التدريجي (PMR)',
    titleEn: 'Progressive Muscle Squeeze & Release',
    ideaAndGoalAr:
      'تعليم الجسد الفرق المحسوس بين الشد العضلي والاسترخاء العميق عبر قبض العضلات لثوانٍ ثم إرخائها تماماً.',
    ideaAndGoalEn:
      'Help your body feel deep relaxation by briefly tensing specific muscle groups and then releasing them.',
    controlsAr:
      'اضغط مطولاً أثناء مرحلة «الشد اللطيف» ثم ارفع إصبعك وتنفس بعمق عند ظهور إشارة «الإرخاء».',
    controlsEn:
      'Press and hold during the gentle squeeze cue, then release and exhale slowly on the relax cue.',
    winConditionAr:
      'إتمام مجموعات العضلات المتتالية (اليدين، الكتفين، الوجه، القدمين) حتى نهاية التمرين.',
    winConditionEn:
      'Complete the guided sequence of muscle groups through the final relaxation breath.',
    scoringAndHintsAr:
      'تُكافأ بنقاط XP عند إكمال الجلسة؛ لا تشد العضلات بقوة مؤلمة بل بضغط لطيف ومعتدل.',
    scoringAndHintsEn:
      'Awards XP upon completion; keep tension gentle and never strain.',
    navigationAndExitAr:
      'انتقل بين الخطوات تلقائياً أو اضغط العودة للخروج متى شئت.',
    navigationAndExitEn:
      'Progress automatically through steps or tap Back to exit.',
  },
  'game-sensory-grounding': {
    gameId: 'game-sensory-grounding',
    icon: '⚓',
    titleAr: 'مرساة الحواس الخمس (٥-٤-٣-٢-١)',
    titleEn: '5-4-3-2-1 Sensory Grounding',
    ideaAndGoalAr:
      'إعادة انتباهك من دوامة التفكير في المستقبل أو الماضي إلى اللحظة الحاضرة عبر حواسك الخمس من حولك.',
    ideaAndGoalEn:
      'Anchor your attention back into the present moment using the classic 5-4-3-2-1 five-senses exercise.',
    controlsAr:
      'لاحظ من حولك في الغرفة وسجّل أو اختر: ٥ أشياء تراها، ٤ تلمسها، ٣ تسمعها، ٢ تشمها، و١ تتذوقه أو تمتن له.',
    controlsEn:
      'Notice and tap/record 5 things you see, 4 you touch, 3 you hear, 2 you smell, and 1 grounding thought.',
    winConditionAr:
      'إكمال الخطوات الخمس التنازلية حتى تصل إلى مرساة الحضور الكامل.',
    winConditionEn:
      'Complete all 5 sensory countdown steps.',
    scoringAndHintsAr:
      'نقاط XP عند إتمام الخطوات الخمس مع إمكانية حفظ التجربة في دفتر رحلتك.',
    scoringAndHintsEn:
      'Awards XP upon completing all 5 steps.',
    navigationAndExitAr:
      'اضغط الخطوة التالية بعد كل حاسة، أو زر العودة أعلى الشاشة للخروج.',
    navigationAndExitEn:
      'Tap Next Step after each sense, or Back to exit.',
  },
  'game-infinity-flow': {
    gameId: 'game-infinity-flow',
    icon: '♾️',
    titleAr: 'مسار اللانهاية الهادئ (∞)',
    titleEn: 'Infinity Flow Tracing',
    ideaAndGoalAr:
      'تنظيم الإيقاع البصري والحركي عبر تتبّع مسار علامة اللانهاية بانسيابية هادئة مع الشهيق والزفير.',
    ideaAndGoalEn:
      'Harmonize visual focus and breathing by smoothly tracing an infinity figure-eight path.',
    controlsAr:
      'اسحب بإصبعك أو المؤشر بهدوء فوق النقطة المضيئة على منحنى اللانهاية وتنفس مع حركتها.',
    controlsEn:
      'Drag your finger or cursor smoothly along the glowing point on the infinity loop.',
    winConditionAr:
      'إتمام دورات الانسياب المطلوبة بهدوء حتى يكتمل مؤشر التناغم.',
    winConditionEn:
      'Complete the smooth tracing loops until the harmony meter fills.',
    scoringAndHintsAr:
      'كلما كانت حركتك هادئة ومتصلة زاد التناغم وحصلت على نقاط XP كاملة.',
    scoringAndHintsEn:
      'Smooth, unhurried movement fills the meter smoothly and grants XP.',
    navigationAndExitAr:
      'يمكنك الاستمرار للتهدئة الحرة أو الضغط على زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Continue freely or tap Back to return Home.',
  },
  'game-balloon-breath': {
    gameId: 'game-balloon-breath',
    icon: '🎈',
    titleAr: 'بالون الأنفاس المهدئة',
    titleEn: 'Calm Balloon Breath',
    ideaAndGoalAr:
      'ضبط طول الشهيق والزفير بصرياً عبر نفخ بالون السكينة ببطء ثم تفريغه بهدوء لإبطاء تسارع النبض.',
    ideaAndGoalEn:
      'Pace your inhale and exhale visually by gently inflating and releasing a calm balloon.',
    controlsAr:
      'اضغط مطولاً أثناء الشهيق لنفخ البالون بالقدر المحدد، ثم ارفع إصبعك مع زفير طويل هادئ.',
    controlsEn:
      'Press and hold while inhaling to inflate, then release slowly as you exhale.',
    winConditionAr:
      'إكمال عدد الأنفاس المتزنة المطلوبة في الجولة دون استعجال.',
    winConditionEn:
      'Complete the target number of paced breaths comfortably.',
    scoringAndHintsAr:
      'نقاط XP عند إتمام الدورة؛ إذا شعرت بدوار خفيف توقف وتنفس بشكل طبيعي ومريح.',
    scoringAndHintsEn:
      'Awards XP on completion; breathe naturally at a comfortable depth.',
    navigationAndExitAr:
      'أعد الجلسة إذا أردت أو اضغط زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Replay another round or tap Back to exit.',
  },
  'cards-insight': {
    gameId: 'cards-insight',
    icon: '🃏',
    titleAr: 'كروت البصيرة التأملية',
    titleEn: 'Reflective Insight Cards',
    ideaAndGoalAr:
      'سحب بطاقات أسئلة تأملية تفتح زوايا هادئة لفهم مشاعرك واحتياجاتك غير المعلنة.',
    ideaAndGoalEn:
      'Draw reflective prompt cards designed to spark gentle curiosity about your inner thoughts and feelings.',
    controlsAr:
      'اضغط لسحب بطاقة وقلبها، تأمل السؤال المكتوب، ثم اختر إجابتك الأقرب أو دوّن خاطرتك.',
    controlsEn:
      'Tap to draw and flip a card, reflect on its question, and choose or write your personal takeaway.',
    winConditionAr:
      'التفاعل مع مجموعة البطاقات المختارة في الجلسة وحفظ البصيرة التي لمستك.',
    winConditionEn:
      'Reflect through the drawn cards and optionally save the insight that resonated with you.',
    scoringAndHintsAr:
      'تُمنح نقاط XP عن كل تأمل صادق؛ لا توجد إجابة خاطئة في بطاقات البصيرة.',
    scoringAndHintsEn:
      'Awards XP for honest reflection—there are no wrong answers.',
    navigationAndExitAr:
      'اسحب بطاقة تالية أو اضغط زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Draw another card or tap Back to return Home.',
  },
  'scenarios-quick': {
    gameId: 'scenarios-quick',
    icon: '⚡',
    titleAr: 'مواقف وردود سريعة',
    titleEn: 'Quick Life Scenarios',
    ideaAndGoalAr:
      'اختبار ردود أفعالك التلقائية أمام مواقف حياتية مألوفة ومقارنتها بالبدائل الأكثر هدوءاً وفاعلية.',
    ideaAndGoalEn:
      'Explore your instinctive reactions to everyday situations and discover calmer, constructive alternatives.',
    controlsAr:
      'اقرأ الموقف القصير واختر التصرف الذي يشبهك أو التصرف الأكثر اتزاناً من الخيارات.',
    controlsEn:
      'Read each brief scenario and tap one of the response choices.',
    winConditionAr:
      'إتمام سلسلة المواقف السريعة والاطلاع على القراءة التوضيحية لأنماط الاستجابة.',
    winConditionEn:
      'Complete all scenarios in the set to view your response summary.',
    scoringAndHintsAr:
      'تكسب نقاط XP مع توضيح النتائج القريبة والبعيدة لكل اختيار.',
    scoringAndHintsEn:
      'Earn XP while seeing short- and long-term outcomes for each choice.',
    navigationAndExitAr:
      'اضغط الموقف التالي للمتابعة أو زر العودة للخروج.',
    navigationAndExitEn:
      'Tap Next Scenario to continue or Back to exit.',
  },
  'visual-projection': {
    gameId: 'visual-projection',
    icon: '🎨',
    titleAr: 'الإسقاط البصري وتأمل الأشكال',
    titleEn: 'Visual Metaphor & Reflection',
    ideaAndGoalAr:
      'تأمل لوحات وأشكال رمزية وملاحظة أول ما يجذب انتباهك كمدخل لطيف للتعرف إلى حالتك الذهنية الحالية.',
    ideaAndGoalEn:
      'Observe symbolic visuals and notice what stands out first as a playful mirror for your current mood.',
    controlsAr:
      'انظر للوحة الهادئة ثم اختر العنصر أو الانطباع الأول الذي لفت نظرك من الخيارات.',
    controlsEn:
      'Look at each visual scene and select the impression that caught your eye first.',
    winConditionAr:
      'إكمال اللوحات المعروضة وقراءة التأمل الإرشادي الداعم (تأملي ترفيهي وليس تشخيصاً).',
    winConditionEn:
      'Complete all visual cards to read your reflective summary (exploratory, non-diagnostic).',
    scoringAndHintsAr:
      'تُكافأ بنقاط XP عند إتمام الجولة، ويمكنك حفظ التأمل في دفتر رحلتك.',
    scoringAndHintsEn:
      'Awards XP upon completion with optional saving to My Journey.',
    navigationAndExitAr:
      'انتقل للوحة التالية أو اضغط زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Move to the next visual or tap Back to exit.',
  },
  'micro-challenge-30s': {
    gameId: 'micro-challenge-30s',
    icon: '⏱️',
    titleAr: 'تحدي الـ ٣٠ ثانية الخاطف',
    titleEn: '30-Second Micro Challenge',
    ideaAndGoalAr:
      'كسر الجمود الذهني والملل بتمرين عملي صغير وممتع لا يستغرق سوى نصف دقيقة.',
    ideaAndGoalEn:
      'Break mental inertia with a refreshing, doable 30-second micro-action.',
    controlsAr:
      'اضغط لبدء عداد الـ ٣٠ ثانية ونفّذ المهمة البسيطة المعروضة قبل انتهاء الوقت.',
    controlsEn:
      'Start the 30-second countdown and complete the simple prompt before time runs out.',
    winConditionAr:
      'إتمام التحدي والضغط على زر «أنجزته!» عند الانتهاء.',
    winConditionEn:
      'Finish the micro-action and tap Completed.',
    scoringAndHintsAr:
      'نقاط XP فورية عند الإنجاز، مع إمكانية تبديل التحدي بآخر إذا لم يناسب مكانك الحالي.',
    scoringAndHintsEn:
      'Instant XP reward, plus a shuffle button if you want an alternative prompt.',
    navigationAndExitAr:
      'جرّب تحدياً آخر أو اضغط زر العودة للخروج.',
    navigationAndExitEn:
      'Try another micro-challenge or tap Back to exit.',
  },
  'daily-quests': {
    gameId: 'daily-quests',
    icon: '📋',
    titleAr: 'بطاقات المهام اليومية الهادئة',
    titleEn: 'Daily Mindful Quest Cards',
    ideaAndGoalAr:
      'اختيار خطوات واقعية صغيرة في يومك تدعم صحتك الجسدية وحدودك وتواصلك الطيب.',
    ideaAndGoalEn:
      'Pick small, practical real-life actions across physical care, mindfulness, and healthy boundaries.',
    controlsAr:
      'تصفح بطاقات المهام واضغط علامة الإتمام على المهمة التي طبّقتها فعلاً اليوم.',
    controlsEn:
      'Browse quest cards and check off each action you complete today.',
    winConditionAr:
      'إنجاز مهمة يومية واحدة أو أكثر لتحفيز شعلة الاستمرارية.',
    winConditionEn:
      'Complete one or more daily quests to build steady momentum.',
    scoringAndHintsAr:
      'كل بطاقة مكتملة تمنحك قيمة نقاط الـ XP الموضحة عليها مع شرح المفهوم النفسي وراءها.',
    scoringAndHintsEn:
      'Each completed quest grants its listed XP and explains the wellness principle behind it.',
    navigationAndExitAr:
      'يمكنك العودة في أي وقت لاستكمال بقية البطاقات عبر زر الخريطة.',
    navigationAndExitEn:
      'Return anytime to check off more quests or tap Back to Home.',
  },
  'wisdom-vault': {
    gameId: 'wisdom-vault',
    icon: '🏛️',
    titleAr: 'خزينة الحكمة والبطاقات المفتوحة',
    titleEn: 'Wisdom Vault Collection',
    ideaAndGoalAr:
      'استعراض بطاقات الحكم والتأملات النادرة التي تنفتح لك تدريجياً كلما زادت نقاط خبرتك في التطبيق.',
    ideaAndGoalEn:
      'Explore collectible wisdom and reflection cards unlocked progressively by your total XP.',
    controlsAr:
      'اضغط على أي بطاقة مفتوحة لقراءة الاقتباس الكامل والتأمل التطبيقي المرفق به.',
    controlsEn:
      'Tap any unlocked card to read its quote and practical reflection.',
    winConditionAr:
      'تُفتح البطاقات تلقائياً عند بلوغ عتبة نقاط الـ XP المكتوبة على كل بطاقة مقفلة.',
    winConditionEn:
      'Cards unlock automatically as your XP reaches each milestone threshold.',
    scoringAndHintsAr:
      'تصنّف البطاقات إلى أساسية ونادرة وأسطورية لتوثيق محطات تقدمك في الألعاب.',
    scoringAndHintsEn:
      'Cards are tiered (Common, Rare, Legendary) to celebrate your progress.',
    navigationAndExitAr:
      'اضغط زر العودة للرجوع إلى الألعاب وكسب نقاط إضافية لفتح البطاقات المتبقية.',
    navigationAndExitEn:
      'Tap Back to play more games and unlock remaining cards.',
  },
  'touch-and-break': {
    gameId: 'touch-and-break',
    icon: '🪞',
    titleAr: 'المرآة المكسورة (تحطيم الأحكام القاسية)',
    titleEn: 'Shatter the Illusion Mirror',
    ideaAndGoalAr:
      'تفريغ التوتر اللمسي بتحطيم طبقة الأحكام المسبقة القاسية على الشاشة وكشف الفكرة المنصفة خلفها.',
    ideaAndGoalEn:
      'Release tension through tactile tapping to crack rigid self-judgments and reveal a grounded truth.',
    controlsAr:
      'انقر بشكل متكرر على لوح الزجاج المعتم حتى يتشقق وينكسر بالكامل.',
    controlsEn:
      'Tap repeatedly on the frosted mirror pane until it shatters completely.',
    winConditionAr:
      'كسر جميع طبقات الوهم في الجولة والوصول إلى بطاقة الحقيقة الهادئة.',
    winConditionEn:
      'Break through the layers to unveil the comforting insight card.',
    scoringAndHintsAr:
      'نقاط XP عند كشف الحقيقة مع مؤثرات صوتية وبصرية آمنة ومريحة.',
    scoringAndHintsEn:
      'Awards XP when the hidden insight card is revealed.',
    navigationAndExitAr:
      'انتقل للوح التالي أو اضغط زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Try the next mirror or tap Back to exit.',
  },
  'body-motion-challenge': {
    gameId: 'body-motion-challenge',
    icon: '🤸',
    titleAr: 'عقارب الساعة المعكوسة (حركة ١٥ ثانية)',
    titleEn: '15-Second Body Motion Reset',
    ideaAndGoalAr:
      'فصل التحديق المستمر في الشاشة لمدة ١٥ ثانية بحركة جسدية خفيفة تعيد النشاط والتركيز.',
    ideaAndGoalEn:
      'Step away from screen stiffness for 15 seconds with a light physical stretch or movement.',
    controlsAr:
      'اقرأ الحركة البسيطة، شغّل مؤقت الـ ١٥ ثانية، طبّقها بهدوء في مكانك، ثم سجل شعورك بعدها.',
    controlsEn:
      'Read the gentle stretch prompt, run the 15-second timer, move comfortably, then note how you feel.',
    winConditionAr:
      'إتمام عداد الـ ١٥ ثانية واختيار أثر الحركة على نشاطك.',
    winConditionEn:
      'Finish the 15-second movement timer and select your post-movement check-in.',
    scoringAndHintsAr:
      'نقاط XP عند إتمام التحدي؛ يمكنك دائماً تخطي أي حركة لا تناسبك جسدياً.',
    scoringAndHintsEn:
      'Grants XP on completion; feel free to skip any movement that feels uncomfortable.',
    navigationAndExitAr:
      'اختر حركة جديدة أو اضغط العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Pick another movement or tap Back to exit.',
  },
  'emotion-roulette': {
    gameId: 'emotion-roulette',
    icon: '🎡',
    titleAr: 'روليت المشاعر والتحديات العفوية',
    titleEn: 'Emotion & Micro-Action Roulette',
    ideaAndGoalAr:
      'تدوير عجلة لطيفة تقترح عليك سؤالاً شعورياً أو فعلاً طيباً بسيطاً يكسر رتابة اليوم.',
    ideaAndGoalEn:
      'Spin an interactive wheel to land on a spontaneous emotional check-in or kind micro-action.',
    controlsAr:
      'اضغط زر التدوير ثم الإيقاف لتستقر العجلة على بطاقة التحدي وتفاعل معها.',
    controlsEn:
      'Tap Spin to rotate the wheel and complete the prompt where it lands.',
    winConditionAr:
      'تنفيذ أو تأمل البطاقة التي توقفت عندها العجلة وتأكيد الإتمام.',
    winConditionEn:
      'Reflect on or complete the selected wheel prompt.',
    scoringAndHintsAr:
      'تمنحك كل دورة مكتملة نقاط XP ويمكنك إعادة التدوير لتجربة بطاقات جديدة.',
    scoringAndHintsEn:
      'Earn XP per completed spin and spin again anytime.',
    navigationAndExitAr:
      'أدر العجلة مجدداً أو اضغط زر العودة للخروج.',
    navigationAndExitEn:
      'Spin again or tap Back to return Home.',
  },
  'scratch-to-reveal': {
    gameId: 'scratch-to-reveal',
    icon: '🖌️',
    titleAr: 'مسح الحبر وكشط الحقيقة',
    titleEn: 'Scratch to Reveal Calm Truths',
    ideaAndGoalAr:
      'تمرير الإصبع بهدوء لمسح طبقة الضباب الرمادي على اللوحة وكشف رسالة مطمئنة ورسوم مبهجة.',
    ideaAndGoalEn:
      'Gently rub away the dark ink layer on the canvas to uncover a warm visual message underneath.',
    controlsAr:
      'اسحب بإصبعك أو الماوس ذهاباً وإياباً فوق منطقة الحبر حتى تنكشف اللوحة المخفية.',
    controlsEn:
      'Swipe your finger or drag your cursor across the scratch card surface.',
    winConditionAr:
      'مسح النسبة الكافية من طبقة الحبر لظهور الرسالة كاملة بوضوح.',
    winConditionEn:
      'Clear enough of the surface for the full comforting card to appear.',
    scoringAndHintsAr:
      'تحصل على نقاط XP عند انكشاف البطاقة مع إمكانية الانتقال لبطاقة كشط جديدة.',
    scoringAndHintsEn:
      'Awards XP automatically once revealed.',
    navigationAndExitAr:
      'جرّب بطاقة أخرى أو اضغط زر العودة أعلى الصفحة للخروج.',
    navigationAndExitEn:
      'Load the next card or tap Back to exit.',
  },
  'multi-sensory-quest': {
    gameId: 'multi-sensory-quest',
    icon: '🌿',
    titleAr: 'صندوق الأسرار والحواس الخمس',
    titleEn: 'Multi-Sensory Room Quest',
    ideaAndGoalAr:
      'تنفيذ مهام حسية واقعية في محيطك (ملمس دافئ، رائحة هادئة، صوت مريح) لتهدئة التشتت الذهني.',
    ideaAndGoalEn:
      'Engage real-world senses around you (touch, scent, sound, sight) to settle mental scatter.',
    controlsAr:
      'اتبع بطاقة الحاسة المعروضة، نفذ التجربة البسيطة حولك، ثم اضغط إتمام للانتقال للحاسة التالية.',
    controlsEn:
      'Follow each sensory card in your environment and tap Done to advance.',
    winConditionAr:
      'إكمال محطات الحواس المتتالية في الصندوق حتى اكتمال الجولة.',
    winConditionEn:
      'Complete all sensory stations in the quest.',
    scoringAndHintsAr:
      'نقاط XP مع معلومة علمية مبسطة عن أثر كل حاسة في تهدئة التوتر.',
    scoringAndHintsEn:
      'Grants XP plus a short note on how sensory cues support calm.',
    navigationAndExitAr:
      'انتقل بين البطاقات بالتتابع أو اضغط العودة للخروج.',
    navigationAndExitEn:
      'Step through the cards or tap Back to exit.',
  },
  'speed-lie-detector': {
    gameId: 'speed-lie-detector',
    icon: '🕵️',
    titleAr: 'رادار الصدق الذاتي الخاطف',
    titleEn: 'Self-Honesty Reflex Check',
    ideaAndGoalAr:
      'الإجابة التلقائية السريعة على أسئلة لطيفة تساعدك على ملاحظة مشاعرك الحقيقية قبل الإفراط في التحليل.',
    ideaAndGoalEn:
      'Answer quick, light-hearted prompts instinctively before overthinking kicks in.',
    controlsAr:
      'اقرأ السؤال القصير واختر الإجابة الأقرب لقلبك قبل نفاد المؤقت السريع.',
    controlsEn:
      'Read each prompt and tap your honest instinctive response before the quick bar ends.',
    winConditionAr:
      'إتمام سلسلة الأسئلة السريعة للوصول إلى قراءة تأملية لطيفة ومشجعة.',
    winConditionEn:
      'Finish all quick prompts to view your encouraging reflection.',
    scoringAndHintsAr:
      'نقاط XP عند إنهاء السلسلة؛ الهدف هو الاستكشاف الصادق مع النفس وليس التسابق.',
    scoringAndHintsEn:
      'Awards XP on completion—designed for gentle self-honesty, not pressure.',
    navigationAndExitAr:
      'يمكنك إعادة التجربة أو الضغط على زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Replay or tap Back to return Home.',
  },
  journey: {
    gameId: 'journey',
    icon: '🧭',
    titleAr: 'رحلة المواقف والقصص التفاعلية',
    titleEn: 'Interactive Story Journey',
    ideaAndGoalAr:
      'معايشة موقف حياتي واقعي عبر ٥ محطات لاكتشاف كيف تغيّر الفكرة التلقائية مشاعرنا وردود أفعالنا.',
    ideaAndGoalEn:
      'Walk through a realistic 5-stage story to see how automatic thoughts shape feelings and actions.',
    controlsAr:
      'اقرأ الموقف، ثم اختر في كل محطة الفكرة التلقائية، الشعور الجسدي، والتصرف، وجرّب ميزة «إعادة الزمن وتبديل الفكرة».',
    controlsEn:
      'Read the scene, choose a thought, feeling, and action at each stage, then try Rewind & Reframe.',
    winConditionAr:
      'إتمام المحطات الخمس للقصة والوصول إلى البديل المتوازن في نهاية الفصل.',
    winConditionEn:
      'Complete all 5 stages and explore the healthy alternative path.',
    scoringAndHintsAr:
      'تحصل على تقييم من ١ إلى ٣ نجوم يُحفظ على القصة، مع إمكانية فتح نافذة «وقفة أنفاس» في أي لحظة.',
    scoringAndHintsEn:
      'Earn 1–3 stars saved per story chapter, with Mindful Breathing available anytime.',
    navigationAndExitAr:
      'اختر قصة أخرى من الخريطة بعد النهاية أو اضغط زر العودة أعلى الصفحة للخروج.',
    navigationAndExitEn:
      'Return to the map to pick another story chapter anytime.',
  },
  'challenge-separate': {
    gameId: 'challenge-separate',
    icon: '🗂️',
    titleAr: 'افصلهم عن بعض (فكرة أم شعور أم حقيقة؟)',
    titleEn: 'Separate Them: Thought, Feeling, or Fact?',
    ideaAndGoalAr:
      'التدرب على التمييز الدقيق بين «الحقيقة الموضوعية»، «الفكرة أو التفسير»، و«الشعور العاطفي».',
    ideaAndGoalEn:
      'Practice distinguishing objective Facts from subjective Thoughts and Feelings.',
    controlsAr:
      'اقرأ العبارة المعروضة في البطاقة، ثم اضغط التصنيف الصحيح: (فكرة 💭، شعور ❤️، أو حقيقة 📌).',
    controlsEn:
      'Read the statement card and tap Thought, Feeling, or Fact.',
    winConditionAr:
      'تصنيف جميع العبارات في الجولة والاطلاع على التفسير الواضح لكل عبارة.',
    winConditionEn:
      'Classify all statements in the round with instant explanatory feedback.',
    scoringAndHintsAr:
      'تكسب نقاط XP عن كل تصنيف صحيح، وحتى عند الخطأ تحصل على توضيح هادئ يعزز الفهم.',
    scoringAndHintsEn:
      'Earn XP for accurate classifications and learn from gentle explanations.',
    navigationAndExitAr:
      'اضغط البطاقة التالية للمتابعة أو زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Tap Next Card to continue or Back to exit.',
  },
  'challenge-feeling': {
    gameId: 'challenge-feeling',
    icon: '🎭',
    titleAr: 'سمِّ الشعور الحقيقي',
    titleEn: 'Name the Underlying Feeling',
    ideaAndGoalAr:
      'قراءة الإشارات الجسدية والموقف لاكتشاف الشعور الأساسي الأعمق الذي يختبئ أحياناً خلف الضيق أو العصبية.',
    ideaAndGoalEn:
      'Read situational clues to name the primary emotion beneath surface reactions.',
    controlsAr:
      'اقرأ وصف الموقف والدلائل المساعدة، ثم اختر اسم الشعور الأدق من الخيارات.',
    controlsEn:
      'Review the situation and clues, then select the most accurate emotion label.',
    winConditionAr:
      'إكمال جميع مواقف تسمية المشاعر في الجولة بنجاح.',
    winConditionEn:
      'Complete all emotion-naming prompts in the round.',
    scoringAndHintsAr:
      'نقاط XP لكل اكتشاف دقيق، مع خلاصة تشرح الفارق بين المشاعر المتشابهة.',
    scoringAndHintsEn:
      'Awards XP and clarifies subtle differences between emotions.',
    navigationAndExitAr:
      'انتقل للموقف التالي أو اضغط زر العودة للخروج.',
    navigationAndExitEn:
      'Continue to the next prompt or tap Back to exit.',
  },
  'challenge-perspective': {
    gameId: 'challenge-perspective',
    icon: '🔭',
    titleAr: 'غيّر زاوية الرؤية',
    titleEn: 'Change Perspective',
    ideaAndGoalAr:
      'رصد أنماط التفكير الضيقة (مثل التهويل أو قراءة الأفكار) واستبدالها بزاوية نظر أوسع وأخف عبئاً.',
    ideaAndGoalEn:
      'Spot rigid thinking traps and shift toward a broader, lighter perspective.',
    controlsAr:
      'اقرأ الموقف والفكرة التلقائية الثقيلة، واستعن بالسؤال المرشد لاختيار المنظور البديل الأكثر توازناً.',
    controlsEn:
      'Read the automatic thought, use the guiding question, and pick the most helpful perspective.',
    winConditionAr:
      'إتمام جميع بطاقات تغيير الزاوية وتخفيف مؤشر العبء الذهني.',
    winConditionEn:
      'Complete all perspective shifts in the session.',
    scoringAndHintsAr:
      'تُمنح نقاط XP بحسب درجة اتزان المنظور المختار، مع شرح واضح لنمط التفكير.',
    scoringAndHintsEn:
      'Earn XP based on helpfulness scores alongside clear cognitive insights.',
    navigationAndExitAr:
      'اضغط التالي للمتابعة أو زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Tap Next to proceed or Back to exit.',
  },
  'challenge-react': {
    gameId: 'challenge-react',
    icon: '⏸️',
    titleAr: 'قبل ما تردّ (وقفة الوعي)',
    titleEn: 'Before You React',
    ideaAndGoalAr:
      'إبطاء لحظة الاندفاع عند الغضب أو التوتر ومقارنة أثر الرد المتسرع والرد المتجنب والرد الواعي.',
    ideaAndGoalEn:
      'Create a mindful pause during emotional surges and compare impulsive, avoidant, and conscious actions.',
    controlsAr:
      'لاحظ إشارات الجسد في الموقف، خذ نفساً إذا رغبت، ثم اختر طريقة الرد لمشاهدة أثرها القريب والبعيد.',
    controlsEn:
      'Review the trigger and body cues, optionally pause to breathe, and select a response option.',
    winConditionAr:
      'استكشاف المواقف واختيار الاستجابة الواعية التي تحفظ هدوءك وعلاقاتك.',
    winConditionEn:
      'Work through all scenarios and unlock each mindful key.',
    scoringAndHintsAr:
      'نقاط XP عند اختيار الرد الواعي، مع زر مباشر لفتح «وقفة أنفاس» أثناء اللعب.',
    scoringAndHintsEn:
      'Awards XP for conscious responses with one-tap access to Mindful Breathing.',
    navigationAndExitAr:
      'انتقل للموقف التالي أو اضغط زر العودة للخروج.',
    navigationAndExitEn:
      'Move to the next scenario or tap Back to exit.',
  },
  'decisional-balance': {
    gameId: 'decisional-balance',
    icon: '⚖️',
    titleAr: 'ميزان الأفكار والقرارات',
    titleEn: 'Decisional Balance Scales',
    ideaAndGoalAr:
      'ترتيب القرارات المحيّرة بهدوء عبر وضع المكاسب والمخاوف في كفتي ميزان بصري واضح.',
    ideaAndGoalEn:
      'Clarify tough choices calmly by weighing pros, costs, and values visually on balanced scales.',
    controlsAr:
      'أضف أو اختر عناصر الكفتين وحدد ثقل كل عامل بالنسبة لقيمك وأولوياتك.',
    controlsEn:
      'Place considerations onto each side of the scale and adjust their personal weight.',
    winConditionAr:
      'إكمال موازنة العوامل للوصول إلى خلاصة واضحة تساعدك على رؤية الصورة الكاملة.',
    winConditionEn:
      'Complete weighing the factors to view your structured clarity summary.',
    scoringAndHintsAr:
      'نقاط XP عند إتمام الموازنة مع إمكانية حفظ الخلاصة في دفتر رحلتك.',
    scoringAndHintsEn:
      'Grants XP upon completion with optional saving.',
    navigationAndExitAr:
      'جرّب قراراً جديداً أو اضغط زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Weigh another decision or tap Back to exit.',
  },
  'thought-shredder': {
    gameId: 'thought-shredder',
    icon: '🌊',
    titleAr: 'مفرمة الأفكار ونهر التحرر',
    titleEn: 'Thought Shredder & Release River',
    ideaAndGoalAr:
      'التخفف الرمزي من الأفكار الملحّة المتكررة عبر كتابتها أو اختيارها ثم تمزيقها وتركها تمضي.',
    ideaAndGoalEn:
      'Symbolically let go of intrusive, repetitive worries by shredding them and releasing the scraps.',
    controlsAr:
      'اكتب الفكرة المزعجة أو اختر مثالاً جاهزاً، ثم اضغط زر التمزيق أو الإلقاء في النهر الهادئ.',
    controlsEn:
      'Type a heavy thought or pick a sample card, then tap Shred to release it.',
    winConditionAr:
      'إتمام عملية التفريغ الرمزي واستبدال المساحة الفارغة بجملة مطمئنة.',
    winConditionEn:
      'Complete the release animation and choose a grounding anchor sentence.',
    scoringAndHintsAr:
      'تُكافأ بنقاط XP؛ ما يتم تمزيقه لا يُخزن أبداً حفاظاً على خصوصيتك التامة.',
    scoringAndHintsEn:
      'Awards XP; shredded text is never saved, keeping your release completely private.',
    navigationAndExitAr:
      'فرّغ فكرة أخرى أو اضغط زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Release another thought or tap Back to exit.',
  },
  'core-needs-compass': {
    gameId: 'core-needs-compass',
    icon: '🧭',
    titleAr: 'بوصلة الاحتياجات النفسية',
    titleEn: 'Core Needs Compass',
    ideaAndGoalAr:
      'ترجمة مشاعر الضيق غير المفهومة إلى احتياج إنساني واضح (مثل الراحة، التقدير، الأمان، أو المساحة الخاصة).',
    ideaAndGoalEn:
      'Translate vague emotional discomfort into a clear underlying need such as rest, safety, or connection.',
    controlsAr:
      'حدد الشعور الحاضر حالياً على البوصلة، واتبع الأسئلة المبسطة لاكتشاف الاحتياج المرتبط به.',
    controlsEn:
      'Select what you are feeling on the compass and follow the guided prompts to identify your core need.',
    winConditionAr:
      'تحديد الاحتياج الأساسي واختيار خطوة عملية صغيرة لتلبيته اليوم.',
    winConditionEn:
      'Identify your core need and pick one realistic micro-step to honor it.',
    scoringAndHintsAr:
      'نقاط XP عند اكتمال البوصلة مع إمكانية حفظ النتيجة في دفتر رحلتك.',
    scoringAndHintsEn:
      'Awards XP and allows saving your compass takeaway.',
    navigationAndExitAr:
      'أعد ضبط البوصلة لشعور آخر أو اضغط العودة للخروج.',
    navigationAndExitEn:
      'Explore another feeling or tap Back to exit.',
  },
  'inner-mirror': {
    gameId: 'inner-mirror',
    icon: '🪞',
    titleAr: 'مرآة الحوار الداخلي والناقد الرحيم',
    titleEn: 'Inner Dialogue Mirror',
    ideaAndGoalAr:
      'إقامة حوار هادئ بين صوت القلق المتشدد وصوت الحكمة المتعاطف بداخلك للوصول إلى تفاهم متزن.',
    ideaAndGoalEn:
      'Facilitate a gentle dialogue between your anxious inner critic and your compassionate wise voice.',
    controlsAr:
      'اختر عبارة الصوت المتوتر، ثم اختر أو صغ ردّ الصوت الحكيم المساند في المرآة المقابلة.',
    controlsEn:
      'Select the inner critic prompt and pair it with a supportive, grounded response.',
    winConditionAr:
      'إتمام جولات الحوار الداخلي حتى تتضح الرؤية المتعاطفة.',
    winConditionEn:
      'Complete the mirror dialogue steps to reach a calm synthesis.',
    scoringAndHintsAr:
      'نقاط XP عن كل جولة حوار مكتملة.',
    scoringAndHintsEn:
      'Earn XP for completing the dialogue reflection.',
    navigationAndExitAr:
      'انتقل للجولة التالية أو اضغط زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Continue or tap Back to return Home.',
  },
  'cognitive-reframing-puzzle': {
    gameId: 'cognitive-reframing-puzzle',
    icon: '🧩',
    titleAr: 'صانع الأنماط: فك شفرة الأفكار التلقائية',
    titleEn: 'Cognitive Reframing Puzzle',
    ideaAndGoalAr:
      'تركيب قطع التفكير المنطقي لكشف الفخ الذهني في الموقف وبناء فكرة بديلة متماسكة.',
    ideaAndGoalEn:
      'Match cognitive distortion clues with balanced evidence pieces to complete the reframing puzzle.',
    controlsAr:
      'اقرأ الفكرة التلقائية وطابقها مع نوع المغالطة الذهنية والدليل الواقعي المقابل لها.',
    controlsEn:
      'Pair the automatic thought with its thinking trap and realistic counter-evidence.',
    winConditionAr:
      'مطابقة جميع القطع المعرفية في التحدي بنجاح.',
    winConditionEn:
      'Correctly match all puzzle segments in the round.',
    scoringAndHintsAr:
      'تُمنح نقاط XP مع تلميحات توضيحية تشرح كل نمط تفكير ببساطة.',
    scoringAndHintsEn:
      'Grants XP with clear hints explaining each thinking pattern.',
    navigationAndExitAr:
      'انتقل للغز التالي أو اضغط زر العودة للخروج.',
    navigationAndExitEn:
      'Advance to the next puzzle or tap Back to exit.',
  },
  'inner-labyrinth': {
    gameId: 'inner-labyrinth',
    icon: '🌀',
    titleAr: 'متاهة الهدوء التفاعلية',
    titleEn: 'Mindful Inner Labyrinth',
    ideaAndGoalAr:
      'السير الهادئ خطوة بخطوة نحو مركز السكينة في متاهة تأملية لا تحتوي على طرق مسدودة معاقِبة.',
    ideaAndGoalEn:
      'Walk step-by-step toward the calm center of a contemplative labyrinth with reflective waypoints.',
    controlsAr:
      'اضغط على النقطة التالية في الممر أو استخدم أزرار الاتجاهات وتأمل المحطات القصيرة على الطريق.',
    controlsEn:
      'Tap along the path waypoints or use direction buttons, pausing briefly at reflection stops.',
    winConditionAr:
      'الوصول إلى قلب المتاهة المضيء وإتمام وقفة التأمل الهادئة.',
    winConditionEn:
      'Reach the luminous center of the labyrinth.',
    scoringAndHintsAr:
      'نقاط XP عند بلوغ المركز؛ استمتع بالتمهل فالمتاهة مصممة للتهدئة لا للسرعة.',
    scoringAndHintsEn:
      'Awards XP upon reaching the center at a calm, unhurried pace.',
    navigationAndExitAr:
      'ابدأ مساراً جديداً أو اضغط زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Start a fresh walk or tap Back to exit.',
  },
  'digital-release-ritual': {
    gameId: 'digital-release-ritual',
    icon: '🕯️',
    titleAr: 'مرآة الأعماق: طقس التخفف الرقمي',
    titleEn: 'Digital Letting-Go Ritual',
    ideaAndGoalAr:
      'تحرير شعور عالق أو عتب غير منطوق في مساحة رمزية هادئة تحوّله إلى نقاط ضوء تتلاشى بسلام.',
    ideaAndGoalEn:
      'Release an unspoken weight in a serene visual space where words dissolve gently into light.',
    controlsAr:
      'اكتب بضع كلمات تعبّر عما يثقل صدرك (أو اختر شعوراً جاهزاً) واضغط مطولاً لتحريره بصرياً.',
    controlsEn:
      'Write a brief weight or select a preset feeling, then press and hold to dissolve it into light.',
    winConditionAr:
      'إتمام تحرير العبء المختار واختيار جملة ختامية مطمئنة.',
    winConditionEn:
      'Complete the gentle release step and receive your closing affirmation.',
    scoringAndHintsAr:
      'نقاط XP عند الإتمام، مع خصوصية كاملة دون حفظ ما تم تحريره.',
    scoringAndHintsEn:
      'Grants XP on completion; released words dissolve privately without storage.',
    navigationAndExitAr:
      'أعد التجربة أو اضغط زر العودة للخروج.',
    navigationAndExitEn:
      'Repeat or tap Back to return Home.',
  },
  'relational-energy-matrix': {
    gameId: 'relational-energy-matrix',
    icon: '🔋',
    titleAr: 'مصفوفة طاقة الروابط والعلاقات',
    titleEn: 'Relational Energy Matrix',
    ideaAndGoalAr:
      'ملاحظة أثر التفاعلات اليومية على طاقتك النفسية والتمييز بين الروابط المجدِّدة للطاقة والمستنزِفة لها.',
    ideaAndGoalEn:
      'Map everyday interactions to see which habits replenish your energy and which drain it.',
    controlsAr:
      'وزّع بطاقات المواقف والتفاعلات على مربعات المصفوفة بحسب أثرها الفعلي على طاقتك.',
    controlsEn:
      'Place interaction cards onto the energy matrix quadrants based on how they affect you.',
    winConditionAr:
      'إكمال توزيع البطاقات واستعراض خطة التوازن الطاقي المقترحة.',
    winConditionEn:
      'Place all cards to view your balanced relational energy summary.',
    scoringAndHintsAr:
      'نقاط XP عند اكتمال المصفوفة مع نصائح عملية لحماية طاقتك بلطف.',
    scoringAndHintsEn:
      'Awards XP alongside practical boundary and replenishment tips.',
    navigationAndExitAr:
      'اضغط إنهاء أو العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Tap Finish or Back to exit.',
  },
  'resonance-chamber': {
    gameId: 'resonance-chamber',
    icon: '🔔',
    titleAr: 'غرفة الصدى: تفكيك الصوت الناقد',
    titleEn: 'Resonance Chamber',
    ideaAndGoalAr:
      'خفض صدى العبارات المقلقة المتكررة في الذهن واستبدالها بنغمة فكرية أهدأ وأكثر واقعية.',
    ideaAndGoalEn:
      'Turn down the echo of repetitive critical thoughts and tune into a calmer, realistic frequency.',
    controlsAr:
      'اختر الفكرة ذات الصدى العالي، ثم خفّض حدتها عبر خطوات التفكيك واختيار النغمة البديلة.',
    controlsEn:
      'Select an echoing thought, dial down its intensity through guided prompts, and choose a calm anchor.',
    winConditionAr:
      'تهدئة جميع الموجات المزعجة في الغرفة للوصول إلى حالة السكون الصافي.',
    winConditionEn:
      'Settle the chamber echoes to reach calm clarity.',
    scoringAndHintsAr:
      'نقاط XP عند إتمام ضبط الترددات الذهنية.',
    scoringAndHintsEn:
      'Earn XP upon harmonizing the chamber.',
    navigationAndExitAr:
      'جرّب جولة جديدة أو اضغط العودة للخروج.',
    navigationAndExitEn:
      'Start another round or tap Back to exit.',
  },
  'mental-loom': {
    gameId: 'mental-loom',
    icon: '🧶',
    titleAr: 'نول الحياكة الذهنية: شبكة الأمان',
    titleEn: 'Mental Safety Loom',
    ideaAndGoalAr:
      'نسج خيوط مصادر القوة والدعم والمهارات الشخصية لتكوين شبكة أمان تتذكرها وقت الأزمات.',
    ideaAndGoalEn:
      'Weave together personal strengths, calming habits, and trusted supports into a visual safety net.',
    controlsAr:
      'اختر خيوط المساندة (عادات تهدئة، أشخاص آمنون، نقاط قوة) واضغط لنسجها على النول التفاعلي.',
    controlsEn:
      'Pick supportive threads across categories and tap to weave them onto the loom.',
    winConditionAr:
      'اكتمال نسيج شبكة الأمان الخاصة بك بجميع ألوانها.',
    winConditionEn:
      'Weave all required threads to complete your personal tapestry.',
    scoringAndHintsAr:
      'نقاط XP مع إمكانية حفظ شبكتك في دفتر رحلتك للرجوع إليها وقت الحاجة.',
    scoringAndHintsEn:
      'Grants XP and lets you save your woven takeaways to My Journey.',
    navigationAndExitAr:
      'أعد النسج أو اضغط زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Weave again or tap Back to exit.',
  },
  'worry-sandbox': {
    gameId: 'worry-sandbox',
    icon: '⏳',
    titleAr: 'ساعة الرمل العكسية: صندوق تأجيل القلق',
    titleEn: 'Worry Containment Sandbox',
    ideaAndGoalAr:
      'حفظ الهواجس غير العاجلة في صندوق آمن مؤقت حتى تستعيد تركيزك في حاضرك بدلاً من الاستغراق فيها الآن.',
    ideaAndGoalEn:
      'Contain non-urgent worries inside a scheduled sandbox so you can reclaim focus right now.',
    controlsAr:
      'سجّل الفكرة الشاغلة أو اخترها، ضعها في صندوق الرمل، وحدد وقتاً هادئاً لاحقاً لمراجعتها إن لزم.',
    controlsEn:
      'Place a nagging worry into the sandbox container and set aside present-moment space.',
    winConditionAr:
      'إيداع القلق في الصندوق وإغلاقه بوعي مع تمرين تركيز قصير في اللحظة الحالية.',
    winConditionEn:
      'Store the worry calmly and complete the brief grounding reset.',
    scoringAndHintsAr:
      'نقاط XP عند إتمام خطوات الاحتواء الهادئ.',
    scoringAndHintsEn:
      'Awards XP when the containment step completes.',
    navigationAndExitAr:
      'أضف فكرة أخرى أو اضغط زر العودة للخروج.',
    navigationAndExitEn:
      'Contain another worry or tap Back to exit.',
  },
  'blooming-gratitude': {
    gameId: 'blooming-gratitude',
    icon: '🌸',
    titleAr: 'شجرة الامتنان ذات البراعم المتفتحة',
    titleEn: 'Blooming Gratitude Tree',
    ideaAndGoalAr:
      'رعاية شجرة بصرية تتفتح براعمها وأزهارها مع كل تفصيلة طيبة أو نعمة صغيرة تتذكرها في حياتك.',
    ideaAndGoalEn:
      'Nurture an interactive tree whose blossoms open with each small moment of appreciation you add.',
    controlsAr:
      'اضغط على الأغصان لإضافة برعم واختيار أو كتابة شيء بسيط تشعر بالامتنان لوجوده.',
    controlsEn:
      'Tap branches to add a bud and write or choose something small you appreciate today.',
    winConditionAr:
      'تفتّح أزهار الشجرة في الجلسة واكتمال لوحة الامتنان.',
    winConditionEn:
      'Bloom the target blossoms on your tree.',
    scoringAndHintsAr:
      'نقاط XP عن كل زهرة متفتحة مع إمكانية حفظها في دفتر رحلتك.',
    scoringAndHintsEn:
      'Earn XP as blossoms open and optionally save them to My Journey.',
    navigationAndExitAr:
      'أضف براعم إضافية أو اضغط زر العودة للرجوع إلى الخريطة.',
    navigationAndExitEn:
      'Add more blossoms or tap Back to exit.',
  },
  'mindful-organizer': {
    gameId: 'mindful-organizer',
    icon: '📚',
    titleAr: 'ترتيب الفوضى والرفوف (التناغم البصري)',
    titleEn: 'Mindful Shelf Organizer',
    ideaAndGoalAr:
      'إعادة ترتيب العناصر المبعثرة على الرفوف المتخصصة لتحقيق التناغم البصري وتهدئة الشعور بالفوضى.',
    ideaAndGoalEn:
      'Sort scattered items onto their matching themed shelves to restore visual harmony and calm.',
    controlsAr:
      'اضغط على العنصر لاختياره ثم اضغط على الرف أو الخانة المناسبة لنقله أو تبديل مكانه.',
    controlsEn:
      'Tap an item to select it, then tap the target shelf slot to place or swap it.',
    winConditionAr:
      'رفع مؤشر التناغم إلى ١٠٠٪ بوضع كل عنصر في رفّه الصحيح عبر ٤ مراحل متدرجة.',
    winConditionEn:
      'Reach 100% shelf harmony by placing all items onto their matching shelves across 4 stages.',
    scoringAndHintsAr:
      'تحصل على ١ إلى ٣ نجوم ونقاط XP بحسب كفاءة الحركات، مع تلميح يوضح فئة كل رف.',
    scoringAndHintsEn:
      'Earn 1–3 stars and XP based on move efficiency, with clear shelf category labels.',
    navigationAndExitAr:
      'انتقل للمرحلة التالية من نافذة الفوز أو شريط المراحل، أو اضغط العودة للخروج.',
    navigationAndExitEn:
      'Advance via the completion modal or Stage Selector, or tap Back to exit.',
  },
  'zen-puzzle': {
    gameId: 'zen-puzzle',
    icon: '🪨',
    titleAr: 'بازل توازن أحجار الزن والماندالا (٣٥ مرحلة)',
    titleEn: 'Zen Stone Balance Puzzle (35 Stages)',
    ideaAndGoalAr:
      'رصّ أحجار الزن فوق القاعدة بتوازن دقيق دون سقوط البرج عبر ٥ عوالم طبيعية متدرجة.',
    ideaAndGoalEn:
      'Stack Zen stones steadily onto the pedestal without tipping the tower across 35 stages in 5 worlds.',
    controlsAr:
      'اختر الحجر التالي وحدد موضع إسقاطه الأفقي بعناية مراعياً عرض الحجر ومركز الثقل وحركة الرياح في المراحل المتقدمة.',
    controlsEn:
      'Position each stone horizontally above the stack, watching center-of-mass tilt and wind indicators.',
    winConditionAr:
      'وضع جميع أحجار المرحلة وثبات البرج خلال عدّاد الاستقرار النهائي دون انهيار.',
    winConditionEn:
      'Stack all stones in the stage and hold steady balance through the stability countdown.',
    scoringAndHintsAr:
      'تُكافأ بـ ١ إلى ٣ نجوم ونقاط XP حسب استقامة التوازن وقلة المحاولات.',
    scoringAndHintsEn:
      'Earn 1–3 stars and XP based on tower alignment stability and attempts.',
    navigationAndExitAr:
      'تنقّل بين العوالم والمراحل الـ ٣٥ من الخريطة العلوية، أو اضغط زر العودة للخروج.',
    navigationAndExitEn:
      'Choose among the 35 stages via the selector or tap Back to exit.',
  },
  'emotion-sort-puzzle': {
    gameId: 'emotion-sort-puzzle',
    icon: '🧪',
    titleAr: 'بازل فرز وسكب قوارير المشاعر',
    titleEn: 'Emotion Vials Sort Puzzle',
    ideaAndGoalAr:
      'فرز طبقات الألوان المختلطة داخل القوارير الزجاجية حتى تحتوي كل قارورة على لون شعوري واحد صافٍ.',
    ideaAndGoalEn:
      'Sort mixed colored layers across glass vials until each emotion color rests purely in its own vial.',
    controlsAr:
      'اضغط على قارورة لرفعها ثم اضغط على قارورة أخرى فارغة أو يطابق لونها العلوي نفس اللون للسكب، مع توفر زر «تراجع».',
    controlsEn:
      'Tap a source vial then tap an empty vial or one with a matching top color to pour; use Undo anytime.',
    winConditionAr:
      'توحيد كل لون في قارورة مستقلة بالكامل عبر ٥ مراحل متدرجة الصعوبة.',
    winConditionEn:
      'Group every color completely into separate vials across 5 progressive stages.',
    scoringAndHintsAr:
      'تحصل على ٣ نجوم ونقاط XP عند الحل بعدد حركات مثالي، مع إمكانية الإعادة أو التراجع دون خسارة تقدمك السابق.',
    scoringAndHintsEn:
      'Earn up to 3 stars and XP based on move count, with free Undo and Restart buttons.',
    navigationAndExitAr:
      'انتقل للمرحلة التالية من نافذة الإنجاز أو شريط المراحل، أو اضغط العودة للخروج.',
    navigationAndExitEn:
      'Proceed to the next stage via the modal or Stage Selector, or tap Back to exit.',
  },
};
