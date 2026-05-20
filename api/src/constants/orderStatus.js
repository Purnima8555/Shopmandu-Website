
const OrderStatus = {
    PENDING: "pending",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
};

const PaymentStatus = {
    UNPAID: "unpaid",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded",
};

export { OrderStatus, PaymentStatus };
