import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
process.env.DISABLE_HMR = 'true';

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '1mb' }));

// Initialize Google Gen AI client if GEMINI_API_KEY is provided
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client with provided key:', err);
  }
}

// Basic server-side crisis scanning for safety enforcement
const SERVER_CRISIS_REGEX = /(انتحار|أنتحر|بنتحر|أنهي حياتي|انهي حياتي|إيذاء نفسي|ايذاء نفسي|أقتل نفسي|اقتل نفسي|هموت نفسي|suicide|commit suicide|end my life|kill myself|harm myself)/i;

/**
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cloudAIAvailable: !!aiClient,
    environment: isProduction ? 'production' : 'development'
  });
});

/**
 * Server-side Companion AI Proxy
 */
app.post('/api/companion', async (req: Request, res: Response) => {
  const { message, history, language = 'ar', contextCategory = 'weekly-session' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // 1. Enforce Server-side Crisis Interception
  if (SERVER_CRISIS_REGEX.test(message)) {
    return res.json({
      reply: language === 'ar'
        ? 'سلامتك فوق كل شيء. نرجو التواصل فوراً مع الخط الساخن للأمانة العامة للصحة النفسية (16328 بمصر) أو رقم الطوارئ (112 دولياً). نحن نهتم بك ولسنا جهة طوارئ بديلة.'
        : 'Your safety is our top priority. Please contact emergency services or a certified crisis hotline immediately.',
      isCrisis: true,
      distortionIdentified: 'أزمة طارئة تتطلب تدخلاً متخصصاً',
      socraticQuestion: undefined,
      groundingExercise: 'تمرين التنفس 4-7-8 وتثبيت القدمين على الأرض'
    });
  }

  // 2. Check if AI Client is available
  if (!aiClient) {
    return res.status(503).json({
      error: 'Cloud AI service currently unavailable. Fallback to local engine.',
      useFallback: true
    });
  }

  try {
    const isAr = language === 'ar';
    const systemInstruction = `
أنت الرفيق النفسي الذكي التابع لمبادرة «نسمة حياة: فكّر فيها».
مهمتك: الاستماع المتعاطف، التحليل الإدراكي المعتدل المستند إلى العلاج المعرفي السلوكي (CBT) وعلاج القبول والالتزام (ACT).
الأسلوب: دافئ، إنساني، داعم بدون أحكام، لغة عربية فصيحة قريبة ومفهومة (بلمسة مصرية لطيفة ومحترمة عند الحاجة).
قواعد أساسية لا تتجاوزها:
1. لا تقدم تشخيصات طبية سريرية ولا تصف أدوية.
2. إذا لاحظت نية إيذاء النفس أو أزمة حادة، حث المستخدم على طلب المساعدة الطارئة فوراً.
3. ساعد المستخدم في التعرف على الأفكار التلقائية والتشوهات المعرفية (مثل: التضخيم، التفكير الكارثي، اللوم الذاتي، التفكير المستقطب).
4. اطرح سؤالاً سقراطياً لطيفاً واحداً يساعد في إعادة صياغة الفكرة.
5. اقترح خطوة أو تمرين تأريض جسدي ملموس وبسيط (تنفس، لمس شيء، خطوة صغيرة).

يجب أن تعود بالإجابة بصيغة JSON حصراً بالشكل التالي:
{
  "reply": "الرد المتعاطف والداعم",
  "distortionIdentified": "اسم التشوه المعرفي إن وجد (مثلاً: التفكير الكارثي)",
  "socraticQuestion": "سؤال سقراطي تأملي",
  "groundingExercise": "تمرين بسيط للسكينة"
}
`;

    const chatContext = Array.isArray(history) 
      ? history.map((h: any) => `${h.sender === 'user' ? 'المستخدم' : 'الرفيق'}: ${h.text}`).join('\n')
      : '';

    const promptText = `
سياق الجلسة: ${contextCategory}
سجل المحادثة السابقة:
${chatContext}

الرسالة الحالية من المستخدم:
${message}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const outputText = response.text || '{}';
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(outputText);
    } catch {
      parsedData = {
        reply: outputText,
        distortionIdentified: undefined,
        socraticQuestion: undefined,
        groundingExercise: undefined
      };
    }

    return res.json({
      reply: parsedData.reply || (isAr ? 'أسمعك وأقدّر ما تمر به.' : 'I hear and validate your experience.'),
      distortionIdentified: parsedData.distortionIdentified,
      socraticQuestion: parsedData.socraticQuestion,
      groundingExercise: parsedData.groundingExercise
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(502).json({
      error: 'Error communicating with Gemini model. Triggering local engine fallback.',
      useFallback: true
    });
  }
});

/**
 * Server-side Weekly Session Evaluation
 */
app.post('/api/weekly-session/evaluate', async (req: Request, res: Response) => {
  const { moodRating, notes, language = 'ar' } = req.body;

  if (!aiClient) {
    return res.status(503).json({ error: 'AI unavailable', useFallback: true });
  }

  try {
    const isAr = language === 'ar';
    const prompt = `
قم بمراجعة حصاد الجلسة النفسية الأسبوعية لمستخدم مبادرة «نسمة حياة».
المستوى المزاجي العام: ${moodRating}/10
ملاحظات وتأملات الأسبوع:
${notes || 'لا توجد ملاحظات تفصيلية'}

المطلوب إعداد تقرير ختامي لطيف وبناء بصيغة JSON:
{
  "summary": "ملخص تحليلي تعاطفي للأسبوع في فقرة واحدة",
  "keyStrength": "نقطة قوة ملحوظة أو بصيص أمل في سلوك المستخدم هذا الأسبوع",
  "growthArea": "مساحة لطيفة للنمو النفسي الهادئ",
  "microHabit": "عادة يومية صغيرة جداً (دقيقة واحدة) للأسبوع القادم"
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    return res.status(500).json({ error: 'Evaluation failed', useFallback: true });
  }
});

// Setup Vite in development or serve built files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Server] Nesma Hayat backend listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
