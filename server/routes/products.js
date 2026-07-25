import express from 'express';
import { db } from '../db.js';
import { requireAuth, requireSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/v1/products
router.get('/', (req, res) => {
  const { city, category, search } = req.query;
  let products = db.getProducts();

  if (city && city !== 'All Cities') {
    products = products.filter((p) => p.sellerCity?.toLowerCase() === city.toLowerCase());
  }

  if (category && category !== 'All Categories') {
    products = products.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.sellerName?.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: products.length, products });
});

// POST /api/v1/products
router.post('/', requireAuth, requireSeller, (req, res) => {
  try {
    const { title, description, price, originalPrice, category, stock, image } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ success: false, message: 'Title and price are required.' });
    }

    const numStock = parseInt(stock || 0, 10);
    const numPrice = parseFloat(price);

    const newProduct = {
      id: `prod-${Date.now()}`,
      sellerId: req.user.id,
      sellerName: req.user.storeName || req.user.name,
      sellerCity: req.user.city || 'Yangon',
      title,
      description: description || '',
      price: numPrice,
      originalPrice: originalPrice ? parseFloat(originalPrice) : numPrice * 1.2,
      category: category || 'Electronics',
      stock: numStock,
      isSoldOut: numStock <= 0,
      rating: 5.0,
      reviewsCount: 1,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const products = db.getProducts();
    products.unshift(newProduct);
    db.saveProducts(products);

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

// PUT /api/v1/products/:id
router.put('/:id', requireAuth, requireSeller, (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const products = db.getProducts();

  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found.' });

  if (products[idx].sellerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized to modify this product.' });
  }

  const updatedStock = updates.stock !== undefined ? parseInt(updates.stock, 10) : products[idx].stock;
  const isSoldOut = updates.isSoldOut !== undefined ? updates.isSoldOut : updatedStock <= 0;

  products[idx] = {
    ...products[idx],
    ...updates,
    stock: updatedStock,
    isSoldOut
  };

  db.saveProducts(products);
  res.json({ success: true, product: products[idx] });
});

// PUT /api/v1/products/:id/toggle-sold-out
router.put('/:id/toggle-sold-out', requireAuth, requireSeller, (req, res) => {
  const { id } = req.params;
  const products = db.getProducts();

  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found.' });

  if (products[idx].sellerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized.' });
  }

  const nextSoldOut = !products[idx].isSoldOut;
  products[idx].isSoldOut = nextSoldOut;
  products[idx].stock = nextSoldOut ? 0 : (products[idx].stock > 0 ? products[idx].stock : 5);

  db.saveProducts(products);
  res.json({ success: true, product: products[idx] });
});

// DELETE /api/v1/products/:id
router.delete('/:id', requireAuth, requireSeller, (req, res) => {
  const { id } = req.params;
  let products = db.getProducts();

  const target = products.find((p) => p.id === id);
  if (!target) return res.status(404).json({ success: false, message: 'Product not found.' });

  if (target.sellerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized.' });
  }

  products = products.filter((p) => p.id !== id);
  db.saveProducts(products);
  res.json({ success: true, message: 'Product deleted successfully.' });
});

export default router;
