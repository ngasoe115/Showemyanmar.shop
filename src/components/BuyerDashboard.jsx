import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, MapPin, Tag, Star, ShoppingCart, Filter, Eye, Package, Clock, Truck, CheckCircle, Store } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

export const BuyerDashboard = ({ onSelectProduct, onOpenCart, onViewOrderDetails }) => {
  const {
    products,
    selectedCity,
    setSelectedCity,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    showSoldOut,
    setShowSoldOut,
    availableCities,
    addToCart,
    currentUser,
    orders
  } = useStore();

  const [activeTab, setActiveTab] = useState('shop'); // 'shop' or 'my-orders'

  // Filter products based on search, category, city location, and sold-out filter
  const filteredProducts = products.filter((product) => {
    // Search query filter
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategory === 'All Categories' || product.category === selectedCategory;

    // City location filter (Matching seller's city)
    const matchesCity =
      selectedCity === 'All Cities' ||
      product.sellerCity.toLowerCase() === selectedCity.toLowerCase();

    // Availability filter
    const matchesSoldOut = showSoldOut ? true : !product.isSoldOut;

    return matchesSearch && matchesCategory && matchesCity && matchesSoldOut;
  });

  // Get orders placed by current buyer
  const buyerOrders = currentUser
    ? orders.filter((o) => o.buyerId === currentUser.id || o.buyerEmail === currentUser.email)
    : [];

  return (
    <div className="buyer-dashboard">
      {/* Sub-header Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('shop')}
          className={`btn ${activeTab === 'shop' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🛍️ Explore Marketplace ({filteredProducts.length})
        </button>

        {currentUser && (
          <button
            onClick={() => setActiveTab('my-orders')}
            className={`btn ${activeTab === 'my-orders' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📦 My Orders & Tracking ({buyerOrders.length})
          </button>
        )}
      </div>

      {activeTab === 'shop' ? (
        <>
          {/* Hero Banner */}
          <div className="hero-banner">
            <h1 className="hero-title">Discover Unique Items from Local Sellers</h1>
            <p className="hero-subtitle">
              Shop directly from verified sellers across cities. Filter products by location, category, and price.
            </p>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="filter-bar">
            {/* Search Input */}
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search products, keywords, or store names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* City Location Filter (Crucial User Requirement) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--primary)" />
              <select
                className="select-filter"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    📍 {city === 'All Cities' ? 'All Cities Location' : city}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <select
              className="select-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  🏷️ {cat}
                </option>
              ))}
            </select>

            {/* Sold Out Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <input
                type="checkbox"
                checked={showSoldOut}
                onChange={(e) => setShowSoldOut(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              Include Sold Out
            </label>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <Search size={40} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
              <h3 style={{ color: '#fff', marginBottom: '8px' }}>No products found</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Try adjusting your city filter (Current: {selectedCity}), category, or search keywords.
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  {/* Image Container & Badges */}
                  <div className="product-image-container" onClick={() => onSelectProduct(product)} style={{ cursor: 'pointer' }}>
                    <img src={product.image} alt={product.title} className="product-image" />
                    
                    {product.isSoldOut && (
                      <div className="sold-out-overlay">
                        <span className="sold-out-badge">SOLD OUT</span>
                      </div>
                    )}

                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span className="city-badge" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', color: '#fff' }}>
                        <MapPin size={11} color="var(--primary)" /> {product.sellerCity}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="product-body">
                    <div className="product-meta">
                      <span className="product-category">{product.category}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>
                        <Star size={13} fill="#f59e0b" /> {product.rating} ({product.reviewsCount})
                      </div>
                    </div>

                    <h3 className="product-title" onClick={() => onSelectProduct(product)} style={{ cursor: 'pointer' }}>
                      {product.title}
                    </h3>

                    {/* Seller Store Name */}
                    <div className="seller-info-row">
                      <Store size={14} color="var(--accent-seller)" />
                      <span>{product.sellerName}</span>
                    </div>

                    <div className="product-footer">
                      <div>
                        <span className="product-price">${product.price.toFixed(2)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => onSelectProduct(product)}
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Quick View Details"
                        >
                          <Eye size={15} />
                        </button>
                        
                        <button
                          onClick={() => addToCart(product, 1)}
                          disabled={product.isSoldOut || product.stock <= 0}
                          className={`btn btn-sm ${product.isSoldOut ? 'btn-secondary' : 'btn-primary'}`}
                        >
                          <ShoppingCart size={15} />
                          {product.isSoldOut ? 'Sold Out' : 'Buy'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* MY ORDERS TAB */
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '24px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
            📦 My Placed Orders
          </h2>

          {buyerOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              You haven't placed any orders yet. Browse the shop and add items to your cart!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {buyerOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem', marginRight: '12px' }}>
                        Order #{order.id}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>
                        Total: ${order.totalAmount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => onViewOrderDetails(order)}
                        className="btn btn-primary btn-sm"
                      >
                        <Package size={14} /> Track Delivery
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          background: 'var(--bg-elevated)',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{item.title}</div>
                            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                              Seller: <strong>{item.sellerName}</strong> (📍 {item.sellerCity}) • Qty: {item.quantity}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className={`role-badge ${item.status === 'Delivered' ? 'seller' : 'buyer'}`}>
                            {item.status}
                          </span>
                          {item.trackingNumber && (
                            <span className="city-badge" style={{ fontSize: '0.725rem' }}>
                              <Truck size={12} /> {item.trackingNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
