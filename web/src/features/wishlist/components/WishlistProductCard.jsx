import { FiTrash2, FiShoppingCart, FiCheck } from "react-icons/fi";
import { FaStar } from "react-icons/fa";


import { useNavigate } from "react-router-dom";
import useCartStore from "../../cart/store/cart.store";

const TAG_STYLES = {
    NEW: "bg-primary",
    DEFAULT: "bg-[#B3543E]",
};

export const WishlistProductCard = ({
    id,
    slug,
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
    // const discountPercent = hasDiscount
    //     ? Math.round(((price - discountPrice) / price) * 100)
    //     : 0;

    const { isInCart } = useCartStore();
    const inCart = isInCart(id);

    const handleAddToCart = async (e) => {
      e.stopPropagation();

      try {
          if (inCart) return;

          if (onAddToCart) {
              await onAddToCart();
          }
      } catch (error) {
          console.error(error);
      }
  };
  
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${slug}`);
  };

    return (
        <div
          onClick={handleCardClick}
          className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
      >
            {/* Image */}
            <div className="relative h-40 bg-surface p-3 sm:h-44">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full rounded-xl object-cover"
                />

                {tag && (
                    <span
                        className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold text-white ${
                            TAG_STYLES[tag] || TAG_STYLES.DEFAULT
                        }`}
                    >
                        {tag}
                    </span>
                )}

                {onRemove && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        aria-label={`Remove ${name} from wishlist`}
                        className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-foreground shadow transition hover:text-[#B3543E]"
                    >
                        <FiTrash2 size={15} />
                    </button>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 p-4">
                <h3 className="line-clamp-1 text-sm font-medium text-foreground">
                    {name}
                </h3>

                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-primary">
                        Rs. {discountPrice}
                    </span>

                    {hasDiscount && (
                        <>
                            <span className="text-sm text-muted-foreground line-through">
                                Rs. {price}
                            </span>
                        </>
                    )}
                </div>

                {rating != null && (
                    <div className="mt-2 flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                size={12}
                                className={
                                    index < rating
                                        ? "text-[#B7893F]"
                                        : "text-muted-foreground/25"
                                }
                            />
                        ))}

                        <span className="ml-1 text-xs text-muted-foreground">
                            ({totalReviews})
                        </span>
                    </div>
                )}
            </div>

            {/* Add to cart */}
            <button
                type="button"
                disabled={inCart}
                onClick={handleAddToCart}
                className={`flex w-full items-center justify-center gap-2 py-2.5 text-sm font-medium transition
          ${
              inCart
                  ? "cursor-default bg-primary text-white"
                  : "cursor-pointer bg-surface text-foreground hover:bg-primary-light hover:text-primary"
          }`}
            >
                {inCart ? (
                    <>
                        <FiCheck size={15} />
                        In cart
                    </>
                ) : (
                    <>
                        <FiShoppingCart size={15} />
                        Add to cart
                    </>
                )}
            </button>
        </div>
    );
};