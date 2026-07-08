import { Info } from "lucide-react";
import { useEffect, useState } from "react";

import Loader from "../../../components/common/Loader";
import ButtonRounded from "../../../components/ui/ButtonRounded";
import StatusBadge from "../../../components/ui/StatusBadge";
import usePaymentStore from "../../../store/paymentStore";
import ViewPaymentModal from "../components/PaymentViewModal";

const STATUS_STYLE = {
  PAID: { tone: "success", label: "Paid" },
  PENDING: { tone: "warning", label: "Pending" },
  FAILED: { tone: "danger", label: "Failed" },
  REFUNDED: { tone: "info", label: "Refunded" },
};

const PaymentsPage = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { payments, loading, getAllPayments } = usePaymentStore();

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
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Gateway
              </th>
              <th className="px-6 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Payment Method
              </th>
              <th className="px-6 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Paid At
              </th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => {
              const status = STATUS_STYLE[payment.status] || {
                tone: "neutral",
                label: payment.status,
              };

              return (
                <tr key={payment._id} className="border-t border-border">
                  <td className="px-6 py-4 font-mono">{payment.orderNumber}</td>

                  <td className="px-6 py-4">
                    {payment.currency === "NPR"
                      ? `Rs. ${payment.amount}`
                      : `$${payment.amount}`}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground text-center">
                    {payment.gateway === "CASH_ON_DELIVERY"
                      ? "Cash on Delivery"
                      : payment.gateway}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground text-center">
                    {payment.paymentMethod === "ONLINE"
                      ? "Online"
                      : "Cash on Delivery"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </td>

                  <td className="px-6 py-4 text-muted-foreground text-center">
                    {payment.paidAt ? (
                      new Date(payment.paidAt).toLocaleDateString()
                    ) : (
                      <span className="text-lg">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <ButtonRounded
                      variant="ghost"
                      size="sm"
                      icon={Info}
                      title="View Payment"
                      className="cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedPayment(payment)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

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
