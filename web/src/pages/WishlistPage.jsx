import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { WishlistGrid } from "../features/wishlist/components/WishlistGrid";
import { EmptyWishlist } from "../features/wishlist/components/EmptyWishlist";
import {
  getWishlistApi,
  removeFromWishlistApi,
  moveWishlistToCartApi,
} from "../api/wishlist.api";

const WishlistPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getWishlistApi();
      setItems(res?.data?.items ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  // Convert backend response to card data
  const displayItems = items.map((item) => {
    const product = item.productId;

    return {
      id: product._id,
      name: product.name,
      price: product.price,
      discountPrice:
        product.discountPercent > 0
          ? product.discountPrice
          : product.price,
      tag:
        product.discountPercent > 0
          ? `-${product.discountPercent}%`
          : null,
      image:
        product.images?.[0] ||
        "https://placehold.co/300x300",
      rating: product.rating,
      totalReviews: product.totalReviews,
    };
  });

  // Remove ONE item
  const removeItem = async (productId) => {
  try {
    await removeFromWishlistApi(productId);

    setItems((prev) =>
      prev.filter((item) => item.productId._id !== productId)
    );
  } catch (err) {
    console.error(err);
    setError(err?.response?.data?.message || "Failed to remove item.");
  }
};

  // Move one item
  const handleAddToCart = async (item) => {
    try {
      await moveWishlistToCartApi(item.id);

      setItems((prev) =>
        prev.filter(
          (wishlistItem) =>
            wishlistItem.productId._id !== item.id
        )
      );
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to move item to cart."
      );
    }
  };

  // Move all items
  const handleMoveAllToCart = async () => {
    try {
      await Promise.all(
        items.map((item) =>
          moveWishlistToCartApi(item.productId._id)
        )
      );

      setItems([]);
    } catch (err) {
      console.error(err);
      setError("Failed to move all items to cart.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-muted-foreground">
          Loading your wishlist...
        </p>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <EmptyWishlist
        onBrowse={() => navigate("/products")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-xs bg-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              Wishlist
            </h1>
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

        {error && (
          <p className="mb-4 text-sm text-red-500">
            {error}
          </p>
        )}

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