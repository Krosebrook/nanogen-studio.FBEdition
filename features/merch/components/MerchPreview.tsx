import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Spinner, Button, Tooltip, Badge } from '@/shared/components/ui';
import { ShoppingBag, Download, AlertCircle, Layers, FileDown, Image as ImageIcon, Video, PlayCircle, ExternalLink, Zap, Sliders } from 'lucide-react';
import { saveImage, ExportFormat } from '@/shared/utils/image';
import { MerchVariations } from './MerchVariations';
import { PublishModal } from './PublishModal';
import { TextOverlayState } from '../hooks/useMerchState';

interface MerchPreviewProps {
  logoImage: string | null;
  loading: boolean;
  resultImage: string | null;
  variations: string[];
  isGeneratingVariations: boolean;
  onGenerateVariations: () => void;
  error: string | null;
  errorSuggestion: string | null;
  productName: string;
  stylePreference: string;
  productId: string;
  textOverlay?: TextOverlayState;
  onTextOverlayChange?: (overlay: TextOverlayState) => void;
  videoUrl?: string | null;
  isVideoGenerating?: boolean;
  onGenerateVideo?: () => void;
  isPublishing?: boolean;
  showPublishModal?: boolean;
  setShowPublishModal?: (show: boolean) => void;
  onPublish?: (platformId: string, keys: Record<string, string>) => Promise<boolean>;
  onError?: (msg: string) => void;
  onClearError?: () => void;
}

export const MerchPreview: React.FC<MerchPreviewProps> = ({
  logoImage, loading, resultImage, variations,
  isGeneratingVariations, onGenerateVariations, error, errorSuggestion,
  productName, stylePreference, productId, textOverlay, onTextOverlayChange,
  videoUrl, isVideoGenerating, onGenerateVideo,
  isPublishing, showPublishModal, setShowPublishModal, onPublish,
  onError, onClearError
}) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [jpgQuality, setJpgQuality] = useState(90);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{current: number, total: number} | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'image' | 'video'>('image');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const activeImage = viewImage || resultImage;

  useEffect(() => {
    if (videoUrl) setViewMode('video');
  }, [videoUrl]);

  const handleExport = async (img: string, label: string = 'master') => {
    onClearError?.();
    setIsExporting(true);
    const filename = `${label}-${productId}-${Date.now()}`;
    try {
      await saveImage(img, filename, exportFormat, 2, textOverlay, jpgQuality / 100);
    } catch (err: any) {
      console.error("EXPORT_FAILURE:", err);
      onError?.(err instanceof Error ? err.message : "EXPORT_FAILURE: Unknown error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAllVariations = async () => {
    if (variations.length === 0) return;
    onClearError?.();
    setIsExporting(true);
    setExportProgress({ current: 0, total: variations.length });
    
    try {
      for (let i = 0; i < variations.length; i++) {
        setExportProgress({ current: i + 1, total: variations.length });
        await saveImage(variations[i], `variation-${i+1}-${productId}`, exportFormat, 2, textOverlay, jpgQuality / 100);
        await new Promise(r => setTimeout(r, 400));
      }
    } catch (err: any) {
      console.error("BATCH_EXPORT_FAILURE:", err);
      onError?.(err instanceof Error ? err.message : "EXPORT_FAILURE: Batch export interrupted");
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(null), 2000);
    }
  };

  const handleTextDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0 || !textRef.current || !containerRef.current) return;
    e.preventDefault();
    e.stopPropagation(); // Critical to prevent bubbling to parent zoom handlers if they exist
    
    const textRect = textRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - textRect.left - (textRect.width / 2),
      y: e.clientY - textRect.top - (textRect.height / 2)
    });
    
    setIsDraggingText(true);
    document.body.style.cursor = 'grabbing';
  };

  const handleTextDragMove = useCallback((e: MouseEvent) => {
    if (!isDraggingText || !containerRef.current || !onTextOverlayChange || !textOverlay) return;
    if (rafRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    rafRef.current = requestAnimationFrame(() => {
      const x = ((e.clientX - dragOffset.x - rect.left) / rect.width) * 100;
      const y = ((e.clientY - dragOffset.y - rect.top) / rect.height) * 100;
      
      onTextOverlayChange({
        ...textOverlay,
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y))
      });
      rafRef.current = null;
    });
  }, [isDraggingText, onTextOverlayChange, textOverlay, dragOffset]);

  const handleTextDragEnd = useCallback(() => {
    setIsDraggingText(false);
    document.body.style.cursor = '';
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isDraggingText) {
      window.addEventListener('mousemove', handleTextDragMove);
      window.addEventListener('mouseup', handleTextDragEnd);
      window.addEventListener('blur', handleTextDragEnd);
    } else {
      window.removeEventListener('mousemove', handleTextDragMove);
      window.removeEventListener('mouseup', handleTextDragEnd);
      window.removeEventListener('blur', handleTextDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleTextDragMove);
      window.removeEventListener('mouseup', handleTextDragEnd);
      window.removeEventListener('blur', handleTextDragEnd);
    };
  }, [isDraggingText, handleTextDragMove, handleTextDragEnd]);

  const getTransform = (align: string = 'center', rotation: number = 0, skew: number = 0) => {
    let xOffset = '-50%';
    if (align === 'left') xOffset = '0%';
    if (align === 'right') xOffset = '-100%';
    // Apply translate, then rotate, then skew.
    return `translate(${xOffset}, -50%) rotate(${rotation}deg) skewX(${skew}deg)`;
  };

  const getRgbaColor = (hex: string, opacity: number) => {
    let r = 0, g = 0, b = 0;
    // Strip hash
    const h = hex.startsWith('#') ? hex.slice(1) : hex;
    
    if (h.length === 3) {
      r = parseInt(h[0] + h[0], 16);
      g = parseInt(h[1] + h[1], 16);
      b = parseInt(h[2] + h[2], 16);
    } else if (h.length === 6) {
      r = parseInt(h.substring(0, 2), 16);
      g = parseInt(h.substring(2, 4), 16);
      b = parseInt(h.substring(4, 6), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const getComputedStyles = (): React.CSSProperties => {
    if (!textOverlay) return {};
    
    return {
      left: `${textOverlay.x}%`,
      top: `${textOverlay.y}%`,
      transform: getTransform(textOverlay.align, textOverlay.rotation, textOverlay.skewX),
      transformOrigin: 'center center',
      fontFamily: textOverlay.font,
      fontSize: `${textOverlay.size}px`,
      color: textOverlay.color,
      textAlign: textOverlay.align,
      opacity: (textOverlay.opacity ?? 100) / 100,
      backgroundColor: textOverlay.bgEnabled 
        ? getRgbaColor(textOverlay.bgColor, textOverlay.bgOpacity ?? 50) 
        : undefined,
      padding: textOverlay.bgEnabled ? `${textOverlay.bgPadding ?? 16}px` : undefined,
      borderRadius: textOverlay.bgEnabled ? `${textOverlay.bgRounding ?? 8}px` : undefined,
      whiteSpace: 'pre-wrap',
      width: 'max-content',
      maxWidth: '100%'
    };
  };

  return (
    <div className="flex flex-col h-full gap-8 p-1">
      <div className="bg-[#05070a] rounded-[3rem] border border-slate-800 p-0.5 relative overflow-hidden flex flex-col flex-1 shadow-inner group/preview">
        {/* Top Status Bar */}
        <div className="absolute top-8 left-8 right-8 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-3">
            <Badge variant="blue" icon={<Zap className="w-3 h-3" />}>RENDER: {productName}</Badge>
            {stylePreference && <Badge variant="indigo">STYLE: {stylePreference}</Badge>}
            {exportProgress && (
              <Badge variant="success" icon={<FileDown className="w-3 h-3 animate-bounce" />}>
                EXPORTING: {exportProgress.current}/{exportProgress.total}
              </Badge>
            )}
          </div>
          
          {videoUrl && (
             <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 rounded-xl p-1 border border-slate-700 shadow-xl backdrop-blur-md">
                <Tooltip content="Switch to Image Mode">
                  <button 
                    onClick={() => setViewMode('image')} 
                    className={`p-2 rounded-lg transition-all ${viewMode === 'image' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </Tooltip>
                <div className="w-px h-4 bg-slate-700/50" />
                <Tooltip content="Switch to Video Mode">
                  <button 
                    onClick={() => setViewMode('video')} 
                    className={`p-2 rounded-lg transition-all ${viewMode === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </Tooltip>
             </div>
          )}
        </div>

        <div ref={containerRef} className="flex-1 flex items-center justify-center relative overflow-hidden group/canvas bg-slate-950">
          {loading || isVideoGenerating ? (
            <div className="flex flex-col items-center gap-6 animate-fadeIn" aria-live="polite">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                <Spinner className="w-12 h-12 text-blue-500 relative z-10" />
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                {isVideoGenerating ? 'Rendering Video (Veo 3.1)...' : 'Synthesizing Master...'}
              </p>
            </div>
          ) : viewMode === 'video' && videoUrl ? (
            <div className="w-full h-full flex items-center justify-center bg-black animate-fadeIn">
               <video 
                 src={videoUrl} 
                 controls 
                 autoPlay 
                 loop 
                 playsInline
                 className="max-w-full max-h-full object-contain focus:outline-none"
               />
            </div>
          ) : activeImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-12 select-none group/image">
              <img src={activeImage} alt="Mockup preview" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-fadeIn" />
              {textOverlay?.text && (
                 <div
                   ref={textRef}
                   onMouseDown={handleTextDragStart}
                   className={`absolute cursor-grab active:cursor-grabbing select-none z-30 transition-all focus:ring-2 focus:ring-blue-500 rounded px-1 ${isDraggingText ? 'scale-105 ring-2 ring-blue-500/50' : ''}`}
                   style={getComputedStyles()}
                 >
                   {textOverlay.text}
                 </div>
              )}
            </div>
          ) : error ? (
            <div className="text-center max-w-sm px-10 animate-fadeIn" role="alert">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-black text-white mb-3 uppercase tracking-tighter">System Interrupt</h2>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed font-medium">{error}</p>
              {errorSuggestion && (
                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-[10px] text-blue-400 font-bold uppercase tracking-widest text-left">
                  <span className="block text-blue-500 mb-1 opacity-50">Suggestion:</span>
                  {errorSuggestion}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center opacity-20">
              <ShoppingBag className="w-24 h-24 mx-auto mb-4" aria-hidden="true" />
              <h2 className="text-xl font-black uppercase tracking-tighter">Viewport Idle</h2>
            </div>
          )}
        </div>

        {activeImage && (
          <div className="p-8 bg-slate-900/80 backdrop-blur-2xl border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-2xl border border-slate-700">
              <div className="flex gap-1 p-1 bg-slate-900 rounded-xl">
                {(['png', 'jpg', 'webp'] as ExportFormat[]).map(fmt => (
                  <Tooltip key={fmt} content={`Export result in ${fmt.toUpperCase()} format`}>
                    <button
                      onClick={() => setExportFormat(fmt)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${exportFormat === fmt ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {fmt}
                    </button>
                  </Tooltip>
                ))}
              </div>
              {exportFormat !== 'png' && (
                <div className="flex items-center gap-3 px-2 border-l border-slate-700">
                  <Tooltip content="Adjust export quality">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-slate-500" />
                      <input 
                        type="range" min="10" max="100" value={jpgQuality} 
                        onChange={(e) => setJpgQuality(parseInt(e.target.value))}
                        className="w-20 accent-blue-600 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-blue-400 font-black min-w-[2.5rem]">{jpgQuality}%</span>
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Tooltip content="Generate a cinematic 5-second product reveal video using Veo 3.1" side="top">
                <Button 
                   variant="secondary" 
                   onClick={onGenerateVideo} 
                   loading={isVideoGenerating}
                   disabled={loading}
                   icon={<PlayCircle className="w-4 h-4" />}
                >
                   Animate (Veo)
                </Button>
              </Tooltip>

              {variations.length > 0 && (
                <Tooltip content="Batch export all generated variations at once in the selected format" side="top">
                  <Button variant="secondary" onClick={handleExportAllVariations} loading={isExporting && !!exportProgress} icon={<Layers className="w-4 h-4" />}>Export All</Button>
                </Tooltip>
              )}
              
              <Tooltip content="Directly publish to connected merchant platforms like Shopify or Etsy" side="top">
                <Button 
                   variant="outline" 
                   onClick={() => setShowPublishModal?.(true)} 
                   icon={<ExternalLink className="w-4 h-4" />}
                >
                   Publish
                </Button>
              </Tooltip>

              <Tooltip content="Download current master mockup at high resolution" side="top">
                <Button onClick={() => handleExport(activeImage)} loading={isExporting && !exportProgress} icon={<Download className="w-4 h-4" />}>Export</Button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>

      <MerchVariations 
        variations={variations} 
        isGenerating={isGeneratingVariations} 
        activeImage={activeImage} 
        resultImage={resultImage} 
        onViewImage={setViewImage}
        onGenerate={onGenerateVariations}
        disabled={loading}
      />

      {showPublishModal && onPublish && (
         <PublishModal 
           onClose={() => setShowPublishModal(false)}
           onPublish={onPublish}
           isPublishing={isPublishing || false}
         />
      )}
    </div>
  );
};