
import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  error?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  options, 
  error, 
  placeholder,
  className = "", 
  id: providedId, 
  ...props 
}) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 cursor-pointer select-none transition-colors hover:text-slate-400"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`
            w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 
            outline-none transition-all cursor-pointer appearance-none
            focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 group-hover:border-slate-700
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800'}
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
      {error && (
        <p id={errorId} className="px-1 text-[10px] font-black uppercase tracking-wider text-red-400 animate-fadeIn" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
