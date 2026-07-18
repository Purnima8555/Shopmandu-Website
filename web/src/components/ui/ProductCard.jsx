
import Button from "./Button";
import ButtonRounded from "./ButtonRounded";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import useWishlistStore from "../../store/wishlistStore";
import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";

const ProductCard = ({
  _id,
  name = "Products",
  price = 0,
  discountPrice = 0,
  rating = 1,
  images = [],
  tag = "New",
  totalReviews = 0,
  flashSale = false,
  discountPersent = 0,
  slug = "",
}) => {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAuthStore();

  const isDashboardUser =
    user?.roles?.includes("VENDOR") || user?.roles?.includes("ADMIN");

  //  Wishlist
  const {
 
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

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
      } else {
        await addToWishlist(_id);
      }
    } catch (error) {
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
          className={`absolute left-5 top-6 px-3 py-1 rounded-lg text-sm font-semibold text-white ${
            flashSale ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {flashSale ? `-${discountPersent}%` : tag}
        </span>

        {/* Wishlist */}
        <div className="absolute right-5 top-4">
          <ButtonRounded
            icon={isInWishlist(_id) ? IoIosHeart : IoIosHeartEmpty}
            variant="outline"
            onClick={handleWishlistClick}
            className="bg-white shadow-lg cursor-pointer"
            size="default"
            iconSize={28}
            iconClassName={isInWishlist(_id) ? "text-red-600" : "text-gray-500"}
          />
        </div>

        {/* Cart */}
        <div className="absolute left-1/2 bottom-2 -translate-x-1/2 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="sm"
            variant={isInCart(_id) ? "primary" : "secondary"}
            className="rounded-full cursor-pointer"
            icon={isInCart(_id) ? BsCheckCircleFill : FiShoppingCart}
            iconPosition="left"
            iconsize={14}
            onClick={handleAddToCart}
          >
            {isInCart(_id) ? "In Cart" : "Add To Cart"}
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-md text-foreground line-clamp-2 min-h-[40px]">
          {name}
        </h3>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl font-bold text-primary">
            RS. {discountPrice}
          </span>

          {price > discountPrice && (
            <span className="text-lg text-muted-foreground line-through">
              RS. {price}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-4">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < rating ? "text-yellow-400" : "text-gray-300"}
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
