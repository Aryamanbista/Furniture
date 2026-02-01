import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import {
  ChartBarIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { generateSalesReport, orders } = useApp();
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("monthly");
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    setReportData(generateSalesReport(reportType));
  }, [isAdmin, navigate, generateSalesReport, reportType, orders]);

  if (!isAdmin) return null;

  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-display font-medium text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/admin/products"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            <ArchiveBoxIcon className="w-5 h-5" />
            Manage Products
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-secondary/30 p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Sales
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                $
                {totalSales.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/30 p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl">
              <ArchiveBoxIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Orders
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                {orders.length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Report */}
      <div className="bg-background border border-border rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-primary" />
            Sales Report
          </h2>
          <div className="flex bg-secondary rounded-lg p-1">
            <button
              onClick={() => setReportType("monthly")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                reportType === "monthly"
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setReportType("yearly")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                reportType === "yearly"
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 px-6 font-medium text-muted-foreground">
                  Period
                </th>
                <th className="py-4 px-6 font-medium text-muted-foreground text-right">
                  Orders
                </th>
                <th className="py-4 px-6 font-medium text-muted-foreground text-right">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((row) => (
                  <tr
                    key={row.period}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium">{row.period}</td>
                    <td className="py-4 px-6 text-right">{row.count}</td>
                    <td className="py-4 px-6 text-right font-mono">
                      ${row.sales.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No sales data available for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
