import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../../../components/ui/Button";
import ButtonRounded from "../../../components/ui/ButtonRounded";
import StatusBadge from "../../../components/ui/StatusBadge";

import CreateCouponModal from "../components/CreateCouponModal";

import useCouponStore from "../../../store/couponStore";

import sendApiRequest from "../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../utils/toast";

const STATUS_STYLE = {
  active: { tone: "success", label: "Active" },
  inactive: { tone: "neutral", label: "Inactive" },
  expired: { tone: "danger", label: "Expired" },
};

const CouponsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const { coupons, loading, getAllCoupons, getCouponById, deleteCoupon } =
    useCouponStore();

  useEffect(() => {
    getAllCoupons();
  }, []);

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setShowModal(true);
  };

  const handleEditCoupon = async (couponId) => {
    const res = await sendApiRequest(() => getCouponById(couponId));
    if (!res) return;

    setEditingCoupon(res.data);
    setShowModal(true);
  };

  const handleDeleteCoupon = async (couponId) => {
    const res = await sendApiRequest(() => deleteCoupon(couponId));

    if (res) {
      dismissToast();
      showSuccess("Coupon deleted successfully.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Coupons</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage marketplace coupons.
          </p>
        </div>

        <Button onClick={handleCreateCoupon} icon={Plus} iconPosition="left">
          Create Coupon
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Coupon Code
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Minimum Order
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Per User
              </th>
              <th className="px-6 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Expires
              </th>
              <th className="px-6 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((coupon) => {
              const expired =
                coupon.expiresAt && new Date(coupon.expiresAt) < new Date();

              const statusKey = expired
                ? "expired"
                : coupon.isActive
                  ? "active"
                  : "inactive";

              const status = STATUS_STYLE[statusKey];

              return (
                <tr key={coupon._id} className="border-t border-border">
                  {/* Coupon Code */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs">
                        {coupon.code}
                      </span>

                      <ButtonRounded
                        variant="ghost"
                        size="sm"
                        icon={Copy}
                        title="Copy Code"
                        className="cursor-pointer"
                        onClick={() =>
                          navigator.clipboard.writeText(coupon.code)
                        }
                      />
                    </div>
                  </td>

                  {/* Discount */}
                  <td className="px-6 py-4 font-medium">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}%`
                      : `Rs. ${coupon.discountValue}`}
                  </td>

                  {/* Minimum Order */}
                  <td className="px-6 py-4">
                    Rs. {coupon.minOrderAmount.toLocaleString()}
                  </td>

                  {/* Usage */}
                  <td className="px-6 py-4">
                    {coupon.usedCount} / {coupon.usageLimit ?? "Unlimited"}
                  </td>

                  {/* Per User */}
                  <td className="px-6 py-4 text-center">
                    {coupon.perUserLimit ?? "-"}
                  </td>

                  {/* Expiry */}
                  <td
                    className={`px-6 py-4 text-center ${expired ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString()
                      : "No Expiry"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <ButtonRounded
                        variant="ghost"
                        size="sm"
                        icon={Pencil}
                        title="Edit"
                        className="cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                        onClick={() => handleEditCoupon(coupon._id)}
                      />

                      <ButtonRounded
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        title="Delete"
                        className="cursor-pointer border border-border text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteCoupon(coupon._id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && coupons.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No coupons found.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CreateCouponModal
          coupon={editingCoupon}
          onClose={() => {
            setShowModal(false);
            setEditingCoupon(null);
          }}
        />
      )}
    </div>
  );
};

export default CouponsPage;
