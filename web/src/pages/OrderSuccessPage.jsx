import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { OrderConfirmationCard } from "../features/order/components/OrderConfirmationCard";
import { InvoiceDownloadCard } from "../features/order/components/InvoiceDownloadCard";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const handleDownloadInvoice = () => {
    // TODO: wire up to invoice API — fetch and download PDF for order.orderNumber
    console.log("Downloading invoice for order:", order?.orderNumber);
  };

  // If someone lands here directly (refresh, bookmarked link) there's no
  // order in navigation state — send them somewhere useful instead of
  // showing broken/mock data.
  if (!order) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground">No order found</h1>
          <p className="mt-2 text-muted-foreground">
            We couldn't find order details for this page. If you just placed an order, check your order
            history instead.
          </p>
          <Button className="mt-6 cursor-pointer" onClick={() => navigate("/orders")}>
            View Order History
          </Button>
        </div>
      </div>
    );
  }

  const placedAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-background">
      <div className="max-w-md w-full py-12">
        <OrderConfirmationCard
          orderId={order.orderNumber}
          placedAt={placedAt}
          // Order.model.js has no delivery-estimate field — showing a generic
          // message instead of a fabricated date range.
          estimatedDelivery="We'll notify you once your order ships"
        />

        <InvoiceDownloadCard onDownload={handleDownloadInvoice} />

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button className="w-full cursor-pointer" onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
          <Button variant="secondary" className="w-full cursor-pointer" onClick={() => navigate("/orders")}>
            View Order History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
