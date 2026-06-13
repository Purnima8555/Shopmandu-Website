import React, { useEffect, useState } from "react";
import axios from "axios";

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [couponCode, setCouponCode] = useState("");

    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);

    // ---------------- FETCH CART ----------------
    const fetchCart = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/cart", {
                withCredentials: true,
            });

            setCart(res.data.data);
        } catch (err) {
            console.log("Cart error:", err.response?.data || err.message);
        }
    };

    // ---------------- FETCH ADDRESSES ----------------
    const fetchAddresses = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/address", {
                withCredentials: true,
            });

            setAddresses(res.data.data);

            const defaultAddr = res.data.data.find(a => a.isDefault);
            setSelectedAddress(defaultAddr || res.data.data[0]);
        } catch (err) {
            console.log("Address error:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchCart(), fetchAddresses()]);
            setLoading(false);
        };
        init();
    }, []);

    // ---------------- CHECKOUT ----------------
    const handleCheckout = async () => {
        setCheckingOut(true);

        try {
            const orderRes = await axios.post(
                "http://localhost:3000/api/order/place",
                {
                    products: cart.items.map(item => ({
                        productId: item.productId._id,
                        quantity: item.quantity,
                    })),

                    shippingAddress: {
                        addressType: selectedAddress.addressType,
                        location: selectedAddress.location,
                        city: selectedAddress.city,
                        mobile: selectedAddress.mobile,
                        state: selectedAddress.state,
                        pincode: selectedAddress.pincode,
                        landmark: selectedAddress.landmark,
                    },

                    paymentMethod: "ONLINE",

                    // ✅ ADDED COUPON
                    couponCode: couponCode.trim() || undefined
                },
                { withCredentials: true }
            );

            const orderId = orderRes.data.data.masterOrder._id;

            const stripeRes = await axios.post(
                "http://localhost:3000/api/order/pay",
                {
                    orderId,
                    gateway: "STRIPE"
                },
                { withCredentials: true }
            );

            window.location.href = stripeRes.data.paymentOrder.data.url;

        } catch (err) {
            console.log("Checkout error:", err.response?.data || err.message);
            setCheckingOut(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Cart is empty
            </div>
        );
    }

    const itemCount = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-6">

                {/* ================= LEFT: CART ================= */}
                <div className="flex-1">

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">My Cart</h1>
                        <p className="text-sm text-gray-500">
                            {itemCount} items
                        </p>
                    </div>

                    {/* Items */}
                    <div className="bg-white rounded-xl shadow divide-y">
                        {cart.items.map((item, idx) => {
                            const product = item.productId;

                            return (
                                <div
                                    key={item._id || idx}
                                    className="flex items-center justify-between px-5 py-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={product?.images?.[0]}
                                            alt={product?.name}
                                            className="w-12 h-12 rounded object-cover bg-gray-100"
                                        />

                                        <div>
                                            <p className="text-sm font-medium">
                                                {product?.name}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Rs {item.priceAtAdd} × {item.quantity}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="font-semibold">
                                        Rs {(item.priceAtAdd * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 bg-white rounded-xl p-5 shadow">
                        <div className="flex justify-between">
                            <span>Total</span>
                            <span className="font-bold">
                                Rs {cart.totalPrice.toLocaleString()}
                            </span>
                        </div>
                    </div>

                </div>

                {/* ================= RIGHT: ADDRESS ================= */}
                <div className="w-full md:w-[320px]">

                    <div className="bg-white rounded-xl shadow p-5">
                        <h2 className="font-semibold mb-3">Delivery Address</h2>

                        {addresses.length === 0 && (
                            <p className="text-sm text-gray-500">
                                No address found
                            </p>
                        )}

                        {addresses.map(addr => (
                            <div
                                key={addr._id}
                                onClick={() => setSelectedAddress(addr)}
                                className={`p-3 mb-2 border rounded cursor-pointer text-sm ${
                                    selectedAddress?._id === addr._id
                                        ? "border-black bg-gray-50"
                                        : "border-gray-200"
                                }`}
                            >
                                <p className="font-medium">
                                    {addr.addressType}
                                </p>
                                <p className="text-gray-600">
                                    {addr.location}, {addr.city}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ================= COUPON INPUT ================= */}
                    <div className="bg-white rounded-xl shadow p-5 mt-4">
                        <h2 className="font-semibold mb-2">Coupon</h2>

                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full border p-2 rounded text-sm"
                        />
                    </div>

                    {/* Checkout */}
                    <button
                        onClick={handleCheckout}
                        disabled={checkingOut || !selectedAddress}
                        className="mt-6 w-full bg-black text-white py-3 rounded-lg"
                    >
                        {checkingOut ? "Redirecting..." : "Pay with Stripe"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default CartPage;