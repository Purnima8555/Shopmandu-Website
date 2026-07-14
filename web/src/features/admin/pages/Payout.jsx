import {
  Info,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

import ButtonRounded from "../../../components/ui/ButtonRounded";
import StatusBadge from "../../../components/ui/StatusBadge";
import usePaymentStore from "../../../store/paymentStore";
import ViewPaymentModal from "../components/PaymentViewModal";
import Selecter from "../../../components/ui/Selecter";
import {
  gatewayOption,
  PAYMENT_STATUS_STYLE,
  paymentMethodOption,
  paymentStatusOption,
} from "../data";
import AdminPagination from "../components/AdminPagination";

const PaymentsPage = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { payments, paymentMetadata, getAllPayments } = usePaymentStore();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [gateway, setGateway] = useState("");

  useEffect(() => {
    const params = {
      page,
      limit,
      ...(search.trim() && { search: search.trim() }),
      ...(status && { status }),
      ...(paymentMethod && { paymentMethod }),
      ...(gateway && { gateway }),
    };

    getAllPayments(params);
  }, [page, limit, search, getAllPayments, status, paymentMethod, gateway]);

  // if (loading) {
  //   return <Loader fullScreen text="Loading payments..." />;
  // }

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

      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search payment..."
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Selecter
              size="sm"
              className="max-w-30"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              {paymentStatusOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Selecter>

            <Selecter
              size="sm"
              className="max-w-30"
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPage(1);
              }}
            >
              {paymentMethodOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Selecter>

            <Selecter
              size="sm"
              className="max-w-30"
              value={gateway}
              onChange={(e) => {
                setGateway(e.target.value);
                setPage(1);
              }}
            >
              {gatewayOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Selecter>
          </div>
        </div>

        <AdminPagination
          data={payments}
          metadata={paymentMetadata}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          refreshData={() =>
            getAllPayments({
              page,
              limit,
              ...(search.trim() && {
                search: search.trim(),
              }),
              ...(status && {
                status,
              }),
              ...(paymentMethod && {
                paymentMethod,
              }),
              ...(gateway && {
                gateway,
              }),
            })
          }
        />

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
                const status = PAYMENT_STATUS_STYLE[payment.status] || {
                  tone: "neutral",
                  label: payment.status,
                };

                return (
                  <tr key={payment._id} className="border-t border-border">
                    <td className="px-6 py-4 font-mono">
                      {payment.orderNumber}
                    </td>

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
                      <StatusBadge tone={status.tone}>
                        {status.label}
                      </StatusBadge>
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
