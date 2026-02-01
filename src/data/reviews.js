// Mock reviews data
export const reviews = [
  {
    id: 1,
    productId: 1,
    userId: 1,
    userName: "Sarah J.",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    title: "Absolutely love the color!",
    content:
      "Matches my living room perfectly. The velvet feels very premium and soft to the touch. It was super easy to assemble the legs, took me about 10 minutes. Highly recommend!",
    date: "2026-01-24",
    verified: true,
    helpful: 12,
  },
  {
    id: 2,
    productId: 1,
    userId: 2,
    userName: "Mike T.",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 4,
    title: "Great quality, slow delivery",
    content:
      "Delivery was slightly delayed by about 3 days, but the quality of the sofa itself is top-notch. It's a bit firmer than I expected, but I think it will soften up over time.",
    date: "2026-01-19",
    verified: true,
    helpful: 4,
  },
  {
    id: 3,
    productId: 1,
    userId: 3,
    userName: "Elena R.",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    title: "Perfect for small apartments",
    content:
      "I was worried it might be too big, but the dimensions are spot on. It fits perfectly in my studio. The color is exactly as shown in the pictures.",
    date: "2026-01-05",
    verified: true,
    helpful: 8,
  },
  {
    id: 4,
    productId: 7,
    userId: 1,
    userName: "Sarah J.",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    title: "Beautiful Scandinavian design",
    content:
      "This sofa is stunning! The velvet is so soft and the emerald green color is gorgeous. Assembly was simple and quick. Worth every penny!",
    date: "2026-01-20",
    verified: true,
    helpful: 15,
  },
  {
    id: 5,
    productId: 4,
    userId: 4,
    userName: "James K.",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 5,
    title: "Best leather armchair I've owned",
    content:
      "The leather quality is exceptional. Very comfortable for reading and relaxing. The cognac color is rich and elegant. Great value for the price, especially on sale!",
    date: "2026-01-15",
    verified: true,
    helpful: 22,
  },
];

// Get reviews for a specific product
export const getReviewsByProductId = (productId) => {
  return reviews.filter((r) => r.productId === parseInt(productId));
};

// Calculate rating breakdown for a product
export const getRatingBreakdown = (productId) => {
  const productReviews = getReviewsByProductId(productId);
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  productReviews.forEach((review) => {
    breakdown[review.rating]++;
  });

  const total = productReviews.length;
  const percentages = {};

  for (let i = 5; i >= 1; i--) {
    percentages[i] = total > 0 ? Math.round((breakdown[i] / total) * 100) : 0;
  }

  return { breakdown, percentages, total };
};

// Calculate average rating for a product
export const getAverageRating = (productId) => {
  const productReviews = getReviewsByProductId(productId);
  if (productReviews.length === 0) return 0;

  const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / productReviews.length).toFixed(1);
};
