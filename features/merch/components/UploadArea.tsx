import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Tooltip } from '@/shared/components/ui';

interface UploadAreaProps {
  image: string | null;
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  accept?: string;
  loading?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ 
  image, 
  onFileSelect, 
  onClear, 
  placeholder = "Upload Image", 
  className = "",
  accept = "image/*",
  loading = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClear?.();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div 
      className={`space-y-2 group/upload ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {loading ? (
        <div 
          className="border-2 border-dashed border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center min-h-[160px] bg-slate-900/50 relative overflow-hidden transition-all"
          aria-live="polite"
        >
           <div className="absolute inset-0 bg-slate-900/80 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
             <Spinner className="w-8 h-8 text-blue-500 mb-3" />
             <span className="text-sm text-slate-300 font-medium animate-pulse">Processing Image...</span>
           </div>
        </div>
      ) : image ? (
         <div className={`relative border border-slate-600 rounded-lg overflow-hidden group bg-slate-900/50 aspect-video flex items-center justify-center transition-all ${isDragging ? 'border-blue-500 scale-[1.02] ring-4 ring-blue-500/10' : ''}`}>
           <img src={image} alt="Uploaded asset preview" className="max-w-full max-h-full object-contain" />
           <Tooltip content="Choose a different image file to replace the current design asset.">
              <button 
                type="button"
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity focus:opacity-100 outline-none" 
                onClick={() => inputRef.current?.click()}
                aria-label="Replace current image"
              >
                <span className="text-white text-sm font-medium flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600 shadow-lg">
                  <Upload className="w-4 h-4" aria-hidden="true" /> Change Image
                </span>
              </button>
           </Tooltip>
           {onClear && (
             <div className="absolute top-2 right-2 z-10">
               <Tooltip content="Clear this asset and reset the upload state for a fresh start." side="left">
                 <button 
                   type="button"
                   onClick={handleClear}
                   className="bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500/80 transition-colors focus:ring-2 focus:ring-red-500 outline-none"
                   aria-label="Remove image"
                 >
                   <X className="w-4 h-4" aria-hidden="true" />
                 </button>
               </Tooltip>
             </div>
           )}
         </div>
      ) : (
         <Tooltip content="Click to browse or drag and drop an image file (PNG, JPG, or WEBP) to use as your logo or background scene.">
           <button 
             type="button"
             onClick={() => inputRef.current?.click()}
             onKeyDown={handleKeyDown}
             className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all group min-h-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
               isDragging 
                 ? 'border-blue-500 bg-blue-500/10 scale-[1.02] ring-4 ring-blue-500/5 shadow-2xl shadow-blue-500/10' 
                 : 'border-slate-600 hover:bg-slate-700/50 hover:border-blue-500'
             }`}
             aria-label={placeholder}
           >
             <div className={`w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 transition-colors shadow-lg ${isDragging ? 'bg-blue-600' : 'group-hover:bg-blue-500/20'}`}>
                <Upload className={`w-6 h-6 transition-colors ${isDragging ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} aria-hidden="true" />
             </div>
             <span className={`text-sm font-medium transition-colors mb-2 ${isDragging ? 'text-blue-200' : 'text-slate-300 group-hover:text-white'}`}>
               {isDragging ? 'Drop Image Here' : placeholder}
             </span>
             
             <div className="flex gap-1.5 mt-2" aria-hidden="true">
               <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700 font-medium">PNG</span>
               <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700 font-medium">JPG</span>
               <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700 font-medium">WEBP</span>
             </div>
           </button>
         </Tooltip>
      )}
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleChange} 
        className="hidden" 
        accept={accept} 
        tabIndex={-1}
      />
    </div>
  );
};