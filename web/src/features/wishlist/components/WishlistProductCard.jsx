import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

export const WishlistProductCard = ({
  name,
  price,
  discountPrice,
  image,
  tag,
  rating,
  totalReviews,
  onRemove,
  onAddToCart,
}) => {
  const hasDiscount = price > discountPrice;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative bg-surface p-3 h-40 sm:h-44">
        <img src={image} alt={name} className="w-full h-full object-cover rounded-lg" />

        {tag && (
          <span
            className={`absolute left-3 top-3 px-2.5 py-1 rounded-md text-xs font-semibold text-white ${
              tag === "NEW" ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {tag}
          </span>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${name} from wishlist`}
            className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-foreground hover:text-red-500 transition cursor-pointer"
          >
            <FiTrash2 size={15} />
          </button>
        )}
      </div>

      {/* Add to cart bar */}
      <button
        type="button"
        onClick={onAddToCart}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-surface text-sm font-medium text-foreground hover:bg-primary-light hover:text-primary transition cursor-pointer"
      >
        <FiShoppingCart size={15} />
        Add To Cart
      </button>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-foreground line-clamp-1">{name}</h3>

        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-base font-bold text-primary">${discountPrice}</span>
          {hasDiscount && <span className="text-sm text-muted-foreground line-through">${price}</span>}
        </div>

        {rating != null && (
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} size={12} className={index < rating ? "text-yellow-400" : "text-gray-300"} />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">({totalReviews})</span>
          </div>
        )}
      </div>
    </div>
  );
};
