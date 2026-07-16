import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { CartItemList } from "../features/cart/components/CartItemList";
import { CartSummary } from "../features/cart/components/CartSummary";
import { CouponBox } from "../features/cart/components/CouponBox";
import { EmptyCart } from "../features/cart/components/EmptyCart";
import Button from "../components/ui/Button";
import useCartStore from "../store/cartStore";
import { applyCouponApi } from "../api/coupon.api";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, getCart, updateCartItem, removeCartItem, clearCart } = useCartStore();

  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    getCart().catch(() => setError("Failed to load your cart."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal = cart?.totalPrice ?? 0;
  const total = Math.max(subtotal - discount, 0);

  const displayItems = (cart?.items ?? []).map((item) => {
    const product = item.productId;
    return {
      key: `${product._id}-${item.color ?? "none"}-${item.size ?? "none"}`,
      productId: product._id,
      name: product.name,
      image: product.images?.[0] || "https://placehold.co/150x150",
      price: item.priceAtAdd ?? product.discountPrice ?? product.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      lowStock: product.stock < item.quantity ? product.stock : null,
    };
  });

  useEffect(() => {
    if (appliedCoupon) {
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponMessage(null);
    }
  }, [subtotal]);

  const handleIncrease = async (productId, color, size) => {
    const current = displayItems.find((i) => i.productId === productId && i.color === color && i.size === size);
    if (!current) return;
    try {
      await updateCartItem(productId, current.quantity + 1, color, size);
    } catch (err) {
      setError(err?.message || "Failed to update quantity.");
    }
  };

  const handleDecrease = async (productId, color, size) => {
    const current = displayItems.find((i) => i.productId === productId && i.color === color && i.size === size);
    if (!current || current.quantity <= 1) return;
    try {
      await updateCartItem(productId, current.quantity - 1, color, size);
    } catch (err) {
      setError(err?.message || "Failed to update quantity.");
    }
  };

  const handleRemove = async (productId, color, size) => {
    try {
      await removeCartItem(productId, color, size);
    } catch (err) {
      setError(err?.message || "Failed to remove item.");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponMessage(null);
    } catch (err) {
      setError("Failed to clear cart.");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMessage(null);
    try {
      const res = await applyCouponApi(couponCode.trim(), subtotal);
      setDiscount(res.discountAmount || 0);
      setAppliedCoupon(res.couponCode || couponCode.trim());
      setCouponMessage({ type: "success", text: res.message || "Coupon applied." });
    } catch (err) {
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponMessage({ type: "error", text: err?.response?.data?.message || "Invalid coupon." });
    }
  };

  if (loading && !cart) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading your cart...</p>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return <EmptyCart onBrowse={() => navigate("/products")} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-xs bg-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              Cart
            </h1>
          </div>

        <h1 className="text-2xl sm:text-md font-semibold text-foreground mb-8 mt-4">
          Complete your purchase
        </h1>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItemList
              items={displayItems}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button variant="secondary" className="cursor-pointer" onClick={handleClearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <CartSummary subtotal={subtotal} discount={discount} total={total} onCheckout={() => navigate("/checkout")} />
            <CouponBox
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              onApply={handleApplyCoupon}
              message={couponMessage}
            />
            <Link to="/products" className="block text-center text-sm text-primary mt-5 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;