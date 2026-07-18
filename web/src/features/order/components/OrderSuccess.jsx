import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiMapPin,
  FiCreditCard,
  FiPackage,
} from "react-icons/fi";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;
  console.log(order);
  const navigate = useNavigate();

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-5xl mx-auto animation-fade-in">
        {/* Success Header */}
        <div className="bg-card rounded-2xl border border-border shadow-md p-10 text-center">
          <FiCheckCircle className="w-20 h-20 text-success mx-auto mb-6" />

          <h1 className="text-4xl font-bold text-foreground">
            Thank you for your purchase!
          </h1>

          <p className="text-muted-foreground mt-3">
            We've received your order and will start processing it shortly.
          </p>

          <p className="mt-4 text-primary font-semibold">
            Order #{order.orderNumber}
          </p>
        </div>

        {/* Online Payment Notice */}
        {order.paymentMethod === "ONLINE" &&
          order.paymentStatus === "UNPAID" && (
            <div className="mt-6 rounded-xl border border-warning/30 bg-warning/10 p-5 animation-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warning/20">
                  <FiCreditCard className="h-6 w-6 text-warning" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    Payment Pending
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground leading-6">
                    Your order has been created successfully, but your payment
                    has not been completed yet.
                  </p>

                  <p className="mt-3 text-sm font-medium text-warning">
                    Please complete your payment within{" "}
                    <span className="font-bold">30 minutes</span>. After that,
                    the payment session will expire and you won't be able to
                    complete payment for this order.
                  </p>

                  <button
                    className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
                    onClick={() => {
                      navigate(`/payment/${order._id}`, {
                        state: { order },
                      });
                    }}
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Info Cards */}

        <div className="grid md:grid-cols-3 gap-5 mt-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiMapPin className="text-primary" />
              <h3 className="font-semibold text-foreground">
                Shipping Address
              </h3>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>{order.shippingAddress.location}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p>{order.shippingAddress.mobile}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiCreditCard className="text-primary" />
              <h3 className="font-semibold text-foreground">Payment</h3>
            </div>

            <div className="text-sm space-y-2">
              <p className="text-muted-foreground">
                {order.paymentMethod.replaceAll("_", " ")}
              </p>

              <span className="inline-flex rounded-full bg-warning/10 text-warning px-3 py-1 text-xs font-medium">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiPackage className="text-primary" />
              <h3 className="font-semibold text-foreground">Order Status</h3>
            </div>

            <div className="text-sm space-y-2">
              <span className="inline-flex rounded-full bg-primary-light text-primary px-3 py-1 text-xs font-medium">
                {order.orderStatus}
              </span>

              <p className="text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}

        <div className="bg-card border border-border rounded-2xl shadow-sm mt-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">
              Order Summary
            </h2>
          </div>

          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 p-5">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 rounded-lg object-cover border border-border"
                />

                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {item.productName}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Quantity : {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-foreground">
                  {formatPrice(item.price)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-6">
            <div className="space-y-3 text-sm">
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

              <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold">
                <span>Total</span>

                <span className="text-primary">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/products"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition text-center"
          >
            Continue Shopping
          </Link>

          <Link
            to="/profile"
            className="px-6 py-3 rounded-lg border border-border bg-card hover:bg-surface transition text-center"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
