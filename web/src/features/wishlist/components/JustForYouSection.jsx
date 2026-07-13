import Button from "../../../components/ui/Button";
import { WishlistProductCard } from "./WishlistProductCard";

export const JustForYouSection = ({ items, onAddToCart }) => (
  <section className="mt-14">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-xs bg-primary" />
        <h2 className="text-lg font-semibold text-foreground">Just For You</h2>
      </div>

      <Button variant="outline" size="sm" className="cursor-pointer">
        See All
      </Button>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((item) => (
        <WishlistProductCard key={item.id} {...item} onAddToCart={() => onAddToCart(item)} />
      ))}
    </div>
  </section>
);
