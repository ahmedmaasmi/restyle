"use client";
import { Heart } from 'lucide-react';
import { Product } from '../types';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onProductClick: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
}

export function ProductCard({ product, onProductClick, onToggleFavorite }: ProductCardProps) {
  return (
    <div
      className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onClick={() => onProductClick(product.id)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                product.isFavorited ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-700'
              }`}
            />
          </Button>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="truncate text-gray-900 mb-1 font-medium group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-blue-600 mb-2 font-semibold text-lg">${product.price.toFixed(2)}</p>
        <div className="flex items-center gap-2">
          <img
            src={product.seller.avatar}
            alt={product.seller.name}
            className="w-6 h-6 rounded-full ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all duration-300"
          />
          <span className="text-gray-600 truncate text-sm">{product.seller.name}</span>
        </div>
      </div>
    </div>
  );
}
