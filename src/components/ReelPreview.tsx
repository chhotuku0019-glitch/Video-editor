import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Square, Film, ArrowRight, Sparkles, Download, RotateCcw, Volume2, Music, Scissors } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VideoProject, WordItem, AspectRatio, Resolution } from "../types";

interface ReelPreviewProps {
  project: VideoProject;
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
  selectedWordId: string | null;
  onSelectWord: (id: string | null) => void;
  onUpdateWordPosition: (id: string, x: number, y: number) => void;
}

export default function ReelPreview({
  project,
  currentTime,
  isPlaying,
  onTimeUpdate,
  onPlayPause,
  onReset,
  selectedWordId,
  onSelectWord,
  onUpdateWordPosition,
}: ReelPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Synchronize audio element
  useEffect(() => {
    if (project.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(project.audioUrl);
      } else if (audioRef.current.src !== project.audioUrl) {
        audioRef.current.src = project.audioUrl;
      }
      audioRef.current.volume = project.audioVolume;
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, [project.audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = project.audioVolume;
    }
  }, [project.audioVolume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.currentTime = currentTime;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Adjust audio time when scrubbed
  useEffect(() => {
    if (audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 0.15) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Dimensions of Preview based on aspect ratio
  const getAspectRatioClasses = (ratio: AspectRatio) => {
    switch (ratio) {
      case "9:16":
        return "aspect-[9/16] h-[520px] max-h-[80vh]";
      case "16:9":
        return "aspect-[16/9] w-full max-w-[500px]";
      case "1:1":
        return "aspect-square w-full max-w-[420px]";
    }
  };

  // Helper function to render active words based on timing offset
  const getVisibleWords = (): (WordItem & { isActive: boolean; progress: number })[] => {
    const activeWords: (WordItem & { isActive: boolean; progress: number })[] = [];

    project.words.forEach((w) => {
      // In professional viral reels, words often stay visible or highlight on schedule
      const wordStart = w.delay;
      const wordEnd = w.delay + w.duration;
      
      // Let's make standard Instagram typography behave beautifully:
      // A word is "active" (primary focal point) when currentTime is in its specific range.
      // Other words in the block are displayed with diminished opacity or hidden depending on layout.
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

  // Helper to get font styles dynamically based on word override or project level
  const getWordFontStyles = (w: WordItem) => {
    const computedColor =
      w.color === "text"
        ? project.textColor
        : w.color === "accent"
        ? project.accentColor
        : w.color;

    const baseStyle: React.CSSProperties = {
      fontFamily: project.fontFamily,
      fontWeight: project.fontWeight,
      fontSize: `${w.size * 1.5}rem`,
      color: computedColor,
      letterSpacing: `${project.letterSpacing}px`,
      position: "absolute",
      left: `${w.positionX}%`,
      top: `${w.positionY}%`,
      transform: "translate(-50%, -50%)",
      userSelect: "none",
      cursor: "pointer",
      pointerEvents: "auto",
      whiteSpace: "nowrap",
      transition: "outline 0.15s, box-shadow 0.15s",
    };

    if (w.glow) {
      baseStyle.textShadow = `0 0 10px ${computedColor}, 0 0 25px ${computedColor}`;
    }

    if (w.stroke) {
      baseStyle.WebkitTextStroke = `1.5px ${computedColor}`;
      baseStyle.color = "transparent";
    }

    return baseStyle;
  };

  // Mouse drag handler to reposition words interactively on the canvas
  const handleWordMouseDown = (e: React.MouseEvent, w: WordItem) => {
    e.stopPropagation();
    onSelectWord(w.id);

    const canvasElement = containerRef.current;
    if (!canvasElement) return;

    const rect = canvasElement.getBoundingClientRect();
    
    const handleMouseMove = (mmEvent: MouseEvent) => {
      const xPercent = Math.max(5, Math.min(95, ((mmEvent.clientX - rect.left) / rect.width) * 100));
      const yPercent = Math.max(5, Math.min(95, ((mmEvent.clientY - rect.top) / rect.height) * 100));
      
      onUpdateWordPosition(w.id, Math.round(xPercent), Math.round(yPercent));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Return Framer motion animation variants based on typography animation types
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
          initial: { opacity: 0, scale: 0.2 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.5 },
        };
      case "Pop":
      case "pop":
        return {
          initial: { opacity: 1, scale: 0 },
          animate: { scale: [0, 1.4, 1] },
          exit: { opacity: 0, scale: 0.8 },
        };
      case "Elastic":
      case "elastic":
        return {
          initial: { scale: 0.3, opacity: 0 },
          animate: { 
            scale: 1, 
            opacity: 1,
            transition: { type: "spring", stiffness: 260, damping: 15 } 
          },
          exit: { scale: 0.5, opacity: 0 },
        };
      case "Bounce":
      case "bounce":
        return {
          initial: { y: -80, opacity: 0 },
          animate: { 
            y: 0, 
            opacity: 1,
            transition: { type: "spring", bounce: 0.6 } 
          },
          exit: { y: 40, opacity: 0 },
        };
      case "Slide":
      case "slide":
      case "slide-up":
        return {
          initial: { y: 50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -30, opacity: 0 },
        };
      case "slide-down":
        return {
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 30, opacity: 0 },
        };
      case "slide-left":
        return {
          initial: { x: 70, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -40, opacity: 0 },
        };
      case "slide-right":
        return {
          initial: { x: -70, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 40, opacity: 0 },
        };
      case "Rotate":
      case "rotate":
        return {
          initial: { rotate: -45, scale: 0.5, opacity: 0 },
          animate: { rotate: 0, scale: 1, opacity: 1 },
          exit: { rotate: 25, opacity: 0 },
        };
      case "Typewriter":
      case "typewriter":
        return {
          initial: { width: "0%", opacity: 0 },
          animate: { width: "100%", opacity: 1, transition: { duration: 0.3 } },
          exit: { opacity: 0 },
        };
      case "Scale":
      case "scale":
        return {
          initial: { scale: 1.5, opacity: 0 },
          animate: { scale: 1, opacity: 1, transition: { duration: 0.25 } },
          exit: { scale: 0.8, opacity: 0 },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  // High-fidelity local video exporter using Canvas API and offline rendering frame-by-frame
  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    setExportProgress(0);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas element is missing");

      // Set aspect ratio resolutions according to project specifications
      let width = 1080;
      let height = 1920; // default 9:16 - 1080p

      if (project.aspectRatio === "16:9") {
        width = 1920;
        height = 1080;
      } else if (project.aspectRatio === "1:1") {
        width = 1080;
        height = 1080;
      }

      // Scaling factor depending on output resolution setting
      let multiplier = 1;
      if (project.resolution === "720p") {
        multiplier = 720 / height;
      } else if (project.resolution === "2K") {
        multiplier = 1440 / height;
      } else if (project.resolution === "4K") {
        multiplier = 2160 / height;
      }

      canvas.width = Math.round(width * multiplier);
      canvas.height = Math.round(height * multiplier);

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not acquire 2D canvas context");

      // Setup beautiful frame capturing
      const fps = project.fps;
      const totalFrames = Math.max(1, Math.ceil(project.duration * fps));
      const frameDuration = 1 / fps;

      // We capture stream and feed into MediaRecorder
      const stream = canvas.captureStream(fps);
      
      // Attempt to add real audio track if provided
      let audioDestination: MediaStreamAudioDestinationNode | null = null;
      let audioContext: AudioContext | null = null;
      let soundSource: AudioBufferSourceNode | null = null;

      if (project.audioUrl) {
        try {
          audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const response = await fetch(project.audioUrl);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          audioDestination = audioContext.createMediaStreamDestination();
          soundSource = audioContext.createBufferSource();
          soundSource.buffer = audioBuffer;

          // Gain node for custom volume control
          const gainNode = audioContext.createGain();
          gainNode.gain.value = project.audioVolume;
          soundSource.connect(gainNode);
          gainNode.connect(audioDestination);

          // Merge video track and audio track
          const audioTrack = audioDestination.stream.getAudioTracks()[0];
          if (audioTrack) {
            stream.addTrack(audioTrack);
          }
        } catch (audioErr) {
          console.warn("Could not load or bind audio to compiler stream:", audioErr);
        }
      }

      const recorderOptions = {
        mimeType: "video/webm;codecs=vp9",
      };
      
      let recordedChunks: Blob[] = [];
      let mediaRecorder: MediaRecorder;

      try {
        mediaRecorder = new MediaRecorder(stream, recorderOptions);
      } catch (e) {
        // Fallback for Safari/Firefox
        mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.start();

      if (soundSource) {
        soundSource.start(0);
      }

      // Draw frames one by one
      for (let frameIndex = 0; frameIndex <= totalFrames; frameIndex++) {
        const time = frameIndex * frameDuration;
        
        // Draw the background
        ctx.fillStyle = project.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (project.gradientBg) {
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, project.bgColor);
          gradient.addColorStop(1, project.gradientColor);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Render current audio sync info (purely text visual representation)
        ctx.textBaseline = "middle";

        // Draw active words
        project.words.forEach((w) => {
          if (time >= w.delay) {
            const wordElapsed = time - w.delay;
            if (wordElapsed > w.duration + 0.3 && w.animation !== "accumulate") {
              // Word has vanished (if standard transitional)
              // Let the final word stay visible
              const isLast = project.words[project.words.length - 1].id === w.id;
              if (!isLast) return;
            }

            ctx.save();

            // Word positions as absolute scale coordinates inside high-definition render
            const absoluteX = (w.positionX / 100) * canvas.width;
            const absoluteY = (w.positionY / 100) * canvas.height;

            ctx.translate(absoluteX, absoluteY);

            // Compute animations frame by frame on Canvas!
            let scale = w.size * multiplier * 2.3;
            let opacity = 1;
            let rotation = 0;
            const progress = Math.min(wordElapsed / w.duration, 1);

            if (w.animation === "fade-in") {
              opacity = progress;
            } else if (w.animation === "zoom-in") {
              opacity = progress;
              scale *= (0.2 + 0.8 * progress);
            } else if (w.animation === "pop") {
              if (progress < 0.4) {
                scale *= (progress / 0.4) * 1.3;
              } else {
                scale *= 1.3 - ((progress - 0.4) / 0.6) * 0.3;
              }
            } else if (w.animation === "bounce") {
              const bounceY = Math.sin(progress * Math.PI) * -50 * multiplier;
              ctx.translate(0, bounceY);
            } else if (w.animation === "elastic") {
              // Elastic rebound formula
              const t = progress;
              const bounceScale = t === 1 ? 1 : 1 - Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3));
              scale *= bounceScale;
            } else if (w.animation === "slide-up") {
              const slideOffset = (1 - progress) * 80 * multiplier;
              ctx.translate(0, slideOffset);
              opacity = progress;
            } else if (w.animation === "slide-down") {
              const slideOffset = (1 - progress) * -80 * multiplier;
              ctx.translate(0, slideOffset);
              opacity = progress;
            } else if (w.animation === "rotate") {
              rotation = (1 - progress) * -0.4;
              ctx.rotate(rotation);
              opacity = progress;
            }

            ctx.globalAlpha = opacity;

            // Highlight features
            const colorVal =
              w.color === "text"
                ? project.textColor
                : w.color === "accent"
                ? project.accentColor
                : w.color;

            ctx.fillStyle = colorVal;
            ctx.textAlign = "center";

            // Font styles inside Canvas drawing context
            const fontStyleStr = `${project.fontWeight === "900" ? "900 " : project.fontWeight === "700" ? "bold " : ""}${Math.round(40 * scale)}px "${project.fontFamily}"`;
            ctx.font = fontStyleStr;

            // Glowing effects
            if (w.glow) {
              ctx.shadowColor = colorVal;
              ctx.shadowBlur = 20 * multiplier;
            }

            // Stroke outline properties
            if (w.stroke) {
              ctx.strokeStyle = colorVal;
              ctx.lineWidth = 4 * multiplier;
              ctx.strokeText(w.text, 0, 0);
            } else {
              ctx.fillText(w.text, 0, 0);
            }

            ctx.restore();
          }
        });

        // Let stream capture the frame
        await new Promise((resolve) => setTimeout(resolve, 8)); // speed simulation delay
        setExportProgress(Math.round((frameIndex / totalFrames) * 100));
      }

      // Finish recording and output visual WebM/MP4 container downloads
      setTimeout(() => {
        if (soundSource) {
          try { soundSource.stop(); } catch(e){}
        }
        mediaRecorder.stop();
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Typography_Reel_${project.title.replace(/\s+/g, "_") || "Video"}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setExporting(false);
          setExportProgress(null);
        };
      }, 500);

    } catch (err: any) {
      console.error("Export Error:", err);
      alert(`Export Failed: ${err.message || err}`);
      setExporting(false);
      setExportProgress(null);
    }
  };

  const visibleWords = getVisibleWords();
  const currentActiveWord = visibleWords.find(w => w.isActive);

  // Background style values computed
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: project.bgColor,
    fontFamily: project.fontFamily,
  };

  if (project.gradientBg) {
    backgroundStyle.backgroundImage = `linear-gradient(to bottom, ${project.bgColor}, ${project.gradientColor})`;
  }

  return (
    <div className="flex flex-col items-center bg-[#0d0d0f] p-6 rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl">
      {/* Aspect ratio frame preview wrapper */}
      <div className="flex justify-between items-center w-full mb-4.5">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-gray-200">Video Canvas</h3>
          <span className="text-xs bg-[#0a0a0b] border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-full select-none font-mono">
            {project.aspectRatio} | {project.resolution}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="font-mono">
            {currentTime.toFixed(2)}s / {project.duration.toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Reel Box viewport simulating high-end studio phone */}
      <div className="relative flex items-center justify-center bg-[#050505] border-4 border-[#1a1a1c] rounded-[40px] shadow-2xl overflow-hidden w-full max-w-md h-[460px] md:h-[500px]">
        {/* Actual Preview Frame Container */}
        <div
          id="preview-viewport"
          ref={containerRef}
          style={backgroundStyle}
          className={`relative overflow-hidden transition-all duration-300 shadow-2xl rounded-xl cursor-crosshair ${getAspectRatioClasses(
            project.aspectRatio
          )}`}
          onClick={() => onSelectWord(null)}
        >
          {/* Centering crosshairs purely decoration */}
          <div className="absolute inset-0 pointer-events-none border border-white/5 flex items-center justify-center">
            <div className="w-[12px] h-[1px] bg-white/10"></div>
            <div className="h-[12px] w-[1px] bg-white/10 absolute"></div>
          </div>

          <AnimatePresence mode="popLayout">
            {visibleWords.map((w) => {
              const shouldRender = w.isActive || (currentTime >= w.delay && (w.animation === "accumulate" || w.id === project.words[project.words.length - 1].id || currentTime <= w.delay + w.duration + 0.35));

              if (!shouldRender) return null;

              const variants = getAnimationVariants(w.animation);
              const fontStyles = getWordFontStyles(w);
              const isSelected = selectedWordId === w.id;

              return (
                <motion.div
                  key={w.id}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={fontStyles}
                  className={`relative select-none text-center transform transition-transform duration-100 ${
                    isSelected ? "outline-2 outline-dashed outline-indigo-500 rounded px-1.5 py-0.5 z-40 bg-indigo-500/10 text-slate-100" : "hover:outline-1 hover:outline-indigo-500/40 rounded px-1.5 py-0.5 z-10"
                  }`}
                  onMouseDown={(e) => handleWordMouseDown(e, w)}
                >
                  <span className={w.stroke ? "text-stroke" : ""}>
                    {w.text}
                  </span>
                  
                  {/* Small decorative indicator on the word focus */}
                  {w.glow && (
                    <span className="absolute -inset-1 blur-md bg-white/5 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none rounded-lg font-mono"></span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty text state indicator overlay */}
          {project.words.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 select-none">
              <Sparkles className="w-10 h-10 mb-3 text-slate-600 animate-pulse" />
              <p className="text-sm font-medium">No Words Split Yet</p>
              <p className="text-xs text-slate-500 mt-1">Type in details or fetch an AI Layout to generate beautiful typography.</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden export canvas rendering frame sequence */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Exporter dynamic progress visual overlay indicator */}
      {exporting && (
        <div className="w-full mt-4 bg-[#0a0a0b] border border-white/10 p-4.5 rounded-xl flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-2 w-full text-gray-400">
            <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-spin" />
            <span className="text-xs font-semibold text-gray-300 font-mono">Compiling high fidelity layout frames...</span>
            <span className="text-xs ml-auto font-mono text-indigo-400">{exportProgress}%</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-100"
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Media control timeline and playback panel */}
      <div className="w-full mt-5">
        {/* Playback Scrub timeline Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-gray-400 w-8 text-right">0.0s</span>
          <div className="relative flex-1 group">
            <input
              type="range"
              min={0}
              max={Math.max(1, project.duration)}
              step={0.05}
              value={currentTime}
              onChange={(e) => onTimeUpdate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 group-hover:h-2 transition-all"
            />
            {/* Visual audio beat indicators on timeline */}
            {project.audioUrl && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-around pointer-events-none opacity-40">
                <div className="w-0.5 h-2 bg-indigo-400/50 rounded-full"></div>
                <div className="w-0.5 h-3 bg-purple-400/55 rounded-full"></div>
                <div className="w-0.5 h-2 bg-indigo-400/50 rounded-full"></div>
                <div className="w-0.5 h-4 bg-purple-400/55 rounded-full"></div>
                <div className="w-0.5 h-2 bg-indigo-400/50 rounded-full"></div>
                <div className="w-0.5 h-3 bg-purple-400/55 rounded-full"></div>
                <div className="w-0.5 h-2 bg-indigo-400/50 rounded-full"></div>
              </div>
            )}
          </div>
          <span className="text-[10px] font-mono text-gray-400 w-8">{project.duration.toFixed(1)}s</span>
        </div>

        {/* Action Controls buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg transition-all cursor-pointer"
              title="Reset Timeline to start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onPlayPause}
              className={`px-4.5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isPlaying ? "bg-amber-500 hover:bg-amber-600 text-slate-950" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20"
              }`}
            >
              {isPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5" />}
              <span>{isPlaying ? "Pause" : "Play Reel"}</span>
            </button>
          </div>

          <div className="flex gap-2">
            {project.audioUrl && (
              <div className="flex items-center gap-2 bg-[#0a0a0b] border border-white/10 px-3 py-1.5 rounded-lg text-xs text-gray-400 mr-1">
                <Music className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span className="max-w-[100px] truncate">{project.audioName || "Music Loaded"}</span>
              </div>
            )}
            <button
              onClick={handleExport}
              disabled={exporting || project.words.length === 0}
              className="px-4.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <Download className="w-4.5 h-4.5" />
              <span>Export {project.resolution}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
