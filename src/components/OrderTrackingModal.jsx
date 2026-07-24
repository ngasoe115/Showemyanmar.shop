import React from 'react';
import { X, Package, Truck, CheckCircle2, Clock, MapPin, Store } from 'lucide-react';

export const OrderTrackingModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Track Order #{order.id}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Placed on {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Total & Shipping Info */}
        <div
          style={{
            padding: '14px 18px',
            background: 'var(--bg-dark)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Shipping Destination</div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
              📍 {order.buyerAddress || '123 Market St'}, {order.buyerCity || 'Austin'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>
              ${order.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Order Items & Per-Item Shipping Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {order.items.map((item) => {
            const isShipped = item.status === 'Shipped' || item.status === 'Delivered';
            const isDelivered = item.status === 'Delivered';

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px'
                }}
              >
                {/* Item Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Seller: <strong>{item.sellerName}</strong> (📍 {item.sellerCity}) • Qty: {item.quantity}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="tracking-timeline">
                  {/* Step 1: Order Placed */}
                  <div className="timeline-step completed">
                    <div className="timeline-dot"></div>
                    <div className="timeline-title">Order Placed & Payment Confirmed</div>
                    <div className="timeline-desc">Order sent to seller {item.sellerName} in {item.sellerCity}</div>
                  </div>

                  {/* Step 2: Shipped by Seller */}
                  <div className={`timeline-step ${isShipped ? (isDelivered ? 'completed' : 'active') : ''}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-title">
                      {isShipped ? 'Package Shipped by Seller' : 'Seller Preparing Package'}
                    </div>
                    <div className="timeline-desc">
                      {item.trackingNumber ? `Tracking Code: ${item.trackingNumber}` : 'Seller will assign tracking code upon dispatch'}
                    </div>
                  </div>

                  {/* Step 3: Out for Delivery / Delivered */}
                  <div className={`timeline-step ${isDelivered ? 'completed' : ''}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-title">
                      {isDelivered ? 'Package Delivered' : 'Estimated Delivery'}
                    </div>
                    <div className="timeline-desc">
                      {isDelivered ? 'Delivered to your address' : 'Pending courier arrival'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
