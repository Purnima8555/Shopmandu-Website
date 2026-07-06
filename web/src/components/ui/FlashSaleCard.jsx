import Button from "./Button";
import ButtonRounded from "./ButtonRounded";
import { IoIosHeartEmpty } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

const FlashSaleCard = ({name = "Products",price = 0,discountPrice = 0,rating = 1,images,tag = "New",totalReviews = 0,flashSales = false,discountPercent = 0,}) => {

  return (
    <div className="group bg-card rounded-sm border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* image */}
      <div className="relative bg-surface p-3 h-72 overflow-hidden">
        <img src={images[0]} alt={name} className="w-full h-full rounded-sm object-cover transition duration-300 group-hover:scale-102"/>

        {/* badge */}
        <span
          className={`absolute left-5 top-6 px-3 py-1 rounded-lg text-sm font-semibold text-white ${
            flashSales ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {flashSales ? `-${discountPercent}%` : tag}
        </span>

        {/* Wishlist */}
        <div className="absolute right-5 top-4">
          <ButtonRounded icon={IoIosHeartEmpty} variant="outline" className="bg-white shadow-lg cursor-pointer" />
        </div>

        {/* Add to cart */}
        <div className="absolute left-1/2 bottom-2 -translate-x-1/2 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button size="sm" variant="secondary" className="rounded-full cursor-pointer" icon={FiShoppingCart} iconPosition="left" iconsize={13}>
            {/* <FiShoppingCart /> */}
            Add To Cart
          </Button>
        </div>
      </div>

      {/* info */}
      <div className="p-4">
        <h3 className="font-semibold text-md text-foreground line-clamp-2 min-h-[40px]">{name}</h3>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl font-bold text-primary">
            RS. {discountPrice}
          </span>

          {price > discountPrice && discountPercent !== 0 && (
            <span className="text-lg text-muted-foreground line-through">
              RS. {price}
            </span>
          )}
        </div>

        {/* rating */}
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

export default FlashSaleCard;
