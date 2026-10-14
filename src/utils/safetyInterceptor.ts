/**
 * Safety & Crisis Interceptor for Nesma Hayat (بروتوكول الأمان ورصد الطوارئ)
 * Scans user inputs in real-time across reflection canvases, notes, and interactive tools
 * to offer immediate, compassionate crisis support and certified hotlines.
 */

export interface CrisisHotline {
  countryAr: string;
  countryEn: string;
  phone: string;
  nameAr: string;
  nameEn: string;
  is24x7: boolean;
}

export const CERTIFIED_HOTLINES: CrisisHotline[] = [
  {
    countryAr: 'مصر',
    countryEn: 'Egypt',
    phone: '16328',
    nameAr: 'الأمانة العامة للصحة النفسية وعلاج الإدمان',
    nameEn: 'General Secretariat of Mental Health (GSMH)',
    is24x7: true
  },
  {
    countryAr: 'السعودية',
    countryEn: 'Saudi Arabia',
    phone: '920033360',
    nameAr: 'المركز الوطني لتعزيز الصحة النفسية',
    nameEn: 'National Center for Mental Health Promotion',
    is24x7: true
  },
  {
    countryAr: 'الإمارات',
    countryEn: 'UAE',
    phone: '8004673',
    nameAr: 'الخط الساخن للدعم النفسي (خط الأمل)',
    nameEn: 'National Mental Support Hotline (HOPE)',
    is24x7: true
  },
  {
    countryAr: 'الأردن',
    countryEn: 'Jordan',
    phone: '111',
    nameAr: 'خط المساعدة والدعم النفسي الوطني',
    nameEn: 'National Mental Health Helpline',
    is24x7: true
  },
  {
    countryAr: 'دولي / عام',
    countryEn: 'International',
    phone: '112',
    nameAr: 'رقم الطوارئ الموحد الدولي',
    nameEn: 'International Emergency Unified Number',
    is24x7: true
  }
];

export interface SafetyCheckResult {
  isCrisis: boolean;
  category: 'self_harm' | 'acute_crisis' | 'emergency_help' | null;
  triggerPhrase?: string;
  snippet?: string;
}

// Comprehensive multi-dialect Arabic and English patterns for severe distress, suicidal ideation, and self-harm
const SELF_HARM_REGEX = /(انتحار|أنتحر|بنتحر|عايز انتحر|عاوز انتحر|نفسي انتحر|أنهي حياتي|انهي حياتي|بنهي حياتي|سأنهي حياتي|إيذاء نفسي|ايذاء نفسي|أقتل نفسي|اقتل نفسي|بقتل نفسي|أشنق نفسي|اشنق نفسي|هموت نفسي|حاموت نفسي|تعبت من الحياة وبموت|سأنهي كل شيء|عايز أموت|عاوز اموت|عاوزة اموت|نفسي أموت|مش قادر أعيش|مش قادرة أعيش|الحياة ملهاش لازمة وعايز اخلص|وداعاً للأبد|وداعا للابد|suicide|commit suicide|end my life|ending my life|kill myself|harm myself|self-harm|want to die|ending it all|goodbye cruel world|take my own life|slit my wrist|hanging myself|overdose and die|can't go on anymore and want to die)/i;

const ACUTE_CRISIS_REGEX = /(نوبة هلع شديدة|أزمة طارئة|أفكر في إيذاء|افكر في ايذاء|أفكر في إنهاء|سأنهي كل شيء الليلة|سانهي كل شيء|حاسس بضياع تام وعايز اختفي|فقدت الرغبة في الوجود نهائيا|contemplating ending my life|hopeless and want to disappear|feel completely hopeless|unbearable psychological agony)/i;

const EMERGENCY_HELP_REGEX = /(مساعدة عاجلة|طوارئ نفسية|طوارئ|انقذوني|اسعاف نفسي|psychological emergency|crisis hotline|mental health emergency|need urgent suicide help)/i;

export const CRISIS_EVENT_NAME = 'nesma_crisis_detected';

/**
 * Checks arbitrary user text for acute distress or self-harm indicators
 */
export function checkTextSafety(text: string): SafetyCheckResult {
  if (!text || typeof text !== 'string') {
    return { isCrisis: false, category: null };
  }

  const clean = text.trim();
  if (clean.length < 3) {
    return { isCrisis: false, category: null };
  }

  const selfHarmMatch = clean.match(SELF_HARM_REGEX);
  if (selfHarmMatch) {
    return { 
      isCrisis: true, 
      category: 'self_harm', 
      triggerPhrase: selfHarmMatch[0],
      snippet: clean.slice(0, 80) 
    };
  }

  const acuteMatch = clean.match(ACUTE_CRISIS_REGEX);
  if (acuteMatch) {
    return { 
      isCrisis: true, 
      category: 'acute_crisis', 
      triggerPhrase: acuteMatch[0],
      snippet: clean.slice(0, 80) 
    };
  }

  const emergencyMatch = clean.match(EMERGENCY_HELP_REGEX);
  if (emergencyMatch) {
    return { 
      isCrisis: true, 
      category: 'emergency_help', 
      triggerPhrase: emergencyMatch[0],
      snippet: clean.slice(0, 80) 
    };
  }

  return { isCrisis: false, category: null };
}

/**
 * Dispatches a global event to open the Crisis Safety Modal when triggered
 */
export function triggerCrisisInterception(matchedText: string, source: string = 'user_input'): void {
  if (typeof window === 'undefined') return;
  const detail = {
    matchedText,
    source,
    timestamp: Date.now()
  };
  window.dispatchEvent(new CustomEvent(CRISIS_EVENT_NAME, { detail }));
}

/**
 * Automated test suite for safety protocol validation across multiple phrases and dialects
 */
export function runSafetyProtocolTests(): { 
  totalTests: number; 
  passed: number; 
  failed: number; 
  details: { phrase: string; expected: boolean; actual: boolean; passed: boolean; category: string | null }[] 
} {
  const testCases = [
    // Crisis expressions (Arabic dialects & standard)
    { phrase: 'أفكر في الانتحار وأشعر بالعجز التام', expected: true },
    { phrase: 'عايز أموت ومحدش حاسس بيا', expected: true },
    { phrase: 'بنتحر بجد ومش قادر أعيش', expected: true },
    { phrase: 'سأنهي كل شيء الليلة وداعاً للأبد', expected: true },
    { phrase: 'نفسي أموت وأرتاح من هذا الألم', expected: true },
    { phrase: 'أفكر في إيذاء نفسي بالمشرط', expected: true },
    { phrase: 'أريد مساعدة عاجلة طوارئ نفسية', expected: true },
    { phrase: 'تعبت من الحياة وبموت من الخنقة', expected: true },
    { phrase: 'هموت نفسي خلاص ملهاش لازمة', expected: true },
    // Crisis expressions (English)
    { phrase: 'I really want to kill myself today', expected: true },
    { phrase: 'thinking of ending my life right now', expected: true },
    { phrase: 'goodbye cruel world I give up', expected: true },
    { phrase: 'need urgent suicide help', expected: true },
    // Safe expressions that should NOT trigger false crisis alarms
    { phrase: 'أشعر ببعض التوتر من امتحان الغد وسأذاكر جيداً', expected: false },
    { phrase: 'يومي كان صعباً لكني سأرتاح وأشرب شاي دافئ', expected: false },
    { phrase: 'أريد تنظيم وقتي والتغلب على عادة التسويف', expected: false },
    { phrase: 'I feel slightly tired after work but looking forward to sleeping', expected: false },
    { phrase: 'بحب لعبة ترتيب الأفكار وبدلي الجملة جداً', expected: false }
  ];

  const details = testCases.map(tc => {
    const res = checkTextSafety(tc.phrase);
    const passed = res.isCrisis === tc.expected;
    return {
      phrase: tc.phrase,
      expected: tc.expected,
      actual: res.isCrisis,
      passed,
      category: res.category
    };
  });

  const passed = details.filter(d => d.passed).length;
  const failed = details.length - passed;

  return {
    totalTests: details.length,
    passed,
    failed,
    details
  };
}
