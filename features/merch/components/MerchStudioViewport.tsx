import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { MerchPreview } from './MerchPreview';
import { MerchProduct, MarketingData } from '../types';
import { TextOverlayState } from '../hooks/useMerchState';

interface MerchStudioViewportProps {
  logoImage: string | null;
  loading: boolean;
  resultImage: string | null;
  variations: string[];
  isGeneratingVariations: boolean;
  activeError: string | null;
  errorSuggestion: string | null;
  selectedProduct: MerchProduct;
  stylePreference: string;
  textOverlay: TextOverlayState;
  // New props
  videoUrl?: string | null;
  isVideoGenerating?: boolean;
  isPublishing?: boolean;
  showPublishModal?: boolean;
  onGenerateVariations: () => void;
  onTextOverlayChange: (overlay: TextOverlayState) => void;
  onGenerateVideo?: () => void;
  onPublish?: (platformId: string, keys: Record<string, string>) => Promise<boolean>;
  setShowPublishModal?: (show: boolean) => void;
  onError?: (msg: string) => void;
  onClearError?: () => void;
}

/**
 * MerchStudioViewport Component
 * Displays the main render and manages viewing alternate takes.
 */
export const MerchStudioViewport: React.FC<MerchStudioViewportProps> = ({
  logoImage, loading, resultImage, variations,
  isGeneratingVariations, activeError, errorSuggestion,
  selectedProduct, stylePreference, textOverlay,
  videoUrl, isVideoGenerating, isPublishing, showPublishModal,
  onGenerateVariations, onTextOverlayChange, onGenerateVideo, onPublish, setShowPublishModal,
  onError, onClearError
}) => {
  return (
    <main className="flex flex-col h-full min-h-0 animate-fadeIn" aria-label="Mockup Preview Area">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 shrink-0">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-white flex items-center gap-4 tracking-tighter uppercase">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-blue-500" aria-hidden="true" />
            </div>
            Studio Viewport
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] pl-14">
            Visualizing: <span className="text-blue-400">{selectedProduct.name}</span>
          </p>
        </div>
      </header>

      <section className="flex-1 bg-slate-950 rounded-[3rem] border border-slate-800/40 overflow-hidden relative shadow-2xl min-h-0 ring-1 ring-white/5">
        <MerchPreview 
            logoImage={logoImage}
            loading={loading}
            resultImage={resultImage}
            variations={variations}
            isGeneratingVariations={isGeneratingVariations}
            onGenerateVariations={onGenerateVariations}
            error={activeError}
            errorSuggestion={errorSuggestion}
            productName={selectedProduct.name}
            stylePreference={stylePreference}
            productId={selectedProduct.id}
            textOverlay={textOverlay}
            onTextOverlayChange={onTextOverlayChange}
            videoUrl={videoUrl}
            isVideoGenerating={isVideoGenerating}
            onGenerateVideo={onGenerateVideo}
            isPublishing={isPublishing}
            showPublishModal={showPublishModal}
            setShowPublishModal={setShowPublishModal}
            onPublish={onPublish}
            onError={onError}
            onClearError={onClearError}
        />
      </section>
    </main>
  );
};