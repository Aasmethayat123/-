export type Language = 'en' | 'ar';

export type GameMode = 
  | 'map'
  | 'journey' 
  // 9 Core Nesma Hayat Games:
  | 'hands-control'        // ١. في إيدي / برّا إيدي
  | 'reframe-sentence'     // ٢. بدّلي الجملة
  | 'break-mountain'       // ٣. كسّري الجبل
  | 'gather-bubbles'       // ٤. لمّ اللي تقدر تلمّيه
  | 'boundaries-circle'    // ٥. حدودك حواليك
  | 'gentle-break'         // ٦. فاصل إجباري لطيف
  | 'first-sentence'       // ٧. الجملة الأولى
  | 'distance-safe'        // ٨. مسافة
  | 'small-light'          // ٩. نور صغير
  // Psychomotor somatic games:
  | 'game-butterfly-tap'
  | 'game-somatic-shake'
  | 'game-pmr-squeeze'
  | 'game-sensory-grounding'
  | 'game-infinity-flow'
  | 'game-balloon-breath'
  // Discover & Readings with game linking:
  | 'discover'
  // Subconscious & Projective Gamified Exploration:
  | 'cards-insight'
  | 'scenarios-quick'
  | 'visual-projection'
  // Physical & Somatic Gamified Challenges:
  | 'micro-challenge-30s'
  | 'daily-quests'
  | 'wisdom-vault'
  // 6 Visceral & Tactile Psychological Games:
  | 'touch-and-break'
  | 'body-motion-challenge'
  | 'emotion-roulette'
  | 'scratch-to-reveal'
  | 'multi-sensory-quest'
  | 'speed-lie-detector'
  // Classic interactive challenges:
  | 'challenge-separate' 
  | 'challenge-feeling' 
  | 'challenge-perspective' 
  | 'challenge-react' 
  | 'workshop' 
  | 'my-journey'
  | 'profile'
  | 'leaderboard';

export type StageId = 1 | 2 | 3 | 4 | 5;

export interface SavedMoment {
  id: string;
  gameId: string;
  gameTitle: string;
  quote: string;
  reflection: string;
  date: string;
  tag: string;
}

export interface AvatarProfile {
  id: string;
  name: string;
  avatarChar: string;
  title: string;
  personality: string;
  color: string;
}

export interface PlayerStats {
  xp: number;
  gems: number;
  levelStars: Record<string, number>;
  streak: number;
  lastActiveDate?: string;
  lastGameCompletedDate?: string;
  streakBonusClaimedToday?: boolean;
  badges: string[];
  avatarId: string;
}

export interface ThoughtOption {
  id: string;
  text: string;
  type: 'catastrophic' | 'self-blame' | 'open' | 'rational' | 'avoidant';
  insight: string;
  thoughtWeight?: number;
  stressDelta?: number;
}

export interface EmotionOption {
  id: string;
  name: string;
  intensity: 'mild' | 'moderate' | 'high';
  category: 'anxiety' | 'sadness' | 'anger' | 'frustration' | 'fear' | 'curiosity' | 'calm' | 'unsure';
  sensationDescription: string;
  heartBpm?: number;
  faceExpression?: 'anxious' | 'sad' | 'angry' | 'fidgety' | 'calm' | 'neutral';
}

export interface ActionOption {
  id: string;
  action: string;
  category: 'withdraw' | 'confront' | 'ignore' | 'ruminate' | 'clarify' | 'support' | 'pause';
  shortTermResult: string;
  longTermResult: string;
  karmaScore?: number;
}

export interface Scenario {
  id: string;
  levelNumber?: number;
  title: string;
  situation: string;
  context: string;
  category: 'social' | 'work' | 'relationship' | 'family';
  icon: string;
  initialDialogue?: {
    sender: string;
    text: string;
    timestamp: string;
  };
  thoughtOptions: ThoughtOption[];
  emotionOptions: EmotionOption[];
  actionOptions: ActionOption[];
  healthyAlternatives: {
    thought: string;
    emotion: string;
    action: string;
    explanation: string;
  };
}

export type CardCategory = 'thought' | 'feeling' | 'fact';

export interface SeparateItem {
  id: string;
  statement: string;
  correctCategory: CardCategory;
  explanation: string;
  bonusXP?: number;
}

export interface FeelingChallengeItem {
  id: string;
  character: string;
  characterAvatar?: string;
  situation: string;
  clues: string[];
  options: {
    name: string;
    description: string;
    isPrimary: boolean;
    feedback: string;
  }[];
  deeperTakeaway: string;
}

export interface PerspectiveChallengeItem {
  id: string;
  situation: string;
  automaticThought: string;
  distortionType: string;
  distortionExplanation: string;
  burdenWeight?: number;
  alternativePerspectives: {
    text: string;
    helpfulScore: number;
    feedback: string;
    lightnessValue?: number;
  }[];
  guidingQuestion: string;
}

export interface ReactConsequenceOption {
  id: string;
  title: string;
  actionType: 'impulsive' | 'avoidant' | 'conscious';
  description: string;
  shortTermConsequence: string;
  longTermConsequence: string;
  emotionalCost: string;
  reflection: string;
}

export interface BeforeYouReactItem {
  id: string;
  situation: string;
  triggerContext?: string;
  emotionSurge: string;
  initialHeartBpm?: number;
  physicalSensations: string[];
  options: ReactConsequenceOption[];
  mindfulKey: string;
}

export interface WisdomCard {
  id: string;
  title: string;
  quote: string;
  category: string;
  rarity: 'common' | 'rare' | 'legendary';
  icon: string;
  unlockedAtXp: number;
  reflection: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  actionText: string;
  psychologicalConcept: string;
  xpReward: number;
  category: 'physical' | 'social' | 'mindful' | 'boundary';
  icon: string;
  isCompleted?: boolean;
}

export interface AwarenessLevel {
  level: number;
  title: string;
  minXp: number;
  badge: string;
  description: string;
}
