const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create order
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, deliveryAddress, deliveryLocation } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ 
        message: "User not found. Please login again.",
        code: "USER_NOT_FOUND"
      });
    }

    // Reset cancellation count when new order is placed
    if (user.cancellationCount > 0) {
      user.cancellationCount = 0;
      await user.save();
    }

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;
      return {
        product: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      };
    });

    const order = new Order({
      customer: req.userId,
      customerName: user.name,
      customerPhone: user.phone,
      customerEmail: user.email,
      items: orderItems,
      totalAmount,
      deliveryAddress: deliveryAddress || user.address,
      deliveryLocation: deliveryLocation || user.location,
    });

    await order.save();
    await order.populate("items.product");

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.userId })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update driver's current location (Admin only) - MUST be before GET /:id
router.put("/:id/location", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { latitude, longitude } = req.body;
    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: "latitude and longitude are required" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        currentDeliveryLocation: {
          latitude: Number(latitude),
          longitude: Number(longitude),
          updatedAt: new Date(),
        },
      },
      { new: true }
    )
      .populate("items.product")
      .populate("customer", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns the order or is admin
    const user = await User.findById(req.userId);
    if (order.customer.toString() !== req.userId && user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (Admin only)
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find()
      .populate("items.product")
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel order (User)
router.put("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns the order
    if (order.customer.toString() !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if order can be cancelled (not delivered or already cancelled)
    if (order.status === "delivered") {
      return res.status(400).json({ message: "Cannot cancel delivered order" });
    }
    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check cancellation count and apply fine if needed
    let cancellationFine = 0;
    if (user.cancellationCount >= 2) {
      // Apply fine: 5% of order amount or minimum ₹100
      cancellationFine = Math.max(order.totalAmount * 0.05, 100);
    }

    // Update order
    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationFine = cancellationFine;
    await order.save();

    // Increment cancellation count
    user.cancellationCount = (user.cancellationCount || 0) + 1;
    await user.save();

    res.json({
      order,
      cancellationCount: user.cancellationCount,
      fineApplied: cancellationFine > 0,
      fineAmount: cancellationFine,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (Admin only)
router.put("/:id/status", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;
    const updateData = { status };

    if (status === "accepted") {
      updateData.acceptedAt = new Date();
    } else if (status === "delivered") {
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("items.product")
      .populate("customer", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

