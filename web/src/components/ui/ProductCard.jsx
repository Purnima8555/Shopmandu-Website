import Button from "./Button";
import ButtonRounded from "./ButtonRounded";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import useWishlistStore from "../../features/wishlist/store/wishlist.store";
import useCartStore from "../../features/cart/store/cart.store";
import useAuthStore from "../../features/auth/store/auth.store";
import { dismissToast, showSuccess } from "../../utils/toast";
import Roles from "../../constants/rolebase";

const ProductCard = ({
  _id,
  name = "Products",
  price = 0,
  discountPrice = 0,
  rating = 1,
  images = [],
  tag = "New",
  totalReviews = 0,
  flashSales = false,
  discountPercent = 0,
  slug = "",
}) => {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAuthStore();

  const isDashboardUser = user?.roles?.includes(Roles.VENDOR_ROLE) || user?.roles?.includes(Roles.ADMIN_ROLE);

  //  Wishlist
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();

  //  Cart
  const { addToCart, isInCart } = useCartStore();

  const handleCardClick = (productSlug) => {
    navigate(`/products/${productSlug}`);
  };

  //  Wishlist
  const handleWishlistClick = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isDashboardUser) return;

    try {
      if (isInWishlist(_id)) {
        await removeFromWishlist(_id);

        // dismissToast();
        // showSuccess("Product removed from your wishlist.");
      } else {
        await addToWishlist(_id);

        dismissToast();
        showSuccess("Product added to your wishlist.");
      }
    } catch (error) {
      // dismissToast();
      // showError("Unable to update your wishlist. Please try again.");
      console.error(error);
    }
  };

  //  Cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isDashboardUser) return;
    try {
      if (!isInCart(_id)) {
        await addToCart(_id, 1);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      onClick={() => handleCardClick(slug)}
      className="group bg-card rounded-sm border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative bg-surface p-3 h-72 overflow-hidden">
        <img
          src={images?.[0]}
          alt={name}
          className="w-full h-full rounded-sm object-cover transition duration-300 group-hover:scale-102"
        />

        {/* Badge */}
        <span
          className={`absolute left-3 top-3 rounded-lg px-3 py-1 text-sm font-semibold text-white ${
            flashSales ? "bg-[#B3543E]" : "bg-green-600"
          }`}
        >
          {flashSales ? `−${discountPercent}%` : tag}
        </span>

        {/* Wishlist */}
        <div className="absolute right-3 top-3">
          <ButtonRounded
            icon={isInWishlist(_id) ? IoIosHeart : IoIosHeartEmpty}
            variant="outline"
            onClick={handleWishlistClick}
            className="cursor-pointer bg-white shadow-lg"
            size="default"
            iconSize={22}
            iconClassName={
              isInWishlist(_id) ? "text-[#B3543E]" : "text-muted-foreground"
            }
          />
        </div>

        {/* Cart */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-20 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            variant={isInCart(_id) ? "primary" : "secondary"}
            className="cursor-pointer rounded-full"
            icon={isInCart(_id) ? BsCheckCircleFill : FiShoppingCart}
            iconPosition="left"
            iconsize={14}
            onClick={handleAddToCart}
          >
            {isInCart(_id) ? "In cart" : "Add to cart"}
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-md min-h-10 font-semibold text-foreground line-clamp-2">
          {name}
        </h3>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            Rs. {discountPrice}
          </span>

          {price > discountPrice && (
            <span className="text-lg text-muted-foreground line-through">
              Rs. {price}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={
                index < rating ? "text-[#B7893F]" : "text-muted-foreground/25"
              }
            />
          ))}

          <span className="ml-2 text-sm text-muted-foreground">
            ({totalReviews})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;