import { FiTag } from "react-icons/fi";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export const CouponBox = ({ couponCode, setCouponCode, onApply, message }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mt-5">
    <div className="flex items-center gap-2 mb-3">
      <FiTag className="text-primary" size={16} />
      <span className="text-sm font-medium text-foreground">Have a coupon?</span>
    </div>

    <Input
      type="text"
      placeholder="Coupon Code"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
    />

    <Button variant="secondary" className="w-full mt-3 cursor-pointer" onClick={onApply}>
      Apply Coupon
    </Button>

    {message && (
      <p className={`text-xs mt-2 ${message.type === "success" ? "text-primary" : "text-red-500"}`}>
        {message.text}
      </p>
    )}
  </div>
);