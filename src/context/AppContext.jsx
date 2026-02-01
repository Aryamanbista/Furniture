import { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "../data/products";

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// Generate mock order history
const generateMockOrders = () => [
  {
    id: "402-3921",
    date: "2023-10-24",
    total: 168750.0,
    status: "delivered",
    deliveredDate: "Oct 28",
    items: [
      {
        id: 8,
        name: "Mid-Century Velvet Sofa",
        color: "Navy Blue",
        quantity: 1,
        price: 148500.0,
        image:
          "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=200&h=150&fit=crop",
        reviewed: false,
      },
      {
        id: 101,
        name: "Geometric Throw Pillow",
        color: "Mustard Yellow",
        quantity: 2,
        price: 20250.0,
        image:
          "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=200&h=150&fit=crop",
        reviewed: false,
      },
    ],
  },
  {
    id: "402-4115",
    date: "2023-11-02",
    total: 120150.0,
    status: "shipped",
    estimatedDelivery: "Arriving Tomorrow",
    items: [
      {
        id: 102,
        name: "Oak Minimalist Coffee Table",
        material: "Solid Oak",
        quantity: 1,
        price: 120150.0,
        image:
          "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=200&h=150&fit=crop",
        reviewed: false,
      },
    ],
  },
  {
    id: "401-2290",
    date: "2023-09-15",
    total: 45900.0,
    status: "delivered",
    deliveredDate: "Sep 19",
    items: [
      {
        id: 103,
        name: "Brass Task Lamp",
        color: "Antique Brass",
        quantity: 1,
        price: 16200.0,
        image:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=150&fit=crop",
        reviewed: true,
      },
      {
        id: 104,
        name: "Ceramic Planter Set",
        size: "Large",
        quantity: 1,
        price: 29700.0,
        image:
          "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=150&fit=crop",
        reviewed: true,
      },
    ],
  },
];

export const AppProvider = ({ children }) => {
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Always load initial products to ensure price updates are reflected
    setProducts(initialProducts);
    localStorage.setItem("furnihome_products", JSON.stringify(initialProducts));

    // Load orders from localStorage or use mock data
    const savedOrders = localStorage.getItem("furnihome_orders");
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      // Check if orders are still in USD (heuristic: low totals) and force update if so
      const isStaleData = parsedOrders.some((order) => order.total < 5000);

      if (isStaleData) {
        console.log("Detected stale USD data, refreshing to NPR...");
        const mockOrders = generateMockOrders();
        setOrders(mockOrders);
        localStorage.setItem("furnihome_orders", JSON.stringify(mockOrders));
      } else {
        setOrders(parsedOrders);
      }
    } else {
      const mockOrders = generateMockOrders();
      setOrders(mockOrders);
      localStorage.setItem("furnihome_orders", JSON.stringify(mockOrders));
    }

    // Load user reviews
    const savedReviews = localStorage.getItem("furnihome_user_reviews");
    if (savedReviews) {
      setUserReviews(JSON.parse(savedReviews));
    }
  }, []);

  const addOrder = (product, shippingInfo, paymentDetails) => {
    const newOrder = {
      id: `${400 + Math.floor(Math.random() * 100)}-${1000 + Math.floor(Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      total: product.price + 50 + product.price * 0.08, // subtotal + shipping + tax
      status: "processing",
      shippingInfo,
      items: [
        {
          id: product.id,
          name: product.name,
          color: product.selectedColor || product.colorNames[0],
          quantity: product.quantity || 1,
          price: product.price,
          image: product.image,
          reviewed: false,
        },
      ],
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("furnihome_orders", JSON.stringify(updatedOrders));

    return newOrder;
  };

  const addReview = (productId, review) => {
    const newReview = {
      id: Date.now(),
      productId,
      ...review,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedReviews = [...userReviews, newReview];
    setUserReviews(updatedReviews);
    localStorage.setItem(
      "furnihome_user_reviews",
      JSON.stringify(updatedReviews),
    );

    // Mark item as reviewed in orders
    const updatedOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) =>
        item.id === productId ? { ...item, reviewed: true } : item,
      ),
    }));
    setOrders(updatedOrders);
    localStorage.setItem("furnihome_orders", JSON.stringify(updatedOrders));

    return newReview;
  };

  // --- Admin Functions ---
  const addProduct = (newProduct) => {
    const updatedProducts = [
      ...products,
      { ...newProduct, id: products.length + 1 },
    ];
    setProducts(updatedProducts);
    localStorage.setItem("furnihome_products", JSON.stringify(updatedProducts));
  };

  const updateProduct = (updatedProduct) => {
    const updatedProducts = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p,
    );
    setProducts(updatedProducts);
    localStorage.setItem("furnihome_products", JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("furnihome_products", JSON.stringify(updatedProducts));
  };

  const generateSalesReport = (type = "monthly") => {
    // Simple mock aggregation
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
  };

  const value = {
    checkoutProduct,
    setCheckoutProduct,
    orders,
    addOrder,
    userReviews,
    addReview,
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    generateSalesReport,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
