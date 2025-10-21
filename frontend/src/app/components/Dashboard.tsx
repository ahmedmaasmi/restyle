"use client";
import { useState } from 'react';
import { Package, ShoppingBag, MessageCircle, Plus, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Product, Purchase, Conversation } from '../../../types';
import { ProductCard } from './ProductCard';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface DashboardProps {
  userProducts: Product[];
  purchases: Purchase[];
  conversations: Conversation[];
  onNavigate: (page: string, productId?: string) => void;
  onAddProduct: (product: Partial<Product>) => void;
  onToggleFavorite: (productId: string) => void;
}

export function Dashboard({
  userProducts,
  purchases,
  conversations,
  onNavigate,
  onAddProduct,
  onToggleFavorite,
}: DashboardProps) {
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    size: '',
    brand: '',
    condition: 'Good' as const,
  });

  const handleSubmitProduct = () => {
    if (!newProduct.title || !newProduct.description || !newProduct.price) {
      alert('Please fill in required fields');
      return;
    }

    onAddProduct({
      ...newProduct,
      price: parseFloat(newProduct.price),
    });

    setNewProduct({
      title: '',
      description: '',
      price: '',
      category: '',
      size: '',
      brand: '',
      condition: 'Good',
    });
    setShowAddProductDialog(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-gray-900">My Dashboard</h1>
        <Button onClick={() => setShowAddProductDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          List New Item
        </Button>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="items">
            <Package className="w-4 h-4 mr-2" />
            My Items ({userProducts.length})
          </TabsTrigger>
          <TabsTrigger value="purchases">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Purchases ({purchases.length})
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageCircle className="w-4 h-4 mr-2" />
            Messages ({conversations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          {userProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {userProducts.map((product) => (
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
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No items listed yet</h3>
              <p className="text-gray-600 mb-6">
                Start selling by listing your first item
              </p>
              <Button onClick={() => setShowAddProductDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                List Your First Item
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchases">
          {purchases.length > 0 ? (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={purchase.product.images[0]}
                      alt={purchase.product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-gray-900">
                            {purchase.product.title}
                          </h3>
                          <p className="text-gray-600">
                            ${purchase.product.price.toFixed(2)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            purchase.status === 'delivered'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {purchase.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600">
                        Purchased on{' '}
                        {purchase.purchaseDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No purchases yet</h3>
              <p className="text-gray-600 mb-6">
                Browse items and find something you love
              </p>
              <Button onClick={() => onNavigate('home')}>
                Start Shopping
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="messages">
          {conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex gap-4">
                    <img
                      src={conversation.otherUser.avatar}
                      alt={conversation.otherUser.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-gray-900">
                          {conversation.otherUser.name}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 truncate">
                        {conversation.lastMessage.content}
                      </p>
                      <p className="text-gray-400 mt-1">
                        Re: {conversation.product.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">
                Your conversations will appear here
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Product Dialog */}
      <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>List a New Item</DialogTitle>
            <DialogDescription>
              Fill in the details to list your item for sale
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Vintage Leather Jacket"
                value={newProduct.title}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your item..."
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Women">Women</SelectItem>
                    <SelectItem value="Men">Men</SelectItem>
                    <SelectItem value="Kids">Kids</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  placeholder="e.g., M, 9, L"
                  value={newProduct.size}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, size: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g., Nike, Zara"
                  value={newProduct.brand}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, brand: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={newProduct.condition}
                onValueChange={(value: any) =>
                  setNewProduct({ ...newProduct, condition: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-1">Upload photos</p>
              <p className="text-gray-400">
                (Photo upload simulated in this demo)
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddProductDialog(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSubmitProduct}>
                List Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
