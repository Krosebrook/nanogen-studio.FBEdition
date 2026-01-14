import React, { useState } from 'react';
import { MarketingData } from '../types';
import { Copy, Check, Tag, Sparkles } from 'lucide-react';
import { Tooltip } from '@/shared/components/ui';

interface MarketingResultsProps {
  data: MarketingData;
}

export const MarketingResults: React.FC<MarketingResultsProps> = ({ data }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-5 animate-fadeIn bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800/50">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Generated SEO Copy</span>
      </div>

      <div className="space-y-1.5">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex justify-between items-center px-1">
          Product Title
          <Tooltip content="Copy title to clipboard" side="left">
            <button 
              onClick={() => copyToClipboard(data.title, 'title')}
              className="text-slate-500 hover:text-white transition-colors p-1"
            >
              {copiedField === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </Tooltip>
        </label>
        <p className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-bold leading-normal shadow-sm selection:bg-blue-500/30">
          {data.title}
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex justify-between items-center px-1">
          Description
          <Tooltip content="Copy description to clipboard" side="left">
            <button 
              onClick={() => copyToClipboard(data.description, 'desc')}
              className="text-slate-500 hover:text-white transition-colors p-1"
            >
              {copiedField === 'desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </Tooltip>
        </label>
        <p className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 leading-relaxed shadow-sm selection:bg-blue-500/30">
          {data.description}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Meta Tags</label>
        <div className="flex flex-wrap gap-2">
          {data.tags.map(tag => (
            <Tooltip key={tag} content="Click to copy tag">
              <button 
                onClick={() => copyToClipboard(tag, tag)}
                className="flex items-center gap-1 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:border-blue-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95"
              >
                <Tag className="w-2.5 h-2.5 opacity-60" />
                {tag}
                {copiedField === tag && <Check className="w-2.5 h-2.5 ml-1 text-emerald-400" />}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};