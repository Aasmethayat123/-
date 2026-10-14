import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Wind, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Bookmark, 
  Sun, 
  Heart, 
  CheckCircle, 
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Moon
} from 'lucide-react';

interface InnerLabyrinthGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

interface LabyrinthNode {
  id: string;
  x: number; // percentage in grid 0-100
  y: number; // percentage in grid 0-100
  type: 'start' | 'path' | 'stress' | 'sanctuary';
  labelAr: string;
  labelEn: string;
  stressThemeAr?: string;
  stressThemeEn?: string;
  stressInsightAr?: string;
  stressInsightEn?: string;
  isCleared?: boolean;
}

interface LabyrinthEdge {
  from: string;
  to: string;
}

const LABYRINTH_NODES: LabyrinthNode[] = [
  { id: 'start', x: 12, y: 50, type: 'start', labelAr: 'البداية', labelEn: 'Origin', isCleared: true },
  { id: 'n1', x: 28, y: 25, type: 'path', labelAr: 'مسار الهدوء الأول', labelEn: 'Path I', isCleared: true },
  { 
    id: 's1', 
    x: 45, 
    y: 25, 
    type: 'stress', 
    labelAr: 'بقعة توتر: تزاحم المهام', 
    labelEn: 'Stress: Overload',
    stressThemeAr: 'تزاحم الأفكار والمهام المستقبلية',
    stressThemeEn: 'Racing thoughts of tomorrow and endless tasks',
    stressInsightAr: 'الآن ليس وقت حل كل شيء؛ هذه اللحظة مخصصة فقط لأنفاسك وجسدك الحاضر.',
    stressInsightEn: 'Now is not the time to solve everything; this present second is strictly for your breath.',
    isCleared: false 
  },
  { id: 'n2', x: 28, y: 75, type: 'path', labelAr: 'مسار التأمل السفلي', labelEn: 'Path II', isCleared: true },
  { 
    id: 's2', 
    x: 45, 
    y: 75, 
    type: 'stress', 
    labelAr: 'بقعة توتر: لوم الذات', 
    labelEn: 'Stress: Self-Blame',
    stressThemeAr: 'شعور بالتقصير أو الندم على ما فات',
    stressThemeEn: 'Lingering guilt or regret over past mistakes',
    stressInsightAr: 'الماضي تجربة للتذكر لا للإقامة فيها. اغفر لنفسك أنك تصرفت بما كنت تعرفه حينها.',
    stressInsightEn: 'The past is a place of reference, not residence. Forgive yourself for what you did not know.',
    isCleared: false 
  },
  { id: 'n3', x: 65, y: 50, type: 'path', labelAr: 'ممر العبور الواعي', labelEn: 'Gateway', isCleared: false },
  { 
    id: 's3', 
    x: 78, 
    y: 50, 
    type: 'stress', 
    labelAr: 'بقعة توتر: المجهول', 
    labelEn: 'Stress: Uncertainty',
    stressThemeAr: 'الخوف من المجهول وفقدان السيطرة',
    stressThemeEn: 'Fear of the unknown and fear of losing control',
    stressInsightAr: 'لا تحتاج لمعرفة كل الطريق؛ يكفيك نور الخطوة القادمة فقط.',
    stressInsightEn: 'You do not need to see the entire staircase; just trust the light on your next single step.',
    isCleared: false 
  },
  { id: 'sanctuary', x: 92, y: 50, type: 'sanctuary', labelAr: 'بر الأمان (السلام الداخلي)', labelEn: 'Sanctuary of Inner Peace', isCleared: false },
];

const LABYRINTH_EDGES: LabyrinthEdge[] = [
  { from: 'start', to: 'n1' },
  { from: 'start', to: 'n2' },
  { from: 'n1', to: 's1' },
  { from: 'n2', to: 's2' },
  { from: 's1', to: 'n3' },
  { from: 's2', to: 'n3' },
  { from: 'n3', to: 's3' },
  { from: 's3', to: 'sanctuary' },
];

export const InnerLabyrinthGame: React.FC<InnerLabyrinthGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [clearedNodes, setClearedNodes] = useState<Set<string>>(new Set(['start', 'n1', 'n2']));
  
  // Guided breathing active state
  const [activeBreathingNode, setActiveBreathingNode] = useState<LabyrinthNode | null>(null);
  const [breathingSecondsLeft, setBreathingSecondsLeft] = useState<number>(10);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  
  // Sanctuary completed state
  const [isReachedSanctuary, setIsReachedSanctuary] = useState<boolean>(false);
  const [savedMomentSuccess, setSavedMomentSuccess] = useState<boolean>(false);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeBreathingNode || isReachedSanctuary) return;
      if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
        // Move to the next connected viable node
        const connectedEdges = LABYRINTH_EDGES.filter(
          (edge) => edge.from === currentNodeId || edge.to === currentNodeId
        );
        const targetNodes = connectedEdges.map((edge) => (edge.from === currentNodeId ? edge.to : edge.from));
        // Pick the first one that moves forward
        const forwardNode = targetNodes.find((id) => id !== currentNodeId);
        if (forwardNode) {
          handleMoveToNode(forwardNode);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentNodeId, activeBreathingNode, isReachedSanctuary, clearedNodes]);

  // Breathing timer loop
  useEffect(() => {
    if (!activeBreathingNode) return;

    if (breathingSecondsLeft <= 0) {
      // Completed breathing exercise!
      soundManager.playSuccess();
      soundManager.playChime(528, 2.5);
      const nodeId = activeBreathingNode.id;
      setClearedNodes((prev) => new Set([...prev, nodeId, 'n3']));
      setActiveBreathingNode(null);
      setCurrentNodeId(nodeId);
      return;
    }

    // Phase management:
    // 10-7s: Inhale (4s)
    // 6-5s: Hold (2s)
    // 4-0s: Exhale (4s)
    if (breathingSecondsLeft > 6) {
      setBreathingPhase('inhale');
    } else if (breathingSecondsLeft > 4) {
      setBreathingPhase('hold');
    } else {
      setBreathingPhase('exhale');
    }

    const timer = setTimeout(() => {
      setBreathingSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeBreathingNode, breathingSecondsLeft]);

  const handleMoveToNode = (targetId: string) => {
    if (activeBreathingNode) return;
    
    // Check if connected
    const isConnected = LABYRINTH_EDGES.some(
      (edge) => 
        (edge.from === currentNodeId && edge.to === targetId) ||
        (edge.to === currentNodeId && edge.from === targetId)
    );

    if (!isConnected) return;

    const targetNode = LABYRINTH_NODES.find((n) => n.id === targetId);
    if (!targetNode) return;

    soundManager.playSoftTap();

    // Check if this is an uncleared stress node
    if (targetNode.type === 'stress' && !clearedNodes.has(targetId)) {
      // Trigger guided 10-second breathing
      soundManager.playChime(396, 1.8);
      setActiveBreathingNode(targetNode);
      setBreathingSecondsLeft(10);
      setBreathingPhase('inhale');
      return;
    }

    // Move orb
    setCurrentNodeId(targetId);

    // If sanctuary reached
    if (targetNode.type === 'sanctuary' && !isReachedSanctuary) {
      setIsReachedSanctuary(true);
      soundManager.playSuccess();
      soundManager.playChime(528, 3.0);
      triggerConfetti();
      if (onAddXP) onAddXP(50);
    }
  };

  const handleResetGame = () => {
    soundManager.playSoftTap();
    setCurrentNodeId('start');
    setClearedNodes(new Set(['start', 'n1', 'n2']));
    setActiveBreathingNode(null);
    setIsReachedSanctuary(false);
    setSavedMomentSuccess(false);
  };

  const handleSaveSanctuaryMoment = () => {
    soundManager.playChime(520, 2.0);
    setSavedMomentSuccess(true);
    saveMoment({
      gameId: 'inner-labyrinth',
      gameTitle: isAr ? 'متاهة الهدوء التفاعلية' : 'The Inner Labyrinth',
      quote: isAr 
        ? '«وصلت إلى بر الأمان؛ أنفاسي كانت مفتاحي لعبور بقع التوتر والضجيج»' 
        : '"I reached the inner sanctuary; my breath was the compass that dissolved tension into light"',
      reflection: isAr 
        ? 'تجربة تأملية حقيقية لتهدئة الجهاز العصبي وتحويل ضغوط اليوم إلى مسارات سلام.' 
        : 'Authentic mindfulness navigation regulating somatic tension through 10-second synchronized breathwork.',
      tag: isAr ? 'سكينة وهدوء باطني' : 'Mindful Sanctuary'
    });
  };

  const currentNode = LABYRINTH_NODES.find((n) => n.id === currentNodeId);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 text-stone-100 animate-fadeIn" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-slate-900/90 border border-teal-500/30 p-4 rounded-3xl shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black font-serif text-teal-100">
                {isAr ? 'متاهة الهدوء التفاعلية' : 'The Inner Labyrinth'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                {isAr ? 'تأمل وحركة خالية من الضغط' : 'Mindful Flow'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr 
                ? 'حرك كرة النور بهدوء.. وعند مصادفة بقع التوتر، سيتفتح المسار بتمرين تنفس بسيط لمدة ١٠ ثوانٍ' 
                : 'Guide the orb of light calmly. Dissolve stress nodes through 10-second synchronous breathwork'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleResetGame}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة المتاهة' : 'Restart'}</span>
          </button>

          {onBackToMap && (
            <button
              onClick={() => {
                soundManager.playSoftTap();
                onBackToMap();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-200 transition-colors cursor-pointer border border-slate-700"
            >
              {isAr ? '← خريطة الألعاب' : '← Back'}
            </button>
          )}
        </div>
      </div>

      {/* Main Labyrinth Board */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden min-h-[460px] flex flex-col justify-between">
        {/* Ambient Cosmic Background */}
        <div className="absolute inset-0 bg-radial-[at_top_center] from-teal-950/40 via-slate-950 to-slate-950 pointer-events-none" />

        {/* Labyrinth Top Guidance */}
        <div className="relative z-10 flex items-center justify-between text-xs font-bold text-slate-400 pb-3 border-b border-slate-800/80">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-sm shadow-teal-400 animate-pulse" />
            {isAr ? 'الموقع الحالي:' : 'Current Spot:'} {isAr ? currentNode?.labelAr : currentNode?.labelEn}
          </span>
          <span className="text-[11px] text-teal-400 flex items-center gap-1">
            <Moon className="w-3.5 h-3.5" />
            {isAr ? 'لا يوجد مؤقت أو خسارة.. خذ كامل راحتك' : 'No timers or pressure. Move at your natural rhythm'}
          </span>
        </div>

        {/* The Interactive Interactive SVG Map Canvas */}
        <div className="relative z-10 my-4 sm:my-6 w-full h-[280px] sm:h-[320px] bg-slate-900/60 rounded-2xl border border-slate-800/80 p-2 sm:p-4 select-none">
          <svg className="w-full h-full overflow-visible">
            {/* Draw Connecting Pathways */}
            {LABYRINTH_EDGES.map((edge) => {
              const n1 = LABYRINTH_NODES.find((n) => n.id === edge.from);
              const n2 = LABYRINTH_NODES.find((n) => n.id === edge.to);
              if (!n1 || !n2) return null;

              const isEdgeUnlocked = clearedNodes.has(edge.from) && clearedNodes.has(edge.to);

              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={`${n1.x}%`}
                  y1={`${n1.y}%`}
                  x2={`${n2.x}%`}
                  y2={`${n2.y}%`}
                  stroke={isEdgeUnlocked ? '#2dd4bf' : '#334155'}
                  strokeWidth={isEdgeUnlocked ? '3' : '2'}
                  strokeDasharray={isEdgeUnlocked ? 'none' : '4,4'}
                  className="transition-all duration-700"
                />
              );
            })}

            {/* Draw Nodes */}
            {LABYRINTH_NODES.map((node) => {
              const isPlayerHere = currentNodeId === node.id;
              const isCleared = clearedNodes.has(node.id);
              const isStress = node.type === 'stress';
              const isSanctuary = node.type === 'sanctuary';

              let fillColor = '#1e293b';
              let strokeColor = '#475569';
              let radius = 18;

              if (isSanctuary) {
                fillColor = isCleared || isPlayerHere ? '#0d9488' : '#1e293b';
                strokeColor = '#5eead4';
                radius = 24;
              } else if (isStress) {
                fillColor = isCleared ? '#115e59' : '#881337';
                strokeColor = isCleared ? '#2dd4bf' : '#f43f5e';
                radius = 20;
              } else if (isCleared) {
                fillColor = '#0f766e';
                strokeColor = '#2dd4bf';
              }

              return (
                <g
                  key={node.id}
                  onClick={() => handleMoveToNode(node.id)}
                  className="cursor-pointer group"
                >
                  {/* Subtle Node Aura */}
                  {(isPlayerHere || isSanctuary) && (
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={radius + 8}
                      fill={isSanctuary ? '#14b8a6' : '#2dd4bf'}
                      opacity="0.25"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={radius}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    className="transition-all duration-500 group-hover:scale-110"
                  />

                  {/* Node Icon / Symbol */}
                  <text
                    x={`${node.x}%`}
                    y={`${node.y}%`}
                    textAnchor="middle"
                    dy="4"
                    fontSize="11"
                    fill="#ffffff"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {isSanctuary ? '🕊️' : isStress ? (isCleared ? '✨' : '💨') : '✦'}
                  </text>
                </g>
              );
            })}

            {/* The Active Orb of Light Marker */}
            {currentNode && (
              <g
                style={{
                  transform: `translate(${currentNode.x}%, ${currentNode.y}%)`,
                  transition: 'transform 0.5s ease-in-out'
                }}
              >
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="#ffffff"
                  className="animate-ping opacity-75"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="8"
                  fill="#fef08a"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Guided Breathing Overlay Modal (Tension Release) */}
        {activeBreathingNode && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="max-w-md w-full space-y-5">
              <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-bold">
                <Wind className="w-4 h-4 animate-bounce" />
                <span>{isAr ? 'صادفت بقعة توتر.. لفتح الطريق تنفس مع الدائرة' : 'Stress Node Encountered — Breathe with the circle to dissolve'}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-100 font-serif">
                {isAr ? activeBreathingNode.stressThemeAr : activeBreathingNode.stressThemeEn}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                {isAr ? activeBreathingNode.stressInsightAr : activeBreathingNode.stressInsightEn}
              </p>

              {/* Pulsing Synchronous Breathing Circle */}
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center my-4">
                <div
                  className={`absolute rounded-full transition-all duration-1000 flex items-center justify-center ${
                    breathingPhase === 'inhale'
                      ? 'w-36 h-36 bg-gradient-to-tr from-teal-500/40 to-indigo-500/40 border-2 border-teal-300 scale-110 shadow-lg shadow-teal-500/30'
                      : breathingPhase === 'hold'
                      ? 'w-36 h-36 bg-indigo-500/40 border-2 border-indigo-300 scale-105'
                      : 'w-24 h-24 bg-teal-500/20 border-2 border-teal-400 scale-90'
                  }`}
                />
                <div className="relative z-10 text-center">
                  <div className="text-lg font-black text-white">
                    {breathingPhase === 'inhale' 
                      ? (isAr ? 'شهيق لطيف..' : 'Inhale Gently..') 
                      : breathingPhase === 'hold' 
                      ? (isAr ? 'سكون وراحة..' : 'Gentle Pause..') 
                      : (isAr ? 'زفير التحرر..' : 'Release Exhale..')}
                  </div>
                  <div className="text-2xl font-black text-teal-300 font-mono mt-1">
                    {breathingSecondsLeft}s
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                {isAr ? 'الهدوء يأتي مع كل زفير يغادر صدرك' : 'Stillness arrives as tension dissolves with every exhale'}
              </div>
            </div>
          </div>
        )}

        {/* Reached Sanctuary of Inner Peace Screen */}
        {isReachedSanctuary && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-900/60 via-slate-900 to-indigo-950/80 border border-teal-500/40 text-center space-y-4 animate-fadeIn">
            <div className="text-4xl animate-bounce">🕊️✨</div>
            <h2 className="text-xl sm:text-2xl font-black text-teal-200 font-serif">
              {isAr ? 'مبارك.. وصلت إلى بر الأمان ومركز السلام الداخلي' : 'Sanctuary Reached: Inner Peace Center'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              {isAr 
                ? 'لقد عبرت المتاهة بالكامل، وواجهت كل بقعة توتر بوعيك وتنفسك. هذا المركز الآمن موجود دائماً بداخلك كلما أردت العودة إليه.' 
                : 'You navigated the entire inner labyrinth, dissolving every stress node with mindful breath. This sanctuary is always inside you.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSaveSanctuaryMoment}
                disabled={savedMomentSuccess}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  savedMomentSuccess
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-slate-900 hover:bg-slate-100 shadow-md'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>
                  {savedMomentSuccess 
                    ? (isAr ? 'تم الحفظ في دفتر رحلتك ✓' : 'Saved to Your Journey ✓')
                    : (isAr ? 'حفظ لحظة السلام في دفتر رحلتي' : 'Save Moment to My Journey')}
                </span>
              </button>

              <button
                onClick={handleResetGame}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'خوض رحلة تأمل جديدة' : 'Play Again'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Interactive Touch / Click Direction Buttons */}
        {!isReachedSanctuary && !activeBreathingNode && (
          <div className="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              {isAr ? 'انقر على النقاط في المتاهة أو استخدم الأزرار للتقدم:' : 'Tap nodes directly or use path buttons to advance:'}
            </div>

            <div className="flex items-center gap-2">
              {LABYRINTH_EDGES
                .filter((e) => e.from === currentNodeId || e.to === currentNodeId)
                .map((edge) => {
                  const targetId = edge.from === currentNodeId ? edge.to : edge.from;
                  const targetNode = LABYRINTH_NODES.find((n) => n.id === targetId);
                  if (!targetNode) return null;

                  return (
                    <button
                      key={targetId}
                      onClick={() => handleMoveToNode(targetId)}
                      className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-xs font-bold text-teal-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isAr ? `نحو: ${targetNode.labelAr}` : `Go to: ${targetNode.labelEn}`}</span>
                      <ArrowRight className={`w-3 h-3 ${isAr ? 'rotate-180' : ''}`} />
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default InnerLabyrinthGame;
