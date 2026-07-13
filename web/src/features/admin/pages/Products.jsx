import { Info, Search, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import useProductStore from "../../../store/productStore";

import ButtonRounded from "../../../components/ui/ButtonRounded";
import StatusBadge from "../../../components/ui/StatusBadge";
import ProductDrawer from "../components/ProductDrawer";
import TopProducts from "../components/TopProducts";

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
    getProducts,
    getTopProducts,
    getProductById,
  } = useProductStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    getProducts();
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
        <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
        <p className="mt-1 text-muted-foreground">
          Moderate listings across every shop's catalog.
        </p>
      </div>

      {/* Top Products Component */}
      <TopProducts topProducts={topProducts} />

      {/* Products Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Search Bar */}
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

        {/* Actual Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Shop
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Rating
              </th>
              <th className="px-6 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => {
              const status =
                STATUS_STYLE[product.productStatus] || STATUS_STYLE.ACTIVE;

              return (
                <tr
                  key={product._id}
                  className="border-t border-border hover:bg-transparent"
                >
                  {/* Product */}
                  <td className="px-5 py-4">
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
                        <p className="truncate font-medium">{product.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Shop */}
                  <td className="px-5 py-4 text-muted-foreground">
                    {product.shopId?.shopName || "-"}
                  </td>

                  {/* Brand */}
                  <td className="px-5 py-4 text-muted-foreground">
                    {product.brand || "-"}
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4">
                    Rs. {Number(product.price).toLocaleString()}
                  </td>

                  {/* Stock */}
                  <td
                    className={`px-5 py-4 text-center ${product.stock === 0 ? "text-destructive" : ""}`}
                  >
                    {product.stock}
                  </td>

                  {/* Rating */}
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 font-mono">
                      <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                      {product.rating}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 text-center">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <ButtonRounded
                      variant="ghost"
                      icon={Info}
                      size="sm"
                      title="View Details"
                      className="cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                      onClick={() => getProductById(product._id)}
                    />
                  </td>
                </tr>
              );
            })}

            {!loading && filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="py-10 text-center text-muted-foreground"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Product Drawer */}
      <ProductDrawer
        product={selectedProduct}
        onClose={() =>
          useProductStore.setState({
            selectedProduct: null,
          })
        }
      />
    </div>
  );
};

export default ProductsPage;
