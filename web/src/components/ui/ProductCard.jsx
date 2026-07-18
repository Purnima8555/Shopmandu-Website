import { useEffect } from "react";
import Button from "./Button";
import ButtonRounded from "./ButtonRounded";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import useWishlistStore from "../../store/wishlistStore";
import useCartStore from "../../store/cartStore";

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

    // ================= Wishlist =================
    const {
        wishlist,
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
    } = useWishlistStore();

    // ================= Cart =================
    const {
        cart,
        getCart,
        addToCart,
        isInCart,
    } = useCartStore();

    useEffect(() => {
        if (wishlist.length === 0) {
            getWishlist();
        }

        if (cart.items?.length === 0) {
            getCart();
        }
    }, []);

    const handleCardClick = (productSlug) => {
        navigate(`/products/${productSlug}`);
    };

    // ================= Wishlist =================
    const handleWishlistClick = async (e) => {
        e.stopPropagation();

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

    // ================= Cart =================
    const handleAddToCart = async (e) => {
        e.stopPropagation();

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
            className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
        >
            {/* Image */}
            <div className="relative h-72 overflow-hidden bg-surface p-3">
                <img
                    src={images?.[0]}
                    alt={name}
                    className="h-full w-full rounded-xl object-cover transition duration-300 group-hover:scale-105"
                />

                {/* Badge */}
                <span
                    className={`absolute left-3 top-3 rounded-lg px-3 py-1 text-sm font-semibold text-white ${
                        flashSale ? "bg-[#B3543E]" : "bg-green-600"
                    }`}
                >
                    {flashSale ? `−${discountPersent}%` : tag}
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
                            isInWishlist(_id)
                                ? "text-[#B3543E]"
                                : "text-muted-foreground"
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
                <h3 className="text-md min-h-[40px] font-semibold text-foreground line-clamp-2">
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
                                index < rating
                                    ? "text-[#B7893F]"
                                    : "text-muted-foreground/25"
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