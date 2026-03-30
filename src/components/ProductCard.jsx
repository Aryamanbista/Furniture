import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import StarRating from "./ui/StarRating";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const {
    _id,
    id,
    name,
    price,
    originalPrice,
    rating,
    image,
    isSale,
    category,
    inStock,
  } = product;
  const productId = _id || id;
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(productId);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    await toggleWishlist(product);
  };

  return (
    <Link to={`/product/${productId}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-none sm:rounded-md mb-4">
        {isSale && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-medium tracking-wider uppercase z-20 shadow-sm text-black">
            Sale
          </span>
        )}
        {!inStock && (
          <span className="absolute top-12 left-3 bg-red-600/90 backdrop-blur-sm px-2 py-1 text-[10px] font-medium tracking-wider uppercase z-20 shadow-sm text-white">
            Out of Stock
          </span>
        )}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md shadow-sm transition-all"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? "fill-red-500 stroke-red-500" : "stroke-zinc-600"
            }`}
          />
        </button>
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        {/* Quick Add Overlay (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
          <button className="w-full py-2.5 bg-white/90 hover:bg-white text-black backdrop-blur-sm text-xs font-semibold uppercase tracking-wide rounded-sm shadow-sm transition-colors">
            Quick View
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          {category}
        </p>
        <h3 className="text-base font-medium text-foreground group-hover:underline decoration-1 underline-offset-4">
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-medium text-primary">
            NPR {price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              NPR {originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="pt-1">
          <StarRating rating={rating} />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
