import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up body parsing middleware
app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// AI Layout Generator Route
app.post("/api/generate-layout", async (req, res) => {
  try {
    const { text, style } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text content is required." });
    }

    const systemInstruction = `You are an expert typography designer and viral video content creator. Your goal is to analyze the input text and generate a stunning typographical video layout structure for a reel (9:16 aspect ratio).
    
    CRITICAL INSTRUCTIONS:
    1. Parse the input text into individual words or small contiguous phrases if they belong together (e.g., "Oh my God", "Wait for it"). Split maximum 1-3 words per record. Keep it mostly as single words unless small phrases look great together.
    2. Select 1 to 4 dominant (highlighted) words that convey the main emotion:
       - Give them larger sizes (multiplier 1.8 to 2.8).
       - Give them color='accent' or custom neon hexes.
       - Apply effects: glow=true, stroke=true, or shadow=true.
       - Position them with impact (often center-focused or offsets).
    3. Vary the layout based on the requested style:
       - "Instagram Viral": High contrast, bold positions, energetic, rapid durations (0.25s - 0.5s per word), pop and elastic animations, neon accents.
       - "Cinematic": Soft subtle entries (fade-in, slide-up), elegant Serif look, centered positions, slightly longer durations (0.5s - 0.9s per word), sophisticated muted colors.
       - "Minimal": Simple monospace or elegant sans-serif, steady positions, black/white/beige tones, clean simple fade, typewriter, or zoom.
       - "Motivational": Bold, extreme size difference between standard and climax words, bright orange/yellow accents, pop/bounce animations, center-heavy positioning.
       - "Sad Quotes": Dark moody gradients/colors, slow typewriter or fade-in zoom, bottom third or subtle center, slide-down animations.
       - "Love Quotes": Warm soft gradients (pinks/rose), elastic scale, slide left/right flowing text, romantic fonts.
       - "Poetry": Centered layout, vertical pacing, artistic word positions (staggered indentation), gentle typewriter/fade entries.
    4. Calculate the 'delay' (start offset in seconds) organically so words appear sequentially. Standard words appear one after another as they are read or spoken. Average speech rate is ~0.3 to 0.4 seconds per word.
    5. Choose 'fontFamily' from popular Google Fonts compatible with the category (e.g., 'Space Grotesk', 'Playfair Display', 'Inter', 'JetBrains Mono', 'Cinzel', 'Bebas Neue', 'Outfit').
    6. Ensure the result is formatted exactly according to the schema.`;

    const prompt = `Analyze and style this text snippet for a typography video.
Style preset requested: ${style || "Instagram Viral"}
Input text: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            bgColor: { type: Type.STRING, description: "Background hex color (e.g., #0B0F19, #050505, #1E1212)" },
            textColor: { type: Type.STRING, description: "Default text hex color (e.g., #FFFFFF, #EAEAEA)" },
            accentColor: { type: Type.STRING, description: "Vibrant accent hex color (e.g., #F43F5E, #10B981, #F59E0B, #06B6D4)" },
            fontFamily: { type: Type.STRING, description: "A Google Font name (e.g., Inter, Space Grotesk, Playfair Display, Cinzel, JetBrains Mono, Bebas Neue, Montserrat)" },
            gradientBg: { type: Type.BOOLEAN },
            gradientColor: { type: Type.STRING, description: "Second hex color for linear gradient if gradientBg is true" },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "The word or small phrase" },
                  size: { type: Type.NUMBER, description: "Size multiplier from 0.8 to 3.0" },
                  animation: { type: Type.STRING, description: "one of: fade-in, zoom-in, bounce, slide-up, rotate, typewriter, elastic, pop, slide-left, slide-right" },
                  color: { type: Type.STRING, description: "either 'text', 'accent', or a custom hex code" },
                  glow: { type: Type.BOOLEAN },
                  stroke: { type: Type.BOOLEAN },
                  duration: { type: Type.NUMBER, description: "duration in seconds (typically 0.3 to 0.8)" },
                  delay: { type: Type.NUMBER, description: "absolute start delay of this word in seconds from video start" },
                  positionX: { type: Type.NUMBER, description: "Horizontal content alignment percentage (e.g. 50 for center, or 20-80 for raw artistic offsets)" },
                  positionY: { type: Type.NUMBER, description: "Vertical alignment percentage (e.g. 50 for center, or 15-85 for artistic stack overlays)" }
                },
                required: ["text", "size", "animation", "color", "duration", "delay", "positionX", "positionY"]
              }
            }
          },
          required: ["bgColor", "textColor", "accentColor", "fontFamily", "words"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No output text received from Gemini API.");
    }

    const layoutData = JSON.parse(resultText);
    res.json({ success: true, data: layoutData });
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI layout" });
  }
});

// Configure Vite or Static files serving
async function setupViteServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Middlewares integrated with Vite in development mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production built folders from 'dist'.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Typography Reels Server running on port ${PORT}`);
  });
}

setupViteServer();
