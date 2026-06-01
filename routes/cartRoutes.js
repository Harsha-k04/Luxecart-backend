const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const protect = require("../middleware/authMiddleware");

// 🛒 Get user cart
router.get("/", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user }).populate("items.product");
        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ➕ Add to cart
router.post("/add", protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: req.user });

        if (!cart) {
            cart = new Cart({ user: req.user, items: [] });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// UPDATE quantity
router.put("/update", protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            (i) => i.product.toString() === productId
        );

        if (item) {
            item.quantity = quantity;
        }

        await cart.save();

        const updatedCart = await Cart.findOne({
            user: req.user,
        }).populate("items.product");

        res.json(updatedCart);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// REMOVE item
router.delete("/remove/:productId", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter(
            (i) =>
                i.product.toString() !== req.params.productId
        );

        await cart.save();

        const updatedCart = await Cart.findOne({
            user: req.user,
        }).populate("items.product");

        res.json(updatedCart);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;