import React, { useEffect } from 'react';
import { Spinner, Button, Tooltip } from '@/shared/components/ui';
import { Image as ImageIcon, Download, AlertCircle, Wand2, ZoomIn, ZoomOut, Maximize, Move, Cpu } from 'lucide-react';
import { useCanvasTransform } from '../hooks/useCanvasTransform';

interface EditorCanvasProps {
  loading: boolean;
  resultImage: string | null;
  selectedImage?: string | null;
  error: string | null;
  onRetry: () => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ loading, resultImage, selectedImage, error, onRetry }) => {
  const {
    scale,
    position,
    isDragging,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    reset
  } = useCanvasTransform();

  const activeImage = resultImage || selectedImage;

  // Reset zoom when image changes
  useEffect(() => {
    if (activeImage) {
      reset();
    }
  }, [activeImage, reset]);

  return (
    <div className={`flex flex-col h-full bg-slate-900 rounded-2xl border overflow-hidden relative transition-colors ${error ? 'border-red-900/30' : 'border-slate-700'}`}>
       {/* Canvas Header */}
       <div className="absolute top-0 left-0 right-0 h-12 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 flex items-center px-4 justify-between z-10">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5" /> {resultImage ? 'Master Render' : (selectedImage ? 'Workspace Preview' : 'Active Viewport')}
          </span>
          {activeImage && (
            <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                    <Move className="w-3 h-3" />
                    <span className="hidden sm:inline">Pan Enabled</span>
                 </div>
                 {resultImage && (
                   <a href={resultImage} download={`edited-${Date.now()}.png`} className="text-blue-400 hover:text-blue-300 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all">
                     <Download className="w-3.5 h-3.5" /> Save
                   </a>
                 )}
            </div>
          )}
       </div>

       {/* Canvas Body */}
       <div 
         className={`flex-1 w-full h-full overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5 relative
            ${activeImage ? 'cursor-move' : ''}
         `}
         onMouseDown={activeImage ? handleMouseDown : undefined}
         onMouseMove={activeImage ? handleMouseMove : undefined}
         onMouseUp={activeImage ? handleMouseUp : undefined}
         onMouseLeave={activeImage ? handleMouseUp : undefined}
         onWheel={activeImage ? handleWheel : undefined}
       >
          <div className="w-full h-full flex items-center justify-center">
             {loading ? (
                <div className="text-center pointer-events-none select-none animate-fadeIn flex flex-col items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                    <Spinner className="w-14 h-14 text-blue-500 relative z-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white text-[11px] font-black uppercase tracking-[0.3em] animate-pulse">Gemini is Thinking</p>
                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Synthesizing high-precision buffers...</p>
                  </div>
                </div>
              ) : activeImage ? (
                <div 
                    className="transition-transform duration-75 ease-out w-full h-full flex items-center justify-center p-4 will-change-transform"
                    style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
                >
                    <img 
                        src={activeImage} 
                        alt="Canvas Content" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-none select-none" 
                    />
                </div>
              ) : error ? (
                <div className="text-center max-w-sm mx-auto p-8 bg-slate-800/50 rounded-[2.5rem] border border-red-900/20 backdrop-blur-sm relative z-20">
                    <div className="w-16 h-16 bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                       <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-white font-black text-xl mb-3 uppercase tracking-tighter">System Interrupt</h3>
                    <p className="text-slate-400 text-xs mb-8 leading-relaxed font-medium">{error}</p>
                    <Button variant="secondary" onClick={onRetry} className="w-full h-12 rounded-2xl">Retry Synthesis</Button>
                 </div>
              ) : (
                <div className="text-slate-600 flex flex-col items-center select-none pointer-events-none gap-4">
                  <div className="w-20 h-20 bg-slate-800/40 rounded-[2rem] border border-slate-700/30 flex items-center justify-center">
                    <Cpu className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Awaiting Resource Ingestion</p>
                </div>
              )}
          </div>

          {/* Zoom Controls Overlay */}
          {activeImage && !loading && (
             <div 
               className="absolute bottom-6 right-6 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-2 rounded-2xl shadow-2xl z-20"
               onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking controls
             >
                <Tooltip content="Reduce Scale">
                    <button onClick={handleZoomOut} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                </Tooltip>
                <span className="text-[10px] font-black font-mono text-blue-400 min-w-[3.5rem] text-center select-none tracking-widest">{Math.round(scale * 100)}%</span>
                <Tooltip content="Increase Scale">
                    <button onClick={handleZoomIn} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                </Tooltip>
                <div className="w-px h-5 bg-slate-700/50 mx-1" />
                <Tooltip content="Optimize Fit">
                    <button onClick={handleReset} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                        <Maximize className="w-4 h-4" />
                    </button>
                </Tooltip>
             </div>
          )}
       </div>
    </div>
  );
};