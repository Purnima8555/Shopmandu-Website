import FlashSaleCard from "../../../components/ui/FlashSaleCard";

export const ProductGrid = ({ products, onAddToCart, wishlistedIds, onToggleWishlist }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 rounded-[var(--radius)] border border-border bg-card">
        <p className="text-base font-medium text-foreground">No products match your filters</p>
        <p className="text-sm mt-1 text-foreground/60">Try adjusting or clearing your filters</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((item, idx) => {
        // Only trust discountPrice when there's an actual discount —
        // otherwise it's 0/missing on non-discounted products (see
        // Product.model.js default: 0), and showing "RS. 0" is wrong.
        const effectivePrice =
          item.discountPercent > 0 && item.discountPrice > 0 ? item.discountPrice : item.price;
        const productId = item._id ?? item.id;

        return (
          <FlashSaleCard
            key={`${item.name}-${idx}`}
            id={productId}
            name={item.name}
            price={item.price}
            discountPrice={effectivePrice}
            rating={item.rating}
            images={item.images}
            totalReviews={item.totalReviews}
            flashSales={item.flashSales}
            discountPercent={item.discountPercent}
            tag={item.flashSales ? `-${item.discountPercent}%` : "Active"}
            onAddToCart={onAddToCart}
            isWishlisted={wishlistedIds?.has(productId) ?? false}
            onToggleWishlist={() => onToggleWishlist?.(item)}
          />
        );
      })}
    </div>
  );
};