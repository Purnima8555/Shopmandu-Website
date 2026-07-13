import { TrendingUp, Star } from "lucide-react";

const TopProducts = ({ topProducts }) => {
    return (
        <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#FBBF24]" />
            <h2 className="font-display text-sm font-semibold">Top Products</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {topProducts.map((product, index) => (
            <div
                key={product._id}
                className="relative rounded-lg border border-border bg-card p-4"
            >
                <span className="absolute right-3 top-3 font-mono text-[11px] text-muted-foreground">
                #{index + 1}
                </span>

                <p className="pr-6 text-sm font-medium leading-snug">
                {product.name}
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">
                {product.shopId?.shopName || "-"}
                </p>

                <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1 font-mono text-sm">
                    <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                    {product.rating}
                </span>

                <span className="text-xs text-muted-foreground">
                    {product.brand}
                </span>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default TopProducts;