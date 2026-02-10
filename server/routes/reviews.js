const express = require("express");
const Review = require("../models/Review");
const { auth } = require("../middleware/auth");

const router = express.Router();

// GET /api/reviews/:productId - Get reviews for a product
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: parseInt(req.params.productId),
    }).sort({ date: -1 });

    // Calculate rating breakdown
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      breakdown[review.rating]++;
    });

    const total = reviews.length;
    const percentages = {};
    for (let i = 5; i >= 1; i--) {
      percentages[i] = total > 0 ? Math.round((breakdown[i] / total) * 100) : 0;
    }

    const avgRating =
      total > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
        : "0";

    res.json({
      reviews,
      breakdown,
      percentages,
      total,
      averageRating: parseFloat(avgRating),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews - Submit a review
router.post("/", auth, async (req, res) => {
  try {
    const { productId, rating, title, content } = req.body;

    const review = new Review({
      productId,
      user: req.user._id,
      userName: req.user.name,
      rating,
      title,
      content,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
