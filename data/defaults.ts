// This file has been deprecated. Data is now located in feature-specific directories.
import { MerchProduct } from '../features/merch/types';

export const MERCH_PRODUCTS: MerchProduct[] = [
  { 
    id: 'poster-main', 
    name: 'Poster', 
    description: 'Matte finish paper print', 
    placeholderImage: 'https://placehold.co/400x400/1e293b/ffffff?text=Poster',
    defaultPrompt: 'A {style_preference} product shot of a large matte poster print of abstract art, prominently featuring this logo.' 
  }
];