import {
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Receipt,
} from "lucide-react";
import {  useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/ui/Button";

const PaymentSuccess = () => {
  const { order } = useParams();

  const navigate = useNavigate()

  return (
    <section className="min-h-[calc(100vh-72px)] bg-gray-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-border shadow-sm p-10">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2
              size={44}
              className="text-green-600"
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Successful
          </h1>

          <p className="mt-3 text-gray-500 leading-7">
            Thank you for your purchase. Your payment has been successfully
            verified and your order is now being processed.
          </p>
        </div>

        {/* Order Card */}
        <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              <Receipt className="text-green-600" size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold text-gray-900 break-all">{order}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Payment has been confirmed.
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Your order is being prepared.
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            You'll receive order updates shortly.
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button icon={ArrowRight} iconPosition="right" iconsize={20} onClick={()=>navigate("/profile")} >View Order</Button>
          <Button icon={ShoppingBag} iconPosition="left" iconsize={20} onClick={()=>navigate("/products")} variant="secondary" >Continue Shopping</Button>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;