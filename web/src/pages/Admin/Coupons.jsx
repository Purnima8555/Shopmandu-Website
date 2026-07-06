import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";

import useAdminStore from "../../store/adminStore";
import StatusBadge from "../../components/ui/StatusBadge";
import CreateCouponModal from "../Admin/components/CreateCouponModal";
import Button from "../../components/ui/Button";
import ButtonRounded from "../../components/ui/ButtonRounded";

const STATUS_STYLE = {
  active: {
    tone: "success",
    label: "Active",
  },
  inactive: {
    tone: "neutral",
    label: "Inactive",
  },
  expired: {
    tone: "danger",
    label: "Expired",
  },
};

const CouponsPage = () => {
  const [showModal, setShowModal] = useState(false);

  const {
    coupons,
    loading,
    getAllCoupons,
    deleteCoupon,
  } = useAdminStore();

  useEffect(() => {
    getAllCoupons();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            Coupons
          </h1>

          <p className="mt-1 text-muted-foreground">
            Create and manage marketplace coupons.
          </p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          icon={Plus}
          iconPosition="left"
        >
          Create Coupon
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Header */}
        <div className="grid grid-cols-[1.2fr_1fr_1.2fr_1fr_1fr_1fr_0.9fr_auto] gap-4 px-6 py-3 text-xs uppercase tracking-wide text-muted-foreground">
          <span>Coupon Code</span>
          <span>Discount</span>
          <span>Minimum Order</span>
          <span>Usage</span>
          <span>Per User</span>
          <span>Expires</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {coupons.map((coupon) => {
          const expired =
            coupon.expiresAt &&
            new Date(coupon.expiresAt) < new Date();

          const statusKey = expired
            ? "expired"
            : coupon.isActive
            ? "active"
            : "inactive";

          const status = STATUS_STYLE[statusKey];

          return (
            <div
              key={coupon._id}
              className="grid grid-cols-[1.2fr_1fr_1.2fr_1fr_1fr_1fr_0.9fr_auto] items-center gap-4 border-t border-border px-6 py-4 text-sm hover:bg-surface transition"
            >
              {/* Coupon Code */}
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs">
                  {coupon.code}
                </span>

                <ButtonRounded
                  variant="ghost"
                  size="sm"
                  icon={Copy}
                  iconSize={5}
                  title="Copy Code"
                  onClick={() =>
                    navigator.clipboard.writeText(coupon.code)
                  }
                />
              </div>

              {/* Discount */}
              <div className="font-medium">
                {coupon.discountType === "PERCENTAGE"
                  ? `${coupon.discountValue}%`
                  : `Rs. ${coupon.discountValue}`}
              </div>

              {/* Minimum Order */}
              <span>
                Rs. {coupon.minOrderAmount.toLocaleString()}
              </span>

              {/* Usage */}
              <span>
                {coupon.usedCount} /{" "}
                {coupon.usageLimit ?? "Unlimited"}
              </span>

              {/* Per User */}
              <span>
                {coupon.perUserLimit ?? "-"}
              </span>

              {/* Expiry */}
              <span
                className={
                  expired
                    ? "text-destructive"
                    : "text-muted-foreground"
                }
              >
                {coupon.expiresAt
                  ? new Date(
                      coupon.expiresAt
                    ).toLocaleDateString()
                  : "No Expiry"}
              </span>

              {/* Status */}
              <StatusBadge tone={status.tone}>
                {status.label}
              </StatusBadge>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <ButtonRounded
                  variant="outline"
                  size="sm"
                  iconSize={10}
                  icon={Pencil}
                  title="Edit"
                />

                <ButtonRounded
                  variant="outline"
                  size="sm"
                  iconSize={10}
                  icon={Trash2}
                  title="Delete"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() =>
                    deleteCoupon(coupon._id)
                  }
                />
              </div>
            </div>
          );
        })}

        {!loading && coupons.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No coupons found.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CreateCouponModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CouponsPage;