// Mock product data for the furniture store
export const products = [
  {
    id: 1,
    name: "Modern Velvet Sofa",
    category: "sofas",
    price: 899.0,
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
    colorNames: ["Emerald Green", "Charcoal Black", "Navy Blue", "Light Gray"],
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
    id: 2,
    name: "Oak Dining Chair",
    category: "chairs",
    price: 120.0,
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
    id: 3,
    name: "Minimalist Coffee Table",
    category: "tables",
    price: 350.0,
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
    dimensions: {
      width: "120cm",
      depth: "60cm",
      height: "40cm",
    },
    materials: "Solid oak wood with natural oil finish",
    sku: "TABLE-MC-03",
    inStock: true,
    isSale: false,
    freeShipping: true,
  },
  {
    id: 4,
    name: "Leather Armchair",
    category: "chairs",
    price: 450.0,
    originalPrice: 529.0,
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
    id: 5,
    name: "Queen Bed Frame",
    category: "beds",
    price: 600.0,
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
    dimensions: {
      width: "160cm",
      depth: "210cm",
      height: "120cm",
    },
    materials: "Solid pine frame, premium linen upholstery",
    sku: "BED-QF-05",
    inStock: true,
    isSale: false,
    freeShipping: true,
  },
  {
    id: 6,
    name: "Bedside Table",
    category: "tables",
    price: 90.0,
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
    dimensions: {
      width: "45cm",
      depth: "40cm",
      height: "55cm",
    },
    materials: "Solid oak wood",
    sku: "TABLE-BS-06",
    inStock: true,
    isSale: false,
    freeShipping: false,
  },
  {
    id: 7,
    name: "Scandinavian 3-Seater Velvet Sofa",
    category: "sofas",
    price: 1299.0,
    originalPrice: 1599.0,
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
    colorNames: ["Emerald Green", "Charcoal Black", "Navy Blue", "Light Gray"],
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
    id: 8,
    name: "Mid-Century Velvet Sofa",
    category: "sofas",
    price: 1100.0,
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
];

export const categories = [
  { id: "all", name: "All Furniture", count: products.length },
  {
    id: "sofas",
    name: "Sofas",
    count: products.filter((p) => p.category === "sofas").length,
  },
  {
    id: "chairs",
    name: "Chairs",
    count: products.filter((p) => p.category === "chairs").length,
  },
  {
    id: "tables",
    name: "Tables",
    count: products.filter((p) => p.category === "tables").length,
  },
  {
    id: "beds",
    name: "Beds",
    count: products.filter((p) => p.category === "beds").length,
  },
];

export const getProductById = (id) =>
  products.find((p) => p.id === parseInt(id));

export const getProductsByCategory = (category) => {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
};

export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery),
  );
};
