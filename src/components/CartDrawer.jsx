import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, MapPin, Store, CreditCard, CheckCircle } from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cart, updateCartQuantity, removeFromCart, placeOrder, currentUser } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('123 Market Street');
  const [shippingCity, setShippingCity] = useState(currentUser?.city || 'Austin');

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    const newOrder = placeOrder({ address: shippingAddress, city: shippingCity });
    setIsCheckingOut(false);
    onClose();
    if (newOrder && onOrderPlaced) {
      onOrderPlaced(newOrder);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          height: '100vh',
          maxHeight: '100vh',
          borderRadius: 0,
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Drawer Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="var(--primary)" />
            <h3 className="modal-title">Shopping Cart ({cart.length})</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon">
            <X size={18} />
          </button>
        </div>

        {!isCheckingOut ? (
          /* CART ITEMS LIST */
          <>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} color="var(--text-dim)" style={{ marginBottom: '14px' }} />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        background: 'var(--bg-dark)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />

                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '4px' }}>
                          {product.title}
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Store size={12} /> {product.sellerName} (📍 {product.sellerCity})
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                          <div style={{ fontWeight: 800, color: '#fff' }}>${(product.price * quantity).toFixed(2)}</div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity - 1)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '2px 8px' }}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity + 1)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '2px 8px' }}
                            >
                              +
                            </button>

                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="btn btn-danger btn-sm btn-icon"
                              style={{ marginLeft: '4px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  <span>Total Amount:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <CreditCard size={18} /> Proceed to Checkout
                </button>
              </div>
            )}
          </>
        ) : (
          /* CHECKOUT FORM */
          <form onSubmit={handleCheckout} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '16px' }}>Shipping Details</h4>

              <div className="form-group">
                <label className="form-label">Recipient Name</label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={currentUser?.name || 'Guest Buyer'}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Street Address</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                />
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Order Summary ({cart.length} items)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#fff' }}>
                  <span>Total to Pay:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                Confirm Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
