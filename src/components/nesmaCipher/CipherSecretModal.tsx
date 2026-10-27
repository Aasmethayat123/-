import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export interface WorldSecretInfo {
  id: string;
  worldId: string;
  titleAr: string;
  subtitleAr: string;
  icon: string;
  storyLoreAr: string;
  practicalInsightAr: string;
  requiredLevel: number;
}

export const WORLD_SECRETS: Record<string, WorldSecretInfo> = {
  garden: {
    id: 'garden_dawn_secret',
    worldId: 'garden',
    titleAr: 'سر ندي البدايات',
    subtitleAr: 'اكتشاف خفي ينبثق مع انقشاع الضباب في الحديقة',
    icon: '🌸✨',
    storyLoreAr: 'بين خيوط الصباح الأولى، حين تتوقف اللاعبة عن محاولة إنجاز كل شيء دفعة واحدة، تظهر برعمات الياسمين الصغيرة. السر ليس في سرعة الركض، بل في صفاء اللحظة وتخفيف الحقيبة.',
    practicalInsightAr: 'الرفق بالذات ليس كسلاً، بل صيانة لطاقة جهازك العصبي ضد الاحتراق النفسي.',
    requiredLevel: 3
  },
  library: {
    id: 'library_manuscript_secret',
    worldId: 'library',
    titleAr: 'مخطوطة الحدود المنسية',
    subtitleAr: 'أثر معرفي يضيء أروقة الفكر والوضوح',
    icon: '📜✨',
    storyLoreAr: 'في أعمق أرفف المكتبة، وُجدت مخطوطة قديمة تنص على أن «قول لا بصدق يحمي نعم الكبيرة». الحدود ليست عداوة، بل هي السياج الذي يمنع تسرب الاستنزاف إلى الروح.',
    practicalInsightAr: 'حين تحفظ مساحتك بوعي، يصبح عطاؤك للآخرين حقيقياً وخالياً من الضغينة.',
    requiredLevel: 13
  },
  cave: {
    id: 'cave_crystal_secret',
    worldId: 'cave',
    titleAr: 'بلورة المراقب الصامت',
    subtitleAr: 'جوهر الوعي المتألق في أعمق أعماق الكهف',
    icon: '💎✨',
    storyLoreAr: 'حين تنعكس الأنوار على مياه الكهف الساكنة، تدرك اللاعبة أنها ليست عواصف أفكارها العابرة، بل السماء الصامتة التي تشهد العابرين دون أن تفقد صفاءها.',
    practicalInsightAr: 'أنت لست أفكارك القلقة؛ أنت الوعي الهادئ الذي يختار ما يُصدّق وما يتركه يرحل.',
    requiredLevel: 25
  },
  symbol_maze: {
    id: 'symbol_maze_secret',
    worldId: 'symbol_maze',
    titleAr: 'سر تمييز اليقين من السراب',
    subtitleAr: 'شفرة الحقيقة الناصعة في قلب المتاهة',
    icon: '🌀✨',
    storyLoreAr: 'في أزقة المتاهة، يتضح أن ليس كل ما يلمع في العقل حقيقة. تمييز الشواهد يطرد السراب.',
    practicalInsightAr: 'اختبار الفكرة مع الواقع يرفع عنك أعباء الظنون التلقائية.',
    requiredLevel: 33
  },
  image_secrets: {
    id: 'image_secrets_secret',
    worldId: 'image_secrets',
    titleAr: 'سر تسمية المشاعر الصريحة',
    subtitleAr: 'الرؤية البصرية التي تنجلي بها الظلمات',
    icon: '🖼️✨',
    storyLoreAr: 'حين تنظر إلى الصورة بعين فاحصة وتسمي الخوف باسمه، يتلاشى نصف الغموض فوراً.',
    practicalInsightAr: 'تسمية المشاعر بوضوح يعيد الدماغ لمركز اتزانه وسيطرته.',
    requiredLevel: 43
  },
  mind_lab: {
    id: 'mind_lab_secret',
    worldId: 'mind_lab',
    titleAr: 'سر السيادة والوعي الحر',
    subtitleAr: 'جوهر التاج الأسمى في مختبر التفكير',
    icon: '🧪✨',
    storyLoreAr: 'في القمة النهائية للمختبر، تثبت البوصلة الداخلية على النغمة الخاصة بوعيك الحر.',
    practicalInsightAr: 'الحكم الذاتي والسيادة النفسية هما حصنك المنيع مهما كثف الضباب.',
    requiredLevel: 55
  }
};

interface CipherSecretModalProps {
  worldId: string;
  isUnlocked: boolean;
  isAlreadyDiscovered: boolean;
  onClose: () => void;
  onDiscover: (secretId: string) => void;
}

export const CipherSecretModal: React.FC<CipherSecretModalProps> = ({
  worldId,
  isUnlocked,
  isAlreadyDiscovered,
  onClose,
  onDiscover
}) => {
  const secret = WORLD_SECRETS[worldId];
  const [puzzleSolved, setPuzzleSolved] = useState<boolean>(isAlreadyDiscovered);
  const [selectedGardenItems, setSelectedGardenItems] = useState<string[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!secret) return null;

  // Garden Mini-Puzzle: select exactly the 2 correct items (flower & dew)
  const gardenPuzzleOptions = [
    { id: 'flower', label: 'زهرة الصباح النضرة', icon: '🌸', isCorrect: true },
    { id: 'dew', label: 'قطرة الندى الصافية', icon: '💧', isCorrect: true },
    { id: 'storm', label: 'عاصفة التشتت العابرة', icon: '🌪️', isCorrect: false }
  ];

  // Library Mini-Puzzle options
  const libraryPuzzleOptions = [
    { id: 'wrong1', label: 'جدار قاسي لصد كل من يقترب', icon: '🧱', isCorrect: false },
    { id: 'correct', label: 'سياج يحمي مساحتي لكي أحب بصدق', icon: '🎋', isCorrect: true },
    { id: 'wrong2', label: 'الموافقة الدائمة على كل الطلبات', icon: '🎭', isCorrect: false }
  ];

  // Cave Mini-Puzzle options
  const cavePuzzleOptions = [
    { id: 'wrong_thoughts', label: 'موجة الأفكار والقلق المستمر', icon: '🌪️', isCorrect: false },
    { id: 'correct_observer', label: 'الذات المراقبة الهادئة (المراقب الصامت)', icon: '🧘', isCorrect: true },
    { id: 'wrong_noise', label: 'ضجيج المهام الخارجية المتراكمة', icon: '⚡', isCorrect: false }
  ];

  // Symbol Maze Mini-Puzzle options (World 4)
  const symbolMazePuzzleOptions = [
    { id: 'wrong_mirage', label: 'تصديق كل ظن تلقائي يخطر في البال فوراً', icon: '🌫️', isCorrect: false },
    { id: 'correct_reality', label: 'فحص الشواهد وتمييز اليقين من السراب بهدوء', icon: '🔍', isCorrect: true },
    { id: 'wrong_escape', label: 'الهروب من المواقف وتجنب التفكير تماماً', icon: '🏃', isCorrect: false }
  ];

  // Image Secrets Mini-Puzzle options (World 5)
  const imageSecretsPuzzleOptions = [
    { id: 'correct_naming', label: 'ملاحظة الشعور وتسميته بوضوح وصدق', icon: '🏷️', isCorrect: true },
    { id: 'wrong_suppress', label: 'كبت المشاعر وتجاهل إشارات الجسد', icon: '🙈', isCorrect: false },
    { id: 'wrong_panic', label: 'تضخيم الغموض والاستسلام للارتباك', icon: '🌀', isCorrect: false }
  ];

  // Mind Lab Mini-Puzzle options (World 6)
  const mindLabPuzzleOptions = [
    { id: 'wrong_external', label: 'تعليق قيمتي النفسية على آراء الآخرين فقط', icon: '⚖️', isCorrect: false },
    { id: 'wrong_perfection', label: 'اشتراط الكمال المطلق قبل الشعور بالسلام', icon: '⛓️', isCorrect: false },
    { id: 'correct_sovereignty', label: 'تثبيت البوصلة الداخلية على الوعي الحر والاتزان', icon: '🧭', isCorrect: true }
  ];

  const handleGardenItemToggle = (itemId: string, isCorrectItem: boolean) => {
    soundManager.playClick();
    setErrorMessage(null);
    if (!isCorrectItem) {
      setErrorMessage('هذا العنصر يمثل تشتتاً لا ينتمي للندى؛ جرب عنصراً آخر.');
      return;
    }
    if (selectedGardenItems.includes(itemId)) {
      setSelectedGardenItems(selectedGardenItems.filter(id => id !== itemId));
    } else {
      const next = [...selectedGardenItems, itemId];
      setSelectedGardenItems(next);
      if (next.length === 2) {
        // Solved!
        soundManager.playSuccess();
        setPuzzleSolved(true);
        onDiscover(secret.id);
      }
    }
  };

  const handleChoiceSubmit = (chosenId: string, isCorrect: boolean) => {
    soundManager.playClick();
    setSelectedOptionId(chosenId);
    setErrorMessage(null);
    if (isCorrect) {
      soundManager.playSuccess();
      setPuzzleSolved(true);
      onDiscover(secret.id);
    } else {
      soundManager.playIncorrect();
      setErrorMessage('إجابة غير دقيقة؛ تأمل المعنى النفسي وجرب مرة أخرى.');
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in" dir="rtl">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 relative">
        {/* Background decorative glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              {secret.icon}
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                {puzzleSolved ? 'سر مكتشف بنجاح ⭐' : 'تحدي استكشاف السر الخفي'}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100">
                {secret.titleAr}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 bg-stone-100 dark:bg-stone-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State A: Locked by progress */}
        {!isUnlocked ? (
          <div className="text-center py-8 space-y-3 relative z-10">
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto text-xl">
              🔒
            </div>
            <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
              السر مغلق حتى الآن
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
              يتطلب فتح هذا السر إتمام 3 مراحل على الأقل في هذا العالم لتظهر إشاراته بوضوح.
            </p>
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-5 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-300"
            >
              فهمت، سأستمر في التقدم
            </button>
          </div>
        ) : puzzleSolved ? (
          /* State B: Puzzle Solved / Already Discovered */
          <div className="space-y-4 relative z-10">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>تم اجتياز لغز الاستكشاف بنجاح وحفظ السر في دفتر أسرارك!</span>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
              {secret.storyLoreAr}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-1.5">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>إضاءة نفسية هادئة:</span>
              </span>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {secret.practicalInsightAr}
              </p>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>إغلاق النافذة</span>
              </button>
            </div>
          </div>
        ) : (
          /* State C: Unlocked by progress, but mini-puzzle NOT solved yet */
          <div className="space-y-5 relative z-10">
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>تحدي الاكتشاف المطلوب:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-[11px] text-amber-700 dark:text-amber-400 underline font-medium cursor-pointer flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'إخفاء التلميح' : 'تلميح استكشافي'}</span>
                </button>
              </div>

              {worldId === 'garden' && (
                <p className="text-xs text-stone-700 dark:text-stone-300">
                  انقر على <strong>عنصري الندى الصافي والزهرة</strong> من الخيارات أدناه لجمع الإشارات وتفتيح سر البدايات.
                </p>
              )}
              {worldId === 'library' && (
                <p className="text-xs text-stone-700 dark:text-stone-300">
                  اختر المعنى الصحيح المستبطن في مخطوطة الحدود من بين الخيارات المتاحة.
                </p>
              )}
              {worldId === 'cave' && (
                <p className="text-xs text-stone-700 dark:text-stone-300">
                  حدد الكيان الحقيقي الذي يمثل المراقب الهادئ خلف الأفكار لفتح بلورة الكهف.
                </p>
              )}
              {worldId === 'symbol_maze' && (
                <p className="text-xs text-stone-700 dark:text-stone-300">
                  اختر القاعدة المعرفية التي تفرق بين الحقيقة والسراب داخل متاهة الرموز.
                </p>
              )}
              {worldId === 'image_secrets' && (
                <p className="text-xs text-stone-700 dark:text-stone-300">
                  حدد المفتاح البصري والنفسي الذي يبدد الغموض ويعيد الدماغ إلى اتزانه.
                </p>
              )}
              {worldId === 'mind_lab' && (
                <p className="text-xs text-stone-700 dark:text-stone-300">
                  اختر ركيزة السيادة النفسية والوعي الحر لإتمام استكشاف مختبر التفكير.
                </p>
              )}

              {showHint && (
                <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200">
                  {worldId === 'garden' && 'التلميح: ابحث عن العنصرين النباتي والمائي وتجنب عاصفة التشتت.'}
                  {worldId === 'library' && 'التلميح: الحدود الصحية تهدف للمحبة الصادقة لا للقسوة أو المجاملة المفرطة.'}
                  {worldId === 'cave' && 'التلميح: لست أفكارك القلقة، بل الذات التي تلاحظها بهدوء.'}
                  {worldId === 'symbol_maze' && 'التلميح: اختبار الفكرة بالدليل الواقعي يحررك من الظنون التلقائية.'}
                  {worldId === 'image_secrets' && 'التلميح: تسمية الشعور باسمه الصريح يطفئ نصف حدته فوراً.'}
                  {worldId === 'mind_lab' && 'التلميح: البوصلة الداخلية المستقلة هي أساس الحرية النفسية.'}
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Garden Mini-Puzzle Interactive items */}
            {worldId === 'garden' && (
              <div className="grid grid-cols-3 gap-3">
                {gardenPuzzleOptions.map((opt) => {
                  const isSelected = selectedGardenItems.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleGardenItemToggle(opt.id, opt.isCorrect)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-105'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-emerald-400'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="text-xs font-bold leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Library Mini-Puzzle Options */}
            {worldId === 'library' && (
              <div className="space-y-2.5">
                {libraryPuzzleOptions.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleChoiceSubmit(opt.id, opt.isCorrect)}
                      className={`w-full p-3.5 rounded-2xl border text-start flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                            : 'bg-rose-600 text-white border-rose-500'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-emerald-400'
                      }`}
                    >
                      <span className="text-xl p-2 rounded-xl bg-stone-200 dark:bg-stone-700">{opt.icon}</span>
                      <span className="text-xs sm:text-sm font-bold">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Cave & Worlds 4-6 Single-Choice Mini-Puzzles */}
            {(worldId === 'cave' || worldId === 'symbol_maze' || worldId === 'image_secrets' || worldId === 'mind_lab') && (
              <div className="space-y-2.5">
                {(worldId === 'cave'
                  ? cavePuzzleOptions
                  : worldId === 'symbol_maze'
                    ? symbolMazePuzzleOptions
                    : worldId === 'image_secrets'
                      ? imageSecretsPuzzleOptions
                      : mindLabPuzzleOptions
                ).map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleChoiceSubmit(opt.id, opt.isCorrect)}
                      className={`w-full p-3.5 rounded-2xl border text-start flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                            : 'bg-rose-600 text-white border-rose-500'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-emerald-400'
                      }`}
                    >
                      <span className="text-xl p-2 rounded-xl bg-stone-200 dark:bg-stone-700 shrink-0">{opt.icon}</span>
                      <span className="text-xs sm:text-sm font-bold">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-stone-400">
                حاول بحرية؛ لا توجد عقوبات أو خصم نقاط.
              </span>
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                إغلاق مؤقت
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
