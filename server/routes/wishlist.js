const express = require("express");
const { auth } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// GET /api/wishlist
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/wishlist/toggle/:productId
router.post("/toggle/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
    }

    await user.save();
    
    // Return the updated populated wishlist
    const populatedUser = await User.findById(req.user._id).populate("wishlist");
    res.json(populatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
