import React from 'react';
import { Settings2, RotateCcw, Layers, Sparkles, Lightbulb, Grid, FileText, AlertTriangle } from 'lucide-react';
import { Tooltip, Button, Alert } from '@/shared/components/ui';
import { StepSection } from './StepSection';
import { ProductGrid } from './ProductGrid';
import { UploadArea } from './UploadArea';
import { StyleSelector } from './StyleSelector';
import { TextOverlayControls } from './TextOverlayControls';
import { MarketingResults } from './MarketingResults';
import { MerchProduct, MarketingData } from '../types';
import { TextOverlayState } from '../hooks/useMerchState';

interface MerchStudioSidebarProps {
  logoImage: string | null;
  bgImage: string | null;
  selectedProduct: MerchProduct;
  stylePreference: string;
  textOverlay: TextOverlayState;
  loading: boolean;
  resultImage: string | null;
  isGeneratingVariations: boolean;
  isUploadingLogo: boolean;
  isUploadingBg: boolean;
  activeError: string | null;
  errorSuggestion: string | null;
  marketingData?: MarketingData | null;
  isMarketingGenerating?: boolean;
  onSelectProduct: (product: MerchProduct) => void;
  onStyleChange: (style: string) => void;
  onTextOverlayChange: (overlay: TextOverlayState) => void;
  onLogoUpload: (file: File) => void;
  onBgUpload: (file: File) => void;
  onGenerate: () => void;
  onGenerateVariations: () => void;
  onGenerateMarketing?: () => void;
  onClearLogo: () => void;
  onClearBg: () => void;
  onClearError: () => void;
  onReset: () => void;
}

export const MerchStudioSidebar: React.FC<MerchStudioSidebarProps> = ({
  logoImage, bgImage, selectedProduct, stylePreference, textOverlay,
  loading, resultImage, isGeneratingVariations, isUploadingLogo, isUploadingBg,
  activeError, errorSuggestion, marketingData, isMarketingGenerating,
  onSelectProduct, onStyleChange, onTextOverlayChange,
  onLogoUpload, onBgUpload, onGenerate, onGenerateVariations, onGenerateMarketing,
  onClearLogo, onClearBg, onClearError, onReset
}) => {
  const isGenerateDisabled = !logoImage || isUploadingLogo || isUploadingBg || loading || isGeneratingVariations;

  // Determine an appropriate title for the alert based on the error content
  const getErrorTitle = (msg: string | null) => {
    if (!msg) return "Error";
    const m = msg.toLowerCase();
    if (m.includes('size') || m.includes('limit') || m.includes('large')) return "File Too Large";
    if (m.includes('valid') || m.includes('type') || m.includes('format')) return "Invalid File Type";
    if (m.includes('network') || m.includes('connection')) return "Network Error";
    return "Pipeline Interrupted";
  };

  return (
    <aside 
      className="flex flex-col h-full bg-slate-900/50 rounded-[2rem] border border-slate-800/40 overflow-hidden shadow-2xl"
      aria-label="Design Configuration Sidebar"
    >
      <header className="p-6 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
            <Settings2 className="w-4 h-4 text-blue-500" aria-hidden="true" />
          </div>
          <h2 className="font-black text-slate-200 uppercase tracking-[0.2em] text-[10px]">Studio Pipeline</h2>
        </div>
        <Tooltip content="Reset all current assets, configuration, and generated results to start a completely new design session" side="left">
          <button 
            type="button"
            onClick={onReset}
            className="p-2 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Reset design session"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
          </button>
        </Tooltip>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 gap-6 p-6 animate-fadeIn">
          <StepSection number={1} title="Identity Asset">
            <UploadArea 
              image={logoImage} 
              onFileSelect={onLogoUpload} 
              placeholder="Attach Brand Logo"
              onClear={logoImage ? onClearLogo : undefined}
              loading={isUploadingLogo}
            />
          </StepSection>

          <StepSection number={2} title="Base Product">
            <ProductGrid selectedId={selectedProduct.id} onSelect={onSelectProduct} />
          </StepSection>

          <StepSection number={3} title="Environment">
            <UploadArea 
              image={bgImage}
              onFileSelect={onBgUpload}
              onClear={onClearBg}
              placeholder="Custom Scene (Optional)"
              loading={isUploadingBg}
            />
          </StepSection>

          <StepSection number={4} title="Visual Direction">
            <StyleSelector 
              value={stylePreference} 
              onChange={onStyleChange} 
              productName={selectedProduct.name}
            />
          </StepSection>

          <StepSection number={5} title="Dynamic Typography" badge="Optional">
            <TextOverlayControls 
              overlay={textOverlay}
              onChange={onTextOverlayChange}
              disabled={!logoImage}
            />
          </StepSection>

          <StepSection number={6} title="Style Variants" badge="AI Powered">
             <div className="space-y-4">
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed px-1">
                 Synthesize 3 additional mockup variations with slightly modified camera angles and studio lighting setups.
               </p>
               <Tooltip content="Explore alternative perspectives and lighting setups for your current design" side="top">
                 <Button 
                    variant="outline"
                    onClick={onGenerateVariations}
                    loading={isGeneratingVariations}
                    loadingText="Exploring Variations..."
                    disabled={!resultImage || loading}
                    icon={<Grid className="w-4 h-4" />}
                    className="w-full h-12 rounded-xl text-[9px] tracking-widest uppercase font-black border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/5"
                    aria-label="Generate alternate takes"
                 >
                   Explore Variations
                 </Button>
               </Tooltip>
             </div>
          </StepSection>

          <StepSection number={7} title="Marketing Assets" badge="New">
             <div className="space-y-4">
               {!marketingData ? (
                 <>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed px-1">
                     Generate SEO-optimized product titles, descriptions, and tags based on visual analysis.
                   </p>
                   <Tooltip content="Use AI to analyze your mockup and generate optimization marketing copy for e-commerce platforms" className="w-full">
                     <Button 
                        variant="outline"
                        onClick={onGenerateMarketing}
                        loading={isMarketingGenerating}
                        loadingText="Writing Copy..."
                        disabled={!resultImage}
                        icon={<FileText className="w-4 h-4" />}
                        className="w-full h-12 rounded-xl text-[9px] tracking-widest uppercase font-black border-amber-500/20 text-amber-400 hover:bg-amber-500/5"
                     >
                       Generate Copy
                     </Button>
                   </Tooltip>
                 </>
               ) : (
                 <MarketingResults data={marketingData} />
               )}
             </div>
          </StepSection>

          {activeError && (
            <div className="space-y-4 pb-8 animate-fadeIn" role="alert" aria-live="assertive">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-red-500/10 rounded-2xl blur opacity-30"></div>
                <Alert 
                  variant="error"
                  title={getErrorTitle(activeError)}
                  message={activeError} 
                  onDismiss={onClearError} 
                />
              </div>
              
              {errorSuggestion && (
                <div className="bg-slate-900 border border-blue-500/20 p-5 rounded-2xl flex gap-4 items-start shadow-xl relative overflow-hidden group/diag ring-1 ring-blue-500/10">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40"></div>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-inner">
                    <Lightbulb className="w-4 h-4 text-blue-400 animate-pulse" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      Suggested Fix
                    </span>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      {errorSuggestion}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <footer className="p-6 bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800 shadow-[0_-15px_30px_rgba(0,0,0,0.4)] shrink-0">
        <div className="grid grid-cols-2 gap-4">
          <Tooltip content="Synthesize your logo and configuration into a professional high-fidelity master mockup render" side="top" className="w-full">
            <Button 
              onClick={onGenerate} 
              loading={loading}
              loadingText="Synthesizing..."
              disabled={isGenerateDisabled}
              icon={<Layers className="w-5 h-5" />}
              className="w-full h-14 rounded-2xl shadow-xl shadow-blue-600/10 text-[9px] tracking-widest uppercase font-black"
              aria-label={resultImage ? "Re-render primary mockup" : "Generate master mockup"}
            >
              {resultImage ? 'Update Master' : 'Generate Mockup'}
            </Button>
          </Tooltip>

          <Tooltip content="Generate 3 alternative mockups with slightly different lighting and camera angles based on your design" side="top" className="w-full">
             <Button 
                variant="indigo"
                onClick={onGenerateVariations}
                loading={isGeneratingVariations}
                loadingText="Exploring..."
                disabled={!logoImage || loading}
                icon={<Sparkles className="w-4 h-4" />}
                className="w-full h-14 rounded-2xl shadow-xl shadow-indigo-600/10 text-[9px] tracking-widest uppercase font-black"
                aria-label="Generate alternative takes"
             >
               Variations
             </Button>
          </Tooltip>
        </div>
      </footer>
    </aside>
  );
};