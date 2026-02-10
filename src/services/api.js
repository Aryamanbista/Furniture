const API_BASE = "http://localhost:5000/api";

// Helper to get stored token
const getToken = () => localStorage.getItem("furnihome_token");

// Generic fetch wrapper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

// --- Auth API ---
export const authAPI = {
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => apiRequest("/auth/me"),

  updateProfile: (data) =>
    apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// --- Products API ---
export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/products${query ? `?${query}` : ""}`);
  },

  getById: (id) => apiRequest(`/products/${id}`),

  create: (product) =>
    apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  update: (id, product) =>
    apiRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  delete: (id) =>
    apiRequest(`/products/${id}`, {
      method: "DELETE",
    }),
};

// --- Orders API ---
export const ordersAPI = {
  create: (orderData) =>
    apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  getAll: () => apiRequest("/orders"),

  getById: (id) => apiRequest(`/orders/${id}`),

  markReviewed: (orderId, productId) =>
    apiRequest(`/orders/${orderId}/review/${productId}`, {
      method: "PUT",
    }),
};

// --- Reviews API ---
export const reviewsAPI = {
  getByProduct: (productId) => apiRequest(`/reviews/${productId}`),

  create: (reviewData) =>
    apiRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),
};

// --- Stores API ---
export const storesAPI = {
  getAll: () => apiRequest("/stores"),
};

// --- Admin API ---
export const adminAPI = {
  getReports: (type = "monthly") => apiRequest(`/admin/reports?type=${type}`),
};
