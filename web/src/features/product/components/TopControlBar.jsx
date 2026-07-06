import { FiChevronDown } from "react-icons/fi";
import Button from "../../../components/ui/Button";
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low"];

export 
const TopControlBar = ({ totalResults, sortBy, setSortBy, sortOpen, setSortOpen }) => (
  <div className="flex items-center justify-between gap-4 mb-6 px-4 py-3 rounded-[var(--radius)] border border-border bg-card shadow-sm">
    <p className="text-sm text-foreground/75">
      Showing <span className="font-semibold opacity-100">{totalResults}</span> products
    </p>

    <div className="relative">
      <Button variant="secondary" onClick={() => setSortOpen((o) => !o)} icon={FiChevronDown} iconPosition="right" iconsize={16} className={`text-sm font-medium px-3.5 py-2 cursor-pointer ${sortOpen ? "[&_svg]:rotate-180" : ""}`}>
        {sortBy}
      </Button>

      {sortOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 rounded-[var(--radius)] border border-border bg-card shadow-md overflow-hidden z-20">
            {SORT_OPTIONS.map((opt) => {
              const active = opt === sortBy;
              return (
                <button key={opt} type="button"onClick={() => { setSortBy(opt); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm ${
                    active ? "bg-primary-light text-primary font-semibold" : "text-foreground font-normal"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  </div>
);