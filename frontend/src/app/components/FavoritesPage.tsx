import { Heart } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';

interface FavoritesPageProps {
  favoriteProducts: Product[];
  onNavigate: (page: string, productId?: string) => void;
  onToggleFavorite: (productId: string) => void;
}

export function FavoritesPage({
  favoriteProducts,
  onNavigate,
  onToggleFavorite,
}: FavoritesPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-gray-900 mb-8">My Favorites</h1>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={(id) => onNavigate('product', id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-6">
            Start adding items to your favorites
          </p>
          <Button onClick={() => onNavigate('home')}>Browse Items</Button>
        </div>
      )}
    </div>
  );
}
