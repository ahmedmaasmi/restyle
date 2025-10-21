"use client";
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface BrowsePageProps {
  products: Product[];
  onNavigate: (page: string, productId?: string) => void;
  onToggleFavorite: (productId: string) => void;
  selectedCategory?: string;
}

export function BrowsePage({
  products,
  onNavigate,
  onToggleFavorite,
  selectedCategory,
}: BrowsePageProps) {
  const [sortBy, setSortBy] = useState('newest');
  const [category, setCategory] = useState(selectedCategory || 'all');

  const categories = [
    'all',
    'Women',
    'Men',
    'Kids',
    'Home',
    'Accessories',
    'Electronics',
  ];

  const filteredProducts = products.filter((product) => {
    if (category !== 'all' && product.category !== category) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return b.favoriteCount - a.favoriteCount;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">
            {category === 'all' ? 'All Items' : category}
          </h1>
          <p className="text-gray-600">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={(id) => onNavigate('product', id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No items found in this category</p>
        </div>
      )}
    </div>
  );
}
