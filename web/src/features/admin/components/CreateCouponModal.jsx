import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

import useCouponStore from "../../../store/couponStore";
import { createCouponSchema } from "../../../schemas/coupon.validation";

import sendApiRequest from "../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../utils/toast";

const CreateCouponModal = ({ onClose, coupon = null }) => {
  const { createCoupon, updateCoupon, loading } = useCouponStore();

  const isEdit = !!coupon;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      code: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      minOrderAmount: 0,
      maxDiscountAmount: "",
      usageLimit: "",
      perUserLimit: 1,
      isActive: true,
      expiresAt: "",
    },
  });

  useEffect(() => {
    if (!coupon) {
      reset({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minOrderAmount: 0,
        maxDiscountAmount: "",
        usageLimit: "",
        perUserLimit: 1,
        isActive: true,
        expiresAt: "",
      });
      return;
    }

    reset({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount ?? "",
      usageLimit: coupon.usageLimit ?? "",
      perUserLimit: coupon.perUserLimit,
      isActive: coupon.isActive,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.substring(0, 10) : "",
    });
  }, [coupon, reset]);

  const watchIsActive = watch("isActive");

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      code: data.code.trim().toUpperCase(),
      discountValue: Number(data.discountValue),
      minOrderAmount: Number(data.minOrderAmount),
      perUserLimit: Number(data.perUserLimit),
      usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
      maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null,
      expiresAt: new Date(data.expiresAt).toISOString(),
    };

    const res = await sendApiRequest(() =>
      isEdit ? updateCoupon(coupon._id, payload) : createCoupon(payload)
    );

    if (!res) return;

    dismissToast();
    showSuccess(
      isEdit ? "Coupon updated successfully." : "Coupon created successfully."
    );

    reset();
    onClose();
  };

  return (
    <Modal title={isEdit ? "Edit Coupon" : "Create Coupon"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Coupon Code */}
        <div>
          <label className="mb-1 block text-sm font-medium">Coupon Code</label>
          <Input
            placeholder="SAVE10"
            className="font-mono uppercase"
            error={errors.code?.message}
            {...register("code")}
          />
        </div>

        {/* Discount Type */}
        <div>
          <label className="mb-1 block text-sm font-medium">Discount Type</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={watch("discountType") === "PERCENTAGE" ? "primary" : "outline"}
              onClick={() => setValue("discountType", "PERCENTAGE")}
            >
              Percentage (%)
            </Button>

            <Button
              type="button"
              variant={watch("discountType") === "FIXED" ? "primary" : "outline"}
              onClick={() => setValue("discountType", "FIXED")}
            >
              Fixed Amount
            </Button>
          </div>
          {errors.discountType && (
            <p className="mt-1 text-xs text-destructive">{errors.discountType.message}</p>
          )}
        </div>

        {/* Discount Values */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              {watch("discountType") === "PERCENTAGE" ? "Discount Percentage" : "Discount Amount"}
            </label>
            <Input
              type="number"
              min={0}
              error={errors.discountValue?.message}
              {...register("discountValue")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Max Discount (Optional)</label>
            <Input
              type="number"
              min={0}
              placeholder="500"
              error={errors.maxDiscountAmount?.message}
              {...register("maxDiscountAmount")}
            />
          </div>
        </div>

        {/* Usage Rules */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Minimum Order Amount</label>
            <Input
              type="number"
              min={0}
              error={errors.minOrderAmount?.message}
              {...register("minOrderAmount")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Per User Limit</label>
            <Input
              type="number"
              min={1}
              error={errors.perUserLimit?.message}
              {...register("perUserLimit")}
            />
          </div>

          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium">Usage Limit</label>
            <Input
              type="number"
              min={0}
              placeholder="Leave empty for unlimited"
              error={errors.usageLimit?.message}
              {...register("usageLimit")}
            />
          </div>
        </div>

        {/* Expiry Date + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Expiry Date</label>
            <input
              type="date"
              {...register("expiresAt")}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
            {errors.expiresAt && (
              <p className="mt-1 text-xs text-destructive">{errors.expiresAt.message}</p>
            )}
          </div>

          {/* Status Toggle */}
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <button
              type="button"
              onClick={() => setValue("isActive", !watchIsActive)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                watchIsActive ? "bg-success" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  watchIsActive ? "left-6" : "left-0.5"
                }`}
              />
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              {watchIsActive ? "Coupon is currently active." : "Coupon is currently inactive."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border pt-6">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>

          <Button type="submit" disabled={loading} className="flex-1">
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Coupon"
                : "Create Coupon"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCouponModal;