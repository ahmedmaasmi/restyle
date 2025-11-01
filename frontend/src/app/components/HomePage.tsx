"use client";
import { ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import HeroSlider from './heroSlider';
import { FadeIn } from './react-bits/FadeIn';
import { SplitText } from './react-bits/SplitText';
import { Stagger } from './react-bits/Stagger';

interface HomePageProps {
  products: Product[];
  onNavigate: (page: string, productId?: string) => void;
  onCategoryClick: (category: string) => void;
  onToggleFavorite: (productId: string) => void;
}

export function HomePage({ products, onNavigate, onCategoryClick, onToggleFavorite }: HomePageProps) {

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

  return (
    <div className="bg-gray-50">
      {/* Hero Slider */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSlider />
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-8 bg-white mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up" delay={100} duration={600}>
            <div className="flex items-center justify-between mb-6">
              <SplitText as="h2" className="text-gray-900 text-2xl" delay={150}>
                Explore Popular Categories
              </SplitText>
              <button 
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                onClick={() => onNavigate('browse')}
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </FadeIn>
          
          <Stagger delay={200} staggerDelay={80} className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {popularCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => onCategoryClick(category.name)}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-full aspect-square rounded-full bg-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm text-gray-700 text-center group-hover:text-blue-600 transition-colors">
                  {category.name}
                </span>
              </button>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Trending Items */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up" delay={100} duration={600}>
            <div className="flex items-center justify-between mb-6">
              <SplitText as="h2" className="text-gray-900 text-2xl" delay={150}>
                Trending Now
              </SplitText>
              <button 
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                onClick={() => onNavigate('browse')}
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </FadeIn>
          <Stagger delay={300} staggerDelay={100} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={(id) => onNavigate('product', id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
