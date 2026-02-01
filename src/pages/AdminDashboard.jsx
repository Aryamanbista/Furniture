import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import {
  ChartBarIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-xl shadow-lg">
          <p className="text-sm font-semibold mb-1">{label}</p>
          <p className="text-sm text-primary">
            {payload[0].name}: {payload[0].name === "Revenue" ? "NPR " : ""}
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

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
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Sales
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                NPR{" "}
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
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
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

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Sales Chart */}
        <div className="bg-background border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ChartBarIcon className="w-6 h-6 text-primary" />
              Sales Trend
            </h2>
            <div className="flex bg-secondary/50 p-1 rounded-xl border border-border">
              <button
                onClick={() => setReportType("monthly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  reportType === "monthly"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setReportType("yearly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  reportType === "yearly"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `NPR ${value}`}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="Revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-background border border-border rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <ArchiveBoxIcon className="w-6 h-6 text-primary" />
            Orders Overview
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  name="Orders"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
