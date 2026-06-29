
export const CheckboxGroup = ({ title, options, selected, onToggle }) => (
  <div className="rounded-[var(--radius)] p-5 mb-5 border border-border bg-card shadow-sm">
    <h3 className="text-sm font-semibold mb-4 tracking-wide uppercase text-foreground">
      {title}
    </h3>
    {options.map((opt) => {
      const checked = selected.includes(opt);
      return (
        <label key={opt} className="flex items-center gap-2.5 py-1.5 cursor-pointer select-none">
          <span
            className={`relative flex items-center justify-center w-4 h-4 rounded border transition-colors ${
              checked ? "bg-primary border-primary" : "border-border bg-transparent"
            }`}
          >
            {checked && (
              <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            )}
          </span>
          <span className={`text-sm text-foreground ${checked ? "" : "opacity-80"}`}>{opt}</span>
          <input type="checkbox" checked={checked} onChange={() => onToggle(opt)} className="hidden" />
        </label>
      );
    })}
  </div>
);

