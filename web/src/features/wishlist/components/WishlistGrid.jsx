import { WishlistProductCard } from "./WishlistProductCard";

export const WishlistGrid = ({ items, onRemove, onAddToCart }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
    {items.map((item) => (
      <WishlistProductCard
        key={item.id}
        {...item}
        onRemove={() => onRemove(item.id)}
        onAddToCart={() => onAddToCart(item)}
      />
    ))}
  </div>
);
