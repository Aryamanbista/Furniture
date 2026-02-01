import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Truck,
  MapPin,
  Smartphone,
  Package,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Wallet,
} from "lucide-react";
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
    email: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("esewa"); // esewa, khalti, cod
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!checkoutProduct) {
      navigate("/shop");
    }
  }, [isAuthenticated, checkoutProduct, navigate]);

  if (!checkoutProduct) return null;

  const subtotal = checkoutProduct.price * (checkoutProduct.quantity || 1);
  const shippingCost = 500.0; // Updated shipping cost for local context
  const tax = subtotal * 0.13; // 13% VAT
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const details = {
        paymentMethod,
        transactionId: `${paymentMethod.toUpperCase()}-${Date.now()}`,
        status: "COMPLETED",
        paidAt: new Date().toISOString(),
      };

      addOrder(checkoutProduct, shipping, details);
      setProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => navigate("/orders"), 3000);
    }, 2000);
  };

  const paymentMethods = [
    {
      id: "esewa",
      name: "eSewa",
      color: "bg-[#60bb46]",
      textColor: "text-white",
      description: "Pay with your eSewa mobile wallet",
    },
    {
      id: "khalti",
      name: "Khalti",
      color: "bg-[#5c2d91]",
      textColor: "text-white",
      description: "Pay with Khalti digital wallet",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      color: "bg-zinc-800",
      textColor: "text-white",
      description: "Pay carefully upon delivery",
    },
  ];

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card w-full max-w-md p-8 rounded-3xl border border-border shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold font-display text-foreground mb-3">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
          <div className="flex items-center justify-center gap-3 text-primary font-medium bg-secondary/50 py-3 px-6 rounded-full mx-auto w-fit">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Redirecting to orders...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold font-display text-foreground mb-4">
            Checkout
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Cart</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary font-medium">Checkout</span>
            <ChevronRight className="w-4 h-4" />
            <span>Confirmation</span>
          </div>
        </motion.div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Shipping Details */}
            <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Shipping Address
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={shipping.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={shipping.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Enter last name"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={shipping.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Street address, apartment, suite, etc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shipping.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Kathmandu"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shipping.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="98XXXXXXXX"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Payment Method
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred payment option
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-muted-foreground/30 bg-background"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary border-border focus:ring-primary"
                    />
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${method.color}`}
                    >
                      <span className={`font-bold text-xs ${method.textColor}`}>
                        {method.name.substring(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{method.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    {paymentMethod === method.id && (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    )}
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-card border border-border rounded-3xl p-8 shadow-lg">
              <h2 className="text-xl font-bold font-display text-foreground mb-6">
                Order Summary
              </h2>

              <div className="flex gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden border border-border shrink-0">
                  <img
                    src={checkoutProduct.image}
                    alt={checkoutProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-foreground line-clamp-1">
                    {checkoutProduct.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {checkoutProduct.category}
                  </p>
                  <p className="text-primary font-bold">
                    NPR {checkoutProduct.price.toLocaleString()}
                    <span className="text-sm text-muted-foreground font-normal ml-1">
                      x {checkoutProduct.quantity || 1}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">
                    NPR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping (Standard)</span>
                  <span className="text-foreground font-medium">
                    NPR {shippingCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (13% VAT)</span>
                  <span className="text-foreground font-medium">
                    NPR {tax.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-6 border-t border-border mb-8">
                <div>
                  <span className="block text-sm text-muted-foreground">
                    Total Amount
                  </span>
                  <span className="text-3xl font-bold text-primary font-display">
                    NPR {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Secure SSL Encryption</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
