const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");


dotenv.config();

// Connect Database
connectDB();

// ✅ Create app FIRST
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/products", productRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const cartRoutes = require("./routes/cartRoutes");

app.use("/api/cart", cartRoutes);

const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);
// Port
const PORT = process.env.PORT || 5000;

const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});