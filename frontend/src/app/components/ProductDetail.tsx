"use client";
import { ArrowLeft, Heart, Star, MessageCircle, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface ProductDetailProps {
  product: Product;
  onNavigate: (page: string) => void;
  onToggleFavorite: (productId: string) => void;
  onBuyNow: (productId: string) => void;
  onMessageSeller: (productId: string, sellerId: string) => void;
}

export function ProductDetail({
  product,
  onNavigate,
  onToggleFavorite,
  onBuyNow,
  onMessageSeller,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => onNavigate('home')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Browse
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <ImageWithFallback
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-purple-500' : 'border-transparent'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-2">{product.title}</h1>
              <p className="text-blue-600">${product.price.toFixed(2)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(product.id)}
            >
              <Heart
                className={`w-6 h-6 ${
                  product.isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'
                }`}
              />
            </Button>
          </div>

          {/* Product Details */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{product.condition}</Badge>
              {product.size && <Badge variant="outline">Size: {product.size}</Badge>}
              {product.brand && <Badge variant="outline">{product.brand}</Badge>}
              <Badge variant="outline">{product.category}</Badge>
            </div>

            <div>
              <h3 className="text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-gray-900 mb-3">Seller Information</h3>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-gray-900">{product.seller.name}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{product.seller.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{product.seller.totalSales} sales</span>
                </div>
              </div>
            </div>
            {product.seller.bio && (
              <p className="text-gray-600">{product.seller.bio}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={() => onBuyNow(product.id)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Buy Now
            </Button>
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => onMessageSeller(product.id, product.sellerId)}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Message Seller
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-gray-600">
            <p className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4" />
              {product.favoriteCount} people favorited this item
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
