import React from 'react';
import { Tooltip, Input, Select, Badge } from '@/shared/components/ui';
import { 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  RotateCw, 
  Droplets, 
  Palette, 
  Hash, 
  Trash2,
  Maximize,
  ArrowRight,
  ArrowDown,
  Layers,
  Square,
  CornerUpRight,
  TextCursorInput,
  Type as TypeIcon,
  Underline,
  Strikethrough,
  Italic
} from 'lucide-react';
import { TextOverlayState } from '../hooks/useMerchState';

interface TextOverlayControlsProps {
  overlay: TextOverlayState;
  onChange: (overlay: TextOverlayState) => void;
  disabled: boolean;
}

const FONTS = [
  { label: 'Inter (Modern Sans)', value: 'Inter, sans-serif' },
  { label: 'Outfit (Geometric)', value: 'Outfit, sans-serif' },
  { label: 'Playfair (Elegant Serif)', value: 'Playfair Display, serif' },
  { label: 'JetBrains (Technical)', value: 'JetBrains Mono, monospace' },
  { label: 'Bebas Neue (Impact)', value: 'Bebas Neue, sans-serif' },
  { label: 'Montserrat (Classic)', value: 'Montserrat, sans-serif' },
  { label: 'Dancing Script (Script)', value: 'Dancing Script, cursive' },
  { label: 'Impact (Bold)', value: 'Impact, sans-serif' },
];

const PRESET_COLORS = [
  '#ffffff', '#000000', '#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#94a3b8'
];

export const TextOverlayControls: React.FC<TextOverlayControlsProps> = ({ overlay, onChange, disabled }) => {
  const handleChange = (key: keyof TextOverlayState, value: any) => {
    onChange({ ...overlay, [key]: value });
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'color' | 'bgColor') => {
    const val = e.target.value;
    if (val === '' || /^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
      const formatted = val.startsWith('#') ? val : `#${val}`;
      handleChange(key, formatted);
    }
  };

  const clearText = () => handleChange('text', '');

  return (
    <div className={`space-y-6 animate-fadeIn ${disabled ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
      {/* Content Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em] flex items-center gap-2">
            <TextCursorInput className="w-3 h-3 text-blue-500" /> Typography Content
          </label>
          {overlay.text && (
            <Tooltip content="Permanently delete all text content and reset this typography layer" side="left">
              <button 
                onClick={clearText}
                className="text-[9px] font-black text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest flex items-center gap-1 group"
              >
                <Trash2 className="w-2.5 h-2.5 group-hover:scale-110 transition-transform" /> Reset Layer
              </button>
            </Tooltip>
          )}
        </div>
        <Tooltip content="Enter text content to overlay on your design. You can reposition it by dragging directly in the viewport." side="top">
          <textarea
            placeholder="E.g. SUMMER COLLECTION 2025"
            value={overlay.text}
            onChange={(e) => handleChange('text', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 placeholder-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 outline-none transition-all resize-none min-h-[100px] text-sm font-medium leading-relaxed shadow-inner"
          />
        </Tooltip>
      </section>

      {/* Style Section */}
      <section className="space-y-4">
        <label className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em] px-1 flex items-center gap-2">
          <Palette className="w-3 h-3 text-indigo-500" /> Visual Identity
        </label>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Tooltip content="Choose a brand-appropriate typeface for your text overlay">
                <Select 
                  label="Typeface"
                  value={overlay.font}
                  onChange={(e) => handleChange('font', e.target.value)}
                  options={FONTS}
                />
              </Tooltip>
            </div>

            <div className="flex flex-col gap-1.5 shrink-0">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Decorations</label>
               <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1 h-[42px]">
                {[
                  { id: 'underline', icon: <Underline className="w-3.5 h-3.5" />, label: 'Underline' },
                  { id: 'strikethrough', icon: <Strikethrough className="w-3.5 h-3.5" />, label: 'Strike' }
                ].map(decor => (
                  <Tooltip key={decor.id} content={`Toggle text ${decor.label}`}>
                    <button
                      onClick={() => handleChange(decor.id as any, !overlay[decor.id as keyof TextOverlayState])}
                      className={`p-1.5 rounded-lg transition-all h-full aspect-square flex items-center justify-center ${overlay[decor.id as keyof TextOverlayState] ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300 hover:bg-slate-800'}`}
                    >
                      {decor.icon}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner">
            <div className="flex justify-between items-center mb-1">
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Color Palette</span>
               <div className="flex gap-1">
                 {PRESET_COLORS.map(c => (
                    <Tooltip key={c} content={`Instantly apply the ${c} color to your text`}>
                      <button
                        onClick={() => handleChange('color', c)}
                        className={`w-4 h-4 rounded-full border border-white/5 transition-all hover:scale-125 ${overlay.color === c ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    </Tooltip>
                  ))}
               </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t border-slate-900">
              <div className="relative group shrink-0">
                <Tooltip content="Open the system color palette to select a custom text color">
                  <div className="relative">
                    <input 
                      type="color" 
                      value={overlay.color.length === 7 ? overlay.color : '#ffffff'}
                      onChange={(e) => handleChange('color', e.target.value)}
                      className="w-12 h-12 opacity-0 absolute inset-0 cursor-pointer z-10"
                    />
                    <div 
                      className="w-12 h-12 rounded-xl border-2 border-slate-800 flex items-center justify-center shadow-lg transition-all group-hover:border-blue-500/50"
                      style={{ backgroundColor: overlay.color }}
                    >
                      <Palette className="w-5 h-5 mix-blend-difference text-white/40" />
                    </div>
                  </div>
                </Tooltip>
              </div>
              <div className="flex-1">
                <Tooltip content="Manually input a specific HEX color code for precise brand matching">
                  <div className="relative">
                    <input 
                      value={overlay.color.toUpperCase()}
                      onChange={(e) => handleHexChange(e, 'color')}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-9 py-2.5 text-xs font-mono font-black text-slate-300 outline-none focus:border-blue-500/50 uppercase tracking-widest"
                    />
                    <Hash className="w-3 h-3 absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Shape Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em] flex items-center gap-2">
            <Square className="w-3 h-3 text-indigo-500" /> Legibility Mask
          </label>
          <Tooltip content="Toggle a solid background mask to enhance text legibility over busy or dark designs">
            <button 
              onClick={() => handleChange('bgEnabled', !overlay.bgEnabled)}
              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all border ${overlay.bgEnabled ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
            >
              {overlay.bgEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </Tooltip>
        </div>

        {overlay.bgEnabled && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-5 animate-fadeIn shadow-inner">
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <Tooltip content="Choose a custom background color for the legibility mask">
                  <div className="relative">
                    <input 
                      type="color" 
                      value={overlay.bgColor.length === 7 ? overlay.bgColor : '#000000'}
                      onChange={(e) => handleChange('bgColor', e.target.value)}
                      className="w-10 h-10 opacity-0 absolute inset-0 cursor-pointer z-10"
                    />
                    <div 
                      className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center shadow-lg overflow-hidden transition-all group-hover:border-slate-600"
                      style={{ backgroundColor: overlay.bgColor }}
                    >
                      <Palette className="w-4 h-4 mix-blend-difference text-white/20" />
                    </div>
                  </div>
                </Tooltip>
              </div>
              <div className="flex-1 relative">
                <Tooltip content="Enter a specific HEX color code for the background legibility mask">
                  <div className="relative">
                    <input 
                      value={overlay.bgColor.toUpperCase()}
                      onChange={(e) => handleHexChange(e, 'bgColor')}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-9 py-2 text-[10px] font-mono font-black text-slate-400 outline-none focus:border-blue-500/50 uppercase tracking-widest"
                    />
                    <Hash className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                  </div>
                </Tooltip>
              </div>
            </div>

            <RangeControl 
              label="Transparency" 
              value={overlay.bgOpacity} 
              icon={<Droplets className="w-3.5 h-3.5" />} 
              onChange={(val) => handleChange('bgOpacity', val)}
              tooltip="Adjust the opacity of the background legibility mask"
            />
            
            <RangeControl 
              label="Padding" 
              value={overlay.bgPadding} 
              max={60} 
              icon={<Maximize className="w-3.5 h-3.5" />} 
              onChange={(val) => handleChange('bgPadding', val)}
              tooltip="Increase the breathing room around the text block"
            />
            
            <RangeControl 
              label="Corner Radius" 
              value={overlay.bgRounding} 
              max={40} 
              icon={<CornerUpRight className="w-3.5 h-3.5" />} 
              onChange={(val) => handleChange('bgRounding', val)}
              tooltip="Soften the edges of the background mask with corner rounding"
            />
          </div>
        )}
      </section>

      {/* Transform Section */}
      <section className="space-y-4">
        <label className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em] px-1 flex items-center gap-2">
          <Maximize className="w-3 h-3 text-indigo-500" /> Layout Metrics
        </label>
        
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-inner">
          <RangeControl 
            label="Scale" 
            value={overlay.size} 
            min={8} 
            max={250} 
            icon={<TypeIcon className="w-3.5 h-3.5" />} 
            onChange={(val) => handleChange('size', val)} 
            suffix="px"
            tooltip="Globally scale the size of the typography layer"
          />

          <RangeControl 
            label="Opacity" 
            value={overlay.opacity} 
            icon={<Layers className="w-3.5 h-3.5" />} 
            onChange={(val) => handleChange('opacity', val)}
            tooltip="Control the overall transparency of the entire text layer"
          />

          <RangeControl 
            label="Orientation" 
            value={overlay.rotation} 
            min={-180} 
            max={180} 
            icon={<RotateCw className="w-3.5 h-3.5" />} 
            onChange={(val) => handleChange('rotation', val)} 
            suffix="°"
            tooltip="Rotate the text layer to create dynamic angles"
          />

          <RangeControl 
            label="Skew (Shear)" 
            value={overlay.skewX} 
            min={-45} 
            max={45} 
            icon={<Italic className="w-3.5 h-3.5" />} 
            onChange={(val) => handleChange('skewX', val)} 
            suffix="°"
            tooltip="Apply horizontal shear skew to the text block"
          />

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-900">
            <div className="flex flex-col gap-1.5 shrink-0">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Alignment</label>
               <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1 h-[42px]">
                {[
                  { id: 'left', icon: <AlignLeft className="w-3.5 h-3.5" />, label: 'Left' },
                  { id: 'center', icon: <AlignCenter className="w-3.5 h-3.5" />, label: 'Center' },
                  { id: 'right', icon: <AlignRight className="w-3.5 h-3.5" />, label: 'Right' }
                ].map(align => (
                  <Tooltip key={align.id} content={`Align the text block to the ${align.label} edge`}>
                    <button
                      onClick={() => handleChange('align', align.id)}
                      className={`p-1.5 rounded-lg transition-all h-full aspect-square flex items-center justify-center ${overlay.align === align.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300 hover:bg-slate-800'}`}
                    >
                      {align.icon}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <RangeControl 
                label="X Pos" 
                value={overlay.x} 
                icon={<ArrowRight className="w-3.5 h-3.5" />} 
                onChange={(val) => handleChange('x', val)} 
                compact
                tooltip="Precisely nudge the text layer along the horizontal axis"
              />
              <RangeControl 
                label="Y Pos" 
                value={overlay.y} 
                icon={<ArrowDown className="w-3.5 h-3.5" />} 
                onChange={(val) => handleChange('y', val)} 
                compact
                tooltip="Precisely nudge the text layer along the vertical axis"
              />
            </div>
          </div>
        </div>
      </section>
      
      {overlay.text && (
        <div className="flex items-center gap-3 bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 shadow-sm animate-pulse">
           <Layers className="w-4 h-4 text-blue-500/50" />
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
             Direct manipulation: Drag text in the preview window to reposition.
           </p>
        </div>
      )}
    </div>
  );
};

interface RangeControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  icon: React.ReactNode;
  onChange: (val: number) => void;
  suffix?: string;
  compact?: boolean;
  tooltip?: string;
}

const RangeControl: React.FC<RangeControlProps> = ({ label, value, min = 0, max = 100, icon, onChange, suffix = "%", compact, tooltip }) => (
  <div className="space-y-2.5">
    <div className="flex justify-between items-center px-0.5">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
        {icon} {label}
      </span>
      <span className="text-[10px] font-mono text-blue-400 font-black">{Math.round(value)}{suffix}</span>
    </div>
    <Tooltip content={tooltip || `Adjust ${label.toLowerCase()} value`} side="top" className="w-full">
      <input 
        type="range" min={min} max={max} value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-blue-600 h-1 bg-slate-800 rounded-lg cursor-pointer appearance-none hover:accent-blue-400 transition-all"
      />
    </Tooltip>
  </div>
);