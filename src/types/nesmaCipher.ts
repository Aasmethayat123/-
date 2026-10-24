export type CipherWorldId = 'garden' | 'library' | 'cave';

export type CipherPuzzleType = 
  | 'tile_puzzle'        // بازل الصور
  | 'letter_scramble'    // صندوق الحروف
  | 'word_sequence'      // ترتيب الكلمات
  | 'path_maze'          // المتاهة التفاعلية
  | 'pattern_matrix'     // اكتشاف النمط
  | 'clue_search'        // البحث عن الأدلة
  | 'missing_piece'      // القطعة الناقصة
  | 'symbol_cipher'      // فك الشفرة النفسية
  | 'scenario_order'     // ترتيب الأحداث
  | 'hybrid_challenge';  // التحدي المركب

export interface CipherWorld {
  id: CipherWorldId;
  nameAr: string;
  nameEn: string;
  descAr: string;
  themeColor: string;
  accentColor: string;
  bgGradient: string;
  icon: string;
  levelsRange: [number, number];
  heroImage: string;
}

export interface CipherTokenReward {
  type: 'word' | 'letter' | 'symbol';
  value: string;
  display: string;
  explanationAr: string;
}

export interface BasePuzzleData {
  instructionsAr: string;
  guideNoteAr?: string;
}

// 1. بازل الصور
export interface TilePuzzleData extends BasePuzzleData {
  gridSize: 3; // 3x3 grid
  imageSrc: string;
  targetOrder: number[]; // e.g. [0,1,2,3,4,5,6,7,8]
  previewTitle: string;
}

// 2. صندوق الحروف
export interface LetterScrambleData extends BasePuzzleData {
  targetWord: string;
  scrambledLetters: string[];
  meaningAr: string;
  clueAr: string;
}

// 3. ترتيب الكلمات
export interface WordSequenceData extends BasePuzzleData {
  correctSentence: string[];
  scrambledWords: string[];
  contextAr: string;
}

// 4. المتاهة التفاعلية
export interface PathMazeData extends BasePuzzleData {
  gridRows: number;
  gridCols: number;
  startPos: [number, number];
  endPos: [number, number];
  obstacles: [number, number][]; // حواجز التشتت
  keyPositions: [number, number][]; // مفاتيح الوعي لجمعها قبل الخروج
  pathTheme: 'serenity' | 'focus' | 'courage';
}

// 5. اكتشاف النمط
export interface PatternMatrixData extends BasePuzzleData {
  patternSequence: { id: string; label: string; icon: string; explanation: string }[];
  missingIndex: number;
  options: { id: string; label: string; icon: string; explanation: string; isCorrect: boolean }[];
  logicExplanationAr: string;
}

// 6. البحث عن الأدلة
export interface ClueSearchData extends BasePuzzleData {
  sceneBackground: string;
  hiddenItems: {
    id: string;
    nameAr: string;
    descriptionAr: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    icon: string;
  }[];
}

// 7. القطعة الناقصة
export interface MissingPieceData extends BasePuzzleData {
  conceptTitle: string;
  boardItems: { title: string; desc: string; icon: string }[];
  missingSlotIndex: number;
  options: { id: string; title: string; desc: string; icon: string; isCorrect: boolean; feedbackAr: string }[];
}

// 8. فك الشفرة النفسية
export interface SymbolCipherData extends BasePuzzleData {
  cipherTable: Record<string, string>; // e.g. { '🌟': 'ن', '🌿': 'و', '💎': 'ر' }
  encryptedMessage: string[]; // ['🌟', '🌿', '💎']
  targetWord: string; // "نور"
  hintsLetters: Record<string, string>; // pre-revealed mapping clues
}

// 9. ترتيب الأحداث والمواقف
export interface ScenarioOrderData extends BasePuzzleData {
  situationTitle: string;
  situationDesc: string;
  steps: { id: string; text: string; correctOrder: number; reflectionAr: string }[];
}

// 10. التحدي المركب
export interface HybridChallengeData extends BasePuzzleData {
  phase1: {
    type: 'cipher';
    cipherKey: Record<string, string>;
    codeWords: string[];
    solution: string;
  };
  phase2: {
    type: 'order';
    prompt: string;
    words: string[];
    correctOrder: string[];
  };
}

export type PuzzleDataPayload = 
  | TilePuzzleData
  | LetterScrambleData
  | WordSequenceData
  | PathMazeData
  | PatternMatrixData
  | ClueSearchData
  | MissingPieceData
  | SymbolCipherData
  | ScenarioOrderData
  | HybridChallengeData;

export interface CipherLevel {
  id: number; // 1 to 30
  worldId: CipherWorldId;
  titleAr: string;
  subtitleAr: string;
  quoteId: string; // 1 to 5
  rewardToken: CipherTokenReward;
  puzzleType: CipherPuzzleType;
  puzzleData: PuzzleDataPayload;
  difficulty: 'easy' | 'medium' | 'challenging';
  xpReward: number;
  hints: [string, string, string]; // 3 progressive hints
  insightNote: string; // psychological insight shown after solving
  narrativeContext?: {
    companionIntroAr: string;
    companionOutroAr: string;
    storyChapterAr: string;
  };
}

export interface CipherQuote {
  id: string;
  fullText: string;
  topic: string;
  categoryAr: string;
  worldId: CipherWorldId;
  levelIds: number[];
  tokens: {
    levelId: number;
    token: string;
    order: number;
  }[];
  psychologicalMeaning: string;
  practicalApplication: string;
  foundation: string;
}

export interface GardenCollectible {
  id: string;
  nameAr: string;
  descAr: string;
  icon: string;
  requiredLevel: number;
  category: 'plant' | 'light' | 'stone' | 'fountain';
}

export interface CipherProgress {
  completedLevels: number[];
  levelStars: Record<number, number>; // levelId -> 1..3
  unlockedLevels: number[];
  discoveredQuotes: string[];
  score: number;
  gardenItems: string[];
  hintsUsedCount: Record<number, number>;
  secretDoorsUnlocked: string[];
  lastPlayedLevel: number;
}
