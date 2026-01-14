
import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label 
            htmlFor={id} 
            className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 cursor-pointer select-none transition-colors hover:text-slate-400"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`.trim() || undefined}
            className={`
              w-full bg-slate-900 border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600
              outline-none transition-all duration-200
              focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 group-hover:border-slate-700
              disabled:opacity-40 disabled:cursor-not-allowed
              ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-800'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="px-1 text-[10px] font-black uppercase tracking-wider text-red-400 animate-fadeIn" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="px-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
