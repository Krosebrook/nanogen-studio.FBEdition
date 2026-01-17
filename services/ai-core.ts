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
  private readonly DEFAULT_RETRIES = 2;

  private constructor() {}

  public static getInstance(): AICoreService {
    if (!AICoreService.instance) AICoreService.instance = new AICoreService();
    return AICoreService.instance;
  }

  private getApiKey(): string {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new AuthenticationError("api_key_missing");
    return apiKey;
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private normalizeError(error: any): AppError {
    if (error instanceof AppError) return error;
    
    const rawMessage = error?.message || error?.toString() || "Unknown error";
    const status = error?.status || error?.response?.status;
    const lowerMsg = rawMessage.toLowerCase();

    if (status === 429 || lowerMsg.includes("quota")) {
       return new RateLimitError("429: API quota exhausted or rate limit exceeded.");
    }
    if (lowerMsg.includes("api key not valid") || lowerMsg.includes("invalid api key")) {
       return new AuthenticationError("Invalid API Key: The provided API key is invalid or expired.");
    }
    if (lowerMsg.includes("permission denied")) {
       if (lowerMsg.includes("billing")) {
         return new AuthenticationError("Billing not enabled for the associated Google Cloud project.");
       }
       if (lowerMsg.includes("location") || lowerMsg.includes("region")) {
         return new AuthenticationError("Service not available in your region.");
       }
       return new AuthenticationError("Permission Denied: Check project permissions.");
    }
    if (lowerMsg.includes("safety")) {
       return new SafetyError("Safety filters triggered by the prompt or image.");
    }
    if (status === 404 || lowerMsg.includes("not found")) {
       return new ApiError(`Model ${status}: The requested AI model is not available.`);
    }
    if (status >= 500 || lowerMsg.includes("overloaded")) {
       return new ApiError(`Server Error ${status}: AI engine is overloaded. Please retry.`);
    }
    if (lowerMsg.includes("fetch") || lowerMsg.includes("network")) {
       return new ApiError("Network Error: Unable to connect to Google AI. Check internet connection.");
    }
    if (status === 400 || lowerMsg.includes("invalid argument")) {
       if (lowerMsg.includes("image")) return new ApiError("Invalid Image format or size.", 400);
       return new ApiError("Invalid Argument: The request was malformed. Check prompt or config.", 400);
    }

    // Fallback error that will be caught by the generic UI message
    return new ApiError(rawMessage, status || 500);
  }

  public async generate(
    prompt: string,
    images: string[] = [],
    config: AIRequestConfig
  ): Promise<AIResponse> {
    let lastError: any;

    for (let attempt = 0; attempt <= (config.maxRetries ?? this.DEFAULT_RETRIES); attempt++) {
      try {
        const apiKey = this.getApiKey();
        const ai = new GoogleGenAI({ apiKey });
        
        const response = await this.executeRequest(ai, prompt, images, config);
        return this.parseResponse(response); // Success

      } catch (error) {
        const normalized = this.normalizeError(error);
        lastError = normalized;

        // Non-retryable errors
        if (normalized instanceof AuthenticationError || normalized instanceof SafetyError || (normalized instanceof ApiError && normalized.statusCode === 400)) {
          throw normalized;
        }

        if (attempt < (config.maxRetries ?? this.DEFAULT_RETRIES)) {
          const delay = Math.pow(2, attempt) * 1000 + (Math.random() * 500);
          logger.warn(`AICore Retry ${attempt + 1}: ${normalized.message}`);
          await this.sleep(delay);
        } else {
          logger.error(`AICore Final Error: ${normalized.message}`);
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
  ): Promise<GenerateContentResponse> {
    const parts: Part[] = images.filter(Boolean).map(img => ({
      inlineData: { data: cleanBase64(img), mimeType: getMimeType(img) }
    }));
    parts.push({ text: prompt || "Analyze input assets." });

    const generationConfig: any = {
        temperature: config.temperature ?? 0.7,
        maxOutputTokens: config.maxOutputTokens,
        responseMimeType: config.responseMimeType,
        seed: config.seed,
    };

    if (config.useSearch) generationConfig.tools = [{ googleSearch: {} }];

    return ai.models.generateContent({
      model: config.model,
      contents: { parts },
      config: generationConfig,
      systemInstruction: config.systemInstruction ? { role: 'user', parts: [{ text: config.systemInstruction }] } : undefined,
    });
  }

  public async generateVideo(prompt: string, image: string): Promise<string | null> {
    try {
      const apiKey = this.getApiKey();
      const ai = new GoogleGenAI({ apiKey });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: { imageBytes: cleanBase64(image), mimeType: getMimeType(image) },
        config: { resolution: '720p', aspectRatio: '16:9' }
      });

      const MAX_POLLS = 60;
      for (let i = 0; i < MAX_POLLS; i++) {
        if (operation.done) {
          const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
          return videoUri ? `${videoUri}&key=${apiKey}` : null;
        }
        await this.sleep(5000);
        operation = await ai.operations.getVideosOperation({ operation });
      }
      throw new ApiError("TIMEOUT: Video generation took too long.", 408);
    } catch (error) {
      logger.error('Video Generation Error:', error);
      throw this.normalizeError(error);
    }
  }

  public async generateMarketingCopy(productName: string, image: string): Promise<MarketingCopyData> {
    const prompt = `Analyze this product image of "${productName}" and generate optimized marketing copy (SEO). Return valid JSON with keys: "title" (<60 chars), "description" (~100 words), "tags" (array of 5-7 keywords).`;

    try {
      const response = await this.generate(prompt, [image], {
        model: 'gemini-3-flash-preview',
        responseMimeType: "application/json",
        temperature: 0.8
      });
      return JSON.parse(response.text || "{}") as MarketingCopyData;
    } catch (e) {
      logger.error("Marketing Copy Gen Error", e);
      throw this.normalizeError(e);
    }
  }

  private parseResponse(response: GenerateContentResponse): AIResponse {
    if (response.promptFeedback?.blockReason) {
      throw new SafetyError(`Prompt blocked due to ${response.promptFeedback.blockReason}`);
    }

    const candidate = response.candidates?.[0];
    if (!candidate) {
      // This is a critical failure. Map to an error the UI understands.
      throw new ApiError("Invalid Argument: The model returned no content. This can be due to a restrictive safety setting, a confusing prompt, or an internal error. Please try simplifying your prompt.", 400);
    }

    if (candidate.finishReason && candidate.finishReason !== "STOP" && candidate.finishReason !== "MAX_TOKENS") {
      if (candidate.finishReason === "SAFETY") {
        throw new SafetyError("Generation blocked by safety filters on the output.");
      }
      if (candidate.finishReason === "RECITATION") {
        throw new SafetyError("Generation blocked due to potential copyright recitation.");
      }
      // Any other reason is likely a problem with the prompt or a temporary model issue.
      throw new ApiError(`Invalid Argument: Generation failed with reason '${candidate.finishReason}'. Try a simpler prompt.`, 400);
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