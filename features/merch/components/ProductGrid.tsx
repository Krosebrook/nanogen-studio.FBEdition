
import React from 'react';
import { MerchProduct } from '../types';
import { MERCH_PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  selectedId: string;
  onSelect: (product: MerchProduct) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ selectedId, onSelect }) => {
  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar pb-2"
      role="group"
      aria-label="Product selection grid"
    >
      {MERCH_PRODUCTS.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          isSelected={selectedId === product.id}
          onClick={() => onSelect(product)}
        />
      ))}
    </div>
  );
};
