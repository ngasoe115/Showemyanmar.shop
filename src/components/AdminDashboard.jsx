import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, DollarSign, Store, Package, Users, Trash2, MapPin, Search, Filter, AlertOctagon, CheckCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const { currentUser, users, products, orders, deleteProduct } = useStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'listings', 'sellers', 'orders'
  const [cityFilter, setCityFilter] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
        <h2>Admin Access Required</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Please sign in with the Admin account (`admin@marketplace.com`) to access the Admin Control Center.
        </p>
      </div>
    );
  }

  // Calculate platform financial analytics
  const totalGMV = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const platformCommission = totalGMV * 0.10; // 10% platform fee
  const activeSellers = users.filter((u) => u.role === 'seller');
  const activeBuyers = users.filter((u) => u.role === 'buyer');

  // Filter listings for moderation
  const filteredProducts = products.filter((p) => {
    const matchesCity = cityFilter === 'All' || p.sellerCity.toLowerCase() === cityFilter.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchFilter.toLowerCase()) || p.sellerName.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="admin-dashboard">
      {/* Admin Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, var(--bg-card) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 30px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-admin-bg)',
              color: 'var(--accent-admin)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(236, 72, 153, 0.3)'
            }}
          >
            <Shield size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800 }}>Master Admin Control Center</h1>
              <span className="role-badge admin">Super Admin</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Full system access across all sellers, buyer orders, item posts, and marketplace financial ledgers.
            </p>
          </div>
        </div>
      </div>

      {/* Financial & Platform Overview Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-val">${totalGMV.toFixed(2)}</div>
            <div className="stat-lbl">Gross Marketplace Volume</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-val">${platformCommission.toFixed(2)}</div>
            <div className="stat-lbl">Platform Revenue (10% Fee)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Store size={24} />
          </div>
          <div>
            <div className="stat-val">{activeSellers.length}</div>
            <div className="stat-lbl">Registered Sellers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Package size={24} />
          </div>
          <div>
            <div className="stat-val">{products.length}</div>
            <div className="stat-lbl">Total Live Products</div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📊 Master Listings Moderation ({filteredProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('sellers')}
          className={`btn ${activeTab === 'sellers' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🏪 Seller Accounts ({activeSellers.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📦 All Platform Orders ({orders.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        /* GLOBAL LISTINGS MODERATION TABLE */
        <div>
          {/* Admin Filter Bar */}
          <div className="filter-bar" style={{ marginBottom: '20px' }}>
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search products or store names across platform..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--primary)" />
              <select className="select-filter" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                <option value="All">All Seller Cities</option>
                <option value="New York">New York</option>
                <option value="Chicago">Chicago</option>
                <option value="Austin">Austin</option>
                <option value="San Francisco">San Francisco</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Seller Store</th>
                  <th>City</th>
                  <th>Price</th>
                  <th>Stock / Status</th>
                  <th style={{ textAlign: 'right' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={product.image}
                          alt={product.title}
                          style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{product.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="product-category">{product.category}</span></td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{product.sellerName}</td>
                    <td>
                      <span className="city-badge">
                        <MapPin size={11} /> {product.sellerCity}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#fff' }}>${product.price.toFixed(2)}</td>
                    <td>
                      {product.isSoldOut ? (
                        <span className="role-badge" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                          Sold Out
                        </span>
                      ) : (
                        <span className="role-badge seller">In Stock ({product.stock})</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          if (window.confirm(`Admin Force Remove: Delete listing "${product.title}"?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={14} /> Remove Listing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sellers' && (
        /* SELLER ACCOUNTS DIRECTORY */
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Seller Store</th>
                <th>Owner Name</th>
                <th>Email</th>
                <th>City Location</th>
                <th>Store Rating</th>
                <th>Total Listings</th>
              </tr>
            </thead>
            <tbody>
              {activeSellers.map((seller) => {
                const listingsCount = products.filter((p) => p.sellerId === seller.id).length;
                return (
                  <tr key={seller.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={seller.avatar}
                          alt={seller.name}
                          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        />
                        <span style={{ fontWeight: 700, color: '#fff' }}>{seller.storeName || seller.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{seller.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{seller.email}</td>
                    <td>
                      <span className="city-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                        <MapPin size={11} /> {seller.city}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#f59e0b' }}>★ {seller.rating || 5.0}</td>
                    <td style={{ fontWeight: 800, color: '#fff' }}>{listingsCount} products</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        /* ALL PLATFORM ORDERS */
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer</th>
                <th>Total GMV</th>
                <th>Items & Sellers</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: 800, color: '#fff' }}>#{ord.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{ord.buyerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.buyerEmail}</div>
                  </td>
                  <td style={{ fontWeight: 800, color: '#fff' }}>${ord.totalAmount.toFixed(2)}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {ord.items.map((item) => (
                        <div key={item.id} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          • {item.title} (Seller: {item.sellerName} - 📍 {item.sellerCity}) →{' '}
                          <span style={{ color: '#fff', fontWeight: 600 }}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="role-badge seller">Paid ✓</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
