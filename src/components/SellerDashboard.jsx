import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Store, Plus, Edit2, Trash2, MapPin, DollarSign, Package, AlertTriangle, CheckCircle, Truck, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

export const SellerDashboard = () => {
  const { currentUser, products, addProduct, updateProduct, deleteProduct, toggleSoldOut, orders, updateItemStatus } = useStore();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'create', 'orders'
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New product state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('10');
  const [newImage, setNewImage] = useState('');

  // Seller's own listings
  const sellerProducts = products.filter((p) => p.sellerId === currentUser?.id);

  // Seller's incoming order items
  const sellerOrders = orders.flatMap((ord) => {
    const itemsForSeller = ord.items.filter((item) => item.sellerId === currentUser?.id);
    if (itemsForSeller.length === 0) return [];
    return itemsForSeller.map((item) => ({
      orderId: ord.id,
      buyerName: ord.buyerName,
      buyerEmail: ord.buyerEmail,
      buyerAddress: ord.buyerAddress,
      orderDate: ord.createdAt,
      ...item
    }));
  });

  // Calculate seller revenue
  const totalSellerSales = sellerOrders.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newCategory) return;

    addProduct({
      title: newTitle,
      description: newDesc || 'High quality item listed directly by store.',
      category: newCategory,
      price: newPrice,
      stock: newStock,
      image: newImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
    });

    // Reset form
    setNewTitle('');
    setNewDesc('');
    setNewPrice('');
    setNewStock('10');
    setNewImage('');
    setShowCreateModal(false);
  };

  const handleUpdateStatus = (orderId, itemId, currentStatus) => {
    let nextStatus = 'Shipped';
    let trackingCode = `TRK-${currentUser?.city?.slice(0, 2).toUpperCase() || 'US'}-${Math.floor(10000 + Math.random() * 90000)}`;

    if (currentStatus === 'Shipped') {
      nextStatus = 'Delivered';
    }

    updateItemStatus(orderId, itemId, nextStatus, trackingCode);
  };

  if (!currentUser || currentUser.role !== 'seller') {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Please sign in with a Seller account to access the Seller Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      {/* Seller Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, var(--bg-card) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 30px',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--accent-seller)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800 }}>
                {currentUser.storeName || currentUser.name}
              </h1>
              <span className="role-badge seller">Active Seller</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span className="city-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                <MapPin size={13} /> City: {currentUser.city}
              </span>
              <span>Owner: {currentUser.name}</span>
              <span>Member since: {currentUser.joinedDate || '2024'}</span>
            </div>
          </div>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <Plus size={18} /> Create New Listing
        </button>
      </div>

      {/* Seller Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-val">${totalSellerSales.toFixed(2)}</div>
            <div className="stat-lbl">Total Store Revenue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Package size={24} />
          </div>
          <div>
            <div className="stat-val">{sellerProducts.length}</div>
            <div className="stat-lbl">Active Item Listings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Truck size={24} />
          </div>
          <div>
            <div className="stat-val">{sellerOrders.length}</div>
            <div className="stat-lbl">Orders Received</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('listings')}
          className={`btn ${activeTab === 'listings' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📦 My Product Listings ({sellerProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🛒 Customer Orders ({sellerOrders.length})
        </button>
      </div>

      {activeTab === 'listings' ? (
        /* MY LISTINGS TABLE / CARDS */
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>City Location</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Availability</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellerProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No listings posted yet. Click <strong>"Create New Listing"</strong> to post your first item!
                  </td>
                </tr>
              ) : (
                sellerProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={product.image}
                          alt={product.title}
                          style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{product.title}</div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="product-category">{product.category}</span></td>
                    <td>
                      <span className="city-badge">
                        <MapPin size={11} /> {product.sellerCity}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#fff' }}>${product.price.toFixed(2)}</div>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={product.stock}
                        onChange={(e) => updateProduct(product.id, { stock: parseInt(e.target.value, 10) || 0 })}
                        style={{
                          width: '70px',
                          padding: '6px 8px',
                          background: 'var(--bg-dark)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#fff',
                          fontWeight: 700
                        }}
                      />
                    </td>
                    <td>
                      {product.isSoldOut ? (
                        <span className="role-badge" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                          Sold Out
                        </span>
                      ) : (
                        <span className="role-badge seller">
                          In Stock ({product.stock})
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* MARK AS SOLD OUT TOGGLE */}
                        <button
                          onClick={() => toggleSoldOut(product.id)}
                          className={`btn btn-sm ${product.isSoldOut ? 'btn-primary' : 'btn-secondary'}`}
                          title="Toggle Sold Out Status"
                        >
                          {product.isSoldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete listing "${product.title}"?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="btn btn-danger btn-sm btn-icon"
                          title="Delete Listing"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* CUSTOMER ORDERS RECEIVED BY SELLER */
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item Purchased</th>
                <th>Buyer</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Shipping Status</th>
                <th style={{ textAlign: 'right' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {sellerOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No customer orders received yet.
                  </td>
                </tr>
              ) : (
                sellerOrders.map((item) => (
                  <tr key={`${item.orderId}-${item.id}`}>
                    <td style={{ fontWeight: 700, color: '#fff' }}>#{item.orderId}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600, color: '#fff' }}>{item.title}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{item.buyerName}</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{item.buyerEmail}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{item.quantity}</td>
                    <td style={{ fontWeight: 800, color: '#fff' }}>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <span className={`role-badge ${item.status === 'Delivered' ? 'seller' : 'buyer'}`}>
                        {item.status}
                      </span>
                      {item.trackingNumber && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Ref: {item.trackingNumber}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {item.status !== 'Delivered' ? (
                        <button
                          onClick={() => handleUpdateStatus(item.orderId, item.id, item.status)}
                          className="btn btn-sm btn-primary"
                          style={{ background: item.status === 'Processing' ? '#3b82f6' : '#10b981' }}
                        >
                          <Truck size={14} />
                          {item.status === 'Processing' ? 'Mark Shipped' : 'Mark Delivered'}
                        </button>
                      ) : (
                        <span style={{ color: 'var(--accent-seller)', fontSize: '0.85rem', fontWeight: 700 }}>
                          ✓ Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE NEW LISTING MODAL */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="var(--accent-seller)" />
                <h3 className="modal-title">Create New Listing Post</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label className="form-label">Item Title</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Wireless Ergonomic Mouse"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">City Location</label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={`📍 ${currentUser.city} (From Profile)`}
                    style={{ opacity: 0.8 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-control"
                    placeholder="99.99"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="form-control"
                    placeholder="10"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Describe your item specs, condition, or features..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                Post Listing to Marketplace
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
