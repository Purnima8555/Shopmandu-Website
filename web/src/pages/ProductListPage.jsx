import { useState, useMemo } from "react";
import {
  FiSliders,
  FiX,
} from "react-icons/fi";
import Button from "../components/ui/Button";
import { productData } from "./Home/data";
import { SidebarContent } from "../features/product/components/SidebarContent";
import { Pagination } from "../features/product/components/Pagination";
import { TopControlBar } from "../features/product/components/TopControlBar";
import { ProductGrid } from "../features/product/components/ProductGrid";



/// filter product base on name, brand and price.
function applyFilters(data, filters) {
  const min = parseFloat(filters.minPrice);
  const max = parseFloat(filters.maxPrice);

  return data.filter((item) => {
    if (filters.brands.length && !filters.brands.includes(item.brand)) return false;
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (!isNaN(min) && item.discountPrice < min) return false;
    if (!isNaN(max) && item.discountPrice > max) return false;
    return true;
  });
}


/// product short by price 
function sortData(data, sortBy) {
  const list = [...data];
  if (sortBy === "Price: Low to High") list.sort((a, b) => a.discountPrice - b.discountPrice);
  if (sortBy === "Price: High to Low") list.sort((a, b) => b.discountPrice - a.discountPrice);
  return list;
}

///  product list 
const ProductListPage = () => {
  const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low"];
const DEFAULT_FILTERS = { search: "", categories: [], brands: [], minPrice: "", maxPrice: "" };
  const { metadata, data } = productData; /// product data.

  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS); // what the sidebar inputs show
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS); // what's actually filtering the grid
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(metadata.currentPage);

  const visibleProducts = useMemo(
    () => sortData(applyFilters(data, appliedFilters), sortBy),
    [data, appliedFilters, sortBy]
  );

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / metadata.limit) || metadata.totalPages);

  const goToPage = (page) => setCurrentPage(Math.min(Math.max(1, page), totalPages));

  const handleApply = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
    setMobileFiltersOpen(false);
  };

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const sidebarProps = { filters: draftFilters, setFilters: setDraftFilters, onApply: handleApply, onReset: handleReset };

  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Smartphones</h1>
            <p className="text-sm mt-1 text-foreground/60">Browse the latest devices and active deals</p>
          </div>
          <Button type="button" variant="secondary" onClick={() => setMobileFiltersOpen(true)} icon={FiSliders} iconPosition="left" iconsize={18} className="cursor-pointer px-2 lg:hidden">
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block lg:w-[300px] lg:flex-shrink-0">
            <SidebarContent {...sidebarProps} />
          </aside>

          {/* Sidebar — mobile drawer */}
          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
              <div className="relative ml-auto w-[85%] max-w-sm h-full overflow-y-auto p-5 bg-background">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                  <button type="button" onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded-full bg-surface" aria-label="Close filters">
                    <FiX className="w-5 h-5 text-foreground" />
                  </button>
                </div>
                <SidebarContent {...sidebarProps} />
              </div>
            </div>
          )}

          {/* Product canvas */}
          <div className="flex-1 min-w-0">
            <TopControlBar totalResults={visibleProducts.length} sortBy={sortBy} setSortBy={setSortBy} sortOpen={sortOpen} setSortOpen={setSortOpen} />
            <ProductGrid products={visibleProducts} />
            <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductListPage;