"use client";
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface HomePageProps {
  products: Product[];
  onNavigate: (page: string, productId?: string) => void;
  onCategoryClick: (category: string) => void;
  onToggleFavorite: (productId: string) => void;
}

export function HomePage({ products, onNavigate, onCategoryClick, onToggleFavorite }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use the same categories as Navbar
  const categories = [
    'Women',
    'Men',
    'Kids',
    'Accessories',
    'footwear',
  ];

  // Get images for each category from products
  const getCategoryImage = (categoryName: string): string => {
    const categoryProduct = products.find(p => 
      p.category.toLowerCase() === categoryName.toLowerCase()
    );
    return categoryProduct?.images[0] || 'https://images.unsplash.com/photo-1634133118645-74a2adf44170?w=400';
  };

  const popularCategories = categories.map(category => ({
    name: category,
    image: getCategoryImage(category),
  }));

  const banners = [
    {
      type: 'phone',
      bgColor: 'from-indigo-900 via-blue-900 to-purple-900',
    },
    {
      type: 'sneakers',
      bgColor: 'from-cyan-400 via-cyan-500 to-blue-500',
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Banners */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* iPhone Banner */}
            <div className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 rounded-2xl overflow-hidden h-72 md:h-80">
              <div className="absolute inset-0 flex items-center">
                <div className="p-8 md:p-12 flex-1">
                  <h2 className="text-white text-3xl md:text-4xl mb-2">
                    iPhone 16 Pro Max
                  </h2>
                  <p className="text-white text-2xl md:text-3xl mb-2">
                    From $ 50,769*
                  </p>
                  <p className="text-white/80 mb-6">
                    All-6 chip, Superfine Increment
                    <br />
                    History, Biggest Price Drop
                  </p>
                  <Button 
                    className="bg-indigo-700 hover:bg-indigo-600 text-white rounded-full px-6"
                    onClick={() => onNavigate('browse')}
                  >
                    Shop Now
                  </Button>
                  <p className="text-white/60 text-xs mt-4">*Incl. All Offers</p>
                </div>
                <div className="hidden md:block flex-1 relative h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1603732133854-4eb5f41d1fa2?w=400" 
                    alt="iPhone" 
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-[90%] object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Sneakers Banner */}
            <div className="relative bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 rounded-2xl overflow-hidden h-72 md:h-80">
              <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center">
                <h2 className="text-white text-4xl md:text-5xl mb-2">SALE</h2>
                <p className="text-white text-xs mb-2">UP TO</p>
                <p className="text-white text-6xl md:text-7xl mb-4">50%</p>
                <p className="text-white text-xl">OFF</p>
              </div>
              <div className="absolute bottom-0 right-0 left-0">
                <img 
                  src="https://images.unsplash.com/photo-1719523677291-a395426c1a87?w=600" 
                  alt="Sneakers" 
                  className="w-full h-32 md:h-40 object-cover object-top opacity-90"
                />
              </div>
            </div>
          </div>

          {/* Carousel dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2, 3].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-8 bg-white mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-2xl">Explore Popular Categories</h2>
            <button 
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              onClick={() => onNavigate('browse')}
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {popularCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => onCategoryClick(category.name)}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-full aspect-square rounded-full bg-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm text-gray-700 text-center group-hover:text-blue-600">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Items */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-2xl">Trending Now</h2>
            <button 
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              onClick={() => onNavigate('browse')}
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={(id) => onNavigate('product', id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
