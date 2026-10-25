import { recordStreakActivity } from './streakManager';
import { soundManager } from './audio';
import { triggerConfetti } from './confetti';

export type StageDifficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export interface StageDefinition {
  stageNumber: number;
  titleAr: string;
  titleEn: string;
  difficulty: StageDifficulty;
  difficultyAr: string;
  difficultyEn: string;
  descriptionAr: string;
  descriptionEn: string;
  xpReward: number;
  criteriaAr: string;
  criteriaEn: string;
}

export interface GameProgressData {
  gameId: string;
  currentStage: number;
  unlockedStages: number[];
  stars: Record<number, number>; // stageNumber -> 1, 2, or 3
  bestMoves: Record<number, number>; // stageNumber -> moves count
  completedStagesCount: number;
}

const STORAGE_PREFIX = 'nesma_game_levels_progression_';

// Registered Stage Definitions for our games
export const GAME_STAGES_CONFIG: Record<string, StageDefinition[]> = {
  // 1. بازل فرز قوارير المشاعر
  'emotion-sort-puzzle': [
    {
      stageNumber: 1,
      titleAr: 'المبتدئ: سكب السكينة والحزن',
      titleEn: 'Beginner: Serenity & Grief',
      difficulty: 'easy',
      difficultyAr: 'مبتدئ وسهل',
      difficultyEn: 'Beginner',
      descriptionAr: '٣ قوارير فقط ولونان؛ خطوة تمهيدية لتعلم فن السكب والفرز العاطفي المريح.',
      descriptionEn: '3 vials and 2 emotions; gentle introduction to liquid sorting.',
      xpReward: 40,
      criteriaAr: 'أقل من ٨ نقلات = ٣ نجوم',
      criteriaEn: 'Under 8 moves = 3 Stars'
    },
    {
      stageNumber: 2,
      titleAr: 'المتوسط: ثلاثي المشاعر المتشابكة',
      titleEn: 'Intermediate: The Emotional Triad',
      difficulty: 'medium',
      difficultyAr: 'متوسط ومتدرج',
      difficultyEn: 'Intermediate',
      descriptionAr: '٤ قوارير و٣ ألوان (الحزن، الأمان، المحبة)؛ تتطلب تخطيط خطوتين مسبقاً.',
      descriptionEn: '4 vials and 3 emotions; requires 2-step foresight.',
      xpReward: 60,
      criteriaAr: 'أقل من ١٢ نقلة = ٣ نجوم',
      criteriaEn: 'Under 12 moves = 3 Stars'
    },
    {
      stageNumber: 3,
      titleAr: 'المتقدم: الألوان الأربعة الكلاسيكية',
      titleEn: 'Advanced: The Four Pillars',
      difficulty: 'hard',
      difficultyAr: 'متقدم وتحدٍ',
      difficultyEn: 'Advanced',
      descriptionAr: '٥ قوارير و٤ مشاعر كاملة (الحزن، الأمان، المحبة، والدهشة) مع قارورة فارغة واحدة.',
      descriptionEn: '5 vials with all 4 emotions and single empty buffer vial.',
      xpReward: 90,
      criteriaAr: 'أقل من ١٨ نقلة = ٣ نجوم',
      criteriaEn: 'Under 18 moves = 3 Stars'
    },
    {
      stageNumber: 4,
      titleAr: 'الخبير: التيارات المتداخلة المعقدة',
      titleEn: 'Expert: Entangled Currents',
      difficulty: 'expert',
      difficultyAr: 'خبير واستراتيجي',
      difficultyEn: 'Expert',
      descriptionAr: '٦ قوارير بطبقات معكوسة وقارورتين فارغتين؛ اختبار للذكاء التخطيطي وحفظ السكينة.',
      descriptionEn: '6 vials with inverted layering; requires mindful patience.',
      xpReward: 130,
      criteriaAr: 'أقل من ٢٤ نقلة = ٣ نجوم',
      criteriaEn: 'Under 24 moves = 3 Stars'
    },
    {
      stageNumber: 5,
      titleAr: 'الماستر: نقاء إكسير الحكمة التام',
      titleEn: 'Grand Master: Pure Clarity Elixir',
      difficulty: 'master',
      difficultyAr: 'ماستر عبقري',
      difficultyEn: 'Master Flow',
      descriptionAr: '٧ قوارير مع لون خامس سري (الأمل الذهبي)؛ تحدي العباقرة للتنظيم العاطفي الأسمى.',
      descriptionEn: '7 vials including the rare Golden Hope elixir; ultimate master test.',
      xpReward: 200,
      criteriaAr: 'إكمال الفرز بنقاء تام = وسام الإكسير الأعظم',
      criteriaEn: 'Full purification = Grand Elixir Badge'
    }
  ],

  // 2. ترتيب الفوضى والرفوف والسكينة
  'mindful-organizer': [
    {
      stageNumber: 1,
      titleAr: 'الركن الهادئ: ٦ مقتنيات مريحة',
      titleEn: 'Cozy Nook: 6 Items',
      difficulty: 'easy',
      difficultyAr: 'مبتدئ وممتع',
      difficultyEn: 'Beginner',
      descriptionAr: 'ترتيب خفيف وسريع بستة عناصر أساسية لاستعادة السيطرة والشعور بالإنجاز.',
      descriptionEn: 'Gentle 6-item shelf organizing for quick agency and calm.',
      xpReward: 40,
      criteriaAr: 'تناغم أكثر من ٨٠٪ = ٣ نجوم',
      criteriaEn: 'Harmony > 80% = 3 Stars'
    },
    {
      stageNumber: 2,
      titleAr: 'خزانة الصالون الأنيقة: ٩ مقتنيات',
      titleEn: 'Salon Cabinet: 9 Items',
      difficulty: 'medium',
      difficultyAr: 'متوسط',
      difficultyEn: 'Intermediate',
      descriptionAr: 'كتب متدرجة الأطوال، نباتات فخارية، وبلورات صفاء؛ تتطلب مراعاة تدرج الأحجام.',
      descriptionEn: 'Height-graded books, ceramic botanicals, and crystal balance.',
      xpReward: 70,
      criteriaAr: 'تناغم أكثر من ٨٥٪ = ٣ نجوم',
      criteriaEn: 'Harmony > 85% = 3 Stars'
    },
    {
      stageNumber: 3,
      titleAr: 'مكتبة الباحث المتأمل: ١٢ مقتنى',
      titleEn: 'Scholar Atelier: 12 Items',
      difficulty: 'hard',
      difficultyAr: 'متقدم ودقيق',
      difficultyEn: 'Advanced',
      descriptionAr: 'إضافة ساعات رملية وشموع عطرية ومقتنيات دقيقة تتطلب دقة متناهية في التوزيع.',
      descriptionEn: 'Hourglasses, scented candles and intricate artifacts.',
      xpReward: 100,
      criteriaAr: 'تناغم أكثر من ٩٠٪ = ٣ نجوم',
      criteriaEn: 'Harmony > 90% = 3 Stars'
    },
    {
      stageNumber: 4,
      titleAr: 'صومعة الحكيم: ١٥ مقتنى وتناغم ١٠٠٪',
      titleEn: 'Grand Sanctuary: 15 Items',
      difficulty: 'master',
      difficultyAr: 'ماستر التناغم',
      difficultyEn: 'Master Flow',
      descriptionAr: 'التحدي الأكبر لفرز وتنسيق ١٥ عنصراً نادراً في الرفوف الثلاثة بنسبة تناغم كاملة ١٠٠٪.',
      descriptionEn: 'Ultimate test ordering 15 rare items with 100% harmony.',
      xpReward: 160,
      criteriaAr: 'تحقيق ١٠٠٪ تناغم تام = وسام صانع السكينة',
      criteriaEn: '100% Harmony = Master Harmony Badge'
    }
  ],

  // 3. بازل وتوازن أحجار الزن
  'zen-puzzle': [
    // World 1: Valley of Foundation (Stages 1 - 5)
    {
      stageNumber: 1,
      titleAr: 'المرحلة ١: برج التأسيس القاعدي العريض',
      titleEn: 'Stage 1: Broad Foundation Base',
      difficulty: 'easy',
      difficultyAr: 'مبتدئ وسلس',
      difficultyEn: 'Beginner',
      descriptionAr: 'تأسيس قاعدة متزنة بثلاثة أحجار ناعمة عريضة لملاحظة مركز الثقل.',
      descriptionEn: 'Build a stable foundation with 3 broad river stones.',
      xpReward: 35,
      criteriaAr: 'ميل أقل من ٦ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 6° = 3 Stars'
    },
    {
      stageNumber: 2,
      titleAr: 'المرحلة ٢: تدرج كتل المرمر الرملي',
      titleEn: 'Stage 2: Sandstone Layering',
      difficulty: 'easy',
      difficultyAr: 'سهل ومريح',
      difficultyEn: 'Easy',
      descriptionAr: 'رصف ٤ أحجار متدرجة الأسطح للحفاظ على شاقول مركز الثقل في المنتصف.',
      descriptionEn: 'Stack 4 graded stones keeping the plumb line centered.',
      xpReward: 45,
      criteriaAr: 'ميل أقل من ٦ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 6° = 3 Stars'
    },
    {
      stageNumber: 3,
      titleAr: 'المرحلة ٣: توازن الأوزان الخماسية',
      titleEn: 'Stage 3: Five-Pillar Balance',
      difficulty: 'medium',
      difficultyAr: 'متوسط ومتزن',
      difficultyEn: 'Intermediate',
      descriptionAr: 'موازنة ٥ أحجار خفيفة وثقيلة مع مراعاة وضع الكتلة الأكبر في القاعدة.',
      descriptionEn: 'Balance 5 stones with heavy bedrock at the base.',
      xpReward: 60,
      criteriaAr: 'أقل من ٦ حركات = ٣ نجوم',
      criteriaEn: 'Under 6 moves = 3 Stars'
    },
    {
      stageNumber: 4,
      titleAr: 'المرحلة ٤: انزياح الكثافة غير المتناظرة',
      titleEn: 'Stage 4: Asymmetric Mass Center',
      difficulty: 'medium',
      difficultyAr: 'متوسط واستراتيجي',
      difficultyEn: 'Intermediate',
      descriptionAr: 'أحجار ذات مركز ثقل غير متمركز تتطلب إزاحة أفقية دقيقة للتعادل.',
      descriptionEn: 'Off-center mass stones requiring precision counter-offset.',
      xpReward: 75,
      criteriaAr: 'ميل أقل من ٥ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 5° = 3 Stars'
    },
    {
      stageNumber: 5,
      titleAr: 'المرحلة ٥: قمة وادي السكينة (ختام العالم الأول)',
      titleEn: 'Stage 5: Foundation Valley Apex',
      difficulty: 'hard',
      difficultyAr: 'متقدم ومحوري',
      difficultyEn: 'Advanced',
      descriptionAr: 'رصف ٦ أحجار ناعمة تتوج ببلورة الكوارتز المضيئة في أعلى نقطة.',
      descriptionEn: '6-tier tower crowned with luminous quartz crystal.',
      xpReward: 95,
      criteriaAr: 'إكمال وادي السكينة = وسام صانع التأسيس',
      criteriaEn: 'Complete World 1 = Foundation Master Badge'
    },

    // World 2: Corridors of Shifting Winds (Stages 6 - 12)
    {
      stageNumber: 6,
      titleAr: 'المرحلة ٦: أولى أنسام المرتفعات الجبلية',
      titleEn: 'Stage 6: Mountain Breeze Trial',
      difficulty: 'medium',
      difficultyAr: 'متوسط ومتحرك',
      difficultyEn: 'Intermediate',
      descriptionAr: 'موازنة ٤ أحجار جبلية ضد نسيم هادئ بسرعة ٨ عقد بمهارة.',
      descriptionEn: 'Balance 4 mountain stones against 8-knot breeze.',
      xpReward: 80,
      criteriaAr: 'صمود أمام النسيم = ٣ نجوم',
      criteriaEn: 'Survive breeze = 3 Stars'
    },
    {
      stageNumber: 7,
      titleAr: 'المرحلة ٧: تيار الرياح المتأرجح',
      titleEn: 'Stage 7: Oscillating Wind Current',
      difficulty: 'hard',
      difficultyAr: 'متقدم ومتحرك',
      difficultyEn: 'Advanced',
      descriptionAr: 'رياح متأرجحة يميناً ويساراً بسرعة ١٠ عقد تتطلب توسيط البرج بثبات.',
      descriptionEn: 'Oscillating 10-knot wind requiring centered mass.',
      xpReward: 90,
      criteriaAr: 'ميل أقل من ٧ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 7° = 3 Stars'
    },
    {
      stageNumber: 8,
      titleAr: 'المرحلة ٨: التوازن العكسي ضد اتجاه الريح',
      titleEn: 'Stage 8: Wind Counter-Balance',
      difficulty: 'hard',
      difficultyAr: 'متقدم ودقيق',
      difficultyEn: 'Advanced',
      descriptionAr: 'إزاحة الأحجار نحو الجهة المعاكسة للرياح لإبطال مفعول قوة الدفع.',
      descriptionEn: 'Offset stone placements against wind pressure.',
      xpReward: 100,
      criteriaAr: 'أقل من ٧ حركات = ٣ نجوم',
      criteriaEn: 'Under 7 moves = 3 Stars'
    },
    {
      stageNumber: 9,
      titleAr: 'المرحلة ٩: كتل البازلت البركاني العاصف',
      titleEn: 'Stage 9: Volcanic Wind Array',
      difficulty: 'hard',
      difficultyAr: 'متقدم وعاصف',
      difficultyEn: 'Advanced',
      descriptionAr: '٦ أحجار بركانية داكنة مع هبات رياح شديدة بسرعة ١٢ عقدة.',
      descriptionEn: '6 volcanic stones facing 12-knot wind gusts.',
      xpReward: 110,
      criteriaAr: 'صمود ٣ ثوانٍ كاملة = ٣ نجوم',
      criteriaEn: 'Survive 3s hold = 3 Stars'
    },
    {
      stageNumber: 10,
      titleAr: 'المرحلة ١٠: ثبات الجرانيت أمام العاصفة',
      titleEn: 'Stage 10: Granite Storm Hold',
      difficulty: 'expert',
      difficultyAr: 'خبير وعاصف',
      difficultyEn: 'Expert',
      descriptionAr: 'أحجار جرانيتية ثقيلة مع رياح متغيرة بقوة ١٤ عقدة واختبار ثبات صامد.',
      descriptionEn: 'Heavy granite stones with 14-knot shifting gusts.',
      xpReward: 125,
      criteriaAr: 'صمود ٤ ثوانٍ = ٣ نجوم',
      criteriaEn: 'Survive 4s hold = 3 Stars'
    },
    {
      stageNumber: 11,
      titleAr: 'المرحلة ١١: برج الكتلة المزدوجة والمقاطعة',
      titleEn: 'Stage 11: Dual Mass Intercept',
      difficulty: 'expert',
      difficultyAr: 'خبير ودقيق',
      difficultyEn: 'Expert',
      descriptionAr: 'كتلتان ثقيلتان في أسفل وأعلا البرج تتطلبان محاذاة دقيقة جداً.',
      descriptionEn: 'Dual heavy mass blocks requiring precise alignment.',
      xpReward: 140,
      criteriaAr: 'ميل أقل من ٦ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 6° = 3 Stars'
    },
    {
      stageNumber: 12,
      titleAr: 'المرحلة ١٢: قاهر العواصف الجبلية (ختام العالم الثاني)',
      titleEn: 'Stage 12: Storm Conqueror Peak',
      difficulty: 'master',
      difficultyAr: 'ماستر العواصف',
      difficultyEn: 'Master Storm',
      descriptionAr: '٧ أحجار جبلية نادرة يصمد برجها أمام عاصفة ١٦ عقدة لمدة ٤ ثوانٍ كاملة.',
      descriptionEn: '7 rare stones facing a 16-knot gale for 4 full seconds.',
      xpReward: 160,
      criteriaAr: 'إكمال أروقة الرياح = وسام قاهر العواصف',
      criteriaEn: 'Complete World 2 = Storm Conqueror Badge'
    },

    // World 3: Precipice of Narrow Pedestals (Stages 13 - 20)
    {
      stageNumber: 13,
      titleAr: 'المرحلة ١٣: حافة المنصة الضيقة (170px)',
      titleEn: 'Stage 13: Narrow Ledge (170px)',
      difficulty: 'hard',
      difficultyAr: 'متقدم وضيق',
      difficultyEn: 'Advanced',
      descriptionAr: 'قاعدة ارتكاز ضيقة جداً تتطلب عدم الخروج بمسافة المليمتر عن الحافة.',
      descriptionEn: 'Narrow pedestal base requiring millimeter care.',
      xpReward: 115,
      criteriaAr: 'ميل أقل من ٥ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 5° = 3 Stars'
    },
    {
      stageNumber: 14,
      titleAr: 'المرحلة ١٤: ارتكاز المرمر على الحافة',
      titleEn: 'Stage 14: Precipice Marble Pivot',
      difficulty: 'hard',
      difficultyAr: 'متقدم ودقيق',
      difficultyEn: 'Advanced',
      descriptionAr: '٥ أحجار مرمرية ناعمة على قاعدة ١٦٠ بكسل مع مساحة ارتكاز محدودة.',
      descriptionEn: '5 marble stones on a tight 160px pedestal.',
      xpReward: 125,
      criteriaAr: 'أقل من ٦ حركات = ٣ نجوم',
      criteriaEn: 'Under 6 moves = 3 Stars'
    },
    {
      stageNumber: 15,
      titleAr: 'المرحلة ١٥: المنحدر الصخري والملاط الأملس',
      titleEn: 'Stage 15: Smooth Sloped Ledge',
      difficulty: 'expert',
      difficultyAr: 'خبير ومزلق',
      difficultyEn: 'Expert',
      descriptionAr: 'أحجار ذات معامل احتكاك منخفض تتطلب توسيط الثقل لمنع الانزلاق.',
      descriptionEn: 'Low friction stones requiring centered mass to avoid slipping.',
      xpReward: 135,
      criteriaAr: 'عدم انزلاق أي حجر = ٣ نجوم',
      criteriaEn: 'Zero slip = 3 Stars'
    },
    {
      stageNumber: 16,
      titleAr: 'المرحلة ١٦: البرج الشاهق الدقيق (150px)',
      titleEn: 'Stage 16: Tall Precision Tower',
      difficulty: 'expert',
      difficultyAr: 'خبير وشاهق',
      difficultyEn: 'Expert',
      descriptionAr: '٦ أحجار رقيقة وعالية تشكل برجاً شاهقاً على قاعدة ١٥٠ بكسل.',
      descriptionEn: '6 slender stones forming a tall tower on 150px base.',
      xpReward: 150,
      criteriaAr: 'ميل أقل من ٥ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 5° = 3 Stars'
    },
    {
      stageNumber: 17,
      titleAr: 'المرحلة ١٧: الجرانيت الثقيل على القاعدة الضيقة',
      titleEn: 'Stage 17: Heavy Granite Tight Base',
      difficulty: 'expert',
      difficultyAr: 'خبير وثقيل',
      difficultyEn: 'Expert',
      descriptionAr: 'كتل جرانيتية ضخمة على منصة ١٤٠ بكسل فقط مع توازن حرج جداً.',
      descriptionEn: 'Heavy granite blocks on narrow 140px ledge.',
      xpReward: 165,
      criteriaAr: 'أقل من ٧ حركات = ٣ نجوم',
      criteriaEn: 'Under 7 moves = 3 Stars'
    },
    {
      stageNumber: 18,
      titleAr: 'المرحلة ١٨: الحافة الضيقة مع هبة الرياح',
      titleEn: 'Stage 18: Gusty Narrow Ledge',
      difficulty: 'expert',
      difficultyAr: 'خبير ومزدوج',
      difficultyEn: 'Expert',
      descriptionAr: 'دمج المنصة الضيقة (145px) مع رياح 10 عقد متأرجحة.',
      descriptionEn: 'Narrow 145px ledge combined with 10-knot wind gusts.',
      xpReward: 180,
      criteriaAr: 'صمود ٤ ثوانٍ كاملة = ٣ نجوم',
      criteriaEn: 'Survive 4s hold = 3 Stars'
    },
    {
      stageNumber: 19,
      titleAr: 'المرحلة ١٩: موازن الكريستال الدقيق (135px)',
      titleEn: 'Stage 19: Precision Crystal Ledge',
      difficulty: 'master',
      difficultyAr: 'ماستر الدقة',
      difficultyEn: 'Master Precision',
      descriptionAr: '٦ أحجار كريمة ذات حواف مائلة على قاعدة دقيقة جداً ١٣٥ بكسل.',
      descriptionEn: '6 angled crystal stones on ultra-narrow 135px base.',
      xpReward: 200,
      criteriaAr: 'ميل أقل من ٤ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 4° = 3 Stars'
    },
    {
      stageNumber: 20,
      titleAr: 'المرحلة ٢٠: دقة المليمتر الأسطورية (ختام العالم الثالث)',
      titleEn: 'Stage 20: Millimeter Precision Summit',
      difficulty: 'master',
      difficultyAr: 'ماستر المليمتر',
      difficultyEn: 'Master Millimeter',
      descriptionAr: '٧ أحجار نادرة على قاعدة ١٣٠ بكسل مع رياح ١٢ عقدة واختبار صمود ٥ ثوانٍ.',
      descriptionEn: '7 rare stones on 130px base facing 12-knot wind for 5s.',
      xpReward: 230,
      criteriaAr: 'إكمال المنصات الضيقة = وسام دقة المليمتر',
      criteriaEn: 'Complete World 3 = Millimeter Master Badge'
    },

    // World 4: Alchemy of Decisional Balance (Stages 21 - 28)
    {
      stageNumber: 21,
      titleAr: 'المرحلة ٢١: خيمياء الأمان والتعبير عن الذات',
      titleEn: 'Stage 21: Safety & Expression Alchemy',
      difficulty: 'hard',
      difficultyAr: 'متقدم وإدراكي',
      difficultyEn: 'Advanced',
      descriptionAr: '٥ أحجار قرارات لموازنة راحة الصمت مقابل شجاعة التعبير والتواصل الصادق.',
      descriptionEn: '5 decisional stones balancing safety vs courage of expression.',
      xpReward: 140,
      criteriaAr: 'توازن القرار والفيزياء = ٣ نجوم',
      criteriaEn: 'Decisional & physical balance = 3 Stars'
    },
    {
      stageNumber: 22,
      titleAr: 'المرحلة ٢٢: ميزان الراحة المؤقتة والسلام المستدام',
      titleEn: 'Stage 22: Relief vs Sustainable Peace',
      difficulty: 'hard',
      difficultyAr: 'متقدم وإدراكي',
      difficultyEn: 'Advanced',
      descriptionAr: 'موازنة أوزان إرضاء الآخرين مقابل حماية الطاقة العصبية والحدود الشخصية.',
      descriptionEn: 'Balancing short-term pleasing vs long-term boundary protection.',
      xpReward: 155,
      criteriaAr: 'ميل أقل من ٦ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 6° = 3 Stars'
    },
    {
      stageNumber: 23,
      titleAr: 'المرحلة ٢٣: حجر الحزم والرفق بالذات',
      titleEn: 'Stage 23: Assertiveness & Self-Kindness',
      difficulty: 'expert',
      difficultyAr: 'خبير وإدراكي',
      difficultyEn: 'Expert',
      descriptionAr: '٦ أحجار قرارات ذات كتل غير متساوية تتطلب الحزم اللطيف عند السحب والإسقاط.',
      descriptionEn: '6 decisional stones with uneven masses requiring gentle assertiveness.',
      xpReward: 170,
      criteriaAr: 'أقل من ٧ حركات = ٣ نجوم',
      criteriaEn: 'Under 7 moves = 3 Stars'
    },
    {
      stageNumber: 24,
      titleAr: 'المرحلة ٢٤: التحرر من أوهام المثالية القاسية',
      titleEn: 'Stage 24: Releasing Perfectionism',
      difficulty: 'expert',
      difficultyAr: 'خبير وإدراكي',
      difficultyEn: 'Expert',
      descriptionAr: 'موازنة أحجار القبول المرن للخطأ والتعلم بالممارسة برفق وسكينة.',
      descriptionEn: 'Balancing flexible acceptance stones with self-kindness.',
      xpReward: 185,
      criteriaAr: 'صمود ٤ ثوانٍ = ٣ نجوم',
      criteriaEn: 'Survive 4s hold = 3 Stars'
    },
    {
      stageNumber: 25,
      titleAr: 'المرحلة ٢٥: تفكيك الاستقطاب واللوم الذاتي',
      titleEn: 'Stage 25: Neutralizing Self-Blame',
      difficulty: 'expert',
      difficultyAr: 'خبير وإدراكي',
      difficultyEn: 'Expert',
      descriptionAr: '٦ أحجار قرارات متضادة الأوزان لتفكيك التفكير الكارثي واللوم التلقائي.',
      descriptionEn: '6 opposing weight stones neutralizing catastrophic self-blame.',
      xpReward: 200,
      criteriaAr: 'ميل أقل من ٥ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 5° = 3 Stars'
    },
    {
      stageNumber: 26,
      titleAr: 'المرحلة ٢٦: ميزان الطاقة في العلاقات والحياة',
      titleEn: 'Stage 26: Relational Energy Scale',
      difficulty: 'master',
      difficultyAr: 'ماستر القرارات',
      difficultyEn: 'Master Decisional',
      descriptionAr: '٧ أحجار قرارات ذات كتل متقابلة لترجيح خيارات السلام والتوازن المستدام.',
      descriptionEn: '7 decisional stones balancing relationship energy investments.',
      xpReward: 220,
      criteriaAr: 'توازي كفتي النمو والأمان = ٣ نجوم',
      criteriaEn: 'Harmonized Safety & Growth = 3 Stars'
    },
    {
      stageNumber: 27,
      titleAr: 'المرحلة ٢٧: الصمود أمام التوقعات والنقد الخارجي',
      titleEn: 'Stage 27: Standing Clear of External Criticism',
      difficulty: 'master',
      difficultyAr: 'ماستر القرارات',
      difficultyEn: 'Master Decisional',
      descriptionAr: '٧ أحجار قرارات مع هبات رياح نقدية (12 عقدة) تتطلب ثبات القيمة الداخلية.',
      descriptionEn: '7 decisional stones with 12-knot criticism wind gusts.',
      xpReward: 240,
      criteriaAr: 'صمود ٤ ثوانٍ أمام الرياح = ٣ نجوم',
      criteriaEn: 'Survive 4s hold = 3 Stars'
    },
    {
      stageNumber: 28,
      titleAr: 'المرحلة ٢٨: ماستر الخيمياء الإدراكية (ختام العالم الرابع)',
      titleEn: 'Stage 28: Master Decisional Alchemy Summit',
      difficulty: 'master',
      difficultyAr: 'ماستر الخيمياء',
      difficultyEn: 'Master Alchemy',
      descriptionAr: '٧ أحجار خيميائية ذات توهج كريستالي مزدوج تحقق الاتزان النفسي والفيزيائي الأسمى.',
      descriptionEn: '7 dual-crystal alchemy stones achieving total inner & physical harmony.',
      xpReward: 260,
      criteriaAr: 'إكمال عالم الخيمياء = وسام حكيم القرارات',
      criteriaEn: 'Complete World 4 = Decisional Master Badge'
    },

    // World 5: Legend of the Grand Master Apex (Stages 29 - 35)
    {
      stageNumber: 29,
      titleAr: 'المرحلة ٢٩: أولى درجات العرش الأسطوري',
      titleEn: 'Stage 29: Legendary Throne Ascent',
      difficulty: 'master',
      difficultyAr: 'أسطوري وفائق',
      difficultyEn: 'Grand Master',
      descriptionAr: '٧ أحجار أسطورية على منصة ١٥٠ بكسل مع رياح ١٤ عقدة وميل مسموح $\le 6^\circ$.',
      descriptionEn: '7 legendary stones on 150px base facing 14-knot winds.',
      xpReward: 280,
      criteriaAr: 'صمود ٥ ثوانٍ = ٣ نجوم',
      criteriaEn: 'Survive 5s hold = 3 Stars'
    },
    {
      stageNumber: 30,
      titleAr: 'المرحلة ٣٠: موازنة الكثافة الأسطورية المنزاحة',
      titleEn: 'Stage 30: Shifted Density Apex',
      difficulty: 'master',
      difficultyAr: 'أسطوري وفائق',
      difficultyEn: 'Grand Master',
      descriptionAr: '٧ أحجار ذات مراكز ثقل شديدة الانزياح ($\pm 10\text{px}$) تتطلب هندسة عكسية دقيقة.',
      descriptionEn: '7 stones with extreme off-center mass offsets ($\pm 10\text{px}$).',
      xpReward: 300,
      criteriaAr: 'ميل أقل من ٥ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 5° = 3 Stars'
    },
    {
      stageNumber: 31,
      titleAr: 'المرحلة ٣١: برج الأحجار الثمانية العظيم',
      titleEn: 'Stage 31: Great Eight-Stone Stack',
      difficulty: 'master',
      difficultyAr: 'أسطوري وفائق',
      difficultyEn: 'Grand Master',
      descriptionAr: 'رصف ٨ أحجار كاملة متدرجة من أحجار النهر حتى قمة الجمشت المضيئة.',
      descriptionEn: 'Stacking 8 full stones from bedrock to radiant amethyst apex.',
      xpReward: 320,
      criteriaAr: 'أقل من ٩ حركات = ٣ نجوم',
      criteriaEn: 'Under 9 moves = 3 Stars'
    },
    {
      stageNumber: 32,
      titleAr: 'المرحلة ٣٢: البرج الشاهق تحت النجوم والشهب',
      titleEn: 'Stage 32: Starlight Tower Height',
      difficulty: 'master',
      difficultyAr: 'أسطوري وفائق',
      difficultyEn: 'Grand Master',
      descriptionAr: 'برج ثماني يصل لارتفاع شاهق يتعدى ٣٠٠ بكسل مع حساسية فائقة للاهتزاز.',
      descriptionEn: 'An 8-tier tower reaching 300px+ height with ultra-vibration sensitivity.',
      xpReward: 350,
      criteriaAr: 'ميل أقل من ٤ درجات = ٣ نجوم',
      criteriaEn: 'Tilt under 4° = 3 Stars'
    },
    {
      stageNumber: 33,
      titleAr: 'المرحلة ٣٣: عاصفة الشفق القطبي العاتية',
      titleEn: 'Stage 33: Aurora Borealis Gale',
      difficulty: 'master',
      difficultyAr: 'أسطوري وفائق',
      difficultyEn: 'Grand Master',
      descriptionAr: '٨ أحجار أسطورية تصمد أمام هبات رياح الشفق المتأرجحة بقوة ١٨ عقدة.',
      descriptionEn: '8 legendary stones withstanding 18-knot aurora wind gusts.',
      xpReward: 380,
      criteriaAr: 'صمود ٥ ثوانٍ تحت العاصفة = ٣ نجوم',
      criteriaEn: 'Survive 5s aurora storm = 3 Stars'
    },
    {
      stageNumber: 34,
      titleAr: 'المرحلة ٣٤: الهرم الثماني على المنصة الدقيقة (140px)',
      titleEn: 'Stage 34: Narrow Base Eight-Tier Pyramid',
      difficulty: 'master',
      difficultyAr: 'أسطوري وفائق',
      difficultyEn: 'Grand Master',
      descriptionAr: 'رصف ٨ أحجار معقدة على قاعدة دقيقة جداً ١٤٠ بكسل مع رياح ١٥ عقدة.',
      descriptionEn: '8 complex stones on 140px base with 15-knot winds.',
      xpReward: 420,
      criteriaAr: 'أقل من ١٠ حركات = ٣ نجوم',
      criteriaEn: 'Under 10 moves = 3 Stars'
    },
    {
      stageNumber: 35,
      titleAr: 'المرحلة ٣٥: العرش الأسطوري والأبيكس الماسي (القمة الكبرى)',
      titleEn: 'Stage 35: Ultimate Legendary Apex Throne',
      difficulty: 'master',
      difficultyAr: 'قمة الأسطورة العظمى',
      difficultyEn: 'Ultimate Grand Apex',
      descriptionAr: 'التحدي التاجي النهائي: رصف ٨ أحجار أسطورية نادرة تنتهي بجمشت الماشيت الماسي تحت أضواء الشفق مع رياح ٢٠ عقدة واختبار صمود ٥ ثوانٍ!',
      descriptionEn: 'The ultimate apex throne: 8 sacred stones crowned with diamond amethyst under aurora lights facing 20-knot gale for 5 full seconds.',
      xpReward: 500,
      criteriaAr: 'إكمال العرش الأسطوري = وسام سيد الزن الأسطوري الأعظم',
      criteriaEn: 'Complete All 35 Stages = Grand Master Apex Badge'
    }
  ],

  // 4. في إيدي / برّا إيدي
  'hands-control': [
    {
      stageNumber: 1,
      titleAr: 'المرحلة الأولى: مواقف اليوم والمذاكرة',
      titleEn: 'Stage 1: Daily Study & Habits',
      difficulty: 'easy',
      difficultyAr: 'مبتدئ',
      difficultyEn: 'Beginner',
      descriptionAr: 'فرز مواقف الامتحانات وساعات النوم والجهد بين ما تملكه وما هو خارج يدك.',
      descriptionEn: 'Sort exams, sleep, and study effort into control circles.',
      xpReward: 40,
      criteriaAr: 'إجابات صحيحة ١٠٠٪ = ٣ نجوم',
      criteriaEn: '100% correct = 3 Stars'
    },
    {
      stageNumber: 2,
      titleAr: 'المرحلة الثانية: العلاقات والضغط الاجتماعي',
      titleEn: 'Stage 2: Social & Family Boundaries',
      difficulty: 'medium',
      difficultyAr: 'متوسط',
      difficultyEn: 'Intermediate',
      descriptionAr: 'مواقف عميقة حول آراء الأقارب، المقارنات، وردود الفعل في الخلافات الأسرية.',
      descriptionEn: 'Relational friction, social expectations, and personal boundaries.',
      xpReward: 70,
      criteriaAr: 'فرز متزن دون لوم الذات = ٣ نجوم',
      criteriaEn: 'Compassionate sorting = 3 Stars'
    },
    {
      stageNumber: 3,
      titleAr: 'المرحلة الثالثة: أقدار المستقبل والتسليم المطلق',
      titleEn: 'Stage 3: Life Destinies & Deep Release',
      difficulty: 'hard',
      difficultyAr: 'متقدم وتأملي',
      difficultyEn: 'Advanced',
      descriptionAr: 'مواقف مصيرية صعبة (الماضي، الفقد، المجهول) مع مؤقت استجابة بديهية خاطف.',
      descriptionEn: 'Deep life destinies, past regrets, and mindful surrender.',
      xpReward: 110,
      criteriaAr: 'التسليم الواعي السريع = وسام بصيرة السيطرة',
      criteriaEn: 'Mindful surrender = Mastery Badge'
    }
  ],

  // 5. كسّري الجبل
  'break-mountain': [
    {
      stageNumber: 1,
      titleAr: 'التل الصغير: تفكيك ٣ ضغوط خفيفة',
      titleEn: 'Gentle Hill: 3 Micro-Stresses',
      difficulty: 'easy',
      difficultyAr: 'مبتدئ وسريع',
      difficultyEn: 'Beginner',
      descriptionAr: 'تفتيت سريع لضغوط بداية اليوم لتحريك طاقة الإنجاز.',
      descriptionEn: 'Quick dismantling of morning micro-pressures.',
      xpReward: 35,
      criteriaAr: 'تفتيت كامل = ٣ نجوم',
      criteriaEn: 'Complete shatter = 3 Stars'
    },
    {
      stageNumber: 2,
      titleAr: 'جبل الأعباء المتراكمة: ٨ صخور ثقيلة',
      titleEn: 'The Burden Mountain: 8 Rocks',
      difficulty: 'medium',
      difficultyAr: 'متوسط',
      difficultyEn: 'Intermediate',
      descriptionAr: 'تفتيت صخور الامتحانات والمقارنات والشعور بالتقصير خطوة بخطوة.',
      descriptionEn: 'Break exam weight and guilt rocks piece by piece.',
      xpReward: 75,
      criteriaAr: 'قراءة خواطر التحرر = ٣ نجوم',
      criteriaEn: 'Reflective release = 3 Stars'
    },
    {
      stageNumber: 3,
      titleAr: 'سلسلة الجبال الشاهقة: التحرر الحقيقي الشامل',
      titleEn: 'The Great Ridge: Complete Breakthrough',
      difficulty: 'hard',
      difficultyAr: 'متقدم وشامل',
      difficultyEn: 'Advanced',
      descriptionAr: 'مواجهة ١٢ صخرة صلدة مع إمكانية نحت مسار شجرة الأمل في قلب الصخر.',
      descriptionEn: 'Shatter 12 hardened blocks carving a path for blooming hope.',
      xpReward: 120,
      criteriaAr: 'تحويل الجبل إلى مسار أخضر = وسام قاهر الجبال',
      criteriaEn: 'Mountain conqueror badge'
    }
  ]
};

/**
 * Get current progress for a given game
 */
export function getGameLevelProgress(gameId: string): GameProgressData {
  if (typeof window === 'undefined') {
    return {
      gameId,
      currentStage: 1,
      unlockedStages: [1],
      stars: {},
      bestMoves: {},
      completedStagesCount: 0
    };
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${gameId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        gameId,
        currentStage: parsed.currentStage || 1,
        unlockedStages: parsed.unlockedStages?.length ? parsed.unlockedStages : [1],
        stars: parsed.stars || {},
        bestMoves: parsed.bestMoves || {},
        completedStagesCount: Object.keys(parsed.stars || {}).length
      };
    }
  } catch (e) {
    console.error('Failed reading game progress', e);
  }

  return {
    gameId,
    currentStage: 1,
    unlockedStages: [1],
    stars: {},
    bestMoves: {},
    completedStagesCount: 0
  };
}

/**
 * Save stage completion & unlock next stage
 */
export function completeStage(
  gameId: string,
  stageNumber: number,
  starsAwarded: number,
  movesCount?: number,
  onAddXP?: (amount: number) => void
): { isNewUnlock: boolean; nextStageNumber: number | null; xpAwarded: number } {
  const current = getGameLevelProgress(gameId);
  const stagesConfig = GAME_STAGES_CONFIG[gameId] || [];
  const currentStageDef = stagesConfig.find(s => s.stageNumber === stageNumber);
  const baseXP = currentStageDef?.xpReward || (stageNumber * 40);
  const xpEarned = baseXP + (starsAwarded * 10);

  const prevBestStars = current.stars[stageNumber] || 0;
  const newBestStars = Math.max(prevBestStars, starsAwarded);
  const updatedStars = { ...current.stars, [stageNumber]: newBestStars };

  const updatedMoves = { ...current.bestMoves };
  if (movesCount !== undefined) {
    const prevMoves = updatedMoves[stageNumber];
    updatedMoves[stageNumber] = prevMoves ? Math.min(prevMoves, movesCount) : movesCount;
  }

  // Check if next stage exists and unlock it
  const nextStageDef = stagesConfig.find(s => s.stageNumber === stageNumber + 1);
  let isNewUnlock = false;
  const unlockedSet = new Set(current.unlockedStages);
  unlockedSet.add(stageNumber);

  if (nextStageDef) {
    if (!unlockedSet.has(nextStageDef.stageNumber)) {
      unlockedSet.add(nextStageDef.stageNumber);
      isNewUnlock = true;
    }
  }

  const newUnlockedStages = Array.from(unlockedSet).sort((a, b) => a - b);
  const nextStageNumber = nextStageDef ? nextStageDef.stageNumber : null;

  const updatedProgress: GameProgressData = {
    gameId,
    currentStage: nextStageNumber || stageNumber,
    unlockedStages: newUnlockedStages,
    stars: updatedStars,
    bestMoves: updatedMoves,
    completedStagesCount: Object.keys(updatedStars).length
  };

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${gameId}`, JSON.stringify(updatedProgress));
  } catch (err) {
    console.error('Failed saving game progress', err);
  }

  // Visual & Audio fanfare
  soundManager.playLevelUpFanfare();
  triggerConfetti(0.5, 0.4);
  recordStreakActivity(`game_stage_${gameId}_${stageNumber}`);

  if (onAddXP) {
    onAddXP(xpEarned);
  }

  return {
    isNewUnlock,
    nextStageNumber,
    xpAwarded: xpEarned
  };
}

/**
 * Switch active stage without changing unlock records
 */
export function setActiveStage(gameId: string, stageNumber: number): void {
  const current = getGameLevelProgress(gameId);
  if (!current.unlockedStages.includes(stageNumber)) return;

  current.currentStage = stageNumber;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${gameId}`, JSON.stringify(current));
  } catch (err) {
    console.error(err);
  }
}
