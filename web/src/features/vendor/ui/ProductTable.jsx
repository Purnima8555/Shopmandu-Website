import {
  AlertTriangle,
  Edit,
  EyeIcon,
  PackageSearch,
  Trash2,
  Video,
} from "lucide-react";
import AddProduct from "../components/AddProduct";
import { useState } from "react";
import ProductView from "./ProductView";
import VideoUploadModal from "./VideoUploadMode";

const ProductTable = ({ products }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
            Active
          </span>
        );
      case "INACTIVE":
        return (
          <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-200 text-slate-800">
            Draft
          </span>
        );
      case "OUT_OF_STOCK":
        return (
          <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Out of Stock
          </span>
        );
    }
  };

  /// on edit
  // 1. Add state to track current view and the product being edited
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [viewProduct, setViewProduct] = useState(null);

  const [videoProduct, setVideoProduct] = useState(null);

  const handleCloseView = () => {
    setViewProduct(null);
  };

  // 2. Correct logic for Edit button
  const handleEditClick = (product) => {
    setEditingProduct(product); // Store the product data
    setShowForm(true); // Switch to the Form view
  };

  const handleBack = () => {
    setEditingProduct(null); // Clear editing data
    setShowForm(false); // Go back to table
  };

  // 3. Conditional Rendering: Switch between Table and AddProduct form
  if (showForm) {
    return <AddProduct editingProduct={editingProduct} onBack={handleBack} />;
  }

  return (
    <div className="bg-bg-card rounded-[14px] border  border-border shadow-sm overflow-hidden">
      {products.length > 0 ? (
        <div className="overflow-x-auto animation-fade-in animation-delay-200 ">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-main border-b border-border">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Image
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Product Name
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Category
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Price
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Stock
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Status
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Created
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-3">
                    <img
                      src={p?.images[0]}
                      alt={p?.name}
                      className="w-12 h-12 rounded-[10px] object-cover border border-border"
                    />
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <span
                      className="text-sm font-bold text-[#1F2937] block truncate"
                      title={p?.name}
                    >
                      {p?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#475569] font-medium">
                    {p?.categoryId?.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#1F2937]">
                    RS. {p?.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-xs font-bold ${
                          p.stock === 0
                            ? "text-[#EF4444]"
                            : p.stock <= 5
                              ? "text-amber-600"
                              : "text-[#1F2937]"
                        }`}
                      >
                        {p.stock} units
                      </span>
                      {p.stock <= 5 && p.stock > 0 && (
                        <span className="text-[9px] text-amber-500 font-semibold flex items-center gap-0.5 leading-none">
                          <AlertTriangle className="w-2.5 h-2.5" /> Low Stock
                        </span>
                      )}
                      {p.stock === 0 && (
                        <span className="text-[9px] text-[#EF4444] font-semibold flex items-center gap-0.5 leading-none">
                          <AlertTriangle className="w-2.5 h-2.5" /> Stockout
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {p?.productStatus && getStatusBadge(p?.productStatus)}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#64748B] font-medium">
                    {new Date(p?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end">
                      <button
                        className="p-1 hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1F2937] rounded-lg transition-all"
                        title="Edit Product"
                        onClick={() => handleEditClick(p)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 hover:bg-red-50 text-[#64748B] hover:text-red-600 rounded-lg transition-all"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        className="p-1.5 hover:bg-red-50 text-[#64748B] hover:text-green-600 rounded-lg transition-all"
                        title="View Product"
                        onClick={() => setViewProduct(p)}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>

                      <button
                        className="p-1.5 hover:bg-red-50 text-[#64748B] hover:text-green-600 rounded-lg transition-all"
                        title="Add video"
                        onClick={() => setVideoProduct(p)}
                      >
                        <Video className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mx-auto max-w-md space-y-4 p-12 text-center">
          <PackageSearch className="mx-auto h-16 w-16 text-slate-300" />

          <h3 className="text-lg font-bold text-[#1F2937]">
            No Products Available
          </h3>

          <p className="text-xs leading-relaxed text-[#64748B]">
            Your inventory is currently empty or no products match the selected
            filters. Try adjusting the filters or add a new product to get
            started.
          </p>

          <button className="mt-2 text-xs font-semibold text-primary hover:underline">
            Reset Filters
          </button>
        </div>
      )}

      {viewProduct && (
        <ProductView
          open={!!viewProduct}
          product={viewProduct}
          onClose={handleCloseView}
        />
      )}

      {videoProduct && (
        <VideoUploadModal
          open={!!videoProduct}
          product={videoProduct}
          onClose={() => setVideoProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductTable;
