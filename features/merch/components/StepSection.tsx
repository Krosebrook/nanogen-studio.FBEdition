
import React from 'react';

interface StepSectionProps {
  number: number;
  title: string;
  badge?: string;
  children: React.ReactNode;
}

export const StepSection: React.FC<StepSectionProps> = ({ number, title, badge, children }) => (
  <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/60 shadow-sm">
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-500 border border-blue-500/20 flex items-center justify-center text-[11px] font-black">
          {number}
        </div>
        <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-[0.2em]">
          {title}
        </h3>
      </div>
      {badge && (
        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
          {badge}
        </span>
      )}
    </div>
    {children}
  </div>
);
