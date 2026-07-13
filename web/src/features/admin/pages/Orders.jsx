import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../../../components/ui/Button";
import ButtonRounded from "../../../components/ui/ButtonRounded";
import StatusBadge from "../../../components/ui/StatusBadge";
import OrderDrawer from "../components/OrderDrawer";

import useOrderStore from "../../../store/orderStore";
import sendApiRequest from "../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../utils/toast";

const ORDER_STYLE = {
  PENDING: { tone: "warning", label: "Pending" },
  PROCESSING: { tone: "warning", label: "Processing" },
  CONFIRMED: { tone: "info", label: "Confirmed" },
  OUT_FOR_DELIVERY: { tone: "info", label: "Out For Delivery" },
  DELIVERED: { tone: "success", label: "Delivered" },
  CANCELLED: { tone: "danger", label: "Cancelled" },
  RETURNED: { tone: "neutral", label: "Returned" },
};

const PAYMENT_STYLE = {
  PAID: { tone: "success", label: "Paid" },
  PENDING: { tone: "warning", label: "Pending" },
  UNPAID: { tone: "neutral", label: "Unpaid" },
  REFUNDED: { tone: "danger", label: "Refunded" },
  FAILED: { tone: "danger", label: "Failed" },
  EXPIRED: { tone: "neutral", label: "Expired" },
};

const STATUS_STYLES = {
  success: "bg-success/10 text-success border border-success/20",
  warning: "bg-warning/10 text-warning border border-warning/20",
  danger: "bg-danger/10 text-danger border border-danger/20",
  info: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
  primary: "bg-primary/10 text-primary border border-primary/20",
  neutral: "bg-muted text-muted-foreground border border-border",
};

const ADMIN_STATUSES = [
  "PENDING",
  "PROCESSING",
  "CONFIRMED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

const TABS = ["All Orders", "Pending", "Processing", "Delivered", "Cancelled"];

const OrdersPage = () => {
  const {
    orders,
    loading,
    selectedOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
  } = useOrderStore();

  const [tab, setTab] = useState("All Orders");
  const [search, setSearch] = useState("");

  useEffect(() => {
    sendApiRequest(() => getAllOrders());
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      tab === "All Orders" ||
      order.orderStatus?.toLowerCase() === tab.toLowerCase();

    const keyword = search.toLowerCase();

    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(keyword) ||
      order.customerId?.userName?.toLowerCase().includes(keyword);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor and manage all customer orders across the marketplace.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted p-1">
            {TABS.map((t) => (
              <Button
                key={t}
                variant={tab === t ? "primary" : "ghost"}
                size="sm"
                onClick={() => setTab(t)}
                className="px-4 py-1.5 text-xs"
              >
                {t}
              </Button>
            ))}
          </div>

          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Real Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Total
              </th>
              <th className="px-6 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Payment
              </th>
              <th className="px-6 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => {
              const orderStatus = ORDER_STYLE[order.orderStatus] || {
                tone: "neutral",
                label: order.orderStatus,
              };

              const paymentStatus = PAYMENT_STYLE[order.paymentStatus] || {
                tone: "neutral",
                label: order.paymentStatus,
              };

              return (
                <tr key={order._id} className="border-t border-border">
                  <td className="w-60 px-4 py-4 font-mono">
                    {order.orderNumber}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {order.customerId?.userName || "Unknown"}
                  </td>

                  <td className="px-6 py-4">
                    Rs. {Number(order.totalAmount || 0).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge tone={paymentStatus.tone}>
                      {paymentStatus.label}
                    </StatusBadge>
                  </td>

                  {/* Status Dropdown styled as Badge */}
                  <td className="px-6 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        if (newStatus === order.orderStatus) return;

                        const res = await sendApiRequest(() =>
                          updateOrderStatus(order._id, newStatus),
                        );

                        if (res) {
                          dismissToast();
                          showSuccess("Order status updated successfully.");
                        }
                      }}
                      className={`rounded-full w-35 items-center justify-center border px-2.5 py-0.5 text-xs font-medium outline-none transition ${
                        STATUS_STYLES[orderStatus.tone]
                      }`}
                    >
                      {ADMIN_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4 text-muted-foreground truncate">
                    {order.city || order.shippingAddress?.city || "-"}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <ButtonRounded
                      variant="ghost"
                      icon={Eye}
                      size="sm"
                      title="View Order"
                      className="cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        sendApiRequest(() => getOrderById(order._id))
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && filteredOrders.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No orders found.
          </div>
        )}
      </div>

      <OrderDrawer
        order={selectedOrder}
        onClose={() => useOrderStore.setState({ selectedOrder: null })}
      />
    </div>
  );
};

export default OrdersPage;
