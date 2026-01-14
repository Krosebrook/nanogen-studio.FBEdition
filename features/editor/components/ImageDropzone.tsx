import React, { useRef, useState } from 'react';
import { Upload, RefreshCw } from 'lucide-react';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Tooltip } from '@/shared/components/ui/Tooltip';

interface ImageDropzoneProps {
  selectedImage: string | null;
  onFileSelect: (file: File) => void;
  onReset: () => void;
  error?: string | null;
  loading?: boolean;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ 
  selectedImage, 
  onFileSelect, 
  onReset, 
  error,
  loading = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div 
      className={`flex-1 border-dashed rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300 ease-out cursor-pointer min-h-[240px] shadow-inner
        ${isDragging 
          ? 'border-4 border-blue-500 bg-blue-500/10 scale-[1.01] shadow-2xl shadow-blue-500/10' 
          : error 
            ? 'border-2 border-red-500/40 bg-slate-900/50' 
            : 'border-2 border-slate-800 bg-slate-900/50 hover:border-blue-500/50 hover:bg-slate-900/80'
        } ${loading ? 'pointer-events-none' : ''}`}
      onClick={() => !loading && fileInputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-md flex flex-col items-center justify-center animate-fadeIn">
          <div className="bg-slate-900/80 p-6 rounded-[2rem] shadow-2xl border border-slate-800 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
              <Spinner className="w-10 h-10 text-blue-500 relative z-10" />
            </div>
            <div className="text-center space-y-1">
              <span className="block text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">Processing Asset</span>
              <span className="block text-[8px] font-bold uppercase tracking-widest text-slate-500">Normalizing data buffers...</span>
            </div>
          </div>
        </div>
      )}

      {selectedImage ? (
        <div className={`w-full h-full flex items-center justify-center p-6 transition-all duration-500 ${loading ? 'opacity-20 blur-md scale-95' : 'opacity-100 scale-100'}`}>
          <img 
            src={selectedImage} 
            alt="Asset preview" 
            className="max-w-full max-h-[300px] object-contain pointer-events-none select-none rounded-xl shadow-2xl"
          />
        </div>
      ) : (
        <div className={`text-center p-8 pointer-events-none select-none transition-all duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 shadow-xl ${isDragging ? 'bg-blue-600 scale-110 shadow-blue-600/20' : 'bg-slate-800 group-hover:bg-blue-600 group-hover:shadow-blue-600/10'}`}>
            <Upload className={`w-7 h-7 ${isDragging ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
          </div>
          <p className={`font-black text-[14px] uppercase tracking-[0.2em] transition-colors duration-300 ${isDragging ? 'text-blue-400' : 'text-slate-300 group-hover:text-white'}`}>
            {isDragging ? 'Release to Load' : 'Ingest Design Asset'}
          </p>
          <p className={`text-[10px] font-bold uppercase tracking-widest mt-3 transition-colors ${isDragging ? 'text-blue-300/50' : 'text-slate-600'}`}>
            Drop image, browse files, or paste from clipboard
          </p>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={(e) => {
            const file = e.target.files?.[0];
            if(file) onFileSelect(file);
        }} 
        className="hidden" 
        accept="image/*"
      />

      {selectedImage && !loading && (
        <div className="absolute top-4 right-4 z-10">
          <Tooltip content="Remove asset and reset upload zone" side="left">
            <button 
              type="button"
              className="bg-black/40 backdrop-blur-md text-white/60 hover:text-white hover:bg-red-600/80 rounded-full p-2 transition-all border border-white/5" 
              onClick={(e) => { e.stopPropagation(); onReset(); }}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};