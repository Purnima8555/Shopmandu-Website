
import Modal from "../../../components/ui/Modal";
import StatusBadge from "../../../components/ui/StatusBadge";

const ViewPaymentModal = ({ payment, onClose }) => {
  if (!payment) return null;

  const statusStyle = {
    PAID: { tone: "success", label: "Paid" },
    PENDING: { tone: "warning", label: "Pending" },
    FAILED: { tone: "danger", label: "Failed" },
    REFUNDED: { tone: "info", label: "Refunded" },
  }[payment.status] || { tone: "neutral", label: payment.status };

  return (
    <Modal
  title="Payment Details"
  onClose={onClose}
  maxWidth="max-w-xl"
  showFooter={false}
>
      <div className="space-y-6">
        {/* Order Info */}
        <div>
          <p className="text-xs font-medium text-muted-foreground">ORDER NUMBER</p>
          <p className="font-mono text-lg font-semibold mt-1">{payment.orderNumber}</p>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">AMOUNT</p>
            <p className="text-3xl font-semibold mt-1">
              {payment.currency === "NPR" ? `Rs. ${payment.amount}` : `$${payment.amount}`}
            </p>
          </div>
          <StatusBadge tone={statusStyle.tone} className="text-base px-4 py-1">
            {statusStyle.label}
          </StatusBadge>
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground">GATEWAY</p>
            <p className="mt-1 font-medium">{payment.gateway}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">PAYMENT METHOD</p>
            <p className="mt-1 font-medium">
              {payment.paymentMethod === "ONLINE" ? "Online Payment" : payment.paymentMethod}
            </p>
          </div>
        </div>

        {/* Extra DB Fields */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              CUSTOMER
            </p>

            <p className="mt-1 font-medium">
              {payment.customerId?.email || "—"}
            </p>

            {/* <p className="mt-1 text-xs font-mono break-all text-muted-foreground">
              {payment.customerId?._id}
            </p> */}
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              ORDER
            </p>

            <p className="mt-1 font-medium">
              {payment.orderId?.orderNumber || "—"}
            </p>

            {/* <p className="mt-1 text-xs font-mono break-all text-muted-foreground">
              {payment.orderId?._id}
            </p> */}
          </div>
        </div>

        {payment.refundAmount > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">REFUND AMOUNT</p>
            <p className="font-medium text-destructive">Rs. {payment.refundAmount}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-6 text-sm border-t border-border pt-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">CREATED AT</p>
            <p className="mt-1">{new Date(payment.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewPaymentModal;