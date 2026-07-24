import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { BuyerDashboard } from './components/BuyerDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { Shield, Store, UserCheck, Info } from 'lucide-react';

function MainApp() {
  const { currentUser } = useStore();
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace', 'seller-dashboard', 'admin-dashboard'
  
  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);

  return (
    <div className="app-container">
      {/* Top Demo Helper Bar */}
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
            <strong>Showemyanmar.shop Demo:</strong> Sign in with test accounts or switch views to explore.
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
            Switch Account
          </button>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
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
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

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
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
