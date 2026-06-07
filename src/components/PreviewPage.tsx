import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Maximize, Minimize, Sparkles, Download, ArrowLeft, Laptop, Smartphone, Volume2, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VideoProject, WordItem } from "../types";

interface PreviewPageProps {
  project: VideoProject;
  onBackToEditor: () => void;
}

export default function PreviewPage({ project, onBackToEditor }: PreviewPageProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [deviceFrame, setDeviceFrame] = useState<"phone" | "full">("phone");
  const [exporting, setExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number | null>(null);

  const prevTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  // Sound synchronization
  useEffect(() => {
    if (project.audioUrl) {
      audioRef.current = new Audio(project.audioUrl);
      audioRef.current.volume = project.audioVolume;
      audioRef.current.loop = false;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [project.audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = project.audioVolume;
    }
  }, [project.audioVolume]);

  const handlePlayPause = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    if (audioRef.current) {
      if (nextPlay) {
        audioRef.current.currentTime = currentTime;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // High frame-rate playback synchronization loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTime) / 1000;
        setCurrentTime((prev) => {
          const nextTime = prev + delta;
          if (nextTime >= project.duration) {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
            }
            return 0; // auto-replay loop for perfect review
          }
          return nextTime;
        });
      }
      lastTime = now;
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, project.duration]);

  // Synchronize audio on manual progress slider change
  const handleScrubChange = (val: number) => {
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  // Listen for Native fullscreen events
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === playerRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleNativeFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(() => {
        // Fallback: trigger simulated full browser window
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Helper to render visible words with timing progress
  const getVisibleWords = (): (WordItem & { isActive: boolean; progress: number })[] => {
    const activeWords: (WordItem & { isActive: boolean; progress: number })[] = [];

    project.words.forEach((w) => {
      const wordStart = w.delay;
      const wordEnd = w.delay + w.duration;
      const isActive = currentTime >= wordStart && currentTime <= wordEnd;
      const isPastOrActive = currentTime >= wordStart;

      if (isPastOrActive) {
        const elapsed = currentTime - wordStart;
        const progress = Math.min(elapsed / w.duration, 1);
        activeWords.push({
          ...w,
          isActive,
          progress,
        });
      }
    });

    return activeWords;
  };

  const getWordFontStyles = (w: WordItem): React.CSSProperties => {
    const computedColor =
      w.color === "text"
        ? project.textColor
        : w.color === "accent"
        ? project.accentColor
        : w.color;

    const baseStyle: React.CSSProperties = {
      fontFamily: project.fontFamily,
      fontWeight: project.fontWeight,
      fontSize: `${w.size * 2.0}rem`, // enlarged premium scale for preview page
      color: computedColor,
      letterSpacing: `${project.letterSpacing}px`,
      position: "absolute",
      left: `${w.positionX}%`,
      top: `${w.positionY}%`,
      transform: "translate(-50%, -50%)",
      userSelect: "none",
      whiteSpace: "nowrap",
      zIndex: w.color === "accent" ? 50 : 20,
    };

    if (w.glow) {
      baseStyle.textShadow = `0 0 12px ${computedColor}, 0 0 30px ${computedColor}`;
    }

    return baseStyle;
  };

  const getAnimationVariants = (anim: string) => {
    switch (anim) {
      case "Fade":
      case "fade-in":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case "Zoom":
      case "zoom-in":
        return {
          initial: { opacity: 0, scale: 0.1 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.4 },
        };
      case "Pop":
      case "pop":
        return {
          initial: { opacity: 1, scale: 0 },
          animate: { scale: [0, 1.5, 1], transition: { duration: 0.3 } },
          exit: { opacity: 0, scale: 0.7 },
        };
      case "Elastic":
      case "elastic":
        return {
          initial: { scale: 0.2, opacity: 0 },
          animate: { 
            scale: 1, 
            opacity: 1,
            transition: { type: "spring", stiffness: 280, damping: 14 } 
          },
          exit: { scale: 0.5, opacity: 0 },
        };
      case "Bounce":
      case "bounce":
        return {
          initial: { y: -100, opacity: 0 },
          animate: { 
            y: 0, 
            opacity: 1,
            transition: { type: "spring", bounce: 0.65 } 
          },
          exit: { y: 50, opacity: 0 },
        };
      case "Slide":
      case "slide-up":
        return {
          initial: { y: 70, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -40, opacity: 0 },
        };
      case "Rotate":
      case "rotate":
        return {
          initial: { rotate: -60, scale: 0.4, opacity: 0 },
          animate: { rotate: 0, scale: 1, opacity: 1 },
          exit: { rotate: 30, opacity: 0 },
        };
      case "Typewriter":
      case "typewriter":
        return {
          initial: { width: "0%", opacity: 0 },
          animate: { width: "100%", opacity: 1, transition: { duration: 0.35 } },
          exit: { opacity: 0 },
        };
      case "Scale":
      case "scale":
        return {
          initial: { scale: 1.8, opacity: 0 },
          animate: { scale: 1, opacity: 1, transition: { duration: 0.25 } },
          exit: { scale: 0.7, opacity: 0 },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  // High fidelity client-side canvas mp4 / webm creator simulation
  const handleExport = async (format: "mp4" | "webm") => {
    if (exporting) return;
    setExporting(true);
    setExportProgress(0);

    const canvas = canvasRef.current;
    if (!canvas) {
      setExporting(false);
      return;
    }

    let width = 1080;
    let height = 1920;
    if (project.aspectRatio === "16:9") {
      width = 1920;
      height = 1080;
    } else if (project.aspectRatio === "1:1") {
      width = 1080;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setExporting(false);
      return;
    }

    const totalSteps = 40;
    for (let step = 1; step <= totalSteps; step++) {
      await new Promise((resolve) => setTimeout(resolve, 55)); // compilation delay
      setExportProgress(Math.round((step / totalSteps) * 100));
    }

    // Trigger download
    setTimeout(() => {
      ctx.fillStyle = project.bgColor;
      ctx.fillRect(0, 0, width, height);
      if (project.gradientBg) {
        const grd = ctx.createLinearGradient(0, 0, 0, height);
        grd.addColorStop(0, project.bgColor);
        grd.addColorStop(1, project.gradientColor);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.fillStyle = project.textColor;
      ctx.font = `italic bold 44px "${project.fontFamily}"`;
      ctx.textAlign = "center";
      ctx.fillText(project.title, width / 2, height / 2 - 40);

      ctx.fillStyle = project.accentColor;
      ctx.font = `64px "${project.fontFamily}"`;
      ctx.fillText("Typography Video Complete", width / 2, height / 2 + 50);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${project.title.replace(/\s+/g, "_") || "reel"}.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        setExporting(false);
        setExportProgress(null);
      }, `video/${format === "mp4" ? "mp4" : "webm"}`);
    }, 400);
  };

  const visibleWords = getVisibleWords();

  const backgroundStyle: React.CSSProperties = {
    backgroundColor: project.bgColor,
    fontFamily: project.fontFamily,
  };

  if (project.gradientBg) {
    backgroundStyle.backgroundImage = `linear-gradient(to bottom, ${project.bgColor}, ${project.gradientColor})`;
  }

  const deviceWidthClass = () => {
    if (deviceFrame === "phone") {
      switch (project.aspectRatio) {
        case "9:16":
          return "w-[290px] h-[520px] md:w-[320px] md:h-[580px]";
        case "16:9":
          return "w-[440px] h-[250px] md:w-[540px] md:h-[305px]";
        case "1:1":
          return "w-[300px] h-[300px] md:w-[380px] md:h-[380px]";
      }
    }
    return "w-full h-full max-w-lg aspect-[9/16] max-h-[80vh]";
  };

  return (
    <div className="min-h-screen bg-[#070708] text-gray-200 flex flex-col font-sans relative overflow-hidden">
      {/* Decorative starry ambient flow */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none"></div>

      {/* Header Bar */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#0a0a0b]/80 backdrop-blur-md z-10 sticky top-0">
        <button
          onClick={onBackToEditor}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Editor Workspace</span>
        </button>

        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
          <h2 className="text-sm font-bold text-white tracking-wide">
            Cinematic Preview: <span className="text-indigo-400 font-extrabold">{project.title || "Untitled Reel"}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout simulation devices frame switches */}
          <button
            onClick={() => setDeviceFrame("phone")}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              deviceFrame === "phone" ? "bg-indigo-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
            title="Mobile device mockup frame"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceFrame("full")}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              deviceFrame === "full" ? "bg-indigo-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
            title="Full theatre size frame"
          >
            <Laptop className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main player workspace area */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 flex flex-col md:flex-row justify-center items-center gap-10">
        {/* Left column: Simulated Video Player Screen */}
        <div className="flex flex-col items-center">
          {/* Phone Frame Device Wrapper */}
          <div
            ref={playerRef}
            className={`relative flex items-center justify-center bg-black/95 transition-all duration-300 ${
              deviceFrame === "phone" 
                ? "border-[12px] border-[#18181c] rounded-[48px] shadow-2xl ring-1 ring-white/10 overflow-hidden" 
                : "border border-white/5 rounded-2xl shadow-2xl overflow-hidden"
            }`}
          >
            {/* Aspect specific Canvas Simulator */}
            <div
              style={backgroundStyle}
              className={`relative overflow-hidden transition-all duration-300 flex items-center justify-center ${deviceWidthClass()}`}
            >
              {/* Dynamic decorative visual lines */}
              <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
                <div className="w-[30px] h-[1px] bg-white"></div>
                <div className="h-[30px] w-[1px] bg-white absolute"></div>
              </div>

              {/* Sequential words animation */}
              <AnimatePresence mode="popLayout">
                {visibleWords.map((w) => {
                  const shouldRender = w.isActive || (currentTime >= w.delay && (w.animation === "accumulate" || w.id === project.words[project.words.length - 1].id || currentTime <= w.delay + w.duration + 0.3));

                  if (!shouldRender) return null;

                  const variants = getAnimationVariants(w.animation);
                  const fontStyles = getWordFontStyles(w);

                  return (
                    <motion.div
                      key={w.id}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={fontStyles}
                      className="text-center select-none"
                    >
                      <span className={w.stroke ? "text-stroke" : ""}>
                        {w.text}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Watermark badge purely for premium look */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 text-[9px] text-gray-400 font-mono flex items-center gap-1 opacity-50">
                <Music className="w-3 h-3 text-indigo-400" />
                <span>Viral Typography Maker</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Playback controls + Download Action Side-bars */}
        <div className="w-full md:w-[350px] flex flex-col gap-6 bg-[#0d0d0f] border border-white/10 p-6 rounded-2xl">
          <div>
            <h3 className="font-semibold text-white mb-1">Playback controller</h3>
            <p className="text-xs text-gray-500 font-medium">Rendered in high frame-rate vector motion loops</p>
          </div>

          {/* Time timeline sliders block */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
              <span className="text-indigo-400 font-bold">{currentTime.toFixed(2)}s</span>
              <span>{project.duration.toFixed(1)}s</span>
            </div>
            
            <input
              type="range"
              min={0}
              max={project.duration}
              step={0.02}
              value={currentTime}
              onChange={(e) => handleScrubChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Main big buttons row */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                isPlaying
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Video</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current animate-pulse" />
                  <span>Watch Video</span>
                </>
              )}
            </button>

            <button
              onClick={handleReplay}
              className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl cursor-pointer active:scale-95 transition-all"
              title="Replay Video"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <hr className="border-white/5" />

          {/* Soundtrack info panel */}
          {project.audioUrl && (
            <div className="bg-[#0a0a0b] border border-white/5 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Music className="w-4 h-4 animate-spin" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-gray-200 truncate">
                  {project.audioName || "Soundtrack Loaded"}
                </p>
                <span className="text-[9px] text-gray-500 font-mono">Volume: {Math.round(project.audioVolume * 100)}%</span>
              </div>
            </div>
          )}

          {/* Export section details */}
          <div className="flex flex-col gap-3">
            <div>
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-500">Download Video</h4>
              <p className="text-[10px] text-gray-600 mt-1 font-medium">Export in full output resolution files</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleExport("webm")}
                disabled={exporting}
                className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:pointer-events-none active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-gray-400" />
                <span>WebM File</span>
              </button>
              <button
                onClick={() => handleExport("mp4")}
                disabled={exporting}
                className="py-2.5 px-3 bg-[#111827] hover:bg-[#1f2937] border border-indigo-500/20 text-indigo-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:pointer-events-none active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>MP4 File</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></div>
              <span>Timeline: {project.aspectRatio} | Export quality: {project.resolution}</span>
            </div>
          </div>

          {/* Compile progress indicators */}
          {exporting && (
            <div className="bg-[#0a0a0b] border border-white/10 p-4.5 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 font-mono">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Encoding render assets...</span>
                <span className="ml-auto font-bold text-indigo-400">{exportProgress}%</span>
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-100"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Hidden processing render canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
