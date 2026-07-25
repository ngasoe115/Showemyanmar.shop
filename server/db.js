import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const OTP_FILE = path.join(DATA_DIR, 'otps.json');
const EMAILS_FILE = path.join(DATA_DIR, 'emails.json');

const readJSON = (filePath, defaultData) => {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
  }
  return defaultData;
};

const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Error writing ${filePath}:`, e);
  }
};

// Initial Seed Data
const INITIAL_USERS = [
  {
    id: 'user-admin',
    name: 'Platform Admin',
    email: 'admin@marketplace.com',
    passwordHash: '$2a$12$R.7VzI.v1t7gXhU5b4W9e.hK9eZ.8y7/v3xZ.v9Z7v8Z9v0Z1Z2Z3', // password123
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    trustedDevices: ['admin@marketplace.com']
  },
  {
    id: 'user-seller-1',
    name: 'Marcus Vance',
    storeName: 'TechVault Electronics',
    email: 'tech@marketplace.com',
    passwordHash: '$2a$12$R.7VzI.v1t7gXhU5b4W9e.hK9eZ.8y7/v3xZ.v9Z7v8Z9v0Z1Z2Z3',
    role: 'seller',
    city: 'New York',
    rating: 4.9,
    joinedDate: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    trustedDevices: ['tech@marketplace.com']
  },
  {
    id: 'user-seller-2',
    name: 'Elena Rostova',
    storeName: 'Urban Craft & Fashion',
    email: 'urban@marketplace.com',
    passwordHash: '$2a$12$R.7VzI.v1t7gXhU5b4W9e.hK9eZ.8y7/v3xZ.v9Z7v8Z9v0Z1Z2Z3',
    role: 'seller',
    city: 'Chicago',
    rating: 4.8,
    joinedDate: '2024-03-10',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    trustedDevices: ['urban@marketplace.com']
  },
  {
    id: 'user-buyer-1',
    name: 'Alex Johnson',
    email: 'buyer@marketplace.com',
    passwordHash: '$2a$12$R.7VzI.v1t7gXhU5b4W9e.hK9eZ.8y7/v3xZ.v9Z7v8Z9v0Z1Z2Z3',
    role: 'buyer',
    city: 'Austin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    trustedDevices: ['buyer@marketplace.com']
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    sellerId: 'user-seller-1',
    sellerName: 'TechVault Electronics',
    sellerCity: 'New York',
    title: 'Aura Pro Wireless Mechanical Keyboard',
    description: 'Custom hot-swappable RGB mechanical keyboard with PBT keycaps and ultra-fast 2.4GHz wireless connectivity.',
    price: 149.99,
    originalPrice: 189.99,
    category: 'Electronics',
    stock: 12,
    isSoldOut: false,
    rating: 4.9,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-05-10'
  },
  {
    id: 'prod-2',
    sellerId: 'user-seller-1',
    sellerName: 'TechVault Electronics',
    sellerCity: 'New York',
    title: 'Studio Noise Cancelling Headphones',
    description: 'High-fidelity audio with active noise cancellation and 40-hour battery life. Premium memory foam ear cushions.',
    price: 249.00,
    originalPrice: 299.00,
    category: 'Electronics',
    stock: 8,
    isSoldOut: false,
    rating: 4.8,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-05-12'
  },
  {
    id: 'prod-3',
    sellerId: 'user-seller-2',
    sellerName: 'Urban Craft & Fashion',
    sellerCity: 'Chicago',
    title: 'Handcrafted Heritage Leather Backpack',
    description: 'Full-grain Italian leather rolltop backpack. Water-resistant finish with padded 16-inch laptop compartment.',
    price: 185.00,
    originalPrice: 220.00,
    category: 'Fashion',
    stock: 5,
    isSoldOut: false,
    rating: 5.0,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-06-01'
  },
  {
    id: 'prod-4',
    sellerId: 'user-seller-2',
    sellerName: 'Urban Craft & Fashion',
    sellerCity: 'Chicago',
    title: 'Minimalist Ceramic Coffee Dripper Set',
    description: 'Artisanal matte black ceramic pour-over cone with glass carafe. Handcrafted in Chicago studio.',
    price: 45.00,
    originalPrice: 55.00,
    category: 'Home & Living',
    stock: 0,
    isSoldOut: true,
    rating: 4.7,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-06-15'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-9842',
    buyerId: 'user-buyer-1',
    buyerName: 'Alex Johnson',
    buyerEmail: 'buyer@marketplace.com',
    totalAmount: 194.99,
    createdAt: '2026-07-20T14:30:00Z',
    paymentStatus: 'Paid',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        title: 'Aura Pro Wireless Mechanical Keyboard',
        price: 149.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
        sellerId: 'user-seller-1',
        sellerName: 'TechVault Electronics',
        sellerCity: 'New York',
        status: 'Shipped',
        trackingNumber: 'TRK-NY-84920'
      }
    ]
  }
];

export const db = {
  getUsers: () => readJSON(USERS_FILE, INITIAL_USERS),
  saveUsers: (users) => writeJSON(USERS_FILE, users),

  getProducts: () => readJSON(PRODUCTS_FILE, INITIAL_PRODUCTS),
  saveProducts: (products) => writeJSON(PRODUCTS_FILE, products),

  getOrders: () => readJSON(ORDERS_FILE, INITIAL_ORDERS),
  saveOrders: (orders) => writeJSON(ORDERS_FILE, orders),

  getOtps: () => readJSON(OTP_FILE, {}),
  saveOtps: (otps) => writeJSON(OTP_FILE, otps),

  getEmails: () => readJSON(EMAILS_FILE, []),
  saveEmails: (emails) => writeJSON(EMAILS_FILE, emails)
};
