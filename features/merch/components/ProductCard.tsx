import React, { useState } from 'react';
import { MerchProduct } from '../types';
import { ImageOff, CheckCircle2 } from 'lucide-react';
import { Tooltip } from '@/shared/components/ui';

interface ProductCardProps {
  product: MerchProduct;
  isSelected: boolean;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Tooltip content={`Select the ${product.name} model as your primary design target for AI mockup generation.`} className="h-full">
      <button 
        type="button"
        onClick={onClick}
        aria-pressed={isSelected}
        aria-label={`Select product: ${product.name}. ${product.description}`}
        className={`
          group relative w-full p-3 rounded-xl border cursor-pointer transition-all duration-300 ease-out text-left
          hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
          flex flex-col h-full
          ${isSelected 
            ? 'bg-blue-600/10 border-blue-500 shadow-blue-900/20 ring-1 ring-blue-500/50' 
            : 'bg-slate-900 border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800/50'
          }
        `}
      >
        <div className="aspect-square w-full rounded-lg bg-slate-800 overflow-hidden relative mb-3 flex items-center justify-center border border-slate-800 group-hover:border-slate-700 transition-colors">
          {!imgError ? (
            <img 
              src={product.placeholderImage} 
              alt="" // Decorative as the button label provides the context
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isSelected ? 'scale-105' : 'group-hover:scale-110 opacity-90 group-hover:opacity-100'
              }`} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-600">
              <ImageOff className="w-8 h-8 mb-2 opacity-50" aria-hidden="true" />
              <span className="text-[10px] uppercase font-bold tracking-wider">No Preview</span>
            </div>
          )}
          
          {isSelected && (
            <div className="absolute inset-0 bg-blue-500/10 pointer-events-none ring-inset ring-1 ring-white/10 flex items-center justify-center">
               <div className="bg-blue-600 rounded-full p-1 shadow-lg transform scale-100 transition-transform animate-in zoom-in-50 duration-200">
                  <CheckCircle2 className="w-4 h-4 text-white" aria-hidden="true" />
               </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-grow">
          <h4 className={`text-sm font-semibold mb-1 leading-tight ${
            isSelected ? 'text-blue-100' : 'text-slate-200 group-hover:text-white'
          }`}>
            {product.name}
          </h4>
          <p className={`text-xs leading-relaxed line-clamp-2 ${
            isSelected ? 'text-blue-200/80 font-medium' : 'text-slate-400 group-hover:text-slate-300'
          }`}>
            {product.description}
          </p>
        </div>
      </button>
    </Tooltip>
  );
};