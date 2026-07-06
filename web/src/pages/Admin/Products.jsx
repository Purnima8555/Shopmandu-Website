import { useEffect, useMemo, useState } from "react";
import { Search, Star, Eye, Trash2, TrendingUp } from "lucide-react";
import useAdminStore from "../../store/adminStore";

import StatusBadge from "../../components/ui/StatusBadge";
import ProductDrawer from "../Admin/components/ProductDrawer";
import ButtonRounded from "../../components/ui/ButtonRounded";

const STATUS_STYLE = {
  ACTIVE: { tone: "success", label: "Active" },
  INACTIVE: { tone: "neutral", label: "Inactive" },
  OUT_OF_STOCK: { tone: "warning", label: "Out of Stock" },
  DRAFT: { tone: "warning", label: "Draft" },
};

const ProductsPage = () => {
  const {
    products,
    topProducts,
    selectedProduct,
    loading,
    getAllProducts,
    getTopProducts,
    getProductById,
  } = useAdminStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllProducts();
    getTopProducts({ limit: 4 });
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase();

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(keyword) ||
        product.brand?.toLowerCase().includes(keyword) ||
        product.shopId?.shopName?.toLowerCase().includes(keyword)
      );
    });
  }, [products, search]);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Products
        </h1>

        <p className="mt-1 text-muted-foreground">
          Moderate listings across every shop's catalog.
        </p>
      </div>

      {/* Top Products */}

      <div className="rounded-xl border border-border bg-card p-5">

        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#FBBF24]" />

          <h2 className="font-display text-sm font-semibold">
            Top Products
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {topProducts.map((product, index) => (
            <div
              key={product._id}
              className="relative rounded-lg border border-border bg-card p-4"
            >
              <span className="absolute right-3 top-3 font-mono text-[11px] text-muted-foreground">
                #{index + 1}
              </span>

              <p className="pr-6 text-sm font-medium leading-snug">
                {product.name}
              </p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                {product.shopId?.shopName || "-"}
              </p>

              <div className="mt-3 flex items-center justify-between">

                <span className="flex items-center gap-1 font-mono text-sm">
                  <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                  {product.rating}
                </span>

                <span className="text-xs text-muted-foreground">
                  {product.brand}
                </span>

              </div>
            </div>
          ))}

        </div>

      </div>

      {/* Table */}

      <div className="rounded-xl border border-border bg-card">

        {/* Toolbar */}

        <div className="flex items-center justify-end border-b border-border p-4">

          <div className="relative w-full max-w-sm">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />

          </div>

        </div>

        {/* Table Header */}

        <div className="grid grid-cols-[2fr_1.2fr_1fr_0.9fr_0.7fr_0.8fr_0.9fr_auto] gap-2 px-5 py-2.5 text-[11px] uppercase tracking-wide text-muted-foreground">

          <span>Product</span>
          <span>Shop</span>
          <span>Brand</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Rating</span>
          <span>Status</span>
          <span className="text-right">Actions</span>

        </div>

        {/* Rows */}

        {filteredProducts.map((product) => {
                    const status =
            STATUS_STYLE[product.productStatus] || STATUS_STYLE.ACTIVE;

          return (
            <div
              key={product._id}
              className="grid grid-cols-[2fr_1.2fr_1fr_0.9fr_0.7fr_0.8fr_0.9fr_auto] items-center gap-2 border-t border-border px-5 py-3.5 text-sm hover:bg-surface transition"
            >
              {/* Product */}
              <div className="flex items-center gap-3">
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-10 w-10 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-muted" />
                )}

                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {product.name}
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    {product.slug}
                  </p>
                </div>
              </div>

              {/* Shop */}
              <span className="truncate text-muted-foreground">
                {product.shopId?.shopName || "-"}
              </span>

              {/* Brand */}
              <span className="truncate text-muted-foreground">
                {product.brand || "-"}
              </span>

              {/* Price */}
              <span className="font-mono">
                Rs. {Number(product.price).toLocaleString()}
              </span>

              {/* Stock */}
              <span
                className={`font-mono ${
                  product.stock === 0 ? "text-destructive" : ""
                }`}
              >
                {product.stock}
              </span>

              {/* Rating */}
              <span className="flex items-center gap-1 font-mono">
                <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                {product.rating}
              </span>

              {/* Status */}
              <StatusBadge tone={status.tone}>
                {status.label}
              </StatusBadge>

              {/* Actions */}
              <div className="flex justify-end gap-1.5">
                <ButtonRounded
                  variant="ghost"
                  icon={Eye}
                  title="View Details"
                  onClick={() => getProductById(product._id)}
                />

                <ButtonRounded
                  variant="ghost"
                  icon={Trash2}
                  className="text-destructive hover:bg-destructive/10"
                  title="Delete"
                />
              </div>
            </div>
          );
        })}

        {!loading && filteredProducts.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No products found.
          </div>
        )}
      </div>

      {/* Product Drawer */}
      <ProductDrawer
        product={selectedProduct}
        onClose={() =>
          useAdminStore.setState({
            selectedProduct: null,
          })
        }
      />
    </div>
  );
};

export default ProductsPage;