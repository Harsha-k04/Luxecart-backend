const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/stats", protect, admin, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();

        const orders = await Order.find();

        const totalRevenue = orders.reduce(
            (acc, order) => acc + order.totalPrice,
            0
        );

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;