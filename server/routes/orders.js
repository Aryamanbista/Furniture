const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { auth } = require("../middleware/auth");

const router = express.Router();

// POST /api/orders - Place a new order
router.post("/", auth, async (req, res) => {
  try {
    const { items, total, shippingInfo } = req.body;

    // Validate stock for each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product with ID ${item.productId} not found` });
      }
      if (!product.inStock) {
        return res
          .status(400)
          .json({ error: `Product "${product.name}" is out of stock` });
      }
    }

    const order = new Order({
      user: req.user._id,
      items,
      total,
      shippingInfo,
      status: "processing",
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders - Get current user's orders
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:id - Get a single order
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/orders/:orderId/review - Mark an item as reviewed
router.put("/:orderId/review/:productId", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const item = order.items.find(
      (item) => item.productId === req.params.productId,
    );
    if (item) {
      item.reviewed = true;
      await order.save();
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
