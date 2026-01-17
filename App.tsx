import React, { useState, Suspense } from 'react';
import { AppMode } from './shared/types';
import { Spinner } from './shared/components/ui/Spinner';
import { Shell } from './shared/components/layout/Shell';

const ImageEditor = React.lazy(() => import('./features/editor/components/ImageEditor').then(module => ({ default: module.ImageEditor })));
const MerchStudio = React.lazy(() => import('./features/merch/components/MerchStudio').then(module => ({ default: module.MerchStudio })));
const IntegrationCode = React.lazy(() => import('./features/integrations/components/IntegrationCode').then(module => ({ default: module.IntegrationCode })));

const LoadingScreen = () => (
  <div className="h-full w-full flex items-center justify-center min-h-[400px]">
    <Spinner className="w-12 h-12 text-blue-500" />
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppMode>('MERCH');
  const [lastPrompt, setLastPrompt] = useState<string>("");

  const handleImageGenerated = (url: string, prompt: string) => {
    setLastPrompt(prompt);
  };

  return (
    <Shell activeTab={activeTab} onTabChange={setActiveTab}>
      <Suspense fallback={<LoadingScreen />}>
        {activeTab === 'EDITOR' && (
          <div className="h-full animate-fadeIn flex flex-col">
            <header className="mb-8 space-y-2">
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Creative Editor</h1>
              <p className="text-slate-400 font-medium text-lg">Hyper-realistic image synthesis and contextual AI analysis.</p>
            </header>
            <div className="flex-1 min-h-0">
              <ImageEditor onImageGenerated={handleImageGenerated} />
            </div>
          </div>
        )}

        {activeTab === 'MERCH' && (
          <div className="h-full animate-fadeIn flex flex-col">
            <header className="mb-8 space-y-2">
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Merch Studio</h1>
              <p className="text-slate-400 font-medium text-lg">On-demand 3D product visualization and brand expansion.</p>
            </header>
            <div className="flex-1 min-h-0">
              <MerchStudio onImageGenerated={handleImageGenerated} />
            </div>
          </div>
        )}

        {activeTab === 'INTEGRATIONS' && (
          <div className="h-full animate-fadeIn overflow-y-auto custom-scrollbar">
            <IntegrationCode lastPrompt={lastPrompt} />
          </div>
        )}
      </Suspense>
    </Shell>
  );
};

export default App;
