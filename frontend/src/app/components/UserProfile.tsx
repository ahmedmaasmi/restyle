"use client";
import { useState } from 'react';
import { Star, Edit2, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { User, Product } from '../types';
import { ProductCard } from './ProductCard';

interface UserProfileProps {
  user: User;
  userProducts: Product[];
  isOwnProfile: boolean;
  onNavigate: (page: string, productId?: string) => void;
  onUpdateProfile?: (updates: Partial<User>) => void;
  onToggleFavorite: (productId: string) => void;
}

export function UserProfile({
  user,
  userProducts,
  isOwnProfile,
  onNavigate,
  onUpdateProfile,
  onToggleFavorite,
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    bio: user.bio || '',
  });

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editData);
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-32 h-32 rounded-full"
          />
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editData.bio}
                    onChange={(e) =>
                      setEditData({ ...editData, bio: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({ name: user.name, bio: user.bio || '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-gray-900 mb-2">{user.name}</h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{user.rating} rating</span>
                      </div>
                      <span>•</span>
                      <span>{user.totalSales} sales</span>
                    </div>
                  </div>
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {user.bio && (
                  <p className="text-gray-700 mb-4">{user.bio}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* User's Listings */}
      <div>
        <h2 className="text-gray-900 mb-6">
          {isOwnProfile ? 'My Listings' : `${user.name}'s Listings`}
        </h2>
        {userProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {userProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={(id) => onNavigate('product', id)}
                onToggleFavorite={isOwnProfile ? onToggleFavorite : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No items listed yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
