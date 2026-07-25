const API_BASE = import.meta.env.VITE_SELF_HOSTED_API || 'http://localhost:5000/api/v1';

export const apiClient = {
  async getHealth() {
    try {
      const res = await fetch('http://localhost:5000/api/health');
      return await res.json();
    } catch (e) {
      return { status: 'offline' };
    }
  },

  async signup(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Backend server connection error.' };
    }
  },

  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Backend server connection error.' };
    }
  },

  async verifyOtp(email, code) {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Backend server connection error.' };
    }
  },

  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products?${query}`);
      const data = await res.json();
      return data.products || [];
    } catch (e) {
      return null;
    }
  },

  async createProduct(productData, token) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Failed to create product on backend.' };
    }
  },

  async updateProduct(productId, updates, token) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Failed to update product on backend.' };
    }
  },

  async toggleSoldOut(productId, token) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/products/${productId}/toggle-sold-out`, {
        method: 'PUT',
        headers
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Failed to toggle sold out status.' };
    }
  },

  async deleteProduct(productId, token) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
        headers
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Failed to delete product on backend.' };
    }
  },

  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      return data.orders || [];
    } catch (e) {
      return null;
    }
  },

  async createOrder(orderData, token) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Failed to create order on backend.' };
    }
  }
};

