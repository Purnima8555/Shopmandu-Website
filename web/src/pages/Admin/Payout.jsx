import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

import StatusBadge from "../../components/ui/StatusBadge";
import ViewPaymentModal from "../Admin/components/PaymentViewModal";
import Button from "../../components/ui/Button";
import ButtonRounded from "../../components/ui/ButtonRounded";
import Loader from "../../components/common/Loader";
import useAdminStore from "../../store/adminStore";

const STATUS_STYLE = {
  PAID: { tone: "success", label: "Paid" },
  PENDING: { tone: "warning", label: "Pending" },
  FAILED: { tone: "danger", label: "Failed" },
  REFUNDED: { tone: "info", label: "Refunded" },
};

const PaymentsPage = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { payments, loading, getAllPayments } = useAdminStore();

  useEffect(() => {
    getAllPayments();
  }, [getAllPayments]);

  if (loading) {
    return <Loader fullScreen text="Loading payments..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Payments</h1>

          <p className="mt-1 text-muted-foreground">
            View and manage all payment transactions.
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr_1fr_auto] gap-4 px-6 py-3 text-[11px] uppercase tracking-wide text-muted-foreground">
          <span>Order Number</span>
          <span>Amount</span>
          <span>Gateway</span>
          <span>Payment Method</span>
          <span>Status</span>
          <span>Paid At</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Table Rows */}
        {payments.map((payment) => {
          const status = STATUS_STYLE[payment.status] || {
            tone: "neutral",
            label: payment.status,
          };

          return (
            <div
              key={payment._id}
              className="grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr_1fr_auto] items-center gap-4 border-t border-border px-6 py-4 text-sm transition hover:bg-surface"
            >
              <p className="font-mono">{payment.orderNumber}</p>

              <p className="font-medium">
                {payment.currency === "NPR"
                  ? `Rs. ${payment.amount}`
                  : `$${payment.amount}`}
              </p>

              <p className="text-muted-foreground">
                {payment.gateway === "CASH_ON_DELIVERY"
                  ? "Cash on Delivery"
                  : payment.gateway}
              </p>

              <p className="text-muted-foreground">
                {payment.paymentMethod === "ONLINE"
                  ? "Online"
                  : "Cash on Delivery"}
              </p>

              <StatusBadge tone={status.tone}>
                {status.label}
              </StatusBadge>

              <p className="text-muted-foreground">
                {payment.paidAt
                  ? new Date(payment.paidAt).toLocaleDateString()
                  : "-"}
              </p>

              <div className="flex justify-end">
                <ButtonRounded
                  variant="ghost"
                  icon={Eye}
                  title="View Payment"
                  onClick={() => setSelectedPayment(payment)}
                />
              </div>
            </div>
          );
        })}

        {payments.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No payments found.
          </div>
        )}
      </div>

      {/* View Payment Modal */}
      {selectedPayment && (
        <ViewPaymentModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};

export default PaymentsPage;