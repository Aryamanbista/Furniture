import { Star } from "lucide-react";
import { motion } from "framer-motion";

const StarRating = ({ 
  rating, 
  size = "sm", 
  className = "", 
  interactive = false, 
  onChange 
}) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
    "2xl": "w-8 h-8",
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={!interactive}
          whileHover={interactive ? { scale: 1.1 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          onClick={() => interactive && onChange && onChange(star)}
          className={`transition-colors duration-200 ${interactive ? "cursor-pointer" : "cursor-default"}`}
        >
          <Star
            className={`${sizeClasses[size] || sizeClasses.sm} ${
              star <= rating
                ? "fill-primary text-primary"
                : "text-muted-foreground/30 fill-muted/20"
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default StarRating;
