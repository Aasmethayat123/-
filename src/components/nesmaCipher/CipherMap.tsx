import React, { useState } from 'react';
import { CipherProgress, CipherWorldId } from '../../types/nesmaCipher';
import { CIPHER_WORLDS, CIPHER_LEVELS } from '../../data/nesmaCipherData';
import { unlockSecretDoor, unlockAllCipherLevels } from '../../utils/nesmaCipherStorage';
import { CipherSecretModal, WORLD_SECRETS } from './CipherSecretModal';
import { SafeCipherImage } from './SafeCipherImage';
import { 
  Sparkles, 
  Lock, 
  Star, 
  BookOpen, 
  Flower2, 
  Compass,
  Trophy,
  ShieldCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  KeyRound,
  Eye,
  X
} from 'lucide-react';
import { soundManager } from '../../utils/audio';


interface CipherMapProps {
  progress: CipherProgress;
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (diff: 'easy' | 'medium' | 'hard') => void;
  onSelectLevel: (levelId: number) => void;
  onOpenQuotesVault: () => void;
  onOpenGarden: () => void;
  onResetProgress: () => void;
  onExitToMainApp: () => void;
}

export const CipherMap: React.FC<CipherMapProps> = ({
  progress,
  difficulty,
  onDifficultyChange,
  onSelectLevel,
  onOpenQuotesVault,
  onOpenGarden,
  onResetProgress,
  onExitToMainApp
}) => {
  const [currentProgress, setCurrentProgress] = useState<CipherProgress>(progress);
  const [showSecretModal, setShowSecretModal] = useState<boolean>(false);
  const [showArtworkModal, setShowArtworkModal] = useState<boolean>(false);

  const [activeWorldId, setActiveWorldId] = useState<CipherWorldId>(() => {
    const highest = Math.max(...progress.unlockedLevels, 1);
    if (highest <= 10) return 'garden';
    if (highest <= 20) return 'library';
    return 'cave';
  });

  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.enabled);

  const activeWorld = CIPHER_WORLDS.find(w => w.id === activeWorldId) || CIPHER_WORLDS[0];
  const [startLvl, endLvl] = activeWorld.levelsRange;
  const worldLevels = CIPHER_LEVELS.filter(l => l.id >= startLvl && l.id <= endLvl);

  const totalCompleted = progress.completedLevels.length;
  const quotesDiscoveredCount = progress.discoveredQuotes.length;
  const worldCompletedCount = progress.completedLevels.filter(id => id >= startLvl && id <= endLvl).length;

  const isGardenComplete = progress.completedLevels.includes(10);
  const isLibraryComplete = progress.completedLevels.includes(20);
  const isCaveComplete = progress.completedLevels.includes(30);

  const handleLevelClick = (levelId: number) => {
    const isUnlocked = progress.unlockedLevels.includes(levelId);
    if (!isUnlocked) {
      soundManager.playIncorrect();
      return;
    }
    soundManager.playClick();
    onSelectLevel(levelId);
  };

  // Living World environmental message and visual transformations based on real progress
  const getLivingEnvironmentStatus = () => {
    const pct = Math.round((worldCompletedCount / 10) * 100);
    if (activeWorldId === 'garden') {
      if (worldCompletedCount === 0) return '🌿 ضباب الصباح الهادئ يلف أرجاء الحديقة؛ ابدأ الخطوة الأولى ليبدأ الضباب بالتراجع.';
      if (worldCompletedCount < 5) return `🌿 انقشع الضباب بنسبة ${pct}%؛ ظهرت براعم زهور السكينة الأولى على جوانب الممر.`;
      if (worldCompletedCount < 10) return `🌸 تفتحت أزهار الوعي بنسبة ${pct}%؛ أوشكت على الوصول لشرفة الإشراق الكبرى.`;
      return '☀️ أشرقت حديقة البدايات بالكامل وتلاشى الضباب تمامًا؛ لقد أتقنت عادات الرفق بالنفس!';
    } else if (activeWorldId === 'library') {
      if (worldCompletedCount === 0) return '📜 أروقة المكتبة شبه مظلمة؛ ابدأ حل مراحل الحدود الشخصية لإضاءة الرفوف.';
      if (worldCompletedCount < 5) return `🕯️ بدأت المصابيح تتوهج تدريجيًا (${pct}% من مسارات المكتبة أُضيئت).`;
      if (worldCompletedCount < 10) return `📜 أروقة الفكر تتضح معالمها بنسبة ${pct}%؛ أنت قريب جدًا من قاعة النور.`;
      return '✨ قاعة النور مضاءة بالكامل؛ لقد استعدت وضوح رؤيتك وحدودك السليمة.';
    } else if (activeWorldId === 'cave') {
      if (worldCompletedCount === 0) return '💎 كهف العمق الصامت؛ المسارات متباينة وتتطلب مراقبة واعية.';
      if (worldCompletedCount < 5) return `💎 بدأت بلورات الكهف تعكس الضوء (${pct}% من مسار الوعي متجاوز).`;
      if (worldCompletedCount < 10) return `💎 صدى الإدراك يعلو في الكهف (${pct}%); أنت على عتبة قمة التحرر.`;
      return '🌟 قمة الذات المراقبة متألقة بالكامل وتفتحت حديقة البصيرة الكبرى للوعي والسكينة!';
    } else if (activeWorldId === 'symbol_maze') {
      if (worldCompletedCount === 0) return '🌀 متاهة الرموز غامضة وشافية؛ ابدأ فك شفرات التمييز بين السراب والواقع.';
      if (worldCompletedCount < 5) return `🌀 تم تفكيك ${pct}% من شفرات المتاهة؛ تزايد وضوح المعاني.`;
      if (worldCompletedCount < 10) return `🌀 اقتربت من اختراق المتاهة بنسبة ${pct}%؛ استمر في التمييز.`;
      return '✨ اخترقت متاهة الرموز بالكامل وتميزت بوعي الحقيقة واليقين!';
    } else if (activeWorldId === 'image_secrets') {
      if (worldCompletedCount === 0) return '🖼️ أسرار الصور تتطلب رؤية بصرية دقيقة لتجميع المعنى الكامل.';
      if (worldCompletedCount < 5) return `🖼️ اكتملت ${pct}% من التفاصيل البصرية للوحات الوعي.`;
      if (worldCompletedCount < 10) return `🖼️ الصورة الشاملة اتضحت بنسبة ${pct}%؛ اقتربت من اكتشاف السر الأعظم.`;
      return '🌟 اكتملت جميع أسرار الصور وتجلت الرؤية الصريحة الصافية!';
    } else {
      if (worldCompletedCount === 0) return '🧪 مختبر التفكير والحلول؛ أهلاً بك في العتبة الأخيرة نحو السيادة والوعي الحر.';
      if (worldCompletedCount < 5) return `🧪 أثمرت التجارب المعرفية بنسبة ${pct}%؛ أصبحت خبيراً في إعادة التأطير.`;
      if (worldCompletedCount < 10) return `🧪 العرش النهائي على بُعد خطوة بنسبة ${pct}%؛ استعد للتتويج الشامل.`;
      return '👑 تهانينا العظيمة! أتممت كافة التجارب وحققت السيادة والوعي الحر الأسمى!';
    }
  };

  const progressFactor = worldCompletedCount / 10;
  const bannerStyle = {
    fogOpacity: Math.max(0, 0.7 - (progressFactor * 0.7)),
    brightness: 0.6 + (progressFactor * 0.5),
    glowIntensity: 0.3 + (progressFactor * 0.7)
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-emerald-200" dir="rtl">
      {/* Top Bar: Brand, World Selector, Quick Nav */}
      <div className="sticky top-0 z-30 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Exit */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExitToMainApp}
              className="px-2.5 py-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-300 dark:border-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>← العودة للرئيسية</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">🗝️</span>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">
                  شفرة نسمة
                </h1>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  كل لغز يقرّبك من معنى
                </p>
              </div>
            </div>
          </div>

          {/* Quick Hub Buttons: Quotes Vault & Garden */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenQuotesVault();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all cursor-pointer shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>دفتر المقولات ({quotesDiscoveredCount}/10)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenGarden();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer shadow-2xs"
            >
              <Flower2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>حديقة الشفرة ({progress.gardenItems.length}/12)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playCorrect();
                const updated = unlockAllCipherLevels();
                setCurrentProgress(updated);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-xs font-bold flex items-center gap-1 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all cursor-pointer shadow-2xs"
              title="فتح جميع المراحل الستين فوراً للعب الحر"
            >
              <span>🔓 فتح الكل (60)</span>
            </button>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => { soundManager.playClick(); onDifficultyChange('easy'); }}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${difficulty === 'easy' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'}`}
              >
                سهل
              </button>
              <button
                type="button"
                onClick={() => { soundManager.playClick(); onDifficultyChange('medium'); }}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${difficulty === 'medium' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'}`}
              >
                متوسط
              </button>
              <button
                type="button"
                onClick={() => { soundManager.playClick(); onDifficultyChange('hard'); }}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${difficulty === 'hard' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'}`}
              >
                صعب 2x
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const newState = soundManager.toggleSound();
                setSoundEnabled(newState);
                if (newState) soundManager.playClick();
              }}
              title={soundEnabled ? "كتم الصوت" : "تفعيل الصوت"}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer shadow-2xs flex items-center justify-center"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Overall Adventure Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">المراحل المنجزة</span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {totalCompleted} / 60
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">نسمات النور (النقاط)</span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {progress.score}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">المقولات المكتشفة</span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {quotesDiscoveredCount} / 10
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">حفظ التقدم</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                محفوظ تلقائياً ✓
              </span>
            </div>
          </div>
        </div>

        {/* 6 Worlds Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {CIPHER_WORLDS.map((w) => {
            const isSelected = w.id === activeWorldId;
            const [wStart, wEnd] = w.levelsRange;
            const wCompleted = progress.completedLevels.filter(id => id >= wStart && id <= wEnd).length;
            const isUnlocked = progress.unlockedLevels.some(id => id >= wStart);
            const isWorldDone = wCompleted === (wEnd - wStart + 1);

            return (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveWorldId(w.id);
                }}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-start cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-white to-stone-50 dark:from-stone-800 dark:to-stone-900 border-emerald-500 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-stone-100 dark:bg-stone-800 relative">
                    {w.icon}
                    {isWorldDone && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
                        ★
                      </span>
                    )}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      {w.nameAr}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                      المراحل {wStart}-{wEnd}
                    </span>
                  </div>
                </div>
                <div className="text-end">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block tabular-nums">
                    {wCompleted}/10 مكتملة
                  </span>
                  {!isUnlocked && <Lock className="w-4 h-4 text-stone-400 ml-auto mt-1" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active World Living Transformed Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-800 bg-stone-900 group">
          {/* Dedicated Unobstructed Artwork Showcase Window (visible clearly on Mobile & Desktop) */}
          <div
            onClick={() => {
              soundManager.playClick();
              setShowArtworkModal(true);
            }}
            className="relative w-full h-56 sm:h-72 overflow-hidden bg-emerald-950 cursor-pointer"
          >
            <SafeCipherImage
              src={activeWorld.heroImage}
              alt={activeWorld.nameAr}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{
                filter: activeWorldId === 'library' 
                  ? `brightness(${Math.max(0.92, bannerStyle.brightness)})` 
                  : activeWorldId === 'cave'
                    ? `contrast(1.05) brightness(${0.95 + (bannerStyle.glowIntensity * 0.1)})`
                    : 'none',
              }}
            />
            {/* Subtle bottom fade into the info panel */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent pointer-events-none" />

            {/* Top Badges & Full Artwork Zoom Trigger */}
            <div className="absolute top-3.5 inset-x-3.5 z-20 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 bg-stone-950/75 border border-emerald-500/40 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-300 backdrop-blur-md shadow-sm">
                <span>{activeWorld.icon}</span>
                <span>{activeWorld.nameAr}</span>
                <span>·</span>
                <span>({startLvl} - {endLvl})</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  setShowArtworkModal(true);
                }}
                className="px-3 py-1.5 rounded-full bg-stone-950/75 hover:bg-stone-950 text-white text-xs font-bold backdrop-blur-md border border-white/25 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                title="عرض اللوحة الفنية الأصلية بدقة عالية"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>تكبير اللوحة 🔍</span>
              </button>
            </div>

            {/* Progress Badge Bottom-Start of Image */}
            <div className="absolute bottom-3 right-4 z-20 text-xs font-bold text-amber-300 bg-amber-950/85 border border-amber-500/40 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>نسبة الإنجاز الحي: {Math.round((worldCompletedCount / 10) * 100)}%</span>
            </div>
          </div>

          <div className="relative z-10 p-5 sm:p-7 space-y-4 text-white bg-stone-900">

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  {activeWorld.nameAr} — البيئة التفاعلية الحية
                </h2>
                {((activeWorldId === 'garden' && isGardenComplete) || (activeWorldId === 'library' && isLibraryComplete) || (activeWorldId === 'cave' && isCaveComplete)) && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                    مكتمل كليًا ⭐
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-200 max-w-2xl leading-relaxed">
                {activeWorld.descAr}
              </p>
            </div>

            {/* Living Environment Status Bar reflecting real progress */}
            <div className="p-3 bg-stone-900/85 border border-stone-800 rounded-2xl backdrop-blur-md flex items-center gap-2.5 text-xs text-emerald-300 font-medium shadow-inner">
              <span className="animate-pulse text-base">
                {activeWorldId === 'garden' ? '🌸' : activeWorldId === 'library' ? '📜' : '💎'}
              </span>
              <span>{getLivingEnvironmentStatus()}</span>
            </div>

            {/* World Secret Discovery Trigger Banner */}
            {(() => {
              const currentSecret = WORLD_SECRETS[activeWorldId];
              const isSecretUnlocked = worldCompletedCount >= 3;
              const isSecretDiscovered = currentProgress.secretDoorsUnlocked.includes(currentSecret.id);

              return (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-amber-950/85 via-stone-900 to-stone-900 border border-amber-500/40 rounded-2xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 shrink-0">
                      {isSecretDiscovered ? '✨' : '🔍'}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        {isSecretUnlocked ? (isSecretDiscovered ? 'تم اكتشاف السر الاختياري لهذا العالم ✓' : 'سر خفي متاح للاكتشاف في أروقة العالم!') : 'السر الخفي مغلق (يتطلب إتمام 3 مراحل)'}
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white">
                        {currentSecret.titleAr}
                      </h4>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setShowSecretModal(true);
                    }}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                      isSecretUnlocked
                        ? isSecretDiscovered
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
                          : 'bg-amber-500 text-stone-950 font-extrabold hover:bg-amber-400 animate-pulse'
                        : 'bg-stone-800 text-stone-400 border border-stone-700'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{isSecretDiscovered ? 'عرض تفاصيل السر' : isSecretUnlocked ? 'اكتشف السر الآن' : 'مغلق (3/3 مراحل)'}</span>
                  </button>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Interactive Winding Adventure Path */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>مسار المغامرة المتعرج لـ {activeWorld.nameAr}</span>
            </h3>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              تابع الخطوات المتاحة لفتح الشفرات
            </span>
          </div>

          {/* Winding Path Layout Container */}
          <div className="relative space-y-4 sm:space-y-6 before:absolute before:inset-y-0 before:right-6 sm:before:right-1/2 before:w-1 before:bg-emerald-200 dark:before:bg-emerald-950 before:z-0">
            {worldLevels.map((lvl, index) => {
              const isUnlocked = progress.unlockedLevels.includes(lvl.id);
              const isCompleted = progress.completedLevels.includes(lvl.id);
              const stars = progress.levelStars[lvl.id] || 0;
              const isCurrent = isUnlocked && !isCompleted;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={lvl.id}
                  className={`relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Stage Card */}
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => handleLevelClick(lvl.id)}
                      disabled={!isUnlocked}
                      className={`w-full p-4 sm:p-5 rounded-3xl border text-start flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all relative group cursor-pointer shadow-xs ${
                        isCurrent
                          ? 'bg-gradient-to-r from-amber-50/90 to-amber-100/40 dark:from-amber-950/40 dark:to-stone-900 border-amber-400 dark:border-amber-600 ring-4 ring-amber-400/20 shadow-md scale-[1.01]'
                          : isCompleted
                            ? 'bg-white dark:bg-stone-900 border-emerald-300 dark:border-emerald-800 hover:border-emerald-400'
                            : 'bg-stone-100/80 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {/* Left/Start side: Node indicator & Title */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-extrabold shrink-0 shadow-sm ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                            : isCurrent
                              ? 'bg-amber-500 text-white shadow-amber-500/40 animate-bounce'
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                        }`}>
                          {lvl.id}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                              خطوة {index + 1} من 10
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Play className="w-2.5 h-2.5 fill-white" />
                                الخطوة التالية
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-stone-100">
                            {lvl.titleAr}
                          </h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-md">
                            {lvl.subtitleAr}
                          </p>
                        </div>
                      </div>

                      {/* Right/End side: Stars / Lock & Reward Token */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-200 dark:border-stone-800">
                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-amber-500">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-700'}`}
                              />
                            ))}
                          </div>
                        ) : isUnlocked ? (
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-3 py-1 rounded-xl">
                            ابدأ اللغز ✨
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 text-stone-400 text-xs font-medium">
                            <Lock className="w-3.5 h-3.5" />
                            <span>مقفلة</span>
                          </div>
                        )}

                        <span className="text-[11px] text-stone-500 font-medium">
                          المكافأة: <strong className="text-emerald-700 dark:text-emerald-400">{isCompleted ? lvl.rewardToken.value : '🔒 مخفي'}</strong>
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Center Node Pin on Winding Path */}
                  <div className="hidden sm:flex items-center justify-center w-10 shrink-0">
                    <div className={`w-6 h-6 rounded-full border-4 transition-all ${
                      isCompleted 
                        ? 'bg-emerald-600 border-emerald-200 dark:border-emerald-950 scale-110' 
                        : isCurrent 
                          ? 'bg-amber-500 border-amber-200 dark:border-amber-950 ring-4 ring-amber-400/30 scale-125' 
                          : 'bg-stone-300 dark:bg-stone-700 border-stone-100 dark:border-stone-900'
                    }`} />
                  </div>

                  {/* Empty spacer for alternating winding layout on desktop */}
                  <div className="hidden sm:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="p-4 bg-stone-100 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          🌿 <strong>تنويه مبادرة نسمة حياة:</strong> لعبة «شفرة نسمة» أداة توعوية ترفيهية تفاعلية تهدف لتعزيز اليقظة الذهنية والرفق بالنفس، وليست بديلاً عن الاستشارة أو العلاج النفسي المتخصص.
        </div>

        {/* Reset Progress Safe Escape */}
        <div className="flex items-center justify-end pt-4 border-t border-stone-200 dark:border-stone-800">
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                هل أنت متأكد من مسح تقدمك باللعبة والبدء من جديد؟
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer"
              >
                نعم، مسح التقدم
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-1 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة تعيين التقدم</span>
            </button>
          )}
        </div>
      </main>

      {/* World Secret Discovery Modal */}
      {showSecretModal && (
        <CipherSecretModal
          worldId={activeWorldId}
          isUnlocked={worldCompletedCount >= 3}
          isAlreadyDiscovered={currentProgress.secretDoorsUnlocked.includes(WORLD_SECRETS[activeWorldId].id)}
          onClose={() => setShowSecretModal(false)}
          onDiscover={(secretId) => {
            const updated = unlockSecretDoor(secretId);
            setCurrentProgress(updated);
          }}
        />
      )}

      {/* Full High-Resolution Artwork Modal */}
      {showArtworkModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in" dir="rtl">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeWorld.icon}</span>
                <div>
                  <h3 className="text-sm font-bold">{activeWorld.nameAr}</h3>
                  <span className="text-[11px] text-stone-400">لوحة فنية أصلية فائقة الدقة</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowArtworkModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 overflow-auto bg-stone-950 p-3 sm:p-4 flex items-center justify-center">
              <SafeCipherImage
                src={activeWorld.heroImage}
                alt={activeWorld.nameAr}
                className="max-h-[65vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-stone-800"
              />
            </div>

            <div className="p-4 border-t border-stone-800 bg-stone-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-300 text-xs">
              <p className="leading-relaxed text-center sm:text-start">
                {activeWorld.descAr}
              </p>
              <button
                type="button"
                onClick={() => setShowArtworkModal(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                العودة للخريطة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

