
import Drawer from "../../../components/ui/Drawer";
import StatusBadge from "../../../components/ui/StatusBadge";

const OrderDrawer = ({ order, onClose }) => {
  if (!order) return null;

  const orderTone =
    {
      PENDING: "warning",
      PROCESSING: "info",
      SHIPPED: "info",
      DELIVERED: "success",
      CANCELLED: "danger",
      RETURNED: "neutral",
    }[order.orderStatus?.toUpperCase()] || "neutral";

  const paymentTone =
    {
      PAID: "success",
      PENDING: "warning",
      FAILED: "danger",
      REFUNDED: "info",
    }[order.paymentStatus?.toUpperCase()] || "neutral";

  return (
    <Drawer
      isOpen={!!order}
      onClose={onClose}
      title="Order Details"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">

        {/* Order Information */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            Order Information
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <p className="text-xs text-muted-foreground">
                Order Number
              </p>
              <p className="font-mono break-all">
                {order.orderNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Payment Method
              </p>
              <p>{order.paymentMethod}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Order Status
              </p>

              <StatusBadge tone={orderTone}>
                {order.orderStatus}
              </StatusBadge>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Payment Status
              </p>

              <StatusBadge tone={paymentTone}>
                {order.paymentStatus}
              </StatusBadge>
            </div>

          </div>
        </section>

        {/* Shipping */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            Shipping Address
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <p className="text-xs text-muted-foreground">
                Address Type
              </p>
              <p>{order.shippingAddress?.addressType || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Mobile
              </p>
              <p>{order.shippingAddress?.mobile || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Location
              </p>
              <p>{order.shippingAddress?.location || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                City
              </p>
              <p>{order.shippingAddress?.city || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                State
              </p>
              <p>{order.shippingAddress?.state || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Pincode
              </p>
              <p>{order.shippingAddress?.pincode || "—"}</p>
            </div>

            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">
                Landmark
              </p>
              <p>{order.shippingAddress?.landmark || "—"}</p>
            </div>

          </div>
        </section>

        {/* Ordered Products */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            Ordered Products
          </h3>

          <div className="space-y-4">

            {order.items?.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex gap-4">

                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="h-20 w-20 rounded-lg border border-border object-cover"
                  />

                  <div className="flex-1">

                    <h4 className="font-medium">
                      {item.productName}
                    </h4>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Quantity
                        </p>
                        <p>{item.quantity}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Price
                        </p>
                        <p>Rs. {item.price}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Color
                        </p>
                        <p>{item.variant?.color || "—"}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Size
                        </p>
                        <p>{item.variant?.size || "—"}</p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">
                          Total
                        </p>
                        <p className="font-semibold">
                          Rs. {item.total}
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Payment Summary */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            Payment Summary
          </h3>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {order.subTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>Rs. {order.discountAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rs. {order.shippingCharge}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>Rs. {order.taxAmount}</span>
            </div>

            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Total</span>
              <span>Rs. {order.totalAmount}</span>
            </div>

          </div>
        </section>

        {/* Metadata */}
        <section className="border-t border-border pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <p className="text-xs text-muted-foreground">
                Created
              </p>

              <p>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Updated
              </p>

              <p>
                {order.updatedAt
                  ? new Date(order.updatedAt).toLocaleString()
                  : "—"}
              </p>
            </div>

          </div>
        </section>

      </div>
    </Drawer>
  );
};

export default OrderDrawer;