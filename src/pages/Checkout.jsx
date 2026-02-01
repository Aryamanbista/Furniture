import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { checkoutProduct, addOrder } = useApp();
  const { isAuthenticated } = useAuth();

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    saveAddress: true,
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!checkoutProduct) {
      navigate("/");
    }
  }, [isAuthenticated, checkoutProduct, navigate]);

  if (!checkoutProduct) return null;

  const subtotal = checkoutProduct.price * (checkoutProduct.quantity || 1);
  const shippingCost = 50.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShipping((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePaymentSuccess = (details) => {
    addOrder(checkoutProduct, shipping, details);
    setPaymentSuccess(true);
    setTimeout(() => navigate("/orders"), 3000);
  };

  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  if (paymentSuccess) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
          >
            <svg
              className="w-10 h-10 text-white"
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
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-500 mb-6">
            Your order has been placed successfully.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            Redirecting to orders...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-10">
            Complete your purchase securely.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-400"
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
                <h2 className="font-semibold text-foreground">Item Details</h2>
              </div>
              <div className="flex gap-4">
                <img
                  src={checkoutProduct.image}
                  alt={checkoutProduct.name}
                  className="w-24 h-20 object-cover rounded-xl"
                />
                <div>
                  <h3 className="font-medium text-foreground">
                    {checkoutProduct.name} - {checkoutProduct.selectedColor}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    SKU: {checkoutProduct.sku}
                  </p>
                  <p className="text-lg font-bold price-tag mt-1 text-foreground">
                    ${checkoutProduct.price.toFixed(2)}{" "}
                    <span className="text-muted-foreground text-sm font-normal">
                      × {checkoutProduct.quantity || 1}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 border-border"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </div>
                <h2 className="font-semibold text-foreground">
                  Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={shipping.firstName}
                    onChange={handleInputChange}
                    placeholder="Jane"
                    className="input-modern bg-secondary border-border text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={shipping.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="input-modern bg-secondary border-border text-foreground"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shipping.address}
                    onChange={handleInputChange}
                    placeholder="123 Furniture Lane"
                    className="input-modern bg-secondary border-border text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shipping.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className="input-modern bg-secondary border-border text-foreground"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      State
                    </label>
                    <select
                      name="state"
                      value={shipping.state}
                      onChange={handleInputChange}
                      className="input-modern bg-secondary border-border text-foreground"
                      required
                    >
                      <option value="">Select</option>
                      {states.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      ZIP
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shipping.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className="input-modern bg-secondary border-border text-foreground"
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shipping.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 555-0123"
                    className="input-modern bg-secondary border-border text-foreground"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 mt-6 cursor-pointer group">
                <input
                  type="checkbox"
                  name="saveAddress"
                  checked={shipping.saveAddress}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded bg-secondary border-border text-blue-500"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground">
                  Save for future purchases
                </span>
              </label>
            </motion.div>

            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 border-border"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h2 className="font-semibold text-foreground">Payment</h2>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-amber-400 text-sm">
                    Test Mode Enabled
                  </p>
                  <p className="text-amber-500/80 text-xs">
                    Sandbox environment - no real charges
                  </p>
                </div>
              </div>

              <p className="text-center text-muted-foreground text-sm mb-4">
                Express Checkout
              </p>
              <PayPalScriptProvider
                options={{ clientId: "test", currency: "USD" }}
              >
                <PayPalButtons
                  style={{ layout: "horizontal", color: "gold", shape: "pill" }}
                  createOrder={(data, actions) =>
                    actions.order.create({
                      purchase_units: [{ amount: { value: total.toFixed(2) } }],
                    })
                  }
                  onApprove={(data, actions) =>
                    actions.order.capture().then(handlePaymentSuccess)
                  }
                />
              </PayPalScriptProvider>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-6 sticky top-24 border-border">
              <h2 className="font-semibold text-foreground mb-6">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-foreground">
                    ${shippingCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="text-3xl font-bold price-tag text-foreground">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-secondary border border-border">
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-muted-foreground">
                    Need help?{" "}
                    <span className="text-foreground font-medium">
                      1-800-FURNIHOME
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
