"use client";
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../lib/CartContext';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

export function CartModal() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  return (
    <Dialog open={isCartOpen} onOpenChange={closeCart}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart ({getTotalItems()})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-gray-900 font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-600 text-sm mb-6">Add some items to get started!</p>
              <Button onClick={closeCart} variant="outline">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {item.product.title}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-2">
                      ${item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border border-gray-300 rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      {/* Subtotal */}
                      <div className="ml-auto text-right">
                        <p className="text-gray-600 text-sm">Subtotal</p>
                        <p className="font-semibold text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={closeCart}>
                Continue Shopping
              </Button>
              <Button className="flex-1">
                Checkout
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
