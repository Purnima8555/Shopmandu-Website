import Drawer from "../../../components/ui/Drawer";
import StatusBadge from "../../../components/ui/StatusBadge";

import useOrderStore from "../../../store/orderStore";
import sendApiRequest from "../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../utils/toast";

import { ORDER_STYLE, STATUS_STYLES, VENDOR_STATUS_TRANSITIONS } from "../data";

function Field({ label, children, span }) {
  return (
    <div className={span ? "col-span-2" : undefined}>
      <p className="mb-0.5 text-xs text-muted-foreground">{label}</p>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

const VendorOrderDrawer = ({ order, onClose, refreshOrders }) => {
  const { updateVendorOrderItemStatus } = useOrderStore();

  if (!order) return null;

  const orderStatus = ORDER_STYLE[order.orderItemsStatus] || {
    tone: "neutral",
    label: order.orderItemsStatus,
  };

  const paymentTone =
    {
      PAID: "success",
      PENDING: "warning",
      FAILED: "danger",
      REFUNDED: "info",
      UNPAID: "danger",
      EXPIRED: "neutral",
    }[order.paymentStatus?.toUpperCase()] || "neutral";

  const availableStatuses = VENDOR_STATUS_TRANSITIONS[
    order.orderItemsStatus
  ] || [order.orderItemsStatus];

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    if (newStatus === order.orderItemsStatus) return;

    const res = await sendApiRequest(() =>
      updateVendorOrderItemStatus(order._id, newStatus),
    );

    if (res) {
      dismissToast();
      showSuccess("Order status updated successfully.");

      refreshOrders?.();

      onClose();
    }
  };

  return (
    <Drawer
      isOpen={!!order}
      onClose={onClose}
      title="Order details"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Order Information */}
        <Section title="Order information">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Order number">
              <span className="break-all font-mono">
                {order.orderId?.orderNumber || "—"}
              </span>
            </Field>

            <Field label="Payment method">
              {order.orderId?.paymentMethod || "—"}
            </Field>

            <Field label="Order status">
              <div className="relative inline-block">
                <select
                  value={order.orderItemsStatus}
                  onChange={handleStatusChange}
                  className={`inline-flex w-30 cursor-pointer items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium outline-none ${STATUS_STYLES[orderStatus.tone]}`}
                >
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </Field>

            <Field label="Payment status">
              <StatusBadge tone={paymentTone}>
                {order.paymentStatus}
              </StatusBadge>
            </Field>
          </div>
        </Section>

        {/* Shipping */}
        <Section title="Shipping address">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Address type">
              {order.orderId?.shippingAddress?.addressType || "—"}
            </Field>

            <Field label="Mobile">
              {order.orderId?.shippingAddress?.mobile || "—"}
            </Field>

            <Field label="Location">
              {order.orderId?.shippingAddress?.location || "—"}
            </Field>

            <Field label="City">
              {order.orderId?.shippingAddress?.city || "—"}
            </Field>

            <Field label="State">
              {order.orderId?.shippingAddress?.state || "—"}
            </Field>

            <Field label="Pincode">
              {order.orderId?.shippingAddress?.pincode || "—"}
            </Field>

            <Field label="Landmark" span>
              {order.orderId?.shippingAddress?.landmark || "—"}
            </Field>
          </div>
        </Section>

        {/* Ordered Products */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Ordered products
          </h3>

          <div className="space-y-4">
            {order.products?.map((item, index) => (
              <div key={index} className="rounded-xl border border-border p-4">
                <div className="flex gap-4">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="h-20 w-20 shrink-0 rounded-lg border border-border object-cover"
                  />

                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">
                      {item.productName}
                    </h4>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted-foreground">
                        Qty {item.quantity}
                      </span>
                      <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted-foreground">
                        Rs. {item.price}
                      </span>
                      {item.variant?.color && (
                        <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted-foreground">
                          {item.variant.color}
                        </span>
                      )}
                      {item.variant?.size && (
                        <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted-foreground">
                          Size {item.variant.size}
                        </span>
                      )}
                    </div>

                    <p className="mt-2.5 text-sm font-semibold text-primary">
                      Rs. {item.total} total
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Summary */}
        <Section title="Payment summary">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>Rs. {(order.totalPrice ?? 0).toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span>—</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>—</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>Rs. {(order.taxAmount ?? 0).toLocaleString()}</span>
            </div>

            <div className="flex justify-between border-t border-dashed border-border pt-3 text-base font-semibold text-foreground">
              <span>Total</span>
              <span>Rs. {(order.totalPrice ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </Section>

        {/* Metadata */}
        <Section title="Metadata">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Created">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "—"}
            </Field>

            <Field label="Updated">
              {order.updatedAt
                ? new Date(order.updatedAt).toLocaleString()
                : "—"}
            </Field>
          </div>
        </Section>
      </div>
    </Drawer>
  );
};

export default VendorOrderDrawer;
