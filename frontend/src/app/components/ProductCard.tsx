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
      className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      onClick={() => onProductClick(product.id)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
          >
            <Heart
              className={`w-5 h-5 ${
                product.isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </Button>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate text-gray-900 mb-1">{product.title}</h3>
        <p className="text-blue-600 mb-2">${product.price.toFixed(2)}</p>
        <div className="flex items-center gap-2">
          <img
            src={product.seller.avatar}
            alt={product.seller.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-gray-600 truncate">{product.seller.name}</span>
        </div>
      </div>
    </div>
  );
}
