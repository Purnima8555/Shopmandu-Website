import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AddressList } from "../features/checkout/components/AddressList";
import { AddressFormModal } from "../features/checkout/components/AddressFormModal";
import { PaymentMethodSelector } from "../features/checkout/components/PaymentMethodSelector";
import { OrderSummary } from "../features/checkout/components/OrderSummary";
import { CouponBox } from "../features/cart/components/CouponBox";

import { getAddressesApi } from "../api/address.api";
import { applyCouponApi } from "../api/coupon.api";

import { useUserOrderStore } from "../features/order/store/userOrderStore";
import sendApiRequest from "../utils/sendApiRequest";

const BuyProduct = () => {
  const navigate = useNavigate();

  const {
    buyProduct,
    clearBuyProduct,
    placeOrder,
    loading: placingOrder,
  } = useUserOrderStore();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const loadAddresses = async () => {
    const res = await getAddressesApi();
    const list = res?.data ?? [];
    setAddresses(list);
    return list;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const list = await loadAddresses();

        const defaultAddress = list.find((a) => a.isDefault) ?? list[0];

        setSelectedAddressId(defaultAddress?._id ?? null);
      } catch {
        setError("Failed to load addresses.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (!buyProduct) {
    return <Navigate to="/products" replace />;
  }

  const orderItems = [
    {
      id: buyProduct.productId,
      name: buyProduct.name,
      image: buyProduct.image,
      quantity: buyProduct.quantity,
      price: buyProduct.price,
    },
  ];

  const subtotal = buyProduct.price * buyProduct.quantity;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const res = await applyCouponApi(couponCode.trim(), subtotal);

      setDiscount(res.discountAmount || 0);

      setCouponMessage({
        type: "success",
        text: res.message,
      });
    } catch (err) {
      setDiscount(0);

      setCouponMessage({
        type: "error",
        text: err?.response?.data?.message ?? "Failed to apply coupon.",
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
    const list = await loadAddresses();

    const target =
      list.find((a) => a._id === savedAddress?._id) ??
      list.find((a) => a.isDefault) ??
      list[0];

    setSelectedAddressId(target?._id ?? null);
  };

  const handlePlaceOrder = async () => {
    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

    if (!selectedAddress) return;

    const payload = {
      products: [
        {
          productId: buyProduct.productId,
          quantity: buyProduct.quantity,
          color: buyProduct.color,
          size: buyProduct.size,
        },
      ],

      shippingAddress: {
        addressType: selectedAddress.addressType,
        location: selectedAddress.location,
        city: selectedAddress.city,
        state: selectedAddress.state,
        mobile: selectedAddress.mobile,
        pincode: selectedAddress.pincode,
        landmark: selectedAddress.landmark,
      },

      paymentMethod: paymentMethod === "cod" ? "CASH_ON_DELIVERY" : "ONLINE",

      ...(couponCode && {
        couponCode,
      }),
    };

    const order = await sendApiRequest(() => placeOrder(payload));

    if (!order) return;

    clearBuyProduct();

    navigate(`/order-success/${order._id}`, {
      state: { order },
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 rounded-xs bg-primary" />
          <h1 className="text-lg font-semibold">Buy Product</h1>
        </div>

        <h2 className="text-2xl mb-8">Complete your purchase</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AddressList
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
              onEdit={handleEditAddress}
              onAddNew={handleAddNewAddress}
            />

            <PaymentMethodSelector
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </div>

          <div>
            <OrderSummary
              items={orderItems}
              subtotal={subtotal}
              discount={discount}
              onPlaceOrder={handlePlaceOrder}
              disabled={!selectedAddressId || placingOrder}
            />

            <CouponBox
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              onApply={handleApplyCoupon}
            />

            {couponMessage && (
              <p
                className={`mt-2 text-sm ${
                  couponMessage.type === "success"
                    ? "text-primary"
                    : "text-red-500"
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

export default BuyProduct;
