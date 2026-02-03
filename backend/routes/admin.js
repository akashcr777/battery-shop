const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/* =========================
   ADMIN LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await User.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check role
    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   VERIFY ADMIN MIDDLEWARE
========================= */
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    req.adminId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* =========================
   ADMIN ROUTES
========================= */

// Get all users
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ customer: user._id });
        const totalSpent = await Order.aggregate([
          { $match: { customer: user._id } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        return {
          ...user.toObject(),
          orderCount,
          totalSpent: totalSpent[0]?.total || 0,
        };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user purchases
router.get("/users/:userId/purchases", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders
router.get("/orders", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate("items.product")
      .populate("customer", "name email phone createdAt")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard stats
router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalOrders = await Order.countDocuments();

    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusCounts = {
      pending: 0,
      accepted: 0,
      "ready-to-deliver": 0,
      "out-for-delivery": 0,
      delivered: 0,
      cancelled: 0,
    };

    ordersByStatus.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus: statusCounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
