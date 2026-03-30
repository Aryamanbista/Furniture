const express = require("express");
const Order = require("../models/Order");
const { auth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/admin/reports - Generate sales reports
router.get("/reports", auth, requireAdmin, async (req, res) => {
  try {
    const { type = "monthly" } = req.query;

    const orders = await Order.find().sort({ date: -1 });

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

    const reportData = Object.values(report).sort((a, b) =>
      b.period.localeCompare(a.period),
    );

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/orders - Get all orders
router.get("/orders", auth, requireAdmin, async (req, res) => {
  try {
    // We can populate 'user' if it's referenced. Let's populate name/email.
    const orders = await Order.find().populate("user", "name email").sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/orders/:id/status - Update order status
router.put("/orders/:id/status", auth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["processing", "shipped", "delivered", "cancelled"];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    
    // Set deliveredDate automatically if it transition to delivered
    if (status === "delivered" && !order.deliveredDate) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      order.deliveredDate = new Date().toLocaleDateString("en-US", options);
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
