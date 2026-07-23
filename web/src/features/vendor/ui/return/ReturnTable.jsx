import { ChevronRight, PackageSearch } from "lucide-react";

import StatusBadge from "../../../../components/ui/StatusBadge";
import { RETURN_STATUS } from "../../data";

const ReturnTable = ({ returns = [], onView }) => {
  return (
    <div className="bg-bg-card rounded-[14px] border border-border shadow-sm overflow-hidden">
      {returns.length ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-main border-b border-border">
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Order
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Product
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Customer
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Refund
                </th>

                <th className="px-6 py-3.5 text-center text-xs font-bold uppercase text-text-secondary">
                  Status
                </th>

                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase text-text-secondary">
                  Requested
                </th>

                <th className="px-6 py-3.5 text-right text-xs font-bold uppercase text-text-secondary">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {returns.map((request) => {
                const status = RETURN_STATUS[request.status] || {
                  tone: "neutral",
                  label: request.status,
                };

                return (
                  <tr
                    key={request._id}
                    className="hover:bg-slate-50 transition"
                  >
                    {/* Order */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm">
                        {request.orderId?.orderNumber}
                      </p>

                      <p className="text-xs text-text-secondary">
                        #{request._id.slice(-6)}
                      </p>
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            request.productId?.images?.[0] ||
                            "/placeholder-product.png"
                          }
                          alt={request.productId?.name}
                          className="w-12 h-12 rounded-lg border border-border object-cover"
                        />

                        <div>
                          <p className="font-semibold text-sm whitespace-nowrap">
                            {request.productId?.name || "Product"}
                          </p>

                          <p className="text-xs text-text-secondary">
                            Rs. {request.unitPrice}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">
                        {request.customerId?.userName}
                      </p>

                      <p className="text-xs text-text-secondary">
                        {request.customerId?.email}
                      </p>
                    </td>

                    {/* Refund */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold">
                        Rs. {request.refundAmount}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge tone={status.tone}>
                        {status.label}
                      </StatusBadge>
                    </td>

                    {/* Requested */}
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => onView(request)}
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

          <h3 className="text-lg font-semibold">No Return Requests</h3>

          <p className="text-sm text-text-secondary">
            There are no return requests available at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReturnTable;
