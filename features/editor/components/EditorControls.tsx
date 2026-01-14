
import React from 'react';
import { Button, Input, Alert } from '@/shared/components/ui';
import { Wand2, Eraser } from 'lucide-react';

interface EditorControlsProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  onEdit: () => void;
  loading: boolean;
  canEdit: boolean;
  error: string | null;
  onErrorDismiss: () => void;
}

const QUICK_PROMPTS = ['Add cyberpunk neon lights', 'Turn into a sketch', 'Make it a vector art', 'Pixel art style'];

export const EditorControls: React.FC<EditorControlsProps> = ({
  prompt,
  onPromptChange,
  onEdit,
  loading,
  canEdit,
  error,
  onErrorDismiss
}) => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
      <label className="block text-sm font-medium text-slate-400 mb-2">
        Edit Instruction
      </label>
      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => { onPromptChange(e.target.value); }}
          placeholder="E.g., 'Add a retro filter', 'Remove background'"
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && onEdit()}
        />
        <Button 
          onClick={onEdit} 
          loading={loading} 
          loadingText="Wait" 
          disabled={!canEdit}
          icon={<Wand2 className="w-5 h-5" />}
        >
          Go
        </Button>
      </div>
      
      <div className="mt-4 flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => onPromptChange('Remove background')}
              className="flex items-center gap-2 text-sm bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-lg border border-indigo-500/20 transition-all w-full sm:w-auto justify-center"
            >
              <Eraser className="w-4 h-4" />
              Remove Background
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button 
                key={p}
                onClick={() => onPromptChange(p)}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-600"
              >
                {p}
              </button>
            ))}
          </div>
      </div>

      {error && <Alert message={error} onDismiss={onErrorDismiss} />}
    </div>
  );
};
