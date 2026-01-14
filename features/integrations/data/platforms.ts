
export interface IntegrationTemplateParams {
  prompt: string;
  imageBase64: string | null;
  mimeType: string;
  webhookUrl?: string;
  keys?: Record<string, string>;
}

export interface PlatformKeyConfig {
  id: string;
  label: string;
  type: 'text' | 'password';
  placeholder: string;
}

export interface IntegrationPlatform {
  id: string;
  name: string;
  icon: string;
  requiredKeys: PlatformKeyConfig[];
  template: (params: IntegrationTemplateParams) => string;
}

export const INTEGRATION_PLATFORMS: IntegrationPlatform[] = [
  {
    id: 'shopify',
    name: 'Shopify Admin API',
    icon: 'ShoppingBag',
    requiredKeys: [
      { id: 'storeName', label: 'Store Name', type: 'text', placeholder: 'your-store' },
      { id: 'accessToken', label: 'Admin Access Token', type: 'password', placeholder: 'shpat_...' }
    ],
    template: ({ prompt, keys }) => `// Shopify Product Creation with Dynamic Keys
const storeName = '${keys?.storeName || 'YOUR_STORE'}';
const shopifyUrl = \`https://\${storeName}.myshopify.com/admin/api/2024-01/products.json\`;

const createProduct = async (imageUrl) => {
  const payload = {
    product: {
      title: "NanoGen Studio: ${prompt.substring(0, 30)}...",
      body_html: "<strong>AI-Generated Custom Merch</strong><p>${prompt}</p>",
      vendor: "NanoGen Studio",
      product_type: "Apparel",
      images: [{ src: imageUrl }]
    }
  };

  const res = await fetch(shopifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': '${keys?.accessToken || 'YOUR_ACCESS_TOKEN'}'
    },
    body: JSON.stringify(payload)
  });
  return res.json();
};`
  },
  {
    id: 'printify',
    name: 'Printify Merchant',
    icon: 'Layers',
    requiredKeys: [
      { id: 'shopId', label: 'Shop ID', type: 'text', placeholder: '1234567' },
      { id: 'token', label: 'API Token', type: 'password', placeholder: 'pr_...' }
    ],
    template: ({ prompt, keys }) => `// Printify Design Automation
const PRINTIFY_SHOP_ID = "${keys?.shopId || 'YOUR_SHOP_ID'}";
const printifyApi = \`https://api.printify.com/v1/shops/\${PRINTIFY_SHOP_ID}/products.json\`;

async function pushToPrintify(designUrl) {
  const response = await fetch(printifyApi, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ${keys?.token || 'YOUR_TOKEN'}',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: "Custom Design: ${prompt.substring(0, 20)}",
      blueprint_id: 3, // T-Shirt Blueprint
      print_areas: [{
        variant_ids: [36712, 36713],
        placeholders: [{
          position: "front",
          images: [{ id: designUrl, x: 0.5, y: 0.5, scale: 1 }]
        }]
      }]
    })
  });
}`
  },
  {
    id: 'etsy',
    name: 'Etsy v3 API',
    icon: 'Sparkles',
    requiredKeys: [
      { id: 'shopId', label: 'Shop ID', type: 'text', placeholder: '12345678' },
      { id: 'apiKey', label: 'Keystring/API Key', type: 'text', placeholder: '...' },
      { id: 'token', label: 'OAuth Token', type: 'password', placeholder: '...' }
    ],
    template: ({ prompt, keys }) => `// Etsy Listing Creator
const SHOP_ID = '${keys?.shopId || 'YOUR_SHOP_ID'}';
const ETSY_API = \`https://openapi.etsy.com/v3/application/shops/\${SHOP_ID}/listings\`;

async function createEtsyListing(imageUrl) {
  const body = new URLSearchParams({
    quantity: '10',
    title: "AI Custom Art: ${prompt.substring(0, 40)}",
    description: "Unique generated artwork for your lifestyle.",
    price: '24.99',
    who_made: 'i_did',
    when_made: 'made_to_order',
    taxonomy_id: '1',
    state: 'draft'
  });

  const res = await fetch(ETSY_API, {
    method: 'POST',
    headers: {
      'x-api-key': '${keys?.apiKey || 'YOUR_KEY'}',
      'Authorization': 'Bearer ${keys?.token || 'YOUR_TOKEN'}'
    },
    body
  });
}`
  },
  {
    id: 'tiktok',
    name: 'TikTok Shop',
    icon: 'Zap',
    requiredKeys: [
      { id: 'appKey', label: 'App Key', type: 'text', placeholder: '...' },
      { id: 'appSecret', label: 'App Secret', type: 'password', placeholder: '...' },
      { id: 'shopId', label: 'Shop ID', type: 'text', placeholder: '...' }
    ],
    template: ({ prompt, keys }) => `// TikTok Shop Product Upload
// Requires HMAC SHA256 Signature logic for production
const shopId = '${keys?.shopId || 'YOUR_SHOP_ID'}';
const appKey = '${keys?.appKey || 'YOUR_APP_KEY'}';

async function uploadToTikTok(imageUrl) {
  const endpoint = 'https://open-api.tiktokglobalshop.com/api/products/202309/upload_product';
  const timestamp = Math.floor(Date.now() / 1000);
  
  // Simplified payload structure
  const payload = {
    product_name: "AI Custom: ${prompt.substring(0, 30)}",
    description: "${prompt}",
    category_id: "123456",
    images: [{ id: imageUrl }],
    skus: [{ original_price: "29.90", seller_sku: "ai-gen-1" }]
  };

  const response = await fetch(\`\${endpoint}?app_key=\${appKey}&shop_id=\${shopId}&timestamp=\${timestamp}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
}`
  },
  {
    id: 'amazon',
    name: 'Amazon KDP',
    icon: 'Box',
    requiredKeys: [
      { id: 'accessKey', label: 'AWS Access Key', type: 'text', placeholder: 'AKIA...' },
      { id: 'secretKey', label: 'AWS Secret Key', type: 'password', placeholder: '...' }
    ],
    template: ({ prompt, mimeType, keys }) => `# Amazon Merch on Demand Upload Helper (Python)
import boto3

def upload_to_amazon_pipeline(image_data, prompt):
    session = boto3.Session(
        aws_access_key_id='${keys?.accessKey || 'YOUR_ACCESS_KEY'}',
        aws_secret_access_key='${keys?.secretKey || 'YOUR_SECRET_KEY'}'
    )
    s3 = session.client('s3')
    bucket = 'amazon-merch-assets-production'
    key = f"uploads/{prompt[:20]}.png"
    
    s3.put_object(
        Bucket=bucket,
        Key=key,
        Body=image_data,
        ContentType='${mimeType}'
    )
    print(f"Asset pushed to Amazon Pipeline: {key}")`
  },
  {
    id: 'nodejs',
    name: 'Node.js (GenAI SDK)',
    icon: 'Code2',
    requiredKeys: [],
    template: ({ prompt, mimeType }) => `import { GoogleGenAI } from "@google/genai";

// The Gemini API key is automatically managed via environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function generateMockup() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: '${mimeType}', data: base64ImageString } },
        { text: '${prompt}' }
      ]
    }
  });
  
  console.log(response.text);
}`
  }
];

export const MIME_TYPES = [
  { value: 'image/png', label: 'PNG Image' },
  { value: 'image/jpeg', label: 'JPEG Image' },
  { value: 'image/webp', label: 'WebP Image' },
  { value: 'image/heic', label: 'HEIC Image' },
];
