import React, { useState } from 'react';
import { Language } from '../../types';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';
import { triggerConfetti } from '../../utils/confetti';
import { 
  Orbit, 
  Sparkles, 
  RotateCcw, 
  Bookmark, 
  Shield, 
  Heart, 
  BatteryCharging, 
  Zap, 
  Users, 
  Plus, 
  Trash2, 
  Sliders, 
  Compass,
  Info
} from 'lucide-react';

interface RelationalEnergyMatrixGameProps {
  language: Language;
  onAddXP?: (amount: number) => void;
  onBackToMap?: () => void;
}

type EnergyFlow = 'charging' | 'neutral' | 'draining';
type BoundaryHealth = 'healthy' | 'porous' | 'rigid';

interface RelationalNode {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'family' | 'friends' | 'work' | 'mentor' | 'drain' | 'custom';
  distance: number; // 1 (closest) to 10 (furthest)
  angle: number; // degrees in circle
  energyFlow: EnergyFlow;
  boundaryHealth: BoundaryHealth;
  color: string;
  icon: string;
}

const INITIAL_NODES: RelationalNode[] = [
  {
    id: 'n_fam',
    nameAr: 'العائلة والمقربون',
    nameEn: 'Family & Kin',
    category: 'family',
    distance: 3,
    angle: 45,
    energyFlow: 'charging',
    boundaryHealth: 'healthy',
    color: '#f59e0b',
    icon: '🏡'
  },
  {
    id: 'n_fri',
    nameAr: 'الأصدقاء الداعمون',
    nameEn: 'Supportive Friends',
    category: 'friends',
    distance: 4,
    angle: 135,
    energyFlow: 'charging',
    boundaryHealth: 'healthy',
    color: '#10b981',
    icon: '🤝'
  },
  {
    id: 'n_work',
    nameAr: 'زملاء وبيئة العمل',
    nameEn: 'Work & Colleagues',
    category: 'work',
    distance: 6,
    angle: 225,
    energyFlow: 'neutral',
    boundaryHealth: 'healthy',
    color: '#6366f1',
    icon: '💼'
  },
  {
    id: 'n_drain',
    nameAr: 'شخص دائم التذمر واللوم',
    nameEn: 'Chronic Complainer / Drain',
    category: 'drain',
    distance: 2, // starts too close, illustrating boundary violation
    angle: 315,
    energyFlow: 'draining',
    boundaryHealth: 'porous',
    color: '#ef4444',
    icon: '⚡'
  }
];

export const RelationalEnergyMatrixGame: React.FC<RelationalEnergyMatrixGameProps> = ({
  language,
  onAddXP,
  onBackToMap
}) => {
  const isAr = language === 'ar';

  const [nodes, setNodes] = useState<RelationalNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('n_drain');
  const [newCustomName, setNewCustomName] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Calculate overall Relational Energy Index (0 - 100%)
  const chargingCount = nodes.filter((n) => n.energyFlow === 'charging').length;
  const drainingCount = nodes.filter((n) => n.energyFlow === 'draining').length;
  // A drain that is too close (distance <= 4) causes heavy drain
  const criticalDrainCount = nodes.filter((n) => n.energyFlow === 'draining' && n.distance <= 4).length;
  
  const baseScore = Math.max(
    10,
    Math.min(100, Math.round(50 + (chargingCount * 15) - (drainingCount * 10) - (criticalDrainCount * 20)))
  );

  const handleUpdateDistance = (newDist: number) => {
    soundManager.playSoftTap();
    setNodes((prev) =>
      prev.map((n) => (n.id === selectedNodeId ? { ...n, distance: newDist } : n))
    );
  };

  const handleUpdateEnergyFlow = (flow: EnergyFlow) => {
    soundManager.playSoftTap();
    setNodes((prev) =>
      prev.map((n) => (n.id === selectedNodeId ? { ...n, energyFlow: flow } : n))
    );
  };

  const handleUpdateBoundaryHealth = (health: BoundaryHealth) => {
    soundManager.playSoftTap();
    setNodes((prev) =>
      prev.map((n) => (n.id === selectedNodeId ? { ...n, boundaryHealth: health } : n))
    );
  };

  const handleAddCustomNode = () => {
    if (!newCustomName.trim()) return;
    soundManager.playSoftTap();
    const newNode: RelationalNode = {
      id: `n_custom_${Date.now()}`,
      nameAr: newCustomName.trim(),
      nameEn: newCustomName.trim(),
      category: 'custom',
      distance: 5,
      angle: Math.floor(Math.random() * 360),
      energyFlow: 'neutral',
      boundaryHealth: 'healthy',
      color: '#06b6d4',
      icon: '✨'
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setNewCustomName('');
    setIsAddingNew(false);
  };

  const handleDeleteNode = (id: string) => {
    if (nodes.length <= 1) return;
    soundManager.playSoftTap();
    setNodes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(nodes[0].id);
    }
  };

  const handleReset = () => {
    soundManager.playSoftTap();
    setNodes(INITIAL_NODES);
    setSelectedNodeId('n_drain');
    setSavedSuccess(false);
  };

  const handleSaveConstellation = () => {
    soundManager.playSuccess();
    soundManager.playChime(528, 2.0);
    triggerConfetti();
    setSavedSuccess(true);
    if (onAddXP) onAddXP(50);

    saveMoment({
      gameId: 'relational-energy-matrix',
      gameTitle: isAr ? 'حصاد طاقة الروابط' : 'Relational Energy Matrix',
      quote: isAr 
        ? `«ضبطت منظومتي الكوكبية بمؤشر توازن ${baseScore}٪؛ مسافة الأمان تحمي السلام الداخلي»` 
        : `"Calibrated my relational planetary matrix to ${baseScore}% balance; safe boundaries protect inner peace"`,
      reflection: isAr 
        ? `رسمت خريطتي الاجتماعية المكونة من ${nodes.length} روابط أساسية، وضبطت حدود الاستنزاف بوعي.` 
        : `Mapped constellation of ${nodes.length} interpersonal bonds, successfully shielding from emotional drainage.`,
      tag: isAr ? 'هندسة العلاقات والحدود' : 'Relational Boundaries'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 text-stone-100 animate-fadeIn" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-slate-900/90 border border-indigo-500/30 p-4 rounded-3xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Orbit className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black font-serif text-slate-100">
                {isAr ? 'حصاد طاقة الروابط' : 'The Relational Energy Matrix'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-700/60 flex items-center gap-1">
                <Compass className="w-2.5 h-2.5" />
                {isAr ? 'محاكاة كوكبية للحدود' : 'Orbital Boundaries'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr 
                ? 'في المركز تقف ذاتك؛ اضبط تفاعلياً مسافة كل علاقة وتدفق طاقتها لاكتشاف توازنك النفسي' 
                : 'Your Self stands at the center. Calibrate distances and energy charges to safeguard your peace'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
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

      {/* Main Simulation Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left/Center: Visual Orbital Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden">
          {/* Orbital Celestial Ambient Background */}
          <div className="absolute inset-0 bg-radial-[at_center] from-indigo-950/30 via-slate-950 to-slate-950 pointer-events-none" />

          {/* Top Battery Status Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs font-bold pb-3 border-b border-slate-850">
            <div className="flex items-center gap-2">
              <BatteryCharging className={`w-4 h-4 ${baseScore > 65 ? 'text-emerald-400' : baseScore > 40 ? 'text-amber-400' : 'text-rose-400'}`} />
              <span className="text-slate-300">{isAr ? 'مؤشر بطارية العلاقات:' : 'Relational Battery:'}</span>
              <span className={`font-mono text-sm ${baseScore > 65 ? 'text-emerald-400' : baseScore > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                {baseScore}%
              </span>
            </div>

            <span className="text-[11px] text-slate-400">
              {baseScore > 65 
                ? (isAr ? '✨ حدود متزنة وشاحنة' : '✨ Balanced & Restorative')
                : baseScore > 40 
                ? (isAr ? '⚠️ استنزاف متوسط يحتاج ضبطاً' : '⚠️ Moderate Drain')
                : (isAr ? '🚨 استنزاف حاد؛ أبعد الدوائر الضاغطة' : '🚨 Severe Drain; Move drains further')}
            </span>
          </div>

          {/* Interactive SVG Orbital Solar System */}
          <div className="relative z-10 my-4 w-full h-[320px] sm:h-[360px] flex items-center justify-center select-none">
            <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
              {/* Concentric Orbit Rings */}
              {/* Ring 1: Intimate Circle (dist <= 3.5) */}
              <circle cx="200" cy="200" r="55" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
              {/* Ring 2: Social Circle (dist <= 7) */}
              <circle cx="200" cy="200" r="110" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
              {/* Ring 3: Outer Protective Boundary (dist <= 10) */}
              <circle cx="200" cy="200" r="165" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" opacity="0.2" />

              {/* Central Core: Self (دائرة الذات) */}
              <g>
                <circle cx="200" cy="200" r="28" fill="#4f46e5" opacity="0.3" className="animate-pulse" />
                <circle cx="200" cy="200" r="20" fill="url(#selfGrad)" stroke="#818cf8" strokeWidth="2" />
                <text x="200" y="204" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" pointerEvents="none">
                  {isAr ? 'الذات' : 'Self'}
                </text>
              </g>

              {/* Gradients */}
              <defs>
                <radialGradient id="selfGrad">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#3730a3" />
                </radialGradient>
              </defs>

              {/* Render Orbiting Nodes */}
              {nodes.map((node) => {
                // Map distance 1..10 to radius 40..175
                const radius = 35 + node.distance * 14;
                const rad = (node.angle * Math.PI) / 180;
                const cx = 200 + radius * Math.cos(rad);
                const cy = 200 + radius * Math.sin(rad);

                const isSelected = node.id === selectedNodeId;
                const isDraining = node.energyFlow === 'draining';
                const isCharging = node.energyFlow === 'charging';

                return (
                  <g
                    key={node.id}
                    onClick={() => {
                      soundManager.playSoftTap();
                      setSelectedNodeId(node.id);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Aura if selected or charging */}
                    {isSelected && (
                      <circle cx={cx} cy={cy} r="22" fill={node.color} opacity="0.35" className="animate-ping" />
                    )}

                    {/* Main Node Body */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill={node.color}
                      stroke={isSelected ? '#ffffff' : isDraining ? '#fca5a5' : '#e0e7ff'}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      className="transition-all duration-300 group-hover:scale-125"
                    />

                    {/* Node Icon */}
                    <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" pointerEvents="none">
                      {node.icon}
                    </text>

                    {/* Node Label Text */}
                    <text
                      x={cx}
                      y={cy + 26}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#94a3b8'}
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      pointerEvents="none"
                    >
                      {isAr ? node.nameAr : node.nameEn}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Orbit Legend */}
          <div className="relative z-10 flex items-center justify-around text-[10px] text-slate-400 pt-2 border-t border-slate-850">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              {isAr ? 'الدائرة القريبة الحميمية' : 'Inner Circle (1-3)'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              {isAr ? 'الدائرة الاجتماعية (4-7)' : 'Social Circle (4-7)'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              {isAr ? 'حدود الأمان الخارجية (8-10)' : 'Protective Perimeter (8-10)'}
            </span>
          </div>
        </div>

        {/* Right: Node Controls & Psychological Analytics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Node Control Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedNode.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    {isAr ? selectedNode.nameAr : selectedNode.nameEn}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    {isAr ? 'المسافة الحالية:' : 'Distance:'} {selectedNode.distance} / 10
                  </span>
                </div>
              </div>

              {selectedNode.category === 'custom' && (
                <button
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                  title={isAr ? 'حذف هذه العلاقة' : 'Remove connection'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Slider: Distance from Self */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-indigo-400" />
                  {isAr ? 'المسافة عن دائرة الذات:' : 'Distance from Self:'}
                </span>
                <span className="font-mono text-indigo-400">{selectedNode.distance}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={selectedNode.distance}
                onChange={(e) => handleUpdateDistance(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{isAr ? 'قريب جداً (١)' : 'Very Close (1)'}</span>
                <span>{isAr ? 'مسافة متوازنة (٥)' : 'Moderate (5)'}</span>
                <span>{isAr ? 'حدود بعيدة (١٠)' : 'Firm Perimeter (10)'}</span>
              </div>
            </div>

            {/* Energy Flow Toggle: Charging vs Neutral vs Draining */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                {isAr ? 'أثر العلاقة على طاقتك النفسية:' : 'Energy Flow Dynamic:'}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'charging', labelAr: 'شاحنة (+)', labelEn: 'Charging (+)', color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300' },
                  { id: 'neutral', labelAr: 'متوازنة (=)', labelEn: 'Neutral (=)', color: 'border-sky-500 bg-sky-950/40 text-sky-300' },
                  { id: 'draining', labelAr: 'مستنزفة (-)', labelEn: 'Draining (-)', color: 'border-rose-500 bg-rose-950/40 text-rose-300' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleUpdateEnergyFlow(item.id as EnergyFlow)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedNode.energyFlow === item.id
                        ? `${item.color} shadow-sm`
                        : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {isAr ? item.labelAr : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Psychological Guidance Box */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-indigo-400 mb-1">
                <Info className="w-3.5 h-3.5" />
                <span>{isAr ? 'نصيحة المعايرة النفسية:' : 'Boundary Calibration Insight:'}</span>
              </div>

              {selectedNode.energyFlow === 'draining' && selectedNode.distance <= 4 ? (
                <p className="text-rose-300">
                  {isAr 
                    ? '⚠️ هذه العلاقة مستنزفة وقريبة جداً من ذاتك! ينصح بزيادة المسافة إلى (٦ - ٨) ووضع حدود واضحة للتواصل لحماية طاقتك.' 
                    : '⚠️ Severe boundary breach! A draining bond too close damages your nervous system. Move distance to (6-8) to stay safe.'}
                </p>
              ) : selectedNode.energyFlow === 'charging' && selectedNode.distance >= 7 ? (
                <p className="text-amber-300">
                  {isAr 
                    ? '💡 هذه العلاقة مصدر طاقة وشحن حقيقي لكنها بعيدة نسبياً. قربها إلى (٢ - ٤) لاستمداد الدعم الإنساني الصادق.' 
                    : '💡 This connection is deeply supportive yet far away. Bring it closer (2-4) to nourish your emotional battery.'}
                </p>
              ) : (
                <p className="text-slate-300">
                  {isAr 
                    ? '✓ المسافة الحالية متوازنة وتمنحك مساحة للتنفس الذاتي دون اختراق أو انعزال.' 
                    : '✓ Current calibration is harmonious, offering space for autonomy without isolation.'}
                </p>
              )}
            </div>

            {/* Add Custom Connection Drawer */}
            {isAddingNew ? (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <input
                  type="text"
                  value={newCustomName}
                  onChange={(e) => setNewCustomName(e.target.value)}
                  placeholder={isAr ? 'اسم الشخص أو المجال (مثلاً: صديق الجامعة)...' : 'Name connection (e.g., Mentor, Neighbor)...'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddCustomNode}
                    className="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isAr ? 'إضافة إلى المدار' : 'Add to Orbit'}
                  </button>
                  <button
                    onClick={() => setIsAddingNew(false)}
                    className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full py-2 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة علاقة أو مجال جديد' : 'Add Custom Connection'}</span>
              </button>
            )}
          </div>

          {/* Action: Save Constellation to Journey */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-2">
            <button
              onClick={handleSaveConstellation}
              disabled={savedSuccess}
              className={`w-full py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white shadow-lg shadow-indigo-600/30'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>
                {savedSuccess 
                  ? (isAr ? 'تم حفظ خريطة الروابط في دفتر رحلتك ✓' : 'Constellation Saved to Journey ✓')
                  : (isAr ? 'اعتماد وحفظ خريطة الروابط الشخصية 🌟' : 'Save Personal Constellation Map 🌟')}
              </span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              {isAr ? 'يتم حفظ الخريطة والمؤشر في دفتر رحلتك كمرجع دوري لمراجعة حدودك' : 'Map is preserved in your Journey drawer to review your boundaries periodically'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RelationalEnergyMatrixGame;
