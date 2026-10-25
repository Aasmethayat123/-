import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Sun,
  KeyRound,
  Waves,
  Star,
  Scale,
  FlaskConical,
  BookOpen,
  Compass,
} from 'lucide-react';
import {
  COLLECTIBLES_CATALOG,
  ISLAND_CLUES,
  IslandChallengeDef,
} from '../../data/movingIslandData';
import {
  ARCHIVE_CODEX_ITEMS,
  completeIslandPuzzleChallenge,
  GATE_SCALES_DILEMMAS,
  IslandPuzzlePayload,
  IslandSyncNotification,
  MovingIslandSaveState,
} from '../../utils/movingIslandManager';
import { soundManager } from '../../utils/audio';

interface IslandInterconnectedPuzzleModalProps {
  challenge: IslandChallengeDef;
  islandState: MovingIslandSaveState;
  onClose: () => void;
  onSolved: (newState: MovingIslandSaveState, notification?: IslandSyncNotification) => void;
  onAddXP?: (amount: number) => void;
}

const SYMBOL_OPTIONS: { id: string; labelAr: string; icon: React.ReactNode }[] = [
  { id: 'sun', labelAr: 'شمس الفجر', icon: <Sun className="w-5 h-5 text-amber-500" /> },
  { id: 'key', labelAr: 'مفتاح الوادي', icon: <KeyRound className="w-5 h-5 text-emerald-500" /> },
  { id: 'wave', labelAr: 'موجة السكينة', icon: <Waves className="w-5 h-5 text-sky-500" /> },
  { id: 'star', labelAr: 'نجمة الهداية', icon: <Star className="w-5 h-5 text-violet-500" /> },
];

const ELIXIR_OPTIONS: { id: string; labelAr: string; colorClass: string }[] = [
  {
    id: 'emerald_roots',
    labelAr: 'ندى الجذور الزمردية (القاعدة)',
    colorClass: 'bg-emerald-600 text-white border-emerald-400',
  },
  {
    id: 'azure_clarity',
    labelAr: 'صفاء السماء الأزرق (القلب)',
    colorClass: 'bg-sky-600 text-white border-sky-400',
  },
  {
    id: 'golden_hope',
    labelAr: 'إشراقة الأمل الذهبي (التاج)',
    colorClass: 'bg-amber-500 text-stone-950 border-amber-300',
  },
];

const BRIDGE_WEIGHTS = [2, 3, 4, 6];

export const IslandInterconnectedPuzzleModal: React.FC<IslandInterconnectedPuzzleModalProps> = ({
  challenge,
  islandState,
  onClose,
  onSolved,
  onAddXP,
}) => {
  const puzzleType =
    challenge.verification.kind === 'island_puzzle'
      ? challenge.verification.puzzleType
      : 'symbol_lock';

  // 1. Symbol Lock state
  const [dials, setDials] = useState<string[]>(['wave', 'sun', 'star', 'key']);

  // 2. Bridge Counterweight state: 4 slots [-2, -1, +1, +2]
  const [bridgeSlots, setBridgeSlots] = useState<(number | null)[]>([null, null, null, null]);
  const [selectedWeight, setSelectedWeight] = useState<number | null>(2);

  // 3. Elixir Synthesis state: layers from bottom (index 0) to top (index 2)
  const [elixirLayers, setElixirLayers] = useState<string[]>([]);

  // 4. Archive Codex state: itemId -> shelfIndex (0, 1, 2)
  const [codexAssignments, setCodexAssignments] = useState<Record<string, number>>({});
  const [activeCodexItem, setActiveCodexItem] = useState<string>(ARCHIVE_CODEX_ITEMS[0].id);

  // 5. Gate Scales state: dilemmaId -> boolean (true = inHands, false = release)
  const [gateChoices, setGateChoices] = useState<Record<string, boolean>>({});

  // 6. Star Triangulation state: 3 rings (1..8)
  const [rings, setRings] = useState<[number, number, number]>([1, 1, 1]);

  const alreadyClaimed = islandState.claimedChallengeIds.includes(challenge.id);
  const [hintTier, setHintTier] = useState<0 | 1 | 2>(0);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [justSolved, setJustSolved] = useState(false);

  // Compute live torque for bridge puzzle
  const liveTorque =
    (bridgeSlots[0] || 0) * -2 +
    (bridgeSlots[1] || 0) * -1 +
    (bridgeSlots[2] || 0) * 1 +
    (bridgeSlots[3] || 0) * 2;

  const placedWeights = bridgeSlots.filter((w): w is number => w !== null);

  const handlePlaceBridgeWeight = (slotIdx: number) => {
    soundManager.playSoftTap();
    if (bridgeSlots[slotIdx] !== null && selectedWeight === null) {
      const next = [...bridgeSlots];
      next[slotIdx] = null;
      setBridgeSlots(next);
      return;
    }
    if (selectedWeight === null) return;
    // Remove selectedWeight from any other slot first
    const cleaned = bridgeSlots.map((w) => (w === selectedWeight ? null : w));
    cleaned[slotIdx] = selectedWeight;
    setBridgeSlots(cleaned);
    const remaining = BRIDGE_WEIGHTS.find((w) => !cleaned.includes(w)) ?? null;
    setSelectedWeight(remaining);
  };

  const handleResetPuzzle = () => {
    soundManager.playSoftTap();
    setFeedback(null);
    setJustSolved(false);
    setDials(['wave', 'sun', 'star', 'key']);
    setBridgeSlots([null, null, null, null]);
    setSelectedWeight(2);
    setElixirLayers([]);
    setCodexAssignments({});
    setGateChoices({});
    setRings([1, 1, 1]);
  };

  const buildPayload = (): IslandPuzzlePayload | null => {
    switch (puzzleType) {
      case 'symbol_lock':
        return { type: 'symbol_lock', symbols: dials };
      case 'bridge_counterweight':
        if (bridgeSlots.some((s) => s === null)) {
          setFeedback({
            ok: false,
            text: 'ضع الأوزان الحجرية الأربعة جميعها في المواضع المخصصة على جانبي الجسر أولاً.',
          });
          return null;
        }
        return {
          type: 'bridge_counterweight',
          slots: bridgeSlots as [number, number, number, number],
        };
      case 'elixir_synthesis':
        return { type: 'elixir_synthesis', layers: elixirLayers };
      case 'archive_codex':
        return { type: 'archive_codex', assignments: codexAssignments };
      case 'gate_scales':
        if (Object.keys(gateChoices).length < GATE_SCALES_DILEMMAS.length) {
          setFeedback({
            ok: false,
            text: 'صنّف جميع المواقف الأربعة بين «في إيدي» و«برّا إيدي» قبل فتح البوابة.',
          });
          return null;
        }
        return { type: 'gate_scales', choices: gateChoices };
      case 'star_triangulation':
        return { type: 'star_triangulation', rings };
    }
  };

  const handleSubmit = () => {
    const payload = buildPayload();
    if (!payload) {
      soundManager.playIncorrect();
      return;
    }

    const res = completeIslandPuzzleChallenge(challenge.id, payload, onAddXP);
    if (res.success) {
      soundManager.playLevelUpFanfare();
      setFeedback({
        ok: true,
        text: res.alreadyClaimed
          ? `${res.feedbackAr} (تمت إعادة التجربة بنجاح دون تكرار المكافأة المستلمة سابقاً).`
          : res.feedbackAr,
      });
      setJustSolved(true);
      onSolved(res.state, res.notification);
    } else {
      setAttemptsCount((prev) => prev + 1);
      soundManager.playIncorrect();
      setFeedback({ ok: false, text: res.feedbackAr });
    }
  };

  const getHintsForPuzzle = (): [string, string] => {
    switch (puzzleType) {
      case 'symbol_lock':
        return [
          'تلميح ١: اقرأ الجملة المنقوشة على المسلة؛ كل فعل فيها يشير إلى رمز واحد بالترتيب الزمني من شروق الفجر حتى ظهور النجم.',
          'تلميح ٢: الترس ١ هو ما يشرق فجراً، والترس ٢ هو ما يدور في الصخر، والترس ٣ هو ما يسكن فوق البحر، والترس ٤ هو ما يهدي السائر ليلاً.',
        ];
      case 'bridge_counterweight':
        return [
          'تلميح ١: الموضع البعيد يضاعف الوزن (×٢)، والموضع القريب يحتسب الوزن كما هو (×١). حاول جعل مجموع عزم اليسار يساوي مجموع عزم اليمين.',
          'تلميح ٢: للوصول إلى عزم متساوٍ قدره (١٠) على كل جانب، ضع حجراً صغيراً في أقصى اليسار (×٢) مع أثقل حجر في قريب اليسار (×١)، ثم وازنهما بالحجرين المتبقيين يميناً.',
        ];
      case 'elixir_synthesis':
        return [
          'تلميح ١: الحوض يمتلئ من القاع إلى الأعلى؛ ابدأ بما يثبت في الأرض قبل ما يرتفع نحو السماء.',
          'تلميح ٢: الطبقة الأولى في قاع الحوض هي خلاصة الجذور، وتعلوها طبقة صفاء السماء، ثم تتوّج القمة بإشراقة الأمل.',
        ];
      case 'archive_codex':
        return [
          'تلميح ١: صُنّفت الخزانة بحسب خفة العناصر وطبيعتها: مصادر الضوء في الأعلى، والورق المدوّن في الوسط، وما ينتمي للأرض والماء في الأسفل.',
          'تلميح ٢: كل رف يستقبل عنصرين تماماً؛ ضع العنصرين المضيئين في الرف ١، والسجلّين المكتوبين في الرف ٢، والنبات والحجر في الرف ٣.',
        ];
      case 'gate_scales':
        return [
          'تلميح ١: اسأل نفسك عند كل عبارة: هل أستطيع تنفيذ هذا الفعل بنفسي الآن، أم أنه يعتمد على الطقس أو نوايا الآخرين؟',
          'تلميح ٢: يوجد موقفان فقط يقعان تحت اختيارك المباشر (خطوتك وحديثك مع ذاتك)، وموقفان خارجان عن إرادتك؛ صنّف الأربعة لتتزن البوابة.',
        ];
      case 'star_triangulation':
        return [
          'تلميح ١: العدسات الثلاث تربط بين: أول رقم في دليل وادي الشفرات، وعدد طبقات طيف القوارير، وإجمالي مناطق الألعاب الأساسية على الجزيرة.',
          'تلميح ٢: اقرأ الأرقام المذكورة في وصف المعادلة أعلى العدسات؛ العدسة الأولى تطابق مطلع شفرة (٤-١-٣-٢)، والثانية عدد ألوان الطيف، والثالثة عدد الألعاب المرتبطة.',
        ];
    }
  };

  const rewardMeta = challenge.rewardCollectible
    ? COLLECTIBLES_CATALOG[challenge.rewardCollectible]
    : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label={challenge.titleAr}
    >
      <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
              آلية تفاعلية مترابطة على الجزيرة · تحدي #{challenge.number}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 font-serif">
              {challenge.titleAr}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {challenge.descriptionAr}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-stone-200/80 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center cursor-pointer shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {alreadyClaimed && !justSolved && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              تم إنجاز هذه الآلية واستلام مكافأتها سابقاً — يمكنك إعادة حلها وتجربتها بحرية دون تكرار المكافأة.
            </span>
          </div>
        )}

        {/* Interactive Body */}
        {puzzleType === 'symbol_lock' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
              نقش المسلة: «حين تشرق الشمس على الوادي، يدور المفتاح في الصخر، فتسكن الموجة، وتهدينا النجمة إلى الجسر.» اضغط على كل ترس لتبديل رمزه بالترتيب من اليمين لليسار:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {dials.map((symId, idx) => {
                const current =
                  SYMBOL_OPTIONS.find((o) => o.id === symId) || SYMBOL_OPTIONS[0];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundManager.playSoftTap();
                      const curIdx = SYMBOL_OPTIONS.findIndex((o) => o.id === symId);
                      const nextSym = SYMBOL_OPTIONS[(curIdx + 1) % SYMBOL_OPTIONS.length].id;
                      const updated = [...dials];
                      updated[idx] = nextSym;
                      setDials(updated);
                    }}
                    className="min-h-24 p-3 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 hover:border-amber-500 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <span className="text-[11px] font-bold text-stone-400">الترس {idx + 1}</span>
                    {current.icon}
                    <span className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                      {current.labelAr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {puzzleType === 'bridge_counterweight' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs">
              <div className="flex items-center gap-2 font-bold text-teal-900 dark:text-teal-200">
                <Scale className="w-4 h-4 text-teal-600" />
                <span>مؤشر عزم الجسر الحي:</span>
              </div>
              <span
                className={`font-extrabold px-2.5 py-1 rounded-lg ${
                  liveTorque === 0 && placedWeights.length === 4
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                }`}
              >
                {liveTorque === 0
                  ? placedWeights.length === 4
                    ? '٠ (توازن تام — جاهز للتثبيت!)'
                    : '٠ (أكمل وضع الأوزان الأربعة)'
                  : liveTorque < 0
                  ? `ميل يسار (${Math.abs(liveTorque)})`
                  : `ميل يمين (+${liveTorque})`}
              </span>
            </div>

            {/* Weight Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-300 block">
                ١. اختر وزناً حجرياً ثم انقر على موضعه فوق عارضة الجسر:
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {BRIDGE_WEIGHTS.map((w) => {
                  const isPlaced = bridgeSlots.includes(w);
                  const isSelected = selectedWeight === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => {
                        soundManager.playSoftTap();
                        setSelectedWeight(w);
                      }}
                      className={`min-h-12 py-2.5 px-3 rounded-xl border-2 text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-400 shadow-sm'
                          : isPlaced
                          ? 'bg-stone-200/70 dark:bg-stone-800/60 text-stone-500 border-stone-300 dark:border-stone-700'
                          : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700'
                      }`}
                    >
                      حجر {w} كجم {isPlaced ? '(موضوع)' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bridge Beam Visual */}
            <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
              <div
                className="grid grid-cols-4 gap-2 transition-transform duration-200"
                style={{
                  transform: `rotate(${Math.max(-8, Math.min(8, liveTorque * 0.8))}deg)`,
                }}
              >
                {[
                  { idx: 0, label: 'يسار بعيد (×٢)' },
                  { idx: 1, label: 'يسار قريب (×١)' },
                  { idx: 2, label: 'يمين قريب (×١)' },
                  { idx: 3, label: 'يمين بعيد (×٢)' },
                ].map((slot) => {
                  const val = bridgeSlots[slot.idx];
                  return (
                    <button
                      key={slot.idx}
                      type="button"
                      onClick={() => handlePlaceBridgeWeight(slot.idx)}
                      className={`min-h-20 p-2 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                        val !== null
                          ? 'bg-teal-600/15 border-teal-500 text-teal-900 dark:text-teal-200'
                          : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-500'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{slot.label}</span>
                      <span className="text-sm font-black">
                        {val !== null ? `${val} كجم` : '+ ضع هنا'}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mx-auto w-8 h-4 bg-stone-500 dark:bg-stone-600 rounded-t-full" />
            </div>
          </div>
        )}

        {puzzleType === 'elixir_synthesis' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200">
              اسكب الخلاصات الثلاث بالترتيب الطبيعي لنمو الشجرة: من الجذور في الأسفل، إلى السماء في الوسط، حتى إشراقة التاج في الأعلى.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                {ELIXIR_OPTIONS.map((opt) => {
                  const chosen = elixirLayers.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={chosen}
                      onClick={() => {
                        soundManager.playWaterPour();
                        setElixirLayers((prev) => [...prev, opt.id]);
                      }}
                      className={`w-full min-h-12 px-4 py-3 rounded-xl border text-xs font-extrabold text-right transition-all flex items-center justify-between ${
                        chosen
                          ? 'opacity-45 cursor-not-allowed bg-stone-200 dark:bg-stone-800 text-stone-500 border-stone-300 dark:border-stone-700'
                          : `${opt.colorClass} cursor-pointer hover:opacity-95 shadow-2xs`
                      }`}
                    >
                      <span>{opt.labelAr}</span>
                      <FlaskConical className="w-4 h-4 shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* Vessel Preview */}
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-stone-500">حوض البصيرة (من الأعلى للأسفل)</span>
                <div className="w-36 h-36 rounded-b-3xl rounded-t-lg border-4 border-stone-400 dark:border-stone-600 p-1.5 flex flex-col-reverse gap-1 bg-white/60 dark:bg-stone-900/60">
                  {[0, 1, 2].map((layerIdx) => {
                    const id = elixirLayers[layerIdx];
                    const meta = ELIXIR_OPTIONS.find((e) => e.id === id);
                    return (
                      <div
                        key={layerIdx}
                        className={`flex-1 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all ${
                          meta
                            ? meta.colorClass
                            : 'border border-dashed border-stone-300 dark:border-stone-700 text-stone-400'
                        }`}
                      >
                        {meta ? meta.labelAr.split(' ')[1] : `طبقة ${layerIdx + 1}`}
                      </div>
                    );
                  })}
                </div>
                {elixirLayers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playSoftTap();
                      setElixirLayers([]);
                    }}
                    className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:underline cursor-pointer"
                  >
                    إفراغ الحوض وإعادة السكب
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {puzzleType === 'archive_codex' && (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-950 dark:text-sky-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
              <span>اختر مخطوطة أو مقتنى ثم انقر على الرف المناسب له (العلوي للنور والبلور · الأوسط للمخطوطات · السفلي للنبات والحجر):</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {ARCHIVE_CODEX_ITEMS.map((item) => {
                const assignedShelf = codexAssignments[item.id];
                const isSelected = activeCodexItem === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      soundManager.playSoftTap();
                      setActiveCodexItem(item.id);
                    }}
                    className={`min-h-11 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-700 text-white border-sky-400 shadow-xs'
                        : assignedShelf !== undefined
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    {item.labelAr}
                    {assignedShelf !== undefined ? ` (رف ${assignedShelf + 1})` : ''}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2.5">
              {[
                { idx: 0, title: 'الرف ١ (الأعلى): البلورات وسرج التأمل' },
                { idx: 1, title: 'الرف ٢ (الأوسط): المخطوطات وسجلات الهندسة' },
                { idx: 2, title: 'الرف ٣ (الأسفل): النباتات وأحجار الارتكاز' },
              ].map((shelf) => {
                const shelfItems = ARCHIVE_CODEX_ITEMS.filter(
                  (i) => codexAssignments[i.id] === shelf.idx
                );
                return (
                  <button
                    key={shelf.idx}
                    type="button"
                    onClick={() => {
                      if (!activeCodexItem) return;
                      soundManager.playSoftTap();
                      setCodexAssignments((prev) => ({
                        ...prev,
                        [activeCodexItem]: shelf.idx,
                      }));
                      const nextUnassigned = ARCHIVE_CODEX_ITEMS.find(
                        (i) => i.id !== activeCodexItem && codexAssignments[i.id] === undefined
                      );
                      if (nextUnassigned) setActiveCodexItem(nextUnassigned.id);
                    }}
                    className="w-full min-h-16 p-3 rounded-2xl bg-amber-950/5 dark:bg-stone-950 border-2 border-amber-800/30 dark:border-stone-700 hover:border-sky-500 text-right transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <span className="text-xs font-extrabold text-stone-800 dark:text-stone-200">
                      {shelf.title}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {shelfItems.length === 0 ? (
                        <span className="text-[11px] text-stone-400">انقر لوضع العنصر المحدد هنا</span>
                      ) : (
                        shelfItems.map((si) => (
                          <span
                            key={si.id}
                            className="px-2.5 py-1 rounded-lg bg-sky-600 text-white text-[11px] font-bold"
                          >
                            {si.labelAr}
                          </span>
                        ))
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {puzzleType === 'gate_scales' && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-stone-600 dark:text-stone-300">
              صنّف كل موقف من مواقف العبور الأربعة ليتعادل مصراعا بوابة الاختيار:
            </p>
            {GATE_SCALES_DILEMMAS.map((d) => {
              const val = gateChoices[d.id];
              return (
                <div
                  key={d.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100">
                    {d.textAr}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playSoftTap();
                        setGateChoices((prev) => ({ ...prev, [d.id]: true }));
                      }}
                      className={`min-h-11 px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer border transition-all ${
                        val === true
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                      }`}
                    >
                      في إيدي
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playSoftTap();
                        setGateChoices((prev) => ({ ...prev, [d.id]: false }));
                      }}
                      className={`min-h-11 px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer border transition-all ${
                        val === false
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                      }`}
                    >
                      برّا إيدي
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {puzzleType === 'star_triangulation' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5">
              <div className="flex items-center gap-2 font-extrabold">
                <Compass className="w-4 h-4 text-indigo-500" />
                <span>معادلة عدسات المرصد الفلكي الثلاث:</span>
              </div>
              <p>
                العدسة ١ = الرقم الأول من دليل «{ISLAND_CLUES.clue_cipher_code.titleAr}» ({ISLAND_CLUES.clue_cipher_code.codeDisplay}) · العدسة ٢ = عدد ألوان «{ISLAND_CLUES.clue_vials_spectrum.titleAr}» · العدسة ٣ = عدد مناطق الألعاب الأساسية في الجزيرة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { idx: 0, label: 'العدسة ١ (نبض الوادي)' },
                { idx: 1, label: 'العدسة ٢ (طبقات الطيف)' },
                { idx: 2, label: 'العدسة ٣ (أختام الجزيرة)' },
              ].map((r) => (
                <div
                  key={r.idx}
                  className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col items-center gap-2.5"
                >
                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                    {r.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playSoftTap();
                        const next: [number, number, number] = [...rings] as [number, number, number];
                        next[r.idx] = next[r.idx] <= 1 ? 9 : next[r.idx] - 1;
                        setRings(next);
                      }}
                      className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-stone-900 font-black text-base cursor-pointer border border-stone-300 dark:border-stone-700"
                    >
                      −
                    </button>
                    <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 w-8 text-center">
                      {rings[r.idx]}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playSoftTap();
                        const next: [number, number, number] = [...rings] as [number, number, number];
                        next[r.idx] = next[r.idx] >= 9 ? 1 : next[r.idx] + 1;
                        setRings(next);
                      }}
                      className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-stone-900 font-black text-base cursor-pointer border border-stone-300 dark:border-stone-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progressive Hint Box */}
        {hintTier > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-1.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <p className="font-bold">{getHintsForPuzzle()[0]}</p>
            {hintTier >= 2 && (
              <p className="font-extrabold text-amber-800 dark:text-amber-300 pt-1 border-t border-amber-200 dark:border-amber-800">
                {getHintsForPuzzle()[1]}
              </p>
            )}
          </div>
        )}

        {/* Feedback Box */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-start gap-2.5 ${
              feedback.ok
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}
          >
            {feedback.ok ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p>{feedback.text}</p>
              {feedback.ok && !alreadyClaimed && rewardMeta && (
                <p className="text-emerald-700 dark:text-emerald-300">
                  المكافأة المكتسبة: {rewardMeta.icon} {rewardMeta.singularAr} · أثر العالم:{' '}
                  {challenge.worldImpactAr}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={hintTier >= 2 || (hintTier === 1 && attemptsCount === 0)}
              onClick={() => {
                soundManager.playSoftTap();
                setHintTier((prev) => (prev < 2 ? ((prev + 1) as 1 | 2) : 2));
              }}
              className="min-h-11 px-3.5 py-2 rounded-xl bg-stone-200/80 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 disabled:opacity-50 text-stone-700 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>
                {hintTier === 0
                  ? 'تلميح ذكي (١/٢)'
                  : hintTier === 1
                  ? attemptsCount === 0
                    ? 'جرّب محاولة لفتح التلميح ٢'
                    : 'تلميح أوضح (٢/٢)'
                  : 'تم عرض التلميحات'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleResetPuzzle}
              className="min-h-11 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-stone-200 dark:border-stone-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة الضبط</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {justSolved ? (
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>العودة لخريطة الجزيرة</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="min-h-11 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-md"
              >
                تفعيل الآلية والتحقق
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
