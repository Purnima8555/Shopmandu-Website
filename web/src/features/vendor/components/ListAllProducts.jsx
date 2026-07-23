import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Package,
  PackageX,
  PauseCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import SummaryCard from "../ui/SummaryCard";
import Button from "../../../components/ui/Button";
import SearchInput from "../../../components/ui/SearchInput";
import Selecter from "../../../components/ui/Selecter";
import { filterOptions } from "../data";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductTable from "../ui/product/ProductTable";
import useCategoryStore from "../../product/store/category.store";
import useVendorProductManageStore from "../store/vendorManageProduct.store";

//// How long to wait after the user stops typing before firing a request.
const SEARCH_DEBOUNCE_MS = 400;

const ListAllProducts = ({ setCurrentTab }) => {
  const { productsSummary, myProducts, productsMeta, getAllMyProducts } =
    useVendorProductManageStore();

  const { categories } = useCategoryStore();

  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const abortControllerRef = useRef(null);

  const totalProducts = productsMeta?.totalResults ?? 0;
  const totalPages = productsMeta?.totalPages ?? 1;
  const startRow =
    totalProducts === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalProducts);

  //// only commit the search term after the user pauses typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const fetchProducts = useCallback(() => {
    /// Cancel any request still in flight before starting a new one.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    getAllMyProducts({
      page: currentPage,
      limit: rowsPerPage,
      category: categoryFilter,
      status: statusFilter,
      stock: stockFilter,
      sortBy,
      search,
      signal: controller.signal,
    });
  }, [
    currentPage,
    rowsPerPage,
    categoryFilter,
    statusFilter,
    stockFilter,
    sortBy,
    search,
    getAllMyProducts,
  ]);

  useEffect(() => {
    fetchProducts();
    return () => abortControllerRef.current?.abort();
  }, [fetchProducts]);

  const handleFilterChange = useCallback(
    (setter) => (e) => {
      setter(e.target.value);
      setCurrentPage(1);
    },
    [],
  );

  const handleSearchChange = useCallback((value) => {
    // instant local update, no network call yet
    setSearchInput(value);
  }, []);

  const handleRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  return (
    <section>
      <div className="space-y-8 relative">
        {/* ── Header  */}
        <div className="flex animation-fade-in animation-delay-200   flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Manage Products
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Add new products, update inventory, adjust pricing, and keep your
              catalog up to date.
            </p>
          </div>
          <Button
            onClick={() => setCurrentTab("add-product")}
            className="cursor-pointer"
            iconPosition="left"
            icon={Plus}
          >
            Add New Product
          </Button>
        </div>

        {/*  Summary cards  */}
        <div className="grid grid-cols-2 animation-fade-in animation-delay-200  lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Products"
            summary={productsSummary?.totalProducts}
            icon={Package}
            iconBackground="bg-blue-50"
            iconColor="text-blue-600"
            valueColor="text-text-primary"
          />
          <SummaryCard
            title="Active Products"
            summary={productsSummary?.activeProducts}
            icon={BadgeCheck}
            iconBackground="bg-emerald-50"
            iconColor="text-emerald-600"
            valueColor="text-emerald-600"
          />
          <SummaryCard
            title="Inactive Products"
            summary={productsSummary?.inactiveProducts}
            icon={PauseCircle}
            iconBackground="bg-amber-50"
            iconColor="text-amber-600"
            valueColor="text-amber-600"
          />
          <SummaryCard
            title="Out of Stock"
            summary={productsSummary?.outOfStockProducts}
            icon={PackageX}
            iconBackground="bg-red-50"
            iconColor="text-red-600"
            valueColor="text-red-600"
          />
        </div>

        {/*  Filters/ pagination toolbar  */}
        <div className="bg-bg-card p-4 rounded-[14px] border animation-fade-in animation-delay-200  border-border shadow-sm space-y-4">
          {/* Search */}
          <SearchInput
            iconPosition="right"
            placeholder="Search Products..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-7">
              {/* Category filter */}
              <Selecter
                size="sm"
                className="min-w-10 px-0"
                value={categoryFilter}
                onChange={handleFilterChange(setCategoryFilter)}
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
                onChange={handleFilterChange(setStatusFilter)}
              >
                {filterOptions.statuses.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Selecter>

              {/* Stock filter */}
              <Selecter
                size="sm"
                className="min-w-10 px-0"
                value={stockFilter}
                onChange={handleFilterChange(setStockFilter)}
              >
                {filterOptions.stocks.map((o) => (
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
                onChange={handleFilterChange(setSortBy)}
              >
                {filterOptions.sorts.map((o) => (
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
                  onChange={handleRowsPerPageChange}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Selecter>

                {/* Range display  e.g. "1–10 of 47" */}
                <span className="whitespace-nowrap text-xs font-medium text-text-secondary">
                  {startRow}–{endRow} of {totalProducts}
                </span>

                {/* Refresh */}
                <button
                  onClick={fetchProducts}
                  className="rounded-lg p-2 text-text-secondary transition hover:bg-bg-main hover:text-primary"
                  title="Refresh"
                >
                  <RefreshCw size={16} />
                </button>

                {/* Previous page */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!productsMeta?.hasPrevPage && currentPage === 1}
                  className="rounded-lg border border-border p-2 transition hover:bg-bg-main disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page indicator */}
                <span className="whitespace-nowrap text-xs font-medium text-text-secondary">
                  {currentPage} / {totalPages}
                </span>

                {/* Next page */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={
                    !productsMeta?.hasNextPage && currentPage === totalPages
                  }
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
                icon={Filter}
                iconsize={15}
                iconPosition="left"
                onClick={fetchProducts}
              >
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/*  Product table  */}
        <ProductTable products={myProducts} />
      </div>
    </section>
  );
};

export default ListAllProducts;
