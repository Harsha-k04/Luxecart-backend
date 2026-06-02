const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protect = require("../middleware/authMiddleware");

// 🔐 Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// =====================
// REGISTER
// =====================
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// =====================
// LOGIN
// =====================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });

        } else {

            res.status(401).json({
                message: "Invalid credentials",
            });

        }

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// =====================
// GET PROFILE
// =====================
router.get("/me", protect, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);
});

// =====================
// GET WISHLIST
// =====================
router.get("/wishlist", protect, async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("wishlist");

    res.json(user.wishlist);
});

// =====================
// ADD TO WISHLIST
// =====================
router.post("/wishlist/:productId", protect, async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(req.params.productId)) {
        user.wishlist.push(req.params.productId);
        await user.save();
    }

    res.json({
        message: "Added to wishlist",
    });
});

// =====================
// REMOVE FROM WISHLIST
// =====================
router.delete("/wishlist/:productId", protect, async (req, res) => {

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== req.params.productId
    );

    await user.save();

    res.json({
        message: "Removed from wishlist",
    });
});

module.exports = router;