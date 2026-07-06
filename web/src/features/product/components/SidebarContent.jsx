import { FiRotateCcw, FiSearch } from "react-icons/fi";
import Button from "../../../components/ui/Button";
import { CheckboxGroup } from "./CheckBoxGroup";
import { PriceRangePanel } from "./PriceRangePanel";

const CATEGORIES = ["Smartphones", "Laptops", "Tablets", "Audio", "Wearables"];
const BRANDS = ["Apple", "Samsung", "Sony", "Google"];



export const SidebarContent = ({ filters, setFilters, onApply, onReset }) => {
  const toggle = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  const setField = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <div className="mb-5 relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setField("search", e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 rounded-[var(--radius)] text-sm outline-none border border-border bg-card text-foreground shadow-sm focus:ring-2"
        />
      </div>

      <CheckboxGroup title="Categories" options={CATEGORIES} selected={filters.categories} onToggle={(v) => toggle("categories", v)} />
      <CheckboxGroup title="Brands" options={BRANDS} selected={filters.brands} onToggle={(v) => toggle("brands", v)} />
      <PriceRangePanel minPrice={filters.minPrice} maxPrice={filters.maxPrice} onChange={setField} />

      <div className="flex items-center gap-3 mt-2">
        <Button type="button" onClick={onApply} className="px-6 py-1.5 flex-1 text-sm font-normal cursor-pointer bg-primary">
          Filter
        </Button>
        <Button type="button" variant="secondary" onClick={onReset} icon={FiRotateCcw} iconPosition="left" iconsize={18} className="px-6 py-1.5 text-sm font-semibold cursor-pointer">
          Reset
        </Button>
      </div>
    </>
  );
};
