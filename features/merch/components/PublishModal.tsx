import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, ShoppingBag, ExternalLink } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { INTEGRATION_PLATFORMS } from '@/features/integrations/data/platforms';
import { usePlatformKeys } from '@/shared/hooks/usePlatformKeys';

interface PublishModalProps {
  onClose: () => void;
  onPublish: (platformId: string, keys: Record<string, string>) => Promise<boolean>;
  isPublishing: boolean;
}

export const PublishModal: React.FC<PublishModalProps> = ({ onClose, onPublish, isPublishing }) => {
  const { getKeysForPlatform, isPlatformConfigured } = usePlatformKeys();
  const [selectedPlatform, setSelectedPlatform] = useState(INTEGRATION_PLATFORMS[0].id);
  const [success, setSuccess] = useState(false);

  const configuredPlatforms = INTEGRATION_PLATFORMS.filter(p => 
    p.requiredKeys.length === 0 || isPlatformConfigured(p.id, p.requiredKeys.map(k => k.id))
  );

  const handlePublish = async () => {
    const keys = getKeysForPlatform(selectedPlatform);
    const result = await onPublish(selectedPlatform, keys);
    if (result) {
      setSuccess(true);
      setTimeout(onClose, 2000);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fadeIn overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
             <ShoppingBag className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">Direct Publish</h2>
          <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Push to connected merchants</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3 animate-fadeIn">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-in zoom-in spin-in-12 duration-300" />
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Published Successfully</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Select Destination</label>
              <div className="relative">
                <select 
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-500 appearance-none font-bold"
                >
                  {INTEGRATION_PLATFORMS.map(p => {
                    const isReady = configuredPlatforms.find(cp => cp.id === p.id);
                    return (
                      <option key={p.id} value={p.id} disabled={!isReady} className="bg-slate-900">
                        {p.name} {isReady ? '✓' : '(Needs Config)'}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePublish}
              loading={isPublishing}
              loadingText="Publishing..."
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 text-xs uppercase tracking-widest font-black"
              icon={<ExternalLink className="w-4 h-4" />}
            >
              Publish Now
            </Button>
            
            <p className="text-[10px] text-slate-600 text-center leading-relaxed px-4">
              By publishing, you agree to the terms of service of the selected platform. Asset rights are transferred upon upload.
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};