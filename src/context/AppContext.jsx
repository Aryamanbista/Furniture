import { createContext, useContext, useState, useEffect } from "react";
import { productsAPI, ordersAPI, reviewsAPI, adminAPI } from "../services/api";

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from API on mount
  useEffect(() => {
    productsAPI
      .getAll()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Load orders from API when user is authenticated
  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("furnihome_token");
      if (!token) return;
      const data = await ordersAPI.getAll();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  const addOrder = async (product, shippingInfo, paymentDetails) => {
    try {
      const orderData = {
        items: [
          {
            productId: product._id || product.id,
            name: product.name,
            color: product.selectedColor || product.colorNames?.[0] || "",
            quantity: product.quantity || 1,
            price: product.price,
            image: product.image,
            reviewed: false,
          },
        ],
        total: product.price + 50 + product.price * 0.08,
        shippingInfo,
      };

      const newOrder = await ordersAPI.create(orderData);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      console.error("Failed to create order:", err);
      throw err;
    }
  };

  const addReview = async (productId, review) => {
    try {
      const newReview = await reviewsAPI.create({
        productId,
        ...review,
      });

      setUserReviews((prev) => [...prev, newReview]);

      // Mark item as reviewed in orders (update local state)
      setOrders((prev) =>
        prev.map((order) => ({
          ...order,
          items: order.items.map((item) =>
            item.productId === productId ? { ...item, reviewed: true } : item,
          ),
        })),
      );

      return newReview;
    } catch (err) {
      console.error("Failed to add review:", err);
      throw err;
    }
  };

  // --- Admin Functions ---
  const addProduct = async (newProduct) => {
    try {
      const created = await productsAPI.create(newProduct);
      setProducts((prev) => [...prev, created]);
      return created;
    } catch (err) {
      console.error("Failed to add product:", err);
      throw err;
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const updated = await productsAPI.update(
        updatedProduct._id,
        updatedProduct,
      );
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p)),
      );
      return updated;
    } catch (err) {
      console.error("Failed to update product:", err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productsAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      throw err;
    }
  };

  const generateSalesReport = async (type = "monthly") => {
    try {
      const report = await adminAPI.getReports(type);
      return report;
    } catch (err) {
      console.error("Failed to generate report:", err);
      // Fallback to local calculation
      const report = {};
      orders.forEach((order) => {
        const date = new Date(order.date);
        const key =
          type === "monthly"
            ? `${date.getFullYear()}-${date.getMonth() + 1}`
            : `${date.getFullYear()}`;

        if (!report[key]) {
          report[key] = { period: key, sales: 0, count: 0 };
        }
        report[key].sales += order.total;
        report[key].count += 1;
      });
      return Object.values(report).sort((a, b) =>
        b.period.localeCompare(a.period),
      );
    }
  };

  const value = {
    checkoutProduct,
    setCheckoutProduct,
    orders,
    loadOrders,
    addOrder,
    userReviews,
    addReview,
    products,
    setProducts,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    generateSalesReport,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
