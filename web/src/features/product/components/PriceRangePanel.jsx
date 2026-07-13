import Input from "../../../components/ui/Input";

export 
const PriceRangePanel = ({ minPrice, maxPrice, onChange }) => (
  <div className="rounded-[var(--radius)] p-5 mb-5 border border-border bg-card shadow-sm">
    <h3 className="text-sm font-semibold mb-4 tracking-wide uppercase text-foreground">
      Price Range
    </h3>

    <div className="grid grid-cols-2 gap-3">
      {[
        { key: "minPrice", label: "Min Price", placeholder: "0", value: minPrice },
        { key: "maxPrice", label: "Max Price", placeholder: "300000", value: maxPrice },
      ].map((field) => (
        <Input
          key={field.key}
          type="number"
          label={field.label}
          placeholder={field.placeholder}
          value={field.value}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      ))}
    </div>
  </div>
);
