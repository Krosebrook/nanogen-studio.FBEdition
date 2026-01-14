
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = "", 
  title, 
  subtitle,
  action, 
  noPadding = false 
}) => (
  <article className={`bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl ${className}`}>
    {(title || action) && (
      <header className="px-6 py-5 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm">
        <div className="flex flex-col gap-1 min-w-0">
          {title && (
            <h3 className="text-sm font-black text-white uppercase tracking-widest truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 ml-4">{action}</div>}
      </header>
    )}
    <div className={noPadding ? "" : "p-6"}>
      {children}
    </div>
  </article>
);
