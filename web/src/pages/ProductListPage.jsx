import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSliders, FiX } from "react-icons/fi";
import Button from "../components/ui/Button";

import { SidebarContent } from "../features/product/components/SidebarContent";
import { Pagination } from "../features/product/components/Pagination";
import { TopControlBar } from "../features/product/components/TopControlBar";
import { ProductGrid } from "../features/product/components/ProductGrid";
import useProductStore from "../store/productStore";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useAuthStore from "../store/authStore";
import { dismissToast, showSuccess, showError } from "../utils/toast";

/// Filter logic helper (Optional if server handles filtering, but kept for robust display)
function applyFilters(data, filters) {
  if (!data) return [];
  return data.filter((item) => {
    // Search
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase()))
      return false;
    // Brand
    if (filters.brands.length > 0 && !filters.brands.includes(item.brand))
      return false;
    // Category (mapped to match your JSON: categoryId.name)
    if (filters.categories.length > 0 && !filters.categories.includes(item.categoryId?.name))
      return false;
    // Price
    const itemPrice = parseFloat(item.discountPrice || item.price || 0);
    const min = parseFloat(filters.minPrice);
    const max = parseFloat(filters.maxPrice);
    if (!isNaN(min) && itemPrice < min) return false;
    if (!isNaN(max) && itemPrice > max) return false;
    return true;
  });
}

/// Sort logic helper
function sortData(data, sortBy) {
  const list = [...data];
  if (sortBy === "Price: Low to High") {
    return list.sort((a, b) => (a.discountPrice || 0) - (b.discountPrice || 0));
  }
  if (sortBy === "Price: High to Low") {
    return list.sort((a, b) => (b.discountPrice || 0) - (a.discountPrice || 0));
  }
  return list;
}

const ProductListPage = () => {
  const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low"];
  const DEFAULT_FILTERS = {
    search: "",
    categories: [],
    brands: [],
    minPrice: "",
    maxPrice: "",
  };

  /// get data and actions from zustand store
  const { 
    productPageProducts, 
    productPagePagination, 
    getProductsForPage, 
    loading 
  } = useProductStore();

  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { wishlist, getWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  /// sync logic: trigger api call when filters, sort, or page changes
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: appliedFilters.search,
      brand: appliedFilters.brands.join(","),
      category: appliedFilters.categories.join(","),
      minPrice: appliedFilters.minPrice,
      maxPrice: appliedFilters.maxPrice,
      sort: sortBy === "Price: Low to High" ? "price_asc" : sortBy === "Price: High to Low" ? "price_desc" : "featured"
    };

    console.log(params)

    getProductsForPage(params);
  }, [appliedFilters, sortBy, currentPage, getProductsForPage]);

  /// load the user's wishlist once so heart icons can reflect real state.
  /// Skipped for guests — getWishlist would just 401.
  useEffect(() => {
    if (!isAuthenticated) return;
    getWishlist().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /// Set of product ids currently in the wishlist, for O(1) lookup per card
  const wishlistedIds = useMemo(
    () => new Set((wishlist?.items ?? []).map((item) => item.productId?._id ?? item.productId)),
    [wishlist]
  );

  /// get final items (API returns the slice, but we can apply local logic to ensure safety)
  const filteredProducts = useMemo(
    () => sortData(applyFilters(productPageProducts, appliedFilters), sortBy),
    [productPageProducts, appliedFilters, sortBy]
  );

  /// get pagination info from api response metadata
  const totalPages = productPagePagination?.totalPages || 1;
  const totalResults = productPagePagination?.totalResults || 0;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApply = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1); // reset to page 1 on new search
    setMobileFiltersOpen(false);
  };

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId) => {
    if (!productId) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({ productId, quantity: 1 });
      dismissToast();
      showSuccess("Added to cart.");
    } catch (err) {
      dismissToast();
      if (err?.message?.toLowerCase().includes("select a color") || err?.message?.toLowerCase().includes("select a size")) {
        showError("This product has options to choose — please select them on the product page.");
      } else {
        showError(err?.message || "Failed to add item to cart.");
      }
    }
  };

  const handleToggleWishlist = async (product) => {
    const productId = product._id ?? product.id;
    if (!productId) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const alreadyWishlisted = wishlistedIds.has(productId);

    try {
      if (alreadyWishlisted) {
        await removeFromWishlist(productId);
        dismissToast();
        showSuccess("Removed from wishlist.");
      } else {
        // wishlist.api.js's addToWishlistApi expects { productId, shopId }
        await addToWishlist({ productId, shopId: product.shopId });
        dismissToast();
        showSuccess("Added to wishlist.");
      }
    } catch (err) {
      dismissToast();
      showError(err?.response?.data?.message || err?.message || "Failed to update wishlist.");
    }
  };

  const sidebarProps = {
    filters: draftFilters,
    setFilters: setDraftFilters,
    onApply: handleApply,
    onReset: handleReset,
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Smartphones</h1>
            <p className="text-sm mt-1 text-foreground/60">
              Browse the latest devices ({totalResults} results found)
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setMobileFiltersOpen(true)}
            icon={FiSliders}
            iconPosition="left"
            iconsize={18}
            className="cursor-pointer px-2 lg:hidden"
          >
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
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="relative ml-auto w-[85%] max-w-sm h-full overflow-y-auto p-5 bg-background">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-full bg-surface"
                  >
                    <FiX className="w-5 h-5 text-foreground" />
                  </button>
                </div>
                <SidebarContent {...sidebarProps} />
              </div>
            </div>
          )}

          {/* Product canvas */}
          <div className="flex-1 min-w-0">
            <TopControlBar
              totalResults={totalResults}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOpen={sortOpen}
              setSortOpen={setSortOpen}
            />

            {loading ? (
              <div className="flex justify-center items-center h-64 text-foreground/60">
                Loading products...
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <ProductGrid
                  products={filteredProducts}
                  onAddToCart={handleAddToCart}
                  wishlistedIds={wishlistedIds}
                  onToggleWishlist={handleToggleWishlist}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                />
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-foreground/60">No products found matching your criteria.</p>
                <button onClick={handleReset} className="mt-4 text-primary underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductListPage;