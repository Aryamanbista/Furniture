import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../services/api";
import {
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const AdminOrders = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [isAdmin, navigate]);

  const fetchOrders = async () => {
    try {
      const data = await adminAPI.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updatedOrder = await adminAPI.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, status: updatedOrder.status, deliveredDate: updatedOrder.deliveredDate } : order))
      );
    } catch (err) {
      console.error("Failed to update status", err);
      // Optional: show a toast or alert here
    } finally {
      setUpdatingId(null);
    }
  };

  const statusConfig = {
    processing: {
      color: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
      icon: ClockIcon,
      label: "Processing",
    },
    shipped: {
      color: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
      icon: TruckIcon,
      label: "Shipped",
    },
    delivered: {
      color: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
      icon: CheckCircleIcon,
      label: "Delivered",
    },
    cancelled: {
      color: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
      icon: XCircleIcon,
      label: "Cancelled",
    },
  };

  if (!isAdmin) return null;

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-display font-medium text-foreground">
          Manage Orders
        </h1>
        <p className="text-muted-foreground mt-2">
          View and process customer orders.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-center">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-3xl border border-border">
          <p className="text-muted-foreground">No orders found.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-6 py-4 font-semibold text-sm text-foreground">Order ID</th>
                  <th className="px-6 py-4 font-semibold text-sm text-foreground">Customer</th>
                  <th className="px-6 py-4 font-semibold text-sm text-foreground">Date</th>
                  <th className="px-6 py-4 font-semibold text-sm text-foreground">Total</th>
                  <th className="px-6 py-4 font-semibold text-sm text-foreground">Status</th>
                  <th className="px-6 py-4 font-semibold text-sm text-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => {
                  const sConf = statusConfig[order.status] || statusConfig.processing;
                  const Icon = sConf.icon;

                  return (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={order._id}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-muted-foreground">
                          {order.orderId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-foreground">{order.user?.name || "Unknown User"}</p>
                          <p className="text-muted-foreground text-xs">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        NPR {order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${sConf.color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {sConf.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={updatingId === order._id || order.status === "cancelled"}
                            className="bg-background border border-border text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
