import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCreditCard } from "react-icons/fi";
import { AddressList } from "../features/checkout/components/AddressList";
import { AddressFormModal } from "../features/checkout/components/AddressFormModal";
import { PaymentMethodSelector } from "../features/checkout/components/PaymentMethodSelector";
import { OrderSummary } from "../features/checkout/components/OrderSummary";
import { CouponBox } from "../features/cart/components/CouponBox";
import { getCartApi } from "../api/cart.api";
import { getAddressesApi } from "../api/address.api";
import { applyCouponApi } from "../api/coupon.api";
import { placeOrderApi } from "../api/order.api";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // UI-level id; mapped to backend enum on submit
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null = add mode, object = edit mode

  const loadAddresses = async () => {
    const addressRes = await getAddressesApi();
    const addressList = addressRes?.data ?? [];
    setAddresses(addressList);
    return addressList;
  };

  useEffect(() => {
    const loadCheckoutData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cartRes, addressList] = await Promise.all([getCartApi(), loadAddresses()]);

        setCart(cartRes?.data ?? { items: [], totalPrice: 0 });

        const defaultAddress = addressList.find((a) => a.isDefault) ?? addressList[0];
        setSelectedAddressId(defaultAddress?._id ?? null);
      } catch (err) {
        console.error(err);
        setError("Failed to load checkout details.");
      } finally {
        setLoading(false);
      }
    };
    loadCheckoutData();
  }, []);

  // map backend cart items -> flat shape OrderSummary expects
  const orderItems = (cart.items ?? []).map((item) => {
    const product = item.productId;
    return {
      id: product._id,
      name: product.name,
      image: product.images?.[0] || "https://placehold.co/150x150",
      price: item.priceAtAdd ?? product.discountPrice ?? product.price,
      quantity: item.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMessage(null);
    try {
      const res = await applyCouponApi(couponCode.trim(), subtotal);
      setDiscount(res?.discountAmount ?? 0);
      setCouponMessage({ type: "success", text: res?.message || "Coupon applied." });
    } catch (err) {
      console.error(err);
      setDiscount(0);
      setCouponMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to apply coupon.",
      });
    }
  };

  const handleEditAddress = (id) => {
    const address = addresses.find((a) => a._id === id);
    if (!address) return;
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleAddressSaved = async (savedAddress) => {
    const addressList = await loadAddresses();
    // select the address we just added/edited, or fall back to whatever is default
    const target =
      addressList.find((a) => a._id === savedAddress?._id) ??
      addressList.find((a) => a.isDefault) ??
      addressList[0];
    setSelectedAddressId(target?._id ?? null);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
    if (!selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }

    // backend order schema only accepts these two values
    const backendPaymentMethod = paymentMethod === "cod" ? "CASH_ON_DELIVERY" : "ONLINE";

    // createOrderSchema is .strict() — only send exactly these fields
    const payload = {
      products: orderItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      shippingAddress: {
        addressType: selectedAddress.addressType,
        location: selectedAddress.location,
        city: selectedAddress.city,
        state: selectedAddress.state,
        mobile: selectedAddress.mobile,
        ...(selectedAddress.pincode ? { pincode: selectedAddress.pincode } : {}),
        ...(selectedAddress.landmark ? { landmark: selectedAddress.landmark } : {}),
      },
      paymentMethod: backendPaymentMethod,
    };

    if (couponCode.trim()) {
      payload.couponCode = couponCode.trim();
    }

    setPlacingOrder(true);
    setError(null);
    try {
      const res = await placeOrderApi(payload);
      const order = res?.data?.masterOrder ?? res?.data;

      if (backendPaymentMethod === "ONLINE") {
        // NOTE: online gateway redirect (eSewa/Khalti) isn't wired up yet.
        // The order is created here, but the actual payment step
        // (POST /order/pay with { orderId, gateway }) still needs the
        // payment.service response shape confirmed before we can redirect
        // the user to the gateway checkout page.
        console.log("Order created; online payment step still needs wiring:", order);
      }

      navigate("/order-success", { state: { order } });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 rounded-xs bg-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              Checkout
            </h1>
          </div>

        <h1 className="text-2xl sm:text-md font-semibold text-foreground mb-8">
          Select address, apply coupon, and place your order
        </h1>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AddressList
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
              onEdit={handleEditAddress}
              onAddNew={handleAddNewAddress}
            />
            <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              items={orderItems}
              subtotal={subtotal}
              discount={discount}
              onPlaceOrder={handlePlaceOrder}
              disabled={!selectedAddressId || orderItems.length === 0 || placingOrder}
            />
            <CouponBox couponCode={couponCode} setCouponCode={setCouponCode} onApply={handleApplyCoupon} />
            {couponMessage && (
              <p
                className={`text-sm mt-2 ${
                  couponMessage.type === "success" ? "text-primary" : "text-red-500"
                }`}
              >
                {couponMessage.text}
              </p>
            )}
          </div>
        </div>
      </div>

      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSaved={handleAddressSaved}
        address={editingAddress}
      />
    </div>
  );
};

export default CheckoutPage;