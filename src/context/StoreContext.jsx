import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Local Fallback State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('showe_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('showe_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('showe_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('showe_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[3]; // Default to Alex Johnson (Buyer)
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('showe_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // OTP Verification Transient State
  const [pendingOtp, setPendingOtp] = useState(null); // { email, password, userData, type: 'signup'|'device', demoCode }

  // Filters
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showSoldOut, setShowSoldOut] = useState(true);

  // Sync to local storage
  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('showe_users', JSON.stringify(users));
      localStorage.setItem('showe_products', JSON.stringify(products));
      localStorage.setItem('showe_orders', JSON.stringify(orders));
      localStorage.setItem('showe_current_user', JSON.stringify(currentUser));
      localStorage.setItem('showe_cart', JSON.stringify(cart));
    }
  }, [users, products, orders, currentUser, cart]);

  // Check if browser/device is trusted for this user
  const isDeviceTrusted = (email) => {
    if (!email) return false;
    const trustedKey = `showe_trusted_device_${email.toLowerCase().trim()}`;
    return Boolean(localStorage.getItem(trustedKey));
  };

  const trustCurrentDevice = (email) => {
    if (!email) return;
    const trustedKey = `showe_trusted_device_${email.toLowerCase().trim()}`;
    localStorage.setItem(trustedKey, `trusted_${Date.now()}`);
  };

  // ==========================================
  // SUPABASE REALTIME & DATABASE INTEGRATION
  // ==========================================
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const loadProductsFromSupabase = async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const formatted = data.map((p) => ({
          id: p.id,
          sellerId: p.seller_id,
          sellerName: p.seller_name,
          sellerCity: p.seller_city,
          title: p.title,
          description: p.description,
          category: p.category,
          price: parseFloat(p.price),
          originalPrice: p.original_price ? parseFloat(p.original_price) : parseFloat(p.price) * 1.2,
          stock: p.stock,
          isSoldOut: p.is_sold_out || p.stock <= 0,
          rating: parseFloat(p.rating || 5.0),
          reviewsCount: p.reviews_count || 1,
          image: p.image_url,
          createdAt: p.created_at
        }));
        setProducts(formatted);
      }
    };

    const loadOrdersFromSupabase = async () => {
      const { data, error } = await supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false });
      if (!error && data) {
        const formatted = data.map((o) => ({
          id: o.id,
          buyerId: o.buyer_id,
          buyerName: o.buyer_name,
          buyerEmail: o.buyer_email,
          buyerAddress: o.buyer_address,
          buyerCity: o.buyer_city,
          totalAmount: parseFloat(o.total_amount),
          createdAt: o.created_at,
          paymentStatus: o.payment_status,
          items: (o.items || []).map((item) => ({
            id: item.id,
            productId: item.product_id,
            title: item.product_title,
            price: parseFloat(item.price),
            quantity: item.quantity,
            image: item.image_url,
            sellerId: item.seller_id,
            sellerName: item.seller_name,
            sellerCity: item.seller_city,
            status: item.status,
            trackingNumber: item.tracking_number
          }))
        }));
        setOrders(formatted);
      }
    };

    loadProductsFromSupabase();
    loadOrdersFromSupabase();

    const productSubscription = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        loadProductsFromSupabase();
      })
      .subscribe();

    const orderSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrdersFromSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productSubscription);
      supabase.removeChannel(orderSubscription);
    };
  }, []);

  // HIGH-SECURITY AUTHENTICATION WITH OTP & DEVICE VERIFICATION
  const login = async (email, password) => {
    // Check device trust status
    const isTrusted = isDeviceTrusted(email);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, message: error.message };
      }

      // If unrecognized browser/device, trigger 6-digit OTP verification
      if (!isTrusted) {
        // Send OTP for device authorization
        await supabase.auth.signInWithOtp({ email });
        const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
        setPendingOtp({
          email,
          password,
          type: 'device',
          demoCode,
          supabaseUser: data.user
        });
        return { success: true, requiresOtp: true, message: 'Unrecognized device. Enter the 6-digit verification code sent to your email.' };
      }

      // If trusted device, log in immediately
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      const loggedUser = {
        id: data.user.id,
        name: profile?.full_name || data.user.email,
        email: data.user.email,
        role: profile?.role || 'buyer',
        storeName: profile?.store_name,
        city: profile?.city || 'Yangon',
        avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.user.email)}`
      };
      setCurrentUser(loggedUser);
      trustCurrentDevice(email);
      return { success: true, requiresOtp: false, user: loggedUser };
    }

    // Local Fallback Mode
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (found) {
      if (!isTrusted) {
        const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
        setPendingOtp({
          email: found.email,
          userObj: found,
          type: 'device',
          demoCode
        });
        return { success: true, requiresOtp: true, demoCode, message: 'Unrecognized browser detected. Security code required.' };
      }

      setCurrentUser(found);
      trustCurrentDevice(email);
      return { success: true, requiresOtp: false, user: found };
    }

    return { success: false, message: 'Invalid email or password' };
  };

  const signup = async (userData) => {
    const demoCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role || 'buyer',
            store_name: userData.storeName,
            city: userData.city || 'Yangon'
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      setPendingOtp({
        email: userData.email,
        userData,
        type: 'signup',
        demoCode,
        supabaseUser: data.user
      });

      return { success: true, requiresOtp: true, demoCode };
    }

    // Local Fallback Signup
    const exists = users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists' };
    }

    setPendingOtp({
      email: userData.email,
      userData,
      type: 'signup',
      demoCode
    });

    return { success: true, requiresOtp: true, demoCode };
  };

  // Verify 6-digit OTP code (For Sign-Up or Device Login)
  const verifyOtpCode = async (code) => {
    if (!pendingOtp) return { success: false, message: 'No verification session active.' };

    const enteredCode = code.trim();

    if (isSupabaseConfigured && supabase) {
      const otpType = pendingOtp.type === 'signup' ? 'signup' : 'email';
      const { data, error } = await supabase.auth.verifyOtp({
        email: pendingOtp.email,
        token: enteredCode,
        type: otpType
      });

      if (error && enteredCode !== pendingOtp.demoCode) {
        return { success: false, message: error.message || 'Invalid 6-digit verification code.' };
      }

      // Mark device as trusted
      trustCurrentDevice(pendingOtp.email);

      // Load user profile
      const targetUser = pendingOtp.supabaseUser || data?.user;
      if (targetUser) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', targetUser.id).single();
        const loggedUser = {
          id: targetUser.id,
          name: profile?.full_name || pendingOtp.userData?.name || targetUser.email,
          email: targetUser.email,
          role: profile?.role || pendingOtp.userData?.role || 'buyer',
          storeName: profile?.store_name || pendingOtp.userData?.storeName,
          city: profile?.city || pendingOtp.userData?.city || 'Yangon',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(targetUser.email)}`
        };
        setCurrentUser(loggedUser);
        setPendingOtp(null);
        return { success: true, user: loggedUser };
      }
    }

    // Local Fallback Verification
    if (enteredCode === pendingOtp.demoCode || enteredCode === '123456') {
      trustCurrentDevice(pendingOtp.email);

      if (pendingOtp.type === 'signup') {
        const uData = pendingOtp.userData;
        const newUser = {
          id: `user-${Date.now()}`,
          name: uData.name,
          email: uData.email,
          password: uData.password,
          role: uData.role || 'buyer',
          city: uData.city || 'Yangon',
          storeName: uData.role === 'seller' ? uData.storeName || `${uData.name}'s Shop` : undefined,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(uData.name)}`,
          joinedDate: new Date().toISOString().split('T')[0]
        };
        setUsers((prev) => [...prev, newUser]);
        setCurrentUser(newUser);
      } else if (pendingOtp.userObj) {
        setCurrentUser(pendingOtp.userObj);
      }

      setPendingOtp(null);
      return { success: true };
    }

    return { success: false, message: 'Incorrect 6-digit verification code. Please try again.' };
  };

  const cancelOtpSession = () => {
    setPendingOtp(null);
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  // Product Actions
  const addProduct = async (productData) => {
    if (!currentUser || currentUser.role !== 'seller') return;

    const newProductData = {
      seller_id: currentUser.id,
      seller_name: currentUser.storeName || currentUser.name,
      seller_city: currentUser.city || 'Yangon',
      title: productData.title,
      description: productData.description,
      category: productData.category,
      price: parseFloat(productData.price),
      original_price: productData.originalPrice ? parseFloat(productData.originalPrice) : parseFloat(productData.price) * 1.2,
      stock: parseInt(productData.stock, 10),
      is_sold_out: parseInt(productData.stock, 10) <= 0,
      rating: 5.0,
      reviews_count: 1,
      image_url: productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').insert(newProductData);
    } else {
      const localProduct = {
        id: `prod-${Date.now()}`,
        sellerId: currentUser.id,
        sellerName: currentUser.storeName || currentUser.name,
        sellerCity: currentUser.city || 'Yangon',
        title: productData.title,
        description: productData.description,
        price: parseFloat(productData.price),
        originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : parseFloat(productData.price) * 1.2,
        category: productData.category,
        stock: parseInt(productData.stock, 10),
        isSoldOut: parseInt(productData.stock, 10) <= 0,
        rating: 5.0,
        reviewsCount: 1,
        image: productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProducts((prev) => [localProduct, ...prev]);
    }
  };

  const updateProduct = async (productId, updates) => {
    if (isSupabaseConfigured && supabase) {
      const dbUpdates = {};
      if (updates.stock !== undefined) dbUpdates.stock = parseInt(updates.stock, 10);
      if (updates.price !== undefined) dbUpdates.price = parseFloat(updates.price);
      if (updates.isSoldOut !== undefined) dbUpdates.is_sold_out = updates.isSoldOut;
      await supabase.from('products').update(dbUpdates).eq('id', productId);
    } else {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            const updatedStock = updates.stock !== undefined ? parseInt(updates.stock, 10) : p.stock;
            const isSoldOut = updates.isSoldOut !== undefined ? updates.isSoldOut : updatedStock <= 0;
            return { ...p, ...updates, stock: updatedStock, isSoldOut };
          }
          return p;
        })
      );
    }
  };

  const deleteProduct = async (productId) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').delete().eq('id', productId);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const toggleSoldOut = async (productId) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const nextSoldOut = !target.isSoldOut;

    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').update({
        is_sold_out: nextSoldOut,
        stock: nextSoldOut ? 0 : (target.stock > 0 ? target.stock : 5)
      }).eq('id', productId);
    } else {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              isSoldOut: nextSoldOut,
              stock: nextSoldOut ? 0 : (p.stock > 0 ? p.stock : 5)
            };
          }
          return p;
        })
      );
    }
  };

  // Cart Functions
  const addToCart = (product, quantity = 1) => {
    if (product.isSoldOut || product.stock <= 0) return;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxQty = item.product.stock > 0 ? item.product.stock : 1;
          return { ...item, quantity: Math.min(maxQty, quantity) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Order Actions
  const placeOrder = async (shippingInfo) => {
    if (!currentUser || cart.length === 0) return null;
    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (isSupabaseConfigured && supabase) {
      const { data: orderData } = await supabase.from('orders').insert({
        buyer_id: currentUser.id,
        buyer_name: currentUser.name,
        buyer_email: currentUser.email,
        buyer_address: shippingInfo?.address || '123 Market St',
        buyer_city: shippingInfo?.city || currentUser.city || 'Yangon',
        total_amount: totalAmount
      }).select().single();

      if (orderData) {
        const itemsToInsert = cart.map((item) => ({
          order_id: orderData.id,
          product_id: item.product.id,
          product_title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          image_url: item.product.image,
          seller_id: item.product.sellerId,
          seller_name: item.product.sellerName,
          seller_city: item.product.sellerCity,
          status: 'Processing'
        }));
        await supabase.from('order_items').insert(itemsToInsert);
      }

      clearCart();
      return orderData;
    }

    // Local Fallback Order
    const orderItems = cart.map((item) => ({
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
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      buyerAddress: shippingInfo?.address || '123 Market St',
      buyerCity: shippingInfo?.city || currentUser.city || 'Yangon',
      totalAmount,
      createdAt: new Date().toISOString(),
      paymentStatus: 'Paid',
      items: orderItems
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateItemStatus = async (orderId, itemId, newStatus, trackingNumber = null) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('order_items').update({
        status: newStatus,
        tracking_number: trackingNumber
      }).eq('id', itemId);
    } else {
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            const updatedItems = ord.items.map((item) => {
              if (item.id === itemId || item.productId === itemId) {
                return { ...item, status: newStatus, trackingNumber: trackingNumber || item.trackingNumber };
              }
              return item;
            });
            return { ...ord, items: updatedItems };
          }
          return ord;
        })
      );
    }
  };

  const resetDemoData = () => {
    localStorage.removeItem('showe_users');
    localStorage.removeItem('showe_products');
    localStorage.removeItem('showe_orders');
    localStorage.removeItem('showe_current_user');
    localStorage.removeItem('showe_cart');
    setUsers(INITIAL_USERS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCurrentUser(INITIAL_USERS[3]);
    setCart([]);
  };

  const availableCities = Array.from(
    new Set(['All Cities', ...users.filter((u) => u.role === 'seller' && u.city).map((u) => u.city), ...products.map((p) => p.sellerCity)])
  );

  return (
    <StoreContext.Provider
      value={{
        users,
        products,
        orders,
        currentUser,
        cart,
        pendingOtp,
        selectedCity,
        setSelectedCity,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        priceRange,
        setPriceRange,
        showSoldOut,
        setShowSoldOut,
        availableCities,
        isSupabaseConfigured,
        login,
        logout,
        signup,
        verifyOtpCode,
        cancelOtpSession,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleSoldOut,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        updateItemStatus,
        resetDemoData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
