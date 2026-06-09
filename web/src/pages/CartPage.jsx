import React, { useEffect, useState } from "react";
import axios from "axios";

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);

    const fetchCart = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/cart", {
                withCredentials: true,
            });

            setCart(res.data.data);
        } catch (err) {
            console.log("Cart error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleCheckout = async () => {
    setCheckingOut(true);

    try {
        // CREATE ORDER
        const orderRes = await axios.post(
            "http://localhost:3000/api/orders",
            {
                items: cart.items.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),

                // SHIPPING ADDRESS ID
                shippingAddress: "6a188bcc645c7fc0850a7d40",

                paymentMethod: "STRIPE"
            },
            {
                withCredentials: true
            }
        );

        const orderId = orderRes.data.data._id;

        // STRIPE SESSION
        const stripeRes = await axios.post(
            "http://localhost:3000/api/payment/stripe/create-session",
            { orderId },
            {
                withCredentials: true
            }
        );

        // console.log(stripeRes.data.url);
        window.location.href = stripeRes.data.url;

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
            <div className="max-w-2xl mx-auto px-4 py-10">

                {/* Header */}
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
                                {/* Left side */}
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

                                {/* Right side */}
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

                {/* Checkout */}
                <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="mt-6 w-full bg-black text-white py-3 rounded-lg"
                >
                    {checkingOut ? "Redirecting..." : "Pay with Stripe"}
                </button>
            </div>
        </div>
    );
};

export default CartPage;