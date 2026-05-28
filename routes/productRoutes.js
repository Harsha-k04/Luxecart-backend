const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");


// 🔹 GET all products (SEARCH + FILTER + SORT)
router.get("/", async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            search,
            sort,
        } = req.query;

        let filter = {};

        // 🔍 SEARCH (name + brand)
        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    brand: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // 📦 CATEGORY FILTER
        if (category && category !== "all") {
            filter.category = category;
        }

        // 💰 PRICE FILTER
        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // ↕ SORTING
        let sortOption = { createdAt: -1 };

        if (sort === "low-high") {
            sortOption = { price: 1 };
        }

        if (sort === "high-low") {
            sortOption = { price: -1 };
        }

        if (sort === "newest") {
            sortOption = { createdAt: -1 };
        }

        const products = await Product.find(filter).sort(sortOption);

        res.json(products);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// 🔹 ADD product
router.post("/", protect, async (req, res) => {
    try {
        const product = new Product(req.body);

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);

    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});


// 🔹 GET single product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json(product);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// 🔥 IMPROVED RECOMMENDATION SYSTEM
router.get("/recommend/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        let recommendations = [];

        // 🔹 1. BEST MATCH
        const similar = await Product.find({
            category: product.category,
            price: {
                $gte: product.price * 0.7,
                $lte: product.price * 1.3,
            },
            _id: {
                $ne: product._id,
            },
        });

        recommendations.push(...similar);

        // 🔹 2. SAME CATEGORY FALLBACK
        if (recommendations.length < 4) {
            const categoryMatch = await Product.find({
                category: product.category,
                _id: {
                    $ne: product._id,
                },
            });

            recommendations.push(...categoryMatch);
        }

        // 🔹 3. RANDOM FALLBACK
        if (recommendations.length < 4) {
            const random = await Product.aggregate([
                {
                    $match: {
                        _id: {
                            $ne: product._id,
                        },
                    },
                },
                {
                    $sample: {
                        size: 6,
                    },
                },
            ]);

            recommendations.push(...random);
        }

        // 🔥 REMOVE DUPLICATES
        const uniqueMap = new Map();

        recommendations.forEach((item) => {
            uniqueMap.set(item._id.toString(), item);
        });

        const uniqueRecommendations = Array.from(uniqueMap.values());

        // 🔥 FINAL LIMIT
        res.json(uniqueRecommendations.slice(0, 4));

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


module.exports = router;