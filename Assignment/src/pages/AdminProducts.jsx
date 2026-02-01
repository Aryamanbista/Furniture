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
  SparklesIcon,
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
      color: "from-amber-500 to-orange-600",
    },
    {
      value: "chairs",
      label: "Chairs",
      icon: "🪑",
      color: "from-blue-500 to-indigo-600",
    },
    {
      value: "tables",
      label: "Tables",
      icon: "🪵",
      color: "from-emerald-500 to-teal-600",
    },
    {
      value: "beds",
      label: "Beds",
      icon: "🛏️",
      color: "from-purple-500 to-pink-600",
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
          className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
        >
          <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Add Product
        </button>
      </div>

      {/* Stats Cards with Gradients */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 shadow-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <p className="text-sm text-slate-400 mb-1">Total Products</p>
          <p className="text-3xl font-bold text-white">{products.length}</p>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-5 shadow-xl shadow-emerald-500/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <p className="text-sm text-emerald-100 mb-1">In Stock</p>
          <p className="text-3xl font-bold text-white">
            {products.filter((p) => p.inStock).length}
          </p>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-600 to-pink-600 rounded-2xl p-5 shadow-xl shadow-rose-500/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <p className="text-sm text-rose-100 mb-1">Out of Stock</p>
          <p className="text-3xl font-bold text-white">
            {products.filter((p) => !p.inStock).length}
          </p>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-5 shadow-xl shadow-violet-500/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <p className="text-sm text-violet-100 mb-1">Categories</p>
          <p className="text-3xl font-bold text-white">
            {new Set(products.map((p) => p.category)).size}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider w-20">
                  Image
                </th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider">
                  Product
                </th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider">
                  Category
                </th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider">
                  Price
                </th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover shadow-md ring-2 ring-slate-100 dark:ring-slate-700"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">
                      {product.description}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${categories.find((c) => c.value === product.category)?.color || "from-slate-500 to-slate-600"} rounded-full text-sm font-medium text-white shadow-sm`}
                    >
                      {
                        categories.find((c) => c.value === product.category)
                          ?.icon
                      }{" "}
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {product.inStock ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-xl transition-all hover:scale-110"
                        title="Edit product"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-xl transition-all hover:scale-110"
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
                    <CubeIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">
                      No products yet
                    </p>
                    <button
                      onClick={() => handleOpenModal()}
                      className="mt-3 text-violet-600 font-medium hover:underline"
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

      {/* Premium Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Backdrop with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/50 to-slate-900/80 backdrop-blur-md"></div>

          {/* Modal */}
          <div
            className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 p-[1px]">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative">
              {/* Header with Gradient */}
              <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 py-6">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMTBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                <div className="flex justify-between items-start relative">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      {editingProduct ? (
                        <PencilSquareIcon className="w-6 h-6 text-white" />
                      ) : (
                        <SparklesIcon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </h2>
                      <p className="text-sm text-white/80">
                        {editingProduct
                          ? "Update the product details"
                          : "Create a stunning new product"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-5">
                    {/* Product Name */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                        <TagIcon className="w-4 h-4 text-violet-500" />
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
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-medium"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                        <CubeIcon className="w-4 h-4 text-violet-500" />
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
                            className={`relative flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all overflow-hidden ${
                              formData.category === cat.value
                                ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-[1.02]`
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <span className="text-xl">{cat.icon}</span>
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
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                        <CurrencyDollarIcon className="w-4 h-4 text-violet-500" />
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
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
                          className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-bold text-lg"
                        />
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 block">
                        Availability
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, inStock: true })
                          }
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                            formData.inStock
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
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
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                            !formData.inStock
                              ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
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
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                        <PhotoIcon className="w-4 h-4 text-violet-500" />
                        Product Image
                      </label>
                      <div className="relative group">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 shadow-inner">
                          {formData.image ? (
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                              <PhotoIcon className="w-12 h-12 mb-2" />
                              <span className="text-sm font-medium">
                                No image preview
                              </span>
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
                        className="mt-3 w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                        <DocumentTextIcon className="w-4 h-4 text-violet-500" />
                        Description
                      </label>
                      <textarea
                        rows="5"
                        required
                        placeholder="Describe the product features, materials, and other details..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none resize-none transition-all"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5"
                  >
                    {editingProduct ? "💾 Save Changes" : "✨ Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
