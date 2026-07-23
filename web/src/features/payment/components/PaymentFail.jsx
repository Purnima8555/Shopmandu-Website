import { XCircle, Package, ShoppingBag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/ui/Button";

const PaymentFail = () => {
  const { order } = useParams();
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-72px)] bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
          {/* Top Failure Banner */}
          <div className="relative bg-linear-to-r from-red-500 to-orange-500 px-8 py-12 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
              <XCircle size={60} className="text-red-500" strokeWidth={2.5} />
            </div>

            <h1 className="mt-6 text-4xl font-bold text-white">
              Payment Failed
            </h1>

            <p className="mt-3 text-red-100 max-w-md">
              We were unable to verify your payment. No charges will be applied
              unless the transaction was completed successfully.
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="rounded-2xl bg-gray-50 border border-border p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                  <Package className="text-red-500" size={28} />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <h2 className="font-semibold text-lg break-all">
                    {order || "Unavailable"}
                  </h2>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3 text-sm text-muted-foreground">
              <p>• The payment could not be completed.</p>
              <p>• Please check your payment details and try again.</p>
              <p>
                • If money was deducted, it may be refunded automatically by the
                payment provider.
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                icon={ShoppingBag}
                iconPosition="left"
                iconsize={20}
                onClick={() => navigate("/products")}
                variant="secondary"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentFail;
