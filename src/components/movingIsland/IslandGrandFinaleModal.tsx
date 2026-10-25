import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
  Sparkles,
  Award,
  ArrowUp,
  ArrowDown,
  Bookmark,
  Compass,
} from 'lucide-react';
import {
  ISLAND_CLUES,
  ISLAND_REGIONS,
  ISLAND_RELICS,
  IslandCoreGameId,
  IslandRegionId,
} from '../../data/movingIslandData';
import {
  buildEndingAccomplishmentSummary,
  checkGrandFinaleReadiness,
  FINALE_STEP4_OPTIONS,
  FINALE_STEP_HINTS,
  MovingIslandSaveState,
  recordFinaleHintUsed,
  submitGrandFinaleStep,
} from '../../utils/movingIslandManager';
import { soundManager } from '../../utils/audio';
import { saveMoment } from '../../utils/moments';

interface IslandGrandFinaleModalProps {
  islandState: MovingIslandSaveState;
  onClose: () => void;
  onStateUpdated: (nextState: MovingIslandSaveState) => void;
  onJumpToGame: (gameId: IslandCoreGameId) => void;
  onAddXP?: (amount: number) => void;
}

const CORE_SIX_REGIONS = ISLAND_REGIONS.filter((r) => Boolean(r.linkedGameId));

export const IslandGrandFinaleModal: React.FC<IslandGrandFinaleModalProps> = ({
  islandState,
  onClose,
  onStateUpdated,
  onJumpToGame,
  onAddXP,
}) => {
  const readiness = checkGrandFinaleReadiness(islandState);
  const activeStep = islandState.finaleCurrentStep;

  // Step 1 state: initial scrambled order of the 6 core regions
  const [orderedRegions, setOrderedRegions] = useState<IslandRegionId[]>([
    'vials-garden',
    'cipher-valley',
    'choice-gate',
    'balance-bridge',
    'secrets-mountain',
    'order-library',
  ]);

  // Step 2 state: 4 pins [1..6]
  const [pins, setPins] = useState<[number, number, number, number]>([1, 2, 3, 4]);

  // Step 3 state: shelves spectrum
  const [shelves, setShelves] = useState<{ top: string; middle: string; bottom: string }>({
    top: '',
    middle: '',
    bottom: '',
  });
  const [selectedEssence, setSelectedEssence] = useState<'gold' | 'blue' | 'green'>('gold');

  // Step 4 state: willpower anchors
  const [selectedAnchors, setSelectedAnchors] = useState<string[]>([]);

  const [hintTierShown, setHintTierShown] = useState<0 | 1 | 2>(0);
  const [stepAttempts, setStepAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [savedEndingMoment, setSavedEndingMoment] = useState(false);

  const summary = buildEndingAccomplishmentSummary(islandState);

  const handleRevealHint = () => {
    soundManager.playSoftTap();
    if (hintTierShown < 2) {
      const nextTier = (hintTierShown + 1) as 1 | 2;
      setHintTierShown(nextTier);
      const updated = recordFinaleHintUsed();
      onStateUpdated(updated);
    }
  };

  const moveRegionItem = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= orderedRegions.length) return;
    soundManager.playSoftTap();
    const copy = [...orderedRegions];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setOrderedRegions(copy);
  };

  const handleVerifyCurrentStep = () => {
    let result;
    if (activeStep === 1) {
      result = submitGrandFinaleStep({ step: 1, orderedRegions }, onAddXP);
    } else if (activeStep === 2) {
      result = submitGrandFinaleStep({ step: 2, pins }, onAddXP);
    } else if (activeStep === 3) {
      result = submitGrandFinaleStep({ step: 3, shelves }, onAddXP);
    } else {
      result = submitGrandFinaleStep({ step: 4, selectedAnchorIds: selectedAnchors }, onAddXP);
    }

    onStateUpdated(result.state);
    if (result.correct) {
      soundManager.playLevelUpFanfare();
      setFeedback({ ok: true, text: result.feedbackAr });
      setHintTierShown(0);
      setStepAttempts(0);
    } else {
      setStepAttempts((prev) => prev + 1);
      soundManager.playIncorrect();
      setFeedback({ ok: false, text: result.feedbackAr });
    }
  };

  const handleSaveSanctuaryMoment = () => {
    soundManager.playChime();
    saveMoment({
      gameId: 'moving-island',
      gameTitle: 'جزيرة الأسرار المتحركة — معبد البصيرة الأسمى',
      quote: 'حصلتُ على «منشور نسمة المتوهج» بعد توحيد أسرار المناطق الست وحل اللغز الختامي الكبير.',
      reflection: `أتممتُ ${summary.challengesClaimed} تحدياً مترابطاً وجمعتُ ${summary.totalCollectibles} مقتنى عبر وادي الشفرات، جسر التوازن، حديقة القوارير، مكتبة النظام، بوابة الاختيار، وجبل الأسرار.`,
      tag: 'تتويج جزيرة الأسرار',
    });
    setSavedEndingMoment(true);
    if (onAddXP) onAddXP(30);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="اللغز الختامي الكبير — معبد البصيرة الأسمى"
    >
      <div className="bg-stone-50 dark:bg-stone-900 border-2 border-emerald-600/50 dark:border-emerald-500/40 rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-6 my-auto">
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 block">
              معبد البصيرة الأسمى · قمة جزيرة الأسرار المتحركة
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 font-serif">
              {islandState.finaleCompleted
                ? 'مشهد التتويج: قلب الجزيرة الموحّد'
                : 'اللغز الختامي الكبير: توحيد الأختام الستة'}
            </h2>
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

        {/* CASE 1: FINALE COMPLETED -> PERSONALIZED SANCTUARY ENDING SCENE */}
        {islandState.finaleCompleted ? (
          <div className="space-y-5">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-amber-950 text-white p-6 border border-amber-400/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-300/50 flex items-center justify-center text-3xl shrink-0">
                  💠
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-300 block">
                    المقتنى الأسطوري المكتسب
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white font-serif">
                    {ISLAND_RELICS.island_heart_prism.nameAr}
                  </h3>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    {ISLAND_RELICS.island_heart_prism.descriptionAr}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs sm:text-sm text-emerald-100 leading-relaxed">
                لقد عبرتِ الجزيرة المتحركة كاملةً؛ فككتِ الإشارات الغامضة بهدوء، وأقمتِ التوازن فوق المضيق، وصفّيتِ القوارير من الكدر، ورتّبتِ فوضى الرفوف، وميّزتِ ما في يدكِ عما وراء الغيم، وفتّتِ صخور الجبل خطوةً تلو خطوة.
              </div>
            </div>

            {/* Personalized Player Stats Across All 6 Games */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>سجل إنجازك الحقيقي عبر ألعاب الجزيرة الست:</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 dark:text-stone-400 block">شفرة نسمة</span>
                  <span className="font-black text-sm text-stone-900 dark:text-stone-100">
                    {summary.cipherLevelsSolved} مرحلة محلولة
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 dark:text-stone-400 block">أحجار التوازن</span>
                  <span className="font-black text-sm text-stone-900 dark:text-stone-100">
                    {summary.zenStagesBalanced} أبراج متزنة
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 dark:text-stone-400 block">قوارير المشاعر</span>
                  <span className="font-black text-sm text-stone-900 dark:text-stone-100">
                    {summary.vialsStagesPurified} مراحل مصفّاة
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 dark:text-stone-400 block">ترتيب الرفوف</span>
                  <span className="font-black text-sm text-stone-900 dark:text-stone-100">
                    {summary.libraryStagesHarmonized} خزائن متناغمة
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 dark:text-stone-400 block">في إيدي / برّا إيدي</span>
                  <span className="font-black text-sm text-stone-900 dark:text-stone-100">
                    {summary.choiceStagesSorted} جولات حاسمة
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 dark:text-stone-400 block">كسّري الجبل</span>
                  <span className="font-black text-sm text-stone-900 dark:text-stone-100">
                    {summary.mountainStagesBroken} قمم مفتتة
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-stone-700 dark:text-stone-300">
                <span>
                  التحديات المنجزة: {summary.challengesClaimed}/{summary.totalChallenges}
                </span>
                <span>
                  المقتنيات: {summary.totalCollectibles}/{summary.maxCollectibles}
                </span>
                <span>الأدلة المكتشفة: {summary.cluesDiscovered}/6</span>
                <span>مجموع نقاط الجزيرة: +{summary.islandXPEarned} XP</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                disabled={savedEndingMoment}
                onClick={handleSaveSanctuaryMoment}
                className={`min-h-11 px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
                  savedEndingMoment
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-sm'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>
                  {savedEndingMoment
                    ? 'تم التوثيق في دفتر رحلتي'
                    : 'توثيق لحظة التتويج في دفتر رحلتي (+30 XP)'}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="min-h-11 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 text-white text-xs font-black cursor-pointer"
              >
                استكشاف الجزيرة المضيئة
              </button>
            </div>
          </div>
        ) : !readiness.isReady ? (
          /* CASE 2: PREREQUISITES NOT YET MET */
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-sm">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>أختام معبد البصيرة تتطلب اكتمال أركان الرحلة الستة قبل فتح اللغز الختامي:</span>
              </div>
              <ul className="space-y-1 text-xs text-amber-900/90 dark:text-amber-200/90 pr-5 list-disc">
                {readiness.missingRequirementsAr.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-extrabold text-stone-700 dark:text-stone-300">
                حالة اتصال الألعاب الست بالمعبد:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CORE_SIX_REGIONS.map((reg) => {
                  const gId = reg.linkedGameId!;
                  const done = readiness.gamesCompletedMap[gId];
                  return (
                    <div
                      key={reg.id}
                      className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100 block">
                          {reg.nameAr}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400">
                          {reg.linkedGameNameAr}
                        </span>
                      </div>
                      {done ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>مُتصل</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onJumpToGame(gId)}
                          className="min-h-10 px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                        >
                          العب الآن
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold cursor-pointer"
              >
                العودة لجمع الأختام المتبقية
              </button>
            </div>
          </div>
        ) : (
          /* CASE 3: ACTIVE 4-STEP GRAND FINALE PUZZLE */
          <div className="space-y-5">
            {/* 4-Step Progress Bar */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { step: 1, title: '١. مدار الأختام' },
                { step: 2, title: '٢. نبض البوصلة' },
                { step: 3, title: '٣. ميثاق الطيف' },
                { step: 4, title: '٤. نبضة الإرادة' },
              ].map((s) => {
                const isDone = activeStep > s.step;
                const isCurrent = activeStep === s.step;
                return (
                  <div
                    key={s.step}
                    className={`p-2.5 rounded-xl border text-center text-xs font-extrabold transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : isCurrent
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {s.title}
                  </div>
                );
              })}
            </div>

            {/* Discovered Clues Quick Reference Strip */}
            {islandState.discoveredClueIds.length > 0 && (
              <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>أدلتك المكتشفة لمساعدتك في الحل:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {islandState.discoveredClueIds.map((cid) => {
                    const clue = ISLAND_CLUES[cid];
                    if (!clue) return null;
                    return (
                      <span
                        key={cid}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] font-bold text-stone-800 dark:text-stone-200"
                      >
                        {clue.titleAr}: <strong className="text-emerald-700 dark:text-emerald-400">{clue.codeDisplay}</strong>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 1 UI */}
            {activeStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                  الخطوة ١ من ٤: رتّب أختام المناطق الست حسب تسلسل رحلة الوعي على الجزيرة (من بوابة الوصول الأولى حتى قمة الجبل):
                </p>
                <div className="space-y-2">
                  {orderedRegions.map((regId, idx) => {
                    const reg = ISLAND_REGIONS.find((r) => r.id === regId)!;
                    return (
                      <div
                        key={regId}
                        className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-emerald-700 text-white text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-stone-100 block">
                              {reg.nameAr}
                            </span>
                            <span className="text-[11px] text-stone-500 dark:text-stone-400">
                              {reg.linkedGameNameAr}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveRegionItem(idx, -1)}
                            className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 disabled:opacity-35 flex items-center justify-center cursor-pointer border border-stone-200 dark:border-stone-700"
                            aria-label="تحريك لأعلى"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === orderedRegions.length - 1}
                            onClick={() => moveRegionItem(idx, 1)}
                            className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 disabled:opacity-35 flex items-center justify-center cursor-pointer border border-stone-200 dark:border-stone-700"
                            aria-label="تحريك لأسفل"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2 UI */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                  الخطوة ٢ من ٤: اضبط أوتاد الرنين الأربعة وفق الرمز الرباعي المكتشف في «وادي الشفرات» ليستقر محور المنشور:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pins.map((val, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col items-center gap-2.5"
                    >
                      <span className="text-xs font-bold text-stone-500">الوتد {idx + 1}</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playSoftTap();
                            const next: [number, number, number, number] = [...pins] as [
                              number,
                              number,
                              number,
                              number,
                            ];
                            next[idx] = next[idx] <= 1 ? 6 : next[idx] - 1;
                            setPins(next);
                          }}
                          className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-900 font-black cursor-pointer border border-stone-300 dark:border-stone-700"
                        >
                          −
                        </button>
                        <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 w-7 text-center">
                          {val}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playSoftTap();
                            const next: [number, number, number, number] = [...pins] as [
                              number,
                              number,
                              number,
                              number,
                            ];
                            next[idx] = next[idx] >= 6 ? 1 : next[idx] + 1;
                            setPins(next);
                          }}
                          className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-900 font-black cursor-pointer border border-stone-300 dark:border-stone-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 UI */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                  الخطوة ٣ من ٤: وحّد خلاصة «حديقة القوارير» مع «مكتبة النظام» بوضع كل طيف لوني في الرف الموافق لجوهره:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gold' as const, label: 'الخلاصة الذهبية (البصيرة)', cls: 'bg-amber-500 text-stone-950' },
                    { id: 'blue' as const, label: 'الخلاصة الزرقاء (المعرفة)', cls: 'bg-sky-600 text-white' },
                    { id: 'green' as const, label: 'الخلاصة الخضراء (الجذور)', cls: 'bg-emerald-600 text-white' },
                  ].map((ess) => (
                    <button
                      key={ess.id}
                      type="button"
                      onClick={() => {
                        soundManager.playSoftTap();
                        setSelectedEssence(ess.id);
                      }}
                      className={`min-h-12 p-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                        ess.cls
                      } ${selectedEssence === ess.id ? 'ring-4 ring-stone-900 dark:ring-white' : 'opacity-80'}`}
                    >
                      {ess.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5">
                  {[
                    { key: 'top' as const, label: 'الرف الأعلى (طبقة البصيرة والنور)' },
                    { key: 'middle' as const, label: 'الرف الأوسط (طبقة المعرفة والحكمة)' },
                    { key: 'bottom' as const, label: 'الرف الأسفل (طبقة الجذور والأمان)' },
                  ].map((tier) => {
                    const currentVal = shelves[tier.key];
                    const valLabel =
                      currentVal === 'gold'
                        ? 'الخلاصة الذهبية'
                        : currentVal === 'blue'
                        ? 'الخلاصة الزرقاء'
                        : currentVal === 'green'
                        ? 'الخلاصة الخضراء'
                        : 'انقر لوضع الخلاصة المختارة';
                    return (
                      <button
                        key={tier.key}
                        type="button"
                        onClick={() => {
                          soundManager.playWaterPour();
                          setShelves((prev) => ({
                            top: prev.top === selectedEssence ? '' : prev.top,
                            middle: prev.middle === selectedEssence ? '' : prev.middle,
                            bottom: prev.bottom === selectedEssence ? '' : prev.bottom,
                            [tier.key]: selectedEssence,
                          }));
                        }}
                        className="w-full min-h-14 p-3.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 hover:border-emerald-500 flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                          {tier.label}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-900 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {valLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4 UI */}
            {activeStep === 4 && (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                  الخطوة ٤ والأخيرة: اختر فقط الركائز الثلاث الواقعة «في إيدك الآن» لتوليد النبضة الكاسرة للغلاف الصخري حول منشور الجزيرة:
                </p>
                <div className="space-y-2">
                  {FINALE_STEP4_OPTIONS.map((opt) => {
                    const checked = selectedAnchors.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          soundManager.playSoftTap();
                          setSelectedAnchors((prev) =>
                            prev.includes(opt.id)
                              ? prev.filter((i) => i !== opt.id)
                              : [...prev, opt.id]
                          );
                        }}
                        className={`w-full min-h-12 p-3.5 rounded-2xl border-2 text-right text-xs sm:text-sm font-bold flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          checked
                            ? 'bg-emerald-600/15 border-emerald-500 text-emerald-950 dark:text-emerald-100'
                            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <span>{opt.labelAr}</span>
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                            checked
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-200 dark:bg-stone-700 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Progressive Hints */}
            {hintTierShown > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
                <p className="font-bold">تلميح ١: {FINALE_STEP_HINTS[activeStep][0]}</p>
                {hintTierShown >= 2 && (
                  <p className="font-extrabold text-amber-800 dark:text-amber-300 pt-1 border-t border-amber-200 dark:border-amber-800">
                    تلميح ٢ (تفصيلي): {FINALE_STEP_HINTS[activeStep][1]}
                  </p>
                )}
              </div>
            )}

            {/* Validation Feedback */}
            {feedback && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-start gap-2 ${
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
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={hintTierShown >= 2 || (hintTierShown === 1 && stepAttempts === 0)}
                  onClick={handleRevealHint}
                  className="min-h-11 px-3.5 py-2 rounded-xl bg-stone-200/80 hover:bg-stone-300 dark:bg-stone-800 disabled:opacity-45 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>
                    {hintTierShown === 0
                      ? 'طلب تلميح تدريجي (١/٢)'
                      : hintTierShown === 1
                      ? stepAttempts === 0
                        ? 'جرّب محاولة لفتح التلميح ٢'
                        : 'تلميح أوضح (٢/٢)'
                      : 'تم عرض التلميحات'}
                  </span>
                </button>
                <span className="text-[11px] text-stone-500 font-bold">
                  المحاولات: {islandState.finaleAttempts}
                </span>
              </div>

              <button
                type="button"
                onClick={handleVerifyCurrentStep}
                className="min-h-11 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {activeStep < 4 ? `تثبيت الختم ${activeStep} والمتابعة` : 'إطلاق النبضة الختامية وفتح المعبد'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
