import { Search, MapPin, ShoppingCart, User, Menu, X, ChevronDown, Gift, Tv } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Link from "next/link"

interface NavbarProps {
  currentUser: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCategoryClick: (category: string) => void;
}

export function Navbar({ currentUser, onNavigate, onLogout, searchQuery, onSearchChange, onCategoryClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    'Women',
    'Men',
    'Kids',
    'Accessories',
    'footwear',
    ,
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
              <span className="text-2xl text-gray-800">ReStyle</span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-4 pr-10 w-full rounded-full border-gray-300"
                />
                <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-6">
        

              {/* Cart */}
              <button 
                className="flex items-center gap-1 relative"
                onClick={() => onNavigate('dashboard')}
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
                <span className="text-sm">Cart</span>
              </button>

              {/* Sign In */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    onClick={() => onNavigate('profile')}
                  />
                  <Button variant="ghost" onClick={onLogout} className="text-sm">
                    Logout
                  </Button>
                </div>
              ) : (
               <Link href="/login" className="flex items-center gap-1 text-sm">
          <User className="w-5 h-5" />
          <span>Sign In</span>
               </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Bar */}
      <div className="bg-gray-50 border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-sm hover:text-blue-600">
                <Menu className="w-4 h-4" />
                <span>All Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryClick(category)}
                  className="text-sm text-gray-700 hover:text-blue-600 whitespace-nowrap"
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                <Gift className="w-4 h-4" />
                <span>Best Deals</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                <Tv className="w-4 h-4" />
                <span>ReStyle Live</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {!mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-4 pr-10 w-full rounded-full"
            />
            <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <div className="space-y-2 pb-4 border-b border-gray-200">
              <p className="text-xs text-gray-500">Categories</p>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryClick(category);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm py-2 hover:text-blue-600"
                >
                  {category}
                </button>
              ))}
            </div>
            {currentUser ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onNavigate('profile');
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (

            <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
      <Button className="w-full">
        Sign In
      </Button>
    </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
