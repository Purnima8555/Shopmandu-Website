import { ChevronLeft, ChevronRight, Info, RefreshCw, Star } from "lucide-react";
import { useEffect, useState } from "react";



import ButtonRounded from "../../../components/ui/ButtonRounded";
import StatusBadge from "../../../components/ui/StatusBadge";
import ProductDrawer from "../components/ProductDrawer";
import TopProducts from "../components/TopProducts";
import Button from "../../../components/ui/Button";
import Selecter from "../../../components/ui/Selecter";
import SearchInput from "../../../components/ui/SearchInput";
import { filterOptions } from "../../vendor/data";
import { PRODUCT_STATUS_STYLE } from "../data";
import useProductStore from "../../product/store/product.store";
import useCategoryStore from "../../product/store/category.store";



const ProductsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { categories } = useCategoryStore();

  const {
    products,
    pagination,
    topProducts,
    selectedProduct,
    loading,
    getProducts,
    getTopProducts,
    getProductById,
  } = useProductStore();

  useEffect(() => {
    const fetchProducts = async () => {
      await getProducts({
        page: currentPage,
        limit: rowsPerPage,
        search,
        category: categoryFilter,
        productStatus: statusFilter,
        sort: sortBy,
      });
    };

    fetchProducts();
  }, [
    currentPage,
    rowsPerPage,
    getProducts,
    search,
    categoryFilter,
    statusFilter,
    sortBy,
  ]);

  useEffect(() => {
    getTopProducts({ limit: 4 });
  }, [getTopProducts]);

  return (
    <div className="space-y-8 ">
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
        <div className="bg-bg-card p-4 rounded-[14px] border border-border shadow-sm space-y-4">
          {/* Search */}
          <SearchInput
            iconPosition="right"
            placeholder="Search Products..."
            value={searchInput}
            onChange={(e) => {
              const value = e.target.value;
              setSearchInput(value);
              setSearch(value);
              setCurrentPage(1);
            }}
          />

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-7">
              {/* Category filter */}
              <Selecter
                size="sm"
                className="min-w-10 px-0"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All</option>

                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Selecter>

              {/* Status filter */}
              <Selecter
                size="sm"
                className="min-w-10 px-0"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {filterOptions?.statuses?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Selecter>


              {/* Sort */}
              <Selecter
                size="sm"
                className="min-w-10 px-0"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {filterOptions?.sorts?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Selecter>

              {/* Rows per page + page navigation */}
              <div className="col-span-2 flex items-center justify-start gap-3">
                {/* Rows per page */}
                <Selecter
                  size="sm"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Selecter>

                {/* Range display  e.g. "1–10 of 47" */}
                <span className="whitespace-nowrap text-xs font-medium text-text-secondary">
                  {products?.length === 0
                    ? "0 Results"
                    : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                        currentPage * rowsPerPage,
                        pagination.totalResults,
                      )} of ${pagination.totalResults}`}
                </span>

                {/* Refresh */}
                <button
                  onClick={async () => {
                    await getProducts({
                      page: currentPage,
                      limit: rowsPerPage,
                      search,
                      category: categoryFilter,
                      status: statusFilter,
                      sort: sortBy,
                    });
                  }}
                  className="rounded-lg p-2 text-text-secondary transition hover:bg-bg-main hover:text-primary"
                  title="Refresh"
                >
                  <RefreshCw size={16} />
                </button>

                {/* Previous page */}
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={!pagination?.hasPrevPage}
                  className="rounded-lg border border-border p-2 transition hover:bg-bg-main disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page indicator */}
                <span className="whitespace-nowrap text-xs font-medium text-text-secondary">
                  {/* {currentPage} / {totalPages} */}
                  {pagination?.currentPage || 1} of{" "}
                  {pagination?.totalPages || 1}
                </span>

                {/* Next page */}
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!pagination?.hasNextPage}
                  className="rounded-lg border border-border p-2 transition hover:bg-bg-main disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Filter button  kept as a manual "apply now" shortcut,
                though the useEffect already re-fetches automatically. */}
              <Button
                size="sm"
                className="px-0 w-25"
                // icon={Filter}
                iconsize={15}
                iconPosition="left"
                // onClick={fetchProducts}
              >
                Filter
              </Button>
            </div>
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
            {products?.map((product) => {
              const status =
                PRODUCT_STATUS_STYLE[product.productStatus] || PRODUCT_STATUS_STYLE.ACTIVE;

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

            {!loading && products?.length === 0 && (
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
