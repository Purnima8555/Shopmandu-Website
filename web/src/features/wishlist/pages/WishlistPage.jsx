import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useWishlistStore from "../store/wishlist.store";
import sendApiRequest from "../../../utils/sendApiRequest";
import { EmptyWishlist } from "../components/EmptyWishlist";
import Button from "../../../components/ui/Button";
import { WishlistGrid } from "../components/WishlistGrid";

const WishlistPage = () => {
  const navigate = useNavigate();

  const {
    wishlist,
    loading,
    getWishlist,
    removeFromWishlist,
    moveWishlistToCart,
  } = useWishlistStore();

  useEffect(() => {
    getWishlist();
  }, [getWishlist]);

  const displayItems = wishlist.map((item) => {
    const product = item.productId;

    return {
      id: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      discountPrice:
        product.discountPercent > 0 ? product.discountPrice : product.price,
      tag: product.discountPercent > 0 ? `-${product.discountPercent}%` : null,
      image: product.images?.[0],
      rating: product.rating,
      totalReviews: product.totalReviews,
    };
  });

  // Remove ONE item
  const removeItem = async (productId) => {
    await sendApiRequest(() => removeFromWishlist(productId));
  };

  // Move one item
  const handleAddToCart = async (item) => {
    await sendApiRequest(() => moveWishlistToCart(item.id));
  };

  // Move all items
  const handleMoveAllToCart = async () => {
    for (const item of wishlist) {
      const success = await sendApiRequest(() =>
        moveWishlistToCart(item.productId._id),
      );

      if (!success) return;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-muted-foreground">Loading your wishlist...</p>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return <EmptyWishlist onBrowse={() => navigate("/products")} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-xs bg-primary" />
            <h1 className="text-lg font-semibold text-foreground">Wishlist</h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handleMoveAllToCart}
          >
            Move All To Cart
          </Button>
        </div>

        <WishlistGrid
          items={displayItems}
          onRemove={removeItem}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default WishlistPage;
