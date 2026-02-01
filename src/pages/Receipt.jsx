import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { generateReceipt } from "../utils/pdfGenerator";
import {
  CheckCircleIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      // If no order in state (e.g. direct access), redirect home
      navigate("/");
    }
  }, [location, navigate]);

  const handleDownload = () => {
    if (order) generateReceipt(order);
  };

  if (!order) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-xl">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-3xl font-display font-medium mb-4 text-foreground">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground mb-8">
          Your order <strong>#{order.id}</strong> has been confirmed. A
          confirmation email has been sent to you.
        </p>

        <div className="bg-secondary/50 rounded-xl p-6 mb-8 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="font-medium text-foreground">
              NPR {order.total.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium text-foreground">{order.date}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownload}
            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Download Official Receipt
          </button>

          <Link
            to="/shop"
            className="w-full py-3 px-6 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
