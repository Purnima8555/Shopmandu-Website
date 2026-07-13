import { useState } from "react";

export const CheckboxGroup = ({ title, options, selected, onToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 5;

  // Decide which items to show based on expanded state
  const displayOptions = expanded ? options : options.slice(0, LIMIT);

  if (options.length === 0) return null;

  return (
    <div className="rounded-[var(--radius)] p-5 mb-5 border border-border bg-card shadow-sm">
      <h3 className="text-sm font-semibold mb-4 tracking-wide uppercase text-foreground">
        {title}
      </h3>
      <div className="space-y-1">
        {displayOptions.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <label key={opt} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
              <div
                className={`relative flex items-center justify-center w-4 h-4 rounded border transition-all ${
                  checked ? "bg-primary border-primary" : "border-border bg-transparent group-hover:border-primary/50"
                }`}
              >
                {checked && (
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3.5 8.5l3 3 6-7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm text-foreground transition-opacity ${checked ? "font-medium" : "opacity-70 group-hover:opacity-100"}`}>
                {opt}
              </span>
              <input type="checkbox" checked={checked} onChange={() => onToggle(opt)} className="hidden" />
            </label>
          );
        })}
      </div>

      {options.length > LIMIT && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs font-semibold text-primary hover:underline transition-all uppercase tracking-tight"
        >
          {expanded ? "- Show Less" : `+ View All (${options.length})`}
        </button>
      )}
    </div>
  );
};