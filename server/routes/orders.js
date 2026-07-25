import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/v1/orders
router.get('/', requireAuth, (req, res) => {
  const orders = db.getOrders();
  const user = req.user;

  if (user.role === 'admin') {
    return res.json({ success: true, orders });
  }

  if (user.role === 'seller') {
    // Return orders containing items sold by this seller
    const sellerOrders = orders
      .map((ord) => {
        const sellerItems = ord.items.filter((i) => i.sellerId === user.id);
        if (sellerItems.length > 0) {
          return { ...ord, items: sellerItems };
        }
        return null;
      })
      .filter(Boolean);
    return res.json({ success: true, orders: sellerOrders });
  }

  // Buyer role: return orders placed by this buyer
  const buyerOrders = orders.filter((o) => o.buyerId === user.id || o.buyerEmail === user.email);
  return res.json({ success: true, orders: buyerOrders });
});

// POST /api/v1/orders
router.post('/', requireAuth, (req, res) => {
  try {
    const { items, shippingInfo } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required.' });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const orderItems = items.map((item) => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      sellerId: item.product.sellerId,
      sellerName: item.product.sellerName,
      sellerCity: item.product.sellerCity,
      status: 'Processing',
      trackingNumber: null
    }));

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerId: req.user.id,
      buyerName: req.user.name,
      buyerEmail: req.user.email,
      buyerAddress: shippingInfo?.address || '123 Market St',
      buyerCity: shippingInfo?.city || req.user.city || 'Yangon',
      totalAmount,
      createdAt: new Date().toISOString(),
      paymentStatus: 'Paid',
      items: orderItems
    };

    const orders = db.getOrders();
    orders.unshift(newOrder);
    db.saveOrders(orders);

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to place order.' });
  }
});

// PUT /api/v1/orders/:orderId/items/:itemId/status
router.put('/:orderId/items/:itemId/status', requireAuth, (req, res) => {
  const { orderId, itemId } = req.params;
  const { status, trackingNumber } = req.body;

  const orders = db.getOrders();
  const orderIdx = orders.findIndex((o) => o.id === orderId);

  if (orderIdx === -1) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const itemIdx = orders[orderIdx].items.findIndex((i) => i.id === itemId || i.productId === itemId);
  if (itemIdx === -1) {
    return res.status(404).json({ success: false, message: 'Order item not found.' });
  }

  const targetItem = orders[orderIdx].items[itemIdx];
  if (targetItem.sellerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized to update this order item.' });
  }

  orders[orderIdx].items[itemIdx].status = status || targetItem.status;
  if (trackingNumber) {
    orders[orderIdx].items[itemIdx].trackingNumber = trackingNumber;
  }

  db.saveOrders(orders);
  res.json({ success: true, order: orders[orderIdx] });
});

export default router;
