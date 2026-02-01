import { useState } from "react";
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

  if (!isAuthenticated) {
    navigate("/login");
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
    <div className="min-h-screen hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <span className="text-white font-bold text-xl">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-gray-500">
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
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
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
              <h1 className="text-3xl font-bold text-white font-display">
                Order History
              </h1>
              <p className="text-gray-500">
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
                  className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2"
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
                  className="input-modern pl-12"
                />
              </div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-modern w-auto"
              >
                <option value="30" className="bg-gray-900">
                  Last 30 days
                </option>
                <option value="90" className="bg-gray-900">
                  Last 3 months
                </option>
                <option value="365" className="bg-gray-900">
                  Last year
                </option>
              </select>
            </motion.div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-16 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-gray-600"
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
                <h3 className="text-xl font-semibold text-white mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500 mb-6">
                  You haven't placed any orders yet.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25"
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
                      className="glass-card overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center gap-6 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs uppercase">
                            Order Placed
                          </p>
                          <p className="font-medium text-white">
                            {formatDate(order.date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs uppercase">
                            Total
                          </p>
                          <p className="font-bold price-tag">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs uppercase">
                            Order #
                          </p>
                          <p className="font-medium text-blue-400 font-mono">
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
                              className="w-20 h-16 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-white">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {item.color && `Color: ${item.color}`}
                              </p>
                              <div className="flex gap-2 mt-2">
                                {item.reviewed ? (
                                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
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
                                      className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30 transition-colors"
                                    >
                                      Leave Review
                                    </motion.button>
                                  )
                                )}
                                <Link
                                  to={`/product/${item.id}`}
                                  className="px-3 py-1 bg-white/5 text-gray-400 text-xs rounded-lg hover:bg-white/10 transition-colors"
                                >
                                  Buy Again
                                </Link>
                              </div>
                            </div>
                            <p className="font-semibold text-white">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleDownloadReceipt(order)}
                          className="flex items-center gap-2 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
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
                        <button className="text-gray-500 text-sm hover:text-white transition-colors">
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
                      className="p-2 glass-card disabled:opacity-50"
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
                          className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === page ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25" : "glass-card text-gray-400 hover:text-white"}`}
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
                      className="p-2 glass-card disabled:opacity-50"
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
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-16 h-12 object-cover rounded-xl"
              />
              <p className="font-medium text-white">{selectedItem.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
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
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview({ ...newReview, title: e.target.value })
                }
                placeholder="Summarize your experience"
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Review
              </label>
              <textarea
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
                placeholder="Share your thoughts..."
                rows={4}
                className="input-modern resize-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={submitReview}
              disabled={!newReview.title || !newReview.content}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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
