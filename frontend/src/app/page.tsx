"use client";
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ProductDetail } from './components/ProductDetail';
import { Dashboard } from './components/Dashboard';
import { UserProfile } from './components/UserProfile';
import { BrowsePage } from './components/BrowsePage';
import { FavoritesPage } from './components/FavoritesPage';
import { ChatModal } from './components/ChatModal';
import { useRouter } from 'next/navigation';
import { Product, User, Message } from '../../types';
import { mockProducts, currentUser as initialUser, mockPurchases, mockConversations, mockMessages } from '../lib/mock-data';
import { toast, Toaster } from 'sonner';

type Page = 'home' | 'product' | 'dashboard' | 'profile' | 'browse' | 'favorites' | 'login';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Check localStorage for user on mount
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch {
          return initialUser;
        }
      }
    }
    return initialUser;
  });
  
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [showChatModal, setShowChatModal] = useState(false);
  const router = useRouter();
  const [chatProduct, setChatProduct] = useState<Product | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Listen for login events from localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    };

    // Check on mount and listen for storage changes
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event (for same-tab updates)
    window.addEventListener('userLogin', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleStorageChange);
    };
  }, []);

  const handleNavigate = (page: string, productId?: string) => {
    if (page === 'login') {
      router.push('/login');
      return;
    }

    if ((page === 'dashboard' || page === 'profile' || page === 'favorites') && !currentUser) {
      router.push('/login');
      toast.error('Please sign in to continue');
      return;
    }

    setCurrentPage(page as Page);
    if (productId) {
      setSelectedProductId(productId);
    }
    setSelectedCategory(undefined);
    window.scrollTo(0, 0);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage('browse');
    window.scrollTo(0, 0);
  };


  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    toast.success('Logged out successfully');
  };

  const handleToggleFavorite = (productId: string) => {
    if (!currentUser) {
      router.push('/login');
      toast.error('Please sign in to add favorites');
      return;
    }

    setProducts(
      products.map((p) =>
        p.id === productId
          ? {
              ...p,
              isFavorited: !p.isFavorited,
              favoriteCount: p.isFavorited
                ? p.favoriteCount - 1
                : p.favoriteCount + 1,
            }
          : p
      )
    );

    const product = products.find((p) => p.id === productId);
    if (product) {
      toast.success(
        product.isFavorited ? 'Removed from favorites' : 'Added to favorites'
      );
    }
  };

  const handleAddProduct = (newProduct: Partial<Product>) => {
    if (!currentUser) return;

    const product: Product = {
      id: `new-${Date.now()}`,
      title: newProduct.title!,
      description: newProduct.description!,
      price: newProduct.price!,
      images: ['https://images.unsplash.com/photo-1634133118645-74a2adf44170?w=400'],
      category: newProduct.category || 'Women',
      size: newProduct.size,
      brand: newProduct.brand,
      condition: newProduct.condition || 'Good',
      sellerId: currentUser.id,
      seller: currentUser,
      favoriteCount: 0,
      isFavorited: false,
    };

    setProducts([product, ...products]);
    toast.success('Item listed successfully!');
  };

  const handleBuyNow = (_productId: string) => {
    if (!currentUser) {
      router.push('/login');
      toast.error('Please sign in to make a purchase');
      return;
    }

    toast.success('Purchase initiated! (Simulated)');
  };

  const handleMessageSeller = (productId: string, _sellerId: string) => {
    if (!currentUser) {
      router.push('/login');
      toast.error('Please sign in to message sellers');
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (product) {
      setChatProduct(product);
      setChatMessages(mockMessages.filter((m) => m.productId === productId));
      setShowChatModal(true);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!currentUser || !chatProduct) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: chatProduct.sellerId,
      productId: chatProduct.id,
      content,
      timestamp: new Date(),
      read: false,
    };

    setChatMessages([...chatMessages, newMessage]);
    toast.success('Message sent!');
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;

    setCurrentUser({
      ...currentUser,
      ...updates,
    });
    toast.success('Profile updated!');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentPage('browse');
    }
  };

  // Filter products based on search
  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const favoriteProducts = products.filter((p) => p.isFavorited);
  const userProducts = products.filter((p) => p.sellerId === currentUser?.id);

  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCategoryClick={handleCategoryClick}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            products={filteredProducts}
            onNavigate={handleNavigate}
            onCategoryClick={handleCategoryClick}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === 'browse' && (
          <BrowsePage
            products={filteredProducts}
            onNavigate={handleNavigate}
            onToggleFavorite={handleToggleFavorite}
            selectedCategory={selectedCategory}
          />
        )}

        {currentPage === 'product' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onNavigate={handleNavigate}
            onToggleFavorite={handleToggleFavorite}
            onBuyNow={handleBuyNow}
            onMessageSeller={handleMessageSeller}
          />
        )}

        {currentPage === 'dashboard' && currentUser && (
          <Dashboard
            userProducts={userProducts}
            purchases={mockPurchases}
            conversations={mockConversations}
            onNavigate={handleNavigate}
            onAddProduct={handleAddProduct}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === 'profile' && currentUser && (
          <UserProfile
            user={currentUser}
            userProducts={userProducts}
            isOwnProfile={true}
            onNavigate={handleNavigate}
            onUpdateProfile={handleUpdateProfile}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === 'favorites' && currentUser && (
          <FavoritesPage
            favoriteProducts={favoriteProducts}
            onNavigate={handleNavigate}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      <Footer />

      {chatProduct && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          product={chatProduct}
          otherUser={chatProduct.seller}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
        />
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
}
