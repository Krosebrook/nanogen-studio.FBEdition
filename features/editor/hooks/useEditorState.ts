import { useState, useCallback, useEffect } from 'react';
import { aiCore, AIModel, AspectRatio, ImageSize } from '@/services/ai-core';
import { readImageFile } from '@/shared/utils/file';
import { logger } from '@/shared/utils/logger';

const STORAGE_KEY = 'nanogen_editor_session';

export const useEditorState = (onImageGenerated?: (url: string, prompt: string) => void) => {
  // Load initial state from LocalStorage
  const [model, setModel] = useState<AIModel>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.model || 'gemini-2.5-flash-image';
      } catch (e) {}
    }
    return 'gemini-2.5-flash-image';
  });

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [imageSize, setImageSize] = useState<ImageSize>("1K");
  const [useSearch, setUseSearch] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [isProKeySelected, setIsProKeySelected] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.selectedImage || null;
      } catch (e) {}
    }
    return null;
  });

  const [prompt, setPrompt] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.prompt || '';
      } catch (e) {}
    }
    return '';
  });

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persistence Effect
  useEffect(() => {
    const session = {
      model,
      selectedImage,
      prompt
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [model, selectedImage, prompt]);

  useEffect(() => {
    const checkKeySelection = async () => {
      const studio = (window as any).aistudio;
      if (studio?.hasSelectedApiKey) {
        const hasKey = await studio.hasSelectedApiKey();
        setIsProKeySelected(hasKey);
      }
    };
    checkKeySelection();
  }, []);

  const handleModelChange = async (newModel: AIModel) => {
    const studio = (window as any).aistudio;
    if (newModel === 'gemini-3-pro-image-preview' && !isProKeySelected) {
      if (studio?.openSelectKey) {
        await studio.openSelectKey();
        setIsProKeySelected(true);
      }
    }
    setModel(newModel);
  };

  const handleSearchToggle = async (enabled: boolean) => {
    setUseSearch(enabled);
    // Search tool is only supported on Pro Image model for image generation
    if (enabled && model !== 'gemini-3-pro-image-preview') {
      await handleModelChange('gemini-3-pro-image-preview');
    }
  };

  const processFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      logger.info(`Processing file: ${file.name}`);
      const base64 = await readImageFile(file);
      setSelectedImage(base64);
      setResultImage(null);
      setAnalysisResult(null);
      setGroundingSources([]);
    } catch (err: any) {
      setError(err.message || "Failed to process image.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePromptImageDrop = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const base64 = await readImageFile(file);
      setSelectedImage(base64);
      setResultImage(null);
      // Generate prompt from image using Flash text model, passing useSearch to allow web referencing
      const res = await aiCore.generate(
        "Describe this image in detail. This description will be used as a prompt for an AI image editor. Focus on the subject, style, and artistic elements. Keep it under 60 words.",
        [base64],
        { 
          model: 'gemini-3-flash-preview',
          useSearch 
        }
      );
      if (res.text) setPrompt(res.text.trim());
    } catch (err: any) {
      setError(err.message || "Failed to process image drop.");
    } finally {
      setLoading(false);
    }
  }, [useSearch]);

  const handleAIRequest = async (intent: 'generate' | 'analyze') => {
    if (intent === 'generate' && !prompt) return;
    if (intent === 'analyze' && !selectedImage) return;

    setLoading(true);
    setError(null);
    setGroundingSources([]);

    try {
      const targetModel = intent === 'analyze' ? 'gemini-3-pro-preview' : model;
      const res = await aiCore.generate(
        intent === 'analyze' ? (prompt || "Explain the visual elements.") : prompt,
        selectedImage ? [selectedImage] : [],
        {
          model: targetModel,
          aspectRatio,
          imageSize,
          useSearch,
          thinkingBudget: useThinking ? 32768 : undefined,
          systemInstruction: intent === 'analyze' 
            ? "Context: Professional Art Analyst." 
            : "Context: Creative Image Editor."
        }
      );

      if (intent === 'analyze') {
        setAnalysisResult(res.text || "Analysis complete.");
      } else {
        if (res.image) {
          setResultImage(res.image);
          onImageGenerated?.(res.image, prompt);
        } else if (res.text) {
          setAnalysisResult(res.text);
        }
      }
      if (res.groundingSources) setGroundingSources(res.groundingSources);
    } catch (err: any) {
      setError(err.message || "Internal generation error.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setResultImage(null);
    setAnalysisResult(null);
    setPrompt('');
    setError(null);
    setGroundingSources([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    model, handleModelChange,
    aspectRatio, setAspectRatio,
    imageSize, setImageSize,
    useSearch, setUseSearch: handleSearchToggle,
    useThinking, setUseThinking,
    isProKeySelected,
    selectedImage,
    prompt, setPrompt,
    resultImage,
    analysisResult,
    groundingSources,
    loading,
    error,
    processFile,
    handlePromptImageDrop,
    handleGenerate: () => handleAIRequest('generate'),
    handleAnalyze: () => handleAIRequest('analyze'),
    handleReset,
    clearAllErrors: useCallback(() => setError(null), [])
  };
};