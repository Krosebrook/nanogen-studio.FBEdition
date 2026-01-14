import { useState, useCallback, useRef, useEffect } from 'react';
import { aiCore } from '../../services/ai-core';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

interface UseGenAIResult {
  loading: boolean;
  error: string | null;
  resultImage: string | null;
  generate: (imageBase64: string, prompt: string, additionalImages?: string[]) => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

export const useGenAI = (): UseGenAIResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => setError(null), []);
  
  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setError(null);
    setResultImage(null);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const generate = useCallback(async (
    imageBase64: string, 
    prompt: string, 
    additionalImages: string[] = []
  ): Promise<boolean> => {
    if (!imageBase64 || !prompt) return false;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      logger.info(`Generating content with prompt: ${prompt.substring(0, 50)}...`);
      
      const response = await aiCore.generate(
        prompt,
        [imageBase64, ...additionalImages],
        { 
          model: 'gemini-2.5-flash-image',
          maxRetries: 2
        }
      );
      
      if (controller.signal.aborted) return false;

      if (response.image) {
        setResultImage(response.image);
        return true;
      } else if (response.text) {
        logger.warn("Received text-only response from image model");
        return false;
      }
      
      return false;

    } catch (err: unknown) {
      if (controller.signal.aborted) return false;
      
      if (err instanceof Error && (err.name === 'AbortError' || err.message === 'Request aborted')) {
        return false;
      }

      logger.error("GenAI Hook Error:", err);
      
      let errorMessage = "An unexpected error occurred.";
      if (err instanceof AppError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return false;

    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, []);

  return { loading, error, resultImage, generate, clearError, reset };
};