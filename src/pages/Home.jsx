import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useApp } from "../context/AppContext";

const Home = () => {
  const { products } = useApp();

  // Get featured products (e.g., first 4)
  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2727&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-[0.6]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={heroVariants}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight"
          >
            Elevate Your Living.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={heroVariants}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto font-light"
          >
            Discover timeless furniture designed for modern comfort and style.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroVariants}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-white/90 transition-all transform hover:scale-105"
            >
              Shop Collection <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-bold tracking-widest uppercase text-primary mb-2 block">
              Categories
            </span>
            <h2 className="text-4xl font-serif font-bold text-foreground">
              Curated for You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sofas",
                img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&fit=crop",
                link: "/shop?cat=sofas",
              },
              {
                name: "Chairs",
                img: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&fit=crop",
                link: "/shop?cat=chairs",
              },
              {
                name: "Tables",
                img: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&fit=crop",
                link: "/shop?cat=tables",
              },
            ].map((cat, idx) => (
              <Link
                to="/shop"
                key={idx}
                className="group relative h-96 overflow-hidden rounded-2xl"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {cat.name}
                  </h3>
                  <span className="text-white/80 group-hover:text-white flex items-center gap-2 transition-colors">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-sm font-bold tracking-widest uppercase text-primary mb-2 block">
                Best Sellers
              </span>
              <h2 className="text-4xl font-serif font-bold text-foreground">
                Trending Now
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product._id || product.id} className="group">
                <Link to={`/product/${product._id || product.id}`}>
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-4 bg-white">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.isSale && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                        SALE
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-primary font-bold">
                      NPR {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        NPR {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-sm text-yellow-500 ml-auto">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-muted-foreground">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-foreground px-6 py-3 rounded-full text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1000&fit=crop"
                alt="Interior"
                className="rounded-3xl shadow-2xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm font-bold tracking-widest uppercase text-primary mb-2 block">
                Quality First
              </span>
              <h2 className="text-4xl font-serif font-bold text-foreground mb-6">
                Designed to Last a Lifetime
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We believe that furniture should be more than just functional.
                It should be an expression of your personal style and a
                testament to quality craftsmanship. That's why we source only
                the finest materials and work with skilled artisans.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Premium Materials",
                  "Handcrafted Details",
                  "Sustainable Sourcing",
                  "5-Year Warranty",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-foreground font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-4 h-4 stroke-current stroke-2"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/about"
                className="text-primary font-medium hover:underline inline-flex items-center gap-2"
              >
                Read Our Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
