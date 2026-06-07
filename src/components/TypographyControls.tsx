import React from "react";
import { Sliders, Type, Palette, Video, RotateCcw, AlertCircle, Sparkles, Check, LayoutGrid, ListFilter } from "lucide-react";
import { VideoProject, WordItem, AspectRatio, Resolution, TextAlignment, FontWeight } from "../types";

interface TypographyControlsProps {
  project: VideoProject;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
  selectedWordId: string | null;
  onUpdateWord: (id: string, updated: Partial<WordItem>) => void;
}

export default function TypographyControls({
  project,
  onUpdateProject,
  selectedWordId,
  onUpdateWord,
}: TypographyControlsProps) {
  const bgInputRef = React.useRef<HTMLInputElement>(null);

  // Supported fonts lists dynamically loaded in index.css
  const GOOGLE_FONTS = [
    "Inter",
    "Space Grotesk",
    "Playfair Display",
    "Cinzel",
    "JetBrains Mono",
    "Bebas Neue",
    "Outfit",
    "Montserrat",
    "Bricolage Grotesque"
  ];

  const FONT_WEIGHTS: { value: FontWeight; label: string }[] = [
    { value: "100", label: "Thin (100)" },
    { value: "300", label: "Light (300)" },
    { value: "400", label: "Regular (400)" },
    { value: "500", label: "Medium (500)" },
    { value: "600", label: "Semi-Bold (600)" },
    { value: "700", label: "Bold (700)" },
    { value: "900", label: "Extra-Bold (900)" },
  ];

  const ANIMATIONS = [
    { value: "Fade", label: "Fade" },
    { value: "Zoom", label: "Zoom" },
    { value: "Bounce", label: "Bounce" },
    { value: "Pop", label: "Pop" },
    { value: "Rotate", label: "Rotate" },
    { value: "Slide", label: "Slide" },
    { value: "Typewriter", label: "Typewriter" },
    { value: "Scale", label: "Scale" },
    { value: "Elastic", label: "Elastic" },
  ];

  // Retrieve the selected word parameters to show inspector overrides
  const selectedWord = project.words.find((w) => w.id === selectedWordId);

  return (
    <div className="flex flex-col gap-5 bg-[#0d0d0f] border border-white/10 p-5 rounded-2xl w-full">
      {/* 1. Global Project specifications (Ratio, Res, Duration) */}
      <div>
        <div className="flex items-center gap-2 mb-3.5">
          <Video className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-gray-200 font-sans">Video Canvas Setup</h3>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Aspect Ratio picker */}
          <div>
            <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
              Aspect Ratio
            </label>
            <select
              value={project.aspectRatio}
              onChange={(e) => onUpdateProject({ aspectRatio: e.target.value as AspectRatio })}
              className="w-full px-3 py-1.5 bg-[#0a0a0b] border border-white/10 rounded-lg text-xs font-semibold text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="9:16">9:16 Reels / Shorts</option>
              <option value="16:9">16:9 YouTube</option>
              <option value="1:1">1:1 Square</option>
            </select>
          </div>

          {/* Resolution selector */}
          <div>
            <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
              Export Quality
            </label>
            <select
              value={project.resolution}
              onChange={(e) => onUpdateProject({ resolution: e.target.value as Resolution })}
              className="w-full px-3 py-1.5 bg-[#0a0a0b] border border-white/10 rounded-lg text-xs font-semibold text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="720p">720p HD Ready</option>
              <option value="1080p">1080p Full HD</option>
              <option value="2K">2K Quad HD</option>
              <option value="4K">4K Ultra HD</option>
            </select>
          </div>

          {/* Limit duration in clip length */}
          <div>
            <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
              Duration Limits
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={project.duration}
              onChange={(e) => onUpdateProject({ duration: Math.max(1, parseInt(e.target.value) || 5) })}
              className="w-full px-3 py-1.5 bg-[#0a0a0b] border border-white/10 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* FPS toggle option */}
          <div>
            <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
              Timeline FPS
            </label>
            <div className="flex bg-[#0a0a0b] border border-white/10 p-0.5 rounded-lg">
              <button
                onClick={() => onUpdateProject({ fps: 30 })}
                className={`flex-1 py-1 text-[10px] font-bold rounded cursor-pointer ${
                  project.fps === 30 ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                30 FPS
              </button>
              <button
                onClick={() => onUpdateProject({ fps: 60 })}
                className={`flex-1 py-1 text-[10px] font-bold rounded cursor-pointer ${
                  project.fps === 60 ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                60 FPS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Global design parameters (Fonts & spacings) */}
      <div className="border-t border-white/10 pt-4.5">
        <div className="flex items-center gap-2 mb-3.5">
          <Type className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-gray-200 font-sans">Global Typography</h3>
        </div>

        <div className="flex flex-col gap-3">
          {/* Font Family Option */}
          <div>
            <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
              Font Family
            </label>
            <select
              value={project.fontFamily}
              onChange={(e) => onUpdateProject({ fontFamily: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#0a0a0b] border border-white/10 rounded-lg text-xs font-semibold text-gray-200 focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
              style={{ fontFamily: project.fontFamily }}
            >
              {GOOGLE_FONTS.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Core weights alignment */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
                Font Weight
              </label>
              <select
                value={project.fontWeight}
                onChange={(e) => onUpdateProject({ fontWeight: e.target.value as FontWeight })}
                className="w-full px-3 py-1.5 bg-[#0a0a0b] border border-white/10 rounded-lg text-xs font-semibold text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {FONT_WEIGHTS.map((fw) => (
                  <option key={fw.value} value={fw.value}>
                    {fw.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
                Alignment
              </label>
              <div className="flex bg-[#0a0a0b] border border-white/10 p-0.5 rounded-lg text-xs h-8">
                {(["left", "center", "right"] as TextAlignment[]).map((align) => (
                  <button
                    key={align}
                    onClick={() => onUpdateProject({ alignment: align })}
                    className={`flex-1 font-mono font-bold text-[9px] rounded uppercase cursor-pointer ${
                      project.alignment === align
                        ? "bg-indigo-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Letter and Line Spacing */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
                Letter spacing ({project.letterSpacing}px)
              </label>
              <input
                type="range"
                min={-3}
                max={15}
                value={project.letterSpacing}
                onChange={(e) => onUpdateProject({ letterSpacing: parseInt(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
                Line spacing ({project.lineSpacing}x)
              </label>
              <input
                type="range"
                min={0.8}
                max={2.5}
                step={0.1}
                value={project.lineSpacing}
                onChange={(e) => onUpdateProject({ lineSpacing: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Color configuration section (Theme backdrop gradients) */}
      <div className="border-t border-white/10 pt-4.5">
        <div className="flex items-center gap-2 mb-3.5">
          <Palette className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-gray-200 font-sans">Visual Palette</h3>
        </div>

        <div className="flex flex-col gap-3">
          {/* Main specifically named Choose Background Color trigger button */}
          <button
            onClick={() => bgInputRef.current?.click()}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-505 hover:to-purple-505 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-center shadow-lg shadow-indigo-500/15"
          >
            <Palette className="w-4 h-4 text-indigo-100" />
            <span>Choose Background Color</span>
          </button>
          
          <input
            ref={bgInputRef}
            type="color"
            value={project.bgColor}
            onChange={(e) => onUpdateProject({ bgColor: e.target.value })}
            className="hidden"
          />

          {/* Solid vs Gradient Switch */}
          <div className="grid grid-cols-2 gap-2 bg-[#0a0a0b] p-1 border border-white/10 rounded-xl">
            <button
              onClick={() => onUpdateProject({ gradientBg: false })}
              className={`py-1.5 text-[10px] font-bold rounded-lg cursor-pointer ${
                !project.gradientBg ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Solid Color
            </button>
            <button
              onClick={() => onUpdateProject({ gradientBg: true })}
              className={`py-1.5 text-[10px] font-bold rounded-lg cursor-pointer ${
                project.gradientBg ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Gradient Backdrop
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] text-gray-400 font-bold block mb-1 uppercase tracking-wider text-center font-mono">
                Primary Text
              </label>
              <div className="flex items-center gap-1.5 bg-[#0a0a0b] border border-white/10 p-1.5 rounded-lg justify-center">
                <input
                  type="color"
                  value={project.textColor}
                  onChange={(e) => onUpdateProject({ textColor: e.target.value })}
                  className="w-4.5 h-4.5 cursor-pointer border-0 rounded bg-transparent"
                />
                <span className="text-[9px] font-mono font-bold select-all uppercase">
                  {project.textColor.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[8px] text-gray-400 font-bold block mb-1 uppercase tracking-wider text-center font-mono">
                Accent High
              </label>
              <div className="flex items-center gap-1.5 bg-[#0a0a0b] border border-white/10 p-1.5 rounded-lg justify-center">
                <input
                  type="color"
                  value={project.accentColor}
                  onChange={(e) => onUpdateProject({ accentColor: e.target.value })}
                  className="w-4.5 h-4.5 cursor-pointer border-0 rounded bg-transparent"
                />
                <span className="text-[9px] font-mono font-bold select-all uppercase">
                  {project.accentColor.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {project.gradientBg && (
            <div className="bg-[#0a0a0b] border border-white/5 p-3 rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-mono uppercase font-bold">Secondary Gradient Color</span>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-lg">
                  <input
                    type="color"
                    value={project.gradientColor}
                    onChange={(e) => onUpdateProject({ gradientColor: e.target.value })}
                    className="w-4 h-4 cursor-pointer rounded bg-transparent border-0"
                  />
                  <span className="text-[10px] font-mono text-gray-300">{project.gradientColor.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Active Word Inspector properties override */}
      {selectedWord ? (
        <div className="border-t border-indigo-500/30 bg-indigo-500/5 -mx-5 px-5 -mb-5 pb-5 rounded-b-2xl">
          <div className="flex items-center gap-2 mb-3 mt-4">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-gray-200 font-sans">Word Design Overrides</h3>
          </div>

          {/* Selected word label text indicator */}
          <div className="text-[10px] text-gray-400 uppercase font-bold mb-3 bg-[#0a0a0b] px-3 py-1.5 rounded-lg flex items-center justify-between border border-white/10">
            <span>Focused Segment:</span>
            <span className="font-mono text-indigo-400 normal-case italic font-extrabold text-xs">
              "{selectedWord.text}"
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Custom word-specific animations */}
            <div>
              <label className="text-[9px] text-gray-400 font-bold block mb-1 font-mono">
                TRANSITION MOTION
              </label>
              <select
                value={selectedWord.animation}
                onChange={(e) => onUpdateWord(selectedWord.id, { animation: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#0a0a0b] border border-white/10 rounded-lg text-xs font-semibold text-gray-200 focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
              >
                {ANIMATIONS.map((anim) => (
                  <option key={anim.value} value={anim.value}>
                    {anim.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sizes Multipliers slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] text-gray-400 font-bold font-mono">
                  SCALE RATIO
                </label>
                <span className="text-[10px] font-mono text-indigo-400 font-bold">{selectedWord.size}x</span>
              </div>
              <input
                type="range"
                min={0.6}
                max={4.0}
                step={0.1}
                value={selectedWord.size}
                onChange={(e) => onUpdateWord(selectedWord.id, { size: parseFloat(e.target.value) })}
                className="w-full h-1 bg-[#0a0a0b] rounded-lg cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Coloring buttons overrides */}
            <div>
              <label className="text-[9px] text-gray-400 font-bold block mb-1.5 font-mono">
                THEME HIGHLIGHT
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#0a0a0b] p-0.5 rounded-lg border border-white/10">
                <button
                  onClick={() => onUpdateWord(selectedWord.id, { color: "text" })}
                  className={`py-1 text-[9px] font-bold rounded cursor-pointer ${
                    selectedWord.color === "text" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => onUpdateWord(selectedWord.id, { color: "accent" })}
                  className={`py-1 text-[9px] font-bold rounded cursor-pointer ${
                    selectedWord.color === "accent" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Accent
                </button>
                <button
                  onClick={() => {
                    const customHex = prompt("Enter custom Color HEX (e.g. #FF00FF):", "#F43F5E");
                    if (customHex) onUpdateWord(selectedWord.id, { color: customHex });
                  }}
                  className={`py-1 text-[9px] font-bold rounded truncate cursor-pointer ${
                    selectedWord.color !== "text" && selectedWord.color !== "accent"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {selectedWord.color !== "text" && selectedWord.color !== "accent" ? selectedWord.color : "Custom..."}
                </button>
              </div>
            </div>

            {/* Effects checklists (glow, contours and outlines) */}
            <div className="grid grid-cols-3 gap-2">
              {/* Neon Glow Toggle */}
              <button
                onClick={() => onUpdateWord(selectedWord.id, { glow: !selectedWord.glow })}
                className={`py-1.5 rounded-lg text-[9px] font-bold border transition-all text-center cursor-pointer ${
                  selectedWord.glow
                    ? "bg-yellow-500/15 border-yellow-500/55 text-yellow-300"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Glow Aura
              </button>

              {/* Stroke Contour toggle */}
              <button
                onClick={() => onUpdateWord(selectedWord.id, { stroke: !selectedWord.stroke })}
                className={`py-1.5 rounded-lg text-[9px] font-bold border transition-all text-center cursor-pointer ${
                  selectedWord.stroke
                    ? "bg-rose-500/15 border-rose-500/55 text-rose-300"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Stroke Outer
              </button>

              {/* Shadow effect */}
              <button
                onClick={() => onUpdateWord(selectedWord.id, { shadow: !selectedWord.shadow })}
                className={`py-1.5 rounded-lg text-[9px] font-bold border transition-all text-center cursor-pointer ${
                  selectedWord.shadow
                    ? "bg-indigo-500/15 border-indigo-500/55 text-indigo-300"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Drop Shadow
              </button>
            </div>

            {/* Custom Positions override input controls */}
            <div className="grid grid-cols-2 gap-3 pb-1 pt-1">
              <div>
                <label className="text-[9px] text-gray-400 font-bold block mb-1 font-mono">X POSITION %</label>
                <input
                  type="number"
                  min={5}
                  max={95}
                  value={selectedWord.positionX}
                  onChange={(e) => onUpdateWord(selectedWord.id, { positionX: Math.max(5, Math.min(95, parseInt(e.target.value) || 50)) })}
                  className="w-full px-2 py-1 bg-[#0a0a0b] border border-white/10 rounded font-mono text-[11px] text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[9px] text-gray-400 font-bold block mb-1 font-mono">Y POSITION %</label>
                <input
                  type="number"
                  min={5}
                  max={95}
                  value={selectedWord.positionY}
                  onChange={(e) => onUpdateWord(selectedWord.id, { positionY: Math.max(5, Math.min(95, parseInt(e.target.value) || 50)) })}
                  className="w-full px-2 py-1 bg-[#0a0a0b] border border-white/10 rounded font-mono text-[11px] text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center gap-1.5">
          <AlertCircle className="w-5 h-5 text-gray-500" />
          <h4 className="text-xs font-bold text-gray-300">Style Inspector</h4>
          <p className="text-[10px] text-gray-500 max-w-[180px] font-medium leading-relaxed">
            Drag words around the canvas direct, or click words in the timeline list to unlock specific color & motion overrides!
          </p>
        </div>
      )}
    </div>
  );
}
