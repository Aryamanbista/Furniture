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

module.exports = router;
