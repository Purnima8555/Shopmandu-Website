import {
  ChevronRight,
  PackageSearch,
  Download,
} from "lucide-react";
import ButtonRounded from "../../../components/ui/ButtonRounded";
import useOrderStore from "../../../store/orderStore";
import sendApiRequest from "../../../utils/sendApiRequest";
import StatusBadge from "../../../components/ui/StatusBadge";
import { ORDER_STATUS, PAYMENT_STATUS } from "../data";
import { useState } from "react";


const OrderTable = ({ orders = [], onView }) => {
  const [downloadingInvoice, setDownloadingInvoice] = useState("");

  const { downloadVendorInvoice } = useOrderStore();

  const handleDownloadInvoice = async (orderItemId) => {
    setDownloadingInvoice(orderItemId);

    try {
      await sendApiRequest(() => downloadVendorInvoice(orderItemId));
    } finally {
      setDownloadingInvoice("");
    }
  };

  return (
    <div className="bg-bg-card rounded-[14px] border border-border shadow-sm overflow-hidden">
      {orders.length ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-main border-b border-border">
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Order
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Products
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Quantity
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Total
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Payment
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Status
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Date
                </th>

                <th className="px-6 py-3.5 text-right text-xs font-bold uppercase text-text-secondary">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {orders.map((order) => {
                const totalQty = order.products.reduce(
                  (sum, p) => sum + p.quantity,
                  0,
                );

                return (
                  <tr key={order._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm">
                        {order.orderId.orderNumber}
                      </p>

                      <p className="text-xs text-text-secondary">
                        #{order._id.slice(-6)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {order.products.slice(0, 3).map((p, index) => (
                          <img
                            key={index}
                            src={p.productImage}
                            alt={p.productName}
                            className={`w-10 h-10 rounded-lg object-cover border border-white ${
                              index > 0 ? "-ml-3" : ""
                            }`}
                          />
                        ))}

                        {order.products.length > 3 && (
                          <div className="-ml-3 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-semibold">
                            +{order.products.length - 3}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium">
                      {totalQty} Items
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      Rs. {order.totalPrice.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        tone={
                          PAYMENT_STATUS[order.paymentStatus]?.tone ??
                          "neutral"
                        }
                      >
                        {PAYMENT_STATUS[order.paymentStatus]?.label ??
                          order.paymentStatus}
                      </StatusBadge>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        tone={
                          ORDER_STATUS[order.orderItemsStatus]?.tone ??
                          "neutral"
                        }
                      >
                        {ORDER_STATUS[order.orderItemsStatus]?.label ??
                          order.orderItemsStatus}
                      </StatusBadge>
                    </td>

                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <ButtonRounded
                          title={
                            downloadingInvoice === order._id
                              ? "Generating Invoice..."
                              : "Download Invoice"
                          }
                          icon={Download}
                          iconSize={10}
                          variant="ghost"
                          className="hover:text-secondary-foreground/50"
                          size="sm"
                          disabled={downloadingInvoice === order._id}
                          onClick={() => handleDownloadInvoice(order._id)}
                        />
                        <button
                          onClick={() => onView(order)}
                          className="flex items-center gap-1 text-primary cursor-pointer hover:underline text-sm font-medium"
                        >
                          Manage
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mx-auto max-w-md p-12 text-center space-y-4">
          <PackageSearch className="w-14 h-14 mx-auto text-slate-300" />

          <h3 className="text-lg font-semibold">No Orders Found</h3>

          <p className="text-sm text-text-secondary">
            There are no orders available at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
