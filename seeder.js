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
            "https://images.unsplash.com/photo-1508057198894-247b23fe5ade"
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
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314"
        ],
        stock: 4,
    },

    // NEW PRODUCTS

    {
        name: "Rolex Datejust 41",
        brand: "Rolex",
        price: 1050000,
        category: "Luxury Watch",
        description: "Classic Rolex elegance with timeless appeal.",
        images: [
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49"
        ],
        stock: 8,
    },
    {
        name: "Rolex Day-Date",
        brand: "Rolex",
        price: 3200000,
        category: "Luxury Watch",
        description: "Known as the President's watch.",
        images: [
            "https://images.unsplash.com/photo-1547996160-81dfa63595aa"
        ],
        stock: 3,
    },
    {
        name: "Omega Speedmaster",
        brand: "Omega",
        price: 650000,
        category: "Luxury Watch",
        description: "The legendary Moonwatch.",
        images: [
            "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a"
        ],
        stock: 10,
    },
    {
        name: "TAG Heuer Formula 1",
        brand: "TAG Heuer",
        price: 220000,
        category: "Luxury Watch",
        description: "Inspired by Formula One racing.",
        images: [
            "https://images.unsplash.com/photo-1609587312208-cea54be969e7"
        ],
        stock: 15,
    },
    {
        name: "Breitling Avenger",
        brand: "Breitling",
        price: 430000,
        category: "Luxury Watch",
        description: "Built for performance and adventure.",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
        ],
        stock: 12,
    },
    {
        name: "Tissot PRX Chronograph",
        brand: "Tissot",
        price: 180000,
        category: "Luxury Watch",
        description: "Modern integrated bracelet sports watch.",
        images: [
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49"
        ],
        stock: 18,
    },
    {
        name: "Seiko Prospex Diver",
        brand: "Seiko",
        price: 90000,
        category: "Luxury Watch",
        description: "Reliable professional dive watch.",
        images: [
            "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56"
        ],
        stock: 25,
    },
    {
        name: "Longines Master Collection",
        brand: "Longines",
        price: 280000,
        category: "Luxury Watch",
        description: "Traditional Swiss craftsmanship.",
        images: [
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3"
        ],
        stock: 9,
    },
    {
        name: "Jaeger-LeCoultre Reverso",
        brand: "Jaeger-LeCoultre",
        price: 1200000,
        category: "Luxury Watch",
        description: "Elegant reversible-case masterpiece.",
        images: [
            "https://images.unsplash.com/photo-1508057198894-247b23fe5ade"
        ],
        stock: 4,
    },
    {
        name: "Montblanc Heritage",
        brand: "Montblanc",
        price: 350000,
        category: "Luxury Watch",
        description: "Vintage-inspired dress watch.",
        images: [
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314"
        ],
        stock: 10,
    },
    {
        name: "Citizen Eco-Drive Classic",
        brand: "Citizen",
        price: 45000,
        category: "Luxury Watch",
        description: "Solar-powered everyday elegance.",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
        ],
        stock: 35,
    },
    {
        name: "Orient Bambino",
        brand: "Orient",
        price: 30000,
        category: "Luxury Watch",
        description: "Affordable automatic dress watch.",
        images: [
            "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56"
        ],
        stock: 40,
    },
    {
        name: "Vacheron Constantin Overseas",
        brand: "Vacheron Constantin",
        price: 4500000,
        category: "Luxury Watch",
        description: "One of the holy trinity luxury sports watches.",
        images: [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d"
        ],
        stock: 2,
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