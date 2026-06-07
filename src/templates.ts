import { TemplatePreset } from "./types";

// The 12 custom design presets matching exactly the user requested styles
export const TEMPLATES_DATA: TemplatePreset[] = [
  // 1. Viral Instagram Style
  {
    id: "insta-viral-gold",
    name: "Golden Hour Climax",
    category: "Viral Instagram",
    bgColor: "#090A0E",
    textColor: "#ECEFF4",
    accentColor: "#FBBF24",
    fontFamily: "Space Grotesk",
    fontWeight: "900",
    gradientBg: true,
    gradientColor: "#1E1B4B",
    aspectRatio: "9:16",
    alignment: "center",
    sampleText: "Don't let yesterday take up too much of TODAY.",
    words: [
      { text: "Don't", size: 1.2, animation: "Fade", color: "text", duration: 0.4, delay: 0.0, positionX: 50, positionY: 40 },
      { text: "let", size: 1.0, animation: "Slide", color: "text", duration: 0.4, delay: 0.4, positionX: 50, positionY: 46 },
      { text: "yesterday", size: 1.5, animation: "Rotate", color: "text", duration: 0.5, delay: 0.8, positionX: 50, positionY: 52 },
      { text: "take", size: 1.1, animation: "Zoom", color: "text", duration: 0.4, delay: 1.3, positionX: 50, positionY: 58 },
      { text: "up", size: 1.0, animation: "Bounce", color: "text", duration: 0.4, delay: 1.7, positionX: 50, positionY: 64 },
      { text: "too", size: 1.0, animation: "Typewriter", color: "text", duration: 0.3, delay: 2.1, positionX: 42, positionY: 70 },
      { text: "much", size: 1.2, animation: "Slide", color: "text", duration: 0.4, delay: 2.4, positionX: 58, positionY: 70 },
      { text: "of", size: 0.9, animation: "Fade", color: "text", duration: 0.3, delay: 2.8, positionX: 50, positionY: 76 },
      { text: "TODAY.", size: 2.6, animation: "Pop", color: "accent", glow: true, stroke: true, duration: 0.8, delay: 3.1, positionX: 50, positionY: 50 }
    ]
  },
  // 2. Love Status Style
  {
    id: "love-status-heart",
    name: "Heartbeats Slow",
    category: "Love Status",
    bgColor: "#1A0912",
    textColor: "#FFF1F2",
    accentColor: "#F43F5E",
    fontFamily: "Montserrat",
    fontWeight: "700",
    gradientBg: true,
    gradientColor: "#4C0519",
    aspectRatio: "9:16",
    alignment: "center",
    sampleText: "You are MY TODAY and all of my tomorrows.",
    words: [
      { text: "You", size: 1.4, animation: "Elastic", color: "text", duration: 0.6, delay: 0.0, positionX: 50, positionY: 38 },
      { text: "are", size: 1.1, animation: "Fade", color: "text", duration: 0.4, delay: 0.6, positionX: 50, positionY: 44 },
      { text: "MY", size: 2.2, animation: "Pop", color: "accent", glow: true, duration: 0.6, delay: 1.0, positionX: 50, positionY: 50 },
      { text: "TODAY", size: 2.5, animation: "Scale", color: "accent", glow: true, duration: 0.8, delay: 1.6, positionX: 50, positionY: 50 },
      { text: "and", size: 1.0, animation: "Fade", color: "text", duration: 0.4, delay: 2.4, positionX: 50, positionY: 58 },
      { text: "all", size: 1.1, animation: "Slide", color: "text", duration: 0.4, delay: 2.8, positionX: 50, positionY: 64 },
      { text: "of", size: 1.0, animation: "Fade", color: "text", duration: 0.3, delay: 3.2, positionX: 50, positionY: 70 },
      { text: "my", size: 1.1, animation: "Slide", color: "text", duration: 0.4, delay: 3.5, positionX: 50, positionY: 76 },
      { text: "tomorrows.", size: 2.4, animation: "Bounce", color: "accent", glow: true, duration: 0.9, delay: 3.9, positionX: 50, positionY: 50 }
    ]
  },
  // 3. Sad Status Style
  {
    id: "sad-status-rain",
    name: "Fading Tears",
    category: "Sad Status",
    bgColor: "#070E1B",
    textColor: "#9CA3AF",
    accentColor: "#38BDF8",
    fontFamily: "Cinzel",
    fontWeight: "300",
    gradientBg: true,
    gradientColor: "#02040A",
    aspectRatio: "9:16",
    alignment: "center",
    sampleText: "Some MEMORIES are too painful to remember.",
    words: [
      { text: "Some", size: 1.1, animation: "Fade", color: "text", duration: 0.8, delay: 0.0, positionX: 50, positionY: 38 },
      { text: "MEMORIES", size: 2.2, animation: "Zoom", color: "accent", stroke: true, duration: 1.0, delay: 0.8, positionX: 50, positionY: 48 },
      { text: "are", size: 1.0, animation: "Fade", color: "text", duration: 0.6, delay: 1.8, positionX: 50, positionY: 54 },
      { text: "too", size: 1.1, animation: "Slide", color: "text", duration: 0.6, delay: 2.4, positionX: 50, positionY: 60 },
      { text: "painful", size: 1.8, animation: "Slide", color: "text", duration: 0.8, delay: 3.0, positionX: 50, positionY: 66 },
      { text: "to", size: 1.0, animation: "Fade", color: "text", duration: 0.5, delay: 3.8, positionX: 50, positionY: 72 },
      { text: "remember.", size: 2.2, animation: "Fade", color: "accent", glow: true, duration: 1.2, delay: 4.3, positionX: 50, positionY: 50 }
    ]
  },
  // 4. Motivational Style
  {
    id: "motivational-beast",
    name: "Beast Mode Grind",
    category: "Motivational",
    bgColor: "#050505",
    textColor: "#FFFFFF",
    accentColor: "#F59E0B",
    fontFamily: "Bebas Neue",
    fontWeight: "900",
    gradientBg: true,
    gradientColor: "#451A03",
    aspectRatio: "9:16",
    alignment: "center",
    sampleText: "UNSTOPPABLE force cannot be defeated ever.",
    words: [
      { text: "UNSTOPPABLE", size: 2.9, animation: "Pop", color: "accent", glow: true, stroke: true, duration: 0.6, delay: 0.0, positionX: 50, positionY: 50 },
      { text: "force", size: 1.5, animation: "Slide", color: "text", duration: 0.4, delay: 0.6, positionX: 50, positionY: 40 },
      { text: "cannot", size: 1.2, animation: "Fade", color: "text", duration: 0.4, delay: 1.0, positionX: 50, positionY: 46 },
      { text: "be", size: 1.0, animation: "Fade", color: "text", duration: 0.3, delay: 1.4, positionX: 50, positionY: 52 },
      { text: "defeated", size: 1.8, animation: "Bounce", color: "text", duration: 0.6, delay: 1.7, positionX: 50, positionY: 58 },
      { text: "ever.", size: 2.4, animation: "Scale", color: "accent", stroke: true, duration: 0.7, delay: 2.3, positionX: 50, positionY: 64 }
    ]
  },
  // 5. Poetry Style
  {
    id: "poetry-ink",
    name: "Artistic Echoes",
    category: "Poetry",
    bgColor: "#FCFAF2",
    textColor: "#27272A",
    accentColor: "#991B1B",
    fontFamily: "Playfair Display",
    fontWeight: "400",
    gradientBg: false,
    gradientColor: "#F5EFE6",
    aspectRatio: "9:16",
    alignment: "left",
    sampleText: "Words carve the SILENT oceans of memory.",
    words: [
      { text: "Words", size: 1.5, animation: "Typewriter", color: "text", duration: 0.8, delay: 0.0, positionX: 30, positionY: 35 },
      { text: "carve", size: 1.3, animation: "Fade", color: "text", duration: 0.6, delay: 1.0, positionX: 30, positionY: 43 },
      { text: "the", size: 1.0, animation: "Fade", color: "text", duration: 0.4, delay: 1.6, positionX: 30, positionY: 50 },
      { text: "SILENT", size: 2.1, animation: "Zoom", color: "accent", duration: 1.0, delay: 2.0, positionX: 30, positionY: 58 },
      { text: "oceans", size: 1.6, animation: "Slide", color: "text", duration: 0.8, delay: 3.0, positionX: 30, positionY: 66 },
      { text: "of", size: 1.1, animation: "Fade", color: "text", duration: 0.4, delay: 3.8, positionX: 30, positionY: 72 },
      { text: "memory.", size: 2.2, animation: "Zoom", color: "text", duration: 1.0, delay: 4.2, positionX: 30, positionY: 78 }
    ]
  },
  // 6. Cinematic Style
  {
    id: "cinema-epic",
    name: "Classic Widescreen",
    category: "Cinematic",
    bgColor: "#080708",
    textColor: "#ECEBEC",
    accentColor: "#C5A880",
    fontFamily: "Playfair Display",
    fontWeight: "300",
    gradientBg: true,
    gradientColor: "#1B1717",
    aspectRatio: "16:9",
    alignment: "center",
    sampleText: "We loved with a dynamic love.",
    words: [
      { text: "We", size: 1.4, animation: "Fade", color: "text", duration: 0.8, delay: 0.0, positionX: 50, positionY: 50 },
      { text: "loved", size: 2.2, animation: "Zoom", color: "accent", duration: 1.0, delay: 0.8, positionX: 50, positionY: 50 },
      { text: "with", size: 1.2, animation: "Fade", color: "text", duration: 0.6, delay: 1.8, positionX: 50, positionY: 50 },
      { text: "a", size: 1.0, animation: "Fade", color: "text", duration: 0.5, delay: 2.4, positionX: 50, positionY: 50 },
      { text: "dynamic", size: 2.4, animation: "Scale", color: "accent", glow: true, duration: 1.0, delay: 2.9, positionX: 50, positionY: 48 },
      { text: "love.", size: 2.6, animation: "Elastic", color: "accent", duration: 1.2, delay: 3.9, positionX: 50, positionY: 50 }
    ]
  },
  // 7. Attitude Style
  {
    id: "attitude-fire",
    name: "Unmatched Power",
    category: "Attitude",
    bgColor: "#030304",
    textColor: "#E2E8F0",
    accentColor: "#EF4444",
    fontFamily: "Outfit",
    fontWeight: "900",
    gradientBg: true,
    gradientColor: "#581C87",
    aspectRatio: "9:16",
    alignment: "center",
    sampleText: "Born to RULE, not to fit in.",
    words: [
      { text: "Born", size: 1.5, animation: "Pop", color: "text", duration: 0.4, delay: 0.0, positionX: 50, positionY: 38 },
      { text: "to", size: 1.1, animation: "Fade", color: "text", duration: 0.3, delay: 0.4, positionX: 50, positionY: 44 },
      { text: "RULE,", size: 2.8, animation: "Bounce", color: "accent", glow: true, stroke: true, duration: 0.8, delay: 0.7, positionX: 50, positionY: 50 },
      { text: "not", size: 1.2, animation: "Slide", color: "text", duration: 0.4, delay: 1.5, positionX: 50, positionY: 58 },
      { text: "to", size: 1.0, animation: "Fade", color: "text", duration: 0.3, delay: 1.9, positionX: 50, positionY: 64 },
      { text: "fit", size: 1.4, animation: "Zoom", color: "text", duration: 0.4, delay: 2.2, positionX: 50, positionY: 70 },
      { text: "in.", size: 2.5, animation: "Pop", color: "accent", glow: true, duration: 0.7, delay: 2.6, positionX: 50, positionY: 50 }
    ]
  },
  // 8. Shayari Style
  {
    id: "shayari-royal",
    name: "Golden Urdu Poetry",
    category: "Shayari",
    bgColor: "#0B0F19",
    textColor: "#FFFBEB",
    accentColor: "#D97706",
    fontFamily: "Cinzel",
    fontWeight: "700",
    gradientBg: true,
    gradientColor: "#451A03",
    aspectRatio: "9:16",
    alignment: "center",
    sampleText: "Khamosh labon par CHAHAT hasi banke aati hai.",
    words: [
      { text: "Khamosh", size: 1.4, animation: "Typewriter", color: "text", duration: 0.8, delay: 0.0, positionX: 50, positionY: 36 },
      { text: "labon", size: 1.3, animation: "Fade", color: "text", duration: 0.6, delay: 0.8, positionX: 50, positionY: 42 },
      { text: "par", size: 1.0, animation: "Fade", color: "text", duration: 0.4, delay: 1.4, positionX: 50, positionY: 48 },
      { text: "CHAHAT", size: 2.5, animation: "Pop", color: "accent", glow: true, stroke: true, duration: 1.0, delay: 1.8, positionX: 50, positionY: 50 },
      { text: "hasi", size: 1.5, animation: "Scale", color: "text", duration: 0.7, delay: 2.8, positionX: 50, positionY: 56 },
      { text: "banke", size: 1.2, animation: "Slide", color: "text", duration: 0.5, delay: 3.5, positionX: 50, positionY: 62 },
      { text: "aati", size: 1.1, animation: "Fade", color: "text", duration: 0.4, delay: 4.0, positionX: 50, positionY: 68 },
      { text: "hai.", size: 2.0, animation: "Zoom", color: "accent", duration: 0.9, delay: 4.4, positionX: 50, positionY: 50 }
    ]
  },
  // 9. Modern Typography Style
  {
    id: "modern-tech",
    name: "Offset Alignment",
    category: "Modern Typography",
    bgColor: "#0d0d0f",
    textColor: "#38BDF8",
    accentColor: "#EC4899",
    fontFamily: "Space Grotesk",
    fontWeight: "900",
    gradientBg: false,
    gradientColor: "#1A202C",
    aspectRatio: "9:16",
    alignment: "left",
    sampleText: "Break boundaries overwrite future parameters now.",
    words: [
      { text: "Break", size: 1.6, animation: "Rotate", color: "accent", duration: 0.5, delay: 0.0, positionX: 25, positionY: 30 },
      { text: "boundaries", size: 2.0, animation: "Scale", color: "text", duration: 0.6, delay: 0.5, positionX: 30, positionY: 40 },
      { text: "overwrite", size: 1.4, animation: "Slide", color: "text", duration: 0.4, delay: 1.1, positionX: 25, positionY: 50 },
      { text: "future", size: 1.8, animation: "Pop", color: "accent", glow: true, duration: 0.5, delay: 1.5, positionX: 40, positionY: 60 },
      { text: "parameters", size: 2.2, animation: "Scale", color: "text", duration: 0.7, delay: 2.0, positionX: 30, positionY: 70 },
      { text: "now.", size: 2.8, animation: "Elastic", color: "accent", stroke: true, duration: 0.8, delay: 2.7, positionX: 50, positionY: 50 }
    ]
  },
  // 10. Minimal Style
  {
    id: "minimal-clean",
    name: "Muted Aesthetics",
    category: "Minimal",
    bgColor: "#FAF9F6",
    textColor: "#1D1D1F",
    accentColor: "#6B7280",
    fontFamily: "Inter",
    fontWeight: "400",
    gradientBg: false,
    gradientColor: "#F4F4F5",
    aspectRatio: "1:1",
    alignment: "center",
    sampleText: "Simplicity is nature's beautiful response.",
    words: [
      { text: "Simplicity", size: 1.8, animation: "Typewriter", color: "text", duration: 0.8, delay: 0.0, positionX: 50, positionY: 42 },
      { text: "is", size: 1.0, animation: "Fade", color: "text", duration: 0.4, delay: 0.8, positionX: 50, positionY: 50 },
      { text: "nature's", size: 1.5, animation: "Fade", color: "accent", duration: 0.6, delay: 1.2, positionX: 50, positionY: 56 },
      { text: "beautiful", size: 1.6, animation: "Scale", color: "text", duration: 0.7, delay: 1.8, positionX: 50, positionY: 64 },
      { text: "response.", size: 2.0, animation: "Zoom", color: "text", duration: 0.9, delay: 2.5, positionX: 50, positionY: 50 }
    ]
  },
  // 11. Luxury Style
  {
    id: "luxury-gold",
    name: "Champagne Royale",
    category: "Luxury",
    bgColor: "#0E0D0C",
    textColor: "#EDECE8",
    accentColor: "#D4AF37",
    fontFamily: "Cinzel",
    fontWeight: "700",
    gradientBg: true,
    gradientColor: "#050403",
    aspectRatio: "9:16",
    alignment: "center",
    sampleText: "True luxury lies in the SILENT details.",
    words: [
      { text: "True", size: 1.3, animation: "Fade", color: "text", duration: 0.7, delay: 0.0, positionX: 50, positionY: 38 },
      { text: "luxury", size: 2.2, animation: "Zoom", color: "accent", glow: true, duration: 1.0, delay: 0.7, positionX: 50, positionY: 46 },
      { text: "lies", size: 1.1, animation: "Fade", color: "text", duration: 0.5, delay: 1.7, positionX: 50, positionY: 53 },
      { text: "in", size: 0.9, animation: "Fade", color: "text", duration: 0.4, delay: 2.2, positionX: 50, positionY: 59 },
      { text: "the", size: 1.0, animation: "Fade", color: "text", duration: 0.4, delay: 2.6, positionX: 50, positionY: 65 },
      { text: "SILENT", size: 2.3, animation: "Pop", color: "accent", glow: true, stroke: true, duration: 0.8, delay: 3.0, positionX: 50, positionY: 50 },
      { text: "details.", size: 2.0, animation: "Zoom", color: "text", duration: 0.9, delay: 3.8, positionX: 50, positionY: 58 }
    ]
  },
  // 12. Neon Style
  {
    id: "neon-cyberpunk",
    name: "Electric Cyber Grid",
    category: "Neon",
    bgColor: "#05000A",
    textColor: "#00FFF0",
    accentColor: "#FF007F",
    fontFamily: "JetBrains Mono",
    fontWeight: "900",
    gradientBg: true,
    gradientColor: "#2D004D",
    aspectRatio: "9:16",
    alignment: "center",
    sampleText: "SYNC your core coordinates to LIGHTSPEED.",
    words: [
      { text: "SYNC", size: 2.2, animation: "Pop", color: "text", glow: true, stroke: true, duration: 0.5, delay: 0.0, positionX: 50, positionY: 40 },
      { text: "your", size: 1.1, animation: "Fade", color: "text", duration: 0.4, delay: 0.5, positionX: 50, positionY: 46 },
      { text: "core", size: 1.3, animation: "Slide", color: "text", duration: 0.4, delay: 0.9, positionX: 50, positionY: 52 },
      { text: "coordinates", size: 1.5, animation: "Typewriter", color: "text", duration: 0.6, delay: 1.3, positionX: 50, positionY: 58 },
      { text: "to", size: 1.0, animation: "Fade", color: "text", duration: 0.3, delay: 1.9, positionX: 50, positionY: 64 },
      { text: "LIGHTSPEED.", size: 2.8, animation: "Elastic", color: "accent", glow: true, stroke: true, duration: 0.8, delay: 2.2, positionX: 50, positionY: 50 }
    ]
  }
];

// Dynamically generate the remaining presets to total 50+ templates!
// We'll create distinct entries categorized into the 12 requested genres
const CATEGORIES = [
  "Viral Instagram", "Love Status", "Sad Status", "Motivational", "Poetry", 
  "Cinematic", "Attitude", "Shayari", "Modern Typography", "Minimal", "Luxury", "Neon"
];

const GOOGLE_FONTS = [
  "Inter", "Space Grotesk", "Playfair Display", "Cinzel", "JetBrains Mono", "Bebas Neue", "Outfit", "Montserrat", "Bricolage Grotesque"
];

const PALETTES = [
  { bg: "#0d0a14", text: "#e2e8f0", accent: "#a855f7", grad: "#3b0764", isGrad: true },
  { bg: "#0f172a", text: "#f8fafc", accent: "#10b981", grad: "#020617", isGrad: true },
  { bg: "#050505", text: "#ffffff", accent: "#fbbf24", grad: "#451a03", isGrad: true },
  { bg: "#1e1e1e", text: "#e2e8f0", accent: "#f43f5e", grad: "#000000", isGrad: true },
  { bg: "#f3f4f6", text: "#111827", accent: "#4f46e5", grad: "#e5e7eb", isGrad: false },
  { bg: "#090d16", text: "#cbd5e1", accent: "#22d3ee", grad: "#161b22", isGrad: true },
];

const ANIMATIONS = ["Fade", "Zoom", "Bounce", "Pop", "Rotate", "Slide", "Typewriter", "Scale", "Elastic"];

const PHRASES = [
  "Dream BIG and dare to FAIL.",
  "Never look back unless it's to LEARN.",
  "Your potential is truly LIMITLESS.",
  "Build in SILENCE, celebrate in SHADOWS.",
  "Do it with PASSION or not at all.",
  "Chasing HIGHS while ignoring the lows.",
  "Nothing lasts forever, make it COUNT.",
  "Every soul craves dynamic HARMONY.",
  "Be standard, be rare, be UNSTOPPABLE.",
  "Stars shine brightest in total DARKNESS."
];

// Loop to populate up to 55 professional templates
for (let i = TEMPLATES_DATA.length; i < 55; i++) {
  const category = CATEGORIES[i % CATEGORIES.length];
  const phrase = PHRASES[i % PHRASES.length];
  const colors = PALETTES[i % PALETTES.length];
  const font = GOOGLE_FONTS[i % GOOGLE_FONTS.length];
  
  const rawWords = phrase.split(" ");
  const wordItems = rawWords.map((word, index) => {
    // Determine dominant item (highlighted)
    const isDominant = word === word.toUpperCase() && word.length > 2;
    return {
      text: word,
      size: isDominant ? 2.2 : 1.1,
      animation: ANIMATIONS[(index + i) % ANIMATIONS.length],
      color: isDominant ? "accent" : "text",
      glow: isDominant,
      stroke: isDominant ? Math.random() > 0.5 : false,
      shadow: true,
      duration: 0.5,
      delay: index * 0.45,
      positionX: 50,
      positionY: 30 + (index * 45) / Math.max(1, rawWords.length)
    };
  });

  TEMPLATES_DATA.push({
    id: `dynamic-${i}`,
    name: `${category} Premium v${Math.floor(i / CATEGORIES.length) + 1}`,
    category: category as any,
    bgColor: colors.bg,
    textColor: colors.text,
    accentColor: colors.accent,
    fontFamily: font,
    fontWeight: (i % 2 === 0 ? "900" : "400") as any,
    gradientBg: colors.isGrad,
    gradientColor: colors.grad,
    aspectRatio: i % 3 === 0 ? "16:9" : i % 4 === 0 ? "1:1" : "9:16",
    alignment: "center",
    sampleText: phrase,
    words: wordItems
  });
}
