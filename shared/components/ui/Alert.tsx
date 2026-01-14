
import React from 'react';
import { AlertCircle, X, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  message: string;
  onDismiss?: () => void;
  title?: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
}

export const Alert: React.FC<AlertProps> = ({ message, onDismiss, title, variant = 'error' }) => {
  const configs = {
    error: {
      styles: "bg-red-500/10 border-red-500/30 text-red-100",
      icon: <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />,
      role: "alert",
      defaultTitle: "Critical Error"
    },
    warning: {
      styles: "bg-amber-500/10 border-amber-500/30 text-amber-100",
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />,
      role: "status",
      defaultTitle: "Attention Required"
    },
    info: {
      styles: "bg-blue-500/10 border-blue-500/30 text-blue-100",
      icon: <Info className="w-5 h-5 text-blue-500" aria-hidden="true" />,
      role: "status",
      defaultTitle: "System Information"
    },
    success: {
      styles: "bg-emerald-500/10 border-emerald-500/30 text-emerald-100",
      icon: <Info className="w-5 h-5 text-emerald-500" aria-hidden="true" />,
      role: "status",
      defaultTitle: "Success"
    }
  };

  const config = configs[variant];

  return (
    <div 
      role={config.role} 
      className={`p-4 rounded-2xl border flex items-start gap-4 animate-fadeIn shadow-lg backdrop-blur-md ${config.styles}`}
    >
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">
          {title || config.defaultTitle}
        </h4>
        <p className="text-xs font-medium leading-relaxed break-words">
          {message}
        </p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss} 
          className="ml-auto -mr-1 -mt-1 p-2 rounded-xl opacity-60 hover:opacity-100 hover:bg-black/20 transition-all focus-visible:ring-2 focus-visible:ring-current outline-none"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
