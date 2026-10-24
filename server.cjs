var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_genai = require("@google/genai");
import_dotenv.default.config();
process.env.DISABLE_HMR = "true";
var app = (0, import_express.default)();
var PORT = process.env.PORT || 3e3;
var isProduction = process.env.NODE_ENV === "production";
app.use(import_express.default.json({ limit: "1mb" }));
var aiClient = null;
var apiKey = process.env.GEMINI_API_KEY;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new import_genai.GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn("Could not initialize GoogleGenAI client with provided key:", err);
  }
}
var SERVER_CRISIS_REGEX = /(انتحار|أنتحر|بنتحر|أنهي حياتي|انهي حياتي|إيذاء نفسي|ايذاء نفسي|أقتل نفسي|اقتل نفسي|هموت نفسي|suicide|commit suicide|end my life|kill myself|harm myself)/i;
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    cloudAIAvailable: !!aiClient,
    environment: isProduction ? "production" : "development"
  });
});
app.post("/api/companion", async (req, res) => {
  const { message, history, language = "ar", contextCategory = "weekly-session" } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }
  if (SERVER_CRISIS_REGEX.test(message)) {
    return res.json({
      reply: language === "ar" ? "\u0633\u0644\u0627\u0645\u062A\u0643 \u0641\u0648\u0642 \u0643\u0644 \u0634\u064A\u0621. \u0646\u0631\u062C\u0648 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0641\u0648\u0631\u0627\u064B \u0645\u0639 \u0627\u0644\u062E\u0637 \u0627\u0644\u0633\u0627\u062E\u0646 \u0644\u0644\u0623\u0645\u0627\u0646\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u0644\u0644\u0635\u062D\u0629 \u0627\u0644\u0646\u0641\u0633\u064A\u0629 (16328 \u0628\u0645\u0635\u0631) \u0623\u0648 \u0631\u0642\u0645 \u0627\u0644\u0637\u0648\u0627\u0631\u0626 (112 \u062F\u0648\u0644\u064A\u0627\u064B). \u0646\u062D\u0646 \u0646\u0647\u062A\u0645 \u0628\u0643 \u0648\u0644\u0633\u0646\u0627 \u062C\u0647\u0629 \u0637\u0648\u0627\u0631\u0626 \u0628\u062F\u064A\u0644\u0629." : "Your safety is our top priority. Please contact emergency services or a certified crisis hotline immediately.",
      isCrisis: true,
      distortionIdentified: "\u0623\u0632\u0645\u0629 \u0637\u0627\u0631\u0626\u0629 \u062A\u062A\u0637\u0644\u0628 \u062A\u062F\u062E\u0644\u0627\u064B \u0645\u062A\u062E\u0635\u0635\u0627\u064B",
      socraticQuestion: void 0,
      groundingExercise: "\u062A\u0645\u0631\u064A\u0646 \u0627\u0644\u062A\u0646\u0641\u0633 4-7-8 \u0648\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0631\u0636"
    });
  }
  if (!aiClient) {
    return res.status(503).json({
      error: "Cloud AI service currently unavailable. Fallback to local engine.",
      useFallback: true
    });
  }
  try {
    const isAr = language === "ar";
    const systemInstruction = `
\u0623\u0646\u062A \u0627\u0644\u0631\u0641\u064A\u0642 \u0627\u0644\u0646\u0641\u0633\u064A \u0627\u0644\u0630\u0643\u064A \u0627\u0644\u062A\u0627\u0628\u0639 \u0644\u0645\u0628\u0627\u062F\u0631\u0629 \xAB\u0646\u0633\u0645\u0629 \u062D\u064A\u0627\u0629: \u0641\u0643\u0651\u0631 \u0641\u064A\u0647\u0627\xBB.
\u0645\u0647\u0645\u062A\u0643: \u0627\u0644\u0627\u0633\u062A\u0645\u0627\u0639 \u0627\u0644\u0645\u062A\u0639\u0627\u0637\u0641\u060C \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0625\u062F\u0631\u0627\u0643\u064A \u0627\u0644\u0645\u0639\u062A\u062F\u0644 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0625\u0644\u0649 \u0627\u0644\u0639\u0644\u0627\u062C \u0627\u0644\u0645\u0639\u0631\u0641\u064A \u0627\u0644\u0633\u0644\u0648\u0643\u064A (CBT) \u0648\u0639\u0644\u0627\u062C \u0627\u0644\u0642\u0628\u0648\u0644 \u0648\u0627\u0644\u0627\u0644\u062A\u0632\u0627\u0645 (ACT).
\u0627\u0644\u0623\u0633\u0644\u0648\u0628: \u062F\u0627\u0641\u0626\u060C \u0625\u0646\u0633\u0627\u0646\u064A\u060C \u062F\u0627\u0639\u0645 \u0628\u062F\u0648\u0646 \u0623\u062D\u0643\u0627\u0645\u060C \u0644\u063A\u0629 \u0639\u0631\u0628\u064A\u0629 \u0641\u0635\u064A\u062D\u0629 \u0642\u0631\u064A\u0628\u0629 \u0648\u0645\u0641\u0647\u0648\u0645\u0629 (\u0628\u0644\u0645\u0633\u0629 \u0645\u0635\u0631\u064A\u0629 \u0644\u0637\u064A\u0641\u0629 \u0648\u0645\u062D\u062A\u0631\u0645\u0629 \u0639\u0646\u062F \u0627\u0644\u062D\u0627\u062C\u0629).
\u0642\u0648\u0627\u0639\u062F \u0623\u0633\u0627\u0633\u064A\u0629 \u0644\u0627 \u062A\u062A\u062C\u0627\u0648\u0632\u0647\u0627:
1. \u0644\u0627 \u062A\u0642\u062F\u0645 \u062A\u0634\u062E\u064A\u0635\u0627\u062A \u0637\u0628\u064A\u0629 \u0633\u0631\u064A\u0631\u064A\u0629 \u0648\u0644\u0627 \u062A\u0635\u0641 \u0623\u062F\u0648\u064A\u0629.
2. \u0625\u0630\u0627 \u0644\u0627\u062D\u0638\u062A \u0646\u064A\u0629 \u0625\u064A\u0630\u0627\u0621 \u0627\u0644\u0646\u0641\u0633 \u0623\u0648 \u0623\u0632\u0645\u0629 \u062D\u0627\u062F\u0629\u060C \u062D\u062B \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0639\u0644\u0649 \u0637\u0644\u0628 \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0627\u0644\u0637\u0627\u0631\u0626\u0629 \u0641\u0648\u0631\u0627\u064B.
3. \u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0641\u064A \u0627\u0644\u062A\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0641\u0643\u0627\u0631 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A\u0629 \u0648\u0627\u0644\u062A\u0634\u0648\u0647\u0627\u062A \u0627\u0644\u0645\u0639\u0631\u0641\u064A\u0629 (\u0645\u062B\u0644: \u0627\u0644\u062A\u0636\u062E\u064A\u0645\u060C \u0627\u0644\u062A\u0641\u0643\u064A\u0631 \u0627\u0644\u0643\u0627\u0631\u062B\u064A\u060C \u0627\u0644\u0644\u0648\u0645 \u0627\u0644\u0630\u0627\u062A\u064A\u060C \u0627\u0644\u062A\u0641\u0643\u064A\u0631 \u0627\u0644\u0645\u0633\u062A\u0642\u0637\u0628).
4. \u0627\u0637\u0631\u062D \u0633\u0624\u0627\u0644\u0627\u064B \u0633\u0642\u0631\u0627\u0637\u064A\u0627\u064B \u0644\u0637\u064A\u0641\u0627\u064B \u0648\u0627\u062D\u062F\u0627\u064B \u064A\u0633\u0627\u0639\u062F \u0641\u064A \u0625\u0639\u0627\u062F\u0629 \u0635\u064A\u0627\u063A\u0629 \u0627\u0644\u0641\u0643\u0631\u0629.
5. \u0627\u0642\u062A\u0631\u062D \u062E\u0637\u0648\u0629 \u0623\u0648 \u062A\u0645\u0631\u064A\u0646 \u062A\u0623\u0631\u064A\u0636 \u062C\u0633\u062F\u064A \u0645\u0644\u0645\u0648\u0633 \u0648\u0628\u0633\u064A\u0637 (\u062A\u0646\u0641\u0633\u060C \u0644\u0645\u0633 \u0634\u064A\u0621\u060C \u062E\u0637\u0648\u0629 \u0635\u063A\u064A\u0631\u0629).

\u064A\u062C\u0628 \u0623\u0646 \u062A\u0639\u0648\u062F \u0628\u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0628\u0635\u064A\u063A\u0629 JSON \u062D\u0635\u0631\u0627\u064B \u0628\u0627\u0644\u0634\u0643\u0644 \u0627\u0644\u062A\u0627\u0644\u064A:
{
  "reply": "\u0627\u0644\u0631\u062F \u0627\u0644\u0645\u062A\u0639\u0627\u0637\u0641 \u0648\u0627\u0644\u062F\u0627\u0639\u0645",
  "distortionIdentified": "\u0627\u0633\u0645 \u0627\u0644\u062A\u0634\u0648\u0647 \u0627\u0644\u0645\u0639\u0631\u0641\u064A \u0625\u0646 \u0648\u062C\u062F (\u0645\u062B\u0644\u0627\u064B: \u0627\u0644\u062A\u0641\u0643\u064A\u0631 \u0627\u0644\u0643\u0627\u0631\u062B\u064A)",
  "socraticQuestion": "\u0633\u0624\u0627\u0644 \u0633\u0642\u0631\u0627\u0637\u064A \u062A\u0623\u0645\u0644\u064A",
  "groundingExercise": "\u062A\u0645\u0631\u064A\u0646 \u0628\u0633\u064A\u0637 \u0644\u0644\u0633\u0643\u064A\u0646\u0629"
}
`;
    const chatContext = Array.isArray(history) ? history.map((h) => `${h.sender === "user" ? "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645" : "\u0627\u0644\u0631\u0641\u064A\u0642"}: ${h.text}`).join("\n") : "";
    const promptText = `
\u0633\u064A\u0627\u0642 \u0627\u0644\u062C\u0644\u0633\u0629: ${contextCategory}
\u0633\u062C\u0644 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629:
${chatContext}

\u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0645\u0646 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645:
${message}
`;
    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });
    const outputText = response.text || "{}";
    let parsedData = {};
    try {
      parsedData = JSON.parse(outputText);
    } catch {
      parsedData = {
        reply: outputText,
        distortionIdentified: void 0,
        socraticQuestion: void 0,
        groundingExercise: void 0
      };
    }
    return res.json({
      reply: parsedData.reply || (isAr ? "\u0623\u0633\u0645\u0639\u0643 \u0648\u0623\u0642\u062F\u0651\u0631 \u0645\u0627 \u062A\u0645\u0631 \u0628\u0647." : "I hear and validate your experience."),
      distortionIdentified: parsedData.distortionIdentified,
      socraticQuestion: parsedData.socraticQuestion,
      groundingExercise: parsedData.groundingExercise
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(502).json({
      error: "Error communicating with Gemini model. Triggering local engine fallback.",
      useFallback: true
    });
  }
});
app.post("/api/weekly-session/evaluate", async (req, res) => {
  const { moodRating, notes, language = "ar" } = req.body;
  if (!aiClient) {
    return res.status(503).json({ error: "AI unavailable", useFallback: true });
  }
  try {
    const isAr = language === "ar";
    const prompt = `
\u0642\u0645 \u0628\u0645\u0631\u0627\u062C\u0639\u0629 \u062D\u0635\u0627\u062F \u0627\u0644\u062C\u0644\u0633\u0629 \u0627\u0644\u0646\u0641\u0633\u064A\u0629 \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A\u0629 \u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0645\u0628\u0627\u062F\u0631\u0629 \xAB\u0646\u0633\u0645\u0629 \u062D\u064A\u0627\u0629\xBB.
\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0645\u0632\u0627\u062C\u064A \u0627\u0644\u0639\u0627\u0645: ${moodRating}/10
\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0648\u062A\u0623\u0645\u0644\u0627\u062A \u0627\u0644\u0623\u0633\u0628\u0648\u0639:
${notes || "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0644\u0627\u062D\u0638\u0627\u062A \u062A\u0641\u0635\u064A\u0644\u064A\u0629"}

\u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0625\u0639\u062F\u0627\u062F \u062A\u0642\u0631\u064A\u0631 \u062E\u062A\u0627\u0645\u064A \u0644\u0637\u064A\u0641 \u0648\u0628\u0646\u0627\u0621 \u0628\u0635\u064A\u063A\u0629 JSON:
{
  "summary": "\u0645\u0644\u062E\u0635 \u062A\u062D\u0644\u064A\u0644\u064A \u062A\u0639\u0627\u0637\u0641\u064A \u0644\u0644\u0623\u0633\u0628\u0648\u0639 \u0641\u064A \u0641\u0642\u0631\u0629 \u0648\u0627\u062D\u062F\u0629",
  "keyStrength": "\u0646\u0642\u0637\u0629 \u0642\u0648\u0629 \u0645\u0644\u062D\u0648\u0638\u0629 \u0623\u0648 \u0628\u0635\u064A\u0635 \u0623\u0645\u0644 \u0641\u064A \u0633\u0644\u0648\u0643 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639",
  "growthArea": "\u0645\u0633\u0627\u062D\u0629 \u0644\u0637\u064A\u0641\u0629 \u0644\u0644\u0646\u0645\u0648 \u0627\u0644\u0646\u0641\u0633\u064A \u0627\u0644\u0647\u0627\u062F\u0626",
  "microHabit": "\u0639\u0627\u062F\u0629 \u064A\u0648\u0645\u064A\u0629 \u0635\u063A\u064A\u0631\u0629 \u062C\u062F\u0627\u064B (\u062F\u0642\u064A\u0642\u0629 \u0648\u0627\u062D\u062F\u0629) \u0644\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u0642\u0627\u062F\u0645"
}
`;
    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Evaluation failed", useFallback: true });
  }
});
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.resolve(process.cwd(), "dist");
    if (import_fs.default.existsSync(distPath)) {
      app.use(
        import_express.default.static(distPath, {
          setHeaders: (res, filePath) => {
            const baseName = import_path.default.basename(filePath);
            if (baseName === "index.html" || baseName === "sw.js" || baseName === "registerSW.js" || baseName === "manifest.webmanifest" || baseName === "manifest.json" || baseName === "fakkerfeha-dist.zip") {
              res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
              res.setHeader("Pragma", "no-cache");
              res.setHeader("Expires", "0");
            } else if (filePath.includes(`${import_path.default.sep}assets${import_path.default.sep}`)) {
              res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
            }
          }
        })
      );
      app.get("*", (req, res) => {
        if (req.path.startsWith("/api/") || req.path.startsWith("/assets/") || req.path.startsWith("/images/") || /\.[a-zA-Z0-9]+$/.test(req.path)) {
          return res.status(404).end();
        }
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        return res.sendFile(import_path.default.resolve(distPath, "index.html"));
      });
    }
  }
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`[Server] Nesma Hayat backend listening on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
