const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: String,
  material: String,
  size: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  image: String,
  reviewed: {
    type: Boolean,
    default: false,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => {
        const prefix = 400 + Math.floor(Math.random() * 100);
        const suffix = 1000 + Math.floor(Math.random() * 9000);
        return `${prefix}-${suffix}`;
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    shippingInfo: {
      name: String,
      email: String,
      address: String,
      city: String,
      phone: String,
    },
    estimatedDelivery: String,
    deliveredDate: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
