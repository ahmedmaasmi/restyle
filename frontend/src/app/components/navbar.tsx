'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, ShoppingCart, User, Menu, X, ChevronDown, Gift, Tv 
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './/ui/input';

interface NavbarProps {
  currentUser?: {
    name: string;
    avatar: string;
  } | null;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onCategoryClick?: (category: string) => void;
}

export default function Navbar({
  currentUser = null,
  onNavigate = () => {},
  onLogout = () => {},
  searchQuery = '',
  onSearchChange = () => {},
  onCategoryClick = () => {},
}: NavbarProps) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);



    useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
              <span className="text-2xl font-bold text-gray-800">ReStyle</span>
            </div>

            {/* Search (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-4 pr-10 w-full rounded-full border-gray-300"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-6">

              {/* Cart */}
              <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-1 relative">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                <span className="text-sm">Cart</span>
              </button>

              {/* User */}
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
                <Link href="/login" className="flex items-center gap-1 text-sm hover:text-blue-600">
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Button */}
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
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-sm hover:text-blue-600">
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.name)}
                className="text-sm text-gray-700 hover:text-blue-600 whitespace-nowrap"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>      

    </nav>
  );
}


