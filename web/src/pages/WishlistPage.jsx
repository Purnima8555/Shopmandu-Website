import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { WishlistGrid } from "../features/wishlist/components/WishlistGrid";
import { JustForYouSection } from "../features/wishlist/components/JustForYouSection";
import { EmptyWishlist } from "../features/wishlist/components/EmptyWishlist";
import useWishlistStore from "../store/wishlistStore";

/// TODO: replace with real recommended products once a recommendations API exists
const recommendedItems = [
  { id: 5, name: "ASUS FHD Gaming Laptop", price: 1160, discountPrice: 960, tag: "-35%", rating: 5, totalReviews: 65, image: "https://placehold.co/300x300" },
  { id: 6, name: "IPS LCD Gaming Monitor", price: 1160, discountPrice: 1160, tag: null, rating: 5, totalReviews: 65, image: "https://placehold.co/300x300" },
  { id: 7, name: "HAVIT HV-G92 Gamepad", price: 560, discountPrice: 560, tag: "NEW", rating: 5, totalReviews: 65, image: "https://placehold.co/300x300" },
  { id: 8, name: "AK-900 Wired Keyboard", price: 200, discountPrice: 200, tag: null, rating: 5, totalReviews: 65, image: "https://placehold.co/300x300" },
];

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, loading, getWishlist, removeFromWishlist, moveToCart } = useWishlistStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    getWishlist().catch(() => setError("Failed to load your wishlist."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = wishlist?.items ?? [];

  // map backend items -> flat shape WishlistGrid/WishlistProductCard expect
  const displayItems = items.map((item) => {
    const product = item.productId;
    return {
      id: product._id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPercent > 0 ? product.discountPrice : product.price,
      tag: product.discountPercent > 0 ? `-${product.discountPercent}%` : null,
      image: product.images?.[0] || "https://placehold.co/300x300",
      rating: product.rating,
    };
  });

  const removeItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to remove item.");
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await moveToCart(item.id);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to move item to cart.");
    }
  };

  const handleMoveAllToBag = async () => {
    try {
      await Promise.all(items.map((item) => moveToCart(item.productId._id)));
    } catch (err) {
      console.error(err);
      setError("Failed to move all items to cart.");
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading your wishlist...</p>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return <EmptyWishlist onBrowse={() => navigate("/products")} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-xs bg-primary" />
            <h1 className="text-lg font-semibold text-foreground">Wishlist</h1>
          </div>

          <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleMoveAllToBag}>
            Move All To Bag
          </Button>
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <WishlistGrid items={displayItems} onRemove={removeItem} onAddToCart={handleAddToCart} />

        <JustForYouSection items={recommendedItems} onAddToCart={() => {}} />
      </div>
    </div>
  );
};

export default WishlistPage;