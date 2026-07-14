import {
    Calendar,
    CreditCard,
    MapPin,
    Package,
    RotateCcw,
    Store,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import StatusBadge from "../../../components/ui/StatusBadge";

const STATUS = {
    DELIVERED: { label: "Delivered", tone: "success" },
    PROCESSING: { label: "Processing", tone: "warning" },
    PENDING: { label: "Pending", tone: "warning" },
    CONFIRMED: { label: "Confirmed", tone: "info" },
    OUT_FOR_DELIVERY: { label: "Out for delivery", tone: "primary" },
    PARTIALLY_SHIPPED: { label: "Partially shipped", tone: "primary" },
    CANCELLED: { label: "Cancelled", tone: "danger" },
    FAILED: { label: "Failed", tone: "danger" },
};

const RETURN_STATUS = {
    PENDING: { label: "Return Requested", tone: "warning",},
    APPROVED: { label: "Return Approved", tone: "success",},
    REJECTED: { label: "Return Rejected", tone: "danger",},
    REFUNDED: { label: "Refunded",tone: "primary",},
};

// Progress stepper
const STEPS = [
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "OUT_FOR_DELIVERY", label: "Out for delivery" },
    { key: "DELIVERED", label: "Delivered" },
];

function stepIndex(status) {
    if (status === "PARTIALLY_SHIPPED") return 2;
    const i = STEPS.findIndex((s) => s.key === status);
    return i === -1 ? 0 : i;
}

function OrderStepper({ status }) {
    const isTerminalIssue = status === "CANCELLED" || status === "FAILED";

    if (isTerminalIssue) {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-[#EFD9D2] bg-[#FBF3F0] px-5 py-4">
                <AlertTriangle size={18} className="shrink-0 text-[#B3543E]" />
                <p className="text-sm text-[#6B6A63]">
                    This order was{" "}
                    <span className="font-medium text-[#B3543E]">
                        {status === "CANCELLED" ? "cancelled" : "marked as failed"}
                    </span>
                    {" "}and is not currently in progress.
                </p>
            </div>
        );
    }

    const current = stepIndex(status);

    return (
        <div className="flex items-center">
            {STEPS.map((step, i) => {
                const done = i < current;
                const active = i === current;
                return (
                    <div key={step.key} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                                    done || active
                                        ? "bg-primary text-white"
                                        : "bg-[#F1F0EC] text-[#6B6A63]"
                                }`}
                            >
                                {done ? <CheckCircle2 size={15} /> : i + 1}
                            </div>
                            <span
                                className={`text-[11px] font-medium whitespace-nowrap ${
                                    done || active ? "text-[#23241F]" : "text-[#6B6A63]"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div
                                className={`mx-2 h-0.5 flex-1 rounded-full ${
                                    done ? "bg-primary" : "bg-[#E7E3D8]"
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function InfoCard({ icon: Icon, title, children, action }) {
    return (
        <div className="rounded-2xl border border-[#E7E3D8] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#23241F]">
                    <Icon size={16} className="text-primary" />
                    {title}
                </h3>
                {action}
            </div>
            {children}
        </div>
    );
}

export default function OrderDetail({
    order,
    orderItems = [],
    onClose,
    onReturnItem,
}) {
    if (!order) return null;

    const status = STATUS[order.orderStatus] || STATUS.PENDING;
    const canReturn = order.orderStatus === "DELIVERED";

    const hasReturnableProducts = orderItems.some((vendorGroup) =>
        vendorGroup.products.some(
            (product) => !product.hasReturnRequest
        )
    );

    return (
        <Modal
            title="Order details"
            onClose={onClose}
            maxWidth="max-w-5xl"
        >
            <div className="space-y-8">

                {/* ================= Header ================= */}

                <div className="flex flex-wrap items-start justify-between gap-4">

                    <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            Order
                        </p>
                        <h2 className="text-lg text-[#23241F] font-semibold">
                            {order.orderNumber}
                        </h2>

                        <span className="mt-2 flex items-center gap-2 text-sm text-[#6B6A63]">
                            <Calendar size={14} />
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>

                    <StatusBadge tone={status.tone}>
                        {status.label}
                    </StatusBadge>

                </div>

                {/* ================= Progress ================= */}

                <OrderStepper status={order.orderStatus} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">

                        {/* ================= Shipping + Payment ================= */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            <InfoCard icon={MapPin} title="Shipping address">
                                <div className="space-y-1 text-sm text-[#23241F]">
                                    <p className="inline-block rounded-full bg-[#EAF0EC] px-2.5 py-0.5 text-xs font-medium text-primary">
                                        {order.shippingAddress.addressType}
                                    </p>
                                    <p className="pt-1.5">{order.shippingAddress.location}</p>
                                    <p className="text-[#6B6A63]">
                                        {order.shippingAddress.city}, {order.shippingAddress.state}
                                    </p>
                                    {order.shippingAddress.pincode && (
                                        <p className="text-[#6B6A63]">
                                            {order.shippingAddress.pincode}
                                        </p>
                                    )}
                                    {order.shippingAddress.landmark && (
                                        <p className="text-[#6B6A63]">
                                            {order.shippingAddress.landmark}
                                        </p>
                                    )}
                                    <p className="pt-2 font-medium">
                                        {order.shippingAddress.mobile}
                                    </p>
                                </div>
                            </InfoCard>

                            <InfoCard icon={CreditCard} title="Payment">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="mb-0.5 text-xs text-[#6B6A63]">Method</p>
                                        <p className="font-medium text-[#23241F]">
                                            {order.paymentMethod}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-0.5 text-xs text-[#6B6A63]">Status</p>
                                        <p className="font-medium text-[#23241F]">
                                            {order.paymentStatus}
                                        </p>
                                    </div>
                                </div>
                            </InfoCard>

                        </div>

                        {/* ================= Products ================= */}

                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#23241F]">
                                    <Package size={16} className="text-primary" />
                                    Products
                                </h3>

                                {canReturn && hasReturnableProducts && (
                                    <Button
                                        icon={RotateCcw}
                                        iconPosition="left"
                                        onClick={() => {
                                            onClose();
                                            onReturnItem({ order, orderItems });
                                        }}
                                    >
                                        Request return
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {orderItems.map((vendorGroup) => (
                                    <div
                                        key={vendorGroup._id}
                                        className="overflow-hidden rounded-2xl border border-[#E7E3D8] bg-white"
                                    >
                                        <div className="flex items-center gap-2 border-b border-[#E7E3D8] bg-[#FCFBF9] px-5 py-3">
                                            <Store size={14} className="text-[#6B6A63]" />
                                            <p className="text-xs font-semibold text-[#23241F]">
                                                {vendorGroup.vendorId.userName}
                                            </p>
                                        </div>

                                        {vendorGroup.products.map((product) => (
                                            <div
                                                key={product.productId._id}
                                                className="flex items-center gap-4 border-b border-[#EFEBE1] p-5 last:border-b-0"
                                            >
                                                <img
                                                    src={product.productImage}
                                                    alt={product.productName}
                                                    className="h-20 w-20 rounded-xl border border-[#E7E3D8] object-cover"
                                                />

                                                <div className="flex-1">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <h4 className="font-medium text-[#23241F]">
                                                            {product.productName}
                                                        </h4>

                                                        {product.hasReturnRequest && (
                                                            <StatusBadge
                                                                tone={RETURN_STATUS[product.returnRequest.status].tone}
                                                            >
                                                                {RETURN_STATUS[product.returnRequest.status].label}
                                                            </StatusBadge>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap gap-1.5">
                                                        <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-xs text-[#6B6A63]">
                                                            Qty {product.quantity}
                                                        </span>
                                                        <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-xs text-[#6B6A63]">
                                                            Rs. {product.price}
                                                        </span>
                                                        {product.variant?.color && (
                                                            <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-xs text-[#6B6A63]">
                                                                {product.variant.color}
                                                            </span>
                                                        )}
                                                        {product.variant?.size && (
                                                            <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-xs text-[#6B6A63]">
                                                                Size {product.variant.size}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* ================= Summary ================= */}

                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-2xl border border-[#E7E3D8] bg-white p-5">
                            <h3 className="mb-5 text-sm font-semibold text-[#23241F]">
                                Order summary
                            </h3>

                            <div className="space-y-3 text-sm text-[#23241F]">
                                <div className="flex justify-between">
                                    <span className="text-[#6B6A63]">Subtotal</span>
                                    <span className="tabular-nums">Rs. {order.subTotal}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-[#6B6A63]">Discount</span>
                                    <span className="tabular-nums">
                                        − Rs. {order.discountAmount}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-[#6B6A63]">Shipping</span>
                                    <span className="tabular-nums">
                                        Rs. {order.shippingCharge}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-[#6B6A63]">Tax</span>
                                    <span className="tabular-nums">Rs. {order.taxAmount}</span>
                                </div>
                            </div>

                            <div className="relative my-4 h-px border-t-2 border-dashed border-[#E7E3D8]">
                                <span className="absolute -left-[29px] -top-3 h-4 w-4 rounded-full bg-[#FAF9F6]" />
                                <span className="absolute -right-[29px] -top-3 h-4 w-4 rounded-full bg-[#FAF9F6]" />
                            </div>

                            <div className="flex justify-between text-base font-semibold text-[#23241F]">
                                <span>Total</span>
                                <span className="tabular-nums">Rs. {order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex justify-end border-t border-[#E7E3D8] pt-6">
                    <Button
                        variant="outline"
                        className="border-2 border-gray-300"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>

            </div>
        </Modal>
    );
}