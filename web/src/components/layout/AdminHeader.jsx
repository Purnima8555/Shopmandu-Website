
import { Search, Bell, ChevronDown } from "lucide-react";

const AdminHeader = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-[var(--glass-bg)] backdrop-blur-md shadow-xs">
            <div className="px-8 h-16 flex items-center justify-between">
                {/* Search */}
                <div className="relative w-full max-w-md mx-8">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search vendors, orders, products..."
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all"
                    />
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 pl-4 border-l border-border">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                            AR
                            </div>
                            <div className="hidden sm:block text-sm">
                                <p className="font-medium leading-tight">Amara Reyes</p>
                                <p className="text-xs text-muted-foreground">Platform admin</p>
                            </div>
                        <ChevronDown size={16} className="text-muted-foreground" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;