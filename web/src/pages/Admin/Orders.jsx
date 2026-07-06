import { useEffect, useState } from "react";
import { Search, PackageCheck, Clock, Truck, XCircle, CreditCard, Eye } from "lucide-react";

import useAdminStore from "../../store/adminStore";
import StatusBadge from "../../components/ui/StatusBadge";
import OrderDrawer from "../Admin/components/OrderDrawer";
import Button from "../../components/ui/Button";
import ButtonRounded from "../../components/ui/ButtonRounded";

const ORDER_STYLE = {
  PENDING: { tone: "warning", label: "Pending", icon: Clock },
  PROCESSING: { tone: "warning", label: "Processing", icon: Clock },
  CONFIRMED: { tone: "info", label: "Confirmed", icon: PackageCheck },
  OUT_FOR_DELIVERY: { tone: "info", label: "Out For Delivery", icon: Truck },
  DELIVERED: { tone: "success", label: "Delivered", icon: PackageCheck },
  CANCELLED: { tone: "danger", label: "Cancelled", icon: XCircle },
  RETURNED: { tone: "neutral", label: "Returned", icon: XCircle },
};

const PAYMENT_STYLE = {
  PAID: { tone: "success", label: "Paid" },
  PENDING: { tone: "warning", label: "Pending" },
  UNPAID: { tone: "neutral", label: "Unpaid" },
  REFUNDED: { tone: "danger", label: "Refunded" },
  FAILED: { tone: "danger", label: "Failed" },
};

const TABS = [
  "All Orders",
  "Pending",
  "Processing",
  "Delivered",
  "Cancelled",
];

const OrdersPage = () => {
  const {
    orders,
    loading,
    selectedOrder,
    getAllOrders,
    getOrderById,
  } = useAdminStore();

  const [tab, setTab] = useState("All Orders");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const status =
      tab === "All Orders" ||
      order.orderStatus?.toLowerCase() === tab.toLowerCase();

    const keyword = search.toLowerCase();

    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(keyword) ||
      order.customerId?.userName.toLowerCase().includes(keyword);

    return status && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Orders
        </h1>

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

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1.3fr_1fr_1fr_1.2fr_1fr_1fr_auto] gap-3 px-5 py-3 text-[11px] uppercase tracking-wide text-muted-foreground">
          <span>Order Number</span>
          <span>Customer</span>
          <span>Total</span>
          <span>Payment</span>
          <span>Status</span>
          <span>Address</span>
          <span>Date</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {filteredOrders.map((order) => {
          const orderStatus =
            ORDER_STYLE[order.orderStatus] || {
              tone: "neutral",
              label: order.orderStatus,
              icon: Clock,
            };

          const paymentStatus =
            PAYMENT_STYLE[order.paymentStatus] || {
              tone: "neutral",
              label: order.paymentStatus,
            };

          const OrderIcon = orderStatus.icon;

          return (
            <div
              key={order._id}
              className="grid grid-cols-[2fr_1.3fr_1fr_1fr_1.2fr_1fr_1fr_auto] items-center gap-3 border-t border-border px-5 py-3.5 text-sm hover:bg-surface transition"
            >
              <p className="truncate font-mono">
                {order.orderNumber}
              </p>

              <p className="truncate font-medium">
                {order.customerId?.userName || "Unknown"}
              </p>

              <p className="font-mono">
                Rs. {Number(order.totalAmount || 0).toLocaleString()}
              </p>

              <StatusBadge tone={paymentStatus.tone}>
                <CreditCard className="h-3 w-3" />
                {paymentStatus.label}
              </StatusBadge>

              <StatusBadge tone={orderStatus.tone}>
                <OrderIcon className="h-3 w-3" />
                {orderStatus.label}
              </StatusBadge>

              <p className="truncate text-muted-foreground">
                {order.city || order.shippingAddress?.city || "-"}
              </p>

              <p className="text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="flex justify-end">
                <ButtonRounded
                  variant="outline"
                  icon={Eye}
                  title="View Order"
                  onClick={() => getOrderById(order._id)}
                />
              </div>
            </div>
          );
        })}

        {!loading && filteredOrders.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No orders found.
          </div>
        )}
      </div>

      <OrderDrawer
        order={selectedOrder}
        onClose={() =>
          useAdminStore.setState({ selectedOrder: null })
        }
      />
    </div>
  );
};

export default OrdersPage;