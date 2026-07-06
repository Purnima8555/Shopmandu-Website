import FlashSaleCard from "../../../components/ui/FlashSaleCard";

export const ProductGrid = ({ products }) => {
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
      {products.map((item, idx) => (
        <FlashSaleCard
          key={`${item.name}-${idx}`}
          name={item.name}
          price={item.price}
          discountPrice={item.discountPrice}
          rating={item.rating}
          images={item.images}
          totalReviews={item.totalReviews}
          flashSales={item.flashSales}
          discountPercent={item.discountPercent}
          tag={item.flashSales ? `-${item.discountPercent}%` : "Active"}
        />
      ))}
    </div>
  );
};