import { Search } from "lucide-react";

export default function AdminSearchBar({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
}) {
    return (
        <div className={`relative w-full max-w-xs ${className}`}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
        />
        </div>
    );
}