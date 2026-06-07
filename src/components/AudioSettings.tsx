import React, { useRef, useState } from "react";
import { Music, Upload, Volume2, Sparkles, AlertCircle, Headphones, Play, Pause } from "lucide-react";
import { VideoProject } from "../types";

interface AudioSettingsProps {
  project: VideoProject;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
}

export default function AudioSettings({ project, onUpdateProject }: AudioSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isPlayingTheme, setIsPlayingTheme] = useState<string | null>(null);
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);

  // High-fidelity public test music presets for Instant Sandbox testing
  const STOCK_TRACKS = [
    {
      name: "Cyberpunk Action Beat",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      genre: "Electro / Synthwave",
      duration: "360s",
    },
    {
      name: "Sunset Lo-fi Chill",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      genre: "Lofi / Relaxing",
      duration: "420s",
    },
    {
      name: "Cinematic Motivation",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      genre: "Ambient / Dramatic",
      duration: "302s",
    },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAudioFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAudioFile(e.target.files[0]);
    }
  };

  const processAudioFile = (file: File) => {
    if (!file.type.startsWith("audio/")) {
      alert("Please upload a valid audio file (MP3, WAV, etc.)");
      return;
    }

    const url = URL.createObjectURL(file);
    onUpdateProject({
      audioUrl: url,
      audioName: file.name,
    });
  };

  const selectStockTrack = (name: string, url: string) => {
    onUpdateProject({
      audioUrl: url,
      audioName: name,
    });
  };

  const handleVolumeChange = (v: number) => {
    onUpdateProject({
      audioVolume: Math.max(0, Math.min(1, v)),
    });
  };

  const clearAudio = () => {
    if (themeAudioRef.current) {
      themeAudioRef.current.pause();
    }
    setIsPlayingTheme(null);
    onUpdateProject({
      audioUrl: null,
      audioName: null,
    });
  };

  const togglePreviewTrack = (e: React.MouseEvent, track: typeof STOCK_TRACKS[0]) => {
    e.stopPropagation();
    if (isPlayingTheme === track.name) {
      themeAudioRef.current?.pause();
      setIsPlayingTheme(null);
    } else {
      if (themeAudioRef.current) {
        themeAudioRef.current.pause();
      }
      themeAudioRef.current = new Audio(track.url);
      themeAudioRef.current.volume = 0.5;
      themeAudioRef.current.play().catch(() => {});
      setIsPlayingTheme(track.name);

      themeAudioRef.current.onended = () => {
        setIsPlayingTheme(null);
      };
    }
  };

  return (
    <div className="flex flex-col bg-[#0d0d0f] border border-white/10 p-5 rounded-2xl w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-gray-200 font-sans">Audio & Beat Sync</h3>
        </div>
        {project.audioUrl && (
          <button
            onClick={clearAudio}
            className="text-[10px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer"
          >
            Remove Audio
          </button>
        )}
      </div>

      {/* Audio upload drop area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-indigo-500 bg-indigo-500/10 animate-pulse"
            : "border-white/10 bg-white/5 hover:bg-white/10"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="p-3 bg-indigo-600/10 rounded-full text-indigo-400 mb-3.5 hover:scale-110 transition-transform">
          <Upload className="w-5 h-5" />
        </div>

        {project.audioUrl ? (
          <div>
            <p className="text-xs font-bold text-gray-200 truncate max-w-[200px] mb-1">
              🎵 {project.audioName || "Custom Track Loaded"}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">Click or drag here to replace song</p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-gray-300">
              Upload MP3 Background Music
            </p>
            <p className="text-[10px] text-gray-500 mt-1 font-medium">
              Drag & drop audio files here, or browse local folders
            </p>
          </div>
        )}
      </div>

      {/* Real-time sync feedback simulated waveform */}
      {project.audioUrl && (
        <div className="mt-4 p-3 bg-[#0a0a0b] border border-white/10 rounded-xl">
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
            <span className="flex items-center gap-1.5 font-semibold font-mono">
              <Headphones className="w-3.5 h-3.5 text-indigo-400" />
              Volume Adjuster
            </span>
            <span className="font-mono text-indigo-400 font-bold">{Math.round(project.audioVolume * 100)}%</span>
          </div>

          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={project.audioVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Animated Wave visualizer decoration */}
          <div className="flex items-end justify-between h-8 mt-3 px-1 gap-0.5">
            {[...Array(26)].map((_, idx) => {
              const randomHeight = Math.floor(Math.sin((idx + 1) * 0.4) * 8) + 16 + (Math.random() * 6);
              return (
                <div
                  key={idx}
                  style={{ height: `${randomHeight}px` }}
                  className="w-1.5 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-sm transition-all"
                ></div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock ambient test tracks presets segment */}
      <div className="mt-4">
        <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-3">
          ambient music options
        </h4>

        <div className="flex flex-col gap-2">
          {STOCK_TRACKS.map((track) => {
            const isSelected = project.audioName === track.name;
            const isPlaying = isPlayingTheme === track.name;

            return (
              <div
                key={track.name}
                onClick={() => selectStockTrack(track.name, track.url)}
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-indigo-500/10 border-indigo-500/40"
                    : "bg-[#0a0a0b] border-white/5 hover:border-white/20"
                }`}
              >
                <div>
                  <h5 className="text-xs font-bold text-gray-200 truncate max-w-[150px]">
                    {track.name}
                  </h5>
                  <span className="text-[9px] text-indigo-400 font-semibold uppercase tracking-wider font-mono">
                    {track.genre}
                  </span>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => togglePreviewTrack(e, track)}
                    className="p-1 px-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded border border-white/10 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => selectStockTrack(track.name, track.url)}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="text-[10px] font-semibold px-1">
                      {isSelected ? "Active" : "Use"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
