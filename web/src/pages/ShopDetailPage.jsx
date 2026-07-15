import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiMapPin, FiClock, FiStar, FiMail, FiPhone } from "react-icons/fi";
import { ProductGrid } from "../features/product/components/ProductGrid";
import { Pagination } from "../features/product/components/Pagination";
import useShopStore from "../store/shop";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useAuthStore from "../store/authStore";
import { dismissToast, showSuccess, showError } from "../utils/toast";

const ShopDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { wishlist, getWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  const {
    currentShop,
    currentShopLoading,
    shopProducts,
    shopProductsMeta,
    shopProductsLoading,
    getShopBySlug,
    getShopProducts,
    clearCurrentShop,
  } = useShopStore();

  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load the shop whenever the slug changes
  useEffect(() => {
    setError(null);
    getShopBySlug(slug).catch((err) => {
      setError(err?.message || "This shop couldn't be found.");
    });

    return () => clearCurrentShop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Once we have the shop's _id, load its products (paginated)
  useEffect(() => {
    if (!currentShop?._id) return;
    getShopProducts(currentShop._id, { page: currentPage, limit: 12 }).catch(() => {
      setError("Failed to load this shop's products.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShop?._id, currentPage]);

  /// load the user's wishlist once so heart icons can reflect real state.
  /// Skipped for guests — getWishlist would just 401.
  useEffect(() => {
    if (!isAuthenticated) return;
    getWishlist().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /// Set of product ids currently in the wishlist, for O(1) lookup per card
  const wishlistedIds = useMemo(
    () => new Set((wishlist?.items ?? []).map((item) => item.productId?._id ?? item.productId)),
    [wishlist]
  );

  const totalPages = shopProductsMeta?.totalPages || 1;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (productId) => {
    if (!productId) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({ productId, quantity: 1 });
      dismissToast();
      showSuccess("Added to cart.");
    } catch (err) {
      dismissToast();
      // Products with colors/sizes need a variant selected on the product
      // page itself — a quick "Add to Cart" from the grid can't do that.
      if (err?.message?.toLowerCase().includes("select a color") || err?.message?.toLowerCase().includes("select a size")) {
        showError("This product has options to choose — please select them on the product page.");
      } else {
        showError(err?.message || "Failed to add item to cart.");
      }
    }
  };

  const handleToggleWishlist = async (product) => {
    const productId = product._id ?? product.id;
    if (!productId) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const alreadyWishlisted = wishlistedIds.has(productId);

    try {
      if (alreadyWishlisted) {
        await removeFromWishlist(productId);
        dismissToast();
        showSuccess("Removed from wishlist.");
      } else {
        // wishlist.api.js's addToWishlistApi expects { productId, shopId }
        await addToWishlist({ productId, shopId: product.shopId });
        dismissToast();
        showSuccess("Added to wishlist.");
      }
    } catch (err) {
      dismissToast();
      showError(err?.response?.data?.message || err?.message || "Failed to update wishlist.");
    }
  };

  if (currentShopLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading shop...</p>
      </div>
    );
  }

  if (error || !currentShop) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground">Shop not found</h1>
          <p className="mt-2 text-muted-foreground">
            {error || "We couldn't find the shop you're looking for."}
          </p>
          <Link to="/products" className="inline-block mt-6 text-primary hover:underline">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const {
    shopName,
    description,
    logo,
    banner,
    shopRating,
    shopAddress,
    openingHour,
    businessEmail,
    businessMobile,
  } = currentShop;

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="w-full h-40 sm:h-56 lg:h-64 bg-surface overflow-hidden">
        {banner ? (
          <img src={banner} alt={`${shopName} banner`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-light to-surface" />
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Shop header card */}
        <div className="relative -mt-12 sm:-mt-14 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-border bg-background flex-shrink-0 shadow-sm">
              <img
                src={logo || "https://placehold.co/150x150?text=Shop"}
                alt={shopName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{shopName}</h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                {typeof shopRating === "number" && (
                  <span className="flex items-center gap-1">
                    <FiStar className="text-primary" size={14} />
                    {shopRating.toFixed(1)}
                  </span>
                )}
                {shopAddress?.city && (
                  <span className="flex items-center gap-1">
                    <FiMapPin size={14} />
                    {[shopAddress.location, shopAddress.city, shopAddress.state].filter(Boolean).join(", ")}
                  </span>
                )}
                {openingHour?.open && openingHour?.close && (
                  <span className="flex items-center gap-1">
                    <FiClock size={14} />
                    {openingHour.open} – {openingHour.close}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                {businessEmail && (
                  <span className="flex items-center gap-1">
                    <FiMail size={14} />
                    {businessEmail}
                  </span>
                )}
                {businessMobile && (
                  <span className="flex items-center gap-1">
                    <FiPhone size={14} />
                    {businessMobile}
                  </span>
                )}
              </div>
            </div>
          </div>

          {description && (
            <p className="mt-5 text-sm text-foreground/80 leading-relaxed">{description}</p>
          )}
        </div>

        {/* Products from this shop */}
        <div className="mt-10 pb-16">
          <h2 className="text-lg font-semibold text-foreground mb-5">Products from this shop</h2>

          {shopProductsLoading ? (
            <div className="flex justify-center items-center h-48 text-foreground/60">
              Loading products...
            </div>
          ) : shopProducts.length > 0 ? (
            <>
              <ProductGrid
                products={shopProducts}
                onAddToCart={handleAddToCart}
                wishlistedIds={wishlistedIds}
                onToggleWishlist={handleToggleWishlist}
              />
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-border bg-card">
              <p className="text-base font-medium text-foreground">No products yet</p>
              <p className="text-sm mt-1 text-foreground/60">This shop hasn't listed any products.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;