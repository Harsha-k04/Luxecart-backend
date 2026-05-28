const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/Product");

dotenv.config();
connectDB();

const products = [
    {
        name: "Rolex Submariner",
        brand: "Rolex",
        price: 1200000,
        category: "Luxury Watch",
        description: "Iconic diving watch with timeless design.",
        images: [
            "https://images.unsplash.com/photo-1547996160-81dfa63595aa"
        ],
        stock: 5,
    },
    {
        name: "Omega Seamaster",
        brand: "Omega",
        price: 900000,
        category: "Luxury Watch",
        description: "Precision diver watch with heritage.",
        images: [
            "https://images.unsplash.com/photo-1594534475808-b18fc33b045e"
        ],
        stock: 4,
    },
    {
        name: "Tag Heuer Carrera",
        brand: "Tag Heuer",
        price: 750000,
        category: "Luxury Watch",
        description: "Sporty yet elegant chronograph.",
        images: [
            "https://images.unsplash.com/photo-1609587312208-cea54be969e7"
        ],
        stock: 6,
    },
    {
        name: "Patek Philippe Nautilus",
        brand: "Patek Philippe",
        price: 2500000,
        category: "Luxury Watch",
        description: "Ultra luxury steel sports watch.",
        images: [
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3"
        ],
        stock: 2,
    },
    {
        name: "Audemars Piguet Royal Oak",
        brand: "Audemars Piguet",
        price: 2200000,
        category: "Luxury Watch",
        description: "Legendary octagonal design.",
        images: [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d"
        ],
        stock: 3,
    },
    {
        name: "Cartier Santos",
        brand: "Cartier",
        price: 800000,
        category: "Luxury Watch",
        description: "Elegant square dial classic.",
        images: [
            "https://images.unsplash.com/photo-1508057198894-247b23fe5ade"
        ],
        stock: 4,
    },
];

const importData = async () => {
    try {
        await Product.deleteMany(); // optional reset
        await Product.insertMany(products);

        console.log("Products Imported!");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

importData();