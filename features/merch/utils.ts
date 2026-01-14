import { MerchProduct } from './types';

/**
 * Deep Prompt Construction for maximal AI depth and realism.
 */
export const constructMerchPrompt = (
  product: MerchProduct,
  stylePreference: string,
  hasBackground: boolean
): string => {
  const style = stylePreference.trim() || "cinematic hyper-realistic studio";
  
  if (hasBackground) {
    return `IMAGE ANALYSIS & SYNTHESIS TASK:
Image 1 (ID_LOGO): A brand mark or graphic asset.
Image 2 (ID_SCENE): A target environmental setting.

GOAL: Integrate ID_LOGO onto a ${product.name} within ID_SCENE.

TECHNICAL REQUIREMENTS:
1. MATERIAL FIDELITY: Render the ${product.name} using its natural material properties (${product.description}). 
2. LOGO INTEGRATION: Apply ID_LOGO as a high-precision texture. Respect surface curvature, fabric ripples, or material specular highlights. Logo should look printed/embossed, not overlaid.
3. DEPTH & LIGHTING: Analyze ID_SCENE's lighting vectors. Match shadows, ambient occlusion, and color grading exactly. The ${product.name} must appear physically present in the scene.
4. AESTHETIC: Follow a ${style} visual direction. Ensure crisp focus and high resolution details.`;
  }

  // Base prompt with enhanced detail for standalone renders
  const enhancedBase = product.defaultPrompt.replace('{style_preference}', style);
  return `${enhancedBase} Focus on extreme physical detail, realistic shadows, and professional product lighting setup. High resolution, photorealistic textures.`;
};

/**
 * Variation Prompts - Specifically designed for alternative lighting and camera perspectives.
 */
export const getVariationPrompts = (
  product: MerchProduct,
  stylePreference: string,
  hasBackground: boolean
): string[] => {
  const base = constructMerchPrompt(product, stylePreference, hasBackground);
  
  return [
    `${base} MOCKUP_ALT_A: Cinematic product shot from a dramatic high-angle bird's eye perspective. Use sharp high-contrast "golden hour" side-lighting to emphasize texture depth.`,
    `${base} MOCKUP_ALT_B: Professional close-up mockup from a sharp 45-degree profile view. Emphasize physical material detail with soft, multi-layered diffused rim lighting.`,
    `${base} MOCKUP_ALT_C: Minimalist composition with a low-angle perspective looking up at the product. Use cool-toned studio lighting with deep shadows and clean reflections.`
  ];
};

/**
 * Robust Error Analysis with deep diagnostic suggestions tailored to Merch Studio.
 */
export const getErrorSuggestion = (errorMsg: string, hasBackground: boolean): string => {
  const msg = errorMsg.toLowerCase();

  // 0. Client-Side Upload Validation (Priority)
  if (msg.includes("limit") && (msg.includes("size") || msg.includes("mb"))) {
    return "Storage Limit: The uploaded file exceeds the 5MB maximum. Action: Compress your image using a tool like TinyPNG or choose a smaller file.";
  }
  if (msg.includes("not a valid image") || msg.includes("type")) {
    return "Format Error: The uploaded file type is not supported. Action: Please use standard JPG, PNG, or WEBP image files.";
  }

  // 0.1 Export & Canvas Rendering Errors (New)
  if (msg.includes("texture_load") || msg.includes("resource unreachable")) {
    return "Rendering Security: Cross-origin resource blocked. Action: The source image URL is not accessible to the canvas engine. Please re-upload the logo locally.";
  }
  if (msg.includes("canvas_context") || msg.includes("2d context")) {
    return "System Limitation: Browser graphics memory exhausted. Action: Your device is running low on memory. Close other tabs or export at a lower quality.";
  }
  if (msg.includes("export_failure")) {
    return "Export Failed: Encoding error. Action: Try switching the export format to JPG or reducing the quality slider slightly.";
  }
  
  // 1. Safety Filters (The most common issue with image generation)
  if (msg.includes("safety") || msg.includes("blocked") || msg.includes("candidate")) {
    if (msg.includes("face") || msg.includes("person") || msg.includes("human") || msg.includes("child")) {
      return "Safety Policy: The AI model restricts generating photorealistic human figures in this context. Action: Remove words like 'model', 'man', 'woman', or 'wearing' from your style prompt. Focus on the product artifact itself.";
    }
    if (msg.includes("sexual") || msg.includes("violent") || msg.includes("harm") || msg.includes("nude")) {
      return "Safety Policy: The prompt or input image triggered safety filters. Action: Ensure your logo and style description do not contain suggestive, violent, or prohibited content.";
    }
    return "Safety Filter: The generation was blocked by AI safety protocols. Action: Simplify your 'Visual Direction' prompt to be more descriptive of lighting and texture, rather than specific subjects.";
  }

  // 2. Copyright / Recitation
  if (msg.includes("recitation") || msg.includes("copyright")) {
    return "Content Policy: Potential copyright overlap detected. Action: The AI detected that your logo or prompt might resemble protected intellectual property. Try using a more original design or generic description.";
  }
  
  // 3. Rate Limits & Quota
  if (msg.includes("429") || msg.includes("quota") || msg.includes("exhausted")) {
    return "API Capacity: Request limit reached. Action: The system is cooling down. Please wait 20-30 seconds before clicking 'Generate' again to reset your token bucket.";
  }

  // 4. Server Overload & Region
  if (msg.includes("location") || msg.includes("region") || msg.includes("country")) {
     return "Geo-Restriction: Service Unavailable. Action: The AI model is not currently available in your region. Please check Google's supported locations.";
  }
  if ([500, 502, 503, 504].some(code => msg.includes(code.toString())) || msg.includes("overloaded") || msg.includes("busy") || msg.includes("capacity")) {
    return "System Status: Regional server capacity reached. Action: The AI engine is currently experiencing high traffic. Please retry your request in 1 minute.";
  }

  // 5. Billing & Authentication
  if (msg.includes("billing") || msg.includes("project") || msg.includes("enable")) {
    return "Account Config: Billing not enabled. Action: The API key provided belongs to a Google Cloud Project without active billing. Please enable billing in the Google Cloud Console to use the Gemini 2.5/3.0 models.";
  }
  if (msg.includes("403") || msg.includes("permission") || msg.includes("valid key") || msg.includes("api key")) {
    return "Authentication: Invalid API Credentials. Action: Your API Key appears to be invalid or expired. Please check your environment variables or re-enter your key.";
  }

  // 6. Asset Issues (Resolution/Format)
  if (msg.includes("image") || msg.includes("media") || msg.includes("buffer")) {
    if (msg.includes("large") || msg.includes("size")) {
      return "Asset Error: File size too large. Action: The uploaded logo exceeds the processing limit. Please resize it to under 2048x2048 pixels (or < 4MB) and try again.";
    }
    if (msg.includes("small") || msg.includes("dimension")) {
      return "Asset Error: File resolution too low. Action: The logo is too small for high-quality synthesis. Please upload a version at least 512x512 pixels.";
    }
    if (msg.includes("format") || msg.includes("mime") || msg.includes("decode")) {
      return "Asset Error: Unsupported image format. Action: The file encoding is not recognized. Please convert your logo to a standard PNG or JPG file.";
    }
  }

  // 7. Prompt Complexity
  if (msg.includes("400") || msg.includes("invalid argument")) {
    return "Request Error: Pipeline confusion. Action: Your 'Visual Direction' prompt might be too complex or conflicting. Try simplifying it to 1-2 keywords like 'Cinematic' or 'Studio Lighting'.";
  }

  // 8. General / Fallback
  if (hasBackground && (msg.includes("blend") || msg.includes("composite"))) {
      return "Composition Error: Background blending failed. Action: The AI struggled to merge the logo with the scene. Try a simpler background or standalone generation.";
  }

  return "Diagnostic: Unknown synthesis pipeline interrupt. Action: Check your internet connection and ensure your logo file is a valid image. If the problem persists, try a different product category.";
};