const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // ✅ STEP 1: CHECK STOCK FIRST
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${item.product.name}`,
                });
            }
        }

        // ✅ STEP 2: CALCULATE TOTAL
        const totalPrice = cart.items.reduce((acc, item) => {
            return acc + item.product.price * item.quantity;
        }, 0);

        // ✅ STEP 3: REDUCE STOCK
        for (const item of cart.items) {
            item.product.stock -= item.quantity;
            await item.product.save();
        }

        // ✅ STEP 4: CREATE ORDER
        const order = await Order.create({
            user: req.user,
            items: cart.items,
            totalPrice,
        });

        // ✅ STEP 5: CLEAR CART
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📄 Get user orders
router.get("/", protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user }).populate("items.product");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// 📊 ADMIN - GET ALL ORDERS
router.get("/admin", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product");

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
// ADMIN - UPDATE ORDER STATUS
router.put("/admin/:id", protect, admin, async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        order.status = status;

        await order.save();

        res.json(order);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
module.exports = router;