import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { AppError, ApiError, AuthenticationError, SafetyError, RateLimitError } from '../shared/utils/errors';
import { cleanBase64, getMimeType } from '../shared/utils/image';
import { logger } from '../shared/utils/logger';

// Unified Model Type Definition
export type AIModel = 
  | 'gemini-3-flash-preview' 
  | 'gemini-3-pro-preview' 
  | 'gemini-2.5-flash-image' 
  | 'gemini-3-pro-image-preview'
  | 'gemini-2.5-flash-lite-latest'
  | 'veo-3.1-fast-generate-preview';

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "2:3" | "3:2" | "21:9";
export type ImageSize = "1K" | "2K" | "4K";

export interface AIRequestConfig {
  model: AIModel;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
  thinkingBudget?: number;
  maxOutputTokens?: number;
  useSearch?: boolean;
  systemInstruction?: string;
  responseMimeType?: string;
  maxRetries?: number;
  seed?: number;
  temperature?: number;
}

export interface AIResponse {
  text?: string;
  image?: string;
  groundingSources?: any[];
  finishReason?: string;
}

export interface MarketingCopyData {
  title: string;
  description: string;
  tags: string[];
}

class AICoreService {
  private static instance: AICoreService;
  private readonly DEFAULT_RETRIES = 3;

  private constructor() {}

  public static getInstance(): AICoreService {
    if (!AICoreService.instance) AICoreService.instance = new AICoreService();
    return AICoreService.instance;
  }

  /**
   * Retrieves the API key.
   */
  private getApiKey(): string {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new AuthenticationError("API_KEY_MISSING: Environment key unavailable. Please check your .env configuration.");
    return apiKey;
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Maps raw errors to strongly-typed AppError subclasses with user-friendly messages.
   */
  private normalizeError(error: any): AppError {
    if (error instanceof AppError) return error;
    
    // Extract deep error message (Google GenAI often nests errors)
    const rawMessage = error?.message || error?.toString() || "Unknown error";
    const status = error?.status || error?.response?.status;
    const lowerMsg = rawMessage.toLowerCase();

    // 1. Rate Limiting & Quotas (429)
    if (status === 429 || lowerMsg.includes("429") || lowerMsg.includes("quota") || lowerMsg.includes("exhausted")) {
       return new RateLimitError(); // Default message is "Generation throughput exceeded..."
    }

    // 2. Authentication & Billing (400/401/403)
    if (status === 401 || lowerMsg.includes("api key") || lowerMsg.includes("unauthenticated")) {
       return new AuthenticationError("INVALID_API_KEY: The provided API key is invalid or expired. Please update your credentials.");
    }
    
    if (status === 403 || lowerMsg.includes("permission denied")) {
       if (lowerMsg.includes("billing")) {
         return new AuthenticationError("BILLING_REQUIRED: The Google Cloud Project for this key needs billing enabled.");
       }
       if (lowerMsg.includes("location") || lowerMsg.includes("region")) {
         return new AuthenticationError("GEO_RESTRICTION: Google Gemini is not available in your current region.");
       }
       return new AuthenticationError("ACCESS_DENIED: API access prohibited. Check project permissions.");
    }

    // 3. Safety & Policy (Blocked)
    if (lowerMsg.includes("safety") || lowerMsg.includes("blocked") || lowerMsg.includes("harmful")) {
       return new SafetyError("SAFETY_VIOLATION: The prompt or input image triggered safety filters. Try simplifying your request.");
    }

    // 4. Model Availability (404)
    if (status === 404 || lowerMsg.includes("not found")) {
       return new ApiError("MODEL_UNAVAILABLE: The requested AI model version is not found or deprecated.", 404);
    }

    // 5. System Instability (500/502/503/504)
    if ([500, 502, 503, 504].includes(status) || lowerMsg.includes("overloaded") || lowerMsg.includes("busy") || lowerMsg.includes("capacity")) {
       return new ApiError("SYSTEM_OVERLOAD: Google AI servers are experiencing high traffic. Please retry in a moment.", 503);
    }

    // 6. Network / Connectivity
    if (lowerMsg.includes("fetch") || lowerMsg.includes("network") || lowerMsg.includes("connection")) {
       return new ApiError("NETWORK_ERROR: Unable to connect to Google AI services. Please check your internet connection.", 0);
    }

    // 7. Request Format (400)
    if (status === 400 || lowerMsg.includes("invalid argument")) {
       if (lowerMsg.includes("image")) return new ApiError("INVALID_IMAGE: The provided image format or size is not supported.", 400);
       return new ApiError("INVALID_REQUEST: The request parameters are invalid. Check your prompt or configuration.", 400);
    }

    return new ApiError(`GENAI_ERROR: ${rawMessage}`, status || 500);
  }

  /**
   * Primary Entry Point: Orchestrates content generation with exponential backoff retry logic.
   */
  public async generate(
    prompt: string,
    images: string[] = [],
    config: AIRequestConfig
  ): Promise<AIResponse> {
    const retries = config.maxRetries ?? this.DEFAULT_RETRIES;
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const apiKey = this.getApiKey();
        const ai = new GoogleGenAI({ apiKey });
        
        return await this.executeRequest(ai, prompt, images, config);
      } catch (error) {
        const normalized = this.normalizeError(error);
        lastError = normalized;

        // Fail immediately on non-transient errors
        if (
          normalized instanceof SafetyError || 
          normalized instanceof AuthenticationError || 
          (normalized instanceof ApiError && normalized.statusCode >= 400 && normalized.statusCode < 500 && normalized.statusCode !== 429)
        ) {
          throw normalized;
        }

        if (attempt < retries) {
          // Exponential backoff with jitter: 1s, 2s, 4s, 8s + random jitter
          const delay = Math.pow(2, attempt) * 1000 + (Math.random() * 500);
          logger.warn(`AICore Retry ${attempt + 1}/${retries}: ${normalized.message}`);
          await this.sleep(delay);
          continue;
        }
      }
    }
    throw lastError;
  }

  private async executeRequest(
    ai: GoogleGenAI,
    prompt: string,
    images: string[] = [],
    config: AIRequestConfig
  ): Promise<AIResponse> {
    const parts: Part[] = images.filter(Boolean).map(img => ({
      inlineData: { data: cleanBase64(img), mimeType: getMimeType(img) }
    }));
    parts.push({ text: prompt || "Analyze input assets." });

    const generationConfig: any = {
      systemInstruction: config.systemInstruction,
      responseMimeType: config.responseMimeType,
      temperature: config.temperature ?? 0.7,
      seed: config.seed,
    };

    // Thinking Logic Configuration
    if (config.thinkingBudget !== undefined) {
      const budget = config.thinkingBudget;
      generationConfig.thinkingConfig = { thinkingBudget: budget };
      // Ensure maxOutputTokens is larger than thinking budget
      if (config.maxOutputTokens) {
        generationConfig.maxOutputTokens = Math.max(config.maxOutputTokens, budget + 1024);
      } else {
        generationConfig.maxOutputTokens = budget + 2048;
      }
    } else if (config.maxOutputTokens) {
      generationConfig.maxOutputTokens = config.maxOutputTokens;
    }

    if (config.useSearch) generationConfig.tools = [{ googleSearch: {} }];

    // Image Model Configuration
    if (config.model.includes('image')) {
      generationConfig.imageConfig = { aspectRatio: config.aspectRatio || "1:1" };
      if (config.model === 'gemini-3-pro-image-preview') {
        generationConfig.imageConfig.imageSize = config.imageSize || "1K";
      }
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: config.model,
      contents: { parts },
      config: generationConfig,
    });

    return this.parseResponse(response);
  }

  /**
   * Generates video using Veo 3.1 model with polling and error mapping.
   */
  public async generateVideo(prompt: string, image: string): Promise<string | null> {
    try {
      const apiKey = this.getApiKey();
      const ai = new GoogleGenAI({ apiKey });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
          imageBytes: cleanBase64(image),
          mimeType: getMimeType(image),
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      // Poll for completion (Veo takes time)
      const MAX_POLLS = 60; // 5 minutes max
      let polls = 0;
      
      while (!operation.done) {
          if (polls++ > MAX_POLLS) throw new ApiError("TIMEOUT: Video generation took too long.", 408);
          await this.sleep(5000); // 5 second polling interval
          operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (videoUri) {
          return `${videoUri}&key=${apiKey}`;
      }
      return null;
    } catch (error) {
      logger.error('Video Generation Error:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Generates structured Marketing Copy (SEO) using Flash model.
   */
  public async generateMarketingCopy(productName: string, image: string): Promise<MarketingCopyData> {
    const prompt = `Analyze this product image of "${productName}" and generate optimized marketing copy for Shopify/Etsy.
    Return valid JSON with keys: "title" (SEO title, <80 chars), "description" (engaging, ~100 words), "tags" (array of 5-7 strings).
    Focus on visual details, mood, and material quality inferred from the image.`;

    try {
      const response = await this.generate(prompt, [image], {
        model: 'gemini-3-flash-preview',
        responseMimeType: "application/json",
        temperature: 0.7
      });

      const text = response.text || "{}";
      return JSON.parse(text) as MarketingCopyData;
    } catch (e) {
      logger.error("Marketing Copy Gen Error", e);
      throw this.normalizeError(e); // Ensure specific error is thrown
    }
  }

  private parseResponse(response: GenerateContentResponse): AIResponse {
    const candidate = response.candidates?.[0];
    
    // Check for prompt feedback blocks
    if (response.promptFeedback?.blockReason) {
         throw new SafetyError(`PROMPT_BLOCKED: ${response.promptFeedback.blockReason}`);
    }

    if (!candidate) {
         throw new ApiError("ZERO_CANDIDATES: The model returned no results. Try adjusting your prompt.", 500);
    }

    // Check Candidate Finish Reasons for Safety/Recitation blocks
    if (candidate.finishReason && candidate.finishReason !== "STOP" && candidate.finishReason !== "MAX_TOKENS") {
        if (candidate.finishReason === "SAFETY") {
             throw new SafetyError("GENERATION_BLOCKED: Content flagged by safety filters. Avoid restricted topics or imagery.");
        }
        if (candidate.finishReason === "RECITATION") {
             throw new SafetyError("COPYRIGHT_BLOCK: Content matched protected intellectual property.");
        }
        if (candidate.finishReason === "OTHER") {
             throw new ApiError("GENERATION_FAILED: Unknown model error occurred.", 500);
        }
        throw new ApiError(`GENERATION_STOPPED: ${candidate.finishReason}`, 500);
    }

    const result: AIResponse = {
      text: response.text,
      finishReason: candidate.finishReason,
      groundingSources: candidate.groundingMetadata?.groundingChunks
    };

    const imagePart = candidate.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData?.data) {
      result.image = `data:image/png;base64,${imagePart.inlineData.data}`;
    }

    return result;
  }
}

export const aiCore = AICoreService.getInstance();