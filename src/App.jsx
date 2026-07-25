import React, { useState, Component, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { BuyerDashboard } from './components/BuyerDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { LocalMailInboxModal } from './components/LocalMailInboxModal';
import { Shield, Store, UserCheck, Info } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Showemyanmar ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: '#ffffff', minHeight: '100vh', color: '#0f172a', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#10b981', marginBottom: '12px' }}>Showemyanmar.shop</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>An error occurred while rendering the page. Click below to refresh.</p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Reset App State & Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const { currentUser, isSupabaseConfigured } = useStore();
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace', 'seller-dashboard', 'admin-dashboard'
  
  // Default isAuthOpen to true if user is not signed in
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);

  // Pop open Sign-In modal by default on first visit if not logged in
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('showe_has_visited');
    if (!currentUser && !hasVisited) {
      setIsAuthOpen(true);
      sessionStorage.setItem('showe_has_visited', 'true');
    }
  }, [currentUser]);

  return (
    <div className="app-container">
      {/* Top Helper Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #064e3b 0%, #047857 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '8px 24px',
          fontSize: '0.8rem',
          color: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={14} color="#6ee7b7" />
          <span>
            <strong>Showemyanmar.shop Demo:</strong> {isSupabaseConfigured ? '🟢 Live Supabase Database Connected' : '⚡ Local Self-Hosted Backend Active'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ opacity: 0.8 }}>Active User:</span>
          {currentUser ? (
            <span style={{ color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {currentUser.role === 'admin' && <Shield size={13} color="#f472b6" />}
              {currentUser.role === 'seller' && <Store size={13} color="#34d399" />}
              {currentUser.role === 'buyer' && <UserCheck size={13} color="#60a5fa" />}
              {currentUser.name} ({currentUser.role.toUpperCase()})
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Not Signed In</span>
          )}

          <button
            onClick={() => setIsAuthOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Sign In / Switch Account
          </button>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenInbox={() => setIsInboxOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Area */}
      <main className="main-content">
        {activeTab === 'marketplace' && (
          <BuyerDashboard
            onSelectProduct={(product) => setSelectedProduct(product)}
            onOpenCart={() => setIsCartOpen(true)}
            onViewOrderDetails={(order) => setSelectedOrderForTracking(order)}
          />
        )}

        {activeTab === 'seller-dashboard' && <SellerDashboard />}

        {activeTab === 'admin-dashboard' && <AdminDashboard />}
      </main>

      {/* Overlays & Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onOpenInbox={() => setIsInboxOpen(true)}
      />

      <LocalMailInboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={(order) => setSelectedOrderForTracking(order)}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <OrderTrackingModal
        order={selectedOrderForTracking}
        onClose={() => setSelectedOrderForTracking(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <MainApp />
      </StoreProvider>
    </ErrorBoundary>
  );
}
