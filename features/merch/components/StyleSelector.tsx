import React, { useMemo } from 'react';
import { Input } from '@/shared/components/ui/Input';
import { Sparkles, Palette, Zap } from 'lucide-react';
import { Tooltip } from '@/shared/components/ui';

interface StyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  productName: string;
}

/**
 * Generates contextually relevant style presets based on the current product.
 */
const getPresets = (productName: string) => {
  const p = productName.toLowerCase();
  
  const trending = [
    'Photorealistic', 
    'Minimalist Branding', 
    'Studio Lighting',
    'Cinematic 8k',
    'Neo-Brutalism'
  ];

  const productSpecific: string[] = [];
  
  if (p.includes('shirt') || p.includes('hoodie') || p.includes('apparel') || p.includes('tee')) {
    productSpecific.push(
      'Athleisure Comfort', 
      'Formal Business Casual', 
      'Streetwear Grunge', 
      'Urban Techwear', 
      'High-Fashion Editorial', 
      'Vintage 90s Wash', 
      'Minimalist Organic',
      'Vintage Sportswear',
      'Streetwear Lux',
      'Cyberpunk Techwear',
      'Quiet Luxury',
      'Sustainable Earth',
      'Y2K Pop',
      'Avant-Garde',
      'Gorpcore Outdoor',
      'Retro Athletic',
      'Workwear Utility'
    );
  }
  else if (p.includes('mug') || p.includes('bottle') || p.includes('tumbler') || p.includes('cup') || p.includes('glass')) {
    productSpecific.push('Minimalist Ceramic', 'Cozy Morning Vibe', 'Dark Academia Study', 'Nordic Kitchen', 'Rustic Timber', 'Artisan Pottery');
  }
  else if (p.includes('phone') || p.includes('case') || p.includes('laptop') || p.includes('tech') || p.includes('mat')) {
    productSpecific.push('Cyberpunk Neon', 'Matte Black Stealth', 'Holographic Prism', 'Clean Desktop Setup', 'Vaporwave Glitch');
  }
  else if (p.includes('poster') || p.includes('canvas') || p.includes('art') || p.includes('print')) {
    productSpecific.push('Gallery Exhibition', 'Mid-Century Modern', 'Industrial Loft', 'Risograph Style', 'Museum Lighting', 'Bauhaus Geometry');
  }
  else if (p.includes('sticker') || p.includes('pin') || p.includes('button') || p.includes('badge')) {
    productSpecific.push('Die-Cut Vinyl', 'Pop Art Aesthetic', 'Retro Enamel Badge', 'Holographic Foil', 'Street Art Wheatpaste');
  }
  else {
    productSpecific.push('Luxury Branding', 'Macro Material Detail', 'Lifestyle Interior', 'Abstract Geometric', 'Ethereal Glow');
  }

  return { trending, productSpecific };
};

/**
 * Returns professional-grade creative suggestions tailored to the product category.
 */
const getProductSuggestions = (productName: string): string[] => {
  const p = productName.toLowerCase();
  
  const universalStyles = [
    "Luxury branding with deep matte textures and sophisticated rim lighting",
    "Surreal floating composition with abstract geometric shapes and soft pastel gradients",
    "Hyper-realistic macro photography focusing on premium material grain and intricate details",
  ];

  if (p.includes('shirt') || p.includes('hoodie') || p.includes('apparel') || p.includes('tee')) {
    return [
      ...universalStyles,
      "Athleisure comfort style with high-performance synthetic textures and a modern yoga studio background",
      "Formal business casual aesthetic featuring a tailored fit, sharp ironed lines, and a professional workspace lighting",
      "Vintage sportswear vibes with retro color blocking, authentic fabric wear, and a sun-drenched stadium tunnel setting",
      "Streetwear lux aesthetic with premium heavy-weight cotton, metallic accents, and a minimal high-end boutique backdrop",
      "Cyberpunk techwear aesthetic with rain-slicked concrete, neon magenta accents, and futuristic synthetic materials",
      "Quiet Luxury aesthetic focusing on ultra-premium cashmere textures, neutral tones, and soft natural window light",
      "Sustainable eco-conscious design using raw hemp textures, earthy organic dyes, and a sun-drenched meadow background",
      "Y2K Pop aesthetic with glossy vibrant plastics, prismatic reflections, and high-energy studio lighting",
      "Avant-Garde fashion photography with dramatic sharp shadows, unconventional posing, and high-contrast monochrome style",
      "Vintage 1990s streetwear look with heavy film grain, sun-faded fabric, and nostalgic warm tones",
      "Gorpcore outdoor aesthetic featuring durable technical fabrics, mountainside natural lighting, and rugged styling",
      "Retro athletic look with collegiate lettering, heather grey textures, and a vintage gym locker room setting"
    ];
  }

  if (p.includes('mug') || p.includes('bottle') || p.includes('cup')) {
    return [
      ...universalStyles,
      "Cozy morning setup in a sun-drenched minimalist cafe with soft steam rising",
      "Dark academia aesthetic featuring old books, candle-light, and rich wooden textures",
      "Nordic kitchen scene with clean white surfaces, natural linen, and soft diffused daylight",
      "Minimalist ceramic focus with a smooth matte finish and sharp architectural shadows",
      "Artisan pottery vibe with hand-glazed textures and a rustic wooden table setting"
    ];
  }

  if (p.includes('poster') || p.includes('canvas') || p.includes('print')) {
    return [
      ...universalStyles,
      "Contemporary art gallery setting with track lighting and high ceilings",
      "Industrial loft interior with exposed brick, large windows, and mid-century furniture",
      "Clean museum wall with professional framing and precise spotlighting",
      "Modern home office with Scandi-minimalist decor and soft plant shadows",
      "Bauhaus geometry style with bold primary colors and clean architectural lines"
    ];
  }

  return [
    ...universalStyles,
    "Interior design magazine layout featuring a sun-drenched modern living room",
    "Cyberpunk inspired product shot with vibrant magenta and teal accents",
    "Sophisticated boutique display with velvet surfaces and warm ambient lighting"
  ];
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({ value, onChange, productName }) => {
  const { trending, productSpecific } = useMemo(() => getPresets(productName), [productName]);

  const handleSuggest = () => {
    const suggestions = getProductSuggestions(productName);
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    onChange(random);
  };

  const isActive = (style: string) => value.toLowerCase() === style.toLowerCase();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <Tooltip content="Enter a custom text description to define the artistic style, lighting, or setting for the AI">
             <div className="w-full">
                <Input
                    label="Visual Direction"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Describe style for ${productName.toLowerCase()}...`}
                    className="h-[42px] bg-slate-900/50"
                />
             </div>
          </Tooltip>
        </div>
        <Tooltip content="Automatically generate a professional creative prompt optimized for the current product" side="left">
          <button
            onClick={handleSuggest}
            type="button"
            aria-label="Generate intelligent style suggestion"
            className="shrink-0 h-[42px] px-4 mt-[22px] bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm group focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" aria-hidden="true" />
            <span className="hidden sm:inline font-bold text-[10px] uppercase tracking-wider">Magic</span>
          </button>
        </Tooltip>
      </div>
      
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
           <Zap className="w-3 h-3 text-amber-500" aria-hidden="true" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Trends</span>
        </div>
        <div className="flex flex-wrap gap-2" role="list">
          {trending.map((style) => (
            <Tooltip key={style} content={`Quickly apply the trending ${style} aesthetic to your render`} side="bottom">
              <button
                type="button"
                onClick={() => onChange(style)}
                aria-pressed={isActive(style)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive(style)
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20' 
                    : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {style}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-2 px-1">
           <Palette className="w-3 h-3 text-indigo-500" aria-hidden="true" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contextual for {productName}</span>
        </div>
        <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar" role="list">
          {productSpecific.map((style) => (
            <Tooltip key={style} content={`Apply a style preset specifically curated for ${productName} products`} side="bottom">
              <button
                type="button"
                onClick={() => onChange(style)}
                aria-pressed={isActive(style)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isActive(style)
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-900/20' 
                    : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {style}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};