import { useEffect, useState } from "react";
import { Store, ChevronRight, Download, } from "lucide-react";

import StatusBadge from "../../../components/ui/StatusBadge";
import Popup from "../../../components/ui/Popup";
import { showSuccess, showError } from "../../../utils/toast";

import OrderDetail from "../components/OrderDetail";
import ReturnForm from "../components/RequestForm";

import useReturnStore from "../../../store/returnStore";
import useOrderStore from "../../../store/orderStore";

const STATUS_CONFIG = {
    DELIVERED: { label: "Delivered", tone: "success" },
    PROCESSING: { label: "Processing", tone: "warning" },
    PENDING: { label: "Pending", tone: "warning" },
    CONFIRMED: { label: "Confirmed", tone: "info" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", tone: "primary" },
    PARTIALLY_SHIPPED: { label: "Partially Shipped", tone: "primary" },
    CANCELLED: { label: "Cancelled", tone: "danger" },
    FAILED: { label: "Failed", tone: "danger" },
    RETURN_REQUESTED: { label: "Return Requested", tone: "neutral" },
    RETURNED: { label: "Returned", tone: "neutral" },
};

function SectionHeading({ eyebrow, title }) {
    return (
        <div className="mb-5 flex items-end justify-between">
            <div>
                {eyebrow && (
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                        {eyebrow}
                    </p>
                )}

                <h2 className="text-xl font-semibold text-[#23241F]">
                    {title}
                </h2>
            </div>
        </div>
    );
}

function OrderTicket({ order, onView, onDownload, onCancel,}) {
    const status =
        STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.PENDING;

    return (
        <div className="flex overflow-hidden rounded-2xl border border-[#E7E3D8] bg-white">
            {/* Left */}
            <div className="flex-1 p-5">
                <div className="mb-2 flex items-center gap-2 text-xs text-[#6B6A63]">
                    <Store size={13} />
                    <span className="text-[#D8D4C8]">•</span>
                    <span>{order.orderNumber}</span>
                </div>

                <p className="mb-1 text-sm font-medium text-[#23241F]">
                    {order.items?.map((item) => item.productName).join(", ")}
                </p>

                <p className="text-xs text-[#6B6A63]">
                    Placed {new Date(order.createdAt).toLocaleDateString()}
                </p>

                {order.orderStatus === "PENDING" && (
                    <button
                        onClick={() => onCancel(order._id)}
                        className="mt-3 inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                    >
                        Cancel Order
                    </button>
                )}
            </div>

            {/* Divider */}
            <div className="relative w-px border-l-2 border-dashed border-[#E7E3D8]">
                <span className="absolute -left-[9px] -top-3 h-4 w-4 rounded-full bg-[#FAF9F6]" />
                <span className="absolute -bottom-3 -left-[9px] h-4 w-4 rounded-full bg-[#FAF9F6]" />
            </div>

            {/* Right */}
            <div className="flex w-48 shrink-0 flex-col items-center justify-center gap-3 bg-[#FCFBF9] p-5">
                <StatusBadge tone={status.tone}>
                    {status.label}
                </StatusBadge>

                <p className="text-lg font-semibold tabular-nums text-[#23241F]">
                    Rs. {order.totalAmount}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDownload(order._id)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border transition hover:bg-muted"
                        title="Download Invoice"
                    >
                        <Download size={16} />
                    </button>

                    <button
                        onClick={() => onView(order._id)}
                        className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                        View Order
                        <ChevronRight size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MyOrders() {
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [returnData, setReturnData] = useState(null);

    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [showCancelPopup, setShowCancelPopup] = useState(false);

    const {
        orders,
        loading,
        getCustomerOrderHistory,
        getCustomerOrderDetail,
        customerSelectedOrder,
        downloadCustomerInvoice,
        cancelCustomerOrder,
    } = useOrderStore();

    const {
        createReturnRequest,
        loading: isSubmitting,
} = useReturnStore();

    useEffect(() => {
        getCustomerOrderHistory();
    }, []);

    const handleViewOrder = async (orderId) => {
        await getCustomerOrderDetail(orderId);
        setShowOrderDetail(true);
    };

    const handleReturnRequest = ({ order, orderItems }) => {
        setReturnData({
            order,
            orderItems,
        });

        setShowReturnForm(true);
    };

    if (loading && orders.length === 0) {
        return (
            <div className="py-10 text-center">
                Loading orders...
            </div>
        );
    }

    const handleDownloadInvoice = async (orderId) => {
        try {
            await downloadCustomerInvoice(orderId);

            showSuccess("Invoice downloaded successfully.");
        } catch (error) {
            console.error(error);

            showError(
                error?.message ||
                error?.response?.data?.message ||
                "Failed to download invoice."
            );
        }
    };

    const handleCancelClick = (orderId) => {
    setCancelOrderId(orderId);
    setShowCancelPopup(true);
    };

    const handleConfirmCancel = async () => {
        try {
            const res = await cancelCustomerOrder(cancelOrderId);

            showSuccess(
                res?.cancel?.message ||
                res?.message ||
                "Order cancelled successfully."
            );

            setShowCancelPopup(false);
            setCancelOrderId(null);

            await getCustomerOrderHistory();

        } catch (error) {
            console.error(error);

            showError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to cancel order."
            );
        }
    };

    return (
        <>
            <div>
                <SectionHeading
                    eyebrow={`${orders.length} Orders`}
                    title="Order History"
                />

                {orders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                        You haven't placed any orders yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <OrderTicket
                                key={order._id}
                                order={order}
                                onView={handleViewOrder}
                                onDownload={handleDownloadInvoice}
                                onCancel={handleCancelClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}

            {showOrderDetail && customerSelectedOrder && (
                <OrderDetail
                    order={customerSelectedOrder.order}
                    orderItems={customerSelectedOrder.orderItems}
                    onClose={() => setShowOrderDetail(false)}
                    onReturnItem={handleReturnRequest}
                />
            )}

            {/* Return Form Modal */}

            {showReturnForm && returnData && (
                <ReturnForm
                    order={returnData.order}
                    orderItems={returnData.orderItems}
                    loading={isSubmitting}
                    onClose={() => {
                        setShowReturnForm(false);
                        setReturnData(null);
                    }}
                    onSubmit={async (formData) => {
                        try {
                            const res = await createReturnRequest(formData);

                            showSuccess(
                                res?.message || "Return request submitted successfully."
                            );

                            await Promise.all([
                                getCustomerOrderDetail(returnData.order._id),
                                getCustomerOrderHistory(),
                            ]);

                            setShowReturnForm(false);
                            setReturnData(null);
                        } catch (error) {
                            console.error(error);

                            showError(
                                error?.response?.data?.message ||
                                "Failed to submit return request."
                            );
                        }
                    }}
                />
            )}

            <Popup
                isOpen={showCancelPopup}
                onClose={() => {
                    setShowCancelPopup(false);
                    setCancelOrderId(null);
                }}
                title="Cancel Order"
                showFooter
                confirmText="Yes, Cancel"
                cancelText="Keep Order"
                confirmVariant="destructive"
                onConfirm={handleConfirmCancel}
            >
                <p >
                    Are you sure you want to cancel this order?
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                    This action cannot be undone.
                </p>
            </Popup>
        </>
    );
}