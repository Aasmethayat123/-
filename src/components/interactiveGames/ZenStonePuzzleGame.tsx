import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Bookmark, 
  CheckCircle2, 
  Compass, 
  Wind,
  ShieldCheck,
  Trophy,
  AlertTriangle,
  Undo2,
  HelpCircle,
  Eye,
  Info,
  Scale,
  Activity
} from 'lucide-react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { 
  getGameLevelProgress, 
  completeStage, 
  setActiveStage, 
  GameProgressData 
} from '../../utils/gameLevelsManager';
import { StageLevelSelector } from '../common/StageLevelSelector';

interface ZenStonePuzzleGameProps {
  language: Language;
  onBackToMap: () => void;
  onAddXP?: (amount: number) => void;
}

export interface ZenStone {
  id: string;
  nameAr: string;
  nameEn: string;
  widthPx: number; // Base contact width in px
  heightPx: number; // Stone height in px
  weightKg: number; // Mass in kg
  centerOffsetPx: number; // Asymmetry: offset of stone's intrinsic center of mass relative to its geometry
  gradient: string;
  borderColor: string;
  texturePattern: string;
  decisionCategory?: 'safety' | 'growth';
  decisionConceptAr?: string;
  decisionConceptEn?: string;
}

export interface StackedStone {
  stone: ZenStone;
  xOffsetPx: number; // Horizontal placement offset relative to pedestal center (0)
}

export interface StageDefinition {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  goalNoteAr: string;
  goalNoteEn: string;
  maxMoves: number;
  maxAllowedTiltDeg: number;
  windSpeedKnots: number; // 0 for calm, 5-15 for wind
  availableStones: ZenStone[];
  isDecisionalStage?: boolean;
}

const STAGES_DATA: StageDefinition[] = [
  // Stage 1: Calm Foundation
  {
    id: 1,
    titleAr: 'المرحلة الأولى — القاعدة الهادئة 🌿',
    titleEn: 'Stage 1 — Calm Foundation 🌿',
    descriptionAr: 'تعلم مبادئ مركز الثقل ومحاذاة نقطة الارتكاز لحفظ ثبات البرج.',
    descriptionEn: 'Learn center of mass and base alignment to maintain stone tower stability.',
    goalNoteAr: 'الهدف: رصف 3 أحجار قاعدية بحيث لا يتجاوز ميل البرج 5 درجات.',
    goalNoteEn: 'Goal: Stack 3 foundation stones with less than 5° total tilt.',
    maxMoves: 4,
    maxAllowedTiltDeg: 6,
    windSpeedKnots: 0,
    availableStones: [
      {
        id: 's1_base',
        nameAr: 'حجر البازلت القاعدي العريض',
        nameEn: 'Broad Basalt Bedrock',
        widthPx: 220,
        heightPx: 48,
        weightKg: 12,
        centerOffsetPx: 0,
        gradient: 'from-stone-700 via-stone-800 to-stone-900',
        borderColor: 'border-stone-600',
        texturePattern: 'granite'
      },
      {
        id: 's1_mid',
        nameAr: 'حجر المرمر الرملي المستقر',
        nameEn: 'Smooth Sandstone Block',
        widthPx: 160,
        heightPx: 40,
        weightKg: 7,
        centerOffsetPx: -3,
        gradient: 'from-stone-500 via-stone-600 to-stone-700',
        borderColor: 'border-stone-500',
        texturePattern: 'sandstone'
      },
      {
        id: 's1_top',
        nameAr: 'بلورة الكوارتز النقي المضيئة',
        nameEn: 'Luminous Quartz Apex',
        widthPx: 90,
        heightPx: 32,
        weightKg: 3,
        centerOffsetPx: 0,
        gradient: 'from-amber-200 via-amber-300 to-amber-400',
        borderColor: 'border-amber-400',
        texturePattern: 'crystal'
      }
    ]
  },

  // Stage 2: Classic Center of Mass & Inverse Weights
  {
    id: 2,
    titleAr: 'المرحلة الثانية — التوازن الإدراكي والأوزان ⚖️',
    titleEn: 'Stage 2 — Cognitive Weight Balance ⚖️',
    descriptionAr: 'رتب الأحجار ذات الأوزان المتفاوتة؛ الأحجار الأكثر ثقلاً تجعل القاعدة أمتن عند وضعها في الأسفل.',
    descriptionEn: 'Arrange stones with varying weights; heavier stones stabilize the base when placed lower.',
    goalNoteAr: 'الهدف: رصف 5 أحجار متناسقة الأوزان في أقل من 7 حركات بـ ثبات ممتاز.',
    goalNoteEn: 'Goal: Stack 5 weighted stones in under 7 moves with high stability.',
    maxMoves: 7,
    maxAllowedTiltDeg: 8,
    windSpeedKnots: 2,
    availableStones: [
      {
        id: 's2_1',
        nameAr: 'حجر الجرانيت الصلد العريض',
        nameEn: 'Heavy Granite Base',
        widthPx: 230,
        heightPx: 46,
        weightKg: 15,
        centerOffsetPx: 0,
        gradient: 'from-stone-800 via-zinc-800 to-stone-900',
        borderColor: 'border-stone-600',
        texturePattern: 'granite'
      },
      {
        id: 's2_2',
        nameAr: 'حجر الحمم البركانية المصقول',
        nameEn: 'Polished Lava Slab',
        widthPx: 180,
        heightPx: 40,
        weightKg: 10,
        centerOffsetPx: 4,
        gradient: 'from-stone-700 via-stone-800 to-stone-850',
        borderColor: 'border-stone-600',
        texturePattern: 'lava'
      },
      {
        id: 's2_3',
        nameAr: 'حجر نهر الياسمين البيضاوي',
        nameEn: 'River Jasmine Pebble',
        widthPx: 140,
        heightPx: 36,
        weightKg: 6,
        centerOffsetPx: -5,
        gradient: 'from-stone-500 via-stone-600 to-stone-700',
        borderColor: 'border-stone-400',
        texturePattern: 'pebble'
      },
      {
        id: 's2_4',
        nameAr: 'حجر الفيروز الهادئ',
        nameEn: 'Serene Turquoise Stone',
        widthPx: 100,
        heightPx: 30,
        weightKg: 4,
        centerOffsetPx: 2,
        gradient: 'from-teal-600 via-teal-700 to-emerald-800',
        borderColor: 'border-teal-500',
        texturePattern: 'jade'
      },
      {
        id: 's2_5',
        nameAr: 'قمة الجمشت العطرية',
        nameEn: 'Amethyst Crown Pebble',
        widthPx: 60,
        heightPx: 26,
        weightKg: 2,
        centerOffsetPx: 0,
        gradient: 'from-purple-300 via-pink-300 to-amber-200',
        borderColor: 'border-purple-300',
        texturePattern: 'crystal'
      }
    ]
  },

  // Stage 3: Dynamic Wind Gust Challenge
  {
    id: 3,
    titleAr: 'المرحلة الثالثة — اختبار الرياح العاتية 💨',
    titleEn: 'Stage 3 — Dynamic Wind Gust Challenge 💨',
    descriptionAr: 'واجه تأثير هبات الرياح المتغيرة عبر موازنة إزاحة الأحجار لعكس اتجاه الريح.',
    descriptionEn: 'Counteract shifting wind gusts by offsetting stone positions against the wind!',
    goalNoteAr: 'الهدف: بناء برج من 5 أحجار يصمد أمام هبات رياح سرعة 12 عقدة لمدة 3 ثوانٍ.',
    goalNoteEn: 'Goal: Build a 5-stone tower that survives 12-knot wind gusts for 3 seconds.',
    maxMoves: 8,
    maxAllowedTiltDeg: 12,
    windSpeedKnots: 12,
    availableStones: [
      {
        id: 's3_1',
        nameAr: 'لوح الشست الرسوبي العريض',
        nameEn: 'Schist Anchor Base',
        widthPx: 240,
        heightPx: 48,
        weightKg: 18,
        centerOffsetPx: 0,
        gradient: 'from-stone-850 via-stone-900 to-black',
        borderColor: 'border-stone-700',
        texturePattern: 'granite'
      },
      {
        id: 's3_2',
        nameAr: 'كتلة الجرانيت المقاومة',
        nameEn: 'Resilient Granite Block',
        widthPx: 190,
        heightPx: 42,
        weightKg: 12,
        centerOffsetPx: -6,
        gradient: 'from-stone-700 via-stone-800 to-stone-900',
        borderColor: 'border-stone-600',
        texturePattern: 'granite'
      },
      {
        id: 's3_3',
        nameAr: 'حجر المرمر البحري',
        nameEn: 'Marine Marble Slab',
        widthPx: 150,
        heightPx: 38,
        weightKg: 8,
        centerOffsetPx: 6,
        gradient: 'from-slate-600 via-slate-700 to-stone-800',
        borderColor: 'border-slate-500',
        texturePattern: 'marble'
      },
      {
        id: 's3_4',
        nameAr: 'حصاة اللازورد الموازنة',
        nameEn: 'Lapis Counter-Weight',
        widthPx: 110,
        heightPx: 32,
        weightKg: 5,
        centerOffsetPx: -2,
        gradient: 'from-blue-600 via-indigo-700 to-slate-900',
        borderColor: 'border-blue-400',
        texturePattern: 'lapis'
      },
      {
        id: 's3_5',
        nameAr: 'شعلة الكوارتز النارية',
        nameEn: 'Fiery Quartz Apex',
        widthPx: 70,
        heightPx: 28,
        weightKg: 2,
        centerOffsetPx: 0,
        gradient: 'from-amber-300 via-orange-400 to-yellow-200',
        borderColor: 'border-amber-300',
        texturePattern: 'crystal'
      }
    ]
  },

  // Stage 4: Master Flow & Decisional Balance Integration
  {
    id: 4,
    titleAr: 'المرحلة الرابعة — تدفق القرارات وتوازن الحياة ⚖️✨',
    titleEn: 'Stage 4 — Decisional Balance & Master Flow ⚖️✨',
    descriptionAr: 'تحدٍ مركب يربط بين الثبات الفيزيائي واتزان القرارات بين كفتي الأمان المؤقت والنمو الحقيقي.',
    descriptionEn: 'Master challenge connecting physical balance with decisional choices between Safety and Growth.',
    goalNoteAr: 'الهدف: رصف 6 أحجار ذات قيم إدراكية مع تحقيق اتزان فيزيائي ونفسي مكتمل.',
    goalNoteEn: 'Goal: Stack 6 decisional stones achieving full physical & psychological equilibrium.',
    maxMoves: 9,
    maxAllowedTiltDeg: 10,
    windSpeedKnots: 6,
    isDecisionalStage: true,
    availableStones: [
      {
        id: 's4_1',
        nameAr: 'حجر قاعدة الأمان الداخلي',
        nameEn: 'Inner Safety Bedrock',
        widthPx: 250,
        heightPx: 50,
        weightKg: 20,
        centerOffsetPx: 0,
        gradient: 'from-stone-800 via-stone-900 to-zinc-950',
        borderColor: 'border-stone-600',
        texturePattern: 'bedrock',
        decisionCategory: 'safety',
        decisionConceptAr: 'الأمان القاعدي والاستقرار الجسدي',
        decisionConceptEn: 'Physical & Emotional Safety Base'
      },
      {
        id: 's4_2',
        nameAr: 'حجر شجاعة التعبير والحدود',
        nameEn: 'Courage of Boundaries',
        widthPx: 200,
        heightPx: 44,
        weightKg: 14,
        centerOffsetPx: -4,
        gradient: 'from-emerald-700 via-teal-800 to-stone-900',
        borderColor: 'border-emerald-500',
        texturePattern: 'jade',
        decisionCategory: 'growth',
        decisionConceptAr: 'رسم الحدود الصادقة لحماية الطاقة',
        decisionConceptEn: 'Setting Honest Energy Boundaries'
      },
      {
        id: 's4_3',
        nameAr: 'حجر القبول المرن للواقع',
        nameEn: 'Radical Acceptance Stone',
        widthPx: 160,
        heightPx: 38,
        weightKg: 10,
        centerOffsetPx: 4,
        gradient: 'from-teal-600 via-emerald-700 to-stone-800',
        borderColor: 'border-teal-400',
        texturePattern: 'marble',
        decisionCategory: 'growth',
        decisionConceptAr: 'تقبل التغيرات بحكمة ومرونة',
        decisionConceptEn: 'Accepting Changes with Wisdom'
      },
      {
        id: 's4_4',
        nameAr: 'حجر التهدئة والرفق بالذات',
        nameEn: 'Self-Compassion Anchor',
        widthPx: 130,
        heightPx: 34,
        weightKg: 7,
        centerOffsetPx: -2,
        gradient: 'from-sky-600 via-blue-700 to-stone-800',
        borderColor: 'border-sky-400',
        texturePattern: 'smooth',
        decisionCategory: 'safety',
        decisionConceptAr: 'الرفق بالنفس عند الخطأ والتعثر',
        decisionConceptEn: 'Self-Kindness During Stumbles'
      },
      {
        id: 's4_5',
        nameAr: 'حجر التعافي والنمو المستمر',
        nameEn: 'Continuous Growth Pebble',
        widthPx: 95,
        heightPx: 30,
        weightKg: 4,
        centerOffsetPx: 2,
        gradient: 'from-amber-400 via-amber-500 to-orange-600',
        borderColor: 'border-amber-300',
        texturePattern: 'pebble',
        decisionCategory: 'growth',
        decisionConceptAr: 'الخطوات الصغرى اليومية المستمرة',
        decisionConceptEn: 'Micro Daily Growth Steps'
      },
      {
        id: 's4_6',
        nameAr: 'تاج الحرية والسلام الداخلي',
        nameEn: 'Inner Freedom Apex Crown',
        widthPx: 65,
        heightPx: 26,
        weightKg: 2,
        centerOffsetPx: 0,
        gradient: 'from-purple-300 via-pink-300 to-amber-200',
        borderColor: 'border-purple-300',
        texturePattern: 'crystal',
        decisionCategory: 'growth',
        decisionConceptAr: 'قمة التحرر والانسجام النفسي',
        decisionConceptEn: 'Peak Inner Harmony & Freedom'
      }
    ]
  }
];

const GAME_ID = 'zen-puzzle';
const PEDESTAL_WIDTH_PX = 230; // Width of table base in pixels

export const ZenStonePuzzleGame: React.FC<ZenStonePuzzleGameProps> = ({
  language,
  onBackToMap,
  onAddXP
}) => {
  const isAr = language === 'ar';

  const [progress, setProgress] = useState<GameProgressData>(() => getGameLevelProgress(GAME_ID));
  const [currentStageId, setCurrentStageId] = useState<number>(() => progress.currentStage || 1);

  const stage = STAGES_DATA.find(s => s.id === currentStageId) || STAGES_DATA[0];

  // Gameplay state
  const [unplacedStones, setUnplacedStones] = useState<ZenStone[]>(stage.availableStones);
  const [selectedStone, setSelectedStone] = useState<ZenStone | null>(null);
  const [stackedStones, setStackedStones] = useState<StackedStone[]>([]);
  const [placementXOffset, setPlacementXOffset] = useState<number>(0); // Current placement target slider offset (-70 to +70)
  
  const [movesCount, setMovesCount] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [collapseReasonAr, setCollapseReasonAr] = useState<string>('');
  const [collapseReasonEn, setCollapseReasonEn] = useState<string>('');

  // Hold test state (3 seconds countdown for complete stability)
  const [isHoldingTest, setIsHoldingTest] = useState<boolean>(false);
  const [holdTimeLeftSec, setHoldTimeLeftSec] = useState<number>(3);

  // Victory and Moments
  const [isSavedMoment, setIsSavedMoment] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [starsAwarded, setStarsAwarded] = useState<number>(3);
  const [earnedXP, setEarnedXP] = useState<number>(50);

  // Interactive Micro-Tutorial
  const [showTutorialOverlay, setShowTutorialOverlay] = useState<boolean>(true);
  const [tutorialStep, setTutorialStep] = useState<number>(1);

  // Wind offset simulation
  const [currentWindForce, setCurrentWindForce] = useState<number>(0);

  // Load / Reset Stage
  const loadStage = (stageNum: number) => {
    setCurrentStageId(stageNum);
    setActiveStage(GAME_ID, stageNum);
    const targetStage = STAGES_DATA.find(s => s.id === stageNum) || STAGES_DATA[0];
    setUnplacedStones(targetStage.availableStones);
    setSelectedStone(null);
    setStackedStones([]);
    setPlacementXOffset(0);
    setMovesCount(0);
    setIsCollapsed(false);
    setCollapseReasonAr('');
    setCollapseReasonEn('');
    setIsHoldingTest(false);
    setHoldTimeLeftSec(3);
    setShowCompletionModal(false);
  };

  // Dynamic Wind Simulation effect
  useEffect(() => {
    if (stage.windSpeedKnots === 0 || isCollapsed) {
      setCurrentWindForce(0);
      return;
    }
    const interval = setInterval(() => {
      // Wind oscillates dynamically
      const time = Date.now() / 1000;
      const windCoeff = Math.sin(time * 1.5) + Math.cos(time * 0.7) * 0.5;
      setCurrentWindForce(windCoeff * (stage.windSpeedKnots * 0.6));
    }, 100);
    return () => clearInterval(interval);
  }, [stage, isCollapsed]);

  // Evaluate Tower Physics (Center of Mass & Overhang)
  const evaluateTowerPhysics = (currentStack: StackedStone[]) => {
    if (currentStack.length === 0) {
      return { isStable: true, tiltAngleDeg: 0, netImbalancePx: 0, failNoteAr: '', failNoteEn: '' };
    }

    let accumulatedWeight = 0;
    let weightedXSum = 0;

    // Check each stone sitting on the one below it
    for (let i = 0; i < currentStack.length; i++) {
      const item = currentStack[i];
      const belowItem = i > 0 ? currentStack[i - 1] : null;
      const supportWidth = belowItem ? belowItem.stone.widthPx : PEDESTAL_WIDTH_PX;
      const supportCenterX = belowItem ? belowItem.xOffsetPx : 0;

      // Contact interval check
      const stoneLeft = item.xOffsetPx - item.stone.widthPx / 2;
      const stoneRight = item.xOffsetPx + item.stone.widthPx / 2;
      const supportLeft = supportCenterX - supportWidth / 2;
      const supportRight = supportCenterX + supportWidth / 2;

      // Check if stone is completely off the support surface
      if (stoneRight <= supportLeft || stoneLeft >= supportRight) {
        return {
          isStable: false,
          tiltAngleDeg: 25,
          netImbalancePx: 80,
          failNoteAr: `انزلاق حجر «${item.stone.nameAr}» خارج مساحة ارتكاز الحجر أسفله بالكامل!`,
          failNoteEn: `Stone "${item.stone.nameEn}" placed completely outside underlying support!`
        };
      }

      // Check Sub-Tower Center of Mass above level i
      let subTowerWeight = 0;
      let subTowerXSum = 0;
      for (let j = i; j < currentStack.length; j++) {
        const topItem = currentStack[j];
        const stoneMass = topItem.stone.weightKg;
        const stoneCoM = topItem.xOffsetPx + topItem.stone.centerOffsetPx;
        subTowerWeight += stoneMass;
        subTowerXSum += stoneMass * stoneCoM;
      }
      const subTowerCoMX = subTowerXSum / subTowerWeight;

      // Sub-tower CoM must lie within support interval
      if (subTowerCoMX < supportLeft || subTowerCoMX > supportRight) {
        const sideAr = subTowerCoMX < supportLeft ? 'اليسار' : 'اليمين';
        const sideEn = subTowerCoMX < supportLeft ? 'Left' : 'Right';
        return {
          isStable: false,
          tiltAngleDeg: 22,
          netImbalancePx: Math.abs(subTowerCoMX - supportCenterX),
          failNoteAr: `انقلاب البرج نحو ${sideAr}؛ مركز ثقل الحجر «${item.stone.nameAr}» والمجموعة فوقه خرج عن حافة الارتكاز!`,
          failNoteEn: `Tower toppled to the ${sideEn}; center of mass exceeded support boundary at "${item.stone.nameEn}"!`
        };
      }

      accumulatedWeight += item.stone.weightKg;
      weightedXSum += item.stone.weightKg * (item.xOffsetPx + item.stone.centerOffsetPx);
    }

    const overallCoMX = weightedXSum / accumulatedWeight;

    // Calculate Tilt Angle (including wind contribution)
    const baseTiltFromCoM = (overallCoMX / (PEDESTAL_WIDTH_PX / 2)) * 14; // in degrees
    const totalTiltDeg = baseTiltFromCoM + currentWindForce * 0.5;

    if (Math.abs(totalTiltDeg) > stage.maxAllowedTiltDeg) {
      const directionAr = totalTiltDeg > 0 ? 'اليمين' : 'اليسار';
      const directionEn = totalTiltDeg > 0 ? 'Right' : 'Left';
      return {
        isStable: false,
        tiltAngleDeg: totalTiltDeg,
        netImbalancePx: Math.abs(overallCoMX),
        failNoteAr: `ميل البرج نحو ${directionAr} بمقدار (${Math.abs(totalTiltDeg).toFixed(1)}°) تجاوز حد أمان المرحلة (${stage.maxAllowedTiltDeg}°)!`,
        failNoteEn: `Tower tilt to the ${directionEn} (${Math.abs(totalTiltDeg).toFixed(1)}°) exceeded maximum stage tolerance (${stage.maxAllowedTiltDeg}°)!`
      };
    }

    return {
      isStable: true,
      tiltAngleDeg: totalTiltDeg,
      netImbalancePx: Math.abs(overallCoMX),
      failNoteAr: '',
      failNoteEn: ''
    };
  };

  const currentPhysics = evaluateTowerPhysics(stackedStones);

  // Commit Placing Selected Stone
  const handleConfirmPlacement = () => {
    if (!selectedStone || isCollapsed || isHoldingTest) return;

    soundManager.playStoneClick();
    const newStack = [...stackedStones, { stone: selectedStone, xOffsetPx: placementXOffset }];
    setStackedStones(newStack);
    
    // Remove from unplaced
    const remaining = unplacedStones.filter(s => s.id !== selectedStone.id);
    setUnplacedStones(remaining);
    setSelectedStone(null);
    setPlacementXOffset(0);
    setMovesCount(prev => prev + 1);

    // Evaluate physics immediately after drop
    const evalResult = evaluateTowerPhysics(newStack);
    if (!evalResult.isStable) {
      soundManager.playIncorrect();
      setIsCollapsed(true);
      setCollapseReasonAr(evalResult.failNoteAr);
      setCollapseReasonEn(evalResult.failNoteEn);
      return;
    }

    // If all stones placed, trigger 3-second stability hold test
    if (remaining.length === 0) {
      triggerHoldTest(newStack);
    }
  };

  // Trigger 3-second Hold Stability Test
  const triggerHoldTest = (finalStack: StackedStone[]) => {
    setIsHoldingTest(true);
    setHoldTimeLeftSec(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setHoldTimeLeftSec(count);

      // Check physics during hold test (e.g. wind shifts)
      const livePhysics = evaluateTowerPhysics(finalStack);
      if (!livePhysics.isStable) {
        clearInterval(interval);
        soundManager.playIncorrect();
        setIsHoldingTest(false);
        setIsCollapsed(true);
        setCollapseReasonAr(livePhysics.failNoteAr || (isAr ? 'عصف الرياح أدى لسقوط البرج أثناء اختبار الثبات!' : 'Wind gust collapsed tower during hold test!'));
        setCollapseReasonEn(livePhysics.failNoteEn || 'Wind gust collapsed tower during hold test!');
        return;
      }

      if (count <= 0) {
        clearInterval(interval);
        setIsHoldingTest(false);
        handleStageSuccess(finalStack);
      }
    }, 1000);
  };

  // Stage Success Evaluation
  const handleStageSuccess = (finalStack: StackedStone[]) => {
    soundManager.playChime();

    // Rate performance: stars based on tilt precision and moves
    const finalPhysics = evaluateTowerPhysics(finalStack);
    let stars = 3;
    if (Math.abs(finalPhysics.tiltAngleDeg) > stage.maxAllowedTiltDeg * 0.6) stars = 2;
    if (movesCount > stage.maxMoves) stars = 1;

    setStarsAwarded(stars);

    const result = completeStage(GAME_ID, currentStageId, stars, undefined, onAddXP);
    setEarnedXP(result.xpAwarded);
    setProgress(getGameLevelProgress(GAME_ID));
    setShowCompletionModal(true);
  };

  // Undo Last Placed Stone
  const handleUndoLastStone = () => {
    if (stackedStones.length === 0 || isHoldingTest) return;

    soundManager.playSoftTap();
    const lastItem = stackedStones[stackedStones.length - 1];
    const updatedStack = stackedStones.slice(0, -1);
    setStackedStones(updatedStack);
    setUnplacedStones([...unplacedStones, lastItem.stone]);
    setIsCollapsed(false);
    setCollapseReasonAr('');
    setCollapseReasonEn('');
  };

  // Save Tower to 'My Moments'
  const handleSaveToMoments = () => {
    soundManager.playChime();
    saveMoment({
      gameId: 'zen-puzzle',
      gameTitle: isAr ? `توازن أحجار الزن (المرحلة ${currentStageId})` : `Zen Stone Balance (Stage ${currentStageId})`,
      quote: isAr 
        ? `أكملت موازنة برج السكينة بحرافة وثبات ممتاز (${(100 - Math.abs(currentPhysics.tiltAngleDeg) * 5).toFixed(0)}٪)!`
        : `Balanced Stage ${currentStageId} Zen Tower with ${(100 - Math.abs(currentPhysics.tiltAngleDeg) * 5).toFixed(0)}% stability!`,
      reflection: isAr
        ? '«التوازن النفسي والفيزيائي لا يعني خلو الحياة من الهزات، بل امتلاك المرونة للعودة للمركز برفق.»'
        : '“Inner & physical balance does not mean absence of gusts, but the resilience to return to center with gentle grace.”',
      tag: isAr ? 'توازن واتزان' : 'Zen Stability'
    });
    setIsSavedMoment(true);
    if (onAddXP) onAddXP(20);
    setTimeout(() => setIsSavedMoment(false), 3000);
  };

  const handleNextStage = () => {
    if (currentStageId < 4) {
      loadStage(currentStageId + 1);
    } else {
      setShowCompletionModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in select-none" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
                {isAr ? 'بازل وميزان أحجار الزن 🪨' : 'Zen Stone Balancing Puzzle 🪨'}
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                {isAr ? 'محاكاة توازن فيزيائي استراتيجي ⚖️' : 'Strategic Physics Simulation ⚖️'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {stage.descriptionAr}
            </p>
          </div>
        </div>

        {/* Stage Selector & Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <StageLevelSelector
            language={language}
            gameId={GAME_ID}
            currentStage={currentStageId}
            progress={progress}
            onSelectStage={(num) => loadStage(num)}
            showCompletionModal={showCompletionModal}
            completedStageNumber={currentStageId}
            starsEarned={starsAwarded}
            xpEarned={earnedXP}
            onNextStage={handleNextStage}
            onReplayStage={() => loadStage(currentStageId)}
            onCloseCompletionModal={() => setShowCompletionModal(false)}
          />

          <button
            onClick={() => setShowTutorialOverlay(true)}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-amber-700 dark:text-amber-400 transition-colors cursor-pointer"
            title={isAr ? 'شرح طريقة اللعب' : 'How to Play Tutorial'}
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {stackedStones.length > 0 && (
            <>
              <button
                onClick={handleUndoLastStone}
                disabled={isHoldingTest}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer disabled:opacity-40"
                title={isAr ? 'تراجع عن الحجر الأخير' : 'Undo Last Stone'}
              >
                <Undo2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => loadStage(currentStageId)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                title={isAr ? 'إعادة بناء البرج' : 'Reset Tower'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={handleSaveToMoments}
            disabled={isSavedMoment || stackedStones.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isSavedMoment
                ? 'bg-emerald-600 text-white'
                : stackedStones.length > 0
                ? 'bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
            }`}
          >
            {isSavedMoment ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSavedMoment ? (isAr ? 'تم الحفظ 🌿' : 'Saved 🌿') : (isAr ? 'حفظ البرج' : 'Save Tower')}</span>
          </button>
        </div>
      </div>

      {/* Stage Goal Banner */}
      <div className="bg-amber-50/80 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-bold">{isAr ? stage.goalNoteAr : stage.goalNoteEn}</span>
        </div>
        <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 font-mono text-[11px]">
          <span>{isAr ? `الحركات: ${movesCount} / ${stage.maxMoves}` : `Moves: ${movesCount} / ${stage.maxMoves}`}</span>
          {stage.windSpeedKnots > 0 && (
            <span className="flex items-center gap-1 text-teal-700 dark:text-teal-300 font-bold">
              <Wind className="w-3.5 h-3.5 animate-pulse" />
              <span>{stage.windSpeedKnots} {isAr ? 'عقدة' : 'knots'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Interactive Physics Canvas */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-stone-300 dark:border-stone-800 bg-gradient-to-b from-[#f5f5f4] via-[#e7e5e4] to-[#d6d3d1] dark:from-[#1c1917] dark:via-[#141210] dark:to-[#0c0a09] p-6 sm:p-10 shadow-2xl min-h-[420px] flex flex-col justify-end items-center select-none">
        
        {/* Live Stability & Telemetry Indicators (Top Right / Top Left) */}
        <div className="absolute top-4 inset-x-6 flex items-center justify-between gap-3 text-xs font-mono">
          {/* Live Physics Tilt Meter */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-xs ${
            isCollapsed 
              ? 'bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-300' 
              : Math.abs(currentPhysics.tiltAngleDeg) < stage.maxAllowedTiltDeg * 0.5 
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300' 
                : 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-200'
          }`}>
            <Activity className="w-4 h-4 animate-pulse" />
            <span>
              {isAr ? `درجة الميل: ${currentPhysics.tiltAngleDeg.toFixed(1)}° (الأقصى ${stage.maxAllowedTiltDeg}°)` : `Tilt: ${currentPhysics.tiltAngleDeg.toFixed(1)}° (Max ${stage.maxAllowedTiltDeg}°)`}
            </span>
          </div>

          {/* Wind Force Status */}
          {stage.windSpeedKnots > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/15 border border-teal-500/40 text-teal-800 dark:text-teal-200 font-bold backdrop-blur-md">
              <Wind className="w-4 h-4 animate-spin duration-3000" />
              <span>{isAr ? `قوة هبة الريح: ${currentWindForce.toFixed(1)}` : `Wind Force: ${currentWindForce.toFixed(1)}`}</span>
            </div>
          )}
        </div>

        {/* Central Vertical Center-Of-Gravity Plumb Line (شاقول مركز الثقل) */}
        <div className="absolute inset-y-12 w-0.5 bg-dashed border-r border-amber-500/40 pointer-events-none z-0 flex flex-col items-center justify-start pt-4">
          <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-stone-900 px-1 rounded shadow-2xs">
            {isAr ? 'محور مركز الثقل' : 'Center Line'}
          </span>
        </div>

        {/* The Tower of Stacked Stones with Realistic Physics Rotation & Shift */}
        <div 
          className={`relative z-10 flex flex-col-reverse items-center justify-end w-full max-w-md mb-2 transition-transform duration-300 ${
            isCollapsed ? 'animate-shake' : ''
          }`}
          style={{
            transform: isCollapsed 
              ? `rotate(${currentPhysics.tiltAngleDeg > 0 ? 24 : -24}deg) translateY(30px)` 
              : `rotate(${currentPhysics.tiltAngleDeg}deg)`
          }}
        >
          {/* Active Stone Drop Preview (Ghost Stone) */}
          {selectedStone && !isCollapsed && !isHoldingTest && (
            <div
              className={`relative rounded-3xl border-2 border-dashed border-amber-400 bg-amber-400/20 backdrop-blur-xs flex items-center justify-center transition-all duration-150 animate-pulse my-1`}
              style={{
                width: `${selectedStone.widthPx}px`,
                height: `${selectedStone.heightPx}px`,
                transform: `translateX(${placementXOffset}px)`
              }}
            >
              <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200">
                {isAr ? 'موقع الإنزال المتوقع' : 'Target Placement'}
              </span>
            </div>
          )}

          {/* Stacked Stones */}
          {stackedStones.map((item, idx) => (
            <div
              key={`${item.stone.id}-${idx}`}
              className={`relative rounded-3xl border-2 ${item.stone.borderColor} shadow-lg bg-gradient-to-r ${item.stone.gradient} flex flex-col items-center justify-center transition-all duration-300 hover:scale-101`}
              style={{
                width: `${item.stone.widthPx}px`,
                height: `${item.stone.heightPx}px`,
                transform: `translateX(${item.xOffsetPx}px)`,
                marginBottom: '-4px'
              }}
            >
              {/* Highlight sheen reflection */}
              <div className="absolute top-1 inset-x-3 h-1.5 rounded-full bg-white/25 pointer-events-none" />
              
              <span className="text-xs font-bold text-white drop-shadow-md truncate px-2">
                {isAr ? item.stone.nameAr : item.stone.nameEn}
              </span>

              {/* Decisional Concept Badge if Stage 4 */}
              {item.stone.decisionConceptAr && (
                <span className="text-[9px] font-bold text-amber-200 bg-black/40 px-1.5 py-0.5 rounded-full mt-0.5 truncate max-w-[90%]">
                  {isAr ? item.stone.decisionConceptAr : item.stone.decisionConceptEn}
                </span>
              )}
            </div>
          ))}

          {/* Solid Pedestal Wooden Table Base */}
          <div 
            className="h-6 rounded-2xl bg-gradient-to-r from-stone-850 via-stone-750 to-stone-900 border-2 border-stone-600 shadow-2xl flex items-center justify-center mt-1 text-center"
            style={{ width: `${PEDESTAL_WIDTH_PX}px` }}
          >
            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-300">
              {isAr ? `قاعدة الاتزان المائي (230px)` : `WATER PEDESTAL BASE (230px)`}
            </span>
          </div>
        </div>

        {/* Diagnostic Collapse Banner */}
        {isCollapsed && (
          <div className="absolute inset-x-6 top-16 z-30 p-4 rounded-2xl bg-rose-900/90 text-white text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md border border-rose-500 space-y-2 text-center animate-in zoom-in-95">
            <div className="flex items-center justify-center gap-2 text-rose-200 text-sm font-black">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>{isAr ? 'اختلال التوازن وسقوط البرج!' : 'Tower Collapse Detected!'}</span>
            </div>
            <p className="text-xs text-rose-100 font-medium leading-relaxed max-w-lg mx-auto">
              {isAr ? collapseReasonAr : collapseReasonEn}
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={handleUndoLastStone}
                className="py-1.5 px-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'تراجع عن الحجر الأخير' : 'Undo Last Stone'}</span>
              </button>
              <button
                onClick={() => loadStage(currentStageId)}
                className="py-1.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة بناء المرحلة' : 'Reset Stage'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Hold Test Countdown Banner */}
        {isHoldingTest && !isCollapsed && (
          <div className="absolute top-16 z-20 px-6 py-3 rounded-2xl bg-amber-600/90 text-white text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md flex items-center gap-3 animate-pulse">
            <Compass className="w-5 h-5 text-amber-200 animate-spin" />
            <span>
              {isAr 
                ? `جاري اختبار ثبات البرج أمام الرياح والجاذبية... (${holdTimeLeftSec} ثوانٍ)` 
                : `Hold Stability Test in Progress... (${holdTimeLeftSec}s)`}
            </span>
          </div>
        )}

        {/* Fine-Tune Positioning Controls for Active Selected Stone */}
        {selectedStone && !isCollapsed && !isHoldingTest && (
          <div className="w-full max-w-md bg-stone-900/90 dark:bg-stone-950/90 backdrop-blur-md p-4 rounded-2xl border border-stone-700 text-white space-y-3 mt-4 shadow-xl z-20">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300">
                {isAr ? `ضبط موضع إفلات: ${selectedStone.nameAr}` : `Adjust Placement: ${selectedStone.nameEn}`}
              </span>
              <span className="font-mono text-[11px] text-stone-400">
                {isAr ? `الإزاحة: ${placementXOffset}px` : `Offset: ${placementXOffset}px`}
              </span>
            </div>

            {/* Precision Range Slider */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPlacementXOffset(prev => Math.max(-75, prev - 5))}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono cursor-pointer"
                title="إزاحة يساراً"
              >
                ◀ -5px
              </button>
              <input
                type="range"
                min={-75}
                max={75}
                step={1}
                value={placementXOffset}
                onChange={(e) => setPlacementXOffset(parseInt(e.target.value, 10))}
                className="flex-1 accent-amber-500 cursor-pointer h-2 rounded-lg bg-stone-700"
              />
              <button
                onClick={() => setPlacementXOffset(prev => Math.min(75, prev + 5))}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono cursor-pointer"
                title="إزاحة يميناً"
              >
                +5px ▶
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setSelectedStone(null)}
                className="text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                {isAr ? 'إلغاء الاختيار' : 'Cancel Selection'}
              </button>
              <button
                onClick={handleConfirmPlacement}
                className="py-2 px-5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'ثبّت الحجر الآن 🪨' : 'Place Stone Now 🪨'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unplaced Stones Selection Tray */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🪨</span>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
              {isAr ? 'مجموعة الأحجار المتاحة للرصف (انقر لاختيار الحجر وضبط وضعه):' : 'Available Stones Tray (Click to select & position):'}
            </h3>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            {isAr ? `متبقي ${unplacedStones.length} أحجار` : `${unplacedStones.length} stones remaining`}
          </span>
        </div>

        {unplacedStones.length === 0 ? (
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 text-center text-xs text-stone-400 font-medium">
            {isAr ? 'تم رصف كل أحجار المرحلة بنجاح وفحص ثباتها 🪷' : 'All stones placed and evaluated successfully 🪷'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {unplacedStones.map(stone => {
              const isSelected = selectedStone?.id === stone.id;

              return (
                <button
                  key={stone.id}
                  onClick={() => {
                    soundManager.playSoftTap();
                    setSelectedStone(stone);
                    setPlacementXOffset(0);
                  }}
                  disabled={isCollapsed || isHoldingTest}
                  className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-2 group ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 ring-2 ring-amber-400/50 shadow-md'
                      : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-750 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {isAr ? stone.nameAr : stone.nameEn}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold">
                      {stone.weightKg} {isAr ? 'كجم' : 'kg'}
                    </span>
                  </div>

                  {stone.decisionConceptAr && (
                    <p className="text-[10px] text-amber-800 dark:text-amber-300 font-medium bg-amber-100/60 dark:bg-amber-900/40 px-2 py-1 rounded-lg">
                      {isAr ? stone.decisionConceptAr : stone.decisionConceptEn}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                    <span>{isAr ? `العرض: ${stone.widthPx}px` : `Width: ${stone.widthPx}px`}</span>
                    <span className={isSelected ? 'text-amber-600 font-bold' : ''}>
                      {isSelected ? (isAr ? 'قيد الضبط ▼' : 'Positioning ▼') : (isAr ? '+ اختر الحجر' : '+ Select')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Guided Micro-Tutorial Overlay */}
      {showTutorialOverlay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-4 text-start">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-black text-base">
                <Compass className="w-5 h-5 text-amber-500" />
                <span>{isAr ? 'دليل المحاكاة التفاعلية — أحجار التوازن' : 'Interactive Physics Tutorial'}</span>
              </div>
              <button
                onClick={() => setShowTutorialOverlay(false)}
                className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="block text-amber-950 dark:text-amber-200 mb-0.5">
                    {isAr ? 'اختر الحجر واضبط موضع الإسقاط:' : 'Select Stone & Set Target Offset:'}
                  </strong>
                  <p>{isAr ? 'انقر على أي حجر من الدرج السفلي، ثم حرك الشريط السري أو الأزرار لضبط موضع إسقاطه بالضبط قبل التثبيت.' : 'Click a stone, then adjust the horizontal slider to position its drop point accurately.'}</p>
                </div>
              </div>

              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-900/60 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-black flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="block text-teal-950 dark:text-teal-200 mb-0.5">
                    {isAr ? 'لاحظ شاقول مركز الثقل ومؤشر الميل:' : 'Watch the Center-of-Gravity Line & Tilt Meter:'}
                  </strong>
                  <p>{isAr ? 'تأكد من عدم خروج مركز ثقل الأحجار عن مساحة ارتكاز الحجر الذي أسفلها، وأن درجة الميل لا تتجاوز الحد المسموح به.' : 'Keep the aggregated center of mass within base bounds so total tilt does not exceed maximum tolerance.'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setShowTutorialOverlay(false)}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                {isAr ? 'ابدأ التحدي الآن 🪨' : 'Start Challenge Now 🪨'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
