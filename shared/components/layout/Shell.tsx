
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                NanoGen Studio
              </span>
            </div>
            {restored && (
              <Badge variant="blue" icon={<Database className="w-3 h-3" />} className="animate-fadeIn">
                Local Session Restored
              </Badge>
            )}
          </div>

          <nav className="flex items-center gap-2 bg-slate-800/60 p-1.5 rounded-full border border-slate-700/60" role="tablist">
            <NavButton
              active={activeTab === 'EDITOR'}
              onClick={() => handleTabChange('EDITOR')}
              icon={<Wand2 className="w-5 h-5" />}
              label="Creative"
            />
            <NavButton
              active={activeTab === 'MERCH'}
              onClick={() => handleTabChange('MERCH')}
              icon={<Shirt className="w-5 h-5" />}
              label="Studio"
            />
            <NavButton
              active={activeTab === 'INTEGRATIONS'}
              onClick={() => handleTabChange('INTEGRATIONS')}
              icon={<Code className="w-5 h-5" />}
              label="API"
            />
          </nav>

          <div className="flex items-center gap-4">
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-hidden">
        <div className="h-full">
          {children}
        </div>
      </main>

      <footer className="border-t border-slate-800 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <p>&copy; 2024 NanoGen Studio. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>


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
          background: #475569;
          border-radius: 10px;
        }
        /* Mobile safe area padding for PWA standalone mode */
        @supports(padding: max(0px)) {
          main {
            padding-bottom: max(2.5rem, env(safe-area-inset-bottom));
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
    className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 ${
      active
        ? 'bg-slate-700/50 text-white shadow-lg'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);
