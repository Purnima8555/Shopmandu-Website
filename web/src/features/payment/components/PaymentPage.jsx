import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiCreditCard,
  FiShield,
  FiPackage,
  FiCheckCircle,
} from "react-icons/fi";
import { usePaymentStore } from "../store/paymentStore";
import sendApiRequest from "../../../utils/sendApiRequest";

const PaymentPage = () => {
  const { state } = useLocation();
  const order = state?.order;

  const [gateway, setGateway] = useState("KHALTI");
  const { payOrder, loading } = usePaymentStore();

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 2,
    }).format(amount);

  const handlePayment = async () => {
    const payment = await sendApiRequest(() =>
      payOrder({
        orderId: order._id,
        gateway,
      }),
    );

    if (!payment) return;

    // Redirect user to payment gateway
    window.location.href = payment.paymentUrl;
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-6xl mx-auto animation-fade-in">
        {/* Header */}

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition"
        >
          <FiArrowLeft />
          Continue Shopping
        </Link>

        <div className="mt-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
            <FiCreditCard className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-4xl font-bold text-foreground">
            Complete Your Payment
          </h1>

          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Your order has been created successfully. Select a payment method
            below to complete your purchase securely.
          </p>
        </div>

        {/* Main */}

        <div className="grid lg:grid-cols-3 gap-8 mt-10">
          {/* LEFT */}

          <div className="lg:col-span-2 space-y-6">
            {/* Order */}

            <div className="bg-card rounded-2xl border border-border shadow-sm">
              <div className="p-6 border-b border-border flex items-center gap-3">
                <FiPackage className="text-primary text-xl" />

                <div>
                  <h2 className="font-semibold text-foreground">
                    Order Summary
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {order.orderNumber}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 items-center p-5"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 rounded-xl object-cover border border-border"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {item.productName}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        Qty {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-foreground">
                      {formatPrice(item.total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}

            <div className="bg-card rounded-2xl border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h2 className="font-semibold text-foreground">
                  Select Payment Method
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Khalti */}

                <button
                  onClick={() => setGateway("KHALTI")}
                  className={`relative w-full rounded-xl border-2 p-5 transition-all duration-300 text-left cursor-pointer ${
                    gateway === "KHALTI"
                      ? "border-primary bg-primary-light shadow-md"
                      : "border-border hover:border-primary hover:shadow-sm bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">Khalti</h3>

                      <p className="text-sm text-muted-foreground mt-1">
                        Pay instantly using Khalti Wallet.
                      </p>
                    </div>

                    {gateway === "KHALTI" && (
                      <FiCheckCircle className="text-success text-2xl" />
                    )}
                  </div>
                </button>

                {/* Stripe */}

                <button
                  onClick={() => setGateway("STRIPE")}
                  className={`relative w-full rounded-xl border-2 p-5 transition-all duration-300 text-left cursor-pointer ${
                    gateway === "STRIPE"
                      ? "border-primary bg-primary-light shadow-md"
                      : "border-border hover:border-primary hover:shadow-sm bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">Stripe</h3>

                      <p className="text-sm text-muted-foreground mt-1">
                        Pay securely using Credit or Debit Cards.
                      </p>
                    </div>

                    {gateway === "STRIPE" && (
                      <FiCheckCircle className="text-success text-2xl" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div>
            <div className="sticky top-8 bg-card rounded-2xl border border-border shadow-md p-6">
              <h2 className="font-semibold text-lg text-foreground">
                Payment Details
              </h2>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>

                  <span>{formatPrice(order.subTotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>

                  <span>
                    {order.shippingCharge === 0
                      ? "Free"
                      : formatPrice(order.shippingCharge)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>

                  <span>{formatPrice(order.taxAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>

                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>

                <div className="border-t border-border pt-5 flex justify-between text-xl font-bold">
                  <span>Total</span>

                  <span className="text-primary">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Button */}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-8 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-semibold py-4 transition"
              >
                {loading
                  ? "Redirecting to Payment..."
                  : `Pay ${formatPrice(order.totalAmount)}`}
              </button>

              <div className="mt-6 flex gap-3 items-start">
                <FiShield className="text-success text-xl mt-0.5" />

                <div>
                  <h3 className="font-medium text-foreground">
                    Secure Payment
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    Your payment information is encrypted and securely processed
                    through our trusted payment partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
