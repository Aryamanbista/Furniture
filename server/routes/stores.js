const express = require("express");
const Store = require("../models/Store");

const router = express.Router();

// GET /api/stores - Get all stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
