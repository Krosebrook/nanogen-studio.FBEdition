import React, { useState, useMemo } from 'react';
import { INTEGRATION_PLATFORMS, MIME_TYPES, IntegrationPlatform } from '../data/platforms';
import { usePlatformKeys } from '@/shared/hooks/usePlatformKeys';
import { PlatformKeyForm } from './PlatformKeyForm';
import { 
  Copy, Check, Terminal, Code2, Settings, Share2, 
  ShoppingBag, Layers, Sparkles, Box, Rocket, Milestone, 
  ChevronRight, Unplug, CheckCircle2, Zap, Key, Link as LinkIcon,
  ShieldCheck, RefreshCw, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { Card, Input, Badge, Tooltip, Button, Spinner } from '@/shared/components/ui';

interface IntegrationCodeProps {
  lastPrompt?: string;
}

const ROADMAP = [
  { 
    title: "AI Video Mockups", 
    desc: "Transition static mockups to 5-second cinematic product reveals using Veo 3.1.",
    status: "Live",
    icon: <Rocket className="w-4 h-4 text-blue-400" />
  },
  { 
    title: "Auto SEO Copywriting", 
    desc: "Generate optimized Shopify/Etsy titles and descriptions based on design visual features.",
    status: "Live",
    icon: <Sparkles className="w-4 h-4 text-amber-400" />
  },
  { 
    title: "Direct Merchant Bridge", 
    desc: "One-click publishing to Shopify/Printify without leaving the Studio.",
    status: "Live",
    icon: <ShoppingBag className="w-4 h-4 text-emerald-400" />
  },
  { 
    title: "TikTok Shop Live", 
    desc: "Real-time AI mockup overlays for TikTok Shop live stream selling.",
    status: "Q3 2024",
    icon: <Zap className="w-4 h-4 text-pink-400" />
  }
];

export const IntegrationCode: React.FC<IntegrationCodeProps> = ({ lastPrompt }) => {
  const { saveKey, clearPlatformKeys, getKeysForPlatform, isPlatformConfigured } = usePlatformKeys();
  const [selectedPlatform, setSelectedPlatform] = useState<IntegrationPlatform>(INTEGRATION_PLATFORMS[0]);
  const [selectedMimeType, setSelectedMimeType] = useState('image/png');
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'CODE' | 'KEYS' | 'NANOGEN'>('CODE');
  
  // NanoGen API Key Simulation
  const [nanogenKey, setNanogenKey] = useState<string>('ng_live_' + Math.random().toString(36).substr(2, 24));
  const [showKey, setShowKey] = useState(false);

  const promptToUse = lastPrompt || "A futuristic product shot...";
  const platformKeys = getKeysForPlatform(selectedPlatform.id);
  const isConnected = isPlatformConfigured(selectedPlatform.id, selectedPlatform.requiredKeys.map(k => k.id));

  const codeSnippet = useMemo(() => {
    return selectedPlatform.template({ 
      prompt: promptToUse, 
      imageBase64: null, 
      mimeType: selectedMimeType,
      keys: platformKeys
    });
  }, [selectedPlatform, promptToUse, selectedMimeType, platformKeys]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateNewKey = () => {
    setNanogenKey('ng_live_' + Math.random().toString(36).substr(2, 24));
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return <Terminal className="w-4 h-4" />;
      case 'Code2': return <Code2 className="w-4 h-4" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Box': return <Box className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      default: return <Code2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-12 animate-fadeIn selection:bg-blue-500/30">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-slate-500">
          Merchant Hub
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          Connect your design engine to global marketplaces. Managed keys, production snippets, and automated merchant bridges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-2xl border-slate-800 bg-[#05070a] ring-1 ring-white/5" noPadding>
            {/* View Switcher Tabs */}
            <div className="flex border-b border-slate-700 bg-slate-900/50">
              <button 
                onClick={() => setActiveView('CODE')}
                className={`flex-1 px-6 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeView === 'CODE' ? 'text-blue-400 bg-slate-900 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Terminal className="w-4 h-4" /> Code Factory
              </button>
              <button 
                onClick={() => setActiveView('KEYS')}
                className={`flex-1 px-6 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeView === 'KEYS' ? 'text-blue-400 bg-slate-900 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Key className="w-4 h-4" /> Platform Credentials
              </button>
              <button 
                onClick={() => setActiveView('NANOGEN')}
                className={`flex-1 px-6 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeView === 'NANOGEN' ? 'text-blue-400 bg-slate-900 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <ShieldCheck className="w-4 h-4" /> NanoGen API
              </button>
            </div>

            {activeView === 'CODE' && (
              <div className="animate-fadeIn">
                <div className="flex border-b border-slate-800 bg-slate-800/20 overflow-x-auto custom-scrollbar">
                  {INTEGRATION_PLATFORMS.map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform)}
                      className={`px-6 py-5 flex items-center gap-3 font-black text-[9px] uppercase tracking-[0.2em] transition-all whitespace-nowrap border-b-2 relative ${selectedPlatform.id === platform.id ? 'bg-slate-900 text-blue-400 border-b-blue-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border-b-transparent'}`}
                    >
                      {renderIcon(platform.icon)}
                      {platform.name}
                      {isPlatformConfigured(platform.id, platform.requiredKeys.map(k => k.id)) && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-8 relative group bg-black/40">
                  <div className="absolute top-6 right-6 z-10">
                    <Tooltip content="Copy production-ready integration code with injected credentials">
                      <Button 
                        size="sm"
                        onClick={() => handleCopy(codeSnippet)}
                        icon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        className="shadow-2xl active:scale-95"
                      >
                        {copied ? 'Copied' : 'Copy Payload'}
                      </Button>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <div className="absolute top-2 left-2 flex gap-1.5 opacity-40">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <pre className="font-mono text-xs sm:text-[13px] text-blue-200/90 overflow-x-auto p-10 pt-14 bg-[#020408] rounded-3xl border border-slate-800/60 leading-relaxed custom-scrollbar shadow-inner">
                      <code className="block">{codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'KEYS' && (
              <div className="p-8 space-y-8 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {INTEGRATION_PLATFORMS.filter(p => p.requiredKeys.length > 0).map(platform => (
                      <button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform)}
                        className={`p-4 rounded-2xl border text-center transition-all ${selectedPlatform.id === platform.id ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                      >
                         <div className="flex justify-center mb-3">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPlatform.id === platform.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                             {renderIcon(platform.icon)}
                           </div>
                         </div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-200">{platform.name}</h4>
                         {isPlatformConfigured(platform.id, platform.requiredKeys.map(k => k.id)) && (
                            <div className="mt-2 flex items-center justify-center gap-1.5 text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                               <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                            </div>
                         )}
                      </button>
                   ))}
                </div>
                <PlatformKeyForm 
                  platform={selectedPlatform}
                  keys={platformKeys}
                  onKeyChange={(kid, val) => saveKey(selectedPlatform.id, kid, val)}
                  onClear={() => clearPlatformKeys(selectedPlatform.id)}
                  isConfigured={isConnected}
                />
              </div>
            )}

            {activeView === 'NANOGEN' && (
              <div className="p-12 space-y-8 animate-fadeIn">
                <div className="max-w-xl mx-auto space-y-6 text-center">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] border border-blue-500/20 flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/10">
                    <ShieldCheck className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">NanoGen API Access</h3>
                  <p className="text-slate-500 text-sm font-medium">
                    Generate and manage keys to authorize external applications to use NanoGen's design-to-merch engine.
                  </p>
                  
                  <div className="relative group mt-8">
                     <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                     <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                        <div className="flex flex-col items-start gap-1 w-full min-w-0">
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">NanoGen Live Key</span>
                           <div className="flex items-center gap-3 w-full">
                              <code className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-blue-400 font-mono text-xs flex-1 truncate select-all">
                                {showKey ? nanogenKey : '•'.repeat(32)}
                              </code>
                              <button 
                                onClick={() => setShowKey(!showKey)}
                                className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-xl transition-all"
                              >
                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                           </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                           <Tooltip content="Rotate your NanoGen API key. Previous key will be revoked immediately.">
                              <button 
                                onClick={generateNewKey}
                                className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-blue-400 rounded-xl transition-all border border-slate-800"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                           </Tooltip>
                           <Button onClick={() => handleCopy(nanogenKey)} icon={<Copy className="w-4 h-4" />}>
                              Copy
                           </Button>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20 text-left">
                     <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                     <div className="space-y-1">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Security Warning</span>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                          Your API key grants full access to your NanoGen credits and saved assets. Never share it in client-side code or public repositories.
                        </p>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <div className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-[3rem] flex items-center gap-8 shadow-sm">
             <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-inner">
               <Zap className="w-8 h-8 text-blue-500 fill-blue-500/10" />
             </div>
             <div className="flex-1">
                <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-1">Production-Ready Scaling</h4>
                <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                  Connect to thousands of Print-on-Demand variants through our unified API bridge. Join 2,000+ top-tier merchants.
                </p>
             </div>
             <Button variant="outline" className="shrink-0 border-blue-500/30 text-blue-400">View Docs</Button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <header className="flex items-center gap-4 px-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-xl shadow-amber-500/5">
                <Milestone className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Next Sprint</h3>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Innovation Roadmap</p>
              </div>
           </header>

           <div className="space-y-4">
              {ROADMAP.map((item, i) => (
                <div key={i} className="bg-[#05070a] border border-slate-800 p-6 rounded-[2.5rem] group hover:border-slate-600 transition-all cursor-default shadow-sm hover:shadow-2xl hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:bg-slate-800 transition-colors">
                        {item.icon}
                      </div>
                      <h4 className="text-[11px] font-black text-slate-200 uppercase tracking-widest group-hover:text-white transition-colors">{item.title}</h4>
                    </div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">{item.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed group-hover:text-slate-400 transition-colors uppercase tracking-widest">
                    {item.desc}
                  </p>
                </div>
              ))}
           </div>

           <div className="bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border border-indigo-500/20 p-8 rounded-[3.5rem] relative overflow-hidden group cursor-pointer shadow-2xl">
              <div className="relative z-10 space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Developer Beta</h4>
                  <p className="text-[11px] text-slate-500 font-black leading-relaxed uppercase tracking-widest">
                    Request custom marketplace bridges for Q1 2025 release cycle.
                  </p>
                </div>
                <button className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-widest group-hover:gap-5 transition-all bg-indigo-600 px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/30">
                  Join Beta Access <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <Sparkles className="absolute -bottom-6 -right-6 w-36 h-36 text-indigo-500/10 rotate-12 group-hover:scale-125 group-hover:rotate-45 transition-all duration-700" />
           </div>
        </div>
      </div>
    </div>
  );
};