import { createContext, useContext, useState, useEffect } from "react";
import { wishlistAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistAPI.get();
      setWishlist(data);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) return false;
    
    try {
      const productId = product._id || product.id;
      const updatedWishlist = await wishlistAPI.toggle(productId);
      setWishlist(updatedWishlist);
      return true;
    } catch (err) {
      console.error("Failed to toggle wishlist item:", err);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item.id) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
