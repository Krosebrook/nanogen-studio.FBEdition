import { useState, useCallback, useEffect } from 'react';
import { MerchProduct, MarketingData } from '../types';
import { MERCH_PRODUCTS } from '../data/products';
import { readImageFile } from '@/shared/utils/file';
import { aiCore } from '@/services/ai-core';
import { constructMerchPrompt, getErrorSuggestion, getVariationPrompts } from '../utils';
import { logger } from '@/shared/utils/logger';

export interface TextOverlayState {
  text: string;
  font: string;
  color: string;
  size: number;
  x: number;
  y: number;
  align: 'left' | 'center' | 'right';
  rotation: number;
  skewX: number;
  underline: boolean;
  strikethrough: boolean;
  opacity: number;
  bgEnabled: boolean;
  bgColor: string;
  bgPadding: number;
  bgOpacity: number;
  bgRounding: number;
}

const STORAGE_KEY = 'nanogen_merch_session';

export const useMerchController = (onImageGenerated?: (url: string, prompt: string) => void) => {
  // State Initialization from LocalStorage
  const [assets, setAssets] = useState<{ logo: string | null; bg: string | null }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { logo: parsed.logo || null, bg: parsed.bg || null };
      }
    } catch (e) { logger.error("Store read error", e); }
    return { logo: null, bg: null };
  });

  const [loadingAssets, setLoadingAssets] = useState({ logo: false, bg: false });

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const prod = MERCH_PRODUCTS.find(p => p.id === parsed.productId) || MERCH_PRODUCTS[0];
        return { product: prod, style: parsed.style || '' };
      }
    } catch (e) {}
    return { product: MERCH_PRODUCTS[0], style: '' };
  });

  const [textOverlay, setTextOverlay] = useState<TextOverlayState>(() => {
    const defaultText = {
      text: '', font: 'Inter, sans-serif', color: '#ffffff', size: 40, x: 50, y: 50,
      align: 'center', rotation: 0, skewX: 0, underline: false, strikethrough: false,
      opacity: 100, bgEnabled: false, bgColor: '#000000', bgPadding: 16, bgOpacity: 50, bgRounding: 8
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.textOverlay) return parsed.textOverlay;
      }
    } catch (e) {}
    return defaultText as TextOverlayState;
  });

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New Features State
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [isMarketingGenerating, setIsMarketingGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Persistence Effect
  useEffect(() => {
    const session = {
      logo: assets.logo,
      bg: assets.bg,
      productId: config.product.id,
      style: config.style,
      textOverlay
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [assets, config, textOverlay]);

  const handleAssetUpload = useCallback(async (file: File, type: 'logo' | 'bg') => {
    setLoadingAssets(prev => ({ ...prev, [type]: true }));
    setError(null);
    try {
      const base64 = await readImageFile(file);
      setAssets(prev => ({ ...prev, [type]: base64 }));
      if (type === 'logo') {
        setResultImage(null);
        setVariations([]);
        setVideoUrl(null);
        setMarketingData(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingAssets(prev => ({ ...prev, [type]: false }));
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!assets.logo || loading) return;
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setMarketingData(null);
    try {
      const prompt = constructMerchPrompt(config.product, config.style, !!assets.bg);
      const res = await aiCore.generate(prompt, assets.bg ? [assets.logo, assets.bg] : [assets.logo], {
        model: 'gemini-2.5-flash-image'
      });
      if (res.image) {
        setResultImage(res.image);
        onImageGenerated?.(res.image, prompt);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [assets, config, loading, onImageGenerated]);

  const handleGenerateVariations = useCallback(async () => {
    if (!assets.logo || isGeneratingVariations) return;
    setIsGeneratingVariations(true);
    setError(null);
    try {
      const prompts = getVariationPrompts(config.product, config.style, !!assets.bg);
      const results = await Promise.all(
        prompts.map(p => aiCore.generate(p, assets.bg ? [assets.logo, assets.bg] : [assets.logo], {
          model: 'gemini-2.5-flash-image',
          maxRetries: 1
        }).catch(() => null)) // Swallow individual errors for variations
      );
      const images = results.map(r => r?.image).filter((img): img is string => !!img);
      setVariations(images);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingVariations(false);
    }
  }, [assets, config, isGeneratingVariations]);

  const handleGenerateVideo = useCallback(async () => {
    if (!resultImage || isVideoGenerating) return;
    
    // Check for Paid API Key for Veo
    const studio = (window as any).aistudio;
    if (studio?.hasSelectedApiKey) {
        const hasKey = await studio.hasSelectedApiKey();
        if (!hasKey && studio.openSelectKey) {
            await studio.openSelectKey();
        }
    }

    setIsVideoGenerating(true);
    setError(null);
    try {
      const prompt = `Cinematic slow-motion product reveal of ${config.product.name}. Professional lighting, 4k quality.`;
      const url = await aiCore.generateVideo(prompt, resultImage);
      if (url) setVideoUrl(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVideoGenerating(false);
    }
  }, [resultImage, config.product.name, isVideoGenerating]);

  const handleGenerateMarketing = useCallback(async () => {
      if (!resultImage || isMarketingGenerating) return;
      setIsMarketingGenerating(true);
      setError(null);
      try {
          const data = await aiCore.generateMarketingCopy(config.product.name, resultImage);
          setMarketingData(data);
      } catch (err: any) {
          setError(err.message);
      } finally {
          setIsMarketingGenerating(false);
      }
  }, [resultImage, config.product.name, isMarketingGenerating]);

  const handlePublish = useCallback(async (platformId: string, keys: Record<string, string>) => {
      setIsPublishing(true);
      // Simulate API call to backend service
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsPublishing(false);
      setShowPublishModal(false);
      return true; 
  }, []);

  const clearLogo = () => {
    setAssets(p => ({ ...p, logo: null }));
    setResultImage(null);
    setVariations([]);
    setVideoUrl(null);
    setMarketingData(null);
  };

  const onReset = () => {
    clearLogo();
    setAssets(p => ({ ...p, bg: null }));
    setError(null);
    setConfig({ product: MERCH_PRODUCTS[0], style: '' });
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    logoImage: assets.logo, bgImage: assets.bg, selectedProduct: config.product,
    stylePreference: config.style, resultImage, loading, variations, isGeneratingVariations,
    activeError: error, errorSuggestion: error ? getErrorSuggestion(error, !!assets.bg) : null,
    isUploadingLogo: loadingAssets.logo, isUploadingBg: loadingAssets.bg, textOverlay,
    videoUrl, isVideoGenerating, marketingData, isMarketingGenerating, isPublishing, showPublishModal,
    setSelectedProduct: (p: MerchProduct) => setConfig(prev => ({ ...prev, product: p })),
    setStylePreference: (s: string) => setConfig(prev => ({ ...prev, style: s })),
    setTextOverlay,
    handleLogoUpload: (f: File) => handleAssetUpload(f, 'logo'),
    handleBgUpload: (f: File) => handleAssetUpload(f, 'bg'),
    handleGenerate, handleGenerateVariations,
    handleGenerateVideo, handleGenerateMarketing, handlePublish, setShowPublishModal,
    clearLogo,
    clearBg: () => setAssets(p => ({ ...p, bg: null })),
    clearActiveError: () => setError(null),
    raiseError: (msg: string) => setError(msg),
    onReset
  };
};