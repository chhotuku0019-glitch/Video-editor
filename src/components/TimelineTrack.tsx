import React from "react";
import { Clock, Sliders, Play, Plus, Trash2, Tag, Sparkles, Move, Zap } from "lucide-react";
import { WordItem, VideoProject } from "../types";

interface TimelineTrackProps {
  project: VideoProject;
  currentTime: number;
  selectedWordId: string | null;
  onSelectWord: (id: string | null) => void;
  onUpdateWord: (id: string, updated: Partial<WordItem>) => void;
  onAddWord: (text: string) => void;
  onDeleteWord: (id: string) => void;
}

export default function TimelineTrack({
  project,
  currentTime,
  selectedWordId,
  onSelectWord,
  onUpdateWord,
  onAddWord,
  onDeleteWord,
}: TimelineTrackProps) {
  const [newWordText, setNewWordText] = React.useState("");

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordText.trim()) return;
    onAddWord(newWordText.trim());
    setNewWordText("");
  };

  const handleDelayChange = (w: WordItem, val: number) => {
    // Ensure delay is non-negative and keep within total duration limits
    const safeDelay = Math.max(0, parseFloat(val.toFixed(2)));
    onUpdateWord(w.id, { delay: safeDelay });
  };

  const handleDurationChange = (w: WordItem, val: number) => {
    // Ensure duration is reasonable
    const safeDuration = Math.max(0.1, parseFloat(val.toFixed(2)));
    onUpdateWord(w.id, { duration: safeDuration });
  };

  // Find currently highlighted active word in actual play line
  const activeWordInTimeline = project.words.find(
    (w) => currentTime >= w.delay && currentTime <= w.delay + w.duration
  );

  return (
    <div className="flex flex-col bg-[#0d0d0f] border border-white/10 p-5 rounded-2xl w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-gray-200">Timeline & Word Sync</h3>
          <span className="text-[10px] bg-[#0a0a0b] border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-full font-mono">
            {project.words.length} split chunks
          </span>
        </div>

        {/* Rapid manual text-word adder form */}
        <form onSubmit={handleCreateWord} className="flex gap-2">
          <input
            type="text"
            value={newWordText}
            onChange={(e) => setNewWordText(e.target.value)}
            placeholder="Add quick segment..."
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-36 sm:w-48"
          />
          <button
            type="submit"
            className="p-1 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Grid Timeline block */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-none">
        {project.words.map((word, index) => {
          const isActiveOnPlayhead = currentTime >= word.delay && currentTime <= word.delay + word.duration;
          const isSelected = selectedWordId === word.id;

          return (
            <div
              key={word.id}
              onClick={() => onSelectWord(word.id)}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 border rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? "bg-indigo-500/10 border-indigo-500/50 shadow-md shadow-indigo-600/5"
                  : isActiveOnPlayhead
                  ? "bg-white/5 border-white/20"
                  : "bg-[#0a0a0b] border-white/5 hover:border-white/10"
              }`}
            >
              {/* Left word token string description */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-500 font-bold w-4">
                  #{index + 1}
                </span>

                <div 
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                    word.color === "accent"
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      : "bg-white/5 text-gray-200 border-white/10"
                  }`}
                  style={{
                    fontFamily: project.fontFamily,
                  }}
                >
                  {word.text}
                </div>

                {/* Accent Indicators */}
                <div className="flex gap-1">
                  {word.color === "accent" && (
                    <span className="text-[9px] bg-yellow-500/10 text-yellow-500 font-bold border border-yellow-500/20 px-1.5 py-0.2 rounded font-mono">
                      ACCENT
                    </span>
                  )}
                  {word.glow && (
                    <span className="text-[9px] bg-rose-500/10 text-rose-500 font-bold border border-rose-500/20 px-1.5 py-0.2 rounded font-mono">
                      NEON
                    </span>
                  )}
                  {word.stroke && (
                    <span className="text-[9px] bg-purple-500/10 text-purple-500 font-bold border border-purple-500/20 px-1.5 py-0.2 rounded font-mono">
                      STROKE
                    </span>
                  )}
                </div>
              </div>

              {/* Slider inputs for precise delay & duration controls */}
              <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                {/* Delay configuration Slider */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-semibold w-10">Delay</span>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(10, project.duration)}
                    step={0.05}
                    value={word.delay}
                    onChange={(e) => handleDelayChange(word, parseFloat(e.target.value))}
                    className="w-16 sm:w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <input
                    type="number"
                    step={0.1}
                    value={word.delay}
                    onChange={(e) => handleDelayChange(word, parseFloat(e.target.value) || 0)}
                    className="w-10 text-[10px] font-mono bg-[#0a0a0b] border border-white/10 px-1 py-0.5 rounded text-gray-300 text-center focus:outline-none"
                  />
                  <span className="text-[9px] text-gray-500 font-mono">s</span>
                </div>

                {/* Duration slider */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-semibold w-7">Len</span>
                  <input
                    type="range"
                    min={0.1}
                    max={4}
                    step={0.05}
                    value={word.duration}
                    onChange={(e) => handleDurationChange(word, parseFloat(e.target.value))}
                    className="w-14 sm:w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <input
                    type="number"
                    step={0.1}
                    value={word.duration}
                    onChange={(e) => handleDurationChange(word, parseFloat(e.target.value) || 0.1)}
                    className="w-8 text-[10px] font-mono bg-[#0a0a0b] border border-white/10 px-1 py-0.5 rounded text-gray-300 text-center focus:outline-none"
                  />
                  <span className="text-[9px] text-gray-500 font-mono">s</span>
                </div>

                {/* Delete visual word element */}
                <button
                  onClick={() => onDeleteWord(word.id)}
                  className="p-1 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all cursor-pointer"
                  title="Remove segment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {project.words.length === 0 && (
          <div className="p-8 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-xl">
            No visual timing tracks recorded yet. Type or generate layout above.
          </div>
        )}
      </div>
    </div>
  );
}
