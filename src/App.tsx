import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Play, Pause, RefreshCw, Scissors, Type, Trash2, HelpCircle, AudioWaveform, HelpCircle as Info, Compass, FileVideo2, Layers, Download, CheckCircle2 } from "lucide-react";
import { VideoProject, WordItem, TemplatePreset } from "./types";
import { TEMPLATES_DATA } from "./templates";
import ReelPreview from "./components/ReelPreview";
import TemplateGallery from "./components/TemplateGallery";
import TimelineTrack from "./components/TimelineTrack";
import AudioSettings from "./components/AudioSettings";
import TypographyControls from "./components/TypographyControls";
import PreviewPage from "./components/PreviewPage";

export default function App() {
  // 1. Core Project State setup
  const [project, setProject] = useState<VideoProject>({
    id: "project-default",
    title: "Viral Life Spark",
    bgColor: "#090A0F",
    textColor: "#ECEFF4",
    accentColor: "#FBBF24",
    fontFamily: "Space Grotesk",
    fontWeight: "900",
    letterSpacing: 0,
    lineSpacing: 1.2,
    alignment: "center",
    gradientBg: true,
    gradientColor: "#1E1B4B",
    aspectRatio: "9:16",
    resolution: "1080p" as any, // 1080p default
    duration: 6.0,
    fps: 30,
    audioUrl: null,
    audioName: null,
    audioVolume: 0.5,
    words: [
      { id: "word-1", text: "Don't", size: 1.2, animation: "Fade", color: "text", duration: 0.5, delay: 0.0, positionX: 50, positionY: 35 },
      { id: "word-2", text: "let", size: 1.0, animation: "Slide", color: "text", duration: 0.5, delay: 0.5, positionX: 50, positionY: 41 },
      { id: "word-3", text: "yesterday", size: 1.5, animation: "Rotate", color: "text", duration: 0.6, delay: 1.0, positionX: 50, positionY: 48 },
      { id: "word-4", text: "take", size: 1.1, animation: "Zoom", color: "text", duration: 0.5, delay: 1.6, positionX: 50, positionY: 54 },
      { id: "word-5", text: "up", size: 1.0, animation: "Bounce", color: "text", duration: 0.5, delay: 2.1, positionX: 50, positionY: 60 },
      { id: "word-6", text: "too", size: 1.0, animation: "Typewriter", color: "text", duration: 0.4, delay: 2.6, positionX: 42, positionY: 66 },
      { id: "word-7", text: "much", size: 1.2, animation: "Slide", color: "text", duration: 0.5, delay: 3.0, positionX: 58, positionY: 66 },
      { id: "word-8", text: "of", size: 0.9, animation: "Fade", color: "text", duration: 0.4, delay: 3.5, positionX: 50, positionY: 72 },
      { id: "word-9", text: "TODAY.", size: 2.8, animation: "Pop", color: "accent", glow: true, stroke: true, duration: 1.0, delay: 3.9, positionX: 50, positionY: 50 }
    ],
  });

  // 2. Playback and routing state engine
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<string>("Don't let yesterday take up too much of TODAY.");
  const [selectedStylePreset, setSelectedStylePreset] = useState<string>("Instagram Viral");
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);

  const animationFrameId = useRef<number | null>(null);
  const playStartTime = useRef<number>(0);
  const currentAccumTime = useRef<number>(0);

  // Synchronization with browser routing and back buttons
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigateToPreview = () => {
    setIsPlaying(false);
    window.history.pushState({}, "", "/preview");
    setCurrentPath("/preview");
  };

  const handleBackToEditor = () => {
    window.history.pushState({}, "", "/");
    setCurrentPath("/");
  };

  // Synchronization timeline progress loops
  useEffect(() => {
    if (isPlaying) {
      playStartTime.current = performance.now();
      currentAccumTime.current = currentTime;

      const updateProgress = () => {
        const elapsed = (performance.now() - playStartTime.current) / 1000;
        const totalTime = currentAccumTime.current + elapsed;

        if (totalTime >= project.duration) {
          setIsPlaying(false);
          setCurrentTime(0);
        } else {
          setCurrentTime(totalTime);
          animationFrameId.current = requestAnimationFrame(updateProgress);
        }
      };
      
      animationFrameId.current = requestAnimationFrame(updateProgress);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimeUpdate = (newTime: number) => {
    setIsPlaying(false);
    setCurrentTime(newTime);
  };

  // Helper: auto split inputs into visual layout words (Dynamic auto formatting)
  const handleSplitInputText = () => {
    if (!textInput.trim()) return;

    // Use space boundaries
    const tokens = textInput.split(/\s+/).filter(Boolean);
    const splitWords: WordItem[] = tokens.map((token, index) => {
      // Find matches for capitalized emphasis strings e.g. "TODAY", "TUMHARA"
      const isEmphasized = token === token.toUpperCase() && token.length > 2;
      
      return {
        id: `word-gen-${index}-${Date.now()}`,
        text: token,
        size: isEmphasized ? 2.5 : 1.3,
        animation: isEmphasized ? "Pop" : "Slide",
        color: isEmphasized ? "accent" : "text",
        glow: isEmphasized,
        stroke: isEmphasized,
        duration: 0.5,
        delay: index * 0.45,
        positionX: 50,
        positionY: isEmphasized ? 50 : Math.max(10, Math.min(90, 25 + (index * 50) / Math.max(1, tokens.length))), // staggered vertical stack
      };
    });

    const calculatedLength = Math.max(5, Math.ceil(splitWords.length * 0.45 + 1.5));

    setProject((prev) => ({
      ...prev,
      words: splitWords,
      duration: calculatedLength,
    }));

    handleReset();
  };

  // Helper 2: auto split inputs into clause sentences or phrases
  const handleSplitInputSentences = () => {
    if (!textInput.trim()) return;

    // Split by common sentence/punctuation boundaries (commas, periods, question marks, exclamation words, etc.)
    const clauses = textInput.split(/[,.?!;|]\s*|\n+/).map(s => s.trim()).filter(Boolean);
    const splitWords: WordItem[] = clauses.map((clause, index) => {
      const isEmphasized = clause === clause.toUpperCase() && clause.length > 4;

      return {
        id: `word-clause-${index}-${Date.now()}`,
        text: clause,
        size: isEmphasized ? 2.5 : 1.4,
        animation: isEmphasized ? "Bounce" : "Fade",
        color: isEmphasized ? "accent" : "text",
        glow: isEmphasized,
        stroke: isEmphasized,
        duration: Math.max(1.0, Math.min(2.5, clause.split(/\s+/).length * 0.45)),
        delay: index * 1.6,
        positionX: 50,
        positionY: 50,
      };
    });

    const calculatedLength = Math.max(5, Math.ceil(splitWords.length * 1.6 + 1.2));

    setProject((prev) => ({
      ...prev,
      words: splitWords,
      duration: calculatedLength,
    }));

    handleReset();
  };

  // AI Layout query using server-side Gemini 3.5 proxy
  const handleAiLayoutGenerate = async () => {
    if (!textInput.trim()) return;
    setAiGenerating(true);

    try {
      const response = await fetch("/api/generate-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textInput,
          style: selectedStylePreset,
        }),
      });

      const json = await response.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || "Failed loading response data.");
      }

      const generated = json.data;

      // Map back to strict visual schema
      const mappedWords: WordItem[] = generated.words.map((item: any, idx: number) => ({
        id: `word-ai-${idx}-${Date.now()}`,
        text: item.text,
        size: item.size || 1.2,
        animation: item.animation || "slide-up",
        color: item.color || "text",
        glow: item.glow || false,
        stroke: item.stroke || false,
        shadow: true,
        duration: item.duration || 0.5,
        delay: item.delay || idx * 0.45,
        positionX: item.positionX || 50,
        positionY: item.positionY || (30 + (idx * 50) / generated.words.length),
      }));

      // Find max delay to organically update video duration bounds
      const lastWord = mappedWords[mappedWords.length - 1];
      const maxTime = lastWord ? lastWord.delay + lastWord.duration + 1.0 : 6.0;

      setProject((prev) => ({
        ...prev,
        fontFamily: generated.fontFamily || prev.fontFamily,
        bgColor: generated.bgColor || prev.bgColor,
        textColor: generated.textColor || prev.textColor,
        accentColor: generated.accentColor || prev.accentColor,
        gradientBg: generated.gradientBg || false,
        gradientColor: generated.gradientColor || prev.gradientColor,
        words: mappedWords,
        duration: Math.max(5, Math.round(maxTime)),
      }));

      handleReset();
    } catch (e: any) {
      console.error(e);
      alert(`AI layout generation issue: ${e.message || "Failed API response."}`);
    } finally {
      setAiGenerating(false);
    }
  };

  // Preset templates selection
  const handleSelectTemplate = (template: TemplatePreset) => {
    const hasCustomText = textInput.trim() && textInput !== "Don't let yesterday take up too much of TODAY.";
    
    let formattedWords: WordItem[];
    if (hasCustomText) {
      // Split user's textInput into designed words styled with this template's fonts, colors and default animation
      const tokens = textInput.split(/\s+/).filter(Boolean);
      formattedWords = tokens.map((token, index) => {
        // Upper case is auto-highlighted
        const isEmphasized = token === token.toUpperCase() && token.length > 2;
        return {
          id: `word-tpl-${index}-${Date.now()}`,
          text: token,
          size: isEmphasized ? 2.5 : 1.3,
          animation: isEmphasized ? "Pop" : template.words[0]?.animation || "Fade",
          color: isEmphasized ? "accent" : "text",
          glow: isEmphasized,
          stroke: isEmphasized,
          shadow: true,
          duration: 0.5,
          delay: index * 0.45,
          positionX: 50,
          positionY: isEmphasized ? 50 : Math.max(10, Math.min(90, 25 + (index * 50) / Math.max(1, tokens.length))),
        };
      });
    } else {
      // Use pre-baked beautiful preset words
      formattedWords = template.words.map((w, index) => ({
        ...w,
        id: `word-tpl-${index}-${Date.now()}`,
      }));
      // Set the textInput textarea to the preset words concatenated together
      setTextInput(template.words.map(w => w.text).join(" "));
    }

    const calculatedDuration = formattedWords.length > 0 
      ? Math.ceil(formattedWords[formattedWords.length - 1].delay + formattedWords[formattedWords.length - 1].duration + 1)
      : 6.0;

    setProject({
      id: `project-preset-${template.id}`,
      title: template.name,
      bgColor: template.bgColor,
      textColor: template.textColor,
      accentColor: template.accentColor,
      fontFamily: template.fontFamily,
      fontWeight: template.fontWeight,
      letterSpacing: 0,
      lineSpacing: 1.2,
      alignment: template.alignment,
      gradientBg: template.gradientBg,
      gradientColor: template.gradientColor,
      aspectRatio: template.aspectRatio,
      resolution: "1080p",
      duration: Math.max(5, calculatedDuration),
      fps: 30,
      audioUrl: project.audioUrl,
      audioName: project.audioName,
      audioVolume: project.audioVolume,
      words: formattedWords,
    });

    handleReset();
  };

  // Direct word property overrides
  const handleUpdateWord = (id: string, updated: Partial<WordItem>) => {
    setProject((prev) => ({
      ...prev,
      words: prev.words.map((w) => (w.id === id ? { ...w, ...updated } : w)),
    }));
  };

  const handleUpdateWordPosition = (id: string, x: number, y: number) => {
    handleUpdateWord(id, { positionX: x, positionY: y });
  };

  const handleAddWord = (text: string) => {
    // Append the element on-time sequentially
    const lastWord = project.words[project.words.length - 1];
    const delayOfLast = lastWord ? lastWord.delay + 0.5 : 0;
    
    const newWord: WordItem = {
      id: `word-added-${Date.now()}`,
      text,
      size: 1.2,
      animation: "fade-in",
      color: "text",
      duration: 0.5,
      delay: parseFloat(delayOfLast.toFixed(2)),
      positionX: 50,
      positionY: 50,
    };

    setProject((prev) => ({
      ...prev,
      words: [...prev.words, newWord],
      duration: Math.max(prev.duration, Math.ceil(delayOfLast + 1.5)),
    }));
  };

  const handleDeleteWord = (id: string) => {
    setProject((prev) => ({
      ...prev,
      words: prev.words.filter((w) => w.id !== id),
    }));
    if (selectedWordId === id) {
      setSelectedWordId(null);
    }
  };

  const handleUpdateProjectSetting = (updated: Partial<VideoProject>) => {
    setProject((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  if (currentPath === "/preview") {
    return <PreviewPage project={project} onBackToEditor={handleBackToEditor} />;
  }

  // Define our 7 high-fidelity interactive workflow steps
  const workflowSteps = [
    { number: 1, label: "Paste Script" },
    { number: 2, label: "Select Template" },
    { number: 3, label: "Choose Font" },
    { number: 4, label: "Choose Background Color" },
    { number: 5, label: "Generate Video" },
    { number: 6, label: "Preview Video" },
    { number: 7, label: "Download Video" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 flex flex-col font-sans transition-colors duration-300">
      {/* SaaS Dashboard Title Header */}
      <header className="border-b border-white/10 bg-[#0d0d0f]/90 backdrop-blur-md sticky top-0 z-40 flex flex-col md:flex-row items-center justify-between px-6 py-3.5 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            <FileVideo2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white uppercase flex items-center gap-2">
              Viral Typography <span className="text-indigo-400">Maker</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
              Pro Studio Workspace
            </p>
          </div>
        </div>

        {/* 7 Workflow steps dashboard tracking widget */}
        <div className="hidden xl:flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-full px-4">
          {workflowSteps.map((step, idx) => {
            return (
              <React.Fragment key={step.number}>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step.number <= 5 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10" 
                      : "bg-white/10 text-gray-400"
                  }`}>
                    {step.number}
                  </div>
                  <span className={`text-[10px] font-bold ${
                    step.number <= 5 ? "text-gray-200" : "text-gray-500"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <span className="text-gray-600 text-[10px]">➔</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* AI Branding badge */}
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
          <button
            onClick={navigateToPreview}
            className="py-1.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md shadow-emerald-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Workflow Preview & Export</span>
          </button>
          
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] font-bold text-indigo-300">Gemini 3.5</span>
          </div>
        </div>
      </header>

      {/* Main Sandbox Workspace Area */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 h-full max-w-7xl mx-auto w-full">
        {/* Left Side: Layout Inputs feeds and tools (Span 5) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* A. Creative Raw Paragraph Editor */}
          <div className="bg-[#0d0d0f] border border-white/10 p-5 rounded-2xl flex flex-col gap-3.5 w-full shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-400" />
                Raw Quote Script Text
              </span>
              <span className="text-[10px] text-gray-500 font-bold">Auto formatting active</span>
            </div>

            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste dialogue, lyrics or quote here... Emphasize key words with CAPITAL LETTERS to automatically trigger dominant visual scales!"
              className="w-full h-24 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans resize-none transition-all scrollbar-none"
            />

            {/* Split controls and AI generator triggers */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleSplitInputText}
                className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all text-center cursor-pointer"
              >
                <Scissors className="w-3 h-3 text-gray-400" />
                <span>Auto-Split Words</span>
              </button>

              <button
                onClick={handleSplitInputSentences}
                className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all text-center cursor-pointer"
              >
                <Layers className="w-3 h-3 text-gray-400" />
                <span>Auto-Split Sentences</span>
              </button>

              <div className="flex-1 flex gap-1.5">
                <select
                  value={selectedStylePreset}
                  onChange={(e) => setSelectedStylePreset(e.target.value)}
                  className="bg-[#0a0a0b] border border-white/10 text-[10px] font-bold px-2 rounded-lg text-gray-300 focus:outline-none focus:border-indigo-500 h-9 flex-1"
                >
                  <option value="Instagram Viral">Viral Style</option>
                  <option value="Cinematic">Cinematic</option>
                  <option value="Minimal">Minimal Slate</option>
                  <option value="Motivational">Motivational</option>
                  <option value="Sad Quotes">Sad Moody</option>
                  <option value="Love Quotes">Love Warmth</option>
                  <option value="Poetry">Artistic Poetry</option>
                </select>

                <button
                  onClick={handleAiLayoutGenerate}
                  disabled={aiGenerating || !textInput.trim()}
                  className="py-1 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-40 shadow-lg shadow-indigo-500/20 cursor-pointer"
                >
                  {aiGenerating ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Writing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                      <span>AI Script Fill</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* B. Preset Template gallery picker */}
          <TemplateGallery onSelectTemplate={handleSelectTemplate} />

          {/* C. Soundtrack Synchronization panels */}
          <AudioSettings project={project} onUpdateProject={handleUpdateProjectSetting} />
        </section>

        {/* Center Side: Viewport Live Player Simulator (Span 4) */}
        <section className="lg:col-span-4 flex flex-col items-center justify-center gap-6">
          <ReelPreview
            project={project}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onTimeUpdate={handleTimeUpdate}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            selectedWordId={selectedWordId}
            onSelectWord={setSelectedWordId}
            onUpdateWordPosition={handleUpdateWordPosition}
          />
        </section>

        {/* Right Side: Timeline timing tracks and parameters options (Span 3) */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          {/* Standard layout parameters controls panel */}
          <TypographyControls
            project={project}
            onUpdateProject={handleUpdateProjectSetting}
            selectedWordId={selectedWordId}
            onUpdateWord={handleUpdateWord}
          />
        </section>
      </main>

      {/* Bottom Row Span across layout: Word Timeline synchronization map */}
      <footer className="px-6 pb-8 pt-2 w-full max-w-7xl mx-auto">
        <TimelineTrack
          project={project}
          currentTime={currentTime}
          selectedWordId={selectedWordId}
          onSelectWord={setSelectedWordId}
          onUpdateWord={handleUpdateWord}
          onAddWord={handleAddWord}
          onDeleteWord={handleDeleteWord}
        />
      </footer>
    </div>
  );
}
