import { Star } from "lucide-react";

const StarRating = ({ rating, size = "sm", className = "" }) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? "fill-primary text-primary"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
