import { FiRotateCcw, FiSearch } from "react-icons/fi";
import { useMemo } from "react";
import Button from "../../../components/ui/Button";
import { CheckboxGroup } from "./CheckBoxGroup";
import { PriceRangePanel } from "./PriceRangePanel";
import useProductStore from "../store/product.store";
import useCategoryStore from "../store/category.store";


export const SidebarContent = ({ filters, setFilters, onApply, onReset }) => {
  // Pull backend categories and current product list from store
  const { productPageProducts } = useProductStore();
  const {categories} = useCategoryStore()

  /// Map categories from backend object names
  const dynamicCategories = useMemo(() => {
    return (categories || []).map((cat) => cat.name);
  }, [categories]);

  /// Extract brands dynamically from existing products in database results
  /// This prevents "Ghost" brand filters with 0 results
  const dynamicBrands = useMemo(() => {
    const brands = (productPageProducts || []).map((p) => p.brand);
    // Use Set to get unique values and filter out empty brands
    return [...new Set(brands)].filter(Boolean).sort();
  }, [productPageProducts]);

  const toggle = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));

  const setField = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      {/* Modern Search Field */}
      <div className="mb-5 relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
        <input
          type="text"
          placeholder="Search items..."
          value={filters.search}
          onChange={(e) => setField("search", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onApply()} // Quick search on enter
          className="w-full pl-10 pr-3 py-2.5 rounded-[var(--radius)] text-sm outline-none border border-border bg-card text-foreground shadow-sm focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Dynamic Categories  */}
      <CheckboxGroup 
        title="Categories" 
        options={dynamicCategories} 
        selected={filters.categories} 
        onToggle={(v) => toggle("categories", v)} 
      />

      {/* Dynamic Brands */}
      <CheckboxGroup 
        title="Brands" 
        options={dynamicBrands} 
        selected={filters.brands} 
        onToggle={(v) => toggle("brands", v)} 
      />

      {/* Price Panel */}
      <PriceRangePanel 
        minPrice={filters.minPrice} 
        maxPrice={filters.maxPrice} 
        onChange={setField} 
      />

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-4">
        <Button 
          type="button" 
          onClick={onApply} 
          className="w-full py-2.5 flex-1 text-sm font-medium cursor-pointer bg-primary"
        >
          Apply Filters
        </Button>
        <button 
          type="button" 
          onClick={onReset} 
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold opacity-60 hover:opacity-100 transition-opacity"
        >
          <FiRotateCcw /> Reset to default
        </button>
      </div>
    </>
  );
};