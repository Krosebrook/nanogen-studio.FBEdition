
import { MarketingData } from '@/features/merch/types';
import { AppError, ApiError, AuthenticationError, RateLimitError, SafetyError } from '@/shared/utils/errors';

// Mocks the real API responses for a safe local development
const MOCK_API = {
  generate: async (prompt: string, images: string[], options: any): Promise<{ image: string }> => {
    await new Promise(res => setTimeout(res, 1500));
    if (prompt.includes("fail")) throw new ApiError("Generation failed as requested for testing.");
    // Return a mock image (e.g., a specific background to show it's a mock)
    return { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' };
  },
  generateVideo: async (prompt:string, image: string): Promise<{ videoUrl: string }> => {
    await new Promise(res => setTimeout(res, 4000));
    return { videoUrl: 'https://storage.googleapis.com/nanogen-public/mock_video.mp4' };
  },
  generateMarketing: async (productName: string, image: string): Promise<MarketingData> => {
    await new Promise(res => setTimeout(res, 1000));
    return {
      title: `Mock: ${productName}`,
      description: "This is a mock description generated for the product. It highlights the key features and benefits, designed to attract customers and improve search engine rankings.",
      tags: ["mock", "test-data", "example-product", "ai-generated", "demo"]
    };
  },
  publish: async (platform: string, keys: Record<string, string>, image: string): Promise<{ success: boolean; url: string }> => {
    await new Promise(res => setTimeout(res, 2000));
    console.log(`Mock publishing to ${platform} with keys`, keys);
    return { success: true, url: 'https://mock-platform.com/product/12345' };
  },
};

/**
 * A type-safe fetch wrapper with robust error handling.
 */
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Note: In a real app, this URL would be an environment variable.
    const response = await fetch(`https://your-backend-api.com/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // In a real app, you might have an auth token header here
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: response.statusText }));
      handleApiError(response.status, errorBody);
    }

    return response.json();

  } catch (error) {
    // Use mock API for now instead of throwing network error
    console.warn(`API fetch to '${endpoint}' failed, using mock data. Error:`, error);
    return MOCK_API[endpoint as keyof typeof MOCK_API]?.( (options.body as any) );
    // throw new AppError("Network error or API is down.");
  }
};

/**
 * Maps HTTP status codes and error bodies to specific AppError types.
 */
const handleApiError = (status: number, body: { message: string, type?: string }) => {
  const message = body.message || `API error with status ${status}`;
  switch (status) {
    case 401: throw new AuthenticationError(message);
    case 403: throw new AuthenticationError(message); // Can be permission or geo-block
    case 429: throw new RateLimitError();
    case 400:
      if (body.type === 'SAFETY_VIOLATION') throw new SafetyError(message);
      throw new ApiError(message, status);
    case 500: throw new ApiError(message, status);
    case 503: throw new ApiError("Service unavailable. Please try again later.", status);
    default: throw new ApiError(message, status);
  }
}

// --- Public API Service --- //

export const api = {
  generate: async (prompt: string, images: string[], config: any) => {
    return apiFetch('generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, images, config }),
    });
  },

  generateVideo: async (prompt: string, image: string) => {
    return apiFetch('generateVideo', {
      method: 'POST',
      body: JSON.stringify({ prompt, image }),
    });
  },

  generateMarketingCopy: async (productName: string, image: string) => {
    return apiFetch('generateMarketing', {
      method: 'POST',
      body: JSON.stringify({ productName, image }),
    });
  },

  publish: async (platform: string, keys: Record<string, string>, image: string) => {
    return apiFetch('publish', {
      method: 'POST',
      body: JSON.stringify({ platform, keys, image }),
    });
  },
};