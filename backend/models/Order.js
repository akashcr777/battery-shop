const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: String,
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "ready-to-deliver",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  deliveryLocation: {
    latitude: Number,
    longitude: Number,
  },
  /* Driver's current location (Swiggy-like live tracking) */
  currentDeliveryLocation: {
    latitude: Number,
    longitude: Number,
    updatedAt: { type: Date, default: Date.now },
  },
  billingDate: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationFine: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);

