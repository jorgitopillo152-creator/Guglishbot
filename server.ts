import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Initialize Gemini AI client safely
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API endpoint for sentence analysis
  app.post("/api/analyze-sentence", async (req, res) => {
    try {
      const { sentence } = req.body;
      if (!sentence || typeof sentence !== "string" || sentence.trim().length === 0) {
        return res.status(400).json({ error: "Please provide a valid English sentence." });
      }

      const ai = getAI();
      const prompt = `Analyze the following English sentence from an English language learner:
"${sentence.trim()}"

Provide a detailed analysis following this structure:
1. Detect CEFR level (A1, A2, B1, B2, C1, or C2) and give a brief description of the sentence complexity.
2. Check if the sentence is grammatically correct.
3. Provide the corrected sentence with proper punctuation and grammar.
4. Tokenize the original sentence into individual words/tokens and mark which ones contain errors (isError: true for words with spelling, grammar, tense, or word choice errors).
5. Explain each grammar change clearly with both English and Spanish explanations ("explanationEn" and "explanationEs").
6. Provide EXACTLY 3 alternative phrasings that keep the same core meaning but use synonyms or different sentence structures (e.g. Natural/Idiomatic, Formal/Professional, Casual/Conversational).
7. Provide a concise, encouraging overall tip ("overallTip").`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cefrLevel: {
                type: Type.STRING,
                description: "CEFR level: A1, A2, B1, B2, C1, or C2",
              },
              cefrDescription: {
                type: Type.STRING,
                description: "Short explanation of the sentence complexity level",
              },
              isCorrect: {
                type: Type.BOOLEAN,
                description: "True if the original sentence had no grammar or spelling errors",
              },
              correctedSentence: {
                type: Type.STRING,
                description: "The fully corrected English sentence",
              },
              wordTokens: {
                type: Type.ARRAY,
                description: "Word-by-word breakdown of the original sentence indicating errors",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    isError: { type: Type.BOOLEAN },
                    suggestion: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                  required: ["word", "isError"],
                },
              },
              explanations: {
                type: Type.ARRAY,
                description: "List of corrections explaining what changed and why in English and Spanish",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    originalPart: { type: Type.STRING },
                    correctedPart: { type: Type.STRING },
                    explanationEn: { type: Type.STRING },
                    explanationEs: { type: Type.STRING },
                  },
                  required: ["originalPart", "correctedPart", "explanationEn", "explanationEs"],
                },
              },
              alternatives: {
                type: Type.ARRAY,
                description: "EXACTLY 3 alternative ways to say the same sentence using synonyms",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sentence: { type: Type.STRING },
                    label: { type: Type.STRING },
                    synonymsUsed: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    explanation: { type: Type.STRING },
                  },
                  required: ["sentence", "label", "synonymsUsed", "explanation"],
                },
              },
              overallTip: {
                type: Type.STRING,
                description: "A short, helpful learning tip",
              },
            },
            required: [
              "cefrLevel",
              "cefrDescription",
              "isCorrect",
              "correctedSentence",
              "wordTokens",
              "explanations",
              "alternatives",
              "overallTip",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response returned from Gemini API");
      }

      const parsed = JSON.parse(responseText);
      const result = {
        id: "analysis_" + Date.now(),
        timestamp: Date.now(),
        originalSentence: sentence.trim(),
        ...parsed,
      };

      res.json(result);
    } catch (err: any) {
      console.error("Error analyzing sentence:", err);
      res.status(500).json({
        error: err.message || "Failed to analyze sentence. Please try again.",
      });
    }
  });

  // Vite middleware for dev, static files for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
