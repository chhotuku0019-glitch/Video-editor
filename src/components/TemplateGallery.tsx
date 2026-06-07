import React, { useState } from "react";
import { Sparkles, Grid, Layers, Zap, Star } from "lucide-react";
import { TEMPLATES_DATA } from "../templates";
import { TemplatePreset } from "../types";

interface TemplateGalleryProps {
  onSelectTemplate: (template: TemplatePreset) => void;
}

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = [
    "All",
    "Viral Instagram",
    "Love Status",
    "Sad Status",
    "Motivational",
    "Poetry",
    "Cinematic",
    "Attitude",
    "Shayari",
    "Modern Typography",
    "Minimal",
    "Luxury",
    "Neon"
  ];

  const filteredTemplates = activeCategory === "All" 
    ? TEMPLATES_DATA 
    : TEMPLATES_DATA.filter(t => t.category === activeCategory);

  return (
    <div className="flex flex-col bg-[#0d0d0f] border border-white/10 p-5 rounded-2xl w-full h-full">
      <div className="flex items-center gap-2.5 mb-4">
        <Grid className="w-5 h-5 text-indigo-400" />
        <h3 className="font-semibold text-gray-200 font-sans">Preset Templates</h3>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">
          Gallery
        </span>
      </div>

      {/* Category Picker lists sliding row */}
      <div className="flex gap-2 pb-3 mb-4 overflow-x-auto border-b border-white/5 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid viewport */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[290px] pr-1">
        {filteredTemplates.map((template) => {
          const visualBg = template.gradientBg
            ? `linear-gradient(to bottom, ${template.bgColor}, ${template.gradientColor})`
            : template.bgColor;

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="group relative bg-[#0a0a0b] border border-white/10 hover:border-indigo-500/50 rounded-xl p-3 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:shadow-lg"
            >
              {/* Fake visual thumbnail background */}
              <div
                style={{ background: visualBg }}
                className="w-full h-20 rounded-lg flex items-center justify-center relative overflow-hidden mb-2 shadow-inner group-hover:scale-[1.02] transition-transform duration-350"
              >
                <span
                  style={{
                    fontFamily: template.fontFamily,
                    color: template.accentColor,
                    fontWeight: template.fontWeight,
                  }}
                  className="text-xs font-bold text-center px-2 line-clamp-2 scale-90"
                >
                  {template.sampleText.split(" ").slice(0, 3).join(" ")}...
                </span>
                {/* Visual badge indicator */}
                <div className="absolute top-1 right-1 bg-black/80 border border-white/10 text-[8px] scale-90 text-gray-300 px-1.5 py-0.5 rounded font-mono">
                  {template.aspectRatio}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-200 truncate group-hover:text-indigo-400 transition-colors">
                  {template.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-500 font-semibold font-mono">
                    {template.category}
                  </span>
                  <Star className="w-3 h-3 text-gray-600 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>

              {/* Hover splash glow overlay panel */}
              <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-all pointer-events-none duration-300 animate-pulse"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
