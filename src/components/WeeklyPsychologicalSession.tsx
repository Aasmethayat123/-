import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  Bot, 
  User, 
  Save, 
  Lock, 
  CheckCircle2, 
  RefreshCw, 
  Wind,
  Flame,
  HelpCircle,
  Activity,
  Award
} from 'lucide-react';
import { Language } from '../types';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { storage } from '../utils/storage';
import { CompanionEngine, CompanionMessage } from '../utils/companionEngine';
import { checkTextSafety, triggerCrisisInterception } from '../utils/safetyInterceptor';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface WeeklyPsychologicalSessionProps {
  language: Language;
  onBackToMap: () => void;
  onAddXP?: (amount: number) => void;
  onOpenBreathing?: () => void;
}

type SessionStep = 'checkin' | 'unload' | 'companion' | 'intent' | 'summary';

export const WeeklyPsychologicalSession: React.FC<WeeklyPsychologicalSessionProps> = ({
  language,
  onBackToMap,
  onAddXP,
  onOpenBreathing
}) => {
  const isAr = language === 'ar';
  const isOnline = useOnlineStatus();

  const [step, setStep] = useState<SessionStep>('checkin');
  const [moodRating, setMoodRating] = useState<number>(6);
  const [somaticZone, setSomaticZone] = useState<string>('chest');
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  
  // Cognitive Unload Canvas
  const [unloadContent, setUnloadContent] = useState<string>('');
  const [unloadSafetyWarning, setUnloadSafetyWarning] = useState<string | null>(null);

  // Companion Chat Dialogue
  const [messages, setMessages] = useState<CompanionMessage[]>([
    {
      id: 'init_1',
      sender: 'companion',
      text: isAr 
        ? 'مرحباً بك في جلستك الأسبوعية المخصصة. أنا رفيقك المعرفي هنا للاستماع والمساعدة في تفكيك أي أفكار ثقيلة مررت بها هذا الأسبوع. كيف تلخص أكبر تحدٍ ذهني واجهته؟'
        : 'Welcome to your weekly psychological reflection session. I am your cognitive companion, here to help unpack any heavy thoughts from your week. What felt like the biggest mental challenge?',
      timestamp: Date.now(),
      provider: 'local-cbt-engine'
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [useCloudAi, setUseCloudAi] = useState<boolean>(true);

  // Intent & Micro-Commitment
  const [letGoItem, setLetGoItem] = useState<string>('');
  const [embraceItem, setEmbraceItem] = useState<string>('');
  const [microHabit, setMicroHabit] = useState<string>('');

  // Consent & Persistence
  const [saveConsent, setSaveConsent] = useState<boolean>(true);
  const [sessionSaved, setSessionSaved] = useState<boolean>(false);

  const FEELING_OPTIONS = [
    { id: 'anxious', labelAr: 'قلق ومترقب', labelEn: 'Anxious' },
    { id: 'exhausted', labelAr: 'إرهاق ذهني', labelEn: 'Mental Exhaustion' },
    { id: 'grateful', labelAr: 'امتنان ورضا', labelEn: 'Grateful' },
    { id: 'overwhelmed', labelAr: 'تزاحم أعباء', labelEn: 'Overwhelmed' },
    { id: 'peaceful', labelAr: 'سكينة وهدوء', labelEn: 'Peaceful' },
    { id: 'lonely', labelAr: 'شعور بالوحدة', labelEn: 'Lonely' },
    { id: 'hopeful', labelAr: 'بصيص أمل', labelEn: 'Hopeful' }
  ];

  const SOMATIC_ZONES = [
    { id: 'head', labelAr: 'صداع وثقل بالرأس', labelEn: 'Head tension / Headache' },
    { id: 'neck', labelAr: 'شد بالكتفين والرقبة', labelEn: 'Shoulder & Neck tight' },
    { id: 'chest', labelAr: 'ضيق بالصدر ونبض متسارع', labelEn: 'Chest pressure / Flutter' },
    { id: 'stomach', labelAr: 'انقباض بالمعدة', labelEn: 'Stomach clench' },
    { id: 'relaxed', labelAr: 'جسد مسترخٍ وخفيف', labelEn: 'Relaxed & Light' }
  ];

  const handleToggleFeeling = (id: string) => {
    setSelectedFeelings(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
    soundManager.playSoftTap();
  };

  const handleUnloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setUnloadContent(text);

    // Live safety interception check
    const safety = checkTextSafety(text);
    if (safety.isCrisis) {
      setUnloadSafetyWarning(
        isAr 
          ? 'تنبيه أمان: رصدنا عبارات تعكس ألماً حاداً. تم توفير أرقام الطوارئ في شريط الأمان.' 
          : 'Safety Warning: Severe distress detected. Emergency assistance options are active.'
      );
    } else {
      setUnloadSafetyWarning(null);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAiLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    // Check crisis safety
    const safety = checkTextSafety(userText);
    if (safety.isCrisis) {
      triggerCrisisInterception(userText, 'weekly_session_chat');
    }

    const newMsg: CompanionMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: Date.now()
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setIsAiLoading(true);

    try {
      soundManager.playSoftTap();
      const response = await CompanionEngine.processMessage(userText, updated, {
        language: isAr ? 'ar' : 'en',
        allowCloud: useCloudAi,
        contextCategory: 'weekly-session'
      });

      const replyMsg: CompanionMessage = {
        id: `comp_${Date.now()}`,
        sender: 'companion',
        text: response.reply,
        timestamp: Date.now(),
        distortionTag: response.distortionIdentified,
        provider: response.provider
      };

      setMessages(prev => [...prev, replyMsg]);

      if (response.provider === 'cloud-gemini') {
        soundManager.playChime();
      } else {
        soundManager.playPop();
      }
    } catch {
      // Fallback message
      setMessages(prev => [
        ...prev,
        {
          id: `fallback_${Date.now()}`,
          sender: 'companion',
          text: isAr
            ? 'أنا معك واستمع لكل كلمة، أحياناً يكون مجرد البوح وتسمية المشاعر خطوة كافية لاستعادة التوازن.'
            : 'I am here with you. Merely naming your feelings is often a major step towards reclaiming calm.',
          timestamp: Date.now(),
          provider: 'local-cbt-engine'
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFinishAndSave = () => {
    soundManager.playLevelUpFanfare();
    triggerConfetti();

    const summaryText = `
المزاج الأسبوعي: ${moodRating}/10
أعراض الجسد: ${somaticZone}
المشاعر البارزة: ${selectedFeelings.join(', ')}

تفريغ الأفكار:
${unloadContent}

ميثاق الأسبوع:
- أترك خلفي: ${letGoItem || 'التوقعات غير الواقعية'}
- أتبنى: ${embraceItem || 'اللطف بالذات والتأني'}
- العادة اليومية المصغرة: ${microHabit || 'دقيقة تنفس هادئ كل صباح'}
`.trim();

    storage.addNote({
      title: isAr ? `حصاد الجلسة النفسية الأسبوعية (${new Date().toLocaleDateString('ar-EG')})` : `Weekly Psychological Reflection (${new Date().toLocaleDateString()})`,
      content: summaryText,
      category: 'weekly-session',
      tags: ['جلسة_أسبوعية', somaticZone, ...selectedFeelings],
      mood: `${moodRating}/10`,
      overrideConsent: saveConsent
    });

    if (onAddXP) {
      onAddXP(150);
    }

    setSessionSaved(true);
    setStep('summary');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Session Breadcrumb Bar */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            {isAr ? '← الرئيسية' : '← Home'}
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
              {isAr ? 'الجلسة النفسية الأسبوعية 🛋️' : 'Weekly Psychological Session 🛋️'}
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
          <span className={step === 'checkin' ? 'text-emerald-400 font-bold' : ''}>1. فحص</span>
          <span>•</span>
          <span className={step === 'unload' ? 'text-emerald-400 font-bold' : ''}>2. تفريغ</span>
          <span>•</span>
          <span className={step === 'companion' ? 'text-emerald-400 font-bold' : ''}>3. الرفيق</span>
          <span>•</span>
          <span className={step === 'intent' ? 'text-emerald-400 font-bold' : ''}>4. الميثاق</span>
        </div>
      </div>

      {/* STEP 1: Check-in */}
      {step === 'checkin' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              {isAr ? 'المحطة الأولى: نبض الأسبوع' : 'Step 1: Weekly Pulse'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
              {isAr ? 'كيف كانت حالتك النفسية وطاقتك العامة هذا الأسبوع؟ 🌿' : 'How was your mental energy and pulse this week? 🌿'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isAr ? 'امنح نفسك فرصة لتقييم واقعي بدون لوم ذاتي أو رغبة في الكمال.' : 'Give yourself an honest check-in without judgment.'}
            </p>
          </div>

          {/* Mood Slider */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
              <span>{isAr ? 'مؤشر الهدوء والمزاج:' : 'Mood & Calm Index:'}</span>
              <span className="text-base text-emerald-800 dark:text-emerald-400 font-mono font-extrabold">
                {moodRating} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={moodRating}
              onChange={(e) => setMoodRating(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer h-2 bg-stone-200 dark:bg-stone-700 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>{isAr ? '1 - إرهاق وضغط شديد' : '1 - High stress / exhausted'}</span>
              <span>{isAr ? '5 - متوسط ومقبول' : '5 - Balanced'}</span>
              <span>{isAr ? '10 - سكينة وسلام عميق' : '10 - Deep peace & thriving'}</span>
            </div>
          </div>

          {/* Somatic Zone */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'أين يتركز الثقل في جسدك الآن؟ (فحص الجسد):' : 'Where does physical tension reside right now?'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOMATIC_ZONES.map(zone => (
                <button
                  key={zone.id}
                  onClick={() => setSomaticZone(zone.id)}
                  className={`p-3 rounded-2xl text-xs font-bold text-right flex items-center justify-between border-2 transition-all cursor-pointer ${
                    somaticZone === zone.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-800 dark:border-emerald-500 text-emerald-900 dark:text-emerald-300'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <span>{isAr ? zone.labelAr : zone.labelEn}</span>
                  {somaticZone === zone.id && <CheckCircle2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Feeling tags */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'الكلمات الأقرب لمشاعرك البارزة:' : 'Words describing your prominent feelings:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {FEELING_OPTIONS.map(opt => {
                const isSelected = selectedFeelings.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleToggleFeeling(opt.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {isAr ? opt.labelAr : opt.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => {
                soundManager.playChime();
                setStep('unload');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>{isAr ? 'المتابعة لتفريغ الأفكار' : 'Proceed to Unloading'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Unload */}
      {step === 'unload' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              {isAr ? 'المحطة الثانية: تفريغ الفوضى الذهنية' : 'Step 2: Cognitive Unloading'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
              {isAr ? 'مساحة البوح الآمنة: اكتب كل ما يشغل رأسك دون قيود 📝' : 'Safe Release Canvas: Express what is occupying your mind 📝'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isAr
                ? 'لا تقلق بشأن الصياغة أو القواعد. مساحة محمية تماماً ومراقبة ببروتوكول الأمان الفوري.'
                : 'Write freely without censoring yourself. Monitored by our continuous safety protocol.'}
            </p>
          </div>

          {unloadSafetyWarning && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-200 rounded-2xl text-xs flex items-center gap-2 animate-pulse">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{unloadSafetyWarning}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <textarea
              rows={6}
              value={unloadContent}
              onChange={handleUnloadChange}
              placeholder={isAr ? 'مثال: هذا الأسبوع شعرت بضغط شديد بسبب كثرة المهام، وأفكاري كانت تخبرني أنني لن أستطيع إنجاز شيء، مما زاد من قلقي...' : 'e.g. This week I felt overwhelmed with tasks and worried about failing...'}
              className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:border-emerald-800 focus:outline-none transition-colors"
            />
            <div className="flex justify-between text-[11px] text-stone-400 px-1">
              <span>{isAr ? 'عدد الكلمات:' : 'Word count:'} {unloadContent.trim() ? unloadContent.trim().split(/\s+/).length : 0}</span>
              <span>{isAr ? '🔒 خصوصية محلية مشفرة' : '🔒 Local Encrypted Privacy'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => setStep('checkin')}
              className="px-4 py-2 text-stone-500 hover:text-stone-700 dark:text-stone-400 text-xs font-bold"
            >
              {isAr ? 'السابق' : 'Back'}
            </button>

            <button
              onClick={() => {
                soundManager.playChime();
                setStep('companion');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>{isAr ? 'بدء تفكيك الأفكار مع الرفيق' : 'Start Companion Deconstruction'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Companion Engine Dialogue */}
      {step === 'companion' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                {isAr ? 'المحطة الثالثة: تفكيك الأفكار مع الرفيق' : 'Step 3: Companion Dialogue'}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white">
                {isAr ? 'محرك الرفيق الذكي النفسي 💬' : 'Psychological Companion Engine 💬'}
              </h2>
            </div>

            {/* Cloud vs Local Switch */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400 text-[11px]">{isAr ? 'المحرك:' : 'Engine:'}</span>
              <button
                onClick={() => setUseCloudAi(!useCloudAi)}
                className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-colors cursor-pointer ${
                  useCloudAi && isOnline
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                {!isOnline
                  ? (isAr ? 'محلي بدون إنترنت (CBT)' : 'Offline Local (CBT)')
                  : useCloudAi
                  ? (isAr ? 'سحابي (Gemini)' : 'Cloud Active')
                  : (isAr ? 'محلي فقط (CBT)' : 'Local Only')}
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? (isAr ? 'flex-row-reverse' : 'flex-row') : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser ? 'bg-amber-100 text-amber-800' : 'bg-emerald-800 text-white'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`p-4 rounded-3xl max-w-lg text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800/60'
                  }`}>
                    <p>{m.text}</p>

                    {m.distortionTag && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-[10px] font-bold">
                        <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-300" />
                        <span>{m.distortionTag}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isAiLoading && (
              <div className="flex gap-3 items-center text-xs text-stone-400 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <span>{isAr ? 'الرفيق يتأمل في كلماتك...' : 'Companion is reflecting...'}</span>
              </div>
            )}
          </div>

          {/* Input Chat Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isAr ? 'اكتب ما يدور في بالك لمناقشته مع الرفيق...' : 'Type a thought to explore with your companion...'}
              className="flex-1 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-xs sm:text-sm focus:border-emerald-800 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={isAiLoading || !inputMessage.trim()}
              className="px-5 py-3.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-bold cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Next Button */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => setStep('unload')}
              className="px-4 py-2 text-stone-500 hover:text-stone-700 text-xs font-bold"
            >
              {isAr ? 'السابق' : 'Back'}
            </button>

            <button
              onClick={() => {
                soundManager.playChime();
                setStep('intent');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>{isAr ? 'الانتقال إلى ميثاق الأسبوع القادم' : 'Proceed to Weekly Intent'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Intent & Micro-Commitment */}
      {step === 'intent' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              {isAr ? 'المحطة الرابعة: بوصلة الأسبوع الجديد' : 'Step 4: Weekly Intent'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
              {isAr ? 'ميثاق السكينة: ماذا تترك وماذا تتبنى؟ ⚓' : 'Commitment of Calm: What to release and embrace? ⚓'}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <span>🍃 ما هو الشيء الذي تقرر تركه وتخفيف قبضة السيطرة عليه هذا الأسبوع؟</span>
              </span>
              <input
                type="text"
                value={letGoItem}
                onChange={(e) => setLetGoItem(e.target.value)}
                placeholder={isAr ? 'مثال: الرغبة في إرضاء الجميع، أو التفكير المفرط في نتائج المستقبل...' : 'e.g. Trying to please everyone, or over-controlling outcomes...'}
                className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <span>🌸 ما هي النوايا أو القيمة التي تريد احتضانها وممارستها بلطف؟</span>
              </span>
              <input
                type="text"
                value={embraceItem}
                onChange={(e) => setEmbraceItem(e.target.value)}
                placeholder={isAr ? 'مثال: الصبر مع نفسي، أخذ فترات راحة منتظمة، وضع حدود واضحة...' : 'e.g. Self-compassion, gentle pacing, healthy boundaries...'}
                className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <span>⚡ عادة يومية مصغرة (دقيقة واحدة فقط) ستلتزم بها:</span>
              </span>
              <input
                type="text"
                value={microHabit}
                onChange={(e) => setMicroHabit(e.target.value)}
                placeholder={isAr ? 'مثال: دقيقة تنفس عميق قبل فتح الهاتف، أو شرب كوب ماء بامتنان...' : 'e.g. 1-minute conscious breathing before checking phone...'}
                className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Privacy & Storage Consent Option */}
          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {isAr ? 'خيارات الخصوصية وحفظ الجلسة:' : 'Privacy & Storage Options:'}
            </span>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 dark:text-stone-300 font-medium">
                <input
                  type="radio"
                  name="session_consent"
                  checked={saveConsent === true}
                  onChange={() => setSaveConsent(true)}
                  className="accent-emerald-800"
                />
                <span>{isAr ? 'حفظ الجلسة في سجلي المحلي الآمن 🔒' : 'Save session to my secure local log 🔒'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 dark:text-stone-300 font-medium">
                <input
                  type="radio"
                  name="session_consent"
                  checked={saveConsent === false}
                  onChange={() => setSaveConsent(false)}
                  className="accent-emerald-800"
                />
                <span>{isAr ? 'جلسة خاصة فورية دون حفظ أي بيانات (Private Ephemeral)' : 'Private ephemeral session (do not persist)'}</span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => setStep('companion')}
              className="px-4 py-2 text-stone-500 hover:text-stone-700 text-xs font-bold"
            >
              {isAr ? 'السابق' : 'Back'}
            </button>

            <button
              onClick={handleFinishAndSave}
              className="flex items-center gap-2 px-7 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'إتمام الجلسة واستلام المكافأة (+150 XP)' : 'Complete Session (+150 XP)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Summary */}
      {step === 'summary' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-xl space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto text-3xl shadow-inner border border-emerald-200 dark:border-emerald-800">
            🌿
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest block">
              {isAr ? 'تم إتمام الجلسة الأسبوعية بنجاح' : 'Session Completed Successfully'}
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              {isAr ? 'فخورون بوعيك واعتنائك بنفسك 🌸' : 'Proud of your self-awareness & reflection 🌸'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              {saveConsent
                ? (isAr ? 'تم حفظ حصاد جلستك بأمان في سجلك المحلي، ويمكنك مراجعته أو طباعته في أي وقت.' : 'Saved safely to your local journey log.')
                : (isAr ? 'جلسة خاصة فورية مكتملة دون كتابة أي بيانات في التخزين، بما يضمن خصوصيتك التامة.' : 'Private session completed with zero local persistence.')}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-extrabold text-sm">
            <Award className="w-5 h-5 text-amber-600" />
            <span>{isAr ? 'حصلت على +150 نقطة وعي (XP) وشعلة إصرار جديدة 🔥' : 'Earned +150 XP & Streak Flame 🔥'}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={onBackToMap}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {isAr ? 'العودة للخريطة والألعاب' : 'Return to Games Map'}
            </button>

            {onOpenBreathing && (
              <button
                onClick={onOpenBreathing}
                className="flex items-center gap-1.5 px-5 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
              >
                <Wind className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span>{isAr ? 'تمرين تنفس هادئ' : 'Breathing Exercise'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
