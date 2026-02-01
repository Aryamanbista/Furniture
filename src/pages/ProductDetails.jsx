import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Minus,
  Plus,
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { getProductById } from "../data/products";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/ui/StarRating";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCheckoutProduct } = useApp();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const data = getProductById(id);
    if (data) setProduct(data);
  }, [id]);

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const handleBuyNow = () => {
    if (!isAuthenticated) return navigate("/login");
    setCheckoutProduct({
      ...product,
      selectedColor: product.colorNames[selectedColor],
      quantity,
    });
    navigate("/checkout");
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Column - Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-secondary overflow-hidden">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-secondary overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  {product.category}
                </span>
                {product.isSale && (
                  <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider">
                    Sale
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold font-display text-primary">
                    NPR {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through decoration-red-500/50">
                      NPR {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-medium text-sm">{product.rating}</span>
                  <span className="text-muted-foreground text-sm decoration-1 underline hover:text-primary cursor-pointer">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="prose prose-sm text-muted-foreground mb-8">
                <p>{product.description}</p>
              </div>

              {/* Color Selection */}
              <div className="mb-8">
                <p className="text-sm font-medium mb-3">
                  Color:{" "}
                  <span className="text-muted-foreground">
                    {product.colorNames[selectedColor]}
                  </span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(idx)}
                      className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${
                        selectedColor === idx
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground"
                      }`}
                    >
                      <div
                        className="w-full h-full rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border border-input w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-primary text-primary-foreground h-10 px-8 font-medium uppercase tracking-wide text-sm hover:bg-primary/90 transition-colors"
                >
                  Buy Now - NPR {(product.price * quantity).toFixed(2)}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-border mb-8">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Free Shipping
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    2 Year Warranty
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RefreshCw className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    30 Day Returns
                  </span>
                </div>
              </div>

              {/* Details Tabs */}
              <div className="border-t border-border pt-6">
                <div className="flex gap-6 border-b border-border mb-4">
                  {["Details", "Dimensions", "Care"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`pb-2 text-sm font-medium transition-all ${
                        activeTab === tab.toLowerCase()
                          ? "border-b-2 border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="py-2 text-sm text-muted-foreground min-h-[100px]">
                  {activeTab === "details" && <p>{product.description}</p>}
                  {activeTab === "dimensions" && (
                    <ul className="space-y-1">
                      {Object.entries(product.dimensions).map(([k, v]) => (
                        <li
                          key={k}
                          className="flex justify-between border-b border-secondary py-1"
                        >
                          <span className="capitalize">{k}</span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTab === "care" && <p>{product.materials}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
