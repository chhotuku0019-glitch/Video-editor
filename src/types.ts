export type AspectRatio = "9:16" | "16:9" | "1:1";
export type Resolution = "720p" | "1080p" | "2K" | "4K";
export type TextAlignment = "left" | "center" | "right";
export type FontWeight = "100" | "300" | "400" | "500" | "600" | "700" | "900";

export interface WordItem {
  id: string;
  text: string;
  size: number; // e.g. 0.8 to 4.0 multiplier
  animation: string; // 'fade-in' | 'zoom-in' | 'bounce' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'rotate' | 'typewriter' | 'elastic' | 'pop'
  color: string; // 'text' | 'accent' | custom hex like '#F43F5E'
  glow?: boolean;
  stroke?: boolean;
  shadow?: boolean;
  duration: number; // in seconds
  delay: number; // accumulated display delay in seconds from project start
  positionX: number; // 0-100% boundary coordinates
  positionY: number; // 0-100% boundary coordinates
}

export interface VideoProject {
  id: string;
  title: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  fontWeight: FontWeight;
  letterSpacing: number; // px unit offset
  lineSpacing: number; // standard multiplier multiplier
  alignment: TextAlignment;
  gradientBg: boolean;
  gradientColor: string;
  words: WordItem[];
  aspectRatio: AspectRatio;
  resolution: Resolution;
  duration: number; // project overall length in seconds
  fps: 30 | 60;
  audioUrl: string | null;
  audioName: string | null;
  audioVolume: number;
}

export interface TemplatePreset {
  id: string;
  name: string;
  category: "Viral Instagram" | "Love Status" | "Sad Status" | "Motivational" | "Poetry" | "Cinematic" | "Attitude" | "Shayari" | "Modern Typography" | "Minimal" | "Luxury" | "Neon";
  bgColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  fontWeight: FontWeight;
  gradientBg: boolean;
  gradientColor: string;
  aspectRatio: AspectRatio;
  alignment: TextAlignment;
  sampleText: string;
  words: Omit<WordItem, "id">[];
}
