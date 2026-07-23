import {Calendar,CreditCard,MapPin,Package,RotateCcw,Store,} from "lucide-react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import StatusBadge from "../../../components/ui/StatusBadge";
import { RETURN_STATUS, STATUS, } from "../data";
import { useNavigate } from "react-router-dom";
import { InfoCard, OrderStepper } from "../utils/profileHelper";


export default function OrderDetail({
  order,
  orderItems = [],
  onClose,
  onReturnItem,
}) {
  const navigate = useNavigate();

  if (!order) return null;

  const status = STATUS[order.orderStatus] || STATUS.PENDING;
  const canReturn = order.orderStatus === "DELIVERED";

  const hasReturnableProducts = orderItems.some((vendorGroup) =>
    vendorGroup.products.some((product) => !product.hasReturnRequest),
  );

  return (
    <Modal title="Order details" onClose={onClose} maxWidth="max-w-5xl">
      <div className="space-y-8">
        {/*  Header  */}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Order
            </p>
            <h2 className="text-lg text-[#23241F] font-semibold">
              {order.orderNumber}
            </h2>

            <span className="mt-2 flex items-center gap-2 text-sm text-[#6B6A63]">
              <Calendar size={14} />
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
        </div>

        {/*  Progress  */}

        <OrderStepper status={order.orderStatus} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/*  Shipping  Payment  */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoCard icon={MapPin} title="Shipping address">
                <div className="space-y-1 text-sm text-[#23241F]">
                  <p className="inline-block rounded-full bg-[#EAF0EC] px-2.5 py-0.5 text-xs font-medium text-primary">
                    {order.shippingAddress.addressType}
                  </p>
                  <p className="pt-1.5">{order.shippingAddress.location}</p>
                  <p className="text-[#6B6A63]">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  {order.shippingAddress.pincode && (
                    <p className="text-[#6B6A63]">
                      {order.shippingAddress.pincode}
                    </p>
                  )}
                  {order.shippingAddress.landmark && (
                    <p className="text-[#6B6A63]">
                      {order.shippingAddress.landmark}
                    </p>
                  )}
                  <p className="pt-2 font-medium">
                    {order.shippingAddress.mobile}
                  </p>
                </div>
              </InfoCard>

              <InfoCard
                icon={CreditCard}
                title="Payment"
                action={
                  order.paymentMethod === "ONLINE" &&
                  order.paymentStatus === "UNPAID" &&
                  order.orderStatus !== "CANCELLED" &&
                  order.orderStatus !== "FAILED" && 
                  (
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/payment/${order._id}`, {
                          state: { order: {...order} },
                        })
                      }
                    >
                      Pay Now
                    </Button>
                  )
                }
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="mb-0.5 text-xs text-[#6B6A63]">Method</p>

                    <p className="font-medium text-[#23241F]">
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-[#6B6A63]">Status</p>

                    <p className="font-medium text-[#23241F]">
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>
              </InfoCard>
            </div>

            {/*  Products  */}

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#23241F]">
                  <Package size={16} className="text-primary" />
                  Products
                </h3>

                {canReturn && hasReturnableProducts && (
                  <Button
                    icon={RotateCcw}
                    iconPosition="left"
                    onClick={() => {
                      onClose();
                      onReturnItem({ order, orderItems });
                    }}
                  >
                    Request return
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {orderItems.map((vendorGroup) => (
                  <div
                    key={vendorGroup._id}
                    className="overflow-hidden rounded-2xl border border-[#E7E3D8] bg-white"
                  >
                    <div className="flex items-center gap-2 border-b border-[#E7E3D8] bg-[#FCFBF9] px-5 py-3">
                      <Store size={14} className="text-[#6B6A63]" />
                      <p className="text-xs font-semibold text-[#23241F]">
                        {vendorGroup.vendorId.userName}
                      </p>
                    </div>

                    {vendorGroup.products.map((product) => (
                      <div
                        key={product.productId._id}
                        className="flex items-center gap-4 border-b border-[#EFEBE1] p-5 last:border-b-0"
                      >
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="h-20 w-20 rounded-xl border border-[#E7E3D8] object-cover"
                        />

                        <div className="flex-1">
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-medium text-[#23241F]">
                              {product.productName}
                            </h4>

                            {product.hasReturnRequest && (
                              <StatusBadge
                                tone={
                                  RETURN_STATUS[product.returnRequest.status]
                                    .tone
                                }
                              >
                                {
                                  RETURN_STATUS[product.returnRequest.status]
                                    .label
                                }
                              </StatusBadge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-xs text-[#6B6A63]">
                              Qty {product.quantity}
                            </span>
                            <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-xs text-[#6B6A63]">
                              Rs. {product.price}
                            </span>
                            {product.variant?.color && (
                              <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-xs text-[#6B6A63]">
                                {product.variant.color}
                              </span>
                            )}
                            {product.variant?.size && (
                              <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-xs text-[#6B6A63]">
                                Size {product.variant.size}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/*  Summary  */}

          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-[#E7E3D8] bg-white p-5">
              <h3 className="mb-5 text-sm font-semibold text-[#23241F]">
                Order summary
              </h3>

              <div className="space-y-3 text-sm text-[#23241F]">
                <div className="flex justify-between">
                  <span className="text-[#6B6A63]">Subtotal</span>
                  <span className="tabular-nums">Rs. {order.subTotal}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6B6A63]">Discount</span>
                  <span className="tabular-nums">
                    − Rs. {order.discountAmount}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6B6A63]">Shipping</span>
                  <span className="tabular-nums">
                    Rs. {order.shippingCharge}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6B6A63]">Tax</span>
                  <span className="tabular-nums">Rs. {order.taxAmount}</span>
                </div>
              </div>

              <div className="relative my-4 h-px border-t-2 border-dashed border-[#E7E3D8]">
                <span className="absolute -left-7.25 -top-3 h-4 w-4 rounded-full bg-[#FAF9F6]" />
                <span className="absolute -right-7.25 -top-3 h-4 w-4 rounded-full bg-[#FAF9F6]" />
              </div>

              <div className="flex justify-between text-base font-semibold text-[#23241F]">
                <span>Total</span>
                <span className="tabular-nums">Rs. {order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-[#E7E3D8] pt-6">
          <Button
            variant="outline"
            className="border-2 border-gray-300"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
