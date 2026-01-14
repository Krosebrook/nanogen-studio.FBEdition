import React from 'react';
import { Spinner, Tooltip, Button } from '@/shared/components/ui';
import { Grid, Sparkles, Image as ImageIcon, Plus } from 'lucide-react';

interface MerchVariationsProps {
  variations: string[];
  isGenerating: boolean;
  activeImage: string | null;
  resultImage: string | null;
  onViewImage: (img: string | null) => void;
  onGenerate?: () => void;
  disabled?: boolean;
}

export const MerchVariations: React.FC<MerchVariationsProps> = ({
  variations,
  isGenerating,
  activeImage,
  resultImage,
  onViewImage,
  onGenerate,
  disabled
}) => {
  const hasVariations = variations.length > 0;

  return (
    <section className="bg-slate-900/80 rounded-[2rem] border border-slate-800/60 p-6 animate-fadeIn shadow-xl backdrop-blur-sm">
      <header className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Sparkles className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-[0.2em]">Mockup variations</h3>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Explore alternate takes</p>
          </div>
        </div>
        {hasVariations && !isGenerating && (
          <Tooltip content="Refresh variations with new random angles and lighting" side="left">
            <button 
              onClick={onGenerate}
              disabled={disabled}
              className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 disabled:opacity-50"
            >
              <Plus className="w-3 h-3" /> Regenerate
            </button>
          </Tooltip>
        )}
      </header>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Master Comparison Slot */}
        {resultImage ? (
          <Tooltip content="Switch back to the primary high-fidelity master mockup" side="top">
            <button 
              onClick={() => onViewImage(null)}
              className={`relative aspect-square bg-slate-950 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group outline-none focus:ring-2 focus:ring-blue-500 ${activeImage === resultImage ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-800 hover:border-slate-600'}`}
            >
              <img src={resultImage} alt="Master Render" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="bg-blue-600 px-2 py-0.5 rounded-md text-[8px] font-black text-white uppercase tracking-widest shadow-lg">Master</span>
                <ImageIcon className="w-3 h-3 text-white/40" />
              </div>
            </button>
          </Tooltip>
        ) : (
          <div className="aspect-square bg-slate-950/50 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center opacity-40">
             <ImageIcon className="w-5 h-5 text-slate-600 mb-1" />
             <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 text-center px-2">Awaiting Master</span>
          </div>
        )}

        {/* Loading Skeletons */}
        {isGenerating ? Array(3).fill(0).map((_, i) => (
           <div key={i} className="aspect-square bg-slate-950 rounded-2xl animate-pulse flex flex-col items-center justify-center border border-slate-800 gap-3">
             <div className="relative">
               <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-full animate-pulse" />
               <Spinner className="w-6 h-6 text-indigo-500 relative z-10" />
             </div>
             <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest animate-pulse">Synthesizing...</span>
           </div>
        )) : hasVariations ? (
          <>
             {variations.map((img, idx) => (
                <Tooltip key={idx} content={`Preview variation ${idx + 1} with alternative lighting and camera perspective`} side="top">
                  <button 
                    onClick={() => onViewImage(img)}
                    className={`relative aspect-square bg-slate-950 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group outline-none focus:ring-2 focus:ring-indigo-500 ${activeImage === img ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-800 hover:border-slate-600'}`}
                  >
                    <img src={img} alt={`Variation ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="bg-slate-800 px-2 py-0.5 rounded-md text-[8px] font-black text-slate-300 uppercase tracking-widest border border-slate-700 shadow-lg">Var {idx + 1}</span>
                      <Sparkles className="w-3 h-3 text-indigo-400/60" />
                    </div>
                  </button>
                </Tooltip>
             ))}
          </>
        ) : (
          <div className="col-span-3 aspect-[3/1] sm:aspect-auto sm:h-full bg-slate-950/40 rounded-2xl border-2 border-dashed border-slate-800/60 flex flex-col items-center justify-center p-4 text-center group">
             {resultImage ? (
                <Tooltip content="Generate 3 AI variations based on the current master mockup">
                  <button 
                    onClick={onGenerate}
                    disabled={disabled}
                    className="flex flex-col items-center gap-3 group/btn focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-500/5 flex items-center justify-center border border-indigo-500/10 group-hover/btn:scale-110 group-hover/btn:bg-indigo-500/10 transition-all">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/btn:text-slate-200 transition-colors">Discover Variations</p>
                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Click to generate 3 alternate shots</p>
                    </div>
                  </button>
                </Tooltip>
             ) : (
                <div className="flex flex-col items-center gap-2 opacity-30">
                   <Grid className="w-6 h-6 text-slate-600" />
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Variants Locked</p>
                </div>
             )}
          </div>
        )}
      </div>
    </section>
  );
};