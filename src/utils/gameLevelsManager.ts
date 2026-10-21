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
    {
      stageNumber: 1,
      titleAr: 'برج التأسيس الصخري: ٣ أحجار',
      titleEn: 'Foundation Cairn: 3 Stones',
      difficulty: 'easy',
      difficultyAr: 'مبتدئ وسلس',
      difficultyEn: 'Beginner',
      descriptionAr: 'تأسيس قاعدة متزنة بثلاثة أحجار ناعمة عريضة للدخول في تدفق السكينة.',
      descriptionEn: 'Build stable base with 3 smooth river stones.',
      xpReward: 35,
      criteriaAr: 'موازنة دون تسرع = ٣ نجوم',
      criteriaEn: 'Balanced with patience = 3 Stars'
    },
    {
      stageNumber: 2,
      titleAr: 'برج النهر الكلاسيكي: ٥ أحجار',
      titleEn: 'Classic River Tower: 5 Stones',
      difficulty: 'medium',
      difficultyAr: 'متوسط ومتزن',
      difficultyEn: 'Intermediate',
      descriptionAr: 'موازنة الأحجار الخمسة متدرجة الأوزان والمقاسات من العريض للضيق بدقة.',
      descriptionEn: 'Ascending balance of 5 calibrated stones.',
      xpReward: 65,
      criteriaAr: 'ترتيب الأوزان الصحيح = ٣ نجوم',
      criteriaEn: 'Accurate weight order = 3 Stars'
    },
    {
      stageNumber: 3,
      titleAr: 'برج النسيم والرياح: ٦ أحجار واهتزاز',
      titleEn: 'Breeze & Wind Cairn: 6 Stones',
      difficulty: 'hard',
      difficultyAr: 'متقدم ومتحرك',
      difficultyEn: 'Advanced',
      descriptionAr: 'أحجار حساسة مع مؤشر نسيم طبيعي؛ يتطلب وضع الحجر في لحظة سكون النسيم!',
      descriptionEn: 'Delicate stones with ambient wind breeze timing.',
      xpReward: 110,
      criteriaAr: 'التوقيت في السكون التام = ٣ نجوم',
      criteriaEn: 'Stillness timing = 3 Stars'
    },
    {
      stageNumber: 4,
      titleAr: 'قمة الزن الصامتة: ٧ أحجار نادرة',
      titleEn: 'Silent Zen Apex: 7 Sacred Stones',
      difficulty: 'master',
      difficultyAr: 'ماستر التوازن الأسمى',
      difficultyEn: 'Master Zen',
      descriptionAr: 'موازنة ٧ أحجار متناهية الدقة تنتهي ببلورة الجمشت المشعة في أعلى نقطة.',
      descriptionEn: '7-tier sacred stack crowned with radiant amethyst apex.',
      xpReward: 180,
      criteriaAr: 'اكتمال البرج السباعي = وسام سيد السكينة',
      criteriaEn: '7-stone tower = Zen Master Badge'
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
