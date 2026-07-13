import { FiCheckCircle } from "react-icons/fi";

export const OrderConfirmationCard = ({ orderId, placedAt, estimatedDelivery }) => (
  <div className="text-center">
    <div className="w-20 h-20 mx-auto rounded-full bg-primary-light flex items-center justify-center">
      <FiCheckCircle size={32} className="text-primary" />
    </div>
    <h1 className="mt-6 text-2xl font-bold text-foreground">Order Placed Successfully!</h1>
    <p className="mt-2 text-muted-foreground">
      Thank you for shopping with us. Your order has been confirmed.
    </p>

    <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left shadow-sm">
      <div className="flex justify-between py-2 text-sm">
        <span className="text-muted-foreground">Order ID</span>
        <span className="text-foreground font-medium">{orderId}</span>
      </div>
      <div className="flex justify-between py-2 text-sm border-t border-border">
        <span className="text-muted-foreground">Placed On</span>
        <span className="text-foreground font-medium">{placedAt}</span>
      </div>
      <div className="flex justify-between py-2 text-sm border-t border-border">
        <span className="text-muted-foreground">Estimated Delivery</span>
        <span className="text-foreground font-medium">{estimatedDelivery}</span>
      </div>
    </div>
  </div>
);
