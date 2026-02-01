import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { generateReceipt } from "../utils/pdfGenerator";
import Modal from "../components/ui/Modal";
import StarRating from "../components/ui/StarRating";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { orders, addReview } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("30");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const filteredOrders = orders.filter((order) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.items.some((item) => item.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const ordersPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  const handleDownloadReceipt = (order) => generateReceipt(order);
  const handleWriteReview = (item) => {
    setSelectedItem(item);
    setShowReviewModal(true);
  };
  const submitReview = () => {
    if (selectedItem)
      addReview(selectedItem.id, {
        userId: user.id,
        userName: user.name,
        rating: newReview.rating,
        title: newReview.title,
        content: newReview.content,
      });
    setShowReviewModal(false);
    setNewReview({ rating: 5, title: "", content: "" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-emerald-400 bg-emerald-500/10";
      case "shipped":
        return "text-blue-400 bg-blue-500/10";
      case "processing":
        return "text-amber-400 bg-amber-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const sidebarLinks = [
    {
      id: "profile",
      name: "Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "orders",
      name: "Order History",
      icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    },
    {
      id: "addresses",
      name: "Address Book",
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
    },
    {
      id: "payments",
      name: "Payment Methods",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
    {
      id: "settings",
      name: "Settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since {user?.memberSince}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <motion.button
                    key={link.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveTab(link.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition-all ${
                      activeTab === link.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={link.icon}
                      />
                    </svg>
                    {link.name}
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-foreground font-display">
                Order History
              </h1>
              <p className="text-muted-foreground">
                Track orders, download receipts, and review purchases.
              </p>
            </motion.div>

            {/* Search & Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <div className="relative flex-1">
                <svg
                  className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by Order ID or Item"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 pl-12 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all"
                />
              </div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-card border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all w-auto"
              >
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
            </motion.div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-2xl p-16 text-center shadow-sm"
              >
                <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No orders found
                </h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-md hover:bg-primary/90 transition-colors"
                >
                  Start Shopping
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {paginatedOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="px-6 py-4 border-b border-border bg-secondary/30 flex flex-wrap items-center gap-6 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs uppercase font-medium">
                            Order Placed
                          </p>
                          <p className="font-medium text-foreground">
                            {formatDate(order.date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs uppercase font-medium">
                            Total
                          </p>
                          <span className="text-primary font-bold text-lg">
                            NPR {order.total.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs uppercase font-medium">
                            Order #
                          </p>
                          <p className="font-medium text-foreground font-mono">
                            {order.id}
                          </p>
                        </div>
                        <div
                          className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status === "delivered" &&
                            `✓ Delivered ${order.deliveredDate}`}
                          {order.status === "shipped" &&
                            `🚚 ${order.estimatedDelivery}`}
                          {order.status === "processing" && "⏳ Processing"}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="px-6 py-4 space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-xl border border-border"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground text-lg">
                                {item.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.color && `Color: ${item.color}`}
                              </p>
                              <div className="flex gap-2 mt-3">
                                {item.reviewed ? (
                                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    Reviewed
                                  </span>
                                ) : (
                                  order.status === "delivered" && (
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      onClick={() => handleWriteReview(item)}
                                      className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors"
                                    >
                                      Leave Review
                                    </motion.button>
                                  )
                                )}
                                <Link
                                  to={`/product/${item.id}`}
                                  className="px-3 py-1.5 bg-secondary text-foreground text-xs font-medium rounded-lg hover:bg-secondary/80 transition-colors"
                                >
                                  Buy Again
                                </Link>
                              </div>
                            </div>
                            <p className="font-semibold text-foreground">
                              NPR {item.price.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="px-6 py-4 border-t border-border bg-secondary/10 flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleDownloadReceipt(order)}
                          className="flex items-center gap-2 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download Receipt
                        </motion.button>
                        <button className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </motion.button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <motion.button
                          key={page}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === page ? "bg-primary text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                        >
                          {page}
                        </motion.button>
                      ),
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Write a Review"
      >
        {selectedItem && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-16 h-12 object-cover rounded-xl"
              />
              <p className="font-medium text-foreground">{selectedItem.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                Your Rating
              </label>
              <StarRating
                rating={newReview.rating}
                size="xl"
                interactive
                onChange={(r) => setNewReview({ ...newReview, rating: r })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Title
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview({ ...newReview, title: e.target.value })
                }
                placeholder="Summarize your experience"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Review
              </label>
              <textarea
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all resize-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={submitReview}
              disabled={!newReview.title || !newReview.content}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
            >
              Submit Review
            </motion.button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
