import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../../../components/ui/Button";
import ButtonRounded from "../../../components/ui/ButtonRounded";
import Popup from "../../../components/ui/Popup";
import StatusBadge from "../../../components/ui/StatusBadge";
import OrderDrawer from "../components/OrderDrawer";

import useOrderStore from "../../../store/orderStore";
import sendApiRequest from "../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../utils/toast";
import { ADMIN_STATUS_TRANSITIONS, ORDER_STYLE, PAYMENT_STYLE, STATUS_STYLES, TABS, } from "../data";
import AdminPagination from "../components/AdminPagination";

const OrdersPage = () => {
  const {
    orders,
    loading,
    selectedOrder,
    getAllOrders,
    getOrderById,
    orderMetadata,
    updateOrderStatus,
  } = useOrderStore();

  const [tab, setTab] = useState("All Orders");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Popup State
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("");

  useEffect(() => {
    const params = {
      page,
      limit,
    };

    if (tab !== "All Orders") {
      params.orderStatus = tab.toUpperCase().replace(/ /g, "_");
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    sendApiRequest(() => getAllOrders(params));
  }, [page, limit, tab, search, getAllOrders]);

  const handleConfirmStatusUpdate = async () => {
    if (!selectedOrderForStatus || !pendingStatus) return;

    const res = await sendApiRequest(() =>
      updateOrderStatus(selectedOrderForStatus._id, pendingStatus)
    );

    if (res) {
      dismissToast();
      showSuccess("Order status updated successfully.");
    }

    setShowStatusPopup(false);
    setSelectedOrderForStatus(null);
    setPendingStatus("");
  };

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
                onClick={() => {
                  setTab(t);
                  setPage(1);
                }}
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search orders..."
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <AdminPagination
          data={orders}
          metadata={orderMetadata}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          refreshData={() =>
            getAllOrders({
              page,
              limit,
              ...(tab !== "All Orders" && {
                orderStatus: tab.toUpperCase().replace(/ /g, "_"),
              }),
              ...(search.trim() && {
                search: search.trim(),
              }),
            })
          }
        />

        {/* Orders Table */}
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
            {orders?.map((order) => {
              const orderStatus =
                ORDER_STYLE[order.orderStatus] || {
                  tone: "neutral",
                  label: order.orderStatus,
                };

              const paymentStatus =
                PAYMENT_STYLE[order.paymentStatus] || {
                  tone: "neutral",
                  label: order.paymentStatus,
                };
              
              const allowedStatuses = ADMIN_STATUS_TRANSITIONS[order.orderStatus] || [];
              const canUpdateStatus = allowedStatuses.length > 0;

              return (
                <tr
                  key={order._id}
                  className="border-t border-border"
                >
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
                  {/* Status */}
                  <td className="px-6 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value;

                        if (newStatus === order.orderStatus) return;

                        // Keep dropdown unchanged until confirmed
                        e.target.value = order.orderStatus;

                        setSelectedOrderForStatus(order);
                        setPendingStatus(newStatus);
                        setShowStatusPopup(true);
                      }}
                      className={`w-35 rounded-full border px-2.5 py-0.5 text-xs font-medium outline-none transition ${
                        STATUS_STYLES[orderStatus.tone]
                      }`}
                    >
                      {[order.orderStatus,
                        ...allowedStatuses,
                        ].map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="truncate px-6 py-4 text-muted-foreground">
                    {order.city ||
                      order.shippingAddress?.city ||
                      "-"}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <ButtonRounded
                      variant="ghost"
                      icon={Eye}
                      size="sm"
                      title="View Order"
                      className="cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        sendApiRequest(() =>
                          getOrderById(order._id)
                        )
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && orders?.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No orders found.
          </div>
        )}
      </div>

      {/* Change Status Popup */}
      <Popup
        isOpen={showStatusPopup}
        onClose={() => {
          setShowStatusPopup(false);
          setSelectedOrderForStatus(null);
          setPendingStatus("");
        }}
        title="Update Order Status"
        showFooter
        confirmText="Yes, Update"
        cancelText="Cancel"
        onConfirm={handleConfirmStatusUpdate}
      >
        <p>
          Are you sure you want to change this order's status to{" "}
          <span className="font-semibold">
            {pendingStatus.replace(/_/g, " ")}
          </span>
          ?
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          This change will immediately update the customer's order status.
        </p>
      </Popup>

      <OrderDrawer
        order={selectedOrder}
        onClose={() =>
          useOrderStore.setState({
            selectedOrder: null,
          })
        }
      />
    </div>
  );
};

export default OrdersPage;