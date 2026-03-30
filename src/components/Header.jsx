import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Sun,
  Moon,
  MapPin,
  LogOut,
  Heart,
  Settings,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border"
          : "bg-background border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/FurniHome.png"
              alt="Logo"
              className="h-9 w-auto object-contain rounded-full"
            />
            <span className="text-2xl font-serif font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              FurniHome.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link
              to="/shop"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              to="/store-locator"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Showrooms
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Toggle (Desktop) */}
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex relative group"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-secondary/50 hover:bg-secondary focus:bg-background border border-transparent focus:border-input rounded-full text-sm w-48 focus:w-64 transition-all outline-none"
              />
            </form>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Wishlist Link - Dominant */}
              <Link
                to="/wishlist"
                className="p-2.5 relative rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Orders/Cart Link - Dominant */}
              <Link
                to="/orders"
                className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                aria-label="Orders"
              >
                <ShoppingBag className="h-5 w-5" />
              </Link>

              {/* User Menu */}
              <div className="relative ml-1">
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 pl-2 pr-4 rounded-full border border-border hover:bg-secondary transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      {user?.name?.charAt(0)}
                    </div>
                    <span className="text-sm font-medium max-w-[80px] truncate hidden lg:block">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}

                <AnimatePresence>
                  {showUserMenu && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background p-2 shadow-xl z-50"
                    >
                      <div className="px-2 py-1.5 text-sm font-semibold border-b border-border mb-1">
                        {user?.name}
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-secondary"
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-secondary"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <div className="h-px bg-border my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-2 py-2 text-sm rounded-md text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="p-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-secondary rounded-lg text-sm outline-none"
                />
              </form>
              <nav className="flex flex-col gap-2">
                <Link
                  to="/shop"
                  className="px-4 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium"
                >
                  Shop
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/wishlist"
                    className="px-4 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" /> Wishlist
                  </Link>
                )}
                <Link
                  to="/about"
                  className="px-4 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium"
                >
                  About
                </Link>
                <Link
                  to="/store-locator"
                  className="px-4 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium"
                >
                  Showrooms
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-4 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium text-primary"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
