
import React from 'react';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  loading, 
  loadingText, 
  variant = 'primary', 
  size = 'md',
  icon,
  className = "",
  disabled,
  type = "button",
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 active:scale-[0.97] outline-none disabled:opacity-40 disabled:pointer-events-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 overflow-hidden";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 border border-blue-500/50 focus-visible:ring-blue-500/50",
    indigo: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500/50 focus-visible:ring-indigo-500/50",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 focus-visible:ring-slate-500/50",
    outline: "bg-transparent hover:bg-slate-800 text-slate-200 border border-slate-700 focus-visible:ring-slate-700/50",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 border border-red-500/50 focus-visible:ring-red-500/50",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white focus-visible:ring-slate-700/50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px] rounded-lg min-h-[32px] min-w-[32px]",
    md: "px-5 py-2.5 text-xs rounded-xl min-h-[42px] min-w-[100px]",
    lg: "px-8 py-3.5 text-sm rounded-2xl min-h-[52px] min-w-[140px]"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      <div className={`flex items-center justify-center gap-2 transition-transform duration-200 ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
        <span className="truncate">{children}</span>
      </div>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center gap-3 animate-fadeIn">
          <Spinner className="w-5 h-5 shrink-0" aria-hidden="true" />
          {loadingText && <span className="text-[10px] uppercase tracking-widest font-black">{loadingText}</span>}
        </div>
      )}
    </button>
  );
};