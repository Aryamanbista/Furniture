const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Review = require("./models/Review");
const Store = require("./models/Store");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Store.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // --- Seed Admin User ---
    const admin = await User.create({
      name: "Administrator",
      email: "admin@furnihome.com",
      password: "admin123",
      role: "admin",
      memberSince: "2023",
    });
    console.log("👤 Admin user created");

    // --- Seed Demo User ---
    const demoUser = await User.create({
      name: "Jane Doe",
      email: "demo@furnihome.com",
      password: "demo123",
      role: "customer",
      memberSince: "2021",
    });
    console.log("👤 Demo user created");

    // --- Seed Products ---
    const products = await Product.insertMany([
      {
        name: "Modern Velvet Sofa",
        category: "sofas",
        price: 121500,
        originalPrice: null,
        rating: 4.8,
        reviewCount: 124,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=600&fit=crop",
        ],
        colors: ["#2d5a4a", "#1a1a2e", "#1e3a5f", "#d4d4d4"],
        colorNames: [
          "Emerald Green",
          "Charcoal Black",
          "Navy Blue",
          "Light Gray",
        ],
        description:
          "Experience ultimate comfort with our plush velvet finish. Designed with ergonomic support and a timeless aesthetic, this sofa brings a touch of modern elegance to any living space.",
        dimensions: {
          width: "210cm",
          depth: "90cm",
          height: "85cm",
          seatHeight: "45cm",
        },
        materials:
          "Premium velvet upholstery, solid oak legs, high-density foam cushions",
        sku: "SOFA-MV-01",
        inStock: true,
        isSale: false,
        freeShipping: true,
      },
      {
        name: "Oak Dining Chair",
        category: "chairs",
        price: 16200,
        originalPrice: null,
        rating: 4.5,
        reviewCount: 86,
        image:
          "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop",
        ],
        colors: ["#d4a574", "#2d2d2d"],
        colorNames: ["Natural Oak", "Dark Walnut"],
        description:
          "Classic oak dining chair with comfortable curved backrest. Perfect for any dining room setup.",
        dimensions: {
          width: "45cm",
          depth: "50cm",
          height: "85cm",
          seatHeight: "45cm",
        },
        materials: "Solid oak wood, natural finish",
        sku: "CHAIR-OD-02",
        inStock: true,
        isSale: false,
        freeShipping: false,
      },
      {
        name: "Minimalist Coffee Table",
        category: "tables",
        price: 47250,
        originalPrice: null,
        rating: 5.0,
        reviewCount: 42,
        image:
          "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=300&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
        ],
        colors: ["#d4a574"],
        colorNames: ["Natural Oak"],
        description:
          "Sleek minimalist coffee table with clean lines. The perfect centerpiece for any modern living room.",
        dimensions: { width: "120cm", depth: "60cm", height: "40cm" },
        materials: "Solid oak wood with natural oil finish",
        sku: "TABLE-MC-03",
        inStock: true,
        isSale: false,
        freeShipping: true,
      },
      {
        name: "Leather Armchair",
        category: "chairs",
        price: 60750,
        originalPrice: 71500,
        rating: 4.7,
        reviewCount: 210,
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        ],
        colors: ["#8B4513", "#2d2d2d", "#d4a574"],
        colorNames: ["Cognac Brown", "Black Leather", "Tan"],
        description:
          "Luxurious leather armchair with premium full-grain leather. Exceptionally comfortable with excellent back support.",
        dimensions: {
          width: "80cm",
          depth: "85cm",
          height: "90cm",
          seatHeight: "42cm",
        },
        materials: "Full-grain leather, solid wood frame, high-resilience foam",
        sku: "CHAIR-LA-04",
        inStock: true,
        isSale: true,
        freeShipping: true,
      },
      {
        name: "Queen Bed Frame",
        category: "beds",
        price: 81000,
        originalPrice: null,
        rating: 4.6,
        reviewCount: 98,
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
        ],
        colors: ["#f5f5dc", "#2d2d2d"],
        colorNames: ["Natural Linen", "Charcoal"],
        description:
          "Elegant queen-size bed frame with upholstered headboard. Designed for peaceful sleep and stylish bedrooms.",
        dimensions: { width: "160cm", depth: "210cm", height: "120cm" },
        materials: "Solid pine frame, premium linen upholstery",
        sku: "BED-QF-05",
        inStock: true,
        isSale: false,
        freeShipping: true,
      },
      {
        name: "Bedside Table",
        category: "tables",
        price: 12150,
        originalPrice: null,
        rating: 4.4,
        reviewCount: 55,
        image:
          "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=400&h=300&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&h=600&fit=crop",
        ],
        colors: ["#d4a574", "#f5f5dc"],
        colorNames: ["Oak", "White Oak"],
        description:
          "Compact bedside table with drawer storage. Perfect companion for any bedroom setup.",
        dimensions: { width: "45cm", depth: "40cm", height: "55cm" },
        materials: "Solid oak wood",
        sku: "TABLE-BS-06",
        inStock: true,
        isSale: false,
        freeShipping: false,
      },
      {
        name: "Scandinavian 3-Seater Velvet Sofa",
        category: "sofas",
        price: 175500,
        originalPrice: 216000,
        rating: 4.5,
        reviewCount: 128,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=600&fit=crop",
        ],
        colors: ["#2d5a4a", "#1a1a2e", "#1e3a5f", "#d4d4d4"],
        colorNames: [
          "Emerald Green",
          "Charcoal Black",
          "Navy Blue",
          "Light Gray",
        ],
        description:
          "Experience ultimate comfort with our plush velvet finish. Designed with ergonomic support and a timeless aesthetic, this sofa brings a touch of modern elegance to any living space.",
        dimensions: {
          width: "210cm",
          depth: "90cm",
          height: "85cm",
          seatHeight: "45cm",
        },
        materials:
          "Premium velvet upholstery, solid oak legs, high-density foam cushions",
        sku: "SCAND-3S-V01",
        inStock: true,
        isSale: true,
        freeShipping: true,
      },
      {
        name: "Mid-Century Velvet Sofa",
        category: "sofas",
        price: 148500,
        originalPrice: null,
        rating: 4.9,
        reviewCount: 76,
        image:
          "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=300&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=600&fit=crop",
        ],
        colors: ["#1e3a5f", "#8B4513"],
        colorNames: ["Navy Blue", "Rust Orange"],
        description:
          "Classic mid-century design meets modern comfort. This velvet sofa features clean lines and superior craftsmanship.",
        dimensions: {
          width: "200cm",
          depth: "85cm",
          height: "80cm",
          seatHeight: "43cm",
        },
        materials: "Premium velvet, solid walnut legs, pocket spring cushions",
        sku: "SOFA-MC-08",
        inStock: true,
        isSale: false,
        freeShipping: true,
      },
    ]);
    console.log(`🪑 ${products.length} products seeded`);

    // --- Seed Reviews ---
    const reviews = await Review.insertMany([
      {
        productId: 1,
        user: demoUser._id,
        userName: "Sarah J.",
        rating: 5,
        title: "Absolutely love the color!",
        content:
          "Matches my living room perfectly. The velvet feels very premium and soft to the touch. It was super easy to assemble the legs, took me about 10 minutes. Highly recommend!",
        date: new Date("2026-01-24"),
        verified: true,
        helpful: 12,
      },
      {
        productId: 1,
        user: demoUser._id,
        userName: "Mike T.",
        rating: 4,
        title: "Great quality, slow delivery",
        content:
          "Delivery was slightly delayed by about 3 days, but the quality of the sofa itself is top-notch. It's a bit firmer than I expected, but I think it will soften up over time.",
        date: new Date("2026-01-19"),
        verified: true,
        helpful: 4,
      },
      {
        productId: 1,
        user: demoUser._id,
        userName: "Elena R.",
        rating: 5,
        title: "Perfect for small apartments",
        content:
          "I was worried it might be too big, but the dimensions are spot on. It fits perfectly in my studio. The color is exactly as shown in the pictures.",
        date: new Date("2026-01-05"),
        verified: true,
        helpful: 8,
      },
      {
        productId: 7,
        user: demoUser._id,
        userName: "Sarah J.",
        rating: 5,
        title: "Beautiful Scandinavian design",
        content:
          "This sofa is stunning! The velvet is so soft and the emerald green color is gorgeous. Assembly was simple and quick. Worth every penny!",
        date: new Date("2026-01-20"),
        verified: true,
        helpful: 15,
      },
      {
        productId: 4,
        user: demoUser._id,
        userName: "James K.",
        rating: 5,
        title: "Best leather armchair I've owned",
        content:
          "The leather quality is exceptional. Very comfortable for reading and relaxing. The cognac color is rich and elegant. Great value for the price, especially on sale!",
        date: new Date("2026-01-15"),
        verified: true,
        helpful: 22,
      },
    ]);
    console.log(`⭐ ${reviews.length} reviews seeded`);

    // --- Seed Stores ---
    const stores = await Store.insertMany([
      {
        name: "Durbar Marg Premium",
        address: "Kings Way, Durbar Marg",
        city: "Kathmandu",
        state: "Bagmati",
        zip: "44600",
        phone: "+977 1-4220000",
        lat: 27.712,
        lng: 85.3155,
        hours: {
          monday: "10:00 AM - 8:00 PM",
          tuesday: "10:00 AM - 8:00 PM",
          wednesday: "10:00 AM - 8:00 PM",
          thursday: "10:00 AM - 8:00 PM",
          friday: "10:00 AM - 9:00 PM",
          saturday: "10:00 AM - 8:00 PM",
          sunday: "11:00 AM - 7:00 PM",
        },
        features: [
          "Wheelchair Accessible",
          "Valet Parking",
          "Design Consultation",
        ],
        isOpen: true,
        closesAt: "8:00 PM",
      },
      {
        name: "Jhamsikhel Design Studio",
        address: "Jhamsikhel Road, Lalitpur",
        city: "Lalitpur",
        state: "Bagmati",
        zip: "44700",
        phone: "+977 1-5520000",
        lat: 27.674,
        lng: 85.3055,
        hours: {
          monday: "10:00 AM - 7:00 PM",
          tuesday: "10:00 AM - 7:00 PM",
          wednesday: "10:00 AM - 7:00 PM",
          thursday: "10:00 AM - 7:00 PM",
          friday: "10:00 AM - 7:00 PM",
          saturday: "Closed",
          sunday: "10:00 AM - 5:00 PM",
        },
        features: ["Wheelchair Accessible", "Design Consultation"],
        isOpen: true,
        closesAt: "7:00 PM",
      },
      {
        name: "Lazimpat Modern",
        address: "Lazimpat, Embassy Road",
        city: "Kathmandu",
        state: "Bagmati",
        zip: "44600",
        phone: "+977 1-4410000",
        lat: 27.725,
        lng: 85.321,
        hours: {
          monday: "09:00 AM - 8:00 PM",
          tuesday: "09:00 AM - 8:00 PM",
          wednesday: "09:00 AM - 8:00 PM",
          thursday: "09:00 AM - 8:00 PM",
          friday: "09:00 AM - 8:00 PM",
          saturday: "10:00 AM - 6:00 PM",
          sunday: "10:00 AM - 6:00 PM",
        },
        features: ["Free Parking", "Wheelchair Accessible"],
        isOpen: true,
        closesAt: "8:00 PM",
      },
      {
        name: "New Baneshwor Gallery",
        address: "Baneshwor Heights",
        city: "Kathmandu",
        state: "Bagmati",
        zip: "44600",
        phone: "+977 1-4780000",
        lat: 27.6915,
        lng: 85.34,
        hours: {
          monday: "10:00 AM - 8:00 PM",
          tuesday: "10:00 AM - 8:00 PM",
          wednesday: "10:00 AM - 8:00 PM",
          thursday: "10:00 AM - 8:00 PM",
          friday: "10:00 AM - 8:00 PM",
          saturday: "10:00 AM - 8:00 PM",
          sunday: "10:00 AM - 8:00 PM",
        },
        features: [
          "Wheelchair Accessible",
          "Design Consultation",
          "Delivery Service",
        ],
        isOpen: true,
        closesAt: "8:00 PM",
      },
      {
        name: "Bhatbhateni Collection",
        address: "Bhatbhateni, Naxal",
        city: "Kathmandu",
        state: "Bagmati",
        zip: "44600",
        phone: "+977 1-4430000",
        lat: 27.72,
        lng: 85.335,
        hours: {
          monday: "09:30 AM - 8:30 PM",
          tuesday: "09:30 AM - 8:30 PM",
          wednesday: "09:30 AM - 8:30 PM",
          thursday: "09:30 AM - 8:30 PM",
          friday: "09:30 AM - 8:30 PM",
          saturday: "09:30 AM - 8:30 PM",
          sunday: "09:30 AM - 8:30 PM",
        },
        features: ["Wheelchair Accessible", "Free Parking", "Delivery Service"],
        isOpen: true,
        closesAt: "8:30 PM",
      },
    ]);
    console.log(`🏪 ${stores.length} stores seeded`);

    console.log("\n✅ Database seeded successfully!");
    console.log("   Admin login: admin@furnihome.com / admin123");
    console.log("   Demo login:  demo@furnihome.com / demo123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();
