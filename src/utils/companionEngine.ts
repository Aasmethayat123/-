/**
 * CompanionEngine for Nesma Hayat (محرك الرفيق الذكي النفسي)
 * Implements a dual-layer cognitive architecture:
 * Layer 1: Safety & Crisis Interceptor (Local immediate scan)
 * Layer 2: PII Redaction & Privacy Guard
 * Layer 3: Server-side Gemini 3.8 Flash Cloud Service with automatic fallback
 * Layer 4: Resilient Local CBT & ACT Cognitive Engine (Offline & Private)
 */

import { checkTextSafety, triggerCrisisInterception, SafetyCheckResult } from './safetyInterceptor';

export interface CompanionMessage {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  timestamp: number;
  distortionTag?: string;
  provider?: 'cloud-gemini' | 'local-cbt-engine';
}

export interface CompanionResponse {
  reply: string;
  distortionIdentified?: string;
  socraticQuestion?: string;
  groundingExercise?: string;
  safetyCheck: SafetyCheckResult;
  provider: 'cloud-gemini' | 'local-cbt-engine';
  isFallback: boolean;
}

export interface CompanionOptions {
  allowCloud?: boolean;
  language?: 'ar' | 'en';
  contextCategory?: 'weekly-session' | 'anxiety' | 'overthinking' | 'burnout' | 'relationship';
}

/**
 * PII Scrubber: Strips phone numbers, email addresses, and potential identifiers
 */
export function scrubPII(text: string): string {
  if (!text) return '';
  return text
    // Replace emails
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[بريد محمي]')
    // Replace telephone numbers (Egyptian, Gulf, International formats)
    .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/g, '[رقم محمي]');
}

/**
 * Deterministic Local Cognitive Engine based on CBT & ACT principles
 */
function generateLocalCBTReply(userInput: string, language: 'ar' | 'en'): CompanionResponse {
  const isAr = language === 'ar';
  const lower = userInput.toLowerCase();

  // Cognitive distortion matching patterns
  const isCatastrophic = /(كارثة|دايماً بيفشل|كل حاجة باظت|مستحيل أصلح|نهاية العالم|disaster|ruined|impossible|catastrophe)/i.test(userInput);
  const isAllOrNothing = /(دايماً|أبداً|كل الناس|محدش بيحبني|كلهم ضدي|always|never|everyone|nobody)/i.test(userInput);
  const isSelfBlame = /(أنا السبب|ذنبي|أنا فاشل|أنا غبي|غلطتي|my fault|i am a failure|i am stupid|blame myself)/i.test(userInput);
  const isAnxiousFuture = /(خايف يحصل|قلقان من بكرة|لو حصل كذا|مترقب|scared of what will happen|what if|anxious about tomorrow)/i.test(userInput);

  let distortion = isAr ? 'أفكار تلقائية شائعة' : 'Common Automatic Thought';
  let reply = '';
  let socratic = '';
  let grounding = isAr 
    ? 'خذ نفساً عميقاً (4 ثوانٍ شهيق، 7 ثوانٍ حبس، 8 ثوانٍ زفير هادئ)' 
    : 'Take a deep breath (4s inhale, 7s hold, 8s gentle exhale)';

  if (isCatastrophic) {
    distortion = isAr ? 'التضخيم والتفكير الكارثي (Catastrophizing)' : 'Catastrophizing';
    reply = isAr 
      ? 'أسمعك بوضوح وأقدّر تماماً حجم الثقل الذي تشعر به الآن. عندما نكون تحت الضغط، يميل عقلنا لرسم أسوأ السيناريوهات لحمايتنا ظاهرياً، لكنه يضخم الخطر الحقيقي.'
      : 'I hear you and understand the weight you feel right now. Under stress, our minds project the worst-case scenario to protect us, but it often magnifies reality.';
    socratic = isAr
      ? 'لو سألنا أنفسنا بهدوء: ما هو الاحتمال الأكثر واقعية واعتدالاً لما قد يحدث فعلاً بعيداً عن أسوأ التوقعات؟'
      : 'What is the most realistic, balanced outcome that could happen, aside from the worst-case assumption?';
  } else if (isAllOrNothing) {
    distortion = isAr ? 'التفكير المستقطب الأبيض والأسود (All-or-Nothing)' : 'All-or-Nothing Thinking';
    reply = isAr
      ? 'لاحظت في كلماتك استخدام كلمات مثل «دايماً» أو «كل شيء». المشاعر الصعبة تجعلنا نرى الواقع بلونين فقط، بينما الحقيقة تتسع لدرجات رمادية وألوان كثيرة.'
      : 'I noticed absolute terms like "always" or "never". Painful emotions push us into black-and-white mode, while life is full of gentle grey areas.';
    socratic = isAr
      ? 'هل حدثت في الماضي مرة واحدة على الأقل اختلفت فيها النتيجة عما تتوقعه الآن؟'
      : 'Has there been even one instance in the past where the outcome differed from this absolute expectation?';
  } else if (isSelfBlame) {
    distortion = isAr ? 'الشخصنة واللوم الذاتي الجائر (Personalization)' : 'Personalization & Self-Blame';
    reply = isAr
      ? 'من الموجع أن نحمل أنفسنا عبء كل ما جرى. لوم النفس قد يشعرنا بوهم السيطرة، لكنك تستحق نفس اللطف والرحمة التي تمنحها لأقرب أصدقائك.'
      : 'Carrying the whole burden hurts deeply. Blaming yourself provides an illusion of control, but you deserve the same compassion you would offer a dear friend.';
    socratic = isAr
      ? 'ما هي العوامل والظروف الخارجية التي كانت خارج إرادتك تماماً في هذا الموقف؟'
      : 'What external variables and circumstances in this situation were genuinely outside your direct control?';
  } else if (isAnxiousFuture) {
    distortion = isAr ? 'الاستباق القلق وقراءة المستقبل (Future Fortune-Telling)' : 'Fortune-Telling / Anticipatory Anxiety';
    reply = isAr
      ? 'القلق هو محاولة العقل العيش في الغد بينما جسدك لا يزال في اليوم. طاقتك الذهنية محدودة، وتستحق أن توجهها لما هو بين يديك الآن فقط.'
      : 'Anxiety is the mind trying to live in tomorrow while your body is anchored in today. Your energy is best served focusing on the present.';
    socratic = isAr
      ? 'ما هي الخطوة البسيطة جداً الملموسة التي تقع داخل دائرة تحكمك خلال الـ 15 دقيقة القادمة؟'
      : 'What is one tiny, tangible step within your control for the next 15 minutes?';
  } else {
    reply = isAr
      ? 'شكراً لأنك تشاركني هذه الأفكار بصدق. التعبير خطوة أساسية لنقل الألم من فوضى الرأس إلى مساحة الوعي والترتيب.'
      : 'Thank you for expressing this honestly. Naming your experience shifts it from chaos in the mind to calm awareness.';
    socratic = isAr
      ? 'لو نظرت لهذه المشاعر كضيف يمر بحياتك مؤقتاً، ما الرسالة التي يحاول تنبيهك إليها بلطف؟'
      : 'If you observed this emotion as a temporary passing guest, what is it gently trying to tell you?';
  }

  return {
    reply,
    distortionIdentified: distortion,
    socraticQuestion: socratic,
    groundingExercise: grounding,
    safetyCheck: { isCrisis: false, category: null },
    provider: 'local-cbt-engine',
    isFallback: false
  };
}

/**
 * Main CompanionEngine entry point
 */
export async function processCompanionMessage(
  userInput: string,
  history: CompanionMessage[] = [],
  options: CompanionOptions = {}
): Promise<CompanionResponse> {
  const lang = options.language || 'ar';
  const isAr = lang === 'ar';

  // 1. Mandatory Safety & Crisis Interception Check
  const safety = checkTextSafety(userInput);
  if (safety.isCrisis) {
    triggerCrisisInterception(userInput, 'companion_engine_message');
    return {
      reply: isAr
        ? 'ألاحظ أنك تمر بلحظة ضيق شديدة جداً قد تتجاوز قدرة المحادثات العادية. سلامتك هي أولويتي القصوى، ولهذا قمنا بفتح بروتوكول الأمان وخطوط الطوارئ المعتمدة فوراً لتلقي دعم تخصصي حقيقي.'
        : 'I sense that you are going through acute distress. Your safety is our absolute priority, which is why our certified crisis hotlines have been immediately presented for you.',
      safetyCheck: safety,
      provider: 'local-cbt-engine',
      isFallback: false
    };
  }

  // 2. Scrub PII before any potential transmission
  const scrubbedText = scrubPII(userInput);

  // 3. Attempt Server-side Cloud AI if enabled AND device is online
  const allowCloud = options.allowCloud !== false;
  const isBrowserOnline =
    typeof navigator === 'undefined' ? true : navigator.onLine !== false;

  if (allowCloud && isBrowserOnline && typeof window !== 'undefined') {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch('/api/companion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          message: scrubbedText,
          history: history.slice(-6).map(m => ({
            sender: m.sender,
            text: scrubPII(m.text)
          })),
          language: lang,
          contextCategory: options.contextCategory || 'weekly-session'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          return {
            reply: data.reply,
            distortionIdentified: data.distortionIdentified,
            socraticQuestion: data.socraticQuestion,
            groundingExercise: data.groundingExercise,
            safetyCheck: { isCrisis: false, category: null },
            provider: 'cloud-gemini',
            isFallback: false
          };
        }
      }
    } catch {
      // Network timeout or offline state -> seamlessly fall back to local CBT engine
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  // 4. Deterministic Local CBT Engine Fallback
  const localRes = generateLocalCBTReply(scrubbedText, lang);
  return {
    ...localRes,
    isFallback: allowCloud
  };
}

export const CompanionEngine = {
  processMessage: processCompanionMessage,
  scrubPII,
  generateLocalReply: generateLocalCBTReply
};

/**
 * Automated test suite for CompanionEngine verification
 */
export async function runCompanionEngineTests(): Promise<{
  safetyInterceptionPassed: boolean;
  piiScrubbingPassed: boolean;
  localReasoningPassed: boolean;
  details: { testName: string; passed: boolean; note: string }[];
}> {
  const details = [];

  // Test 1: PII Scrubbing
  const rawWithPII = 'اسمي أحمد ورقمي 01012345678 وايميلي ahmed@test.com وأشعر بضغط';
  const scrubbed = scrubPII(rawWithPII);
  const piiPassed = !scrubbed.includes('01012345678') && !scrubbed.includes('ahmed@test.com');
  details.push({
    testName: 'حجب البيانات الشخصية (PII Redaction)',
    passed: piiPassed,
    note: piiPassed ? 'تم استبدال أرقام الهواتف والبريد بنجاح قبل الإرسال.' : 'فشل في حجب البيانات الشخصية'
  });

  // Test 2: Local Cognitive Engine (100% Offline CBT/ACT)
  const localRes = generateLocalCBTReply('أنا دايماً بفشل في كل شيء وكل حاجة باظت', 'ar');
  const localPassed = !!localRes.reply && !!localRes.distortionIdentified && localRes.provider === 'local-cbt-engine';
  details.push({
    testName: 'محرك التحليل المعرفي المحلي بدون إنترنت (Offline CBT/ACT Engine)',
    passed: localPassed,
    note: `نجح فورياً بدون شبكة في تحديد التشوه المعرفي: [${localRes.distortionIdentified}] وصياغة رد تعاطفي.`
  });

  // Test 3: Crisis Handling
  const crisisInput = 'عايز انتحر وأنهي حياتي الليلة';
  const crisisRes = await processCompanionMessage(crisisInput, [], { allowCloud: false, language: 'ar' });
  const crisisPassed = crisisRes.safetyCheck.isCrisis === true;
  details.push({
    testName: 'اعتراض الطوارئ بمحرك الرفيق (Crisis Escaping)',
    passed: crisisPassed,
    note: crisisPassed ? 'تم رصد نية إيذاء النفس فورياً وتفعيل مسار الدعم الطارئ.' : 'فشل في رصد نية الأزمة'
  });

  return {
    safetyInterceptionPassed: crisisPassed,
    piiScrubbingPassed: piiPassed,
    localReasoningPassed: localPassed,
    details
  };
}
