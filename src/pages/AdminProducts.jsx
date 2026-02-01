import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  CubeIcon,
  TagIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const AdminProducts = () => {
  const { user, isAdmin } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "sofas",
    price: "",
    image: "",
    description: "",
    inStock: true,
  });

  if (!isAdmin) return <Navigate to="/" />;

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        description: product.description,
        inStock: product.inStock,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "sofas",
        price: "",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
        description: "",
        inStock: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      rating: editingProduct ? editingProduct.rating : 0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 0,
      images: [formData.image],
      colors: [],
      colorNames: [],
      dimensions: {},
      materials: "",
    };

    if (editingProduct) {
      updateProduct({ ...productData, id: editingProduct.id });
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const categories = [
    {
      value: "sofas",
      label: "Sofas",
      icon: "🛋️",
    },
    {
      value: "chairs",
      label: "Chairs",
      icon: "🪑",
    },
    {
      value: "tables",
      label: "Tables",
      icon: "🪵",
    },
    {
      value: "beds",
      label: "Beds",
      icon: "🛏️",
    },
  ];

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Product Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your furniture inventory with ease
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="group flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm"
        >
          <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Add Product
        </button>
      </div>

      {/* Stats Cards - Minimalist */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-background border border-border p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Total Products</p>
          <p className="text-3xl font-bold text-foreground">
            {products.length}
          </p>
        </div>
        <div className="bg-background border border-border p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">In Stock</p>
          <p className="text-3xl font-bold text-foreground">
            {products.filter((p) => p.inStock).length}
          </p>
        </div>
        <div className="bg-background border border-border p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Out of Stock</p>
          <p className="text-3xl font-bold text-foreground">
            {products.filter((p) => !p.inStock).length}
          </p>
        </div>
        <div className="bg-background border border-border p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Categories</p>
          <p className="text-3xl font-bold text-foreground">
            {new Set(products.map((p) => p.category)).size}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary/30 border-b border-border">
              <tr>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider w-20">
                  Image
                </th>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                  Product
                </th>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                  Category
                </th>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                  Price
                </th>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="py-4 px-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover ring-1 ring-border"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-foreground">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                      {product.description}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground rounded-full text-sm font-medium border border-border">
                      {
                        categories.find((c) => c.value === product.category)
                          ?.icon
                      }{" "}
                      <span className="capitalize">{product.category}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-lg font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {product.inStock ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold border border-green-500/20">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-700 dark:text-red-400 rounded-full text-sm font-semibold border border-red-500/20">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title="Edit product"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                        title="Delete product"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <CubeIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No products yet</p>
                    <button
                      onClick={() => handleOpenModal()}
                      className="mt-3 text-primary font-medium hover:underline"
                    >
                      Add your first product
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Minimalist Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-background rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-secondary/30">
              <h2 className="text-xl font-bold text-foreground">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  {/* Product Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <TagIcon className="w-4 h-4 text-primary" />
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                      <CubeIcon className="w-4 h-4 text-primary" />
                      Category
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, category: cat.value })
                          }
                          className={`relative flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            formData.category === cat.value
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-secondary text-muted-foreground hover:bg-secondary/80 border border-transparent"
                          }`}
                        >
                          <span className="text-lg">{cat.icon}</span>
                          {cat.label}
                          {formData.category === cat.value && (
                            <CheckCircleIcon className="w-4 h-4 ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <CurrencyDollarIcon className="w-4 h-4 text-primary" />
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-lg"
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 block">
                      Availability
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, inStock: true })
                        }
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          formData.inStock
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        }`}
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        In Stock
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, inStock: false })
                        }
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          !formData.inStock
                            ? "bg-destructive/10 text-destructive border border-destructive/20"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        }`}
                      >
                        <XCircleIcon className="w-5 h-5" />
                        Out of Stock
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  {/* Image Preview */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <PhotoIcon className="w-4 h-4 text-primary" />
                      Product Image
                    </label>
                    <div className="relative group">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border-2 border-dashed border-border flex items-center justify-center">
                        {formData.image ? (
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="text-center text-muted-foreground p-4">
                            <PhotoIcon className="w-12 h-12 mx-auto mb-2" />
                            <span className="text-sm">No image preview</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="mt-3 w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <DocumentTextIcon className="w-4 h-4 text-primary" />
                      Description
                    </label>
                    <textarea
                      rows="5"
                      required
                      placeholder="Describe the product..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium shadow-sm transition-all"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
