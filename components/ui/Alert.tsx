import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

interface AlertProps {
  message: string;
  onDismiss?: () => void;
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({ message, onDismiss, title = "Generation Failed" }) => (
  <div className="mt-4 p-3 bg-red-900/20 border border-red-900/30 rounded-lg flex items-start gap-3 animate-fadeIn">
    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-sm text-red-200 font-medium">{title}</p>
      <p className="text-xs text-red-300/80 mt-1 leading-relaxed">{message}</p>
    </div>
    {onDismiss && (
      <button onClick={onDismiss} className="text-red-400 hover:text-red-300 p-1 transition-colors">
        <XCircle className="w-4 h-4" />
      </button>
    )}
  </div>
);
