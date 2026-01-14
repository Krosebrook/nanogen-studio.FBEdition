import React, { useEffect, useState } from 'react';
import { AppMode } from '@/shared/types';
import { Zap, Wand2, Shirt, Code, Database } from 'lucide-react';
import { logger } from '@/shared/utils/logger';
import { Badge } from '../ui';

interface ShellProps {
  activeTab: AppMode;
  onTabChange: (tab: AppMode) => void;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ activeTab, onTabChange, children }) => {
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const hasEditor = localStorage.getItem('nanogen_editor_session');
    const hasMerch = localStorage.getItem('nanogen_merch_session');
    if (hasEditor || hasMerch) {
      setRestored(true);
      const t = setTimeout(() => setRestored(false), 5000);
      return () => clearTimeout(t);
    }
  }, []);

  const handleTabChange = (tab: AppMode) => {
    logger.debug(`Navigating to tab: ${tab}`);
    onTabChange(tab);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                NanoGen Studio
              </span>
            </div>
            {restored && (
              <Badge variant="blue" icon={<Database className="w-3 h-3" />} className="animate-fadeIn">
                Local Session Restored
              </Badge>
            )}
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50" role="tablist">
            <NavButton 
              active={activeTab === 'EDITOR'} 
              onClick={() => handleTabChange('EDITOR')} 
              icon={<Wand2 className="w-4 h-4" />} 
              label="Creative" 
            />
            <NavButton 
              active={activeTab === 'MERCH'} 
              onClick={() => handleTabChange('MERCH')} 
              icon={<Shirt className="w-4 h-4" />} 
              label="Studio" 
            />
            <NavButton 
              active={activeTab === 'INTEGRATIONS'} 
              onClick={() => handleTabChange('INTEGRATIONS')} 
              icon={<Code className="w-4 h-4" />} 
              label="API" 
            />
          </nav>

          <div className="flex items-center gap-4" />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        <div className="h-full">
          {children}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        /* Mobile safe area padding for PWA standalone mode */
        @supports(padding: max(0px)) {
          main {
            padding-bottom: max(2rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ 
  active, onClick, icon, label 
}) => (
  <button
    onClick={onClick}
    role="tab"
    aria-selected={active}
    className={`px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 outline-none focus:ring-2 focus:ring-blue-500/50 ${
      active 
        ? 'bg-slate-700 text-white shadow-md' 
        : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
    }`}
  >
    {icon}
    <span className="hidden xs:inline">{label}</span>
  </button>
);