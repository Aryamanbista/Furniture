const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["sofas", "chairs", "tables", "beds", "lighting", "decor"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: [true, "Main image URL is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    colorNames: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    dimensions: {
      width: String,
      depth: String,
      height: String,
      seatHeight: String,
    },
    materials: {
      type: String,
      default: "",
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Text index for search
productSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
