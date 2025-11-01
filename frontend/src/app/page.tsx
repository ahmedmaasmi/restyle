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
import { AuthDebug } from './components/AuthDebug';
import { AdminDashboard } from './components/AdminDashboard';
import { VerificationPage } from './components/VerificationPage';
import { CartModal } from './components/CartModal';
import { LogoutConfirmationModal } from './components/LogoutConfirmationModal';
import { CartProvider } from '../lib/CartContext';
import { useRouter } from 'next/navigation';
import { Product, User, Message } from '../../types';
import { mockProducts, currentUser as initialUser, mockPurchases, mockConversations, mockMessages } from '../lib/mock-data';
import { toast, Toaster } from 'sonner';
import { authAPI, productsAPI, ProductResponse, categoriesAPI } from '../lib/api';

type Page = 'home' | 'product' | 'dashboard' | 'profile' | 'browse' | 'favorites' | 'login' | 'admin' | 'verification';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Check localStorage for user on mount
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [showChatModal, setShowChatModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const [chatProduct, setChatProduct] = useState<Product | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  // Check for verification email in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const email = params.get('verification');
      if (email) {
        setVerificationEmail(email);
        setCurrentPage('verification');
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const items = await productsAPI.getProducts();
        // Fetch images for each item
        const productsWithImages: Product[] = await Promise.all(
          items.map(async (item: ProductResponse) => {
            // Fetch images for this item
            try {
              const imagesResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/images?item_id=${item.id}`
              );
              const images = imagesResponse.ok ? await imagesResponse.json() : [];
              
              // Fetch category
              const categoryResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/categories/${item.category_id}`
              );
              let categoryName = 'Uncategorized';
              if (categoryResponse.ok) {
                const category = await categoryResponse.json();
                categoryName = category.name || categoryName;
              }

              // Fetch seller/user info
              const userResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/users/${item.user_id}`
              );
              let seller: User = {
                id: String(item.user_id),
                name: 'Unknown',
                email: '',
                avatar: `https://api.dicebear.com/6.x/identicon/svg?seed=${item.user_id}`,
                rating: 5.0,
                totalSales: 0,
              };
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                seller = {
                  id: String(userData.id),
                  name: userData.full_name || userData.username || 'Unknown',
                  email: userData.email || '',
                  avatar: userData.avatar_url || `https://api.dicebear.com/6.x/identicon/svg?seed=${userData.email}`,
                  rating: userData.rating || 5.0,
                  totalSales: 0,
                };
              }

              return {
                id: String(item.id),
                title: item.title,
                description: item.description || '',
                price: item.price,
                images: images.length > 0 ? images.map((img: any) => img.image_url) : ['https://images.unsplash.com/photo-1634133118645-74a2adf44170?w=400'],
                category: categoryName,
                size: item.size,
                brand: item.brand,
                condition: item.condition || 'Good',
                sellerId: String(item.user_id),
                seller,
                favoriteCount: 0,
                isFavorited: false,
              };
            } catch (error) {
              console.error(`Error fetching details for item ${item.id}:`, error);
              return {
                id: String(item.id),
                title: item.title,
                description: item.description || '',
                price: item.price,
                images: ['https://images.unsplash.com/photo-1634133118645-74a2adf44170?w=400'],
                category: 'Uncategorized',
                size: item.size,
                brand: item.brand,
                condition: item.condition || 'Good',
                sellerId: String(item.user_id),
                seller: {
                  id: String(item.user_id),
                  name: 'Unknown',
                  email: '',
                  avatar: `https://api.dicebear.com/6.x/identicon/svg?seed=${item.user_id}`,
                  rating: 5.0,
                  totalSales: 0,
                },
                favoriteCount: 0,
                isFavorited: false,
              };
            }
          })
        );
        setProducts(productsWithImages);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to mock products on error
        setProducts(mockProducts);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Check authentication status on mount and listen for login events
  useEffect(() => {
    const checkAuth = async () => {
      const user = await authAPI.getCurrentUser();
      if (user) {
        // Explicitly check admin status from the API response
        const isAdmin = user.isAdmin === true;
        console.log('User auth check:', { 
          email: user.email, 
          isAdmin: isAdmin, 
          adminRole: user.adminRole 
        });
        
        setCurrentUser({
          id: user.id,
          name: user.full_name || user.email || '',
          email: user.email,
          avatar: user.avatar_url || `https://api.dicebear.com/6.x/identicon/svg?seed=${user.email}`,
          rating: user.rating || 5.0,
          totalSales: 0,
          isAdmin: isAdmin, // Explicitly set admin status
          adminRole: user.adminRole || null,
        });
      } else {
        setCurrentUser(null);
      }
    };

    checkAuth();

    // Listen for login events
    const handleLogin = async () => {
      await checkAuth();
    };
    window.addEventListener('userLogin', handleLogin);

    // Listen for admin status changes (e.g., after promoting/demoting)
    const handleAdminStatusChange = async () => {
      await checkAuth();
    };
    window.addEventListener('adminStatusChange', handleAdminStatusChange);

    return () => {
      window.removeEventListener('userLogin', handleLogin);
      window.removeEventListener('adminStatusChange', handleAdminStatusChange);
    };
  }, []);

  const handleNavigate = (page: string, productId?: string) => {
    if (page === 'login') {
      router.push('/login');
      return;
    }

    if ((page === 'dashboard' || page === 'profile' || page === 'favorites' || page === 'admin') && !currentUser) {
      router.push('/login');
      toast.error('Please sign in to continue');
      return;
    }

    if (page === 'admin' && currentUser && !currentUser.isAdmin) {
      toast.error('Access denied. Admin privileges required.');
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
    if (category === 'all') {
      setSelectedCategory(undefined);
    } else {
      setSelectedCategory(category);
    }
    setCurrentPage('browse');
    window.scrollTo(0, 0);
  };


  const handleLogout = async () => {
    await authAPI.logout();
    setCurrentUser(null);
    setCurrentPage('home');
    toast.success('Logged out successfully');
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
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

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    // Category filter
    if (selectedCategory && p.category !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const favoriteProducts = products.filter((p) => p.isFavorited);
  const userProducts = products.filter((p) => p.sellerId === currentUser?.id);

  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : null;

  return (
    <CartProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onLogout={handleLogoutClick}
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

        {currentPage === 'admin' && currentUser && (
          <AdminDashboard
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'verification' && verificationEmail && (
          <VerificationPage
            email={verificationEmail}
            onVerified={() => {
              setVerificationEmail(null);
              handleNavigate('home');
              // Check auth again to update user state
              window.dispatchEvent(new Event('userLogin'));
            }}
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

        <AuthDebug />

        <CartModal />

        <LogoutConfirmationModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />

        <Toaster position="top-center" richColors />
      </div>
    </CartProvider>
  );
}
