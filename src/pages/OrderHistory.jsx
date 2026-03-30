import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { generateReceipt } from "../utils/pdfGenerator";
import Modal from "../components/ui/Modal";
import StarRating from "../components/ui/StarRating";
import { ClockIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { orders, addReview, loadOrders } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("30");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
    imagePreview: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      loadOrders();
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const filteredOrders = orders.filter((order) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const orderId = order.orderId || order._id || "";
      return (
        orderId.toLowerCase().includes(q) ||
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
      addReview(selectedItem.productId, {
        userName: user.name,
        rating: newReview.rating,
        title: newReview.title,
        content: newReview.content,
        image: newReview.imagePreview,
      });
    setShowReviewModal(false);
    setNewReview({ rating: 5, title: "", content: "", imagePreview: null });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReview((prev) => ({ ...prev, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content */}
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
                      key={order._id || order.orderId}
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
                            {order.orderId || order._id}
                          </p>
                        </div>
                        <div
                          className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status === "delivered" &&
                            `✓ Delivered ${order.deliveredDate || ""}`}
                          {order.status === "shipped" &&
                            `🚚 ${order.estimatedDelivery || "Shipped"}`}
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
                                ) : order.status === "delivered" ? (
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleWriteReview(item)}
                                    className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors"
                                  >
                                    Leave Review
                                  </motion.button>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">
                                    <ClockIcon className="w-3 h-3" />
                                    Review after delivery
                                  </span>
                                )}
                                <Link
                                  to={`/product/${item.productId}`}
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
      </div>

      {/* Premium Write Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Share Your Experience"
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Product Header */}
            <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl border border-border">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-16 h-16 object-cover rounded-xl shadow-sm"
              />
              <div>
                <p className="font-semibold text-foreground text-sm line-clamp-1">{selectedItem.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">We'd love to hear your thoughts!</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex flex-col items-center py-2">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Tap to rate
              </label>
              <StarRating
                rating={newReview.rating}
                size="2xl"
                interactive
                onChange={(r) => setNewReview({ ...newReview, rating: r })}
              />
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 ml-1 uppercase tracking-wider">
                  Review Title
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) =>
                    setNewReview({ ...newReview, title: e.target.value })
                  }
                  placeholder="Summarize your experience"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 ml-1 uppercase tracking-wider">
                  Detailed Review
                </label>
                <textarea
                  value={newReview.content}
                  onChange={(e) =>
                    setNewReview({ ...newReview, content: e.target.value })
                  }
                  placeholder="What did you like or dislike? How's the quality?"
                  rows={4}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 ml-1 uppercase tracking-wider">
                  Add Photo
                </label>
                {newReview.imagePreview ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border shadow-sm group">
                    <img src={newReview.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => setNewReview({ ...newReview, imagePreview: null })}
                        className="p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-lg"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/30 hover:border-primary/50 transition-all bg-secondary/10">
                    <div className="flex flex-col items-center justify-center pb-2 pt-3">
                      <PhotoIcon className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                      <p className="text-xs text-muted-foreground font-medium">Click to upload an image</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={submitReview}
              disabled={!newReview.title || !newReview.content}
              className="w-full py-4 mt-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
            >
              Post Review
            </motion.button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
