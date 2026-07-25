import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, ShoppingCart, User, Shield, Store, MapPin, LogOut, RotateCcw, Plus } from 'lucide-react';

export const Navbar = ({ onOpenAuth, onOpenCart, onOpenInbox, activeTab, setActiveTab }) => {
  const { currentUser, logout, cart, resetDemoData } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#" onClick={() => setActiveTab('marketplace')} className="brand-logo">
            <ShoppingBag size={28} />
            <span>Showemyanmar.shop</span>
          </a>

          {/* Navigation Links based on role */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`btn btn-sm ${activeTab === 'marketplace' ? 'btn-primary' : 'btn-secondary'}`}
            >
              🛍️ Browse Shop
            </button>

            {currentUser && currentUser.role === 'seller' && (
              <button
                onClick={() => setActiveTab('seller-dashboard')}
                className={`btn btn-sm ${activeTab === 'seller-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}
              >
                <Store size={15} /> My Seller Dashboard
              </button>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`btn btn-sm ${activeTab === 'admin-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderColor: 'rgba(236, 72, 153, 0.4)' }}
              >
                <Shield size={15} /> Admin Control Center
              </button>
            )}
          </nav>
        </div>

        {/* Right Section: Cart, User Profile / Login */}
        <div className="nav-actions">
          {/* Local Inbox Button */}
          {onOpenInbox && (
            <button
              onClick={onOpenInbox}
              className="btn btn-sm btn-secondary"
              title="View sent emails from noreply@showemyanmar.shop"
              style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
            >
              📫 Site Inbox
            </button>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all shop listings, orders, and demo accounts to default state?')) {
                resetDemoData();
              }
            }}
            className="btn btn-sm btn-secondary"
            title="Reset to original seed data"
          >
            <RotateCcw size={14} /> Demo Reset
          </button>

          {/* Cart Icon Button (Available to everyone) */}
          <button onClick={onOpenCart} className="btn btn-secondary" style={{ position: 'relative' }}>
            <ShoppingCart size={18} />
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
                }}
              >
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Account / Auth Section */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn btn-secondary"
                style={{ gap: '10px' }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontWeight: 600 }}>{currentUser.storeName || currentUser.name}</span>
                <span className={`role-badge ${currentUser.role}`}>{currentUser.role}</span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '240px',
                    background: 'var(--bg-white)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 60
                  }}
                >
                  <div style={{ paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                    {currentUser.role === 'seller' && (
                      <div className="city-badge" style={{ marginTop: '6px' }}>
                        <MapPin size={12} /> City: {currentUser.city}
                      </div>
                    )}
                  </div>

                  {currentUser.role === 'seller' && (
                    <button
                      onClick={() => {
                        setActiveTab('seller-dashboard');
                        setShowUserMenu(false);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '6px' }}
                    >
                      <Store size={14} /> Seller Dashboard
                    </button>
                  )}

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveTab('admin-dashboard');
                        setShowUserMenu(false);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '6px' }}
                    >
                      <Shield size={14} /> Admin Control
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="btn btn-danger btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-primary">
              <User size={16} /> Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
