import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, MapPin, Store, Star, ShoppingCart, ShieldCheck, Truck, Check } from 'lucide-react';

export const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart, onOpenCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', padding: '0', overflow: 'hidden' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Product Image */}
          <div style={{ position: 'relative', height: '100%', minHeight: '340px', background: '#1e293b' }}>
            <img
              src={product.image}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {product.isSoldOut && (
              <div className="sold-out-overlay">
                <span className="sold-out-badge">SOLD OUT</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="btn btn-secondary btn-icon"
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Product Details Content */}
          <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="product-category">{product.category}</span>
              <span className="city-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                <MapPin size={12} /> Seller City: {product.sellerCity}
              </span>
            </div>

            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.3 }}>
              {product.title}
            </h2>

            {/* Seller Info Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                background: 'var(--bg-dark)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <Store size={20} color="var(--accent-seller)" />
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>
                  {product.sellerName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  📍 Verified Seller in {product.sellerCity}
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {product.description}
            </p>

            {/* Pricing Section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: 'auto' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price" style={{ fontSize: '1.05rem' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Level Badge */}
            <div style={{ fontSize: '0.85rem' }}>
              {product.isSoldOut ? (
                <span style={{ color: 'var(--danger)', fontWeight: 700 }}>❌ Currently Sold Out</span>
              ) : (
                <span style={{ color: 'var(--accent-seller)', fontWeight: 700 }}>
                  ✓ In Stock ({product.stock} units available)
                </span>
              )}
            </div>

            {/* Quantity Selector & Action Button */}
            {!product.isSoldOut && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  className="select-filter"
                  style={{ width: '80px', textAlign: 'center' }}
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {addedNotice ? (
                    <>
                      <Check size={16} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} /> Add to Cart (${(product.price * quantity).toFixed(2)})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
