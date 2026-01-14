
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'indigo' | 'blue';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = "", icon }) => {
  const variants = {
    default: "bg-slate-800 text-slate-200 border-slate-700",
    outline: "bg-transparent border border-slate-700 text-slate-300",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/30"
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border 
      ${variants[variant]} ${className}
    `}>
      {icon && <span className="w-3 h-3 shrink-0" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
};
