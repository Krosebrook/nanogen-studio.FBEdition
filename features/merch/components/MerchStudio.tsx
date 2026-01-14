import React from 'react';
import { useMerchController } from '../hooks/useMerchState';
import { MerchStudioSidebar } from './MerchStudioSidebar';
import { MerchStudioViewport } from './MerchStudioViewport';

interface MerchStudioProps {
  onImageGenerated: (url: string, prompt: string) => void;
}

export const MerchStudio: React.FC<MerchStudioProps> = ({ onImageGenerated }) => {
  const {
    logoImage, bgImage, selectedProduct, stylePreference,
    resultImage, loading, variations, isGeneratingVariations,
    activeError, errorSuggestion,
    isUploadingLogo, isUploadingBg,
    textOverlay,
    videoUrl, isVideoGenerating, marketingData, isMarketingGenerating, isPublishing, showPublishModal,
    setSelectedProduct, setStylePreference, setTextOverlay,
    handleLogoUpload, handleBgUpload, handleGenerate, handleGenerateVariations,
    handleGenerateVideo, handleGenerateMarketing, handlePublish, setShowPublishModal,
    clearLogo, clearBg, clearActiveError, raiseError, onReset
  } = useMerchController(onImageGenerated);

  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-[clamp(340px,30%,420px)_1fr] gap-8 xl:gap-12 h-full lg:h-[calc(100vh-180px)] min-h-0 w-full animate-fadeIn"
      aria-label="Merch Design Workspace"
    >
      {/* 
        Side Navigation & Controls
        - DOM Order: 1 (Ensures correct tab order on Desktop: Left -> Right)
        - Mobile: Pushed to bottom via order-last
        - Desktop: Visual Order 1 via order-first (Restores left column placement)
      */}
      <aside 
        className="h-full min-h-0 overflow-hidden flex flex-col order-last lg:order-first"
        aria-label="Design Configuration"
      >
        <MerchStudioSidebar 
          logoImage={logoImage}
          bgImage={bgImage}
          selectedProduct={selectedProduct}
          stylePreference={stylePreference}
          textOverlay={textOverlay}
          loading={loading}
          resultImage={resultImage}
          isGeneratingVariations={isGeneratingVariations}
          isUploadingLogo={isUploadingLogo}
          isUploadingBg={isUploadingBg}
          activeError={activeError}
          errorSuggestion={errorSuggestion}
          marketingData={marketingData}
          isMarketingGenerating={isMarketingGenerating}
          onSelectProduct={setSelectedProduct}
          onStyleChange={setStylePreference}
          onTextOverlayChange={setTextOverlay}
          onLogoUpload={handleLogoUpload}
          onBgUpload={handleBgUpload}
          onGenerate={handleGenerate}
          onGenerateVariations={handleGenerateVariations}
          onGenerateMarketing={handleGenerateMarketing}
          onClearLogo={clearLogo}
          onClearBg={clearBg}
          onClearError={clearActiveError}
          onReset={onReset}
        />
      </aside>

      {/* 
        Main Preview Viewport
        - DOM Order: 2
        - Mobile: Visual Order 1 (Top)
        - Desktop: Visual Order 2 (Right column)
      */}
      <section 
        className="h-full min-h-0 overflow-hidden flex flex-col"
        aria-label="Preview Canvas"
      >
        <MerchStudioViewport 
          logoImage={logoImage}
          loading={loading}
          resultImage={resultImage}
          variations={variations}
          isGeneratingVariations={isGeneratingVariations}
          activeError={activeError}
          errorSuggestion={errorSuggestion}
          selectedProduct={selectedProduct}
          stylePreference={stylePreference}
          textOverlay={textOverlay}
          videoUrl={videoUrl}
          isVideoGenerating={isVideoGenerating}
          isPublishing={isPublishing}
          showPublishModal={showPublishModal}
          onGenerateVariations={handleGenerateVariations}
          onTextOverlayChange={setTextOverlay}
          onGenerateVideo={handleGenerateVideo}
          onPublish={handlePublish}
          setShowPublishModal={setShowPublishModal}
          onError={raiseError}
          onClearError={clearActiveError}
        />
      </section>
    </div>
  );
};