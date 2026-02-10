const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Review content is required"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    helpful: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Index for efficient product review lookups
reviewSchema.index({ productId: 1 });

module.exports = mongoose.model("Review", reviewSchema);
