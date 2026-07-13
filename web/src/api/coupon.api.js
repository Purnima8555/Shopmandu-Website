import api from "./axios"; // adjust path to your actual api folder

/// Base path "/api/coupon" (singular) — verified against server.js, which
/// mounts couponRouters at app.use("/api/coupon", couponRouters).

/// ---- Admin CRUD ----

/// get all coupons (admin)
export const getAllCouponsApi = async () => {
  const res = await api.get("/api/coupon");
  return res.data;
};

/// get a single coupon by id (admin)
export const getCouponByIdApi = async (couponId) => {
  const res = await api.get(`/api/coupon/${couponId}`);
  return res.data;
};

/// create a new coupon (admin)
/// data: { code, discountType, discountValue, minCartValue?, expiryDate, isActive? }
export const createCouponApi = async (data) => {
  const res = await api.post("/api/coupon", data);
  return res.data;
};

/// update an existing coupon (admin)
export const updateCouponApi = async (couponId, data) => {
  const res = await api.put(`/api/coupon/${couponId}`, data);
  return res.data;
};

/// delete a coupon (admin)
export const deleteCouponApi = async (couponId) => {
  const res = await api.delete(`/api/coupon/${couponId}`);
  return res.data;
};

/// ---- Storefront ----

/// validate & apply a coupon code against the current cart/order subtotal
/// returns: { success, message, discountAmount, couponId, couponCode }
export const applyCouponApi = async (code, cartTotal) => {
  const res = await api.post("/api/coupon/apply", { code, cartTotal });
  return res.data;
};
