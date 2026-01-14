
import React from 'react';
import { IntegrationPlatform } from '../data/platforms';
import { Input, Button, Card, Badge, Tooltip } from '@/shared/components/ui';
import { Key, ShieldCheck, Trash2, Info } from 'lucide-react';

interface PlatformKeyFormProps {
  platform: IntegrationPlatform;
  keys: Record<string, string>;
  onKeyChange: (keyId: string, value: string) => void;
  onClear: () => void;
  isConfigured: boolean;
}

export const PlatformKeyForm: React.FC<PlatformKeyFormProps> = ({
  platform,
  keys,
  onKeyChange,
  onClear,
  isConfigured
}) => {
  if (platform.requiredKeys.length === 0) {
    return (
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-center">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
          No keys required for {platform.name}
        </p>
      </div>
    );
  }

  return (
    <Card className="border-slate-800 bg-slate-900/20" noPadding>
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Key className="w-4 h-4 text-blue-400" />
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">
            {platform.name} Configuration
          </h4>
        </div>
        <div className="flex items-center gap-3">
          {isConfigured ? (
            <Badge variant="success" icon={<ShieldCheck className="w-3 h-3" />}>Configured</Badge>
          ) : (
            <Badge variant="warning">Missing Keys</Badge>
          )}
          {isConfigured && (
            <Tooltip content="Clear all saved credentials for this platform">
              <button 
                onClick={onClear}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          )}
        </div>
      </header>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platform.requiredKeys.map(key => (
            <Input
              key={key.id}
              label={key.label}
              type={key.type}
              placeholder={key.placeholder}
              value={keys[key.id] || ''}
              onChange={(e) => onKeyChange(key.id, e.target.value)}
              className="bg-slate-900/50"
            />
          ))}
        </div>
        <div className="flex items-start gap-3 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
            Keys are stored locally in your browser. They are used exclusively to populate the integration code templates and are never sent to NanoGen's servers.
          </p>
        </div>
      </div>
    </Card>
  );
};
