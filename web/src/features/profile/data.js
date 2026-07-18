export const STATUS = {
    DELIVERED: { label: "Delivered", tone: "success" },
    PROCESSING: { label: "Processing", tone: "warning" },
    PENDING: { label: "Pending", tone: "warning" },
    CONFIRMED: { label: "Confirmed", tone: "info" },
    OUT_FOR_DELIVERY: { label: "Out for delivery", tone: "primary" },
    PARTIALLY_SHIPPED: { label: "Partially shipped", tone: "primary" },
    CANCELLED: { label: "Cancelled", tone: "danger" },
    FAILED: { label: "Failed", tone: "danger" },
};

export const RETURN_STATUS = {
    PENDING: {
        label: "Return Requested",
        tone: "warning",
    },
    APPROVED: {
        label: "Return Approved",
        tone: "success",
    },
    REJECTED: {
        label: "Return Rejected",
        tone: "danger",
    },
    REFUNDED: {
        label: "Refunded",
        tone: "primary",
    },
};

export const STEPS = [
    {
        key: "CONFIRMED",
        label: "Confirmed",
    },
    {
        key: "PROCESSING",
        label: "Processing",
    },
    {
        key: "OUT_FOR_DELIVERY",
        label: "Out for delivery",
    },
    {
        key: "DELIVERED",
        label: "Delivered",
    },
];