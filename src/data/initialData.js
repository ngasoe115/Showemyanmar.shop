export const INITIAL_USERS = [
  {
    id: 'user-admin',
    name: 'Platform Admin',
    email: 'admin@marketplace.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-seller-1',
    name: 'Marcus Vance',
    storeName: 'TechVault Electronics',
    email: 'tech@marketplace.com',
    password: 'password123',
    role: 'seller',
    city: 'New York',
    rating: 4.9,
    joinedDate: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-seller-2',
    name: 'Elena Rostova',
    storeName: 'Urban Craft & Fashion',
    email: 'urban@marketplace.com',
    password: 'password123',
    role: 'seller',
    city: 'Chicago',
    rating: 4.8,
    joinedDate: '2024-03-10',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-buyer-1',
    name: 'Alex Johnson',
    email: 'buyer@marketplace.com',
    password: 'password123',
    role: 'buyer',
    city: 'Austin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PRODUCTS = [
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
  },
  {
    id: 'prod-5',
    sellerId: 'user-seller-1',
    sellerName: 'TechVault Electronics',
    sellerCity: 'New York',
    title: 'UltraWide 34-Inch Curved Gaming Monitor',
    description: '144Hz WQHD IPS display with 1ms response time, HDR 400 support and USB-C hub connectivity.',
    price: 529.99,
    originalPrice: 599.99,
    category: 'Electronics',
    stock: 4,
    isSoldOut: false,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-06-20'
  },
  {
    id: 'prod-6',
    sellerId: 'user-seller-2',
    sellerName: 'Urban Craft & Fashion',
    sellerCity: 'Chicago',
    title: 'Organic Denim Oversized Jacket',
    description: '100% organic cotton vintage wash denim jacket with custom brass buttons and interior lining.',
    price: 98.00,
    originalPrice: 120.00,
    category: 'Fashion',
    stock: 15,
    isSoldOut: false,
    rating: 4.6,
    reviewsCount: 27,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-07-02'
  },
  {
    id: 'prod-7',
    sellerId: 'user-seller-1',
    sellerName: 'TechVault Electronics',
    sellerCity: 'New York',
    title: 'Smart Ambient RGB Desk Lamp',
    description: 'Touch-sensitive smart LED desk lamp with wireless charging base and customizable scene modes.',
    price: 69.50,
    originalPrice: 79.99,
    category: 'Home & Living',
    stock: 20,
    isSoldOut: false,
    rating: 4.8,
    reviewsCount: 51,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-07-10'
  },
  {
    id: 'prod-8',
    sellerId: 'user-seller-2',
    sellerName: 'Urban Craft & Fashion',
    sellerCity: 'Chicago',
    title: 'Hand-Poured Soy Wax Candle Trio',
    description: 'Set of 3 natural soy candles featuring Amber & Vanilla, Cedarwood, and Eucalyptus Mint scents.',
    price: 34.00,
    originalPrice: 42.00,
    category: 'Home & Living',
    stock: 18,
    isSoldOut: false,
    rating: 4.9,
    reviewsCount: 93,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-07-14'
  }
];

export const INITIAL_ORDERS = [
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
      },
      {
        id: 'item-2',
        productId: 'prod-4',
        title: 'Minimalist Ceramic Coffee Dripper Set',
        price: 45.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        sellerId: 'user-seller-2',
        sellerName: 'Urban Craft & Fashion',
        sellerCity: 'Chicago',
        status: 'Processing',
        trackingNumber: null
      }
    ]
  }
];

export const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Books',
  'Sports & Outdoors'
];

export const POPULAR_CITIES = [
  'All Cities',
  'New York',
  'Chicago',
  'San Francisco',
  'Los Angeles',
  'Austin',
  'Miami',
  'Seattle',
  'London'
];
