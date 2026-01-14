import React from 'react';
import { Tooltip } from '@/shared/components/ui';
import { AspectRatio, ImageSize, AIModel } from '@/services/ai-core';
import { Search, Brain, Zap, Sparkles, AlertCircle } from 'lucide-react';

interface EditorToolbarProps {
  model: AIModel;
  onModelChange: (model: AIModel) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  imageSize: ImageSize;
  onImageSizeChange: (size: ImageSize) => void;
  useSearch: boolean;
  onSearchToggle: (val: boolean) => void;
  useThinking: boolean;
  onThinkingToggle: (val: boolean) => void;
  isPro: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  model, onModelChange,
  aspectRatio, onAspectRatioChange,
  imageSize, onImageSizeChange,
  useSearch, onSearchToggle,
  useThinking, onThinkingToggle,
  isPro
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl mb-4">
      {/* Model Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Engine</label>
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
          {[
            { id: 'gemini-2.5-flash-image', label: 'Flash', icon: <Zap className="w-3 h-3" /> },
            { id: 'gemini-3-pro-image-preview', label: 'Pro', icon: <Sparkles className="w-3 h-3 text-amber-400" /> }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => onModelChange(m.id as AIModel)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${model === m.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration for Pro Model */}
      {model === 'gemini-3-pro-image-preview' && (
        <>
          <div className="h-8 w-px bg-slate-700 mx-2 self-end mb-1" />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Quality</label>
            <select
              value={imageSize}
              onChange={(e) => onImageSizeChange(e.target.value as ImageSize)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white outline-none focus:border-blue-500"
            >
              <option value="1K">1K Res</option>
              <option value="2K">2K Res</option>
              <option value="4K">4K Res</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Aspect</label>
            <select
              value={aspectRatio}
              onChange={(e) => onAspectRatioChange(e.target.value as AspectRatio)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white outline-none focus:border-blue-500"
            >
              {["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Intelligence Toggles */}
      <div className="h-8 w-px bg-slate-700 mx-2 self-end mb-1" />
      
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Capabilities</label>
        <div className="flex gap-2">
          <Tooltip content="Enable Search Grounding for accurate real-world data">
            <button
              onClick={() => onSearchToggle(!useSearch)}
              className={`p-1.5 rounded-lg border transition-all ${useSearch ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
            >
              <Search className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content="Enable Deep Thinking Mode for complex instructions">
            <button
              onClick={() => onThinkingToggle(!useThinking)}
              className={`p-1.5 rounded-lg border transition-all ${useThinking ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
            >
              <Brain className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {!isPro && model === 'gemini-3-pro-image-preview' && (
        <div className="ml-auto flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg animate-fadeIn">
           <AlertCircle className="w-4 h-4 text-amber-500" />
           <span className="text-[10px] text-amber-200 font-medium">Pro Key Required</span>
        </div>
      )}
    </div>
  );
};